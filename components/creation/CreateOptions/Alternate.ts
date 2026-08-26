import { ATTR_MOD_DEFAULT, BasicHead } from "./CreationObjects";

export default function createAlternate(
  name: string,
  author: string,
  authorID: number,
) {
  // const head = new AlternateHead({title: name, author: author, authorID: authorID});
  // const traits = new Trait("", "", []);
  // const masteryTrait = new MasteryTrait("", "", []);
  // const alternate = new Alternate(head, [traits], [masteryTrait]);

  let head: BasicHead = {
    title: name,
    author: author,
    authorID: authorID,
    keyName: name.replaceAll(" ", "-").toLowerCase(),
    identity: "Alternate",
    banner:
      "https://9pensrt47gzxrsro.public.blob.vercel-storage.com/whosthatzfighter.webp",
    tag: "",
    dontShowAuthor: false,
    bannerAuthor: "",
  };

  head.desc = "";
  head.raceReq = "Any Race";
  head.preReq = "N/A";
  head.tier = "1";
  head.aspects = [];
  head.attributeModifiers = ATTR_MOD_DEFAULT;
  head.stress = "1";
  head.transLine = "";
  head.transStage = "";
  head.transformationType = "Form";
  head.formType = "Alternate";

  let alternate = {
    head: head,
  };

  return alternate;
}
