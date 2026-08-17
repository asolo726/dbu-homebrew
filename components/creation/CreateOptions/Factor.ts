import { BasicHead } from "./CreationObjects";

export default function createFactor(name : string, author : string, authorID : number) {
    let head : BasicHead = {
        title: name,
        author: author,
        authorID: authorID,
        keyName: name.replaceAll(" ", "-").toLowerCase(),
        identity: "Factor",
        banner: "https://9pensrt47gzxrsro.public.blob.vercel-storage.com/whosthatzfighter.webp",
        tag : "",
        dontShowAuthor: false,
        bannerAuthor: "",
    }

    head.raceReq = ""
    head.maxFactor = "1"
    head.preReq = ""
    head.tag = ""
    head.toggle = ""

    let factor = {
        head: head,
        traits: [],
    }

    return factor
}