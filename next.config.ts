import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // The old scribbles page is gone; the nav links straight to the blog
      // now, and this keeps old bookmarks working.
      {
        source: "/scribbles",
        destination: "https://scribbles.danielsungsu.kim/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
