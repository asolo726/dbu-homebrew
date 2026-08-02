// Navigation option for Desktop
export default function NavColumn({ text, link, list = [] }) {
  const div_styles = "border-r-1 border-dbu-line w-auto self-center";
  const a_styles =
    "block text-dbu-text decoration-0 text-md w-full md:px-3 lg:px-7 hover:text-dbu-link ";

  const content = () => {
    if (list.length > 0) {
      return (
        <div className={div_styles.concat(" transformation-dropdown")}>
          <a className={a_styles}>{text}</a>
          {dropMenu()}
        </div>
      );
    } else {
      return (
        <div className={div_styles}>
          <a className={a_styles} href={link}>
            {text}
          </a>
        </div>
      );
    }
  };

  const dropMenu = () => {
    return (
      <ul className="transformation-dropdown-content ml-0 absolute z-1 bg-dbu-bg border-dbu-line border-x-1 border-b-1">
        {list.map((item, key) => (
          <li
            key={item.text}
            className={"border-dbu-line text-dbu-text decoration-0 hover:text-dbu-link text-sm".concat(
              key === 0 ? " border-t-1" : " ",
              key > 0 ? " border-t-1" : " ",
              key === list.length - 1 ? " border-b-0" : " ",
            )}
          >
            <a className="pl-3 py-3 block w-50" href={item.link}>
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    );
  };
  return <>{content()}</>;
}
