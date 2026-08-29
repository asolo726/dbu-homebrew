import AlternateRenderPage from "./Alternate";
import AwakeningRenderPage from "./Awakening";
import LegendaryRenderPage from "./Legendary";
import EvolvedStageRenderPage from "./EvolvedStage";
import EnhancementRenderPage from "./Enhancement";
import FactorRenderPage from "./Factor";
import RaceRenderPage from "./Race";
import OtherRenderPage from "./Other";
import CommentSection from "../comments/CommentSection";
import CommunitySettings from "../dbu/General/CommunitySettings";
import { auth } from "../../auth";
import { getIsAdmin } from "../../lib/getIsAdmin";
import { normalizePageContent } from "../../lib/normalizePageContent";

export default async function SinglePageGenerator({ content }) {
  const session = await auth();
  const isAdmin = await getIsAdmin(session?.user?.email);
  const normalizedContent = normalizePageContent(content);

  const pageRenderStyle =
    "flex flex-col flex-col-1 w-full max-w-5xl justify-center content-center";

  let pageContent;
  switch (normalizedContent.data.identity) {
    case "Awakening":
      pageContent = <AwakeningRenderPage content={normalizedContent} />;
      break;
    case "Alternate":
      pageContent = <AlternateRenderPage content={normalizedContent} />;
      break;
    case "Legendary":
      pageContent = <LegendaryRenderPage content={normalizedContent} />;
      break;
    case "Evolved Stage":
      pageContent = <EvolvedStageRenderPage content={normalizedContent} />;
      break;
    case "Enhancement":
      pageContent = <EnhancementRenderPage content={normalizedContent} />;
      break;
    case "Factor":
      pageContent = <FactorRenderPage content={normalizedContent} />;
      break;
    case "Race":
      pageContent = <RaceRenderPage content={normalizedContent} />;
      break;
    case "Other":
      pageContent = <OtherRenderPage content={normalizedContent} />;
      break;
    case "Temp":
      return <></>;
    default:
      return <>Something went wrong.</>;
  }

  return (
    <div className={pageRenderStyle}>
      {pageContent}
      <div className="px-4 pb-4">
        <CommunitySettings
          keyName={normalizedContent.data.keyName}
          isCommunity={normalizedContent.head.isCommunity ?? false}
        />
      </div>
      <div className="px-4 pb-16">
        <CommentSection
          pageKey={normalizedContent.data.keyName}
          session={session}
          pageAuthor={normalizedContent.data.author}
          viewerIsAdmin={isAdmin}
        />
      </div>
    </div>
  );
}
