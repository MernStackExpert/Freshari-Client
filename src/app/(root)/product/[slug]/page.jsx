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

  const hasDiscount = product.pricing.oldPrice > product.pricing.price;

  return (
    <main className="bg-[#fcfdfd] pb-24 font-sans selection:bg-[#f97316] selection:text-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-10">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-500 font-bold hover:text-[#f97316] transition-colors mb-6 md:mb-8 cursor-pointer group w-max"
        >
          <div className="p-2 bg-gray-100 rounded-full group-hover:bg-orange-50 transition-colors">
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform text-[#0f172a]" />
          </div>
          <span className="text-sm md:text-base">পিছনে ফিরে যান</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-start">
          <div className="space-y-4 md:space-y-6 lg:sticky lg:top-24">
            <div className="relative w-full aspect-square rounded-3xl md:rounded-[2.5rem] overflow-hidden border border-gray-100 bg-white shadow-[0_10px_40px_rgba(0,0,0,0.03)] flex items-center justify-center group p-4 md:p-10">
              <Image
                src={activeImg}
                alt={product.name}
                fill
                className="object-contain p-6 md:p-12 transition-transform duration-700 group-hover:scale-110"
                priority
              />
              {product.pricing.discountPercentage > 0 && (
                <div className="absolute top-4 left-4 md:top-6 md:left-6 bg-gradient-to-r from-[#f97316] to-[#ea580c] text-white text-[10px] md:text-xs font-black px-3 py-1.5 md:px-4 md:py-2 rounded-full shadow-[0_10px_20px_rgba(249,115,22,0.3)] tracking-widest uppercase">
                  {product.pricing.discountPercentage}% OFF
                </div>
              )}
            </div>

            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 px-1">
              {product.media.images.map((img, i) => (
                <div
                  key={i}
                  onClick={() => setActiveImg(img)}
                  className={`relative w-20 h-20 md:w-24 md:h-24 shrink-0 rounded-2xl overflow-hidden cursor-pointer border-2 transition-all duration-300 bg-white ${
                    activeImg === img
                      ? "border-[#f97316] shadow-md scale-105"
                      : "border-gray-100 hover:border-[#0f172a]/20"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${product.name}-${i}`}
                    fill
                    className="object-contain p-2"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-4 md:mb-5">
              <div className="flex items-center gap-2 md:gap-3">
                <span className="bg-[#0f172a] text-white text-[9px] md:text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm">
                  {product.brand}
                </span>
                <span className="text-gray-400 text-[10px] md:text-[11px] font-black uppercase tracking-widest border-l border-gray-200 pl-2 md:pl-3">
                  SKU: {product.sku}
                </span>
              </div>
              <div
                className={`flex items-center gap-1.5 text-[10px] md:text-[11px] font-black uppercase tracking-widest ${
                  product.inventory.stock > 0
                    ? "text-[#16a34a] bg-green-50 px-3 py-1.5 rounded-full"
                    : "text-red-500 bg-red-50 px-3 py-1.5 rounded-full"
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

            <h1 className="text-2xl md:text-4xl lg:text-[42px] font-black text-[#0f172a] mb-4 leading-[1.2] tracking-tight">
              {product.name}
            </h1>

            <div className="flex flex-wrap items-center gap-3 md:gap-4 mb-6">
              <div className="flex items-center gap-1.5 bg-orange-50 border border-orange-100 px-3 py-1 rounded-xl">
                <Star className="w-4 h-4 text-[#f97316] fill-current" />
                <span className="text-sm font-black text-[#f97316]">
                  {product.social.rating}
                </span>
              </div>
              <span className="text-gray-400 text-[13px] md:text-sm font-bold">
                ({product.social.totalReviews} Reviews)
              </span>
              <div className="w-1 h-1 rounded-full bg-gray-300"></div>
              <span className="text-[#0f172a] text-[13px] md:text-sm font-black">
                Unit: 1 {product.inventory.unit}
              </span>
            </div>

            <div className="flex items-end gap-3 md:gap-4 mb-6 md:mb-8 bg-[#f8fafc] p-5 md:p-6 rounded-3xl border border-gray-100">
              <div className="flex flex-col">
                <span className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">
                  Our Price
                </span>
                <div className="flex items-end gap-3">
                  <span className="text-4xl md:text-5xl font-black text-[#f97316] tracking-tight leading-none">
                    ৳{product.pricing.price}
                  </span>
                  {hasDiscount && (
                    <span className="text-lg md:text-2xl text-gray-400 line-through font-bold mb-1">
                      ৳{product.pricing.oldPrice}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <p className="text-gray-500 leading-relaxed mb-8 md:mb-10 font-medium text-[15px] md:text-[17px]">
              {product.content.shortDescription}
            </p>

            <div className="flex flex-col gap-5 mb-10 pb-10 border-b border-gray-100">
              <div className="flex items-center justify-between bg-white border border-gray-200 p-2 md:p-3 rounded-2xl shadow-sm">
                <span className="text-xs md:text-sm font-black text-[#0f172a] uppercase tracking-widest pl-3 md:pl-4">
                  Quantity
                </span>
                <div className="flex items-center bg-[#f8fafc] rounded-xl border border-gray-100 p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-lg hover:bg-white hover:shadow-sm text-gray-500 hover:text-[#f97316] transition-all cursor-pointer"
                  >
                    <Minus className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                  <span className="w-10 md:w-12 text-center font-black text-lg md:text-xl text-[#0f172a]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-lg hover:bg-white hover:shadow-sm text-gray-500 hover:text-[#f97316] transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                </div>
              </div>

              <div className="flex flex-row items-center gap-3 md:gap-4 w-full">
                <button
                  onClick={() => addToCart({ ...product, quantity })}
                  className="flex-1 h-[50px] md:h-[60px] bg-white border-2 border-[#0f172a] text-[#0f172a] rounded-2xl font-black text-[11px] md:text-sm uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#0f172a] hover:text-white transition-all cursor-pointer group shadow-sm hover:shadow-lg"
                >
                  <ShoppingCart className="w-4 h-4 md:w-5 md:h-5 transition-transform group-active:scale-90" />
                  <span className="whitespace-nowrap">Add To Cart</span>
                </button>

                <motion.button
                  animate={{
                    rotate: [0, -8, 8, -8, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 3,
                    ease: "easeInOut",
                  }}
                  onClick={() => buyNow({ ...product, quantity })}
                  className="flex-1 h-[50px] md:h-[60px] bg-gradient-to-r from-[#f97316] to-[#ea580c] text-white rounded-2xl font-black text-[11px] md:text-sm uppercase tracking-wider flex items-center justify-center gap-2 hover:from-[#ea580c] hover:to-[#c2410c] transition-all shadow-[0_10px_25px_rgba(249,115,22,0.3)] hover:shadow-[0_15px_30px_rgba(249,115,22,0.4)] cursor-pointer"
                >
                  <Zap className="w-4 h-4 md:w-5 md:h-5 fill-current" />
                  <span className="whitespace-nowrap">Buy Now</span>
                </motion.button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 md:gap-5">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-3 p-4 md:p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-[#f8fafc] p-2.5 md:p-3 rounded-xl text-[#0f172a]">
                  <Truck className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <div>
                  <h4 className="text-[12px] md:text-[14px] font-black text-[#0f172a] uppercase tracking-widest">
                    Delivery
                  </h4>
                  <p className="text-[11px] md:text-[13px] text-gray-500 font-bold mt-1">
                    {product.shipping.freeDelivery
                      ? "Free Delivery Available"
                      : `Charge: ৳${product.shipping.deliveryCharge}`}
                  </p>
                </div>
              </div>
              <div className="flex flex-col md:flex-row items-start md:items-center gap-3 p-4 md:p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-[#f8fafc] p-2.5 md:p-3 rounded-xl text-[#0f172a]">
                  <MapPin className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <div>
                  <h4 className="text-[12px] md:text-[14px] font-black text-[#0f172a] uppercase tracking-widest">
                    Origin
                  </h4>
                  <p className="text-[11px] md:text-[13px] text-gray-500 font-bold mt-1 line-clamp-1">
                    {product.shipping.origin}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 md:mt-24 grid grid-cols-1 lg:grid-cols-3 gap-10 md:gap-14">
          <div className="lg:col-span-2">
            <h3 className="text-xl md:text-2xl font-black text-[#0f172a] mb-6 md:mb-8 border-b border-gray-200 pb-4 uppercase tracking-widest">
              Product Details
            </h3>
            <div className="bg-white p-6 md:p-10 rounded-[2rem] border border-gray-100 shadow-sm">
              <p className="text-gray-600 leading-loose font-medium text-[15px] md:text-lg mb-8 md:mb-10 whitespace-pre-wrap">
                {product.content.description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
                {product.content.features.map((feature, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 md:gap-4 p-4 md:p-5 bg-[#f8fafc] rounded-2xl border border-gray-100 transition-colors hover:border-[#f97316]/30"
                  >
                    <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6 text-[#f97316] shrink-0 mt-0.5" />
                    <span className="text-[14px] md:text-[15px] font-bold text-[#0f172a] leading-snug">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6 md:space-y-8">
            <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-gray-100 shadow-sm">
              <h4 className="text-[11px] md:text-sm font-black text-[#0f172a] uppercase tracking-widest mb-5 md:mb-6 flex items-center gap-2 md:gap-3">
                <Tag className="w-4 h-4 md:w-5 md:h-5 text-[#f97316]" /> Product
                Tags
              </h4>
              <div className="flex flex-wrap gap-2 md:gap-2.5">
                {product.content.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 md:px-4 md:py-2 bg-[#f8fafc] border border-gray-100 rounded-xl text-[11px] md:text-[13px] font-bold text-gray-500 hover:text-[#0f172a] hover:bg-white hover:shadow-sm transition-all cursor-pointer"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#0f172a] to-[#1e293b] p-6 md:p-8 rounded-[2rem] text-white shadow-xl relative overflow-hidden">
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#f97316] opacity-20 blur-3xl rounded-full"></div>
              <div className="flex items-center gap-3 md:gap-4 mb-5 md:mb-6 relative z-10">
                <div className="p-2 md:p-2.5 bg-white/10 rounded-xl">
                  <Clock className="w-6 h-6 md:w-7 md:h-7 text-[#f97316]" />
                </div>
                <h4 className="font-black text-lg md:text-xl tracking-widest uppercase">
                  Shelf Life
                </h4>
              </div>
              <p className="text-[14px] md:text-base text-white/80 font-medium mb-5 md:mb-6 italic leading-relaxed relative z-10">
                &quot;{product.name} stays fresh for up to{" "}
                {product.shipping.shelfLife} if stored properly.&quot;
              </p>
              <div className="w-full text-center text-[11px] md:text-[12px] font-black bg-white/10 px-4 py-3 md:py-3.5 rounded-xl tracking-widest uppercase relative z-10 border border-white/5">
                Est. Delivery: {product.shipping.estimatedDelivery}
              </div>
            </div>
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <section className="py-16 md:py-24 mt-10 md:mt-16 bg-white border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-black text-[#0f172a] mb-8 md:mb-12 text-center uppercase tracking-widest">
              You May Also Like
            </h2>
            <Swiper
              slidesPerView={2}
              spaceBetween={12}
              autoplay={{ delay: 3500, disableOnInteraction: false }}
              modules={[Autoplay]}
              breakpoints={{
                640: { slidesPerView: 2, spaceBetween: 16 },
                768: { slidesPerView: 3, spaceBetween: 20 },
                1024: { slidesPerView: 4, spaceBetween: 24 },
                1280: { slidesPerView: 5, spaceBetween: 24 },
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
