import { QUIZ_QUESTIONS } from './paraphraseData';
import { QUIZ_BATCH_1 } from './quizBatch1';
import { QUIZ_BATCH_2 } from './quizBatch2';
import { QUIZ_BATCH_3 } from './quizBatch3';
import { QUIZ_BATCH_4 } from './quizBatch4';
import { QUIZ_BATCH_5 } from './quizBatch5';
import { QUIZ_BATCH_6 } from './quizBatch6';
import { QUIZ_BATCH_7 } from './quizBatch7';
import type { QuizQuestion } from './paraphraseData';

export const ALL_QUIZ_QUESTIONS: QuizQuestion[] = [
    ...QUIZ_QUESTIONS,
    ...QUIZ_BATCH_1,
    ...QUIZ_BATCH_2,
    ...QUIZ_BATCH_3,
    ...QUIZ_BATCH_4,
    ...QUIZ_BATCH_5,
    ...QUIZ_BATCH_6,
    ...QUIZ_BATCH_7,
];

export type { QuizQuestion };
