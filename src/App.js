import React, { useState } from "react";
import "./App.css";

// Import pages
import Home from "./pages/Home";

// Import components for demo
import ScoreDisplay from "./components/scoreboard/ScoreDisplay";
import ScoreControls from "./components/scoreboard/ScoreControls";
import Timer from "./components/scoreboard/Timer";
import MatchManager from "./components/match/MatchManager";
import LineupManager from "./components/lineup/LineupManager";
import PosterManager from "./components/poster/PosterManager";
import LogoPreview from "./components/logo/LogoPreview";
import AudioPlayer from "./components/audio/AudioPlayer";

function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [demoMatch, setDemoMatch] = useState({
    homeTeam: { name: "Hà Nội FC", score: 1, logo: null },
    awayTeam: { name: "TP.HCM", score: 2, logo: null },
    matchTime: "67:23",
    period: "Hiệp 2",
    status: "live",
    league: "V-League 2024",
    stadium: "Sân Hàng Đẫy",
    date: "2024-01-15",
    time: "19:00",
    weather: "☀️ Nắng",
    temperature: "28°C",
  });

  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const demoLineup = {
    formation: "4-4-2",
    positions: [
      {
        id: 1,
        position: "GK",
        x: 50,
        y: 5,
        number: 1,
        player: { name: "Nguyễn Văn A", number: 1, position: "GK" },
      },
      {
        id: 2,
        position: "LB",
        x: 20,
        y: 25,
        number: 3,
        player: { name: "Trần Văn B", number: 3, position: "LB" },
      },
      {
        id: 3,
        position: "CB",
        x: 40,
        y: 25,
        number: 4,
        player: { name: "Lê Văn C", number: 4, position: "CB" },
      },
      {
        id: 4,
        position: "CB",
        x: 60,
        y: 25,
        number: 5,
        player: { name: "Phạm Văn D", number: 5, position: "CB" },
      },
      {
        id: 5,
        position: "RB",
        x: 80,
        y: 25,
        number: 2,
        player: { name: "Hoàng Văn E", number: 2, position: "RB" },
      },
      // Add more positions as needed
    ],
  };

  const demoPoster = {
    id: "demo-poster",
    name: "Match Poster",
    dimensions: { width: 1920, height: 1080 },
  };

  const demoLogo = {
    id: "demo-logo",
    teamName: "Hà Nội FC",
    url: null,
    category: "club",
  };

  const navigation = [
    { id: "home", name: "Trang chủ", icon: "🏠" },
    { id: "scoreboard", name: "Bảng tỉ số", icon: "⚽" },
    { id: "match", name: "Quản lý trận đấu", icon: "📋" },
    { id: "lineup", name: "Đội hình", icon: "👥" },
    { id: "poster", name: "Poster", icon: "��" },
    { id: "logo", name: "Logo", icon: "🏆" },
    { id: "audio", name: "Âm thanh", icon: "🎵" },
  ];

  const handleMatchUpdate = (updatedMatch) => {
    setDemoMatch(updatedMatch);
  };

  const handleScoreChange = (team, newScore) => {
    setDemoMatch((prev) => ({
      ...prev,
      [team]: {
        ...prev[team],
        score: newScore,
      },
    }));
  };

  const handleTeamNameChange = (team, newName) => {
    setDemoMatch((prev) => ({
      ...prev,
      [team]: {
        ...prev[team],
        name: newName,
      },
    }));
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "home":
        return <Home />;

      case "scoreboard":
        return (
          <div className="max-w-6xl mx-auto p-6 space-y-8">
            <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">
              Demo Bảng Tỉ Số
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h2 className="text-xl font-semibold mb-4">Hiển th��� tỉ số</h2>
                <ScoreDisplay
                  homeTeam={demoMatch.homeTeam}
                  awayTeam={demoMatch.awayTeam}
                  matchTime={demoMatch.matchTime}
                  period={demoMatch.period}
                  status={demoMatch.status}
                />
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4">Điều khiển tỉ số</h2>
                <ScoreControls
                  homeTeam={demoMatch.homeTeam}
                  awayTeam={demoMatch.awayTeam}
                  onScoreChange={handleScoreChange}
                  onTeamNameChange={handleTeamNameChange}
                  onReset={() => {
                    setDemoMatch((prev) => ({
                      ...prev,
                      homeTeam: { ...prev.homeTeam, score: 0 },
                      awayTeam: { ...prev.awayTeam, score: 0 },
                    }));
                  }}
                />
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Đồng hồ bấm giờ</h2>
              <Timer
                onTimeChange={(newTime) => {
                  const minutes = Math.floor(newTime / 60);
                  const seconds = newTime % 60;
                  const timeString = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
                  setDemoMatch((prev) => ({ ...prev, matchTime: timeString }));
                }}
                onTimerStart={() => setIsTimerRunning(true)}
                onTimerPause={() => setIsTimerRunning(false)}
                isRunning={isTimerRunning}
              />
            </div>
          </div>
        );

      case "match":
        return (
          <div className="max-w-6xl mx-auto p-6">
            <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">
              Demo Quản Lý Trận Đấu
            </h1>
            <MatchManager
              match={demoMatch}
              onMatchUpdate={handleMatchUpdate}
              onMatchSave={(match) => console.log("Saved match:", match)}
              onMatchReset={() =>
                setDemoMatch({
                  homeTeam: { name: "Đội nhà", score: 0, logo: null },
                  awayTeam: { name: "Đội khách", score: 0, logo: null },
                  matchTime: "00:00",
                  period: "Hiệp 1",
                  status: "pending",
                  league: "V-League 2024",
                  stadium: "Sân vận động",
                  date: new Date().toISOString().split("T")[0],
                  time: "19:00",
                  weather: "☀️ Nắng",
                  temperature: "28°C",
                })
              }
            />
          </div>
        );

      case "lineup":
        return (
          <div className="max-w-6xl mx-auto p-6">
            <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">
              Demo Quản Lý Đội Hình
            </h1>
            <LineupManager
              lineup={demoLineup}
              onLineupUpdate={(lineup) =>
                console.log("Updated lineup:", lineup)
              }
              teamType="home"
            />
          </div>
        );

      case "poster":
        return (
          <div className="max-w-6xl mx-auto p-6">
            <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">
              Demo Poster
            </h1>
            <PosterPreview
              poster={demoPoster}
              matchData={demoMatch}
              onEdit={() => console.log("Edit poster")}
              onDownload={(format) => console.log("Download poster as", format)}
              onShare={(platform) => console.log("Share to", platform)}
            />
          </div>
        );

      case "logo":
        return (
          <div className="max-w-6xl mx-auto p-6">
            <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">
              Demo Logo
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <LogoPreview
                logo={demoLogo}
                teamType="home"
                onEdit={() => console.log("Edit logo")}
                onDelete={() => console.log("Delete logo")}
                onReplace={() => console.log("Replace logo")}
              />
              <LogoPreview
                logo={{ ...demoLogo, teamName: "TP.HCM" }}
                teamType="away"
                onEdit={() => console.log("Edit logo")}
                onDelete={() => console.log("Delete logo")}
                onReplace={() => console.log("Replace logo")}
              />
            </div>
          </div>
        );

      case "audio":
        return (
          <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">
              Demo Audio Player
            </h1>
            <div className="space-y-6">
              <AudioPlayer
                title="Nhạc nền trận đấu"
                src="https://www.soundjay.com/misc/sounds/bell-ringing-05.wav"
                showWaveform={true}
                onPlay={(time) => console.log("Playing at", time)}
                onPause={(time) => console.log("Paused at", time)}
                onEnd={() => console.log("Audio ended")}
              />
              <AudioPlayer
                title="Tiếng còi bắt đầu trận đấu"
                src="https://www.soundjay.com/misc/sounds/bell-ringing-05.wav"
                onPlay={(time) => console.log("Playing whistle at", time)}
              />
            </div>
          </div>
        );

      default:
        return <Home />;
    }
  };

  if (currentPage === "home") {
    return renderCurrentPage();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setCurrentPage("home")}
                className="flex items-center space-x-3 text-primary-600 hover:text-primary-700 transition-colors"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-md">
                  <span className="text-white font-bold text-lg">⚽</span>
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
                  scoliv
                </h1>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Page Navigation */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 overflow-x-auto">
            {navigation.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`flex items-center space-x-2 py-3 px-4 border-b-2 text-sm font-medium transition-all duration-200 whitespace-nowrap rounded-t-lg ${
                  currentPage === item.id
                    ? "border-primary-500 text-primary-600 bg-primary-50"
                    : "border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <span className="text-base">{item.icon}</span>
                <span>{item.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Page Content */}
      <main>{renderCurrentPage()}</main>
    </div>
  );
}

export default App;
