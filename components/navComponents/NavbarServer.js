import { auth } from "../../auth";
import Navbar from "./Navbar";
import newUserCheck from "./newUserCheck";

export default async function NavbarServer() {
  const session = await auth();

  // if (session) await newUserCheck(session);

  return <Navbar session={session} />;
}
