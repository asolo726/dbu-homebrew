import Ability from "./ability";
export default function BurstLimit({title = "", desc = "", ability = {}}){
    return(
        <div className="">
            <p className="text-dbu-header text-center text-md md:text-2xl my-3 font-bold tracking-widest">BURST LIMIT</p>
            <p className="text-dbu-text text-md md:text-lg text-left">
                <span className="font-bold text-dbu-header">{title}:</span> 
                {" "}{desc}
            </p>
            <Ability abilityList={ability}/>
        </div>
    )
}