import { auth } from "../../../auth";
import clientPromise from "../../../lib/mongoDBClient";
import SettingsClient from "../../../components/settings/SettingsClient";

export default async function SettingsPage() {
  const session = await auth();

  const client = await clientPromise;

  const testDb = client.db(); // use URI default — same db the MongoDBAdapter writes users to
  const userData =
    (await testDb.collection("users").findOne(
      { email: session.user.email },
      { projection: { _id: 0 } }
    )) ?? {
      name: session.user.name,
      email: session.user.email,
      image: session.user.image,
    };

  const contentDb = client.db("content");
  const collections = await contentDb.listCollections({}, { nameOnly: true }).toArray();
  const pageResponse = {};
  for (const col of collections) {
    pageResponse[col.name] = await contentDb
      .collection(col.name)
      .find({}, { projection: { _id: 0 } })
      .toArray();
  }

  const statsArr = await client
    .db("Main")
    .collection("statistics")
    .find({}, { projection: { _id: 0 } })
    .toArray();
  const statsMap = Object.fromEntries(statsArr.map((s) => [s.keyName, s]));

  for (const col of Object.keys(pageResponse)) {
    pageResponse[col] = pageResponse[col].map((entry) => {
      const stats = statsMap[entry.head?.keyName];
      entry.head.upvotes = stats?.upvotes ?? 0;
      entry.head.downvotes = stats?.downvotes ?? 0;
      entry.head.views = stats?.views ?? 0;
      return entry;
    });
  }

  return (
    <SettingsClient
      user={JSON.parse(JSON.stringify(userData))}
      pageData={{ Response: JSON.parse(JSON.stringify(pageResponse)) }}
    />
  );
}
