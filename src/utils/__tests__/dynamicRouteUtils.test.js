// Mock dependencies trước khi import
jest.mock('../../API/apiLogo', () => ({
  searchLogosByCode: jest.fn()
}));

jest.mock('../logoUtils', () => ({
  getFullLogoUrl: jest.fn((url) => url)
}));

import {
  parseColorParam,
  parseTeamName,
  parseTextParam,
  parseNumberParam,
  buildDynamicRoute
} from '../dynamicRouteUtils';

describe('dynamicRouteUtils', () => {
  describe('parseColorParam', () => {
    test('should parse valid hex color without #', () => {
      expect(parseColorParam('FF0000')).toBe('#FF0000');
      expect(parseColorParam('00FF00')).toBe('#00FF00');
      expect(parseColorParam('0000FF')).toBe('#0000FF');
    });

    test('should parse valid hex color with #', () => {
      expect(parseColorParam('#FF0000')).toBe('#FF0000');
      expect(parseColorParam('#00FF00')).toBe('#00FF00');
    });

    test('should parse short hex colors', () => {
      expect(parseColorParam('F00')).toBe('#F00');
      expect(parseColorParam('#0F0')).toBe('#0F0');
    });

    test('should return default color for invalid input', () => {
      expect(parseColorParam('')).toBe('#000000');
      expect(parseColorParam(null)).toBe('#000000');
      expect(parseColorParam(undefined)).toBe('#000000');
      expect(parseColorParam('GGGGGG')).toBe('#000000');
      expect(parseColorParam('FF00')).toBe('#000000');
    });
  });

  describe('parseTeamName', () => {
    test('should decode team names with underscores', () => {
      expect(parseTeamName('Ha_Noi_FC')).toBe('Ha Noi FC');
      expect(parseTeamName('Ho_Chi_Minh_City')).toBe('Ho Chi Minh City');
    });

    test('should decode URL encoded names', () => {
      expect(parseTeamName('H%C3%A0_N%E1%BB%99i_FC')).toBe('Hà Nội FC');
    });

    test('should return default name for empty input', () => {
      expect(parseTeamName('', 'ĐỘI-A')).toBe('ĐỘI-A');
      expect(parseTeamName(null, 'ĐỘI-B')).toBe('ĐỘI-B');
      expect(parseTeamName(undefined)).toBe('ĐỘI');
    });

    test('should handle special characters gracefully', () => {
      expect(parseTeamName('Team@123')).toBe('Team@123');
    });
  });

  describe('parseTextParam', () => {
    test('should decode text with underscores', () => {
      expect(parseTextParam('V_League_2024')).toBe('V League 2024');
      expect(parseTextParam('LIVE_STREAMING')).toBe('LIVE STREAMING');
    });

    test('should decode URL encoded text', () => {
      expect(parseTextParam('V%20League%202024')).toBe('V League 2024');
    });

    test('should return empty string for empty input', () => {
      expect(parseTextParam('')).toBe('');
      expect(parseTextParam(null)).toBe('');
      expect(parseTextParam(undefined)).toBe('');
    });
  });

  describe('parseNumberParam', () => {
    test('should parse valid numbers', () => {
      expect(parseNumberParam('0')).toBe(0);
      expect(parseNumberParam('5')).toBe(5);
      expect(parseNumberParam('123')).toBe(123);
    });

    test('should return default for invalid input', () => {
      expect(parseNumberParam('', 10)).toBe(10);
      expect(parseNumberParam(null, 5)).toBe(5);
      expect(parseNumberParam(undefined)).toBe(0);
      expect(parseNumberParam('abc')).toBe(0);
      expect(parseNumberParam('12.5')).toBe(12);
    });

    test('should handle negative numbers', () => {
      expect(parseNumberParam('-5')).toBe(-5);
    });
  });

  describe('buildDynamicRoute', () => {
    test('should build correct URL with all parameters', () => {
      const params = {
        accessCode: 'ABC123',
        location: 'My Dinh Stadium',
        matchTitle: 'V League 2024',
        liveText: 'LIVE STREAMING',
        teamALogoCode: 'HN',
        teamBLogoCode: 'TPHCM',
        teamAName: 'Ha Noi FC',
        teamBName: 'Ho Chi Minh City',
        teamAKitColor: '#FF0000',
        teamBKitColor: '#0000FF',
        teamAScore: 2,
        teamBScore: 1
      };

      const expected = '/ABC123/My%20Dinh%20Stadium/V%20League%202024/LIVE%20STREAMING/HN/TPHCM/Ha%20Noi%20FC/Ho%20Chi%20Minh%20City/FF0000/0000FF/2/1';
      expect(buildDynamicRoute(params)).toBe(expected);
    });

    test('should use default values for missing parameters', () => {
      const params = {
        accessCode: 'ABC123'
      };

      const expected = '/ABC123/stadium/match/live/TEAMA/TEAMB/TEAM_A/TEAM_B/FF0000/0000FF/0/0';
      expect(buildDynamicRoute(params)).toBe(expected);
    });

    test('should handle special characters in team names', () => {
      const params = {
        accessCode: 'ABC123',
        teamAName: 'Hà Nội FC',
        teamBName: 'TP HCM'
      };

      const result = buildDynamicRoute(params);
      expect(result).toContain('H%C3%A0%20N%E1%BB%99i%20FC');
      expect(result).toContain('TP%20HCM');
    });

    test('should remove # from colors', () => {
      const params = {
        accessCode: 'ABC123',
        teamAKitColor: '#FF0000',
        teamBKitColor: '#0000FF'
      };

      const result = buildDynamicRoute(params);
      expect(result).toContain('/FF0000/0000FF/');
      expect(result).not.toContain('#');
    });

    test('should replace spaces with underscores', () => {
      const params = {
        accessCode: 'ABC123',
        location: 'My Dinh Stadium',
        matchTitle: 'V League 2024'
      };

      const result = buildDynamicRoute(params);
      expect(result).toContain('My%20Dinh%20Stadium');
      expect(result).toContain('V%20League%202024');
    });
  });
});
