export type IELTSModuleName = 'Listening' | 'Reading' | 'Writing' | 'Speaking';

export type IELTSQuestionType =
    | 'fill_in_blank'
    | 'mcq'
    | 'double_mcq'
    | 'true_false'
    | 'matching'
    | 'open';

export type IELTSQuestion = {
    number: number;
    type: IELTSQuestionType;
    prompt: string;
    answer: string;
    answerLine?: string;
    options?: string[];
};

export type IELTSPart = {
    partNumber: number;
    title: string;
    text: string;
    audioUrl?: string | null;
    tips: string[];
    questions: IELTSQuestion[];
};

export type IELTSModuleExamConfig = {
    module: IELTSModuleName;
    durationMinutes: number;
    totalQuestions: number;
    partCount: number;
    partQuestionPattern: number[];
    allowedQuestionTypes: IELTSQuestionType[];
};

export type IELTSModuleContent = {
    title: string;
    introduction: string;
    audioUrl?: string | null;
    examConfig: IELTSModuleExamConfig;
    parts: IELTSPart[];
};

export type IELTSMockTest = {
    id: string;
    title: string;
    sourceStatus: 'real_data' | 'template_only';
    modules: Record<IELTSModuleName, IELTSModuleContent>;
};

export const IELTS_MODULE_BLUEPRINT: Record<IELTSModuleName, IELTSModuleExamConfig> = {
    Listening: {
        module: 'Listening',
        durationMinutes: 30,
        totalQuestions: 40,
        partCount: 4,
        partQuestionPattern: [10, 10, 10, 10],
        allowedQuestionTypes: ['fill_in_blank', 'mcq', 'double_mcq', 'matching'],
    },
    Reading: {
        module: 'Reading',
        durationMinutes: 60,
        totalQuestions: 40,
        partCount: 3,
        partQuestionPattern: [13, 13, 14],
        allowedQuestionTypes: ['fill_in_blank', 'mcq', 'double_mcq', 'true_false', 'matching'],
    },
    Writing: {
        module: 'Writing',
        durationMinutes: 60,
        totalQuestions: 2,
        partCount: 2,
        partQuestionPattern: [1, 1],
        allowedQuestionTypes: ['open', 'fill_in_blank'],
    },
    Speaking: {
        module: 'Speaking',
        durationMinutes: 15,
        totalQuestions: 12,
        partCount: 3,
        partQuestionPattern: [5, 3, 4],
        allowedQuestionTypes: ['open', 'fill_in_blank'],
    },
};

function makePlaceholderQuestion(index: number, type: IELTSQuestionType): IELTSQuestion {
    return {
        number: index,
        type,
        prompt: `Question ${index} placeholder`,
        answer: type === 'open' ? 'open' : 'TBD',
        answerLine: 'Add source/evidence line here.',
    };
}

export function buildMockModuleShell(module: IELTSModuleName, prefix: string): IELTSModuleContent {
    const config = IELTS_MODULE_BLUEPRINT[module];
    let runningNumber = 1;

    const parts = config.partQuestionPattern.map((count, partIdx) => {
        const questions: IELTSQuestion[] = [];
        for (let i = 0; i < count; i += 1) {
            const type = config.allowedQuestionTypes[0] || 'fill_in_blank';
            questions.push(makePlaceholderQuestion(runningNumber, type));
            runningNumber += 1;
        }

        return {
            partNumber: partIdx + 1,
            title: `${module} Part ${partIdx + 1}`,
            text: `${prefix} ${module} Part ${partIdx + 1} passage/script placeholder.`,
            tips: ['Add final exam-level tips here.'],
            questions,
        };
    });

    return {
        title: `${prefix} - ${module}`,
        introduction: `${module} module placeholder. Replace with final mock content.`,
        audioUrl: module === 'Listening' ? '/api/audio?preset=replace-me' : null,
        examConfig: config,
        parts,
    };
}

export function buildMockTestShell(mockNumber: number): IELTSMockTest {
    const prefix = `Full Mock Test ${mockNumber}`;
    return {
        id: `mock-${mockNumber}`,
        title: prefix,
        sourceStatus: 'template_only',
        modules: {
            Listening: buildMockModuleShell('Listening', prefix),
            Reading: buildMockModuleShell('Reading', prefix),
            Writing: buildMockModuleShell('Writing', prefix),
            Speaking: buildMockModuleShell('Speaking', prefix),
        },
    };
}

export function validateModuleAgainstBlueprint(module: IELTSModuleContent): string[] {
    const errors: string[] = [];
    const blueprint = IELTS_MODULE_BLUEPRINT[module.examConfig.module];

    if (module.parts.length !== blueprint.partCount) {
        errors.push(`Expected ${blueprint.partCount} parts, found ${module.parts.length}.`);
    }

    const totalQuestions = module.parts.reduce((sum, part) => sum + part.questions.length, 0);
    if (totalQuestions !== blueprint.totalQuestions) {
        errors.push(`Expected ${blueprint.totalQuestions} questions, found ${totalQuestions}.`);
    }

    module.parts.forEach((part, idx) => {
        const expected = blueprint.partQuestionPattern[idx];
        if (typeof expected === 'number' && part.questions.length !== expected) {
            errors.push(`Part ${part.partNumber} expected ${expected} questions, found ${part.questions.length}.`);
        }
        for (const q of part.questions) {
            if (!blueprint.allowedQuestionTypes.includes(q.type)) {
                errors.push(`Question ${q.number} has invalid type "${q.type}" for ${module.examConfig.module}.`);
            }
        }
    });

    return errors;
}
