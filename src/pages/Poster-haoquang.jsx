import React, { useState, useEffect, useRef } from 'react';
import { usePublicMatch } from '../contexts/PublicMatchContext';

export default function MatchIntroduction({ accessCode }) {
  // Sử dụng PublicMatchContext
  const {
    matchData: contextMatchData,
    marqueeData,
    sponsors,
    socketConnected,
    lastUpdateTime
  } = usePublicMatch();
  // Transform context data to poster format
  const [matchData, setMatchData] = useState({
    matchTitle: contextMatchData.tournament || 'GIẢI BÓNG ĐÁ PHONG TRÀO',
    team1: contextMatchData.teamA.name || 'DOI-A',
    team2: contextMatchData.teamB.name || 'DOI-B',
    logo1: contextMatchData.teamA.logo || '/public/images/team1-logo.png',
    logo2: contextMatchData.teamB.logo || '/public/images/team2-logo.png',
    stadium: contextMatchData.stadium || '',
    roundedTime: '15:30',
    currentDate: new Date().toLocaleDateString('vi-VN')
  });

  // Transform sponsors to partners format
  const [partners, setPartners] = useState({
    sponsor: sponsors.main || [],
    organizer: sponsors.secondary || [],
    media: sponsors.media || []
  });

  // Transform marquee data
  const [marquee, setMarquee] = useState({
    text: marqueeData.text || '',
    mode: marqueeData.mode || 'none',
    interval: marqueeData.interval || 0,
    isRunning: marqueeData.mode !== 'none'
  });

  const [currentSkin, setCurrentSkin] = useState('skin1');
  const marqueeRef = useRef(null);

  // Sync context data với local state
  useEffect(() => {
    setMatchData(prev => ({
      ...prev,
      matchTitle: contextMatchData.tournament || prev.matchTitle,
      team1: contextMatchData.teamA.name || prev.team1,
      team2: contextMatchData.teamB.name || prev.team2,
      logo1: contextMatchData.teamA.logo || prev.logo1,
      logo2: contextMatchData.teamB.logo || prev.logo2,
      stadium: contextMatchData.stadium || prev.stadium
    }));
  }, [contextMatchData]);

  // Sync sponsors data
  useEffect(() => {
    setPartners({
      sponsor: sponsors.main || [],
      organizer: sponsors.secondary || [],
      media: sponsors.media || []
    });
  }, [sponsors]);

  // Sync marquee data
  useEffect(() => {
    setMarquee(prev => ({
      ...prev,
      text: marqueeData.text || '',
      mode: marqueeData.mode || 'none',
      interval: marqueeData.interval || 0,
      isRunning: marqueeData.mode !== 'none'
    }));
  }, [marqueeData]);

  // Font size adjustment function
  const adjustFontSize = (element) => {
    if (!element) return;
    let fontSize = parseInt(window.getComputedStyle(element).fontSize);
    const minFontSize = 20;
    
    while (element.scrollWidth > element.offsetWidth && fontSize > minFontSize) {
      fontSize--;
      element.style.fontSize = fontSize + "px";
    }
  };

  // Marquee functions
  const stopMarquee = () => {
    if (marqueeRef.current) {
      marqueeRef.current.style.animation = 'none';
      setMarquee(prev => ({ ...prev, isRunning: false }));
    }
  };

  const runMarquee = (text, isContinuous = false) => {
    if (!marqueeRef.current) return;
    
    stopMarquee();
    marqueeRef.current.innerText = text;
    
    const containerWidth = marqueeRef.current.parentElement?.clientWidth || 0;
    const textWidth = marqueeRef.current.scrollWidth;
    const totalDistance = containerWidth + textWidth;
    const speed = 100; // pixels per second
    const duration = totalDistance / speed;
    
    marqueeRef.current.style.animation = `marquee ${duration}s linear ${isContinuous ? 'infinite' : '1'}`;
    setMarquee(prev => ({ ...prev, isRunning: true }));
    
    if (!isContinuous) {
      setTimeout(() => {
        setMarquee(prev => ({ ...prev, isRunning: false }));
      }, duration * 1000);
    }
  };

  // Marquee effect
  useEffect(() => {
    if (marquee.mode === 'none' || !marquee.text?.trim()) {
      stopMarquee();
    } else if (marquee.mode === 'continuous') {
      runMarquee(marquee.text, true);
    } else if (marquee.mode === 'interval') {
      runMarquee(marquee.text, false);
    }
  }, [marquee.text, marquee.mode]);

  // Render partners
  const renderPartners = () => {
    const allPartners = [...partners.sponsor, ...partners.organizer, ...partners.media];
    
    if (allPartners.length === 0) return null;

    return allPartners.map((partner, index) => (
      <div key={index} className="w-[90px] h-[90px] flex justify-center items-center">
        <img
          src={`/logo/${partner.logo}.png`}
          alt={partner.name}
          className="max-h-full max-w-full object-contain border border-black rounded-full"
        />
      </div>
    ));
  };

  const hasPartners = partners.sponsor.length > 0 || partners.organizer.length > 0 || partners.media.length > 0;

  return (
    <div className="flex justify-center items-center min-h-screen bg-transparent font-inter text-white text-center uppercase overflow-hidden">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@700&display=swap');
        
        @font-face {
          font-family: 'UTM Colossalis';
          src: url('/fonts/UTMColossalis.woff2') format('woff2'),
               url('/fonts/UTMColossalis.woff') format('woff');
          font-weight: normal;
          font-style: normal;
        }
        
        @font-face {
          font-family: 'UTM Bebas';
          src: url('/fonts/UTMBebas.woff2') format('woff2'),
               url('/fonts/UTMBebas.woff') format('woff');
          font-weight: normal;
          font-style: normal;
        }

        .utm-colossalis {
          font-family: 'UTM Colossalis', sans-serif;
        }

        .utm-bebas {
          font-family: 'UTM Bebas', sans-serif;
        }

        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
      `}</style>

      {/* Main poster wrapper */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-screen h-auto max-h-screen aspect-video">
        <div 
          className="w-[1920px] h-[1080px] transform-gpu origin-top-left absolute top-0 left-0"
          style={{
            backgroundImage: `url('/public/images/background-poster/bg2.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          {/* Title */}
          <div className="utm-colossalis mt-[70px] text-[70px] h-[86px] text-shadow-lg min-h-fit">
            {matchData.matchTitle}
          </div>

          {/* Divider */}
          <div className="flex items-center justify-center my-5 h-[22px]">
            <div className="w-[35%] h-[1%] bg-white"></div>
            <div className="w-[15px] h-[15px] bg-white rounded-full mx-[5px]"></div>
            <div className="w-[15px] h-[15px] bg-white rounded-full mx-[5px]"></div>
            <div className="w-[15px] h-[15px] bg-white rounded-full mx-[5px]"></div>
            <div className="w-[35%] h-[1%] bg-white"></div>
          </div>

          {/* Match section */}
          <div className={`h-[40%] flex justify-between items-center mx-20 ${hasPartners ? 'mt-[6%]' : 'mt-[8%]'}`}>
            {/* Team 1 */}
            <div className="flex-[3] flex flex-col items-center h-full">
              <img
                src={matchData.logo1}
                alt={matchData.team1}
                className="h-[70%] w-auto rounded-full bg-white object-cover"
              />
              <div 
                className="bg-gradient-to-br from-[#1eae99] to-[#008582] rounded-[17px] mt-[45px] text-center text-[45px] px-[30px] py-2 w-fit min-w-[35%] border-[5px] border-white"
                ref={(el) => el && adjustFontSize(el)}
              >
                {matchData.team1}
              </div>
            </div>

            {/* VS section */}
            <div className="flex-1 flex flex-col items-center justify-center">
              <img
                src="/public/images/vs2.png"
                alt="VS"
                className="h-[300px] w-[300px]"
              />
              <div className="flex items-center gap-[30px] mt-[60px]">
                <div className="bg-red-600 px-5 py-1 rounded-[10px] text-[45px]">
                  LIVE
                </div>
                <div className="whitespace-nowrap text-[40px] text-shadow">
                  {matchData.roundedTime} - {matchData.currentDate}
                </div>
              </div>
            </div>

            {/* Team 2 */}
            <div className="flex-[3] flex flex-col items-center h-full">
              <img
                src={matchData.logo2}
                alt={matchData.team2}
                className="h-[70%] w-auto rounded-full bg-white object-cover"
              />
              <div 
                className="bg-gradient-to-br from-[#1eae99] to-[#008582] rounded-[17px] mt-[45px] text-center text-[45px] px-[30px] py-2 w-fit min-w-[35%] border-[5px] border-white"
                ref={(el) => el && adjustFontSize(el)}
              >
                {matchData.team2}
              </div>
            </div>
          </div>

          {/* Stadium */}
          {matchData.stadium && matchData.stadium !== 'san' && (
            <div className="mt-0 mb-10 text-[40px]">
              Địa điểm: {matchData.stadium}
            </div>
          )}

          {/* Partners */}
          {hasPartners && (
            <div className="flex flex-col items-center mt-5">
              <div className="text-yellow-400 text-[38px] mb-[10px]">
                CÁC ĐƠN VỊ ĐỒNG HÀNH
              </div>
              <div className="min-w-[25%] bg-white rounded-tl-[21px] rounded-br-none p-[10px_30px] flex flex-wrap gap-5 justify-center w-fit">
                {renderPartners()}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Marquee */}
      {marquee.isRunning && (
        <div className="fixed bottom-0 left-0 w-full h-[3vw] bg-black bg-opacity-30 text-white utm-bebas whitespace-nowrap overflow-hidden z-[200]">
          <div
            ref={marqueeRef}
            className="absolute bottom-[0.2vw] left-0 whitespace-nowrap inline-block text-[2.3vw]"
          >
            {marquee.text}
          </div>
        </div>
      )}
    </div>
  );
}
