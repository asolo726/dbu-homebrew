import { BasicHead, ATTR_MOD_DEFAULT } from "./CreationObjects";
function createAwakening(name : string, author : string, authorID : number) {
    let head : BasicHead = {
        title: name,
        author: author,
        authorID: authorID,
        keyName: name.replaceAll(" ", "-").toLowerCase(),
        identity: "Awakening",
        banner: "https://9pensrt47gzxrsro.public.blob.vercel-storage.com/whosthatzfighter.webp",
        tag : "",
        dontShowAuthor: false
    }

    head.desc = ""
    head.raceReq = ""
    head.preReq = ""
    head.tier = ""
    head.aspects = []
    head.attributeModifiers = ATTR_MOD_DEFAULT
    head.tier = 0
    head.maxStacks = 1
    head.transformationType = "Awakening"
    head.awakeningType = ""
    head.awakeningOrigin = ""

    let awakening = {
        head: head,
    }
    
    return awakening
}

export default createAwakening;