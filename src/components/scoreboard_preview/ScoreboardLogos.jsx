import React from 'react';
import DisplayLogo from '../common/DisplayLogo';

const ScoreboardLogos = ({ allLogos, logoShape, rotateDisplay }) => {
    if (allLogos.length === 0) return null;

    const getContainerShape = (typeDisplay) => {
        switch (typeDisplay) {
            case 'round': return 'rounded-full';
            case 'hexagonal': return 'rounded-full'; // For hexagonal, we still use rounded for container
            case 'square':
            default: return 'rounded-lg';
        }
    };

    const logoSize = 56; // 56px = w-14 h-14

    if (rotateDisplay && allLogos.length > 1) {
        // For rotating display, still use DisplayLogo component
        return (
            <DisplayLogo
                logos={allLogos.map(logo => logo.url)}
                alt="Sponsors & Partners"
                className="w-full h-full"
                type_play={logoShape}
                slideMode={true}
                maxVisible={3}
                slideInterval={5000}
            />
        );
    } else {
        return (
            <div className="flex gap-2 flex-wrap max-w-sm">
                {allLogos.map((logo, index) => (
                    <div key={index} className="flex-shrink-0">
                        <div
                            className={`relative bg-white p-2 shadow-xl border-4 border-white/30 flex items-center justify-center overflow-hidden ${getContainerShape(logo.typeDisplay)}`}
                            style={{
                                width: `${logoSize}px`,
                                height: `${logoSize}px`
                            }}
                        >
                            <img
                                src={logo.url}
                                alt={logo.alt}
                                className="object-contain w-[100%] h-[100%]"
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
