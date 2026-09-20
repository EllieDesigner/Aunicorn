import React, { useState } from 'react';
import { UserProfile, TaskBreakdown, ChoreItem, SpoonLevel } from '../types';
import { sensoryAudio } from '../utils/audio';

interface DashboardViewProps {
  userProfile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
  taskBreakdown: TaskBreakdown;
  onUpdateBreakdown: (breakdown: TaskBreakdown) => void;
  chores: ChoreItem[];
  onNavigateToActivities: () => void;
  onOpenSensoryReset: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  userProfile,
  onUpdateProfile,
  taskBreakdown,
  onUpdateBreakdown,
  chores,
  onNavigateToActivities,
  onOpenSensoryReset,
}) => {
  const [unstickContext, setUnstickContext] = useState('');
  const [unstickResult, setUnstickResult] = useState<{ affirmation: string; actionTip: string } | null>(null);
  const [unstickLoading, setUnstickLoading] = useState(false);

  // Active micro-step for ADHD single-focus mode
  const activeStep =
    taskBreakdown.steps.find((s) => s.status === 'ongoing') ||
    taskBreakdown.steps.find((s) => s.status === 'pendant') ||
    taskBreakdown.steps[0];

  const handleCompleteActiveStep = () => {
    if (!activeStep) return;
    if (userProfile.soundEnabled) {
      sensoryAudio.playGentleChime();
    }
    const updated = taskBreakdown.steps.map((s) => {
      if (s.id === activeStep.id) {
        return { ...s, status: 'done' as const };
      }
      return s;
    });
    // Set next pendant to ongoing
    const nextPendingIndex = updated.findIndex((s) => s.status === 'pendant');
    if (nextPendingIndex !== -1) {
      updated[nextPendingIndex].status = 'ongoing';
    }
    onUpdateBreakdown({ ...taskBreakdown, steps: updated });
  };

  const handleUnstickMe = async () => {
    setUnstickLoading(true);
    try {
      const res = await fetch('/api/gemini/unstick', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          feeling: 'executive paralysis or hesitation',
          context: unstickContext || 'Stuck on starting or feeling low dopamine',
        }),
      });
      const data = await res.json();
      setUnstickResult(data);
    } catch {
      setUnstickResult({
        affirmation: 'You do not have to earn your rest. Your nervous system is recalibrating.',
        actionTip: 'Take a sip of water, stretch your fingers, and do just 30 seconds of gentle motion.',
      });
    } finally {
      setUnstickLoading(false);
    }
  };

  const pendingChores = chores.filter((c) => c.status !== 'done').length;

  return (
    <div className="flex flex-col w-full px-4 py-3 space-y-4 max-w-md mx-auto">
      {/* Welcome Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-[#1f1d2e] via-[#1b1b25] to-[#12121c] border border-[#2c2c3a] flex flex-col gap-2 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-[12px] font-semibold text-[#8f5fe8] uppercase tracking-wider">
            Morning Check-In
          </span>
          <span className="text-[11px] text-[#49e095] bg-[#49e095]/10 px-2 py-0.5 rounded-full border border-[#49e095]/20">
            Neuro-Affirming Space
          </span>
        </div>

        <h2 className="text-[20px] font-bold text-[#f7f7fa] leading-snug">
          Hello {userProfile.name}, what pace feels safe today?
        </h2>

        <p className="text-[13px] text-[#a8adb8]">
          No performance metrics. No shame for low energy. Just gentle support.
        </p>

        {/* Quick Spoons Meter */}
        <div className="mt-2 pt-2.5 border-t border-[#2c2c3a] flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-medium text-[#c6c5d5]">
              Energy &amp; Capacity ({userProfile.spoons}/5 Spoons)
            </span>
            <span className="text-[12px] text-[#00c2ff] font-semibold">
              {userProfile.spoons <= 2
                ? 'Gentle Recovery'
                : userProfile.spoons === 3
                ? 'Steady Flow'
                : 'High Focus'}
            </span>
          </div>

          <div className="grid grid-cols-5 gap-1.5">
            {([1, 2, 3, 4, 5] as SpoonLevel[]).map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => onUpdateProfile({ ...userProfile, spoons: level })}
                className={`h-9 rounded-lg font-semibold text-[13px] flex items-center justify-center transition-all ${
                  userProfile.spoons === level
                    ? 'bg-[#5e6ad2] text-white shadow-sm border border-[#6e79d6]'
                    : level <= userProfile.spoons
                    ? 'bg-[#1f1f2e] text-[#bdc2ff] border border-[#2c2c3a]'
                    : 'bg-[#161620] text-[#a8adb8] border border-[#22222f]'
                }`}
              >
                🥄 {level}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ADHD Mono-Focus: Single Immediate Step */}
      <div className="p-4 rounded-2xl bg-[#1b1b25] border border-[#8f5fe8]/30 shadow-sm flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-[#8f5fe8]">
              adjust
            </span>
            <span className="text-[13px] font-bold text-[#f7f7fa] uppercase tracking-wider">
              Today's Priority Micro-Anchor
            </span>
          </div>
          <span className="text-[11px] font-semibold text-[#8f5fe8] bg-[#8f5fe8]/15 px-2 py-0.5 rounded-full">
            ADHD Single-Track
          </span>
        </div>

        {activeStep ? (
          <div className="p-3.5 rounded-xl bg-[#1f1f2e] border border-[#2c2c3a] flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-[#00c2ff] bg-[#00c2ff]/10 px-2 py-0.5 rounded">
                Target: {taskBreakdown.originalTask}
              </span>
              <span className="text-[11px] text-[#a8adb8]">
                {activeStep.duration}
              </span>
            </div>

            <p className="text-[16px] font-semibold text-[#f7f7fa] leading-snug">
              {activeStep.title}
            </p>

            <span className="text-[12px] text-[#49e095] flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">spa</span>
              {activeStep.sensoryTip}
            </span>

            <div className="flex items-center gap-2 mt-1">
              <button
                type="button"
                onClick={handleCompleteActiveStep}
                className="flex-1 h-10 rounded-xl bg-[#008551] hover:bg-[#00995c] text-white font-semibold text-[13px] flex items-center justify-center gap-1.5 transition-colors shadow-sm"
              >
                <span className="material-symbols-outlined text-[18px]">check</span>
                <span>Complete This Micro-Step</span>
              </button>

              <button
                type="button"
                onClick={onNavigateToActivities}
                className="h-10 px-3.5 rounded-xl bg-[#292933] hover:bg-[#34343f] text-[#f7f7fa] font-medium text-[13px] flex items-center justify-center transition-colors"
              >
                View Deck
              </button>
            </div>
          </div>
        ) : (
          <div className="p-3 rounded-xl bg-[#1f1f2e] text-center text-[13px] text-[#a8adb8]">
            All current micro-steps complete! Rest or slice another task in Activities.
          </div>
        )}
      </div>

      {/* Gentle Continuity / Streak Without Guilt */}
      <div className="p-4 rounded-2xl bg-[#1b1b25] border border-[#2c2c3a] shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#49e095]/15 border border-[#49e095]/30 flex items-center justify-center text-[#49e095]">
            <span className="material-symbols-outlined text-[22px]">favorite</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[15px] text-[#f7f7fa]">
                5 Mindful Days
              </span>
              <span className="text-[11px] text-[#49e095] bg-[#49e095]/15 px-2 py-0.5 rounded-full font-semibold">
                Guilt-Free
              </span>
            </div>
            <span className="text-[12px] text-[#a8adb8]">
              Pauses are valid. Rest days never reset your continuity.
            </span>
          </div>
        </div>
      </div>

      {/* LGBTQ+ & Neurodivergent Affirming Spark */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-[#20172e] via-[#181d2c] to-[#121922] border border-[#8f5fe8]/25 shadow-sm flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[#bdc2ff]">
            <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
            <span className="text-[12px] font-bold uppercase tracking-wider">
              Queer &amp; Neurodivergent Spark
            </span>
          </div>
          <span className="text-[11px] text-[#bdc2ff]">Daily truth</span>
        </div>
        <p className="text-[14px] text-[#e3e1ef] italic leading-relaxed">
          "Unmasking is brave. Your sensory needs, your gender euphoria, and your neurotype are not flaws to fix. You belong here exactly as you are."
        </p>
      </div>

      {/* AI Unstick Engine (Emergency Co-Regulation) */}
      <div className="p-4 rounded-2xl bg-[#1b1b25] border border-[#2c2c3a] shadow-sm flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#00c2ff]">
            <span className="material-symbols-outlined text-[20px]">psychology</span>
            <h3 className="font-semibold text-[15px] text-[#f7f7fa]">
              Executive Freeze Unsticker
            </h3>
          </div>
          <span className="text-[11px] text-[#4cd6fb] bg-[#1f1f2e] px-2 py-0.5 rounded-full border border-[#4cd6fb]/20">
            AI Co-Reg
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <input
            type="text"
            value={unstickContext}
            onChange={(e) => setUnstickContext(e.target.value)}
            placeholder="What feels impossible to start right now?..."
            className="h-11 rounded-xl bg-[#1f1f2e] border border-[#4a4a62] px-3 text-[#f7f7fa] text-[14px] focus:outline-none focus:border-[#5e6ad2]"
          />
          <button
            type="button"
            onClick={handleUnstickMe}
            disabled={unstickLoading}
            className="h-10 rounded-xl bg-[#1f1f2e] hover:bg-[#252536] border border-[#00c2ff]/40 text-[#00c2ff] font-semibold text-[13px] flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
          >
            <span className="material-symbols-outlined text-[18px]">
              {unstickLoading ? 'hourglass_top' : 'support_agent'}
            </span>
            <span>{unstickLoading ? 'Co-regulating...' : 'Unstick Me With Compassion'}</span>
          </button>
        </div>

        {unstickResult && (
          <div className="p-3 rounded-xl bg-[#1f1f2e] border border-[#00c2ff]/30 flex flex-col gap-1.5 animate-in fade-in">
            <p className="text-[13px] text-[#e3e1ef] leading-relaxed italic">
              "{unstickResult.affirmation}"
            </p>
            <div className="pt-1.5 border-t border-[#2c2c3a] flex items-center gap-2 text-[12px] text-[#49e095] font-medium">
              <span className="material-symbols-outlined text-[16px]">arrow_right_alt</span>
              <span>{unstickResult.actionTip}</span>
            </div>
          </div>
        )}
      </div>

      {/* Quick Access Grid */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={onOpenSensoryReset}
          className="p-3.5 rounded-xl bg-[#1f1f2e] hover:bg-[#252536] border border-[#2c2c3a] flex flex-col gap-1 text-left transition-colors"
        >
          <span className="material-symbols-outlined text-[22px] text-[#00c2ff]">
            filter_vintage
          </span>
          <span className="font-semibold text-[14px] text-[#f7f7fa]">
            Sensory Reset
          </span>
          <span className="text-[11px] text-[#a8adb8]">
            Breath &amp; brown noise
          </span>
        </button>

        <button
          type="button"
          onClick={onNavigateToActivities}
          className="p-3.5 rounded-xl bg-[#1f1f2e] hover:bg-[#252536] border border-[#2c2c3a] flex flex-col gap-1 text-left transition-colors"
        >
          <span className="material-symbols-outlined text-[22px] text-[#f0c000]">
            cleaning_services
          </span>
          <span className="font-semibold text-[14px] text-[#f7f7fa]">
            Chores ({pendingChores})
          </span>
          <span className="text-[11px] text-[#a8adb8]">
            Low-friction routines
          </span>
        </button>
      </div>
    </div>
  );
};
