import { MongoDBAdapter } from "@auth/mongodb-adapter";
import client from "./mongoDBClient";

const mongoAdapter = MongoDBAdapter(client);

export default mongoAdapter;
