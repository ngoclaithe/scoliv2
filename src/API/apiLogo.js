import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://192.168.31.186:5000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const LogoAPI = {
  /**
   * Upload a new logo
   * @param {File} file - The logo file to upload
   * @param {string} type - Type of logo ('banner', 'logo','other')
   * @returns {Promise<Object>} The uploaded logo data
   */
  uploadLogo: async (file, type, name, onProgress) => {
    const formData = new FormData();
    formData.append('file', file);
    if (type) formData.append('type', type);
    if (name) formData.append('name', name);

    // FE debug logs to help diagnose iOS-only failures
    try {
      console.log('[LogoAPI] uploadLogo START', {
        file: file && { name: file.name, size: file.size, type: file.type },
        type,
        name,
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
        platform: typeof navigator !== 'undefined' ? navigator.platform : 'unknown'
      });
    } catch (e) {
      // ignore logging errors
    }

    // Use XMLHttpRequest for uploads (better control of upload.onprogress and known fixes on iOS WebKit)
    return new Promise((resolve, reject) => {
      try {
        const xhr = new XMLHttpRequest();
        const url = `${API_BASE_URL.replace(/\/$/, '')}/logos`;
        xhr.open('POST', url);
        xhr.timeout = 60000; // 60s

        // Set auth header if available
        try {
          const token = localStorage.getItem('token');
          if (token) {
            xhr.setRequestHeader('Authorization', `Bearer ${token}`);
          }
        } catch (e) { /* ignore */ }

        xhr.upload.onprogress = (evt) => {
          try {
            if (evt.lengthComputable) {
              const percent = Math.round((evt.loaded / evt.total) * 100);
              console.log('[LogoAPI] xhr upload progress', { percent, loaded: evt.loaded, total: evt.total });
              if (typeof onProgress === 'function') onProgress({ loaded: evt.loaded, total: evt.total, percent });
            } else {
              console.log('[LogoAPI] xhr upload progress unknown total', { loaded: evt.loaded });
              if (typeof onProgress === 'function') onProgress({ loaded: evt.loaded, total: null, percent: null });
            }
          } catch (e) { }
        };

        xhr.onload = () => {
          const status = xhr.status;
          const responseText = xhr.responseText;
          console.log('[LogoAPI] xhr onload', { status, responseText });
          if (status >= 200 && status < 300) {
            try {
              const data = responseText ? JSON.parse(responseText) : null;
              resolve(data);
            } catch (e) {
              // non-json response
              resolve({ data: responseText });
            }
          } else {
            const err = new Error(`Upload failed with status ${status}`);
            err.status = status;
            err.responseText = responseText;
            console.error('[LogoAPI] xhr upload failed', { status, responseText });
            reject(err);
          }
        };

        xhr.onerror = () => {
          console.error('[LogoAPI] xhr onerror', { readyState: xhr.readyState });
          reject(new Error('Network error during logo upload'));
        };

        xhr.ontimeout = () => {
          console.error('[LogoAPI] xhr ontimeout');
          reject(new Error('Upload timed out'));
        };

        // Do NOT set Content-Type header here. Browser will set multipart/form-data with boundary.
        xhr.send(formData);
      } catch (error) {
        console.error('[LogoAPI] uploadLogo XHR wrapper error', { message: error?.message });
        reject(error);
      }
    });
  },

  /**
   * Get all logos for the authenticated user
   * @param {string} [type] - Optional. Filter logos by type
   * @returns {Promise<Array>} Array of logo objects
   */
  getLogos: async (type) => {
    try {
      const params = type ? { type } : {};
      const response = await api.get('/logos', { params });
      return response.data;
    } catch (error) {
      throw LogoAPI.handleError(error);
    }
  },

  /**
   * Get logo by ID
   * @param {number} id - The logo ID
   * @returns {Promise<Object>} The logo data
   */
  getLogo: async (id) => {
    try {
      const response = await api.get(`/logos/${id}`);
      return response.data;
    } catch (error) {
      throw LogoAPI.handleError(error);
    }
  },

  /**
   * Search logos by code
   * @param {string} code - The logo code to search for
   * @param {boolean} [exact=false] - Whether to perform an exact match
   * @returns {Promise<Object>} Search results with logos
   */
  searchLogosByCode: async (code, exact = false) => {
    try {
      const response = await api.get(`/logos/code/${code}`, {
        params: { exact },
      });
      return response.data;
    } catch (error) {
      throw LogoAPI.handleError(error);
    }
  },

  /**
   * Update a logo
   * @param {number} id - The logo ID
   * @param {Object} data - Update data
   * @param {File} [data.file] - New logo file (optional)
   * @param {string} [data.type] - New logo type (optional)
   * @returns {Promise<Object>} The updated logo data
   */
  updateLogo: async (id, { file, type }) => {
    const formData = new FormData();
    if (file) formData.append('file', file);
    if (type) formData.append('type', type);

    try {
      const response = await api.put(`/logos/${id}`, formData);
      return response.data;
    } catch (error) {
      throw LogoAPI.handleError(error);
    }
  },

  /**
   * Delete a logo
   * @param {number} id - The logo ID to delete
   * @returns {Promise<Object>} Success status
   */
  deleteLogo: async (id) => {
    try {
      const response = await api.delete(`/logos/${id}`);
      return response.data;
    } catch (error) {
      throw LogoAPI.handleError(error);
    }
  },

  /**
   * Handle API errors
   * @private
   */
  handleError: (error) => {
    if (error.response) {
      const { status, data } = error.response;
      const message = data?.message || 'An error occurred';
      return new Error(`API Error (${status}): ${message}`);
    } else if (error.request) {
      return new Error('No response from server. Please check your connection.');
    } else {
      return new Error(`Request error: ${error.message}`);
    }
  },
};

export default LogoAPI;
