import React, { useEffect, useRef, useState } from 'react';

const FootballScoreboardV2 = ({
  matchTitle = "GIẢI BÓNG ĐÁ",
  team1 = "ĐỘI A",
  team2 = "ĐỘI B",
  score1 = "0",
  score2 = "0",
  logo1 = "/api/placeholder/90/90",
  logo2 = "/api/placeholder/90/90",
  color1 = "#0088FF",
  color2 = "#FF0000",
  live = "",
  marqueeText = ""
}) => {
  const [showMarquee, setShowMarquee] = useState(false);
  const scoreboardRef = useRef(null);
  const scoRef = useRef(null);
  const marqueeRef = useRef(null);

  // Adjust scoreboard scale
  const adjustScoreboardScale = () => {
    if (scoreboardRef.current) {
      const originalWidth = 600;
      const windowWidth = window.innerWidth;
      const targetWidth = 0.5 * windowWidth;
      const scale = targetWidth / originalWidth;
      scoreboardRef.current.style.transform = `scale(${scale})`;
    }
  };

  // Adjust sco image scale
  const adjustScoScale = () => {
    if (scoRef.current) {
      const originalWidth = 300;
      const windowWidth = window.innerWidth;
      const targetWidth = 0.18 * windowWidth;
      const scale = targetWidth / originalWidth;
      scoRef.current.style.transform = `scale(${scale})`;
    }
  };

  // Adjust font size for team names
  const adjustFontSizeTeam = () => {
    document.querySelectorAll('.team').forEach(team => {
      let fontSize = 35;
      team.style.fontSize = fontSize + 'px';
      while (team.scrollWidth > team.parentNode.offsetWidth * 1.1 && fontSize > 0) {
        fontSize -= 1;
        team.style.fontSize = fontSize + 'px';
      }
    });
  };

  const handleResize = () => {
    adjustScoreboardScale();
    adjustScoScale();
    adjustFontSizeTeam();
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    window.addEventListener('load', handleResize);
    
    // Initial call
    setTimeout(handleResize, 100);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('load', handleResize);
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
        
        .football-scoreboard-v2 {
          margin: 0;
          padding: 0;
          height: 100vh;
          box-sizing: border-box;
          background-color: transparent;
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

        .scoreboard {
          position: relative;
          transform: translateX(-50%);
          margin-top: auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          transform-origin: bottom center;
        }

        .score-main {
          display: flex;
          justify-content: space-between;
        }

        .team-container {
          position: relative;
          z-index: 1;
          padding: 0px 30px;
          background-color: #0d94a4;
          color: white;
          width: calc(50% - 110px);
          display: flex;
          justify-content: center;
        }

        .team {
          font-size: 40px;
          white-space: nowrap;
          height: 42px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-transform: uppercase;
          width: fit-content;
        }

        .team-color {
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: -1;
        }

        .team-logo {
          aspect-ratio: 1 / 1;
          position: absolute;
          top: 0;
          bottom: 0;
          right: 100%;
          background-color: white;
        }

        .team-container:last-child .team-logo {
          right: auto;
          left: 100%;
        }

        .team-logo img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .score-group {
          position: relative;
          z-index: 2;
          padding: 0 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 4px;
          background-color: red;
          color: white;
          font-size: 40px;
          font-weight: bold;
          width: 70px;
        }

        .score-left, .score-right {
          font-weight: bold;
        }

        .score-left {
          text-align: right;
        }

        .match-title {
          text-align: center;
          position: absolute;
          bottom: 100%;
          left: 0;
          right: 0;
          z-index: 0;
          white-space: nowrap;
          font-size: 26px;
          background-color: rgb(13 148 164 / 70%);
          color: white;
          padding: 5px 10px;
        }

        .clock {
          font-size: 20px;
          white-space: nowrap;
          font-family: Arial, sans-serif;
        }

        .img-logo {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translate(-50%, -50%);
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

      <div className="football-scoreboard-v2">
        {isNSB && (
          <img className="bdpxt-image" src="/api/placeholder/150/80" alt="NSB" />
        )}
        {isBDPXT && (
          <img className="bdpxt-image" src="/api/placeholder/150/80" alt="BDPXT" />
        )}

        <div className="wrapper-container">
          <div className="scoreboard" ref={scoreboardRef}>
            <div className="score-main">
              <div className="team-container">
                <div className="team">{team1}</div>
                <div className="team-logo">
                  <img src={logo1} alt={team1} />
                </div>
              </div>
              
              <div className="score-group">
                <div className="score-left">{score1}</div>
                <span>-</span>
                <div className="score-right">{score2}</div>
              </div>
              
              <div className="match-title">{matchTitle}</div>
              
              <div className="team-container">
                <div className="team">{team2}</div>
                <div className="team-logo">
                  <img src={logo2} alt={team2} />
                </div>
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

export default FootballScoreboardV2;