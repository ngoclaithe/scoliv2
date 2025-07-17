import React, { useState } from "react";
import Button from "../common/Button";
import Input from "../common/Input";

const QuickPlayerEntry = ({
  onPlayersAdd,
  maxPlayers = 11,
  existingPlayers = [],
  className = "",
}) => {
  const [playerText, setPlayerText] = useState("");
  const [parsedPlayers, setParsedPlayers] = useState([]);
  const [errors, setErrors] = useState([]);
  const [mode, setMode] = useState("text"); // 'text' or 'template'

  const templates = [
    {
      name: "Đội hình 4-4-2 cơ bản",
      formation: "4-4-2",
      players: [
        "1. GK Nguyễn Văn A",
        "2. RB Trần Văn B",
        "3. LB Lê Văn C",
        "4. CB Phạm Văn D",
        "5. CB Hoàng Văn E",
        "6. CDM Vũ Văn F",
        "7. RM Đỗ Văn G",
        "8. CM Ngô Văn H",
        "9. ST Bùi Văn I",
        "10. CAM Đinh Văn J",
        "11. LW Mai Văn K",
      ],
    },
    {
      name: "Đội tuyển Việt Nam mẫu",
      formation: "4-3-3",
      players: [
        "1. GK Đặng Văn Lâm",
        "2. RB Đoàn Văn Hậu",
        "3. LB Nguyễn Thành Chung",
        "4. CB Bùi Tiến Dũng",
        "5. CB Đỗ Duy Mạnh",
        "6. CDM Nguyễn Tuấn Anh",
        "7. RW Nguyễn Công Phượng",
        "8. CM Lương Xuân Trường",
        "9. ST Nguyễn Tiến Linh",
        "10. CAM Nguyễn Quang Hải",
        "11. LW Nguyễn Văn Toàn",
      ],
    },
  ];

  const sampleFormats = [
    "1. GK Nguyễn Văn A",
    "2. RB Trần Văn B 25 tuổi",
    "3. LB Lê Văn C (Việt Nam)",
    "4. CB Phạm Văn D - 28 - Brazil",
    "5 CB Hoàng Văn E",
    "Vũ Văn F - CDM - 26",
    "Đỗ Văn G RM",
  ];

  const parsePlayerText = (text) => {
    const lines = text.split("\n").filter((line) => line.trim());
    const players = [];
    const newErrors = [];

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      if (!trimmedLine) return;

      try {
        const player = parsePlayerLine(trimmedLine, index + 1);
        if (player) {
          players.push(player);
        }
      } catch (error) {
        newErrors.push(`Dòng ${index + 1}: ${error.message}`);
      }
    });

    setErrors(newErrors);
    return players;
  };

  const parsePlayerLine = (line, lineNumber) => {
    // Remove leading numbers and dots
    let cleanLine = line.replace(/^\d+\.?\s*/, "");

    // Common patterns to match
    const patterns = [
      // Pattern 1: Position Name (Country) Age
      /^(\w+)\s+(.+?)\s*\(([^)]+)\)\s*(\d+)?/,
      // Pattern 2: Position Name - Age - Country
      /^(\w+)\s+(.+?)\s*-\s*(\d+)\s*-\s*(.+)/,
      // Pattern 3: Name - Position - Age
      /^(.+?)\s*-\s*(\w+)\s*-\s*(\d+)/,
      // Pattern 4: Position Name Age
      /^(\w+)\s+(.+?)\s+(\d+)(?:\s+tuổi)?/,
      // Pattern 5: Position Name
      /^(\w+)\s+(.+)/,
      // Pattern 6: Name Position
      /^(.+?)\s+(\w+)$/,
    ];

    for (const pattern of patterns) {
      const match = cleanLine.match(pattern);
      if (match) {
        return extractPlayerData(match, cleanLine, lineNumber);
      }
    }

    // If no pattern matches, try simple space split
    const parts = cleanLine.split(/\s+/);
    if (parts.length >= 2) {
      return {
        number: lineNumber,
        position: parts[0].toUpperCase(),
        name: parts.slice(1).join(" "),
        age: null,
        nationality: "Việt Nam",
      };
    }

    throw new Error("Không thể phân tích định dạng");
  };

  const extractPlayerData = (match, line, lineNumber) => {
    const positions = [
      "GK",
      "CB",
      "LB",
      "RB",
      "LWB",
      "RWB",
      "CDM",
      "CM",
      "CAM",
      "LM",
      "RM",
      "LW",
      "RW",
      "CF",
      "ST",
    ];

    // Try to identify which parts are position, name, age, country
    let position = null;
    let name = null;
    let age = null;
    let nationality = "Việt Nam";

    // Look for position in the match
    for (let i = 1; i < match.length; i++) {
      if (positions.includes(match[i]?.toUpperCase())) {
        position = match[i].toUpperCase();
        break;
      }
    }

    // Look for age (number)
    for (let i = 1; i < match.length; i++) {
      const num = parseInt(match[i]);
      if (num && num >= 16 && num <= 50) {
        age = num;
        break;
      }
    }

    // Extract name (longest non-position, non-age, non-country text)
    const parts = line.split(/\s+/);
    const nameParts = parts.filter((part) => {
      const upper = part.toUpperCase();
      const num = parseInt(part);
      return (
        !positions.includes(upper) &&
        !(!isNaN(num) && num >= 16 && num <= 50) &&
        !["TUỔI", "YEARS", "OLD"].includes(upper) &&
        part !== "(" &&
        part !== ")" &&
        part !== "-"
      );
    });

    name = nameParts.join(" ").replace(/[()]/g, "").trim();

    // If we found country info in parentheses or after dash
    const countryMatch =
      line.match(/\(([^)]+)\)/) || line.match(/-\s*([A-Za-z\s]+)$/);
    if (countryMatch && !parseInt(countryMatch[1])) {
      nationality = countryMatch[1].trim();
    }

    // Default position if not found
    if (!position) {
      position = "CM";
    }

    // Validate required fields
    if (!name || name.length < 2) {
      throw new Error("Tên cầu thủ không hợp lệ");
    }

    return {
      number: lineNumber,
      position,
      name,
      age,
      nationality,
    };
  };

  const handleTextChange = (value) => {
    setPlayerText(value);
    if (value.trim()) {
      const players = parsePlayerText(value);
      setParsedPlayers(players);
    } else {
      setParsedPlayers([]);
      setErrors([]);
    }
  };

  const handleTemplateSelect = (template) => {
    const templateText = template.players.join("\n");
    setPlayerText(templateText);
    handleTextChange(templateText);
  };

  const handleSubmit = () => {
    if (parsedPlayers.length === 0) {
      setErrors(["Chưa có cầu thủ nào được phân tích"]);
      return;
    }

    if (errors.length > 0) {
      return;
    }

    onPlayersAdd(parsedPlayers);
  };

  const handleClear = () => {
    setPlayerText("");
    setParsedPlayers([]);
    setErrors([]);
  };

  return (
    <div className={`w-full max-w-4xl mx-auto ${className}`}>
      <div className="bg-white rounded-xl shadow-lg p-6">
        {/* Header */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Nhập nhanh danh sách cầu thủ
          </h3>
          <p className="text-gray-600 text-sm">
            Nhập danh sách cầu thủ theo nhiều định dạng khác nhau
          </p>
        </div>

        {/* Mode Selector */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-6 w-fit">
          <button
            onClick={() => setMode("text")}
            className={`px-4 py-2 text-sm font-medium rounded transition-colors ${
              mode === "text"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Nhập text
          </button>
          <button
            onClick={() => setMode("template")}
            className={`px-4 py-2 text-sm font-medium rounded transition-colors ${
              mode === "template"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Dùng mẫu có sẵn
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="space-y-4">
            {mode === "text" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Danh sách cầu thủ
                </label>
                <textarea
                  value={playerText}
                  onChange={(e) => handleTextChange(e.target.value)}
                  placeholder="Nhập danh sách cầu thủ (mỗi người một dòng)..."
                  className="w-full h-64 px-3 py-2 border border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 resize-none"
                />

                {/* Sample Formats */}
                <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                  <h4 className="text-sm font-medium text-blue-800 mb-2">
                    💡 Các định dạng hỗ trợ:
                  </h4>
                  <div className="text-xs text-blue-700 space-y-1">
                    {sampleFormats.map((format, index) => (
                      <div
                        key={index}
                        className="font-mono bg-blue-100 px-2 py-1 rounded"
                      >
                        {format}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {mode === "template" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chọn mẫu có sẵn
                </label>
                <div className="space-y-3">
                  {templates.map((template, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 cursor-pointer"
                      onClick={() => handleTemplateSelect(template)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-gray-900">
                          {template.name}
                        </h4>
                        <span className="text-sm text-gray-500">
                          {template.formation}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {template.players.length} cầu thủ
                      </div>
                    </div>
                  ))}
                </div>

                {playerText && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Danh sách đã chọn (có thể chỉnh sửa)
                    </label>
                    <textarea
                      value={playerText}
                      onChange={(e) => handleTextChange(e.target.value)}
                      className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 resize-none"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex space-x-3">
              <Button
                variant="primary"
                onClick={handleSubmit}
                disabled={parsedPlayers.length === 0 || errors.length > 0}
                className="flex-1"
              >
                Thêm {parsedPlayers.length} cầu thủ
              </Button>
              <Button
                variant="outline"
                onClick={handleClear}
                disabled={!playerText}
              >
                Xóa hết
              </Button>
            </div>

            {/* Errors */}
            {errors.length > 0 && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <h4 className="text-sm font-medium text-red-800 mb-1">
                  Có lỗi trong danh sách:
                </h4>
                <ul className="text-sm text-red-700 space-y-1">
                  {errors.map((error, index) => (
                    <li key={index} className="text-xs">
                      • {error}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Preview Section */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">
              Xem trước ({parsedPlayers.length}/{maxPlayers})
            </h4>

            {parsedPlayers.length > 0 ? (
              <div className="space-y-2 max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-3">
                {parsedPlayers.map((player, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg"
                  >
                    <div className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {player.number}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900">
                          {player.name}
                        </span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                          {player.position}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {player.age && `${player.age} tuổi`}
                        {player.age && player.nationality && " • "}
                        {player.nationality}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <svg
                  className="w-12 h-12 text-gray-400 mx-auto mb-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <p className="text-gray-500 text-sm">
                  Nhập danh sách để xem trước cầu thủ
                </p>
              </div>
            )}

            {/* Stats */}
            {parsedPlayers.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-3">
                <h5 className="text-sm font-medium text-gray-900 mb-2">
                  Thống kê nhanh:
                </h5>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="text-center">
                    <div className="font-semibold text-gray-900">
                      {parsedPlayers.filter((p) => p.age).length > 0
                        ? Math.round(
                            parsedPlayers
                              .filter((p) => p.age)
                              .reduce((sum, p) => sum + p.age, 0) /
                              parsedPlayers.filter((p) => p.age).length,
                          )
                        : "N/A"}
                    </div>
                    <div className="text-gray-500">Tuổi TB</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-gray-900">
                      {new Set(parsedPlayers.map((p) => p.nationality)).size}
                    </div>
                    <div className="text-gray-500">Quốc tịch</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickPlayerEntry;
