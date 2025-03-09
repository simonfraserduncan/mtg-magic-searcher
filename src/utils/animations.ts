
import { useEffect, useState } from 'react';

// Intersection Observer hook for scroll animations
export function useInView(options = {}) {
  const [ref, setRef] = useState<HTMLElement | null>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (!ref) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsInView(entry.isIntersecting);
    }, options);

    observer.observe(ref);

    return () => {
      observer.disconnect();
    };
  }, [ref, options]);

  return { ref: setRef, isInView };
}

// Staggered animation for lists of items
export function useStaggeredAnimation(items: any[], delay = 50) {
  const [animatedItems, setAnimatedItems] = useState<any[]>([]);

  useEffect(() => {
    const timeouts: NodeJS.Timeout[] = [];
    
    items.forEach((item, i) => {
      const timeout = setTimeout(() => {
        setAnimatedItems(prev => [...prev, item]);
      }, i * delay);
      
      timeouts.push(timeout);
    });
    
    return () => {
      timeouts.forEach(timeout => clearTimeout(timeout));
    };
  }, [items, delay]);
  
  return animatedItems;
}

// Page transition animation
export function usePageTransition() {
  const [isAnimating, setIsAnimating] = useState(false);
  const [content, setContent] = useState<React.ReactNode>(null);
  
  const startTransition = (newContent: React.ReactNode) => {
    setIsAnimating(true);
    
    setTimeout(() => {
      setContent(newContent);
      setIsAnimating(false);
    }, 300);
  };
  
  return {
    isAnimating,
    content,
    startTransition
  };
}

// Hover effect for cards
export function useHoverEffect() {
  const [isHovered, setIsHovered] = useState(false);
  
  const hoverProps = {
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false),
    style: {
      transform: isHovered ? 'translateY(-5px)' : 'translateY(0)',
      transition: 'transform 0.3s ease-out'
    }
  };
  
  return {
    isHovered,
    hoverProps
  };
}

// Lazy image loading with blur effect
export function useLazyImage(src: string, placeholderSrc: string = '/placeholder.svg') {
  const [imageSrc, setImageSrc] = useState(placeholderSrc);
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    setIsLoaded(false);
    
    const img = new Image();
    img.src = src;
    
    img.onload = () => {
      setImageSrc(src);
      setIsLoaded(true);
    };
    
    return () => {
      img.onload = null;
    };
  }, [src]);
  
  return {
    src: imageSrc,
    isLoaded,
    blurClass: isLoaded ? '' : 'blur-sm'
  };
}
