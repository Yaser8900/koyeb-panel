const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  const host = req.headers['host'] || 'your-app.koyeb.app';
  res.send(`
    <!DOCTYPE html>
    <html lang="fa" dir="rtl">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>پنل هوشمند - اتصال خودکار NiREvil</title>
        <style>
            :root { bg-main: #0f172a; card-bg: #1e293b; text-main: #f8fafc; accent: #38bdf8; success: #34d399; }
            body { font-family: Tahoma, sans-serif; background: #0f172a; color: #f8fafc; margin: 0; padding: 20px; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
            .card { background: #1e293b; padding: 25px; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); width: 100%; max-width: 600px; border: 1px solid #334155; }
            h1 { color: #38bdf8; font-size: 18px; margin-bottom: 5px; text-align: center; }
            .badge { display: block; text-align: center; background: #065f46; color: #34d399; padding: 6px; border-radius: 8px; font-size: 12px; margin-bottom: 15px; font-weight: bold; }
            .section { margin-top: 15px; padding-top: 12px; border-top: 1px solid #334155; }
            label { font-size: 12px; color: #94a3b8; display: block; margin-bottom: 5px; }
            input, select { width: 100%; padding: 9px; border-radius: 8px; background: #0f172a; border: 1px solid #475569; color: #fff; font-size: 13px; box-sizing: border-box; margin-bottom: 10px; direction: ltr; text-align: left; }
            input[type="text"], select { direction: rtl; text-align: right; }
            button { background: #0284c7; color: white; border: none; padding: 10px; border-radius: 8px; cursor: pointer; width: 100%; font-weight: bold; font-family: Tahoma; transition: 0.2s; font-size: 14px; }
            button:hover { background: #0369a1; }
            .config-box { background: #0f172a; padding: 12px; border-radius: 8px; border: 1px solid #334155; word-break: break-all; font-family: monospace; font-size: 11px; color: #34d399; margin-top: 10px; text-align: left; direction: ltr; max-height: 90px; overflow-y: auto; }
            .copy-btn { background: #059669; margin-top: 8px; font-size: 12px; padding: 6px; }
            .copy-btn:hover { background: #047857; }
            .loader { text-align: center; color: #38bdf8; font-size: 13px; margin-top: 10px; display: none; }
        </style>
    </head>
    <body>
        <div class="card">
            <h1>پنل هوشمند (Koyeb + NiREvil CleanIP)</h1>
            <span class="badge">انتخاب خودکار آیپی تمیز و بدون تحریم جمنای</span>

            <div class="section">
                <label>دامنه یا هاست پنل شما در Koyeb:</label>
                <input type="text" id="domainInput" value="${host}" />

                <label>انتخاب لوکیشن بهینه (سرورهای اصلی اروپا):</label>
                <select id="locationSelect">
                    <option value="de.cloudflare.com">آلمان (Germany - بدون تحریم گوگل)</option>
                    <option value="nl.cloudflare.com">هلند (Netherlands - بدون تحریم گوگل)</option>
                </select>

                <button onclick="generateAutoConfig()">تولید خودکار با آیپی تمیز مخزن</button>
                <div class="loader" id="loaderText">در حال دریافت آیپی تمیز از مخزن...</div>
            </div>

            <div class="section" id="resultSection" style="display:none;">
                <label>لینک کانفیگ نهایی (آماده برای اتصال):</label>
                <div class="config-box" id="outputConfig"></div>
                <button class="copy-btn" onclick="copyConfig()">کپی کردن کانفیگ</button>
            </div>
        </div>

        <script>
            async function generateAutoConfig() {
                const domain = document.getElementById('domainInput').value;
                const loc = document.getElementById('locationSelect').value;
                const loader = document.getElementById('loaderText');
                const resultSection = document.getElementById('resultSection');
                
                loader.style.display = 'block';
                resultSection.style.display = 'none';

                let cleanIp = "104.16.132.228"; // آیپی پیش‌فرض پشتیبان

                try {
                    const response = await fetch('https://raw.githubusercontent.com/NiREvil/vless/main/sub/Cf-ipv4.json');
                    if (response.ok) {
                        const ips = await response.json();
                        if (Array.isArray(ips) && ips.length > 0) {
                            cleanIp = ips[Math.floor(Math.random() * ips.length)];
                        }
                    }
                } catch (e) {
                    console.log('Using fallback IP due to network error');
                }

                loader.style.display = 'none';

                const uuid = "a1b2c3d4-e5f6-7890-abcd-ef0123456789";
                const config = \`vless://\${uuid}@\${cleanIp}:443?encryption=none&security=tls&type=ws&host=\${domain}&path=%2F#Auto-NiREvil-\${loc.split('.')[0].toUpperCase()}\`;
                
                document.getElementById('outputConfig').innerText = config;
                resultSection.style.display = 'block';
            }

            function copyConfig() {
                const text = document.getElementById('outputConfig').innerText;
                navigator.clipboard.writeText(text);
                alert('کانفیگ با موفقیت کپی شد!');
            }
        </script>
    </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
