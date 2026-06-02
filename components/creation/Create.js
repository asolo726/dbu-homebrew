"use client";
import { useContext, useState } from "react";
import CarouselOption from "./CarouselOption";
import { AuthSessionContext } from "../../contextProviders/AuthSessionContext.js";
import { useRouter } from "next/navigation";

export default function Create({ submitForm }) {
    const session = useContext(AuthSessionContext);
    // The Selected Creation Option from the Carousel
    const [selectedCreationOption, setSelectedCreationOption] = useState("");
    const [creationName, setCreationName] = useState("");
    const [formResult, setFormResult] = useState("");
    const router = useRouter();
    const handleFormSubmit = async () => {
        const result = await submitForm(selectedCreationOption, creationName);
        setFormResult(result.result);
        if (result.result === "Success") {
            const newContentUrl = creationName.replaceAll(" ", "-").toLowerCase()
            router.push(`/${newContentUrl}`);
        }
    };

    const creationOptions = [
        {
            name: "Awakening",
            imageLink: "",
        },
        {
            name: "Alternate",
            imageLink: "",
        },
        {
            name: "Enhancement",
            imageLink: "",
        },
        {
            name: "Legendary",
            imageLink: "",
        },
        {
            name: "Evolved Stage",
            imageLink: "",
        },
        {
            name: "Factor",
            imageLink: "",
        },
        {
            name: "Race",
            imageLink: "",
        },
    ];

    return (
        <div>
            <h1 className="text-dbu-header text-center text-md text-3xl my-3 font-bold tracking-widest">
                CREATION
            </h1>
            {/* Create Carousel */}
            <h2 className=" text-center text-md md:text-xl my-3 font-bold tracking-widest">
                Select a Creation Type
            </h2>
            <div className="flex flex-col md:flex-row flex-wrap justify-center">
                {creationOptions.map((option, key) => (
                    <CarouselOption
                        key={key}
                        name={option.name}
                        imageLink={option.imageLink}
                        setSelectedCreationOption={setSelectedCreationOption}
                        selectedCreationOption={selectedCreationOption}
                    />
                ))}
            </div>
            <div className="flex flex-col">
                <h3 className="text-dbu-header text-center text-md md:text-lg my-3 font-bold tracking-widest">
                    {" "}
                    Name of the Creation{" "}
                </h3>
                <div className="flex justify-center">
                    <input
                        className="p-2 my-3 w-150 text-dbu-text text-md md:text-lg md:max-w-lg font-semibold border border-gray-500 rounded-md"
                        type="text"
                        placeholder="Creation Name"
                        value={creationName}
                        onChange={(e) => setCreationName(e.target.value)}
                    />
                </div>
                <div className="flex justify-center">
                    <button
                        className="p-3 my-3 text-white text-md md:text-lg md:max-w-30  font-bold tracking-widest bg-dbu-link rounded-xl hover:bg-dbu-link-hover cursor-pointer"
                        onClick={() => handleFormSubmit()}
                    >
                        Submit
                    </button>
                </div>
                <div className="flex justify-center">
                    {<p>{formResult}</p>}
                </div>
            </div>
        </div>
    );
}
