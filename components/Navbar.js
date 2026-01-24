"use client";
import { useState } from "react";
import "./Navbar.css";
import { RxHamburgerMenu } from "react-icons/rx";
import { RxCross1 } from "react-icons/rx";
import NavOption from "./navComponents/navOption";
import NavColumn from "./navComponents/navColumn";
import SignIn from "./signInorOut";

export default function Navbar({session}) {
    const [menuIsOpen, setMenuIsOpen] = useState(false);
    const dropdownCss = menuIsOpen ? " block" : " hidden";
    const transformationOptions = [
        { text: "Awakenings", link: "/home/awakenings/test" },
        { text: "Enhancement Powers", link: "/home/enhancements/test" },
        { text: "Alternate Forms", link: "/home/alternates/test" },
        { text: "Legendary Forms", link: "/home/legendary/test" },
    ];

    const navOptions = [
        { text: "Transformations", link: "", list: transformationOptions },
        { text: "Races", link: "" },
        // { text: "Sign Up", link: "" },
        // { text: "Log In", link: "/Login" },
    ];
    
    const desktopNavMenu = ()=>{
        return (
            <div
                id="innerDesktopNavMenu"
                className="flex flex-row place-content-end"
            >
                {navOptions.map((item, key) => (
                    <NavColumn key={key} text={item.text} link={item.link} list={item.list}/>
                ))}

                <SignIn session={session}/>
            </div>
        )
    }

    return (
        <>
            <header
                id="navHeader"
                className="p-7 border-b-1 grid grid-cols-4 grid-rows-1  border-dbu-line"
            >
                <div
                    id="title"
                    className="col-span-3 md:col-span-2 md:grow-2 text-dbu-header place-content-center"
                >
                    <a className="navOption text-left text-xl hover:text-dbu-link" href="/">
                        Dragon Ball Universe: North Galaxy
                    </a>
                </div>

                <div className="col-span-1 justify-self-end place-content-center md:hidden">
                    <button
                        id="navButton"
                        className="flex align-middle justify-center p-3"
                        onClick={() => setMenuIsOpen(!menuIsOpen)}
                    >
                        {menuIsOpen ? (
                            <RxCross1 className="cursor-pointer size-5 stroke-1 stroke-dbu-text hover:stroke-dbu-link" />
                        ) : (
                            <RxHamburgerMenu className="cursor-pointer size-5 stroke-1 stroke-dbu-text hover:stroke-dbu-link" />
                        )}
                    </button>
                </div>

                <nav id="desktopNavMenu" className="hidden md:justify-self-end md:place-self-center md:col-span-2 md:block w-full"> 
                    {(desktopNavMenu())}
                </nav>
            </header>
            <nav
                id="mobileNavMenu"
                className={"bg-dbu-bg2 flex justify-center align-middle md:hidden".concat(
                    dropdownCss
                )}
            >
                <div
                    id="innerNavMenu"
                    className="self-center flex flex-col m-10 md:flex-row md:self-end w-full"
                >
                    <p className="text-sm border-b-1 pb-5 border-dbu-line py-3">
                        MENU
                    </p>
                    <NavOption
                        text={navOptions[0].text}
                        link={navOptions[0].link}
                        list={transformationOptions}
                    />
                    <NavOption
                        text={navOptions[1].text}
                        link={navOptions[1].link}
                    />
                </div>
            </nav>
        </>
    );
}
