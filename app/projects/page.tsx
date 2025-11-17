import React from "react";
import Header from "../components/header";
import Block from "../components/block";

function page() {
  return (
    <div className="gap-4 overflow-scroll scrollbar-hide flex flex-col">
      <Header title="projects">
        <p>
          Personal projects and freelance work that I&apos;ve done over the past
          4 years.
        </p>
      </Header>
      <Block title="dire creatives">
        <p>
          During the 2024 winter season, an old high school friend approached me
          and my other best friend in hopes of doing collaborative freelance
          work. Apparently he had been doing videography for small-mid sized
          companies in his local area and wanted to expand into providing a
          complete digital package. Since then, we&apos;ve designed two
          professional websites that can be found here:
        </p>
        <ul>
          <p className="flex flex-col">
            <a
              className="hyperlink"
              target="_blank"
              href="https://mid-citycollisioncenter.org/"
            >
              mid city collision center
            </a>
            <a
              className="hyperlink"
              target="_blank"
              href="https://www.compositesystemsllc.com/"
            >
              composite systems
            </a>
          </p>
        </ul>
      </Block>

      {/* <Block title="bibzakar"> */}
      {/*   <p> */}
      {/*     This project started as a bible verse memorizing app for myself but I */}
      {/*     thought that it could be useful to others. That&apos;s when I added */}
      {/*     additional functionality, user auth, and basic CRUD functions for */}
      {/*     tracking. It uses Speech To Text voice recognition through the browser */}
      {/*     and microphone. You can try it for yourself{" "} */}
      {/*     <a href="https://bibzakar.com/" className="hyperlink" target="_blank"> */}
      {/*       here */}
      {/*     </a> */}
      {/*     . */}
      {/*   </p> */}
      {/* </Block> */}
      <Block title="hackutd tech guide">
        <p>
          The HackUTD Tech Guide is an online library of all HackUTD created
          resources that range from workshop guides to articles that focus on
          helping our UTD community succeed. Check it out{" "}
          <a
            href="https://guide.hackutd.co/"
            className="hyperlink"
            target="_blank"
          >
            here
          </a>
          .
        </p>
      </Block>
      <Block title="full stack application guide">
        <p>
          A project the HackUTD 2024 Experience team created with the sole
          intent of providing a comprehensive guide to building full stack
          projects. Initially, our intention was to provide this resource during
          the hackathon only. However, we decided that it was far too valuable
          to gatekeep for the other 51 weekends. Now this resource can be found
          on the{" "}
          <a
            href="https://hackutd.notion.site/HackUTD-Ripple-Effect-Guided-Project-3ff201694b2e451abf6f210d502e4a7d"
            className="hyperlink"
            target="_blank"
          >
            HackUTD Notion Website
          </a>
          .
        </p>
      </Block>
      <Block title="ontrack - my personal time tracking ai tool">
        <p>
          I recently became obsessed with the idea of flow state and catalysts.
          Everybody knows that their best work is done whilst in the flow state,
          but how does one reliably enter it? The easiest answer is by simply
          starting. But this brought about another issue, the brain-rot flow
          state. I rarely catch myself in deep brain-rot sessions, and these
          sessions range from 30 minutes to several hours, which costs me time
          and sanity. My solution for this is to catch what exactly leads up to
          these moments, so that I can better avoid them and be more mindful of
          the flow state catalysts that lead to deep brain-rot sessions.
        </p>
      </Block>
      <Block title="favorite restaurant macro tracker">
        <p>
          I found myself frequenting fast food restaurants, namely Chipotle and
          Cava, for the past two years of my life. And as someone who focuses on
          nutrition, I wanted to create a convenient and efficient way of
          calculating exactly what I&apos;m putting in my body.
        </p>
      </Block>
      <Block title="dye drive">
        <p>
          React Native mobile application that my team built to aid colorblind
          drivers in unfamiliar areas.
        </p>
      </Block>
    </div>
  );
}

export default page;
