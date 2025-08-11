export const renderFutsalFouls = (foulsCount) => {
  const redFouls = Math.floor(foulsCount / 7); 
  const yellowFouls = foulsCount % 7; 
  
  let result = '';
  
  for (let i = 0; i < redFouls; i++) {
    result += '|';
  }
  
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

export const FoulsDisplay = ({ foulsCount, className = "" }) => {
  const { redFouls, yellowFouls } = renderFutsalFouls(foulsCount);

  if (foulsCount === 0) {
    return <div className={`flex items-center ${className}`}></div>;
  }

  return (
    <div className={`flex items-center ${className}`}>
      {yellowFouls > 0 && (
        <span className="text-red-500 font-bold text-sm tracking-wider">
          {'|'.repeat(yellowFouls)}
        </span>
      )}
      {redFouls > 0 && (
        <span className="text-yellow-500 font-bold text-sm tracking-wider">
          {'|'.repeat(redFouls)}
        </span>
      )}
    </div>
  );
};