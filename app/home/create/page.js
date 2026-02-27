import Create from "../../../components/creationComponents/Create";
import { auth } from "../../../auth";
import AuthSessionWrapper from "../../../contextProviders/AuthSessionWrapper";
/**
 * Root of the creation forum
 * @returns
*/


export default async function Create_Page() {
    const session = await auth();
    return (
        <AuthSessionWrapper session={session}>
            <Create />
        </AuthSessionWrapper>
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
 *    3. Create/Page.js (That's this file :D ) 
 * 
 * */ 