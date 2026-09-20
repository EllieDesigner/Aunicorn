import React, { useState } from 'react';
import { SensoryStatus, UserProfile } from '../types';
import { storage } from '../utils/storage';
import { sensoryAudio } from '../utils/audio';

interface HealthAreaViewProps {
  userProfile: UserProfile;
  onOpenSensoryReset: () => void;
}

export const HealthAreaView: React.FC<HealthAreaViewProps> = ({
  userProfile,
  onOpenSensoryReset,
}) => {
  const [sensoryStatus, setSensoryStatus] = useState<SensoryStatus>(storage.getSensoryStatus());
  const [waterGlasses, setWaterGlasses] = useState<number>(3);
  const [safeMealChecked, setSafeMealChecked] = useState<boolean>(true);
  const [medsTaken, setMedsTaken] = useState<boolean>(true);
  const [cyclePhase, setCyclePhase] = useState<'Follicular (High Flow)' | 'Luteal (Low Executive Spoons)' | 'Recovery / HRT'>('Luteal (Low Executive Spoons)');
  const [savedNotice, setSavedNotice] = useState(false);

  const updateSensory = (category: keyof Omit<SensoryStatus, 'lastUpdated'>, val: number) => {
    const updated = {
      ...sensoryStatus,
      [category]: val,
      lastUpdated: new Date().toLocaleDateString(),
    };
    setSensoryStatus(updated);
    storage.saveSensoryStatus(updated);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 1500);
  };

  const handleAddWater = () => {
    setWaterGlasses((w) => w + 1);
    if (userProfile.soundEnabled) sensoryAudio.playGentleChime();
  };

  const overallSensoryLoad = Math.round(
    (sensoryStatus.auditory + sensoryStatus.visual + sensoryStatus.tactile + sensoryStatus.social) / 4
  );

  return (
    <div className="flex flex-col w-full px-4 py-3 space-y-4 max-w-md mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <span className="text-[12px] font-semibold text-[#00c2ff] uppercase tracking-wider">
            Neuro-Safe Health
          </span>
          <span className="text-[11px] text-[#49e095] bg-[#49e095]/10 px-2 py-0.5 rounded-full border border-[#49e095]/20">
            Self-Compassion
          </span>
        </div>
        <h2 className="text-[24px] font-bold text-[#f7f7fa] tracking-tight">
          Health &amp; Sensory Wellness
        </h2>
        <p className="text-[14px] text-[#a8adb8]">
          Track sensory fatigue, hydration, and hormonal rhythms without clinical judgment.
        </p>
      </div>

      {/* Sensory Fatigue Monitor */}
      <div className="p-4 rounded-2xl bg-[#1b1b25] border border-[#2c2c3a] shadow-sm flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#00c2ff]">
            <span className="material-symbols-outlined text-[20px]">sensors</span>
            <h3 className="font-semibold text-[16px] text-[#f7f7fa]">
              Sensory Load &amp; Fatigue
            </h3>
          </div>
          <span
            className={`text-[12px] font-semibold px-2 py-0.5 rounded-md ${
              overallSensoryLoad >= 4
                ? 'bg-[#eb5757]/20 text-[#eb5757] border border-[#eb5757]/30'
                : overallSensoryLoad >= 3
                ? 'bg-[#f0c000]/20 text-[#f0c000] border border-[#f0c000]/30'
                : 'bg-[#49e095]/20 text-[#49e095] border border-[#49e095]/30'
            }`}
          >
            {overallSensoryLoad >= 4
              ? 'High Overload Risk'
              : overallSensoryLoad >= 3
              ? 'Moderate Stimulation'
              : 'Calm Baseline'}
          </span>
        </div>

        {/* Sliders / Gauge blocks */}
        <div className="flex flex-col gap-2.5">
          {[
            { id: 'auditory' as const, label: 'Auditory Noise', icon: 'volume_up', val: sensoryStatus.auditory, color: '#00c2ff' },
            { id: 'visual' as const, label: 'Visual & Screen Glare', icon: 'lightbulb', val: sensoryStatus.visual, color: '#8f5fe8' },
            { id: 'tactile' as const, label: 'Tactile & Clothing', icon: 'texture', val: sensoryStatus.tactile, color: '#49e095' },
            { id: 'social' as const, label: 'Social & Masking Drain', icon: 'groups', val: sensoryStatus.social, color: '#f0c000' },
          ].map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-[#1f1f2e]">
              <div className="flex items-center gap-2 min-w-0">
                <span className="material-symbols-outlined text-[18px] text-[#a8adb8]">
                  {item.icon}
                </span>
                <span className="text-[13px] font-medium text-[#f7f7fa] truncate">
                  {item.label}
                </span>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                {[1, 2, 3, 4, 5].map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => updateSensory(item.id, lvl)}
                    className={`w-6 h-6 rounded text-[11px] font-semibold transition-all ${
                      item.val >= lvl
                        ? 'bg-[#5e6ad2] text-white shadow-sm'
                        : 'bg-[#292933] text-[#a8adb8] hover:bg-[#34343f]'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {savedNotice && (
          <span className="text-[11px] text-[#49e095] text-right font-medium">
            Sensory levels updated
          </span>
        )}

        {overallSensoryLoad >= 4 && (
          <button
            type="button"
            onClick={onOpenSensoryReset}
            className="h-10 rounded-xl bg-[#eb5757]/15 border border-[#eb5757]/30 text-[#eb5757] text-[13px] font-semibold flex items-center justify-center gap-1.5 hover:bg-[#eb5757]/25 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">emergency</span>
            <span>Overstimulation Detected: Open Quick Reset</span>
          </button>
        )}
      </div>

      {/* Gentle Hydration & Safe Fuel Tracker */}
      <div className="p-4 rounded-2xl bg-[#1b1b25] border border-[#2c2c3a] shadow-sm flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#4cd6fb]">
            <span className="material-symbols-outlined text-[20px]">water_drop</span>
            <h3 className="font-semibold text-[16px] text-[#f7f7fa]">
              Gentle Fuel &amp; Hydration
            </h3>
          </div>
          <span className="text-[11px] text-[#a8adb8]">Zero pressure</span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="p-3 rounded-xl bg-[#1f1f2e] flex flex-col items-center justify-center gap-1 text-center">
            <span className="text-[20px] font-bold text-[#00c2ff]">
              {waterGlasses}
            </span>
            <span className="text-[11px] text-[#a8adb8]">Safe Water Sips</span>
            <button
              type="button"
              onClick={handleAddWater}
              className="mt-1 h-7 px-2 rounded-lg bg-[#5e6ad2] text-white text-[11px] font-semibold hover:bg-[#4854bb]"
            >
              + 1 Glass
            </button>
          </div>

          <div
            onClick={() => setSafeMealChecked(!safeMealChecked)}
            className="p-3 rounded-xl bg-[#1f1f2e] flex flex-col items-center justify-center gap-1 text-center cursor-pointer border hover:border-[#49e095]/40"
          >
            <span className={`material-symbols-outlined text-[24px] ${safeMealChecked ? 'text-[#49e095]' : 'text-[#a8adb8]'}`}>
              {safeMealChecked ? 'check_circle' : 'restaurant'}
            </span>
            <span className="text-[11px] text-[#a8adb8]">Safe Comfort Food</span>
            <span className="text-[10px] text-[#bdc2ff]">
              {safeMealChecked ? 'Eaten' : 'Need food'}
            </span>
          </div>

          <div
            onClick={() => setMedsTaken(!medsTaken)}
            className="p-3 rounded-xl bg-[#1f1f2e] flex flex-col items-center justify-center gap-1 text-center cursor-pointer border hover:border-[#8f5fe8]/40"
          >
            <span className={`material-symbols-outlined text-[24px] ${medsTaken ? 'text-[#8f5fe8]' : 'text-[#a8adb8]'}`}>
              {medsTaken ? 'check_circle' : 'medication'}
            </span>
            <span className="text-[11px] text-[#a8adb8]">Daily Meds</span>
            <span className="text-[10px] text-[#bdc2ff]">
              {medsTaken ? 'Completed' : 'Pending'}
            </span>
          </div>
        </div>
      </div>

      {/* Cycle / Hormonal Spoon Impact Tracker */}
      <div className="p-4 rounded-2xl bg-[#1b1b25] border border-[#2c2c3a] shadow-sm flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#8f5fe8]">
            <span className="material-symbols-outlined text-[20px]">cycle</span>
            <h3 className="font-semibold text-[15px] text-[#f7f7fa]">
              Hormonal &amp; Executive Pacing
            </h3>
          </div>
          <span className="text-[11px] text-[#8f5fe8] font-semibold">ND Rhythm</span>
        </div>

        <p className="text-[12px] text-[#a8adb8]">
          Hormonal shifts often cause acute drops in dopamine and working memory. Pacing your demands to your cycle prevents burnout.
        </p>

        <div className="grid grid-cols-1 gap-1.5 mt-1">
          {[
            'Luteal (Low Executive Spoons)',
            'Follicular (High Flow)',
            'Recovery / HRT',
          ].map((phase) => (
            <button
              key={phase}
              type="button"
              onClick={() => setCyclePhase(phase as any)}
              className={`p-2.5 rounded-xl text-[13px] font-medium text-left flex items-center justify-between transition-colors ${
                cyclePhase === phase
                  ? 'bg-[#5e6ad2]/20 border border-[#5e6ad2] text-white'
                  : 'bg-[#1f1f2e] text-[#a8adb8] hover:bg-[#252536]'
              }`}
            >
              <span>{phase}</span>
              {cyclePhase === phase && (
                <span className="material-symbols-outlined text-[18px] text-[#49e095]">
                  check
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
