const Jobs = require("../models/Jobs");
const User = require("../models/Users");
const fs = require("fs");
const transporter = require("../middleware/nodeConfig");
const path = require("path");

function canManageJob(job, user) {
  if (!job || !user) return false;
  if (user.role === "admin") return true;
  if (user.role === "employer" && job.postedBy) {
    return job.postedBy.toString() === user._id.toString();
  }
  return false;
}

function canPostJobs(user) {
  return user?.role === "admin" || user?.role === "employer";
}

exports.postJob = async (req, res) => {
  try {
    if (!canPostJobs(req.user)) {
      return res.status(403).json({
        message: "Only employers and admins can post jobs",
      });
    }

    const { title, company, location, salary } = req.body;
    const job = await Jobs.create({
      title,
      company,
      location,
      salary,
      postedBy: req.user._id,
    });

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
    const term = typeof search === "string" ? search.trim() : "";
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
      Jobs.find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .populate("postedBy", "name email"),
      Jobs.countDocuments(filter),
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
  const job = await Jobs.findById(req.params.id).populate(
    "postedBy",
    "name email",
  );
  if (!job) return res.status(404).json({ error: "Job not found" });
  res.json(job);
};

exports.updateJob = async (req, res) => {
  try {
    const job = await Jobs.findById(req.params.id);
    if (!job) return res.status(404).json({ error: "Job not found" });

    if (!canManageJob(job, req.user)) {
      return res.status(403).json({
        message: "You can only edit jobs you posted",
      });
    }

    const { title, company, location, salary } = req.body;
    if (title !== undefined) job.title = title;
    if (company !== undefined) job.company = company;
    if (location !== undefined) job.location = location;
    if (salary !== undefined) job.salary = salary;

    await job.save();
    res.json(job);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteJob = async (req, res, next) => {
  try {
    const job = await Jobs.findById(req.params.id);
    if (!job) return res.status(404).json({ error: "Job not found" });

    if (!canManageJob(job, req.user)) {
      return res.status(403).json({
        message: "You can only delete jobs you posted",
      });
    }

    await job.deleteOne();
    res.json({ message: `Job: '${job.title}' deleted successfully` });
  } catch (err) {
    next(err);
  }
};
