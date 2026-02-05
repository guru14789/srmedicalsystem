import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const StoreFilters = ({ searchTerm, onSearchChange, sortBy, onSortChange, productCount }) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 relative group">
          <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-[#373086] transition-colors" />
          <Input
            placeholder="Search our medical catalog..."
            value={searchTerm}
            onChange={onSearchChange}
            className="pl-14 h-16 bg-gray-50 border-none rounded-2xl focus-visible:ring-2 focus-visible:ring-[#373086] transition-all text-gray-700 font-medium"
          />
        </div>
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="w-full md:w-64 h-16 bg-gray-50 border-none rounded-2xl px-6 focus:ring-2 focus:ring-[#373086] transition-all font-bold text-[#373086]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent className="rounded-2xl border-gray-100 shadow-xl p-2">
            <SelectItem value="default" className="rounded-xl py-3">Featured Products</SelectItem>
            <SelectItem value="price-low" className="rounded-xl py-3">Price: Low to High</SelectItem>
            <SelectItem value="price-high" className="rounded-xl py-3">Price: High to Low</SelectItem>
            <SelectItem value="rating" className="rounded-xl py-3">Consumer Rating</SelectItem>
            <SelectItem value="name" className="rounded-xl py-3">Alphabetical A-Z</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between px-2">
        <p className="text-xs font-black uppercase tracking-widest text-[#373086]/40">
          Showing <span className="text-[#373086]">{productCount}</span> Available Units
        </p>
        <div className="h-px flex-1 bg-gray-100 mx-6 hidden md:block"></div>
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-blue-300"></div>
          <div className="w-2 h-2 rounded-full bg-blue-200"></div>
          <div className="w-2 h-2 rounded-full bg-blue-100"></div>
        </div>
      </div>
    </div>
  );
};

export default StoreFilters;