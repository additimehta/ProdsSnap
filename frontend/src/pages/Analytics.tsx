
import { useState } from 'react';
import PageLayout from '@/components/PageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ChartContainer, ChartTooltip } from '@/components/ui/chart';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, LineChart, ResponsiveContainer, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { TrendingUp, TrendingDown, Gauge } from 'lucide-react';
import { mockProducts } from '@/data/mockData';

// Sample price history data per product
const mockPriceHistory = {
  'product-1': [
    { month: 'Jan', currentPrice: 100, suggestedPrice: 120 },
    { month: 'Feb', currentPrice: 100, suggestedPrice: 110 },
    { month: 'Mar', currentPrice: 100, suggestedPrice: 115 },
    { month: 'Apr', currentPrice: 100, suggestedPrice: 130 },
    { month: 'May', currentPrice: 100, suggestedPrice: 125 },
    { month: 'Jun', currentPrice: 100, suggestedPrice: 140 },
  ],
  'product-2': [
    { month: 'Jan', currentPrice: 150, suggestedPrice: 160 },
    { month: 'Feb', currentPrice: 150, suggestedPrice: 170 },
    { month: 'Mar', currentPrice: 150, suggestedPrice: 165 },
    { month: 'Apr', currentPrice: 150, suggestedPrice: 180 },
    { month: 'May', currentPrice: 150, suggestedPrice: 175 },
    { month: 'Jun', currentPrice: 150, suggestedPrice: 190 },
  ],
};

// Chart configuration for colors and labels
const chartConfig = {
  currentPrice: {
    label: "Current Price",
    color: "#8884d8"
  },
  suggestedPrice: {
    label: "Suggested Price",
    color: "#82ca9d"
  }
};

const Analytics = () => {
  const [selectedProduct, setSelectedProduct] = useState(mockProducts[0]?.id || '');
  const productData = mockPriceHistory[selectedProduct] || mockPriceHistory['product-1'];
  const selectedProductDetails = mockProducts.find(p => p.id === selectedProduct);

  const getOptimalPriceRange = () => {
    const prices = productData.map(d => d.suggestedPrice);
    return `$${Math.min(...prices)} - $${Math.max(...prices)}`;
  };

  const getPriceTrend = () => {
    const latest = productData[productData.length - 1].suggestedPrice;
    const current = productData[productData.length - 1].currentPrice;
    return ((latest - current) / current * 100).toFixed(1);
  };

  return (
    <PageLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold">Price Analytics</h1>
          <p className="text-muted-foreground">AI-powered price optimization suggestions for your products</p>
        </div>

        <div className="w-full max-w-xs">
          <Select value={selectedProduct} onValueChange={setSelectedProduct}>
            <SelectTrigger>
              <SelectValue placeholder="Select a product" />
            </SelectTrigger>
            <SelectContent>
              {mockProducts.map((product) => (
                <SelectItem key={product.id} value={product.id}>
                  {product.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedProductDetails && (
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="trends">Price Trends</TabsTrigger>
              <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            </TabsList>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Optimal Price Range</CardTitle>
                  <Gauge className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{getOptimalPriceRange()}</div>
                  <p className="text-xs text-muted-foreground">Based on market analysis</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Price Trend</CardTitle>
                  <TrendingUp className="h-4 w-4 text-emerald-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+{getPriceTrend()}%</div>
                  <p className="text-xs text-muted-foreground">Increase recommended</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Market Position</CardTitle>
                  <TrendingDown className="h-4 w-4 text-rose-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Below Market</div>
                  <p className="text-xs text-muted-foreground">Current pricing strategy</p>
                </CardContent>
              </Card>
            </div>

            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Price Analysis Over Time</CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="h-[300px]">
                  <ChartContainer config={chartConfig}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={productData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Line 
                          type="monotone" 
                          dataKey="currentPrice" 
                          stroke="#8884d8" 
                          name="Current Price"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="suggestedPrice" 
                          stroke="#82ca9d" 
                          name="Suggested Price"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </Tabs>
        )}

        {!selectedProductDetails && (
          <div className="text-center py-12 text-muted-foreground">
            Please select a product to view its analytics
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default Analytics;
