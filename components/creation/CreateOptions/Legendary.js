import Legendary from "../../../classes/Transformations/Legendary/legendary.Class";
import LegendaryHead from "../../../classes/Transformations/Legendary/legendaryHead.Class";
import Trait from "../../../classes/General Classes/trait.Class.js";

export default function createLegendary(name, author) {
    const head = new LegendaryHead({title: name, author: author});
    const traits = new Trait("", "", []);    
    const legendaryTrait = new Trait("", "", []);    
    const legendary = new Legendary(head, [traits], [], [legendaryTrait], [] /** transformations Array*/ );    
    return legendary
}