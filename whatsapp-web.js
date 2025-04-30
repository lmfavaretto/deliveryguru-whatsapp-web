import express from 'express';
import cors from 'cors';
import puppeteer from 'puppeteer';

const app = express();
app.use(cors());

app.get('/qr', async (req, res) => {
  let browser;
  try {
    // Inicia o Chromium que vem com o Puppeteer
    browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      headless: true,
    });

    const page = await browser.newPage();
    await page.goto('https://web.whatsapp.com', { waitUntil: 'networkidle2' });

    // Captura o QR
    const qrCanvas = await page.waitForSelector('canvas');
    const qrDataUrl = await page.evaluate(c => c.toDataURL(), qrCanvas);

    res.json({ qr: qrDataUrl });
  } catch (error) {
    console.error('Erro ao gerar QR:', error);
    res.status(500).json({ error: 'Falha ao gerar QR' });
  } finally {
    if (browser) await browser.close();
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Servidor QR rodando na porta ${port}`));
