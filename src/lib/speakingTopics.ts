export type SpeakingPart1Question = {
    id: string;
    question: string;
};

export type SpeakingPart2CueCard = {
    title: string;
    prompt: string;
    bulletPoints: string[];
    preparationTips: string[];
};

export type SpeakingPart3Question = {
    id: string;
    question: string;
};

export type SpeakingTopic = {
    id: string;
    title: string;
    category: string;
    level: 'beginner' | 'intermediate' | 'advanced';
    contextNote: string;
    part1: SpeakingPart1Question[];
    part2: SpeakingPart2CueCard;
    part3: SpeakingPart3Question[];
};

function createTopic(input: {
    id: string;
    title: string;
    category: string;
    level: 'beginner' | 'intermediate' | 'advanced';
    contextNote: string;
    part1: string[];
    part2Title: string;
    part2Bullets: string[];
    part2Tips: string[];
    part3: string[];
}): SpeakingTopic {
    return {
        id: input.id,
        title: input.title,
        category: input.category,
        level: input.level,
        contextNote: input.contextNote,
        part1: input.part1.map((question, index) => ({ id: `p1-${index + 1}`, question })),
        part2: {
            title: input.part2Title,
            prompt: 'You should say:',
            bulletPoints: input.part2Bullets,
            preparationTips: input.part2Tips,
        },
        part3: input.part3.map((question, index) => ({ id: `p3-${index + 1}`, question })),
    };
}

type AutoTopicDefinition = {
    id: string;
    title: string;
    category: string;
    level: 'beginner' | 'intermediate' | 'advanced';
    contextNote: string;
};

function createAutoTopic(def: AutoTopicDefinition): SpeakingTopic {
    return createTopic({
        id: def.id,
        title: def.title,
        category: def.category,
        level: def.level,
        contextNote: def.contextNote,
        part1: [
            `Do you often think about ${def.title.toLowerCase()}?`,
            `How common is ${def.title.toLowerCase()} in your area?`,
            `Has your opinion about ${def.title.toLowerCase()} changed over time?`,
        ],
        part2Title: `Describe ${def.title.toLowerCase()}`,
        part2Bullets: [
            'what it is',
            'when you experienced or noticed it',
            'why it is important',
            'and explain how it affected you',
        ],
        part2Tips: [
            'Use one clear real-life example.',
            'Add personal opinion with reasons.',
            'Finish with a practical takeaway.',
        ],
        part3: [
            `Why is ${def.title.toLowerCase()} important in modern society?`,
            `What challenges are related to ${def.title.toLowerCase()}?`,
            `How may ${def.title.toLowerCase()} change in the future?`,
        ],
    });
}

