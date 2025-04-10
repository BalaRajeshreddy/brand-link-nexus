
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-primary">404</h1>
        <p className="text-xl text-muted-foreground mt-2 mb-6">Oops! Page not found</p>
        <Button asChild>
          <Link to="/">Go back home</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
