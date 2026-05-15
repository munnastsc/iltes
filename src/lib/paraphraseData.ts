// ─── PARAPHRASE TECHNIQUES ───────────────────────────────────────────────────

export type TechniqueId =
    | 'synonym'
    | 'active_passive'
    | 'nominalization'
    | 'clause_restructure'
    | 'antonym_negation'
    | 'word_form';

export type Technique = {
    id: TechniqueId;
    name: string;
    bangla: string;
    description: string;
    howTo: string;
    examples: Array<{ original: string; paraphrase: string; highlight: string }>;
};

export const TECHNIQUES: Technique[] = [
    {
        id: 'synonym',
        name: 'Synonym Replacement',
        bangla: 'সমার্থক শব্দ দিয়ে বদলানো',
        description: 'একটা শব্দের বদলে তার সমার্থক (same meaning) শব্দ বসানো। IELTS এ সবচেয়ে বেশি ব্যবহৃত technique।',
        howTo: 'Question এ একটা word দেখলে passage এ তার synonym খোঁজো। Passage কখনো Question এর exact word repeat করে না।',
        examples: [
            {
                original: 'The population increased significantly.',
                paraphrase: 'The number of people grew considerably.',
                highlight: 'increased → grew, significantly → considerably',
            },
            {
                original: 'Scientists discovered a new method.',
                paraphrase: 'Researchers found a novel technique.',
                highlight: 'scientists → researchers, discovered → found, new → novel, method → technique',
            },
            {
                original: 'The government introduced strict regulations.',
                paraphrase: 'Authorities implemented tight rules.',
                highlight: 'government → authorities, introduced → implemented, strict → tight, regulations → rules',
            },
        ],
    },
    {
        id: 'active_passive',
        name: 'Active ↔ Passive Voice',
        bangla: 'সক্রিয় ↔ নিষ্ক্রিয় বাক্য',
        description: 'Active voice (কর্তা কাজ করে) কে Passive voice (কাজটি হয়) তে বা উল্টো করে লেখা।',
        howTo: 'Active: Subject + Verb + Object → Passive: Object + "was/were/is" + past participle + "by" + Subject',
        examples: [
            {
                original: 'Scientists conducted extensive research on this topic.',
                paraphrase: 'Extensive research on this topic was conducted by scientists.',
                highlight: 'conducted → was conducted (passive)',
            },
            {
                original: 'The university awarded prizes to top students.',
                paraphrase: 'Prizes were awarded to top students by the university.',
                highlight: 'awarded → were awarded (passive)',
            },
            {
                original: 'The government has banned the use of plastic bags.',
                paraphrase: 'The use of plastic bags has been banned by the government.',
                highlight: 'has banned → has been banned (passive)',
            },
        ],
    },
    {
        id: 'nominalization',
        name: 'Nominalization',
        bangla: 'Verb/Adjective → Noun এ রূপান্তর',
        description: 'Verb বা Adjective কে Noun এ convert করা। Academic writing এবং IELTS Reading এ খুব common।',
        howTo: 'Verb → Noun: investigate → investigation, develop → development\nAdjective → Noun: important → importance, difficult → difficulty',
        examples: [
            {
                original: 'Scientists investigated how pollution affects marine life.',
                paraphrase: 'An investigation into the effects of pollution on marine life was conducted.',
                highlight: 'investigated → investigation, affects → effects',
            },
            {
                original: 'The company failed to meet safety standards.',
                paraphrase: 'The company\'s failure to meet safety standards was noted.',
                highlight: 'failed → failure',
            },
            {
                original: 'Governments need to improve public transport.',
                paraphrase: 'There is a need for improvement in public transport by governments.',
                highlight: 'improve → improvement, need → need (noun form)',
            },
        ],
    },
    {
        id: 'clause_restructure',
        name: 'Clause Restructuring',
        bangla: 'বাক্য কাঠামো পরিবর্তন',
        description: 'একই meaning রেখে বাক্যের গঠন সম্পূর্ণ বদলানো। যেমন: Although + clause → Despite + noun phrase।',
        howTo: 'Although/Even though → Despite/In spite of\nBecause/Since → Due to/Owing to/As a result of\nWhen/After → Following/Upon',
        examples: [
            {
                original: 'Although the experiment failed, the team continued.',
                paraphrase: 'Despite the failure of the experiment, the team continued.',
                highlight: 'Although [clause] → Despite [noun phrase]',
            },
            {
                original: 'Because the climate is changing, species are at risk.',
                paraphrase: 'Due to climate change, species are at risk.',
                highlight: 'Because [clause] → Due to [noun phrase]',
            },
            {
                original: 'When the report was published, it caused controversy.',
                paraphrase: 'Following the publication of the report, controversy arose.',
                highlight: 'When [clause] → Following [noun phrase]',
            },
        ],
    },
    {
        id: 'antonym_negation',
        name: 'Antonym + Negation',
        bangla: 'বিপরীত শব্দ + না',
        description: 'একটা word এর বিপরীত (opposite) word নিয়ে তাতে "not/no/never" যোগ করলে মানে একই হয়।',
        howTo: 'important → not unimportant\nsuccessful → not unsuccessful\nrare → not common\nincreased → did not decrease',
        examples: [
            {
                original: 'The results were inconclusive.',
                paraphrase: 'The findings did not provide a definitive answer.',
                highlight: 'inconclusive → not + definitive',
            },
            {
                original: 'The treatment proved effective.',
                paraphrase: 'The treatment was not ineffective.',
                highlight: 'effective → not + ineffective',
            },
            {
                original: 'Renewable energy is becoming increasingly affordable.',
                paraphrase: 'Renewable energy is no longer prohibitively expensive.',
                highlight: 'affordable → not + expensive (antonym negation)',
            },
        ],
    },
    {
        id: 'word_form',
        name: 'Word Form Change',
        bangla: 'শব্দের রূপ পরিবর্তন',
        description: 'একই মূল থেকে আসা ভিন্ন parts of speech ব্যবহার করা।',
        howTo: 'Verb → Adjective: analyse → analytical\nNoun → Verb: a decision → to decide\nAdjective → Adverb: rapid → rapidly',
        examples: [
            {
                original: 'The analysis showed surprising results.',
                paraphrase: 'The results of the analytical study were surprising.',
                highlight: 'analysis → analytical',
            },
            {
                original: 'The rapid spread of the disease alarmed doctors.',
                paraphrase: 'The disease spread rapidly, alarming doctors.',
                highlight: 'rapid (adjective) → rapidly (adverb)',
            },
            {
                original: 'The discovery was significant.',
                paraphrase: 'Scientists significantly advanced knowledge with their discovery.',
                highlight: 'significant (adj) → significantly (adverb)',
            },
        ],
    },
];

