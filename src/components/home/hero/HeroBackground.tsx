
import React, { useEffect, useRef, useCallback } from 'react';
import { throttle } from '@/utils/performance';

interface Point {
  x: number;
  y: number;
  vx: number;
  vy: number;
  connections: number[];
}

const HeroBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const pointsRef = useRef<Point[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createPoints = () => {
      const points: Point[] = [];
      const numPoints = Math.min(40, Math.floor((canvas.width * canvas.height) / 25000)); // Reduced points
      
      for (let i = 0; i < numPoints; i++) {
        points.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.3, // Slower movement
          vy: (Math.random() - 0.5) * 0.3,
          connections: []
        });
      }
      return points;
    };

    const updatePoints = () => {
      pointsRef.current.forEach(point => {
        point.x += point.vx;
        point.y += point.vy;

        if (point.x < 0 || point.x > canvas.width) point.vx *= -1;
        if (point.y < 0 || point.y > canvas.height) point.vy *= -1;

        point.x = Math.max(0, Math.min(canvas.width, point.x));
        point.y = Math.max(0, Math.min(canvas.height, point.y));
      });
    };

    const drawConnections = () => {
      const maxDistance = 120; // Reduced connection distance
      ctx.strokeStyle = 'rgba(0, 123, 255, 0.1)';
      ctx.lineWidth = 0.6;

      // Skip frames for better performance
      const skipConnections = Math.floor(pointsRef.current.length / 15);
      
      for (let i = 0; i < pointsRef.current.length; i += skipConnections) {
        for (let j = i + skipConnections; j < pointsRef.current.length; j += skipConnections) {
          const point1 = pointsRef.current[i];
          const point2 = pointsRef.current[j];
          const dx = point2.x - point1.x;
          const dy = point2.y - point1.y;
          const distance = Math.sqrt(dx * dx + dy * dy); // Optimized distance calc

          if (distance < maxDistance) {
            const opacity = (1 - distance / maxDistance) * 0.15;
            ctx.strokeStyle = `rgba(0, 123, 255, ${opacity})`;
            ctx.beginPath();
            ctx.moveTo(point1.x, point1.y);
            ctx.lineTo(point2.x, point2.y);
            ctx.stroke();
          }
        }
      }
    };

    const drawPoints = () => {
      pointsRef.current.forEach(point => {
        const mouseDistance = Math.sqrt(
          Math.pow(mouseRef.current.x - point.x, 2) + Math.pow(mouseRef.current.y - point.y, 2)
        );
        const maxMouseDistance = 100;
        const proximity = Math.max(0, 1 - mouseDistance / maxMouseDistance);
        const size = 1.5 + proximity * 2.5;
        const opacity = 0.4 + proximity * 0.6;

        ctx.fillStyle = `rgba(0, 123, 255, ${opacity})`;
        ctx.beginPath();
        ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      updatePoints();
      drawConnections();
      drawPoints();
      animationRef.current = requestAnimationFrame(animate);
    };

    const handleMouseMove = useCallback(throttle((e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
    }, 16), []); // Throttle to ~60fps

    const handleResize = () => {
      resizeCanvas();
      pointsRef.current = createPoints();
    };

    resizeCanvas();
    pointsRef.current = createPoints();
    canvas.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);
    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      canvas.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ background: 'radial-gradient(ellipse at center, rgba(0, 123, 255, 0.03) 0%, transparent 50%)' }}
    />
  );
};

export default HeroBackground;
