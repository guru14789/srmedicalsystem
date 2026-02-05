import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { firebaseService } from '@/lib/firebaseService';
import StoreSidebar from '@/components/store/StoreSidebar';
import StoreFilters from '@/components/store/StoreFilters';
import ProductCard from '@/components/store/ProductCard';
import { ShoppingBag, Sparkles, Filter, ChevronRight } from 'lucide-react';

const Store = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([{ id: 'all', name: 'All Products' }]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await firebaseService.getProducts();
        if (response.success && response.data) {
          setProducts(response.data);
          setFilteredProducts(response.data);

          const uniqueCategories = [...new Set(response.data.map(p => p.category).filter(Boolean))];
          const categoryList = [
            { id: 'all', name: 'All Products' },
            ...uniqueCategories.map(cat => ({
              id: cat,
              name: cat.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
            }))
          ];
          setCategories(categoryList);
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    let filtered = products;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    switch (sortBy) {
      case 'price-low':
        filtered = [...filtered].sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered = [...filtered].sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered = [...filtered].sort((a, b) => b.rating - a.rating);
        break;
      case 'name':
        filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    setFilteredProducts(filtered);
  }, [products, selectedCategory, searchTerm, sortBy]);

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Medical Equipment Store | SR Medical System - Buy Clinical Tools</title>
        <meta
          name="description"
          content="Shop certified, high-quality medical devices for diagnostics, monitoring, and patient care. The leading clinical gear store in Chennai."
        />
        <link rel="canonical" href="https://srmedicalsystem.in/store" />
      </Helmet>

      {/* Immersive Hero Section */}
      <section className="relative min-h-[60vh] flex items-center pt-40 pb-24 border-b border-gray-100">
        <div className="absolute inset-0 z-0 text-[#ffffff]">
          <div className="absolute inset-0 bg-gradient-to-b from-[#1e1b4b]/95 via-[#373086]/90 to-[#373086]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,_rgba(79,70,229,0.15),transparent_50%)]"></div>
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent"></div>
        </div>

        <div className="container-custom relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-blue-200 text-xs font-bold uppercase tracking-[0.2em] mb-8"
            >
              <ShoppingBag size={14} /> Global Medical Marketplace
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-8xl font-black text-white leading-[0.95] mb-8 tracking-tighter"
            >
              Clinical <br />
              <span className="text-blue-300">Inventory Hub</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl text-white/70 max-w-2xl mx-auto font-medium leading-relaxed"
            >
              Precision tools for diagnostic accuracy, surgical excellence, and comprehensive patient monitoring. Certified by international standards.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Store Section */}
      <section className="py-24 bg-gray-50">
        <div className="container-custom">
          <div className="flex flex-col lg:flex-row gap-12">

            {/* Redesigned Sidebar - Desktop */}
            <aside className="hidden lg:block w-80 flex-shrink-0">
              <div className="sticky top-32">
                <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 mb-8">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-[#373086] rounded-xl flex items-center justify-center text-white">
                      <Filter size={20} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 tracking-tight">Browse by</h3>
                  </div>
                  <StoreSidebar
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onSelectCategory={setSelectedCategory}
                  />
                </div>

                <div className="bg-gradient-to-br from-[#373086] to-[#4f46e5] p-8 rounded-[2.5rem] text-white overflow-hidden relative group">
                  <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-500"></div>
                  <Sparkles size={32} className="mb-6 opacity-80" />
                  <h4 className="text-xl font-bold mb-3">Bulk Procurement</h4>
                  <p className="text-sm text-white/70 mb-6 font-light">Looking for hospital-wide equipment installation? Connect with our supply consultants.</p>
                  <button className="flex items-center gap-2 text-sm font-bold group-hover:gap-3 transition-all">
                    Request Quote <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 space-y-10">

              {/* Filter Area Redesigned */}
              <div className="bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] shadow-xl border border-gray-100">
                <StoreFilters
                  searchTerm={searchTerm}
                  onSearchChange={(e) => setSearchTerm(e.target.value)}
                  sortBy={sortBy}
                  onSortChange={setSortBy}
                  productCount={filteredProducts.length}
                />
              </div>

              {/* Mobile Category Pill Navigation */}
              <div className="lg:hidden overflow-x-auto pb-4 -mx-1 flex gap-3 px-1 no-scrollbar">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-6 py-3 rounded-2xl text-sm font-bold transition-all whitespace-nowrap ${selectedCategory === cat.id
                      ? 'bg-[#373086] text-white shadow-lg'
                      : 'bg-white text-gray-500 border border-gray-100 hover:border-[#373086]'
                      }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>

              {/* Loading State */}
              {loading && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="bg-white rounded-[2.5rem] h-96 animate-pulse border border-gray-100" />
                  ))}
                </div>
              )}

              {/* Product Grid */}
              <AnimatePresence mode="popLayout">
                {!loading && filteredProducts.length > 0 && (
                  <motion.div
                    layout
                    className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
                  >
                    {filteredProducts.map((product, index) => (
                      <motion.div
                        layout
                        key={product.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                      >
                        <ProductCard product={product} />
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* No Products Found */}
              {!loading && filteredProducts.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-[3rem] p-16 text-center shadow-xl border border-gray-100"
                >
                  <div className="w-20 h-20 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
                    <ShoppingBag size={40} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Inventory Sync Error</h3>
                  <p className="text-gray-500 font-light max-w-sm mx-auto">We couldn't find any products matching your current filtration criteria.</p>
                  <button
                    onClick={() => { setSelectedCategory('all'); setSearchTerm(''); }}
                    className="mt-8 px-8 py-3 bg-[#373086] text-white rounded-2xl font-bold hover:bg-[#1e1b4b] transition-all"
                  >
                    Reset All Filters
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-24 bg-white border-t border-gray-100">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div>
              <div className="w-16 h-16 bg-blue-50 text-[#373086] rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Sparkles size={32} />
              </div>
              <h4 className="text-xl font-bold mb-3">Authentic Gear</h4>
              <p className="text-gray-500 font-light px-4">Direct sourcing from world-leading clinical equipment manufacturers.</p>
            </div>
            <div>
              <div className="w-16 h-16 bg-indigo-50 text-[#373086] rounded-2xl flex items-center justify-center mx-auto mb-6">
                <ShoppingBag size={32} />
              </div>
              <h4 className="text-xl font-bold mb-3">Secure Delivery</h4>
              <p className="text-gray-500 font-light px-4">Specialized medical logistics ensuring zero calibration drift during transit.</p>
            </div>
            <div>
              <div className="w-16 h-16 bg-blue-50 text-[#373086] rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Filter size={32} />
              </div>
              <h4 className="text-xl font-bold mb-3">Technical Audit</h4>
              <p className="text-gray-500 font-light px-4">Every unit undergoes a 48-point diagnostic check before dispatch.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Store;
