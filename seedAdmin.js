const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/Users");
const dotenv = require("dotenv");
dotenv.config();

const seedAdmin = async () => {
  await mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 30000,
  });

  const hashedPassword = await bcrypt.hash("admin123", 10);

  await User.create({
    name: "Admin",
    email: "admin@example.com",
    password: hashedPassword,
    role: "admin",
  });

  console.log("Admin user created sucessfully");
  process.exit();
};

seedAdmin().catch((err) => {
  console.error(err);
  process.exit(1);
});
