
import PageLayout from '@/components/PageLayout';
import { Button } from '@/components/ui/button';
import { ClipboardList, ShoppingCart } from 'lucide-react';

const Orders = () => {
  return (
    <PageLayout>
      <div className="flex flex-col items-center justify-center h-[80vh]">
        <ShoppingCart className="h-16 w-16 text-primary opacity-50 mb-4" />
        <h1 className="text-3xl font-bold mb-2">Orders</h1>
        <p className="text-muted-foreground mb-6 text-center max-w-md">
          This feature will be implemented in a future update. Track and manage your customer orders here.
        </p>
        <Button variant="outline" className="gap-2">
          <ClipboardList className="h-4 w-4" />
          Coming Soon
        </Button>
      </div>
    </PageLayout>
  );
};

export default Orders;
