import React, { useState } from 'react';
import { LifeReminder } from '../../types';
import { sensoryAudio } from '../../utils/audio';

interface LifeChecklistSectionProps {
  reminders: LifeReminder[];
  onUpdateReminders: (reminders: LifeReminder[]) => void;
  soundEnabled: boolean;
}

export const LifeChecklistSection: React.FC<LifeChecklistSectionProps> = ({
  reminders,
  onUpdateReminders,
  soundEnabled,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'health' | 'errands' | 'social_pet'>('all');
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'health' | 'errands' | 'social_pet' | 'admin'>('health');
  const [newScheduled, setNewScheduled] = useState('');
  const [newBuffer, setNewBuffer] = useState(30);
  const [isSorting, setIsSorting] = useState(false);

  const filteredReminders = reminders.filter((r) => {
    if (activeFilter === 'all') return true;
    return r.category === activeFilter;
  });

  const remainingCount = reminders.filter((r) => r.status !== 'done').length;

  const toggleStatus = (id: string) => {
    const updated = reminders.map((r) => {
      if (r.id === id) {
        const nextStatus = r.status === 'done' ? 'pendant' : 'done';
        if (nextStatus === 'done' && soundEnabled) {
          sensoryAudio.playGentleChime();
        }
        return { ...r, status: nextStatus as 'done' | 'pendant' };
      }
      return r;
    });
    onUpdateReminders(updated);
  };

  const handleAddReminder = () => {
    if (!newTitle.trim()) return;
    const item: LifeReminder = {
      id: `rem-${Date.now()}`,
      title: newTitle.trim(),
      subtitle: `Includes ${newBuffer}m transition buffer`,
      category: newCategory,
      scheduledText: newScheduled || 'Upcoming • Calming buffer added',
      calmingBufferMinutes: newBuffer,
      status: 'pendant',
      icon:
        newCategory === 'health'
          ? 'medical_services'
          : newCategory === 'social_pet'
          ? 'pets'
          : newCategory === 'errands'
          ? 'shopping_bag'
          : 'event',
      badgeColor:
        newCategory === 'health'
          ? 'text-[#00c2ff] bg-[#00c2ff]/15'
          : newCategory === 'social_pet'
          ? 'text-[#8f5fe8] bg-[#8f5fe8]/15'
          : 'text-[#f0c000] bg-[#f0c000]/15',
    };
    onUpdateReminders([...reminders, item]);
    setNewTitle('');
    setNewScheduled('');
    setShowAdd(false);
  };

  const handleAiAutoSort = () => {
    setIsSorting(true);
    setTimeout(() => {
      // Sort: Pending high priority health/pet first, then errands, then done last
      const sorted = [...reminders].sort((a, b) => {
        if (a.status === 'done' && b.status !== 'done') return 1;
        if (a.status !== 'done' && b.status === 'done') return -1;
        return (b.calmingBufferMinutes || 0) - (a.calmingBufferMinutes || 0);
      });
      onUpdateReminders(sorted);
      setIsSorting(false);
      if (soundEnabled) sensoryAudio.playGentleChime();
    }, 600);
  };

  return (
    <div className="flex flex-col p-4 sm:p-5 rounded-2xl bg-[#1b1b25] border border-[#2c2c3a] shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#8f5fe8]/20 border border-[#8f5fe8]/30 flex items-center justify-center text-[#8f5fe8]">
            <span className="material-symbols-outlined text-[20px]">checklist</span>
          </div>
          <div>
            <h3 className="font-semibold text-[17px] text-[#f7f7fa]">Life Checklist</h3>
            <span className="text-[12px] text-[#a8adb8]">Health, vet, errands &amp; auto-calendar</span>
          </div>
        </div>

        <span className="text-[12px] text-[#49e095] font-semibold bg-[#1f1f2e] border border-[#49e095]/20 px-2.5 py-1 rounded-full">
          {remainingCount} left
        </span>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 -mx-1 px-1">
        {[
          { id: 'all', label: 'All' },
          { id: 'health', label: 'Health & Medical' },
          { id: 'errands', label: 'Errands & Fix' },
          { id: 'social_pet', label: 'Social & Pet' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveFilter(tab.id as any)}
            className={`px-3 py-1.5 rounded-full text-[12px] font-semibold shrink-0 transition-colors ${
              activeFilter === tab.id
                ? 'bg-[#5e6ad2] text-white shadow-sm'
                : 'bg-[#1f1f2e] text-[#a8adb8] hover:text-[#f7f7fa] border border-[#2c2c3a]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Items */}
      <div className="flex flex-col space-y-2.5">
        {filteredReminders.map((rem) => (
          <div
            key={rem.id}
            className={`p-3.5 rounded-xl border flex flex-col gap-2 transition-all ${
              rem.status === 'done'
                ? 'bg-[#1f1f2e]/60 border-[#49e095]/20 opacity-75'
                : 'bg-[#1f1f2e] border-[#2c2c3a]'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-2.5 min-w-0">
                <button
                  type="button"
                  onClick={() => toggleStatus(rem.id)}
                  className="mt-0.5 focus:outline-none shrink-0"
                >
                  <span
                    className={`material-symbols-outlined text-[20px] ${
                      rem.status === 'done' ? 'text-[#49e095]' : 'text-[#00c2ff]'
                    }`}
                  >
                    {rem.status === 'done' ? 'check_circle' : rem.icon}
                  </span>
                </button>
                <div className="flex flex-col min-w-0">
                  <span
                    className={`text-[15px] font-semibold leading-tight ${
                      rem.status === 'done' ? 'text-[#a8adb8] line-through' : 'text-[#f7f7fa]'
                    }`}
                  >
                    {rem.title}
                  </span>
                  <span className="text-[13px] text-[#a8adb8] mt-0.5">
                    {rem.subtitle}
                  </span>
                </div>
              </div>

              <span
                onClick={() => toggleStatus(rem.id)}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold shrink-0 cursor-pointer ${rem.badgeColor}`}
              >
                {rem.category === 'health'
                  ? 'Health'
                  : rem.category === 'social_pet'
                  ? 'Social & Pet'
                  : 'Errands'}
              </span>
            </div>

            {/* Scheduled details & calming buffer info */}
            <div className="flex items-center gap-1.5 pl-7 text-[12px] text-[#4cd6fb]">
              <span className="material-symbols-outlined text-[15px]">calendar_clock</span>
              <span>{rem.scheduledText}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Reminder Form */}
      {showAdd ? (
        <div className="p-3.5 bg-[#1f1f2e] rounded-xl border border-[#2c2c3a] flex flex-col gap-2.5">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Reminder title (e.g. Call pharmacy for refill)..."
            className="h-10 rounded-lg bg-[#1b1b25] border border-[#4a4a62] px-3 text-[#f7f7fa] text-[14px] focus:outline-none focus:border-[#5e6ad2]"
          />
          <div className="grid grid-cols-2 gap-2">
            <select
              value={newCategory}
              onChange={(e: any) => setNewCategory(e.target.value)}
              className="h-9 rounded-lg bg-[#1b1b25] border border-[#4a4a62] px-2.5 text-[#a8adb8] text-[12px] focus:outline-none"
            >
              <option value="health">Health &amp; Medical</option>
              <option value="errands">Errands &amp; Fix</option>
              <option value="social_pet">Social &amp; Pet</option>
              <option value="admin">Admin / Life</option>
            </select>
            <input
              type="text"
              value={newScheduled}
              onChange={(e) => setNewScheduled(e.target.value)}
              placeholder="e.g., Thursday 3:00 PM"
              className="h-9 rounded-lg bg-[#1b1b25] border border-[#4a4a62] px-2.5 text-[#f7f7fa] text-[12px] focus:outline-none focus:border-[#5e6ad2]"
            />
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-[12px] text-[#a8adb8]">
              Calming transition buffer: {newBuffer} mins
            </span>
            <input
              type="range"
              min="10"
              max="60"
              step="5"
              value={newBuffer}
              onChange={(e) => setNewBuffer(parseInt(e.target.value, 10))}
              className="accent-[#5e6ad2] w-28"
            />
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setShowAdd(false)}
              className="px-3 py-1 text-[12px] text-[#a8adb8] hover:text-white"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAddReminder}
              className="px-3.5 py-1 rounded-lg bg-[#5e6ad2] text-white text-[12px] font-semibold hover:bg-[#4854bb]"
            >
              Save Reminder
            </button>
          </div>
        </div>
      ) : (
        /* Action Buttons */
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            type="button"
            onClick={() => setShowAdd(true)}
            className="h-11 rounded-xl bg-[#1f1f2e] hover:bg-[#252536] border border-[#2c2c3a] text-[#f7f7fa] text-[13px] font-medium flex items-center justify-center gap-1.5 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            <span>Add Reminder</span>
          </button>

          <button
            type="button"
            onClick={handleAiAutoSort}
            disabled={isSorting}
            className="h-11 rounded-xl bg-[#1f1f2e] hover:bg-[#252536] border border-[#8f5fe8]/30 text-[#bdc2ff] text-[13px] font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px] text-[#8f5fe8]">
              {isSorting ? 'hourglass_top' : 'auto_fix_high'}
            </span>
            <span>{isSorting ? 'Auto-Sorting...' : 'AI Auto-Sort'}</span>
          </button>
        </div>
      )}
    </div>
  );
};
