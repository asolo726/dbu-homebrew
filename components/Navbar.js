"use client";
import { useState } from "react";
import "./Navbar.css";
import { RxHamburgerMenu } from "react-icons/rx";
import { RxCross1 } from "react-icons/rx";
import Image from "next/image";
import NavOption from "./navComponents/navOption";
import NavColumn from "./navComponents/navColumn";
import Profile from "./Profile";

export default function Navbar({ session }) {
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const dropdownCss = menuIsOpen ? " block" : " hidden";
  const testList = [{ text: "Option 1", link: "/option1" }];
  const transformationOptions = [
    {
      text: "Lesser Awakenings",
      link: "/home/awakenings/test",
      list: testList,
    },
    { text: "Greater Awakenings", link: "/home/awakenings/test" },
    { text: "Super Awakenings", link: "/home/awakenings/test" },
    { text: "Enhancement Powers", link: "/home/enhancements/test" },
    { text: "Alternate Forms", link: "/home/alternates/test" },
    { text: "Legendary Forms", link: "/home/legendary/test" },
    { text: "Evolved Stages", link: "/home/evolvedStages/test" },
  ];
  const playerOptions = [
    { text: "Races", link: "" },
    { text: "Minion Races", link: "" },
    { text: "Talents", link: "" },
    { text: "Gear", link: "" },
  ];
  const techniqueOptions = [
    { text: "Signature Techniques", link: "" },
    { text: "Auras", link: "" },
    { text: "Unique Abilities", link: "" },
  ];

  const navOptions = [
    { text: "Transformations", link: "", list: transformationOptions },
    { text: "Player", link: "", list: playerOptions },
    { text: "Techniques", link: "", list: techniqueOptions },
    { text: "Compendiums", link: "", list: [] },
    // { text: "Sign Up", link: "" },
    // { text: "Log In", link: "/Login" },
  ];

  {
    /* Desktop Nave Menu */
  }
  const desktopNavMenu = () => {
    return (
      <div id="innerDesktopNavMenu" className="flex flex-row place-content-end">
        {" "}
        {/* This needs to be changed to a recursive method so you can have submenus */}
        {navOptions.map((item, key) => (
          <NavColumn
            key={key}
            text={item.text}
            link={item.link}
            list={item.list}
          />
        ))}
        <Profile session={session} />
      </div>
    );
  };

  return (
    <>
      <Image
        src={"/Ultimate Shenron thingy.webp"}
        className="flex flex-row self-center object-fit-cover col-span-1 max-h-[100%] w-full"
        width={3200}
        height={800}
        quality={70}
        alt=""
        style={{
          objectFit: "cover",
        }}
        priority={true}
      />
      <header
        id="navHeader"
        className="p-7 border-b-1 grid grid-cols-4 grid-rows-1  border-dbu-line"
      >
        <div
          id="title"
          className="col-span-3 md:col-span-2 md:grow-2 text-dbu-header place-content-center"
        >
          <a
            className="navOption text-left text-xl hover:text-dbu-link"
            href="/"
          >
            Dragon Ball Universe: North Galaxy
          </a>
        </div>

        <div className="flex flex-row self-center col-span-1 justify-self-end place-content-center md:hidden">
          <button
            id="navButton"
            className="flex align-middle justify-center p-3 "
            onClick={() => setMenuIsOpen(!menuIsOpen)}
          >
            {menuIsOpen ? (
              <RxCross1 className="cursor-pointer size-5 stroke-1 stroke-dbu-text hover:stroke-dbu-link" />
            ) : (
              <RxHamburgerMenu className="cursor-pointer size-5 stroke-1 stroke-dbu-text hover:stroke-dbu-link" />
            )}
          </button>
          <Profile session={session} />
        </div>

        <nav
          id="desktopNavMenu"
          className="hidden md:justify-self-end md:place-self-center md:col-span-2 md:block w-full"
        >
          {desktopNavMenu()}
        </nav>
      </header>

      {/* Mobile Nav Menu */}
      <nav
        id="mobileNavMenu"
        className={"bg-dbu-bg2 flex justify-center align-middle md:hidden".concat(
          dropdownCss,
        )}
      >
        <div
          id="innerNavMenu"
          className="self-center flex flex-col m-10 md:flex-row md:self-end w-full"
        >
          <div className="flex flex-row border-b-1 pb-5 border-dbu-line py-3">
            <p className="text-sm self-center">MENU</p>
          </div>
          {navOptions.map((option, index) => {
            return (
              console.log("Running: ", index),
              <NavOption
                key={index}
                text={option.text}
                link={option.link}
                list={option.list}
              />
            )
          })}
        </div>
      </nav>
    </>
  );
}