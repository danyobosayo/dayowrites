import React from "react";
import Header from "../components/header";
import Block from "../components/block";
function page() {
  return (
    <div className="gap-4 flex flex-col ">
      <Header title="myself">
        <p>
          As much as I despise talking about myself, I&apos;ve come to learn
          that it&apos;s undeniably useful to be able to share your story.
        </p>
      </Header>
      <Block title="testimony">
        <div className="flex flex-col gap-4">
          <p>
            Though I attended church since I was very little, I only truly
            accepted Jesus Christ as my savior during my freshman year of
            University.
          </p>
          <p>
            Throughout my life, I never felt a <i>dependence</i> on God. I
            simply coasted without caring about a higher purpose or honestly
            anything else for that matter. It wasn&apos;t significant to me
            whether a god truly existed of if they were even impacting my life.
            To describe myself during this point in my life: unmotivated,
            addicted to pornography & video games, and comfort seeking. I was
            also lustful, insecure, and uninspired, which only exacerbated my
            emptiness.
          </p>
          <p className="italic font-bold">So what changed?</p>
          <p>
            I had grown tired of feeling empty and unfulfilled. So I decided to
            try taking my faith seriously for the first time.
          </p>
          <p>
            It started with reading some famous stories in the Bible, and
            eventually led to me reading the entirety of Genesis, the Gospels,
            and some Poetry as well. What I began to recognize was how
            incredible this roughly three thousand year old piece of literature
            was. Nothing had ever brought me so much peace and applicable advice
            for every obstacle or burden. I slowly grew closer to God and began
            to feel the Holy Spirit dwell within me. It changed my mindset, how
            I carried myself, and how I treated others. I was noticeably slower
            to anger, more empathetic, and disciplined. And so today I feel
            encouraged to use this revival as an opportunity to share the Good
            News of Jesus Christ. About how God the Father sent him to suffer a
            terrible excruciating death, so that he could overcome it and redeem
            all of us from eternal damnation.
          </p>
          <p>
            To describe myself today: I still make mistakes and struggle with
            insecurities. However, I can go to bed joyfully, in knowing that I
            have a faithful and loving God standing beside me everywhere I go.
          </p>
          <p>
            So I ask of you to take the qualms of life with a grain of salt.
            Because when the horizon eclipses the sun, <strong>you</strong> are
            not just another person, but so much more than that: you are
            uniquely made, loved, and cherished by our divine creator and
            savior.
          </p>
        </div>
      </Block>

      <Block title="how i pass the time">
        <p>
          In the past year, I went from trying out 10 different hobbies, to
          practicing none of them consistently. My current favorites in no
          particular order are: bouldering, running, tidying, and journaling.
        </p>
        <p>
          Here&apos;s my{" "}
          <a
            className="hyperlink"
            target="_blank"
            href="https://www.strava.com/athletes/136197519"
          >
            strava profile
          </a>{" "}
          for any fellow runners.
        </p>
      </Block>
      <Block title="reading list 2026">
        <p>
          I Who Have Never Known Men by <i>Jacqueline Harpman</i> (fin) 8.4/10
        </p>
        <p>
          The Almanack of Naval Ravikant by <i>Eric Jorgenson</i> (fin) 9/10
        </p>
        <p>
          Norwegian Wood by <i>Haruki Murakami</i> (fin) 7/10
        </p>
        <p>
          Twelve Pillars by <i>Jim Rohn & Chris Widener</i> (fin) 6/10
        </p>
        <p>
          East of Eden by <i>John Steinbeck</i> (p.g. 301) {"<-"} currently
          reading
        </p>
        <p>
          Crucial Conversations by <i>Kerry Patterson et al.</i> (p.g. 152)
        </p>
        <p>
          How to Day Trade for a Living by <i>Andrew Aziz</i> (p.g. 96)
        </p>
        <p>
          The Intelligent Investor (3rd ed.) by <i>Benjamin Graham</i> (p.g. 45)
        </p>
      </Block>
    </div>
  );
}

export default page;
