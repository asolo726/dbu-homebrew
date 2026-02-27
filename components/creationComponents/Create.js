import TransformationForum from "./TransformationForum";
export default function Create({session}) {
    // Form creation options that have the name and the link
    const creationOptions = [
        { 
            name: "Transformation",
            component: <TransformationForum session={session} />,
        },
        { 

        },
    ];
    return (
        <div>
            {creationOptions.map((option, key) => (
                <div className="border-1-dbu-line" key={key}>
                    <h1>{option.name}</h1>
                    
                </div>
            ))}
        </div>
    );
}
