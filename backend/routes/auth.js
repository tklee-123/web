const authController = require("../controllers/authControllers");
const middlewareController = require("../controllers/middlewareController");

const router = require("express").Router();

router.post("/register", authController.registerUser);

router.post("/login", authController.loginUser);
router.post("/report", authController.weekly_report);
router.post("/add_news", authController.add_news);
router.post("/final_report", authController.final_report);
router.post("/result", authController.add_result);
router.get("/get_result", authController.get_result);

// Log out
router.post("/logout", middlewareController.verifyToken, authController.userLogout);

module.exports = router;
