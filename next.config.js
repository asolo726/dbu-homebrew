module.exports = {
  images: {
    remotePatterns: [
      new URL("https://9pensrt47gzxrsro.public.blob.vercel-storage.com/**"),
      new URL("https://dbu-rpg-northgalaxy.vercel.app/**"),
    ],
  },
  async redirects() {
    return [
      // {
      //   source: "/",
      //   destination: "/home", // Replace with your desired default page path
      //   permanent: true,
      // },
    ];
  },
};
