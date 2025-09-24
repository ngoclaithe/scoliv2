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

    // Reset input để có thể chọn lại
    e.target.value = '';

    let processedFile = file;

    try {
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

      // Type check (lenient như VideoUpload)
      if (processedFile.type && !validTypes.includes(processedFile.type)) {
        const fileExtension = processedFile.name?.toLowerCase().split('.').pop();
        const validExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
        if (!fileExtension || !validExtensions.includes(fileExtension)) {
          onError?.(new Error('Chỉ chấp nhận file ảnh (JPEG, PNG, GIF, WebP)'));
          return;
        }
      }

      // *** QUAN TRỌNG: Tạo preview sau khi upload thành công, không phải trước ***
      // Đây là điểm khác biệt chính so với VideoUpload

      // Upload trực tiếp như VideoUpload pattern
      await uploadFile(processedFile);

    } catch (err) {
      console.error('File handling error:', err);
      onError?.(err);
    }
  };

  const uploadFile = (file) => {
    return new Promise((resolve, reject) => {
      // Tạo XMLHttpRequest giống như VideoUpload
      const xhr = new XMLHttpRequest();
      
      // Setup FormData
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', item.type);
      formData.append('name', item.unitName);

      // Lấy URL và token giống LogoAPI
      const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://192.168.31.186:5000/api/v1';
      const url = `${API_BASE_URL.replace(/\/$/, '')}/logos`;
      
      xhr.open('POST', url);
      xhr.timeout = 60000; // 60s timeout

      // Set auth header
      const token = localStorage.getItem('token');
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      }

      // Progress handler giống VideoUpload
      xhr.upload.onprogress = (evt) => {
        if (evt.lengthComputable) {
          const percent = Math.round((evt.loaded / evt.total) * 100);
          onProgress?.({ 
            loaded: evt.loaded, 
            total: evt.total, 
            percent 
          });
        }
      };

      // Success handler
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const responseData = xhr.responseText ? JSON.parse(xhr.responseText) : null;
            console.log('PosterLogoUploader - backend response parsed:', responseData);
            createPreviewAfterUpload(file);
            onSuccess?.(responseData);
            resolve(responseData);
          } catch (e) {
            console.log('PosterLogoUploader - backend response (non-JSON):', xhr.responseText);
            createPreviewAfterUpload(file);
            onSuccess?.({ data: xhr.responseText });
            resolve({ data: xhr.responseText });
          }
        } else {
          console.error('PosterLogoUploader - upload failed status:', xhr.status, 'response:', xhr.responseText);
          const err = new Error(`Upload failed with status ${xhr.status}`);
          err.status = xhr.status;
          err.responseText = xhr.responseText;
          reject(err);
        }
      };

      // Error handlers giống VideoUpload
      xhr.onerror = () => {
        reject(new Error('Network error during logo upload'));
      };

      xhr.ontimeout = () => {
        reject(new Error('Upload timed out'));
      };

      // Send request
      xhr.send(formData);
    });
  };

  // Helper function để tạo preview sau upload
  const createPreviewAfterUpload = (file) => {
    try {
      const reader = new FileReader();
      reader.onload = (ev) => {
        onPreview?.(ev.target.result);
      };
      reader.onerror = () => {
        console.warn('Could not create preview after upload');
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.warn('Preview creation failed:', err);
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
