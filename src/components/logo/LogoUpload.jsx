import React, { useState } from "react";
import FileUpload from "../common/FileUpload";
import Button from "../common/Button";
import Input from "../common/Input";
import Modal from "../common/Modal";

const LogoUpload = ({
  isOpen,
  onClose,
  onLogoUpload,
  teamType = "home", // 'home' or 'away'
  maxFileSize = 5 * 1024 * 1024, // 5MB
  className = "",
}) => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [logoInfo, setLogoInfo] = useState({
    teamName: "",
    category: "club",
    description: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState([]);

  const categories = [
    { id: "club", name: "Câu lạc bộ", icon: "🏟️" },
    { id: "national", name: "Đội tuyển quốc gia", icon: "🇻🇳" },
    { id: "league", name: "Giải đấu", icon: "🏆" },
    { id: "tournament", name: "Giải vô địch", icon: "🥇" },
    { id: "youth", name: "Đội trẻ", icon: "👶" },
    { id: "women", name: "Bóng đá nữ", icon: "👩" },
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

      // Auto-generate team name from filename
      if (!logoInfo.teamName) {
        const nameWithoutExt = file.name
          .replace(/\.[^/.]+$/, "")
          .replace(/[_-]/g, " ");
        setLogoInfo((prev) => ({
          ...prev,
          teamName: nameWithoutExt,
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
      newErrors.push("Vui lòng chọn file logo");
    }

    if (!logoInfo.teamName.trim()) {
      newErrors.push("Vui lòng nhập tên đội");
    }

    if (logoInfo.teamName.length > 50) {
      newErrors.push("Tên đội không được vượt quá 50 ký tự");
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsProcessing(true);
    try {
      const logoData = {
        file: uploadedFile,
        teamName: logoInfo.teamName.trim(),
        category: logoInfo.category,
        description: logoInfo.description.trim(),
        teamType,
        dimensions: await getImageDimensions(uploadedFile),
        size: uploadedFile.size,
        type: uploadedFile.type,
      };

      await onLogoUpload(logoData);
      handleClose();
    } catch (error) {
      setErrors(["Có lỗi xảy ra khi tải lên logo. Vui lòng thử lại."]);
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
    setLogoInfo({
      teamName: "",
      category: "club",
      description: "",
    });
    setErrors([]);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={`Tải lên logo ${teamType === "home" ? "đội nhà" : "đội khách"}`}
      size="md"
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
            {isProcessing ? "Đang tải lên..." : "Tải lên logo"}
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Chọn file logo
          </label>
          <FileUpload
            accept="image/*"
            maxSize={maxFileSize}
            onFileSelect={handleFileSelect}
            onError={handleUploadError}
            showPreview={false}
          >
            <div className="text-center py-6">
              <svg
                className="mx-auto h-12 w-12 text-gray-400 mb-3"
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
              <p className="text-base font-medium text-gray-700 mb-1">
                Chọn logo đội bóng
              </p>
              <p className="text-sm text-gray-500">
                PNG, JPG, SVG • Tối đa{" "}
                {(maxFileSize / (1024 * 1024)).toFixed(0)}MB
              </p>
            </div>
          </FileUpload>
        </div>

        {/* Preview và Form */}
        {uploadedFile && previewUrl && (
          <div className="space-y-4">
            {/* Logo Preview */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">Xem trước logo</h4>
              <div className="flex justify-center">
                <div className="relative">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-24 h-24 object-contain rounded-lg bg-white shadow-sm border"
                  />
                  {/* Different background previews */}
                  <div className="flex justify-center mt-3 space-x-2">
                    <div className="w-12 h-12 bg-white rounded border flex items-center justify-center">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-8 h-8 object-contain"
                      />
                    </div>
                    <div className="w-12 h-12 bg-gray-800 rounded flex items-center justify-center">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-8 h-8 object-contain"
                      />
                    </div>
                    <div className="w-12 h-12 bg-green-600 rounded flex items-center justify-center">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-8 h-8 object-contain"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Team Information */}
            <div className="space-y-4">
              <Input
                label="Tên đội"
                value={logoInfo.teamName}
                onChange={(e) =>
                  setLogoInfo((prev) => ({ ...prev, teamName: e.target.value }))
                }
                placeholder="Nhập tên đội bóng..."
                required
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Loại đội
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() =>
                        setLogoInfo((prev) => ({
                          ...prev,
                          category: category.id,
                        }))
                      }
                      className={`
                        p-3 rounded-lg border text-sm font-medium transition-colors
                        ${
                          logoInfo.category === category.id
                            ? "border-primary-500 bg-primary-50 text-primary-700"
                            : "border-gray-200 hover:border-gray-300"
                        }
                      `}
                    >
                      <span className="block text-base mb-1">
                        {category.icon}
                      </span>
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>

              <Input
                label="Mô tả (tùy chọn)"
                value={logoInfo.description}
                onChange={(e) =>
                  setLogoInfo((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Mô tả về đội bóng..."
                helperText="Thông tin thêm về đội bóng"
              />
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

        {/* Upload Tips */}
        <div className="bg-blue-50 rounded-lg p-3">
          <h4 className="text-sm font-medium text-blue-800 mb-2">
            💡 Gợi ý tải lên logo:
          </h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Sử dụng file PNG có nền trong suốt để hiệu ứng tốt nhất</li>
            <li>• Logo vuông (1:1) hoặc tròn sẽ hiển thị đẹp hơn</li>
            <li>• Độ phân giải tối thiểu: 256x256px</li>
            <li>• Tránh logo có chữ quá nhỏ</li>
          </ul>
        </div>
      </div>
    </Modal>
  );
};

export default LogoUpload;
