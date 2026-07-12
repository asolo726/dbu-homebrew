import { auth } from "../../../auth";
import AuthSessionWrapper from "../../../contextProviders/AuthSessionWrapper";

export default async function SettingsLayout({ children }) {
  const session = await auth();
  return session ? (
    <AuthSessionWrapper session={session}>{children}</AuthSessionWrapper>
  ) : (
    <div className="flex flex-col items-center justify-center gap-6 p-10">
      <h1 className="text-xl text-dbu-header">You must be signed in to access Settings.</h1>
      <a className="px-6 py-3 rounded-xl bg-dbu-link text-white font-bold" href="/">
        Go Home
      </a>
    </div>
  );
}
