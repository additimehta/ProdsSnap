
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { 
  Search, 
  Filter, 
  Package, 
  Clock, 
  User,
  ChevronRight,
  History,
  RotateCcw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import PageLayout from '@/components/PageLayout';
import { Product, ProductVersion } from '@/types';
import { toast } from 'sonner';

interface FlattenedVersion {
  id: string;
  productId: string;
  productName: string;
  versionNumber: string;
  changes: string;
  createdAt: string;
  createdBy: string;
  isRevert?: boolean;
  revertedFromVersion?: string;
}

const Versions = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetch('http://localhost:8080/products')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch products');
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          console.error('Expected array but got:', data);
          setProducts([]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Fetch error:', err);
        setProducts([]);
        setLoading(false);
      });
  }, []);

  
  // Flatten product versions into a single array
  const allVersions: FlattenedVersion[] = products.flatMap(product =>
    product.versions.map(version => ({
      ...version,
      productName: product.name
    }))
  );
  
  // Filter versions
  const filteredVersions = allVersions.filter(version => {
    const matchesSearch = 
      version.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      version.changes.toLowerCase().includes(searchQuery.toLowerCase()) ||
      version.versionNumber.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    if (filter === 'major') return matchesSearch && version.versionNumber.startsWith('1.');
    if (filter === 'minor') return matchesSearch && !version.versionNumber.startsWith('1.');
    if (filter === 'reverts') return matchesSearch && version.isRevert;
    
    return matchesSearch;
  });
  
  // Sort versions
  const sortedVersions = [...filteredVersions].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'version-asc':
        return a.versionNumber.localeCompare(b.versionNumber);
      case 'version-desc':
        return b.versionNumber.localeCompare(a.versionNumber);
      default:
        return 0;
    }
  });

  const handleRevertVersion = (version: FlattenedVersion) => {
    // In a real application, this would create a new version with the reverted changes
    toast.success(`Reverted to version ${version.versionNumber}`, {
      description: `Product ${version.productName} has been reverted to version ${version.versionNumber}`,
    });
  };

  return (
    <PageLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
          <div>
            <h1 className="text-3xl font-bold">Version History</h1>
            <p className="text-muted-foreground">All product versions across your catalog</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search versions..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-full sm:w-[140px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Versions</SelectItem>
                <SelectItem value="major">Major Versions</SelectItem>
                <SelectItem value="minor">Minor Versions</SelectItem>
                <SelectItem value="reverts">Reverts</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-[140px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest first</SelectItem>
                <SelectItem value="oldest">Oldest first</SelectItem>
                <SelectItem value="version-asc">Version: Low-High</SelectItem>
                <SelectItem value="version-desc">Version: High-Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          {sortedVersions.map((version) => (
            <div 
              key={version.id} 
              className="block border rounded-lg p-4 hover:shadow-md transition-shadow bg-card"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <Badge className={`w-16 justify-center ${version.isRevert ? "bg-amber-500" : "bg-primary"}`}>
                    {version.versionNumber}
                  </Badge>
                  <div>
                    <div className="font-medium">{version.productName}</div>
                    <div className="text-sm text-muted-foreground flex flex-wrap gap-x-4 gap-y-1 mt-1">
                      <span className="flex items-center">
                        <Clock className="h-3.5 w-3.5 mr-1" />
                        {format(new Date(version.createdAt), 'MMM d, yyyy')}
                      </span>
                      <span className="flex items-center">
                        <User className="h-3.5 w-3.5 mr-1" />
                        {version.createdBy}
                      </span>
                      {version.isRevert && (
                        <span className="flex items-center text-amber-600">
                          <History className="h-3.5 w-3.5 mr-1" />
                          Reverted from {version.revertedFromVersion}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center mt-2 sm:mt-0 gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={(e) => {
                            e.preventDefault();
                            handleRevertVersion(version);
                          }}
                          className="h-8"
                        >
                          <RotateCcw className="h-3.5 w-3.5 mr-1" />
                          Revert
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Revert to this version</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <Link to={`/products/${version.productId}`} className="flex items-center">
                    <span className="text-primary text-sm mr-1">View Details</span>
                    <ChevronRight className="h-4 w-4 text-primary" />
                  </Link>
                </div>
              </div>
              <div className="mt-2">
                <p className="text-sm line-clamp-2">{version.changes}</p>
              </div>
            </div>
          ))}
          
          {sortedVersions.length === 0 && (
            <div className="text-center py-12 border border-dashed rounded-lg">
              <Package className="h-12 w-12 mx-auto text-muted-foreground opacity-30" />
              <h3 className="mt-4 text-lg font-medium">No versions found</h3>
              <p className="text-muted-foreground mt-1">
                {searchQuery ? "Try a different search term" : "Get started by creating products and versions"}
              </p>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default Versions;