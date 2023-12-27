import validator from "validator";
import bcrypt from "bcrypt";
import mongoose, { Query } from "mongoose";
export interface UserInput {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

import crypto from "crypto";

export interface UserDocument extends mongoose.Document {
  name: string;
  email: string;
  image: string;
  role: string;
  password: string | undefined;
  passwordConfirm: string | undefined;
  passwordChangedAt: Date;
  passwordResetToken: string;
  passwordResetExpires: Date;
  active: boolean | undefined;
  comparePassword(
    candidatePassword: string,
    userPassword: string
  ): Promise<boolean>;
  createPasswordResetToken(): string;
  passwordChangedAfter(JWTTimeStamp: number): boolean;
}

const userSchema = new mongoose.Schema<UserDocument>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      validate: [validator.isEmail, "Please provide a valid email"],
      unique: true,
      lowercase: true,
    },
    image: {
      type: String,
      default: "default.jpg",
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 8,
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, "Please confirm your password"],
      minlength: 8,
      validate: {
        // This only works on CREATE and SAVE!!!
        // So while updating user, we need to use save() method
        validator: function (this: UserDocument, val: string): boolean {
          return val === this.password;
        },
        message: "Confirm password is not the same as password",
      },
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next): Promise<void> {
  const user = this as UserDocument;
  // Only run this function if the password was actually modified
  if (!user.isModified("password")) return next();
  user.password = (await bcrypt.hash(user.password as string, 12)) as string;
  user.passwordConfirm = undefined;
  next();
});

userSchema.pre("save", function (next): void {
  if (!this.isModified("password") || this.isNew) return next();
  const user = this as UserDocument;
  user.passwordChangedAt = new Date(Date.now() - 1000);
  next();
});

userSchema.pre<Query<UserDocument, UserDocument>>(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

// Instance methods

userSchema.methods.comparePassword = async function (
  candidatePassword: string,
  userPassword: string
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.passwordChangedAfter = function (JWTTimeStamp: number) {
  if (this.passwordChangedAt) {
    const changedTimeStamp: number = Math.floor(
      this.passwordChangedAt.getTime() / 1000
    );
    return JWTTimeStamp < changedTimeStamp;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function (): string {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);
  return resetToken;
};

export const User = mongoose.model<UserDocument>("User", userSchema);
