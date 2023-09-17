import { Comfortaa } from "next/font/google";
import Image from "next/image";
import logo from "./public/logo.png";

const signika = Comfortaa({
  weight: "600",
  subsets: ["latin"],
});

export default {
  logo: (
    <div className="flex items-center gap-3 hover:opacity-90">
      <Image src={logo} alt="Backframe Logo" width={30} height={30} />
      <span
        className={`${signika.className} bg-clip-text hover:text-transparent bg-gradient-to-r from-orange-400 to-yellow-400 tracking-tighter flex text-2xl text-black dark:text-white`}
      >
        backframe.js
      </span>
    </div>
  ),
  project: {
    link: "https://github.com/backframe/backframe.js",
  },
  docsRepositoryBase:
    "https://github.com/backframe/backframe.js/blob/main/docs/",
  banner: {
    key: "unstable-warning",
    text: (
      <span>⚠️ This docs site and backframe.js are still under construction.</span>
    ),
  },
  navigation: {
    prev: true,
    next: true,
  },
  footer: {
    text: (
      <span>
        MIT {new Date().getFullYear()} ©{" "}
        <a href="https://backframe.dev" rel="noreferrer" target="_blank">
          Backframe.js
        </a>
        .
      </span>
    ),
  },
  nextThemes: {
    defaultTheme: "dark",
  },
};
