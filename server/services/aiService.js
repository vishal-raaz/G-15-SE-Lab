const { GoogleGenerativeAI } = require('@google/generative-ai');

/**
 * AI Service — Single Responsibility: Only handles AI question generation
 * Falls back to mock questions when no API key is configured
 */

const generateQuestions = async ({ subject, unit, topic, numberOfQuestions, marks, difficulty }) => {
  const apiKey = process.env.AI_API_KEY;

  // If no API key or placeholder, use mock questions for demo
  if (!apiKey || apiKey === 'your-gemini-api-key-here') {
    console.log('⚠️  No AI API key configured — using mock question generation');
    return generateMockQuestions({ subject, unit, topic, numberOfQuestions, marks, difficulty });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `Generate ${numberOfQuestions} ${difficulty}-difficulty exam questions about "${topic}" from the subject "${subject}" (${unit}). Each question should carry ${marks} marks.

Return ONLY a valid JSON array with no additional text, no markdown formatting, no code blocks. Each object should have:
- "text": the full question text
- "marks": ${marks}
- "difficulty": "${difficulty}"

Example format:
[{"text": "Explain the concept of cohesion and coupling in software design with examples.", "marks": 5, "difficulty": "Medium"}]`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Extract JSON array from response
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const questions = JSON.parse(jsonMatch[0]);
      return questions.map(q => ({
        text: q.text,
        marks: Number(q.marks) || marks,
        difficulty: q.difficulty || difficulty
      }));
    }

    throw new Error('Could not parse AI response');
  } catch (error) {
    console.error('AI Generation Error:', error.message);
    console.log('Falling back to mock questions...');
    return generateMockQuestions({ subject, unit, topic, numberOfQuestions, marks, difficulty });
  }
};

/**
 * Generate mock questions for demo/fallback
 */
const generateMockQuestions = ({ subject, unit, topic, numberOfQuestions, marks, difficulty }) => {
  const questionBank = [
    `Explain the concept of ${topic} in ${subject} with suitable examples and diagrams.`,
    `What are the key principles of ${topic}? Discuss each principle with real-world applications.`,
    `Compare and contrast different approaches to ${topic} in the context of ${subject}.`,
    `Describe the importance of ${topic} in modern software development. Provide relevant examples.`,
    `What are the advantages and disadvantages of implementing ${topic}? Explain with case studies.`,
    `How does ${topic} contribute to the overall quality of software systems? Discuss in detail.`,
    `Explain ${topic} with a suitable case study from ${subject}. Draw necessary diagrams.`,
    `What are the best practices for implementing ${topic} in ${subject}? List and explain each.`,
    `Discuss the role of ${topic} in ${unit} of ${subject} with practical examples.`,
    `Critically analyze the application of ${topic} in large-scale software development projects.`,
    `Define ${topic}. Explain its significance in ${subject} with at least two examples.`,
    `Write short notes on the following aspects of ${topic} as studied in ${subject}.`,
    `Illustrate the relationship between ${topic} and software quality metrics with examples.`,
    `What challenges are commonly faced when applying ${topic} in ${subject}? Suggest solutions.`,
    `Enumerate and explain the different types/categories of ${topic} used in ${subject}.`,
  ];

  const questions = [];
  for (let i = 0; i < numberOfQuestions && i < questionBank.length; i++) {
    questions.push({
      text: questionBank[i],
      marks: marks,
      difficulty: difficulty
    });
  }
  return questions;
};

module.exports = { generateQuestions };
