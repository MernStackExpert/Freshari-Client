"use client";
import React, { useState, useEffect, use } from "react";
import Image from "next/image";
import axios from "axios";
import { useCart } from "@/context/CartContext";
import {
  Star,
  Truck,
  Clock,
  Minus,
  Plus,
  ShoppingCart,
  ChevronLeft,
  Zap,
  MapPin,
  Tag,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import ProductCard from "@/components/shared/ProductCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import "swiper/css";

const ProductDetails = ({ params: paramsPromise }) => {
  const params = use(paramsPromise);
  const slug = params.slug;
  const router = useRouter();

  const [product, setProduct] = useState(null);
  const [activeImg, setActiveImg] = useState("");
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const { addToCart, buyNow } = useCart();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!slug) return;
      try {
        setLoading(true);
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/products`,
        );
        const allProducts = data.products || [];
        const currentProduct = allProducts.find((p) => p.slug === slug);

        if (currentProduct) {
          setProduct(currentProduct);
          setActiveImg(
            currentProduct.media.images[0] || currentProduct.media.thumbnail,
          );

          const related = allProducts
            .filter(
              (p) =>
                p.category.main.toLowerCase() ===
                  currentProduct.category.main.toLowerCase() && p.slug !== slug,
            )
            .slice(0, 10);
          setRelatedProducts(related);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="w-12 h-12 border-4 border-[#0f172a] border-t-[#f97316] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <main className="bg-[#fcfdfd] pb-24 font-sans">
      <div className="main-container py-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-500 font-bold hover:text-[#f97316] transition-colors mb-8 cursor-pointer group"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          পিছনে ফিরে যান
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">
          <div className="space-y-6">
            <div className="relative aspect-square rounded-[2rem] overflow-hidden border border-gray-100 bg-[#f8fafc] shadow-[0_20px_50px_rgba(0,0,0,0.03)]">
              <Image
                src={activeImg}
                alt={product.name}
                fill
                className="object-contain p-8 md:p-12"
                priority
              />
              {product.pricing.discountPercentage > 0 && (
                <div className="absolute top-6 left-6 bg-gradient-to-r from-[#f97316] to-[#ea580c] text-white text-xs font-black px-4 py-2 rounded-full shadow-[0_10px_20px_rgba(249,115,22,0.3)] tracking-wider">
                  {product.pricing.discountPercentage}% OFF
                </div>
              )}
            </div>

            <div className="grid grid-cols-5 gap-4">
              {product.media.images.map((img, i) => (
                <div
                  key={i}
                  onClick={() => setActiveImg(img)}
                  className={`relative aspect-square rounded-2xl overflow-hidden cursor-pointer border-2 transition-all duration-300 bg-[#f8fafc] ${
                    activeImg === img
                      ? "border-[#0f172a] shadow-md scale-105"
                      : "border-transparent hover:border-gray-200"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${product.name}-${i}`}
                    fill
                    className="object-cover p-2"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <span className="bg-[#0f172a] text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm">
                  {product.brand}
                </span>
                <span className="text-gray-400 text-[11px] font-black uppercase tracking-widest">
                  SKU: {product.sku}
                </span>
              </div>
              <div
                className={`flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider ${
                  product.inventory.stock > 0
                    ? "text-[#16a34a]"
                    : "text-red-500"
                }`}
              >
                {product.inventory.stock > 0 ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : (
                  <AlertCircle className="w-3.5 h-3.5" />
                )}
                {product.inventory.stockStatus.replace("-", " ")}
              </div>
            </div>

            <h1 className="text-3xl md:text-5xl font-black text-[#0f172a] mb-5 leading-[1.1] tracking-tight">
              {product.name}
            </h1>

            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center gap-1.5 bg-orange-50 border border-orange-100 px-3 py-1.5 rounded-xl">
                <Star className="w-4 h-4 text-[#f97316] fill-current" />
                <span className="text-sm font-black text-[#f97316]">
                  {product.social.rating}
                </span>
              </div>
              <span className="text-gray-400 text-sm font-bold">
                ({product.social.totalReviews} Reviews)
              </span>
              <span className="text-gray-300">|</span>
              <span className="text-[#0f172a] text-sm font-black">
                Unit: 1 {product.inventory.unit}
              </span>
            </div>

            <div className="flex items-end gap-4 mb-8">
              <span className="text-5xl font-black text-[#f97316] tracking-tight">
                ৳{product.pricing.price}
              </span>
              {product.pricing.oldPrice > product.pricing.price && (
                <span className="text-2xl text-gray-400 line-through font-bold mb-1">
                  ৳{product.pricing.oldPrice}
                </span>
              )}
            </div>

            <p className="text-gray-500 leading-relaxed mb-10 font-medium text-lg">
              {product.content.shortDescription}
            </p>

            <div className="flex flex-col gap-6 mb-12 pb-12 border-b border-gray-100">
              <div className="flex items-center gap-5">
                <span className="text-sm font-black text-[#0f172a] uppercase tracking-widest">
                  Quantity:
                </span>
                <div className="flex items-center border border-gray-200 rounded-2xl h-[55px] px-2 bg-[#f8fafc] shadow-sm">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white hover:shadow-sm text-gray-500 hover:text-[#f97316] transition-all cursor-pointer"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="w-12 text-center font-black text-xl text-[#0f172a]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white hover:shadow-sm text-gray-500 hover:text-[#f97316] transition-all cursor-pointer"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <button
                  onClick={() => addToCart({ ...product, quantity })}
                  className="flex-1 min-w-[200px] h-[60px] border-2 border-[#0f172a] text-[#0f172a] rounded-2xl font-black text-sm uppercase tracking-wide flex items-center justify-center gap-3 hover:bg-[#0f172a] hover:text-white transition-all cursor-pointer group shadow-sm hover:shadow-lg"
                >
                  <ShoppingCart className="w-5 h-5 transition-transform group-active:scale-90" />
                  Add To Cart
                </button>

                <motion.button
                  animate={{
                    rotate: [0, -8, 8, -8, 8, 0, 0, 0, 0, 0, 0, 0],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 2.5,
                    ease: "easeInOut",
                  }}
                  onClick={() => buyNow({ ...product, quantity })}
                  className="flex-1 min-w-[200px] h-[60px] bg-gradient-to-r from-[#f97316] to-[#ea580c] text-white rounded-2xl font-black text-sm uppercase tracking-wide flex items-center justify-center gap-3 hover:from-[#ea580c] hover:to-[#c2410c] transition-all shadow-[0_10px_25px_rgba(249,115,22,0.3)] hover:shadow-[0_15px_30px_rgba(249,115,22,0.4)] cursor-pointer"
                >
                  <Zap className="w-5 h-5 fill-current" /> Buy Now
                </motion.button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex items-center gap-4 p-5 bg-[#f8fafc] rounded-2xl border border-gray-100 hover:border-gray-200 transition-colors">
                <div className="bg-white p-3 rounded-xl shadow-sm text-[#0f172a]">
                  <Truck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-[14px] font-black text-[#0f172a]">
                    Delivery Charge
                  </h4>
                  <p className="text-[12px] text-gray-500 font-bold mt-0.5">
                    {product.shipping.freeDelivery
                      ? "Free Delivery"
                      : `৳${product.shipping.deliveryCharge}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-5 bg-[#f8fafc] rounded-2xl border border-gray-100 hover:border-gray-200 transition-colors">
                <div className="bg-white p-3 rounded-xl shadow-sm text-[#0f172a]">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-[14px] font-black text-[#0f172a]">
                    Origin
                  </h4>
                  <p className="text-[12px] text-gray-500 font-bold mt-0.5">
                    {product.shipping.origin}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-24 grid grid-cols-1 lg:grid-cols-3 gap-14">
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-black text-[#0f172a] mb-8 border-b border-gray-100 pb-5 uppercase tracking-wide">
              Detailed Description
            </h3>
            <p className="text-gray-600 leading-loose font-medium mb-10 text-lg">
              {product.content.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {product.content.features.map((feature, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-5 bg-[#f8fafc] rounded-2xl border border-gray-100"
                >
                  <CheckCircle2 className="w-6 h-6 text-[#f97316]" />
                  <span className="text-[15px] font-bold text-[#0f172a]">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.03)]">
              <h4 className="text-sm font-black text-[#0f172a] uppercase tracking-widest mb-6 flex items-center gap-3">
                <Tag className="w-5 h-5 text-[#f97316]" /> Product Tags
              </h4>
              <div className="flex flex-wrap gap-2.5">
                {product.content.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-4 py-2 bg-[#f8fafc] border border-gray-100 rounded-xl text-[13px] font-bold text-gray-500 hover:text-[#0f172a] hover:border-[#0f172a]/20 transition-colors cursor-pointer"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#0f172a] to-[#1e293b] p-8 rounded-[2rem] text-white shadow-xl relative overflow-hidden">
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-white opacity-5 blur-3xl rounded-full"></div>
              <div className="flex items-center gap-4 mb-6 relative z-10">
                <Clock className="w-8 h-8 text-[#f97316]" />
                <h4 className="font-black text-xl tracking-wide">Shelf Life</h4>
              </div>
              <p className="text-base text-white/80 font-medium mb-6 italic leading-relaxed relative z-10">
                &quot;{product.name} stays fresh for up to{" "}
                {product.shipping.shelfLife} if stored properly.&quot;
              </p>
              <div className="text-[12px] font-black bg-white/10 px-4 py-2.5 rounded-xl inline-block tracking-wide relative z-10">
                Estimated Delivery: {product.shipping.estimatedDelivery}
              </div>
            </div>
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <section className="py-20 mt-10 bg-white border-t border-gray-100">
          <div className="main-container">
            <h2 className="text-3xl font-black text-[#0f172a] mb-12 text-center uppercase tracking-widest">
              You May Also Like
            </h2>
            <Swiper
              slidesPerView={2}
              spaceBetween={16}
              autoplay={{ delay: 3500, disableOnInteraction: false }}
              modules={[Autoplay]}
              breakpoints={{
                640: { slidesPerView: 2, spaceBetween: 20 },
                768: { slidesPerView: 3, spaceBetween: 24 },
                1024: { slidesPerView: 5, spaceBetween: 24 },
              }}
              className="pb-10"
            >
              {relatedProducts.map((p) => (
                <SwiperSlide key={p._id}>
                  <ProductCard product={p} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section>
      )}
    </main>
  );
};

export default ProductDetails;
