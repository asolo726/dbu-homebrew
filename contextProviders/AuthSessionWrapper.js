'use client'
import { AuthSessionContext } from "../contextProviders/AuthSessionContext";

export default function AuthSessionWrapper({ session, children }) {
    return (
        <AuthSessionContext value={session}>
            {children}
        </AuthSessionContext>
    );
}