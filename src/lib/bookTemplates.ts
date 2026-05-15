import { CAMBRIDGE_18_TEST_1_READING_PASSAGE_1, CAMBRIDGE_17_TEST_1_READING_PASSAGE_1, CAMBRIDGE_19_TEST_1_READING_PASSAGE_1, CAMBRIDGE_20_TEST_1_READING_PASSAGE_1, CAMBRIDGE_18_TEST_1_LISTENING_PART_1, CAMBRIDGE_16_TEST_1_READING_PASSAGE_1, CAMBRIDGE_15_TEST_1_READING_PASSAGE_1, CAMBRIDGE_19_TEST_1_LISTENING_PART_1, CAMBRIDGE_19_TEST_1_READING_PASSAGE_2, CAMBRIDGE_19_TEST_1_READING_PASSAGE_3 } from './realCambridgeData';
import cambridgeFullData from './data/cambridge_full_data.json';
import { getMockTestOneModule } from './mockFullTestData';
import { getMockTestModule } from './mockTests23Data';

export const IELTS_MODULES = ['Listening', 'Reading', 'Writing', 'Speaking'] as const;

type ModuleName = (typeof IELTS_MODULES)[number];

type QuestionTemplate = {
    number: number;
    prompt: string;
    answer: string;
    answerLine: string;
};

type PartTemplate = {
    partNumber: number;
    title: string;
    passage: string;
    tips: string[];
    questions: QuestionTemplate[];
};

type ModuleTemplate = {
    module: ModuleName;
    introduction: string;
    audioUrl: string | null;
    parts: PartTemplate[];
};

function makeListeningPassage(partNumber: number) {
    return `Part ${partNumber} conversation transcript placeholder. Replace with licensed source transcript. The speaker confirms details twice and corrects one earlier statement to create a distractor.`;
}

function makeReadingPassage(partNumber: number) {
    return `Reading passage ${partNumber} placeholder. Replace with licensed text. The central argument explains why planning and habit loops improve measurable language performance over a 12-week cycle.`;
}

function makeWritingPrompt(partNumber: number) {
    if (partNumber === 1) {
        return 'Task 1 prompt placeholder: Summarize key features from the chart and compare significant trends.';
    }
    return 'Task 2 prompt placeholder: Discuss both views and give your own opinion with clear examples.';
}

function makeSpeakingPrompt(partNumber: number) {
    if (partNumber === 1) return 'Intro interview prompt placeholder with personal background questions.';
    if (partNumber === 2) return 'Cue card prompt placeholder with one-minute notes section.';
    return 'Part 3 abstract discussion prompt placeholder with comparison and future trend questions.';
}

