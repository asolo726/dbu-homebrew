import CommentSection from "../comments/CommentSection";
import CommunitySettings from "../dbu/General/CommunitySettings";
import { auth } from "../../auth";
import { getIsAdmin } from "../../lib/getIsAdmin";
import { normalizePageContent } from "../../lib/normalizePageContent";
import Head from "../dbu/General/head";
import Section from "../dbu/General/Section";

export default async function SinglePageGenerator({ content }) {
	const session = await auth();
	const isAdmin = await getIsAdmin(session?.user?.email);
	const normalizedContent = normalizePageContent(content);

	const pageRenderStyle =
		"flex flex-col flex-col-1 w-full max-w-5xl justify-center content-center";

	return (
		<div className={pageRenderStyle}>
			{normalizedContent ? (
				<>
					<div className="px-4 pb-4">
						<div className="flex flex-col flex-col-1 w-full max-w-5xl mx-auto px-10 py-10 md:px-25 sm:m-10 justify-center content-center text-wrap bg-dbu-bg3 sm:rounded-[4em]">
							<Head Form={normalizedContent} />
							<Section
								body={normalizedContent.body}
								basePath="body"
							/>
						</div>
						<CommunitySettings
							keyName={normalizedContent.data.keyName}
							isCommunity={
								normalizedContent.head.isCommunity ?? false
							}
						/>
					</div>
					<div className="px-4 pb-16">
						<CommentSection
							pageKey={normalizedContent.data.keyName}
							session={session}
							pageAuthor={normalizedContent.data.author}
							viewerIsAdmin={isAdmin}
						/>
					</div>
				</>
			) : (
				<>Something went wrong...</>
			)}
		</div>
	);
}