// ─── QUIZ QUESTIONS ───────────────────────────────────────────────────────────

export type QuizType = 'find_paraphrase' | 'find_source' | 'identify_technique';

export type QuizQuestion = {
    id: string;
    type: QuizType;
    context: 'reading' | 'listening' | 'writing';
    difficulty: 'easy' | 'medium' | 'hard';
    instruction: string;
    display: string;
    display2?: string;
    options: Array<{ text: string; isCorrect: boolean }>;
    technique: TechniqueId;
    explanation: string;
};

export const QUIZ_QUESTIONS: QuizQuestion[] = [
    // ── FIND PARAPHRASE — EASY ───────────────────────────────────────────────
    {
        id: 'fp1',
        type: 'find_paraphrase',
        context: 'reading',
        difficulty: 'easy',
        instruction: 'নিচের বাক্যটির সঠিক Paraphrase কোনটি?',
        display: 'The number of people living in cities increased rapidly during the 20th century.',
        options: [
            { text: 'Urban populations grew quickly throughout the 1900s.', isCorrect: true },
            { text: 'City residents moved to rural areas during the last century.', isCorrect: false },
            { text: 'Population growth was slow in most urban centres after 1900.', isCorrect: false },
            { text: 'The 20th century saw major changes in city planning worldwide.', isCorrect: false },
        ],
        technique: 'synonym',
        explanation: 'number of people → populations | living in cities → urban | increased → grew | rapidly → quickly | 20th century → 1900s — সবগুলো synonym দিয়ে বদলানো হয়েছে।',
    },
    {
        id: 'fp2',
        type: 'find_paraphrase',
        context: 'reading',
        difficulty: 'easy',
        instruction: 'নিচের বাক্যটির সঠিক Paraphrase কোনটি?',
        display: 'Scientists discovered that regular exercise helps prevent heart disease.',
        options: [
            { text: 'Researchers found that frequent physical activity reduces the risk of cardiac illness.', isCorrect: true },
            { text: 'Exercise was proven to have some benefits for mental health conditions.', isCorrect: false },
            { text: 'Scientists proved that diet is far more important than exercise.', isCorrect: false },
            { text: 'Research suggests that heart disease is becoming less common globally.', isCorrect: false },
        ],
        technique: 'synonym',
        explanation: 'Scientists → Researchers | discovered → found | regular → frequent | exercise → physical activity | helps prevent → reduces the risk of | heart disease → cardiac illness',
    },
    {
        id: 'fp3',
        type: 'find_paraphrase',
        context: 'reading',
        difficulty: 'easy',
        instruction: 'নিচের বাক্যটির সঠিক Paraphrase কোনটি?',
        display: 'The government introduced new regulations to control pollution.',
        options: [
            { text: 'Authorities implemented fresh rules to manage environmental contamination.', isCorrect: true },
            { text: 'The government suggested that companies reduce their waste output voluntarily.', isCorrect: false },
            { text: 'New pollution levels were measured and reported by government agencies.', isCorrect: false },
            { text: 'Environmental groups pressured the government to take stronger action.', isCorrect: false },
        ],
        technique: 'synonym',
        explanation: 'government → authorities | introduced → implemented | new → fresh | regulations → rules | control → manage | pollution → environmental contamination',
    },
    {
        id: 'fp4',
        type: 'find_paraphrase',
        context: 'reading',
        difficulty: 'easy',
        instruction: 'নিচের বাক্যটির সঠিক Paraphrase কোনটি?',
        display: 'The ancient ruins attracted millions of tourists every year.',
        options: [
            { text: 'The historic remains drew vast numbers of visitors on an annual basis.', isCorrect: true },
            { text: 'Tourism increased significantly in areas with cultural heritage sites.', isCorrect: false },
            { text: 'Ancient ruins are often difficult to preserve due to tourist activity.', isCorrect: false },
            { text: 'The government invested heavily in protecting the archaeological site.', isCorrect: false },
        ],
        technique: 'synonym',
        explanation: 'ancient → historic | ruins → remains | attracted → drew | millions → vast numbers | every year → on an annual basis',
    },
    {
        id: 'fp5',
        type: 'find_paraphrase',
        context: 'listening',
        difficulty: 'easy',
        instruction: 'নিচের বাক্যটির সঠিক Paraphrase কোনটি?',
        display: 'The library closes at nine o\'clock on weekday evenings.',
        options: [
            { text: 'On weeknights, the library shuts its doors at 9 pm.', isCorrect: true },
            { text: 'The library is open until midnight on weekends only.', isCorrect: false },
            { text: 'Library opening hours are extended during examination periods.', isCorrect: false },
            { text: 'Weekday access to the library requires a valid student card.', isCorrect: false },
        ],
        technique: 'synonym',
        explanation: 'closes → shuts its doors | weekday evenings → weeknights | nine o\'clock → 9 pm — Simple synonym replacement।',
    },
    // ── FIND PARAPHRASE — MEDIUM ─────────────────────────────────────────────
    {
        id: 'fp6',
        type: 'find_paraphrase',
        context: 'reading',
        difficulty: 'medium',
        instruction: 'নিচের বাক্যটির সঠিক Paraphrase কোনটি?',
        display: 'Although the treatment was expensive, many patients still chose it.',
        options: [
            { text: 'Despite the high cost of the treatment, it remained a popular choice among patients.', isCorrect: true },
            { text: 'Patients preferred cheaper treatments because they were more effective.', isCorrect: false },
            { text: 'The high expense of treatment meant very few patients could afford it.', isCorrect: false },
            { text: 'Many patients were unaware of the treatment costs before choosing it.', isCorrect: false },
        ],
        technique: 'clause_restructure',
        explanation: 'Although [clause] → Despite [noun phrase] — "Although the treatment was expensive" → "Despite the high cost of the treatment"。 এটা clause restructuring technique।',
    },
    {
        id: 'fp7',
        type: 'find_paraphrase',
        context: 'reading',
        difficulty: 'medium',
        instruction: 'নিচের বাক্যটির সঠিক Paraphrase কোনটি?',
        display: 'Scientists are investigating how deforestation affects biodiversity.',
        options: [
            { text: 'An investigation into the effects of deforestation on biodiversity is being conducted.', isCorrect: true },
            { text: 'Deforestation has been proven to have minimal impact on biodiversity.', isCorrect: false },
            { text: 'Biodiversity loss is caused primarily by factors other than deforestation.', isCorrect: false },
            { text: 'Scientists have concluded their research on deforestation and animal species.', isCorrect: false },
        ],
        technique: 'nominalization',
        explanation: 'are investigating → investigation (verb→noun) | affects → effects (verb→noun) — এটা Nominalization technique। Verb গুলো Noun এ convert হয়েছে।',
    },
    {
        id: 'fp8',
        type: 'find_paraphrase',
        context: 'reading',
        difficulty: 'medium',
        instruction: 'নিচের বাক্যটির সঠিক Paraphrase কোনটি?',
        display: 'People who live in rural areas tend to earn less than urban residents.',
        options: [
            { text: 'Rural dwellers generally have lower incomes than those in cities.', isCorrect: true },
            { text: 'Urban residents are more likely to move to rural areas for affordable housing.', isCorrect: false },
            { text: 'Income levels are roughly equal in both rural and urban settings.', isCorrect: false },
            { text: 'People prefer rural areas despite the lower wages available there.', isCorrect: false },
        ],
        technique: 'synonym',
        explanation: 'People who live in rural areas → Rural dwellers | tend to earn less → generally have lower incomes | urban residents → those in cities — Multiple synonyms একসাথে।',
    },
    {
        id: 'fp9',
        type: 'find_paraphrase',
        context: 'reading',
        difficulty: 'medium',
        instruction: 'নিচের বাক্যটির সঠিক Paraphrase কোনটি?',
        display: 'The company\'s failure to meet the deadline resulted in financial penalties.',
        options: [
            { text: 'Because the company failed to meet the deadline, it faced financial penalties.', isCorrect: true },
            { text: 'The company met the deadline but faced financial difficulties anyway.', isCorrect: false },
            { text: 'Financial penalties were avoided because the company extended the deadline.', isCorrect: false },
            { text: 'The company suffered reputational damage but avoided any financial consequences.', isCorrect: false },
        ],
        technique: 'word_form',
        explanation: 'failure (noun) → failed (verb) — Word form change। "The company\'s failure" → "Because the company failed" — Noun form to verbal clause।',
    },
    {
        id: 'fp10',
        type: 'find_paraphrase',
        context: 'listening',
        difficulty: 'medium',
        instruction: 'নিচের বাক্যটির সঠিক Paraphrase কোনটি?',
        display: 'The assignment must be submitted by the end of next Friday.',
        options: [
            { text: 'Students are required to hand in their work no later than Friday of next week.', isCorrect: true },
            { text: 'The deadline for the assignment has been extended to the following Monday.', isCorrect: false },
            { text: 'Students who miss Friday\'s deadline will not be penalised.', isCorrect: false },
            { text: 'The assignment can be submitted any time during next week.', isCorrect: false },
        ],
        technique: 'synonym',
        explanation: 'must be submitted → required to hand in | by the end of → no later than | next Friday → Friday of next week — Listening paraphrase তে common এই patterns।',
    },
    {
        id: 'fp11',
        type: 'find_paraphrase',
        context: 'reading',
        difficulty: 'medium',
        instruction: 'নিচের বাক্যটির সঠিক Paraphrase কোনটি?',
        display: 'Coral ecosystems support an estimated 25 percent of all marine species.',
        options: [
            { text: 'Approximately a quarter of all ocean species depend on coral reef habitats.', isCorrect: true },
            { text: 'Marine biologists estimate that 25% of coral is currently at risk of dying.', isCorrect: false },
            { text: 'Coral covers roughly 25% of the world\'s ocean floor area.', isCorrect: false },
            { text: 'A quarter of all coral species have been discovered by marine scientists.', isCorrect: false },
        ],
        technique: 'synonym',
        explanation: 'Coral ecosystems → coral reef habitats | support → depend on | estimated 25% → approximately a quarter | marine species → ocean species — Real Cambridge pattern থেকে।',
    },
    // ── FIND PARAPHRASE — HARD ───────────────────────────────────────────────
    {
        id: 'fp12',
        type: 'find_paraphrase',
        context: 'reading',
        difficulty: 'hard',
        instruction: 'নিচের বাক্যটির সঠিক Paraphrase কোনটি?',
        display: 'Residents living within 300 metres of a park experience lower rates of anxiety.',
        options: [
            { text: 'Access to green spaces within a short distance is associated with reduced levels of stress.', isCorrect: true },
            { text: 'Parks with walking paths help residents maintain physical fitness goals.', isCorrect: false },
            { text: 'Urban planning should incorporate more green spaces to improve livability.', isCorrect: false },
            { text: 'Anxiety rates are higher in areas where parks are not maintained properly.', isCorrect: false },
        ],
        technique: 'synonym',
        explanation: 'living within 300 metres → access within a short distance | park → green spaces | experience lower rates → associated with reduced levels | anxiety → stress — Multiple complex synonym changes।',
    },
    {
        id: 'fp13',
        type: 'find_paraphrase',
        context: 'reading',
        difficulty: 'hard',
        instruction: 'নিচের বাক্যটির সঠিক Paraphrase কোনটি?',
        display: 'Early investment in prevention is significantly more cost-effective than remediation after harm has occurred.',
        options: [
            { text: 'Addressing problems before they arise is far cheaper than fixing damage after the fact.', isCorrect: true },
            { text: 'Governments should increase spending on both prevention and remediation equally.', isCorrect: false },
            { text: 'Prevention strategies are widely recognised but rarely funded adequately.', isCorrect: false },
            { text: 'The cost of remediation depends largely on the severity of the harm caused.', isCorrect: false },
        ],
        technique: 'clause_restructure',
        explanation: 'Early investment in prevention → Addressing problems before they arise | more cost-effective → far cheaper | remediation after harm → fixing damage after the fact — Complex restructuring with synonyms।',
    },
    {
        id: 'fp14',
        type: 'find_paraphrase',
        context: 'reading',
        difficulty: 'hard',
        instruction: 'নিচের বাক্যটির সঠিক Paraphrase কোনটি?',
        display: 'The precise conditions under which the phenomenon occurs remain subject to ongoing scientific debate.',
        options: [
            { text: 'The topic is not yet fully understood by all researchers.', isCorrect: true },
            { text: 'Scientists have reached a consensus on the causes of the phenomenon.', isCorrect: false },
            { text: 'The phenomenon has been replicated successfully in laboratory conditions.', isCorrect: false },
            { text: 'Debate among scientists has been resolved through a series of new experiments.', isCorrect: false },
        ],
        technique: 'antonym_negation',
        explanation: '"remain subject to ongoing scientific debate" → "not yet fully understood" — এটা Antonym+Negation। Debate থাকা মানে fully understood নয়।',
    },
    {
        id: 'fp15',
        type: 'find_paraphrase',
        context: 'reading',
        difficulty: 'hard',
        instruction: 'নিচের বাক্যটির সঠিক Paraphrase কোনটি?',
        display: 'Occupational stress has been identified as a significant contributor to severe psychological disorders.',
        options: [
            { text: 'Researchers have found that stress at work can lead to serious mental health problems.', isCorrect: true },
            { text: 'Mental health professionals recommend reducing workplace expectations to lower stress.', isCorrect: false },
            { text: 'Psychological disorders are caused primarily by genetic rather than environmental factors.', isCorrect: false },
            { text: 'Occupational therapy has been proven effective in treating severe anxiety disorders.', isCorrect: false },
        ],
        technique: 'active_passive',
        explanation: 'has been identified (passive) → researchers have found (active) | occupational stress → stress at work | significant contributor → can lead to | severe psychological disorders → serious mental health problems',
    },
    // ── FIND SOURCE ──────────────────────────────────────────────────────────
    {
        id: 'fs1',
        type: 'find_source',
        context: 'reading',
        difficulty: 'easy',
        instruction: 'IELTS Question টি নিচের কোন Passage sentence থেকে paraphrase করা হয়েছে?',
        display: 'IELTS Question: "What percentage of ocean species depend on coral reefs?"',
        options: [
            { text: 'Coral reef systems cover less than 0.1% of the ocean floor worldwide.', isCorrect: false },
            { text: 'Coral ecosystems support an estimated 25 percent of all marine species.', isCorrect: true },
            { text: 'Rising sea temperatures have damaged coral systems in recent decades.', isCorrect: false },
            { text: 'Scientists are developing new methods to restore damaged coral reefs.', isCorrect: false },
        ],
        technique: 'synonym',
        explanation: '"ocean species depend on coral reefs" → passage এ "marine species" এবং "coral ecosystems" — depend = support, ocean = marine, coral reefs = coral ecosystems।',
    },
    {
        id: 'fs2',
        type: 'find_source',
        context: 'reading',
        difficulty: 'easy',
        instruction: 'IELTS Question টি নিচের কোন Passage sentence থেকে paraphrase করা হয়েছে?',
        display: 'IELTS Question: "Access to parks within a short distance reduces stress in residents."',
        options: [
            { text: 'Urban planning should incorporate more green spaces for community well-being.', isCorrect: false },
            { text: 'Research shows that exposure to nature has long-term cognitive benefits.', isCorrect: false },
            { text: 'Residents living within 300 metres of a park experience lower rates of anxiety.', isCorrect: true },
            { text: 'Physical exercise in natural settings produces measurable cardiovascular benefits.', isCorrect: false },
        ],
        technique: 'synonym',
        explanation: 'within a short distance → within 300 metres | reduces stress → lower rates of anxiety | residents → residents (same) — park → park (same)।',
    },
    {
        id: 'fs3',
        type: 'find_source',
        context: 'listening',
        difficulty: 'easy',
        instruction: 'IELTS Question টি নিচের কোন Audio sentence থেকে paraphrase করা হয়েছে?',
        display: 'IELTS Question: "When does the sports centre open on Sundays?"',
        options: [
            { text: 'The centre is closed on public holidays for maintenance purposes.', isCorrect: false },
            { text: 'Weekend rates apply from Friday evening through Sunday afternoon.', isCorrect: false },
            { text: 'On Sundays, the facility opens its doors at ten in the morning.', isCorrect: true },
            { text: 'Membership holders can access the gym at any time during weekdays.', isCorrect: false },
        ],
        technique: 'synonym',
        explanation: 'sports centre → facility | open → opens its doors | on Sundays → on Sundays (same) | when → at ten in the morning (answer)।',
    },
    {
        id: 'fs4',
        type: 'find_source',
        context: 'reading',
        difficulty: 'medium',
        instruction: 'IELTS Question টি নিচের কোন Passage sentence থেকে paraphrase করা হয়েছে?',
        display: 'IELTS Question: "Governments that prioritise short-term goals have delayed necessary regulatory action."',
        options: [
            { text: 'International agreements on climate have been difficult to enforce consistently.', isCorrect: false },
            { text: 'Short-term political thinking often conflicts with long-term environmental strategy.', isCorrect: false },
            { text: 'Delaying regulatory action while awaiting clearer scientific consensus has been a common government approach.', isCorrect: true },
            { text: 'Regulatory frameworks vary significantly from one country to another.', isCorrect: false },
        ],
        technique: 'clause_restructure',
        explanation: '"governments that prioritise short-term goals" → "awaiting clearer scientific consensus (short-term)" | "delayed regulatory action" → "Delaying regulatory action"。',
    },
    {
        id: 'fs5',
        type: 'find_source',
        context: 'reading',
        difficulty: 'medium',
        instruction: 'IELTS Question টি নিচের কোন Passage sentence থেকে paraphrase করা হয়েছে?',
        display: 'IELTS Question: "What does the writer say about communities most affected by the changes described?"',
        options: [
            { text: 'Wealthier nations have greater capacity to adapt to environmental challenges.', isCorrect: false },
            { text: 'All communities are equally equipped to respond to the effects of climate change.', isCorrect: false },
            { text: 'Communities with the least political and economic power bear the greatest burden of impact.', isCorrect: true },
            { text: 'Community-level action has proven more effective than national policy in some regions.', isCorrect: false },
        ],
        technique: 'synonym',
        explanation: '"most affected" → "bear the greatest burden" | "least power" → "least political and economic power"।',
    },
    {
        id: 'fs6',
        type: 'find_source',
        context: 'reading',
        difficulty: 'hard',
        instruction: 'IELTS Question টি নিচের কোন Passage sentence থেকে paraphrase করা হয়েছে?',
        display: 'IELTS Statement: "The intentional embedding of natural elements into built environments is known as biophilic design." → TRUE / FALSE / NOT GIVEN?',
        options: [
            { text: 'Biophilic design refers to the use of plants and trees in modern buildings.', isCorrect: false },
            { text: 'Biophilic design — the intentional embedding of natural elements into built environments — is gaining popularity.', isCorrect: true },
            { text: 'Natural elements in office environments have been shown to reduce employee stress.', isCorrect: false },
            { text: 'The concept of biophilic design was first introduced in the 1970s.', isCorrect: false },
        ],
        technique: 'synonym',
        explanation: 'Statement এবং Passage প্রায় একই কথা বলছে — তাই answer হবে TRUE। "intentional embedding of natural elements" = exact match।',
    },
    // ── IDENTIFY TECHNIQUE ───────────────────────────────────────────────────
    {
        id: 'it1',
        type: 'identify_technique',
        context: 'reading',
        difficulty: 'easy',
        instruction: 'নিচের Original এবং Paraphrase জুটিতে কোন technique ব্যবহার হয়েছে?',
        display: 'Original: "The company built a new factory near the river."',
        display2: 'Paraphrase: "A new factory was built near the river by the company."',
        options: [
            { text: 'Synonym Replacement — শব্দ বদলানো', isCorrect: false },
            { text: 'Active → Passive Voice — কর্তা/কর্ম বদলানো', isCorrect: true },
            { text: 'Nominalization — Verb কে Noun এ রূপান্তর', isCorrect: false },
            { text: 'Antonym + Negation — বিপরীত + না', isCorrect: false },
        ],
        technique: 'active_passive',
        explanation: '"The company built" (active) → "was built by the company" (passive) — Subject এবং Object এর position বদলে গেছে এবং "was built" passive form ব্যবহার হয়েছে।',
    },
    {
        id: 'it2',
        type: 'identify_technique',
        context: 'reading',
        difficulty: 'easy',
        instruction: 'নিচের Original এবং Paraphrase জুটিতে কোন technique ব্যবহার হয়েছে?',
        display: 'Original: "The results were not conclusive."',
        display2: 'Paraphrase: "The results remained inconclusive."',
        options: [
            { text: 'Synonym Replacement — শব্দ বদলানো', isCorrect: false },
            { text: 'Clause Restructuring — বাক্য কাঠামো পরিবর্তন', isCorrect: false },
            { text: 'Antonym + Negation — বিপরীত শব্দ + না', isCorrect: true },
            { text: 'Nominalization — Verb কে Noun এ রূপান্তর', isCorrect: false },
        ],
        technique: 'antonym_negation',
        explanation: '"not conclusive" (negation) → "inconclusive" (antonym prefix "in-") — একই meaning কিন্তু negation এর বদলে antonym prefix দিয়ে express করা হয়েছে।',
    },
    {
        id: 'it3',
        type: 'identify_technique',
        context: 'reading',
        difficulty: 'medium',
        instruction: 'নিচের Original এবং Paraphrase জুটিতে কোন technique ব্যবহার হয়েছে?',
        display: 'Original: "Because the climate changed, many species disappeared."',
        display2: 'Paraphrase: "Due to climate change, many species disappeared."',
        options: [
            { text: 'Synonym Replacement — শব্দ বদলানো', isCorrect: false },
            { text: 'Active → Passive Voice', isCorrect: false },
            { text: 'Nominalization — Verb কে Noun এ রূপান্তর', isCorrect: false },
            { text: 'Clause Restructuring — Because → Due to', isCorrect: true },
        ],
        technique: 'clause_restructure',
        explanation: '"Because the climate changed" [subordinate clause] → "Due to climate change" [prepositional phrase] — এটা clause restructuring। "changed" (verb) → "change" (noun) = bonus nominalization।',
    },
    {
        id: 'it4',
        type: 'identify_technique',
        context: 'reading',
        difficulty: 'medium',
        instruction: 'নিচের Original এবং Paraphrase জুটিতে কোন technique ব্যবহার হয়েছে?',
        display: 'Original: "Researchers investigated how stress affects learning."',
        display2: 'Paraphrase: "An investigation into the effects of stress on learning was conducted."',
        options: [
            { text: 'Synonym Replacement', isCorrect: false },
            { text: 'Nominalization — Verb থেকে Noun', isCorrect: true },
            { text: 'Antonym + Negation', isCorrect: false },
            { text: 'Word Form Change — Adjective থেকে Adverb', isCorrect: false },
        ],
        technique: 'nominalization',
        explanation: '"investigated" (verb) → "investigation" (noun) | "affects" (verb) → "effects" (noun) — দুটো verb কেই noun এ convert করা হয়েছে। এটা pure Nominalization।',
    },
    {
        id: 'it5',
        type: 'identify_technique',
        context: 'reading',
        difficulty: 'hard',
        instruction: 'নিচের Original এবং Paraphrase জুটিতে কোন technique ব্যবহার হয়েছে?',
        display: 'Original: "The discovery was rapid and widespread."',
        display2: 'Paraphrase: "The rapidly spreading discovery attracted attention."',
        options: [
            { text: 'Synonym Replacement', isCorrect: false },
            { text: 'Nominalization', isCorrect: false },
            { text: 'Word Form Change — Adjective → Adverb', isCorrect: true },
            { text: 'Clause Restructuring', isCorrect: false },
        ],
        technique: 'word_form',
        explanation: '"rapid" (adjective modifying "discovery") → "rapidly" (adverb modifying "spreading") — Word form change। Adjective → Adverb।',
    },
    // ── MORE MIX ─────────────────────────────────────────────────────────────
    {
        id: 'fp16',
        type: 'find_paraphrase',
        context: 'writing',
        difficulty: 'medium',
        instruction: 'Writing Task 2 এ এই sentence টার সঠিক Academic Paraphrase কোনটি?',
        display: 'Many people think technology is making us less social.',
        options: [
            { text: 'It is widely argued that technological advances are diminishing human social interaction.', isCorrect: true },
            { text: 'Technology is good for society but has some negative effects on communication.', isCorrect: false },
            { text: 'People use technology every day and it affects the way they communicate.', isCorrect: false },
            { text: 'Social media and smartphones have changed the world in many ways.', isCorrect: false },
        ],
        technique: 'synonym',
        explanation: 'Many people think → It is widely argued | technology → technological advances | making us less social → diminishing human social interaction — Essay introduction এ question paraphrase করার জন্য এই technique সবচেয়ে important।',
    },
    {
        id: 'fp17',
        type: 'find_paraphrase',
        context: 'writing',
        difficulty: 'medium',
        instruction: 'Writing Task 2 এ এই sentence টার সঠিক Academic Paraphrase কোনটি?',
        display: 'Some people believe governments should spend more money on public transport.',
        options: [
            { text: 'There is a view that increased public funding should be allocated to transportation infrastructure.', isCorrect: true },
            { text: 'Governments often invest in public transport to reduce traffic congestion.', isCorrect: false },
            { text: 'Public transport is a major concern for citizens in large cities worldwide.', isCorrect: false },
            { text: 'Many citizens are dissatisfied with the quality of public transportation services.', isCorrect: false },
        ],
        technique: 'synonym',
        explanation: 'Some people believe → There is a view | governments → public funding | spend more money → increased allocation | public transport → transportation infrastructure',
    },
    {
        id: 'fp18',
        type: 'find_paraphrase',
        context: 'reading',
        difficulty: 'hard',
        instruction: 'নিচের বাক্যটির সঠিক Paraphrase কোনটি?',
        display: 'The phenomenon was first observed in the early stages of industrialisation.',
        options: [
            { text: 'Initial observations of this occurrence date back to the beginnings of industrial development.', isCorrect: true },
            { text: 'Industrialisation has been linked to many environmental and social phenomena.', isCorrect: false },
            { text: 'Scientists who studied industrialisation made several important discoveries.', isCorrect: false },
            { text: 'The effects of industrialisation on the environment were not studied until recently.', isCorrect: false },
        ],
        technique: 'synonym',
        explanation: 'was first observed → Initial observations | phenomenon → occurrence | early stages → beginnings | industrialisation → industrial development',
    },
    {
        id: 'fp19',
        type: 'find_paraphrase',
        context: 'listening',
        difficulty: 'medium',
        instruction: 'Audio তে এই কথা শোনা গেছে। IELTS Question এ সেটার সঠিক Paraphrase কোনটি?',
        display: 'Audio: "You\'ll need to bring two forms of ID — a passport and a bank statement."',
        options: [
            { text: 'Applicants are required to provide a passport along with proof of financial status.', isCorrect: true },
            { text: 'Identification documents must be submitted digitally at the time of application.', isCorrect: false },
            { text: 'A single form of photo ID is sufficient to complete the registration process.', isCorrect: false },
            { text: 'Passports and driving licences are accepted as valid forms of identification.', isCorrect: false },
        ],
        technique: 'synonym',
        explanation: 'You\'ll need to bring → required to provide | two forms of ID → passport (same) + proof of financial status (= bank statement) — bank statement → proof of financial status।',
    },
    {
        id: 'fp20',
        type: 'find_paraphrase',
        context: 'reading',
        difficulty: 'hard',
        instruction: 'নিচের বাক্যটির সঠিক Paraphrase কোনটি?',
        display: 'Despite widespread acknowledgement of the problem, coordinated global action has been slow to materialise.',
        options: [
            { text: 'Although the issue is broadly recognised, an internationally unified response has been lacking.', isCorrect: true },
            { text: 'The problem has been extensively researched but solutions remain unproven.', isCorrect: false },
            { text: 'Global cooperation has accelerated in recent years due to growing public awareness.', isCorrect: false },
            { text: 'The acknowledgement of environmental issues varies greatly between nations.', isCorrect: false },
        ],
        technique: 'clause_restructure',
        explanation: 'Despite [noun phrase] → Although [clause] | widespread acknowledgement → broadly recognised | coordinated global action → internationally unified response | slow to materialise → lacking',
    },
];

