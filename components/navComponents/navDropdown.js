export default function NavDropdown({ list, menuState }) {
  return (
    <ul className="ml-4">
      {list.map((item, key) => (
        <li
          key={item.text}
          className={"border-dbu-line text-dbu-text decoration-0 hover:text-dbu-link text-sm py-3 w-full".concat(
            menuState ? " " : " hidden",
            key === 0 ? " border-t-1" : " ",
            key > 0 ? " border-t-1" : " ",
            key === list.length - 1 ? " border-b-0" : " ",
          )}
        >
          <a className="block w-max py-2" href={item.link}>
            {item.text}
          </a>
        </li>
      ))}
    </ul>
  );
}
