import { Types } from "mongoose";

export const toObjectId = (id) => {
  if (id instanceof Types.ObjectId) return id;
  if (typeof id === "string" && Types.ObjectId.isValid(id)) {
    return Types.ObjectId.createFromHexString(id);
  }
  throw new Error("Invalid ObjectId: " + id);
};
