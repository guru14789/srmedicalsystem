import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/FirebaseAuthContext';
import { useCart } from '@/contexts/CartContext';
import { firebaseService } from '@/lib/firebaseService';

const Wishlist = () => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadWishlist();
    }
  }, [user]);

  const loadWishlist = async () => {
    try {
      setLoading(true);
      const response = await firebaseService.getWishlist(user.uid);
      if (response.success) {
        setWishlist(response.data || []);
      }
    } catch (error) {
      console.error('Failed to load wishlist:', error);
      toast({
        title: "Error",
        description: "Failed to load wishlist.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId) => {
    try {
      const response = await firebaseService.removeFromWishlist(user.uid, productId);
      if (response.success) {
        setWishlist(prev => prev.filter(item => item.product_id !== productId));
        toast({
          title: "Removed from wishlist",
          description: "Item has been removed from your wishlist.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove item.",
        variant: "destructive",
      });
    }
  };

  const handleAddToCart = async (item) => {
    await addToCart({
      _id: item.product_id,
      id: item.product_id,
      name: item.product_name,
      price: item.product_price,
      image: item.product_image
    }, 1);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Heart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign in to view wishlist</h2>
          <p className="text-gray-600 mb-6">Please log in to see your saved items.</p>
          <Link to="/login">
            <Button>Sign In</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>My Wishlist | SR Medical System</title>
        <meta name="description" content="Your saved medical equipment items" />
      </Helmet>

      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="text-center space-y-4">
              <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
              <p className="text-gray-600">Your saved medical equipment</p>
            </div>

            {wishlist.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center space-y-6"
              >
                <div className="w-24 h-24 mx-auto bg-gray-200 rounded-full flex items-center justify-center">
                  <Heart className="w-12 h-12 text-gray-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Your wishlist is empty</h2>
                <p className="text-gray-600 max-w-md mx-auto">
                  Browse our store and save your favorite items for later.
                </p>
                <Link to="/store">
                  <Button className="btn-primary">
                    Browse Products
                  </Button>
                </Link>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlist.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card className="card-hover relative">
                      <button
                        onClick={() => handleRemove(item.product_id)}
                        className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors"
                        aria-label="Remove from wishlist"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                      <Link to={`/product/${item.product_id}`}>
                        <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-t-lg bg-gray-200">
                          <img
                            src={item.product_image || "https://images.unsplash.com/photo-1658204212985-e0126040f88f"}
                            alt={item.product_name}
                            className="h-48 w-full object-cover object-center group-hover:opacity-75"
                          />
                        </div>
                      </Link>
                      <CardContent className="p-4">
                        <Link to={`/product/${item.product_id}`}>
                          <h3 className="text-lg font-medium text-gray-900 hover:text-primary transition-colors">
                            {item.product_name}
                          </h3>
                        </Link>
                        <p className="mt-2 text-2xl font-bold text-primary">
                          ₹{parseFloat(item.product_price).toFixed(2)}
                        </p>
                        <Button
                          onClick={() => handleAddToCart(item)}
                          className="w-full mt-4 flex items-center justify-center"
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Add to Cart
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Wishlist;
