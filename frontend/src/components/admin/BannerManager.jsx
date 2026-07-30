import React, { useState, useEffect } from "react";
import { bannerApi } from "../../services/api/bannerApi";
import { toast } from "react-toastify";
import { Plus, Edit2, Trash2, Image as ImageIcon } from "lucide-react";
import { Modal, Loader } from "../common";

const BannerManager = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    link: "",
    isActive: true,
  });
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const res = await bannerApi.getBanners();
      if (res.success) {
        setBanners(res.data);
      }
    } catch (error) {
      toast.error("Failed to fetch banners");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (banner = null) => {
    if (banner) {
      setEditingBanner(banner);
      setFormData({
        title: banner.title,
        subtitle: banner.subtitle || "",
        link: banner.link || "",
        isActive: banner.isActive,
      });
      setImageFile(null);
    } else {
      setEditingBanner(null);
      setFormData({
        title: "",
        subtitle: "",
        link: "",
        isActive: true,
      });
      setImageFile(null);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("subtitle", formData.subtitle);
      data.append("link", formData.link);
      data.append("isActive", formData.isActive);
      
      if (imageFile) {
        data.append("image", imageFile);
      }

      let res;
      if (editingBanner) {
        res = await bannerApi.updateBanner(editingBanner._id, data);
      } else {
        res = await bannerApi.createBanner(data);
      }

      if (res.success) {
        toast.success(`Banner ${editingBanner ? "updated" : "created"} successfully`);
        fetchBanners();
        setIsModalOpen(false);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Operation failed");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this banner?")) {
      try {
        const res = await bannerApi.deleteBanner(id);
        if (res.success) {
          toast.success("Banner deleted successfully");
          fetchBanners();
        }
      } catch (error) {
        toast.error("Failed to delete banner");
      }
    }
  };

  if (loading) return <div className="flex h-64 items-center justify-center"><Loader /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Banner Management</h2>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-bold text-sm"
        >
          <Plus size={16} />
          Add Banner
        </button>
      </div>

      {banners.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200 border-dashed">
          <ImageIcon className="w-16 h-16 text-slate-300 mb-4" />
          <h3 className="text-lg font-bold text-slate-700 mb-2">No Banners Found</h3>
          <p className="text-slate-500 text-sm max-w-md text-center mb-6">You haven't created any promotional banners yet. Click the "Add Banner" button above to get started.</p>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-colors font-bold text-sm"
          >
            <Plus size={16} />
            Create Your First Banner
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {banners.map((banner) => (
            <div key={banner._id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden group">
              <div className="h-48 bg-slate-100 relative">
                {banner.image ? (
                  <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-slate-400">
                    <ImageIcon size={48} />
                  </div>
                )}
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleOpenModal(banner)}
                    className="p-2 bg-white text-indigo-600 rounded-lg shadow hover:bg-indigo-50"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(banner._id)}
                    className="p-2 bg-white text-rose-600 rounded-lg shadow hover:bg-rose-50"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-slate-800 truncate pr-4">{banner.title}</h3>
                  <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase ${banner.isActive ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                    {banner.isActive ? 'Active' : 'Hidden'}
                  </span>
                </div>
                <p className="text-sm text-slate-500 truncate">{banner.subtitle || 'No subtitle'}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingBanner ? "Edit Banner" : "Add Banner"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-black text-slate-500 uppercase mb-1">Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full border border-slate-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-black text-slate-500 uppercase mb-1">Subtitle</label>
            <input
              type="text"
              value={formData.subtitle}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              className="w-full border border-slate-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-black text-slate-500 uppercase mb-1">Link URL</label>
            <input
              type="text"
              value={formData.link}
              onChange={(e) => setFormData({ ...formData, link: e.target.value })}
              className="w-full border border-slate-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-black text-slate-500 uppercase mb-1">Banner Image {!editingBanner && "*"}</label>
            <input
              type="file"
              accept="image/*"
              required={!editingBanner}
              onChange={(e) => setImageFile(e.target.files[0])}
              className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100"
            />
          </div>
          <div className="flex items-center gap-2 mt-4">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
            />
            <label htmlFor="isActive" className="text-sm font-bold text-slate-700">Set as Active</label>
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors"
            >
              Save Banner
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default BannerManager;
