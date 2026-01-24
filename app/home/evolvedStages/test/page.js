//Components
import Head from "../../../../components/dbuComponents/Form/head";
import Trait from "../../../../components/dbuComponents/General/trait";

//Classes
import EvolvedStageHead from "../../../../classes/Forms/Evolved Stages/evolvedStageHead.Class.js";
import EvolvedStageClass from "../../../../classes/Forms/Evolved Stages/evolvedStage.Class.js";
import TraitClass from "../../../../classes/General Classes/trait.Class.js";

export default function Test_SCellManifestation() {
  const aspects = [
    { name: "Super Saiyan Form", level: 0 },
    { name: "Glowing", level: 0 },
    { name: "Light Dependent", level: 0 },
    { name: "Raging", level: 0 },
    { name: "Pinnacle", level: 0 },
    { name: "Peaked", level: 0 },
    { name: "Draining", level: 1 },
  ];
  const attributeModifiers = [
    { attribute: "AG", Bonus: 1, Multiplier: "T" },
    { attribute: "FO", Bonus: 1, Multiplier: "T" },
    { attribute: "TE", Bonus: 1, Multiplier: "T" },
    { attribute: "SC", Bonus: 0, Multiplier: "T" },
    { attribute: "IN", Bonus: 0, Multiplier: "T" },
    { attribute: "MA", Bonus: 1, Multiplier: "T" },
    { attribute: "PE", Bonus: 0, Multiplier: "T" },
  ];

  const evolvedStageHead = new EvolvedStageHead({
    title: "S-Cell Manifestation",
    desc: "By channeling the S-Cells within your body, you transcend the limits for your existing Transformation with the fearsome, gilded power of the Super Saiyan.",
    banner: "/whosthatzfighter.webp",
    author: "Blasteroid",
    preReq:
      "Saiyan Race and access to Super Saiyan 1, Saiyan Ancestry Factor and Descended Super Saiyan, or Saiyan-Like Bio-Focus",
    tier: "Same as Original Form",
    aspects: aspects,
    attributeModifiers: attributeModifiers,
    stress: "+3",
    evolvedStageType: "Generic",
    formType: "Same as Original Form",
  });

  const traits = [
    {
      title: "Miraculous S-Cells",
      desc: "Infusing your dormant S-Cells or simply imitating the power of the golden warrior, you suffuse the strength of the super saiyan into your transformation.",
      abilities: [
        {
          condition: "Permanent",
          desc: "You cannot enter this Evolved Stage if you are in a different Transformation with the Super Saiyan Form Aspect.",
        },
        {
          condition: "Passive",
          desc: "You cannot enter a different Transformation with the Super Saiyan Form Aspect.",
        },
        {
          condition: "Passive",
          desc: "Increase the Dice Score of your Duel Clashes by 1(T).",
        },
        {
          condition: "Triggered/Transform",
          desc: "Enter the Raging State until the start of your next turn.",
        },
        {
          condition: "Triggered/Power, 1/Encounter",
          desc: "Use a Ki Surge as an Out-of-Sequence Maneuver.",
        },
      ],
    },
  ];

  const evolvedStageTraitsObj = [
    new TraitClass(traits[0].title, traits[0].desc, traits[0].abilities),
  ];

  const evolvedStage = new EvolvedStageClass({
    head: evolvedStageHead,
    traits: evolvedStageTraitsObj,
    masteryTrait: null,
    legendaryTrait: null,
  });

  return (
    <div className="flex flex-col flex-col-1 max-w-5xl px-10 py-10 md:px-25 sm:m-10 justify-center content-center text-wrap bg-dbu-bg3 sm:rounded-[4em]">
      <Head Form={evolvedStage} />
      {evolvedStage.traits.map((trait, index) => {
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
