const Banner = require("../../models/Banner");
const { NotFoundError } = require("../../utils/errors");

class BannerService {
  static async createBanner(data, file) {
    if (file) {
      data.image = file.path;
    }
    const banner = new Banner(data);
    await banner.save();
    return banner;
  }

  static async getBanners(query = {}) {
    let filter = {};
    if (query.isActive !== undefined) {
      filter.isActive = query.isActive;
    }
    return await Banner.find(filter).sort({ createdAt: -1 });
  }

  static async updateBanner(id, data, file) {
    const banner = await Banner.findById(id);
    if (!banner) throw new NotFoundError("Banner not found");

    if (file) {
      data.image = file.path;
    }

    Object.assign(banner, data);
    await banner.save();
    return banner;
  }

  static async deleteBanner(id) {
    const banner = await Banner.findById(id);
    if (!banner) throw new NotFoundError("Banner not found");

    await banner.deleteOne();
    return { message: "Banner deleted successfully" };
  }
}

module.exports = BannerService;
