import getProgress from "../../app/api/getProgress/route";
import ProgressBoard from "./ProgressBoard";

export default async function ProgressDataServer() {
  const progressData = await getProgress();
  return <ProgressBoard progressData={progressData} />;
}
