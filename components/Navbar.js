"use client";
import { useState } from "react";
import "./Navbar.css";
import { RxHamburgerMenu } from "react-icons/rx";
import { RxCross1 } from "react-icons/rx";
import NavOption from "./navComponents/navOption";

export default function Navbar() {
    const [menuIsOpen, setMenuIsOpen] = useState(false);
    const dropdownCss = menuIsOpen ? " block" : " hidden";
    const navOptions = [
        { text: "Transformations", link: "" },
        { text: "Races", link: "" },
        { text: "Sign Up", link: "" },
        { text: "Log In", link: "" },
    ];
    const transformationOptions = [
        {text: "Manifested Powers", link: ""},
        {text: "Enhancement Powers", link: ""},
        {text: "Alternate Forms", link: ""},
        {text: "Legendary Forms", link: ""},
    ];

    return (
        <>
            <header
                id="navHeader"
                className="p-7 grid grid-cols-4 border-b-1 border-dbu-line"
            >
                <div
                    id="title"
                    className="col-span-3 md:grow-1 text-dbu-header place-content-center"
                >
                    <a className="navOption text-left text-xl" href="/">
                        Dragon Ball Universe: North Galaxy
                    </a>
                </div>

                <div className="col-span-1 justify-self-end place-content-center  md:hidden">
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

                <nav id="desktopNavMenu" className="hidden md:block">
                    <div
                        id="innerDesktopNavMenu"
                        className="flex flex-row self-end w-full"
                    >
                        <p className="text-sm border-b-1 border-dbu-line py-3">
                            MENU
                        </p>
                        <div className="transformation-dropdown">
                            <p className="navOption top">Transformations</p>
                            <div className="transformation-dropdown-content bg-dbu-bg">
                                <ul className="">
                                    <li className="navOption navDropItem">
                                        <a href="">Manifested Powers</a>
                                    </li>
                                    <li className="navOption navDropItem">
                                        <a href="">Enhancement Forms</a>
                                    </li>
                                    <li className="navOption navDropItem">
                                        <a href="">Alternate Forms</a>
                                    </li>
                                    <li className="navOption navDropItem">
                                        <a href="">Legendary Forms</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <a className="navOption top ">Races</a>
                        <a className="navOption top">Sign Up</a>
                        <a className="navOption top">Log In</a>
                    </div>
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
                    className="self-center flex flex-col md:flex-row md:self-end w-full"
                >
                    <p className="text-sm border-b-1 border-dbu-line py-3">
                        MENU
                    </p>
                    <NavOption text={navOptions[0].text} link={navOptions[0].link} list={transformationOptions} />
                    <NavOption text={navOptions[1].text} link={navOptions[1].link} />
                    <NavOption text={navOptions[2].text} link={navOptions[2].link} />
                    <NavOption text={navOptions[3].text} link={navOptions[3].link}  />
                    
                </div>
            </nav>
        </>
    );
}
