import React, { useState } from 'react';
import { useService } from '../ServiceContext';
import { Plus, Trash2, Edit2, ArrowUp, ArrowDown, Check } from 'lucide-react';

export default function ChecklistSetup() {
  const {
    trackSteps,
    setTrackSteps
  } = useService();

  const [editingStep, setEditingStep] = useState(null);

  const addTrackStep = () => {
    const newOrder = trackSteps.length + 1;
    setTrackSteps((prev) => [
      ...prev,
      { title: '', order: newOrder, description: '' },
    ]);
  };

  const removeTrackStep = (index) => {
    const updated = trackSteps.filter((_, i) => i !== index);
    updated.forEach((step, i) => (step.order = i + 1));
    setTrackSteps(updated);
  };

  const updateTrackStep = (index, field, value) => {
    const updated = [...trackSteps];
    updated[index][field] = value;
    setTrackSteps(updated);
  };

  const moveTrackStep = (index, direction) => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === trackSteps.length - 1)
    ) {
      return;
    }

    const newIndex = direction === 'up' ? index - 1 : direction === 'down' ? index + 1 : index;
    const updated = [...trackSteps];
    
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    
    updated.forEach((step, i) => {
      step.order = i + 1;
    });
    
    setTrackSteps(updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Configure Checklist</h2>
          <p className="text-sm text-gray-600">Define all steps required to complete the service process.</p>
        </div>
        <button
          onClick={addTrackStep}
          className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg text-sm bg-white text-[#6869AC] border border-[#6869AC] hover:bg-gray-50"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Step
        </button>
      </div>

      <div className="space-y-4">
        {trackSteps.map((step, idx) => (
          <div
            key={idx}
            className="border border-gray-200 rounded-lg p-4"
          >
            {editingStep === idx ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={step.title}
                  onChange={(e) =>
                    updateTrackStep(idx, 'title', e.target.value)
                  }
                  placeholder="Step title"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium focus:outline-none focus:border-[#6869AC] focus:ring-1 focus:ring-[#6869AC]"
                />
                <textarea
                  value={step.description}
                  onChange={(e) =>
                    updateTrackStep(
                      idx,
                      'description',
                      e.target.value
                    )
                  }
                  placeholder="Step description"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:border-[#6869AC] focus:ring-1 focus:ring-[#6869AC]"
                  rows={2}
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingStep(null)}
                    className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg text-sm text-white hover:opacity-90 bg-[#6869AC]"
                  >
                    <Check className="w-4 h-4 mr-1" />
                    Save
                  </button>
                  <button
                    onClick={() => setEditingStep(null)}
                    className="px-3 py-1.5 rounded-lg text-sm bg-gray-200 text-gray-700 hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div
                  className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full text-white font-semibold flex-shrink-0 bg-[#6869AC]"
                >
                  {step.order}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1">
                    {step.description}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="flex gap-2">
                    <button
                      onClick={() => moveTrackStep(idx, 'up')}
                      disabled={idx === 0}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Move up"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => moveTrackStep(idx, 'down')}
                      disabled={idx === trackSteps.length - 1}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Move down"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingStep(idx)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => removeTrackStep(idx)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}