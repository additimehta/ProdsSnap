
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PackageX } from "lucide-react";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="text-center max-w-md">
        <PackageX className="h-24 w-24 mx-auto text-muted-foreground opacity-30 mb-6" />
        <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
        <p className="text-xl text-muted-foreground mb-6">
          Sorry, we couldn't find the page you're looking for.
        </p>
        <Button size="lg" asChild>
          <Link to="/">Back to Dashboard</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
