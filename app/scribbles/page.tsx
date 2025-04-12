import React from "react";
import Header from "../components/header";
import Block from "../components/block";

function page() {
  return (
    <div className="gap-4 flex flex-col">
      <Header title="scribbles">
        <p>
          A collection of my written works found on this{" "}
          <a href="blog.dayowrites.com/" className="hyperlink" target="_blank">
            portal
          </a>
          .
        </p>
      </Header>
      <Block title="blog">
        <p>
          The blog portion comprises of thoughts or connections that I've made
          in the past. I never planned on sharing my creative writing or
          thoughts, but then I decided, “What's the harm in?”.
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
          means of connecting adjacent ideas. I hope to continue building this
          library so that I can rely on it during hard times.
        </p>
      </Block>
    </div>
  );
}

export default page;
