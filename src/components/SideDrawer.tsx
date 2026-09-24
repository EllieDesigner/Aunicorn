import React from 'react';
import { ActiveTab, UserProfile } from '../types';

interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  userProfile: UserProfile;
  onOpenSensoryReset: () => void;
  onOpenPreferences: () => void;
  onOpenNotifications: () => void;
  onOpenPlusFeature: (featureName: string) => void;
}

export const SideDrawer: React.FC<SideDrawerProps> = ({
  isOpen,
  onClose,
  activeTab,
  onSelectTab,
  userProfile,
  onOpenSensoryReset,
  onOpenPreferences,
  onOpenNotifications,
  onOpenPlusFeature,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-label="Close menu backdrop"
      />

      {/* Drawer Body */}
      <aside className="relative w-80 max-w-[85vw] bg-[#1b1b25] border-r border-[#2c2c3a] shadow-[0_16px_36px_rgba(0,0,0,0.7)] flex flex-col h-full z-10 overflow-y-auto animate-in slide-in-from-left duration-200">
        {/* Top Header */}
        <div className="p-4 bg-[#1f1f29] border-b border-[#2c2c3a] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img
              alt="Aunicorn logo"
              className="h-8 w-auto object-contain"
              src="/assets/aunicorn-logo.svg"
              referrerPolicy="no-referrer"
            />
            <div className="flex flex-col">
              <span className="font-bold text-[17px] text-[#f7f7fa] tracking-wide">
                Aunicorn
              </span>
              <span className="text-[12px] text-[#a8adb8]">
                Executive Flow &amp; Sensory Safe
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="w-10 h-10 flex items-center justify-center rounded-lg text-[#c6c5d5] hover:text-white hover:bg-[#1f1f2e] transition-colors focus:outline-none focus:ring-2 focus:ring-[#5e6ad2]"
          >
            <span className="material-symbols-outlined text-[24px]">close</span>
          </button>
        </div>

        {/* User Card */}
        <div className="px-4 py-3 bg-[#1f1f2e] mx-4 mt-4 rounded-xl flex items-center gap-3 border border-[#2c2c3a]">
          <div className="w-10 h-10 rounded-full bg-[#5e6ad2] flex items-center justify-center text-white shrink-0 shadow-sm">
            <span className="material-symbols-outlined text-[20px]">person</span>
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-[15px] text-[#f7f7fa] truncate">
                {userProfile.name}
              </span>
              <span className="text-[11px] text-[#bdc2ff] bg-[#5e6ad2]/20 px-1.5 py-0.5 rounded">
                {userProfile.pronouns}
              </span>
            </div>
            <span className="text-[12px] text-[#49e095] flex items-center gap-1 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-[#49e095]"></span>
              {userProfile.stateText}
            </span>
          </div>
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 px-4 py-4 flex flex-col gap-5">
          {/* Life Areas */}
          <div className="flex flex-col gap-1">
            <span className="text-[12px] font-semibold text-[#a8adb8] uppercase px-1 tracking-wider">
              Life Areas
            </span>
            <button
              type="button"
              onClick={() => {
                onSelectTab('dashboard');
                onClose();
              }}
              className={`flex items-center gap-3 h-12 px-3 rounded-xl transition-colors text-left ${
                activeTab === 'dashboard'
                  ? 'bg-[#1f1f2e] text-white font-semibold border border-[#8f5fe8]/30'
                  : 'text-[#e3e1ef] hover:bg-[#1f1f2e]'
              }`}
            >
              <span className="material-symbols-outlined text-[22px] text-[#8f5fe8]">
                space_dashboard
              </span>
              <span className="text-[15px]">Dashboard</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onSelectTab('health-area');
                onClose();
              }}
              className={`flex items-center gap-3 h-12 px-3 rounded-xl transition-colors text-left ${
                activeTab === 'health-area'
                  ? 'bg-[#1f1f2e] text-white font-semibold border border-[#00c2ff]/30'
                  : 'text-[#e3e1ef] hover:bg-[#1f1f2e]'
              }`}
            >
              <span className="material-symbols-outlined text-[22px] text-[#00c2ff]">
                cardiology
              </span>
              <span className="text-[15px]">Health Area</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onSelectTab('activities-area');
                onClose();
              }}
              className={`flex items-center gap-3 h-12 px-3 rounded-xl transition-colors text-left ${
                activeTab === 'activities-area'
                  ? 'bg-[#1f1f2e] text-white font-semibold border border-[#49e095]/30'
                  : 'text-[#e3e1ef] hover:bg-[#1f1f2e]'
              }`}
            >
              <span className="material-symbols-outlined text-[22px] text-[#49e095]">
                auto_awesome
              </span>
              <span className="text-[15px]">Activities Area</span>
            </button>
          </div>

          {/* Settings & Profile */}
          <div className="flex flex-col gap-1">
            <span className="text-[12px] font-semibold text-[#a8adb8] uppercase px-1 tracking-wider">
              Settings &amp; Profile
            </span>
            <button
              type="button"
              onClick={() => {
                onOpenNotifications();
                onClose();
              }}
              className="flex items-center gap-3 h-11 px-3 rounded-xl text-[#e3e1ef] hover:bg-[#1f1f2e] transition-colors text-left"
            >
              <span className="material-symbols-outlined text-[20px] text-[#c6c5d5]">
                notifications_active
              </span>
              <span className="text-[14px]">Manage Notifications</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onOpenPreferences();
                onClose();
              }}
              className="flex items-center gap-3 h-11 px-3 rounded-xl text-[#e3e1ef] hover:bg-[#1f1f2e] transition-colors text-left"
            >
              <span className="material-symbols-outlined text-[20px] text-[#c6c5d5]">
                tune
              </span>
              <span className="text-[14px]">App Preferences &amp; Sensory Mode</span>
            </button>
          </div>

          {/* 100% Local Device Storage Card */}
          <div className="p-3.5 rounded-xl bg-[#292933]/70 border border-[#2c2c3a] flex flex-col gap-1.5">
            <div className="flex items-center gap-2 text-[#4cd6fb]">
              <span className="material-symbols-outlined text-[18px]">verified_user</span>
              <span className="text-[13px] font-semibold text-[#f7f7fa]">
                100% Local Device Storage
              </span>
            </div>
            <p className="text-[12px] text-[#a8adb8] leading-relaxed">
              All tasks, timers, and energy data remain safely stored in your local device sandbox. No cloud surveillance or tracking.
            </p>
          </div>

          {/* Aunicorn Plus Features */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between px-1">
              <span className="text-[12px] font-semibold text-[#8f5fe8] uppercase tracking-wider">
                Aunicorn Safe Kit
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#5e6ad2] text-white text-[11px] font-semibold">
                Active
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                onOpenSensoryReset();
                onClose();
              }}
              className="flex items-center gap-3 h-11 px-3 rounded-xl text-[#e3e1ef] hover:bg-[#1f1f2e] transition-colors text-left"
            >
              <span className="material-symbols-outlined text-[20px] text-[#4cd6fb]">
                self_improvement
              </span>
              <span className="text-[14px]">Calming Zone (Breath, Audio)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onOpenPlusFeature('Plus Health (Glucose & Vitals)');
                onClose();
              }}
              className="flex items-center gap-3 h-11 px-3 rounded-xl text-[#e3e1ef] hover:bg-[#1f1f2e] transition-colors text-left"
            >
              <span className="material-symbols-outlined text-[20px] text-[#eb5757]">
                water_drop
              </span>
              <span className="text-[14px]">Plus Health (Cycle &amp; Vitals)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onOpenPlusFeature('Monthly Bill Tracker');
                onClose();
              }}
              className="flex items-center gap-3 h-11 px-3 rounded-xl text-[#e3e1ef] hover:bg-[#1f1f2e] transition-colors text-left"
            >
              <span className="material-symbols-outlined text-[20px] text-[#f0c000]">
                receipt_long
              </span>
              <span className="text-[14px]">Finance &amp; Bill Auto-Keeper</span>
            </button>
          </div>
        </div>

        {/* Emergency Sensory Reset Button */}
        <div className="p-4 bg-[#1f1f29] border-t border-[#2c2c3a] mt-auto">
          <button
            type="button"
            onClick={() => {
              onOpenSensoryReset();
              onClose();
            }}
            className="h-12 w-full flex items-center justify-center gap-2 rounded-xl bg-[#1f1f2e] border border-[#00c2ff]/40 text-[#00c2ff] hover:bg-[#252536] transition-all font-semibold text-[15px] focus:outline-none focus:ring-2 focus:ring-[#00c2ff]"
          >
            <span className="material-symbols-outlined text-[20px]">filter_vintage</span>
            <span>Emergency Sensory Reset</span>
          </button>
        </div>
      </aside>
    </div>
  );
};
