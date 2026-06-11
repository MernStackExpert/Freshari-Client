"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/utils/axiosInstance";
import axios from "axios";
import {
  Plus,
  Save,
  Image as ImageIcon,
  UploadCloud,
  Trash2,
  Info,
  DollarSign,
  Package,
  Truck,
  Settings,
  Layers,
  Star,
  PlusCircle,
  XCircle,
  Tag as TagIcon,
  Link as LinkIcon,
} from "lucide-react";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

const AddProductPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [imgTab, setImgTab] = useState("upload");
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    sku: "",
    brand: "",
    category: { main: "", sub: "", slug: "" },
    pricing: {
      price: "",
      oldPrice: "",
      discountPercentage: "",
      discountType: "percentage",
      currency: "BDT",
    },
    inventory: {
      stock: "",
      stockStatus: "in-stock",
      minOrderQuantity: "",
      unit: "kg",
    },
    media: { thumbnail: "", images: [] },
    content: {
      shortDescription: "",
      description: "",
      features: [""],
      tags: [""],
    },
    shipping: {
      freeDelivery: false,
      deliveryCharge: "",
      estimatedDelivery: "",
      shelfLife: "",
      origin: "",
    },
    variants: [{ unit: "", price: "", stock: "" }],
    social: { rating: "", totalReviews: "" },
    status: {
      isNew: true,
      isFeatured: false,
      isActive: true,
      isTodaySpecial: false,
    },
    metadata: {
      addedBy: { name: "Md Nirob Sarkar", email: "mdnirob30k@gmail.com" },
    },
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axiosInstance.get("/categories");
        setCategories(res.data);
      } catch (err) {
        toast.error("Failed to load categories");
      }
    };
    fetchCategories();
  }, []);

  const handleInputChange = (path, value) => {
    const keys = path.split(".");
    setFormData((prev) => {
      let newData = JSON.parse(JSON.stringify(prev));
      let temp = newData;
      for (let i = 0; i < keys.length - 1; i++) {
        temp = temp[keys[i]];
      }
      temp[keys[keys.length - 1]] = value;
      return newData;
    });
    if (errors[path]) {
      const newErrors = { ...errors };
      delete newErrors[path];
      setErrors(newErrors);
    }
  };

  const handleImgUpload = async (e, type = "thumbnail", index = null) => {
    const file = e.target.files[0];
    if (!file) return;
    const body = new FormData();
    body.append("image", file);
    try {
      setLoading(true);
      const res = await axios.post(
        `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API}`,
        body,
      );
      const url = res.data.data.url;

      if (type === "gallery" && index !== null) {
        const newImages = [...formData.media.images];
        newImages[index] = url;
        handleInputChange("media.images", newImages);
      } else {
        handleInputChange("media.thumbnail", url);
      }
      toast.success("Image Uploaded Successfully");
    } catch (err) {
      toast.error("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
    let newErrors = {};
    const required = [
      "name",
      "slug",
      "sku",
      "category.slug",
      "pricing.price",
      "inventory.stock",
      "media.thumbnail",
      "shipping.origin",
    ];
    required.forEach((field) => {
      const keys = field.split(".");
      let val = formData;
      keys.forEach((k) => (val = val[k]));
      if (!val && val !== 0) newErrors[field] = true;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Required fields are empty!");
      return;
    }
    setLoading(true);
    try {
      await axiosInstance.post("/products", formData);
      Swal.fire({
        title: "Success!",
        text: "Product Deployed Successfully",
        icon: "success",
        confirmButtonColor: "#22C55E",
        shape: "rounded-xl",
      });
      router.push("/admin/products");
    } catch (err) {
      toast.error("Operation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-[1400px] mx-auto space-y-8 pb-24 font-sans px-4 sm:px-6 lg:px-8 mt-6"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white/80 backdrop-blur-xl p-6 md:p-8 rounded-[2rem] border border-gray-100 shadow-sm sticky top-6 z-50 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-[#0f172a] uppercase tracking-tight">
            Add Master Product
          </h1>
          <p className="text-gray-400 text-[10px] md:text-xs font-black uppercase tracking-widest mt-2">
            Inventory & Catalog Management System
          </p>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto bg-[#0f172a] text-white px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-3 cursor-pointer hover:bg-[#1e293b] hover:shadow-lg transition-all duration-300 disabled:opacity-50"
        >
          <Save size={18} /> {loading ? "Syncing Data..." : "Publish Product"}
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <section className="bg-white p-8 rounded-[2rem] border border-gray-100 space-y-8 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-3 text-[#0f172a] border-b border-gray-50 pb-4">
            <div className="p-2 bg-[#f0fdf4] rounded-lg">
              <Info size={18} className="text-[#22C55E]" />
            </div>
            Core Identity
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider ml-1">
                Product Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className={`w-full bg-[#f8fafc] border ${errors["name"] ? "border-red-500" : "border-gray-100"} focus:border-[#22C55E] rounded-xl p-4 text-sm font-bold outline-none transition-colors`}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider ml-1">
                URL Slug
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => handleInputChange("slug", e.target.value)}
                className={`w-full bg-[#f8fafc] border ${errors["slug"] ? "border-red-500" : "border-gray-100"} focus:border-[#22C55E] rounded-xl p-4 text-sm font-bold outline-none transition-colors`}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider ml-1">
                SKU Code
              </label>
              <input
                type="text"
                value={formData.sku}
                onChange={(e) => handleInputChange("sku", e.target.value)}
                className={`w-full bg-[#f8fafc] border ${errors["sku"] ? "border-red-500" : "border-gray-100"} focus:border-[#22C55E] rounded-xl p-4 text-sm font-bold outline-none transition-colors`}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider ml-1">
                Brand Name
              </label>
              <input
                type="text"
                value={formData.brand}
                onChange={(e) => handleInputChange("brand", e.target.value)}
                className="w-full bg-[#f8fafc] border border-gray-100 focus:border-[#22C55E] rounded-xl p-4 text-sm font-bold outline-none transition-colors"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider ml-1">
                Main Category
              </label>
              <select
                value={formData.category.slug}
                onChange={(e) => {
                  const cat = categories.find((c) => c.slug === e.target.value);
                  handleInputChange("category.slug", e.target.value);
                  handleInputChange("category.main", cat ? cat.name : "");
                }}
                className={`w-full bg-[#f8fafc] border ${errors["category.slug"] ? "border-red-500" : "border-gray-100"} focus:border-[#22C55E] rounded-xl p-4 text-xs font-bold uppercase outline-none cursor-pointer transition-colors`}
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider ml-1">
                Sub Category
              </label>
              <input
                type="text"
                value={formData.category.sub}
                onChange={(e) =>
                  handleInputChange("category.sub", e.target.value)
                }
                className="w-full bg-[#f8fafc] border border-gray-100 focus:border-[#22C55E] rounded-xl p-4 text-sm font-bold outline-none transition-colors"
              />
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-br from-[#0f172a] to-[#1e293b] p-8 rounded-[2rem] space-y-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl"></div>
          <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-3 text-white border-b border-white/10 pb-4 relative z-10">
            <div className="p-2 bg-white/10 rounded-lg">
              <ImageIcon size={18} className="text-[#22C55E]" />
            </div>
            Media Configuration
          </h3>

          <div className="space-y-6 relative z-10">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-black uppercase text-gray-300 tracking-widest">
                  Primary Thumbnail
                </label>
                <div className="flex bg-white/10 rounded-lg p-1">
                  <button
                    type="button"
                    onClick={() => setImgTab("upload")}
                    className={`px-4 py-1.5 rounded-md text-[9px] font-black uppercase tracking-widest cursor-pointer transition-colors ${imgTab === "upload" ? "bg-[#22C55E] text-white shadow-md" : "text-gray-400 hover:text-white"}`}
                  >
                    Upload
                  </button>
                  <button
                    type="button"
                    onClick={() => setImgTab("url")}
                    className={`px-4 py-1.5 rounded-md text-[9px] font-black uppercase tracking-widest cursor-pointer transition-colors ${imgTab === "url" ? "bg-[#22C55E] text-white shadow-md" : "text-gray-400 hover:text-white"}`}
                  >
                    URL
                  </button>
                </div>
              </div>

              <div
                className={`p-6 border-2 border-dashed ${errors["media.thumbnail"] ? "border-red-500 bg-red-500/5" : "border-white/20 bg-white/5"} rounded-2xl text-center relative hover:border-[#22C55E]/50 hover:bg-white/10 transition-all group`}
              >
                {imgTab === "upload" ? (
                  <>
                    <UploadCloud
                      size={32}
                      className="mx-auto mb-3 text-[#22C55E] group-hover:scale-110 transition-transform"
                    />
                    <p className="text-[10px] font-black text-white uppercase tracking-widest">
                      Drop image or click to browse
                    </p>
                    <input
                      type="file"
                      onChange={(e) => handleImgUpload(e, "thumbnail")}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </>
                ) : (
                  <input
                    type="text"
                    placeholder="Paste image URL here..."
                    value={formData.media.thumbnail}
                    onChange={(e) =>
                      handleInputChange("media.thumbnail", e.target.value)
                    }
                    className="w-full bg-transparent outline-none text-xs text-center font-bold text-white placeholder-gray-500"
                  />
                )}
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-white/10">
              <label className="text-[10px] font-black uppercase text-gray-300 tracking-widest flex items-center gap-2">
                <Layers size={14} /> Gallery Images
              </label>
              <div className="space-y-3">
                {formData.media.images.map((img, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 bg-white/5 p-2.5 rounded-xl border border-white/10"
                  >
                    <div className="flex-1 flex items-center bg-black/20 rounded-lg px-3 py-2">
                      <LinkIcon size={14} className="text-gray-400 mr-2" />
                      <input
                        type="text"
                        value={img}
                        onChange={(e) => {
                          const imgs = [...formData.media.images];
                          imgs[i] = e.target.value;
                          handleInputChange("media.images", imgs);
                        }}
                        placeholder="Image URL"
                        className="w-full bg-transparent text-xs font-bold text-white outline-none placeholder-gray-500"
                      />
                    </div>
                    <div className="relative overflow-hidden cursor-pointer bg-[#22C55E]/10 p-2.5 rounded-lg border border-[#22C55E]/30 hover:bg-[#22C55E]/20 transition-colors">
                      <UploadCloud size={16} className="text-[#22C55E]" />
                      <input
                        type="file"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={(e) => handleImgUpload(e, "gallery", i)}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        handleInputChange(
                          "media.images",
                          formData.media.images.filter((_, idx) => idx !== i),
                        )
                      }
                      className="p-2.5 bg-red-500/10 text-red-400 rounded-lg border border-red-500/30 hover:bg-red-500/20 hover:text-red-300 transition-colors cursor-pointer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    handleInputChange("media.images", [
                      ...formData.media.images,
                      "",
                    ])
                  }
                  className="w-full py-3 rounded-xl border border-dashed border-white/20 text-[10px] font-black uppercase text-[#22C55E] flex items-center justify-center gap-2 cursor-pointer hover:bg-white/5 transition-colors"
                >
                  <Plus size={14} /> Add Gallery Image
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <section className="bg-white p-8 rounded-[2rem] border border-gray-100 space-y-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-3 text-[#0f172a] border-b border-gray-50 pb-4">
            <div className="p-2 bg-[#f0fdf4] rounded-lg">
              <PlusCircle size={18} className="text-[#22C55E]" />
            </div>
            Features List
          </h3>
          <div className="space-y-3">
            {formData.content.features.map((f, i) => (
              <div key={i} className="flex gap-3 items-center group">
                <div className="flex-1 bg-[#f8fafc] border border-gray-100 rounded-xl flex items-center px-4 py-3 focus-within:border-[#22C55E] transition-colors">
                  <span className="text-gray-400 text-xs font-black mr-3">
                    {i + 1}.
                  </span>
                  <input
                    type="text"
                    value={f}
                    onChange={(e) => {
                      const feats = [...formData.content.features];
                      feats[i] = e.target.value;
                      handleInputChange("content.features", feats);
                    }}
                    placeholder={`Feature description...`}
                    className="w-full bg-transparent text-sm font-bold border-none outline-none text-[#0f172a]"
                  />
                </div>
                <button
                  type="button"
                  onClick={() =>
                    handleInputChange(
                      "content.features",
                      formData.content.features.filter((_, idx) => idx !== i),
                    )
                  }
                  className="p-3 text-red-400 bg-red-50 rounded-xl hover:bg-red-500 hover:text-white transition-colors cursor-pointer"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                handleInputChange("content.features", [
                  ...formData.content.features,
                  "",
                ])
              }
              className="text-xs font-black uppercase text-[#22C55E] bg-[#f0fdf4] px-5 py-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer mt-4 hover:bg-[#dcfce7] transition-colors w-full border border-[#22C55E]/20"
            >
              <Plus size={16} /> Add New Feature
            </button>
          </div>
        </section>

        <section className="bg-white p-8 rounded-[2rem] border border-gray-100 space-y-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-3 text-[#0f172a] border-b border-gray-50 pb-4">
            <div className="p-2 bg-[#f0fdf4] rounded-lg">
              <TagIcon size={18} className="text-[#22C55E]" />
            </div>
            Search Tags
          </h3>
          <div className="space-y-3">
            {formData.content.tags.map((t, i) => (
              <div key={i} className="flex gap-3 items-center">
                <div className="flex-1 bg-[#f8fafc] border border-gray-100 rounded-xl flex items-center px-4 py-3 focus-within:border-[#22C55E] transition-colors">
                  <TagIcon size={14} className="text-gray-400 mr-3" />
                  <input
                    type="text"
                    value={t}
                    onChange={(e) => {
                      const tags = [...formData.content.tags];
                      tags[i] = e.target.value;
                      handleInputChange("content.tags", tags);
                    }}
                    placeholder={`Keyword or Tag...`}
                    className="w-full bg-transparent text-sm font-bold border-none outline-none text-[#0f172a]"
                  />
                </div>
                <button
                  type="button"
                  onClick={() =>
                    handleInputChange(
                      "content.tags",
                      formData.content.tags.filter((_, idx) => idx !== i),
                    )
                  }
                  className="p-3 text-red-400 bg-red-50 rounded-xl hover:bg-red-500 hover:text-white transition-colors cursor-pointer"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                handleInputChange("content.tags", [
                  ...formData.content.tags,
                  "",
                ])
              }
              className="text-xs font-black uppercase text-[#22C55E] bg-[#f0fdf4] px-5 py-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer mt-4 hover:bg-[#dcfce7] transition-colors w-full border border-[#22C55E]/20"
            >
              <Plus size={16} /> Add New Tag
            </button>
          </div>
        </section>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        <section className="bg-white p-8 rounded-[2rem] border border-gray-100 space-y-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-3 text-[#0f172a] border-b border-gray-50 pb-4">
            <div className="p-2 bg-[#f0fdf4] rounded-lg">
              <DollarSign size={18} className="text-[#22C55E]" />
            </div>
            Pricing Strategy
          </h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider ml-1">
                Current Price
              </label>
              <input
                type="number"
                placeholder="0.00"
                value={formData.pricing.price}
                onChange={(e) =>
                  handleInputChange(
                    "pricing.price",
                    e.target.value === "" ? "" : Number(e.target.value),
                  )
                }
                className={`w-full bg-[#f8fafc] p-4 rounded-xl text-sm font-bold border ${errors["pricing.price"] ? "border-red-500" : "border-gray-100"} focus:border-[#22C55E] outline-none transition-colors`}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider ml-1">
                Old Price (Optional)
              </label>
              <input
                type="number"
                placeholder="0.00"
                value={formData.pricing.oldPrice}
                onChange={(e) =>
                  handleInputChange(
                    "pricing.oldPrice",
                    e.target.value === "" ? "" : Number(e.target.value),
                  )
                }
                className="w-full bg-[#f8fafc] p-4 rounded-xl text-sm font-bold border border-gray-100 focus:border-[#22C55E] outline-none transition-colors"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider ml-1">
                  Discount Val
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={formData.pricing.discountPercentage}
                  onChange={(e) =>
                    handleInputChange(
                      "pricing.discountPercentage",
                      e.target.value === "" ? "" : Number(e.target.value),
                    )
                  }
                  className="w-full bg-[#f8fafc] p-4 rounded-xl text-sm font-bold border border-gray-100 focus:border-[#22C55E] outline-none transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider ml-1">
                  Type
                </label>
                <select
                  value={formData.pricing.discountType}
                  onChange={(e) =>
                    handleInputChange("pricing.discountType", e.target.value)
                  }
                  className="w-full bg-[#f8fafc] p-4 rounded-xl text-[11px] font-black uppercase border border-gray-100 focus:border-[#22C55E] outline-none cursor-pointer transition-colors"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="flat">Flat Amount</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white p-8 rounded-[2rem] border border-gray-100 space-y-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-3 text-[#0f172a] border-b border-gray-50 pb-4">
            <div className="p-2 bg-[#f0fdf4] rounded-lg">
              <Package size={18} className="text-[#22C55E]" />
            </div>
            Inventory Data
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider ml-1">
                  Total Stock
                </label>
                <input
                  type="number"
                  placeholder="Qty"
                  value={formData.inventory.stock}
                  onChange={(e) =>
                    handleInputChange(
                      "inventory.stock",
                      e.target.value === "" ? "" : Number(e.target.value),
                    )
                  }
                  className={`w-full bg-[#f8fafc] p-4 rounded-xl text-sm font-bold border ${errors["inventory.stock"] ? "border-red-500" : "border-gray-100"} focus:border-[#22C55E] outline-none transition-colors`}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider ml-1">
                  Unit Type
                </label>
                <input
                  type="text"
                  placeholder="kg, pc, ltr"
                  value={formData.inventory.unit}
                  onChange={(e) =>
                    handleInputChange("inventory.unit", e.target.value)
                  }
                  className="w-full bg-[#f8fafc] p-4 rounded-xl text-sm font-bold border border-gray-100 focus:border-[#22C55E] outline-none transition-colors"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider ml-1">
                  Min Order
                </label>
                <input
                  type="number"
                  placeholder="1"
                  value={formData.inventory.minOrderQuantity}
                  onChange={(e) =>
                    handleInputChange(
                      "inventory.minOrderQuantity",
                      e.target.value === "" ? "" : Number(e.target.value),
                    )
                  }
                  className="w-full bg-[#f8fafc] p-4 rounded-xl text-sm font-bold border border-gray-100 focus:border-[#22C55E] outline-none transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider ml-1">
                  Status
                </label>
                <select
                  value={formData.inventory.stockStatus}
                  onChange={(e) =>
                    handleInputChange("inventory.stockStatus", e.target.value)
                  }
                  className="w-full bg-[#f8fafc] p-4 rounded-xl text-[11px] font-black uppercase border border-gray-100 focus:border-[#22C55E] outline-none cursor-pointer transition-colors"
                >
                  <option value="in-stock">In-Stock</option>
                  <option value="out-of-stock">Out-of-Stock</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white p-8 rounded-[2rem] border border-gray-100 space-y-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-3 text-[#0f172a] border-b border-gray-50 pb-4">
            <div className="p-2 bg-[#f0fdf4] rounded-lg">
              <Truck size={18} className="text-[#22C55E]" />
            </div>
            Logistics
          </h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider ml-1">
                Product Origin
              </label>
              <input
                type="text"
                placeholder="Country or Region"
                value={formData.shipping.origin}
                onChange={(e) =>
                  handleInputChange("shipping.origin", e.target.value)
                }
                className={`w-full bg-[#f8fafc] p-4 rounded-xl text-sm font-bold border ${errors["shipping.origin"] ? "border-red-500" : "border-gray-100"} focus:border-[#22C55E] outline-none transition-colors`}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider ml-1">
                  Del Charge
                </label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={formData.shipping.deliveryCharge}
                  onChange={(e) =>
                    handleInputChange(
                      "shipping.deliveryCharge",
                      e.target.value === "" ? "" : Number(e.target.value),
                    )
                  }
                  className="w-full bg-[#f8fafc] p-4 rounded-xl text-sm font-bold border border-gray-100 focus:border-[#22C55E] outline-none transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider ml-1">
                  Est. Delivery
                </label>
                <input
                  type="text"
                  placeholder="e.g. 2-3 Days"
                  value={formData.shipping.estimatedDelivery}
                  onChange={(e) =>
                    handleInputChange(
                      "shipping.estimatedDelivery",
                      e.target.value,
                    )
                  }
                  className="w-full bg-[#f8fafc] p-4 rounded-xl text-sm font-bold border border-gray-100 focus:border-[#22C55E] outline-none transition-colors"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider ml-1">
                Shelf Life
              </label>
              <input
                type="text"
                placeholder="e.g. 6 Months"
                value={formData.shipping.shelfLife}
                onChange={(e) =>
                  handleInputChange("shipping.shelfLife", e.target.value)
                }
                className="w-full bg-[#f8fafc] p-4 rounded-xl text-sm font-bold border border-gray-100 focus:border-[#22C55E] outline-none transition-colors"
              />
            </div>
          </div>
        </section>
      </div>

      <section className="bg-white p-8 rounded-[2rem] border border-gray-100 space-y-8 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
        <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-3 text-[#0f172a] border-b border-gray-50 pb-4">
          <div className="p-2 bg-[#f0fdf4] rounded-lg">
            <Settings size={18} className="text-[#22C55E]" />
          </div>
          Description & Active Flags
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider ml-1">
                Short Description
              </label>
              <input
                type="text"
                placeholder="A brief summary..."
                value={formData.content.shortDescription}
                onChange={(e) =>
                  handleInputChange("content.shortDescription", e.target.value)
                }
                className="w-full bg-[#f8fafc] p-4 rounded-xl text-sm font-bold border border-gray-100 focus:border-[#22C55E] outline-none transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider ml-1">
                Full Description
              </label>
              <textarea
                rows="6"
                placeholder="Detailed product information..."
                value={formData.content.description}
                onChange={(e) =>
                  handleInputChange("content.description", e.target.value)
                }
                className="w-full bg-[#f8fafc] p-5 rounded-2xl text-sm font-medium border border-gray-100 focus:border-[#22C55E] outline-none transition-colors resize-none"
              ></textarea>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider ml-1 block">
              Toggle Properties
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                "isActive",
                "isNew",
                "isFeatured",
                "isTodaySpecial",
                "freeDelivery",
              ].map((key) => {
                const isShipping = key === "freeDelivery";
                const path = isShipping ? `shipping.${key}` : `status.${key}`;
                const val = isShipping
                  ? formData.shipping[key]
                  : formData.status[key];
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleInputChange(path, !val)}
                    className={`p-4 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all duration-300 cursor-pointer flex flex-col items-center justify-center gap-2 ${val ? "bg-[#f0fdf4] text-[#22C55E] border-[#22C55E]" : "bg-[#f8fafc] text-gray-400 border-gray-100 hover:border-gray-300"}`}
                  >
                    <div
                      className={`w-3 h-3 rounded-full ${val ? "bg-[#22C55E] shadow-[0_0_10px_rgba(34,197,94,0.5)]" : "bg-gray-300"}`}
                    ></div>
                    {key.replace("is", "").replace("free", "Free ")}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white p-8 rounded-[2rem] border border-gray-100 space-y-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
        <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-3 text-[#0f172a] border-b border-gray-50 pb-4">
          <div className="p-2 bg-[#f0fdf4] rounded-lg">
            <Layers size={18} className="text-[#22C55E]" />
          </div>
          Product Variants
        </h3>
        <div className="space-y-4">
          {formData.variants.map((v, i) => (
            <div
              key={i}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-[#f8fafc] border border-gray-100 p-5 rounded-2xl relative group hover:border-[#22C55E]/30 transition-colors"
            >
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-gray-400 ml-1">
                  Size/Unit
                </label>
                <input
                  type="text"
                  placeholder="e.g. 500g"
                  value={v.unit}
                  onChange={(e) => {
                    const vars = [...formData.variants];
                    vars[i].unit = e.target.value;
                    handleInputChange("variants", vars);
                  }}
                  className="w-full bg-white p-3 rounded-xl border border-gray-100 focus:border-[#22C55E] text-sm font-bold outline-none transition-colors"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-gray-400 ml-1">
                  Price
                </label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={v.price}
                  onChange={(e) => {
                    const vars = [...formData.variants];
                    vars[i].price =
                      e.target.value === "" ? "" : Number(e.target.value);
                    handleInputChange("variants", vars);
                  }}
                  className="w-full bg-white p-3 rounded-xl border border-gray-100 focus:border-[#22C55E] text-sm font-bold outline-none transition-colors"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-gray-400 ml-1">
                  Stock
                </label>
                <input
                  type="number"
                  placeholder="Qty"
                  value={v.stock}
                  onChange={(e) => {
                    const vars = [...formData.variants];
                    vars[i].stock =
                      e.target.value === "" ? "" : Number(e.target.value);
                    handleInputChange("variants", vars);
                  }}
                  className="w-full bg-white p-3 rounded-xl border border-gray-100 focus:border-[#22C55E] text-sm font-bold outline-none transition-colors"
                />
              </div>
              <button
                type="button"
                onClick={() =>
                  handleInputChange(
                    "variants",
                    formData.variants.filter((_, idx) => idx !== i),
                  )
                }
                className="absolute -top-3 -right-3 bg-white text-red-500 rounded-full p-1.5 shadow-md cursor-pointer hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
              >
                <XCircle size={18} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              handleInputChange("variants", [
                ...formData.variants,
                { unit: "", price: "", stock: "" },
              ])
            }
            className="w-full py-4 rounded-2xl border-2 border-dashed border-[#22C55E]/30 text-xs font-black uppercase text-[#22C55E] flex items-center justify-center gap-2 cursor-pointer hover:bg-[#f0fdf4] transition-colors"
          >
            <Plus size={16} /> Add New Variant
          </button>
        </div>
      </section>

      <section className="bg-white p-8 rounded-[2rem] border border-gray-100 space-y-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
        <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-3 text-[#0f172a] border-b border-gray-50 pb-4">
          <div className="p-2 bg-[#f0fdf4] rounded-lg">
            <Star size={18} className="text-[#22C55E]" />
          </div>
          Social & Metadata
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-end">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider ml-1">
              Rating (0-5)
            </label>
            <input
              type="number"
              step="0.1"
              placeholder="e.g. 4.5"
              value={formData.social.rating}
              onChange={(e) =>
                handleInputChange(
                  "social.rating",
                  e.target.value === "" ? "" : Number(e.target.value),
                )
              }
              className="w-full bg-[#f8fafc] border border-gray-100 focus:border-[#22C55E] rounded-xl p-4 text-sm font-black outline-none transition-colors"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider ml-1">
              Total Reviews
            </label>
            <input
              type="number"
              placeholder="e.g. 120"
              value={formData.social.totalReviews}
              onChange={(e) =>
                handleInputChange(
                  "social.totalReviews",
                  e.target.value === "" ? "" : Number(e.target.value),
                )
              }
              className="w-full bg-[#f8fafc] border border-gray-100 focus:border-[#22C55E] rounded-xl p-4 text-sm font-black outline-none transition-colors"
            />
          </div>
          <div className="bg-[#f8fafc] p-4 rounded-2xl border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#0f172a] flex items-center justify-center text-white font-black text-sm shadow-md">
              NS
            </div>
            <div>
              <p className="text-xs font-black text-[#0f172a] uppercase tracking-wide">
                {formData.metadata.addedBy.name}
              </p>
              <p className="text-[10px] font-bold text-gray-500 uppercase mt-1">
                Role: Master Admin
              </p>
            </div>
          </div>
        </div>
      </section>
    </form>
  );
};

export default AddProductPage;
