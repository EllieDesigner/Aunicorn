import React, { useState } from 'react';
import { UserProfile } from '../types';
import { storage } from '../utils/storage';

interface PreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onSaveProfile: (profile: UserProfile) => void;
}

export const PreferencesModal: React.FC<PreferencesModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onSaveProfile,
}) => {
  const [formData, setFormData] = useState<UserProfile>(userProfile);
  const [importNotice, setImportNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSave = () => {
    storage.saveProfile(formData);
    onSaveProfile(formData);
    onClose();
  };

  const handleExport = () => {
    const json = storage.exportAllData();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aunicorn-safe-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = storage.importData(content);
      if (success) {
        setImportNotice('Data restored successfully! Refreshing view...');
        setTimeout(() => {
          window.location.reload();
        }, 1200);
      } else {
        setImportNotice('Invalid backup file format.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div
        className="w-full max-w-md bg-[#161622] border border-[#2c2c3a] rounded-2xl p-5 shadow-2xl flex flex-col gap-4 max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between border-b border-[#2c2c3a] pb-3">
          <div className="flex items-center gap-2 text-[#8f5fe8]">
            <span className="material-symbols-outlined text-[24px]">tune</span>
            <h2 className="font-bold text-[18px] text-[#f7f7fa]">
              Sensory Profile &amp; Preferences
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close preferences"
            className="w-9 h-9 rounded-lg bg-[#1f1f2e] text-[#a8adb8] hover:text-white flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Affirming Identity */}
        <div className="flex flex-col gap-3">
          <span className="text-[12px] font-semibold text-[#8f5fe8] uppercase tracking-wider">
            Identity &amp; Affirmation
          </span>

          <div className="flex flex-col gap-1">
            <label className="text-[13px] text-[#a8adb8]" htmlFor="pref-name">
              Chosen Name
            </label>
            <input
              id="pref-name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="h-11 rounded-lg bg-[#1b1b25] border border-[#4a4a62] px-3 text-[#f7f7fa] text-[15px] focus:outline-none focus:border-[#5e6ad2]"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[13px] text-[#a8adb8]" htmlFor="pref-pronouns">
              Pronouns
            </label>
            <input
              id="pref-pronouns"
              type="text"
              value={formData.pronouns}
              onChange={(e) => setFormData({ ...formData, pronouns: e.target.value })}
              placeholder="e.g., they/them/she, she/they, he/they"
              className="h-11 rounded-lg bg-[#1b1b25] border border-[#4a4a62] px-3 text-[#f7f7fa] text-[15px] focus:outline-none focus:border-[#5e6ad2]"
            />
          </div>
        </div>

        {/* Sensory Controls */}
        <div className="flex flex-col gap-3 pt-2 border-t border-[#2c2c3a]">
          <span className="text-[12px] font-semibold text-[#00c2ff] uppercase tracking-wider">
            Sensory Comfort
          </span>

          <label className="flex items-center justify-between p-3 rounded-xl bg-[#1f1f2e] cursor-pointer">
            <div className="flex flex-col">
              <span className="text-[14px] font-semibold text-[#f7f7fa]">
                Low-Stimulation Mode
              </span>
              <span className="text-[12px] text-[#a8adb8]">
                Reduces motion, softens colors, suppresses popups
              </span>
            </div>
            <input
              type="checkbox"
              checked={formData.lowStimMode}
              onChange={(e) => setFormData({ ...formData, lowStimMode: e.target.checked })}
              className="w-5 h-5 accent-[#00c2ff] cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl bg-[#1f1f2e] cursor-pointer">
            <div className="flex flex-col">
              <span className="text-[14px] font-semibold text-[#f7f7fa]">
                Gentle Audio Cues
              </span>
              <span className="text-[12px] text-[#a8adb8]">
                Soft harmonic singing bowl chimes for task milestones
              </span>
            </div>
            <input
              type="checkbox"
              checked={formData.soundEnabled}
              onChange={(e) => setFormData({ ...formData, soundEnabled: e.target.checked })}
              className="w-5 h-5 accent-[#49e095] cursor-pointer"
            />
          </label>
        </div>

        {/* Data Privacy & Safeguards */}
        <div className="flex flex-col gap-3 pt-2 border-t border-[#2c2c3a]">
          <span className="text-[12px] font-semibold text-[#49e095] uppercase tracking-wider">
            Local Data &amp; Privacy Guarantee
          </span>

          <div className="flex flex-col gap-1">
            <label className="text-[13px] text-[#a8adb8]" htmlFor="auto-purge-select">
              Archived Task Auto-Clean
            </label>
            <select
              id="auto-purge-select"
              value={formData.autoPurgeMonths}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  autoPurgeMonths: parseInt(e.target.value, 10) as 6 | 12 | 0,
                })
              }
              className="h-11 rounded-lg bg-[#1b1b25] border border-[#4a4a62] px-3 text-[#f7f7fa] text-[14px] focus:outline-none focus:border-[#5e6ad2]"
            >
              <option value="6">Auto-purge completed history after 6 months</option>
              <option value="12">Auto-purge completed history after 1 year</option>
              <option value="0">Never auto-purge (Keep indefinitely)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-1">
            <button
              type="button"
              onClick={handleExport}
              className="h-10 px-3 rounded-lg bg-[#1f1f2e] border border-[#4a4a62] text-[13px] font-semibold text-[#f7f7fa] hover:bg-[#252536] flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              <span>Backup JSON</span>
            </button>

            <label className="h-10 px-3 rounded-lg bg-[#1f1f2e] border border-[#4a4a62] text-[13px] font-semibold text-[#f7f7fa] hover:bg-[#252536] flex items-center justify-center gap-1.5 cursor-pointer">
              <span className="material-symbols-outlined text-[18px]">upload</span>
              <span>Restore Data</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportFile}
                className="hidden"
              />
            </label>
          </div>

          {importNotice && (
            <p className="text-[12px] text-[#00c2ff] text-center font-medium">
              {importNotice}
            </p>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 pt-3 border-t border-[#2c2c3a]">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 h-11 rounded-xl bg-[#1f1f2e] text-[#a8adb8] hover:text-white text-[14px] font-medium"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 h-11 rounded-xl bg-[#5e6ad2] text-white text-[14px] font-semibold hover:bg-[#4854bb] shadow-sm"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
};
