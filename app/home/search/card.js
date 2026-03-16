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
    author
}) {

    return (
        <div className="flex flex-col w-[200px] bg-[#282828] rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.89)] overflow-hidden">

            {/* Image */}
            <div className="relative w-full h-[160px] shrink-0">
                <Image
                    src={imageUrl}
                    alt={pageName}
                    fill
                    className="object-cover"
                />
            </div>

            {/* Content */}
            <div className="flex flex-col justify-between p-3 flex-1 overflow-hidden">
                <div className="flex flex-col gap-1">

                    {/* Page name */}
                    <h2 className="text-dbu-header font-semibold text-sm leading-tight truncate">
                        {pageName}
                    </h2>

                    {/* Tier of power stars */}
                    <div className="flex gap-0.5">
                        {Array.from({ length: 5 }, (_, i) => (
                            <span
                                key={i}
                                className={`text-xs ${i < tierOfPower ? "text-yellow-400" : "text-white/30"}`}
                            >
                                ★
                            </span>
                        ))}
                    </div>

                    {/* Page type + race restriction */}
                    <p className="text-dbu-text text-[0.65rem] leading-snug line-clamp-2">
                        {pageType}{raceRestriction ? ` · ${raceRestriction}` : ""}
                    </p>
                </div>

                {/* Bottom row: author + link */}
                <div className="flex items-center justify-between">
                    <span className="text-dbu-text text-[0.55rem]">{author}</span>
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