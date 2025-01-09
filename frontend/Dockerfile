# Base image olarak Node.js kullanıyoruz
FROM node:16-alpine

# Çalışma dizinini ayarlıyoruz
WORKDIR /app

# package.json ve package-lock.json dosyalarını kopyalıyoruz
COPY package*.json ./

# Bağımlılıkları yüklüyoruz
RUN npm install --production

# Uygulama kodunu kopyalıyoruz
COPY . .

# Uygulamanın çalışacağı portu belirtiyoruz
EXPOSE 3000

# Uygulamayı başlatıyoruz
CMD ["npm", "start"]
