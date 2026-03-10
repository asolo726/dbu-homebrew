"use client";
import { useState } from "react";
import { CgProfile } from "react-icons/cg";
import SignIn from "./signInorOut";
/**
 * Handles the Profile Icon and Dropmenu, and holds the Sign In/Out button
 * @param {*} Session object from Auth
 * @returns
 */
export default function ProfileMenu({ session }) {
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const listOptions = [
    // session ? <a href="/home/create">Create</a> : "" ,
    <SignIn session={session} />,
  ];
  const listCss =
    "p-3 text-center border-dbu-line border-t-1 text-dbu-text decoration-0 hover:text-dbu-link text-sm";

  return (
    <div className="relative self-center pl-5">
      {/* Profile Icon */}
      <div
        className=" max-w-10 rounded-full cursor-pointer overflow-clip"
        onClick={() => setMenuIsOpen(!menuIsOpen)}
      >
        {session ? (
          <img
            className="min-w-8 max-w-10 md:min-w-10 "
            src={session.user.image}
          />
        ) : (
          <CgProfile className="size-8" />
        )}
      </div>
      {/* Drop Down Menu */}
      <div
        className={
          "flex flex-row -left-25 mt-2 z-10 min-w-20 absolute bg-dbu-bg border-dbu-line" +
          (menuIsOpen ? " " : " hidden")
        }
      >
        <ul className="border-dbu-line border-x-1 border-b-1 text-center">
          {listOptions.map((item, key) => (
            <li key={key} className={listCss}>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
