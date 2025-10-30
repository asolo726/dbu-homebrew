import Navbar from "../../components/Navbar";
export default function HomeLayout({ children }) {
    return (
        <>
            <Navbar />
            <div className="grid justify-center">
                {children}
            </div>
        </>
    );
}