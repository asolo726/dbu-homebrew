import clientPromise from "../../../lib/mongoDBClient";
import searchContent from "../searchContent/route.js";
import {Aspect} from "../../../components/Aspects/aspectData.js";

/**
 * Get Custom Aspects.
 */

async function getCustomAspects() {
  const aspectsPage = await searchContent("aspects");
  const content = aspectsPage.content[0];
  let customAspects = [];
  try {
    let aspectType = true; // True for positive aspects, false for negative aspects
    const traits = content.traits || [];

    traits.forEach((trait) => {
      // 1. Check if this item is a section header (like Positive or Negative Aspects)
      const sectionTitle = trait.sectional?.title || trait.title;
      
      if (sectionTitle === "Negative Aspects") {
        aspectType = false;
        return; // Move to the next item
      }

      // 2. Get first ability
      const firstAbility = trait.abilities?.[0];
      const desc = firstAbility?.desc;

      // 3. Only push if both title and desc exist
      if (trait.title && desc) {
        customAspects.push(
          new Aspect(
            trait.title,
            aspectType,
            desc,
            0,
            true
          )
        );
      }
    });

    return customAspects;
  } catch (error) {
    console.error("Error parsing custom aspects:", error);
  }
}

/**
 * @param {*} session
 * Gets all Aspects from the Main.aspects cluster.
 * @returns On a Successful search, returns an Array with each Aspect as an entry.
 * @returns On a Failed search, returns a No Data Response
 */
export async function GET() {
  const client = await clientPromise;
  try {
    const db = client.db("Main");

    const data = await db.collection("aspects").findOne({}, { projection: { _id: 0 } });
    const positiveAspects = data.positiveAspects.map((aspect) =>
      new Aspect(
        aspect.name,
        true,
        aspect.effects,
        aspect.maxLevel ? aspect.maxLevel : 0,
        false
      )
    );
    const negativeAspects = data.negativeAspects.map((aspect) =>
      new Aspect(
        aspect.name,
        false,
        aspect.effects,
        aspect.maxLevel ? aspect.maxLevel : 0,
        false
      )
    );
    const customAspects = await getCustomAspects();
    return Response.json({ positiveAspects: positiveAspects, negativeAspects: negativeAspects, customAspects: customAspects});
  }
  catch (e) {
    return { Response: "No Data Found" };
  }
}