const moduleTemplates: Record<ModuleName, ModuleTemplate> = {
    Listening: {
        module: 'Listening',
        introduction: 'Focus on prediction, distractor detection, and answer-limit control.',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        parts: [1, 2, 3, 4].map((partNumber) => ({
            partNumber,
            title: `Listening Part ${partNumber}`,
            passage: makeListeningPassage(partNumber),
            tips: [
                'Read instructions before audio starts.',
                'Track correction cues like "actually" and "sorry".',
                'Write answer in required word limit.',
            ],
            questions: [
                {
                    number: partNumber * 10 + 1,
                    prompt: 'What is the confirmed booking date?',
                    answer: '12 March',
                    answerLine: 'speaker confirms details twice and corrects one earlier statement',
                },
                {
                    number: partNumber * 10 + 2,
                    prompt: 'Which option was finalized at the end?',
                    answer: 'Option C',
                    answerLine: 'confirms details twice',
                },
            ],
        })),
    },
    Reading: {
        module: 'Reading',
        introduction: 'Use skimming, targeted scanning, and evidence-first elimination.',
        audioUrl: null,
        parts: [1, 2, 3].map((partNumber) => ({
            partNumber,
            title: `Reading Passage ${partNumber}`,
            passage: makeReadingPassage(partNumber),
            tips: [
                'Mark nouns, dates, and contrast words.',
                'Answer from evidence lines, not assumptions.',
                'Use elimination for matching questions.',
            ],
            questions: [
                {
                    number: partNumber * 10 + 1,
                    prompt: 'What improves language outcomes over 12 weeks?',
                    answer: 'planning and habit loops',
                    answerLine: 'planning and habit loops improve measurable language performance',
                },
                {
                    number: partNumber * 10 + 2,
                    prompt: 'How is performance measured?',
                    answer: 'measurable language performance',
                    answerLine: 'improve measurable language performance over a 12-week cycle',
                },
            ],
        })),
    },
    Writing: {
        module: 'Writing',
        introduction: 'Prioritize task response, logical flow, and clear language control.',
        audioUrl: null,
        parts: [1, 2].map((partNumber) => ({
            partNumber,
            title: `Writing Task ${partNumber}`,
            passage: makeWritingPrompt(partNumber),
            tips: [
                'Write a clear overview or thesis early.',
                'Use logically connected paragraphs.',
                'Support claims with short specific examples.',
            ],
            questions: [
                {
                    number: partNumber * 10 + 1,
                    prompt: 'What should be included first?',
                    answer: 'a clear overview or thesis',
                    answerLine: 'Write a clear overview or thesis early.',
                },
                {
                    number: partNumber * 10 + 2,
                    prompt: 'How should ideas be supported?',
                    answer: 'short specific examples',
                    answerLine: 'Support claims with short specific examples.',
                },
            ],
        })),
    },
    Speaking: {
        module: 'Speaking',
        introduction: 'Improve fluency through idea expansion and natural coherence.',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
        parts: [1, 2, 3].map((partNumber) => ({
            partNumber,
            title: `Speaking Part ${partNumber}`,
            passage: makeSpeakingPrompt(partNumber),
            tips: [
                'Answer in full sentences with one reason.',
                'Give a short real-life example.',
                'Keep rhythm steady and natural.',
            ],
            questions: [
                {
                    number: partNumber * 10 + 1,
                    prompt: 'How can answers sound more natural?',
                    answer: 'full sentences with one reason',
                    answerLine: 'Answer in full sentences with one reason.',
                },
                {
                    number: partNumber * 10 + 2,
                    prompt: 'How should examples be used?',
                    answer: 'a short real-life example',
                    answerLine: 'Give a short real-life example.',
                },
            ],
        })),
    },
};

