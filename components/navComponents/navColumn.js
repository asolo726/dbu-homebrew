"use client";
import { useState } from "react";

export default function NavColumn({ text, link, list = [] }) {
    const a_styles = "text-dbu-text decoration-0 text-md hover:text-dbu-link";
    const div_styles = "px-5 border-r-1 border-dbu-line";

    const [dropDownState, setDropDownState] = useState(false);

    const content = () => {
        if (list.length > 0) {
            return (
                <div className={div_styles}>
                    <a className={a_styles}>{text}</a>
                    {dropMenu()}
                </div>
            );

        } else {
            return (
                <div className={div_styles}>
                    <a className={a_styles} href={link}>
                        {text}
                    </a>
                </div>
            );
        }
    };

    const dropMenu = () => {
        return (
            <ul className="ml-4 relative hover:inline-block bg-dbu-bg">
                {list.map((item, key) => (
                    <li
                        key={item.text}
                        className={"border-dbu-line text-dbu-text decoration-0 hover:text-dbu-link text-sm py-3 w-full".concat(
                            key === 0 ? " border-t-1" : " ",
                            key > 0 ? " border-t-1" : " ",
                            key === list.length - 1 ? " border-b-0" : " "
                        )}
                    >
                        <a className="block w-max p-10" href={item.link}>
                            {item.text}
                        </a>
                    </li>
                ))}
            </ul>
        );
    };
    return <div>{content()}</div>;
}