const ADDITIONAL_TOPIC_DEFINITIONS: AutoTopicDefinition[] = [
    { id: 'daily-routine-change', title: 'A Change in Your Daily Routine', category: 'Lifestyle', level: 'beginner', contextNote: 'Habit change and self-management topic.' },
    { id: 'neighborhood-park', title: 'A Park in Your Neighborhood', category: 'Places', level: 'beginner', contextNote: 'Local area description topic.' },
    { id: 'memorable-photo', title: 'A Memorable Photo', category: 'Memories', level: 'beginner', contextNote: 'Personal memory and storytelling topic.' },
    { id: 'science-subject', title: 'A Science Subject You Like', category: 'Education', level: 'intermediate', contextNote: 'Academic interest and reasoning topic.' },
    { id: 'difficult-conversation', title: 'A Difficult Conversation', category: 'Communication', level: 'intermediate', contextNote: 'Conflict resolution speaking topic.' },
    { id: 'useful-website', title: 'A Useful Website', category: 'Technology', level: 'beginner', contextNote: 'Daily technology usage topic.' },
    { id: 'favorite-season', title: 'Your Favorite Season', category: 'Daily Life', level: 'beginner', contextNote: 'Simple descriptive speaking topic.' },
    { id: 'old-friend', title: 'A Friend You Have Known for a Long Time', category: 'People', level: 'beginner', contextNote: 'Relationship and memory topic.' },
    { id: 'volunteer-work', title: 'A Volunteer Activity', category: 'Society', level: 'intermediate', contextNote: 'Community service and impact topic.' },
    { id: 'local-market', title: 'A Local Market You Visit', category: 'Daily Life', level: 'beginner', contextNote: 'Common place description topic.' },
    { id: 'polite-person', title: 'A Polite Person You Met', category: 'People', level: 'beginner', contextNote: 'Character and behavior topic.' },
    { id: 'first-day-experience', title: 'Your First Day at a New Place', category: 'Life Events', level: 'intermediate', contextNote: 'Narrative fluency topic.' },
    { id: 'traffic-problem', title: 'A Traffic Problem in Your Area', category: 'City Life', level: 'advanced', contextNote: 'Urban policy and solution topic.' },
    { id: 'childhood-game', title: 'A Childhood Game You Played', category: 'Childhood', level: 'beginner', contextNote: 'Past experience and nostalgia topic.' },
    { id: 'successful-small-business', title: 'A Successful Small Business', category: 'Business', level: 'advanced', contextNote: 'Economy and entrepreneurship topic.' },
    { id: 'piece-of-advice', title: 'A Useful Piece of Advice', category: 'Personal Development', level: 'beginner', contextNote: 'Practical life lesson topic.' },
    { id: 'late-arrival', title: 'A Time You Arrived Late', category: 'Daily Life', level: 'beginner', contextNote: 'Problem and consequence topic.' },
    { id: 'favorite-restaurant', title: 'A Restaurant You Like', category: 'Food', level: 'beginner', contextNote: 'Preference and comparison topic.' },
    { id: 'good-leader', title: 'A Good Leader You Know', category: 'Work and Study', level: 'intermediate', contextNote: 'Leadership qualities topic.' },
    { id: 'online-course', title: 'An Online Course You Took', category: 'Learning', level: 'intermediate', contextNote: 'Digital learning topic.' },
    { id: 'family-tradition', title: 'A Family Tradition', category: 'Culture', level: 'beginner', contextNote: 'Cultural and personal identity topic.' },
    { id: 'old-building', title: 'An Old Building You Like', category: 'History', level: 'intermediate', contextNote: 'Heritage and architecture topic.' },
    { id: 'noise-problem', title: 'A Noise Problem You Faced', category: 'Environment', level: 'intermediate', contextNote: 'Urban discomfort topic.' },
    { id: 'invention', title: 'An Invention That Changed Life', category: 'Technology', level: 'advanced', contextNote: 'Impact analysis topic.' },
    { id: 'public-library', title: 'A Public Library in Your Area', category: 'Education', level: 'beginner', contextNote: 'Public service and learning topic.' },
    { id: 'teamwork-failure', title: 'A Teamwork Experience That Failed', category: 'Work and Study', level: 'intermediate', contextNote: 'Reflection and improvement topic.' },
    { id: 'new-skill-plan', title: 'A Skill You Plan to Learn', category: 'Personal Development', level: 'beginner', contextNote: 'Future planning topic.' },
    { id: 'movie-that-made-think', title: 'A Movie That Made You Think', category: 'Media', level: 'intermediate', contextNote: 'Opinion and reasoning topic.' },
    { id: 'expensive-purchase', title: 'An Expensive Purchase You Made', category: 'Money', level: 'intermediate', contextNote: 'Decision and value topic.' },
    { id: 'gift-you-gave', title: 'A Gift You Gave Someone', category: 'People and Emotions', level: 'beginner', contextNote: 'Thoughtfulness and memory topic.' },
    { id: 'rule-you-disagree', title: 'A Rule You Disagree With', category: 'Society', level: 'advanced', contextNote: 'Critical opinion topic.' },
    { id: 'sport-event', title: 'A Sports Event You Watched', category: 'Sports', level: 'beginner', contextNote: 'Entertainment and reaction topic.' },
    { id: 'crowded-transport', title: 'A Crowded Public Transport Experience', category: 'City Life', level: 'beginner', contextNote: 'Daily commute challenge topic.' },
    { id: 'road-safety-idea', title: 'An Idea to Improve Road Safety', category: 'Government', level: 'advanced', contextNote: 'Policy and public safety topic.' },
    { id: 'favorite-teacher-subject', title: 'A Subject Taught by Your Favorite Teacher', category: 'Education', level: 'beginner', contextNote: 'Teacher impact topic.' },
    { id: 'difficult-homework', title: 'A Difficult Homework Task', category: 'Learning', level: 'beginner', contextNote: 'Academic challenge topic.' },
    { id: 'weather-you-love', title: 'Weather You Enjoy Most', category: 'Environment', level: 'beginner', contextNote: 'Simple preference topic.' },
    { id: 'place-to-relax', title: 'A Place Where You Relax', category: 'Places', level: 'beginner', contextNote: 'Calm environment description topic.' },
    { id: 'product-review', title: 'A Product Review You Found Helpful', category: 'Consumer', level: 'intermediate', contextNote: 'Information reliability topic.' },
    { id: 'mentor-person', title: 'A Person Who Mentored You', category: 'People', level: 'intermediate', contextNote: 'Guidance and growth topic.' },
    { id: 'city-vs-village', title: 'City Life Compared to Village Life', category: 'Society', level: 'advanced', contextNote: 'Comparison and argument topic.' },
    { id: 'smart-city-feature', title: 'A Smart City Feature You Want', category: 'Technology', level: 'advanced', contextNote: 'Future urban planning topic.' },
    { id: 'morning-routine', title: 'Your Morning Routine', category: 'Lifestyle', level: 'beginner', contextNote: 'Habit and discipline topic.' },
    { id: 'sustainable-habit', title: 'A Sustainable Habit You Follow', category: 'Environment', level: 'intermediate', contextNote: 'Eco-friendly action topic.' },
    { id: 'language-exchange', title: 'A Language Exchange Experience', category: 'Language', level: 'intermediate', contextNote: 'Communication and learning topic.' },
    { id: 'social-media-break', title: 'A Break You Took from Social Media', category: 'Technology', level: 'intermediate', contextNote: 'Digital wellbeing topic.' },
    { id: 'work-life-balance', title: 'Work Life Balance in Modern Times', category: 'Career', level: 'advanced', contextNote: 'Lifestyle and productivity topic.' },
    { id: 'interesting-podcast', title: 'An Interesting Podcast Episode', category: 'Media', level: 'intermediate', contextNote: 'Listening and opinion topic.' },
    { id: 'famous-person-opinion', title: 'A Famous Person Whose Ideas You Like', category: 'People', level: 'intermediate', contextNote: 'Influence and perspective topic.' },
    { id: 'future-technology-dream', title: 'A Future Technology You Dream Of', category: 'Innovation', level: 'advanced', contextNote: 'Speculative future topic.' },
];

