import React from "react";
import Header from "../components/header";
import Block from "../components/block";

function page() {
  return (
    <div className="gap-4 flex flex-col">
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
          work. Apparently he had been doing videography/photography for
          small-mid sized companies in his local area and wanted to expand into
          providing a complete digital package. Since then, we&apos;ve designed
          two professional websites that can be found here:
        </p>
        <ul>
          <p className="pt-4">
            <a
              className="hyperlink"
              target="_blank"
              href="https://mid-citycollisioncenter.org/"
            >
              mid city collision center
            </a>
          </p>
          <p>
            <a>composite systems (tbd)</a>
          </p>
        </ul>
      </Block>

      <Block title="bibzakar">
        <p>
          This project started as a bible verse memorizing app for myself but I
          thought that it could be useful to others. That&apos;s when I added
          additional functionality, user auth, and basic CRUD functions for
          tracking. It uses Speech To Text voice recognition through the browser
          and microphone. You can try it for yourself{" "}
          <a href="https://bibzakar.com/" className="hyperlink" target="_blank">
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
            href="https://guide.hackutd.co/"
            className="hyperlink"
            target="_blank"
          >
            HackUTD educational resource platform
          </a>{" "}
          (powered by docusaurus).
        </p>
      </Block>
      <Block title="dye drive">
        <p>
          React Native mobile application that I built to aid colorblind
          drivers.
        </p>
      </Block>
    </div>
  );
}

export default page;
