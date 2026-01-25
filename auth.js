import { MongoDBAdapter } from "@auth/mongodb-adapter";
import NextAuth from "next-auth";
import client from "./lib/mongoDBClient"
import Okta from "next-auth/providers/okta";

let nextAuthBody = async () => {
  if (process.env.NEXTAUTH_ENABLED === "false") {
    return {
      providers: [],
    };
  }

  return {
    adapter: MongoDBAdapter(client),
    providers: [
      Okta({
        clientId: process.env.AUTH0_CLIENT_ID,
        clientSecret: process.env.AUTH0_CLIENT_SECRET,
        issuer: process.env.AUTH0_DOMAIN,
      }),
    ],
  };
};
export const { handlers, auth, signIn, signOut } = NextAuth(nextAuthBody);
export const authOptions = {
  pages: {
    signIn: "/login",
  },
};

