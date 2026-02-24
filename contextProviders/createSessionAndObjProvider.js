import {auth} from "../auth"
export default async  function createSessionAndObjProvider() {
    // Login Session Information
    const session = await auth();
    
    return { session, obj }
}