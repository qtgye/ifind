const path = require("path");
const PROJECT_ROOT = path.resolve(__dirname);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  distDir: "build",
  trailingSlash: true,
  sassOptions: {
    includePaths: [path.resolve(PROJECT_ROOT, "src")],
  },
  // exportPathMap: async () => ({}),
  images: {
    loader: "akamai",
    path: "",
  },
};

module.exports = nextConfig;
