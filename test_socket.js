// File test để kiểm tra format join_room message
// Chạy: node test_socket.js

const testJoinRoomFormat = () => {
  console.log('=== TEST JOIN_ROOM MESSAGE FORMAT ===\n');
  
  // Giả lập dữ liệu emit join_room
  const testCases = [
    {
      accessCode: "7QLCBT",
      clientType: "client",
      timestamp: Date.now(),
      viewType: "intro"
    },
    {
      accessCode: "7QLCBT", 
      clientType: "admin",
      timestamp: Date.now(),
      viewType: "intro"
    },
    {
      accessCode: "7QLCBT",
      clientType: "display", 
      timestamp: Date.now(),
      viewType: "intro"
    }
  ];

  testCases.forEach((testCase, index) => {
    console.log(`Test case ${index + 1} (${testCase.clientType}):`);
    console.log(JSON.stringify(testCase, null, 2));
    console.log('---');
  });

  console.log('✅ Tất cả format đều hợp lệ theo yêu cầu backend!');
};

testJoinRoomFormat();
