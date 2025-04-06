import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <p>Hello hi and welcome!</p>
        <p>
          My name is Daniel Kim: and I'm <i>not</i> just another person
        </p>
      </div>
      <div>
        <p>To list a few of the qualites I possess:</p>
        <p>
          - In a desperation to make perfect use of my time, I end up wasting a
          majority of it.
        </p>
        <p>- I make promises to myself that I often end up breaking.</p>
        <p>
          - I start a bunch of hobbies, but I don't necessarily excel at any of
          them.
        </p>
        <p>- And I often doubt myself and in my accomplishments.</p>
      </div>
      <div>
        <p>But despite all of this, one thing I can stand firm in is this:</p>
        <p>
          I am a child of God, eternally grateful for the salvation offered
          through Jesus Christ.
        </p>
      </div>
      <div>
        <p>
          So I ask of you to take the qualms of life with a grain of salt.
          Because in the end, you are not just another person, but so much more
          than that-- you are uniquely made, loved, and cherished by our divine
          creator.
        </p>
      </div>
      <hr className="border border-[#63725B] w-full"></hr>
      <div>
        <p>
          Feel free to explore my work, or reach out if you’d like to chat about
          life, faith, or the journeys we’re all on at sungsu.kim04@gmail.
        </p>
      </div>
      <div>
        <p>This is my resume.</p>
        <p>Here's some of my University notes.</p>
        <p>And this blog is a small passion project of mine.</p>
      </div>
    </div>
  );
}
