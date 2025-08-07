import React from 'react';
import DisplayLogo from '../common/DisplayLogo';

const ScoreboardLogos = ({ allLogos, logoShape, rotateDisplay }) => {
    if (allLogos.length === 0) return null;

    const getLogoShape = (typeDisplay) => {
        switch (typeDisplay) {
            case 'round': return 'round';
            case 'hexagonal': return 'hexagon';
            case 'square':
            default: return 'square';
        }
    };

    if (rotateDisplay && allLogos.length > 1) {
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
                        <DisplayLogo
                            logos={[logo.url]}
                            alt={logo.alt}
                            className="w-14 h-14"
                            type_play={getLogoShape(logo.typeDisplay)}
                            slideMode={false}
                        />
                    </div>
                ))}
            </div>
        );
    }
};

export default ScoreboardLogos;