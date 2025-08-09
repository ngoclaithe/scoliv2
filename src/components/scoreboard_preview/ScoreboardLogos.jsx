import React, { useState, useEffect } from 'react';
import { getFullLogoUrl } from '../../utils/logoUtils';

const ScoreboardLogos = ({ allLogos, logoShape, rotateDisplay }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    if (allLogos.length === 0) return null;

    const getContainerShape = (typeDisplay) => {
        console.log('🔍 ScoreboardLogos typeDisplay:', typeDisplay);
        switch (typeDisplay) {
            case 'round': return 'rounded-full';
            case 'hexagonal':
                return 'hexagon-shape'; // Custom hexagon class
            case 'square':
                return 'rounded-lg';
            default: return 'rounded-lg';
        }
    };

    const getImageStyle = (typeDisplay) => {
        if (typeDisplay === 'hexagonal') {
            return {
                clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'
            };
        }
        return {};
    };

    // Tự động bật rotate khi có ≥4 logos
    const shouldRotate = rotateDisplay || allLogos.length >= 4;

    useEffect(() => {
        if (shouldRotate && allLogos.length > 1) {
            const interval = setInterval(() => {
                setCurrentIndex(prev => (prev + 1) % Math.ceil(allLogos.length / 3));
            }, 3000);

            return () => clearInterval(interval);
        }
    }, [shouldRotate, allLogos.length]);

    if (shouldRotate && allLogos.length > 1) {
        // For rotating display, implement our own rotation logic
        const startIndex = currentIndex * 3;
        const visibleLogos = allLogos.slice(startIndex, startIndex + 3);

        return (
            <div className="flex gap-0.5 sm:gap-1 md:gap-2 flex-wrap w-full transition-all duration-1000 ease-in-out">
                {visibleLogos.map((logo, index) => (
                    <div key={startIndex + index} className="flex-shrink-0 animate-slide-up">
                        <div
                            className={`relative bg-white shadow-lg border-2 border-white/40 flex items-center justify-center overflow-hidden ${getContainerShape(logo.typeDisplay)}
                                w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 p-1 sm:p-1.5 md:p-2`}
                        >
                            <img
                                src={getFullLogoUrl(logo.url)}
                                alt={logo.alt}
                                className="object-contain w-full h-full"
                                style={{
                                    filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.2))',
                                    ...getImageStyle(logo.typeDisplay)
                                }}
                                onError={(e) => {
                                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjNDMzOGNhIi8+Cjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+TG9nbzwvdGV4dD4KPHN2Zz4K';
                                }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        );
    } else {
        return (
            <div className="flex gap-0.5 sm:gap-1 md:gap-2 flex-wrap w-full">
                {allLogos.map((logo, index) => (
                    <div key={index} className="flex-shrink-0">
                        <div
                            className={`relative bg-white shadow-lg border-2 border-white/40 flex items-center justify-center overflow-hidden ${getContainerShape(logo.typeDisplay)}
                                w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 p-1 sm:p-1.5 md:p-2`}
                        >
                            <img
                                src={getFullLogoUrl(logo.url)}
                                alt={logo.alt}
                                className="object-contain w-full h-full"
                                style={{
                                    filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.2))',
                                    ...getImageStyle(logo.typeDisplay)
                                }}
                                onError={(e) => {
                                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjNDMzOGNhIi8+Cjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+TG9nbzwvdGV4dD4KPHN2Zz4K';
                                }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        );
    }
};

export default ScoreboardLogos;
