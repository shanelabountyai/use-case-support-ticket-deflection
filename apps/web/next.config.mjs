/** @type {import('next').NextConfig} */
const nextConfig = {
  // @deflection/core and @deflection/db are workspace TypeScript, not built packages.
  transpilePackages: ["@deflection/core", "@deflection/db"],
};
export default nextConfig;
