import React from 'react';
import { ActiveTab } from '../types';

interface BottomNavProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onSelectTab }) => {
  const tabs: { id: ActiveTab; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: 'space_dashboard' },
    { id: 'health-area', label: 'Health Area', icon: 'cardiology' },
    { id: 'activities-area', label: 'Activities', icon: 'auto_awesome' },
  ];

  return (
    <nav
      aria-label="Main application tabs"
      className="fixed bottom-0 inset-x-0 z-40 bg-[#12121c]/90 backdrop-blur-xl border-t border-[#2c2c3a] shadow-[0_-4px_16px_rgba(0,0,0,0.45)]"
    >
      <div className="flex justify-around items-center h-20 px-3 max-w-lg mx-auto pb-safe">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              id={`nav-tab-${tab.id}`}
              onClick={() => onSelectTab(tab.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`flex flex-col items-center justify-center gap-1 w-24 h-14 transition-all focus:outline-none focus:ring-2 focus:ring-[#5e6ad2] ${
                isActive
                  ? 'text-[#bdc2ff] bg-[#1f1f2e] rounded-xl border border-[#5e6ad2]/40 shadow-inner'
                  : 'text-[#a8adb8] hover:text-[#f7f7fa] hover:bg-[#1f1f2e]/50 rounded-xl'
              }`}
            >
              <span className="material-symbols-outlined text-[24px]">
                {tab.icon}
              </span>
              <span className="text-[13px] font-semibold tracking-wide">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
