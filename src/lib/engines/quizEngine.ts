/**
 * Quiz Engine — Validation, scoring, and answer checking for module quizzes
 */

export type QuestionType = 'mcq' | 'numeric' | 'mapping' | 'seal';

export interface MCQQuestion {
  type: 'mcq';
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
  points: number;
}

export interface NumericQuestion {
  type: 'numeric';
  id: string;
  question: string;
  unit?: string;
  correctMin: number;
  correctMax: number;
  explanation?: string;
  points: number;
}

export interface MappingQuestion {
  type: 'mapping';
  id: string;
  question: string;
  leftItems: string[];
  rightItems: string[];
  correctPairs: Record<number, number>; // left index -> right index
  points: number;
}

export interface SealQuestion {
  type: 'seal';
  id: string;
  question: string;
  confirmationPhrase: string; // user must type this to confirm
  points: number;
}

export type QuizQuestion = MCQQuestion | NumericQuestion | MappingQuestion | SealQuestion;

export interface QuizResult {
  questionId: string;
  isCorrect: boolean;
  pointsEarned: number;
  userAnswer: unknown;
}

export interface QuizSummary {
  totalQuestions: number;
  correctAnswers: number;
  totalPoints: number;
  earnedPoints: number;
  passPercent: number;
  passed: boolean;
}

const PASS_THRESHOLD = 70; // 70% to pass

/**
 * Validate a single MCQ answer
 */
export function validateMCQ(question: MCQQuestion, selectedIndex: number): QuizResult {
  const isCorrect = selectedIndex === question.correctIndex;
  return {
    questionId: question.id,
    isCorrect,
    pointsEarned: isCorrect ? question.points : 0,
    userAnswer: selectedIndex,
  };
}

/**
 * Validate a numeric answer within acceptable range
 */
export function validateNumeric(question: NumericQuestion, value: number): QuizResult {
  const isCorrect = value >= question.correctMin && value <= question.correctMax;
  return {
    questionId: question.id,
    isCorrect,
    pointsEarned: isCorrect ? question.points : 0,
    userAnswer: value,
  };
}

/**
 * Validate mapping answer (drag-drop pairs)
 */
export function validateMapping(
  question: MappingQuestion,
  userPairs: Record<number, number>
): QuizResult {
  const allCorrect = Object.entries(question.correctPairs).every(
    ([left, right]) => userPairs[parseInt(left)] === right
  );
  return {
    questionId: question.id,
    isCorrect: allCorrect,
    pointsEarned: allCorrect ? question.points : 0,
    userAnswer: userPairs,
  };
}

/**
 * Validate seal confirmation (user must type exact phrase)
 */
export function validateSeal(question: SealQuestion, userInput: string): QuizResult {
  const isCorrect = userInput.trim().toLowerCase() === question.confirmationPhrase.toLowerCase();
  return {
    questionId: question.id,
    isCorrect,
    pointsEarned: isCorrect ? question.points : 0,
    userAnswer: userInput,
  };
}

/**
 * Summarize quiz results
 */
export function summarizeQuiz(
  questions: QuizQuestion[],
  results: QuizResult[]
): QuizSummary {
  const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);
  const earnedPoints = results.reduce((sum, r) => sum + r.pointsEarned, 0);
  const correctAnswers = results.filter(r => r.isCorrect).length;
  const passPercent = totalPoints > 0 ? (earnedPoints / totalPoints) * 100 : 0;

  return {
    totalQuestions: questions.length,
    correctAnswers,
    totalPoints,
    earnedPoints,
    passPercent: Math.round(passPercent),
    passed: passPercent >= PASS_THRESHOLD,
  };
}
