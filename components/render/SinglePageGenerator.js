import AlternateRenderPage from "./Alternate";
import AwakeningRenderPage from "./Awakening";
import LegendaryRenderPage from "./Legendary";
import EvolvedStageRenderPage from "./EvolvedStage";
import EnhancementRenderPage from "./Enhancement";
import FactorRenderPage from "./Factor";
import RaceRenderPage from "./Race";

/**
 * Handles generating one page from the [slug] page request. Decides which render method to use depending on the transformationType received.
 * @returns
 */

export default function SinglePageGenerator({ content }) {
  const pageRenderStyle = "flex flex-col flex-col-1 w-full max-w-5xl justify-center content-center";
  switch (content.head.identity) {
    case "Awakening":
      return (
        <div className={pageRenderStyle}>
          <AwakeningRenderPage content={content} />
        </div>
      );
    case "Alternate":
      return (
        <div className={pageRenderStyle}>
          <AlternateRenderPage content={content} />
        </div>
      );
    case "Legendary":
      return (
        <div className={pageRenderStyle}>
          <LegendaryRenderPage content={content} />
        </div>
      );
    case "Evolved Stage":
      return (
        <div className={pageRenderStyle}>
          <EvolvedStageRenderPage content={content} />
        </div>
      );
    case "Enhancement":
      return (
        <div className={pageRenderStyle}>
          <EnhancementRenderPage content={content} />
        </div>
      );
    case "Factor":
      return (
        <div className={pageRenderStyle}>
          <FactorRenderPage content={content} />
        </div>
      );
    case "Race":
      return (
        <div className={pageRenderStyle}>
          <RaceRenderPage content={content} />
        </div>
      );
    case "Temp":
      return <></>;
    default:
      return <>Something went wrong.</>;
      break;
  }
}
