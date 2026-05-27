const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/Users");
const dotenv = require("dotenv");
dotenv.config();

const ADMIN_EMAIL = "admin@example.com";
const ADMIN_PASSWORD = "admin123";

const seedAdmin = async () => {
  await mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 30000,
  });

  const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
  const existing = await User.findOne({ email: ADMIN_EMAIL });

  if (existing) {
    existing.password = hashedPassword;
    existing.role = "admin";
    existing.name = existing.name || "Admin";
    await existing.save();
    console.log("Admin already existed — password reset to:", ADMIN_PASSWORD);
  } else {
    await User.create({
      name: "Admin",
      email: ADMIN_EMAIL,
      password: hashedPassword,
      role: "admin",
    });
    console.log("Admin user created successfully");
  }

  console.log("Login with:");
  console.log("  Email:   ", ADMIN_EMAIL);
  console.log("  Password:", ADMIN_PASSWORD);
  process.exit();
};

seedAdmin().catch((err) => {
  console.error(err);
  process.exit(1);
});
