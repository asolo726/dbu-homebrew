import Head from "../dbu/General/head";
import TraitsSection from "../dbu/General/TraitsSection";
import LegendaryTrait from "../dbu/Transformations/legendaryTrait";
import MasteryTrait from "../dbu/Transformations/masteryTrait";

export default function LegendaryRenderPage({ content }) {
  return (
    <div className="flex flex-col flex-col-1 w-full max-w-5xl mx-auto px-10 py-10 md:px-25 sm:m-10 justify-center content-center text-wrap bg-dbu-bg3 sm:rounded-[4em]">
      <Head Form={content} />
      <TraitsSection traits={content.traits} basePath="traits" />
      {content.masteryTrait && content.masteryTrait.length > 0 ? (
        <MasteryTrait masteryTraitList={content.masteryTrait} path="masteryTrait" />
      ) : (
        <></>
      )}
      <LegendaryTrait legendaryTraitList={content.legendaryTrait} path="legendaryTrait" />
    </div>
  );
}
