import NextAuth from "next-auth";
// import { MongoDBAdapter } from "@auth/mongodb-adapter"
// import client from "./lib/mongoDBClient"
import Okta from "next-auth/providers/okta";

let nextAuthBody = async () => {
    return {
        providers: [
            Okta({
                clientId: process.env.OKTA_CLIENT_ID,
                clientSecret: process.env.OKTA_CLIENT_SECRET,
                issuer: process.env.OKTA_DOMAIN,
            }),
        ],
    };
};
export const { handlers, auth, signIn, signOut } = NextAuth(nextAuthBody);
