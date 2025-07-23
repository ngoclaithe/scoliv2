import React, { useState, useRef } from "react";
import Button from "../common/Button";

const PosterTemplate = ({
  matchData = {},
  teamLogos = {},
  settings = {},
  onExport,
  className = "",
}) => {
  const canvasRef = useRef(null);
  const [isExporting, setIsExporting] = useState(false);

  const defaultSettings = {
    backgroundColor: "#1e40af",
    titleText: "",
    titleColor: "#ffffff",
    titleSize: 48,
    titleFont: "Inter",
    showLogos: true,
    logoSize: 80,
    logoPosition: "center",
    showScore: true,
    scoreSize: 64,
    scoreColor: "#ffffff",
    scorePosition: "center",
    layout: "horizontal",
    padding: 40,
    spacing: 20,
    backgroundOpacity: 100,
    backgroundBlur: 0,
    enableAnimations: true,
    animationType: "fade",
    animationDuration: 500,
    ...settings,
  };

  const handleExport = async (format = "png") => {
    setIsExporting(true);
    try {
      // Create canvas for export
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      // Set canvas size
      canvas.width = 1920;
      canvas.height = 1080;

      // Draw poster content
      await drawPoster(ctx, canvas.width, canvas.height);

      // Export based on format
      let dataURL;
      if (format === "jpg") {
        dataURL = canvas.toDataURL("image/jpeg", 0.9);
      } else {
        dataURL = canvas.toDataURL("image/png");
      }

      // Download
      const link = document.createElement("a");
      link.download = `poster-${Date.now()}.${format}`;
      link.href = dataURL;
      link.click();

      onExport?.(format, dataURL);
    } catch (error) {
      console.error("Export error:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const drawPoster = async (ctx, width, height) => {
    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Background
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, defaultSettings.backgroundColor);
    gradient.addColorStop(
      1,
      adjustBrightness(defaultSettings.backgroundColor, -20),
    );
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Background pattern
    drawPattern(ctx, width, height);

    // Team logos and info
    if (defaultSettings.showLogos) {
      await drawTeamSection(ctx, width, height);
    }

    // Score
    if (defaultSettings.showScore && matchData.homeTeam && matchData.awayTeam) {
      drawScore(ctx, width, height);
    }

    // Title
    if (defaultSettings.titleText) {
      drawTitle(ctx, width, height);
    }

    // Match info
    drawMatchInfo(ctx, width, height);
  };

  const drawPattern = (ctx, width, height) => {
    ctx.save();
    ctx.globalAlpha = 0.1;
    ctx.fillStyle = "#ffffff";

    const size = 60;
    for (let x = 0; x < width; x += size) {
      for (let y = 0; y < height; y += size) {
        if ((x + y) % (size * 2) === 0) {
          ctx.beginPath();
          ctx.arc(x + size / 2, y + size / 2, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
    ctx.restore();
  };

  const drawTeamSection = async (ctx, width, height) => {
    const logoSize = Math.max(40, Math.min(200, defaultSettings.logoSize));
    const centerY = height * 0.4;

    // Home team
    if (teamLogos.home) {
      await drawLogo(ctx, teamLogos.home, width * 0.2, centerY, logoSize);
    } else {
      drawPlaceholderLogo(
        ctx,
        width * 0.2,
        centerY,
        logoSize,
        matchData.homeTeam?.name || "H",
      );
    }

    // Away team
    if (teamLogos.away) {
      await drawLogo(ctx, teamLogos.away, width * 0.8, centerY, logoSize);
    } else {
      drawPlaceholderLogo(
        ctx,
        width * 0.8,
        centerY,
        logoSize,
        matchData.awayTeam?.name || "A",
      );
    }

    // Team names
    ctx.fillStyle = defaultSettings.titleColor;
    ctx.font = `bold ${Math.max(24, defaultSettings.titleSize * 0.67)}px ${defaultSettings.titleFont || 'Inter'}, sans-serif`;
    ctx.textAlign = "center";

    ctx.fillText(
      matchData.homeTeam?.name || "Đội nhà",
      width * 0.2,
      centerY + logoSize + 40,
    );
    ctx.fillText(
      matchData.awayTeam?.name || "Đội khách",
      width * 0.8,
      centerY + logoSize + 40,
    );
  };

  const drawLogo = (ctx, logoSrc, x, y, size) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        ctx.drawImage(img, x - size / 2, y - size / 2, size, size);
        resolve();
      };
      img.onerror = () => {
        drawPlaceholderLogo(ctx, x, y, size, "?");
        resolve();
      };
      img.src = logoSrc;
    });
  };

  const drawPlaceholderLogo = (ctx, x, y, size, text) => {
    ctx.save();
    ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
    ctx.beginPath();
    ctx.arc(x, y, size / 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.font = `bold ${size / 3}px Inter, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text.charAt(0), x, y);
    ctx.restore();
  };

  const drawScore = (ctx, width, height) => {
    const centerX = width / 2;
    const centerY = height * 0.4;
    const scoreSize = Math.max(24, Math.min(128, defaultSettings.scoreSize));

    ctx.fillStyle = defaultSettings.scoreColor;
    ctx.font = `bold ${scoreSize}px Inter, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const scoreText = `${matchData.homeTeam?.score || 0} - ${matchData.awayTeam?.score || 0}`;
    ctx.fillText(scoreText, centerX, centerY);

    // Match time
    ctx.font = `normal ${scoreSize / 3}px Inter, sans-serif`;
    ctx.fillText(matchData.matchTime || "00:00", centerX, centerY + scoreSize);

    // Period
    ctx.font = `normal ${scoreSize / 4}px Inter, sans-serif`;
    ctx.fillText(
      matchData.period || "Hiệp 1",
      centerX,
      centerY + scoreSize + 30,
    );
  };

  const drawTitle = (ctx, width, height) => {
    if (!defaultSettings.titleText) return;

    ctx.fillStyle = defaultSettings.titleColor;
    ctx.font = `bold ${Math.max(16, Math.min(128, defaultSettings.titleSize))}px ${defaultSettings.titleFont || 'Inter'}, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";

    ctx.fillText(defaultSettings.titleText, width / 2, Math.max(40, defaultSettings.padding * 2));
  };

  const drawMatchInfo = (ctx, width, height) => {
    const info = [
      matchData.league || "V-League 2024",
      matchData.stadium || "Sân vận động",
      `${matchData.date || new Date().toLocaleDateString("vi-VN")} • ${matchData.time || "19:00"}`,
    ];

    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    ctx.font = `normal ${Math.max(16, defaultSettings.titleSize * 0.5)}px ${defaultSettings.titleFont || 'Inter'}, sans-serif`;
    ctx.textAlign = "center";

    const startY = height - Math.max(80, defaultSettings.padding * 3);
    info.forEach((text, index) => {
      ctx.fillText(text, width / 2, startY + index * Math.max(20, defaultSettings.spacing * 1.5));
    });
  };

  const adjustBrightness = (hex, amount) => {
    const num = parseInt(hex.replace("#", ""), 16);
    const r = Math.max(0, Math.min(255, (num >> 16) + amount));
    const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00ff) + amount));
    const b = Math.max(0, Math.min(255, (num & 0x0000ff) + amount));
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
  };

  // Mock poster preview for display
  const PosterPreview = () => (
    <div
      className="w-full aspect-video rounded-lg overflow-hidden relative"
      style={{ backgroundColor: defaultSettings.backgroundColor }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className={
            'w-full h-full bg-[url(\'data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.4"%3E%3Ccircle cx="7" cy="7" r="3"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\')]'
          }
        ></div>
      </div>

      <div className="relative h-full p-8 text-white flex flex-col">
        {/* Title */}
        {defaultSettings.titleText && (
          <div className="text-center mb-8">
            <h1
              className="font-bold"
              style={{
                color: defaultSettings.titleColor,
                fontSize: `${Math.max(1, defaultSettings.titleSize * 0.02)}rem`,
                fontFamily: defaultSettings.titleFont || 'Inter',
              }}
            >
              {defaultSettings.titleText}
            </h1>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-between">
          {/* Home Team */}
          <div className="flex-1 text-center">
            {defaultSettings.showLogos && (
              <div
                className="mx-auto mb-4 bg-white bg-opacity-20 rounded-full flex items-center justify-center"
                style={{
                  width: `${Math.max(32, defaultSettings.logoSize * 0.8)}px`,
                  height: `${Math.max(32, defaultSettings.logoSize * 0.8)}px`,
                }}
              >
                {teamLogos.home ? (
                  <img
                    src={teamLogos.home}
                    alt="Home team"
                    className="w-full h-full object-contain p-2 rounded-full"
                  />
                ) : (
                  <span className="text-2xl font-bold">
                    {matchData.homeTeam?.name?.charAt(0) || "H"}
                  </span>
                )}
              </div>
            )}
            <h2 className="text-xl font-bold mb-2">
              {matchData.homeTeam?.name || "Đội nhà"}
            </h2>
            <p className="text-sm opacity-75">Chủ nhà</p>
          </div>

          {/* Score */}
          {defaultSettings.showScore && (
            <div className="flex-1 text-center">
              <div
                className="font-bold mb-2"
                style={{
                  color: defaultSettings.scoreColor,
                  fontSize: `${Math.max(1.2, defaultSettings.scoreSize * 0.03)}rem`,
                  fontFamily: defaultSettings.titleFont || 'Inter',
                }}
              >
                {matchData.homeTeam?.score || 0} -{" "}
                {matchData.awayTeam?.score || 0}
              </div>
              <div className="text-sm opacity-90">
                {matchData.matchTime || "00:00"}
              </div>
              <div className="text-xs opacity-75 mt-1">
                {matchData.period || "Hiệp 1"}
              </div>
            </div>
          )}

          {/* Away Team */}
          <div className="flex-1 text-center">
            {defaultSettings.showLogos && (
              <div
                className="mx-auto mb-4 bg-white bg-opacity-20 rounded-full flex items-center justify-center"
                style={{
                  width: `${Math.max(32, defaultSettings.logoSize * 0.8)}px`,
                  height: `${Math.max(32, defaultSettings.logoSize * 0.8)}px`,
                }}
              >
                {teamLogos.away ? (
                  <img
                    src={teamLogos.away}
                    alt="Away team"
                    className="w-full h-full object-contain p-2 rounded-full"
                  />
                ) : (
                  <span className="text-2xl font-bold">
                    {matchData.awayTeam?.name?.charAt(0) || "A"}
                  </span>
                )}
              </div>
            )}
            <h2 className="text-xl font-bold mb-2">
              {matchData.awayTeam?.name || "Đội khách"}
            </h2>
            <p className="text-sm opacity-75">Khách</p>
          </div>
        </div>

        {/* Match Info */}
        <div className="text-center text-sm opacity-90 space-y-1">
          <div>{matchData.league || "V-League 2024"}</div>
          <div>{matchData.stadium || "Sân vận động"}</div>
          <div>
            {matchData.date || new Date().toLocaleDateString("vi-VN")} •{" "}
            {matchData.time || "19:00"}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`w-full ${className}`}>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">
              Poster Template
            </h3>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExport("png")}
                disabled={isExporting}
                loading={isExporting}
              >
                Xuất PNG
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExport("jpg")}
                disabled={isExporting}
              >
                Xuất JPG
              </Button>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="p-4">
          <PosterPreview />
        </div>

        {/* Hidden Canvas */}
        <canvas ref={canvasRef} className="hidden" width={1920} height={1080} />
      </div>
    </div>
  );
};

export default PosterTemplate;
