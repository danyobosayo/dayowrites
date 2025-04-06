import React from "react";
import Header from "../components/header";
import Block from "../components/block";

function page() {
  return (
    <div className="gap-4 flex flex-col">
      <Header title="scribbles">
        <p>
          A collection of my written works found on a single portal:
          dayowrites.com.
        </p>
      </Header>
      <Block title="blog">
        <p>
          Here is my blog and it comprises of thoughts or connections that I've
          made in the past. Initially, my intention for this project was to
          create a place to store my ideas, but then I thought, “What's the harm
          in sharing it with the World?”.
        </p>
      </Block>
      <Block title="notes">
        <p>
          All of the notes that I've taken during my time at university can be
          found here. It's a combination of digital notes from my iPad, and
          markdown notes from Obsidian.
        </p>
      </Block>
      <Block title="sermons">
        <p>
          I started taking digital notes during service about a year ago. It
          started as a means of staying awake, but it's turned into a reliable
          means of making connections.
        </p>
      </Block>
    </div>
  );
}

export default page;
