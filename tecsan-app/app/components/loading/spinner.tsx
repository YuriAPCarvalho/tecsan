import React from "react";
import { RotatingLines } from "react-loader-spinner";

const Spinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-full">
      <RotatingLines
        visible={true}
        width="96"
        strokeColor="#212937"
        strokeWidth="5"
        animationDuration="0.75"
        ariaLabel="rotating-lines-loading"
      />
    </div>
  );
};

export default Spinner;
