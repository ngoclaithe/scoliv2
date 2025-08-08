import React, { useState, useEffect } from 'react';
import { getFullLogoUrl } from '../../utils/logoUtils';

const DisplayLogo = ({ 
    logos = [], 
    alt = "Logo", 
    className = "", 
    type_play = "round", 
    slideMode = false, 
    maxVisible = 3, 
    slideInterval = 5000,
    logoSize = "w-16 h-16" 
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    
    useEffect(() => {
        if (slideMode && logos.length > maxVisible) {
            const interval = setInterval(() => {
                setCurrentIndex(prev => (prev + 1) % Math.ceil(logos.length / maxVisible));
            }, slideInterval);
            
            return () => clearInterval(interval);
        }
    }, [slideMode, logos.length, maxVisible, slideInterval]);

    const getShapeStyles = (type) => {
        const baseClasses = "w-full h-full object-contain";

        switch (type) {
            case "round":
                return {
                    containerClass: "rounded-full overflow-hidden",
                    imageClass: `${baseClasses} rounded-full`
                };
            case "square":
                return {
                    containerClass: "overflow-hidden",
                    imageClass: baseClasses
                };
            case "hexagon":
                return {
                    containerClass: "", // Không dùng overflow-hidden để không cắt hexagon
                    imageClass: baseClasses,
                    clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)"
                };
            default:
                return {
                    containerClass: "rounded-full overflow-hidden",
                    imageClass: `${baseClasses} rounded-full`
                };
        }
    };

    const shapeStyles = getShapeStyles(type_play);

    // Tạo fallback SVG
    const createFallbackSVG = (altText) => {
        return `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"><circle cx="20" cy="20" r="18" fill="%23ddd" stroke="%23999" stroke-width="2"/><text x="20" y="25" text-anchor="middle" font-size="12" fill="%23666">${altText.charAt(0)}</text></svg>`;
    };

    if (!logos || logos.length === 0) {
        return (
            <div className={`relative ${className}`}>
                <div 
                    className={`${shapeStyles.containerClass} p-1 ${logoSize}`}
                    style={{ backgroundColor: 'rgba(255,255,255,0.9)' }}
                >
                    <img
                        src="/api/placeholder/90/90"
                        alt={alt}
                        className={shapeStyles.imageClass}
                        style={{
                            filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))',
                            backgroundColor: 'transparent',
                            ...(shapeStyles.clipPath && { clipPath: shapeStyles.clipPath })
                        }}
                    />
                </div>
            </div>
        );
    }

    if (logos.length === 1 || typeof logos === 'string') {
        const logoSrc = typeof logos === 'string' ? logos : logos[0];
        const fullLogoUrl = getFullLogoUrl(logoSrc);

        return (
            <div className={`relative ${className} ${type_play === 'hexagon' ? '' : 'overflow-hidden'}`}>
                <div
                    className={`${shapeStyles.containerClass} p-0.5 ${logoSize} flex items-center justify-center`}
                    style={{ backgroundColor: 'rgba(255,255,255,0.9)' }}
                >
                    <img
                        src={fullLogoUrl || createFallbackSVG(alt)}
                        alt={alt}
                        className={`${shapeStyles.imageClass} max-w-full max-h-full object-contain`}
                        style={{
                            filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.2))',
                            backgroundColor: 'transparent',
                            ...(shapeStyles.clipPath && { clipPath: shapeStyles.clipPath })
                        }}
                        onError={(e) => {
                            e.target.src = createFallbackSVG(alt);
                        }}
                    />
                </div>
            </div>
        );
    }

    if (!slideMode || logos.length <= maxVisible) {
        return (
            <div className={`flex gap-2 ${className}`}>
                {logos.slice(0, maxVisible).map((logo, index) => {
                    const fullLogoUrl = getFullLogoUrl(logo);
                    return (
                        <div
                            key={index}
                            className={`relative ${logoSize} overflow-hidden shrink-0`}
                        >
                            <div
                                className={`${shapeStyles.containerClass} p-0.5 w-full h-full flex items-center justify-center`}
                                style={{ backgroundColor: 'rgba(255,255,255,0.9)' }}
                            >
                                <img
                                    src={fullLogoUrl || createFallbackSVG(alt)}
                                    alt={`${alt} ${index + 1}`}
                                    className={`${shapeStyles.imageClass} max-w-full max-h-full object-contain`}
                                    style={{
                                        filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.2))',
                                        backgroundColor: 'transparent',
                                        ...(shapeStyles.clipPath && { clipPath: shapeStyles.clipPath })
                                    }}
                                    onError={(e) => {
                                        e.target.src = createFallbackSVG(alt);
                                    }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    }

    const startIndex = currentIndex * maxVisible;
    const visibleLogos = logos.slice(startIndex, startIndex + maxVisible);

    return (
        <div className={`relative ${className}`}>
            <div className="flex gap-2 transition-all duration-1000 ease-in-out">
                {visibleLogos.map((logo, index) => {
                    const fullLogoUrl = getFullLogoUrl(logo);
                    return (
                        <div
                            key={startIndex + index}
                            className={`relative animate-slide-up ${logoSize} overflow-hidden shrink-0`}
                        >
                            <div
                                className={`${shapeStyles.containerClass} p-0.5 w-full h-full flex items-center justify-center`}
                                style={{ backgroundColor: 'rgba(255,255,255,0.9)' }}
                            >
                                <img
                                    src={fullLogoUrl || createFallbackSVG(alt)}
                                    alt={`${alt} ${startIndex + index + 1}`}
                                    className={`${shapeStyles.imageClass} max-w-full max-h-full object-contain`}
                                    style={{
                                        filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.2))',
                                        backgroundColor: 'transparent',
                                        ...(shapeStyles.clipPath && { clipPath: shapeStyles.clipPath })
                                    }}
                                    onError={(e) => {
                                        e.target.src = createFallbackSVG(alt);
                                    }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default DisplayLogo;
