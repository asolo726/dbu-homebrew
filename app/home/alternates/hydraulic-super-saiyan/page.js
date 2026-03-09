import Head from "../../../../components/dbuComponents/Form/head";
import Trait from "../../../../components/dbuComponents/General/trait";
import MasteryTrait from "../../../../components/dbuComponents/Form/masteryTrait";

import AlternateHead from "../../../../classes/Forms/Alternate/altHead.Class";
import Alternate from "../../../../classes/Forms/Alternate/alternate.Class";
import MasteryTraitClass from "../../../../classes/Forms/Alternate/masteryTrait.Class";
import TraitClass from "../../../../classes/General Classes/trait.Class";

export async function generateMetadata() {
  return {
    title: "Hydraulic Super Saiyan",
    description:
      "Through some miraculous feat of engineering, or perhaps the remnants of your former self seeping into your constructed vessel, you are capable of ascending into a higher form, reminiscent of that of a Super Saiyan.",
    openGraph: {
      title: "Hydraulic Super Saiyan",
      description:
        "Through some miraculous feat of engineering, or perhaps the remnants of your former self seeping into your constructed vessel, you are capable of ascending into a higher form, reminiscent of that of a Super Saiyan.",
      images:
        "https://dbu-rpg-northgalaxy.vercel.app/you_see_afton_you_arent_dealing_with_the_average_animatronic_warrior_anymore.webp",
      type: "website",
      siteName: "DBU: The Homebrew Galaxy",
    },
    authors: "Blasteroid",
  };
}

