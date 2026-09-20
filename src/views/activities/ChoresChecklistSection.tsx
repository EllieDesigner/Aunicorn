import React, { useState } from 'react';
import { ChoreItem } from '../../types';
import { sensoryAudio } from '../../utils/audio';

interface ChoresChecklistSectionProps {
  chores: ChoreItem[];
  onUpdateChores: (chores: ChoreItem[]) => void;
  soundEnabled: boolean;
}

export const ChoresChecklistSection: React.FC<ChoresChecklistSectionProps> = ({
  chores,
  onUpdateChores,
  soundEnabled,
}) => {
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'cleaning' | 'laundry' | 'kitchen' | 'organizing'>('kitchen');
  const [showAdd, setShowAdd] = useState(false);

  const toggleChoreStatus = (choreId: string) => {
    const updated = chores.map((c) => {
      if (c.id === choreId) {
        const nextStatus: Record<'pendant' | 'ongoing' | 'done', 'pendant' | 'ongoing' | 'done'> = {
          pendant: 'ongoing',
          ongoing: 'done',
          done: 'pendant',
        };
        const status = nextStatus[c.status];
        if (status === 'done' && soundEnabled) {
          sensoryAudio.playGentleChime();
        }
        return { ...c, status };
      }
      return c;
    });
    onUpdateChores(updated);
  };

  const handleAddChore = () => {
    if (!newTitle.trim()) return;
    const item: ChoreItem = {
      id: `chore-${Date.now()}`,
      title: newTitle.trim(),
      subtitle: 'Gentle low-friction action',
      status: 'pendant',
      pushTime: '3:30 PM push',
      sensoryTag: 'Sensory safe',
      category: newCategory,
    };
    onUpdateChores([...chores, item]);
    setNewTitle('');
    setShowAdd(false);
  };

  return (
    <div className="flex flex-col p-4 sm:p-5 rounded-2xl bg-[#1b1b25] border border-[#2c2c3a] shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#f0c000]/20 border border-[#f0c000]/30 flex items-center justify-center text-[#f0c000]">
            <span className="material-symbols-outlined text-[20px]">cleaning_services</span>
          </div>
          <div>
            <h3 className="font-semibold text-[17px] text-[#f7f7fa]">Chores Checklist</h3>
            <span className="text-[12px] text-[#a8adb8]">Low-friction home care</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1f1f2e] border border-[#f0c000]/30 text-[#f0c000]">
          <span className="material-symbols-outlined text-[14px]">notifications</span>
          <span className="text-[12px] font-semibold">3:30 PM push</span>
        </div>
      </div>

      {/* Chores List */}
      <div className="flex flex-col space-y-2.5">
        {chores.map((chore) => (
          <div
            key={chore.id}
            className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 transition-all ${
              chore.status === 'done'
                ? 'bg-[#1f1f2e]/60 border-[#49e095]/20 opacity-80'
                : chore.status === 'ongoing'
                ? 'bg-[#1f1f2e] border-[#f0c000]/40'
                : 'bg-[#1f1f2e] border-[#2c2c3a]'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                onClick={() => toggleChoreStatus(chore.id)}
                className="focus:outline-none shrink-0"
              >
                {chore.status === 'done' ? (
                  <span className="material-symbols-outlined text-[#49e095] text-[22px]">
                    check_circle
                  </span>
                ) : chore.status === 'ongoing' ? (
                  <span className="material-symbols-outlined text-[#f0c000] text-[22px] animate-spin-slow">
                    sync
                  </span>
                ) : (
                  <span className="material-symbols-outlined text-[#908f9e] hover:text-white text-[22px]">
                    radio_button_unchecked
                  </span>
                )}
              </button>

              <div className="flex flex-col min-w-0">
                <span
                  className={`text-[15px] font-semibold truncate ${
                    chore.status === 'done' ? 'text-[#a8adb8] line-through' : 'text-[#f7f7fa]'
                  }`}
                >
                  {chore.title}
                </span>
                <span className="text-[12px] text-[#a8adb8]">
                  {chore.subtitle}
                </span>
              </div>
            </div>

            <span
              onClick={() => toggleChoreStatus(chore.id)}
              className={`px-2.5 py-0.5 rounded-md text-[11px] font-semibold cursor-pointer shrink-0 ${
                chore.status === 'done'
                  ? 'bg-[#008551]/30 text-[#49e095] border border-[#49e095]/30'
                  : chore.status === 'ongoing'
                  ? 'bg-[#f0c000]/20 text-[#f0c000] border border-[#f0c000]/30'
                  : 'bg-[#292933] text-[#a8adb8] border border-[#2c2c3a]'
              }`}
            >
              {chore.status === 'done' ? 'Done' : chore.status === 'ongoing' ? 'Ongoing' : 'Pendant'}
            </span>
          </div>
        ))}
      </div>

      {/* Add Chore */}
      {showAdd ? (
        <div className="p-3.5 bg-[#1f1f2e] rounded-xl border border-[#2c2c3a] flex flex-col gap-2.5">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="e.g., Wipe kitchen counter with warm damp cloth..."
            className="h-10 rounded-lg bg-[#1b1b25] border border-[#4a4a62] px-3 text-[#f7f7fa] text-[14px] focus:outline-none focus:border-[#5e6ad2]"
          />
          <div className="flex items-center justify-between gap-2">
            <select
              value={newCategory}
              onChange={(e: any) => setNewCategory(e.target.value)}
              className="h-9 rounded-lg bg-[#1b1b25] border border-[#4a4a62] px-2.5 text-[#a8adb8] text-[12px] focus:outline-none"
            >
              <option value="kitchen">Kitchen</option>
              <option value="laundry">Laundry</option>
              <option value="cleaning">Bathroom/Dust</option>
              <option value="organizing">Organizing/Desk</option>
            </select>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowAdd(false)}
                className="px-3 py-1 text-[12px] text-[#a8adb8] hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddChore}
                className="px-3.5 py-1 rounded-lg bg-[#5e6ad2] text-white text-[12px] font-semibold hover:bg-[#4854bb]"
              >
                Add Chore
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setShowAdd(true)}
          className="h-10 rounded-xl bg-[#1f1f2e] hover:bg-[#252536] text-[#bdc2ff] text-[13px] font-medium flex items-center justify-center gap-1.5 transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">add_circle</span>
          <span>Add Low-Friction Chore</span>
        </button>
      )}
    </div>
  );
};
