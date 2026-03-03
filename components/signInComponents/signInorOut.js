import { signIn } from "next-auth/react";
import { signOut } from "next-auth/react";

//Sign In Form Component
export default function SignIn({ session }) {
  const textStyle =
    "p-1 mx-4 hover:text-dbu-link hover:text-bold cursor-pointer ";

  if (session) {
    return (
      <div className="flex flex-col justify-center gap-2">
        <button
          className={textStyle}
          type="submit"
          onClick={() => signOut("okta")}
        >
          Sign Out
        </button>
      </div>
    );
  } else {
    return (
      <div className="flex flex-col justify-center gap-2">
        <button
          className={textStyle}
          type="submit"
          onClick={() => signIn("okta")}
        >
          Sign In
        </button>
      </div>
    );
  }
}
