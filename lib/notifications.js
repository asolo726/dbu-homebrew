import { ObjectId } from "mongodb";
import clientPromise from "./mongoDBClient";
import { sendEmail } from "./email";

const UPVOTE_MILESTONES = [10, 100, 500];
const VIEW_MILESTONES = [100, 1000, 10000];

export const DEFAULT_NOTIFICATION_SETTINGS = {
  masterEnabled: true,
  comments: { mode: "replies-only" }, // "all" | "replies-only" | "disabled"
  upvotes: { enabled: true },
  views: { enabled: true },
};

function mergeWithDefaults(stored) {
  return {
    masterEnabled: stored?.masterEnabled ?? DEFAULT_NOTIFICATION_SETTINGS.masterEnabled,
    comments: { mode: stored?.comments?.mode ?? DEFAULT_NOTIFICATION_SETTINGS.comments.mode },
    upvotes: { enabled: stored?.upvotes?.enabled ?? DEFAULT_NOTIFICATION_SETTINGS.upvotes.enabled },
    views: { enabled: stored?.views?.enabled ?? DEFAULT_NOTIFICATION_SETTINGS.views.enabled },
  };
}

async function findPageByKey(pageKey) {
  const client = await clientPromise;
  const contentDb = client.db("content");
  const collections = await contentDb.listCollections({}, { nameOnly: true }).toArray();
  for (const col of collections) {
    const page = await contentDb
      .collection(col.name)
      .findOne({ "head.keyName": pageKey }, { projection: { "head.author": 1, "head.title": 1 } });
    if (page) return page.head;
  }
  return null;
}

