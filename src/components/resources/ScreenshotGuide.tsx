
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

interface Screenshot {
  title: string;
  description: string;
  imageSrc: string;
  alt: string;
}

interface ScreenshotGuideProps {
  title: string;
  description: string;
  screenshots: Screenshot[];
  category?: string;
}

const ScreenshotGuide: React.FC<ScreenshotGuideProps> = ({
  title,
  description,
  screenshots,
  category
}) => {
  return (
    <Card className="border border-border shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl">{title}</CardTitle>
        <p className="text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {screenshots.map((screenshot, index) => (
            <div key={index} className="space-y-2">
              <h3 className="font-medium text-lg">{screenshot.title}</h3>
              <p className="text-muted-foreground mb-2">{screenshot.description}</p>
              <div className="border border-border rounded-md overflow-hidden">
                <img 
                  src={screenshot.imageSrc} 
                  alt={screenshot.alt}
                  className="w-full h-auto" 
                />
              </div>
            </div>
          ))}
        </div>
        
        {category && (
          <div className="mt-6">
            <Link 
              to={`/knowledge-base?category=${category}`}
              className="flex items-center text-brand-500 hover:underline mt-4"
            >
              View more guides in this category <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ScreenshotGuide;
