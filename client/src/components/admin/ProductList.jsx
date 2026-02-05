import { firebaseService } from '@/lib/firebaseService';
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  PlusCircle,
  Pencil,
  Trash2,
  Package,
  Search,
  Grid3x3,
  List,
  ArrowUpDown,
  AlertTriangle,
  ImageIcon,
  Plus,
  Minus
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const MEDICAL_CATEGORIES = [
  'Diagnostic Equipment',
  'Surgical Instruments',
  'Patient Monitoring',
  'Laboratory Equipment',
  'Imaging Equipment',
  'Therapeutic Equipment',
  'Hospital Furniture',
  'Sterilization Equipment',
  'Emergency & Trauma',
  'Personal Protective Equipment',
  'Mobility Aids',
  'Rehabilitation Equipment',
  'Other'
];

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [viewMode, setViewMode] = useState('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    image_url: '',
    original_price: '',
    gst_percentage: '18',
    weight_kg: '',
    rating: '4.5',
    warranty_info: '',
    shipping_info: '',
    return_policy: '',
    key_features: '',
    specifications: [],
    reviews_count: 0
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await firebaseService.getProducts();
      if (response.success) {
        setProducts(response.data || []);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load products",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddSpecification = () => {
    setFormData(prev => ({
      ...prev,
      specifications: [...prev.specifications, { key: '', value: '' }]
    }));
  };

  const handleRemoveSpecification = (index) => {
    setFormData(prev => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== index)
    }));
  };

  const handleSpecificationChange = (index, field, value) => {
    setFormData(prev => {
      const newSpecs = [...prev.specifications];
      newSpecs[index] = { ...newSpecs[index], [field]: value };
      return { ...prev, specifications: newSpecs };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const keyFeaturesArray = formData.key_features
        ? formData.key_features.split('\n').filter(f => f.trim())
        : [];

      const gstValue = parseFloat(formData.gst_percentage);
      const weightValue = parseFloat(formData.weight_kg);

      const ratingValue = parseFloat(formData.rating);

      const specificationsObject = Array.isArray(formData.specifications)
        ? formData.specifications.reduce((acc, curr) => {
          if (curr.key && curr.key.trim()) {
            acc[curr.key.trim()] = curr.value;
          }
          return acc;
        }, {})
        : {};

      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        image: formData.image_url,
        original_price: formData.original_price ? parseFloat(formData.original_price) : null,
        gst_percentage: Number.isNaN(gstValue) ? 18 : gstValue,
        weight_kg: Number.isNaN(weightValue) ? 0 : weightValue,
        rating: Number.isNaN(ratingValue) ? 4.5 : Math.min(5, Math.max(0, ratingValue)),
        key_features: keyFeaturesArray,
        specifications: specificationsObject,
        reviews_count: parseInt(formData.reviews_count) || 0
      };

      let response;
      if (selectedProduct) {
        response = await firebaseService.updateProduct(selectedProduct.id, productData);
      } else {
        response = await firebaseService.createProduct(productData);
      }

      toast({
        title: selectedProduct ? "Product Updated" : "Product Created",
        description: selectedProduct ? "Product has been updated successfully" : "New product has been created successfully"
      });

      setDialogOpen(false);
      setSelectedProduct(null);
      resetForm();
      fetchProducts();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to save product",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    const keyFeaturesString = Array.isArray(product.key_features)
      ? product.key_features.join('\n')
      : '';

    const legacySpecMap = {
      model: 'Model Number',
      power: 'Power',
      max_vacuum: 'Max Vacuum',
      flow_rate: 'Flow Rate',
      jar_capacity: 'Jar Capacity',
      noise_level: 'Noise Level',
      weight: 'Weight',
      dimensions: 'Dimensions'
    };

    let specsArray = [];
    if (product.specifications && typeof product.specifications === 'object') {
      specsArray = Object.entries(product.specifications).map(([key, value]) => ({
        key: legacySpecMap[key] || key,
        value: value
      }));
    }

    setFormData({
      name: product.name || '',
      description: product.description || '',
      price: product.price?.toString() || '',
      category: product.category || '',
      stock: product.stock?.toString() || '',
      image_url: product.image || product.image_url || '',
      original_price: product.original_price?.toString() || '',
      gst_percentage: product.gst_percentage !== undefined ? product.gst_percentage.toString() : '18',
      weight_kg: product.weight_kg !== undefined ? product.weight_kg.toString() : '',
      rating: product.rating !== undefined ? product.rating.toString() : '4.5',
      warranty_info: product.warranty_info || '',
      shipping_info: product.shipping_info || '',
      return_policy: product.return_policy || '',
      key_features: keyFeaturesString,
      specifications: specsArray,
      reviews_count: product.reviews_count || 0
    });
    setDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedProduct) return;

    try {
      const response = await firebaseService.deleteProduct(selectedProduct.id);

      toast({
        title: "Product Deleted",
        description: "Product has been deleted successfully"
      });

      setDeleteDialogOpen(false);
      setSelectedProduct(null);
      fetchProducts();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive"
      });
    }
  };

  const openDeleteDialog = (product) => {
    setSelectedProduct(product);
    setDeleteDialogOpen(true);
  };

  const openCreateDialog = () => {
    setSelectedProduct(null);
    resetForm();
    setDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      stock: '',
      image_url: '',
      original_price: '',
      gst_percentage: '18',
      weight_kg: '',
      rating: '4.5',
      warranty_info: '',
      shipping_info: '',
      return_policy: '',
      key_features: '',
      specifications: [],
      reviews_count: 0
    });
  };

  const getStockStatus = (stock) => {
    if (stock === 0) return { label: 'Out of Stock', variant: 'destructive' };
    if (stock < 10) return { label: 'Low Stock', variant: 'warning' };
    return { label: 'In Stock', variant: 'default' };
  };

  const filteredAndSortedProducts = () => {
    let filtered = products.filter(product => {
      const matchesSearch = (product.name ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.description ?? '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });

    filtered.sort((a, b) => {
      let aVal, bVal;
      switch (sortBy) {
        case 'name':
          aVal = a.name?.toLowerCase() || '';
          bVal = b.name?.toLowerCase() || '';
          break;
        case 'price':
          aVal = parseFloat(a.price) || 0;
          bVal = parseFloat(b.price) || 0;
          break;
        case 'stock':
          aVal = parseInt(a.stock) || 0;
          bVal = parseInt(b.stock) || 0;
          break;
        default:
          return 0;
      }

      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    return filtered;
  };

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-10">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const displayProducts = filteredAndSortedProducts();

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl">Product Management</CardTitle>
              <CardDescription>Manage your medical equipment inventory</CardDescription>
            </div>
            <Button onClick={openCreateDialog} className="btn-primary">
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mt-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-[220px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {MEDICAL_CATEGORIES.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'table' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('table')}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('grid')}
              >
                <Grid3x3 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {displayProducts.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed rounded-lg">
              <Package className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-gray-500">
                {searchTerm || categoryFilter !== 'all' ? 'No products match your filters' : 'No products yet. Create your first product!'}
              </p>
            </div>
          ) : viewMode === 'table' ? (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">Image</TableHead>
                    <TableHead>
                      <Button variant="ghost" onClick={() => toggleSort('name')} className="font-semibold">
                        Product Name
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>
                      <Button variant="ghost" onClick={() => toggleSort('price')} className="font-semibold">
                        Price
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button variant="ghost" onClick={() => toggleSort('stock')} className="font-semibold">
                        Stock
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayProducts.map((product) => {
                    const stockStatus = getStockStatus(product.stock);
                    return (
                      <TableRow key={product.id}>
                        <TableCell>
                          {product.image || product.image_url ? (
                            <img
                              src={product.image || product.image_url}
                              alt={product.name}
                              className="w-12 h-12 object-cover rounded"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                              <ImageIcon className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell className="font-semibold">₹{parseFloat(product.price).toLocaleString()}</TableCell>
                        <TableCell>
                          {product.stock < 10 && product.stock > 0 && (
                            <AlertTriangle className="inline h-4 w-4 text-yellow-600 mr-1" />
                          )}
                          {product.stock}
                        </TableCell>
                        <TableCell>
                          <Badge variant={stockStatus.variant}>{stockStatus.label}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(product)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openDeleteDialog(product)}
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayProducts.map((product) => {
                const stockStatus = getStockStatus(product.stock);
                return (
                  <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-square relative">
                      {product.image || product.image_url ? (
                        <img
                          src={product.image || product.image_url}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                          <ImageIcon className="h-16 w-16 text-gray-400" />
                        </div>
                      )}
                      <Badge className="absolute top-2 right-2" variant={stockStatus.variant}>
                        {stockStatus.label}
                      </Badge>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{product.category}</p>
                      <p className="text-sm text-gray-500 line-clamp-2 mb-3">{product.description}</p>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xl font-bold text-primary">₹{parseFloat(product.price).toLocaleString()}</span>
                        <span className="text-sm text-gray-600">
                          Stock: {product.stock}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          onClick={() => handleEdit(product)}
                        >
                          <Pencil className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openDeleteDialog(product)}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
          {displayProducts.length > 0 && (
            <div className="mt-4 text-sm text-gray-500 text-center">
              Showing {displayProducts.length} of {products.length} products
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{selectedProduct ? 'Edit Product' : 'Create New Product'}</DialogTitle>
            <DialogDescription>
              {selectedProduct ? 'Update the product details below' : 'Fill in the details to add a new product to your inventory'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Digital Blood Pressure Monitor"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {MEDICAL_CATEGORIES.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                placeholder="Provide detailed product description..."
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price (₹) *</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">Stock Quantity *</Label>
                <Input
                  id="stock"
                  name="stock"
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={handleInputChange}
                  placeholder="0"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image_url">Product Image URL</Label>
              <Input
                id="image_url"
                name="image_url"
                type="url"
                value={formData.image_url}
                onChange={handleInputChange}
                placeholder="https://example.com/product-image.jpg"
              />
              {formData.image_url && (
                <div className="mt-2">
                  <img
                    src={formData.image_url}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded border"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>

            <div className="border-t pt-4 mt-4">
              <h3 className="text-lg font-semibold mb-4">Pricing Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="original_price">Original Price (₹)</Label>
                  <Input
                    id="original_price"
                    name="original_price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.original_price}
                    onChange={handleInputChange}
                    placeholder="0.00"
                  />
                  <p className="text-xs text-gray-500">For showing discounts/savings</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reviews_count">Reviews Count</Label>
                  <Input
                    id="reviews_count"
                    name="reviews_count"
                    type="number"
                    min="0"
                    value={formData.reviews_count}
                    onChange={handleInputChange}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="gst_percentage">GST Percentage (%)</Label>
                <Input
                  id="gst_percentage"
                  name="gst_percentage"
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={formData.gst_percentage}
                  onChange={handleInputChange}
                  placeholder="18"
                />
                <p className="text-xs text-gray-500">Default is 18% GST. Adjust as needed for specific products.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="rating">Product Rating (Stars)</Label>
                <Input
                  id="rating"
                  name="rating"
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={formData.rating}
                  onChange={handleInputChange}
                  placeholder="4.5"
                />
                <p className="text-xs text-gray-500">Set product rating from 0 to 5 stars. This will be displayed on product cards and details pages.</p>
              </div>
            </div>

            <div className="border-t pt-4 mt-4">
              <h3 className="text-lg font-semibold mb-4">Shipping Configuration</h3>
              <div className="space-y-2">
                <Label htmlFor="weight_kg">Product Weight (kg) *</Label>
                <Input
                  id="weight_kg"
                  name="weight_kg"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.weight_kg}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  required
                />
                <p className="text-xs text-gray-500">
                  Weight in kilograms. This is used to calculate shipping costs based on weight and customer location.
                </p>
              </div>
            </div>

            <div className="border-t pt-4 mt-4">
              <h3 className="text-lg font-semibold mb-4">Additional Information</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="warranty_info">Warranty Information</Label>
                  <Input
                    id="warranty_info"
                    name="warranty_info"
                    value={formData.warranty_info}
                    onChange={handleInputChange}
                    placeholder="e.g., 2 years manufacturer warranty"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shipping_info">Shipping Information</Label>
                  <Input
                    id="shipping_info"
                    name="shipping_info"
                    value={formData.shipping_info}
                    onChange={handleInputChange}
                    placeholder="e.g., Free shipping on orders over ₹10,000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="return_policy">Return Policy</Label>
                  <Input
                    id="return_policy"
                    name="return_policy"
                    value={formData.return_policy}
                    onChange={handleInputChange}
                    placeholder="e.g., 30-day return policy"
                  />
                </div>
              </div>
            </div>

            <div className="border-t pt-4 mt-4">
              <h3 className="text-lg font-semibold mb-4">Key Features</h3>
              <div className="space-y-2">
                <Label htmlFor="key_features">Features (one per line)</Label>
                <Textarea
                  id="key_features"
                  name="key_features"
                  value={formData.key_features}
                  onChange={handleInputChange}
                  rows={6}
                  placeholder="High-performance electric motor&#10;Adjustable suction pressure&#10;Large capacity collection jar&#10;Easy-to-clean design"
                />
                <p className="text-xs text-gray-500">Enter each feature on a new line</p>
              </div>
            </div>

            <div className="border-t pt-4 mt-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Technical Specifications</h3>
                <Button type="button" variant="outline" size="sm" onClick={handleAddSpecification}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Field
                </Button>
              </div>

              <div className="space-y-4">
                {formData.specifications.length === 0 && (
                  <p className="text-sm text-center text-gray-500 py-4 border border-dashed rounded bg-gray-50">
                    No specifications added. Click "Add Field" to add technical details.
                  </p>
                )}

                {formData.specifications.map((spec, index) => (
                  <div key={index} className="flex gap-4 items-start">
                    <div className="flex-1 space-y-1">
                      <Label htmlFor={`spec-key-${index}`} className="text-xs text-gray-500">
                        Field Name
                      </Label>
                      <Input
                        id={`spec-key-${index}`}
                        value={spec.key}
                        onChange={(e) => handleSpecificationChange(index, 'key', e.target.value)}
                        placeholder="e.g. Dimensions"
                      />
                    </div>
                    <div className="flex-1 space-y-1">
                      <Label htmlFor={`spec-val-${index}`} className="text-xs text-gray-500">
                        Value
                      </Label>
                      <Input
                        id={`spec-val-${index}`}
                        value={spec.value}
                        onChange={(e) => handleSpecificationChange(index, 'value', e.target.value)}
                        placeholder="e.g. 50x50 cm"
                      />
                    </div>
                    <div className="pt-6">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleRemoveSpecification(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t mt-6">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="btn-primary">
                {selectedProduct ? 'Update Product' : 'Create Product'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "<strong>{selectedProduct?.name}</strong>" from your inventory.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete Product
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ProductList;