// ─── SYNONYM DICTIONARY ───────────────────────────────────────────────────────

export type SynonymGroup = {
    category: string;
    icon: string;
    pairs: Array<{ base: string; synonyms: string[] }>;
};

export const SYNONYM_GROUPS: SynonymGroup[] = [
    {
        category: 'বৃদ্ধি / Increase',
        icon: '📈',
        pairs: [
            { base: 'increase', synonyms: ['rise', 'grow', 'surge', 'climb', 'escalate', 'soar', 'expand', 'jump', 'rocket'] },
            { base: 'growth', synonyms: ['expansion', 'rise', 'surge', 'escalation', 'boost', 'upswing'] },
            { base: 'rapidly', synonyms: ['quickly', 'sharply', 'steeply', 'dramatically', 'significantly', 'substantially'] },
        ],
    },
    {
        category: 'হ্রাস / Decrease',
        icon: '📉',
        pairs: [
            { base: 'decrease', synonyms: ['fall', 'drop', 'decline', 'plummet', 'plunge', 'dwindle', 'shrink', 'reduce'] },
            { base: 'fall', synonyms: ['decline', 'drop', 'decrease', 'dip', 'slump', 'downturn'] },
            { base: 'slightly', synonyms: ['marginally', 'modestly', 'minimally', 'gradually', 'mildly'] },
        ],
    },
    {
        category: 'গুরুত্বপূর্ণ / Important',
        icon: '⭐',
        pairs: [
            { base: 'important', synonyms: ['significant', 'crucial', 'vital', 'key', 'critical', 'essential', 'pivotal', 'paramount'] },
            { base: 'major', synonyms: ['significant', 'substantial', 'considerable', 'primary', 'principal', 'chief'] },
            { base: 'urgent', synonyms: ['pressing', 'critical', 'imperative', 'immediate', 'acute'] },
        ],
    },
    {
        category: 'দেখানো / Show',
        icon: '💡',
        pairs: [
            { base: 'show', synonyms: ['demonstrate', 'indicate', 'reveal', 'suggest', 'highlight', 'illustrate', 'prove', 'confirm'] },
            { base: 'discover', synonyms: ['find', 'reveal', 'uncover', 'identify', 'detect', 'establish', 'determine'] },
            { base: 'prove', synonyms: ['demonstrate', 'establish', 'confirm', 'verify', 'validate', 'corroborate'] },
        ],
    },
    {
        category: 'বলা / Say',
        icon: '💬',
        pairs: [
            { base: 'say', synonyms: ['state', 'claim', 'argue', 'assert', 'contend', 'maintain', 'suggest', 'propose'] },
            { base: 'think / believe', synonyms: ['argue', 'contend', 'maintain', 'hold the view', 'it is argued', 'suggest'] },
            { base: 'report', synonyms: ['indicate', 'document', 'record', 'note', 'state', 'present'] },
        ],
    },
    {
        category: 'পরিবর্তন / Change',
        icon: '🔄',
        pairs: [
            { base: 'change', synonyms: ['alter', 'modify', 'transform', 'shift', 'evolve', 'adjust', 'adapt', 'vary'] },
            { base: 'improve', synonyms: ['enhance', 'develop', 'advance', 'boost', 'strengthen', 'upgrade', 'refine'] },
            { base: 'affect', synonyms: ['impact', 'influence', 'alter', 'shape', 'determine', 'have an effect on'] },
        ],
    },
    {
        category: 'তৈরি / Create',
        icon: '🏗️',
        pairs: [
            { base: 'create', synonyms: ['develop', 'produce', 'generate', 'establish', 'build', 'construct', 'form', 'found'] },
            { base: 'use', synonyms: ['employ', 'utilise', 'apply', 'adopt', 'implement', 'deploy', 'harness'] },
            { base: 'introduce', synonyms: ['implement', 'launch', 'initiate', 'establish', 'adopt', 'bring in'] },
        ],
    },
    {
        category: 'মানুষ / People',
        icon: '👥',
        pairs: [
            { base: 'people', synonyms: ['individuals', 'citizens', 'residents', 'the public', 'society', 'population', 'community'] },
            { base: 'children', synonyms: ['young people', 'youth', 'minors', 'students', 'youngsters', 'the younger generation'] },
            { base: 'government', synonyms: ['authorities', 'administration', 'policymakers', 'officials', 'the state', 'regulators'] },
        ],
    },
    {
        category: 'সমস্যা / Problem',
        icon: '⚠️',
        pairs: [
            { base: 'problem', synonyms: ['issue', 'challenge', 'concern', 'difficulty', 'obstacle', 'barrier', 'complication'] },
            { base: 'danger', synonyms: ['risk', 'threat', 'hazard', 'peril', 'concern', 'menace'] },
            { base: 'difficult', synonyms: ['challenging', 'complex', 'demanding', 'problematic', 'complicated', 'arduous'] },
        ],
    },
    {
        category: 'সহায়তা / Help',
        icon: '🤝',
        pairs: [
            { base: 'help', synonyms: ['assist', 'support', 'aid', 'facilitate', 'enable', 'contribute to', 'benefit'] },
            { base: 'allow', synonyms: ['enable', 'permit', 'facilitate', 'make possible', 'provide'] },
            { base: 'reduce', synonyms: ['lower', 'decrease', 'minimise', 'limit', 'cut', 'lessen', 'alleviate'] },
        ],
    },
    {
        category: 'শুরু/শেষ / Start & End',
        icon: '🔁',
        pairs: [
            { base: 'begin / start', synonyms: ['initiate', 'commence', 'launch', 'introduce', 'embark on', 'undertake'] },
            { base: 'end / stop', synonyms: ['cease', 'halt', 'terminate', 'abolish', 'eliminate', 'phase out', 'discontinue'] },
            { base: 'continue', synonyms: ['persist', 'maintain', 'sustain', 'proceed', 'carry on', 'remain'] },
        ],
    },
    {
        category: 'পরিমাণ / Quantity',
        icon: '🔢',
        pairs: [
            { base: 'many / a lot', synonyms: ['numerous', 'a large number of', 'considerable', 'substantial', 'vast', 'significant'] },
            { base: 'few / little', synonyms: ['limited', 'minimal', 'scarce', 'insufficient', 'inadequate', 'negligible'] },
            { base: 'about / around', synonyms: ['approximately', 'roughly', 'nearly', 'almost', 'an estimated', 'close to'] },
        ],
    },
    {
        category: 'বর্ণনাকারী / Describing',
        icon: '🎨',
        pairs: [
            { base: 'new', synonyms: ['recent', 'modern', 'contemporary', 'novel', 'innovative', 'emerging', 'latest'] },
            { base: 'old', synonyms: ['ancient', 'traditional', 'historical', 'long-standing', 'established', 'conventional'] },
            { base: 'big / large', synonyms: ['substantial', 'considerable', 'significant', 'extensive', 'vast', 'enormous'] },
            { base: 'small', synonyms: ['limited', 'modest', 'minor', 'marginal', 'minimal', 'slight', 'negligible'] },
        ],
    },
    {
        category: 'কারণ/ফলাফল / Cause & Effect',
        icon: '⚙️',
        pairs: [
            { base: 'because (of)', synonyms: ['due to', 'owing to', 'as a result of', 'given', 'in light of', 'on account of'] },
            { base: 'therefore / so', synonyms: ['consequently', 'as a result', 'hence', 'thus', 'for this reason', 'accordingly'] },
            { base: 'lead to', synonyms: ['result in', 'cause', 'bring about', 'contribute to', 'give rise to', 'trigger'] },
        ],
    },
    {
        category: 'Task 1 — Graph Words',
        icon: '📊',
        pairs: [
            { base: 'the graph shows', synonyms: ['the chart illustrates', 'the diagram presents', 'the figure compares', 'the data reveals'] },
            { base: 'peaked at', synonyms: ['reached a high of', 'hit a maximum of', 'stood at its highest at'] },
            { base: 'fell to a low of', synonyms: ['reached a trough of', 'dropped to a minimum of', 'hit its lowest point at'] },
            { base: 'remained stable', synonyms: ['stayed constant', 'levelled off', 'showed little change', 'was relatively unchanged', 'plateaued'] },
        ],
    },
];
