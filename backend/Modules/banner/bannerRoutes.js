const express = require("express");
const router = express.Router();
const BannerController = require("./bannerController");
const bannerUpload = require("../../middlewares/bannerUpload");
const { authenticateAdmin } = require("../../middlewares/auth");

// Public routes
router.get("/active", BannerController.getActiveBanners);

// Admin routes
router.use(authenticateAdmin);
router.post("/", bannerUpload.single("image"), BannerController.createBanner);
router.get("/", BannerController.getBanners);
router.put("/:id", bannerUpload.single("image"), BannerController.updateBanner);
router.delete("/:id", BannerController.deleteBanner);

module.exports = router;
