import NextAuth from "next-auth"
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import client from "./mongoDBClient"


// Setting up Email Verification for Authentication using "Resend"
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: MongoDBAdapter(client),
  //Note from 12/7: Find a Email Authentication Provider that works with Netlify's free domain url. Resend requires owning the domain.
})