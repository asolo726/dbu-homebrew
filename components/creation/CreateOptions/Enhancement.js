import EnhancementHead from "../../../classes/Transformations/Enhancement/enhancementHead.Class";
import Enhancement from "../../../classes/Transformations/Enhancement/enhancement.Class";
import Trait from "../../../classes/General Classes/trait.Class";
import BurstLimit from "../../../classes/Transformations/Enhancement/burstLimit.Class";

export default function createEnhancement(name, author){
    const head = new EnhancementHead({title: name, author: author});
    const traits = new Trait("", "", []);
    const burstLimit = new BurstLimit("", "", []);
    
    const enhancement = new Enhancement(head, [traits], [burstLimit]);
    
    return enhancement
    
}