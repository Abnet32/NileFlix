import mongoose from "mongoose";

function getMongoUri() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("Missing MONGODB_URI");
  }

  return uri;
}

declare global {
  // eslint-disable-next-line no-var
  var _mongooseConnection:
    | {
        promise: Promise<typeof mongoose> | null;
        connection: typeof mongoose | null;
      }
    | undefined;
}

const cached = global._mongooseConnection ?? {
  promise: null,
  connection: null,
};

if (!global._mongooseConnection) {
  global._mongooseConnection = cached;
}

export async function connectMongoose() {
  const uri = getMongoUri();

  if (cached.connection) {
    return cached.connection;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(uri);
  }

  cached.connection = await cached.promise;
  return cached.connection;
}

export { mongoose };
