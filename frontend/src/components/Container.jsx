import React from "react";
import Navbar from "./Navbar";

const Container = ({ children }) => {
  return (
    <>
      <Navbar />
      <div className="bg-gray-300 p-[20px] lg:p-[70px] xl:p-[70px] flex flex-col gap-3">{children}</div>
    </>
  );
};

export default Container;
