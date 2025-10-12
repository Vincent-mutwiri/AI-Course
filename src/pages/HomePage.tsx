import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
        Welcome to the Future of Learning
      </h1>
      <p className="mt-4 text-lg text-muted-foreground">
        An interactive, fun, and comprehensive platform designed for you.
      </p>
      <div className="mt-8">
        <Button asChild size="lg">
          <Link to="/courses">Explore Courses</Link>
        </Button>
      </div>
    </div>
  );
}