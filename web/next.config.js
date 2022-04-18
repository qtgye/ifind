const path = require("path");
const PROJECT_ROOT = path.resolve(__dirname);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.resolve(PROJECT_ROOT, "src")],
  },
};

module.exports = nextConfig;
