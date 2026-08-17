export interface BasicHead {
    title: string;
    author: string;
    authorID: number;
    banner?: string;
    bannerAuthor?: string;
    keyName: string;
    identity: string;
    dontShowAuthor: boolean;
    tag: string;
    // This is what allows us to add more keys to the Object
    [key: string]: string | number | boolean | undefined | {} | [];
}

export const ATTR_MOD_DEFAULT = [
    { attribute: "AG", Bonus: 0, Multiplier: "T" },
    { attribute: "FO", Bonus: 0, Multiplier: "T" },
    { attribute: "TE", Bonus: 0, Multiplier: "T" },
    { attribute: "SC", Bonus: 0, Multiplier: "T" },
    { attribute: "IN", Bonus: 0, Multiplier: "T" },
    { attribute: "MA", Bonus: 0, Multiplier: "T" },
];
