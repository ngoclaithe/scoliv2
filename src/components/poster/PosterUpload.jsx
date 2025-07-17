import React, { useState, useRef } from "react";
import FileUpload from "../common/FileUpload";
import Button from "../common/Button";
import Input from "../common/Input";
import Modal from "../common/Modal";
import Toast from "../common/Toast";

const PosterUpload = ({
  onPosterUpload,
  onCancel,
  maxFileSize = 10 * 1024 * 1024, // 10MB
  acceptedFormats = "image/*",
  className = "",
}) => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [posterInfo, setPosterInfo] = useState({
    name: "",
    category: "custom",
    description: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCropModal, setShowCropModal] = useState(false);
  const [errors, setErrors] = useState([]);
  const fileInputRef = useRef(null);

  const categories = [
    { id: "custom", name: "Tùy chỉnh", icon: "🎨" },
    { id: "match", name: "Trận đấu", icon: "⚽" },
    { id: "lineup", name: "Đội hình", icon: "👥" },
    { id: "intro", name: "Giới thiệu", icon: "🎬" },
    { id: "halftime", name: "Giải lao", icon: "⏰" },
    { id: "celebration", name: "Ăn mừng", icon: "🎉" },
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
      if (!posterInfo.name) {
        const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
        setPosterInfo((prev) => ({
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
      newErrors.push("Vui lòng chọn một tệp hình ảnh");
    }

    if (!posterInfo.name.trim()) {
      newErrors.push("Vui lòng nhập tên poster");
    }

    if (posterInfo.name.length > 100) {
      newErrors.push("Tên poster không được vượt quá 100 ký tự");
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsProcessing(true);
    try {
      const posterData = {
        file: uploadedFile,
        name: posterInfo.name.trim(),
        category: posterInfo.category,
        description: posterInfo.description.trim(),
        dimensions: await getImageDimensions(uploadedFile),
        size: uploadedFile.size,
        type: uploadedFile.type,
      };

      await onPosterUpload(posterData);
    } catch (error) {
      setErrors(["Có lỗi xảy ra khi tải lên poster. Vui lòng thử lại."]);
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

  const clearUpload = () => {
    setUploadedFile(null);
    setPreviewUrl(null);
    setPosterInfo({
      name: "",
      category: "custom",
      description: "",
    });
    setErrors([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={`w-full max-w-2xl mx-auto ${className}`}>
      <div className="bg-white rounded-xl shadow-lg p-6">
        {/* Header */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Tải lên poster tùy chỉnh
          </h3>
          <p className="text-gray-600 text-sm">
            Tải lên hình ảnh của bạn để tạo poster tùy chỉnh cho livestream
          </p>
        </div>

        {/* File Upload */}
        <div className="mb-6">
          <FileUpload
            ref={fileInputRef}
            accept={acceptedFormats}
            maxSize={maxFileSize}
            onFileSelect={handleFileSelect}
            onError={handleUploadError}
            showPreview={false}
            className="mb-4"
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
                Kéo thả hoặc nhấp để chọn hình ảnh
              </p>
              <p className="text-sm text-gray-500">
                Hỗ trợ: PNG, JPG, JPEG • Tối đa:{" "}
                {(maxFileSize / (1024 * 1024)).toFixed(0)}MB
              </p>
            </div>
          </FileUpload>
        </div>

        {/* Preview và Form */}
        {uploadedFile && previewUrl && (
          <div className="space-y-6">
            {/* Image Preview */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">Xem trước</h4>
              <div className="relative max-w-md mx-auto">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-auto rounded-lg shadow-md"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearUpload}
                  className="absolute top-2 right-2 bg-white"
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
                </Button>
              </div>
            </div>

            {/* Poster Information */}
            <div className="space-y-4">
              <Input
                label="Tên poster"
                value={posterInfo.name}
                onChange={(e) =>
                  setPosterInfo((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Nhập tên poster..."
                required
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Danh mục
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() =>
                        setPosterInfo((prev) => ({
                          ...prev,
                          category: category.id,
                        }))
                      }
                      className={`
                        p-3 rounded-lg border text-sm font-medium transition-colors
                        ${
                          posterInfo.category === category.id
                            ? "border-primary-500 bg-primary-50 text-primary-700"
                            : "border-gray-200 hover:border-gray-300"
                        }
                      `}
                    >
                      <span className="block text-lg mb-1">
                        {category.icon}
                      </span>
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>

              <Input
                label="Mô tả (tùy chọn)"
                value={posterInfo.description}
                onChange={(e) =>
                  setPosterInfo((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Mô tả poster..."
                helperText="Mô tả ngắn về poster này"
              />
            </div>
          </div>
        )}

        {/* Error Display */}
        {errors.length > 0 && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
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

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
          <Button variant="outline" onClick={onCancel} disabled={isProcessing}>
            Hủy
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={!uploadedFile || isProcessing}
            loading={isProcessing}
          >
            {isProcessing ? "Đang tải lên..." : "Tải lên poster"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PosterUpload;
