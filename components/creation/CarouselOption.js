export default function CarouselOption({ name, link, imageLink, setSelectedCreationOption}) {
  
  return (
    <div className="m-4 p-3 min-w-60 md:min-w-80 flex flex-col border-4 rounded-xl border-solid border-dbu-link hover:bg-dbu-link cursor-pointer"
        onClick={() => setSelectedCreationOption(name)} >
        <h1 className="text-md md:text-lg text-center ">{name}</h1>
    </div>
  );
}