async function findUserByName(name) {
  const client = await clientPromise;
  return client
    .db()
    .collection("users")
    .findOne({ name }, { projection: { email: 1, notificationSettings: 1 } });
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const siteUrl = () => process.env.NEXTAUTH_URL || "https://dbuhomebrew.com";

function emailWrapper(body) {
  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#f4f4f5;border-radius:8px;">
      ${body}
      <p style="color:#888;font-size:12px;margin-top:28px;">
        Manage your preferences in
        <a href="${siteUrl()}/home/settings" style="color:#e53e3e;">Notification Settings</a>.
      </p>
    </div>`;
}

function viewPageBtn(pageKey) {
  return `<a href="${siteUrl()}/${pageKey}"
    style="display:inline-block;margin-top:16px;padding:10px 20px;background:#e53e3e;color:#fff;text-decoration:none;border-radius:4px;font-size:14px;">
    View Page
  </a>`;
}

// ─── Notify page author on a new top-level comment ──────────────────────────

export async function notifyPageAuthorNewComment({ pageKey, commenterEmail, commenterName, commentText }) {
  try {
    const page = await findPageByKey(pageKey);
    if (!page) return;

    const authorUser = await findUserByName(page.author);
    if (!authorUser?.email || authorUser.email === commenterEmail) return;

    const settings = mergeWithDefaults(authorUser.notificationSettings);
    if (!settings.masterEnabled || settings.comments.mode !== "all") return;

    const preview = commentText.length > 300 ? commentText.slice(0, 300) + "…" : commentText;
    await sendEmail({
      to: authorUser.email,
      subject: `New comment on "${page.title}"`,
      html: emailWrapper(`
        <h2 style="color:#222;margin-top:0;">New comment on your page</h2>
        <p style="color:#444;"><strong>${escapeHtml(commenterName)}</strong> commented on
          <strong>${escapeHtml(page.title)}</strong>:</p>
        <blockquote style="background:#fff;border-left:4px solid #e53e3e;padding:12px 16px;margin:16px 0;color:#333;border-radius:0 4px 4px 0;">
          ${escapeHtml(preview)}
        </blockquote>
        ${viewPageBtn(pageKey)}
      `),
    });
  } catch (err) {
    console.error("[Notifications] notifyPageAuthorNewComment:", err.message);
  }
}

// ─── Notify comment/reply author on a new reply ──────────────────────────────

export async function notifyParentAuthorOnReply({ commentId, parentReplyId, replierEmail, replierName, replyText }) {
  try {
    const client = await clientPromise;
    const comment = await client
      .db("Main")
      .collection("comments")
      .findOne({ _id: new ObjectId(commentId) }, { projection: { userId: 1, pageKey: 1, replies: 1 } });
    if (!comment) return;

    let recipientEmail;
    if (parentReplyId) {
      const parentReply = comment.replies?.find((r) => r._id === parentReplyId);
      recipientEmail = parentReply?.userId || null;
    } else {
      recipientEmail = comment.userId || null;
    }

    if (!recipientEmail || recipientEmail === replierEmail) return;

    const recipientUser = await client
      .db()
      .collection("users")
      .findOne({ email: recipientEmail }, { projection: { notificationSettings: 1 } });
    if (!recipientUser) return;

    const settings = mergeWithDefaults(recipientUser.notificationSettings);
    if (!settings.masterEnabled || settings.comments.mode === "disabled") return;

    const page = await findPageByKey(comment.pageKey);
    const preview = replyText.length > 300 ? replyText.slice(0, 300) + "…" : replyText;

    await sendEmail({
      to: recipientEmail,
      subject: `New reply to your comment${page ? ` on "${page.title}"` : ""}`,
      html: emailWrapper(`
        <h2 style="color:#222;margin-top:0;">Someone replied to your comment</h2>
        <p style="color:#444;"><strong>${escapeHtml(replierName)}</strong> replied${page ? ` on <strong>${escapeHtml(page.title)}</strong>` : ""}:</p>
        <blockquote style="background:#fff;border-left:4px solid #e53e3e;padding:12px 16px;margin:16px 0;color:#333;border-radius:0 4px 4px 0;">
          ${escapeHtml(preview)}
        </blockquote>
        ${page ? viewPageBtn(comment.pageKey) : ""}
      `),
    });
  } catch (err) {
    console.error("[Notifications] notifyParentAuthorOnReply:", err.message);
  }
}

// ─── Check & notify page author on upvote milestones ─────────────────────────

export async function checkAndNotifyUpvoteMilestone({ keyName }) {
  try {
    const client = await clientPromise;
    const col = client.db("Main").collection("statistics");
    const stats = await col.findOne({ keyName }, { projection: { upvotes: 1, notifiedUpvoteMilestones: 1 } });
    if (!stats) return;

    const notified = stats.notifiedUpvoteMilestones || [];
    const pending = UPVOTE_MILESTONES.filter((m) => stats.upvotes >= m && !notified.includes(m));

    for (const milestone of pending) {
      // Atomic claim — only one racing request wins
      const claim = await col.updateOne(
        { keyName, notifiedUpvoteMilestones: { $ne: milestone } },
        { $addToSet: { notifiedUpvoteMilestones: milestone } }
      );
      if (claim.modifiedCount === 0) continue;

      const page = await findPageByKey(keyName);
      if (!page) continue;

      const authorUser = await findUserByName(page.author);
      if (!authorUser?.email) continue;

      const settings = mergeWithDefaults(authorUser.notificationSettings);
      if (!settings.masterEnabled || !settings.upvotes.enabled) continue;

      await sendEmail({
        to: authorUser.email,
        subject: `"${page.title}" reached ${milestone.toLocaleString()} upvotes!`,
        html: emailWrapper(`
          <h2 style="color:#222;margin-top:0;">🎉 Upvote Milestone!</h2>
          <p style="color:#444;">Your page <strong>${escapeHtml(page.title)}</strong> just reached
            <strong>${milestone.toLocaleString()} upvotes</strong>. Congratulations!</p>
          ${viewPageBtn(keyName)}
        `),
      });
    }
  } catch (err) {
    console.error("[Notifications] checkAndNotifyUpvoteMilestone:", err.message);
  }
}

// ─── Check & notify page author on view milestones ───────────────────────────

export async function checkAndNotifyViewMilestone({ keyName, newViews }) {
  try {
    const client = await clientPromise;
    const col = client.db("Main").collection("statistics");
    const stats = await col.findOne({ keyName }, { projection: { notifiedViewMilestones: 1 } });

    const notified = stats?.notifiedViewMilestones || [];
    const pending = VIEW_MILESTONES.filter((m) => newViews >= m && !notified.includes(m));

    for (const milestone of pending) {
      const claim = await col.updateOne(
        { keyName, notifiedViewMilestones: { $ne: milestone } },
        { $addToSet: { notifiedViewMilestones: milestone } }
      );
      if (claim.modifiedCount === 0) continue;

      const page = await findPageByKey(keyName);
      if (!page) continue;

      const authorUser = await findUserByName(page.author);
      if (!authorUser?.email) continue;

      const settings = mergeWithDefaults(authorUser.notificationSettings);
      if (!settings.masterEnabled || !settings.views.enabled) continue;

      await sendEmail({
        to: authorUser.email,
        subject: `"${page.title}" reached ${milestone.toLocaleString()} views!`,
        html: emailWrapper(`
          <h2 style="color:#222;margin-top:0;">🎉 View Milestone!</h2>
          <p style="color:#444;">Your page <strong>${escapeHtml(page.title)}</strong> just reached
            <strong>${milestone.toLocaleString()} views</strong>. Congratulations!</p>
          ${viewPageBtn(keyName)}
        `),
      });
    }
  } catch (err) {
    console.error("[Notifications] checkAndNotifyViewMilestone:", err.message);
  }
}
