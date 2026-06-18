import AwakeningHead from "../../../classes/Transformations/Awakening/awakeningHead.Class"
import Awakening from "../../../classes/Transformations/Awakening/awakening.Class"
import GrandAwakening from "../../../classes/Transformations/Awakening/grandAwakening"
import Trait from "../../../classes/General Classes/trait.Class"

function createAwakening(name, author) {
    const awakeningHead = new AwakeningHead({title: name, author: author});
    const grandAwakening = new GrandAwakening("", "", []);
    const traits = new Trait("", "", []);

    const awakening = new Awakening(awakeningHead, [traits], grandAwakening);
    
    return awakening
}

export default createAwakening;