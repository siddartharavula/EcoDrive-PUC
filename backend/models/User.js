
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },

    phone: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
      match: [/^[6-9]\d{9}$/, "Enter a valid 10-digit phone number"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 8,
      select: false,
    },

    licenceNumber: {
      type: String,
      required: [true, "Licence number is required"],
      unique: true,
      uppercase: true,
      trim: true,
    },

    address: {
      houseNumber: {
        type: String,
        required: true,
        trim: true,
      },
      street: {
        type: String,
        required: true,
        trim: true,
      },
      city: {
        type: String,
        required: true,
        trim: true,
      },
      state: {
        type: String,
        required: true,
        trim: true,
      },
      pinCode: {
        type: String,
        required: true,
        match: [/^[1-9][0-9]{5}$/, "Enter a valid PIN code"],
      },
    },

    role: {
      type: String,
      enum: ["user", "puc_updater", "police", "admin"],
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);

// Hash password only when it is modified.
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare entered password with hashed password.
userSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
