import { IELTS_MODULE_BLUEPRINT } from './mockTestFormat';

export const MOCK_TEST_1 = {
    Listening: {
        title: 'Full Mock Test 1 - Listening',
        introduction:
            'Cambridge-style full listening simulation with 4 sections and 40 questions. Follow exam timing strictly.',
        audioUrl: '/api/audio?preset=mock-101-listening-full&voice=alloy',
        examConfig: IELTS_MODULE_BLUEPRINT.Listening,
        parts: [
            {
                partNumber: 1,
                title: 'Section 1: Library Membership Enquiry',
                audioUrl: '/api/audio?preset=mock-101-listening-part1&voice=alloy',
                text:
                    'A student calls a city library to register and ask about borrowing rules, late fees, and opening hours. Listen for spellings, numbers, and corrected information.\n\nTranscript Focus: Candidate details (name/address), service rules (borrowing limit, due period), and operational details (opening time/workshops).',
                tips: [
                    'Watch for correction words like "sorry" and "actually".',
                    'Check singular/plural in short-answer questions.',
                    'Numbers often come fast, so write them immediately.',
                ],
                questions: [
                    { number: 1, type: 'fill_in_blank', prompt: 'Membership number starts with ___', answer: 'L', answerLine: 'Your number begins with letter L, then six digits.' },
                    { number: 2, type: 'fill_in_blank', prompt: 'Student surname: ___', answer: 'Rahman', answerLine: 'Can you spell that? R-A-H-M-A-N.' },
                    { number: 3, type: 'fill_in_blank', prompt: 'Street name: ___ Road', answer: 'Station', answerLine: 'It is 19 Station Road, opposite the post office.' },
                    { number: 4, type: 'fill_in_blank', prompt: 'Borrowing limit: ___ books', answer: '8', answerLine: 'You can borrow up to eight books at one time.' },
                    { number: 5, type: 'fill_in_blank', prompt: 'Standard loan period: ___ days', answer: '14', answerLine: 'Most items are due after fourteen days.' },
                    { number: 6, type: 'fill_in_blank', prompt: 'Late fee per day: $___', answer: '1', answerLine: 'The charge is one dollar per day.' },
                    { number: 7, type: 'fill_in_blank', prompt: 'The reading room opens at ___ a.m.', answer: '9', answerLine: 'The reading room opens at nine.' },
                    { number: 8, type: 'fill_in_blank', prompt: 'Weekend closing time: ___ p.m.', answer: '5', answerLine: 'On Saturdays we close at five p.m.' },
                    { number: 9, type: 'fill_in_blank', prompt: 'Free workshop topic: Academic ___', answer: 'writing', answerLine: 'This month we are running a workshop on academic writing.' },
                    { number: 10, type: 'fill_in_blank', prompt: 'Bring student ___ for registration', answer: 'ID', answerLine: 'Please bring your student ID card to complete registration.' },
                ],
            },
            {
                partNumber: 2,
                title: 'Section 2: Museum Orientation Talk',
                audioUrl: '/api/audio?preset=mock-101-listening-part2&voice=alloy',
                text:
                    'A guide introduces visitors to a newly opened city museum with floor map details, facilities, and safety instructions.\n\nTranscript Focus: location-based information, entry policy, safety procedures, and visitor services.',
                tips: [
                    'Map/listening questions often test direction words.',
                    'Underline keywords in options before listening.',
                    'Eliminate distractors with similar wording.',
                ],
                questions: [
                    { number: 11, type: 'mcq', prompt: 'Where is the temporary exhibition hall?', options: ['Ground floor near cafe', 'First floor opposite lift', 'Second floor beside archive'], answer: 'B', answerLine: 'The temporary exhibition is on level one, directly opposite the main lift.' },
                    { number: 12, type: 'mcq', prompt: 'What is free for all visitors?', options: ['Audio guide', 'Printed map', 'Locker service'], answer: 'B', answerLine: 'Printed maps are free at the entrance desk.' },
                    { number: 13, type: 'mcq', prompt: 'Which group gets priority entry?', options: ['School groups', 'Senior citizens', 'Online ticket holders'], answer: 'C', answerLine: 'Priority lane is only for online ticket holders.' },
                    { number: 14, type: 'mcq', prompt: 'What should visitors do during an alarm?', options: ['Use the nearest lift', 'Follow staff to assembly point', 'Wait inside galleries'], answer: 'B', answerLine: 'Please follow staff instructions to the outdoor assembly point.' },
                    { number: 15, type: 'mcq', prompt: 'The photography rule says visitors may', options: ['Use flash in all halls', 'Take photos without flash', 'Record full video tours'], answer: 'B', answerLine: 'Photography is allowed, but no flash.' },
                    { number: 16, type: 'mcq', prompt: 'The science zone is best for children aged', options: ['5-8', '8-12', '12-16'], answer: 'B', answerLine: 'The interactive science zone is designed for children eight to twelve.' },
                    { number: 17, type: 'mcq', prompt: 'What closes first each day?', options: ['Gift shop', 'Cafe', 'Rooftop gallery'], answer: 'C', answerLine: 'The rooftop gallery closes thirty minutes earlier than other areas.' },
                    { number: 18, type: 'mcq', prompt: 'Visitors should book workshops', options: ['At reception', 'Online only', 'By phone before arrival'], answer: 'A', answerLine: 'You can register at reception on the day.' },
                    { number: 19, type: 'mcq', prompt: 'The quiet study area is next to', options: ['City archive room', 'Children play corner', 'Main lecture theatre'], answer: 'A', answerLine: 'The quiet study area is beside the city archive room.' },
                    { number: 20, type: 'mcq', prompt: 'The guide recommends arriving', options: ['15 minutes early', '30 minutes early', '45 minutes early'], answer: 'A', answerLine: 'Please arrive at least fifteen minutes before your slot.' },
                ],
            },
            {
                partNumber: 3,
                title: 'Section 3: Tutor and Students Discuss Project',
                audioUrl: '/api/audio?preset=mock-101-listening-part3&voice=alloy',
                text:
                    'Two students discuss a sustainability research proposal with their tutor. The talk covers method, sampling, timeline, and expected challenges.\n\nTranscript Focus: decision changes, academic planning, mixed methods, and submission requirements.',
                tips: [
                    'In Part 3, speakers may disagree before finalizing.',
                    'Identify who says what in multi-speaker talks.',
                    'For double-answer questions, select exactly two options.',
                ],
                questions: [
                    { number: 21, type: 'mcq', prompt: 'The tutor suggests narrowing the topic to', options: ['Transport habits of commuters', 'Plastic use in dormitories', 'Food waste in campus canteens'], answer: 'C', answerLine: 'Focus on food waste in the canteens; it is measurable.' },
                    { number: 22, type: 'mcq', prompt: 'Why was the first questionnaire rejected?', options: ['It was too long', 'It had unclear language', 'It lacked demographic questions'], answer: 'A', answerLine: 'At fourteen minutes, it is too long for respondents.' },
                    { number: 23, type: 'mcq', prompt: 'The final sample size should be', options: ['100 participants', '150 participants', '200 participants'], answer: 'B', answerLine: 'Aim for around one hundred and fifty responses.' },
                    { number: 24, type: 'mcq', prompt: 'The biggest risk in week 2 is', options: ['Venue booking delays', 'Low response rate', 'Data entry errors'], answer: 'B', answerLine: 'Week two may suffer from low response unless reminders are sent.' },
                    { number: 25, type: 'mcq', prompt: 'Which software will be used for charts?', options: ['Tableau', 'Excel', 'R Studio'], answer: 'B', answerLine: 'Use Excel for descriptive charts first.' },
                    { number: 26, type: 'double_mcq', prompt: 'Choose TWO actions the tutor recommends.', options: ['Pilot test with 10 students', 'Skip interviews entirely', 'Use both online and paper forms', 'Collect data only at night', 'Add consent statement'], answer: 'A,C', answerLine: 'Run a pilot with ten students and use mixed collection modes.' },
                    { number: 27, type: 'mcq', prompt: 'Who will contact canteen managers?', options: ['Nadia only', 'Imran only', 'Both students together'], answer: 'C', answerLine: 'You should both attend the manager meeting.' },
                    { number: 28, type: 'mcq', prompt: 'The literature review deadline is', options: ['Friday noon', 'Monday noon', 'Wednesday noon'], answer: 'A', answerLine: 'Submit your review by Friday at noon.' },
                    { number: 29, type: 'mcq', prompt: 'The tutor advises interviews should last', options: ['5 minutes', '10 minutes', '20 minutes'], answer: 'B', answerLine: 'Keep each interview around ten minutes.' },
                    { number: 30, type: 'mcq', prompt: 'For referencing, they must follow', options: ['MLA', 'APA 7', 'Chicago'], answer: 'B', answerLine: 'Please use APA seventh edition format.' },
                ],
            },
            {
                partNumber: 4,
                title: 'Section 4: Lecture on Urban Heat Islands',
                audioUrl: '/api/audio?preset=mock-101-listening-part4&voice=alloy',
                text:
                    'A lecturer explains why cities become warmer than surrounding rural areas, and evaluates practical cooling strategies.\n\nTranscript Focus: causes, interventions, vulnerable groups, and implementation strategy.',
                tips: [
                    'Part 4 is usually one speaker and information-dense.',
                    'Track signposting: first, next, finally, in contrast.',
                    'Answers often come as noun phrases.',
                ],
                questions: [
                    { number: 31, type: 'fill_in_blank', prompt: 'Urban heat is strongest after ___', answer: 'sunset', answerLine: 'The temperature gap often peaks after sunset.' },
                    { number: 32, type: 'fill_in_blank', prompt: 'Dark surfaces have low ___', answer: 'albedo', answerLine: 'Road asphalt has low albedo and absorbs heat.' },
                    { number: 33, type: 'fill_in_blank', prompt: 'One major source of heat is vehicle ___', answer: 'engines', answerLine: 'Vehicle engines release significant waste heat.' },
                    { number: 34, type: 'fill_in_blank', prompt: 'Street trees improve pedestrian ___', answer: 'comfort', answerLine: 'Trees reduce radiant heat and improve walking comfort.' },
                    { number: 35, type: 'fill_in_blank', prompt: 'Green roofs can reduce building energy ___', answer: 'demand', answerLine: 'Cooling demand can fall when roofs are planted.' },
                    { number: 36, type: 'fill_in_blank', prompt: 'Reflective paint is most effective on ___', answer: 'rooftops', answerLine: 'The best gains came from reflective rooftop coatings.' },
                    { number: 37, type: 'fill_in_blank', prompt: 'Cooling centers are critical for the ___', answer: 'elderly', answerLine: 'The elderly face the highest risk during heatwaves.' },
                    { number: 38, type: 'fill_in_blank', prompt: 'Cities should publish neighborhood heat ___', answer: 'maps', answerLine: 'Detailed heat maps guide policy priorities.' },
                    { number: 39, type: 'fill_in_blank', prompt: 'Pilot projects should be assessed over ___ summers', answer: 'two', answerLine: 'Data should be tracked for at least two summers.' },
                    { number: 40, type: 'fill_in_blank', prompt: 'Long-term success depends on local ___', answer: 'maintenance', answerLine: 'Without maintenance, cooling interventions lose impact.' },
                ],
            },
        ],
    },
    Reading: {
        title: 'Full Mock Test 1 - Reading',
        introduction:
            'Cambridge-style reading simulation with 3 passages and 40 questions. Focus on timing and evidence-based answers.',
        audioUrl: null,
        examConfig: IELTS_MODULE_BLUEPRINT.Reading,
        parts: [
            {
                partNumber: 1,
                title: 'Passage 1: Vertical Farms in Dense Cities',
                text:
                    'As cities expand, farmland near urban centers shrinks. Vertical farms attempt to solve this by growing crops indoors across stacked levels. Advocates argue these systems reduce transport emissions and protect production from extreme weather. Critics note that electricity use can be high, especially where artificial lighting is needed for long periods. Recent trials show mixed results: leafy vegetables can be economically viable, but grains remain impractical. A second debate concerns resilience. Indoor farms can continue through storms, yet they depend on stable power and technical maintenance. Some municipalities now combine rooftop greenhouses with district energy networks to improve efficiency.\n\nIn Singapore, pilot projects integrated sensor-based irrigation with district cooling systems. Early data suggested lower water waste compared with open-field farming, but capital costs remained high. In contrast, a project in northern Europe struggled through winter due to prolonged artificial-light dependence. Researchers emphasized that climate, electricity pricing, and distribution networks strongly shape outcomes.\n\nA third issue concerns workforce skill. Traditional farmers may need retraining to manage climate control, nutrient dosing, and plant-health analytics. Universities have begun offering urban-agriculture diplomas that combine horticulture with data literacy. Supporters claim this creates new green jobs; opponents argue it may widen gaps between technology-rich and resource-poor regions.',
                tips: [
                    'Start with headings and keywords.',
                    'For TRUE/FALSE/NOT GIVEN, stay literal.',
                    'Use scanning for numbers and named entities.',
                ],
                questions: [
                    { number: 1, type: 'true_false', prompt: 'Vertical farms are mainly built in rural areas.', answer: 'FALSE', answerLine: 'Vertical farms attempt to solve this as cities expand.' },
                    { number: 2, type: 'true_false', prompt: 'Supporters claim vertical farms can lower transport-related emissions.', answer: 'TRUE', answerLine: 'Advocates argue these systems reduce transport emissions.' },
                    { number: 3, type: 'true_false', prompt: 'All crop types are equally profitable in indoor systems.', answer: 'FALSE', answerLine: 'Leafy vegetables can be viable, but grains remain impractical.' },
                    { number: 4, type: 'true_false', prompt: 'Indoor farms are completely independent of energy systems.', answer: 'FALSE', answerLine: 'They depend on stable power and technical maintenance.' },
                    { number: 5, type: 'mcq', prompt: 'What is the main criticism mentioned?', options: ['High labor turnover', 'High electricity use', 'Lack of consumer demand'], answer: 'B', answerLine: 'Critics note that electricity use can be high.' },
                    { number: 6, type: 'mcq', prompt: 'Which crops are said to be less practical indoors?', options: ['Leafy vegetables', 'Herbs', 'Grains'], answer: 'C', answerLine: 'Grains remain impractical.' },
                    { number: 7, type: 'fill_in_blank', prompt: 'Indoor farms may continue operating during ___', answer: 'storms', answerLine: 'Indoor farms can continue through storms.' },
                    { number: 8, type: 'fill_in_blank', prompt: 'Some cities combine greenhouses with district energy ___', answer: 'networks', answerLine: '...with district energy networks to improve efficiency.' },
                    { number: 9, type: 'matching', prompt: 'Best heading: debate about costs and reliability', answer: 'ii', answerLine: 'A second debate concerns resilience and power dependency.' },
                    { number: 10, type: 'matching', prompt: 'Best heading: limits of indoor crop diversity', answer: 'iii', answerLine: 'Trials show leafy vegetables viable, grains impractical.' },
                    { number: 11, type: 'mcq', prompt: 'The writer\'s tone is mostly', options: ['Highly optimistic', 'Balanced and analytical', 'Strongly negative'], answer: 'B', answerLine: 'The passage presents both benefits and limitations.' },
                    { number: 12, type: 'fill_in_blank', prompt: 'Farmland near cities is becoming ___', answer: 'smaller', answerLine: 'Farmland near urban centers shrinks.' },
                    { number: 13, type: 'true_false', prompt: 'The passage claims rooftop greenhouses always solve efficiency problems.', answer: 'NOT GIVEN', answerLine: 'It says some municipalities combine them to improve efficiency.' },
                ],
            },
            {
                partNumber: 2,
                title: 'Passage 2: The Psychology of Waiting',
                text:
                    'People rarely judge waiting by clock time alone. Expectations, uncertainty, and perceived fairness all affect how long a delay feels. In service settings, unexplained waits often feel longer than explained waits of equal duration. Research in transport hubs shows that visible progress information, such as queue position updates, can reduce frustration. Another finding is social comparison: individuals who see others moving faster may report lower satisfaction, even when their own wait remains acceptable. Designers increasingly use "occupied time" strategies, including short tasks and interactive displays, to make waiting feel purposeful. However, these tools can fail if users believe they are manipulative.\n\nHealth-care studies report similar patterns. Patients who receive transparent updates from staff often describe the same delay as more acceptable than patients who receive no explanation. Behavioural economists note that predictability lowers stress by restoring a sense of control. Even approximate waiting windows can improve satisfaction when presented honestly.\n\nYet design interventions must be ethical. If systems intentionally hide delays behind distracting visuals, trust can collapse when users detect the tactic. Experts therefore recommend three principles: transparent communication, fair queue policy, and meaningful occupied-time activities. Together, these can improve user experience without distorting expectations.',
                tips: [
                    'Identify factors that influence perception.',
                    'Watch for contrast words like however and even when.',
                    'Use elimination for option questions.',
                ],
                questions: [
                    { number: 14, type: 'mcq', prompt: 'According to the passage, waiting is judged mainly by', options: ['Clock time only', 'Perception and context', 'Ticket price'], answer: 'B', answerLine: 'People rarely judge waiting by clock time alone.' },
                    { number: 15, type: 'true_false', prompt: 'Unexplained waits can feel longer than explained waits.', answer: 'TRUE', answerLine: 'Unexplained waits often feel longer than explained waits.' },
                    { number: 16, type: 'fill_in_blank', prompt: 'Queue position updates reduce ___', answer: 'frustration', answerLine: '...can reduce frustration.' },
                    { number: 17, type: 'mcq', prompt: 'Social comparison in queues means people', options: ['Prefer silent waiting areas', 'Feel less satisfied when others move faster', 'Always overestimate time'], answer: 'B', answerLine: 'Individuals who see others moving faster may report lower satisfaction.' },
                    { number: 18, type: 'true_false', prompt: 'Occupied-time strategies always improve user experience.', answer: 'FALSE', answerLine: 'These tools can fail if users believe they are manipulative.' },
                    { number: 19, type: 'fill_in_blank', prompt: 'Expectations, uncertainty, and perceived ___ shape wait experience.', answer: 'fairness', answerLine: '...expectations, uncertainty, and perceived fairness...' },
                    { number: 20, type: 'mcq', prompt: 'The best summary of paragraph 3 is', options: ['Technology has ended waiting', 'Progress signals can improve satisfaction', 'People dislike all displays'], answer: 'B', answerLine: 'Visible progress information can reduce frustration.' },
                    { number: 21, type: 'matching', prompt: 'Best heading: waiting becomes worse through comparison', answer: 'iv', answerLine: 'Another finding is social comparison...' },
                    { number: 22, type: 'matching', prompt: 'Best heading: making time feel useful', answer: 'v', answerLine: 'Designers use occupied time strategies...' },
                    { number: 23, type: 'true_false', prompt: 'The passage suggests fairness perception matters.', answer: 'TRUE', answerLine: 'Perceived fairness affects how long a delay feels.' },
                    { number: 24, type: 'mcq', prompt: 'The writer implies designers should', options: ['Hide all waiting information', 'Use psychology carefully and transparently', 'Replace staff with screens'], answer: 'B', answerLine: 'Tools can fail if users think they are manipulative.' },
                    { number: 25, type: 'fill_in_blank', prompt: 'The studies mentioned were done in transport ___', answer: 'hubs', answerLine: 'Research in transport hubs shows...' },
                    { number: 26, type: 'true_false', prompt: 'The article claims short waits are never stressful.', answer: 'NOT GIVEN', answerLine: 'No statement says short waits are never stressful.' },
                ],
            },
            {
                partNumber: 3,
                title: 'Passage 3: Should Universities Grade Group Work Individually?',
                text:
                    'Group assignments are often justified as preparation for professional collaboration. Yet grading remains controversial. One argument says shared marks encourage cooperation and reduce competition. Another says equal marks can penalize diligent students when contributions are uneven. Some institutions now adopt hybrid systems: teams receive one project score, then individual marks are adjusted by peer evaluations and reflective logs. Critics warn that peer scoring may reward popularity rather than quality. Supporters counter that structured criteria and moderation can reduce bias. A broader issue is educational purpose. If collaboration is a skill in itself, then assessment should value process as well as output.\n\nComparative studies across engineering and business schools reveal that assessment design affects team behaviour. In classes with only one collective grade, students reported fewer internal conflicts but also higher levels of free-riding. Where individual accountability was added, teams documented clearer role division and improved punctuality. However, students also reported greater anxiety about being judged by peers.\n\nPolicy experts argue that no single model fits every discipline. They recommend aligning assessment with intended outcomes: if the goal is technical output, product quality should dominate; if the goal includes leadership, communication, and negotiation, then process metrics should be explicit. Transparent rubrics, early feedback checkpoints, and instructor moderation are repeatedly identified as the most reliable safeguards.',
                tips: [
                    'In passage 3, track arguments and counterarguments.',
                    'Question types may include opinion/claim matching.',
                    'Do not answer from personal beliefs.',
                ],
                questions: [
                    { number: 27, type: 'mcq', prompt: 'Why are group assignments commonly used?', options: ['To reduce teacher workload', 'To prepare students for professional collaboration', 'To shorten courses'], answer: 'B', answerLine: '...justified as preparation for professional collaboration.' },
                    { number: 28, type: 'true_false', prompt: 'Equal marks can disadvantage hard-working students.', answer: 'TRUE', answerLine: 'Equal marks can penalize diligent students.' },
                    { number: 29, type: 'fill_in_blank', prompt: 'Hybrid systems combine team scores with peer evaluations and reflective ___', answer: 'logs', answerLine: '...adjusted by peer evaluations and reflective logs.' },
                    { number: 30, type: 'mcq', prompt: 'Critics of peer scoring worry about', options: ['Excessive marking time', 'Popularity bias', 'Lack of digital tools'], answer: 'B', answerLine: 'Peer scoring may reward popularity rather than quality.' },
                    { number: 31, type: 'mcq', prompt: 'Supporters believe bias can be reduced by', options: ['Anonymous final exams only', 'Structured criteria and moderation', 'Removing teamwork entirely'], answer: 'B', answerLine: 'Structured criteria and moderation can reduce bias.' },
                    { number: 32, type: 'true_false', prompt: 'The passage states that product is always more important than process.', answer: 'FALSE', answerLine: 'Assessment should value process as well as output.' },
                    { number: 33, type: 'matching', prompt: 'Claim: shared marks build cooperation', answer: 'A', answerLine: 'One argument says shared marks encourage cooperation.' },
                    { number: 34, type: 'matching', prompt: 'Claim: peer scoring may distort quality judgments', answer: 'C', answerLine: 'Critics warn peer scoring may reward popularity.' },
                    { number: 35, type: 'matching', prompt: 'Claim: collaboration itself is a learnable skill', answer: 'D', answerLine: 'If collaboration is a skill in itself...' },
                    { number: 36, type: 'fill_in_blank', prompt: 'The debate is ultimately about educational ___', answer: 'purpose', answerLine: 'A broader issue is educational purpose.' },
                    { number: 37, type: 'true_false', prompt: 'All universities use the same assessment model for group work.', answer: 'FALSE', answerLine: 'Some institutions now adopt hybrid systems.' },
                    { number: 38, type: 'mcq', prompt: 'The writer\'s position is best described as', options: ['One-sided against group work', 'Focused on balancing fairness and learning goals', 'Neutral and uninterested'], answer: 'B', answerLine: 'The passage weighs competing arguments and proposes balance.' },
                    { number: 39, type: 'fill_in_blank', prompt: 'Uneven ___ are a key concern in team marking.', answer: 'contributions', answerLine: '...when contributions are uneven.' },
                    { number: 40, type: 'true_false', prompt: 'The passage recommends ending all group projects immediately.', answer: 'NOT GIVEN', answerLine: 'No such recommendation is made.' },
                ],
            },
        ],
    },
    Writing: {
        title: 'Full Mock Test 1 - Writing',
        introduction: 'Complete writing simulation with Task 1 and Task 2. Use official timing: 20 minutes + 40 minutes.',
        audioUrl: null,
        examConfig: IELTS_MODULE_BLUEPRINT.Writing,
        parts: [
            {
                partNumber: 1,
                title: 'Task 1: Chart Description',
                text:
                    'The charts below show the percentage of households using four energy sources (gas, electricity, solar, and biomass) in three cities in 2005 and 2025. Summarize the information by selecting and reporting the main features, and make comparisons where relevant.\n\nData Snapshot:\nCity A (2005 -> 2025): Gas 55% -> 40%, Electricity 30% -> 34%, Solar 5% -> 18%, Biomass 10% -> 8%\nCity B (2005 -> 2025): Gas 48% -> 35%, Electricity 32% -> 36%, Solar 8% -> 20%, Biomass 12% -> 9%\nCity C (2005 -> 2025): Gas 60% -> 42%, Electricity 25% -> 33%, Solar 4% -> 16%, Biomass 11% -> 9%\n\nWrite at least 150 words.',
                tips: [
                    'Write at least 150 words.',
                    'Give a clear overview in the first paragraph.',
                    'Compare key highs/lows and trend changes.',
                ],
                questions: [
                    {
                        number: 1,
                        type: 'fill_in_blank',
                        prompt: 'Planning check: What is the minimum word count for Task 1?',
                        answer: '150',
                        answerLine: 'IELTS Task 1 requires at least 150 words.',
                    },
                    {
                        number: 2,
                        type: 'fill_in_blank',
                        prompt: 'Overview check: Which energy source increased most overall?',
                        answer: 'solar',
                        answerLine: 'Solar rose sharply in all three cities from 2005 to 2025.',
                    },
                ],
            },
            {
                partNumber: 2,
                title: 'Task 2: Opinion Essay',
                text:
                    'Some people believe universities should focus mainly on practical skills that lead directly to employment. Others argue that universities should provide broad academic education regardless of job outcomes. Discuss both views and give your own opinion.\n\nWrite at least 250 words.\n\nSuggested structure:\nParagraph 1: Introduction with clear thesis.\nParagraph 2: Why practical skills matter (industry readiness, internships, employability).\nParagraph 3: Why broad education matters (critical thinking, adaptability, civic awareness).\nParagraph 4: Your balanced opinion and conclusion.',
                tips: [
                    'Write at least 250 words.',
                    'Take a clear position and maintain it.',
                    'Use specific examples to support each body paragraph.',
                ],
                questions: [
                    {
                        number: 3,
                        type: 'fill_in_blank',
                        prompt: 'Planning check: What is the minimum word count for Task 2?',
                        answer: '250',
                        answerLine: 'IELTS Task 2 requires at least 250 words.',
                    },
                    {
                        number: 4,
                        type: 'fill_in_blank',
                        prompt: 'Thesis check: One sentence that clearly states your position.',
                        answer: 'open',
                        answerLine: 'Write your own thesis before drafting body paragraphs.',
                    },
                ],
            },
        ],
    },
    Speaking: {
        title: 'Full Mock Test 1 - Speaking',
        introduction: 'Examiner-style speaking simulation with Part 1 interview, Part 2 cue card, and Part 3 discussion.',
        audioUrl: null,
        examConfig: IELTS_MODULE_BLUEPRINT.Speaking,
        parts: [
            {
                partNumber: 1,
                title: 'Part 1: Introductory Interview',
                text:
                    'Answer naturally in 2-4 sentences per question. Keep your tone clear and personal.\n\nExaminer may ask follow-up questions for clarification. Avoid memorized chunks.',
                tips: [
                    'Do not memorize long scripts.',
                    'Add one reason/example per answer.',
                    'Avoid one-word responses.',
                ],
                questions: [
                    { number: 1, type: 'fill_in_blank', prompt: 'Do you work or are you a student?', answer: 'open', answerLine: 'Self-response question.' },
                    { number: 2, type: 'fill_in_blank', prompt: 'What do you enjoy most about your hometown?', answer: 'open', answerLine: 'Self-response question.' },
                    { number: 3, type: 'fill_in_blank', prompt: 'How often do you use public transport?', answer: 'open', answerLine: 'Self-response question.' },
                    { number: 4, type: 'fill_in_blank', prompt: 'Do you prefer reading news online or in print?', answer: 'open', answerLine: 'Self-response question.' },
                    { number: 5, type: 'fill_in_blank', prompt: 'What type of place do you usually visit on weekends?', answer: 'open', answerLine: 'Self-response question.' },
                ],
            },
            {
                partNumber: 2,
                title: 'Part 2: Cue Card',
                text:
                    'Describe a place in your city that has changed significantly in recent years.\nYou should say:\n- what the place is\n- what changes happened there\n- why those changes happened\nand explain whether you think the changes were positive.\n\nYou have 1 minute to prepare and up to 2 minutes to speak.',
                tips: [
                    'Use 1 minute to prepare notes.',
                    'Speak for up to 2 minutes continuously.',
                    'Use past + present comparison language.',
                ],
                questions: [
                    { number: 6, type: 'fill_in_blank', prompt: 'Preparation keyword 1', answer: 'open', answerLine: 'Self-note field.' },
                    { number: 7, type: 'fill_in_blank', prompt: 'Preparation keyword 2', answer: 'open', answerLine: 'Self-note field.' },
                    { number: 8, type: 'fill_in_blank', prompt: 'Preparation keyword 3 (example/story detail)', answer: 'open', answerLine: 'Self-note field.' },
                ],
            },
            {
                partNumber: 3,
                title: 'Part 3: Two-Way Discussion',
                text:
                    'Discuss broader social ideas connected to urban change and planning. Extend each answer with explanation, example, and consequence.',
                tips: [
                    'Develop each idea with reason + example.',
                    'Show comparison and future prediction.',
                    'Use discourse markers for coherence.',
                ],
                questions: [
                    { number: 9, type: 'fill_in_blank', prompt: 'How do urban changes affect local communities?', answer: 'open', answerLine: 'Discussion question.' },
                    { number: 10, type: 'fill_in_blank', prompt: 'Should governments prioritize green spaces over commercial buildings?', answer: 'open', answerLine: 'Discussion question.' },
                    { number: 11, type: 'fill_in_blank', prompt: 'How might city planning change in the next 20 years?', answer: 'open', answerLine: 'Discussion question.' },
                    { number: 12, type: 'fill_in_blank', prompt: 'Do you think citizen feedback should be compulsory before major city projects?', answer: 'open', answerLine: 'Discussion question.' },
                ],
            },
        ],
    },
} as const;

export function getMockTestOneModule(module: 'Listening' | 'Reading' | 'Writing' | 'Speaking') {
    return MOCK_TEST_1[module];
}
