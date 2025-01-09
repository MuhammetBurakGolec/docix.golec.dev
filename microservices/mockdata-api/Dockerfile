# Base image olarak Python'un en son sürümünü kullan
FROM python:3.9-slim

# Çalışma dizinini oluştur ve ayarla
WORKDIR /app

# Gereken dosyaları konteynere kopyala
COPY . .

# Gerekli bağımlılıkları yükle
RUN pip install --no-cache-dir -r requirements.txt

# Flask uygulamasının dışa açtığı portu belirtir
EXPOSE 5002

# Flask uygulamasını çalıştır
CMD ["python", "app.py"]