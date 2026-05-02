import Create from "../../../components/creation/Create";
import uploadContent from "../../api/uploadContent/route";
import AwakeningHead from "../../../classes/Transformations/Awakening/awakeningHead.Class"
import Awakening from "../../../classes/Transformations/Awakening/awakening.Class"

/**
 * Root of the creation forum. This page file handles the heavy lifting of creating the object and passing it off to the database.
 * Based on what the user inputs in the Create component.
 * @returns
 */

export default async function Create_Page( {session} ) {
  const submitForm = (creationOption, creationName) => {
    let creationObject = "none";
    let creationHead = "none";
    switch (creationOption) {
      case "Awakening":
        creationHead = new AwakeningHead({title: creationName });
        creationObject = new Awakening({head: creationHead});
        console.log("Reached this line.")
        console.log(creationHead, creationObject);

    }


    const uploadContentStatus = uploadContent(creationOption, creationName, creationObject);
    return uploadContentStatus;
  }

  return <Create submitForm={submitForm()} />;
}
