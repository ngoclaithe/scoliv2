import React, { useEffect } from 'react';
import { mapUrlViewToInternal, mapInternalViewToUrl } from '../../utils/viewMappingUtils';
import { encodeMatchTitle, decodeMatchTitle } from '../../utils/urlEncodingUtils';
import { buildDynamicRoute } from '../../utils/dynamicRouteUtils';

const UrlTestComponent = () => {
  useEffect(() => {
    console.log('=== URL ROUTING TEST RESULTS ===');
    
    // Test view mapping
    console.log('\n🗺️ VIEW MAPPING TESTS:');
    const viewTests = [
      ['tisoduoi', 'scoreboard_below'],
      ['tisotren', 'scoreboard'],
      ['gioithieu', 'intro'],
      ['nghi', 'halftime']
    ];
    
    viewTests.forEach(([urlView, expectedInternal]) => {
      const mapped = mapUrlViewToInternal(urlView);
      const backToUrl = mapInternalViewToUrl(mapped);
      const isCorrect = mapped === expectedInternal;
      console.log(`${isCorrect ? '✅' : '❌'} ${urlView} -> ${mapped} (expected: ${expectedInternal})`);
      console.log(`   Back to URL: ${backToUrl}`);
    });
    
    // Test match title encoding
    console.log('\n🔒 MATCH TITLE ENCODING TESTS:');
    const titleTests = [
      'Simple Title',
      'Title với / slash',
      'Complex / Title / With / Many / Slashes',
      'Title?với#ký&tự=đặc+biệt%'
    ];
    
    titleTests.forEach(title => {
      const encoded = encodeMatchTitle(title);
      const decoded = decodeMatchTitle(encoded);
      const isCorrect = decoded === title;
      console.log(`${isCorrect ? '✅' : '❌'} "${title}"`);
      console.log(`   Encoded: ${encoded}`);
      console.log(`   Decoded: "${decoded}"`);
    });
    
    // Test URL building
    console.log('\n🔗 URL BUILDING TEST:');
    const testParams = {
      accessCode: 'BV1N41',
      location: 'Sân vận động Mỹ Đình',
      matchTitle: 'Giải vô địch / Chung kết',
      liveText: 'Live',
      teamALogoCode: 'L3008',
      teamBLogoCode: 'L3009', 
      teamAName: 'Real Madrid',
      teamBName: 'Barcelona',
      teamAKitColor: 'xanh',
      teamBKitColor: 'do',
      teamAScore: 2,
      teamBScore: 1,
      view: 'scoreboard_below',
      matchTime: '45:00'
    };
    
    const url = buildDynamicRoute(testParams);
    console.log('Generated URL:', url);
    
    // Test user's problematic cases
    console.log('\n🐛 USER PROBLEM ANALYSIS:');
    console.log('URL with "scoreboard_below" should map to:', mapUrlViewToInternal('scoreboard_below'));
    console.log('URL with "tisoduoi" should map to:', mapUrlViewToInternal('tisoduoi'));
    console.log('URL with "scoreboard" should map to:', mapUrlViewToInternal('scoreboard'));
    console.log('URL with "tisotren" should map to:', mapUrlViewToInternal('tisotren'));
    
  }, []);

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">URL Routing Test Results</h1>
      <p className="text-gray-600">Check console for detailed test results</p>
      
      <div className="mt-6 space-y-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="font-semibold mb-2">View Mapping Examples:</h2>
          <ul className="space-y-1 text-sm">
            <li><code>tisoduoi</code> → {mapUrlViewToInternal('tisoduoi')}</li>
            <li><code>tisotren</code> → {mapUrlViewToInternal('tisotren')}</li>
            <li><code>gioithieu</code> → {mapUrlViewToInternal('gioithieu')}</li>
            <li><code>nghi</code> → {mapUrlViewToInternal('nghi')}</li>
          </ul>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="font-semibold mb-2">Match Title Encoding Examples:</h2>
          <div className="space-y-2 text-sm">
            {['Simple Title', 'Title với / slash'].map(title => {
              const encoded = encodeMatchTitle(title);
              const decoded = decodeMatchTitle(encoded);
              return (
                <div key={title} className="border-l-2 border-blue-500 pl-2">
                  <div><strong>Original:</strong> {title}</div>
                  <div><strong>Encoded:</strong> <code>{encoded}</code></div>
                  <div><strong>Decoded:</strong> {decoded}</div>
                  <div className={decoded === title ? 'text-green-600' : 'text-red-600'}>
                    {decoded === title ? '✅ Correct' : '❌ Error'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UrlTestComponent;
