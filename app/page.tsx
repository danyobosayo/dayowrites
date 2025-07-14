import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col gap-4">
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
          My name is Daniel Kim and I&apos;m currently a senior at The
          University of Texas at Dallas studying computer science.
        </p>
      </div>
      <div>
        <p>To list a few of the qualites I possess:</p>
        <li>
          In an effort to make perfect use of my time, I end up wasting more of
          it.
        </li>
        <li>I make promises to myself that I often end up breaking.</li>
        <li>I have a bunch of hobbies, but don&apos;t excel at any of them.</li>
        <li>And I often doubt myself and my accomplishments.</li>
      </div>
      <div>
        <p>But despite all of this, I can still thrive for one sole reason:</p>
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
