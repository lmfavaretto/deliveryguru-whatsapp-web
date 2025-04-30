# Use uma imagem leve de Node
FROM node:20-slim

# Instala o Chromium e bibliotecas necessárias
RUN apt-get update && apt-get install -y \
    chromium \
    libnss3 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libgtk-3-0 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    libgbm1 && \
  rm -rf /var/lib/apt/lists/*

# Defina onde o Puppeteer vai achar o Chrome
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

WORKDIR /app

# Copia package.json e instala só as deps
COPY package.json package-lock.json* ./
RUN npm install --production

# Copia o código da função
COPY whatsapp-web.js ./

# Expõe a porta que o Render vai mapear
EXPOSE 3000

# Inicia o servidor de QR
CMD ["npm", "start"]
