import { IELTS_MODULE_BLUEPRINT } from './mockTestFormat';



// ─── MOCK TEST 2 ────────────────────────────────────────────────────────────



export const MOCK_TEST_2 = {

    Listening: {

        title: 'Full Mock Test 2 - Listening',

        introduction:

            'Cambridge-style listening simulation with 4 sections and 40 questions. Follow strict exam timing.',

        audioUrl: '/api/audio?preset=mock-102-listening-full&voice=alloy',

        examConfig: IELTS_MODULE_BLUEPRINT.Listening,

        parts: [

            {

                partNumber: 1,

                title: 'Section 1: Hotel Booking Enquiry',

                audioUrl: '/api/audio?preset=mock-102-listening-part1&voice=alloy',

                text:

                    'A guest calls the Grand Harbor Hotel to make a reservation. The receptionist takes personal details, room preferences, and payment options. Listen for corrections and exact spelling of names and dates.\n\nTranscript Focus: Full name spelling, arrival/departure dates, room category, meal preference, contact number, and total cost.',

                tips: [

                    'Corrections often follow "actually" or "I mean".',

                    'Write the corrected answer, not the first one given.',

                    'Numbers and dates come fast — prepare the answer field before audio.',

                ],

                questions: [

                    { number: 1, type: 'fill_in_blank', prompt: "Guest's surname: ___", answer: 'Patterson', answerLine: "It's Patterson, P-A-T-T-E-R-S-O-N." },

                    { number: 2, type: 'fill_in_blank', prompt: 'Arrival date: ___ May', answer: '14th', answerLine: 'We would like to arrive on the 14th of May.' },

                    { number: 3, type: 'fill_in_blank', prompt: 'Number of nights: ___', answer: '3', answerLine: 'We are staying for three nights.' },

                    { number: 4, type: 'fill_in_blank', prompt: 'Room type requested: ___ room', answer: 'double', answerLine: 'A double room, please, not a twin.' },

                    { number: 5, type: 'mcq', prompt: 'Which meal plan did the guest choose?', options: ['A. Breakfast only', 'B. Half board', 'C. No meals'], answer: 'A', answerLine: 'Just breakfast for us, thank you.' },

                    { number: 6, type: 'fill_in_blank', prompt: 'Contact phone number: 07___', answer: '714 883 21', answerLine: 'The number is 07714 883 21.' },

                    { number: 7, type: 'fill_in_blank', prompt: 'Total room cost per night: £___', answer: '95', answerLine: 'It comes to ninety-five pounds per night.' },

                    { number: 8, type: 'mcq', prompt: 'How will the guest pay?', options: ['A. Cash', 'B. Debit card', 'C. Credit card'], answer: 'C', answerLine: 'I will pay by credit card when I arrive.' },

                    { number: 9, type: 'fill_in_blank', prompt: 'Car park level available: Level ___', answer: '2', answerLine: 'Guest parking is on level two of the underground car park.' },

                    { number: 10, type: 'fill_in_blank', prompt: 'Booking reference: GH___', answer: '4471', answerLine: 'Your reference is GH4471.' },

                ],

            },

            {

                partNumber: 2,

                title: 'Section 2: Riverside Community Centre Tour',

                audioUrl: '/api/audio?preset=mock-102-listening-part2&voice=alloy',

                text:

                    'A staff member gives a guided tour of the newly renovated Riverside Community Centre. They describe facilities, membership options, and upcoming events. Questions focus on locating rooms and identifying options correctly.\n\nTranscript Focus: Room locations, membership tiers, opening hours for specific facilities, and seasonal program details.',

                tips: [

                    'Eliminate options that match details given about other rooms.',

                    'Matching questions: write the letter, not the room name.',

                    'Do not re-use a letter unless the instructions allow it.',

                ],

                questions: [

                    { number: 11, type: 'mcq', prompt: 'The swimming pool is located on which floor?', options: ['A. Ground floor', 'B. First floor', 'C. Basement level'], answer: 'C', answerLine: 'The pool is downstairs in the basement level.' },

                    { number: 12, type: 'mcq', prompt: 'What changed in the new renovation?', options: ['A. Café was removed', 'B. Library was added', 'C. Sports hall was expanded'], answer: 'C', answerLine: 'The most significant change is the expanded sports hall.' },

                    { number: 13, type: 'fill_in_blank', prompt: 'The fitness studio opens at ___ on weekday mornings.', answer: '6:30', answerLine: 'The studio opens at half past six on weekday mornings.' },

                    { number: 14, type: 'matching', prompt: 'Room for after-school programs', answer: 'D', answerLine: 'Room D is reserved for after-school activities every weekday.' },

                    { number: 15, type: 'matching', prompt: 'Room for art workshops', answer: 'B', answerLine: 'Room B has been converted into our new art studio.' },

                    { number: 16, type: 'matching', prompt: 'Room for senior yoga classes', answer: 'F', answerLine: 'Senior yoga takes place in Room F every Tuesday and Thursday.' },

                    { number: 17, type: 'mcq', prompt: 'What is included in the Gold membership?', options: ['A. Pool access only', 'B. All facilities except studio', 'C. All facilities including studio and parking'], answer: 'C', answerLine: 'Gold members get everything, including studio classes and parking.' },

                    { number: 18, type: 'fill_in_blank', prompt: 'Monthly cost of Silver membership: £___', answer: '28', answerLine: 'Silver is twenty-eight pounds per month.' },

                    { number: 19, type: 'mcq', prompt: 'When is the summer sports festival?', options: ['A. Last weekend in July', 'B. First weekend in August', 'C. Mid-August'], answer: 'B', answerLine: 'The festival runs over the first weekend in August.' },

                    { number: 20, type: 'fill_in_blank', prompt: 'Café discount for members: ___% off all hot drinks.', answer: '15', answerLine: 'Members get fifteen percent off all hot drinks in the café.' },

                ],

            },

            {

                partNumber: 3,

                title: 'Section 3: Group Project on Sustainable Architecture',

                audioUrl: '/api/audio?preset=mock-102-listening-part3&voice=alloy',

                text:

                    'Three students — Amara, Ben, and Chloe — discuss their group assignment on energy-efficient building design. They talk about sources, presentation structure, and research challenges.\n\nTranscript Focus: Research decisions, data sources used, disagreements in the group, and final presentation format.',

                tips: [

                    'Track who says what — attribution matters in Section 3.',

                    'Contrast language shows disagreement.',

                    'MCQ options may all be plausible — listen for what is specifically confirmed.',

                ],

                questions: [

                    { number: 21, type: 'mcq', prompt: 'What was the main topic they agreed on?', options: ['A. Passive solar design in schools', 'B. Green roofs in urban housing', 'C. Energy labelling systems'], answer: 'A', answerLine: "We all agreed passive solar in schools was the strongest angle." },

                    { number: 22, type: 'fill_in_blank', prompt: 'Ben found a case study from ___ that supported the argument.', answer: 'Denmark', answerLine: 'I found an excellent case study from Denmark.' },

                    { number: 23, type: 'mcq', prompt: "What is Chloe's concern about the data?", options: ['A. It is too old', 'B. It is from a single country', 'C. It was not peer-reviewed'], answer: 'C', answerLine: "I am not sure the report was peer-reviewed, which is a problem." },

                    { number: 24, type: 'fill_in_blank', prompt: 'The group decided to include ___ case studies in total.', answer: '3', answerLine: 'Let us include three case studies for balance.' },

                    { number: 25, type: 'mcq', prompt: 'Who will write the introduction?', options: ['A. Amara', 'B. Ben', 'C. Chloe'], answer: 'A', answerLine: "Amara said she would write the introduction since it was her idea." },

                    { number: 26, type: 'fill_in_blank', prompt: 'The presentation must not exceed ___ minutes.', answer: '20', answerLine: 'Remember the time limit is twenty minutes.' },

                    { number: 27, type: 'mcq', prompt: 'What format will they use for visuals?', options: ['A. Printed handouts', 'B. Video clips only', 'C. Slides with graphs'], answer: 'C', answerLine: "Let's use slides with the key graphs embedded." },

                    { number: 28, type: 'fill_in_blank', prompt: "Ben's section focuses on ___.", answer: 'cost analysis', answerLine: 'I will handle the cost analysis section.' },

                    { number: 29, type: 'mcq', prompt: "What is Amara's final suggestion?", options: ['A. Submit early for feedback', 'B. Add a glossary of terms', 'C. Include a survey of students'], answer: 'A', answerLine: "I suggest we submit a draft early and ask the tutor for feedback." },

                    { number: 30, type: 'fill_in_blank', prompt: 'The submission deadline is ___ November.', answer: '18th', answerLine: 'The deadline is the eighteenth of November.' },

                ],

            },

            {

                partNumber: 4,

                title: 'Section 4: Lecture — Sleep, Memory and Academic Performance',

                audioUrl: '/api/audio?preset=mock-102-listening-part4&voice=alloy',

                text:

                    'A university lecturer presents findings on the relationship between sleep quality and memory consolidation in students. The lecture covers sleep stages, types of memory, and implications for study habits.\n\nTranscript Focus: Key terms (REM, slow-wave sleep), definitions, research findings, and practical recommendations.',

                tips: [

                    'Academic lectures use precise vocabulary — spell carefully.',

                    'Answers usually follow a signal phrase like "research shows".',

                    'Numbers and percentages: write exactly what you hear.',

                ],

                questions: [

                    { number: 31, type: 'fill_in_blank', prompt: 'The type of memory most improved by REM sleep: ___ memory.', answer: 'procedural', answerLine: 'REM sleep is especially linked to procedural memory consolidation.' },

                    { number: 32, type: 'fill_in_blank', prompt: 'Slow-wave sleep is sometimes called ___ sleep.', answer: 'deep', answerLine: 'Slow-wave sleep, or what we commonly call deep sleep.' },

                    { number: 33, type: 'fill_in_blank', prompt: 'Students averaging less than ___ hours perform measurably worse on retention tests.', answer: '6', answerLine: 'Students sleeping fewer than six hours show measurable retention declines.' },

                    { number: 34, type: 'mcq', prompt: 'What did the 2019 Stanford study find?', options: ['A. Sleep before learning is more important', 'B. Sleep after learning improves recall by up to 40%', 'C. Naps have no benefit for memory'], answer: 'B', answerLine: 'The Stanford study reported up to forty percent improvement in recall after sleep.' },

                    { number: 35, type: 'fill_in_blank', prompt: 'The part of the brain most active during memory consolidation: the ___.', answer: 'hippocampus', answerLine: 'The hippocampus plays the central role in memory consolidation during sleep.' },

                    { number: 36, type: 'fill_in_blank', prompt: 'A short ___ of up to 30 minutes can refresh working memory.', answer: 'nap', answerLine: 'A nap of up to thirty minutes can meaningfully refresh working memory.' },

                    { number: 37, type: 'mcq', prompt: 'What is identified as a major disruptor of sleep quality?', options: ['A. Reading before bed', 'B. Screen use in the hour before sleep', 'C. Low room temperature'], answer: 'B', answerLine: 'Screen use in the hour before bed is a proven disruptor of sleep onset.' },

                    { number: 38, type: 'fill_in_blank', prompt: 'The recommended room temperature for optimal sleep: ___ degrees Celsius.', answer: '18', answerLine: 'Research suggests eighteen degrees Celsius as the optimal sleep temperature.' },

                    { number: 39, type: 'fill_in_blank', prompt: 'The technique of reviewing notes ___ hours before sleep was shown to improve retention.', answer: '2', answerLine: 'Reviewing material about two hours before sleeping produced the strongest effect.' },

                    { number: 40, type: 'mcq', prompt: "What is the lecturer's main conclusion?", options: ['A. Students should study at night only', 'B. Sleep quality is as important as study time', 'C. Napping replaces full night sleep effectively'], answer: 'B', answerLine: 'The key message is that sleep quality matters as much as the time spent studying.' },

                ],

            },

        ],

    },



    Reading: {

        title: 'Full Mock Test 2 - Reading',

        introduction:

            'Three academic passages with 40 questions. Allocate approximately 20 minutes per passage.',

        audioUrl: null,

        examConfig: IELTS_MODULE_BLUEPRINT.Reading,

        parts: [

            {

                partNumber: 1,

                title: 'Passage 1: The Decline of Print Journalism',

                text:

                    'The newspaper industry has faced unparalleled disruption in the digital age. In the United Kingdom, national daily print circulation fell from approximately 12 million in 2000 to under 3 million by 2023, a decline exceeding 75 percent. North America and Australia recorded similar trajectories. The causes are multiple and mutually reinforcing, driven by changes in consumer behaviour, the collapse of traditional advertising models, and the proliferation of free digital content.\n\nThe internet fundamentally altered how audiences access news. Online platforms, social media feeds, and aggregator services allow readers to obtain information without purchasing a physical copy. Surveys consistently show that adults under thirty rarely develop regular print habits, preferring mobile alerts and curated social feeds. This generational shift presents a structural challenge that few publishers have managed to reverse.\n\nAdvertising revenue followed readers to digital platforms. In 2005, print advertising accounted for the majority of newspaper income in most developed markets. By 2020, digital advertising surpassed print in every major economy. Technology companies offering targeted advertising at reduced cost captured expenditure that had sustained local and national papers for decades. Regional papers were especially vulnerable: classified advertising for property, employment, and vehicles, which had underwritten many local titles, migrated almost entirely to dedicated online marketplaces.\n\nPublishers have responded with varying degrees of success. Subscription-based digital models have replaced or supplemented print editions at major outlets. Several leading titles attracted millions of paying digital subscribers, though converting free readers to paying customers remains difficult. Research consistently shows that readers are willing to pay for specialist investigative journalism but resist paywalls for general news freely available elsewhere.\n\nMedia researchers point to a further consequence: the closure of local newspapers correlates with measurable declines in civic engagement. Studies in the United States identified links between the disappearance of local titles and lower voter turnout, reduced attendance at public meetings, and weaker community oversight of local government. Such findings suggest the effects of print decline extend beyond commercial loss.\n\nThe future trajectory remains contested. A minority of regional papers in Scandinavia have found stability through hybrid models combining digital subscriptions, reduced print frequency, and in some cases public subsidy. Media economists broadly agree that any sustainable model must align content investment with demonstrable reader value, a discipline the advertising-supported model never required publishers to develop with such precision.',

                tips: [

                    'TRUE/FALSE/NOT GIVEN — only answer TRUE if it is directly stated.',

                    'NOT GIVEN means the passage neither confirms nor denies.',

                    'Use scanning to locate key words from the question.',

                ],

                questions: [

                    { number: 1, type: 'true_false', prompt: 'Print newspaper circulation in the UK fell by more than half between 2000 and 2023.', answer: 'TRUE', answerLine: 'Fell from approximately 12 million to under 3 million — more than 75%.' },

                    { number: 2, type: 'true_false', prompt: 'Young adults under thirty tend to prefer print news over digital formats.', answer: 'FALSE', answerLine: 'Adults under thirty rarely develop regular print habits, preferring mobile alerts.' },

                    { number: 3, type: 'true_false', prompt: 'By 2020, digital advertising had overtaken print in every major economy.', answer: 'TRUE', answerLine: 'Digital advertising surpassed print in every major economy by 2020.' },

                    { number: 4, type: 'true_false', prompt: 'Most readers are willing to pay for general news behind a paywall.', answer: 'FALSE', answerLine: 'Readers resist paywalls for general news freely available elsewhere.' },

                    { number: 5, type: 'true_false', prompt: 'The passage claims all Scandinavian newspapers are financially secure.', answer: 'NOT GIVEN', answerLine: 'Only "a minority of regional papers in Scandinavia" found stability.' },

                    { number: 6, type: 'mcq', prompt: 'What made regional papers especially vulnerable?', options: ['A. Lower editorial quality', 'B. Loss of classified advertising to online platforms', 'C. Fewer readers in rural areas'], answer: 'B', answerLine: 'Classified advertising for property, employment, and vehicles migrated to online marketplaces.' },

                    { number: 7, type: 'mcq', prompt: 'Which content type do readers most accept paying for?', options: ['A. Sports coverage', 'B. Celebrity news', 'C. Specialist investigative journalism'], answer: 'C', answerLine: 'Readers are willing to pay for specialist investigative journalism.' },

                    { number: 8, type: 'mcq', prompt: 'The closure of local newspapers has been linked to', options: ['A. Increased civic engagement', 'B. Lower voter turnout and reduced public meeting attendance', 'C. A rise in digital political participation'], answer: 'B', answerLine: 'Links between disappearance of local titles and lower voter turnout, reduced meeting attendance.' },

                    { number: 9, type: 'fill_in_blank', prompt: 'Print circulation in the UK fell from 12 million to under ___ million by 2023.', answer: '3', answerLine: 'To under 3 million by 2023.' },

                    { number: 10, type: 'fill_in_blank', prompt: 'Technology companies captured print advertising revenue by offering ___ advertising.', answer: 'targeted', answerLine: 'Technology companies offering targeted advertising at reduced cost.' },

                    { number: 11, type: 'fill_in_blank', prompt: 'Sustainable newspaper models must align content investment with demonstrable reader ___.', answer: 'value', answerLine: 'Align content investment with demonstrable reader value.' },

                    { number: 12, type: 'matching', prompt: 'Best heading: the shift in how audiences get news', answer: 'ii', answerLine: 'The internet fundamentally altered how audiences access news.' },

                    { number: 13, type: 'matching', prompt: 'Best heading: wider community consequences of paper closures', answer: 'v', answerLine: 'Closure of local newspapers correlates with measurable declines in civic engagement.' },

                ],

            },

            {

                partNumber: 2,

                title: 'Passage 2: Biomimicry — Nature as Design Blueprint',

                text:

                    "Biomimicry is the practice of drawing on biological systems and processes to solve human design challenges. The term was popularized by scientist and author Janine Benyus in her 1997 book, which argued that nature's 3.8 billion years of evolution had produced remarkably efficient solutions to problems that engineers and designers continue to struggle with today. Since publication, the field has grown considerably, finding applications in architecture, materials science, robotics, and urban planning.\n\nOne of the most cited examples of biomimicry is the shinkansen bullet train in Japan. The original nose of the train caused a loud sonic boom whenever it exited tunnels, disturbing nearby residents. Engineer Eiji Nakatsu, an avid birdwatcher, noticed that the kingfisher dives into water with almost no splash despite moving from a low-density medium into a high-density one. He redesigned the train's nose to replicate the bird's beak profile, reducing noise by 30 decibels and improving energy efficiency by 15 percent.\n\nIn architecture, biomimicry has influenced building ventilation. The Eastgate Centre in Zimbabwe was designed by architect Mick Pearce with reference to termite mounds. African termites maintain near-constant internal temperatures in their mounds despite large external temperature swings by creating a network of ventilation shafts that draw hot air upward and channel cooler air from underground. Eastgate replicates this principle with stacked chimney vents, eliminating the need for conventional air conditioning and reducing energy consumption by over 90 percent compared to a conventionally cooled building of equivalent size.\n\nMaterials scientists have drawn inspiration from the lotus leaf. Its surface consists of microscopic waxy bumps that cause water droplets to bead and roll off, carrying dirt particles with them. This self-cleaning property has been replicated in commercial paints and exterior coatings, reducing maintenance costs and the need for chemical cleaning agents in construction.\n\nCritics note several limitations. Scaling biological solutions to industrial dimensions can introduce unforeseen complications. The principles behind a spider's silk, which is stronger than steel by weight, are well understood, but large-scale production remains commercially unviable despite decades of research. Additionally, some critics argue that biomimicry risks oversimplifying complex ecological interactions or applying them out of biological context in ways that undermine functionality.\n\nDespite these challenges, the field continues to expand. Proponents argue that as resource constraints intensify, designs aligned with natural systems will prove more resilient and efficient than those developed in isolation from the biological world. Universities worldwide have introduced biomimicry as a formal discipline, and patent databases show a steady rise in biomimicry-related innovations over the past two decades.",

                tips: [

                    'For matching headings, read the paragraph topic first, then match.',

                    'Numerical answers — listen for exact figures in the text.',

                    'MCQ: identify what the question is truly asking before reviewing options.',

                ],

                questions: [

                    { number: 14, type: 'mcq', prompt: 'What is the central idea of biomimicry?', options: ['A. Replacing natural habitats with engineered systems', 'B. Using biological processes to inform design solutions', 'C. Studying animals for entertainment purposes'], answer: 'B', answerLine: 'Biomimicry is the practice of drawing on biological systems to solve human design challenges.' },

                    { number: 15, type: 'fill_in_blank', prompt: 'The redesigned bullet train nose reduced noise by ___ decibels.', answer: '30', answerLine: 'Reducing noise by 30 decibels.' },

                    { number: 16, type: 'fill_in_blank', prompt: 'Energy efficiency of the train also improved by ___ percent.', answer: '15', answerLine: 'Improving energy efficiency by 15 percent.' },

                    { number: 17, type: 'mcq', prompt: 'The Eastgate Centre ventilation system was inspired by', options: ['A. Beehive structures', 'B. Termite mounds', 'C. Underground river systems'], answer: 'B', answerLine: 'Designed with reference to termite mounds.' },

                    { number: 18, type: 'fill_in_blank', prompt: 'Eastgate reduced energy consumption by over ___ percent versus a conventional building.', answer: '90', answerLine: 'Reducing energy consumption by over 90 percent.' },

                    { number: 19, type: 'mcq', prompt: 'The lotus leaf inspired innovations in', options: ['A. Solar panels', 'B. Water filtration', 'C. Self-cleaning coatings'], answer: 'C', answerLine: 'Replicated in commercial paints and exterior coatings.' },

                    { number: 20, type: 'true_false', prompt: 'Large-scale production of spider silk is currently commercially viable.', answer: 'FALSE', answerLine: 'Large-scale production remains commercially unviable despite decades of research.' },

                    { number: 21, type: 'true_false', prompt: "Eiji Nakatsu's inspiration for the bullet train came from watching birds.", answer: 'TRUE', answerLine: 'Engineer Nakatsu, an avid birdwatcher, noticed the kingfisher.' },

                    { number: 22, type: 'true_false', prompt: 'The passage says critics are wrong to raise concerns about biomimicry.', answer: 'NOT GIVEN', answerLine: 'Critics note limitations; no judgment on whether they are wrong.' },

                    { number: 23, type: 'matching', prompt: 'Best heading: train design improved through bird observation', answer: 'ii', answerLine: 'Nakatsu redesigned the nose to replicate the kingfisher beak profile.' },

                    { number: 24, type: 'matching', prompt: 'Best heading: problems with translating small-scale biology to industry', answer: 'v', answerLine: 'Scaling biological solutions to industrial dimensions can introduce complications.' },

                    { number: 25, type: 'matching', prompt: 'Best heading: definition and origins of the field', answer: 'i', answerLine: "Biomimicry is the practice... term popularized by Benyus." },

                    { number: 26, type: 'fill_in_blank', prompt: 'Termite mounds maintain near-constant ___ despite external temperature swings.', answer: 'internal temperatures', answerLine: 'Maintain near-constant internal temperatures despite large external temperature swings.' },

                ],

            },

            {

                partNumber: 3,

                title: 'Passage 3: Universal Basic Income — Policy or Experiment?',

                text:

                    "Universal Basic Income (UBI) is a policy proposal under which every adult citizen of a nation would receive a fixed regular payment from the government, regardless of employment status, wealth, or other personal circumstances. Advocates position it as a response to automation, rising inequality, and the inadequacy of means-tested welfare systems. Critics question its cost, its effects on work incentives, and its political feasibility. The debate has intensified as pilot programmes in Finland, Kenya, Canada, and the United States provide new empirical data.\n\nProponents argue that UBI addresses several structural weaknesses of conventional welfare. Traditional benefit systems are often fragmented, carrying high administrative costs and coverage gaps that leave vulnerable groups unsupported. A universal payment would eliminate eligibility bureaucracy, reduce stigma, and reach informal workers, caregivers, and self-employed individuals who frequently fall outside existing safety nets. Finnish economists who studied the country's two-year pilot found that recipients reported significantly higher levels of wellbeing and greater willingness to seek employment compared with control groups receiving standard unemployment benefits.\n\nEconomists sceptical of UBI focus on cost. A genuinely universal payment at a meaningful level would require substantial fiscal resources. In the United Kingdom, providing every adult with even a modest sum equivalent to current basic welfare would cost approximately £280 billion annually, requiring significant tax increases or reallocation of existing public spending. Critics note that directing these resources toward targeted programmes for the most vulnerable would produce greater welfare gains per pound spent.\n\nThe employment effect is among the most contested questions. Classical economic theory predicts that an unconditional income floor would reduce labour supply, as some recipients would choose leisure over work. However, evidence from pilots has been more nuanced. In the Finnish experiment, recipients were no less likely to work than control groups. In Kenya's long-running GiveDirectly programme, recipients invested in productive assets and reported higher business activity. Some researchers conclude that UBI may shift the nature of work rather than reducing its total volume.\n\nA further debate concerns whether UBI is a complement or substitute for other public services. If UBI payments replace healthcare or housing benefits, low-income recipients may face net losses. Advocates therefore argue that a well-designed UBI must supplement, not replace, essential services. Political economists note that this distinction is crucial: the same policy label can describe very different distributional outcomes depending on its financing and interaction with existing transfers.\n\nPublic opinion data suggest that support for UBI varies significantly by framing. When presented as a 'basic income guarantee', surveys show majority support in many countries. When framed as a 'welfare payment for all', support falls sharply. Policy analysts regard this sensitivity as evidence that communication and political context are as important as the technical design of any future UBI implementation.",

                tips: [

                    'Passage 3 often contains complex argument structures.',

                    'Do not bring in outside knowledge — answer only from the text.',

                    'Matching: check each option against the paragraph before assigning.',

                ],

                questions: [

                    { number: 27, type: 'mcq', prompt: 'UBI is defined in the passage as a payment that is', options: ['A. Based on employment history', 'B. Given to all adults regardless of circumstances', 'C. Reserved for those below the poverty line'], answer: 'B', answerLine: 'Every adult citizen regardless of employment status, wealth, or other circumstances.' },

                    { number: 28, type: 'true_false', prompt: 'Conventional welfare systems are often criticised for high administrative costs.', answer: 'TRUE', answerLine: 'Fragmented, carrying high administrative costs and coverage gaps.' },

                    { number: 29, type: 'true_false', prompt: 'Finnish UBI recipients were less willing to seek employment than control groups.', answer: 'FALSE', answerLine: 'Recipients reported greater willingness to seek employment compared with control groups.' },

                    { number: 30, type: 'fill_in_blank', prompt: "Providing a basic UBI in the UK would cost approximately £___ billion annually.", answer: '280', answerLine: 'Would cost approximately £280 billion annually.' },

                    { number: 31, type: 'mcq', prompt: "According to critics, what would be a better use of UBI resources?", options: ['A. Funding corporate tax cuts', 'B. Directing funds to targeted programmes for the vulnerable', 'C. Reducing the national debt'], answer: 'B', answerLine: 'Directing resources toward targeted programmes for the most vulnerable would produce greater welfare gains.' },

                    { number: 32, type: 'fill_in_blank', prompt: 'In Kenya, GiveDirectly recipients invested in ___ assets and reported higher business activity.', answer: 'productive', answerLine: 'Invested in productive assets and reported higher business activity.' },

                    { number: 33, type: 'true_false', prompt: 'All economists agree that UBI reduces total labour supply.', answer: 'FALSE', answerLine: 'Evidence from pilots has been more nuanced; Finnish recipients no less likely to work.' },

                    { number: 34, type: 'true_false', prompt: 'The passage states that UBI should always replace existing healthcare benefits.', answer: 'FALSE', answerLine: 'Advocates argue UBI must supplement, not replace, essential services.' },

                    { number: 35, type: 'true_false', prompt: 'Public support for UBI changes depending on how it is described.', answer: 'TRUE', answerLine: 'Support for UBI varies significantly by framing.' },

                    { number: 36, type: 'mcq', prompt: 'When described as a "welfare payment for all", public support', options: ['A. Increases sharply', 'B. Stays the same', 'C. Falls sharply'], answer: 'C', answerLine: 'When framed as a welfare payment for all, support falls sharply.' },

                    { number: 37, type: 'fill_in_blank', prompt: 'Policy analysts say ___ and political context are as important as technical design.', answer: 'communication', answerLine: 'Communication and political context are as important as the technical design.' },

                    { number: 38, type: 'matching', prompt: 'Best heading: how existing welfare systems fail certain workers', answer: 'ii', answerLine: 'Informal workers, caregivers, and self-employed fall outside existing safety nets.' },

                    { number: 39, type: 'matching', prompt: 'Best heading: UBI as addition to, not replacement for, public services', answer: 'v', answerLine: 'UBI must supplement, not replace, essential services.' },

                    { number: 40, type: 'fill_in_blank', prompt: 'Some researchers conclude that UBI may ___ the nature of work rather than reduce its volume.', answer: 'shift', answerLine: 'UBI may shift the nature of work rather than reducing its total volume.' },

                ],

            },

        ],

    },



    Writing: {

        title: 'Full Mock Test 2 - Writing',

        introduction:

            'Task 1: 20 minutes, minimum 150 words. Task 2: 40 minutes, minimum 250 words.',

        audioUrl: null,

        examConfig: IELTS_MODULE_BLUEPRINT.Writing,

        parts: [

            {

                partNumber: 1,

                title: 'Task 1: Bar Chart — Employment by Sector',

                text:

                    'The bar chart below shows the percentage of workers employed in three sectors — agriculture, manufacturing, and services — in four countries (Brazil, Germany, India, and South Korea) in 1990 and 2020.\n\nData Summary:\nBrazil: Agriculture 35%→16%, Manufacturing 22%→19%, Services 43%→65%\nGermany: Agriculture 5%→2%, Manufacturing 40%→25%, Services 55%→73%\nIndia: Agriculture 65%→44%, Manufacturing 15%→24%, Services 20%→32%\nSouth Korea: Agriculture 18%→5%, Manufacturing 35%→25%, Services 47%→70%\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.',

                tips: [

                    'Begin with an overview sentence naming the most striking overall trend.',

                    'Group similar countries or trends together for clarity.',

                    'Use precise comparative language: "fell significantly", "rose sharply", "remained relatively stable".',

                ],

                questions: [

                    { number: 1, type: 'fill_in_blank', prompt: 'Planning check: In which country did agriculture employ the most workers in 1990?', answer: 'India', answerLine: 'India: Agriculture 65% in 1990.' },

                    { number: 2, type: 'fill_in_blank', prompt: 'Overview check: Which sector grew in all four countries by 2020?', answer: 'services', answerLine: 'Services increased in all four countries.' },

                ],

            },

            {

                partNumber: 2,

                title: 'Task 2: Causes and Effects Essay',

                text:

                    'In many countries, the number of people choosing to live alone has increased significantly over recent decades. What are the causes of this trend? What are its effects on individuals and on society as a whole?\n\nWrite at least 250 words. Give reasons for your answer and include any relevant examples from your own knowledge or experience.',

                tips: [

                    'Write a clear introduction that paraphrases the question and states your approach.',

                    'Devote separate paragraphs to causes and effects.',

                    'Conclude with a balanced reflection — avoid extreme predictions.',

                ],

                questions: [

                    { number: 3, type: 'fill_in_blank', prompt: 'Planning: Name one cause of people living alone.', answer: 'open', answerLine: 'Examples: career mobility, delayed marriage, higher income levels.' },

                    { number: 4, type: 'fill_in_blank', prompt: 'Planning: Name one societal effect of more single-person households.', answer: 'open', answerLine: 'Examples: higher housing demand, increased loneliness, consumer spending changes.' },

                ],

            },

        ],

    },



    Speaking: {

        title: 'Full Mock Test 2 - Speaking',

        introduction:

            'Examiner-style speaking test: Part 1 (4–5 min), Part 2 (3–4 min), Part 3 (4–5 min).',

        audioUrl: null,

        examConfig: IELTS_MODULE_BLUEPRINT.Speaking,

        parts: [

            {

                partNumber: 1,

                title: 'Part 1: Introductory Interview',

                text:

                    'The examiner will ask you about yourself and everyday topics. Give natural answers of 2–4 sentences. Add one brief reason or example to each response.',

                tips: [

                    'Do not memorise scripts — speak naturally.',

                    'Extend each answer with "because", "for example", or "although".',

                    'Vary your vocabulary and sentence structure.',

                ],

                questions: [

                    { number: 1, type: 'fill_in_blank', prompt: 'Do you enjoy listening to music? What kind do you prefer?', answer: 'open', answerLine: 'Personal response.' },

                    { number: 2, type: 'fill_in_blank', prompt: 'How often do you exercise, and what type of exercise do you prefer?', answer: 'open', answerLine: 'Personal response.' },

                    { number: 3, type: 'fill_in_blank', prompt: 'How do you usually spend your weekends?', answer: 'open', answerLine: 'Personal response.' },

                    { number: 4, type: 'fill_in_blank', prompt: 'Do you think it is important to have hobbies outside work or study?', answer: 'open', answerLine: 'Personal response.' },

                    { number: 5, type: 'fill_in_blank', prompt: 'What type of music or entertainment was popular when you were growing up?', answer: 'open', answerLine: 'Personal response.' },

                ],

            },

            {

                partNumber: 2,

                title: 'Part 2: Cue Card',

                text:

                    'Describe a piece of technology that has greatly changed your life.\nYou should say:\n- what the technology is\n- when you first started using it\n- how you use it in daily life\nand explain why it has been so important to you.\n\nYou have 1 minute to prepare notes and up to 2 minutes to speak.',

                tips: [

                    'Use your 1 minute to write 4–5 key phrases, not full sentences.',

                    'Organise your talk around the bullet points in order.',

                    'End with the "explain why" section — it carries most of the marks.',

                ],

                questions: [

                    { number: 6, type: 'fill_in_blank', prompt: 'Preparation keyword 1 (technology name/type)', answer: 'open', answerLine: 'Self-note.' },

                    { number: 7, type: 'fill_in_blank', prompt: 'Preparation keyword 2 (first use / when)', answer: 'open', answerLine: 'Self-note.' },

                    { number: 8, type: 'fill_in_blank', prompt: 'Preparation keyword 3 (why it matters — example or story)', answer: 'open', answerLine: 'Self-note.' },

                ],

            },

            {

                partNumber: 3,

                title: 'Part 3: Discussion — Technology and Society',

                text:

                    'The examiner will ask broader questions connected to technology. Develop each answer with a clear idea, supporting reason, and brief example or future consequence.',

                tips: [

                    'Show range by using concession language: "Although... , I would argue...".',

                    'Abstract questions: address principles, not just personal experiences.',

                    'Keep answers between 30 and 60 seconds — avoid being too brief or too long.',

                ],

                questions: [

                    { number: 9, type: 'fill_in_blank', prompt: 'Has technology made communication between people better or worse overall?', answer: 'open', answerLine: 'Discussion question.' },

                    { number: 10, type: 'fill_in_blank', prompt: 'Should governments regulate the use of social media? Why or why not?', answer: 'open', answerLine: 'Discussion question.' },

                    { number: 11, type: 'fill_in_blank', prompt: 'In what ways might artificial intelligence change the job market in the next decade?', answer: 'open', answerLine: 'Discussion question.' },

                    { number: 12, type: 'fill_in_blank', prompt: 'Do you think children today have too much access to technology? What could be done?', answer: 'open', answerLine: 'Discussion question.' },

                ],

            },

        ],

    },

} as const;





