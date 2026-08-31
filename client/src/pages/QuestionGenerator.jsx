import { useState } from 'react';
import { generateQuestionsAPI, saveQuestionAPI } from '../services/api';
import { usePaper } from '../context/PaperContext';
import { useToast } from '../components/Toast';
import QuestionCard from '../components/QuestionCard';

const SUBJECTS = [
  'Software Engineering',
  'Design Principles',
  'Data Structures',
  'Operating Systems',
  'Database Management',
  'Computer Networks',
  'Object-Oriented Programming',
];

const UNITS = ['Unit 1', 'Unit 2', 'Unit 3', 'Unit 4', 'Unit 5', 'Unit 6'];
const MARKS_OPTIONS = [1, 2, 3, 5, 7, 10, 15, 20];

export default function QuestionGenerator() {
  const [form, setForm] = useState({
    subject: 'Software Engineering',
    unit: 'Unit 3',
    topic: 'Design Principles',
    numberOfQuestions: 5,
    marks: 5,
    difficulty: 'Medium',
  });
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);

  const { addQuestion } = usePaper();
  const { addToast } = useToast();

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleGenerate = async e => {
    e.preventDefault();
    setLoading(true);
    setQuestions([]);
    try {
      const res = await generateQuestionsAPI(form);
      setQuestions(res.data.questions);
      addToast(`${res.data.questions.length} questions generated successfully!`, 'success');
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to generate questions', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToPaper = async (question) => {
    try {
      // Save to DB
      await saveQuestionAPI({ ...question, subject: form.subject, unit: form.unit, topic: form.topic });
      // Add to paper context
      addQuestion({ ...question, subject: form.subject, unit: form.unit, topic: form.topic });
      addToast('Question added to paper!', 'success');
    } catch {
      // Still add to paper even if save fails
      addQuestion({ ...question, subject: form.subject, unit: form.unit, topic: form.topic });
      addToast('Question added to paper (offline mode)', 'info');
    }
  };

  const handleDelete = (index) => {
    setQuestions(prev => prev.filter((_, i) => i !== index));
    addToast('Question removed', 'info');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-surface-50">AI Question Generator</h2>
        <p className="text-surface-400 text-sm mt-1">
          Enter subject details and let AI generate questions for your exam paper
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-1">
          <div className="glass-card p-6">
            <h3 className="text-base font-semibold text-surface-200 mb-5 flex items-center gap-2">
              <span className="w-6 h-6 rounded-md gradient-primary flex items-center justify-center text-xs">🎯</span>
              Generation Parameters
            </h3>
            <form onSubmit={handleGenerate} className="space-y-4">
              {/* Subject */}
              <div>
                <label className="block text-xs font-medium text-surface-400 mb-1.5">Subject *</label>
                <select name="subject" value={form.subject} onChange={handleChange} className="select-field" required>
                  {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              {/* Unit */}
              <div>
                <label className="block text-xs font-medium text-surface-400 mb-1.5">Unit</label>
                <select name="unit" value={form.unit} onChange={handleChange} className="select-field">
                  {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>

              {/* Topic */}
              <div>
                <label className="block text-xs font-medium text-surface-400 mb-1.5">Topic *</label>
                <input
                  id="input-topic"
                  type="text"
                  name="topic"
                  value={form.topic}
                  onChange={handleChange}
                  placeholder="e.g. Design Principles, Cohesion & Coupling"
                  required
                  className="input-field"
                />
              </div>

              {/* Number of Questions */}
              <div>
                <label className="block text-xs font-medium text-surface-400 mb-1.5">Number of Questions</label>
                <input
                  id="input-num-questions"
                  type="number"
                  name="numberOfQuestions"
                  value={form.numberOfQuestions}
                  onChange={handleChange}
                  min="1"
                  max="10"
                  className="input-field"
                />
              </div>

              {/* Marks */}
              <div>
                <label className="block text-xs font-medium text-surface-400 mb-1.5">Marks per Question</label>
                <select name="marks" value={form.marks} onChange={handleChange} className="select-field">
                  {MARKS_OPTIONS.map(m => <option key={m} value={m}>{m} marks</option>)}
                </select>
              </div>

              {/* Difficulty */}
              <div>
                <label className="block text-xs font-medium text-surface-400 mb-1.5">Difficulty</label>
                <div className="flex gap-2">
                  {['Easy', 'Medium', 'Hard'].map(d => (
                    <button
                      key={d}
                      type="button"
                      id={`btn-difficulty-${d.toLowerCase()}`}
                      onClick={() => setForm(prev => ({ ...prev, difficulty: d }))}
                      className={`flex-1 py-2 text-xs font-semibold rounded-xl border transition-all duration-200
                        ${form.difficulty === d
                          ? d === 'Easy' ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                            : d === 'Medium' ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                            : 'bg-red-500/20 border-red-500/40 text-red-400'
                          : 'bg-surface-800 border-surface-700 text-surface-400 hover:border-surface-600'
                        }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <button
                id="btn-generate-questions"
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <>
                    <div className="spinner" />
                    <span>Generating with AI...</span>
                  </>
                ) : (
                  <>
                    <span>🤖</span>
                    <span>Generate Questions</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Generated Questions */}
        <div className="lg:col-span-2">
          {loading ? (
            <div className="glass-card p-12 flex flex-col items-center justify-center gap-4">
              <div className="w-12 h-12 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
              <div className="text-center">
                <p className="text-surface-200 font-medium">Generating questions with AI...</p>
                <p className="text-surface-500 text-sm mt-1">This may take a few seconds</p>
              </div>
            </div>
          ) : questions.length === 0 ? (
            <div className="glass-card p-12 flex flex-col items-center justify-center gap-4 text-center">
              <div className="text-5xl animate-float">🤖</div>
              <div>
                <p className="text-surface-200 font-semibold text-lg">Ready to Generate</p>
                <p className="text-surface-500 text-sm mt-1">
                  Fill in the form and click <strong className="text-primary-400">Generate Questions</strong>
                </p>
              </div>
              <div className="mt-4 p-4 rounded-xl bg-surface-800 border border-surface-700 text-left max-w-sm">
                <p className="text-xs text-surface-500 mb-2 font-medium">Example</p>
                <p className="text-xs text-surface-400">Subject: <span className="text-surface-200">Software Engineering</span></p>
                <p className="text-xs text-surface-400">Topic: <span className="text-surface-200">Design Principles</span></p>
                <p className="text-xs text-surface-400">Questions: <span className="text-surface-200">5</span></p>
                <p className="text-xs text-surface-400">Marks: <span className="text-surface-200">5</span></p>
                <p className="text-xs text-surface-400">Difficulty: <span className="text-amber-400">Medium</span></p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-surface-200">
                  Generated Questions
                  <span className="ml-2 text-xs font-normal text-surface-500">({questions.length} questions)</span>
                </h3>
                <button
                  id="btn-add-all-to-paper"
                  onClick={() => {
                    questions.forEach(q => handleAddToPaper(q));
                    addToast('All questions added to paper!', 'success');
                  }}
                  className="btn-secondary text-xs px-4 py-2"
                >
                  Add All to Paper
                </button>
              </div>
              {questions.map((q, i) => (
                <QuestionCard
                  key={i}
                  question={q}
                  index={i}
                  mode="generate"
                  onAdd={handleAddToPaper}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
