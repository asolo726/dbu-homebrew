import Card from "./card";


export default function Search() {
    const mockLink = "https://dbu-rpg-northgalaxy.vercel.app/black-blade";
    const mockImageUrl = "https://9pensrt47gzxrsro.public.blob.vercel-storage.com/Griffith_Can_we_have_battle_beast___no_guts_we_have_battle_beast_at_home___battle_beast_at_home.webp";
    const mockPageName = "Black Blade";
    const mockPageType = "Legendary Form";
    const mockRaceRestriction = "Any Race";
    const mockTierOfPower = 5;
    const mockAuthor = "Blasteroid";

    return (
        <Card
            link={mockLink}
            imageUrl={mockImageUrl}
            pageName={mockPageName}
            pageType={mockPageType}
            raceRestriction={mockRaceRestriction}
            tierOfPower={mockTierOfPower}
            author={mockAuthor}
        />
    )
}