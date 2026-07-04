import AlternateRenderPage from "./Alternate";
import AwakeningRenderPage from "./Awakening";
import LegendaryRenderPage from "./Legendary";
import EvolvedStageRenderPage from "./EvolvedStage";
import EnhancementRenderPage from "./Enhancement";
import FactorRenderPage from "./Factor";
import RaceRenderPage from "./Race";
import CommentSection from "../comments/CommentSection";
import { auth } from "../../auth";

export default async function SinglePageGenerator({ content }) {
  const session = await auth();

  const pageRenderStyle =
    "flex flex-col flex-col-1 w-full max-w-5xl justify-center content-center";

  let pageContent;
  switch (content.head.identity) {
    case "Awakening":
      pageContent = <AwakeningRenderPage content={content} />;
      break;
    case "Alternate":
      pageContent = <AlternateRenderPage content={content} />;
      break;
    case "Legendary":
      pageContent = <LegendaryRenderPage content={content} />;
      break;
    case "Evolved Stage":
      pageContent = <EvolvedStageRenderPage content={content} />;
      break;
    case "Enhancement":
      pageContent = <EnhancementRenderPage content={content} />;
      break;
    case "Factor":
      pageContent = <FactorRenderPage content={content} />;
      break;
    case "Race":
      pageContent = <RaceRenderPage content={content} />;
      break;
    case "Temp":
      return <></>;
    default:
      return <>Something went wrong.</>;
  }

  return (
    <div className={pageRenderStyle}>
      {pageContent}
      <div className="px-4 pb-16">
        <CommentSection pageKey={content.head.keyName} session={session} />
      </div>
    </div>
  );
}