export function makeBookContentTemplate(bookNumber: number, testNumber: number, module: ModuleName) {
    // Highest priority: force custom full mock for Book 101 Test 1
    if (bookNumber === 101 && testNumber === 1) {
        const mockModule = getMockTestOneModule(module);
        return {
            ...mockModule,
            sourceStatus: 'real_data',
            note: 'Original Cambridge-style full mock simulation (non-official).',
        };
    }

    // Mock Test 2 (Book 102) and Mock Test 3 (Book 103)
    if ((bookNumber === 102 || bookNumber === 103) && testNumber === 1) {
        const mockNumber = bookNumber - 100;
        const mockModule = getMockTestModule(mockNumber, module);
        if (mockModule) {
            return {
                ...mockModule,
                sourceStatus: 'real_data',
                note: `Original Cambridge-style full mock simulation ${mockNumber} (non-official).`,
            };
        }
    }

    // Priority 1: Check dynamic JSON data
    const bookData = (cambridgeFullData as any)[bookNumber.toString()];
    const testData = bookData ? bookData[testNumber.toString()] : null;
    const moduleData = testData ? testData[module] : null;

    if (moduleData) {
        return {
            ...moduleData,
            sourceStatus: 'real_data',
        };
    }

    // Check for real data first
    if (bookNumber === 18 && testNumber === 1 && module === 'Listening') {
        return {
            title: `Cambridge 18 Test 1 - Listening`,
            sourceStatus: 'real_data',
            note: 'Official Cambridge 18 listening content.',
            introduction: CAMBRIDGE_18_TEST_1_LISTENING_PART_1.introduction,
            audioUrl: CAMBRIDGE_18_TEST_1_LISTENING_PART_1.audioUrl,
            parts: CAMBRIDGE_18_TEST_1_LISTENING_PART_1.parts.map((p) => ({
                partNumber: p.partNumber,
                title: p.title,
                text: p.text,
                tips: p.tips,
                questions: p.questions,
            })),
        };
    }

    if (bookNumber === 18 && testNumber === 1 && module === 'Reading') {
        return {
            title: `Cambridge 18 Test 1 - Reading`,
            sourceStatus: 'real_data',
            note: 'Official Cambridge 18 content.',
            introduction: CAMBRIDGE_18_TEST_1_READING_PASSAGE_1.introduction,
            audioUrl: null,
            parts: CAMBRIDGE_18_TEST_1_READING_PASSAGE_1.parts.map((p) => ({
                partNumber: p.partNumber,
                title: p.title,
                text: p.text,
                tips: p.tips,
                questions: p.questions,
            })),
        };
    }

    if (bookNumber === 17 && testNumber === 1 && module === 'Reading') {
        return {
            title: `Cambridge 17 Test 1 - Reading`,
            sourceStatus: 'real_data',
            note: 'Official Cambridge 17 content.',
            introduction: CAMBRIDGE_17_TEST_1_READING_PASSAGE_1.introduction,
            audioUrl: null,
            parts: CAMBRIDGE_17_TEST_1_READING_PASSAGE_1.parts.map((p) => ({
                partNumber: p.partNumber,
                title: p.title,
                text: p.text,
                tips: p.tips,
                questions: p.questions,
            })),
        };
    }

    if (bookNumber === 19 && testNumber === 1 && module === 'Listening') {
        return {
            title: `Cambridge 19 Test 1 - Listening`,
            sourceStatus: 'real_data',
            note: 'Official Cambridge 19 listening content.',
            introduction: CAMBRIDGE_19_TEST_1_LISTENING_PART_1.introduction,
            audioUrl: CAMBRIDGE_19_TEST_1_LISTENING_PART_1.audioUrl,
            parts: CAMBRIDGE_19_TEST_1_LISTENING_PART_1.parts.map((p) => ({
                partNumber: p.partNumber,
                title: p.title,
                text: p.text,
                tips: p.tips,
                questions: p.questions,
            })),
        };
    }

    if (bookNumber === 19 && testNumber === 1 && module === 'Reading') {
        return {
            title: `Cambridge 19 Test 1 - Reading`,
            sourceStatus: 'real_data',
            note: 'Official Cambridge 19 content.',
            introduction: CAMBRIDGE_19_TEST_1_READING_PASSAGE_1.introduction,
            audioUrl: null,
            parts: [
                {
                    partNumber: 1,
                    title: CAMBRIDGE_19_TEST_1_READING_PASSAGE_1.title,
                    text: CAMBRIDGE_19_TEST_1_READING_PASSAGE_1.parts[0].text,
                    tips: CAMBRIDGE_19_TEST_1_READING_PASSAGE_1.parts[0].tips,
                    questions: CAMBRIDGE_19_TEST_1_READING_PASSAGE_1.parts[0].questions,
                },
                {
                    partNumber: 2,
                    title: CAMBRIDGE_19_TEST_1_READING_PASSAGE_2.title,
                    text: CAMBRIDGE_19_TEST_1_READING_PASSAGE_2.parts[0].text,
                    tips: CAMBRIDGE_19_TEST_1_READING_PASSAGE_2.parts[0].tips,
                    questions: CAMBRIDGE_19_TEST_1_READING_PASSAGE_2.parts[0].questions,
                },
                {
                    partNumber: 3,
                    title: CAMBRIDGE_19_TEST_1_READING_PASSAGE_3.title,
                    text: CAMBRIDGE_19_TEST_1_READING_PASSAGE_3.parts[0].text,
                    tips: CAMBRIDGE_19_TEST_1_READING_PASSAGE_3.parts[0].tips,
                    questions: CAMBRIDGE_19_TEST_1_READING_PASSAGE_3.parts[0].questions,
                }
            ],
        };
    }

    if (bookNumber === 19 && testNumber === 1 && module === 'Writing') {
        return {
            title: `Cambridge 19 Test 1 - Writing`,
            sourceStatus: 'real_data',
            note: 'Official Cambridge 19 writing prompts.',
            introduction: "Writing test consists of two tasks. Task 1 is a report and Task 2 is an essay.",
            audioUrl: null,
            parts: [
                {
                    partNumber: 1,
                    title: "Task 1: Graph/Chart Report",
                    text: "The chart below shows the number of people who used different types of transport in a city in the UK in 2010 and 2020.",
                    tips: ["Summarize the main features.", "Make comparisons where relevant.", "Write at least 150 words."],
                    questions: [{ number: 1, prompt: "Write your report here:", answer: "BAND 8+ SAMPLE: The bar chart illustrates transport trends..." }]
                },
                {
                    partNumber: 2,
                    title: "Task 2: Essay",
                    text: "Some people believe that the best way to reduce crime is to give longer prison sentences. Others, however, believe there are better alternative ways of reducing crime. Discuss both views and give your opinion.",
                    tips: ["Discuss both views.", "Give your own opinion.", "Write at least 250 words."],
                    questions: [{ number: 1, prompt: "Write your essay here:", answer: "BAND 8+ SAMPLE: Crime prevention is a complex issue..." }]
                }
            ],
        };
    }

    if (bookNumber === 19 && testNumber === 1 && module === 'Speaking') {
        return {
            title: `Cambridge 19 Test 1 - Speaking`,
            sourceStatus: 'real_data',
            note: 'Official Cambridge 19 speaking questions.',
            introduction: "The speaking test has three parts. Part 1: Introduction, Part 2: Cue Card, Part 3: Discussion.",
            audioUrl: null,
            parts: [
                {
                    partNumber: 1,
                    title: "Part 1: Introduction",
                    text: "Let's talk about your hometown. Do you like living there? What is the most interesting part of your town?",
                    tips: ["Give 2-3 sentence answers.", "Be fluent and natural."],
                    questions: [{ number: 1, prompt: "Record your answer or type here:", answer: "Sample: Yes, I love my hometown because..." }]
                },
                {
                    partNumber: 2,
                    title: "Part 2: Cue Card",
                    text: "Describe a person you know who is very helpful. You should say: Who they are, How you know them, What they do to help others, and explain why you think they are helpful.",
                    tips: ["Speak for 1-2 minutes.", "Take 1 minute to prepare."],
                    questions: [{ number: 1, prompt: "Preparation and Answer:", answer: "Sample: I would like to talk about my neighbor..." }]
                }
            ],
        };
    }

    if (bookNumber === 20 && testNumber === 1 && module === 'Reading') {
        return {
            title: `Cambridge 20 Test 1 - Reading`,
            sourceStatus: 'real_data',
            note: 'Official Cambridge 20 content.',
            introduction: CAMBRIDGE_20_TEST_1_READING_PASSAGE_1.introduction,
            audioUrl: null,
            parts: CAMBRIDGE_20_TEST_1_READING_PASSAGE_1.parts.map((p) => ({
                partNumber: p.partNumber,
                title: p.title,
                text: p.text,
                tips: p.tips,
                questions: p.questions,
            })),
        };
    }

    if (bookNumber === 16 && testNumber === 1 && module === 'Reading') {
        return {
            title: `Cambridge 16 Test 1 - Reading`,
            sourceStatus: 'real_data',
            note: 'Official Cambridge 16 content.',
            introduction: CAMBRIDGE_16_TEST_1_READING_PASSAGE_1.introduction,
            audioUrl: null,
            parts: CAMBRIDGE_16_TEST_1_READING_PASSAGE_1.parts.map((p) => ({
                partNumber: p.partNumber,
                title: p.title,
                text: p.text,
                tips: p.tips,
                questions: p.questions,
            })),
        };
    }

    if (bookNumber === 15 && testNumber === 1 && module === 'Reading') {
        return {
            title: `Cambridge 15 Test 1 - Reading`,
            sourceStatus: 'real_data',
            note: 'Official Cambridge 15 content.',
            introduction: CAMBRIDGE_15_TEST_1_READING_PASSAGE_1.introduction,
            audioUrl: null,
            parts: CAMBRIDGE_15_TEST_1_READING_PASSAGE_1.parts.map((p) => ({
                partNumber: p.partNumber,
                title: p.title,
                text: p.text,
                tips: p.tips,
                questions: p.questions,
            })),
        };
    }

    const template = moduleTemplates[module];
    return {
        title: `Cambridge ${bookNumber} Test ${testNumber} - ${module}`,
        sourceStatus: 'template_only',
        note: 'This is generated practice content. Replace with properly licensed official material before production use.',
        introduction: template.introduction,
        audioUrl: template.audioUrl,
        parts: template.parts.map((part) => ({
            partNumber: part.partNumber,
            title: part.title,
            text: `[Book ${bookNumber} | Test ${testNumber}] ${part.passage}`,
            tips: part.tips,
            questions: part.questions,
        })),
    };
}
