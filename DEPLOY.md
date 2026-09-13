# 🚀 Руководство по деплою АЗСМонитор

## Быстрый старт

### 1. Локальная разработка

```bash
# Установка зависимостей
npm install

# Запуск dev-сервера
npm run dev

# Сборка для продакшена
npm run build
```

### 2. Проверка перед деплоем

```bash
# Проверка типов
npm run build

# Предпросмотр продакшен-сборки
npm run preview
```

---

## 📦 Варианты деплоя

### ✅ Vercel (Рекомендуется)

**Преимущества:**
- Бесплатный хостинг для open-source проектов
- Автоматический CI/CD
- Глобальный CDN
- SSL сертификаты из коробки

**Инструкция:**

1. **Через веб-интерфейс:**
   - Перейдите на [vercel.com](https://vercel.com)
   - Войдите через GitHub
   - Нажмите "New Project"
   - Выберите репозиторий
   - Vercel автоматически определит Vite
   - Нажмите "Deploy"

2. **Через CLI:**
```bash
# Установка Vercel CLI
npm i -g vercel

# Авторизация
vercel login

# Деплой
vercel

# Для продакшена
vercel --prod
```

3. **Настройка домена:**
```bash
vercel domains add azsmonitor.ru
```

**Переменные окружения (Settings → Environment Variables):**
```
VITE_YANDEX_API_KEY=your_key_here
VITE_API_URL=https://api.azsmonitor.ru
```

---

### ✅ Netlify

**Преимущества:**
- Простой drag-and-drop деплой
- Бесплатный SSL
- Form handling
- Functions (serverless)

**Инструкция:**

1. **Drag & Drop:**
   - Соберите проект: `npm run build`
   - Перетащите папку `dist/` на [app.netlify.com/drop](https://app.netlify.com/drop)

2. **Через Git:**
   - Подключите репозиторий на [netlify.com](https://netlify.com)
   - Build command: `npm run build`
   - Publish directory: `dist`

3. **Через CLI:**
```bash
npm i -g netlify-cli
netlify login
netlify deploy --prod --dir=dist
```

**netlify.toml:**
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"
```

---

### ✅ GitHub Pages

**Преимущества:**
- Бесплатно для public репозиториев
- Интеграция с GitHub

**Инструкция:**

1. **Установите gh-pages:**
```bash
npm install -D gh-pages
```

2. **Добавьте в package.json:**
```json
{
  "homepage": "https://yourusername.github.io/azsmonitor",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

3. **Деплой:**
```bash
npm run deploy
```

4. **Настройка GitHub:**
   - Settings → Pages
   - Source: Deploy from a branch
   - Branch: gh-pages

---

### ✅ Docker

**Dockerfile:**
```dockerfile
# Build stage
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**nginx.conf:**
```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
}
```

**docker-compose.yml:**
```yaml
version: '3.8'
services:
  azsmonitor:
    build: .
    ports:
      - "80:80"
    restart: always
```

**Запуск:**
```bash
# Сборка образа
docker build -t azsmonitor .

# Запуск контейнера
docker run -d -p 80:80 --name azsmonitor azsmonitor

# Или через docker-compose
docker-compose up -d
```

---

### ✅ VPS (Ubuntu/Debian)

**1. Подготовка сервера:**
```bash
# Обновление системы
sudo apt update && sudo apt upgrade -y

# Установка Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Установка nginx
sudo apt install -y nginx

# Установка certbot для SSL
sudo apt install -y certbot python3-certbot-nginx
```

**2. Сборка проекта:**
```bash
# На локальной машине
npm run build

# Копирование на сервер
scp -r dist/* user@your-server:/var/www/azsmonitor/
```

**3. Настройка nginx:**
```bash
sudo nano /etc/nginx/sites-available/azsmonitor
```

```nginx
server {
    listen 80;
    server_name azsmonitor.ru www.azsmonitor.ru;
    root /var/www/azsmonitor;
    index index.html;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name azsmonitor.ru www.azsmonitor.ru;
    root /var/www/azsmonitor;
    index index.html;

    # SSL certificates
    ssl_certificate /etc/letsencrypt/live/azsmonitor.ru/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/azsmonitor.ru/privkey.pem;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static files
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

```bash
# Активация сайта
sudo ln -s /etc/nginx/sites-available/azsmonitor /etc/nginx/sites-enabled/

# Проверка конфигурации
sudo nginx -t

# Перезагрузка nginx
sudo systemctl reload nginx

# Получение SSL сертификата
sudo certbot --nginx -d azsmonitor.ru -d www.azsmonitor.ru
```

**4. Автоматическое обновление:**
```bash
# Создайте скрипт deploy.sh
#!/bin/bash
cd /var/www/azsmonitor
git pull origin main
npm ci
npm run build
sudo systemctl reload nginx
```

---

### ✅ Cloudflare Pages

**Преимущества:**
- Бесплатный план с неограниченным трафиком
- Глобальный CDN
- Автоматический SSL
- Интеграция с GitHub

**Инструкция:**

1. Перейдите на [pages.cloudflare.com](https://pages.cloudflare.com)
2. Нажмите "Create a project"
3. Подключите GitHub репозиторий
4. Настройки сборки:
   - Framework preset: `Vite`
   - Build command: `npm run build`
   - Build output directory: `dist`
5. Нажмите "Save and Deploy"

---

## 🔧 CI/CD с GitHub Actions

**.github/workflows/deploy.yml:**
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build
      run: npm run build
    
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v20
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
        vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
        vercel-args: '--prod'
```

**Секреты GitHub:**
- `VERCEL_TOKEN` — токен Vercel
- `VERCEL_ORG_ID` — ID организации
- `VERCEL_PROJECT_ID` — ID проекта

---

## 📊 Мониторинг после деплоя

### Google Analytics
```html
<!-- Добавьте в index.html перед </head> -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### Yandex.Metrika
```html
<!-- Добавьте в index.html перед </head> -->
<script type="text/javascript">
  (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
  m[i].l=1*new Date();
  for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
  k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
  (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

  ym(XXXXXXXX, "init", {
    clickmap:true,
    trackLinks:true,
    accurateTrackBounce:true
  });
</script>
```

### Sentry (мониторинг ошибок)
```bash
npm install @sentry/react @sentry/tracing
```

```typescript
// В main.tsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "https://examplePublicKey@o0.ingest.sentry.io/0",
  integrations: [new Sentry.BrowserTracing()],
  tracesSampleRate: 1.0,
});
```

---

## 🔒 Безопасность

### Checklist перед продакшеном:

- [ ] HTTPS включен
- [ ] Переменные окружения настроены
- [ ] API ключи не в коде
- [ ] CORS настроен на backend
- [ ] Rate limiting включен
- [ ] Валидация входных данных
- [ ] Security headers добавлены
- [ ] Backup настроен

### Environment Variables (.env):
```env
VITE_API_URL=https://api.azsmonitor.ru
VITE_YANDEX_API_KEY=your_key_here
VITE_SENTRY_DSN=https://example@sentry.io/0
VITE_GA_ID=G-XXXXXXXXXX
```

---

## 🆘 Troubleshooting

### Проблема: Белый экран после деплоя
**Решение:** Проверьте консоль браузера на ошибки. Убедитесь, что пути к ассетам правильные.

### Проблема: 404 при обновлении страницы
**Решение:** Настройте redirect на index.html для SPA:
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

### Проблема: Медленная загрузка
**Решение:**
- Включите gzip компрессию
- Настройте кэширование статических файлов
- Используйте CDN для изображений
- Оптимизируйте размер изображений

---

## 📞 Поддержка

Если возникли вопросы по деплою:
- Email: support@azsmonitor.ru
- Telegram: @azsmonitor_support
- GitHub Issues: https://github.com/yourusername/azsmonitor/issues

---

**Удачи с деплоем! 🚀**
