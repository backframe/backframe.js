import React, { useState } from "react";
import logo from "../assets/logo.png";
// import ChevronRightRounded from "@material-ui/icons/ChevronRightRounded";
// import {ChevronRightRounded} from "@material-ui/icons"

interface SideBarProps {
  children?: React.ReactNode;
  className?: string;
  styles?: object;
}

interface ListItemProps {
  children?: React.ReactNode;
  item: { name: string; values?: Array<Item>; expanded?: boolean };
}

interface Item {
  name: string;
}

const ListItem: React.FC<ListItemProps> = ({ item }: ListItemProps) => {
  const [isExpanded, setExpanded] = useState(item.expanded);
  return (
    <div className="my-2 ">
      <div
        onClick={() => setExpanded((prev) => !prev)}
        className="flex p-2 rounded-md cursor-pointer hover:bg-gray-500 justify-between items-center"
      >
        <h1 className="text-md font-medium text-gray-300 uppercase">
          {item.name}
        </h1>{" "}
        <span className="text-white text-xl">
          {" "}
          <div>^</div>
        </span>
      </div>
      <div
        className={`${
          isExpanded
            ? "max-h-96 opacity-100 text-gray-300 pl-2 transition-all duration-1000"
            : "hidden opacity-0 transition-all duration-1000 max-h-0"
        }  `}
      >
        {item.values &&
          item.values.map((c) => <SubListItem name={c.name} key={c.name} />)}
      </div>
    </div>
  );
};

const SubListItem: React.FC<Item> = (item: Item) => {
  return (
    <div className=" text-base border-l-2 border-gray-400 p-2 m-2 cursor-pointer hover:text-secondary hover:border-secondary">
      <h1>{item.name}</h1>
    </div>
  );
};

const Sidebar: React.FC<SideBarProps> = ({ className }: SideBarProps) => {
  const values = [
    {
      name: "Server Stats",
      values: [
        { name: "Dashboard" },
        { name: "Analytics" },
        { name: "Server Info" },
      ],
    },
    {
      name: "Authentication",
      values: [
        { name: "Users" },
        { name: "Providers" },
        { name: "Email verification" },
        { name: "Password resets" },
      ],
    },
    {
      name: "Database",
      values: [
        { name: "Primary Database" },
        { name: "Test Database" },
        { name: "Schemas" },
      ],
    },
    {
      name: "Internal APIs",
      values: [
        { name: "REST" },
        { name: "GraphQL" },
        { name: "gRPC" },
        { name: "SOAP" },
      ],
    },
    {
      name: "Server settings",
      values: [
        { name: "Web Sockets" },
        { name: "Env variables" },
        { name: "Configuration" },
        { name: "Documentation" },
      ],
    },
    {
      name: "Third parties",
      values: [
        { name: "Sendgrid" },
        { name: "Env variables" },
        { name: "Configuration" },
      ],
    },
  ];

  return (
    <div className={className}>
      <div className=" h-16 p-1 flex shadow-black shadow items-center">
        <img
          src={logo}
          alt="backframe_logo"
          className=" h-full cursor-pointer"
        />
        <h1 className="icon-text text-3xl text-white  ml-1 cursor-pointer">
          <span className="text-secondary">back</span>frame
        </h1>
      </div>
      <div className="sidebar p-3 overflow-y-scroll">
        {values.map((v) => (
          <ListItem item={v} key={v.name} />
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
