import NextAuth from "next-auth"
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import client from "./lib/mongoDBClient"
import Okta from "next-auth/providers/okta"

let nextAuthBody = {};

if (process.env.NODE_ENV === "development") {
  nextAuthBody = {
    adapter: MongoDBAdapter(client),
    providers: [Okta({
      clientId: process.env.OKTA_CLIENT_ID,
      clientSecret: process.env.OKTA_CLIENT_SECRET,
      issuer: process.env.OKTA_DOMAIN
    })],
  }
} 
else {
  nextAuthBody = {
    providers: [Okta({
      clientId: process.env.OKTA_CLIENT_ID,
      clientSecret: process.env.OKTA_CLIENT_SECRET,
      issuer: process.env.OKTA_DOMAIN
    })],
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth(
  nextAuthBody
  // {
  // adapter: MongoDBAdapter(client),
  // providers: [Okta({
  //   clientId: process.env.OKTA_CLIENT_ID,
  //   clientSecret: process.env.OKTA_CLIENT_SECRET,
  //   issuer: process.env.OKTA_DOMAIN
  // })],
  // }
)
