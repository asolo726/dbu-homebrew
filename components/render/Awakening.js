import Head from "../dbu/General/head";
import Trait from "../../components/dbu/General/trait";
import GrandAwakening from "../dbu/Transformations/grandAwakening";
import AddendumBox from "../dbu/General/addendumBox";

export default function AwakeningRenderPage({ content }) {
  return (
    <div className="flex flex-col flex-col-1 max-w-5xl px-10 py-10 md:px-25 sm:m-10 justify-center content-center text-wrap bg-dbu-bg3 sm:rounded-[4em]">
      <Head Form={content} />
      {content.traits.map((trait, index) => {
        return (
          <Trait
            key={index}
            title={trait.title}
            desc={trait.desc}
            abilities={trait.abilities}
          />
        );
      })}
      {content.head.awakeningType === "Super" ? (
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
