import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import DiscordProvider from 'next-auth/providers/discord';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import speakeasy from 'speakeasy';
import { prisma } from '@/lib/prisma';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Hasło", type: "password" },
        twoFactorCode: { label: "2FA Code", type: "text" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email i hasło są wymagane');
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          throw new Error('Nieprawidłowy email lub hasło');
        }

        if (!user.emailVerified) {
          throw new Error('Email nie został zweryfikowany. Sprawdź swoją skrzynkę.');
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

        if (!isPasswordValid) {
          throw new Error('Nieprawidłowy email lub hasło');
        }

        if (user.isBlocked) {
          throw new Error('Twoje konto zostało zablokowane');
        }

        // Sprawdź czy użytkownik ma włączoną 2FA
        if (user.twoFactorEnabled && user.twoFactorSecret) {
          if (!credentials.twoFactorCode) {
            throw new Error('2FA_REQUIRED'); // Specjalny błąd dla frontendu
          }

          // Weryfikuj kod 2FA
          const verified = speakeasy.totp.verify({
            secret: user.twoFactorSecret,
            encoding: 'base32',
            token: credentials.twoFactorCode,
            window: 2,
          });

          if (!verified) {
            throw new Error('Nieprawidłowy kod 2FA');
          }
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!account) return false;

      try {
        if (account.provider === 'discord') {
          const discordProfile = profile as any;
          const discordId = account.providerAccountId;

          // Szukaj użytkownika po Discord ID
          let dbUser = await prisma.user.findFirst({
            where: { discordId },
          });

          if (dbUser) {
            // Zaktualizuj istniejącego użytkownika
            await prisma.user.update({
              where: { id: dbUser.id },
              data: {
                name: discordProfile.username || discordProfile.global_name,
                image: discordProfile.avatar
                  ? `https://cdn.discordapp.com/avatars/${discordId}/${discordProfile.avatar}.png`
                  : null,
                discordUsername: discordProfile.username,
              },
            });
          } else {
            // Utwórz nowego użytkownika
            dbUser = await prisma.user.create({
              data: {
                discordId,
                discordUsername: discordProfile.username,
                name: discordProfile.username || discordProfile.global_name,
                email: discordProfile.email || null,
                image: discordProfile.avatar
                  ? `https://cdn.discordapp.com/avatars/${discordId}/${discordProfile.avatar}.png`
                  : null,
              },
            });
          }

          // Zapisz ID użytkownika w user object
          user.id = dbUser.id;
        }

        if (account.provider === 'google') {
          const googleId = account.providerAccountId;
          const googleProfile = profile as any;

          // Szukaj użytkownika po Google ID
          let dbUser = await prisma.user.findFirst({
            where: { googleId },
          });

          if (dbUser) {
            // Zaktualizuj
            await prisma.user.update({
              where: { id: dbUser.id },
              data: {
                name: googleProfile.name,
                email: googleProfile.email,
                image: googleProfile.picture,
              },
            });
          } else {
            // Utwórz nowego
            dbUser = await prisma.user.create({
              data: {
                googleId,
                name: googleProfile.name,
                email: googleProfile.email,
                image: googleProfile.picture,
              },
            });
          }

          user.id = dbUser.id;
        }

        return true;
      } catch (error) {
        console.error('Sign in error:', error);
        return false;
      }
    },
    async jwt({ token, user, account }) {
      // Przy pierwszym logowaniu zapisz ID użytkownika
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;

        // Pobierz użytkownika z bazy aby sprawdzić czy jest adminem
        const user = await prisma.user.findUnique({
          where: { id: token.sub },
        });

        if (user) {
          const adminIds = process.env.ADMIN_DISCORD_IDS?.split(',') || [];
          session.user.isAdmin = user.discordId ? adminIds.includes(user.discordId) : false;
        }
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Jeśli URL zawiera callbackUrl=/auth/callback, przekieruj tam
      if (url.includes('callbackUrl=%2Fauth%2Fcallback') || url.includes('callbackUrl=/auth/callback')) {
        return `${baseUrl}/auth/callback`;
      }
      // Jeśli to URL z parametrem callbackUrl, użyj go
      if (url.includes('callbackUrl=')) {
        const urlObj = new URL(url, baseUrl);
        const callbackUrl = urlObj.searchParams.get('callbackUrl');
        if (callbackUrl) {
          return `${baseUrl}${callbackUrl}`;
        }
      }
      // Jeśli URL jest relative i zaczyna się od /auth/callback
      if (url.startsWith('/auth/callback')) {
        return `${baseUrl}/auth/callback`;
      }
      // Jeśli URL zaczyna się od baseUrl
      if (url.startsWith(baseUrl)) {
        return url;
      }
      // Dla innych przypadków - po zalogowaniu idź przez loading
      if (url === baseUrl || url === `${baseUrl}/`) {
        return `${baseUrl}/auth/callback`;
      }
      // Domyślnie
      return baseUrl;
    },
  },
  pages: {
    signIn: '/',
  },
  session: {
    strategy: 'jwt',
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
