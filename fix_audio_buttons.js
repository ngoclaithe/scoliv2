// Script tạm thời để sửa tất cả các button cần phát audio

const buttonsToFix = [
  {
    name: "Giới thiệu",
    audio: "poster",
    searchText: `              onClick={() => {
                updateView('intro');
                setSelectedOption("gioi-thieu");
                console.log('Chuyển sang giới thiệu');
              }}`,
    replaceText: `              onClick={() => {
                updateView('intro');
                setSelectedOption("gioi-thieu");
                playAudioForAction('poster');
                console.log('Chuyển sang giới thiệu');
              }}`
  },
  {
    name: "Tỉ số trên", 
    audio: "gialap",
    searchText: `              onClick={() => {
                updateView('scoreboard');
                setSelectedOption("ti-so-tren");
                console.log('Chuyển sang scoreboard trên');
              }}`,
    replaceText: `              onClick={() => {
                updateView('scoreboard');
                setSelectedOption("ti-so-tren");
                playAudioForAction('gialap');
                console.log('Chuyển sang scoreboard trên');
              }}`
  },
  {
    name: "Tỉ số dưới",
    audio: "rasan", 
    searchText: `              onClick={() => {
                updateView('scoreboard_below');
                setSelectedOption("ti-so-duoi");
                console.log('Chuyển sang scoreboard below');
              }}`,
    replaceText: `              onClick={() => {
                updateView('scoreboard_below');
                setSelectedOption("ti-so-duoi");
                playAudioForAction('rasan');
                console.log('Chuyển sang scoreboard below');
              }}`
  },
  {
    name: "Nghỉ giữa hiệp",
    audio: "poster",
    searchText: `              onClick={() => {
                console.log('Chuyển sang nghỉ giữa hiệp');
                console.log('Current view before update:', matchData.status);
                updateView('halftime');
                console.log('Updated view to halftime');
              }}`,
    replaceText: `              onClick={() => {
                console.log('Chuyển sang nghỉ giữa hiệp');
                console.log('Current view before update:', matchData.status);
                updateView('halftime');
                playAudioForAction('poster');
                console.log('Updated view to halftime');
              }}`
  }
];

console.log("Các button cần sửa audio:", buttonsToFix.map(b => b.name));
