import React, { useState } from "react";
import Button from "../common/Button";
import Input from "../common/Input";

const PlayerInput = ({
  player = {},
  onPlayerSave,
  onCancel,
  availableNumbers = [],
  className = "",
}) => {
  const [playerData, setPlayerData] = useState({
    name: "",
    number: "",
    position: "CM",
    age: "",
    nationality: "Việt Nam",
    height: "",
    weight: "",
    preferredFoot: "right",
    ...player,
  });

  const [errors, setErrors] = useState({});

  const positions = [
    { value: "GK", label: "Thủ môn (GK)" },
    { value: "CB", label: "Trung vệ (CB)" },
    { value: "LB", label: "Hậu vệ trái (LB)" },
    { value: "RB", label: "H��u vệ phải (RB)" },
    { value: "LWB", label: "Hậu vệ biên trái (LWB)" },
    { value: "RWB", label: "Hậu vệ biên phải (RWB)" },
    { value: "CDM", label: "Tiền vệ phòng ngự (CDM)" },
    { value: "CM", label: "Tiền vệ trung tâm (CM)" },
    { value: "CAM", label: "Tiền vệ tấn công (CAM)" },
    { value: "LM", label: "Tiền vệ trái (LM)" },
    { value: "RM", label: "Tiền vệ phải (RM)" },
    { value: "LW", label: "Cánh trái (LW)" },
    { value: "RW", label: "Cánh phải (RW)" },
    { value: "CF", label: "Tiền đạo lùi (CF)" },
    { value: "ST", label: "Tiền đạo (ST)" },
  ];

  const countries = [
    "Việt Nam",
    "Brazil",
    "Argentina",
    "Tây Ban Nha",
    "Pháp",
    "Đức",
    "Italia",
    "Bồ Đào Nha",
    "Hà Lan",
    "Bỉ",
    "Anh",
    "Colombia",
    "Uruguay",
    "Croatia",
    "Serbia",
    "Nigeria",
    "Ghana",
    "Senegal",
    "Maroc",
    "Ai Cập",
    "Nhật Bản",
    "Hàn Quốc",
    "Australia",
    "Mỹ",
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!playerData.name.trim()) {
      newErrors.name = "Tên cầu thủ là bắt buộc";
    } else if (playerData.name.length < 2) {
      newErrors.name = "Tên cầu thủ phải có ít nhất 2 ký tự";
    }

    if (!playerData.number) {
      newErrors.number = "Số áo là bắt buộc";
    } else if (playerData.number < 1 || playerData.number > 99) {
      newErrors.number = "Số áo phải từ 1 đến 99";
    } else if (
      availableNumbers.length > 0 &&
      !availableNumbers.includes(playerData.number)
    ) {
      newErrors.number = "Số áo này đã được sử dụng";
    }

    if (playerData.age && (playerData.age < 16 || playerData.age > 50)) {
      newErrors.age = "Tuổi phải từ 16 đến 50";
    }

    if (
      playerData.height &&
      (playerData.height < 150 || playerData.height > 220)
    ) {
      newErrors.height = "Chiều cao phải từ 150cm đến 220cm";
    }

    if (
      playerData.weight &&
      (playerData.weight < 50 || playerData.weight > 120)
    ) {
      newErrors.weight = "Cân nặng phải từ 50kg đến 120kg";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field, value) => {
    setPlayerData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: null,
      }));
    }
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onPlayerSave(playerData);
    }
  };

  const getPositionColor = (position) => {
    if (position === "GK") return "bg-yellow-100 text-yellow-800";
    if (["CB", "LB", "RB", "LWB", "RWB"].includes(position))
      return "bg-blue-100 text-blue-800";
    if (["CDM", "CM", "CAM", "LM", "RM"].includes(position))
      return "bg-green-100 text-green-800";
    if (["LW", "RW", "CF", "ST"].includes(position))
      return "bg-red-100 text-red-800";
    return "bg-gray-100 text-gray-800";
  };

  return (
    <div className={`w-full max-w-2xl mx-auto ${className}`}>
      <div className="bg-white rounded-xl shadow-lg p-6">
        {/* Header */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {player.id ? "Chỉnh sửa cầu thủ" : "Thêm cầu thủ mới"}
          </h3>
          <p className="text-gray-600 text-sm">
            Điền thông tin chi tiết về cầu thủ
          </p>
        </div>

        {/* Form */}
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Tên cầu thủ"
              value={playerData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Nhập tên đầy đủ..."
              error={errors.name}
              required
            />

            <Input
              label="Số áo"
              type="number"
              value={playerData.number}
              onChange={(e) =>
                handleChange("number", parseInt(e.target.value) || "")
              }
              placeholder="1-99"
              error={errors.number}
              min="1"
              max="99"
              required
            />
          </div>

          {/* Position */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vị trí chơi <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {positions.map((pos) => (
                <button
                  key={pos.value}
                  onClick={() => handleChange("position", pos.value)}
                  className={`
                    p-3 text-sm rounded-lg border transition-colors text-left
                    ${
                      playerData.position === pos.value
                        ? "border-primary-500 bg-primary-50 text-primary-800"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }
                  `}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{pos.value}</span>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${getPositionColor(pos.value)}`}
                    >
                      {pos.value === "GK"
                        ? "GK"
                        : ["CB", "LB", "RB", "LWB", "RWB"].includes(pos.value)
                          ? "DF"
                          : ["CDM", "CM", "CAM", "LM", "RM"].includes(pos.value)
                            ? "MF"
                            : "FW"}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {pos.label.split("(")[0].trim()}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Personal Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Tuổi"
              type="number"
              value={playerData.age}
              onChange={(e) =>
                handleChange("age", parseInt(e.target.value) || "")
              }
              placeholder="Tuổi"
              error={errors.age}
              min="16"
              max="50"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quốc tịch
              </label>
              <select
                value={playerData.nationality}
                onChange={(e) => handleChange("nationality", e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Physical Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Chiều cao (cm)"
              type="number"
              value={playerData.height}
              onChange={(e) =>
                handleChange("height", parseInt(e.target.value) || "")
              }
              placeholder="170"
              error={errors.height}
              min="150"
              max="220"
            />

            <Input
              label="Cân nặng (kg)"
              type="number"
              value={playerData.weight}
              onChange={(e) =>
                handleChange("weight", parseInt(e.target.value) || "")
              }
              placeholder="70"
              error={errors.weight}
              min="50"
              max="120"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chân thuận
              </label>
              <select
                value={playerData.preferredFoot}
                onChange={(e) => handleChange("preferredFoot", e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="right">Chân phải</option>
                <option value="left">Chân trái</option>
                <option value="both">Cả hai chân</option>
              </select>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">Xem trước</h4>
            <div className="flex items-center space-x-4">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                  getPositionColor(playerData.position).includes("yellow")
                    ? "bg-yellow-500"
                    : getPositionColor(playerData.position).includes("blue")
                      ? "bg-blue-500"
                      : getPositionColor(playerData.position).includes("green")
                        ? "bg-green-500"
                        : getPositionColor(playerData.position).includes("red")
                          ? "bg-red-500"
                          : "bg-gray-500"
                }`}
              >
                {playerData.number || "?"}
              </div>
              <div className="flex-1">
                <div className="font-semibold text-gray-900">
                  {playerData.name || "Tên cầu thủ"}
                </div>
                <div className="text-sm text-gray-600">
                  {positions.find((p) => p.value === playerData.position)
                    ?.label || "Vị trí"}
                </div>
                <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                  {playerData.age && <span>🎂 {playerData.age} tuổi</span>}
                  {playerData.nationality && (
                    <span>🌍 {playerData.nationality}</span>
                  )}
                  {playerData.height && <span>📏 {playerData.height}cm</span>}
                  {playerData.weight && <span>⚖️ {playerData.weight}kg</span>}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
          <Button variant="outline" onClick={onCancel}>
            Hủy
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {player.id ? "Cập nhật" : "Thêm cầu thủ"}
          </Button>
        </div>

        {/* Tips */}
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <h4 className="text-sm font-medium text-blue-800 mb-1">💡 Gợi ý:</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Số áo từ 1-11 thường dành cho đội hình chính</li>
            <li>• Số 1 thường dành cho thủ môn chính</li>
            <li>• Vị trí GK, DF, MF, FW sẽ có màu sắc khác nhau trên sân</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PlayerInput;
