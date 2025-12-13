import NextAuth from "next-auth"
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import client from "./lib/mongoDBClient"
import {Mailgun} from "next-auth/providers/mailgun"


// Setting up Email Verification for Authentication using SendGrid
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: MongoDBAdapter(client),
  providers: [Mailgun({
    apiKey: process.env.AUTH_MAILGUN_KEY,
  })]
})