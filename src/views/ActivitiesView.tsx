import React, { useState } from 'react';
import {
  ActivitySubSection,
  TaskBreakdown,
  ChoreItem,
  LifeReminder,
  UserProfile,
  SpoonLevel,
} from '../types';
import { TaskBreakdownSection } from './activities/TaskBreakdownSection';
import { FocusTimerSection } from './activities/FocusTimerSection';
import { ChoresChecklistSection } from './activities/ChoresChecklistSection';
import { LifeChecklistSection } from './activities/LifeChecklistSection';
import { SpaceGuaranteeSection } from './activities/SpaceGuaranteeSection';

interface ActivitiesViewProps {
  userProfile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
  taskBreakdown: TaskBreakdown;
  onUpdateBreakdown: (breakdown: TaskBreakdown) => void;
  chores: ChoreItem[];
  onUpdateChores: (chores: ChoreItem[]) => void;
  reminders: LifeReminder[];
  onUpdateReminders: (reminders: LifeReminder[]) => void;
  onOpenPreferences: () => void;
}

export const ActivitiesView: React.FC<ActivitiesViewProps> = ({
  userProfile,
  onUpdateProfile,
  taskBreakdown,
  onUpdateBreakdown,
  chores,
  onUpdateChores,
  reminders,
  onUpdateReminders,
  onOpenPreferences,
}) => {
  const [activeSection, setActiveSection] = useState<ActivitySubSection>('overview');

  const completedSteps = taskBreakdown.steps.filter((s) => s.status === 'done').length;
  const totalSteps = taskBreakdown.steps.length;
  const pendingReminders = reminders.filter((r) => r.status !== 'done').length;

  const cycleSpoons = () => {
    const nextSpoon = ((userProfile.spoons % 5) + 1) as SpoonLevel;
    onUpdateProfile({ ...userProfile, spoons: nextSpoon });
  };

  const getSpoonLabel = (s: SpoonLevel) => {
    switch (s) {
      case 1:
        return 'Critical Low (1/5)';
      case 2:
        return 'Gentle Pace (2/5)';
      case 3:
        return 'Moderate (3/5)';
      case 4:
        return 'Energized (4/5)';
      case 5:
        return 'Hyperfocus (5/5)';
    }
  };

  const getSpoonSubtext = (s: SpoonLevel) => {
    switch (s) {
      case 1:
        return 'Bare minimum survival mode engaged • Full permission to rest';
      case 2:
        return 'Low executive load mode engaged • Micro tasks only';
      case 3:
        return 'Steady gentle flow mode engaged';
      case 4:
        return 'Good momentum capacity available';
      case 5:
        return 'High energy flow • Remember to hydrate & eat';
    }
  };

  return (
    <div className="flex flex-col w-full px-4 py-3 space-y-4 max-w-md mx-auto">
      {/* If inside a detail section, show persistent Back button */}
      {activeSection !== 'overview' && (
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              setActiveSection('overview');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="h-11 px-3.5 rounded-xl bg-[#1f1f2e] hover:bg-[#252536] border border-[#00c2ff]/30 text-[#00c2ff] flex items-center gap-2 font-semibold text-[14px] transition-colors focus:outline-none focus:ring-2 focus:ring-[#00c2ff]"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            <span>Back to all sections</span>
          </button>
          <span className="text-[12px] text-[#a8adb8] font-medium">Mosaic Deck</span>
        </div>
      )}

      {/* DETAIL SUB-SECTIONS */}
      {activeSection === 'section-task-breakdown' && (
        <TaskBreakdownSection
          taskBreakdown={taskBreakdown}
          onUpdateBreakdown={onUpdateBreakdown}
          soundEnabled={userProfile.soundEnabled}
        />
      )}

      {activeSection === 'section-focus-timer' && (
        <FocusTimerSection soundEnabled={userProfile.soundEnabled} />
      )}

      {activeSection === 'section-chores-checklist' && (
        <ChoresChecklistSection
          chores={chores}
          onUpdateChores={onUpdateChores}
          soundEnabled={userProfile.soundEnabled}
        />
      )}

      {activeSection === 'section-life-checklist' && (
        <LifeChecklistSection
          reminders={reminders}
          onUpdateReminders={onUpdateReminders}
          soundEnabled={userProfile.soundEnabled}
        />
      )}

      {activeSection === 'section-space-guarantee' && (
        <SpaceGuaranteeSection onOpenPreferences={onOpenPreferences} />
      )}

      {/* OVERVIEW MOSAIC DECK (When on main overview screen) */}
      {activeSection === 'overview' && (
        <>
          {/* Executive Flow Top Header */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-[#8f5fe8] uppercase tracking-wider font-bold">
                Executive Flow
              </span>
              <button
                type="button"
                onClick={cycleSpoons}
                title="Tap to adjust spoons baseline"
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#1f1f2e] border border-[#49e095]/30 text-[#49e095] hover:bg-[#252536] transition-colors"
              >
                <span className="w-2 h-2 rounded-full bg-[#49e095] animate-pulse"></span>
                <span className="text-[12px] font-semibold">Spoon Engine</span>
              </button>
            </div>

            <div className="flex flex-col">
              <h2 className="text-[24px] text-[#f7f7fa] font-bold tracking-tight">
                Activities &amp; Energy
              </h2>
              <p className="text-[15px] text-[#a8adb8] mt-0.5">
                Gentle momentum. Work with your brain, not against it.
              </p>
            </div>

            {/* Interactive Energy Baseline Badge */}
            <div
              onClick={cycleSpoons}
              className="p-3 rounded-xl bg-[#1b1b25] border border-[#2c2c3a] shadow-sm flex items-center justify-between mt-1 cursor-pointer hover:border-[#49e095]/40 transition-colors"
              title="Tap to cycle spoon level"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#1f1f2e] flex items-center justify-center text-[#4cd6fb] shrink-0">
                  <span className="material-symbols-outlined text-[20px]">
                    battery_horiz_075
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[14px] text-[#f7f7fa] font-semibold">
                    Spoons baseline: {getSpoonLabel(userProfile.spoons)}
                  </span>
                  <span className="text-[12px] text-[#a8adb8]">
                    {getSpoonSubtext(userProfile.spoons)}
                  </span>
                </div>
              </div>

              {/* Spoon indicators */}
              <div className="flex items-center gap-1 text-[#49e095]">
                {[1, 2, 3, 4, 5].map((level) => (
                  <span
                    key={level}
                    className={`w-1.5 rounded-full transition-all ${
                      level <= userProfile.spoons
                        ? 'bg-[#49e095]'
                        : 'bg-[#34343f]'
                    } ${
                      level === 1
                        ? 'h-3'
                        : level === 2
                        ? 'h-4'
                        : level === 3
                        ? 'h-5'
                        : level === 4
                        ? 'h-4'
                        : 'h-3'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Mosaic Deck Sections Header */}
          <div className="flex items-center justify-between px-1 pt-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-[17px] text-[#f7f7fa]">
                Activity Sections
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-[#1f1f2e] text-[#8f5fe8] text-[11px] font-semibold border border-[#8f5fe8]/30">
                Mosaic Deck
              </span>
            </div>
            <span className="text-[12px] text-[#a8adb8] flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px]">touch_app</span>
              Tap tile to enter
            </span>
          </div>

          {/* Mosaic Deck Grid */}
          <div className="grid grid-cols-2 gap-3">
            {/* Tile 1: Split Big Tasks (Hero Col-Span-2) */}
            <button
              type="button"
              id="tile-split-tasks"
              onClick={() => setActiveSection('section-task-breakdown')}
              className="col-span-2 w-full p-4 rounded-2xl bg-gradient-to-br from-[#23213a] to-[#191928] border border-[#8f5fe8]/30 hover:border-[#8f5fe8]/60 transition-all text-left flex flex-col justify-between relative overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.35)] group focus:outline-none focus:ring-2 focus:ring-[#5e6ad2]"
            >
              <div className="absolute -right-6 -bottom-6 w-28 h-28 rounded-full bg-[#8f5fe8]/10 blur-2xl pointer-events-none" />
              <div className="flex items-start justify-between w-full relative z-10">
                <div className="flex items-center gap-2.5">
                  <div className="w-11 h-11 rounded-xl bg-[#8f5fe8]/20 border border-[#8f5fe8]/30 flex items-center justify-center text-[#8f5fe8] shrink-0 shadow-sm">
                    <span className="material-symbols-outlined text-[24px]">
                      splitscreen
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[17px] text-[#f7f7fa] font-bold">
                        Split Big Tasks
                      </span>
                      <span className="text-[10px] uppercase tracking-wider font-semibold text-[#00c2ff] bg-[#292933]/90 px-2 py-0.5 rounded-full border border-[#00c2ff]/30">
                        AI Slice
                      </span>
                    </div>
                    <span className="text-[13px] text-[#a8adb8]">
                      Anti-Overwhelm Engine
                    </span>
                  </div>
                </div>

                <div className="w-8 h-8 rounded-full bg-[#1f1f2e] flex items-center justify-center text-[#a8adb8] group-hover:text-white group-hover:translate-x-0.5 transition-all">
                  <span className="material-symbols-outlined text-[18px]">
                    arrow_forward
                  </span>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-[#2c2c3a]/60 flex items-center justify-between w-full relative z-10">
                <p className="text-[12px] text-[#c6c5d5] line-clamp-1 pr-2">
                  Break daunting tasks into 3–5 tiny sensory-safe steps
                </p>
                <span className="px-2 py-0.5 rounded-md bg-[#008551]/30 text-[#49e095] text-[11px] font-semibold shrink-0 flex items-center gap-1 border border-[#49e095]/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#49e095]"></span>
                  {completedSteps}/{totalSteps} active
                </span>
              </div>
            </button>

            {/* Tile 2: Gentle Focus & Rest Timer (Col-Span-1) */}
            <button
              type="button"
              id="tile-focus-timer"
              onClick={() => setActiveSection('section-focus-timer')}
              className="col-span-1 p-3.5 rounded-2xl bg-gradient-to-b from-[#1b2233] to-[#141825] border border-[#00c2ff]/20 hover:border-[#00c2ff]/50 transition-all text-left flex flex-col justify-between relative overflow-hidden shadow-sm group focus:outline-none focus:ring-2 focus:ring-[#00c2ff] min-h-[148px]"
            >
              <div className="flex items-start justify-between w-full">
                <div className="w-10 h-10 rounded-xl bg-[#00c2ff]/15 border border-[#00c2ff]/30 flex items-center justify-center text-[#00c2ff] shrink-0">
                  <span className="material-symbols-outlined text-[22px]">
                    hourglass_top
                  </span>
                </div>
                <span className="text-[10px] text-[#4cd6fb] bg-[#1f1f2e] px-2 py-0.5 rounded-full border border-[#4cd6fb]/20">
                  Audio
                </span>
              </div>

              <div className="mt-3">
                <div className="flex items-center gap-1 text-[#00c2ff] text-[12px] font-semibold mb-0.5">
                  <span className="material-symbols-outlined text-[14px]">graphic_eq</span>
                  <span>Brown noise</span>
                </div>
                <span className="font-semibold text-[15px] leading-snug text-[#f7f7fa] block">
                  Focus &amp; Rest
                </span>
                <span className="text-[12px] text-[#a8adb8] block mt-0.5">
                  25m timer block
                </span>
              </div>
            </button>

            {/* Tile 3: Chores Checklist (Col-Span-1) */}
            <button
              type="button"
              id="tile-chores-checklist"
              onClick={() => setActiveSection('section-chores-checklist')}
              className="col-span-1 p-3.5 rounded-2xl bg-gradient-to-b from-[#26221c] to-[#1a1714] border border-[#f0c000]/20 hover:border-[#f0c000]/50 transition-all text-left flex flex-col justify-between relative overflow-hidden shadow-sm group focus:outline-none focus:ring-2 focus:ring-[#f0c000] min-h-[148px]"
            >
              <div className="flex items-start justify-between w-full">
                <div className="w-10 h-10 rounded-xl bg-[#f0c000]/15 border border-[#f0c000]/30 flex items-center justify-center text-[#f0c000] shrink-0">
                  <span className="material-symbols-outlined text-[22px]">
                    cleaning_services
                  </span>
                </div>
                <span className="text-[10px] text-[#f0c000] bg-[#1f1f2e] px-2 py-0.5 rounded-full border border-[#f0c000]/20">
                  Daily
                </span>
              </div>

              <div className="mt-3">
                <div className="flex items-center gap-1 text-[#f0c000] text-[12px] font-semibold mb-0.5">
                  <span className="material-symbols-outlined text-[14px]">schedule</span>
                  <span>3:30 PM push</span>
                </div>
                <span className="font-semibold text-[15px] leading-snug text-[#f7f7fa] block">
                  Chores List
                </span>
                <span className="text-[12px] text-[#a8adb8] block mt-0.5">
                  Low-friction home
                </span>
              </div>
            </button>

            {/* Tile 4: Life Checklist & Reminders (Col-Span-2) */}
            <button
              type="button"
              id="tile-life-checklist"
              onClick={() => setActiveSection('section-life-checklist')}
              className="col-span-2 w-full p-4 rounded-2xl bg-gradient-to-br from-[#1f1d2e] to-[#161523] border border-[#4a4a62] hover:border-[#8f5fe8]/50 transition-all text-left flex flex-col justify-between relative overflow-hidden shadow-sm group focus:outline-none focus:ring-2 focus:ring-[#5e6ad2]"
            >
              <div className="flex items-start justify-between w-full">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-[#8f5fe8]/20 border border-[#8f5fe8]/30 flex items-center justify-center text-[#8f5fe8] shrink-0">
                    <span className="material-symbols-outlined text-[22px]">
                      checklist
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[16px] text-[#f7f7fa]">
                        Life Checklist &amp; Reminders
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-[#008551]/30 text-[#49e095] text-[11px] font-semibold border border-[#49e095]/25">
                        {pendingReminders} left
                      </span>
                    </div>
                    <span className="text-[12px] text-[#a8adb8]">
                      Health, vet, errands &amp; auto-calendar
                    </span>
                  </div>
                </div>

                <div className="w-8 h-8 rounded-full bg-[#1f1f2e] flex items-center justify-center text-[#a8adb8] group-hover:text-white group-hover:translate-x-0.5 transition-all">
                  <span className="material-symbols-outlined text-[18px]">
                    chevron_right
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 mt-3 pt-2.5 border-t border-[#2c2c3a]/60 flex-wrap">
                <span className="px-2 py-0.5 rounded-md bg-[#292933] text-[#00c2ff] text-[11px] font-semibold">
                  Health
                </span>
                <span className="px-2 py-0.5 rounded-md bg-[#292933] text-[#8f5fe8] text-[11px] font-semibold">
                  Dr. Rivera Vet
                </span>
                <span className="px-2 py-0.5 rounded-md bg-[#292933] text-[#a8adb8] text-[11px]">
                  Grocery restock
                </span>
              </div>
            </button>

            {/* Tile 5: Gentle Space Guarantee (Col-Span-2 Banner) */}
            <button
              type="button"
              id="tile-space-guarantee"
              onClick={() => setActiveSection('section-space-guarantee')}
              className="col-span-2 w-full p-3.5 rounded-2xl bg-gradient-to-r from-[#17251d] to-[#141b24] border border-[#49e095]/30 hover:border-[#49e095]/60 transition-all text-left flex items-center justify-between gap-3 shadow-sm group focus:outline-none focus:ring-2 focus:ring-[#49e095]"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-[#49e095]/15 border border-[#49e095]/30 flex items-center justify-center text-[#49e095] shrink-0">
                  <span className="material-symbols-outlined text-[20px]">
                    verified_user
                  </span>
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[14px] text-[#f7f7fa] truncate">
                      Gentle Space Guarantee
                    </span>
                    <span className="px-2 py-0.2 rounded-full bg-[#1f1f2e] text-[#49e095] text-[10px] font-semibold border border-[#49e095]/20">
                      Encrypted
                    </span>
                  </div>
                  <span className="text-[12px] text-[#a8adb8] truncate">
                    No guilt streaks • 100% on-device local storage
                  </span>
                </div>
              </div>
              <span className="material-symbols-outlined text-[#49e095] text-[18px] shrink-0 group-hover:translate-x-0.5 transition-all">
                chevron_right
              </span>
            </button>
          </div>

          {/* Affirming Neurodivergent Footer Note */}
          <footer className="p-3.5 rounded-xl bg-[#292933]/70 border border-[#2c2c3a] flex flex-col gap-1 text-center items-center mt-2 mb-4">
            <div className="flex items-center gap-1.5 text-[#4cd6fb]">
              <span className="material-symbols-outlined text-[16px]">
                verified_user
              </span>
              <span className="text-[13px] font-semibold text-[#f7f7fa]">
                Gentle Space Guarantee
              </span>
            </div>
            <p className="text-[12px] text-[#a8adb8] max-w-xs leading-relaxed">
              No broken streaks. No guilt notifications. All task data remains 100% encrypted in your local device sandbox.
            </p>
          </footer>
        </>
      )}
    </div>
  );
};
