import { ATTR_MOD_DEFAULT, BasicHead } from "./CreationObjects";

export default function createLegendary(name : string, author : string, authorID : number) {
    let head : BasicHead = {
        title: name,
        author: author,
        authorID: authorID,
        keyName: name.replaceAll(" ", "-").toLowerCase(),
        identity: "Legendary",
        banner: "https://9pensrt47gzxrsro.public.blob.vercel-storage.com/whosthatzfighter.webp",
        tag : "",
        dontShowAuthor: false
    }

    head.desc = ""
    head.raceReq = "Any Race"
    head.preReq = "N/A"
    head.tier = "1"
    head.aspects = []
    head.attributeModifiers = ATTR_MOD_DEFAULT
    head.stress = "1"
    head.transformationType = "Form"
    head.formType = "Legendary"
    head.transLine = "..."
    head.transStage = "..."

    let legendary = {
        head: head,
    }

    return legendary
}