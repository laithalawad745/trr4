// lib/auth.ts
import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/lib/db';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    session: async ({ session, token }) => {
      if (session?.user && token?.sub) {
        // إضافة معرف المستخدم إلى الجلسة
        session.user.id = token.sub;
        
        // جلب بيانات إضافية من قاعدة البيانات
        const dbUser = await prisma.user.findUnique({
          where: { id: token.sub },
          select: {
            id: true,
            username: true,
            points: true,
          },
        });
        
        if (dbUser) {
          session.user.username = dbUser.username;
          session.user.points = dbUser.points;
        }
      }
      return session;
    },
    jwt: async ({ user, token }) => {
      if (user) {
        token.uid = user.id;
      }
      return token;
    },
  },
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth/signin',
    signUp: '/auth/signup',
  },
  events: {
    async createUser({ user }) {
      // عند إنشاء مستخدم جديد، إنشاء username فريد
      if (user.email) {
        const baseUsername = user.email.split('@')[0];
        let username = baseUsername;
        let counter = 1;
        
        // التأكد من أن username فريد
        while (await prisma.user.findUnique({ where: { username } })) {
          username = `${baseUsername}${counter}`;
          counter++;
        }
        
        // تحديث المستخدم بـ username
        await prisma.user.update({
          where: { id: user.id },
          data: { username },
        });
      }
    },
  },
};