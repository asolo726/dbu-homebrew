import { BasicHead, ATTR_MOD_DEFAULT } from "./CreationObjects";

export default function createEvolvedStage(
  name: string,
  author: string,
  authorID: number,
) {
  let head: BasicHead = {
    title: name,
    author: author,
    authorID: authorID,
    keyName: name.replaceAll(" ", "-").toLowerCase(),
    identity: "Evolved Stage",
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
  head.transformationType = "Form";
  head.stress = "1";
  head.evolvedStageType = "Generic";
  head.formType = "Same as Original Form";

  let evolvedStage = {
    head: head,
  };

  return evolvedStage;
}
