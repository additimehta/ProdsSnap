
import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { 
  ArrowLeft, 
  CalendarDays, 
  Edit, 
  Plus,
  Tag,
  Clock,
  User,
  ChevronRight,
  GitBranch,
  MoreVertical,
  RotateCcw,
  History
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import PageLayout from '@/components/PageLayout';
import { mockProducts } from '@/data/mockData';
import { toast } from 'sonner';
import { Product, ProductVersion } from '@/types';

const ProductDetail = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'details' | 'versions'>('details');
  const [newImage, setNewImage] = useState<File | null>(null);


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
        console.error('Error fetching product:', err);
        navigate('/products'); // fallback if product not found
      });
  }, [productId, navigate]);


  if (loading) {
    return (
      <PageLayout>
        <div className="flex flex-col items-center justify-center h-[80vh]">
          <h2 className="text-2xl font-bold">Loading product...</h2>
        </div>
      </PageLayout>
    );
  }


  if (!product) {
    return (
      <PageLayout>
        <div className="flex flex-col items-center justify-center h-[80vh]">
          <h2 className="text-2xl font-bold">Product not found</h2>
          <p className="text-muted-foreground mt-2">The product you're looking for doesn't exist.</p>
          <Button variant="outline" className="mt-4" asChild>
            <Link to="/products">Back to Products</Link>
          </Button>
        </div>
      </PageLayout>
    );
  }

  const sortedVersions = [...product.versions].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const handleNewVersion = () => {
    toast.info("Feature coming soon", {
      description: "This functionality will be implemented in the next update."
    });
  };

  const handleRevertVersion = async (version: ProductVersion) => {
    if (!product) return;
  
    try {
      const res = await fetch(`http://localhost:8080/products/${product.id}/revert`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          versionId: version.id
        })
      });
  
      if (!res.ok) throw new Error('Failed to revert product');
  
      toast.success(`Reverted to version ${version.versionNumber}`);
      navigate(`/products/${product.id}`);
      window.location.reload();
    } catch (err) {
      console.error('Failed to revert:', err);
      toast.error('Failed to revert product');
    }
  };
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
  
    const formData = new FormData();
    formData.append('name', product.name);
    formData.append('description', product.description);
    formData.append('price', product.price.toString());
    if (newImage) {
      formData.append('image', newImage);
    }
  
    try {
      const res = await fetch(`http://localhost:8080/products/${product.id}/edit`, {
        method: 'PUT',
        body: formData,
      });
  
      if (!res.ok) throw new Error('Failed to update product');
  
      const updatedProduct = await res.json(); // <- get fresh product if your backend returns it!
  
      toast.success('Product updated successfully!');
      navigate(`/products/${product.id}`);
      window.location.reload(); 
      
    } catch (err) {
      console.error('Update failed:', err);
      toast.error('Failed to update product');
    }
  };

  

  const handleDelete = () => {
    if (!product) return;
  
    if (!window.confirm(`Are you sure you want to delete ${product.name}? This cannot be undone.`)) {
      return;
    }
  
    fetch(`http://localhost:8080/products/${product.id}`, {
      method: 'DELETE',
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to delete product');
        toast.success('Product deleted successfully');
        navigate('/products');
      })
      .catch(err => {
        console.error('Failed to delete:', err);
        toast.error('Failed to delete product', {
          description: 'Please try again later.',
        });
      });
  };
  

  return (
    <PageLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Button variant="ghost" size="sm" asChild className="p-0">
            <Link to="/products">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Products
            </Link>
          </Button>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground font-medium truncate">{product.name}</span>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between gap-4 items-start">
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <div className="flex flex-wrap gap-2 items-center mt-1">
              <Badge className="bg-primary">{sortedVersions[0].versionNumber}</Badge>
              <span className="text-sm text-muted-foreground">
                <CalendarDays className="inline h-3.5 w-3.5 mr-1" />
                Created on {format(new Date(product.createdAt), 'MMMM d, yyyy')}
              </span>
              <span className="text-sm text-muted-foreground">
                <Tag className="inline h-3.5 w-3.5 mr-1" />
                ${product.price.toFixed(2)}
              </span>
            </div>
          </div>
          
          <div className="flex gap-2 w-full md:w-auto">
            <Button variant="outline" className="flex-1 md:flex-none" onClick={handleNewVersion}>
              <Plus className="h-4 w-4 mr-2" />
              New Version
            </Button>
            <Button variant="outline" className="flex-1 md:flex-none" asChild>
              <Link to={`/products/${product.id}/edit`}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Product
              </Link>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem>Duplicate</DropdownMenuItem>
                <DropdownMenuItem>Archive</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="flex gap-4 border-b">
          <Button 
            variant="ghost" 
            className={`rounded-none border-b-2 ${activeTab === 'details' ? 'border-primary' : 'border-transparent'}`}
            onClick={() => setActiveTab('details')}
          >
            Details
          </Button>
          <Button 
            variant="ghost" 
            className={`rounded-none border-b-2 ${activeTab === 'versions' ? 'border-primary' : 'border-transparent'}`}
            onClick={() => setActiveTab('versions')}
          >
            Version History
          </Button>
        </div>
        
        {activeTab === 'details' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="col-span-1 md:col-span-2">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Product Description</h3>
                <p className="text-muted-foreground">{product.description}</p>
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Current Version Details</h4>
                  <div className="bg-secondary/30 p-4 rounded-md">
                    <div className="flex items-center justify-between">
                      <Badge>{sortedVersions[0].versionNumber}</Badge>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(sortedVersions[0].createdAt), 'MMM d, yyyy')}
                      </span>
                    </div>
                    <p className="mt-2 text-sm">{sortedVersions[0].changes}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Product Information</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm text-muted-foreground">Product ID</h4>
                    <p className="font-mono text-sm">{product.id}</p>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="text-sm text-muted-foreground">Created</h4>
                    <p>{format(new Date(product.createdAt), 'MMM d, yyyy')}</p>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="text-sm text-muted-foreground">Last Updated</h4>
                    <p>{format(new Date(product.updatedAt), 'MMM d, yyyy')}</p>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="text-sm text-muted-foreground">Price</h4>
                    <p>${product.price.toFixed(2)}</p>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="text-sm text-muted-foreground">Version Count</h4>
                    <p>{product.versions.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        
        {activeTab === 'versions' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Version History</h2>
              <Button onClick={handleNewVersion}>
                <Plus className="h-4 w-4 mr-2" />
                New Version
              </Button>
            </div>
            
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Version</TableHead>
                    <TableHead>Changes</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedVersions.map((version, index) => (
                    <TableRow key={version.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Badge className={version.isRevert ? "bg-amber-500" : "bg-primary"}>
                            {version.versionNumber}
                          </Badge>
                          {index === 0 && <Badge variant="outline">Latest</Badge>}
                        </div>
                        {version.isRevert && (
                          <div className="text-xs text-amber-600 flex items-center mt-1">
                            <History className="h-3 w-3 mr-1" />
                            Revert of {version.revertedFromVersion}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <p className="line-clamp-2">{version.changes}</p>
                      </TableCell>
                      <TableCell>{version.createdBy}</TableCell>
                      <TableCell>{format(new Date(version.createdAt), 'MMM d, yyyy')}</TableCell>
                      <TableCell className="text-right">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleRevertVersion(version)}
                              >
                                <RotateCcw className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Revert to this version</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>

            <div className="space-y-4 mt-6">
              <h3 className="text-lg font-medium">Timeline View</h3>
              {sortedVersions.map((version, index) => (
                <div 
                  key={version.id} 
                  className="flex relative border-l-2 border-primary pl-6 pb-6"
                >
                  <div className="absolute -left-[7px] top-0 h-3.5 w-3.5 rounded-full bg-primary" />
                  
                  <div className="flex-1 bg-card shadow-sm rounded-lg p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                      <div className="flex gap-2 items-center">
                        <GitBranch className="h-4 w-4 text-primary" />
                        <h3 className="font-medium">Version {version.versionNumber}</h3>
                        {index === 0 && <Badge>Latest</Badge>}
                        {version.isRevert && <Badge variant="outline" className="bg-amber-500/20 text-amber-700">Revert</Badge>}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <User className="h-3.5 w-3.5" />
                          <span>{version.createdBy}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          <span>{format(new Date(version.createdAt), 'MMM d, yyyy')}</span>
                        </div>
                      </div>
                    </div>
                    <p>{version.changes}</p>
                    
                    <div className="flex justify-end mt-4">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleRevertVersion(version)}
                        className="gap-2"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                        Revert to this version
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default ProductDetail;
