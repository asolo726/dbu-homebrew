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
    { text: "Aspects", link: "/aspects" },
    {
      text: "Awakenings",
      link: "/search?pageTypes=Awakening",
      list: testList,
    },
    { text: "Enhancement Powers", link: "/search?pageTypes=Enhancement" },
    { text: "Alternate Forms", link: "/search?pageTypes=Alternate" },
    { text: "Legendary Forms", link: "/search?pageTypes=Legendary" },
    { text: "Evolved Stages", link: "/search?pageTypes=Evolved+Stage" },
  ];
  const playerOptions = [
    { text: "Races", link: "/search?pageTypes=Race" },
    { text: "Factors", link: "/search?pageTypes=Factor" },
    { text: "Talents", link: "/talents" },
    { text: "Gear", link: "/items-accessories" },
  ];
  const techniqueOptions = [
    { text: "Unique Abilities", link: "/unique-abilities" },
  ];
  const communityOptions = [
    { text: "Aspects", link: "/aspects" },
    { text: "Additional Rules", link: "/additional-rules" },
    { text: "Alternate Upbringing", link: "/alternate-upbringing" },
    { text: "Bestial Traits", link: "/bestial-traits" },
    { text: "Custom Species", link: "/custom-species-expansion" },
    { text: "Genetic Splicing/Bio-Focus", link: "/genetic-focus" },
    { text: "Monstrous Traits", link: "/monstrous-traits" },
    { text: "Monster", link: "/monster" },
    { text: "Mutation", link: "/mutation" },
    { text: "Talents", link: "/talents" },
  ];
  const compendiumOptions = [
    { text: "Base DBU Expansion", link: "/search?tags=Base+DBU+Expansion" },
    { text: "Invincible", link: "/search?tags=Invincible" },
    { text: "Meme", link: "/search?tags=Meme" },
    { text: "Pocket Monsters", link: "/search?tags=Pocket+Monsters" },
  ];

  const extrasOptions = [
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
    { text: "Community", link: "", list: communityOptions },
    { text: "Collections", link: "", list: compendiumOptions },
    //{ text: "0.9.3 Update Tracker", link: "/home/progress-tracker" },
    { text: "Player", link: "", list: playerOptions },
    { text: "Transformations", link: "", list: transformationOptions },
    { text: "Techniques", link: "", list: techniqueOptions },
    { text: "Extras", link: "", list: extrasOptions },
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
