const express = require("express");
const middlewareController = require("../controllers/middlewareController");
const userController = require("../controllers/userController");

const router = express.Router();

// Lấy tất cả các hồ sơ (Chỉ Admin có quyền)
router.get("/teacher/teacher-mana", middlewareController.verifyTokenAndAdmin, userController.getAllProfiles);

// Lấy hồ sơ người dùng (Admin hoặc người dùng)
router.get("/teacher/teacher-mana/:id", middlewareController.verifyToken, userController.getProfile);

// Cập nhật hồ sơ người dùng (Admin hoặc người dùng)
router.put("/teacher/teacher-mana/:id", middlewareController.verifyToken, userController.updateProfile);

// Tạo hồ sơ cho sinh viên có profile null (Chỉ Admin có quyền)
router.post("/teacher/student-mana/:id", middlewareController.verifyTokenAndAdmin, userController.createProfile);

// Xoá hồ sơ người dùng (Chỉ Admin có quyền)
router.delete("/teacher/teacher-mana/:id", middlewareController.verifyTokenAndAdmin, userController.deleteProfile);

module.exports = router;