// ─── MOCK TEST 3 ────────────────────────────────────────────────────────────



export const MOCK_TEST_3 = {

    Listening: {

        title: 'Full Mock Test 3 - Listening',

        introduction:

            'Cambridge-style listening simulation with 4 sections and 40 questions. Follow strict exam timing.',

        audioUrl: '/api/audio?preset=mock-103-listening-full&voice=alloy',

        examConfig: IELTS_MODULE_BLUEPRINT.Listening,

        parts: [

            {

                partNumber: 1,

                title: 'Section 1: Vehicle Insurance Enquiry',

                audioUrl: '/api/audio?preset=mock-103-listening-part1&voice=alloy',

                text:

                    'A customer calls QuickShield Insurance to get a quote for car insurance. The agent takes details about the vehicle, driver history, and coverage preferences. Listen for corrections and precise numbers.\n\nTranscript Focus: Car registration, driver details, policy type, excess level, monthly premium, and policy start date.',

                tips: [

                    'Listen for "I mean" and "let me correct that" as distractor signals.',

                    'Write numbers and codes exactly as spoken.',

                    'Do not confuse monthly premium with annual cost.',

                ],

                questions: [

                    { number: 1, type: 'fill_in_blank', prompt: "Customer's first name: ___", answer: 'Natalie', answerLine: "Yes, it's Natalie, N-A-T-A-L-I-E." },

                    { number: 2, type: 'fill_in_blank', prompt: 'Car registration: ___ BXK 7', answer: 'GH19', answerLine: 'The registration is GH19 BXK 7.' },

                    { number: 3, type: 'fill_in_blank', prompt: 'Year of manufacture: ___', answer: '2019', answerLine: 'It was made in 2019.' },

                    { number: 4, type: 'mcq', prompt: 'Which cover type did the customer choose?', options: ['A. Third party only', 'B. Third party, fire and theft', 'C. Comprehensive'], answer: 'C', answerLine: 'I would like comprehensive cover, please.' },

                    { number: 5, type: 'fill_in_blank', prompt: 'Annual mileage estimated: ___ miles.', answer: '8000', answerLine: 'I drive about eight thousand miles a year.' },

                    { number: 6, type: 'fill_in_blank', prompt: 'Years of no-claims bonus: ___', answer: '4', answerLine: 'I have four years of no-claims bonus.' },

                    { number: 7, type: 'fill_in_blank', prompt: 'Chosen voluntary excess: £___', answer: '350', answerLine: 'I will set the voluntary excess at three hundred and fifty pounds.' },

                    { number: 8, type: 'mcq', prompt: 'How did the customer prefer to pay?', options: ['A. Annual lump sum', 'B. Quarterly instalments', 'C. Monthly direct debit'], answer: 'C', answerLine: 'Monthly direct debit would suit me best.' },

                    { number: 9, type: 'fill_in_blank', prompt: 'Monthly premium quoted: £___', answer: '62.50', answerLine: 'Your monthly premium comes to sixty-two pounds fifty.' },

                    { number: 10, type: 'fill_in_blank', prompt: 'Policy start date: ___ June.', answer: '1st', answerLine: 'The policy can start on the first of June.' },

                ],

            },

            {

                partNumber: 2,

                title: 'Section 2: Heritage Museum Audio Guide',

                audioUrl: '/api/audio?preset=mock-103-listening-part2&voice=alloy',

                text:

                    'A volunteer guide introduces visitors to the Whitmore Heritage Museum, describing the layout, key exhibits, and visitor facilities. Questions focus on directions, exhibit locations, and special features.\n\nTranscript Focus: Room layout and numbering, exhibit descriptions, opening times, guided tour schedule, and café location.',

                tips: [

                    'Use the building map mentally — track left/right, upstairs/downstairs.',

                    'Matching: one option may not be used.',

                    'Numbers given for timing and floors — listen carefully for each.',

                ],

                questions: [

                    { number: 11, type: 'fill_in_blank', prompt: 'The Victorian Life exhibition is in Room ___.', answer: '4', answerLine: 'Victorian Life is housed in Room Four on the ground floor.' },

                    { number: 12, type: 'mcq', prompt: 'Where is the Whitmore Collection of ceramics located?', options: ['A. Ground floor, east wing', 'B. First floor, west gallery', 'C. Basement archive room'], answer: 'B', answerLine: 'The Whitmore ceramics are upstairs in the west gallery.' },

                    { number: 13, type: 'fill_in_blank', prompt: 'Guided tours depart at ___ and 14:00 each day.', answer: '11:00', answerLine: 'Tours leave at eleven in the morning and two in the afternoon.' },

                    { number: 14, type: 'matching', prompt: 'Room with interactive children\'s activities', answer: 'C', answerLine: 'Room C is the family discovery zone with interactive displays.' },

                    { number: 15, type: 'matching', prompt: 'Room containing early maps and navigation instruments', answer: 'A', answerLine: 'Room A holds our collection of early maps and navigation tools.' },

                    { number: 16, type: 'matching', prompt: 'Room used for temporary visiting exhibitions', answer: 'E', answerLine: 'Room E is our rotating temporary exhibition space.' },

                    { number: 17, type: 'mcq', prompt: 'Photography is permitted in which areas?', options: ['A. All rooms without flash', 'B. Ground floor only', 'C. Café and entrance hall only'], answer: 'A', answerLine: 'Photography is allowed throughout the museum as long as you do not use flash.' },

                    { number: 18, type: 'fill_in_blank', prompt: 'The museum café closes at ___ on weekdays.', answer: '16:30', answerLine: 'The café closes at half past four on weekdays.' },

                    { number: 19, type: 'mcq', prompt: 'What is included in the family ticket?', options: ['A. Two adults and two children', 'B. Two adults and up to four children', 'C. One adult and three children'], answer: 'B', answerLine: 'The family ticket covers two adults and up to four children.' },

                    { number: 20, type: 'fill_in_blank', prompt: 'The museum gift shop has a ___ percent discount for members.', answer: '20', answerLine: 'Museum members receive twenty percent off in the gift shop.' },

                ],

            },

            {

                partNumber: 3,

                title: 'Section 3: Seminar on Environmental Research Methods',

                audioUrl: '/api/audio?preset=mock-103-listening-part3&voice=alloy',

                text:

                    'Two postgraduate students, Yusuf and Priya, discuss their dissertation research with their supervisor, Dr. Webb. They focus on methodology choices for a study on coastal plastic pollution.\n\nTranscript Focus: Research design choices, data collection methods, sample size rationale, ethical considerations, and disagreements.',

                tips: [

                    'Three speakers — note attribution carefully.',

                    'Listen for the supervisor\'s recommendations versus student preferences.',

                    'MCQ options often contain partial truths — choose the most complete answer.',

                ],

                questions: [

                    { number: 21, type: 'mcq', prompt: 'What is the main focus of the research project?', options: ['A. Ocean temperature changes', 'B. Microplastic concentration in coastal sediment', 'C. Marine mammal behaviour'], answer: 'B', answerLine: 'We are measuring microplastic concentration in coastal sediment samples.' },

                    { number: 22, type: 'fill_in_blank', prompt: 'Yusuf proposes collecting samples from ___ sites.', answer: '12', answerLine: 'I think twelve sites would give us statistical significance.' },

                    { number: 23, type: 'mcq', prompt: "What is Dr. Webb's concern about the proposed sample size?", options: ['A. Too expensive to process', 'B. Too small for reliable comparisons', 'C. Too many for the available laboratory space'], answer: 'A', answerLine: 'Processing that number of samples will exceed your budget, I am afraid.' },

                    { number: 24, type: 'fill_in_blank', prompt: 'They agreed to reduce the number of sites to ___.', answer: '8', answerLine: 'Eight sites should be manageable within the budget.' },

                    { number: 25, type: 'mcq', prompt: 'What additional method did Priya suggest for triangulation?', options: ['A. Underwater drone surveys', 'B. Community interviews with local fishermen', 'C. Satellite imagery analysis'], answer: 'B', answerLine: 'I suggest we also do interviews with local fishermen to triangulate.' },

                    { number: 26, type: 'fill_in_blank', prompt: 'The ethical application must be submitted by ___ October.', answer: '15th', answerLine: 'Your ethics form must be in by the fifteenth of October.' },

                    { number: 27, type: 'fill_in_blank', prompt: 'The team will use a ___ sampling strategy for beach selection.', answer: 'stratified', answerLine: 'I recommend a stratified sampling strategy to ensure coastal zone variety.' },

                    { number: 28, type: 'mcq', prompt: 'What does Dr. Webb recommend for the literature review?', options: ['A. Focus only on UK studies', 'B. Include international data but emphasise European context', 'C. Limit to the last five years'], answer: 'B', answerLine: "Include international data, but keep the European context central to your argument." },

                    { number: 29, type: 'fill_in_blank', prompt: 'Priya will write the ___ chapter by the end of the month.', answer: 'methodology', answerLine: 'Priya, can you finish the methodology chapter by month end?' },

                    { number: 30, type: 'mcq', prompt: 'How will the findings be primarily disseminated?', options: ['A. Published in a journal article', 'B. Presented at a student symposium only', 'C. Submitted as a conference paper and dissertation'], answer: 'C', answerLine: 'You will submit a conference paper as well as the full dissertation.' },

                ],

            },

            {

                partNumber: 4,

                title: 'Section 4: Lecture — Microplastics and Marine Ecosystems',

                audioUrl: '/api/audio?preset=mock-103-listening-part4&voice=alloy',

                text:

                    'A marine biologist delivers a guest lecture on the sources, distribution, and ecological impacts of microplastic pollution in oceans. Questions focus on definitions, research data, and proposed solutions.\n\nTranscript Focus: Size classification of microplastics, entry pathways, species affected, bioaccumulation in food chains, and policy responses.',

                tips: [

                    'Technical terms will be defined — write the definition, not just the term.',

                    'Data answers often immediately follow phrases like "studies show" or "research found".',

                    'Lecture conclusions often contain the main message — listen until the end.',

                ],

                questions: [

                    { number: 31, type: 'fill_in_blank', prompt: 'Microplastics are defined as plastic particles smaller than ___ millimetres.', answer: '5', answerLine: 'Microplastics are particles smaller than five millimetres in diameter.' },

                    { number: 32, type: 'fill_in_blank', prompt: 'The largest single source of ocean microplastics is ___ from tyres.', answer: 'tyre wear particles', answerLine: 'Tyre wear particles are now considered the largest single source.' },

                    { number: 33, type: 'mcq', prompt: 'What process concentrates toxins attached to microplastics up the food chain?', options: ['A. Sedimentation', 'B. Bioaccumulation', 'C. Photodegradation'], answer: 'B', answerLine: 'Bioaccumulation means toxin concentrations rise at each trophic level.' },

                    { number: 34, type: 'fill_in_blank', prompt: 'Studies found microplastics in ___% of seabird species sampled globally.', answer: '90', answerLine: 'Ninety percent of seabird species studied have ingested microplastics.' },

                    { number: 35, type: 'fill_in_blank', prompt: 'Microplastics have also been detected in human ___.', answer: 'blood', answerLine: 'Recent studies have detected microplastic particles in human blood.' },

                    { number: 36, type: 'mcq', prompt: 'Which measure did the lecturer describe as most effective at source?', options: ['A. Ocean clean-up vessels', 'B. Extended producer responsibility legislation', 'C. Consumer recycling campaigns'], answer: 'B', answerLine: 'Extended producer responsibility legislation addresses the problem at its source.' },

                    { number: 37, type: 'fill_in_blank', prompt: 'The deep-sea floor now contains an estimated ___ million tonnes of plastic.', answer: '14', answerLine: 'There are estimated to be fourteen million tonnes of plastic on the deep-sea floor.' },

                    { number: 38, type: 'fill_in_blank', prompt: 'Plastic degrades into smaller particles via ___ from sunlight.', answer: 'photodegradation', answerLine: 'Photodegradation — the breakdown of plastic by UV sunlight — produces smaller fragments.' },

                    { number: 39, type: 'mcq', prompt: 'What did the 2022 global plastics treaty aim to achieve?', options: ['A. Ban all plastic production by 2030', 'B. Create legally binding rules to reduce plastic pollution', 'C. Fund ocean clean-up operations in developing nations'], answer: 'B', answerLine: 'The 2022 treaty aimed to create legally binding international rules to curb plastic pollution.' },

                    { number: 40, type: 'fill_in_blank', prompt: "The lecturer's conclusion was that reducing plastic at ___ is more effective than ocean clean-up.", answer: 'source', answerLine: 'Reducing plastic at source is far more cost-effective than attempting clean-up after the fact.' },

                ],

            },

        ],

    },



    Reading: {

        title: 'Full Mock Test 3 - Reading',

        introduction:

            'Three academic passages with 40 questions. Allocate approximately 20 minutes per passage.',

        audioUrl: null,

        examConfig: IELTS_MODULE_BLUEPRINT.Reading,

        parts: [

            {

                partNumber: 1,

                title: 'Passage 1: The Science of Bilingual Education',

                text:

                    'Bilingual education — the use of two languages as media of instruction — has attracted sustained interest from researchers, policymakers, and parents alike. The empirical evidence on its effects has grown considerably over the past two decades, although public debate continues to be shaped more by political ideology and cultural identity than by research findings.\n\nCognitive scientists have identified several neurological advantages associated with managing two languages. Bilingual individuals consistently demonstrate stronger performance on tasks requiring executive function — the set of mental processes that include selective attention, cognitive flexibility, and the inhibition of irrelevant responses. A widely cited explanation, known as the bilingual advantage hypothesis, holds that constant management of two competing language systems strengthens these cognitive control mechanisms over time.\n\nThe educational implications appear significant. Studies in Canada, where immersion programmes have a 50-year history, show that children taught partly in a second language reach the same levels of first-language literacy as monolingual peers, while developing functional proficiency in the second language. Critics of immersion models argue that initial academic delays in certain subjects are sometimes underreported, and that outcomes depend heavily on teacher quality and institutional support.\n\nIn sociolinguistically complex contexts, the arguments for bilingual education extend beyond cognition. In regions where indigenous or minority languages coexist with a dominant national language, bilingual schooling can play a critical role in language maintenance and cultural identity. Research in New Zealand, Wales, and parts of Latin America suggests that heritage language instruction improves both minority-language vitality and long-term academic performance in the national language.\n\nHowever, resource constraints create significant inequalities. Delivering quality bilingual instruction requires trained bilingual teachers, appropriate curricula, and assessment systems designed for bilingual learners — none of which are inexpensive or easy to develop at scale. Wealthy urban schools in multilingual societies often implement bilingual programmes successfully, while underfunded schools in the same regions remain monolingual, creating what some researchers describe as a bilingual privilege gap.\n\nPolicy responses have varied widely. Some governments mandate bilingual education in regions with significant minority populations. Others have moved in the opposite direction, emphasising national language instruction for integration purposes. Researchers generally advocate for context-sensitive approaches that account for community language dynamics, parental engagement, and available resources, rather than universal mandates.',

                tips: [

                    'TRUE = directly stated. NOT GIVEN = neither confirmed nor denied.',

                    'Skim for topic sentences first, then scan for specific answers.',

                    'For fill in blank, the exact word from the passage is usually correct.',

                ],

                questions: [

                    { number: 1, type: 'true_false', prompt: 'Public debate on bilingual education is mainly driven by research findings.', answer: 'FALSE', answerLine: 'Public debate is shaped more by political ideology and cultural identity than by research.' },

                    { number: 2, type: 'true_false', prompt: 'Bilingual people generally perform better on tasks involving selective attention.', answer: 'TRUE', answerLine: 'Bilingual individuals consistently demonstrate stronger performance on executive function tasks including selective attention.' },

                    { number: 3, type: 'fill_in_blank', prompt: 'The theory that managing two languages strengthens cognitive control is called the bilingual ___ hypothesis.', answer: 'advantage', answerLine: 'The bilingual advantage hypothesis holds that managing two systems strengthens cognitive control.' },

                    { number: 4, type: 'true_false', prompt: 'Canadian immersion studies show that bilingual children lag permanently behind monolingual peers in first-language literacy.', answer: 'FALSE', answerLine: 'Children reach the same levels of first-language literacy as monolingual peers.' },

                    { number: 5, type: 'true_false', prompt: 'Heritage language instruction in New Zealand was found to have no effect on performance in the national language.', answer: 'FALSE', answerLine: 'Improves both minority-language vitality and long-term academic performance in the national language.' },

                    { number: 6, type: 'mcq', prompt: 'According to the passage, what is the "bilingual privilege gap"?', options: ['A. Wealthier students learn more languages', 'B. Well-funded schools access bilingual programmes that poorly funded ones cannot', 'C. Bilingual students earn more in later life'], answer: 'B', answerLine: 'Wealthy urban schools implement bilingual programmes while underfunded schools remain monolingual — a bilingual privilege gap.' },

                    { number: 7, type: 'fill_in_blank', prompt: 'Quality bilingual instruction requires trained teachers, curricula, and ___ systems for bilingual learners.', answer: 'assessment', answerLine: 'Assessment systems designed for bilingual learners.' },

                    { number: 8, type: 'mcq', prompt: 'What do researchers generally recommend for policy?', options: ['A. Universal bilingual education mandates', 'B. Context-sensitive approaches based on community and resources', 'C. Prioritising the national language in all schools'], answer: 'B', answerLine: 'Context-sensitive approaches that account for community language dynamics, parental engagement, and resources.' },

                    { number: 9, type: 'true_false', prompt: 'The passage suggests bilingual education always reduces academic performance initially.', answer: 'NOT GIVEN', answerLine: 'Critics say initial delays are sometimes underreported — not that they always occur.' },

                    { number: 10, type: 'matching', prompt: 'Best heading: unequal access to bilingual schooling within the same society', answer: 'v', answerLine: 'Wealthy urban schools succeed while underfunded schools remain monolingual — a privilege gap.' },

                    { number: 11, type: 'matching', prompt: 'Best heading: how languages compete inside a bilingual brain', answer: 'ii', answerLine: 'Constant management of two competing language systems strengthens cognitive control.' },

                    { number: 12, type: 'fill_in_blank', prompt: 'In New Zealand, Wales, and Latin America, heritage language instruction improved minority-language ___.', answer: 'vitality', answerLine: 'Improves both minority-language vitality and long-term academic performance.' },

                    { number: 13, type: 'mcq', prompt: 'Which country has the longest history of immersion education programmes described in the passage?', options: ['A. New Zealand', 'B. Wales', 'C. Canada'], answer: 'C', answerLine: 'Canada, where immersion programmes have a 50-year history.' },

                ],

            },

            {

                partNumber: 2,

                title: 'Passage 2: Electric Vehicles — Opportunity and Challenge',

                text:

                    'The electric vehicle (EV) market has grown at a rate that few analysts predicted a decade ago. Global EV sales exceeded 10 million units in 2022, representing roughly 14 percent of all new car sales worldwide. Falling battery costs, government incentive programmes, and growing consumer environmental awareness have collectively accelerated adoption. However, the transition to electric mobility raises complex questions about infrastructure, supply chains, and the true environmental cost of manufacture and operation.\n\nThe most frequently cited environmental argument in favour of EVs is reduced tailpipe emissions. In dense urban environments, the absence of direct exhaust significantly improves local air quality and reduces health-related costs. Longer-term lifecycle analyses are more nuanced. The production of lithium-ion batteries is energy-intensive and relies on mining of lithium, cobalt, and nickel — materials associated with environmental degradation and, in some cases, poor labour conditions in mining regions. Estimates of the carbon payback period — the time an EV must be driven before its lower operational emissions offset the manufacturing carbon cost — range from one to four years depending on the electricity grid\'s carbon intensity.\n\nCharging infrastructure represents a major practical barrier. Urban areas with high residential density face challenges in providing adequate street-level charging. Apartment dwellers, who cannot install home chargers, rely entirely on public infrastructure that remains sparse in many cities. Rural areas face a different problem: longer distances between charging points create range anxiety, a documented driver concern that inhibits switching from combustion vehicles.\n\nSupply chain fragility became highly visible during the pandemic, when semiconductor shortages halted EV production lines at multiple manufacturers simultaneously. More strategically significant is the geographic concentration of battery mineral supply chains. Lithium is primarily extracted in Australia and South America; cobalt predominantly from the Democratic Republic of Congo. This concentration creates geopolitical dependencies that national governments are beginning to address through domestic processing facilities and alternative material research.\n\nGovernment policy has been decisive in shaping adoption rates. Norway, where EVs now account for over 80 percent of new car sales, achieved this through an exceptionally generous incentive package including VAT exemption, toll road access, and subsidised parking. Countries with more modest incentives have seen correspondingly slower transitions. Analysts note that as battery costs continue to fall towards price parity with internal combustion engines — projected by most estimates to occur before 2030 — policy incentives may become less necessary, although grid decarbonisation will remain essential to realising the full environmental benefit.',

                tips: [

                    'Track cause-effect language: "because", "as a result", "due to".',

                    'Passage 2 often contains data — scan for numbers and percentages.',

                    'Matching headings: identify the MAIN idea of each paragraph, not details.',

                ],

                questions: [

                    { number: 14, type: 'true_false', prompt: 'Global EV sales in 2022 represented more than 14 percent of all new car sales.', answer: 'FALSE', answerLine: 'Representing roughly 14 percent — not more than 14 percent.' },

                    { number: 15, type: 'fill_in_blank', prompt: 'The carbon payback period for EVs ranges from one to ___ years depending on grid carbon intensity.', answer: '4', answerLine: 'Range from one to four years depending on the electricity grid\'s carbon intensity.' },

                    { number: 16, type: 'mcq', prompt: 'What is "range anxiety" as described in the passage?', options: ['A. Fear of driving at high speed', 'B. Concern about distance between charging points', 'C. Worry about battery degradation'], answer: 'B', answerLine: 'Range anxiety — a documented driver concern about longer distances between charging points.' },

                    { number: 17, type: 'true_false', prompt: 'Apartment dwellers can easily install home charging points.', answer: 'FALSE', answerLine: 'Cannot install home chargers, relying entirely on public infrastructure.' },

                    { number: 18, type: 'fill_in_blank', prompt: 'Cobalt is predominantly mined in the Democratic Republic of ___.', answer: 'Congo', answerLine: 'Cobalt predominantly from the Democratic Republic of Congo.' },

                    { number: 19, type: 'mcq', prompt: 'What happened to EV production during the pandemic?', options: ['A. Sales increased dramatically', 'B. Government investment doubled', 'C. Semiconductor shortages halted production lines'], answer: 'C', answerLine: 'Semiconductor shortages halted EV production lines at multiple manufacturers simultaneously.' },

                    { number: 20, type: 'fill_in_blank', prompt: "In Norway, EVs account for over ___% of new car sales.", answer: '80', answerLine: 'Norway, where EVs now account for over 80 percent of new car sales.' },

                    { number: 21, type: 'true_false', prompt: 'Norway achieved high EV adoption through a modest subsidy programme.', answer: 'FALSE', answerLine: 'An exceptionally generous incentive package including VAT exemption, toll road access, and subsidised parking.' },

                    { number: 22, type: 'mcq', prompt: 'Price parity between EVs and combustion engines is projected to occur', options: ['A. After 2035', 'B. Before 2030', 'C. By 2025'], answer: 'B', answerLine: 'Projected by most estimates to occur before 2030.' },

                    { number: 23, type: 'true_false', prompt: 'The passage implies that policy incentives will be unnecessary once EVs reach price parity.', answer: 'NOT GIVEN', answerLine: 'Says incentives "may become less necessary" — not definitely unnecessary.' },

                    { number: 24, type: 'matching', prompt: 'Best heading: political and strategic risks in the minerals supply chain', answer: 'iv', answerLine: 'Geographic concentration creates geopolitical dependencies.' },

                    { number: 25, type: 'matching', prompt: 'Best heading: charging access problems for city and rural drivers', answer: 'iii', answerLine: 'Urban density and rural distances both create charging challenges.' },

                    { number: 26, type: 'fill_in_blank', prompt: 'To realise the full environmental benefit of EVs, ___ decarbonisation will remain essential.', answer: 'grid', answerLine: 'Grid decarbonisation will remain essential to realising the full environmental benefit.' },

                ],

            },

            {

                partNumber: 3,

                title: 'Passage 3: Artificial Intelligence in Modern Healthcare',

                text:

                    "Artificial intelligence is being applied across medicine at a pace that is forcing healthcare systems to revisit regulatory frameworks, professional roles, and ethical boundaries simultaneously. Applications range from radiology image analysis and drug discovery to administrative workflow automation and patient-facing chatbots. The promise is substantial: AI tools have demonstrated diagnostic accuracy comparable to or exceeding that of specialist clinicians in several narrow domains. The challenges, however, are equally significant.\n\nIn diagnostic imaging, deep learning algorithms trained on large labelled datasets have achieved impressive results. A widely publicised 2020 Nature Medicine study reported that a Google-developed AI system diagnosed breast cancer from mammograms with fewer false positives and fewer false negatives than the average radiologist. Similar systems have shown strong performance in diabetic retinopathy screening and skin lesion classification. Proponents argue that such tools can extend specialist expertise to underserved regions where trained radiologists are scarce.\n\nClinicians and regulators have raised several concerns. First, the quality of AI performance is highly dependent on the representativeness of training data. Systems trained predominantly on data from high-income countries may perform less reliably on patient populations from different genetic backgrounds or healthcare contexts. Second, the opacity of many deep learning models — the so-called 'black box' problem — makes it difficult for clinicians to understand or challenge an algorithmic recommendation. Third, questions of liability remain unresolved: if an AI-assisted diagnosis is incorrect, responsibility must be allocated between clinician, AI developer, and deploying institution.\n\nDrug discovery is an area where AI's transformative potential may be greatest. Traditional drug development cycles typically span 10-15 years from compound identification to regulatory approval, at a cost exceeding one billion dollars per approved drug. AI tools can significantly accelerate compound screening, identify drug repurposing opportunities, and predict molecular interactions. DeepMind's AlphaFold system, which accurately predicted the three-dimensional structure of virtually all known proteins, has been described by scientists as a fundamental breakthrough with implications extending across biology and medicine.\n\nPatient-facing AI applications raise distinct ethical concerns. Chatbots providing triage or mental health support operate in sensitive contexts where errors carry direct human costs. Regulators in the European Union and the United States have begun developing specific frameworks for medical AI, focusing on transparency, performance validation across demographic groups, and post-market surveillance. Critics argue that regulation has struggled to keep pace with deployment speed, creating a window in which inadequately validated tools may already be in widespread use.\n\nHealthcare professionals are broadly supportive of AI as a decision-support tool but resistant to models that position AI as a decision-making authority. Surveys consistently show that clinicians accept AI as a second opinion or screening aid, while opposing arrangements that reduce physician oversight. This professional consensus aligns with emerging regulatory guidance that medical AI systems should augment rather than replace clinical judgment — a principle that carries significant implications for how these technologies will ultimately be integrated into care pathways.",

                tips: [

                    'Long passage — use the question to locate the relevant paragraph first.',

                    'TRUE/FALSE requires exact match to the text.',

                    'Matching: paragraph topic headings should capture the main idea, not a detail.',

                ],

                questions: [

                    { number: 27, type: 'mcq', prompt: "The 2020 Nature Medicine study found that Google's AI system", options: ['A. Had equal accuracy to the best radiologist', 'B. Had fewer false positives and false negatives than the average radiologist', 'C. Was too slow for clinical use'], answer: 'B', answerLine: 'Fewer false positives and fewer false negatives than the average radiologist.' },

                    { number: 28, type: 'true_false', prompt: 'AI diagnostic tools are equally effective on all patient populations.', answer: 'FALSE', answerLine: 'Systems trained on high-income country data may perform less reliably on other populations.' },

                    { number: 29, type: 'fill_in_blank', prompt: "The difficulty in understanding why an AI system makes a decision is called the '___ box' problem.", answer: 'black', answerLine: "The opacity of many deep learning models — the 'black box' problem." },

                    { number: 30, type: 'true_false', prompt: 'Liability for AI-assisted diagnostic errors has been clearly resolved by current regulation.', answer: 'FALSE', answerLine: 'Questions of liability remain unresolved.' },

                    { number: 31, type: 'fill_in_blank', prompt: 'Traditional drug development from compound identification to approval typically takes ___ to 15 years.', answer: '10', answerLine: 'Typically span 10-15 years from compound identification to regulatory approval.' },

                    { number: 32, type: 'mcq', prompt: "What was significant about DeepMind's AlphaFold system?", options: ['A. It designed a new antibiotic', 'B. It accurately predicted the 3D structure of virtually all known proteins', 'C. It reduced drug trial costs by 50%'], answer: 'B', answerLine: 'Accurately predicted the three-dimensional structure of virtually all known proteins.' },

                    { number: 33, type: 'true_false', prompt: 'The EU and US have developed specific regulatory frameworks for medical AI.', answer: 'TRUE', answerLine: 'Regulators in the EU and the US have begun developing specific frameworks for medical AI.' },

                    { number: 34, type: 'fill_in_blank', prompt: 'Critics argue that regulation has failed to keep pace with ___ speed.', answer: 'deployment', answerLine: 'Regulation has struggled to keep pace with deployment speed.' },

                    { number: 35, type: 'mcq', prompt: 'Clinician surveys show that doctors accept AI as', options: ['A. A full replacement for diagnosis', 'B. A decision-support tool or second opinion', 'C. Useful only for administrative tasks'], answer: 'B', answerLine: 'Clinicians accept AI as a second opinion or screening aid.' },

                    { number: 36, type: 'true_false', prompt: 'The passage states that AI should replace rather than support clinical judgment.', answer: 'FALSE', answerLine: 'Medical AI systems should augment rather than replace clinical judgment.' },

                    { number: 37, type: 'fill_in_blank', prompt: 'AI tools in drug discovery can predict ___ interactions and identify repurposing opportunities.', answer: 'molecular', answerLine: 'Predict molecular interactions.' },

                    { number: 38, type: 'matching', prompt: 'Best heading: concerns about chatbots and mental health applications', answer: 'v', answerLine: 'Chatbots in sensitive contexts where errors carry direct human costs.' },

                    { number: 39, type: 'matching', prompt: 'Best heading: AI impact on the length and cost of drug development', answer: 'iv', answerLine: 'AI can accelerate compound screening, repurposing, and molecular prediction.' },

                    { number: 40, type: 'matching', prompt: 'Best heading: how training data quality limits diagnostic AI', answer: 'iii', answerLine: 'Performance is highly dependent on the representativeness of training data.' },

                ],

            },

        ],

    },



    Writing: {

        title: 'Full Mock Test 3 - Writing',

        introduction:

            'Task 1: 20 minutes, minimum 150 words. Task 2: 40 minutes, minimum 250 words.',

        audioUrl: null,

        examConfig: IELTS_MODULE_BLUEPRINT.Writing,

        parts: [

            {

                partNumber: 1,

                title: 'Task 1: Line Graph — CO₂ Emissions Per Capita',

                text:

                    'The line graph below shows the average carbon dioxide (CO₂) emissions per person (in tonnes) in five countries — Australia, China, Germany, India, and the United States — from 1990 to 2020.\n\nData Summary (tonnes CO₂ per person):\nAustralia: 15.8 (1990) → 14.9 (2000) → 16.1 (2010) → 14.5 (2020)\nChina: 2.1 (1990) → 2.7 (2000) → 5.8 (2010) → 7.6 (2020)\nGermany: 12.7 (1990) → 10.3 (2000) → 9.1 (2010) → 7.9 (2020)\nIndia: 0.8 (1990) → 1.0 (2000) → 1.5 (2010) → 1.9 (2020)\nUSA: 19.2 (1990) → 20.0 (2000) → 17.0 (2010) → 14.2 (2020)\n\nSummarise the main features and make comparisons where relevant. Write at least 150 words.',

                tips: [

                    'Identify the overall trend for each country before writing.',

                    'Note countries that increased versus those that decreased.',

                    'China and India are particularly contrasting — use comparison language.',

                ],

                questions: [

                    { number: 1, type: 'fill_in_blank', prompt: 'Planning check: Which country showed the largest increase in CO₂ per capita?', answer: 'China', answerLine: 'China rose from 2.1 to 7.6 — the largest absolute increase.' },

                    { number: 2, type: 'fill_in_blank', prompt: 'Overview check: Which country had the highest emissions throughout the period?', answer: 'USA', answerLine: 'USA had the highest per-capita emissions throughout, peaking at 20.0 in 2000.' },

                ],

            },

            {

                partNumber: 2,

                title: 'Task 2: Discussion Essay — Teaching Values: Parents or Schools?',

                text:

                    'Some people think that parents should be responsible for teaching children how to be good members of society. Others believe that school is the right place to learn this. Discuss both views and give your own opinion.\n\nWrite at least 250 words. Give reasons for your answer and include any relevant examples from your own knowledge or experience.',

                tips: [

                    'Discuss BOTH views — do not ignore one side.',

                    'State your own view clearly in the introduction and conclusion.',

                    'Use specific examples: family environments, school civic education, community service.',

                ],

                questions: [

                    { number: 3, type: 'fill_in_blank', prompt: 'Planning: What can parents teach that schools cannot easily replicate?', answer: 'open', answerLine: 'Examples: empathy, daily moral habits, cultural values, religious practice.' },

                    { number: 4, type: 'fill_in_blank', prompt: 'Planning: What can schools teach about civic society that families may not cover?', answer: 'open', answerLine: 'Examples: national laws, democratic participation, tolerance of diversity, conflict resolution.' },

                ],

            },

        ],

    },



    Speaking: {

        title: 'Full Mock Test 3 - Speaking',

        introduction:

            'Examiner-style speaking test: Part 1 (4–5 min), Part 2 (3–4 min), Part 3 (4–5 min).',

        audioUrl: null,

        examConfig: IELTS_MODULE_BLUEPRINT.Speaking,

        parts: [

            {

                partNumber: 1,

                title: 'Part 1: Introductory Interview',

                text:

                    'The examiner will ask about your daily life, preferences, and habits. Answer in 2–4 sentences. Use variety in your vocabulary and grammar structures.',

                tips: [

                    'Start answers directly — do not repeat the question.',

                    'Use past/present/future tenses naturally.',

                    'Avoid very short answers: always add one reason or example.',

                ],

                questions: [

                    { number: 1, type: 'fill_in_blank', prompt: 'What kinds of food do you enjoy most, and do you prefer cooking at home or eating out?', answer: 'open', answerLine: 'Personal response.' },

                    { number: 2, type: 'fill_in_blank', prompt: 'How important is sleep to you, and do you have any habits to help you sleep well?', answer: 'open', answerLine: 'Personal response.' },

                    { number: 3, type: 'fill_in_blank', prompt: 'Have you always lived in the same city or town, or have you moved around?', answer: 'open', answerLine: 'Personal response.' },

                    { number: 4, type: 'fill_in_blank', prompt: 'Do you prefer studying alone or with other people? Why?', answer: 'open', answerLine: 'Personal response.' },

                    { number: 5, type: 'fill_in_blank', prompt: 'What types of films or series do you enjoy watching?', answer: 'open', answerLine: 'Personal response.' },

                ],

            },

            {

                partNumber: 2,

                title: 'Part 2: Cue Card',

                text:

                    'Describe a journey or trip that you remember well.\nYou should say:\n- where you went and when\n- who you travelled with\n- what happened during the journey\nand explain why you remember it so clearly.\n\nYou have 1 minute to prepare notes and up to 2 minutes to speak.',

                tips: [

                    'Organise your 4 bullet points as 4 sections of your talk.',

                    'Use specific sensory details — weather, sounds, sights — to make the story vivid.',

                    'The "why you remember it" part should show depth of reflection.',

                ],

                questions: [

                    { number: 6, type: 'fill_in_blank', prompt: 'Preparation keyword 1 (destination / when)', answer: 'open', answerLine: 'Self-note.' },

                    { number: 7, type: 'fill_in_blank', prompt: 'Preparation keyword 2 (who you went with)', answer: 'open', answerLine: 'Self-note.' },

                    { number: 8, type: 'fill_in_blank', prompt: 'Preparation keyword 3 (a specific moment or event)', answer: 'open', answerLine: 'Self-note.' },

                ],

            },

            {

                partNumber: 3,

                title: 'Part 3: Discussion — Travel and Cultural Impact',

                text:

                    'The examiner will ask broader questions about travel, tourism, and its effects on people and societies. Extend each answer with a reason, example, and consequence.',

                tips: [

                    'Use speculative language: "I think", "It could be argued that", "In my experience".',

                    'Compare countries or generations where relevant.',

                    'Show balance: acknowledge counterarguments before giving your view.',

                ],

                questions: [

                    { number: 9, type: 'fill_in_blank', prompt: 'Do you think international travel makes people more open-minded? Why or why not?', answer: 'open', answerLine: 'Discussion question.' },

                    { number: 10, type: 'fill_in_blank', prompt: 'What are the negative effects of large-scale tourism on local communities?', answer: 'open', answerLine: 'Discussion question.' },

                    { number: 11, type: 'fill_in_blank', prompt: 'How might travel change in the next 20 years due to environmental concerns?', answer: 'open', answerLine: 'Discussion question.' },

                    { number: 12, type: 'fill_in_blank', prompt: 'Should governments limit the number of tourists visiting culturally sensitive sites?', answer: 'open', answerLine: 'Discussion question.' },

                ],

            },

        ],

    },

} as const;



// ─── Lookup helper ───────────────────────────────────────────────────────────



const MOCK_TESTS: Record<number, typeof MOCK_TEST_2 | typeof MOCK_TEST_3> = {

    2: MOCK_TEST_2,

    3: MOCK_TEST_3,

};



export function getMockTestModule(

    mockNumber: number,

    module: 'Listening' | 'Reading' | 'Writing' | 'Speaking',

) {

    const test = MOCK_TESTS[mockNumber];

    if (!test) return null;

    return test[module];

}

