import React, { useState } from "react";
import Button from "../common/Button";
import Input from "../common/Input";
import Loading from "../common/Loading";

const MatchCodeInput = ({
  onMatchLoad,
  onCodeGenerate,
  loading = false,
  className = "",
}) => {
  const [matchCode, setMatchCode] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState("");
  const [recentCodes] = useState([
    { code: "VL2024-001", match: "Hà Nội FC vs TP.HCM", date: "2024-01-15" },
    { code: "VL2024-002", match: "HAGL vs SLNA", date: "2024-01-14" },
    {
      code: "VL2024-003",
      match: "Bình Dương vs Thanh Hóa",
      date: "2024-01-13",
    },
  ]);

  const validateMatchCode = (code) => {
    // Validate format: XXX####-### hoặc tương tự
    const codePattern = /^[A-Z]{2,4}\d{4}-\d{3}$/;
    return codePattern.test(code);
  };

  const handleCodeChange = (value) => {
    setMatchCode(value.toUpperCase());
    setError("");
  };

  const handleLoadMatch = async () => {
    if (!matchCode.trim()) {
      setError("Vui lòng nhập mã trận đấu");
      return;
    }

    if (!validateMatchCode(matchCode)) {
      setError("Mã trận đấu không đúng định dạng (VD: VL2024-001)");
      return;
    }

    setIsValidating(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock match data
      const matchData = {
        code: matchCode,
        homeTeam: { name: "Hà Nội FC", score: 1, logo: "/logos/hanoi.png" },
        awayTeam: { name: "TP.HCM", score: 2, logo: "/logos/tphcm.png" },
        league: "V-League 2024",
        stadium: "Sân Hàng Đẫy",
        date: "2024-01-15",
        time: "19:00",
        status: "live",
        period: "Hiệp 2",
        matchTime: "67:23",
      };

      onMatchLoad(matchData);
      setMatchCode("");
    } catch (error) {
      setError("Không tìm thấy trận đấu với mã này");
    } finally {
      setIsValidating(false);
    }
  };

  const handleGenerateCode = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");
    const random = Math.floor(Math.random() * 999)
      .toString()
      .padStart(3, "0");

    const newCode = `VL${year}-${month}${day}-${random}`;
    onCodeGenerate?.(newCode);
  };

  const handleRecentCodeSelect = (code) => {
    setMatchCode(code);
    setError("");
  };

  return (
    <div className={`w-full max-w-md mx-auto ${className}`}>
      <div className="bg-white rounded-xl shadow-lg p-6">
        {/* Header */}
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Tải trận đấu
          </h3>
          <p className="text-gray-600 text-sm">
            Nhập mã trận đấu để tải thông tin có sẵn
          </p>
        </div>

        {/* Code Input */}
        <div className="space-y-4">
          <Input
            label="Mã trận đấu"
            value={matchCode}
            onChange={(e) => handleCodeChange(e.target.value)}
            placeholder="VD: VL2024-001"
            error={error}
            icon={
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            }
            helperText="Định dạng: XXX####-### (VD: VL2024-001)"
          />

          <div className="flex space-x-2">
            <Button
              variant="primary"
              onClick={handleLoadMatch}
              disabled={!matchCode.trim() || isValidating}
              loading={isValidating}
              className="flex-1"
            >
              {isValidating ? "Đang tải..." : "Tải trận đấu"}
            </Button>
            <Button
              variant="outline"
              onClick={handleGenerateCode}
              icon={
                <svg
                  className="w-4 h-4"
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
              }
            >
              Tạo mã
            </Button>
          </div>
        </div>

        {/* Recent Codes */}
        {recentCodes.length > 0 && (
          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-900 mb-3">
              Trận đấu gần đây
            </h4>
            <div className="space-y-2">
              {recentCodes.map((item) => (
                <button
                  key={item.code}
                  onClick={() => handleRecentCodeSelect(item.code)}
                  className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="font-medium text-sm text-gray-900">
                        {item.code}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        {item.match}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">{item.date}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Code Format Help */}
        <div className="mt-6 p-3 bg-blue-50 rounded-lg">
          <h4 className="text-sm font-medium text-blue-800 mb-2">
            📝 Định dạng mã trận đấu:
          </h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>
              • <strong>VL2024-001:</strong> V-League 2024, trận thứ 1
            </li>
            <li>
              • <strong>CQG2024-015:</strong> Cúp Quốc gia 2024, trận thứ 15
            </li>
            <li>
              • <strong>AFC2024-008:</strong> AFC Champions League, trận thứ 8
            </li>
            <li>
              • <strong>CUSTOM-123:</strong> Trận đấu tự tổ chức
            </li>
          </ul>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="mt-4">
            <Loading size="md" text="Đang xử lý dữ liệu trận đấu..." />
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchCodeInput;
