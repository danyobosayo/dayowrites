import React from "react";

interface props {
  title: string;
  children: React.ReactNode;
}
function header({ title, children }: props) {
  return (
    <div className="w-full flex flex-col gap-4">
      <h2>{title}</h2>
      <hr className="border border-[#63725B] w-full"></hr>
      {children}
    </div>
  );
}

export default header;
