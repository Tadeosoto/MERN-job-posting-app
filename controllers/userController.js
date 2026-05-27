const User = require("../models/Users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cloudinary = require("../config/cloudinaryConfig");

exports.postUsers = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    const pic = req.file;
    if (!password) {
      return res
        .status(400)
        .json({ error: "Password field is required in request body" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User Already exists with this email" });
    }
    let picUrl = "";
    if (pic) {
      const uploadResult = await cloudinary.uploader.upload(
        `data:${pic.mimetype};base64,${pic.buffer.toString("base64")}`,
        {
          folder: "profile_pics",
        },
      );
      picUrl = uploadResult.secure_url;
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    // Seguridad básica: este endpoint de registro permite asignar roles
    // pero solo a employer/employee (admin debe crearse aparte).
    const allowedRoles = ["employer", "employee"];
    const userData = {
      name,
      email,
      password: hashedPassword,
      pic: picUrl,
    };

    if (role !== undefined) {
      if (typeof role !== "string" || !allowedRoles.includes(role)) {
        return res.status(400).json({ error: "Invalid role value" });
      }
      userData.role = role;
    }

    const user = new User(userData);
    await user.save();
    res.status(201).json({ message: "User registered sucessfully" });
  } catch (err) {
    next(err);
  }
};

exports.signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.SECRET_KEY,
      { expiresIn: "1d" },
    );
    res.json({
      token,
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        pic: user.pic,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getMe = async (req, res) => {
  res.json(req.user);
};

exports.getUsers = async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
};
