'use client';
import { useContext } from "react";
import CarouselOption from "./CarouselOption";
import { AuthSessionContext } from "../../contextProviders/AuthSessionContext.js";

export default function Create() {
    const session = useContext(AuthSessionContext);
    // Form creation options that have the name and the link
    const creationOptions = [
        { 
            name: "Transformation",
            link: "",
            imageLink:""
        },
        { 

        },
    ];


    return (
        <div>
            <h1> Hey numn nuts, oh sorry. I mean {session.user.name}</h1>
            {creationOptions.map((option, key) => (
                <CarouselOption key={key} name={option.name} link={option.link} imageLink={option.imageLink} />   
            ))}
        </div>
    );
}
