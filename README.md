# Szoniska - Portal Społecznościowy

Nowoczesny portal społecznościowy z czarno-fioletową kolorystyką, płynnymi animacjami i pełnym systemem zarządzania postami.

## 🚀 Funkcje

### Dla Użytkowników
- ✅ Logowanie przez Discord lub Google
- ✅ Przeglądanie zweryfikowanych postów na głównej stronie
- ✅ Tworzenie postów z tytułem, opisem, zdjęciami (max 10) i linkami social media
- ✅ Edycja własnych postów (tylko zatwierdzonych)
- ✅ Galeria zdjęć z nawigacją strzałkami i animacjami
- ✅ System komentarzy pod postami
- ✅ Panel użytkownika ze statystykami
- ✅ Statusy postów: Weryfikowanie / Zweryfikowany / Odrzucony

### Dla Administratorów
- ✅ Panel weryfikacji postów
- ✅ Zatwierdzanie postów (z ostrzeżeniem lub bez)
- ✅ Odrzucanie postów
- ✅ Zarządzanie użytkownikami
- ✅ Blokowanie i ograniczanie kont
- ✅ System ostrzeżeń dla użytkowników i postów

## 📋 Wymagania

- Node.js 18+ 
- MongoDB
- Konta OAuth (Discord i Google)

## ⚙️ Instalacja

### 1. Sklonuj projekt i zainstaluj zależności

```powershell
cd "c:\Users\orzec\Documents\77 orzech\Szoniska"
npm install
```

### 2. Skonfiguruj MongoDB

Możesz użyć lokalnej instalacji MongoDB lub MongoDB Atlas (cloud).

**Lokalna instalacja:**
- Pobierz i zainstaluj MongoDB z https://www.mongodb.com/try/download/community
- Uruchom MongoDB: `mongod`

**MongoDB Atlas (zalecane):**
- Zarejestruj się na https://www.mongodb.com/cloud/atlas
- Stwórz darmowy klaster
- Skopiuj connection string

### 3. Skonfiguruj OAuth

**Google OAuth:**
1. Przejdź do https://console.cloud.google.com/
2. Stwórz nowy projekt
3. Włącz Google+ API
4. Przejdź do "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Dodaj autoryzowane adresy:
   - `http://localhost:3000`
   - `http://localhost:3000/api/auth/callback/google`
6. Skopiuj Client ID i Client Secret

**Discord OAuth:**
1. Przejdź do https://discord.com/developers/applications
2. Kliknij "New Application"
3. Przejdź do zakładki "OAuth2"
4. Dodaj redirect URL: `http://localhost:3000/api/auth/callback/discord`
5. Skopiuj Client ID i Client Secret

### 4. Utwórz plik .env

Skopiuj `.env.example` do `.env` i wypełnij danymi:

```powershell
cp .env.example .env
```

Edytuj `.env`:

```env
DATABASE_URL="mongodb://localhost:27017/szoniska"
# lub MongoDB Atlas: "mongodb+srv://username:password@cluster.mongodb.net/szoniska"

NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="wygeneruj-losowy-secret"  # użyj: openssl rand -base64 32

GOOGLE_CLIENT_ID="twoj-google-client-id"
GOOGLE_CLIENT_SECRET="twoj-google-client-secret"

DISCORD_CLIENT_ID="twoj-discord-client-id"
DISCORD_CLIENT_SECRET="twoj-discord-client-secret"

# Discord ID administratorów (oddzielone przecinkami)
ADMIN_DISCORD_IDS="twoj-discord-id,inny-admin-discord-id"
```

**Jak znaleźć swoje Discord ID:**
1. Włącz tryb dewelopera w Discord (Ustawienia → Zaawansowane → Tryb dewelopera)
2. Kliknij prawym przyciskiem na swój profil → "Kopiuj ID użytkownika"

### 5. Zainicjuj bazę danych

```powershell
npx prisma generate
npx prisma db push
```

### 6. Uruchom aplikację

**Tryb deweloperski:**
```powershell
npm run dev
```

**Tryb produkcyjny:**
```powershell
npm run build
npm start
```

Aplikacja będzie dostępna pod adresem: http://localhost:3000

## 📁 Struktura projektu

```
Szoniska/
├── app/                      # Next.js 14 App Router
│   ├── api/                  # API endpoints
│   │   ├── auth/            # NextAuth endpoints
│   │   ├── posts/           # Posty i komentarze
│   │   ├── user/            # Dane użytkownika
│   │   ├── admin/           # Endpointy administratora
│   │   └── upload/          # Upload zdjęć
│   ├── profile/             # Strona profilu
│   ├── layout.tsx           # Layout aplikacji
│   ├── page.tsx             # Strona główna
│   └── globals.css          # Style globalne
├── components/              # Komponenty React
│   ├── profile/            # Komponenty profilu
│   ├── Header.tsx          # Nagłówek
│   ├── LoginModal.tsx      # Modal logowania
│   ├── PostFeed.tsx        # Lista postów
│   ├── PostCard.tsx        # Karta posta
│   ├── PostModal.tsx       # Modal szczegółów posta
│   └── CommentSection.tsx  # Sekcja komentarzy
├── prisma/
│   └── schema.prisma       # Schema bazy danych
├── public/
│   └── uploads/            # Uploadowane zdjęcia
├── lib/
│   └── prisma.ts           # Konfiguracja Prisma
└── types/
    └── next-auth.d.ts      # Typy NextAuth
```

## 🎨 Technologie

- **Framework:** Next.js 14 (App Router)
- **UI:** React 18, Tailwind CSS
- **Animacje:** Framer Motion
- **Baza danych:** MongoDB + Prisma ORM
- **Autentykacja:** NextAuth.js (Discord & Google OAuth)
- **Ikony:** React Icons
- **TypeScript:** Pełne typowanie

## 🔒 Bezpieczeństwo

- Wszystkie endpointy API są zabezpieczone autentykacją
- Rola administratora sprawdzana na podstawie Discord ID
- Walidacja uprawnień przed każdą operacją
- Zablokowane konta nie mogą tworzyć postów ani komentarzy

## 📝 Użytkowanie

### Jako użytkownik:
1. Zaloguj się przez Discord lub Google
2. Przeglądaj posty na stronie głównej
3. Kliknij post aby zobaczyć szczegóły, galerię i komentarze
4. W profilu utwórz nowy post
5. Poczekaj na weryfikację przez administratora
6. Po zatwierdzeniu możesz edytować post

### Jako administrator:
1. Zaloguj się przez Discord (z ID w ADMIN_DISCORD_IDS)
2. W profilu pojawi się zakładka "Panel"
3. W "Weryfikowanie" zatwierdzaj/odrzucaj posty
4. W "Użytkownicy" zarządzaj kontami użytkowników

## 🐛 Rozwiązywanie problemów

**Problem z połączeniem do MongoDB:**
- Sprawdź czy MongoDB jest uruchomiony
- Sprawdź DATABASE_URL w pliku .env

**OAuth nie działa:**
- Upewnij się że redirect URLs są poprawnie skonfigurowane
- Sprawdź czy Client ID i Secret są poprawne
- Zrestartuj serwer po zmianie .env

**Błędy Prisma:**
```powershell
npx prisma generate
npx prisma db push
```

## 📧 Kontakt

W razie pytań lub problemów, utwórz issue w repozytorium.

## 📄 Licencja

MIT License - użyj jak chcesz! 🚀
