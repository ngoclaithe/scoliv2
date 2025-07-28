import React, { useEffect, useRef, useState } from 'react';

const ScoreboardBelowTemplate1 = ({
  matchTitle = "GIẢI BÓNG ĐÁ",
  team1 = "TEAM 1",
  team2 = "TEAM 2", 
  score1 = "0",
  score2 = "0",
  logo1 = "/api/placeholder/90/90",
  logo2 = "/api/placeholder/90/90",
  color1 = "#ff0000",
  color2 = "#0000ff",
  live = "",
  marqueeText = ""
}) => {
  const [showMarquee, setShowMarquee] = useState(false);
  const wrapperRef = useRef(null);
  const scoRef = useRef(null);
  const matchTitleRef = useRef(null);
  const marqueeRef = useRef(null);

  // Helper functions từ scoreboard-common.js
  const adjustScale = ({ selector, baseWidth, percentWidth }) => {
    const elements = selector.startsWith('#') || selector.startsWith('.') 
      ? document.querySelectorAll(selector)
      : [selector];
    
    elements.forEach(element => {
      if (element) {
        const screenWidth = window.innerWidth;
        const scale = Math.min(1, (screenWidth * percentWidth) / baseWidth);
        element.style.transform = element.style.transform?.includes('translate') 
          ? element.style.transform.replace(/scale\([^)]*\)/, '') + ` scale(${scale})`
          : `scale(${scale})`;
      }
    });
  };

  const adjustFontSize = (element, minSize, maxSize, ratio = 0.8) => {
    if (!element) return;
    
    const parent = element.parentElement;
    if (!parent) return;
    
    const parentWidth = parent.offsetWidth;
    let fontSize = maxSize;
    
    element.style.fontSize = fontSize + 'px';
    
    while (element.scrollWidth > parentWidth * ratio && fontSize > minSize) {
      fontSize--;
      element.style.fontSize = fontSize + 'px';
    }
  };

  const adjustAllScales = () => {
    if (wrapperRef.current) {
      adjustScale({ selector: wrapperRef.current, baseWidth: 880, percentWidth: 0.6 });
    }
    if (scoRef.current) {
      adjustScale({ selector: scoRef.current, baseWidth: 300, percentWidth: 0.18 });
    }
  };

  const adjustMatchTitleFontSize = () => {
    if (matchTitleRef.current) {
      adjustFontSize(matchTitleRef.current, 14, 48, 0.8);
    }
  };

  const adjustFontSizeTeam = () => {
    document.querySelectorAll('.team-text').forEach(team => {
      adjustFontSize(team, 20, 52, 0.8);
    });
  };

  const onResizeAll = () => {
    adjustAllScales();
    adjustMatchTitleFontSize();
    adjustFontSizeTeam();
  };

  useEffect(() => {
    const handleResize = () => onResizeAll();
    const handleLoad = () => onResizeAll();
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('load', handleLoad);
    
    // Initial call
    setTimeout(onResizeAll, 100);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('load', handleLoad);
    };
  }, []);

  useEffect(() => {
    if (marqueeText) {
      setShowMarquee(true);
      if (marqueeRef.current) {
        marqueeRef.current.style.animation = 'marquee 15s linear infinite';
      }
    } else {
      setShowMarquee(false);
    }
  }, [marqueeText]);

  // Clean live text for logo detection
  const liveClean = live.toLowerCase().trim();
  const isNSB = liveClean.includes('nsb') || liveClean.includes('nga son biz');
  const isBDPXT = liveClean.includes('bdpxt') || liveClean.includes('xu thanh');
  const showSco = !isNSB && !isBDPXT;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue:wght@400&display=swap');
        
        .football-scoreboard {
          margin: 0;
          padding: 0;
          height: 100vh;
          box-sizing: border-box;
          background-color: white;
          font-family: 'Bebas Neue', sans-serif;
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
        }

        .bdpxt-image {
          position: fixed;
          top: 2vw;
          left: 2vw;
          z-index: 100;
          height: 8vw;
          width: auto;
        }

        .sco-image {
          position: fixed;
          bottom: 3vw;
          left: 3vw;
          z-index: 100;
          transform-origin: bottom left;
          height: 6vw;
          width: auto;
        }

        .wrapper-container {
          position: fixed;
          bottom: 3vw;
          left: 50%;
          transform: translateX(-50%);
        }

        .wrapper {
          margin-top: auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          transform-origin: bottom center;
        }

        .match-title-wrapper {
          min-height: 44px;
          display: flex;
          align-items: center;
          background-color: #FFCB00;
          padding: 0px 20px;
          font-size: 35px;
          text-transform: uppercase;
          border-radius: 10px 10px 0 0;
          max-width: 560px;
        }

        .match-title {
          font-size: 35px;
          height: fit-content;
          color: #004d73;
          white-space: nowrap;
          display: inline-block;
        }

        .scoreboard {
          display: flex;
          align-items: center;
          background-color: #002f4b;
          color: white;
          width: 700px;
          justify-content: space-between;
          position: relative;
        }

        .team-container {
          display: flex;
          align-items: center;
          background-color: #004d73;
          padding: 5px 10px;
          width: 360px;
          position: relative;
        }

        .team-text {
          font-size: 35px;
          text-transform: uppercase;
          flex-grow: 1;
          text-align: center;
          overflow: hidden;
          white-space: nowrap;
        }

        .team-logo {
          width: 90px;
          height: 90px;
          object-fit: cover;
          border-radius: 50%;
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
        }

        .team-logo-left {
          left: -45px;
        }

        .team-logo-right {
          right: -45px;
        }

        .score {
          width: 50px;
          height: 55px;
          background-color: #333;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 35px;
        }

        .jersey-bar {
          width: 8px;
          height: 100%;
        }

        .marquee-container {
          position: fixed;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 3vw;
          background-color: rgba(0, 0, 0, 0.3);
          color: white;
          font-family: 'Bebas Neue', sans-serif;
          white-space: nowrap;
          overflow: hidden;
          z-index: 200;
        }

        .marquee-text {
          position: absolute;
          bottom: 0.2vw;
          left: 0;
          white-space: nowrap;
          display: inline-block;
          font-size: 2.3vw;
        }

        @keyframes marquee {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
      `}</style>

      <div className="football-scoreboard">
        {isNSB && (
          <img className="bdpxt-image" src="/api/placeholder/150/80" alt="NSB" />
        )}
        {isBDPXT && (
          <img className="bdpxt-image" src="/api/placeholder/150/80" alt="BDPXT" />
        )}

        <div className="wrapper-container">
          <div className="wrapper" ref={wrapperRef}>
            <div className="match-title-wrapper">
              <span className="match-title" ref={matchTitleRef}>{matchTitle}</span>
            </div>
            <div className="scoreboard">
              <div className="team-container">
                <img src={logo1} alt="Logo Team 1" className="team-logo team-logo-left" />
                <div className="team-text">{team1}</div>
              </div>
              <div className="jersey-bar" style={{ backgroundColor: color1 }}></div>
              <div className="score">{score1}</div>
              <div className="score">{score2}</div>
              <div className="jersey-bar" style={{ backgroundColor: color2 }}></div>
              <div className="team-container">
                <div className="team-text">{team2}</div>
                <img src={logo2} alt="Logo Team 2" className="team-logo team-logo-right" />
              </div>
            </div>
          </div>
        </div>

        {showMarquee && (
          <div className="marquee-container">
            <div className="marquee-text" ref={marqueeRef}>
              {marqueeText}
            </div>
          </div>
        )}

        {showSco && (
          <img className="sco-image" ref={scoRef} src="/api/placeholder/120/80" alt="SCO" />
        )}
      </div>
    </>
  );
};

export default ScoreboardBelowTemplate1;
