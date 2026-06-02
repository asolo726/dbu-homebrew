import Create from "../../../components/creation/Create";
import uploadNewCreatedContent from "../../api/uploadContent/route";
import AwakeningHead from "../../../classes/Transformations/Awakening/awakeningHead.Class"
import Awakening from "../../../classes/Transformations/Awakening/awakening.Class"
import {auth} from "../../../auth";

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
   * @returns Status object. Can be {result: "Sucesss"} or {result: "Failed"} or {result: "Name Taken"}
   */
  
  const session = await auth();

  const submitForm = async (creationOption, creationName) => {
    'use server'
    let creationObject = "none";
    let creationHead = "none";

    switch (creationOption) {
      case "Awakening":
        creationHead = new AwakeningHead({title: creationName, author: session.user.name});
        creationObject = new Awakening(creationHead);
        
    }

    // console.log(creationObject);
    const uploadContentStatus = await uploadNewCreatedContent(creationObject);
    const result = await uploadContentStatus;
    
    return { result: result.status};
    
  }

  return <Create submitForm={submitForm} />;
}
