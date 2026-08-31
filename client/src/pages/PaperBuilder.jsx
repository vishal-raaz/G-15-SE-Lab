import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { savePaperAPI } from '../services/api';
import { usePaper } from '../context/PaperContext';
import { useToast } from '../components/Toast';
import QuestionCard from '../components/QuestionCard';

export default function PaperBuilder() {
  const {
    selectedQuestions,
    removeQuestion,
    updateQuestionMarks,
    moveQuestion,
    paperConfig,
    setPaperConfig,
    totalMarks,
    setSavedPaper,
    clearPaper,
  } = usePaper();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [sectionA, setSectionA] = useState('Section A');
  const [sectionB, setSectionB] = useState('Section B');
  const [saving, setSaving] = useState(false);

  const midpoint = Math.ceil(selectedQuestions.length / 2);
  const secA = selectedQuestions.slice(0, midpoint);
  const secB = selectedQuestions.slice(midpoint);

  const handleConfigChange = e => setPaperConfig(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleGeneratePaper = async () => {
    if (selectedQuestions.length === 0) {
      addToast('Please add at least one question to the paper', 'warning');
      return;
    }
    setSaving(true);
    try {
      const paperData = {
        title: `${paperConfig.subject} — ${paperConfig.examination}`,
        subject: paperConfig.subject,
        collegeName: paperConfig.collegeName,
        examination: paperConfig.examination,
        time: paperConfig.time,
        maxMarks: paperConfig.maxMarks,
        sections: [
          { title: sectionA, questions: secA },
          ...(secB.length > 0 ? [{ title: sectionB, questions: secB }] : []),
        ],
        totalMarks,
      };
      const res = await savePaperAPI(paperData);
      setSavedPaper(res.data);
      addToast('Paper saved successfully!', 'success');
      navigate('/preview');
    } catch (err) {
      // Navigate to preview even if save fails (for demo)
      const paperData = {
        title: `${paperConfig.subject} — ${paperConfig.examination}`,
        subject: paperConfig.subject,
        collegeName: paperConfig.collegeName,
        examination: paperConfig.examination,
        time: paperConfig.time,
        maxMarks: paperConfig.maxMarks,
        sections: [
          { title: sectionA, questions: secA },
          ...(secB.length > 0 ? [{ title: sectionB, questions: secB }] : []),
        ],
        totalMarks,
      };
      setSavedPaper(paperData);
      addToast('Paper ready for preview!', 'success');
      navigate('/preview');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-surface-50">Paper Builder</h2>
          <p className="text-surface-400 text-sm mt-1">Configure your question paper and organise sections</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-3 py-1.5 rounded-xl bg-surface-800 border border-surface-700 text-sm text-surface-300">
            {selectedQuestions.length} questions · {totalMarks} marks
          </span>
          <button id="btn-clear-paper" onClick={clearPaper} className="btn-danger text-sm px-4 py-2">
            Clear All
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Paper Config */}
        <div className="lg:col-span-1 space-y-4">
          <div className="glass-card p-6">
            <h3 className="text-sm font-semibold text-surface-200 mb-4 flex items-center gap-2">
              <span>🏫</span> Paper Details
            </h3>
            <div className="space-y-3">
              {[
                { name: 'collegeName', label: 'College Name', placeholder: 'University of Mumbai' },
                { name: 'subject', label: 'Subject', placeholder: 'Software Engineering' },
                { name: 'examination', label: 'Examination', placeholder: 'End Semester Examination' },
                { name: 'time', label: 'Duration', placeholder: '3 Hours' },
              ].map(field => (
                <div key={field.name}>
                  <label className="block text-xs font-medium text-surface-400 mb-1">{field.label}</label>
                  <input
                    id={`input-paper-${field.name}`}
                    type="text"
                    name={field.name}
                    value={paperConfig[field.name]}
                    onChange={handleConfigChange}
                    placeholder={field.placeholder}
                    className="input-field text-sm py-2"
                  />
                </div>
              ))}
              <div>
                <label className="block text-xs font-medium text-surface-400 mb-1">Maximum Marks</label>
                <input
                  id="input-paper-maxmarks"
                  type="number"
                  name="maxMarks"
                  value={paperConfig.maxMarks}
                  onChange={handleConfigChange}
                  className="input-field text-sm py-2"
                />
              </div>
            </div>
          </div>

          {/* Section Titles */}
          <div className="glass-card p-6">
            <h3 className="text-sm font-semibold text-surface-200 mb-4 flex items-center gap-2">
              <span>📋</span> Section Titles
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-surface-400 mb-1">Section A Title</label>
                <input
                  id="input-section-a"
                  type="text"
                  value={sectionA}
                  onChange={e => setSectionA(e.target.value)}
                  className="input-field text-sm py-2"
                />
                <p className="text-xs text-surface-500 mt-1">{secA.length} questions</p>
              </div>
              {secB.length > 0 && (
                <div>
                  <label className="block text-xs font-medium text-surface-400 mb-1">Section B Title</label>
                  <input
                    id="input-section-b"
                    type="text"
                    value={sectionB}
                    onChange={e => setSectionB(e.target.value)}
                    className="input-field text-sm py-2"
                  />
                  <p className="text-xs text-surface-500 mt-1">{secB.length} questions</p>
                </div>
              )}
            </div>
          </div>

          {/* Generate Button */}
          <button
            id="btn-generate-paper"
            onClick={handleGeneratePaper}
            disabled={saving || selectedQuestions.length === 0}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            {saving ? (
              <><div className="spinner" /><span>Generating...</span></>
            ) : (
              <><span>📄</span><span>Generate Paper</span></>
            )}
          </button>
        </div>

        {/* Questions Panel */}
        <div className="lg:col-span-2">
          {selectedQuestions.length === 0 ? (
            <div className="glass-card p-12 flex flex-col items-center justify-center gap-4 text-center">
              <div className="text-5xl">📋</div>
              <div>
                <p className="text-surface-200 font-semibold text-lg">No Questions Added</p>
                <p className="text-surface-500 text-sm mt-1">
                  Go to the <strong className="text-primary-400">AI Generator</strong> to generate and add questions
                </p>
              </div>
              <button
                onClick={() => navigate('/generator')}
                className="btn-primary mt-2"
              >
                Go to AI Generator
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Section A */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-px flex-1 bg-surface-700" />
                  <span className="text-xs font-bold text-surface-400 uppercase tracking-wider px-3 py-1 rounded-full border border-surface-700 bg-surface-800">
                    {sectionA}
                  </span>
                  <div className="h-px flex-1 bg-surface-700" />
                </div>
                <div className="space-y-3">
                  {secA.map((q, i) => (
                    <QuestionCard
                      key={q.id}
                      question={q}
                      index={i}
                      mode="builder"
                      onRemove={removeQuestion}
                      onMarksChange={updateQuestionMarks}
                      onMoveUp={() => moveQuestion(i, -1)}
                      onMoveDown={() => moveQuestion(i, 1)}
                    />
                  ))}
                </div>
              </div>

              {/* Section B */}
              {secB.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-3 mt-6">
                    <div className="h-px flex-1 bg-surface-700" />
                    <span className="text-xs font-bold text-surface-400 uppercase tracking-wider px-3 py-1 rounded-full border border-surface-700 bg-surface-800">
                      {sectionB}
                    </span>
                    <div className="h-px flex-1 bg-surface-700" />
                  </div>
                  <div className="space-y-3">
                    {secB.map((q, i) => (
                      <QuestionCard
                        key={q.id}
                        question={q}
                        index={midpoint + i}
                        mode="builder"
                        onRemove={removeQuestion}
                        onMarksChange={updateQuestionMarks}
                        onMoveUp={() => moveQuestion(midpoint + i, -1)}
                        onMoveDown={() => moveQuestion(midpoint + i, 1)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
