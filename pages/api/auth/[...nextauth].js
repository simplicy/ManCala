import NextAuth from "next-auth/next";
import GoogleProvider from 'next-auth/providers/google'

const options = {
  secret: process.env.SECRET,
  providers: [
    // OAuth authentication providers
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
}

export default (req, res) => NextAuth(req, res, options)