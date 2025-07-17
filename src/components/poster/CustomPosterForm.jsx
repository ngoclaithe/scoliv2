import React, { useState } from "react";
import Button from "../common/Button";
import Input from "../common/Input";
import FileUpload from "../common/FileUpload";
import Modal from "../common/Modal";

const CustomPosterForm = ({
  isOpen,
  onClose,
  onSave,
  initialData = {},
  className = "",
}) => {
  const [formData, setFormData] = useState({
    name: initialData.name || "",
    category: initialData.category || "custom",
    template: initialData.template || "blank",
    dimensions: initialData.dimensions || { width: 1920, height: 1080 },
    elements: initialData.elements || [],
    backgroundImage: initialData.backgroundImage || null,
    backgroundColor: initialData.backgroundColor || "#1e40af",
    ...initialData,
  });

  const [activeTab, setActiveTab] = useState("basic");
  const [errors, setErrors] = useState({});

  const tabs = [
    { id: "basic", name: "Cơ bản", icon: "📝" },
    { id: "background", name: "Nền", icon: "🎨" },
    { id: "elements", name: "Thành phần", icon: "🧩" },
    { id: "preview", name: "Xem trước", icon: "👁️" },
  ];

  const templates = [
    { id: "blank", name: "Trống", preview: "/templates/blank.jpg" },
    { id: "match", name: "Trận đấu cơ bản", preview: "/templates/match.jpg" },
    { id: "lineup", name: "Đội hình", preview: "/templates/lineup.jpg" },
    { id: "score", name: "Bảng tỉ số", preview: "/templates/score.jpg" },
    {
      id: "celebration",
      name: "Ăn mừng",
      preview: "/templates/celebration.jpg",
    },
  ];

  const dimensions = [
    { name: "Full HD (1920x1080)", width: 1920, height: 1080 },
    { name: "Instagram Post (1080x1080)", width: 1080, height: 1080 },
    { name: "Instagram Story (1080x1920)", width: 1080, height: 1920 },
    { name: "Facebook Cover (1200x630)", width: 1200, height: 630 },
    { name: "YouTube Thumbnail (1280x720)", width: 1280, height: 720 },
  ];

  const elementTypes = [
    {
      id: "text",
      name: "Văn bản",
      icon: "💬",
      description: "Thêm tiêu đề, mô tả",
    },
    {
      id: "team-logo",
      name: "Logo đội",
      icon: "🏆",
      description: "Logo của các đội bóng",
    },
    {
      id: "score",
      name: "Tỉ số",
      icon: "⚽",
      description: "Hiển thị tỉ số trận đấu",
    },
    {
      id: "timer",
      name: "Đồng hồ",
      icon: "⏰",
      description: "Thời gian trận đấu",
    },
    {
      id: "player-list",
      name: "Danh sách cầu thủ",
      icon: "👥",
      description: "Đội hình ra sân",
    },
    {
      id: "stats",
      name: "Thống kê",
      icon: "📊",
      description: "Số liệu trận đấu",
    },
    {
      id: "image",
      name: "Hình ảnh",
      icon: "🖼️",
      description: "Thêm hình ảnh tùy chỉnh",
    },
    {
      id: "shape",
      name: "Hình dạng",
      icon: "🔶",
      description: "Hình tròn, vuông, ...",
    },
  ];

  const handleChange = (field, value) => {
    setFormData((prev) => ({
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

  const handleDimensionChange = (dimension) => {
    setFormData((prev) => ({
      ...prev,
      dimensions: { width: dimension.width, height: dimension.height },
    }));
  };

  const addElement = (elementType) => {
    const newElement = {
      id: Date.now().toString(),
      type: elementType.id,
      name: elementType.name,
      position: { x: 50, y: 50 }, // Center position in percentage
      size: { width: 200, height: 100 },
      style: {},
      data: {},
    };

    setFormData((prev) => ({
      ...prev,
      elements: [...prev.elements, newElement],
    }));
  };

  const removeElement = (elementId) => {
    setFormData((prev) => ({
      ...prev,
      elements: prev.elements.filter((el) => el.id !== elementId),
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Tên poster là bắt buộc";
    }

    if (formData.name.length > 100) {
      newErrors.name = "Tên poster không được vượt quá 100 ký tự";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;
    onSave(formData);
  };

  const BasicTab = () => (
    <div className="space-y-4">
      <Input
        label="Tên poster"
        value={formData.name}
        onChange={(e) => handleChange("name", e.target.value)}
        placeholder="Nhập tên poster..."
        error={errors.name}
        required
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Mẫu poster
        </label>
        <div className="grid grid-cols-2 gap-3">
          {templates.map((template) => (
            <div
              key={template.id}
              onClick={() => handleChange("template", template.id)}
              className={`
                relative cursor-pointer rounded-lg border-2 overflow-hidden transition-all
                ${
                  formData.template === template.id
                    ? "border-primary-500 ring-2 ring-primary-200"
                    : "border-gray-200 hover:border-gray-300"
                }
              `}
            >
              <div className="aspect-video bg-gray-100 flex items-center justify-center">
                <span className="text-2xl">🎨</span>
              </div>
              <div className="p-2 text-center">
                <p className="text-xs font-medium">{template.name}</p>
              </div>
              {formData.template === template.id && (
                <div className="absolute top-1 right-1 bg-primary-500 text-white rounded-full p-1">
                  <svg
                    className="w-3 h-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Kích thước poster
        </label>
        <div className="space-y-2">
          {dimensions.map((dim, index) => (
            <label key={index} className="flex items-center">
              <input
                type="radio"
                name="dimension"
                checked={
                  formData.dimensions.width === dim.width &&
                  formData.dimensions.height === dim.height
                }
                onChange={() => handleDimensionChange(dim)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">{dim.name}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  const BackgroundTab = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Màu nền
        </label>
        <div className="flex items-center space-x-2">
          <input
            type="color"
            value={formData.backgroundColor}
            onChange={(e) => handleChange("backgroundColor", e.target.value)}
            className="w-10 h-10 rounded border border-gray-300 cursor-pointer"
          />
          <Input
            value={formData.backgroundColor}
            onChange={(e) => handleChange("backgroundColor", e.target.value)}
            placeholder="#ffffff"
            className="flex-1"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Hình nền (tùy chọn)
        </label>
        <FileUpload
          accept="image/*"
          onFileSelect={(files) => handleChange("backgroundImage", files[0])}
          showPreview={false}
        />
      </div>
    </div>
  );

  const ElementsTab = () => (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">
          Thêm thành phần
        </h4>
        <div className="grid grid-cols-1 gap-2">
          {elementTypes.map((elementType) => (
            <button
              key={elementType.id}
              onClick={() => addElement(elementType)}
              className="flex items-center p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="text-lg mr-3">{elementType.icon}</span>
              <div>
                <p className="font-medium text-sm">{elementType.name}</p>
                <p className="text-xs text-gray-500">
                  {elementType.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {formData.elements.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">
            Thành phần đã thêm
          </h4>
          <div className="space-y-2">
            {formData.elements.map((element) => (
              <div
                key={element.id}
                className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
              >
                <span className="text-sm font-medium">{element.name}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeElement(element.id)}
                  className="text-red-600 border-red-300 hover:bg-red-50"
                >
                  Xóa
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const PreviewTab = () => (
    <div className="space-y-4">
      <div className="bg-gray-100 rounded-lg p-4">
        <div
          className="mx-auto bg-white rounded-lg shadow-sm overflow-hidden"
          style={{
            width: "300px",
            height: "300px",
            aspectRatio: `${formData.dimensions.width} / ${formData.dimensions.height}`,
            backgroundColor: formData.backgroundColor,
          }}
        >
          <div className="w-full h-full flex items-center justify-center text-white">
            <div className="text-center">
              <h3 className="text-lg font-bold">
                {formData.name || "Poster tùy chỉnh"}
              </h3>
              <p className="text-sm opacity-90 mt-2">
                {formData.dimensions.width} x {formData.dimensions.height}px
              </p>
              <p className="text-xs opacity-75 mt-1">
                {formData.elements.length} thành phần
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center text-sm text-gray-600">
        Đây là bản xem trước đơn giản. Poster thật sẽ được tạo sau khi lưu.
      </div>
    </div>
  );

  const TabContent = () => {
    switch (activeTab) {
      case "basic":
        return <BasicTab />;
      case "background":
        return <BackgroundTab />;
      case "elements":
        return <ElementsTab />;
      case "preview":
        return <PreviewTab />;
      default:
        return <BasicTab />;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Tạo poster tùy chỉnh"
      size="lg"
      footer={
        <div className="flex justify-end space-x-3">
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Tạo poster
          </Button>
        </div>
      }
    >
      <div className="flex h-96">
        {/* Tabs */}
        <div className="w-1/4 border-r border-gray-200 pr-4">
          <div className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  w-full flex items-center px-3 py-2 text-sm rounded-lg transition-colors
                  ${
                    activeTab === tab.id
                      ? "bg-primary-100 text-primary-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }
                `}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 pl-4">
          <div className="h-full overflow-y-auto">
            <TabContent />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CustomPosterForm;
