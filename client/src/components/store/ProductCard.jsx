import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, ShoppingCart, Heart, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/FirebaseAuthContext";
import { firebaseService } from "@/lib/firebaseService";
import { toast } from "@/components/ui/use-toast";
import { generateSlug, optimizeCloudinaryUrl } from "@/lib/utils";

const ProductCard = ({ product, index }) => {
    const { addToCart } = useCart();
    const { user } = useAuth();
    const [imageSrc, setImageSrc] = useState(optimizeCloudinaryUrl(product.image));
    const [isInWishlist, setIsInWishlist] = useState(false);

    // Get original price from either camelCase or snake_case
    const originalPrice = product.originalPrice || product.original_price;

    useEffect(() => {
        checkWishlist();
    }, [user, product.id]);

    const checkWishlist = async () => {
        if (!user) return;
        const response = await firebaseService.getWishlist(user.uid);
        if (response.success) {
            const inWishlist = response.data.some(
                (item) => item.product_id === product.id,
            );
            setIsInWishlist(inWishlist);
        }
    };

    const handleAddToCart = (product) => {
        addToCart(product);
    };

    const handleToggleWishlist = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user) {
            toast({
                title: "Login Required",
                description: "Experience personalization by signing in.",
                variant: "destructive",
            });
            return;
        }

        if (isInWishlist) {
            const response = await firebaseService.removeFromWishlist(
                user.uid,
                product.id,
            );
            if (response.success) {
                setIsInWishlist(false);
                toast({
                    title: "Archived",
                    description: "Removed from your personal collection.",
                });
            }
        } else {
            const response = await firebaseService.addToWishlist(user.uid, product);
            if (response.success) {
                setIsInWishlist(true);
                toast({
                    title: "Wishlisted",
                    description: "Saved to your personal collection.",
                });
            }
        }
    };

    const handleImageError = () => {
        setImageSrc("/placeholder-product.svg");
    };

    const getBadgeVariant = (badge) => {
        switch (badge?.toLowerCase()) {
            case "best seller":
            case "best-seller":
                return "default";
            case "new arrival":
                return "secondary";
            case "testing":
                return "outline";
            default:
                return "default";
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.05 }}
            className="h-full group"
        >
            <Card className="h-full bg-white border border-gray-100 rounded-[2.5rem] overflow-hidden hover:shadow-[0_32px_64px_-16px_rgba(55,48,134,0.15)] transition-all duration-500 transform hover:-translate-y-2">
                <div className="relative overflow-hidden aspect-[4/3]">
                    <img
                        src={imageSrc}
                        alt={product.name}
                        onError={handleImageError}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {product.badge && (
                        <Badge
                            variant={getBadgeVariant(product.badge)}
                            className="absolute top-6 left-6 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.1em] shadow-lg border-none"
                        >
                            {product.badge}
                        </Badge>
                    )}

                    <button
                        onClick={handleToggleWishlist}
                        className="absolute top-6 right-6 p-3 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl hover:bg-white transition-all hover:scale-110 active:scale-95 z-10"
                    >
                        <Heart
                            className={`w-5 h-5 ${isInWishlist ? "fill-red-500 text-red-500" : "text-gray-400"}`}
                        />
                    </button>

                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                        <div className="bg-white/90 backdrop-blur-md px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-2 transform translate-y-10 group-hover:translate-y-0 transition-transform duration-500 pointer-events-auto">
                            <Link to={`/product/${generateSlug(product.name)}`} className="text-[#373086] font-bold text-sm flex items-center gap-2">
                                <Eye size={16} /> Quick View
                            </Link>
                        </div>
                    </div>
                </div>

                <CardContent className="p-8 flex flex-col justify-between flex-grow">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#373086]/50">
                                {product.category || 'Clinical Tool'}
                            </span>
                            <div className="flex items-center gap-1 bg-yellow-400/10 px-2 py-1 rounded-lg">
                                <Star className="w-3 h-3 text-yellow-500 fill-current" />
                                <span className="text-xs font-bold text-yellow-700">{product.rating || '5.0'}</span>
                            </div>
                        </div>

                        <Link to={`/product/${generateSlug(product.name)}`}>
                            <h3 className="text-lg font-bold text-gray-900 leading-tight hover:text-[#373086] transition-colors line-clamp-2 h-14">
                                {product.name}
                            </h3>
                        </Link>
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-50 space-y-6">
                        <div className="flex items-baseline gap-3">
                            <span className="text-2xl font-black text-gray-900">
                                ₹{product.price.toLocaleString()}
                            </span>
                            {originalPrice && (
                                <span className="text-sm text-gray-400 line-through font-medium">
                                    ₹{originalPrice.toLocaleString()}
                                </span>
                            )}
                        </div>

                        <Button
                            onClick={() => handleAddToCart(product)}
                            className="w-full h-14 bg-[#373086] hover:bg-[#1e1b4b] text-white rounded-2xl font-bold shadow-xl transition-all active:scale-95 group/btn overflow-hidden"
                            size="lg"
                        >
                            <ShoppingCart className="w-5 h-5 mr-3 group-hover/btn:translate-x-1 transition-transform" />
                            Add to Cart
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default ProductCard;
