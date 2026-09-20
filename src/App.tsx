import React, { useState, useEffect } from 'react';
import { ActiveTab, UserProfile, TaskBreakdown, ChoreItem, LifeReminder } from './types';
import { storage } from './utils/storage';
import { Header } from './components/Header';
import { SideDrawer } from './components/SideDrawer';
import { BottomNav } from './components/BottomNav';
import { SensoryResetModal } from './components/SensoryResetModal';
import { PreferencesModal } from './components/PreferencesModal';
import { ActivitiesView } from './views/ActivitiesView';
import { DashboardView } from './views/DashboardView';
import { HealthAreaView } from './views/HealthAreaView';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('activities-area');
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isSensoryResetOpen, setIsSensoryResetOpen] = useState<boolean>(false);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState<boolean>(false);

  // Core persistent data
  const [userProfile, setUserProfile] = useState<UserProfile>(() => storage.getProfile());
  const [taskBreakdown, setTaskBreakdown] = useState<TaskBreakdown>(() => storage.getTaskBreakdown());
  const [chores, setChores] = useState<ChoreItem[]>(() => storage.getChores());
  const [reminders, setReminders] = useState<LifeReminder[]>(() => storage.getReminders());

  // Save changes to storage
  const handleUpdateProfile = (newProfile: UserProfile) => {
    setUserProfile(newProfile);
    storage.saveProfile(newProfile);
  };

  const handleUpdateBreakdown = (newBreakdown: TaskBreakdown) => {
    setTaskBreakdown(newBreakdown);
    storage.saveTaskBreakdown(newBreakdown);
  };

  const handleUpdateChores = (newChores: ChoreItem[]) => {
    setChores(newChores);
    storage.saveChores(newChores);
  };

  const handleUpdateReminders = (newReminders: LifeReminder[]) => {
    setReminders(newReminders);
    storage.saveReminders(newReminders);
  };

  // Toggle low-stim mode
  const handleToggleLowStim = (enabled: boolean) => {
    const updated = { ...userProfile, lowStimMode: enabled };
    handleUpdateProfile(updated);
  };

  // Toast notice for gentle notifications & plus features
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Plus notification helper
  const handleOpenPlusFeature = (name: string) => {
    showToast(`${name} is ready and included in your Aunicorn local kit.`);
  };

  const handleOpenNotifications = () => {
    showToast('Gentle Notifications: Push reminders are gentle, sensory-safe, and never produce guilt streaks.');
  };

  return (
    <div
      className={`min-h-screen flex flex-col bg-[#101014] text-[#e3e1ef] font-sans ${
        userProfile.lowStimMode ? 'contrast-90' : ''
      }`}
    >
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        onOpenDrawer={() => setIsDrawerOpen(true)}
        onOpenSensoryReset={() => setIsSensoryResetOpen(true)}
        onOpenPreferences={() => setIsPreferencesOpen(true)}
      />

      {/* Side Drawer */}
      <SideDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        userProfile={userProfile}
        onOpenSensoryReset={() => setIsSensoryResetOpen(true)}
        onOpenPreferences={() => setIsPreferencesOpen(true)}
        onOpenNotifications={handleOpenNotifications}
        onOpenPlusFeature={handleOpenPlusFeature}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full pt-16 pb-24 max-w-lg mx-auto overflow-x-hidden">
        {activeTab === 'activities-area' && (
          <ActivitiesView
            userProfile={userProfile}
            onUpdateProfile={handleUpdateProfile}
            taskBreakdown={taskBreakdown}
            onUpdateBreakdown={handleUpdateBreakdown}
            chores={chores}
            onUpdateChores={handleUpdateChores}
            reminders={reminders}
            onUpdateReminders={handleUpdateReminders}
            onOpenPreferences={() => setIsPreferencesOpen(true)}
          />
        )}

        {activeTab === 'dashboard' && (
          <DashboardView
            userProfile={userProfile}
            onUpdateProfile={handleUpdateProfile}
            taskBreakdown={taskBreakdown}
            onUpdateBreakdown={handleUpdateBreakdown}
            chores={chores}
            onNavigateToActivities={() => setActiveTab('activities-area')}
            onOpenSensoryReset={() => setIsSensoryResetOpen(true)}
          />
        )}

        {activeTab === 'health-area' && (
          <HealthAreaView
            userProfile={userProfile}
            onOpenSensoryReset={() => setIsSensoryResetOpen(true)}
          />
        )}
      </main>

      {/* Bottom Nav Bar */}
      <BottomNav activeTab={activeTab} onSelectTab={setActiveTab} />

      {/* Sensory Reset Modal */}
      <SensoryResetModal
        isOpen={isSensoryResetOpen}
        onClose={() => setIsSensoryResetOpen(false)}
        onToggleLowStim={handleToggleLowStim}
        isLowStim={userProfile.lowStimMode}
      />

      {/* App Preferences & Sensory Profile Modal */}
      <PreferencesModal
        isOpen={isPreferencesOpen}
        onClose={() => setIsPreferencesOpen(false)}
        userProfile={userProfile}
        onSaveProfile={handleUpdateProfile}
      />

      {/* Gentle Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 inset-x-4 max-w-sm mx-auto z-50 p-3 rounded-xl bg-[#1f1f2e] border border-[#00c2ff]/40 text-[#f7f7fa] text-[13px] shadow-[0_8px_24px_rgba(0,0,0,0.6)] flex items-center gap-2.5 animate-in fade-in slide-in-from-top-2">
          <span className="material-symbols-outlined text-[20px] text-[#00c2ff] shrink-0">
            notifications_active
          </span>
          <span className="flex-1">{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-[#a8adb8] hover:text-white"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      )}
    </div>
  );
}
