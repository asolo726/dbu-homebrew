import AlternateRenderPage from "./Alternate";
import AwakeningRenderPage from "./Awakening";
import LegendaryRenderPage from "./Legendary";
import EvolvedStageRenderPage from "./EvolvedStage";
import EnhancementRenderPage from "./Enhancement";

/**
 * Handles generating one page from the [slug] page request. Decides which render method to use depending on the transformationType received.
 * @returns
 */

export default function SinglePageGenerator({ content }) {
  switch (content.head.identity) {
    case "Awakening":
      return (
        <div>
          <AwakeningRenderPage content={content} />
        </div>
      );
    case "Alternate":
      return (
        <div>
          <AlternateRenderPage content={content} />
        </div>
      );
    case "Legendary":
      return (
        <div>
          <LegendaryRenderPage content={content} />
        </div>
      );
    case "Evolved Stage":
      return (
        <div>
          <EvolvedStageRenderPage content={content} />
        </div>
      );
    case "Enhancement":
      return (
        <div>
          <EnhancementRenderPage content={content} />
        </div>
      );
    case "Temp":
      return <></>;
    default:
      return <>Something went wrong.</>;
      break;
  }
}
