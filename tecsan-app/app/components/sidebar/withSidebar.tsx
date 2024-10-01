import React from "react";
import Sidebar from "./sidebarComponents";

const withSidebar = (WrappedComponent: React.ComponentType) => {
  return function WithSidebar(props: any) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-1">
          <WrappedComponent {...props} />
        </div>
      </div>
    );
  };
};

export default withSidebar;
