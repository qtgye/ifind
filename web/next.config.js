const path = require("path");
const PROJECT_ROOT = path.resolve(__dirname);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  distDir: "build",
  sassOptions: {
    includePaths: [path.resolve(PROJECT_ROOT, "src")],
  },
  redirects: async () => [
    {
      source: "/",
      destination: "/en/offers",
      permanent: true,
    },
    {
      source: "/:language",
      destination: "/:language/offers",
      permanent: true,
    },
  ],
  // exportPathMap: async () => ({}),
  images: {
    loader: "akamai",
    path: "",
  },
};

module.exports = nextConfig;
