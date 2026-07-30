const BannerService = require("./bannerService");
const { ResponseFormatter } = require("../../utils/response");

class BannerController {
  static async createBanner(req, res, next) {
    try {
      const banner = await BannerService.createBanner(req.body, req.file);
      return ResponseFormatter.success(res, "Banner created successfully", banner, 201);
    } catch (error) {
      next(error);
    }
  }

  static async getBanners(req, res, next) {
    try {
      const banners = await BannerService.getBanners(req.query);
      return ResponseFormatter.success(res, "Banners retrieved successfully", banners);
    } catch (error) {
      next(error);
    }
  }

  static async getActiveBanners(req, res, next) {
    try {
      const banners = await BannerService.getBanners({ isActive: true });
      return ResponseFormatter.success(res, "Active banners retrieved successfully", banners);
    } catch (error) {
      next(error);
    }
  }

  static async updateBanner(req, res, next) {
    try {
      const banner = await BannerService.updateBanner(req.params.id, req.body, req.file);
      return ResponseFormatter.success(res, "Banner updated successfully", banner);
    } catch (error) {
      next(error);
    }
  }

  static async deleteBanner(req, res, next) {
    try {
      const result = await BannerService.deleteBanner(req.params.id);
      return ResponseFormatter.success(res, result.message, null);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = BannerController;
