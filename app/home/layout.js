import NavbarServer from "../../components/navComponents/NavbarServer";
export default function HomeLayout({ children }) {
  return (
    <>
      <NavbarServer />
      <div className="grid justify-center">{children}</div>
    </>
  );
}
