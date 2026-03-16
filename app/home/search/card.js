/**
 * Content includes:
 * - Page Link
 * - Page Image
 * - Page Name
 * - Page Type
 *  - Awakening
 *      - Lesser Awakening
 *      - Greater Awakening
 *      - Super Awakening
 *  - Enhancement Power
 *      - Standard Enhancement
 *      - Special Enhancement
 *  - Form
 *      - Alternate Form
 *      - Legendary Form
 *  - Evolved Stage
 *  - Race
 *  - Factor
 * - Race Restriction?
 * - Tier of Power?
 * - Author
 */

import Image from "next/image";
import Link from "next/link";

export default function Card({
    link,
    imageUrl,
    pageName,
    pageType,
    raceRestriction,
    tierOfPower,
    author,
}) {
    return (
        <div
            className="card-glow flex flex-col w-full border border-[var(--card-color)] bg-[#282828] rounded-lg overflow-hidden transition-transform duration-200 hover:-translate-y-2"
            data-page-type={pageType}
        >
            <div className="relative w-full h-[160px] shrink-0">
                <Image
                    src={imageUrl}
                    alt={pageName}
                    fill
                    className="object-cover"
                />
            </div>
            <div className="flex flex-col justify-between p-3 flex-1 overflow-hidden">
                <div className="flex flex-col gap-1">
                    <h2 className="text-dbu-header font-semibold text-sm leading-tight truncate">
                        {pageName}
                    </h2>
                    <div className="flex gap-0.5">
                        {Array.from({ length: 7 }, (_, i) => (
                            <span
                                key={i}
                                className={`text-xs ${i < tierOfPower ? "text-yellow-400" : "text-white/30"}`}
                            >
                                ★
                            </span>
                        ))}{" "}
                    </div>
                    <div className="text-[0.5rem] italic">Tier of Power {tierOfPower}+</div>

                    {/* Page type + race restriction */}
                    <p className="text-dbu-text text-[0.65rem] leading-snug line-clamp-2 mt-1">
                        {pageType}{raceRestriction ? ` · ${raceRestriction}` : ""}
                    </p>
                </div>

                <div className="flex items-center justify-between mt-2">
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
            </div>

        </div>
    );
}