const Jobs = require("../models/Jobs");
const User = require("../models/Users");
const fs = require("fs");
const transporter = require("../middleware/nodeConfig");
const path = require("path");

exports.postJob = async (req, res) => {
  try {
    const job = await Jobs.create(req.body);
    const employees = await User.find({ role: "employee" });

    const templatePath = path.join(__dirname, "Email.html");
    let emailTemplate = fs.readFileSync(templatePath, "utf8");
    emailTemplate = emailTemplate
      .replace("{{jobTitle}}", job.title)
      .replace("{{company}}", job.company)
      .replace("{{location}}", job.location)
      .replace("{{salary}}", job.salary)
      .replace("{{createdAt}}", new Date(job.createdAt).toLocaleDateString());
    for (let employee of employees) {
      const mailOptions = {
        from: process.env.EMAIL,
        to: `${employee.email},${process.env.EMAIL}`,
        subject: "New Job Opportunity Posted",
        html: emailTemplate,
      };
      await transporter.sendMail(mailOptions);
    }
    res.status(201).json(job);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
exports.getAllJobs = async (req, res, next) => {
  try {
    const filter = {};

    const search = req.query.search;
    const term =
      typeof search === "string" ? search.trim() : "";
    if (term && term !== "undefined") {
      filter.$or = [
        { title: { $regex: term, $options: "i" } },
        { company: { $regex: term, $options: "i" } },
        { location: { $regex: term, $options: "i" } },
      ];
    }

    if (req.query.location) {
      filter.location = req.query.location;
    }

    const sortBy = req.query.sort || "-createdAt";
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 12;
    const skip = (page - 1) * limit;

    const [jobs, totalJobs] = await Promise.all([
      Jobs.find(filter).sort(sortBy).skip(skip).limit(limit),
      Jobs.countDocuments(filter), // use same filter for total
    ]);

    res.json({
      success: true,
      total: totalJobs,
      page,
      limit,
      data: jobs,
    });
  } catch (err) {
    next(err);
  }
};
exports.fetchSingleJob = async (req, res) => {
  const job = await Jobs.findById(req.params.id);
  if (!job) return res.status(404).json({ error: "Job not found" });
  res.json(job);
};

exports.updateJob = async (req, res) => {
  const job = await Jobs.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!job) return res.status(404).json({ error: "Job not found" });
  res.json(job);
};

exports.deleteJob = async (req, res, next) => {
  try {
    const job = await Jobs.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ error: "Job not found" });
    res.json({ message: `$Job: '${job.title}' deleted successfully` });
  } catch (err) {
    next(err);
  }
};
