/**
 * Test cases cho URL routing system
 * Test các trường hợp URL khác nhau để đảm bảo routing hoạt động chính xác
 */

import { mapUrlViewToInternal, mapInternalViewToUrl } from '../viewMappingUtils';
import { encodeMatchTitle, decodeMatchTitle, encodeTextParam, decodeTextParam } from '../urlEncodingUtils';
import { buildDynamicRoute, parseMatchTitle, parseTextParam } from '../dynamicRouteUtils';

// Test view mapping
console.log('=== TEST VIEW MAPPING ===');

const viewTests = [
  'scoreboard_below',
  'tisoduoi', 
  'scoreboard',
  'tisotren',
  'intro',
  'gioithieu',
  'halftime',
  'nghi'
];

viewTests.forEach(view => {
  const internal = mapUrlViewToInternal(view);
  const backToUrl = mapInternalViewToUrl(internal);
  console.log(`${view} -> ${internal} -> ${backToUrl}`);
});

// Test match title encoding
console.log('\n=== TEST MATCH TITLE ENCODING ===');

const matchTitleTests = [
  'Giải vô địch châu Á',
  'Real Madrid / Barcelona',
  'Chung kết C1 2024/2025',
  'Match Title với & và + và %',
  'Title?có#ký&tự=đặc+biệt%nhiều'
];

matchTitleTests.forEach(title => {
  const encoded = encodeMatchTitle(title);
  const decoded = decodeMatchTitle(encoded);
  const isCorrect = decoded === title;
  console.log(`${isCorrect ? '✅' : '❌'} "${title}" -> "${encoded}" -> "${decoded}"`);
});

// Test complete URL building và parsing
console.log('\n=== TEST COMPLETE URL FLOW ===');

const testParams = {
  accessCode: 'BV1N41',
  location: 'Sân vận động Mỹ Đình',
  matchTitle: 'Giải vô địch châu Á / Vòng chung kết', // Có dấu /
  liveText: 'Nga sơn Biz',
  teamALogoCode: 'L3008',
  teamBLogoCode: 'L3008',
  teamAName: 'FC Nga Hải',
  teamBName: 'FC Tiến Đông',
  teamAKitColor: 'xanh',
  teamBKitColor: 'do',
  teamAScore: 4,
  teamBScore: 3,
  view: 'scoreboard_below', // Internal view
  matchTime: '41:00'
};

// Build URL
const dynamicUrl = buildDynamicRoute(testParams);
console.log('\n🔗 Generated URL:');
console.log(dynamicUrl);

// Simulate URL parsing
const urlParts = dynamicUrl.split('/');
const [, accessCode, location, matchTitle, liveText, teamALogoCode, teamBLogoCode, 
       teamAName, teamBName, teamAKitColor, teamBKitColor, teamAScore, teamBScore, view, matchTime] = urlParts;

console.log('\n📋 URL Parts:');
console.log('accessCode:', accessCode);
console.log('location:', location);
console.log('matchTitle:', matchTitle);
console.log('view:', view);

// Parse back
const parsedParams = {
  accessCode,
  location: parseTextParam(location),
  matchTitle: parseMatchTitle(matchTitle),
  liveText: parseTextParam(liveText),
  view: mapUrlViewToInternal(parseTextParam(view)),
  teamAName: parseTextParam(teamAName),
  teamBName: parseTextParam(teamBName),
  matchTime: parseTextParam(matchTime)
};

console.log('\n🔄 Parsed Back:');
console.log('location:', parsedParams.location);
console.log('matchTitle:', parsedParams.matchTitle);
console.log('view:', parsedParams.view);
console.log('teamAName:', parsedParams.teamAName);
console.log('teamBName:', parsedParams.teamBName);

// Verify correctness
console.log('\n✅ VERIFICATION:');
console.log('location correct:', parsedParams.location === testParams.location);
console.log('matchTitle correct:', parsedParams.matchTitle === testParams.matchTitle);
console.log('view correct:', parsedParams.view === testParams.view);
console.log('teamAName correct:', parsedParams.teamAName === testParams.teamAName);
console.log('teamBName correct:', parsedParams.teamBName === testParams.teamBName);

// Test problematic URL từ user
console.log('\n=== TEST USER\'S PROBLEMATIC URL ===');

const problematicUrl = `/BV1N41/S%C3%A2n%20v%E1%BA%ADn%20%C4%91%E1%BB%99ng%20M%E1%BB%B9%20%C4%90%C3%ACnh/Gi%E1%BA%A3i%20v%C3%B4%20%C4%91%E1%BB%8Bch%20ch%C3%A2u%20%C3%81/Nga%20s%C6%A1n%20Biz/L3008/L3008/FC%20Nga%20H%E1%BA%A3i/%20FC%20Ti%E1%BA%BFn%20%C4%90%C3%B4ng/xanh/do/4/3/tisoduoi/41:00`;

const problematicParts = problematicUrl.split('/');
const [, pAccessCode, pLocation, pMatchTitle, pLiveText, pTeamALogoCode, pTeamBLogoCode, 
       pTeamAName, pTeamBName, pTeamAKitColor, pTeamBKitColor, pTeamAScore, pTeamBScore, pView, pMatchTime] = problematicParts;

console.log('Raw view from URL:', pView);
console.log('Mapped view:', mapUrlViewToInternal(parseTextParam(pView)));

export default {
  viewTests,
  matchTitleTests,
  testParams,
  problematicUrl
};
