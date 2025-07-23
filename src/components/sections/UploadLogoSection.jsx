import React, { useState } from "react";
import Button from "../common/Button";
import Input from "../common/Input";
import { useAuth } from "../../contexts/AuthContext";

const UploadLogoSection = () => {
  const { isAuthenticated } = useAuth();
  
  // State cho upload logo và banner
  const [logoData, setLogoData] = useState(null);
  const [bannerData, setBannerData] = useState(null);
  const [logoName, setLogoName] = useState("");
  const [bannerName, setBannerName] = useState("");
  const [logoSearch, setLogoSearch] = useState("");

  const handleLogoUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setLogoData({
            file: file,
            preview: e.target.result,
            name: file.name
          });
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handleBannerUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setBannerData({
            file: file,
            preview: e.target.result,
            name: file.name
          });
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  return (
    <div className="p-2 sm:p-4 space-y-3">
      {/* Upload Section - Chỉ hiển thị khi đã đăng nhập */}
      {isAuthenticated && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3 border border-blue-200">
          <div className="flex items-center justify-center mb-2">
            <span className="text-sm">📁</span>
            <h3 className="text-xs font-bold text-gray-800 mx-2">UPLOAD</h3>
          </div>

          <div className="space-y-3">
            {/* Upload Buttons Row */}
            <div className="flex justify-center space-x-3">
              {/* Upload Logo */}
              <button
                onClick={handleLogoUpload}
                className="w-16 h-12 bg-gradient-to-br from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white rounded-lg flex flex-col items-center justify-center shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                <span className="text-lg mb-0.5">+</span>
                <span className="text-xs font-bold">LOGO</span>
              </button>

              {/* Upload Banner */}
              <button
                onClick={handleBannerUpload}
                className="w-16 h-12 bg-gradient-to-br from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white rounded-lg flex flex-col items-center justify-center shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                <span className="text-lg mb-0.5">+</span>
                <span className="text-xs font-bold">BANNER</span>
              </button>
            </div>

            {/* Preview and Name Input */}
            {(logoData || bannerData) && (
              <div className="bg-white rounded border border-gray-200 p-3">
                {logoData && (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <img
                        src={logoData.preview}
                        alt="Logo"
                        className="w-12 h-12 object-contain border rounded"
                      />
                      <div className="flex-1">
                        <div className="text-xs text-green-600 font-medium mb-1">📁 Logo</div>
                        <Input
                          placeholder="Nhập tên logo..."
                          value={logoName}
                          onChange={(e) => setLogoName(e.target.value)}
                          className="text-xs h-8"
                        />
                      </div>
                    </div>
                    {/* Upload Button cho Logo */}
                    {logoName.trim() && (
                      <div className="flex justify-center mt-2">
                        <Button
                          variant="primary"
                          size="sm"
                          className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold text-xs py-2 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200"
                          onClick={() => {
                            // Logic upload sẽ được thêm sau khi ghép API
                            console.log('Upload logo:', { name: logoName, file: logoData });
                            alert(`Sẽ upload logo "${logoName}" lên server!`);
                          }}
                        >
                          <span className="mr-1">☁️</span>
                          UPLOAD LOGO
                        </Button>
                      </div>
                    )}
                  </div>
                )}
                {bannerData && (
                  <div className="space-y-2 mt-3">
                    <div className="flex items-center space-x-3">
                      <img
                        src={bannerData.preview}
                        alt="Banner"
                        className="w-12 h-6 object-cover border rounded"
                      />
                      <div className="flex-1">
                        <div className="text-xs text-blue-600 font-medium mb-1">🖼️ Banner</div>
                        <Input
                          placeholder="Nhập tên banner..."
                          value={bannerName}
                          onChange={(e) => setBannerName(e.target.value)}
                          className="text-xs h-8"
                        />
                      </div>
                    </div>
                    {/* Upload Button cho Banner */}
                    {bannerName.trim() && (
                      <div className="flex justify-center mt-2">
                        <Button
                          variant="primary"
                          size="sm"
                          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold text-xs py-2 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200"
                          onClick={() => {
                            // Logic upload sẽ được thêm sau khi ghép API
                            console.log('Upload banner:', { name: bannerName, file: bannerData });
                            alert(`Sẽ upload banner "${bannerName}" lên server!`);
                          }}
                        >
                          <span className="mr-1">☁️</span>
                          UPLOAD BANNER
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Search Section - Luôn hiển thị */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-3 border border-green-200">
        <div className="flex items-center justify-center mb-2">
          <span className="text-sm">🔍</span>
          <h3 className="text-xs font-bold text-green-700 mx-2">TÌM KIẾM LOGO</h3>
        </div>
        <Input
          placeholder="Tìm theo tên đội..."
          value={logoSearch}
          onChange={(e) => setLogoSearch(e.target.value)}
          className="text-center text-sm h-8"
        />
      </div>

      {/* Help Section */}
      <div className="flex justify-center">
        <Button
          variant="secondary"
          size="sm"
          className="w-20 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-1 text-xs rounded-full shadow-lg transform hover:scale-105 transition-all duration-200"
          style={{ fontSize: '10px' }}
        >
          <span className="mr-1 text-xs">📚</span>
          HỖ TRỢ
        </Button>
      </div>
    </div>
  );
};

export default UploadLogoSection;
