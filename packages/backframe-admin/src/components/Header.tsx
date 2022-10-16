import clsx from "clsx";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";

export default function Header({ links }: { links: string[] }) {
  const location = useLocation();
  return (
    <nav className="inline-flex gap-8 border-b border-gray-200 dark:border-gray-800 w-full pt-4 text-lg sticky top-0 z-10 bg-white dark:bg-black px-10">
      {links.map((link, idx) => {
        return (
          <Link
            key={idx}
            to={link}
            className={clsx("capitalize py-2 relative")}
          >
            {link}
            <motion.div
              className={clsx(
                "h-[4px] rounded-t-md absolute bottom-0 w-full bg-purple-500 transition-all",
                location.pathname.includes(link) ? "block" : "hidden"
              )}
            ></motion.div>
          </Link>
        );
      })}
    </nav>
  );
}
