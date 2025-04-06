import React from "react";

interface props {
  title: string;
  children: React.ReactNode;
}
function block({ title, children }: props) {
  return (
    <div className="w-full">
      <h3>{title}</h3>
      {children}
    </div>
  );
}

export default block;
