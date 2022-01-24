import React from "react";

import Sidebar from "./Sidebar";
import Body from "./Body";

const Layout: React.FC = ({ children }) => {
  return (
    <div className={`flex w-screen h-screen`}>
      <Sidebar className="bg-primary hidden lg:w-1/5 lg:flex  flex-col " />
      <Body>{children}</Body>
    </div>
  );
};

export default Layout;
