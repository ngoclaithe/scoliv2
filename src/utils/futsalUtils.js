export const renderFutsalFouls = (foulsCount) => {
  const redFouls = Math.floor(foulsCount / 7);
  const yellowFouls = foulsCount % 7;
  return { redFouls, yellowFouls };
};

export const FoulsDisplay = ({ foulsCount, className = "" }) => {
  const { redFouls, yellowFouls } = renderFutsalFouls(foulsCount);

  if (foulsCount === 0) {
    return <div className={`flex ${className}`} />;
  }

  return (
    <div className={`flex gap-[2px] ${className}`}>
      {/* Yellow fouls */}
      {Array.from({ length: yellowFouls }).map((_, i) => (
        <span
          key={`y-${i}`}
          className="bg-yellow-500 w-[9px] h-4 flex-shrink-0 inline-block border border-white rounded-sm"
        />
      ))}
      {/* Red fouls */}
      {Array.from({ length: redFouls }).map((_, i) => (
        <span
          key={`r-${i}`}
          className="bg-red-500 w-[27px] h-4 flex-shrink-0 inline-block border border-white rounded-sm"
        />
      ))}
    </div>
  );
};
