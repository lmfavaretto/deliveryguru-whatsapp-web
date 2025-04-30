import express from 'express';
import cors from 'cors';
import puppeteer from 'puppeteer-core';

const app = express();
app.use(cors());

// Caminho para o Chromium que vamos instalar via apt no Docker
const CHROME_PATH = process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium';

app.get('/qr', async (req, res) => {
  let browser;
  try {
    browser = await puppeteer.launch({
      executablePath: CHROME_PATH,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      headless: true,
    });

    const page = await browser.newPage();
    await page.goto('https://web.whatsapp.com', { waitUntil: 'networkidle2' });
    const qrCanvas = await page.waitForSelector('canvas');
    const qrDataUrl = await page.evaluate(el => el.toDataURL(), qrCanvas);
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
