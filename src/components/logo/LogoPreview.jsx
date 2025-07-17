import React, { useState } from "react";
import Button from "../common/Button";
import Modal from "../common/Modal";

const LogoPreview = ({
  logo,
  teamType = "home",
  showControls = true,
  size = "md",
  onEdit,
  onDelete,
  onReplace,
  className = "",
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showFullPreview, setShowFullPreview] = useState(false);

  const sizes = {
    sm: "w-12 h-12",
    md: "w-16 h-16",
    lg: "w-24 h-24",
    xl: "w-32 h-32",
  };

  const backgrounds = [
    { name: "Trắng", color: "bg-white", border: "border-gray-200" },
    { name: "Đen", color: "bg-gray-900", border: "border-gray-700" },
    { name: "Xanh lá", color: "bg-green-600", border: "border-green-500" },
    { name: "Xanh dương", color: "bg-blue-600", border: "border-blue-500" },
    { name: "Đỏ", color: "bg-red-600", border: "border-red-500" },
  ];

  if (!logo) {
    return (
      <div className={`${className}`}>
        <div
          className={`${sizes[size]} bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center`}
        >
          <svg
            className="w-6 h-6 text-gray-400"
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
        </div>

        {showControls && (
          <div className="mt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onReplace}
              className="w-full"
            >
              Thêm logo
            </Button>
          </div>
        )}
      </div>
    );
  }

  const handleDelete = () => {
    onDelete?.(logo.id);
    setShowDeleteModal(false);
  };

  return (
    <>
      <div className={`${className}`}>
        {/* Logo Display */}
        <div className="space-y-3">
          {/* Main Logo */}
          <div
            className={`${sizes[size]} bg-white rounded-lg border border-gray-200 shadow-sm flex items-center justify-center cursor-pointer hover:shadow-md transition-shadow`}
            onClick={() => setShowFullPreview(true)}
          >
            {logo.url ? (
              <img
                src={logo.url}
                alt={logo.teamName}
                className="w-full h-full object-contain p-1 rounded-lg"
              />
            ) : (
              <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-gray-400 font-bold text-sm">
                  {logo.teamName?.charAt(0) || "?"}
                </span>
              </div>
            )}
          </div>

          {/* Team Info */}
          <div className="text-center">
            <h4 className="font-medium text-gray-900 text-sm truncate">
              {logo.teamName || "Chưa có tên"}
            </h4>
            <p className="text-xs text-gray-500 capitalize">
              {teamType === "home" ? "Đội nhà" : "Đội khách"}
            </p>
          </div>

          {/* Controls */}
          {showControls && (
            <div className="space-y-2">
              <div className="flex space-x-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onEdit}
                  className="flex-1 text-xs"
                >
                  Sửa
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onReplace}
                  className="flex-1 text-xs"
                >
                  Thay
                </Button>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDeleteModal(true)}
                className="w-full text-xs text-red-600 border-red-300 hover:bg-red-50"
              >
                Xóa
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Full Preview Modal */}
      <Modal
        isOpen={showFullPreview}
        onClose={() => setShowFullPreview(false)}
        title={`Logo ${logo.teamName}`}
        size="md"
      >
        <div className="space-y-6">
          {/* Logo Information */}
          <div className="text-center">
            <div className="w-32 h-32 mx-auto bg-white rounded-lg border border-gray-200 shadow-sm flex items-center justify-center mb-4">
              {logo.url ? (
                <img
                  src={logo.url}
                  alt={logo.teamName}
                  className="w-full h-full object-contain p-2 rounded-lg"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400 font-bold text-4xl">
                    {logo.teamName?.charAt(0) || "?"}
                  </span>
                </div>
              )}
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              {logo.teamName}
            </h3>
            <p className="text-sm text-gray-500">
              {logo.category} • {teamType === "home" ? "Đội nhà" : "Đội khách"}
            </p>
            {logo.description && (
              <p className="text-sm text-gray-600 mt-2">{logo.description}</p>
            )}
          </div>

          {/* Background Previews */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">
              Xem trước trên các nền khác nhau
            </h4>
            <div className="grid grid-cols-5 gap-2">
              {backgrounds.map((bg) => (
                <div key={bg.name} className="text-center">
                  <div
                    className={`w-16 h-16 ${bg.color} ${bg.border} border rounded-lg flex items-center justify-center mb-1`}
                  >
                    {logo.url && (
                      <img
                        src={logo.url}
                        alt={logo.teamName}
                        className="w-12 h-12 object-contain"
                      />
                    )}
                  </div>
                  <span className="text-xs text-gray-500">{bg.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Technical Info */}
          {logo.dimensions && (
            <div className="bg-gray-50 rounded-lg p-3">
              <h4 className="font-medium text-gray-900 mb-2">
                Thông tin kỹ thuật
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Kích thước:</span>
                  <span className="ml-2 font-medium">
                    {logo.dimensions.width} x {logo.dimensions.height}px
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Dung lượng:</span>
                  <span className="ml-2 font-medium">
                    {(logo.size / 1024).toFixed(1)} KB
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Định dạng:</span>
                  <span className="ml-2 font-medium">
                    {logo.type?.split("/")[1]?.toUpperCase()}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Tỷ lệ:</span>
                  <span className="ml-2 font-medium">
                    {logo.dimensions.width === logo.dimensions.height
                      ? "Vuông (1:1)"
                      : logo.dimensions.width > logo.dimensions.height
                        ? "Ngang"
                        : "Dọc"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={onEdit}
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
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              }
            >
              Chỉnh sửa
            </Button>
            <Button
              variant="primary"
              onClick={onReplace}
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
              Thay thế
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Xác nhận xóa logo"
        footer={
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              Hủy
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Xóa logo
            </Button>
          </div>
        }
      >
        <div className="text-center py-4">
          <svg
            className="w-16 h-16 text-red-500 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            B��n có chắc muốn xóa logo này?
          </h3>
          <p className="text-gray-600">
            Logo của <strong>{logo.teamName}</strong> sẽ bị xóa vĩnh viễn. Hành
            động này không thể hoàn tác.
          </p>
        </div>
      </Modal>
    </>
  );
};

export default LogoPreview;
