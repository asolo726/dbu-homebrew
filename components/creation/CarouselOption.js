export default function CarouselOption({ name, link, imageLink, selectedCreationOption, setSelectedCreationOption}) {
  
  let selectedCss = "";
  let defaultStyle = "m-4 p-3 min-w-60 md:min-w-80 flex flex-col border-4 rounded-xl border-solid border-dbu-link hover:bg-dbu-link cursor-pointer "
  if (name === selectedCreationOption) {
    selectedCss = "bg-dbu-link";
  }


  return (
    <div className={defaultStyle.concat(selectedCss)}
        onClick={() => setSelectedCreationOption(name)} >
        <h1 className="text-md md:text-lg text-center ">{name}</h1>
    </div>
  );
}
