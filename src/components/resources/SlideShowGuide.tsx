
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";

interface Slide {
  title: string;
  description: string;
  imageSrc: string;
  alt: string;
}

interface SlideShowGuideProps {
  title: string;
  description: string;
  slides: Slide[];
}

const SlideShowGuide: React.FC<SlideShowGuideProps> = ({
  title,
  description,
  slides
}) => {
  return (
    <Card className="border border-border shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl">{title}</CardTitle>
        <p className="text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent>
        <div className="relative px-12">
          <Carousel className="w-full">
            <CarouselContent>
              {slides.map((slide, index) => (
                <CarouselItem key={index}>
                  <div className="p-1">
                    <div className="flex flex-col space-y-4">
                      <h3 className="font-medium text-lg text-center">{slide.title}</h3>
                      <div className="border border-border rounded-md overflow-hidden">
                        <img 
                          src={slide.imageSrc} 
                          alt={slide.alt} 
                          className="w-full h-auto aspect-video object-cover" 
                        />
                      </div>
                      <p className="text-muted-foreground text-center">{slide.description}</p>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-0" />
            <CarouselNext className="right-0" />
          </Carousel>
        </div>
        <div className="text-center mt-4 text-muted-foreground">
          <p>Slide {1} of {slides.length}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SlideShowGuide;
