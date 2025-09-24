import React from 'react';
import LogoAPI from '../../API/apiLogo';
import { isHeicFile, convertHeicToJpegOrPng } from '../../utils/imageUtils';

const PosterLogoUploader = ({
  item,
  onPreview,
  onProgress,
  onSuccess,
  onError,
  maxSize = 5 * 1024 * 1024 // 5MB
}) => {
  const inputId = `file-upload-${item.id}`;

  const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

  const handleFileChange = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    let processedFile = file;

    // HEIC conversion
    if (isHeicFile(processedFile)) {
      try {
        processedFile = await convertHeicToJpegOrPng(processedFile, 'image/jpeg', 0.92);
      } catch (err) {
        onError?.(new Error('Không thể chuyển HEIC sang JPEG/PNG. Vui lòng chọn ảnh JPEG/PNG.'));
        return;
      }
    }

    // Size check
    if (processedFile.size > maxSize) {
      onError?.(new Error('Kích thước file tối đa là 5MB'));
      return;
    }

    // Type check (be lenient if type is empty)
    if (processedFile.type && !validTypes.includes(processedFile.type)) {
      onError?.(new Error('Chỉ chấp nhận file ảnh (JPEG, PNG, GIF, WebP)'));
      return;
    }

    // Create preview
    try {
      const reader = new FileReader();
      reader.onload = async (ev) => {
        const previewUrl = ev.target.result;
        onPreview?.(previewUrl);

        try {
          const response = await LogoAPI.uploadLogo(processedFile, item.type, item.unitName, (progressEvent) => {
            // Normalize progress for both XHR and axios style events
            if (progressEvent && typeof progressEvent.loaded === 'number') {
              const total = progressEvent.total || progressEvent.totalBytes || null;
              const loaded = progressEvent.loaded;
              const percent = total ? Math.round((loaded / total) * 100) : null;
              onProgress?.({ loaded, total, percent });
            } else if (progressEvent && typeof progressEvent.percent === 'number') {
              onProgress?.({ percent: progressEvent.percent, loaded: null, total: null });
            }
          });

          onSuccess?.(response?.data || response);
        } catch (err) {
          onError?.(err);
        }
      };
      reader.readAsDataURL(processedFile);
    } catch (err) {
      onError?.(new Error('Lỗi khi đọc file ảnh'));
    }
  };

  const labelClass = `block w-full text-xs text-center border rounded px-1 py-1 cursor-pointer transition-colors ${
    item.uploadStatus === 'preview' ? 'bg-yellow-50 border-yellow-300 text-yellow-700' :
    item.uploadStatus === 'error' ? 'bg-red-50 border-red-300 text-red-700' :
    'bg-blue-50 border-blue-300 hover:bg-blue-100'
  }`;

  const labelText = item.uploadStatus === 'preview' ? '⏳ Đang tải...' : item.uploadStatus === 'error' ? 'Thử lại' : '📁 Chọn file';

  return (
    <div>
      <input
        id={inputId}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      <label htmlFor={inputId} className={labelClass}>
        {labelText}
      </label>
    </div>
  );
};

export default PosterLogoUploader;
