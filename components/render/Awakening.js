import Head from "../dbu/general/head";
import TraitsSection from "../dbu/general/TraitsSection";
import GrandAwakening from "../dbu/Transformations/grandAwakening";

export default function AwakeningRenderPage({ content }) {
  return (
    <div className="flex flex-col flex-col-1 w-full max-w-5xl mx-auto px-10 py-10 md:px-25 sm:m-10 justify-center content-center text-wrap bg-dbu-bg3 sm:rounded-[4em]">
      <Head Form={content} />
      <TraitsSection traits={content.traits} basePath="traits" />
      {content.head.details.awakeningType === "Super" ? (
        <GrandAwakening
          title={content.grandAwakening.title}
          desc={content.grandAwakening.desc}
          ability={content.grandAwakening.abilities}
        />
      ) : (
        " "
      )}
    </div>
  );
}
