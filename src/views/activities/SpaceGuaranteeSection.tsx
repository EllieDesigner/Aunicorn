import React from 'react';

interface SpaceGuaranteeSectionProps {
  onOpenPreferences: () => void;
}

export const SpaceGuaranteeSection: React.FC<SpaceGuaranteeSectionProps> = ({
  onOpenPreferences,
}) => {
  return (
    <div className="flex flex-col p-4 sm:p-5 rounded-2xl bg-[#1b1b25] border border-[#49e095]/30 shadow-sm space-y-4">
      <div className="flex items-center gap-2.5 text-[#49e095]">
        <div className="w-9 h-9 rounded-xl bg-[#49e095]/15 border border-[#49e095]/30 flex items-center justify-center text-[#49e095]">
          <span className="material-symbols-outlined text-[20px]">verified_user</span>
        </div>
        <div>
          <h3 className="font-semibold text-[17px] text-[#f7f7fa]">
            Gentle Space Guarantee
          </h3>
          <span className="text-[12px] text-[#a8adb8]">Privacy &amp; Neuro-Safe Safeguards</span>
        </div>
      </div>

      <div className="p-3.5 rounded-xl bg-[#1f1f2e] border border-[#2c2c3a] flex flex-col gap-2">
        <div className="flex items-center gap-2 text-[#4cd6fb]">
          <span className="material-symbols-outlined text-[18px]">lock</span>
          <span className="text-[14px] font-semibold text-[#f7f7fa]">
            100% Local Device Sandbox
          </span>
        </div>
        <p className="text-[14px] text-[#a8adb8] leading-relaxed">
          No broken streaks. No guilt notifications. All task, timer, and energy data remains 100% contained in your browser device storage.
        </p>
      </div>

      <div className="flex flex-col gap-2.5">
        <span className="text-[12px] font-semibold text-[#a8adb8] uppercase tracking-wider">
          Protective Safeguards
        </span>

        <div className="flex items-center gap-2.5 text-[14px] text-[#e3e1ef]">
          <span className="material-symbols-outlined text-[#49e095] text-[20px]">
            check_circle
          </span>
          <span>Zero pressure: resting and hiatuses are valid &amp; honored</span>
        </div>

        <div className="flex items-center gap-2.5 text-[14px] text-[#e3e1ef]">
          <span className="material-symbols-outlined text-[#49e095] text-[20px]">
            check_circle
          </span>
          <span>Configurable auto-purge of archived tasks (6 months / 1 year)</span>
        </div>

        <div className="flex items-center gap-2.5 text-[14px] text-[#e3e1ef]">
          <span className="material-symbols-outlined text-[#49e095] text-[20px]">
            check_circle
          </span>
          <span>Full export &amp; JSON backup under your total control</span>
        </div>
      </div>

      <button
        type="button"
        onClick={onOpenPreferences}
        className="w-full h-11 rounded-xl bg-[#1f1f2e] hover:bg-[#252536] border border-[#2c2c3a] text-[#bdc2ff] text-[13px] font-semibold flex items-center justify-center gap-2 transition-colors mt-2"
      >
        <span className="material-symbols-outlined text-[18px]">tune</span>
        <span>Manage Storage &amp; Privacy Settings</span>
      </button>
    </div>
  );
};
