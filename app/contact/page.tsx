import React from "react";
import Block from "../components/block";
import Header from "../components/header";

function page() {
  return (
    <div className="gap-4 flex flex-col">
      <Header title="contact">
        Below is a list of places to reach me. You could also try searching up
        "Daniel Kim" on google and buying a lottery ticket while you&apos;re at
        it.
      </Header>
      <Block title="email">
        <p>
          By far the most reliable way to reach me is at my email,
          sungsu.kim04@gmail.com. You can expect a response within 7 jupiter
          days.
        </p>
      </Block>
      <Block title="socials">
        <li>discord: danyobosayo</li>
        <li>
          <a
            className="hyperlink"
            href="https://www.instagram.com/sungsu._.k/"
            target="_blank"
          >
            instagram:
          </a>{" "}
          sungsu._.k
        </li>
        <li>
          <a
            className="hyperlink"
            href="https://www.linkedin.com/in/danielsungsukim/"
            target="_blank"
          >
            linkedin:
          </a>{" "}
          danielsungsukim
        </li>
      </Block>
    </div>
  );
}

export default page;
