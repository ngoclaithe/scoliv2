// Utility function để hiển thị lỗi futsal
export const renderFutsalFouls = (foulsCount) => {
  const redFouls = Math.floor(foulsCount / 7); // Mỗi 7 lỗi = 1 gạch đỏ
  const yellowFouls = foulsCount % 7; // Lỗi còn lại = gạch vàng
  
  let result = '';
  
  // Thêm gạch đỏ
  for (let i = 0; i < redFouls; i++) {
    result += '|';
  }
  
  // Thêm gạch vàng
  for (let i = 0; i < yellowFouls; i++) {
    result += '|';
  }
  
  return {
    redFouls,
    yellowFouls,
    display: result,
    redDisplay: '|'.repeat(redFouls),
    yellowDisplay: '|'.repeat(yellowFouls)
  };
};

// Component để hiển thị fouls với màu sắc
export const FoulsDisplay = ({ foulsCount, className = "" }) => {
  const { redFouls, yellowFouls } = renderFutsalFouls(foulsCount);

  // Nếu chưa có lỗi nào thì không hiển thị gì (trắng tinh)
  if (foulsCount === 0) {
    return <div className={`flex items-center ${className}`}></div>;
  }

  return (
    <div className={`flex items-center ${className}`}>
      {redFouls > 0 && (
        <span className="text-red-500 font-bold text-sm">
          {'|'.repeat(redFouls)}
        </span>
      )}
      {yellowFouls > 0 && (
        <span className="text-yellow-500 font-bold text-sm">
          {'|'.repeat(yellowFouls)}
        </span>
      )}
    </div>
  );
};
