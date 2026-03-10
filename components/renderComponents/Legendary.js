import Head from "../../components/dbuComponents/Form/head";
import Trait from "../../components/dbuComponents/General/trait";
import LegendaryTrait from "../dbuComponents/Form/legendaryTrait";
import AddendumBox from "../dbuComponents/General/addendumBox";

export default function LegendaryRenderPage({ content }) {
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
      <LegendaryTrait legendaryTraitList={content.legendaryTrait} />
    </div>
  );
}
