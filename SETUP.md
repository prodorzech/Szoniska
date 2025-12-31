# Szoniska - Konfiguracja

## Szybki start

### 1. Zainstaluj zależności
npm install

### 2. Skonfiguruj .env
Skopiuj .env.example do .env i uzupełnij:
- DATABASE_URL - connection string do MongoDB
- NEXTAUTH_SECRET - wygeneruj: openssl rand -base64 32
- GOOGLE_CLIENT_ID i GOOGLE_CLIENT_SECRET - z Google Cloud Console
- DISCORD_CLIENT_ID i DISCORD_CLIENT_SECRET - z Discord Developer Portal
- ADMIN_DISCORD_IDS - Discord ID administratorów (oddzielone przecinkami)

### 3. Zainicjuj bazę danych
npx prisma generate
npx prisma db push

### 4. Uruchom aplikację
npm run dev

## Jak uzyskać OAuth credentials

### Google OAuth:
1. https://console.cloud.google.com/
2. Nowy projekt
3. APIs & Services → Credentials → Create OAuth 2.0 Client ID
4. Authorized redirect URIs: https://szoniska.pl/api/auth/callback/google

### Discord OAuth:
1. https://discord.com/developers/applications
2. New Application
3. OAuth2 → Add Redirect: https://szoniska.pl/api/auth/callback/discord
4. W Settings → Bot możesz dodać bota (opcjonalnie)

### Znajdowanie Discord ID:
1. Discord → Ustawienia → Zaawansowane → Tryb dewelopera (włącz)
2. Prawy przycisk na swoim profilu → Kopiuj ID użytkownika

## Testowanie

### Jako użytkownik:
1. Zaloguj się (Discord/Google)
2. Idź do Profil → Posty → Utwórz post
3. Wypełnij formularz (tytuł, opis, zdjęcia, social media)
4. Wyślij (status: Weryfikowanie)

### Jako administrator:
1. Dodaj swoje Discord ID do ADMIN_DISCORD_IDS w .env
2. Zrestartuj serwer
3. Zaloguj się przez Discord
4. W profilu pojawi się zakładka "Panel"
5. Zatwierdź/odrzuć posty w "Weryfikowanie"
6. Zarządzaj użytkownikami w "Użytkownicy"

## Produkcja

### MongoDB Atlas (zalecane dla produkcji):
1. https://www.mongodb.com/cloud/atlas
2. Stwórz klaster (Free tier dostępny)
3. Database Access → Add user
4. Network Access → Add IP (0.0.0.0/0 dla testów)
5. Skopiuj connection string do DATABASE_URL

### Deploy (Vercel):
1. Push kod do GitHub
2. https://vercel.com → New Project
3. Import repozytorium
4. Environment Variables → dodaj wszystkie z .env
5. Deploy

Pamiętaj:
- Zaktualizuj NEXTAUTH_URL na domenę produkcyjną
- Dodaj domenę produkcyjną do OAuth redirect URLs
- Użyj silnego NEXTAUTH_SECRET
