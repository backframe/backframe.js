import { Comfortaa } from "next/font/google";
import Image from "next/image";
import logo from "../public/logo.png";
import Link from "next/link";
import { Navbar } from "nextra-theme-docs";
import { N } from "nextra/dist/types-fa5ec8b0";

const font = Comfortaa({
  weight: "600",
  subsets: ["latin"],
});

export function Header() {
  return (
    <Navbar
      items={[
        {
          title: "Blog",
          newWindow: true,
          href: "https://vndaba.rocks/blog/backframe.js",
          name: "blog",
          route: "/blog",
          kind: "MdxPage",
          type: "menu",
        },
      ]}
      flatDirectories={[
        {
          kind: "MdxPage",
          name: "docs",
          route: "/docs",
          title: "Docs",
          type: "directory",
        },
      ]}
    />
  );
}
