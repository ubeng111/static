import Link from "next/link";
import { usePathname } from "next/navigation";

const MainMenu = ({ style = "" }) => {
  const pathname = usePathname();

  return (
    <nav className="menu js-navList">
      <ul className={`menu__nav ${style} -is-active`}>
        <li className={pathname === "/" ? "current" : ""}>
          <Link href="/">Home</Link>
        </li>
        {/* End Home menu */}

        <li className={pathname === "/about" ? "current" : ""}>
          <Link href="/about">About</Link>
        </li>
        {/* End About menu */}

       

        <li className={pathname === "/contact" ? "current" : ""}>
          <Link href="/contact">Contact</Link>
        </li>
        {/* End Contact menu */}
      </ul>
    </nav>
  );
};

export default MainMenu;
