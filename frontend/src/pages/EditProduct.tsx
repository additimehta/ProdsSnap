import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Product } from '@/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import PageLayout from '@/components/PageLayout';
import { toast } from 'sonner';

const EditProduct = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [newImage, setNewImage] = useState<File | null>(null);
  const [changes, setChanges] = useState(''); // 👈 new state for version change notes

  useEffect(() => {
    if (!productId) return;

    fetch(`http://localhost:8080/products/${productId}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch product');
        return res.json();
      })
      .then(data => {
        setProduct(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load product:', err);
        navigate('/products');
      });
  }, [productId, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    const formData = new FormData();
    formData.append('title', product.name);        // 👈 send title (new name)
    formData.append('description', product.description);
    formData.append('price', product.price.toString());
    formData.append('changes', changes);            // 👈 send changes user wrote
    formData.append('createdBy', 'admin');          // 👈 hardcoded for now; later you can pull from user session

    if (newImage) {
      formData.append('image', newImage);
    }

    try {
      const res = await fetch(`http://localhost:8080/products/${product.id}/edit`, {
        method: 'PUT',
        body: formData,
      });

      if (!res.ok) throw new Error('Failed to update product');

      toast.success('Product updated successfully!');
      navigate(`/products/${product.id}`);
    } catch (err) {
      console.error('Update failed:', err);
      toast.error('Failed to update product');
    }
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center h-[80vh]">Loading...</div>
      </PageLayout>
    );
  }

  if (!product) {
    return (
      <PageLayout>
        <div className="flex flex-col items-center justify-center h-[80vh]">
          <h2 className="text-2xl font-bold">Product not found</h2>
          <Button variant="outline" className="mt-4" asChild>
            <Link to="/products">Back to Products</Link>
          </Button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <h1 className="text-3xl font-bold">Edit Product</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Product Name</label>
            <Input
              value={product.name}
              onChange={(e) => setProduct({ ...product, name: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Description</label>
            <Input
              value={product.description}
              onChange={(e) => setProduct({ ...product, description: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Price</label>
            <Input
              type="number"
              value={product.price}
              onChange={(e) => setProduct({ ...product, price: parseFloat(e.target.value) })}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Upload New Image</label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  setNewImage(e.target.files[0]);
                }
              }}
            />
          </div>

          {/* ✨ New Changes field */}
          <div>
            <label className="text-sm font-medium">Changes (What did you change?)</label>
            <Input
              placeholder="E.g., Updated price and description."
              value={changes}
              onChange={(e) => setChanges(e.target.value)}
            />
          </div>

          <Button type="submit" className="w-full">
            Save Changes
          </Button>
        </form>
      </div>
    </PageLayout>
  );
};

export default EditProduct;