const ADDITIONAL_SPEAKING_TOPICS: SpeakingTopic[] = ADDITIONAL_TOPIC_DEFINITIONS.map(createAutoTopic);

export const SPEAKING_TOPICS: SpeakingTopic[] = [
    createTopic({
        id: 'helpful-person',
        title: 'A Helpful Person You Know',
        category: 'People',
        level: 'intermediate',
        contextNote: 'Storytelling + personality description practice.',
        part1: [
            'Do you prefer asking for help or solving problems alone?',
            'Who usually helps you most in your daily life?',
            'Do people in your city help strangers easily?',
        ],
        part2Title: 'Describe a person who is very helpful',
        part2Bullets: ['who this person is', 'how you know this person', 'what help this person gives', 'why this person is helpful'],
        part2Tips: ['Use situation -> action -> result format.', 'Add one real example.', 'Explain emotional impact too.'],
        part3: [
            'Why do some people avoid helping others?',
            'Should schools teach students how to support others?',
            'How has technology changed the way people help each other?',
        ],
    }),
    createTopic({
        id: 'public-transport-change',
        title: 'Improving Public Transport',
        category: 'City Life',
        level: 'advanced',
        contextNote: 'Policy and social impact discussion.',
        part1: [
            'How often do you use public transport?',
            'What do you like about transport in your area?',
            'Is public transport affordable in your city?',
        ],
        part2Title: 'Describe one change that would improve public transport in your area',
        part2Bullets: ['what the change is', 'why the change is needed', 'how it can be implemented', 'how people would benefit'],
        part2Tips: ['Use problem-solution linking words.', 'Mention one challenge and workaround.', 'Give local context.'],
        part3: [
            'Why do many people still prefer private cars?',
            'Should governments make public transport free?',
            'How can better transport influence job opportunities?',
        ],
    }),
    createTopic({
        id: 'skill-you-learned',
        title: 'A Skill You Learned Recently',
        category: 'Learning',
        level: 'beginner',
        contextNote: 'Confidence topic for simple but clear answers.',
        part1: [
            'Do you enjoy learning new skills?',
            'Which skills are most important for students today?',
            'Do you prefer learning online or face-to-face?',
        ],
        part2Title: 'Describe a skill you learned that is useful for you',
        part2Bullets: ['what the skill is', 'when and how you learned it', 'how often you use it', 'why it is useful'],
        part2Tips: ['Use at first -> then -> now structure.', 'Compare before and after.', 'Finish with future value.'],
        part3: [
            'Why do some adults stop learning new skills?',
            'How can schools teach practical skills better?',
            'Will AI make human skills more or less important?',
        ],
    }),
    createTopic({
        id: 'memorable-trip',
        title: 'A Memorable Trip',
        category: 'Travel',
        level: 'beginner',
        contextNote: 'Narrative speaking with place and emotions.',
        part1: ['Do you enjoy traveling?', 'Do you prefer short trips or long trips?', 'Who do you usually travel with?'],
        part2Title: 'Describe a trip that you really enjoyed',
        part2Bullets: ['where you went', 'who you went with', 'what you did there', 'why you remember this trip'],
        part2Tips: ['Use sensory details.', 'Mention one unexpected moment.', 'End with what you learned.'],
        part3: ['Why do people travel more now than before?', 'Can tourism harm local culture?', 'How can governments promote responsible tourism?'],
    }),
    createTopic({
        id: 'favorite-book',
        title: 'A Book That Influenced You',
        category: 'Books',
        level: 'intermediate',
        contextNote: 'Opinion + explanation balance.',
        part1: ['Do you enjoy reading books?', 'What kinds of books are popular in your country?', 'Do you read in print or digital format?'],
        part2Title: 'Describe a book that influenced your thinking',
        part2Bullets: ['what the book is', 'when you read it', 'what the main idea is', 'how it influenced you'],
        part2Tips: ['Summarize briefly, do not retell whole story.', 'Quote one key lesson.', 'Explain personal change clearly.'],
        part3: ['Why do some people read less these days?', 'Should schools force students to read classics?', 'How can reading improve communication skills?'],
    }),
    createTopic({
        id: 'crowded-place',
        title: 'A Crowded Place You Visited',
        category: 'Places',
        level: 'beginner',
        contextNote: 'Describing environment and feelings under pressure.',
        part1: ['Do you like crowded places?', 'Is your city usually busy?', 'When do places become most crowded?'],
        part2Title: 'Describe a crowded place you have been to',
        part2Bullets: ['where it was', 'why you went there', 'what happened there', 'how you felt about the experience'],
        part2Tips: ['Use contrast words.', 'Describe sounds and movement.', 'Explain both positive and negative feelings.'],
        part3: ['Why are cities becoming more crowded?', 'How can crowd management be improved?', 'Is living in a big city always better?'],
    }),
    createTopic({
        id: 'environmental-problem',
        title: 'An Environmental Problem in Your Area',
        category: 'Environment',
        level: 'advanced',
        contextNote: 'Cause-effect and solution-focused discussion.',
        part1: ['Are environmental issues discussed in your school or workplace?', 'Do people recycle in your area?', 'What type of pollution worries you most?'],
        part2Title: 'Describe an environmental problem in your area',
        part2Bullets: ['what the problem is', 'what causes it', 'how it affects people', 'what should be done'],
        part2Tips: ['Explain root cause first.', 'Use one statistic-style fact.', 'Suggest practical actions, not idealistic ones.'],
        part3: ['Who should take more responsibility, citizens or government?', 'Can businesses be truly eco-friendly?', 'How can children be taught environmental awareness?'],
    }),
    createTopic({
        id: 'useful-app',
        title: 'A Useful Mobile App',
        category: 'Technology',
        level: 'beginner',
        contextNote: 'Simple tech vocabulary and practical examples.',
        part1: ['How often do you use mobile apps?', 'Do you pay for apps?', 'Which app category do you use most?'],
        part2Title: 'Describe a mobile app that is useful for you',
        part2Bullets: ['what the app is', 'how you found it', 'what features it has', 'why it is useful'],
        part2Tips: ['Focus on 2-3 core features.', 'Give one daily-life use case.', 'Mention one limitation honestly.'],
        part3: ['Are apps making people less social?', 'Should schools allow app-based learning?', 'How can app privacy be improved?'],
    }),
    createTopic({
        id: 'inspiring-teacher',
        title: 'An Inspiring Teacher',
        category: 'Education',
        level: 'intermediate',
        contextNote: 'People description with long-form examples.',
        part1: ['Did you have a favorite teacher?', 'What makes a teacher effective?', 'Do students respect teachers enough today?'],
        part2Title: 'Describe a teacher who inspired you',
        part2Bullets: ['who this teacher was', 'what subject was taught', 'what teaching style was used', 'why this teacher inspired you'],
        part2Tips: ['Mention one classroom moment.', 'Use descriptive adjectives.', 'Connect to your personal growth.'],
        part3: ['How has teaching changed with technology?', 'Should teachers focus more on skills or exams?', 'How can good teachers be retained?'],
    }),
    createTopic({
        id: 'important-celebration',
        title: 'An Important Celebration',
        category: 'Culture',
        level: 'beginner',
        contextNote: 'Cultural topic with easy fluency opportunities.',
        part1: ['Do you enjoy celebrations?', 'Which festival is most important in your country?', 'Do young people celebrate differently now?'],
        part2Title: 'Describe an important celebration in your family or community',
        part2Bullets: ['what the celebration is', 'how people prepare for it', 'what people do on that day', 'why it is meaningful'],
        part2Tips: ['Explain tradition and personal emotion.', 'Mention food, dress, or rituals.', 'Add one memorable incident.'],
        part3: ['Do celebrations bring people together?', 'Are traditional festivals losing value?', 'How can cultural events support the economy?'],
    }),
    createTopic({
        id: 'important-decision',
        title: 'An Important Decision You Made',
        category: 'Life Events',
        level: 'intermediate',
        contextNote: 'Reasoning and reflection practice.',
        part1: ['Do you make decisions quickly?', 'Whose advice do you trust most?', 'Do you regret decisions often?'],
        part2Title: 'Describe an important decision you made',
        part2Bullets: ['what the decision was', 'when you made it', 'how you made it', 'why it was important'],
        part2Tips: ['Show decision-making process.', 'Mention risk and uncertainty.', 'Describe the final outcome.'],
        part3: ['Why do some people struggle with decision-making?', 'Should parents make decisions for teenagers?', 'How does social media influence decisions?'],
    }),
    createTopic({
        id: 'interesting-advertisement',
        title: 'An Interesting Advertisement',
        category: 'Media',
        level: 'intermediate',
        contextNote: 'Analysis of persuasion and consumer behavior.',
        part1: ['Do you usually notice advertisements?', 'Where do you see ads most often?', 'Do ads influence your buying decisions?'],
        part2Title: 'Describe an advertisement you found interesting',
        part2Bullets: ['where you saw it', 'what it was about', 'why it caught your attention', 'whether it was effective'],
        part2Tips: ['Describe message + visuals.', 'Explain target audience.', 'Evaluate honestly.'],
        part3: ['Should children be protected from ads?', 'Are online ads too personalized?', 'How do ads shape modern lifestyle?'],
    }),
    createTopic({
        id: 'technology-problem',
        title: 'A Time Technology Failed You',
        category: 'Technology',
        level: 'beginner',
        contextNote: 'Useful for past tense and problem-solving language.',
        part1: ['Do you depend on technology every day?', 'What tech device do you use most?', 'Are you good at fixing simple tech problems?'],
        part2Title: 'Describe a time when technology did not work properly',
        part2Bullets: ['what happened', 'what you were doing', 'how you handled the situation', 'what you learned'],
        part2Tips: ['Use past tense consistently.', 'Describe the consequence clearly.', 'Explain your alternative plan.'],
        part3: ['Is society too dependent on technology?', 'Should schools teach digital backup skills?', 'Will future technology be more reliable?'],
    }),
    createTopic({
        id: 'favorite-hobby',
        title: 'A Hobby You Enjoy',
        category: 'Lifestyle',
        level: 'beginner',
        contextNote: 'Good for fluency and natural personal answers.',
        part1: ['Do you have much free time?', 'What do people in your country do in their free time?', 'Did your hobbies change over time?'],
        part2Title: 'Describe a hobby you enjoy doing',
        part2Bullets: ['what the hobby is', 'when you started it', 'how often you do it', 'why you enjoy it'],
        part2Tips: ['Include motivation + routine.', 'Mention social aspect if any.', 'Connect hobby to stress relief.'],
        part3: ['Why are hobbies important for mental health?', 'Do hobbies need money to be enjoyable?', 'Should schools include hobby-based learning?'],
    }),
    createTopic({
        id: 'historical-place',
        title: 'A Historical Place You Visited',
        category: 'History',
        level: 'intermediate',
        contextNote: 'Descriptive + informative mix.',
        part1: ['Are you interested in history?', 'Do you visit museums often?', 'Should children learn local history first?'],
        part2Title: 'Describe a historical place you visited',
        part2Bullets: ['where it is', 'what you saw there', 'what you learned', 'why it impressed you'],
        part2Tips: ['Give background in one sentence.', 'Describe one standout object or scene.', 'Link it to present-day relevance.'],
        part3: ['Why is preserving historical places important?', 'Can tourism damage historical sites?', 'Should governments spend more on heritage protection?'],
    }),
    createTopic({
        id: 'news-story',
        title: 'A News Story You Followed',
        category: 'Current Affairs',
        level: 'advanced',
        contextNote: 'Critical thinking and opinion development.',
        part1: ['How do you usually get news?', 'Do you trust social media news?', 'Do you discuss news with friends?'],
        part2Title: 'Describe a news story you followed recently',
        part2Bullets: ['what the story was', 'where you heard about it', 'why you followed it', 'what impact it had on you'],
        part2Tips: ['Stay factual, then add opinion.', 'Mention source credibility.', 'Avoid over-general statements.'],
        part3: ['Why is fake news spreading quickly?', 'Should governments regulate online news more?', 'How can people improve media literacy?'],
    }),
    createTopic({
        id: 'healthy-change',
        title: 'A Healthy Lifestyle Change',
        category: 'Health',
        level: 'beginner',
        contextNote: 'Personal progress and habits topic.',
        part1: ['Do you try to live a healthy lifestyle?', 'What healthy habits are common in your country?', 'Is it difficult to eat healthy food today?'],
        part2Title: 'Describe a healthy change you made in your life',
        part2Bullets: ['what the change was', 'why you made this change', 'how difficult it was', 'how it affected your life'],
        part2Tips: ['Mention triggers and barriers.', 'Give measurable result.', 'Use simple clear language.'],
        part3: ['Why do many people fail to maintain healthy habits?', 'Should employers support employee health programs?', 'Is mental health getting enough attention?'],
    }),
    createTopic({
        id: 'teamwork-experience',
        title: 'A Successful Teamwork Experience',
        category: 'Work and Study',
        level: 'intermediate',
        contextNote: 'Common academic and workplace speaking topic.',
        part1: ['Do you like working in teams?', 'What role do you usually take in a team?', 'Are team projects common in your school/workplace?'],
        part2Title: 'Describe a time when you worked successfully in a team',
        part2Bullets: ['what the project was', 'who was in the team', 'what your role was', 'why the teamwork was successful'],
        part2Tips: ['Explain your contribution specifically.', 'Use collaboration vocabulary.', 'Share one conflict and resolution.'],
        part3: ['Is teamwork always better than individual work?', 'How can leaders build trust in teams?', 'Should teamwork be graded in schools?'],
    }),
    createTopic({
        id: 'difficult-choice',
        title: 'A Difficult Choice You Faced',
        category: 'Life Events',
        level: 'advanced',
        contextNote: 'Decision complexity and consequence analysis.',
        part1: ['Do you find it hard to choose between options?', 'Do you ask others before major decisions?', 'Can too many choices be stressful?'],
        part2Title: 'Describe a difficult choice you had to make',
        part2Bullets: ['what the choice was', 'why it was difficult', 'what options you considered', 'what happened after your choice'],
        part2Tips: ['Frame pros and cons clearly.', 'Use cautious language.', 'Reflect on lessons learned.'],
        part3: ['Why do modern people face more choices?', 'How does money affect major decisions?', 'Can AI tools help people choose better?'],
    }),
    createTopic({
        id: 'special-gift',
        title: 'A Special Gift You Received',
        category: 'People and Emotions',
        level: 'beginner',
        contextNote: 'Emotion-rich story for natural fluency.',
        part1: ['Do you enjoy giving gifts?', 'When do people usually give gifts in your country?', 'Do you prefer practical or emotional gifts?'],
        part2Title: 'Describe a special gift you received',
        part2Bullets: ['what the gift was', 'who gave it to you', 'on what occasion you got it', 'why it was special'],
        part2Tips: ['Focus on meaning, not price.', 'Mention memory linked to gift.', 'Use expressive but simple words.'],
        part3: ['Why do gifts matter in relationships?', 'Are expensive gifts better than thoughtful gifts?', 'How has online shopping changed gift culture?'],
    }),
    createTopic({
        id: 'dream-job',
        title: 'A Job You Would Like to Have',
        category: 'Career',
        level: 'intermediate',
        contextNote: 'Future planning and motivation.',
        part1: ['What job would you like in the future?', 'Do young people change career plans often?', 'Is job security important to you?'],
        part2Title: 'Describe a job you would like to have in the future',
        part2Bullets: ['what the job is', 'why you are interested in it', 'what skills it needs', 'how you will prepare for it'],
        part2Tips: ['Explain motivation + skills gap.', 'Add realistic preparation steps.', 'Link job to social contribution.'],
        part3: ['Will AI replace many jobs?', 'Should salary be the main factor in choosing a job?', 'How can governments reduce youth unemployment?'],
    }),
    createTopic({
        id: 'school-rule',
        title: 'A Rule in School or College',
        category: 'Education',
        level: 'intermediate',
        contextNote: 'Policy and behavior topic.',
        part1: ['Did your school have many rules?', 'Do rules make students disciplined?', 'Should students help create school rules?'],
        part2Title: 'Describe a rule in your school or college',
        part2Bullets: ['what the rule is', 'why the rule exists', 'how people feel about it', 'whether you think it is good'],
        part2Tips: ['Explain both sides.', 'Use formal vocabulary carefully.', 'Give one suggestion for improvement.'],
        part3: ['Do strict rules create better outcomes?', 'How can rules be enforced fairly?', 'Should schools focus more on values than punishment?'],
    }),
    createTopic({
        id: 'online-shopping',
        title: 'An Online Shopping Experience',
        category: 'Daily Life',
        level: 'beginner',
        contextNote: 'Modern-life topic with practical vocabulary.',
        part1: ['Do you shop online often?', 'What products do people buy online most?', 'Is online shopping safer now?'],
        part2Title: 'Describe an online shopping experience you remember',
        part2Bullets: ['what you bought', 'where you bought it from', 'whether you were satisfied', 'what you learned from the experience'],
        part2Tips: ['Mention delivery/service quality.', 'Include expectation vs reality.', 'End with recommendation.'],
        part3: ['Will online shopping replace physical shops?', 'How can online fraud be reduced?', 'Does online shopping encourage overconsumption?'],
    }),
    createTopic({
        id: 'extreme-weather',
        title: 'A Day of Extreme Weather',
        category: 'Environment',
        level: 'beginner',
        contextNote: 'Descriptive storytelling and response.',
        part1: ['What type of weather do you like most?', 'Has weather changed in your area recently?', 'Do you check weather forecasts often?'],
        part2Title: 'Describe a day when the weather was extreme',
        part2Bullets: ['when it happened', 'what the weather was like', 'what problems it caused', 'how people responded'],
        part2Tips: ['Use vivid adjectives.', 'Describe direct effects on routine.', 'Add personal feeling clearly.'],
        part3: ['Is climate change visible in daily life now?', 'How can cities prepare for extreme weather?', 'Should weather education be taught in schools?'],
    }),
    createTopic({
        id: 'music-event',
        title: 'A Music or Art Event You Enjoyed',
        category: 'Arts',
        level: 'intermediate',
        contextNote: 'Opinion + emotional response topic.',
        part1: ['Do you like live performances?', 'What music is popular among young people?', 'Do you think art is important in education?'],
        part2Title: 'Describe a music or art event you enjoyed',
        part2Bullets: ['what the event was', 'where and when it happened', 'who you attended with', 'why you enjoyed it'],
        part2Tips: ['Explain atmosphere and audience reaction.', 'Mention one memorable moment.', 'Connect to your personal taste.'],
        part3: ['Should governments fund arts more?', 'Can art bring social change?', 'How has digital media changed art consumption?'],
    }),
    createTopic({
        id: 'hometown-change',
        title: 'A Positive Change in Your Hometown',
        category: 'Society',
        level: 'intermediate',
        contextNote: 'Local development and impact discussion.',
        part1: ['Do you enjoy living in your hometown?', 'Has your hometown changed a lot?', 'Would you like to stay there long-term?'],
        part2Title: 'Describe a positive change in your hometown',
        part2Bullets: ['what the change was', 'when it happened', 'who benefited from it', 'why you think it was positive'],
        part2Tips: ['State before-after comparison.', 'Include community impact.', 'Use one concrete example.'],
        part3: ['Why do some development projects fail?', 'Should local people have more voice in city planning?', 'How can small towns attract young people?'],
    }),
    createTopic({
        id: 'public-service',
        title: 'A Useful Public Service',
        category: 'Government',
        level: 'advanced',
        contextNote: 'Civic systems and social equity topic.',
        part1: ['Which public services are most important in daily life?', 'Are public hospitals good in your area?', 'Do people trust public institutions?'],
        part2Title: 'Describe a public service that is useful in your area',
        part2Bullets: ['what the service is', 'who uses it', 'what benefits it provides', 'how it can be improved'],
        part2Tips: ['Use neutral objective tone.', 'Mention accessibility issues.', 'Suggest realistic policy improvement.'],
        part3: ['Should public services be privatized?', 'How can corruption affect public service quality?', 'What should be the top priority for city governments?'],
    }),
    createTopic({
        id: 'foreign-culture',
        title: 'A Foreign Culture You Are Interested In',
        category: 'Culture',
        level: 'intermediate',
        contextNote: 'Cross-cultural comparison practice.',
        part1: ['Are you interested in other cultures?', 'How do people learn about other cultures nowadays?', 'Should schools teach world cultures more?'],
        part2Title: 'Describe a foreign culture you are interested in',
        part2Bullets: ['which culture it is', 'how you learned about it', 'what you find interesting', 'how it differs from your culture'],
        part2Tips: ['Respectful comparison language.', 'Avoid stereotypes.', 'Use one personal learning example.'],
        part3: ['Does globalization reduce cultural diversity?', 'Can cultural exchange improve international relations?', 'Should immigrants adapt fully to local culture?'],
    }),
    createTopic({
        id: 'language-challenge',
        title: 'A Challenge in Learning English',
        category: 'Language',
        level: 'beginner',
        contextNote: 'Direct IELTS-relevant self-reflection topic.',
        part1: ['Which English skill is hardest for you?', 'How often do you practice English speaking?', 'Do you learn better alone or with a partner?'],
        part2Title: 'Describe a challenge you faced while learning English',
        part2Bullets: ['what the challenge was', 'why it was difficult', 'what you did to improve', 'what result you got'],
        part2Tips: ['Explain struggle honestly.', 'Share a method you used.', 'End with current confidence level.'],
        part3: ['Why do many learners understand but cannot speak fluently?', 'Should grammar be taught before speaking?', 'How can AI tools support language learners?'],
    }),
    createTopic({
        id: 'complaint-experience',
        title: 'A Time You Made a Complaint',
        category: 'Daily Life',
        level: 'intermediate',
        contextNote: 'Problem, communication, and resolution narrative.',
        part1: ['Do people in your country usually complain directly?', 'Is customer service improving?', 'Do you prefer to complain online or face-to-face?'],
        part2Title: 'Describe a time when you made a complaint',
        part2Bullets: ['what the problem was', 'who you complained to', 'how they responded', 'whether you were satisfied'],
        part2Tips: ['Stay polite and factual in narration.', 'Mention timeline clearly.', 'Explain what could have been better.'],
        part3: ['Why do some companies ignore customer complaints?', 'Should public complaints be posted on social media?', 'How can complaint systems become more fair?'],
    }),
    createTopic({
        id: 'future-goal',
        title: 'A Goal You Want to Achieve',
        category: 'Personal Development',
        level: 'beginner',
        contextNote: 'Future tense and motivation language practice.',
        part1: ['Do you set goals regularly?', 'Do you prefer short-term or long-term goals?', 'Do goals help people stay motivated?'],
        part2Title: 'Describe a goal you want to achieve in the next few years',
        part2Bullets: ['what the goal is', 'why this goal matters to you', 'what steps you will take', 'what challenges you may face'],
        part2Tips: ['Use clear action plan language.', 'Mention milestone and deadline.', 'Show realistic optimism.'],
        part3: ['Why do many people fail to achieve goals?', 'Should parents set goals for children?', 'How can digital tools help with long-term planning?'],
    }),
    ...ADDITIONAL_SPEAKING_TOPICS,
];

export function findSpeakingTopicById(topicId: string | null | undefined): SpeakingTopic | null {
    if (!topicId) return null;
    return SPEAKING_TOPICS.find((topic) => topic.id === topicId) || null;
}
