import Image from "next/image";

export default function Home() {
  return (
    <div className="flex overflow-scroll scrollbar-hide flex-col gap-4">
      <div>
        <div className="flex justify-center pt-4 pb-8">
          <Image
            src="/assets/selfie.jpeg"
            height={4032}
            width={3024}
            alt="selfie of Daniel Kim"
            className="border-hover border-2 w-[400px]"
          ></Image>
        </div>
        <p>Hello and welcome!</p>
        <p>
          My name is Daniel Kim and I&apos;m currently a full stack developer
          for CAPCE, a non-profit that accredits recertification courses for EMS
          professionals.
        </p>
      </div>
      <div>
        <p>To list a few of the qualites I possess:</p>
        <li>
          I obsess over my image and care WAY too much about what others think
          of me.
        </li>
        <li>
          I often set unrealistic goals, and I mentally break when I don&apos;t
          achieve them.
        </li>
        <li>
          I like trying a bunch of different hobbies, but I&apos;ve never
          committed to excelling at one because I&apos;m afraid of not being good
          at it.
        </li>
        <li>I downplay myself and have insane imposter syndrome.</li>
      </div>
      <div>
        <p>But despite all of this, I&apos;m content in life for one sole reason:</p>
        <p>
          His name is Jesus Christ, and I would love to share about how
          he&apos;s changed my life.
        </p>
      </div>
      <hr className="border border-hover w-full"></hr>
      <div>
        <p>
          Feel free to explore this website. Or better yet,{" "}
          <a className=" hyperlink" href="/contact">
            reach out
          </a>{" "}
          if you&apos;d like to chat about life, faith, or anything in between.
        </p>
      </div>
      <div>
        <p>
          Here&apos;s my{" "}
          <a className="hyperlink" href="" target="_blank">
            resume
          </a>
          .
        </p>
        <p>And this is where I thank you for making it to the end. </p>
        <p className="font-bold">Ave atque vale</p>
      </div>
    </div>
  );
}
