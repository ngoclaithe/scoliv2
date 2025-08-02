/**
 * Tests cho logoUtils helper functions
 */

import { getFullLogoUrl, getFullLogoUrls, getFullLogoUrlFromObject } from '../logoUtils';

// Mock environment variable
const originalEnv = process.env;

beforeEach(() => {
  jest.resetModules();
  process.env = { ...originalEnv };
});

afterAll(() => {
  process.env = originalEnv;
});

describe('logoUtils', () => {
  describe('getFullLogoUrl', () => {
    beforeEach(() => {
      process.env.REACT_APP_API_BASE_URL = 'http://localhost:5000/api/v1';
    });

    test('trả về null cho input null/undefined/empty', () => {
      expect(getFullLogoUrl(null)).toBe(null);
      expect(getFullLogoUrl(undefined)).toBe(null);
      expect(getFullLogoUrl('')).toBe(null);
      expect(getFullLogoUrl('   ')).toBe(null);
    });

    test('trả về URL nguyên bản cho absolute URLs', () => {
      const httpUrl = 'http://example.com/logo.jpg';
      const httpsUrl = 'https://example.com/logo.jpg';
      const protocolRelativeUrl = '//example.com/logo.jpg';
      const dataUrl = 'data:image/png;base64,iVBORw0KGgo...';

      expect(getFullLogoUrl(httpUrl)).toBe(httpUrl);
      expect(getFullLogoUrl(httpsUrl)).toBe(httpsUrl);
      expect(getFullLogoUrl(protocolRelativeUrl)).toBe(protocolRelativeUrl);
      expect(getFullLogoUrl(dataUrl)).toBe(dataUrl);
    });

    test('thêm API_BASE_URL cho relative URLs', () => {
      const relativeUrl = '/uploads/logo.jpg';
      const relativeUrlNoSlash = 'uploads/logo.jpg';
      
      expect(getFullLogoUrl(relativeUrl)).toBe('http://localhost:5000/api/v1/uploads/logo.jpg');
      expect(getFullLogoUrl(relativeUrlNoSlash)).toBe('http://localhost:5000/api/v1/uploads/logo.jpg');
    });

    test('xử lý API_BASE_URL có trailing slash', () => {
      process.env.REACT_APP_API_BASE_URL = 'http://localhost:5000/api/v1/';
      const relativeUrl = '/uploads/logo.jpg';
      
      expect(getFullLogoUrl(relativeUrl)).toBe('http://localhost:5000/api/v1/uploads/logo.jpg');
    });

    test('sử dụng default URL khi không có REACT_APP_API_BASE_URL', () => {
      delete process.env.REACT_APP_API_BASE_URL;
      jest.resetModules();
      
      // Re-import sau khi xóa env var
      const { getFullLogoUrl: getFullLogoUrlNew } = require('../logoUtils');
      const relativeUrl = '/uploads/logo.jpg';
      
      expect(getFullLogoUrlNew(relativeUrl)).toBe('http://192.168.31.186:5000/api/v1/uploads/logo.jpg');
    });
  });

  describe('getFullLogoUrls', () => {
    beforeEach(() => {
      process.env.REACT_APP_API_BASE_URL = 'http://localhost:5000/api/v1';
    });

    test('trả về array rỗng cho input không phải array', () => {
      expect(getFullLogoUrls(null)).toEqual([]);
      expect(getFullLogoUrls(undefined)).toEqual([]);
      expect(getFullLogoUrls('string')).toEqual([]);
      expect(getFullLogoUrls({})).toEqual([]);
    });

    test('xử lý array URLs mixed absolute và relative', () => {
      const urls = [
        'http://example.com/absolute.jpg',
        '/uploads/relative.jpg',
        null,
        '',
        'data:image/png;base64,abc',
        'uploads/relative2.jpg'
      ];

      const expected = [
        'http://example.com/absolute.jpg',
        'http://localhost:5000/api/v1/uploads/relative.jpg',
        'data:image/png;base64,abc',
        'http://localhost:5000/api/v1/uploads/relative2.jpg'
      ];

      expect(getFullLogoUrls(urls)).toEqual(expected);
    });

    test('trả về array rỗng cho array toàn null/empty values', () => {
      const urls = [null, '', undefined, '   '];
      expect(getFullLogoUrls(urls)).toEqual([]);
    });
  });

  describe('getFullLogoUrlFromObject', () => {
    beforeEach(() => {
      process.env.REACT_APP_API_BASE_URL = 'http://localhost:5000/api/v1';
    });

    test('trả về null cho object null/undefined', () => {
      expect(getFullLogoUrlFromObject(null)).toBe(null);
      expect(getFullLogoUrlFromObject(undefined)).toBe(null);
      expect(getFullLogoUrlFromObject('string')).toBe(null);
    });

    test('xử lý object có url_logo', () => {
      const logoObject = {
        id: 1,
        code_logo: 'TEST',
        url_logo: '/uploads/test.jpg',
        type: 'logo'
      };

      expect(getFullLogoUrlFromObject(logoObject)).toBe('http://localhost:5000/api/v1/uploads/test.jpg');
    });

    test('trả về null cho object không có url_logo', () => {
      const logoObject = {
        id: 1,
        code_logo: 'TEST',
        type: 'logo'
      };

      expect(getFullLogoUrlFromObject(logoObject)).toBe(null);
    });

    test('xử lý url_logo là absolute URL', () => {
      const logoObject = {
        url_logo: 'https://example.com/logo.jpg'
      };

      expect(getFullLogoUrlFromObject(logoObject)).toBe('https://example.com/logo.jpg');
    });
  });
});
