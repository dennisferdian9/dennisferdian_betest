import mongoose, { Schema } from "mongoose";

interface accountLogin {
  userId: String;
  fullName: String;
  accountNumber: Number;
  emailAddress: String;
  registrationNumber: Number;
}

const accountLoginSchema = new Schema<accountLogin & Document>({
  userId: String,
  fullName: String,
  accountNumber: String,
  emailAddress: String,
  registrationNumber: Number,
});

export const accountLoginModel = mongoose.model<accountLogin & Document>('accountLogin', accountLoginSchema);

interface userInfo {
  accountId: String,
  fullName: String,
  password: String,
  lastLoginDateTime?: Date
  userId: String,
}

const userInfoSchema = new Schema<userInfo & Document>({
  accountId: String,
  fullName: String,
  password: String,
  lastLoginDateTime: Date,
  userId: String,
});

export const userInfoSchemaModel = mongoose.model<userInfo & Document>('userInfo', userInfoSchema);

