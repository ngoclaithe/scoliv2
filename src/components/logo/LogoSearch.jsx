import React, { useState, useEffect } from "react";
import Input from "../common/Input";
import Button from "../common/Button";
import Loading from "../common/Loading";

const LogoSearch = ({ onLogoSelect, onClose, className = "" }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [popularLogos] = useState([
    {
      id: "vn_hcm",
      name: "TP.HCM",
      category: "v-league",
      url: "/logos/tphcm.png",
      description: "Câu lạc bộ bóng đá Thành phố Hồ Chí Minh",
    },
    {
      id: "vn_hanoi",
      name: "Hà Nội FC",
      category: "v-league",
      url: "/logos/hanoi.png",
      description: "Câu lạc bộ bóng đá Hà Nội",
    },
    {
      id: "vn_hagl",
      name: "HAGL",
      category: "v-league",
      url: "/logos/hagl.png",
      description: "Hoàng Anh Gia Lai",
    },
    {
      id: "vn_slna",
      name: "SLNA",
      category: "v-league",
      url: "/logos/slna.png",
      description: "Sông Lam Nghệ An",
    },
    {
      id: "vn_national",
      name: "Đội tuyển Việt Nam",
      category: "national",
      url: "/logos/vietnam.png",
      description: "Đội tuyển bóng đá quốc gia Việt Nam",
    },
    // International teams
    {
      id: "barcelona",
      name: "Barcelona",
      category: "international",
      url: "/logos/barcelona.png",
      description: "FC Barcelona",
    },
    {
      id: "real_madrid",
      name: "Real Madrid",
      category: "international",
      url: "/logos/real_madrid.png",
      description: "Real Madrid CF",
    },
    {
      id: "man_utd",
      name: "Manchester United",
      category: "international",
      url: "/logos/man_utd.png",
      description: "Manchester United FC",
    },
  ]);

  const categories = [
    { id: "all", name: "Tất cả", icon: "🏆" },
    { id: "v-league", name: "V-League", icon: "🇻🇳" },
    { id: "national", name: "Đội tuyển", icon: "🌏" },
    { id: "international", name: "Quốc tế", icon: "🌍" },
    { id: "youth", name: "Đội trẻ", icon: "👶" },
    { id: "women", name: "Bóng đá nữ", icon: "👩" },
  ];

  useEffect(() => {
    if (searchQuery.trim()) {
      performSearch(searchQuery);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, selectedCategory]);

  const performSearch = async (query) => {
    setLoading(true);
    try {
      // Simulate API search
      await new Promise((resolve) => setTimeout(resolve, 500));

      const filtered = popularLogos.filter((logo) => {
        const matchesQuery =
          logo.name.toLowerCase().includes(query.toLowerCase()) ||
          logo.description.toLowerCase().includes(query.toLowerCase());
        const matchesCategory =
          selectedCategory === "all" || logo.category === selectedCategory;
        return matchesQuery && matchesCategory;
      });

      setSearchResults(filtered);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogoSelect = (logo) => {
    onLogoSelect(logo);
  };

  const getDisplayLogos = () => {
    if (searchQuery.trim()) {
      return searchResults;
    }

    return popularLogos.filter(
      (logo) =>
        selectedCategory === "all" || logo.category === selectedCategory,
    );
  };

  const LogoCard = ({ logo }) => (
    <div
      onClick={() => handleLogoSelect(logo)}
      className="bg-white rounded-lg border border-gray-200 p-3 hover:shadow-md hover:border-primary-300 transition-all cursor-pointer group"
    >
      <div className="aspect-square bg-gray-50 rounded-lg mb-2 flex items-center justify-center overflow-hidden">
        {logo.url ? (
          <img
            src={logo.url}
            alt={logo.name}
            className="w-full h-full object-contain p-2 group-hover:scale-110 transition-transform"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "flex";
            }}
          />
        ) : null}
        <div className="w-full h-full bg-gray-100 rounded-lg items-center justify-center hidden">
          <span className="text-gray-400 font-bold text-lg">
            {logo.name.charAt(0)}
          </span>
        </div>
      </div>
      <h4 className="font-medium text-sm text-gray-900 truncate mb-1">
        {logo.name}
      </h4>
      <p className="text-xs text-gray-500 line-clamp-2">{logo.description}</p>

      {/* Category Badge */}
      <div className="mt-2">
        <span
          className={`
          inline-block px-2 py-1 text-xs rounded-full
          ${
            logo.category === "v-league"
              ? "bg-red-100 text-red-800"
              : logo.category === "national"
                ? "bg-blue-100 text-blue-800"
                : logo.category === "international"
                  ? "bg-purple-100 text-purple-800"
                  : "bg-gray-100 text-gray-800"
          }
        `}
        >
          {logo.category === "v-league"
            ? "V-League"
            : logo.category === "national"
              ? "Đội tuyển"
              : logo.category === "international"
                ? "Quốc tế"
                : logo.category}
        </span>
      </div>
    </div>
  );

  return (
    <div className={`w-full max-w-4xl mx-auto ${className}`}>
      <div className="bg-white rounded-xl shadow-lg p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              Tìm kiếm logo đội bóng
            </h3>
            <p className="text-gray-600 text-sm mt-1">
              Chọn logo từ thư viện có sẵn hoặc tìm kiếm theo tên đội
            </p>
          </div>
          {onClose && (
            <Button
              variant="outline"
              onClick={onClose}
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              }
            >
              Đóng
            </Button>
          )}
        </div>

        {/* Search Input */}
        <div className="mb-6">
          <Input
            placeholder="Tìm kiếm theo tên đội bóng..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            }
            rightIcon={
              searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-gray-400 hover:text-gray-600"
                >
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )
            }
          />
        </div>

        {/* Category Filter */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`
                  px-3 py-2 rounded-lg text-sm font-medium transition-colors
                  ${
                    selectedCategory === category.id
                      ? "bg-primary-100 text-primary-800 border border-primary-300"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }
                `}
              >
                <span className="mr-1">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="min-h-64">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loading size="lg" text="Đang tìm kiếm logo..." />
            </div>
          ) : (
            <>
              {/* Results Header */}
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium text-gray-900">
                  {searchQuery
                    ? `Kết quả tìm kiếm "${searchQuery}"`
                    : selectedCategory === "all"
                      ? "Logo phổ biến"
                      : `${categories.find((c) => c.id === selectedCategory)?.name}`}
                </h4>
                <span className="text-sm text-gray-500">
                  {getDisplayLogos().length} kết quả
                </span>
              </div>

              {/* Logo Grid */}
              {getDisplayLogos().length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {getDisplayLogos().map((logo) => (
                    <LogoCard key={logo.id} logo={logo} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <svg
                    className="w-16 h-16 text-gray-400 mx-auto mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    Không tìm thấy logo nào
                  </h4>
                  <p className="text-gray-500 mb-4">
                    {searchQuery
                      ? `Không có kết quả cho "${searchQuery}"`
                      : "Chưa có logo trong danh mục này"}
                  </p>
                  {searchQuery && (
                    <Button
                      variant="outline"
                      onClick={() => setSearchQuery("")}
                    >
                      Xóa tìm kiếm
                    </Button>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              className="flex-1"
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
              Yêu cầu thêm logo
            </Button>
            <Button
              variant="outline"
              className="flex-1"
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
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                  />
                </svg>
              }
            >
              Tải lên logo riêng
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoSearch;
