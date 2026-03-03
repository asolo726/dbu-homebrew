import { auth } from "../../auth";
import Create from "./Create";
export default async function createServer() {

    const session = await auth();
    return (<></>);
}
