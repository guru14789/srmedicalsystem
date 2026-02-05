import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  ShoppingCart,
  Heart,
  Minus,
  Plus,
  ArrowLeft,
  Shield,
  Truck,
  RotateCcw,
  Award,
  CheckCircle,
  Download,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/contexts/CartContext";
import { toast } from "@/components/ui/use-toast";
import { firebaseService } from "@/lib/firebaseService";
import { generateSlug, optimizeCloudinaryUrl } from "@/lib/utils";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [imageErrors, setImageErrors] = useState({});
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        let response = await firebaseService.getProduct(id);

        if (!response.success) {
          response = await firebaseService.getProductBySlug(id);
        }

        if (response.success && response.data) {
          const p = response.data;
          const images = p.image ? [p.image] : ["/placeholder-product.svg"];
          const keyFeatures = Array.isArray(p.key_features)
            ? p.key_features
            : p.key_features
              ? [p.key_features]
              : [];

          const specs = p.specifications || {};
          const legacyKeyMap = {
            model: "Model",
            power: "Power",
            max_vacuum: "Max Vacuum",
            flow_rate: "Flow Rate",
            jar_capacity: "Jar Capacity",
            noise_level: "Noise Level",
            weight: "Weight",
            dimensions: "Dimensions"
          };

          const specsObject = {};
          Object.entries(specs).forEach(([key, value]) => {
            const displayKey = legacyKeyMap[key] || key;
            if (value) specsObject[displayKey] = value;
          });

          setProduct({
            id: p.id,
            name: p.name,
            price: parseFloat(p.price) || 0,
            originalPrice: p.original_price ? parseFloat(p.original_price) : null,
            images: images,
            category: p.category || "Medical Equipment",
            rating: p.rating !== undefined ? parseFloat(p.rating) : 4.5,
            reviews: p.reviews_count || 24,
            inStock: p.stock > 0,
            description: p.description || "",
            features: keyFeatures,
            specifications: specsObject,
            warranty: p.warranty_info || "1 Year Standard Warranty",
            shipping: p.shipping_info || "Clinical Express Delivery",
            returnPolicy: p.return_policy || "7 Days Technical Support",
            stock: p.stock || 0,
            badge: p.badge || "Certified",
          });
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      toast({
        title: "Sync Successful",
        description: `${product.name} added to your clinical inventory.`
      });
    }
  };

  const handleImageError = (index) => {
    setImageErrors((prev) => ({ ...prev, [index]: true }));
  };

  const getImageSrc = (index) => {
    const src = imageErrors[index] ? "/placeholder-product.svg" : product.images[index];
    return optimizeCloudinaryUrl(src);
  };

  if (loading || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-[#373086] border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>{`${product.name} | Professional Medical Equipment | SR Medical System`}</title>
        <meta name="description" content={product.description} />
      </Helmet>

      {/* Breadcrumb / Back Navigation */}
      <div className="pt-32 pb-6 bg-gray-50/50 hidden md:block border-b border-gray-100">
        <div className="container-custom flex items-center gap-4 text-sm font-bold uppercase tracking-widest text-gray-400">
          <Link to="/store" className="hover:text-[#373086] transition-colors">Inventory</Link>
          <ChevronRight size={14} />
          <span className="text-[#373086]">{product.category}</span>
          <ChevronRight size={14} />
          <span className="text-gray-900 border-b-2 border-[#373086] pb-1">{product.name}</span>
        </div>
      </div>

      <main className="py-12 md:py-24">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24">

            {/* Image Gallery Column */}
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative group aspect-square bg-gray-50 rounded-[3rem] overflow-hidden border border-gray-100 shadow-2xl"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(55,48,134,0.05),transparent_70%)] pointer-events-none"></div>
                <img
                  src={getImageSrc(selectedImage)}
                  alt={product.name}
                  className="w-full h-full object-contain p-12 transition-transform duration-700 group-hover:scale-105"
                />

                <div className="absolute top-8 left-8 flex flex-col gap-3">
                  <Badge className="px-6 py-2 bg-[#373086] text-white border-none rounded-2xl shadow-xl font-bold uppercase tracking-widest text-[10px]">
                    {product.badge}
                  </Badge>
                  <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg border border-white/20">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-600">Clinical Grade</span>
                  </div>
                </div>

                <button className="absolute top-8 right-8 p-4 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl hover:bg-white transition-all hover:scale-110 group-hover:shadow-2xl">
                  <Heart className="w-5 h-5 text-gray-400" />
                </button>
              </motion.div>

              <div className="grid grid-cols-4 gap-4">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`aspect-square rounded-2xl overflow-hidden transition-all p-2 border-2 ${selectedImage === i ? "border-[#373086] bg-[#373086]/5" : "border-gray-100 hover:border-gray-200"
                      }`}
                  >
                    <img
                      src={getImageSrc(i)}
                      alt={`View ${i}`}
                      className="w-full h-full object-contain"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info Column */}
            <div className="flex flex-col">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <span className="inline-block text-[#373086] font-black uppercase text-xs tracking-[0.3em] mb-4">
                  {product.category}
                </span>
                <h1 className="text-4xl md:text-6xl font-black text-gray-900 leading-[1.1] mb-6 tracking-tighter">
                  {product.name}
                </h1>

                <div className="flex items-center gap-6 mb-10">
                  <div className="flex items-center gap-1 bg-yellow-400/10 px-4 py-2 rounded-2xl border border-yellow-400/20">
                    <div className="flex text-yellow-500">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          fill={i < Math.floor(product.rating) ? "currentColor" : "none"}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-bold text-yellow-700 ml-2">{product.rating}</span>
                  </div>
                  <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                    {product.reviews} Verified Inquiries
                  </span>
                </div>

                <div className="bg-gray-50/50 p-8 rounded-[2.5rem] border border-gray-100 mb-10 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Award size={80} className="text-[#373086]" />
                  </div>
                  <div className="flex items-baseline gap-4 mb-2">
                    <span className="text-5xl font-black text-gray-900">
                      ₹{product.price.toLocaleString()}
                    </span>
                    {product.originalPrice && (
                      <span className="text-xl text-gray-400 line-through font-medium">
                        ₹{product.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                    <span className="text-xs font-bold uppercase tracking-widest text-green-600">
                      Export Standard Compliance
                    </span>
                  </div>
                </div>

                <p className="text-xl text-gray-500 font-light leading-relaxed mb-12 max-w-xl">
                  {product.description}
                </p>

                {/* Purchase Actions */}
                <div className="space-y-6 mb-12">
                  <div className="flex flex-col sm:flex-row gap-4 items-center">
                    <div className="flex items-center bg-gray-50 rounded-2xl p-1 border border-gray-100 w-full sm:w-auto">
                      <button
                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                        className="w-14 h-14 flex items-center justify-center text-gray-400 hover:text-[#373086] transition-colors"
                      >
                        <Minus size={20} />
                      </button>
                      <span className="w-14 text-center font-black text-lg text-gray-900">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(q => q + 1)}
                        className="w-14 h-14 flex items-center justify-center text-gray-400 hover:text-[#373086] transition-colors"
                      >
                        <Plus size={20} />
                      </button>
                    </div>

                    <Button
                      onClick={handleAddToCart}
                      className="flex-1 h-16 bg-[#373086] hover:bg-[#1e1b4b] text-white rounded-[1.25rem] font-black text-lg shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3"
                    >
                      <ShoppingCart size={24} /> Sync to Inventory
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Link
                      to="/quote"
                      className="h-16 border-2 border-gray-100 hover:border-[#373086] hover:bg-gray-50 text-[#373086] rounded-[1.25rem] font-bold text-sm flex items-center justify-center gap-2 transition-all uppercase tracking-widest"
                    >
                      Request Proposal
                    </Link>
                    <button className="h-16 bg-gray-50 hover:bg-gray-100 text-gray-500 rounded-[1.25rem] font-bold text-sm flex items-center justify-center gap-2 transition-all uppercase tracking-widest">
                      Technical Spec PDF <Download size={18} />
                    </button>
                  </div>
                </div>

                {/* Micro Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 border-t border-gray-50">
                  <div className="flex items-start gap-4 group">
                    <div className="w-12 h-12 bg-blue-50 text-[#373086] rounded-xl flex items-center justify-center group-hover:bg-[#373086] group-hover:text-white transition-all duration-500">
                      <Shield size={24} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 mb-1">Protection</h4>
                      <p className="text-xs text-gray-500 font-light leading-relaxed">{product.warranty}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 group">
                    <div className="w-12 h-12 bg-indigo-50 text-[#373086] rounded-xl flex items-center justify-center group-hover:bg-[#373086] group-hover:text-white transition-all duration-500">
                      <Truck size={24} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 mb-1">Logistics</h4>
                      <p className="text-xs text-gray-500 font-light leading-relaxed">{product.shipping}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 group">
                    <div className="w-12 h-12 bg-blue-50 text-[#373086] rounded-xl flex items-center justify-center group-hover:bg-[#373086] group-hover:text-white transition-all duration-500">
                      <RotateCcw size={24} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 mb-1">Return Protocol</h4>
                      <p className="text-xs text-gray-500 font-light leading-relaxed">{product.returnPolicy}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Detailed Specifications / Technical Data */}
          <section className="mt-32">
            <div className="flex flex-col md:flex-row gap-12 items-start">

              <div className="flex-1 space-y-12">
                <div>
                  <h3 className="text-3xl font-black text-gray-900 mb-8 flex items-center gap-4">
                    <div className="w-10 h-10 bg-[#373086] rounded-xl flex items-center justify-center text-white">
                      <CheckCircle size={20} />
                    </div>
                    Clinical Excellence
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                    {product.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-4 p-6 bg-gray-50/50 rounded-2xl border border-gray-100 hover:bg-white hover:shadow-xl transition-all group">
                        <div className="w-2 h-2 rounded-full bg-[#373086] opacity-30 group-hover:opacity-100 transition-opacity"></div>
                        <span className="text-gray-700 font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-3xl font-black text-gray-900 mb-8 flex items-center gap-4">
                    <div className="w-10 h-10 bg-[#373086] rounded-xl flex items-center justify-center text-white">
                      <Info size={20} />
                    </div>
                    Technical Matrix
                  </h3>
                  <div className="bg-white rounded-[3rem] border border-gray-100 shadow-2xl overflow-hidden">
                    <table className="w-full">
                      <tbody>
                        {Object.entries(product.specifications).map(([key, value], idx) => (
                          <tr key={key} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
                            <td className="px-8 py-6 text-sm font-black uppercase tracking-widest text-[#373086] w-1/3 border-r border-gray-100">{key}</td>
                            <td className="px-8 py-6 text-gray-600 font-medium">{value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Sidebar Info - Hospital Standards */}
              <div className="w-full md:w-96 space-y-8">
                <div className="bg-[#1e1b4b] p-10 rounded-[3rem] text-white relative overflow-hidden shadow-2xl">
                  <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-[#373086] rounded-full blur-3xl opacity-50"></div>
                  <Award size={40} className="text-blue-300 mb-8" />
                  <h4 className="text-2xl font-bold mb-6 tracking-tight">Installation Protocol</h4>
                  <p className="text-blue-100/70 font-light leading-relaxed mb-8">
                    This unit requires professional clinical calibration. Our factory-trained engineers provide on-site installation and staff training as part of our excellence program.
                  </p>
                  <ul className="space-y-4">
                    <li className="flex items-center gap-3 text-sm font-bold">
                      <CheckCircle size={16} className="text-blue-400" /> Site Readiness Audit
                    </li>
                    <li className="flex items-center gap-3 text-sm font-bold">
                      <CheckCircle size={16} className="text-blue-400" /> Precision Calibration
                    </li>
                    <li className="flex items-center gap-3 text-sm font-bold">
                      <CheckCircle size={16} className="text-blue-400" /> Staff Certification
                    </li>
                  </ul>
                </div>

                <div className="bg-gray-50 p-10 rounded-[3rem] border border-gray-100 shadow-xl">
                  <h4 className="text-xl font-bold text-gray-900 mb-6">Need bulk quote?</h4>
                  <p className="text-gray-500 font-light mb-8 leading-relaxed">Planning a ward renovation or new facility setup? We offer specialized package pricing.</p>
                  <Link to="/contact" className="inline-flex items-center gap-2 text-[#373086] font-black uppercase tracking-widest text-xs hover:gap-4 transition-all">
                    Contact Supply Chain <ArrowLeft className="rotate-180" size={14} />
                  </Link>
                </div>
              </div>

            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

const ChevronRight = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m9 18 6-6-6-6" />
  </svg>
);

export default ProductDetails;
