import React, { useState } from 'react';
import { TaskBreakdown, MicroStep } from '../../types';
import { sensoryAudio } from '../../utils/audio';

interface TaskBreakdownSectionProps {
  taskBreakdown: TaskBreakdown;
  onUpdateBreakdown: (breakdown: TaskBreakdown) => void;
  soundEnabled: boolean;
}

export const TaskBreakdownSection: React.FC<TaskBreakdownSectionProps> = ({
  taskBreakdown,
  onUpdateBreakdown,
  soundEnabled,
}) => {
  const [taskInput, setTaskInput] = useState(taskBreakdown.originalTask);
  const [loading, setLoading] = useState(false);
  const [newStepTitle, setNewStepTitle] = useState('');
  const [showAddStep, setShowAddStep] = useState(false);

  const completedCount = taskBreakdown.steps.filter((s) => s.status === 'done').length;
  const totalCount = taskBreakdown.steps.length;

  const handleSplitTask = async () => {
    if (!taskInput.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/gemini/split-task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task: taskInput,
          energyLevel: 'moderate',
          sensoryNotes: 'Sensory safe, gentle momentum',
        }),
      });
      const data = await res.json();
      if (data.steps && data.steps.length > 0) {
        const updated: TaskBreakdown = {
          id: `task-${Date.now()}`,
          originalTask: taskInput,
          energyRequired: 3,
          createdAt: new Date().toISOString(),
          steps: data.steps,
        };
        onUpdateBreakdown(updated);
        if (soundEnabled) sensoryAudio.playGentleChime();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleStepStatusChange = (stepId: string, newStatus: 'done' | 'ongoing' | 'pendant') => {
    const updatedSteps = taskBreakdown.steps.map((step) => {
      if (step.id === stepId) {
        if (newStatus === 'done' && soundEnabled) {
          sensoryAudio.playGentleChime();
        }
        return { ...step, status: newStatus };
      }
      return step;
    });
    onUpdateBreakdown({ ...taskBreakdown, steps: updatedSteps });
  };

  const handleAddCustomStep = () => {
    if (!newStepTitle.trim()) return;
    const newStep: MicroStep = {
      id: `custom-step-${Date.now()}`,
      title: newStepTitle.trim(),
      duration: '3m',
      sensoryTip: 'Self-paced step',
      status: 'pendant',
    };
    onUpdateBreakdown({
      ...taskBreakdown,
      steps: [...taskBreakdown.steps, newStep],
    });
    setNewStepTitle('');
    setShowAddStep(false);
  };

  return (
    <div className="flex flex-col p-4 sm:p-5 rounded-2xl bg-[#1b1b25] border border-[#2c2c3a] shadow-sm space-y-4">
      {/* Title & Badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#8f5fe8]/20 border border-[#8f5fe8]/30 flex items-center justify-center text-[#8f5fe8]">
            <span className="material-symbols-outlined text-[20px]">splitscreen</span>
          </div>
          <div>
            <h3 className="font-semibold text-[17px] text-[#f7f7fa]">Split Big Tasks</h3>
            <span className="text-[12px] text-[#a8adb8]">Anti-Overwhelm Engine</span>
          </div>
        </div>
        <span className="text-[11px] font-semibold text-[#4cd6fb] bg-[#1f1f2e] border border-[#4cd6fb]/20 px-2.5 py-1 rounded-full">
          AI Slice
        </span>
      </div>

      {/* Input */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[14px] text-[#f7f7fa] font-medium" htmlFor="ai-task-input">
          What feels too heavy or overwhelming right now?
        </label>
        <div className="flex gap-2">
          <input
            id="ai-task-input"
            type="text"
            value={taskInput}
            onChange={(e) => setTaskInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSplitTask()}
            placeholder="e.g., Clean entire kitchen, book dentist, make phone call..."
            className="w-full h-12 rounded-xl bg-[#1f1f2e] border border-[#4a4a62] px-3.5 text-[#f7f7fa] text-[15px] placeholder-[#a8adb8] focus:outline-none focus:border-[#5e6ad2] transition-colors"
          />
        </div>
        <span className="text-[12px] text-[#a8adb8]">
          We'll slice this into 3–5 tiny, sensory-gentle steps with zero guilt.
        </span>
      </div>

      {/* Action Button */}
      <button
        type="button"
        onClick={handleSplitTask}
        disabled={loading}
        className="w-full h-11 px-4 rounded-xl bg-[#5e6ad2] hover:bg-[#4854bb] text-white font-semibold text-[14px] flex items-center justify-center gap-2 transition-all shadow-sm disabled:opacity-60"
      >
        <span className="material-symbols-outlined text-[20px]">
          {loading ? 'hourglass_top' : 'auto_awesome'}
        </span>
        <span>
          {loading ? 'Gently deconstructing task...' : 'Break down with AI (3–5 micro-steps)'}
        </span>
      </button>

      {/* Broken-down Task Steps */}
      <div className="flex flex-col pt-1 space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <span className="text-[12px] text-[#a8adb8] uppercase tracking-wider font-bold">
            Current Micro-Deck
          </span>
          <span className="text-[12px] text-[#49e095] font-semibold">
            {completedCount} of {totalCount} completed
          </span>
        </div>

        {taskBreakdown.steps.map((step) => (
          <div
            key={step.id}
            className={`p-3.5 rounded-xl transition-all border ${
              step.status === 'done'
                ? 'bg-[#1f1f2e]/60 border-[#49e095]/20 opacity-85'
                : step.status === 'ongoing'
                ? 'bg-[#1f1f2e] border-[#f0c000]/40 shadow-sm'
                : 'bg-[#1f1f2e]/80 border-[#2c2c3a]'
            } flex items-start justify-between gap-3`}
          >
            <div className="flex items-start gap-3 min-w-0">
              <button
                type="button"
                onClick={() =>
                  handleStepStatusChange(
                    step.id,
                    step.status === 'done' ? 'pendant' : 'done'
                  )
                }
                title={step.status === 'done' ? 'Mark uncompleted' : 'Mark completed'}
                className="mt-0.5 shrink-0 focus:outline-none"
              >
                {step.status === 'done' ? (
                  <div className="w-6 h-6 rounded-full bg-[#008551] flex items-center justify-center text-white">
                    <span className="material-symbols-outlined text-[15px]">check</span>
                  </div>
                ) : step.status === 'ongoing' ? (
                  <div className="w-6 h-6 rounded-full bg-[#34343f] flex items-center justify-center text-[#f0c000] animate-pulse">
                    <span className="material-symbols-outlined text-[15px]">timer</span>
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-full border border-[#908f9e] hover:border-white flex items-center justify-center text-transparent">
                    <span className="material-symbols-outlined text-[15px]">circle</span>
                  </div>
                )}
              </button>

              <div className="flex flex-col min-w-0">
                <span
                  className={`text-[15px] font-medium leading-snug ${
                    step.status === 'done'
                      ? 'text-[#a8adb8] line-through'
                      : 'text-[#f7f7fa]'
                  }`}
                >
                  {step.title}
                </span>

                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className="text-[11px] font-semibold text-[#00c2ff] bg-[#00c2ff]/10 px-2 py-0.5 rounded">
                    {step.duration}
                  </span>
                  <span className="text-[12px] text-[#a8adb8]">
                    {step.sensoryTip}
                  </span>
                </div>
              </div>
            </div>

            {/* Status Picker Tag */}
            <div className="shrink-0 flex flex-col items-end gap-1">
              <span
                onClick={() => {
                  const next: Record<'pendant' | 'ongoing' | 'done', 'pendant' | 'ongoing' | 'done'> = {
                    pendant: 'ongoing',
                    ongoing: 'done',
                    done: 'pendant',
                  };
                  handleStepStatusChange(step.id, next[step.status]);
                }}
                className={`px-2 py-0.5 rounded-md text-[11px] font-semibold cursor-pointer transition-opacity hover:opacity-80 ${
                  step.status === 'done'
                    ? 'bg-[#008551]/30 text-[#49e095] border border-[#49e095]/30'
                    : step.status === 'ongoing'
                    ? 'bg-[#f0c000]/20 text-[#f0c000] border border-[#f0c000]/30'
                    : 'bg-[#292933] text-[#a8adb8] border border-[#2c2c3a]'
                }`}
              >
                {step.status === 'done' ? 'Done' : step.status === 'ongoing' ? 'Ongoing' : 'Pendant'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Micro-Step Drawer / Toggle */}
      {showAddStep ? (
        <div className="p-3 bg-[#1f1f2e] rounded-xl border border-[#2c2c3a] flex flex-col gap-2">
          <input
            type="text"
            value={newStepTitle}
            onChange={(e) => setNewStepTitle(e.target.value)}
            placeholder="Add tiny micro-step (e.g. Put shoes near door)..."
            className="h-10 rounded-lg bg-[#1b1b25] border border-[#4a4a62] px-3 text-[#f7f7fa] text-[14px] focus:outline-none focus:border-[#5e6ad2]"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAddStep(false)}
              className="px-3 py-1 text-[12px] text-[#a8adb8] hover:text-white"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAddCustomStep}
              className="px-3 py-1 rounded-lg bg-[#5e6ad2] text-white text-[12px] font-semibold hover:bg-[#4854bb]"
            >
              Add Step
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setShowAddStep(true)}
          className="h-10 rounded-xl bg-[#1f1f2e] hover:bg-[#252536] text-[#bdc2ff] text-[13px] font-medium flex items-center justify-center gap-1.5 transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">add_circle</span>
          <span>Add Custom Micro-Step</span>
        </button>
      )}
    </div>
  );
};
