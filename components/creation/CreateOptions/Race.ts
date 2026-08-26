import { BasicHead } from "./CreationObjects";

function createRace(name: string, author: string, authorID: number) {
  let head: BasicHead = {
    title: name,
    author: author,
    authorID: authorID,
    keyName: name.replaceAll(" ", "-").toLowerCase(),
    identity: "Race",
    banner:
      "https://9pensrt47gzxrsro.public.blob.vercel-storage.com/whosthatzfighter.webp",
    tag: "",
    dontShowAuthor: false,
    bannerAuthor: "",
  };

  head.tag = "";

  let Race = {
    head: head,
    raceFeatures: {
      racialLifeModifier: 0,
      savingThrows: [""],
      skillRanks: 0,
      attributeScores: "",
    },
    primaryTraits: [],
    secondaryTraits: [],
    subraces: [],
  };

  return Race;
}

export default createRace;
