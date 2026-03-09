import AlternateRenderPage from "./Alternate";
import AwakeningRenderPage from "./Awakening";
import LegendaryRenderPage from "./Legendary";
import searchContent from "../../app/api/searchContent/route";

export async function generateMetadata({ params }) {
    const searchParam = await params;
    const resultArr = await searchContent(searchParam);

    if (resultArr.length < 1) {
        return {
            title: "Content Not Found",
            description:
                "The content you are looking for does not exist or has not been published yet.",
        };
    }

    const result = resultArr[0];

    const title = result.head.title;
    const description = result.head.desc;
    const image = result.head.banner;
    const slug = params.slug;
    const url = `https://dbu-homebrew.vercel.app/${slug}`;

    return {
        title,
        description,

        alternates: {
            canonical: url,
        },

        openGraph: {
            title,
            description,
            url,
            type: "website",
            images: [
                {
                    url: image,
                    width: 1200,
                    height: 630,
                    alt: title,
                },
            ],
        },

        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [image],
        },
    };
}

/**
 * Handles generating one page from the [slug] page request. Decides which render method to use depending on the transformationType received.
 * @returns
 */

export default function SinglePageGenerator({ content }) {
    switch (content.head.identity) {
        case "Awakening":
            return (
                <div>
                    <AwakeningRenderPage content={content} />
                </div>
            );
        case "Alternate":
            return (
                <div>
                    <AlternateRenderPage content={content}/>
                </div>
            )
        case "Legendary":
            return(
                <div>
                    <LegendaryRenderPage content={content} />
                </div>
            )
        case "Temp":
            return <></>;
        default:
            return <>Something went wrong.</>;
            break;
    }
}
