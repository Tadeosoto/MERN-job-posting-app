const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const {
  getUsers,
  getMe,
  postUsers,
  signIn,
} = require("../controllers/userController");
const { protect, adminOnly } = require("../middleware/authMiddleware");
router.get("/users/me", protect, getMe);
router.get("/users", protect, adminOnly, getUsers);
router.post("/users/signin", signIn);
router.post("/users", upload.single("pic"), postUsers);
module.exports = router;
