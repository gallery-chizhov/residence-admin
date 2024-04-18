import type {AuthOptions} from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import {baseUrl} from "@/lib/constants";

export const authConfig: AuthOptions = {
  pages: {
    signIn: '/auth/sign-in',
    error: '/api'
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: {label: 'username'},
        password: {label: 'password'},
      },
       async authorize(credentials) {
        try {
          const res = await fetch(`${baseUrl}login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: credentials?.username,
              password: credentials?.password
            }),
          })
          const user = await res.json();
          if (user.token) {
            // Any object returned will be saved in `user` property of the JWT
            return user;
          } else {
            // If you return null then an error will be displayed advising the user to check their details.
            return null;
          }
        } catch (e) {
          console.log(e)
        }
      },
    }),
  ],
  callbacks: {
    async jwt({token, user}) {
      return {...token, ...user}
    },
    async session({session, token, user}) {
      session.user = token as any;
      return session;
    }
  }
}
