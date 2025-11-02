import AlternateHead from "../../../../classes/Forms/Alternate/altHead";
import Alternate from "../../../../classes/Forms/Alternate/alternate";
import Head from "../../../../components/dbuComponents/Form/head";

export default function Test_DarkRessurrection() {
    const aspects = [
        "Scaling (LV2)", 
        "Realization", 
        "Dedicated", 
        "Difficult (LV2)"];
    const attributeModifiers = [0,1,0,0,0,1,0];
    const altHead = new AlternateHead(
        {
            title : "Dark Ressurrection",
            desc : "Be it by a curse, a quirk of your biology, or something more sinister, you have acquired the ability to spontaneously and temporarily raise yourself from the dead after you’ve been defeated - staggering up as a walking corpse or rising as a foul spirit, and assaulting your enemies unrelentingly.",
            author : "",
            raceReq : "None",
            stress : "10",
            top : "1",
            aspects : aspects,
            attributeModifiers : attributeModifiers,
        }
    );

    const traits = {};
    const masteryTrait = {};
    const alternateFormObj = new Alternate(altHead, traits, masteryTrait);

    return (
        <div className="flex flex-col flex-col-1 max-w-5xl px-10 py-10 md:px-25 sm:m-10 justify-center content-center text-wrap bg-dbu-bg3 sm:rounded-[4em]">
            <Head 
                title={altHead.title}
                banner={altHead.banner}
                desc={altHead.desc}
                author={altHead.author}
                raceReq={altHead.raceReq}
                preReq={altHead.preReq}
                top={altHead.top}
                aspects={altHead.aspects}
                attributeModifiers={altHead.attributeModifiers}
                stress={altHead.stress}
                transLine={altHead.transLine}
                transStage={altHead.transStage}
            />
            {/* <Trait />
            <Trait />
            <MasteryTrait /> */}
        </div>
    );
}
