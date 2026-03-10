"use client";
import { useContext } from "react";
import CarouselOption from "./CarouselOption";
import { AuthSessionContext } from "../../contextProviders/AuthSessionContext.js";

export default function Create() {
  const session = useContext(AuthSessionContext);
  // Form creation options that have the name and the link
  const creationOptions = [
    {
      name: "Awakening",
      link: "",
      imageLink: "",
    },
    {
      name: "Alternate",
      link: "",
      imageLink: "",
    },
    {
      name: "Enhancement",
      link: "",
      imageLink: "",
    },
    {
      name: "Legendary",
      link: "",
      imageLink: "",
    },
    {
      name: "Evolved Stage",
      link: "",
      imageLink: "",
    },
  ];

  return (
    <div>
      <h1 className="text-dbu-header text-center text-md md:text-2xl my-3 font-bold tracking-widest">
        CREATION
      </h1>
      {/* Create Carousel */}
      <div className="flex flex-col md:flex-row">
        {creationOptions.map((option, key) => (
          <CarouselOption
            key={key}
            name={option.name}
            link={option.link}
            imageLink={option.imageLink}
          />
        ))}
      </div>
    </div>
  );
}
