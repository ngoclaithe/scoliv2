import React, { useState } from "react";
import Button from "../common/Button";
import Input from "../common/Input";
import Modal from "../common/Modal";

const ScoreControls = ({
  homeTeam,
  awayTeam,
  onScoreChange,
  onTeamNameChange,
  onReset,
  disabled = false,
  showTeamNames = true,
  className = "",
}) => {
  const [showModal, setShowModal] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);
  const [tempName, setTempName] = useState("");

  const handleScoreChange = (team, increment) => {
    const currentScore = team === "home" ? homeTeam.score : awayTeam.score;
    const newScore = Math.max(0, currentScore + increment);
    onScoreChange(team, newScore);
  };

  const handleDirectScoreChange = (team, value) => {
    const score = Math.max(0, parseInt(value) || 0);
    onScoreChange(team, score);
  };

  const handleTeamNameEdit = (team) => {
    setEditingTeam(team);
    setTempName(team === "home" ? homeTeam.name : awayTeam.name);
    setShowModal(true);
  };

  const handleSaveTeamName = () => {
    if (tempName.trim()) {
      onTeamNameChange(editingTeam, tempName.trim());
    }
    setShowModal(false);
    setEditingTeam(null);
    setTempName("");
  };

  const ScoreControlSection = ({ team, teamData, label }) => (
    <div className="bg-white rounded-lg p-4 shadow-sm border">
      <div className="text-center mb-4">
        {showTeamNames && (
          <button
            onClick={() => handleTeamNameEdit(team)}
            disabled={disabled}
            className="text-lg font-semibold text-gray-800 hover:text-primary-600 transition-colors mb-2 block w-full truncate"
          >
            {teamData.name}
            <svg
              className="inline-block w-4 h-4 ml-1 opacity-60"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
        )}
        <span className="text-sm text-gray-600">{label}</span>
      </div>

      {/* Score Display và Input */}
      <div className="flex items-center justify-center mb-4">
        <Input
          type="number"
          value={teamData.score}
          onChange={(e) => handleDirectScoreChange(team, e.target.value)}
          disabled={disabled}
          className="text-center text-2xl font-bold w-20"
          min="0"
        />
      </div>

      {/* Score Buttons */}
      <div className="flex justify-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleScoreChange(team, -1)}
          disabled={disabled || teamData.score === 0}
          className="w-10 h-10 p-0"
        >
          -1
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={() => handleScoreChange(team, 1)}
          disabled={disabled}
          className="w-10 h-10 p-0"
        >
          +1
        </Button>
      </div>

      {/* Quick Score Buttons */}
      <div className="mt-3 flex justify-center space-x-1">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => handleScoreChange(team, -1)}
          disabled={disabled || teamData.score === 0}
          className="text-xs px-2 py-1"
        >
          -1
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => handleScoreChange(team, 2)}
          disabled={disabled}
          className="text-xs px-2 py-1"
        >
          +2
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => handleScoreChange(team, 3)}
          disabled={disabled}
          className="text-xs px-2 py-1"
        >
          +3
        </Button>
      </div>
    </div>
  );

  return (
    <>
      <div className={`w-full max-w-2xl mx-auto ${className}`}>
        <div className="bg-gray-50 rounded-xl p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
            Điều khiển tỉ số
          </h3>

          {/* Score Controls Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <ScoreControlSection
              team="home"
              teamData={homeTeam}
              label="Đội nhà"
            />
            <ScoreControlSection
              team="away"
              teamData={awayTeam}
              label="Đội khách"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4">
            <Button
              variant="warning"
              onClick={onReset}
              disabled={disabled}
              className="flex-1 sm:flex-none"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Đặt lại tỉ số
            </Button>
          </div>

          {/* Current Score Summary */}
          <div className="mt-4 text-center text-sm text-gray-600">
            Tỉ số hiện tại:{" "}
            <span className="font-bold">
              {homeTeam.score} - {awayTeam.score}
            </span>
          </div>
        </div>
      </div>

      {/* Team Name Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={`Chỉnh sửa tên ${editingTeam === "home" ? "đội nhà" : "đội khách"}`}
        footer={
          <>
            <Button variant="outline" onClick={() => setShowModal(false)}>
              Hủy
            </Button>
            <Button variant="primary" onClick={handleSaveTeamName}>
              Lưu
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Tên đội"
            value={tempName}
            onChange={(e) => setTempName(e.target.value)}
            placeholder="Nhập tên đội..."
            autoFocus
          />
        </div>
      </Modal>
    </>
  );
};

export default ScoreControls;
