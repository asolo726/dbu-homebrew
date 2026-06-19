import EvolvedStage from "../../../classes/Transformations/Evolved Stages/evolvedStage.Class.js";
import EvolvedStageHead from "../../../classes/Transformations/Evolved Stages/evolvedStageHead.Class.js";
import Trait from "../../../classes/General Classes/trait.Class.js";

export default function createEvolvedStage(name, author){
    const head = new EvolvedStageHead({title: name, author: author});
    const traits = new Trait("", "", []);    
    const evolvedStage = new EvolvedStage(head, [traits]);    
    return evolvedStage
}

