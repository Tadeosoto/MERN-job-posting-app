const express = require("express");
const router = express.Router();
const {
  postJob,
  getAllJobs,
  fetchSingleJob,
  updateJob,
  deleteJob,
} = require("../controllers/jobController");
router.post("/jobs", postJob);
router.get("/jobs", getAllJobs);
router.get("/jobs/:id", fetchSingleJob);
router.put("/jobs/:id", updateJob);
router.delete("/jobs/:id", deleteJob);
module.exports = router;
