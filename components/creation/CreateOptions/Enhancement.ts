import { ATTR_MOD_DEFAULT, BasicHead } from "./CreationObjects"

export default function createEnhancement(name : string, author : string, authorID : number){
    let head : BasicHead = {
        title: name,
        author: author,
        authorID: authorID,
        keyName: name.replaceAll(" ", "-").toLowerCase(),
        identity: "Enhancement",
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
    head.transformationType = "Enhancement"
    head.enhancementType = "Standard"
    head.initialEnhancement = []
    head.stress = "1"

    let enhancement = {
        head: head,
    }

    return enhancement
    
}