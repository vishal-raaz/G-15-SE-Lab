import { createContext, useContext, useState } from 'react';

const PaperContext = createContext(null);

/**
 * Paper Context — manages selected questions and paper configuration
 * Shared between QuestionGenerator, PaperBuilder, and PaperPreview pages
 */
export function PaperProvider({ children }) {
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [paperConfig, setPaperConfig] = useState({
    collegeName: 'University of Mumbai',
    subject: 'Software Engineering & Design Principles',
    examination: 'End Semester Examination',
    time: '3 Hours',
    maxMarks: 50,
  });
  const [sections, setSections] = useState([
    { title: 'Section A', questionIds: [] },
    { title: 'Section B', questionIds: [] },
  ]);
  const [savedPaper, setSavedPaper] = useState(null);

  const addQuestion = (question) => {
    setSelectedQuestions(prev => {
      if (prev.find(q => q.text === question.text)) return prev;
      return [...prev, { ...question, id: Date.now().toString() + Math.random().toString(36).substr(2, 5) }];
    });
  };

  const removeQuestion = (id) => {
    setSelectedQuestions(prev => prev.filter(q => q.id !== id));
  };

  const updateQuestionMarks = (id, marks) => {
    setSelectedQuestions(prev =>
      prev.map(q => q.id === id ? { ...q, marks: Number(marks) } : q)
    );
  };

  const moveQuestion = (index, direction) => {
    setSelectedQuestions(prev => {
      const newList = [...prev];
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= newList.length) return prev;
      [newList[index], newList[targetIndex]] = [newList[targetIndex], newList[index]];
      return newList;
    });
  };

  const clearPaper = () => {
    setSelectedQuestions([]);
    setSavedPaper(null);
    setSections([
      { title: 'Section A', questionIds: [] },
      { title: 'Section B', questionIds: [] },
    ]);
  };

  const totalMarks = selectedQuestions.reduce((sum, q) => sum + (q.marks || 0), 0);

  return (
    <PaperContext.Provider value={{
      selectedQuestions,
      setSelectedQuestions,
      paperConfig,
      setPaperConfig,
      sections,
      setSections,
      addQuestion,
      removeQuestion,
      updateQuestionMarks,
      moveQuestion,
      clearPaper,
      totalMarks,
      savedPaper,
      setSavedPaper
    }}>
      {children}
    </PaperContext.Provider>
  );
}

export const usePaper = () => {
  const context = useContext(PaperContext);
  if (!context) throw new Error('usePaper must be used within PaperProvider');
  return context;
};
