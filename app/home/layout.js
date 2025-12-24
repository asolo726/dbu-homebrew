import NavbarServer from "../../components/NavbarServer";
export default function HomeLayout({ children }) {
    return (
        <>
            <NavbarServer />
            <div className="grid justify-center">
                {children}
            </div>
        </>
    );
}