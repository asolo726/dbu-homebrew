"use client";
import { useState } from "react";
import "./Navbar.css";
import { RxHamburgerMenu } from "react-icons/rx";
import { RxCross1 } from "react-icons/rx";
import Image from "next/image";
import NavOption from "./navOption";
import NavColumn from "./navColumn";
import ProfileMenu from "../signIn/ProfileMenu";
import NavbarSearch from "./NavbarSearch";

export default function Navbar({ session }) {
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const dropdownCss = menuIsOpen ? " block" : " hidden";
  const testList = [{ text: "Option 1", link: "/option1" }];
  const transformationOptions = [
    {
      text: "Lesser Awakenings",
      link: "",
      list: testList,
    },
    { text: "Greater Awakenings", link: "" },
    { text: "Super Awakenings", link: "" },
    { text: "Enhancement Powers", link: "" },
    { text: "Alternate Forms", link: "" },
    { text: "Legendary Forms", link: "" },
    { text: "Evolved Stages", link: "" },
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

  const extrasOptions = [
    { text: "0.9.3 Update Tracker", link: "/progress-tracker" },
    {
      text: "DBU Race Tier List",
      link: "https://tiermaker.com/create/dbu-races-but-with-subraces-99065",
    },
    {
      text: "DM Screen Sheet",
      link: "https://docs.google.com/spreadsheets/d/1SelN3jPptLpu0My1HaEkrIWBfASN0DMvCdiwouFoJRc/edit?usp=sharing",
    },
  ];

  const navOptions = [
    { text: "Extras", link: "", list: extrasOptions },
    //{ text: "0.9.3 Update Tracker", link: "/home/progress-tracker" },
    //{ text: "Transformations", link: "", list: transformationOptions },
    //{ text: "Player", link: "", list: playerOptions },
    //{ text: "Techniques", link: "", list: techniqueOptions },
    //{ text: "Compendiums", link: "", list: [] },
    // { text: "Sign Up", link: "" },
    // { text: "Log In", link: "/Login" },
  ];

  {
    /* Desktop Nave Menu */
  }
  const desktopNavMenu = () => {
    return (
      <div
        id="innerDesktopNavMenu"
        className="flex flex-row place-content-end items-center"
      >
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
        <NavbarSearch />
        <ProfileMenu session={session} />
      </div>
    );
  };

  return (
    <>
      <Image
        src="/Ultimate Shenron thingy.webp"
        className="flex flex-row self-center object-fit-cover col-span-1 max-h-[100%] w-full"
        width={3200}
        height={800}
        quality={100}
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
          className="col-span-3 lg:col-span-2 lg:grow-2 text-dbu-header place-content-center"
        >
          <a
            className="navOption text-left text-xl hover:text-dbu-link"
            href="/"
          >
            Dragon Ball Universe: North Galaxy
          </a>
        </div>

        <div className="flex flex-row self-center col-span-1 justify-self-end place-content-center lg:hidden">
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
          <ProfileMenu session={session} />
        </div>

        <nav
          id="desktopNavMenu"
          className="hidden lg:justify-self-end lg:place-self-center lg:col-span-2 lg:block w-full"
        >
          {desktopNavMenu()}
        </nav>
      </header>

      {/* Mobile Search Bar */}
      <div className="lg:hidden px-6 py-3 border-b border-dbu-line">
        <NavbarSearch fullWidth />
      </div>

      {/* Mobile Nav Menu */}
      <nav
        id="mobileNavMenu"
        className={"bg-dbu-bg2 flex justify-center align-middle lg:hidden".concat(
          dropdownCss,
        )}
      >
        <div
          id="innerNavMenu"
          className="self-center flex flex-col m-10 lg:flex-row lg:self-end w-full"
        >
          <div className="flex flex-row border-b-1 pb-5 border-dbu-line py-3">
            <p className="text-sm self-center">MENU</p>
          </div>
          {navOptions.map((option, index) => {
            return (
              <NavOption
                key={index}
                text={option.text}
                link={option.link}
                list={option.list}
              />
            );
          })}
        </div>
      </nav>
    </>
  );
}
