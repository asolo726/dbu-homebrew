import Create from "../../../components/creationComponents/Create";
import { auth } from "../../../auth";
import AuthSessionWrapper from "../../../contextProviders/AuthSessionWrapper";
/**
 * Root of the creation forum
 * @returns
 */

export default async function Create_Page() {
  return <Create />;
}
