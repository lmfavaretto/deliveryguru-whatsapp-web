import express from 'express';
import chromium from 'chrome-aws-lambda';

const app = express();

app.get('/qr', async (req, res) => {
  let browser;
  try {
    browser = await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
    });
    const page = await browser.newPage();
    await page.goto('https://web.whatsapp.com', { waitUntil: 'networkidle2' });
    const qrCanvas = await page.waitForSelector('canvas');
    const qrDataUrl = await page.evaluate(c => c.toDataURL(), qrCanvas);
    res.json({ qr: qrDataUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Falha ao gerar QR' });
  } finally {
    if (browser) await browser.close();
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Servidor QR rodando na porta ${port}`));
