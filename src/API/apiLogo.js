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

    try {
      const config = {
        // do NOT set Content-Type header manually so browser can add the boundary (fixes some Safari issues)
        onUploadProgress: (progressEvent) => {
          try {
            const percent = progressEvent.total ? Math.round((progressEvent.loaded * 100) / progressEvent.total) : null;
            console.log('[LogoAPI] upload progress', { percent, loaded: progressEvent.loaded, total: progressEvent.total });
          } catch (e) { }
          if (typeof onProgress === 'function') onProgress(progressEvent);
        },
        timeout: 60000,
      };

      const response = await api.post('/logos', formData, config);

      console.log('[LogoAPI] uploadLogo SUCCESS', { data: response?.data, status: response?.status });
      return response.data;
    } catch (error) {
      // Detailed front-end logging for debugging iOS Safari where backend never receives request
      try {
        console.error('[LogoAPI] uploadLogo ERROR', {
          message: error?.message,
          isAxiosError: error?.isAxiosError || false,
          code: error?.code || null,
          response: error?.response ? { status: error.response.status, headers: error.response.headers, data: error.response.data } : null,
          request: error?.request || null,
          navigator: typeof navigator !== 'undefined' ? { userAgent: navigator.userAgent, platform: navigator.platform } : null
        });
      } catch (e) {
        console.error('[LogoAPI] uploadLogo ERROR - failed to stringify error');
      }

      throw LogoAPI.handleError(error);
    }
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
      const response = await api.put(`/logos/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
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
