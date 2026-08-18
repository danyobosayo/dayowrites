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
          During the 2024 winter season, two of my best friends and I teamed up
          to do freelance work together. One of them had been doing videography
          for small-mid sized companies in his local area and wanted to expand
          into providing a complete digital package, so the three of us made it
          happen. Since then, we&apos;ve designed two professional websites that
          can be found here:
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
      <Block title="loadout - fast food macro builder">
        <p>
          I found myself frequenting fast food restaurants, namely Chipotle and
          Cava, for the past two years of my life. And as someone who focuses on
          nutrition, I wanted to create a convenient and efficient way of
          calculating exactly what I&apos;m putting in my body.
        </p>
        <p>
          So I built <strong>Loadout</strong>, a free, ad-free, native iOS app
          (SwiftUI) that lets you assemble a custom meal at fast-casual spots
          like Chipotle, CAVA, Panda Express, and Sweetgreen, watch the macros
          update live as you build it, and export the totals straight into
          MacroFactor with a single tap.
        </p>
      </Block>
      <Block title="hearth - a private health dashboard">
        <p>
          Hearth is an on-device dashboard for my Apple Health data, built
          native in SwiftUI with a watch app and widgets. It reads HealthKit
          and distills overnight HRV, resting heart rate, sleep, and a dozen
          other biomarkers into readiness, sleep, and stress scores, each
          measured against my own 60-day baseline instead of population
          averages. A one-tap export drops analyst-ready CSVs straight into my
          Obsidian vault. No accounts, no cloud; the data never leaves the
          phone, which is exactly the point.
        </p>
      </Block>
      <Block title="pulse - urge awareness tracker">
        <p>
          Pulse was an app I needed before it was an app I built. While working
          to overcome a porn addiction, I realized streak counters have the
          problem backwards: they measure the absence of failure rather than
          the presence of effort. Pulse tracks the moments I{" "}
          <i>notice and resist</i> an urge, capturing the mood, context, and
          intensity behind each one. Those entries slowly become a map of my
          patterns, and the goal shifts from white-knuckling a streak to
          actually understanding myself. The first version is{" "}
          <a
            href="https://apps.apple.com/us/app/pulse-urge-awareness-tracker/id6767706260"
            className="hyperlink"
            target="_blank"
          >
            live on the App Store
          </a>
          .
        </p>
      </Block>
      <Block title="word assassins - coax">
        <p>
          My current opus, now on the App Store as{" "}
          <a
            href="https://apps.apple.com/us/app/word-assassins-coax/id6757906454"
            className="hyperlink"
            target="_blank"
          >
            Word Assassins - Coax
          </a>
          . It&apos;s the classic in-person assassin game with words as the
          weapon: everyone receives a secret target and a trigger word, and
          your job is to coax your target into saying theirs. The app handles
          the bookkeeping, targets, eliminations, and inheritance, then gets
          out of the way, because the real game unfolds at brunch tables, on
          road trips, and in group chats. What started as a weekend referee
          tool has grown into multiple game modes, forty-plus word packs,
          AI-generated custom packs, and lobbies of up to a hundred players.
          There&apos;s more at{" "}
          <a
            href="https://playcoax.com/"
            className="hyperlink"
            target="_blank"
          >
            playcoax.com
          </a>
          .
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
