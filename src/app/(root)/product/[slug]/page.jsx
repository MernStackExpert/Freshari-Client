"use client";
import React, { useState, useEffect, use } from "react";
import Image from "next/image";
import axios from "axios";
import { useCart } from "@/context/CartContext";
import { 
  Star, Truck, ShieldCheck, Clock, Minus, Plus, 
  ShoppingCart, ChevronLeft, Zap, Package, 
  MapPin, Tag, CheckCircle2, AlertCircle 
} from "lucide-react";
import ProductCard from "@/components/shared/ProductCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { useRouter } from "next/navigation";
import "swiper/css";

const ProductDetails = ({ params: paramsPromise }) => {
  const params = use(paramsPromise);
  const slug = params.slug;
  const router = useRouter();

  const [product, setProduct] = useState(null);
  const [activeImg, setActiveImg] = useState("");
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const { addToCart , buyNow } = useCart();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products`);
        const allProducts = res.data.products || [];
        const currentProduct = allProducts.find((p) => p.slug === slug);
        
        if (currentProduct) {
          setProduct(currentProduct);
          setActiveImg(currentProduct.media.images[0] || currentProduct.media.thumbnail);
          const related = allProducts
            .filter((p) => p.category.main.toLowerCase() === currentProduct.category.main.toLowerCase() && p.slug !== slug)
            .slice(0, 10);
          setRelatedProducts(related);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchDetails();
  }, [slug]);



  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#16a34a] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <main className="bg-white pb-20">
      <div className="main-container py-6">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-500 font-bold hover:text-[#16a34a] transition-colors mb-8 cursor-pointer group"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          পিছনে ফিরে যান
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-6">
            <div className="relative aspect-square rounded-3xl overflow-hidden border border-gray-100 bg-[#f9f9f9]">
              <Image src={activeImg} alt={product.name} fill className="object-contain p-6 md:p-10" priority />
              {product.pricing.discountPercentage > 0 && (
                <div className="absolute top-5 left-5 bg-[#ff4d4d] text-white text-xs font-black px-3 py-1.5 rounded-full shadow-lg">
                  {product.pricing.discountPercentage}% OFF
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-5 gap-4">
              {product.media.images.map((img, i) => (
                <div 
                  key={i}
                  onClick={() => setActiveImg(img)}
                  className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${activeImg === img ? "border-[#16a34a]" : "border-gray-100 hover:border-gray-300"}`}
                >
                  <Image src={img} alt={`${product.name}-${i}`} fill className="object-cover p-1" />
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="bg-[#f0fdf4] text-[#16a34a] text-[10px] font-black px-3 py-1 rounded-full border border-[#16a34a20] uppercase">
                  {product.brand}
                </span>
                <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">SKU: {product.sku}</span>
              </div>
              <div className={`flex items-center gap-1 text-[11px] font-black uppercase ${product.inventory.stock > 0 ? "text-[#16a34a]" : "text-red-500"}`}>
                {product.inventory.stock > 0 ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                {product.inventory.stockStatus.replace("-", " ")}
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-black text-[#064e3b] mb-4 leading-tight">{product.name}</h1>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1 bg-orange-50 px-2 py-1 rounded-lg">
                <Star className="w-4 h-4 text-orange-500 fill-current" />
                <span className="text-sm font-black text-orange-600">{product.social.rating}</span>
              </div>
              <span className="text-gray-400 text-sm font-bold">({product.social.totalReviews} Reviews)</span>
              <span className="text-gray-300">|</span>
              <span className="text-[#16a34a] text-sm font-bold">Unit: 1 {product.inventory.unit}</span>
            </div>

            <div className="flex items-center gap-4 mb-8">
              <span className="text-4xl font-black text-[#f97316]">৳{product.pricing.price}</span>
              {product.pricing.oldPrice > product.pricing.price && (
                <span className="text-xl text-gray-400 line-through">৳{product.pricing.oldPrice}</span>
              )}
            </div>

            <p className="text-gray-500 leading-relaxed mb-8 font-medium">{product.content.shortDescription}</p>

            <div className="flex flex-col gap-5 mb-10 pb-10 border-b border-gray-100">
              <div className="flex items-center gap-4">
                <span className="text-sm font-black text-[#064e3b] uppercase tracking-wider">Quantity:</span>
                <div className="flex items-center border-2 border-gray-100 rounded-2xl h-[50px] px-2 bg-white">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 hover:text-[#16a34a] cursor-pointer"><Minus className="w-5 h-5" /></button>
                  <span className="w-12 text-center font-black text-lg">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="p-2 hover:text-[#16a34a] cursor-pointer"><Plus className="w-5 h-5" /></button>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button 
                  onClick={() => addToCart({...product, quantity})}
                  className="flex-1 min-w-[180px] h-[55px] border-2 border-[#16a34a] text-[#16a34a] rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-[#16a34a] hover:text-white transition-all cursor-pointer group"
                >
                  <ShoppingCart className="w-5 h-5 transition-transform group-active:scale-90" /> Add To Cart
                </button>
                <button 
                  onClick={() => buyNow(product)}
                  className="flex-1 min-w-[180px] h-[55px] bg-[#f97316] text-white rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-[#ea580c] transition-all shadow-lg shadow-[#f9731630] cursor-pointer"
                >
                  <Zap className="w-5 h-5 fill-current" /> Buy Now
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 bg-[#fcfdfd] rounded-2xl border border-gray-100">
                <div className="bg-white p-2 rounded-xl shadow-sm text-[#16a34a]"><Truck className="w-5 h-5" /></div>
                <div>
                  <h4 className="text-[13px] font-black text-[#064e3b]">Delivery Charge</h4>
                  <p className="text-[11px] text-gray-500 font-bold">{product.shipping.freeDelivery ? "Free Delivery" : `৳${product.shipping.deliveryCharge}`}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-[#fcfdfd] rounded-2xl border border-gray-100">
                <div className="bg-white p-2 rounded-xl shadow-sm text-[#16a34a]"><MapPin className="w-5 h-5" /></div>
                <div>
                  <h4 className="text-[13px] font-black text-[#064e3b]">Origin</h4>
                  <p className="text-[11px] text-gray-500 font-bold">{product.shipping.origin}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <h3 className="text-xl font-black text-[#064e3b] mb-6 border-b border-gray-100 pb-4">Detailed Description</h3>
            <p className="text-gray-600 leading-loose font-medium mb-8">{product.content.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {product.content.features.map((feature, i) => (
                <div key={i} className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                  <CheckCircle2 className="w-5 h-5 text-[#16a34a]" />
                  <span className="text-sm font-bold text-[#064e3b]">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-[#fcfdfd] p-6 rounded-3xl border border-gray-100">
              <h4 className="text-sm font-black text-[#064e3b] uppercase tracking-wider mb-4 flex items-center gap-2">
                <Tag className="w-4 h-4 text-[#16a34a]" /> Tags
              </h4>
              <div className="flex flex-wrap gap-2">
                {product.content.tags.map((tag, i) => (
                  <span key={i} className="px-3 py-1.5 bg-white border border-gray-100 rounded-lg text-[12px] font-bold text-gray-500 hover:text-[#16a34a] hover:border-[#16a34a20] transition-colors cursor-pointer">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-[#064e3b] p-6 rounded-3xl text-white">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="w-6 h-6 text-[#16a34a]" />
                <h4 className="font-black">Shelf Life</h4>
              </div>
              <p className="text-sm text-white/80 font-medium mb-4 italic">"{product.name} stays fresh for up to {product.shipping.shelfLife} if stored properly."</p>
              <div className="text-[11px] font-bold bg-white/10 p-2 rounded-lg inline-block">Estimated Delivery: {product.shipping.estimatedDelivery}</div>
            </div>
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <section className="py-16 bg-[#fcfdfd]">
          <div className="main-container">
            <h2 className="text-2xl font-black text-[#064e3b] mb-10 text-center uppercase tracking-tight">You May Also Like</h2>
            <Swiper
              slidesPerView={2}
              spaceBetween={15}
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              modules={[Autoplay]}
              breakpoints={{
                640: { slidesPerView: 2 },
                768: { slidesPerView: 3 },
                1024: { slidesPerView: 5 },
              }}
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