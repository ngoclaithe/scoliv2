import React, { useState, useEffect } from "react";
import Button from "../common/Button";
import Input from "../common/Input";
import { useAuth } from "../../contexts/AuthContext";
import LogoAPI from "../../API/apiLogo";
import { toast } from "react-toastify";
import { getFullLogoUrl } from "../../utils/logoUtils";

const UploadLogoSection = () => {
  const { isAuthenticated } = useAuth();
  
  // State cho upload logo và banner
  const [logoData, setLogoData] = useState(null);
  const [bannerData, setBannerData] = useState(null);
  const [logoName, setLogoName] = useState("");
  const [bannerName, setBannerName] = useState("");
  const [logoSearch, setLogoSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  
  // State cho preview sau khi upload thành công - thay đổi thành array
  const [uploadedLogos, setUploadedLogos] = useState([]);
  const [uploadedBanners, setUploadedBanners] = useState([]);

  // State cho logo đã chọn từ search
  const [selectedLogo, setSelectedLogo] = useState(null);

  const handleLogoUpload = (uploadType) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
          toast.error("Kích thước file tối đa là 5MB");
          return;
        }
        
        // Validate file type
        const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!validTypes.includes(file.type)) {
          toast.error("Chỉ chấp nhận file ảnh (JPEG, PNG, GIF)");
          return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
          const data = {
            file: file,
            preview: e.target.result,
            name: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension
            type: uploadType
          };
          
          console.log('Đã chọn file:', { type: uploadType, data });
          
          if (uploadType === 'logo') {
            setLogoData(data);
            setLogoName(data.name);
          } else {
            setBannerData(data);
            setBannerName(data.name);
          }
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  // Handle logo upload
  const handleUpload = async (type) => {
    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập để tải lên");
      return;
    }

    const isLogo = type === 'logo';
    const data = isLogo ? logoData : bannerData;
    const name = isLogo ? logoName : bannerName;
    const uploadType = isLogo ? 'logo' : 'banner';

    console.log('Bắt đầu upload:', { type, uploadType, data, name });

    if (!data || !name.trim()) {
      const errorMsg = `Vui lòng nhập tên cho ${isLogo ? 'logo' : 'banner'}`;
      console.error('Lỗi upload:', errorMsg);
      toast.error(errorMsg);
      return;
    }

    try {
      setIsUploading(true);
      console.log('Đang gửi yêu cầu upload...');
      
      const response = await LogoAPI.uploadLogo(
        data.file, 
        uploadType,
        name.trim()
      );
      
      console.log('Upload thành công:', { 
        type: uploadType, 
        response,
        fileInfo: {
          name: data.file.name,
          size: data.file.size,
          type: data.file.type
        }
      });
      
      // Xử lý response trả về
      if (response && response.data) {
        const uploadResult = {
          id: response.data.id,
          code_logo: response.data.code_logo,
          url_logo: response.data.url_logo || response.data.public_url,
          type: response.data.type_logo || uploadType,
          created_at: response.data.created_at,
          timestamp: Date.now() // Thêm timestamp để tạo key unique
        };

        if (isLogo) {
          setUploadedLogos(prev => [uploadResult, ...prev]);
          // Clear form sau khi upload thành công
          setLogoData(null);
          setLogoName("");
        } else {
          setUploadedBanners(prev => [uploadResult, ...prev]);
          // Clear form sau khi upload thành công
          setBannerData(null);
          setBannerName("");
        }
        
        toast.success(`Tải lên ${type === 'logo' ? 'logo' : 'banner'} thành công! Mã: ${uploadResult.code_logo}`);
      } else {
        throw new Error('Response không hợp lệ');
      }
      
    } catch (error) {
      console.error(`Error uploading ${type}:`, error);
      toast.error(`Lỗi khi tải lên: ${error.message || 'Có lỗi xảy ra'}`);
    } finally {
      setIsUploading(false);
    }
  };

  // Handle logo search
  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      if (logoSearch.trim()) {
        try {
          setIsSearching(true);
          const response = await LogoAPI.searchLogosByCode(logoSearch.trim(), false);
          
          // Handle empty response gracefully
          if (response && response.data && Array.isArray(response.data)) {
            setSearchResults(response.data);
          } else {
            setSearchResults([]);
          }
        } catch (error) {
          console.error('Search error:', error);
          // Handle different types of errors
          if (error.response && error.response.status === 404) {
            // 404 không phải lỗi, chỉ là không tìm thấy
            setSearchResults([]);
          } else {
            // Các lỗi khác mới hiển thị toast
            toast.error(`Lỗi tìm kiếm: ${error.message || 'Có lỗi xảy ra'}`);
            setSearchResults([]);
          }
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
        // Không clear selectedLogo khi xóa search
      }
    }, 500);

    return () => clearTimeout(searchTimeout);
  }, [logoSearch]);

  // Handle logo selection from search results
  const handleSelectLogo = (logo) => {
    setSelectedLogo({
      id: logo.id,
      code_logo: logo.code_logo,
      url_logo: logo.url_logo,
      type_logo: logo.type_logo,
      created_at: logo.created_at
    });
    setSearchResults([]);
    // Không clear logoSearch để user biết đã search gì
    toast.success(`Đã chọn ${logo.type_logo === 'banner' ? 'banner' : 'logo'}: ${logo.code_logo}`);
  };

  // Component hiển thị kết quả search với preview
  const SearchResultItem = ({ logo, onSelect }) => {
    return (
      <div 
        onClick={() => onSelect(logo)}
        className="bg-white rounded-lg border border-gray-300 p-2 shadow-sm cursor-pointer hover:shadow-md transition-all duration-200 w-20 flex-shrink-0 hover:border-green-400"
      >
        <div className="text-center">
          {/* Preview image */}
          <div className="flex justify-center mb-1">
            <div className="w-10 h-10 rounded border border-gray-200 overflow-hidden bg-gray-50">
              <img
                src={getFullLogoUrl(logo.url_logo) || logo.url_logo}
                alt={logo.code_logo}
                className="w-full h-full object-contain hover:scale-110 transition-transform duration-200"
              />
            </div>
          </div>
          
          {/* Logo code */}
          <div className="text-xs text-gray-700 font-medium truncate" title={logo.code_logo}>
            {logo.code_logo}
          </div>
          
          {/* Type indicator */}
          <div className="text-xs text-gray-500 mt-0.5">
            {logo.type_logo === 'banner' ? '🖼️' : '📁'}
          </div>
        </div>
      </div>
    );
  };

  // Component hiển thị logo đã chọn từ search
  const SelectedLogoDisplay = ({ logo, onClear }) => {
    if (!logo) return null;

    return (
      <div className="bg-white rounded-lg border-2 border-green-400 p-3 shadow-lg relative">
        {/* Nút xóa */}
        <button
          onClick={onClear}
          className="absolute top-2 right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 transition-colors flex items-center justify-center"
          title="Xóa lựa chọn"
        >
          ×
        </button>
        
        <div className="text-center">
          <div className="text-sm font-bold text-green-600 mb-2">
            ✅ Đã chọn {logo.type_logo === 'banner' ? 'Banner' : 'Logo'}
          </div>
          
          {/* Preview image lớn hơn */}
          <div className="flex justify-center mb-3">
            <div className="w-20 h-20 rounded border-2 border-green-400 overflow-hidden bg-gray-50 shadow-md">
              <img
                src={getFullLogoUrl(logo.url_logo) || logo.url_logo}
                alt={logo.code_logo}
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          
          {/* Thông tin chi tiết */}
          <div className="space-y-2">
            <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded p-2">
              <div className="text-xs text-gray-600 mb-1">Mã {logo.type_logo === 'banner' ? 'Banner' : 'Logo'}:</div>
              <div className="text-sm font-bold text-green-700 bg-white rounded px-2 py-1">
                {logo.code_logo}
              </div>
            </div>
            
            <div className="text-xs text-gray-500">
              {logo.type_logo === 'banner' ? '🖼️ Banner' : '📁 Logo'} • 
              ID: {logo.id}
            </div>
            
            {/* Nút sao chép mã */}
            <button
              onClick={() => {
                navigator.clipboard.writeText(logo.code_logo);
                toast.success('Đã sao chép mã!');
              }}
              className="w-full px-3 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors font-medium"
            >
              📋 Sao chép mã
            </button>
            
            {/* Nút mở ảnh trong tab mới */}
            <button
              onClick={() => window.open(getFullLogoUrl(logo.url_logo) || logo.url_logo, '_blank')}
              className="w-full px-3 py-2 bg-gray-500 text-white text-sm rounded hover:bg-gray-600 transition-colors font-medium"
            >
              🔗 Xem ảnh gốc
            </button>
          </div>
        </div>
      </div>
    );
  };

  const UploadResult = ({ result, type, onRemove }) => {
    if (!result) return null;

    return (
      <div className="bg-white rounded-lg border-2 border-green-300 p-2 shadow-lg relative w-24 flex-shrink-0">
        {/* Nút xóa */}
        <button
          onClick={() => onRemove(result.timestamp)}
          className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 transition-colors flex items-center justify-center"
          title="Xóa"
          style={{ fontSize: '10px', lineHeight: '1' }}
        >
          ×
        </button>
        
        <div className="text-center">
          <div className="text-xs font-bold text-green-600 mb-1">
            {type === 'logo' ? '📁' : '🖼️'}
          </div>
          
          {/* Preview image với hiệu ứng 3D xoay 360 độ */}
          <div className="flex justify-center mb-2">
            <div className="relative w-12 h-12" style={{ perspective: '100px' }}>
              <div
                className="w-full h-full rounded-full border-2 border-green-400 overflow-hidden shadow-lg relative animate-spin"
                style={{
                  animationDuration: '3s',
                  transformStyle: 'preserve-3d'
                }}
              >
                <img
                  src={getFullLogoUrl(result.url_logo) || result.url_logo}
                  alt={result.code_logo}
                  className="w-full h-full object-contain bg-white"
                  style={{
                    backfaceVisibility: 'hidden'
                  }}
                />
                {/* Mặt sau của hình ảnh */}
                <div 
                  className="absolute inset-0 bg-gradient-to-br from-green-400 to-blue-400 rounded-full flex items-center justify-center"
                  style={{
                    transform: 'rotateY(180deg)',
                    backfaceVisibility: 'hidden'
                  }}
                >
                  <span className="text-white text-xs font-bold">
                    {type === 'logo' ? '📁' : '🖼️'}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Thông tin code_logo */}
          <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded p-1 mb-1">
            <div className="text-xs text-green-700 bg-white rounded px-1 py-0.5 font-bold truncate">
              {result.code_logo}
            </div>
          </div>
          
          {/* Nút sao chép mã */}
          <button
            onClick={() => {
              navigator.clipboard.writeText(result.code_logo);
              toast.success('Đã sao chép!');
            }}
            className="w-full px-1 py-0.5 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors"
            style={{ fontSize: '10px' }}
          >
            📋 Copy
          </button>
        </div>
        

      </div>
    );
  };

  // Function để xóa uploaded result
  const removeUploadedResult = (timestamp, type) => {
    if (type === 'logo') {
      setUploadedLogos(prev => prev.filter(item => item.timestamp !== timestamp));
    } else {
      setUploadedBanners(prev => prev.filter(item => item.timestamp !== timestamp));
    }
  };

  // Function để xóa logo đã chọn
  const clearSelectedLogo = () => {
    setSelectedLogo(null);
    toast.info('Đã xóa lựa chọn');
  };

  return (
    <div className="p-2 sm:p-4 space-y-2">
      <style dangerouslySetInnerHTML={{
        __html: `
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `
      }} />

      {/* Hiển thị logo đã chọn từ search */}
      {selectedLogo && (
        <div className="mb-3">
          <SelectedLogoDisplay 
            logo={selectedLogo} 
            onClear={clearSelectedLogo}
          />
        </div>
      )}

      {/* Hiển thị kết quả upload thành công - Horizontal scroll cho mobile */}
      {(uploadedLogos.length > 0 || uploadedBanners.length > 0) && (
        <div className="mb-2">
          <div className="flex items-center justify-between mb-1 px-1">
            <div className="text-xs font-bold text-green-600">
              📂 Đã tải lên ({uploadedLogos.length + uploadedBanners.length})
            </div>
            <div className="text-xs text-gray-500">← Vuốt để xem →</div>
          </div>
          <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {uploadedLogos.map((logo) => (
              <div key={`logo-${logo.timestamp}`} className="flex-shrink-0">
                <UploadResult 
                  result={logo} 
                  type="logo" 
                  onRemove={(timestamp) => removeUploadedResult(timestamp, 'logo')}
                />
              </div>
            ))}
            {uploadedBanners.map((banner) => (
              <div key={`banner-${banner.timestamp}`} className="flex-shrink-0">
                <UploadResult 
                  result={banner} 
                  type="banner" 
                  onRemove={(timestamp) => removeUploadedResult(timestamp, 'banner')}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Section - Chỉ hiển thị khi đã đăng nhập */}
      {isAuthenticated && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3 border border-blue-200">
          <div className="flex items-center justify-between mb-2 px-2">
            <div className="flex items-center">
              <span className="text-sm">📁</span>
              <h3 className="text-xs font-bold text-gray-800 mx-2">UPLOAD</h3>
            </div>
            {isUploading && (
              <div className="flex items-center text-xs text-blue-600">
                <div className="animate-spin rounded-full h-3 w-3 border-t-2 border-b-2 border-blue-600 mr-1"></div>
                Đang tải lên...
              </div>
            )}
          </div>

          <div className="space-y-3">
            {/* Upload Buttons Row */}
            <div className="flex justify-center space-x-3">
              {/* Upload Logo */}
              <button
                onClick={() => handleLogoUpload('logo')}
                disabled={isUploading}
                className={`w-16 h-12 ${isUploading ? 'bg-gray-400' : 'bg-gradient-to-br from-green-400 to-green-600 hover:from-green-500 hover:to-green-700'} text-white rounded-lg flex flex-col items-center justify-center shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200`}
              >
                <span className="text-lg mb-0.5">+</span>
                <span className="text-xs font-bold">LOGO</span>
              </button>

              {/* Upload Banner */}
              <button
                onClick={() => handleLogoUpload('banner')}
                disabled={isUploading}
                className={`w-16 h-12 ${isUploading ? 'bg-gray-400' : 'bg-gradient-to-br from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700'} text-white rounded-lg flex flex-col items-center justify-center shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200`}
              >
                <span className="text-lg mb-0.5">+</span>
                <span className="text-xs font-bold">BANNER</span>
              </button>
            </div>

            {/* Preview and Name Input for Logo */}
            {logoData && logoData.type === 'logo' && (
              <div className="bg-white rounded border border-gray-200 p-3">
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <div className="relative w-12 h-12 border rounded overflow-hidden">
                      <img
                        src={logoData.preview}
                        alt="Logo"
                        className={`w-full h-full object-contain ${isUploading ? 'opacity-50' : ''}`}
                      />
                      {isUploading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-green-600 font-medium mb-1">📁 Logo</div>
                      <Input
                        placeholder="Nhập tên logo..."
                        value={logoName}
                        onChange={(e) => setLogoName(e.target.value)}
                        className="text-xs h-8"
                        disabled={isUploading}
                      />
                    </div>
                  </div>
                  
                  {/* Upload Button cho Logo */}
                  {logoName.trim() && (
                    <div className="flex justify-center mt-2">
                      <Button
                        variant="primary"
                        size="sm"
                        className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold text-xs py-2 px-4 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200"
                        onClick={() => handleUpload('logo')}
                        disabled={isUploading}
                      >
                        {isUploading ? (
                          <>
                            <div className="animate-spin rounded-full h-3 w-3 border-t-2 border-b-2 border-white mr-1"></div>
                            Đang tải lên...
                          </>
                        ) : (
                          <>
                            <span className="mr-1">☁️</span>
                            UPLOAD LOGO
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Preview and Name Input for Banner */}
            {bannerData && bannerData.type === 'banner' && (
              <div className="bg-white rounded border border-gray-200 p-3">
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <div className="relative w-12 h-12 border rounded overflow-hidden">
                      <img
                        src={bannerData.preview}
                        alt="Banner"
                        className={`w-full h-full object-cover ${isUploading ? 'opacity-50' : ''}`}
                      />
                      {isUploading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-blue-600 font-medium mb-1">🖼️ Banner</div>
                      <Input
                        placeholder="Nhập tên banner..."
                        value={bannerName}
                        onChange={(e) => setBannerName(e.target.value)}
                        className="text-xs h-8"
                        disabled={isUploading}
                      />
                    </div>
                  </div>
                  
                  {/* Upload Button cho Banner */}
                  {bannerName.trim() && (
                    <div className="flex justify-center mt-2">
                      <Button
                        variant="primary"
                        size="sm"
                        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold text-xs py-2 px-4 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200"
                        onClick={() => handleUpload('banner')}
                        disabled={isUploading}
                      >
                        {isUploading ? (
                          <>
                            <div className="animate-spin rounded-full h-3 w-3 border-t-2 border-b-2 border-white mr-1"></div>
                            Đang tải lên...
                          </>
                        ) : (
                          <>
                            <span className="mr-1">☁️</span>
                            UPLOAD BANNER
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
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
          disabled={isSearching}
        />
        
        {/* Search Results với preview */}
        {isSearching && (
          <div className="mt-2 text-center">
            <div className="inline-flex items-center text-sm text-gray-500">
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-green-500 mr-2"></div>
              Đang tìm kiếm...
            </div>
          </div>
        )}
        
        {!isSearching && searchResults.length > 0 && (
          <div className="mt-2">
            <div className="flex items-center justify-between mb-1 px-1">
              <div className="text-xs font-medium text-green-600">
                🔍 Kết quả ({searchResults.length})
              </div>
              <div className="text-xs text-gray-500">← Vuốt để xem →</div>
            </div>
            <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
              {searchResults.map((logo) => (
                <SearchResultItem
                  key={logo.id}
                  logo={logo}
                  onSelect={handleSelectLogo}
                />
              ))}
            </div>
          </div>
        )}
        
        {!isSearching && searchResults.length === 0 && logoSearch.trim() && (
          <div className="mt-2 text-xs text-gray-500 text-center">
            🚫 Không tìm thấy kết quả cho "{logoSearch}"
          </div>
        )}
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
