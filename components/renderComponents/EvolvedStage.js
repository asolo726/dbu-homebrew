import Head from "../../components/dbuComponents/Form/head";
import Trait from "../../components/dbuComponents/General/trait";
import MasteryTrait from "../dbuComponents/Form/masteryTrait";
import LegendaryTrait from "../dbuComponents/Form/legendaryTrait";

export default function EvolvedStageRenderPage({ content }) {
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
           {content.legendaryTrait ? <LegendaryTrait legendaryTraitList={content.legendaryTrait} /> : <></>}
           {content.masteryTrait ? <MasteryTrait masteryTraitList={content.masteryTrait} /> : <></>}
        </div>
    );
}