export default function Test_HydraulicSuperSaiyan() {
  const aspects = [
    {
      name: "Variant",
      level: 0,
      link: {
        name: "Super Saiyan 1",
        url: "https://dbu-rpg.com/super-saiyan/",
      },
    },
    { name: "Enhanced Save (Impulsive/Corporeal)", level: 0 },
    { name: "Super Saiyan Form", level: 0 },
    { name: "Raging", level: 0 },
    { name: "High Speed", level: 1 },
    { name: "Glowing", level: 0 },
    { name: "Light Dependent", level: 0 },
    { name: "Draining", level: 2 },
    { name: "Power High", level: 1 },
    { name: "Difficult", level: 2 },
    { name: "Exhausting", level: 0 },
  ];

  const attributeModifiers = [
    { attribute: "AG", Bonus: 1, Multiplier: "T" },
    { attribute: "FO", Bonus: 1, Multiplier: "T" },
    { attribute: "TE", Bonus: 1, Multiplier: "T" },
    { attribute: "SC", Bonus: 0, Multiplier: "T" },
    { attribute: "IN", Bonus: 1, Multiplier: "T" },
    { attribute: "MA", Bonus: 1, Multiplier: "T" },
    { attribute: "PE", Bonus: 0, Multiplier: "T" },
  ];

  const altHead = new AlternateHead({
    title: "Hydraulic Super Saiyan",
    desc: "Through some miraculous feat of engineering, or perhaps the remnants of your former self seeping into your constructed vessel, you are capable of ascending into a higher form, reminiscent of that of a Super Saiyan. ",
    author: "Blasteroid",
    banner:
      "/you_see_afton_you_arent_dealing_with_the_average_animatronic_warrior_anymore.webp",
    raceReq: "Androids",
    stress: "12",
    tier: "2",
    aspects: aspects,
    attributeModifiers: attributeModifiers,
  });

  const traits = [
    {
      title: "Spark of Gold (S-Cells)",
      desc: "The power of the Super Saiyan sparks alight within you, igniting into an ascension nearly identical to that of the legendary golden warrior.",
      abilities: [
        {
          condition: "Triggered/Transform, Triggered/Grade",
          desc: "Use the Power Up Maneuver as an Out-of-Sequence Maneuver.",
        },
        {
          condition: "Triggered, 1/Round",
          desc: "If you target an Opponent with an effect from a Racial Trait or Factor Trait at the start or end of your turn, after applying that effect, enter the Surging State until the start of your next turn. Your ‘Focus’ must be the Opponent you targeted with your Racial Trait/Factor.",
        },
        {
          condition: "Passive",
          desc: "While you are in any State, increase your Dodge Rolls and Soak Value by 1(T).",
        },
        {
          condition: "Permanent, Choice",
          desc: "Gain the following based on your selection with the 2nd effect of Technological Being:",
        },
        {
          miniTraitList: [
            {
              title:
                "Enhanced Organism [Triggered/Start of Turn, 3/Encounter, Resource",
              desc: "At the start of each of your turns, gain a “Reconstructed S-Cell”. Upon gaining a Reconstructed S-Cell, select a Combat Roll and increase the Natural Result of the Combat Roll by 1 while in this Form for the remainder of the Encounter. You cannot select a particular Combat Roll more than once.",
            },
            {
              title: "Construct [Passive]",
              desc: "While you are above the Critical Threshold, increase your Combat Rolls by 1(T). If you are in the Healthy Threshold, double this bonus.",
            },
          ],
        },
        {
          condition: "Automatic, Ruling",
          desc: "When you lose Ki Points as a result of the Draining Aspect, make a Steadfast Check. If you fail, you “Overheat”, losing Life Points equal to the Ki Points lost through the Draining Aspect and reducing your Steadfast Checks and Stress Bonus by -1 until after your next Steadfast Check through this effect.",
        },
      ],
    },
    {
      title: "Gleaming Might (Golden Power)",
      desc: "Your mechanical might surges with golden power, spiking your ki with shimmering, gilded light.",
      abilities: [
        {
          condition: "Passive",
          desc: "Increase the Natural Result of your Duel Clashes and Healing Surges by 1.",
        },
        {
          condition: "Permanent, Choice",
          desc: "Gain the following based on your selection with the 2nd effect of Technological Being:",
        },
        {
          miniTraitList: [
            {
              title:
                "Enhanced Organism [Triggered/Transform, Triggered/Threshold, 3/Encounter]",
              desc: "Use a Ki Surge. Increase your Surgency by half when you use a Ki Surge this way.",
            },
            {
              title: "Construct [Triggered, 1/Round]",
              desc: "When you use the Defend Maneuver, for each Health Threshold you are above Critical, increase your Damage Reduction by 1/4th your Force Modifier.",
            },
          ],
        },
        {
          condition: "Permanent, Choice",
          desc: "Gain the following based on your selection with the 4th effect of Energy Core:",
        },
        {
          miniTraitList: [
            {
              title: "Infinite Energy [Triggered, 1/Round]",
              desc: "When you make an Attacking Maneuver, regain 1/4th your Capacity Rate. This can cause your Capacity Rate to exceed your maximum Capacity Rate for the duration of the Attacking Maneuver.",
            },
            {
              title: "Power Battery [Passive]",
              desc: "All of your Attacking Maneuvers gain the Full Wager Advantage.",
            },
          ],
        },
        {
          condition: "Triggered/Transform",
          desc: "Enter the Raging State until the end of your turn.",
        },
      ],
    },
  ];

  const sparkingTraits = [
    {
      title: "Spark for Battle",
      desc: "Sparks begin to form around you, representing the newfound energy surging through your synthetic veins.",
      abilities: [
        {
          condition: "Passive",
          desc: "Increase your Wound Rolls and Initiative Rolls G(T).",
        },
        {
          condition: "Triggered",
          desc: "When you target an Opponent with the Surging State, increase your Tier of Power Extra Dice Category by 1.",
        },
        {
          condition: "Triggered, 1/Round",
          desc: "When you make an Attacking Maneuver with a Ki Wager equal to or exceeding 1/4th of your Max Capacity, apply a stack of Energy Charge.",
        },
      ],
    },
    {
      title: "Limitless Sparks",
      desc: "Your hair grows to obscene levels as you enter a nearly limitless level of strength.",
      abilities: [
        {
          condition: "Passive",
          desc: "Increase the Insight Modifier bonus of this Transformation by 1(T).",
        },
        {
          condition: "Triggered, 1/Round",
          desc: "When you use a Signature Technique, for every 1/4th of your maximum capacity that you Wager on the Attacking Maneuver, increase the Damage Category by 1. This cannot increase the Damage Category more than G times.",
        },
        {
          condition: "Triggered, 1/Encounter",
          desc: "When you use a Signature Technique, increase the Dice Category of any Energy Charges applied to the Attacking Maneuver by 1 for each stack of Power you possess.",
        },
      ],
    },
  ];

  const masteryTraits = [
    {
      title: "Remnant of the Super Saiyan",
      desc: "You have put in the work to ensure that the quality of your synthetic S-Cells surpasses that of the original.",
      abilities: [
        {
          condition: "Permanent",
          desc: "Hydraulic Super Saiyan loses the Power High and Exhausting Aspects.",
        },
        {
          condition: "Passive",
          desc: "Increase your Steadfast Checks by 1. While in Grade 2 or higher, increase your Stress Bonus by 1.",
        },
        {
          condition: "Passive",
          desc: "Treat the Superior State as the Raging State for the effects of the Raging Aspect.",
        },
        {
          condition: "Passive",
          desc: "When you use the 4th effect of Gleaming Might, you may enter the Superior State instead of the Raging State. If you do, the effect lasts until the start of your next turn.",
        },
      ],
    },
    {
      title: "Evanescent Gold",
      desc: "You cling to the golden data within you and nature the memory, gaining greater dominion of the combat information stored within you.",
      abilities: [
        {
          condition: "Permanent",
          desc: "This Transformation loses a level of the Draining Aspect.",
        },
        {
          condition: "Passive",
          desc: "While you are in the Surging or Superior State, increase the Dice Category of your Energy Charges applied to Signature Techniques by 1.",
        },
        {
          condition: "Passive",
          desc: "This Transformation gains the Graded Aspect.",
        },
        {
          condition: "Graded",
          desc: "Hydraulic Super Saiyan has 2 Grades. Each Hydraulic Super Saiyan Grade has its own Tier of Power Requirement, and each Grade after the first…",
        },
        {
          list: [
            "Grants the effects of each previous Grade.",
            "Increase the Stress Test Requirement by 5, and the levels of the High Speed/Draining Aspects by 1.",
            "Increases the bonus granted by the first effect of Gleaming Might by 1.",
            "Increases the Attribute Modifier Bonuses by this Transformation by a specified amount.",
            "Grants you access to a Sparking Trait.",
          ],
        },
        {
          table: {
            headers: [
              "Grade",
              "Tier of Power Requirement",
              "AMB (AG/FO/TE/MA)",
              "Sparking Trait Gained",
            ],
            rows: [
              ["1 (Super Saiyan)", "2+", "–", "–"],
              [
                "2 (Super Saiyan 2)",
                "3+",
                "+1(T)",
                [
                  sparkingTraits[0].title,
                  sparkingTraits[0].desc,
                  sparkingTraits[0].abilities,
                ],
              ],
            ],
          },
        },
      ],
    },
    {
      title: "Bring the Warrior Back to Life",
      desc: "The warrior spirit of the Saiyan has been fully rekindled within you.",
      abilities: [
        {
          condition: "Permanent",
          desc: "This Transformation loses a level of the Draining Aspect, and gains ‘M’-1 levels of the Scaling Aspect.",
        },
        {
          condition: "2/Encounter",
          desc: "If you would “Overheat”, you can choose to not Overheat.",
        },
        {
          condition: "Permanent, Choice",
          desc: "Gain the following based on your selection with the 4th effect of Energy Core:",
        },
        {
          miniTraitList: [
            {
              title: "Infinite Energy [Triggered]",
              desc: "When you regain Ki Points through the 4th effect of Energy Core, you may choose to do one of the following:",
            },
          ],
        },
        {
          list: [
            "Increase the Ki Points gained by 2(bT).",
            "Use the Energy Charge Maneuver as an Instant Maneuver and halve the Ki Points regained.",
            "Use the Power Up Maneuver as an Instant Maneuver, but do not regain any Ki Points.",
          ],
          sublist: 1,
        },
        {
          miniTraitList: [
            {
              title: "Power Battery [Passive]",
              desc: "The 5th effect of Power Battery is always active. If your Ki Points exceed your Max Capacity, double the bonus of this effect.",
            },
          ],
        },
        {
          condition: "Graded",
          desc: "Hydraulic Super Saiyan gains a 3rd Grade.",
        },
        {
          table: {
            headers: [
              "Grade",
              "Tier of Power Requirement",
              "AMB (AG/FO/TE/MA)",
              "Sparking Trait Gained",
            ],
            rows: [
              [
                "3 (Super Saiyan 3)",
                "4+",
                "+1(T)",
                [
                  sparkingTraits[1].title,
                  sparkingTraits[1].desc,
                  sparkingTraits[1].abilities,
                ],
              ],
            ],
          },
        },
      ],
    },
  ];

  const traitObjs = [
    new TraitClass(traits[0].title, traits[0].desc, traits[0].abilities),
    new TraitClass(traits[1].title, traits[1].desc, traits[1].abilities),
  ];

  const masteryTraitsObj = [
    new MasteryTraitClass(
      masteryTraits[0].title,
      masteryTraits[0].desc,
      masteryTraits[0].abilities,
    ),
    new MasteryTraitClass(
      masteryTraits[1].title,
      masteryTraits[1].desc,
      masteryTraits[1].abilities,
    ),
    new MasteryTraitClass(
      masteryTraits[2].title,
      masteryTraits[2].desc,
      masteryTraits[2].abilities,
    ),
  ];

  const alternateFormObj = new Alternate({
    head: altHead,
    traits: traitObjs,
    masteryTrait: masteryTraitsObj,
  });

  return (
    <div className="flex flex-col flex-col-1 max-w-5xl px-10 py-10 md:px-25 sm:m-10 justify-center content-center text-wrap bg-dbu-bg3 sm:rounded-[4em]">
      <Head Form={alternateFormObj} />
      {alternateFormObj.traits.map((trait, key) => {
        return (
          <Trait
            title={trait.title}
            desc={trait.desc}
            abilities={trait.abilities}
            key={key}
          />
        );
      })}
      <MasteryTrait masteryTraitList={alternateFormObj.masteryTrait} />
    </div>
  );
}
