const router = require("express").Router();
const authRoutes = require("./auth.routes");
const userRoutes = require("./user.routes")

const { isAuthenticated } = require("../middleware/jwt.middleware");

/* GET home page */
router.get("/", (req, res, next) => {
  res.json("All good in here");
});

/* All routes are mounting on /api */
router.use("/auth", authRoutes);
router.use("/users", userRoutes );


module.exports = router;
