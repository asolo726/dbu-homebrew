import getProgress from "../app/api/getProgress/route";
import { ProgressBar } from "./Misc/ProgressBar";

export default async function ProgressData() {
  const progressSession = await getProgress();
  return <ProgressBar progressSession={progressSession} />;
}
