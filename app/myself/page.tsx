import React from "react";
import Header from "../components/header";
import Block from "../components/block";
function page() {
  return (
    <div className="gap-4 flex flex-col ">
      <Header title="myself">
        <p>
          As much as I despise talking about myself, I've come to learn that
          it's undeniably useful to be able to share your story.
        </p>
      </Header>
      <Block title="testimony">
        <div className="flex flex-col gap-2">
          <p>
            I grew up in a Christian household and am extremely blessed to have
            incredible support through friends and family. However, with how{" "}
            <i>good</i> my life was, I attributed everything I had to my
            parent's hard work, rather than the provisions of a “god”.
          </p>
          <p>
            I also had major identity issues. As a second generation Korean
            American, there was a single social group that I could categorize
            myself under which made relating to people difficult. I was a mutt
            that was neither fully American nor Korean, who miserably failed
            fitting in with both. Though I had friends, I never had a community
            to identify with which left me yearning for comfort and
            relatability.
          </p>
          <p>
            So I turned to worldly things for comfort: female validation,
            pornography, academics, video games, to list a few. But none of it
            was neither gratifying nor satisfying. It didn't help that I was
            also overweight, lustful, spiteful, insecure, and uninspired, which
            only exacerbated my desire for purpose.
          </p>
        </div>
      </Block>

      <Block title="how i pass the time">
        <p>Sometimes I climb rocks, and sometimes I injure my hand.</p>
        <p>
          I also enjoy pushing off the ground with one foot at a time in a
          cyclic pattern.
        </p>
        <p>
          Racket sports with either a whiffle ball or tennis ball are fun with
          friends.
        </p>
        <p>
          Since I was younger, my dad forced me to play a stupid “hit a small
          dimpled rubber ball that sat on a tee” game. These days I actually
          enjoy it.
        </p>
        <p>Lifting heavier every week (pr 1 rep flat bench 225 lbs).</p>
        <p>
          Bass Guitarist for a band comprised of buddies from middle school.
        </p>
        <p>An awful game called League of Legends (pr Masters).</p>
        <p>An even worse game called Valorant (pr Ascendant).</p>
      </Block>
      <Block title="reading list">
        <p>
          East of Eden by <i>John Steinback</i> (p.g. 184)
        </p>
        <p>
          School of Life by <i>Alain de Botton</i> (p.g. 59)
        </p>
        <p>
          Why We Sleep by <i>Matthew Walker</i> (p.g. 124)
        </p>
        <p>
          Gödel by <i>Escher Bach</i> (tbd)
        </p>
      </Block>
    </div>
  );
}

export default page;
