import { Card, CardContent } from "@/components/ui/card";
import React from "react";

const Frame = () => {
  // Define the scoreboard elements data for better maintainability
  const scoreboardElements = {
    teams: [
      { name: "Đội A", color: "text-[#ee2b2b]", position: "left-[93px]" },
      { name: "Đội A", color: "text-[#0be7e7]", position: "left-[612px]" },
    ],
    scores: [
      { value: "2", position: "left-[323px] top-9" },
      { value: "2", position: "left-[469px] top-[38px]" },
    ],
    lines: [
      { className: "w-[46px] h-[81px] top-[52px] left-0", alt: "Line 1" },
      { className: "w-[54px] h-[89px] top-[51px] left-[259px]", alt: "Line 2" },
      { className: "w-[54px] h-[89px] top-[51px] left-[291px]", alt: "Line 5" },
      { className: "w-[217px] h-px top-[51px] left-[47px]", alt: "Line 3" },
      { className: "w-[307px] h-px top-[131px] left-px", alt: "Line 4" },
      { className: "w-8 h-px top-[131px] left-[309px]", alt: "Line 6" },
      { className: "w-8 h-px top-[51px] left-[264px]", alt: "Line 7" },
      { className: "w-[46px] h-[81px] top-[52px] left-[479px]", alt: "Line 8" },
      { className: "w-[55px] h-[88px] top-[52px] left-[515px]", alt: "Line 9" },
      {
        className: "w-[54px] h-[89px] top-[51px] left-[769px]",
        alt: "Line 10",
      },
      { className: "w-[217px] h-px top-[51px] left-[526px]", alt: "Line 11" },
      { className: "w-[307px] h-px top-[131px] left-[480px]", alt: "Line 12" },
      { className: "w-8 h-px top-[131px] left-[788px]", alt: "Line 13" },
      { className: "w-8 h-px top-[51px] left-[743px]", alt: "Line 14" },
      { className: "w-3.5 h-3.5 top-[37px] left-[295px]", alt: "Line 15" },
      { className: "w-3.5 h-3.5 top-[37px] left-[512px]", alt: "Line 16" },
      { className: "w-[206px] h-px top-[37px] left-[308px]", alt: "Line 17" },
      { className: "w-[140px] h-0.5 top-[130px] left-[339px]", alt: "Line 18" },
    ],
    vectors: [
      {
        className: "w-[35px] h-[50px] top-[60px] left-[280px]",
        alt: "Vector 1",
      },
      { className: "w-[73px] h-20 top-[51px] left-[264px]", alt: "Vector 2" },
      { className: "w-[52px] h-[81px] top-[54px] left-72", alt: "Vector 3" },
      { className: "w-4 h-3.5 top-[47px] left-[285px]", alt: "Vector 4" },
      { className: "w-0.5 h-4 top-[45px] left-[284px]", alt: "Vector 5" },
      {
        className: "w-[86px] h-[88px] top-[47px] left-[478px]",
        alt: "Vector 6",
      },
    ],
  };

  return (
    <div className="bg-white flex flex-row justify-center w-full">
      <Card className="bg-white border border-solid border-black w-[911px] h-[751px] rounded-none">
        <CardContent className="p-0">
          <div className="relative top-[190px] left-16 w-[824px] h-[140px]">
            <div className="absolute top-0 left-0 w-[824px] h-[140px]">
              {/* Render all line elements */}
              {scoreboardElements.lines.map((line, index) => (
                <img
                  key={`line-${index + 1}`}
                  className={`absolute object-cover ${line.className}`}
                  alt={line.alt}
                  src=""
                />
              ))}

              {/* Ellipse (team logo) */}
              <img
                className="absolute w-[90px] h-[90px] top-0 left-[366px] object-cover"
                alt="Team Logo"
                src=""
              />

              {/* Render all vector elements */}
              {scoreboardElements.vectors.map((vector, index) => (
                <img
                  key={`vector-${index + 1}`}
                  className={`absolute ${vector.className}`}
                  alt={vector.alt}
                  src=""
                />
              ))}

              {/* Render score numbers */}
              {scoreboardElements.scores.map((score, index) => (
                <div
                  key={`score-${index + 1}`}
                  className={`absolute ${score.position} font-sans font-normal text-black text-5xl tracking-[0] leading-[normal]`}
                >
                  {score.value}
                </div>
              ))}
            </div>

            {/* Render team names */}
            {scoreboardElements.teams.map((team, index) => (
              <div
                key={`team-${index + 1}`}
                className={`absolute ${team.position} ${index === 0 ? "top-[65px]" : "top-[61px]"} font-sans font-normal ${team.color} text-5xl tracking-[0] leading-[normal]`}
              >
                {team.name}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Frame;