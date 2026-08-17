const isVercelBuild = process.env.VERCEL === "1" || process.env.NITRO_PRESET === "vercel";

const config = isVercelBuild
  ? { plugins: {} }
  : {
      plugins: {
        "@tailwindcss/postcss": {},
      },
    };

export default config;
