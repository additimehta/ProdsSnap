
import { useState, ChangeEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { ArrowLeft, CalendarDays, Image, Info, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import PageLayout from '@/components/PageLayout';

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB max

// Use zod, but we'll validate image separately (since react-hook-form doesn't manage File objects well)
const formSchema = z.object({
  name: z.string().min(3, {
    message: 'Product name must be at least 3 characters.',
  }),
  description: z.string().min(10, {
    message: 'Description must be at least 10 characters.',
  }),
  price: z.coerce.number().min(0.01, {
    message: 'Price must be at least 0.01',
  }),
  versionNotes: z.string().min(5, {
    message: 'Version notes must be at least 5 characters.',
  }),
  // No image in schema - handle via local state + manual validation
});

const NewProduct = () => {
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      versionNotes: 'Initial product launch',
    },
  });

  // Local state for image file & preview
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);

  // Handle file picker
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setImageError('Please select an image file (jpeg/png/webp).');
      setImageFile(null);
      setImagePreview(null);
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      setImageError('Image size must be less than 5MB.');
      setImageFile(null);
      setImagePreview(null);
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setImageError(null);
  };


  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!imageFile) {
      toast.error("Please upload an image.");
      return;
    }
  
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("description", values.description);
    formData.append("price", values.price.toString());
    formData.append("versionNotes", values.versionNotes || "Initial version");
    formData.append("createdBy", "your-user-id"); 
    formData.append("image", imageFile); 
  
    try {
      const resp = await fetch('http://localhost:8080/products', {
        method: 'POST',
        body: formData, 
      });
  
      if (!resp.ok) {
        const errText = await resp.text();
        throw new Error(errText || 'Failed to create product');
      }
  
      toast.success('Product created successfully!');
      navigate('/products');
    } catch (err: any) {
      toast.error('Failed to create product', {
        description: err?.message || 'An error occurred. Please try again.',
      });
    }
  };
  

  
  return (
    <PageLayout>
      <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Button variant="ghost" size="sm" asChild className="p-0">
            <Link to="/products">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Products
            </Link>
          </Button>
        </div>

        <div>
          <h1 className="text-3xl font-bold">Add New Product</h1>
          <p className="text-muted-foreground">Create a new product and track its versions</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="flex items-center gap-2">
                    <Info className="h-5 w-5 text-primary" />
                    <h2 className="text-xl font-semibold">Product Information</h2>
                  </div>
                  <Separator />

                  {/* Product Name */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter product name" {...field} />
                        </FormControl>
                        <FormDescription>
                          This is the name that will be displayed to customers.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Product Description */}
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter product description" 
                            className="min-h-[100px]" 
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Provide a detailed description of your product.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Product Price */}
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price ($)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" placeholder="0.00" {...field} />
                        </FormControl>
                        <FormDescription>
                          Set the price for your product.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Product Image Upload */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Image className="h-5 w-5 text-primary" />
                      <FormLabel>Product Image</FormLabel>
                    </div>
                    <div className="flex gap-4 items-center">
                      <label htmlFor="product-image-upload">
                        <input
                          id="product-image-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageChange}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          asChild={false}
                          onClick={() =>
                            document.getElementById('product-image-upload')?.click()
                          }
                        >
                          Select Image
                        </Button>
                      </label>
                      {imagePreview && (
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="h-20 w-20 rounded-lg object-cover border"
                        />
                      )}
                    </div>
                    <FormDescription>
                      Upload an image representing your product. (JPG, PNG, WebP, max 5MB)
                    </FormDescription>
                    {/* Show error if invalid */}
                    {imageError && (
                      <span className="text-destructive text-sm font-medium">{imageError}</span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-5 w-5 text-primary" />
                    <h2 className="text-xl font-semibold">Initial Version</h2>
                  </div>
                  <Separator />

                  <div className="px-1">
                    <p className="text-sm text-muted-foreground mb-4">
                      Your product will start at version <span className="font-medium text-foreground">1.0.0</span>. 
                      Future versions will be automatically incremented.
                    </p>
                  </div>

                  {/* Version Notes */}
                  <FormField
                    control={form.control}
                    name="versionNotes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Version Notes</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe this version" 
                            className="min-h-[100px]" 
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Document what's included in this initial version.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-2">
              <Button variant="outline" type="button" onClick={() => navigate('/products')}>
                Cancel
              </Button>
              <Button type="submit">
                <Save className="h-4 w-4 mr-2" />
                Create Product
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </PageLayout>
  );
};

export default NewProduct;

