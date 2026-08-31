/**
 * QuestionCard — reusable card for displaying a generated question
 * DRY: used in both QuestionGenerator and PaperBuilder pages
 */
export default function QuestionCard({ question, index, onAdd, onDelete, onRemove, onMarksChange, onMoveUp, onMoveDown, mode = 'generate' }) {
  const difficultyClass = {
    Easy: 'badge-easy',
    Medium: 'badge-medium',
    Hard: 'badge-hard',
  }[question.difficulty] || 'badge-medium';

  return (
    <div className="glass-card p-5 animate-slide-up group hover:border-surface-600/60 transition-all duration-200">
      {/* Top row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 shrink-0">
          <span className="w-7 h-7 rounded-lg bg-primary-500/15 text-primary-400 text-xs font-bold flex items-center justify-center border border-primary-500/20">
            {index + 1}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className={difficultyClass}>{question.difficulty}</span>
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-surface-700 text-surface-300 border border-surface-600">
            {question.marks} Marks
          </span>
        </div>
      </div>

      {/* Question text */}
      <p className="text-surface-200 text-sm leading-relaxed mb-4">{question.text}</p>

      {/* Actions */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Generate mode: Add + Delete */}
        {mode === 'generate' && (
          <>
            <button
              id={`btn-add-question-${index}`}
              onClick={() => onAdd(question)}
              className="btn-success text-xs px-4 py-2"
            >
              + Add to Paper
            </button>
            <button
              id={`btn-delete-question-${index}`}
              onClick={() => onDelete(index)}
              className="btn-danger text-xs px-4 py-2"
            >
              Delete
            </button>
          </>
        )}

        {/* Builder mode: Remove + Marks + Reorder */}
        {mode === 'builder' && (
          <>
            <button onClick={onMoveUp} className="p-2 rounded-lg bg-surface-700 hover:bg-surface-600 transition-colors text-surface-300 text-xs">
              ↑
            </button>
            <button onClick={onMoveDown} className="p-2 rounded-lg bg-surface-700 hover:bg-surface-600 transition-colors text-surface-300 text-xs">
              ↓
            </button>
            <div className="flex items-center gap-1.5">
              <label className="text-xs text-surface-500">Marks:</label>
              <input
                type="number"
                min="1"
                max="20"
                value={question.marks}
                onChange={e => onMarksChange(question.id, e.target.value)}
                className="w-14 px-2 py-1 text-xs bg-surface-900 border border-surface-700 rounded-lg text-surface-200 text-center focus:outline-none focus:border-primary-500"
              />
            </div>
            <button
              id={`btn-remove-question-${index}`}
              onClick={() => onRemove(question.id)}
              className="btn-danger text-xs px-4 py-2 ml-auto"
            >
              Remove
            </button>
          </>
        )}
      </div>
    </div>
  );
}
