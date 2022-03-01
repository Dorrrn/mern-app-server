const router = require("express").Router();
const authRoutes = require("./auth.routes");
const projectRoutes = require("./project.routes");
const taskRoutes = require("./task.routes");

const { isAuthenticated } = require("../middleware/jwt.middleware");

/* GET home page */
router.get("/", (req, res, next) => {
  res.json("All good in here");
});

/* All routes are mounting on /api */
router.use("/auth", authRoutes);
router.use("/projects", isAuthenticated, projectRoutes);
router.use("/tasks", isAuthenticated, taskRoutes);

module.exports = router;
