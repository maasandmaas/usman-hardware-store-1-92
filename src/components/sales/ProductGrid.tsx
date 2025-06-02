
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Grid, List, Package } from "lucide-react";
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  products: any[];
  searchTerm: string;
  selectedCategory: string | null;
  categories: string[];
  pinnedProducts: number[];
  quantityInputs: {[key: number]: string};
  loading: boolean;
  onSearchChange: (term: string) => void;
  onCategoryChange: (category: string | null) => void;
  onTogglePin: (productId: number) => void;
  onQuantityChange: (productId: number, value: string) => void;
  onAddToCart: (product: any, quantity?: number) => void;
  onAddCustomQuantity: (product: any) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  searchTerm,
  selectedCategory,
  categories,
  pinnedProducts,
  quantityInputs,
  loading,
  onSearchChange,
  onCategoryChange,
  onTogglePin,
  onQuantityChange,
  onAddToCart,
  onAddCustomQuantity
}) => {
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');

  // Filter and sort products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product?.sku?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === null || product?.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const aIsPinned = pinnedProducts.includes(a.id);
    const bIsPinned = pinnedProducts.includes(b.id);
    
    if (aIsPinned && !bIsPinned) return -1;
    if (!aIsPinned && bIsPinned) return 1;
    return (a.name || '').localeCompare(b.name || '');
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-muted-foreground">Loading products...</div>
      </div>
    );
  }

  return (
    <Card className="flex-1">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-blue-600" />
            Products ({sortedProducts.length})
            <Badge variant="outline" className="ml-2">{pinnedProducts.length} pinned</Badge>
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="h-8 w-8 p-0"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="h-8 w-8 p-0"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search products by name or SKU..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 h-10 bg-background border-input"
          />
        </div>

        {/* Category Filter */}
        <Card className="bg-muted/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Filter by Category:</span>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                size="sm"
                onClick={() => onCategoryChange(null)}
                className="h-8"
              >
                All ({products.length})
              </Button>
              {categories.map((category) => {
                const categoryCount = products.filter(p => p.category === category).length;
                return (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => onCategoryChange(category)}
                    className="h-8"
                  >
                    {category} ({categoryCount})
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Products Grid */}
        <div className={`grid gap-4 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4' 
            : 'grid-cols-1'
        }`}>
          {sortedProducts.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <p className="text-muted-foreground">No products found</p>
            </div>
          ) : (
            sortedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isPinned={pinnedProducts.includes(product.id)}
                quantityInput={quantityInputs[product.id] || ""}
                onTogglePin={onTogglePin}
                onQuantityChange={onQuantityChange}
                onAddToCart={onAddToCart}
                onAddCustomQuantity={onAddCustomQuantity}
              />
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
