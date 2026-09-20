import React, { useState, useEffect } from 'react';
import { sensoryAudio } from '../../utils/audio';

interface FocusTimerSectionProps {
  soundEnabled: boolean;
}

export const FocusTimerSection: React.FC<FocusTimerSectionProps> = ({ soundEnabled }) => {
  const [durationMinutes, setDurationMinutes] = useState<number>(25);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [brownNoiseOn, setBrownNoiseOn] = useState<boolean>(false);
  const [sessionCompleted, setSessionCompleted] = useState<boolean>(false);

  // Interval timer tick
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isRunning && secondsRemaining > 0) {
      timer = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            setSessionCompleted(true);
            if (soundEnabled) {
              sensoryAudio.playGentleChime();
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRunning, secondsRemaining, soundEnabled]);

  const selectDuration = (minutes: number) => {
    setDurationMinutes(minutes);
    setSecondsRemaining(minutes * 60);
    setIsRunning(false);
    setSessionCompleted(false);
  };

  const handleTogglePlay = () => {
    if (!isRunning && secondsRemaining === 0) {
      setSecondsRemaining(durationMinutes * 60);
    }
    const nextRunning = !isRunning;
    setIsRunning(nextRunning);

    // If starting and brown noise is requested
    if (nextRunning && brownNoiseOn) {
      sensoryAudio.startBrownNoise(0.3);
    }
  };

  const handleToggleBrownNoise = () => {
    if (brownNoiseOn) {
      sensoryAudio.stopBrownNoise();
      setBrownNoiseOn(false);
    } else {
      sensoryAudio.startBrownNoise(0.3);
      setBrownNoiseOn(true);
    }
  };

  const handleReset = (minutes: number = 15) => {
    setDurationMinutes(minutes);
    setSecondsRemaining(minutes * 60);
    setIsRunning(false);
    setSessionCompleted(false);
  };

  const handleNoShameStop = () => {
    setIsRunning(false);
    sensoryAudio.stopBrownNoise();
    setBrownNoiseOn(false);
    setSecondsRemaining(durationMinutes * 60);
  };

  // Format mm:ss
  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const totalSecs = durationMinutes * 60;
  const progressPercent = totalSecs > 0 ? (totalSecs - secondsRemaining) / totalSecs : 0;
  const strokeDashoffset = 264 - 264 * progressPercent;

  return (
    <div className="flex flex-col p-4 sm:p-5 rounded-2xl bg-[#1b1b25] border border-[#2c2c3a] shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#00c2ff]/20 border border-[#00c2ff]/30 flex items-center justify-center text-[#00c2ff]">
            <span className="material-symbols-outlined text-[20px]">hourglass_top</span>
          </div>
          <div>
            <h3 className="font-semibold text-[17px] text-[#f7f7fa]">Gentle Focus &amp; Rest</h3>
            <span className="text-[12px] text-[#a8adb8]">Sensory-friendly pacing</span>
          </div>
        </div>

        {/* Brown noise toggle pill */}
        <button
          type="button"
          onClick={handleToggleBrownNoise}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-semibold transition-all ${
            brownNoiseOn
              ? 'bg-[#00c2ff]/20 text-[#00c2ff] border border-[#00c2ff]/40 shadow-sm'
              : 'bg-[#1f1f2e] text-[#a8adb8] border border-[#2c2c3a] hover:text-[#f7f7fa]'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">graphic_eq</span>
          <span>{brownNoiseOn ? 'Brown Noise: Active' : 'Brown Noise'}</span>
        </button>
      </div>

      {/* Interval Selectors */}
      <div className="grid grid-cols-3 gap-2">
        {[15, 25, 60].map((mins) => (
          <button
            key={mins}
            type="button"
            onClick={() => selectDuration(mins)}
            className={`h-10 rounded-xl font-semibold text-[13px] transition-all flex items-center justify-center ${
              durationMinutes === mins
                ? 'bg-[#5e6ad2] text-white shadow-sm border border-[#6e79d6]'
                : 'bg-[#1f1f2e] text-[#a8adb8] hover:text-[#f7f7fa] border border-[#2c2c3a]'
            }`}
          >
            {mins === 60 ? '1 Hour' : `${mins} min`}
          </button>
        ))}
      </div>

      {/* Circular Visualization */}
      <div className="flex flex-col items-center justify-center py-2">
        <div className="relative w-48 h-48 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              className="text-[#1f1f2e]"
              cx="50"
              cy="50"
              fill="transparent"
              r="42"
              stroke="currentColor"
              strokeWidth="7"
            />
            <circle
              className="text-[#00c2ff] transition-all duration-1000 ease-linear"
              cx="50"
              cy="50"
              fill="transparent"
              r="42"
              stroke="currentColor"
              strokeWidth="7"
              strokeDasharray="264"
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </svg>

          <div className="absolute flex flex-col items-center text-center">
            <span className="text-[34px] font-bold tracking-tight text-[#f7f7fa]">
              {timeFormatted}
            </span>
            <span className="text-[12px] text-[#00c2ff] font-semibold uppercase tracking-wider mt-0.5">
              {isRunning ? 'Focus Block' : sessionCompleted ? 'Rest Time' : 'Ready'}
            </span>
            <span className="text-[12px] text-[#a8adb8] mt-0.5">
              5 min Pause next
            </span>
          </div>
        </div>

        <span className="text-[12px] text-[#a8adb8] mt-2 text-center">
          {brownNoiseOn ? 'Brown noise active • Soft ambient chime on completion' : 'Zero pressure • Gentle momentum'}
        </span>
      </div>

      {/* Main Action Toggles */}
      <div className="grid grid-cols-2 gap-2.5">
        <button
          type="button"
          onClick={handleTogglePlay}
          className="h-12 rounded-xl bg-[#5e6ad2] hover:bg-[#4854bb] text-white font-semibold text-[14px] flex items-center justify-center gap-2 shadow-sm transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">
            {isRunning ? 'pause' : 'play_arrow'}
          </span>
          <span>{isRunning ? 'Pause Focus' : 'Start Focus'}</span>
        </button>

        <button
          type="button"
          onClick={() => handleReset(15)}
          className="h-12 rounded-xl bg-[#1f1f2e] hover:bg-[#252536] border border-[#2c2c3a] text-[#f7f7fa] font-medium text-[14px] flex items-center justify-center gap-2 transition-colors"
        >
          <span className="material-symbols-outlined text-[20px] text-[#49e095]">
            self_improvement
          </span>
          <span>15m Reset</span>
        </button>
      </div>

      {/* No-Shame Rest Button */}
      <button
        type="button"
        onClick={handleNoShameStop}
        className="w-full h-11 rounded-xl bg-[#1f1f2e]/70 hover:bg-[#252536] border border-[#8f5fe8]/25 text-[#bdc2ff] text-[13px] font-medium flex items-center justify-center gap-2 transition-colors"
      >
        <span className="material-symbols-outlined text-[18px] text-[#8f5fe8]">spa</span>
        <span>No-Shame Stop: Step away anytime without penalties</span>
      </button>
    </div>
  );
};
