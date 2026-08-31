import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePaper } from '../context/PaperContext';
import { useToast } from '../components/Toast';
import jsPDF from 'jspdf';

export default function PaperPreview() {
  const { savedPaper, paperConfig, selectedQuestions, totalMarks } = usePaper();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const printRef = useRef();

  // Use savedPaper if available, otherwise construct from context
  const paper = savedPaper || {
    collegeName: paperConfig.collegeName,
    subject: paperConfig.subject,
    examination: paperConfig.examination,
    time: paperConfig.time,
    maxMarks: paperConfig.maxMarks,
    totalMarks,
    sections: [{ title: 'Section A', questions: selectedQuestions }],
  };

  const handleDownloadPDF = () => {
    if (!paper || (paper.sections?.every(s => s.questions?.length === 0) && selectedQuestions.length === 0)) {
      addToast('No paper to download. Please build a paper first.', 'warning');
      return;
    }

    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    const pageWidth = 210;
    const margin = 20;
    const contentWidth = pageWidth - margin * 2;
    let y = margin;

    // ── Header ──────────────────────────────────────────────
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text(paper.collegeName.toUpperCase(), pageWidth / 2, y, { align: 'center' });
    y += 8;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(paper.examination, pageWidth / 2, y, { align: 'center' });
    y += 7;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text(paper.subject.toUpperCase(), pageWidth / 2, y, { align: 'center' });
    y += 8;

    // Divider line
    doc.setDrawColor(0);
    doc.line(margin, y, pageWidth - margin, y);
    y += 5;

    // Time & Marks row
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Time: ${paper.time}`, margin, y);
    doc.text(`Maximum Marks: ${paper.maxMarks}`, pageWidth - margin, y, { align: 'right' });
    y += 5;

    doc.line(margin, y, pageWidth - margin, y);
    y += 8;

    // Instructions
    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    doc.text('Instructions: Answer all questions. All questions carry equal marks.', margin, y);
    y += 10;

    // ── Sections ────────────────────────────────────────────
    let questionNumber = 1;
    const allSections = paper.sections?.length > 0
      ? paper.sections
      : [{ title: 'Section A', questions: selectedQuestions }];

    for (const section of allSections) {
      if (!section.questions || section.questions.length === 0) continue;

      // Section title
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text(section.title, pageWidth / 2, y, { align: 'center' });
      y += 7;

      for (const q of section.questions) {
        // Check if we need a new page
        if (y > 265) {
          doc.addPage();
          y = margin;
        }

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);

        const questionText = `Q${questionNumber}. ${q.text}`;
        const lines = doc.splitTextToSize(questionText, contentWidth - 20);
        doc.text(lines, margin, y);
        doc.text(`[${q.marks} Marks]`, pageWidth - margin, y, { align: 'right' });

        y += lines.length * 5 + 6;
        questionNumber++;
      }

      y += 4;
    }

    // Footer
    const totalQuestions = allSections.reduce((sum, s) => sum + (s.questions?.length || 0), 0);
    if (y > 265) { doc.addPage(); y = margin; }
    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    doc.text(`Total Questions: ${totalQuestions} | Total Marks: ${paper.totalMarks || totalMarks}`, pageWidth / 2, y + 5, { align: 'center' });
    doc.line(margin, y + 9, pageWidth - margin, y + 9);
    doc.text('--- End of Question Paper ---', pageWidth / 2, y + 14, { align: 'center' });

    doc.save(`${paper.subject.replace(/\s+/g, '_')}_Question_Paper.pdf`);
    addToast('PDF downloaded successfully!', 'success');
  };

  const handlePrint = () => {
    window.print();
  };

  const allSections = paper?.sections?.length > 0
    ? paper.sections
    : [{ title: 'Section A', questions: selectedQuestions }];

  const hasQuestions = allSections.some(s => s.questions?.length > 0);

  if (!hasQuestions) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4 animate-fade-in">
        <div className="text-5xl">📄</div>
        <div className="text-center">
          <p className="text-surface-200 font-semibold text-lg">No Paper to Preview</p>
          <p className="text-surface-500 text-sm mt-1">Go to Paper Builder to create a question paper first</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => navigate('/generator')} className="btn-primary">Go to Generator</button>
          <button onClick={() => navigate('/builder')} className="btn-secondary">Go to Builder</button>
        </div>
      </div>
    );
  }

  let questionNumber = 1;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Action Bar */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-surface-50">Paper Preview</h2>
          <p className="text-surface-400 text-sm mt-1">Review your question paper before downloading</p>
        </div>
        <div className="flex items-center gap-3">
          <button id="btn-edit-paper" onClick={() => navigate('/builder')} className="btn-secondary flex items-center gap-2">
            <span>✏️</span> Edit
          </button>
          <button id="btn-print-paper" onClick={handlePrint} className="btn-secondary flex items-center gap-2">
            <span>🖨️</span> Print
          </button>
          <button id="btn-download-pdf" onClick={handleDownloadPDF} className="btn-primary flex items-center gap-2">
            <span>⬇️</span> Download PDF
          </button>
        </div>
      </div>

      {/* A4 Paper */}
      <div className="flex justify-center">
        <div
          ref={printRef}
          id="paper-preview-content"
          className="bg-white text-gray-900 shadow-2xl"
          style={{
            width: '210mm',
            minHeight: '297mm',
            padding: '20mm',
            fontFamily: 'Times New Roman, serif',
            fontSize: '11pt',
            lineHeight: '1.6',
          }}
        >
          {/* College Header */}
          <div style={{ textAlign: 'center', borderBottom: '2px solid #000', paddingBottom: '12px', marginBottom: '12px' }}>
            <div style={{ fontSize: '14pt', fontWeight: 'bold', letterSpacing: '0.5px' }}>
              {paper.collegeName.toUpperCase()}
            </div>
            <div style={{ fontSize: '11pt', marginTop: '4px' }}>{paper.examination}</div>
            <div style={{ fontSize: '13pt', fontWeight: 'bold', marginTop: '4px' }}>
              {paper.subject.toUpperCase()}
            </div>
          </div>

          {/* Time & Marks */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '10pt' }}>
            <span><strong>Time:</strong> {paper.time}</span>
            <span><strong>Maximum Marks:</strong> {paper.maxMarks}</span>
          </div>

          <div style={{ borderTop: '1px solid #000', marginBottom: '12px' }} />

          {/* Instructions */}
          <div style={{ fontSize: '10pt', fontStyle: 'italic', marginBottom: '16px', color: '#333' }}>
            <strong>Instructions:</strong> Answer all questions. All questions carry equal marks unless specified.
            Write answers in legible handwriting.
          </div>

          {/* Sections & Questions */}
          {allSections.map((section, si) => (
            section.questions?.length > 0 && (
              <div key={si} style={{ marginBottom: '20px' }}>
                <div style={{
                  textAlign: 'center',
                  fontWeight: 'bold',
                  fontSize: '12pt',
                  margin: '12px 0',
                  borderTop: si > 0 ? '1px dashed #aaa' : 'none',
                  paddingTop: si > 0 ? '12px' : '0',
                }}>
                  {section.title}
                </div>
                {section.questions.map((q, qi) => {
                  const num = questionNumber++;
                  return (
                    <div key={qi} style={{ marginBottom: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                      <div style={{ flex: 1 }}>
                        <span style={{ fontWeight: 'bold' }}>Q{num}.</span> {q.text}
                      </div>
                      <div style={{ whiteSpace: 'nowrap', fontWeight: 'bold', fontSize: '10pt', color: '#333' }}>
                        [{q.marks} Marks]
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          ))}

          {/* Footer */}
          <div style={{ borderTop: '2px solid #000', marginTop: '20px', paddingTop: '10px', textAlign: 'center', fontSize: '9pt', color: '#555' }}>
            Total Marks: {paper.totalMarks || totalMarks} | All the Best!
            <br />
            <em>--- End of Question Paper ---</em>
          </div>
        </div>
      </div>

      {/* Print styles */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #paper-preview-content, #paper-preview-content * { visibility: visible; }
          #paper-preview-content { position: absolute; left: 0; top: 0; width: 100%; }
        }
      `}</style>
    </div>
  );
}
