import React from 'react';
import DisplayLogo from '../common/DisplayLogo';

const ScoreboardLogos = ({ allLogos, logoShape, rotateDisplay }) => {
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

    // Tự động bật rotate khi có ≥4 logos
    const shouldRotate = rotateDisplay || allLogos.length >= 4;

    if (shouldRotate && allLogos.length > 1) {
        // For rotating display, use DisplayLogo component
        return (
            <DisplayLogo
                logos={allLogos.map(logo => logo.url)}
                alt="Sponsors & Partners"
                className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16"
                type_play={logoShape}
                slideMode={true}
                maxVisible={3}
                slideInterval={3000}
            />
        );
    } else {
        return (
            <div className="flex gap-1 sm:gap-2 flex-wrap max-w-[200px] sm:max-w-[250px] md:max-w-[300px]">
                {allLogos.map((logo, index) => (
                    <div key={index} className="flex-shrink-0">
                        <div
                            className={`relative bg-white shadow-lg border-2 border-white/40 flex items-center justify-center overflow-hidden ${getContainerShape(logo.typeDisplay)}
                                w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 p-1 sm:p-1.5 md:p-2`}
                        >
                            <img
                                src={logo.url}
                                alt={logo.alt}
                                className="object-contain w-full h-full"
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
