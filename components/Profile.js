"use client";
import { useState } from "react";
import { CgProfile } from "react-icons/cg";
import SignIn from "./signInorOut";

export default function Profile({ session }) {
    const [menuIsOpen, setMenuIsOpen] = useState(false);
    const listCss =
        "px-3 text-left border-dbu-line border-t-1 text-dbu-text decoration-0 hover:text-dbu-link text-sm";
    
        return (
        <div className="relative self-center pl-5">
            <div
                className=" max-w-10 rounded-full cursor-pointer overflow-clip"
                onClick={() => setMenuIsOpen(!menuIsOpen)}
            >
                {session ? (
                    <img className="min-w-8 max-w-10 md:min-w-10 " src={session.user.image} />
                ) : (
                    <CgProfile className="size-8" />
                )}
            </div>
            <div
                className={
                    "flex flex-row -left-15 mt-2 z-10 min-w-20 absolute bg-dbu-bg border-dbu-line" +
                    (menuIsOpen ? " " : " hidden")
                }
            >
                <ul className="border-dbu-line border-x-1 border-b-1 text-left">
                    <li className={listCss}>...</li>
                    <li className={listCss}>
                        <SignIn session={session} />
                    </li>
                </ul>
            </div>
        </div>
    );
}
