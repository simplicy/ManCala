import NextAuth from "next-auth/next";
import GoogleProvider from 'next-auth/providers/google'
var nextAuth;
const options = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    // OAuth authentication providers
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
}

export default nextAuth = (req, res) => NextAuth(req, res, options)