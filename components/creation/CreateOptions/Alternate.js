import Alternate from "../../../classes/Transformations/Alternate/alternate.Class";
import AlternateHead from "../../../classes/Transformations/Alternate/altHead.Class";
import MasteryTrait from "../../../classes/Transformations/Alternate/masteryTrait.Class";
import Trait from "../../../classes/General Classes/trait.Class";

export default function createAlternate(name, author, authorID){
    const head = new AlternateHead({title: name, author: author, authorID: authorID});
    const traits = new Trait("", "", []);
    const masteryTrait = new MasteryTrait("", "", []);

    const alternate = new Alternate(head, [traits], [masteryTrait]);    

    return alternate
}