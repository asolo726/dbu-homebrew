import { auth } from "../../../auth";
import AuthSessionWrapper from "../../../contextProviders/AuthSessionWrapper";
export default async function CreateLayout({ children }) {
    const session = await auth();
    return session ? (
        <AuthSessionWrapper session={session}>{children}</AuthSessionWrapper>
    ) : (
        <div className="flex flex-col justify-center">
            <h1>
                Hmmm, looks like you don't have access to this site. Let's get
                you back home
            </h1>
            <button className="mt-10">
                <a
                    className="p-5 rounded-xl bg-dbu-link text-white font-bold "
                    href="/"
                >
                    Home
                </a>
            </button>
        </div>
    );
}
/**
 * Takeaway notes cause I spent 2.5 hours on this.
 * 1. Page and Root Layouts can be ServerComponents if neccessary
 * 2. The correct way to pass server information from server components to client components as context (So you dont have to drill them.):
 *    A. Inside the Server component. Do the server work. Then use a middle layer Wrapper and pass in the information as props.
 *    B. Inside the Wrapper, import the Context Provider and pass in the server information to the "value" Prop. Nest Children inside.
 *     Now anything inside the Wrapper has access to the information via a UseContext call.
 *
 * The Flow is this: ServerComponent -> Wrapper -> ClientComponent
 *
 * See these files for an example of this:
 *    1. AuthSessionContext
 *    2. AuthSessionWrapper
 *    3. Create/Layout.js (That's this file :D )
 *
 * */
