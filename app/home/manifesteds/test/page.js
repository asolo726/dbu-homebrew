import Head from "../../../../components/dbuComponents/Form/head";
import Trait from "../../../../components/dbuComponents/General/trait";
import manifestHeadClass from "../../../../classes/Forms/Manifested/manifestedHead.Class";
import manifestedClass from "../../../../classes/Forms/Manifested/manifested.Class"; 

export default function Test_Deific_Saiyan() {

    const attributeModifiers = [
        { attribute: "AG", Bonus: 1, Multiplier: "" },
        { attribute: "FO", Bonus: 3, Multiplier: "" },
        { attribute: "TE", Bonus: 2, Multiplier: "" },
        { attribute: "SC", Bonus: 0, Multiplier: "" },
        { attribute: "IN", Bonus: 1, Multiplier: "" },
        { attribute: "MA", Bonus: 3, Multiplier: "" },
        { attribute: "PE", Bonus: 0, Multiplier: "" },
    ];
    const manifestHead = new manifestHeadClass({
        title: "Deific Saiyan",
        banner: "/deific.png",
        desc: "Though the scarlet flames may fade from your body, your Saiyan cells hold steadfast to the godly power they were exposed to. While not as powerful as the Super Saiyan God, your base power is now far beyond what it once was, capable of combating even the most experienced of deities without even transforming. \n"
        + "This Manifested Power can be obtained in one of two ways. The first and most common method is to enter the Super Saiyan God Transformation once, after which upon exiting the Transformation you immediately gain this Manifested power. The other method is to enter the God Ki State through a Core Transformation. Upon exiting this Transformation, you may gain this Manifested Power by spending DT unlocking a form.",
        author: "Blasteroid",
        raceReq: "None",
        preReq: "None",
        tier: "4",
        attributeModifiers: attributeModifiers,
        maxStacks: 1
    })

    return (
        <>
            <Head  />
            <Trait />
            <Trait />
        </>
    );
}
