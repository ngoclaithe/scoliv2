import React, { useState, useEffect } from 'react';
import { getFullLogoUrl } from '../../utils/logoUtils';

const DisplayLogo = ({ 
    logos = [], 
    alt = "Logo", 
    className = "", 
    type_play = "round", // "round", "square", "hexagon"
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
                    containerClass: "relative",
                    imageClass: baseClasses,
                    maskClass: "absolute inset-0 rounded-full border-4 border-white/20 pointer-events-none z-10"
                };
            case "square":
                return {
                    containerClass: "relative",
                    imageClass: baseClasses,
                    maskClass: "absolute inset-0 border-2 border-white/20 pointer-events-none z-10"
                };
            case "hexagon":
                return {
                    containerClass: "relative",
                    imageClass: baseClasses,
                    maskClass: "absolute inset-0 pointer-events-none z-10",
                    hexMask: true
                };
            default:
                return {
                    containerClass: "relative",
                    imageClass: baseClasses,
                    maskClass: "absolute inset-0 rounded-full border-4 border-white/20 pointer-events-none z-10"
                };
        }
    };

    const shapeStyles = getShapeStyles(type_play);

    // Component để tạo hexagon mask
    const HexagonMask = () => (
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 100 100">
            <defs>
                <mask id="hexagon-mask">
                    <rect width="100" height="100" fill="black"/>
                    <polygon 
                        points="50,5 90,25 90,75 50,95 10,75 10,25" 
                        fill="white"
                    />
                </mask>
            </defs>
            <polygon 
                points="50,5 90,25 90,75 50,95 10,75 10,25" 
                fill="none" 
                stroke="rgba(255,255,255,0.3)" 
                strokeWidth="2"
            />
        </svg>
    );

    // Render mask overlay
    const renderMask = () => {
        if (shapeStyles.hexMask) {
            return <HexagonMask />;
        }
        return <div className={shapeStyles.maskClass}></div>;
    };

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
                            backgroundColor: 'transparent'
                        }}
                    />
                    {renderMask()}
                </div>
            </div>
        );
    }

    if (logos.length === 1 || typeof logos === 'string') {
        const logoSrc = typeof logos === 'string' ? logos : logos[0];
        const fullLogoUrl = getFullLogoUrl(logoSrc);

        return (
            <div className={`relative ${className}`}>
                <div
                    className={`${shapeStyles.containerClass} p-1 ${logoSize}`}
                    style={{ backgroundColor: 'rgba(255,255,255,0.9)' }}
                >
                    <img
                        src={fullLogoUrl || createFallbackSVG(alt)}
                        alt={alt}
                        className={shapeStyles.imageClass}
                        style={{
                            filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))',
                            backgroundColor: 'transparent'
                        }}
                        onError={(e) => {
                            e.target.src = createFallbackSVG(alt);
                        }}
                    />
                    {renderMask()}
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
                            className={`relative ${logoSize}`}
                        >
                            <div
                                className={`${shapeStyles.containerClass} p-1 w-full h-full`}
                                style={{ backgroundColor: 'rgba(255,255,255,0.9)' }}
                            >
                                <img
                                    src={fullLogoUrl || createFallbackSVG(alt)}
                                    alt={`${alt} ${index + 1}`}
                                    className={shapeStyles.imageClass}
                                    style={{
                                        filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))',
                                        backgroundColor: 'transparent'
                                    }}
                                    onError={(e) => {
                                        e.target.src = createFallbackSVG(alt);
                                    }}
                                />
                                {renderMask()}
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
                            className={`relative animate-slide-up ${logoSize}`} // Sử dụng kích thước cố định
                        >
                            <div
                                className={`${shapeStyles.containerClass} w-full h-full`}
                                style={{ backgroundColor: 'rgba(255,255,255,0.9)' }}
                            >
                                <div className={`${shapeStyles.imagePadding} w-full h-full flex items-center justify-center`}>
                                    <img
                                        src={fullLogoUrl || createFallbackSVG(alt)}
                                        alt={`${alt} ${startIndex + index + 1}`}
                                        className={shapeStyles.imageClass}
                                        style={{
                                            filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))',
                                            backgroundColor: 'transparent',
                                            maxWidth: '100%',
                                            maxHeight: '100%',
                                            ...(shapeStyles.clipPath && { clipPath: shapeStyles.clipPath })
                                        }}
                                        onError={(e) => {
                                            e.target.src = createFallbackSVG(alt);
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default DisplayLogo;