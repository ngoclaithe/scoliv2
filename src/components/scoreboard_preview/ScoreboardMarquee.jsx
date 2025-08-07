import React, { useEffect, useState } from 'react';

const ScoreboardMarquee = ({ scrollData }) => {
    const [showScrollingText, setShowScrollingText] = useState(false);

    useEffect(() => {
        let timer;

        if (scrollData.mode === 'khong') {
            setShowScrollingText(false);
        } else if (scrollData.mode === 'lien-tuc') {
            setShowScrollingText(true);
            timer = setInterval(() => {
                setShowScrollingText(false);
                setTimeout(() => setShowScrollingText(true), 2000);
            }, scrollData.interval);
        } else if (scrollData.mode === 'moi-2' || scrollData.mode === 'moi-5') {
            timer = setInterval(() => {
                setShowScrollingText(true);
                setTimeout(() => setShowScrollingText(false), 5000);
            }, scrollData.interval);
        }

        return () => {
            if (timer) {
                clearInterval(timer);
            }
        };
    }, [scrollData.mode, scrollData.interval]);

    if (scrollData.mode === 'khong' || !showScrollingText) return null;

    return (
        <div
            className="absolute bottom-0 left-0 w-full z-20 overflow-hidden"
            style={{ backgroundColor: scrollData.bgColor }}
        >
            <div
                className="whitespace-nowrap py-2 text-sm font-semibold animate-[scroll_30s_linear_infinite]"
                style={{ color: scrollData.color }}
            >
                {Array(scrollData.repeat).fill(scrollData.text).join(' • ')}
            </div>
        </div>
    );
};

export default ScoreboardMarquee;