import React, { useState, useEffect } from 'react';
import { getFullLogoUrl } from '../../utils/logoUtils';

const ScoreboardLogos = ({ allLogos, logoShape, rotateDisplay }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    console.log('Giá trị logoShape trong Scoreboard là:', logoShape);
    const shouldRotate = rotateDisplay || allLogos.length >= 4;

    useEffect(() => {
        if (shouldRotate && allLogos.length > 1) {
            const interval = setInterval(() => {
                setCurrentIndex(prev => (prev + 1) % Math.ceil(allLogos.length / 3));
            }, 3000);

            return () => clearInterval(interval);
        }
    }, [shouldRotate, allLogos.length]);

    if (allLogos.length === 0) return null;

    const getContainerShape = (shape) => {
        console.log('🔍 Getting container shape for:', shape);
        switch (shape) {
            case 'round': return 'rounded-full';
            case 'hexagon': return 'rounded-none'; // Không dùng border-radius cho hexagon
            case 'square': return 'rounded-lg';
            default: return 'rounded-lg';
        }
    };

    const getContainerStyle = (shape) => {
        console.log('🎨 Getting container style for:', shape);
        if (shape === 'hexagon') {
            return {
                clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                // Loại bỏ border và shadow cho hexagon vì chúng không hoạt động tốt với clip-path
            };
        }
        return {};
    };

    const getContainerClass = (shape) => {
        if (shape === 'hexagon') {
            // Không sử dụng border và shadow cho hexagon
            return 'relative bg-white flex items-center justify-center overflow-hidden';
        }
        // Giữ nguyên cho các shape khác
        return 'relative bg-white shadow-lg border-2 border-white/40 flex items-center justify-center overflow-hidden';
    };

    const getImageStyle = (shape) => {
        if (shape === 'hexagon') {
            // Sử dụng filter drop-shadow thay vì box-shadow cho hexagon
            return {
                filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))'
            };
        }
        return {
            filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.2))'
        };
    };

    // Alternative: Sử dụng CSS mask thay vì clip-path (tùy chọn)
    const getAlternativeHexagonStyle = (shape) => {
        if (shape === 'hexagon') {
            const hexagonSvg = `data:image/svg+xml;base64,${btoa(`
                <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <polygon points="50,0 100,25 100,75 50,100 0,75 0,25" fill="black"/>
                </svg>
            `)}`;
            
            return {
                WebkitMask: `url("${hexagonSvg}")`,
                mask: `url("${hexagonSvg}")`,
                WebkitMaskSize: '100% 100%',
                maskSize: '100% 100%',
                WebkitMaskRepeat: 'no-repeat',
                maskRepeat: 'no-repeat',
            };
        }
        return {};
    };

    const effectiveLogoShape = logoShape || 'square';
    console.log('🔧 Effective logo shape:', effectiveLogoShape);

    // Render function cho từng logo
    const renderLogo = (logo, index, keyPrefix = '') => (
        <div key={keyPrefix + index} className="flex-shrink-0">
            {effectiveLogoShape === 'hexagon' ? (
                // Cách 1: Sử dụng wrapper với pseudo-element để tạo border hexagon
                <div className="relative w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14">
                    {/* Background hexagon với border effect */}
                    <div 
                        className="absolute inset-0 bg-white"
                        style={{
                            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                            filter: 'drop-shadow(2px 2px 6px rgba(0,0,0,0.25))'
                        }}
                    />
                    
                    {/* Inner content với padding để tạo effect border */}
                    <div
                        className="absolute inset-0 bg-white flex items-center justify-center overflow-hidden m-0.5"
                        style={{
                            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                        }}
                    >
                        <div className="p-1 sm:p-1.5 md:p-2 w-full h-full flex items-center justify-center">
                            <img
                                src={getFullLogoUrl(logo.url)}
                                alt={logo.alt}
                                className="object-contain w-full h-full"
                                onError={(e) => {
                                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjNDMzOGNhIi8+Cjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+TG9nbzwvdGV4dD4KPHN2Zz4K';
                                }}
                            />
                        </div>
                    </div>
                </div>
            ) : (
                // Cách cũ cho các shape khác
                <div
                    className={`${getContainerClass(effectiveLogoShape)} ${getContainerShape(effectiveLogoShape)}
                        w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 p-1 sm:p-1.5 md:p-2`}
                    style={getContainerStyle(effectiveLogoShape)}
                >
                    <img
                        src={getFullLogoUrl(logo.url)}
                        alt={logo.alt}
                        className="object-contain w-full h-full"
                        style={getImageStyle(effectiveLogoShape)}
                        onError={(e) => {
                            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjNDMzOGNhIi8+Cjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+TG9nbzwvdGV4dD4KPHN2Zz4K';
                        }}
                    />
                </div>
            )}
        </div>
    );

    if (shouldRotate && allLogos.length > 1) {
        const startIndex = currentIndex * 3;
        const visibleLogos = allLogos.slice(startIndex, startIndex + 3);

        return (
            <div className="flex gap-0.5 sm:gap-1 md:gap-2 flex-wrap w-full transition-all duration-1000 ease-in-out">
                {visibleLogos.map((logo, index) => (
                    <div key={startIndex + index} className="flex-shrink-0 animate-slide-up">
                        {renderLogo(logo, index, 'rotate-')}
                    </div>
                ))}
            </div>
        );
    } else {
        return (
            <div className="flex gap-0.5 sm:gap-1 md:gap-2 flex-wrap w-full">
                {allLogos.map((logo, index) => renderLogo(logo, index))}
            </div>
        );
    }
};

export default ScoreboardLogos;