import React, { useState } from "react";
import FileUpload from "../common/FileUpload";
import Button from "../common/Button";
import Input from "../common/Input";
import Modal from "../common/Modal";

const BannerUpload = ({
  isOpen,
  onClose,
  onBannerUpload,
  maxFileSize = 10 * 1024 * 1024, // 10MB
  className = "",
}) => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [bannerInfo, setBannerInfo] = useState({
    name: "",
    type: "main",
    description: "",
    position: "top",
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState([]);

  const bannerTypes = [
    {
      id: "main",
      name: "Banner chính",
      icon: "🎯",
      description: "Banner chính cho trang livestream",
    },
    {
      id: "sponsor",
      name: "Banner nhà tài trợ",
      icon: "💼",
      description: "Hiển thị thông tin nhà tài trợ",
    },
    {
      id: "event",
      name: "Banner sự kiện",
      icon: "🎪",
      description: "Quảng cáo sự kiện đặc biệt",
    },
    {
      id: "match",
      name: "Banner trận đấu",
      icon: "⚽",
      description: "Thông tin cụ thể về trận đấu",
    },
    {
      id: "league",
      name: "Banner giải đấu",
      icon: "🏆",
      description: "Logo và thông tin giải đấu",
    },
    {
      id: "custom",
      name: "Banner tùy chỉnh",
      icon: "🎨",
      description: "Banner theo thiết kế riêng",
    },
  ];

  const positions = [
    { id: "top", name: "Trên cùng", description: "Hiển thị ở đầu trang" },
    { id: "bottom", name: "Dưới cùng", description: "Hiển thị ở cuối trang" },
    { id: "left", name: "Bên trái", description: "Thanh bên trái" },
    { id: "right", name: "Bên phải", description: "Thanh bên phải" },
    { id: "overlay", name: "Lớp phủ", description: "Hiển thị trên video" },
  ];

  const presetDimensions = [
    { name: "Banner ngang (1200x300)", width: 1200, height: 300 },
    { name: "Banner vuông (600x600)", width: 600, height: 600 },
    { name: "Banner dọc (300x800)", width: 300, height: 800 },
    { name: "Banner rộng (1920x400)", width: 1920, height: 400 },
    { name: "Banner nhỏ (800x200)", width: 800, height: 200 },
  ];

  const handleFileSelect = (files) => {
    if (files && files.length > 0) {
      const file = files[0];
      setUploadedFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target.result);
      };
      reader.readAsDataURL(file);

      // Auto-generate name from filename
      if (!bannerInfo.name) {
        const nameWithoutExt = file.name
          .replace(/\.[^/.]+$/, "")
          .replace(/[_-]/g, " ");
        setBannerInfo((prev) => ({
          ...prev,
          name: nameWithoutExt,
        }));
      }
    }
  };

  const handleUploadError = (errorMessages) => {
    setErrors(errorMessages);
  };

  const validateForm = () => {
    const newErrors = [];

    if (!uploadedFile) {
      newErrors.push("Vui lòng chọn file banner");
    }

    if (!bannerInfo.name.trim()) {
      newErrors.push("Vui lòng nhập tên banner");
    }

    if (bannerInfo.name.length > 100) {
      newErrors.push("Tên banner không được vượt quá 100 ký tự");
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsProcessing(true);
    try {
      const bannerData = {
        file: uploadedFile,
        name: bannerInfo.name.trim(),
        type: bannerInfo.type,
        description: bannerInfo.description.trim(),
        position: bannerInfo.position,
        dimensions: await getImageDimensions(uploadedFile),
        size: uploadedFile.size,
        fileType: uploadedFile.type,
      };

      await onBannerUpload(bannerData);
      handleClose();
    } catch (error) {
      setErrors(["Có lỗi xảy ra khi tải lên banner. Vui lòng thử lại."]);
    } finally {
      setIsProcessing(false);
    }
  };

  const getImageDimensions = (file) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve({
          width: img.naturalWidth,
          height: img.naturalHeight,
        });
      };
      img.src = URL.createObjectURL(file);
    });
  };

  const handleClose = () => {
    setUploadedFile(null);
    setPreviewUrl(null);
    setBannerInfo({
      name: "",
      type: "main",
      description: "",
      position: "top",
    });
    setErrors([]);
    onClose();
  };

  const getSuggestedDimensions = () => {
    switch (bannerInfo.position) {
      case "top":
      case "bottom":
        return "1200x300px (banner ngang)";
      case "left":
      case "right":
        return "300x800px (banner dọc)";
      case "overlay":
        return "800x200px (banner nhỏ)";
      default:
        return "1200x300px";
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Tải lên banner"
      size="lg"
      footer={
        <div className="flex justify-end space-x-3">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isProcessing}
          >
            Hủy
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={!uploadedFile || isProcessing}
            loading={isProcessing}
          >
            {isProcessing ? "Đang tải lên..." : "Tải lên banner"}
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Chọn file banner
          </label>
          <FileUpload
            accept="image/*"
            maxSize={maxFileSize}
            onFileSelect={handleFileSelect}
            onError={handleUploadError}
            showPreview={false}
          >
            <div className="text-center py-8">
              <svg
                className="mx-auto h-16 w-16 text-gray-400 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="text-lg font-medium text-gray-700 mb-2">
                Chọn hình ảnh banner
              </p>
              <p className="text-sm text-gray-500 mb-2">
                PNG, JPG, JPEG • Tối đa{" "}
                {(maxFileSize / (1024 * 1024)).toFixed(0)}MB
              </p>
              <p className="text-xs text-gray-400">
                Kích thước đề xuất: {getSuggestedDimensions()}
              </p>
            </div>
          </FileUpload>
        </div>

        {/* Preview và Form */}
        {uploadedFile && previewUrl && (
          <div className="space-y-6">
            {/* Banner Preview */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">
                Xem trước banner
              </h4>
              <div className="relative max-w-full mx-auto">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-auto rounded-lg shadow-md max-h-64 object-contain bg-white"
                />
                <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                  Banner {bannerInfo.position}
                </div>
              </div>
            </div>

            {/* Banner Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                <Input
                  label="Tên banner"
                  value={bannerInfo.name}
                  onChange={(e) =>
                    setBannerInfo((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Nhập tên banner..."
                  required
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Loại banner
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {bannerTypes.map((type) => (
                      <label
                        key={type.id}
                        className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                      >
                        <input
                          type="radio"
                          name="bannerType"
                          value={type.id}
                          checked={bannerInfo.type === type.id}
                          onChange={(e) =>
                            setBannerInfo((prev) => ({
                              ...prev,
                              type: e.target.value,
                            }))
                          }
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                        />
                        <div className="ml-3 flex-1">
                          <div className="flex items-center">
                            <span className="text-lg mr-2">{type.icon}</span>
                            <span className="font-medium text-sm">
                              {type.name}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {type.description}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vị trí hiển thị
                  </label>
                  <div className="space-y-2">
                    {positions.map((position) => (
                      <label
                        key={position.id}
                        className="flex items-center p-2 border rounded cursor-pointer hover:bg-gray-50"
                      >
                        <input
                          type="radio"
                          name="position"
                          value={position.id}
                          checked={bannerInfo.position === position.id}
                          onChange={(e) =>
                            setBannerInfo((prev) => ({
                              ...prev,
                              position: e.target.value,
                            }))
                          }
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                        />
                        <div className="ml-3">
                          <span className="font-medium text-sm">
                            {position.name}
                          </span>
                          <p className="text-xs text-gray-500">
                            {position.description}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <Input
                  label="Mô tả (tùy chọn)"
                  value={bannerInfo.description}
                  onChange={(e) =>
                    setBannerInfo((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Mô tả về banner..."
                  helperText="Thông tin thêm về banner này"
                />
              </div>
            </div>
          </div>
        )}

        {/* Error Display */}
        {errors.length > 0 && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex">
              <svg
                className="h-5 w-5 text-red-400 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="ml-3">
                <h4 className="text-sm font-medium text-red-800">
                  Có lỗi xảy ra:
                </h4>
                <ul className="text-sm text-red-700 mt-1 list-disc list-inside">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Design Tips */}
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-800 mb-2">
            💡 Gợi ý thiết kế banner:
          </h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Sử dụng màu sắc nổi bật để thu hút sự chú ý</li>
            <li>• Đảm bảo chữ đủ lớn để đọc được trên màn hình nhỏ</li>
            <li>• Tránh sử dụng quá nhiều thông tin trên một banner</li>
            <li>• Kiểm tra banner trên nền tối và nền sáng</li>
            <li>• Sử dụng logo và màu sắc thương hiệu nhất quán</li>
          </ul>
        </div>

        {/* Preset Dimensions */}
        {!uploadedFile && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">
              📐 Kích thước đề xuất:
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              {presetDimensions.map((preset, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-2 bg-white rounded border"
                >
                  <span className="text-gray-700">{preset.name}</span>
                  <span className="text-gray-500 text-xs">
                    {preset.width}×{preset.height}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default BannerUpload;
