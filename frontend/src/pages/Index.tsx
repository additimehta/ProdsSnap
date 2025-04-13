
import PageLayout from '@/components/PageLayout';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { mockProducts } from '@/data/mockData';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Plus, Search } from 'lucide-react';

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const recentProducts = mockProducts.slice(0, 4); 
  
  return (
    <PageLayout>
      <div className="space-y-8 animate-fade-in">
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Welcome to ProdSnap</h1>
              <p className="text-muted-foreground">Track and manage your product versions with ease</p>
            </div>
            <Button asChild className="w-full sm:w-auto">
              <Link to="/products/new" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                <span>Add New Product</span>
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="col-span-1 md:col-span-1 p-6 bg-secondary/50 rounded-lg">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Products</h3>
                <div className="text-3xl font-bold">{mockProducts.length}</div>
              </div>
            </div>
            <div className="col-span-1 md:col-span-1 p-6 bg-secondary/50 rounded-lg">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Versions</h3>
                <div className="text-3xl font-bold">
                  {mockProducts.reduce((acc, product) => acc + product.versions.length, 0)}
                </div>
              </div>
            </div>
            <div className="col-span-1 md:col-span-1 p-6 bg-secondary/50 rounded-lg">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Latest Update</h3>
                <div className="text-xl font-medium">
                  {new Date(Math.max(...mockProducts.map(p => new Date(p.updatedAt).getTime()))).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Recent Products</h2>
            <Link to="/products" className="text-primary hover:underline text-sm">
              View all products
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          {recentProducts.length === 0 && (
            <div className="text-center py-12 border border-dashed rounded-lg">
              <Package className="h-12 w-12 mx-auto text-muted-foreground opacity-30" />
              <h3 className="mt-4 text-lg font-medium">No products found</h3>
              <p className="text-muted-foreground mt-1">Get started by creating a new product.</p>
              <Button variant="outline" asChild className="mt-4">
                <Link to="/products/new" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  <span>Add Product</span>
                </Link>
              </Button>
            </div>
          )}
        </section>
      </div>
    </PageLayout>
  );
};

export default Index;
