import Image from "next/image";
import React from "react";

const Logo = ({ width = 30, height = 30} : {
    width?: number;
    height?: number;
}): React.ReactElement => {
  return (
    <Image 
      src="/favicon.svg"
      alt="syncgrid_logo"
      width={width}
      height={height}
    />
  );
};

export default Logo;