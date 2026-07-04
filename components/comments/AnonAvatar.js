const ANON_AVATAR_URL =
  "https://9pensrt47gzxrsro.public.blob.vercel-storage.com/goku_anon_icon.png";

export default function AnonAvatar({ size = 48 }) {
  return (
    <img
      src={ANON_AVATAR_URL}
      alt="Anonymous"
      style={{ width: size, height: size, minWidth: size }}
      className="rounded-full object-cover"
    />
  );
}
