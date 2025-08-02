import React, { useState, useEffect } from 'react';
import { getFullLogoUrl } from '../../utils/logoUtils';

const DisplayLogo = ({ 
    logos = [], 
    alt = "Logo", 
    className = "", 
    type_play = "circle", // "circle", "square", "hexagon"
    slideMode = false, // enable slideshow for multiple logos
    maxVisible = 3, // max logos visible at once
    slideInterval = 5000 // 5 seconds
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    
    // Auto-slide effect for multiple logos
    useEffect(() => {
        if (slideMode && logos.length > maxVisible) {
            const interval = setInterval(() => {
                setCurrentIndex(prev => (prev + 1) % Math.ceil(logos.length / maxVisible));
            }, slideInterval);
            
            return () => clearInterval(interval);
        }
    }, [slideMode, logos.length, maxVisible, slideInterval]);

    // Get shape styles based on type_play
    const getShapeStyles = (type) => {
        const baseClasses = "w-full h-full object-contain";
        
        switch (type) {
            case "circle":
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
                    containerClass: "overflow-hidden",
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

    // Handle single logo or no logos
    if (!logos || logos.length === 0) {
        return (
            <div className={`relative ${className}`}>
                <div 
                    className={`${shapeStyles.containerClass} p-1`}
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
            <div className={`relative ${className}`}>
                <div
                    className={`${shapeStyles.containerClass} p-1`}
                    style={{ backgroundColor: 'rgba(255,255,255,0.9)' }}
                >
                    <img
                        src={fullLogoUrl || `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"><circle cx="20" cy="20" r="18" fill="%23ddd" stroke="%23999" stroke-width="2"/><text x="20" y="25" text-anchor="middle" font-size="12" fill="%23666">${alt.charAt(0)}</text></svg>`}
                        alt={alt}
                        className={shapeStyles.imageClass}
                        style={{
                            filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))',
                            backgroundColor: 'transparent',
                            ...(shapeStyles.clipPath && { clipPath: shapeStyles.clipPath })
                        }}
                        onError={(e) => {
                            e.target.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"><circle cx="20" cy="20" r="18" fill="%23ddd" stroke="%23999" stroke-width="2"/><text x="20" y="25" text-anchor="middle" font-size="12" fill="%23666">${alt.charAt(0)}</text></svg>`;
                        }}
                    />
                </div>
            </div>
        );
    }

    // Handle multiple logos
    if (!slideMode || logos.length <= maxVisible) {
        // Show all logos if slideMode is disabled or logos count <= maxVisible
        return (
            <div className={`flex gap-2 ${className}`}>
                {logos.slice(0, maxVisible).map((logo, index) => {
                    const fullLogoUrl = getFullLogoUrl(logo);
                    return (
                        <div
                            key={index}
                            className={`relative flex-1`}
                        >
                            <div
                                className={`${shapeStyles.containerClass} p-1`}
                                style={{ backgroundColor: 'rgba(255,255,255,0.9)' }}
                            >
                                <img
                                    src={fullLogoUrl || `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"><circle cx="20" cy="20" r="18" fill="%23ddd" stroke="%23999" stroke-width="2"/><text x="20" y="25" text-anchor="middle" font-size="12" fill="%23666">${alt.charAt(0)}</text></svg>`}
                                    alt={`${alt} ${index + 1}`}
                                    className={shapeStyles.imageClass}
                                    style={{
                                        filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))',
                                        backgroundColor: 'transparent',
                                        ...(shapeStyles.clipPath && { clipPath: shapeStyles.clipPath })
                                    }}
                                    onError={(e) => {
                                        e.target.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"><circle cx="20" cy="20" r="18" fill="%23ddd" stroke="%23999" stroke-width="2"/><text x="20" y="25" text-anchor="middle" font-size="12" fill="%23666">${alt.charAt(0)}</text></svg>`;
                                    }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    }

    // Slideshow mode for multiple logos
    const startIndex = currentIndex * maxVisible;
    const visibleLogos = logos.slice(startIndex, startIndex + maxVisible);

    return (
        <div className={`relative ${className}`}>
            <div className="flex gap-2 transition-all duration-1000 ease-in-out">
                {visibleLogos.map((logo, index) => (
                    <div 
                        key={startIndex + index}
                        className="relative flex-1 animate-slide-up"
                    >
                        <div 
                            className={`${shapeStyles.containerClass} p-1`}
                            style={{ backgroundColor: 'rgba(255,255,255,0.9)' }}
                        >
                            <img
                                src={logo}
                                alt={`${alt} ${startIndex + index + 1}`}
                                className={shapeStyles.imageClass}
                                style={{
                                    filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))',
                                    backgroundColor: 'transparent',
                                    ...(shapeStyles.clipPath && { clipPath: shapeStyles.clipPath })
                                }}
                                onError={(e) => {
                                    e.target.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"><circle cx="20" cy="20" r="18" fill="%23ddd" stroke="%23999" stroke-width="2"/><text x="20" y="25" text-anchor="middle" font-size="12" fill="%23666">${alt.charAt(0)}</text></svg>`;
                                }}
                            />
                        </div>
                    </div>
                ))}
            </div>
            
            {/* Indicator dots for slideshow */}
            {slideMode && logos.length > maxVisible && (
                <div className="flex justify-center mt-2 gap-1">
                    {Array.from({ length: Math.ceil(logos.length / maxVisible) }).map((_, index) => (
                        <div
                            key={index}
                            className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                                index === currentIndex ? 'bg-blue-500' : 'bg-gray-300'
                            }`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default DisplayLogo;
