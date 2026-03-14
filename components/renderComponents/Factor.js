import Head from "../dbuComponents/General/head";
import Trait from "../../components/dbuComponents/General/trait";

export default function FactorRenderPage({ content }) {
    const hasMultipleFactorTraits = content.traits.length > 1;
      return (
        <div className="flex flex-col flex-col-1 max-w-5xl px-10 py-10 md:px-25 sm:m-10 justify-center content-center text-wrap bg-dbu-bg3 sm:rounded-[4em]">
          <Head Form={content} />
          <p className="text-dbu-header text-center text-md md:text-2xl my-3 font-bold tracking-widest">
            {hasMultipleFactorTraits ? "Factor Traits" : "Factor Trait"}
          </p>
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
        </div>
      );
}