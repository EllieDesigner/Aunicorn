import React, { useState, useEffect } from 'react';
import { sensoryAudio } from '../utils/audio';

interface SensoryResetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onToggleLowStim?: (enabled: boolean) => void;
  isLowStim?: boolean;
}

export const SensoryResetModal: React.FC<SensoryResetModalProps> = ({
  isOpen,
  onClose,
  onToggleLowStim,
  isLowStim = false,
}) => {
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Rest'>('Inhale');
  const [secondsInPhase, setSecondsInPhase] = useState(4);
  const [isNoisePlaying, setIsNoisePlaying] = useState(false);
  const [volume, setVolume] = useState(0.35);
  const [groundingStep, setGroundingStep] = useState(0);
  const [affirmation, setAffirmation] = useState<string>(
    'You are completely safe. Your nervous system is wise. You do not owe the world productivity right now.'
  );
  const [loadingAffirmation, setLoadingAffirmation] = useState(false);

  // Breathing loop
  useEffect(() => {
    if (!isOpen) return;
    const phases: ('Inhale' | 'Hold' | 'Exhale' | 'Rest')[] = ['Inhale', 'Hold', 'Exhale', 'Rest'];
    let phaseIndex = 0;
    let count = 4;

    const interval = setInterval(() => {
      count -= 1;
      if (count <= 0) {
        phaseIndex = (phaseIndex + 1) % 4;
        setBreathPhase(phases[phaseIndex]);
        count = 4;
      }
      setSecondsInPhase(count);
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen]);

  const handleToggleNoise = () => {
    if (isNoisePlaying) {
      sensoryAudio.stopBrownNoise();
      setIsNoisePlaying(false);
    } else {
      sensoryAudio.startBrownNoise(volume);
      setIsNoisePlaying(true);
    }
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    sensoryAudio.setVolume(newVol);
  };

  const fetchNewAffirmation = async () => {
    setLoadingAffirmation(true);
    try {
      const res = await fetch('/api/gemini/unstick', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          feeling: 'sensory overload / executive freeze',
          context: 'Emergency sensory reset room',
        }),
      });
      const data = await res.json();
      if (data.affirmation) {
        setAffirmation(data.affirmation);
      }
    } catch {
      setAffirmation('Breathe gently. All obligations can wait. You are safe in this quiet space.');
    } finally {
      setLoadingAffirmation(false);
    }
  };

  if (!isOpen) return null;

  const groundingItems = [
    { title: '5 Things to See', desc: 'Find 5 calm shapes or shadows in your immediate view' },
    { title: '4 Things to Touch', desc: 'Notice the weight of your blanket, your fingertips, or clothing' },
    { title: '3 Things to Hear', desc: 'Listen to the brown noise or the rhythm of your breathing' },
    { title: '2 Things to Smell', desc: 'Notice fresh air, lavender, herbal tea, or comfort scent' },
    { title: '1 Truth to Hold', desc: 'Your worth is unconditional. You are allowed to simply exist.' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div
        className="w-full max-w-md bg-[#161622] border border-[#2c2c3a] rounded-2xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex flex-col gap-4 max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#2c2c3a] pb-3">
          <div className="flex items-center gap-2 text-[#00c2ff]">
            <span className="material-symbols-outlined text-[24px]">filter_vintage</span>
            <h2 className="font-bold text-[18px] text-[#f7f7fa]">
              Sensory Quick Reset
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close sensory reset"
            className="w-9 h-9 rounded-lg bg-[#1f1f2e] text-[#a8adb8] hover:text-white flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-[#00c2ff]"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Breathing Sphere */}
        <div className="flex flex-col items-center justify-center py-4 bg-[#101014] rounded-xl border border-[#2c2c3a]">
          <div className="relative w-36 h-36 flex items-center justify-center">
            {/* Animated Pulsing Ring */}
            <div
              className={`absolute rounded-full border-2 border-[#00c2ff]/40 transition-all duration-1000 ${
                breathPhase === 'Inhale'
                  ? 'w-32 h-32 bg-[#00c2ff]/20 scale-110'
                  : breathPhase === 'Hold'
                  ? 'w-32 h-32 bg-[#8f5fe8]/25 scale-110'
                  : breathPhase === 'Exhale'
                  ? 'w-20 h-20 bg-[#49e095]/15 scale-90'
                  : 'w-16 h-16 bg-[#1f1f2e] scale-75'
              }`}
            />
            <div className="relative z-10 flex flex-col items-center text-center">
              <span className="text-[18px] font-bold text-[#f7f7fa] tracking-wider uppercase">
                {breathPhase}
              </span>
              <span className="text-[13px] text-[#00c2ff] font-semibold mt-0.5">
                {secondsInPhase}s
              </span>
            </div>
          </div>
          <span className="text-[12px] text-[#a8adb8] mt-3">
            Gentle box breathing • Inhale, hold, exhale, soften
          </span>
        </div>

        {/* Brown Noise Player Controls */}
        <div className="p-3.5 rounded-xl bg-[#1f1f2e] border border-[#2c2c3a] flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-[#4cd6fb]">
                graphic_eq
              </span>
              <span className="font-semibold text-[14px] text-[#f7f7fa]">
                Calibrated Brown Noise
              </span>
            </div>
            <button
              type="button"
              onClick={handleToggleNoise}
              className={`px-3 py-1 rounded-full text-[12px] font-semibold flex items-center gap-1.5 transition-all ${
                isNoisePlaying
                  ? 'bg-[#49e095] text-[#003920]'
                  : 'bg-[#292933] text-[#e3e1ef] hover:bg-[#34343f]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">
                {isNoisePlaying ? 'volume_up' : 'play_arrow'}
              </span>
              <span>{isNoisePlaying ? 'Playing' : 'Start Audio'}</span>
            </button>
          </div>

          {isNoisePlaying && (
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[11px] text-[#a8adb8]">Volume</span>
              <input
                type="range"
                min="0.05"
                max="0.8"
                step="0.05"
                value={volume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                aria-label="Brown noise volume slider"
                className="w-full accent-[#00c2ff] h-1.5 bg-[#2c2c3a] rounded-lg cursor-pointer"
              />
            </div>
          )}
        </div>

        {/* 5-4-3-2-1 Grounding Guide */}
        <div className="p-3.5 rounded-xl bg-[#1b1b25] border border-[#2c2c3a] flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-semibold uppercase tracking-wider text-[#bdc2ff]">
              5-4-3-2-1 Grounding Anchor
            </span>
            <span className="text-[11px] text-[#a8adb8]">
              Step {groundingStep + 1} of 5
            </span>
          </div>
          
          <div className="p-2.5 rounded-lg bg-[#1f1f2e] flex flex-col gap-1">
            <span className="font-semibold text-[14px] text-[#4cd6fb]">
              {groundingItems[groundingStep].title}
            </span>
            <p className="text-[13px] text-[#e3e1ef] leading-relaxed">
              {groundingItems[groundingStep].desc}
            </p>
          </div>

          <div className="flex items-center justify-between gap-2 mt-1">
            <button
              type="button"
              disabled={groundingStep === 0}
              onClick={() => setGroundingStep((s) => Math.max(0, s - 1))}
              className="px-3 py-1 rounded-lg bg-[#292933] disabled:opacity-40 text-[12px] text-[#a8adb8] hover:text-white"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => setGroundingStep((s) => (s + 1) % 5)}
              className="px-3 py-1 rounded-lg bg-[#5e6ad2] text-[12px] font-semibold text-white hover:bg-[#4854bb]"
            >
              {groundingStep === 4 ? 'Restart Anchor' : 'Next Step'}
            </button>
          </div>
        </div>

        {/* Affirming Co-Regulation Whisper */}
        <div className="p-3.5 rounded-xl bg-[#1f1f2e] border border-[#8f5fe8]/30 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[#8f5fe8]">
              <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
              <span className="text-[12px] font-semibold uppercase tracking-wider">
                Neuro-Affirming Whisper
              </span>
            </div>
            <button
              type="button"
              onClick={fetchNewAffirmation}
              disabled={loadingAffirmation}
              className="text-[11px] text-[#bdc2ff] hover:underline flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[14px]">refresh</span>
              {loadingAffirmation ? 'Listening...' : 'Another'}
            </button>
          </div>
          <p className="text-[13px] text-[#e3e1ef] italic leading-relaxed">
            "{affirmation}"
          </p>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center gap-2 pt-1">
          {onToggleLowStim && (
            <button
              type="button"
              onClick={() => onToggleLowStim(!isLowStim)}
              className={`flex-1 h-10 rounded-xl text-[13px] font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                isLowStim
                  ? 'bg-[#49e095] text-[#003920]'
                  : 'bg-[#1f1f2e] border border-[#2c2c3a] text-[#e3e1ef] hover:bg-[#252536]'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">
                {isLowStim ? 'visibility_off' : 'visibility'}
              </span>
              <span>{isLowStim ? 'Low-Stim Mode ON' : 'Low-Stim Mode'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="flex-1 h-10 rounded-xl bg-[#5e6ad2] text-white font-semibold text-[13px] hover:bg-[#4854bb] transition-colors"
          >
            I Feel Calmer Now
          </button>
        </div>
      </div>
    </div>
  );
};
