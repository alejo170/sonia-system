import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { sql } from '@vercel/postgres';
import type { User } from '@/app/lib/definitions';
import bcrypt from 'bcrypt';
import { DefaultSession } from 'next-auth';
import { DefaultJWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name: string;
      lastname: string;
      email: string;
      role: string;
    } & DefaultSession;
  }

  interface User {
    lastname: string;
    role: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    id: string;
    lastname: string;
    email: string;
    emailVerified: Date;
    role: string;
    expires: string;
  }
}

async function getUser(email: string): Promise<User | undefined> {
  try {
    const user = await sql<User>`SELECT * FROM users WHERE email=${email}`;
    return user.rows[0];
  } catch (error) {
    console.error('No se pudo recuperar el usuario:', error);
    throw new Error('No se pudo recuperar el usuario.');
  }
}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);

          if (!user) {
            return null;
          }
          const passwordsMatch = await bcrypt.compare(password, user.password);

          if (passwordsMatch) {
            return user;
          }
        }
        console.log('Credenciales no validas');
        return null;
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        (token.sub = user.id),
          (token.name = user.name),
          (token.lastname = user.lastname),
          (token.role = user.role);
      }
      return token;
    },

    async session({ session, token }) {
      session.user = {
        id: token.sub ?? '',
        name: token.name ?? '',
        lastname: token.lastname,
        email: token.email,
        emailVerified: token.emailVerified,
        role: token.role,
        expires: token.expires,
      };
      return session;
    },
  },
});
