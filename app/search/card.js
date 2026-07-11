import Image from "next/image";
import Link from "next/link";
import PageVoteButtons from "../../components/pages/PageVoteButtons";

export default function Card({
  link,
  imageUrl,
  pageName,
  pageType,
  raceRestriction,
  tierOfPower,
  author,
  enhancementType,
  awakeningType,
  awakeningOrigin,
  tag,
  keyName,
  upvotes = 0,
  views = 0,
}) {
  const pageTypeDisplay = {
    Awakening: "Awakening",
    Enhancement: "Enhancement Power",
    Alternate: "Alternate Form",
    Legendary: "Legendary Form",
    "Evolved Stage": "Evolved Stage",
    Race: "Race",
    Factor: "Racial Factor",
    Other: "Other",
  };
  const ToPIsString = typeof tierOfPower === "string";
  const ToP = ToPIsString
    ? tierOfPower.match(/\d+\.?\d*/g).map(Number)
    : tierOfPower;
  const cardAttributes = [
    raceRestriction,
    pageTypeDisplay[pageType],
    enhancementType,
    awakeningType,
    awakeningOrigin,
    tag,
  ];

  return (
    <div
      className="card-glow flex flex-col w-full border border-[var(--card-color)] bg-[#282828] rounded-lg overflow-hidden transition-transform duration-200 hover:-translate-y-2"
      data-page-type={pageType.toLowerCase().trim()}
    >
      <div className="relative w-full h-[160px] shrink-0">
        <Image
          src={imageUrl}
          alt={pageName}
          fill
          sizes="(min-width: 1280px) 220px, (min-width: 768px) 33vw, 50vw"
          quality={100}
          className="object-cover"
        />
      </div>
      <div className="flex flex-col justify-between p-3 flex-1 overflow-hidden">
        <div className="flex flex-col gap-1">
          <h2 className="text-dbu-header font-semibold text-sm leading-tight truncate">
            {pageName}
          </h2>
          {tierOfPower ? (
            <>
              <div className="flex gap-0.5">
                {Array.from({ length: 7 }, (_, i) => (
                  <span
                    key={i}
                    className={`text-xs ${i < ToP ? "text-yellow-400" : "text-white/30"}`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <div className="text-[0.5rem] italic">
                {`Tier of Power ${tierOfPower}`}
                {!isNaN(tierOfPower) ? `+` : ` `}
              </div>
            </>
          ) : (
            <></>
          )}
          <p className="text-dbu-text text-[0.65rem] leading-snug line-clamp-2 mt-1">
            {cardAttributes.filter(Boolean).join(" · ")}
          </p>
        </div>

        <div className="flex flex-col mt-2 gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-dbu-header text-[0.55rem]">{author}</span>
            {link && (
              <Link
                href={link}
                className="text-[0.65rem] bg-dbu-link/90 hover:bg-dbu-link text-white px-3 py-1 rounded-full transition-colors"
              >
                View Page
              </Link>
            )}
          </div>
          {keyName && (
            <div className="flex items-center justify-between">
              <PageVoteButtons
                keyName={keyName}
                initialUpvotes={upvotes}
                small
              />
              <span className="flex items-center gap-1 text-gray-500 text-[0.6rem]">
                👁 {views}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
