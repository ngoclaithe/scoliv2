import React, { useState } from "react";
import Button from "../components/common/Button";
import ScoreDisplay from "../components/scoreboard/ScoreDisplay";
import MatchPreview from "../components/match/MatchPreview";
import LineupDisplay from "../components/lineup/LineupDisplay";

const Home = () => {
  const [currentMatch, setCurrentMatch] = useState({
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

  const features = [
    {
      icon: "⚽",
      title: "Quản lý trận đấu",
      description:
        "Tạo và quản lý thông tin trận đấu, cập nhật tỉ số trực tiếp",
      link: "/match-management",
      color: "bg-blue-500",
    },
    {
      icon: "🏆",
      title: "Quản lý logo",
      description: "Tải lên và quản lý logo đội bóng, banner nhà tài trợ",
      link: "/logo-management",
      color: "bg-green-500",
    },
    {
      icon: "👥",
      title: "Đội hình cầu thủ",
      description: "Thiết lập đội hình và quản lý thông tin cầu thủ",
      link: "/lineup-management",
      color: "bg-purple-500",
    },
    {
      icon: "📺",
      title: "Livestream",
      description: "Stream trực tiếp với overlay thông tin trận đấu",
      link: "/livestream",
      color: "bg-red-500",
    },
    {
      icon: "🎨",
      title: "Templates",
      description: "Mẫu thiết kế poster, intro, và overlay đa dạng",
      link: "/templates",
      color: "bg-orange-500",
    },
    {
      icon: "🎵",
      title: "Âm thanh",
      description: "Quản lý nhạc nền và hiệu ứng âm thanh",
      link: "/audio",
      color: "bg-pink-500",
    },
  ];

  const quickStats = [
    { label: "Trận đấu hôm nay", value: "12", icon: "⚽" },
    { label: "Đội bóng", value: "24", icon: "🏃‍♂️" },
    { label: "Viewers", value: "1.2K", icon: "👥" },
    { label: "Thời gian stream", value: "2.5h", icon: "⏱️" },
  ];

  const recentMatches = [
    {
      id: 1,
      home: "Hà Nội FC",
      away: "HAGL",
      score: "2-1",
      status: "ended",
      time: "15:00",
    },
    {
      id: 2,
      home: "TP.HCM",
      away: "SLNA",
      score: "1-0",
      status: "live",
      time: "17:00",
    },
    {
      id: 3,
      home: "Bình Dương",
      away: "Thanh Hóa",
      score: "0-0",
      status: "pending",
      time: "19:00",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">⚽</span>
                </div>
                <h1 className="text-xl font-bold text-gray-900">
                  Football Livestream Tool
                </h1>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="outline" size="xs">
                <svg
                  className="w-3 h-3 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Cài đặt
              </Button>
              <Button variant="primary" size="xs">
                <svg
                  className="w-3 h-3 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                Bắt đầu Stream
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section - Current Match */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">
                Trận đấu hiện tại
              </h2>
              <div className="flex space-x-2">
                <Button variant="outline" size="xs">
                  Chỉnh sửa
                </Button>
                <Button variant="primary" size="xs">
                  Bắt đầu Stream
                </Button>
              </div>
            </div>

            <ScoreDisplay
              homeTeam={currentMatch.homeTeam}
              awayTeam={currentMatch.awayTeam}
              matchTime={currentMatch.matchTime}
              period={currentMatch.period}
              status={currentMatch.status}
              size="lg"
            />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {quickStats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center">
                <span className="text-2xl mr-3">{stat.icon}</span>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Features */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Chức năng chính
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer group"
                >
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <div
                        className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center text-white text-xl mr-4 group-hover:scale-110 transition-transform`}
                      >
                        {feature.icon}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {feature.title}
                      </h3>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">
                      {feature.description}
                    </p>
                    <Button variant="outline" size="xs">
                      Mở {feature.title}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Matches */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Trận đấu hôm nay
              </h3>
              <div className="space-y-3">
                {recentMatches.map((match) => (
                  <div
                    key={match.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">
                        {match.home} vs {match.away}
                      </div>
                      <div className="text-xs text-gray-500">{match.time}</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-mono">{match.score}</span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          match.status === "live"
                            ? "bg-red-100 text-red-800"
                            : match.status === "ended"
                              ? "bg-gray-100 text-gray-800"
                              : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {match.status === "live"
                          ? "LIVE"
                          : match.status === "ended"
                            ? "KT"
                            : "Sắp tới"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" size="xs" className="w-full mt-4">
                Xem tất cả
              </Button>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Thao tác nhanh
              </h3>
              <div className="space-y-3">
                <Button variant="primary" size="xs" className="w-full">
                  <svg
                    className="w-3 h-3 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Tạo trận đấu mới
                </Button>
                <Button variant="outline" size="xs" className="w-full">
                  <svg
                    className="w-3 h-3 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                    />
                  </svg>
                  Nhập dữ liệu
                </Button>
                <Button variant="outline" size="xs" className="w-full">
                  <svg
                    className="w-3 h-3 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                    />
                  </svg>
                  Chia sẻ
                </Button>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                💡 Mẹo sử dụng
              </h3>
              <ul className="text-sm text-blue-800 space-y-2">
                <li>• Chuẩn bị logo và thông tin đội trước trận</li>
                <li>• Kiểm tra kết nối internet trước khi stream</li>
                <li>• Sử dụng template có sẵn để tiết kiệm thời gian</li>
                <li>• Backup dữ liệu quan trọng thường xuyên</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
