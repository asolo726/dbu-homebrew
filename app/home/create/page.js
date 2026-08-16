import Create from "../../../components/creation/Create";
import uploadNewCreatedContent from "../../api/uploadContent/route";
import {auth} from "../../../auth";
import createAwakening from "../../../components/creation/CreateOptions/Awakening";
import createAlternate from "../../../components/creation/CreateOptions/Alternate";
import createEnhancement from "../../../components/creation/CreateOptions/Enhancement";
import createLegendary from "../../../components/creation/CreateOptions/Legendary";
import createEvolvedStage from "../../../components/creation/CreateOptions/EvolvedStage";
import createRace from "../../../components/creation/CreateOptions/Race";
import createFactor from "../../../components/creation/CreateOptions/Factor";


/**
 * Root of the creation forum. This page file handles the heavy lifting of creating the object and passing it off to the database.
 * Based on what the user inputs in the Create component.
 * @returns
 */

export default async function Create_Page() {
  /**
   * Handles data submission from the Create component. 
   * @param {*} creationOption 
   * @param {*} creationName 
   * @returns Status object. Can be {result: "Success"} or {result: "Failed"} or {result: "Name Taken"}
   */
  
  const session = await auth();

  const submitForm = async (creationOption, creationName) => {
    'use server'
    let creationObject = "none";
    const author = session.user.name;
    const authorID = session.user.id;
    
    if(creationOption === "") {
      return { result: "Please Select a Creation Option."};
    }

    switch (creationOption) {
      case "Awakening":
        creationObject = createAwakening(creationName, author, authorID); 
        break;
      
      case "Alternate":
        creationObject = createAlternate(creationName, author, authorID);
        break;
      
      case "Enhancement":
        creationObject = createEnhancement(creationName, author, authorID);
        break;

      case "Evolved Stage":
        creationObject = createEvolvedStage(creationName, author, authorID);
        break;
      
      case "Legendary":
        creationObject = createLegendary(creationName, author, authorID);
        break;  
      case "Race":
        creationObject = createRace(creationName, author, authorID);
        break;
      case "Factor": 
        creationObject = createFactor(creationName, author, authorID);
        break;
      default:
        break;
    }

    // console.log(creationObject);
    const uploadContentStatus = /*DO NOT REMOVE AWAIT.*/ await uploadNewCreatedContent(creationObject);
    const result = uploadContentStatus;
    
    return { result: result.status};
    
  }

  return <Create submitForm={submitForm} />;
}
