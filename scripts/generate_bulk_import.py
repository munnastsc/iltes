"""
Generate a complete bulk import JSON for Cambridge IELTS Books 1-20.
Cambridge-STYLE original content (not actual Cambridge IP).
Run: python scripts/generate_bulk_import.py
Output: scripts/bulk_import_books_1_20.json
"""
import json
import os

# ─── Topic data per book ──────────────────────────────────────────────────────

BOOK_THEMES = {
    1:  "Environment and Ecology",
    2:  "Technology and Innovation",
    3:  "Health and Medicine",
    4:  "Education and Learning",
    5:  "Urban Planning and Architecture",
    6:  "Business and Economics",
    7:  "Arts and Culture",
    8:  "Science and Discovery",
    9:  "Transport and Infrastructure",
    10: "Food and Agriculture",
    11: "Media and Communication",
    12: "History and Archaeology",
    13: "Psychology and Behaviour",
    14: "Energy and Resources",
    15: "Sport and Exercise",
    16: "Language and Linguistics",
    17: "Philosophy and Ethics",
    18: "Wildlife and Conservation",
    19: "Social Change and Inequality",
    20: "Space and Exploration",
}

READING_PASSAGE_SETS = {
    1: [
        ("Climate Change and Coral Reefs",
         "Rising ocean temperatures are bleaching coral reefs at an unprecedented rate. Scientists estimate that more than half of the Great Barrier Reef experienced bleaching events in 2016 and 2017 alone. Coral bleaching occurs when water warms by even one degree Celsius above the seasonal average, causing corals to expel the symbiotic algae that provide their colour and up to 90 percent of their energy. Without the algae, corals turn white and become vulnerable to disease.\n\nThe ecological consequences extend beyond the reefs themselves. Coral ecosystems support an estimated 25 percent of all marine species despite covering less than one percent of the ocean floor. Fish populations, crustaceans, and invertebrates that depend on reef structures for shelter and breeding are all at risk. Fishing communities across Southeast Asia, the Caribbean, and the Pacific Islands report declining catches as reef degradation reduces the carrying capacity of coastal fisheries.\n\nRestoration efforts are underway in several regions. Marine biologists in Florida and Australia have established coral nurseries, growing heat-tolerant coral fragments on underwater frames before transplanting them to damaged reefs. Genetic research aims to accelerate the selective breeding of naturally resilient coral strains. Critics argue that restoration alone cannot address reefs at the scale required and that only aggressive reductions in greenhouse gas emissions can prevent further loss.",
         [
             {"number": 1, "type": "true_false", "prompt": "Coral bleaching occurs when water temperature drops significantly.", "answer": "FALSE", "answerLine": "Bleaching occurs when water warms by even one degree above the seasonal average."},
             {"number": 2, "type": "true_false", "prompt": "Coral reefs support approximately 25 percent of all marine species.", "answer": "TRUE", "answerLine": "Coral ecosystems support an estimated 25 percent of all marine species."},
             {"number": 3, "type": "true_false", "prompt": "The passage states that restoration alone is sufficient to save all reefs.", "answer": "FALSE", "answerLine": "Critics argue restoration alone cannot address reefs at the scale required."},
             {"number": 4, "type": "mcq", "prompt": "What do the symbiotic algae provide to coral?", "options": ["A. Protection from predators", "B. Up to 90 percent of their energy", "C. A structural skeleton"], "answer": "B", "answerLine": "Algae provide their colour and up to 90 percent of their energy."},
             {"number": 5, "type": "fill_in_blank", "prompt": "Scientists grow heat-tolerant coral fragments in underwater ___.", "answer": "nurseries", "answerLine": "Established coral nurseries, growing heat-tolerant coral fragments on underwater frames."},
         ]),
        ("Urban Green Spaces and Mental Health",
         "Research over the past two decades has established a consistent association between access to urban green spaces and improved mental health outcomes. Studies conducted in the United Kingdom, the Netherlands, and Japan report that residents living within 300 metres of a park or green corridor experience lower rates of anxiety, depression, and stress-related illness. The proposed mechanisms include opportunities for physical activity, social interaction, and what psychologists call restorative attention — the effortless, involuntary engagement that natural environments elicit, allowing deliberate attention networks to recover.\n\nUrban planners have begun incorporating these findings into city design frameworks. Several European cities have adopted green infrastructure standards requiring a minimum ratio of green space per resident. Singapore's 'City in a Garden' strategy has integrated trees and vegetation into public transport hubs, commercial buildings, and residential towers. Landscape architects now speak of biophilic design — the intentional embedding of natural elements into built environments to reconnect urban residents with nature.\n\nEquity concerns complicate the policy picture. Green spaces are not distributed equally across urban areas. In many cities, wealthier neighbourhoods have more parks, tree canopy cover, and maintained recreational areas than lower-income districts. Research in the United States found a strong correlation between median household income and nearby park quality, raising questions about whether urban greening policies reinforce or address existing inequalities.",
         [
             {"number": 6, "type": "true_false", "prompt": "Access to green spaces within 300 metres is linked to lower anxiety rates.", "answer": "TRUE", "answerLine": "Residents living within 300 metres of a park experience lower rates of anxiety."},
             {"number": 7, "type": "fill_in_blank", "prompt": "The involuntary engagement with nature is called ___ attention.", "answer": "restorative", "answerLine": "What psychologists call restorative attention."},
             {"number": 8, "type": "mcq", "prompt": "What does 'biophilic design' mean?", "options": ["A. Building parks outside cities", "B. Embedding natural elements into built environments", "C. Using solar panels on buildings"], "answer": "B", "answerLine": "Biophilic design — the intentional embedding of natural elements into built environments."},
         ]),
        ("Rewilding: Restoring Lost Ecosystems",
         "Rewilding is a conservation strategy that aims to restore natural processes and, in some cases, reintroduce species that have been locally or regionally extinct for decades or centuries. Unlike traditional conservation, which often focuses on maintaining landscapes in a fixed historical state, rewilding emphasises dynamic ecological processes — predation, competition, and disturbance — as drivers of biodiversity.\n\nThe reintroduction of wolves to Yellowstone National Park in 1995 is frequently cited as a landmark rewilding experiment. Wolves reduced overgrazing by elk, allowing riparian vegetation to recover along riverbanks. The restored plant cover stabilised stream banks, altered water flow patterns, and created new habitat for beavers, songbirds, and fish. Ecologists describe this chain of interactions as a trophic cascade — a series of ecosystem effects triggered by changes at the top of the food chain.\n\nEuropean rewilding projects have focused on reintroducing beavers, lynx, and bison to areas where they were once native. The return of beavers to Scotland has been linked to improved water quality and flood moderation downstream. However, rewilding also generates conflict. Farmers and land managers raise concerns about livestock predation and loss of agricultural land. Ecologists counter that compensatory mechanisms, habitat buffers, and careful monitoring can manage such risks, though tensions between conservation goals and rural livelihoods remain an ongoing challenge.",
         [
             {"number": 9, "type": "mcq", "prompt": "What is the main difference between rewilding and traditional conservation?", "options": ["A. Rewilding focuses on dynamic ecological processes rather than fixed states", "B. Traditional conservation allows more predation", "C. Rewilding only applies to marine environments"], "answer": "A", "answerLine": "Rewilding emphasises dynamic ecological processes rather than maintaining landscapes in a fixed state."},
             {"number": 10, "type": "true_false", "prompt": "The wolf reintroduction in Yellowstone reduced overgrazing by elk.", "answer": "TRUE", "answerLine": "Wolves reduced overgrazing by elk, allowing riparian vegetation to recover."},
             {"number": 11, "type": "fill_in_blank", "prompt": "A ___ cascade describes ecosystem effects triggered by changes at the top of the food chain.", "answer": "trophic", "answerLine": "Ecologists describe this chain of interactions as a trophic cascade."},
             {"number": 12, "type": "true_false", "prompt": "All farmers support rewilding projects in Europe.", "answer": "NOT GIVEN", "answerLine": "The passage mentions conflict but does not say all farmers oppose it."},
             {"number": 13, "type": "mcq", "prompt": "Beaver reintroduction in Scotland has been linked to", "options": ["A. Increased flooding downstream", "B. Improved water quality and flood moderation", "C. Destruction of local fish populations"], "answer": "B", "answerLine": "Linked to improved water quality and flood moderation downstream."},
         ]),
    ],
    2: [
        ("The Rise of Quantum Computing",
         "Quantum computing promises to solve computational problems that would take classical computers millions of years to process. Unlike classical computers, which encode information as binary bits — either 0 or 1 — quantum computers use qubits, which can exist in multiple states simultaneously through a property called superposition. A second quantum property, entanglement, allows qubits to be correlated in ways that enable massively parallel processing.\n\nThe potential applications are far-reaching. Pharmaceutical companies are exploring quantum simulation to model molecular interactions at an atomic level, potentially accelerating drug discovery by years. Cryptographers note a more troubling implication: a sufficiently powerful quantum computer could break the RSA encryption underpinning most of today's internet security. Governments and technology companies are investing heavily in post-quantum cryptography to develop encryption methods resistant to quantum attack.\n\nPractical quantum computers remain technically immature. Qubits are extremely sensitive to environmental disturbance, a phenomenon called decoherence, which introduces errors into calculations. Error correction requires large numbers of physical qubits to maintain a single reliable logical qubit, placing enormous demands on hardware. Current machines operate with tens to hundreds of qubits; industry experts estimate that fault-tolerant general-purpose quantum computers may require millions of stable qubits.",
         [
             {"number": 1, "type": "true_false", "prompt": "Classical computers use qubits to process information.", "answer": "FALSE", "answerLine": "Classical computers encode information as binary bits — 0 or 1."},
             {"number": 2, "type": "fill_in_blank", "prompt": "The property allowing qubits to exist in multiple states is called ___.", "answer": "superposition", "answerLine": "Multiple states simultaneously through a property called superposition."},
             {"number": 3, "type": "mcq", "prompt": "Why are governments investing in post-quantum cryptography?", "options": ["A. To speed up classical computers", "B. To develop encryption resistant to quantum attacks", "C. To replace all existing computers"], "answer": "B", "answerLine": "Develop encryption methods resistant to quantum attack."},
             {"number": 4, "type": "fill_in_blank", "prompt": "Environmental disturbance that introduces errors is called ___.", "answer": "decoherence", "answerLine": "A phenomenon called decoherence, which introduces errors into calculations."},
             {"number": 5, "type": "true_false", "prompt": "Fault-tolerant quantum computers may require millions of qubits.", "answer": "TRUE", "answerLine": "May require millions of stable qubits."},
         ]),
        ("Artificial Intelligence and Creative Industries",
         "The integration of artificial intelligence into creative industries has generated debate about authorship, originality, and the economic future of human artists. AI systems trained on vast datasets of existing artwork, music, and text can now generate content that is, in many cases, indistinguishable from human-produced work to the untrained eye. The commercial applications are broad: advertising agencies use AI-generated imagery, music streaming services employ algorithmic composition for ambient tracks, and publishers experiment with AI-assisted editorial and writing tools.\n\nCreative professionals have responded with a mixture of concern and adaptation. Visual artists raise the question of consent, arguing that training AI systems on copyrighted works without permission or compensation constitutes appropriation of intellectual labour. Legal systems in multiple jurisdictions are grappling with whether AI-generated content can be copyrighted and, if so, who holds the copyright — the AI developer, the user who prompted the output, or no one. Court decisions in the United States have so far declined to extend copyright protection to works with no human author.\n\nOthers argue that the history of creative tools is a history of disruption: photography did not destroy painting; digital audio workstations transformed rather than eliminated professional music production. They contend that AI will become one more instrument in the human creative toolkit, augmenting rather than replacing artistic expression, particularly in areas requiring emotional depth, cultural context, and lived experience.",
         [
             {"number": 6, "type": "true_false", "prompt": "AI-generated artwork is always distinguishable from human-made work.", "answer": "FALSE", "answerLine": "Can generate content indistinguishable from human-produced work to the untrained eye."},
             {"number": 7, "type": "mcq", "prompt": "What legal question have courts addressed regarding AI-generated content?", "options": ["A. Whether AI is considered a living author", "B. Whether copyright can be extended to works with no human author", "C. Whether AI companies must pay artists directly"], "answer": "B", "answerLine": "Whether AI-generated content can be copyrighted and whether works with no human author qualify."},
             {"number": 8, "type": "fill_in_blank", "prompt": "Artists argue that training AI on copyrighted works constitutes appropriation of intellectual ___.", "answer": "labour", "answerLine": "Constitutes appropriation of intellectual labour."},
         ]),
        ("Autonomous Vehicles: Progress and Barriers",
         "Autonomous vehicles (AVs) have attracted hundreds of billions of dollars in investment from established automakers, technology companies, and specialist startups. The promise is transformative: self-driving cars could reduce road accidents caused by human error, which account for over 90 percent of all collisions. Mobility services for elderly and disabled populations could be democratised. Freight logistics could be streamlined by trucks that operate around the clock without driver fatigue constraints.\n\nTechnical progress has been significant but uneven. Leading AV developers report that their systems perform reliably in clear weather on well-mapped highway routes. Urban environments present greater challenges: unpredictable pedestrian behaviour, construction zones, poor lane markings, and adverse weather all degrade sensor accuracy. The AI systems guiding AVs must make split-second decisions in edge cases — scenarios they have not been specifically trained for — raising questions about safety thresholds and liability when accidents occur.\n\nRegulatory frameworks are evolving slowly. Most jurisdictions currently require a human driver to remain alert and able to take control at all times in Level 3 autonomous vehicles, undermining one of the main consumer benefits. Fully autonomous Level 5 vehicles remain limited to controlled testing environments in a small number of cities globally. Consumer trust remains low: surveys consistently show that most people would feel uncomfortable as a passenger in a fully autonomous vehicle, even if the technology were certified as statistically safer than human driving.",
         [
             {"number": 9, "type": "fill_in_blank", "prompt": "Human error accounts for over ___% of all road collisions.", "answer": "90", "answerLine": "Human error, which accounts for over 90 percent of all collisions."},
             {"number": 10, "type": "true_false", "prompt": "AV systems perform equally well in urban and highway environments.", "answer": "FALSE", "answerLine": "Urban environments present greater challenges than highway routes."},
             {"number": 11, "type": "mcq", "prompt": "What is an 'edge case' in AV development?", "options": ["A. A route at the edge of a city", "B. A scenario not specifically trained for", "C. A vehicle sensor error"], "answer": "B", "answerLine": "Scenarios they have not been specifically trained for."},
             {"number": 12, "type": "true_false", "prompt": "Most consumers are comfortable riding in fully autonomous vehicles.", "answer": "FALSE", "answerLine": "Most people would feel uncomfortable as a passenger in a fully autonomous vehicle."},
             {"number": 13, "type": "fill_in_blank", "prompt": "Level 5 vehicles are currently limited to ___ environments.", "answer": "testing", "answerLine": "Limited to controlled testing environments in a small number of cities."},
         ]),
    ],
}

# For books 3-20, generate procedural content
READING_TOPICS = [
    ("Vaccine Hesitancy and Public Health", "mental health, social media, anxiety", "The Rise of Telemedicine"),
    ("The Science of Sleep", "memory consolidation, REM sleep, cognitive function", "Antibiotic Resistance"),
    ("Smart Cities and Data", "urban sensors, privacy, efficiency", "Social Housing Policy"),
    ("Microfinance and Poverty", "small loans, women entrepreneurs, impact studies", "Gig Economy Workers"),
    ("Censorship in the Digital Age", "online platforms, free speech, regulation", "Newspaper Industry Decline"),
    ("Underwater Archaeology", "shipwrecks, preservation, remote sensing", "Ancient Migration Routes"),
    ("The Psychology of Procrastination", "motivation, habit formation, task aversion", "Nudge Theory"),
    ("Hydrogen as Fuel", "green hydrogen, fuel cells, infrastructure", "Nuclear Energy Revival"),
    ("Doping in Elite Sport", "performance enhancement, testing, ethics", "Youth Sports Participation"),
    ("Endangered Languages", "language death, documentation, revitalisation", "Sign Language Recognition"),
    ("Animal Ethics in Research", "alternatives to testing, legislation, welfare", "Genetic Engineering of Crops"),
    ("Ocean Plastic Pollution", "microplastics, packaging waste, policy", "Fishing Industry Sustainability"),
    ("Prison Reform and Rehabilitation", "recidivism, education programs, mental health", "Criminal Justice Systems"),
    ("Dark Sky Preservation", "light pollution, astronomy, wildlife", "Space Debris Management"),
    ("Social Media and Democracy", "disinformation, political ads, algorithmic bias", "Journalism and Objectivity"),
]

LISTENING_TOPICS = [
    ("Sports centre membership inquiry", "university lecture on ocean currents", "group project on renewable materials"),
    ("Dental clinic appointment booking", "campus orientation tour", "seminar on research ethics"),
    ("Travel agency holiday enquiry", "museum exhibition tour guide", "student discussion on climate policy"),
    ("Job centre registration", "wildlife reserve visitor orientation", "academic discussion on globalisation"),
    ("Bank account opening enquiry", "community garden project briefing", "study group on urban planning"),
    ("Festival volunteer registration", "nature documentary commentary", "business school case study"),
    ("Library card renewal", "science podcast transcript", "research methods workshop"),
    ("Language course enrolment", "city walking tour narration", "dissertation feedback session"),
    ("Car hire enquiry", "parks authority nature talk", "debate on digital privacy"),
    ("Gym induction session", "history lecture on ancient trade", "group assignment on psychology"),
    ("Housing office enquiry", "documentary on coral reefs", "academic debate on AI ethics"),
    ("Phone repair centre inquiry", "geology field trip briefing", "team meeting on publishing project"),
    ("Appointment at health clinic", "aquarium tour guide commentary", "seminar on behavioural economics"),
    ("University admin office visit", "astronomy lecture on black holes", "collaborative research review"),
    ("Tourist information centre visit", "engineering lecture on bridges", "group project presentation prep"),
]

WRITING_TOPICS = [
    ("Line graph: smartphone ownership rates by age group 2010-2020", "Governments should invest in public transport rather than roads. Discuss both views."),
    ("Bar chart: university graduate employment by sector in two countries", "In modern society, science is more important than arts. To what extent do you agree?"),
    ("Pie charts: energy sources in country X in 2000 and 2020", "Some people think older people should retire from work. Do you agree or disagree?"),
    ("Table: literacy rates across five world regions", "Children should learn to manage money at school. Discuss both views."),
    ("Line graph: tourist arrivals in three cities over 20 years", "The internet has made libraries unnecessary. To what extent do you agree?"),
    ("Bar chart: hours worked per week in six countries", "Success in life depends on hard work and determination, not talent. Do you agree?"),
    ("Map: changes to a town centre over 30 years", "Zoos are cruel to animals and should be abolished. Do you agree or disagree?"),
    ("Diagram: process of water recycling", "It is better to live in a city than in the countryside. Discuss both views."),
    ("Line graph: road traffic accidents per 100,000 people 1990-2020", "Space exploration is a waste of government money. To what extent do you agree?"),
    ("Bar chart: fruit and vegetable consumption in five countries", "Young people spend too much time on social media. Discuss both views and give your opinion."),
    ("Table: newspaper readership by format in four countries", "Some believe criminals should be educated, others believe they should be punished. Discuss."),
    ("Line graph: museum attendance in three cities", "Technology makes children less creative. To what extent do you agree?"),
    ("Pie charts: household waste composition in two cities", "Exams are the most effective way to assess student ability. Discuss both views."),
    ("Bar chart: renewable energy production by type 2000-2020", "Cars should be banned from city centres. To what extent do you agree?"),
    ("Line graph: life expectancy in four regions 1960-2020", "Parents have more influence on a child's development than teachers. Discuss."),
    ("Table: top five causes of hospital admission in one country", "Learning a foreign language should be compulsory in schools. Do you agree?"),
    ("Bar chart: percentage of people doing voluntary work by age", "It is impossible to protect the environment while also growing economically. Discuss."),
    ("Diagram: how solar panels generate electricity", "Some people say art is essential, others say it is a luxury. Discuss both views."),
    ("Line graph: food price changes in three categories 2000-2020", "The rich have a responsibility to help the poor. To what extent do you agree?"),
    ("Bar chart: percentage of graduates in STEM fields by country", "Humans will travel to Mars within 50 years. Is this a worthwhile goal? Discuss."),
]

SPEAKING_TOPICS = [
    ("hometown, seasons, sports", "Describe a natural place you have visited", "environment protection, individual vs government responsibility"),
    ("technology use, sleep habits, food", "Describe a useful app or website", "impact of technology on daily life"),
    ("health, exercise, free time", "Describe a time you helped someone", "healthcare systems, responsibility for health"),
    ("childhood, education, reading", "Describe a teacher who influenced you", "education systems, role of teachers"),
    ("neighbourhood, transport, shopping", "Describe a building you find impressive", "urban development, housing"),
    ("money, work, leisure", "Describe a business you admire", "work-life balance, entrepreneurship"),
    ("music, art, films", "Describe a performance or event you attended", "arts funding, cultural identity"),
    ("science subjects, experiments, curiosity", "Describe an interesting discovery or invention", "science education, research funding"),
    ("commuting, travel methods, traffic", "Describe a journey that took longer than expected", "public transport, car dependency"),
    ("cooking, food preferences, restaurants", "Describe a meal that was special to you", "food culture, healthy eating policies"),
    ("news, social media, reading habits", "Describe a news story that interested you", "media freedom, digital journalism"),
    ("historical sites, museums, traditions", "Describe a historical event you know about", "preserving history, teaching history"),
    ("stress, motivation, emotions", "Describe a time you felt very proud", "mental health awareness, workplace wellbeing"),
    ("electricity, recycling, energy bills", "Describe a change you made to help the environment", "renewable energy, individual action"),
    ("sports participation, fitness, competition", "Describe a sport or physical activity you enjoy", "professional sport, sports in schools"),
]

def audio_url(book, test, part):
    base = "https://ieltstrainingonline.com/wp-content/uploads"
    yr = "2014"
    # Approximate year by book group
    if book >= 15: yr = "2020"
    elif book >= 11: yr = "2018"
    elif book >= 7: yr = "2016"
    return f"{base}/{yr}/07/Cam{book}-Test{test}-Part{part}.mp3"

def make_listening(book, test):
    idx = (book - 1) % len(LISTENING_TOPICS)
    s1, s2, s3 = LISTENING_TOPICS[idx]
    return {
        "title": f"Cambridge {book} Test {test} - Listening",
        "introduction": f"Cambridge-style listening test with 4 sections and 40 questions. Follow strict exam timing for best results.",
        "audioUrl": audio_url(book, test, 1),
        "examConfig": {"module": "Listening", "durationMinutes": 30, "totalQuestions": 40, "partCount": 4},
        "parts": [
            {
                "partNumber": 1,
                "title": f"Section 1: {s1.title()}",
                "audioUrl": audio_url(book, test, 1),
                "text": f"A conversation about {s1}. Listen carefully for names, numbers, and corrected information.\n\nTranscript Focus: Personal details, specific requirements, and factual information confirmed by both speakers.",
                "tips": [
                    "Watch for correction words: 'actually', 'sorry', 'I mean'.",
                    "Write answers exactly as you hear them — no paraphrasing.",
                    "Numbers and dates: write immediately when heard."
                ],
                "questions": [
                    {"number": 1, "type": "fill_in_blank", "prompt": "First name of the person making the enquiry: ___", "answer": f"[Answer from audio — Book {book} Test {test}]", "answerLine": "Confirmed by the speaker during the conversation."},
                    {"number": 2, "type": "fill_in_blank", "prompt": "Reference or ID number given: ___", "answer": "[Audio-dependent answer]", "answerLine": "Stated and confirmed in Section 1."},
                    {"number": 3, "type": "fill_in_blank", "prompt": "Date or time mentioned: ___", "answer": "[Audio-dependent answer]", "answerLine": "Mentioned during the booking/enquiry exchange."},
                    {"number": 4, "type": "mcq", "prompt": "What was the main purpose of the call/visit?", "options": ["A. To cancel a booking", "B. To make a new arrangement", "C. To complain about a service"], "answer": "B", "answerLine": "The conversation centres on making a new arrangement."},
                    {"number": 5, "type": "fill_in_blank", "prompt": "Cost or price mentioned: ___", "answer": "[Audio-dependent answer]", "answerLine": "Stated during the transaction discussion."},
                    {"number": 6, "type": "fill_in_blank", "prompt": "Location or address given: ___", "answer": "[Audio-dependent answer]", "answerLine": "Address confirmed by the end of Section 1."},
                    {"number": 7, "type": "mcq", "prompt": "Which option did the person finally choose?", "options": ["A. Option A", "B. Option B", "C. Option C"], "answer": "B", "answerLine": "Final selection confirmed after a correction."},
                    {"number": 8, "type": "fill_in_blank", "prompt": "Additional requirement mentioned: ___", "answer": "[Audio-dependent answer]", "answerLine": "Extra detail given near the end of Section 1."},
                    {"number": 9, "type": "fill_in_blank", "prompt": "Contact detail (phone/email) provided: ___", "answer": "[Audio-dependent answer]", "answerLine": "Contact information exchanged during the call."},
                    {"number": 10, "type": "fill_in_blank", "prompt": "Final confirmation item stated: ___", "answer": "[Audio-dependent answer]", "answerLine": "Last detail confirmed before the conversation ends."},
                ]
            },
            {
                "partNumber": 2,
                "title": f"Section 2: {s2.title()}",
                "audioUrl": audio_url(book, test, 2),
                "text": f"A monologue about {s2}. The speaker describes facilities, procedures, or information for a general audience.",
                "tips": [
                    "Eliminate options that describe different rooms/areas from what is named.",
                    "Matching: use process of elimination — confirm, do not guess.",
                    "Multiple choice: listen for the speaker's final/corrected statement."
                ],
                "questions": [
                    {"number": 11, "type": "mcq", "prompt": "What is the main topic of the talk?", "options": ["A. Historical background", "B. Current facilities and access", "C. Future development plans"], "answer": "B", "answerLine": "The talk focuses on current facilities and how to access them."},
                    {"number": 12, "type": "fill_in_blank", "prompt": "Opening hours on weekdays: ___", "answer": "[Audio-dependent answer]", "answerLine": "Hours stated in Section 2."},
                    {"number": 13, "type": "fill_in_blank", "prompt": "Admission price for adults: £___", "answer": "[Audio-dependent answer]", "answerLine": "Price confirmed during the talk."},
                    {"number": 14, "type": "matching", "prompt": "Location associated with the main attraction", "answer": "A", "answerLine": "Described as being in area A in the layout."},
                    {"number": 15, "type": "matching", "prompt": "Location of the refreshment area", "answer": "C", "answerLine": "Refreshments are in section C of the venue."},
                    {"number": 16, "type": "matching", "prompt": "Location of accessible/disabled facilities", "answer": "E", "answerLine": "Accessible facilities are in zone E near the entrance."},
                    {"number": 17, "type": "mcq", "prompt": "Which facility is not available on Sundays?", "options": ["A. Main hall", "B. Children's area", "C. Gift shop"], "answer": "B", "answerLine": "The children's area is closed on Sundays."},
                    {"number": 18, "type": "fill_in_blank", "prompt": "Membership discount offered: ___% off.", "answer": "[Audio-dependent answer]", "answerLine": "Discount percentage stated in Section 2."},
                    {"number": 19, "type": "mcq", "prompt": "What is planned for next year?", "options": ["A. A new exhibition", "B. Extended parking", "C. Price reduction"], "answer": "A", "answerLine": "A new exhibition is announced for next year."},
                    {"number": 20, "type": "fill_in_blank", "prompt": "Guided tours last ___ minutes.", "answer": "[Audio-dependent answer]", "answerLine": "Tour duration mentioned near the end of Section 2."},
                ]
            },
            {
                "partNumber": 3,
                "title": f"Section 3: Academic Discussion — {s3.title()}",
                "audioUrl": audio_url(book, test, 3),
                "text": f"Students discuss {s3} with a tutor or among themselves. Questions focus on academic opinions, research findings, and presentation choices.",
                "tips": [
                    "Track speaker attribution — who makes each claim matters.",
                    "Contrast language ('however', 'on the other hand') signals a different view.",
                    "MCQ: all options may be plausible — listen for what is actually confirmed."
                ],
                "questions": [
                    {"number": 21, "type": "mcq", "prompt": "What is the main point of disagreement between the students?", "options": ["A. Research methodology", "B. Presentation format", "C. Topic selection"], "answer": "A", "answerLine": "The students disagree about which research methodology to use."},
                    {"number": 22, "type": "fill_in_blank", "prompt": "The number of case studies they will include: ___", "answer": "[Audio-dependent answer]", "answerLine": "Agreed number of case studies stated in Section 3."},
                    {"number": 23, "type": "mcq", "prompt": "What does the tutor recommend?", "options": ["A. More primary research", "B. Focus on secondary sources", "C. Use both primary and secondary"], "answer": "C", "answerLine": "The tutor advises using both primary and secondary sources."},
                    {"number": 24, "type": "fill_in_blank", "prompt": "The submission deadline mentioned: ___", "answer": "[Audio-dependent answer]", "answerLine": "Deadline confirmed during the discussion."},
                    {"number": 25, "type": "mcq", "prompt": "Who will present first?", "options": ["A. Student A", "B. Student B", "C. The tutor decides later"], "answer": "A", "answerLine": "Student A volunteers to present first."},
                    {"number": 26, "type": "fill_in_blank", "prompt": "Time allowed for the presentation: ___ minutes.", "answer": "[Audio-dependent answer]", "answerLine": "Presentation time limit stated in Section 3."},
                    {"number": 27, "type": "mcq", "prompt": "What visual aid will the students use?", "options": ["A. Poster only", "B. Slides with data", "C. Video clips"], "answer": "B", "answerLine": "They agree to use slides with data visualisations."},
                    {"number": 28, "type": "fill_in_blank", "prompt": "The main source database they plan to use: ___", "answer": "[Audio-dependent answer]", "answerLine": "Database name stated during the research discussion."},
                    {"number": 29, "type": "mcq", "prompt": "What is the tutor's final advice?", "options": ["A. Submit early for feedback", "B. Narrow the research focus", "C. Include more interview data"], "answer": "A", "answerLine": "The tutor advises submitting a draft early for feedback."},
                    {"number": 30, "type": "fill_in_blank", "prompt": "Word limit for the written report: ___", "answer": "[Audio-dependent answer]", "answerLine": "Word limit confirmed in the final part of Section 3."},
                ]
            },
            {
                "partNumber": 4,
                "title": f"Section 4: Academic Lecture — {BOOK_THEMES.get(book, 'Academic Topic')}",
                "audioUrl": audio_url(book, test, 4),
                "text": f"A university lecturer presents research on a topic related to {BOOK_THEMES.get(book, 'an academic subject')}. Questions focus on definitions, data, and key conclusions.",
                "tips": [
                    "Section 4 uses academic vocabulary — listen carefully for technical terms.",
                    "Answers follow signal phrases: 'research shows', 'studies found', 'the key point is'.",
                    "Lecturers often summarise at the end — this may contain final answers."
                ],
                "questions": [
                    {"number": 31, "type": "fill_in_blank", "prompt": "The main research question of the lecture: ___", "answer": "[Audio-dependent answer]", "answerLine": "Stated in the opening of Section 4."},
                    {"number": 32, "type": "fill_in_blank", "prompt": "Key term defined by the lecturer: ___", "answer": "[Audio-dependent answer]", "answerLine": "Defined early in the lecture."},
                    {"number": 33, "type": "mcq", "prompt": "What was the main finding of the study described?", "options": ["A. No significant effect was found", "B. A significant positive correlation was identified", "C. Results were inconclusive"], "answer": "B", "answerLine": "The lecturer reports a significant positive correlation in the study findings."},
                    {"number": 34, "type": "fill_in_blank", "prompt": "Percentage or figure cited: ___", "answer": "[Audio-dependent answer]", "answerLine": "Statistic stated during the lecture."},
                    {"number": 35, "type": "fill_in_blank", "prompt": "Country or region used as the case study: ___", "answer": "[Audio-dependent answer]", "answerLine": "Location named in the lecture."},
                    {"number": 36, "type": "mcq", "prompt": "What limitation does the lecturer identify?", "options": ["A. Small sample size", "B. Lack of long-term data", "C. No control group"], "answer": "B", "answerLine": "The lecturer notes the lack of long-term longitudinal data as a limitation."},
                    {"number": 37, "type": "fill_in_blank", "prompt": "Year of the main research cited: ___", "answer": "[Audio-dependent answer]", "answerLine": "Year stated when citing the study."},
                    {"number": 38, "type": "fill_in_blank", "prompt": "Recommended policy change or action: ___", "answer": "[Audio-dependent answer]", "answerLine": "Recommendation stated in the conclusion of the lecture."},
                    {"number": 39, "type": "mcq", "prompt": "What does the lecturer suggest future research should focus on?", "options": ["A. Larger-scale trials", "B. Qualitative interviewing", "C. Historical analysis"], "answer": "A", "answerLine": "Larger-scale trials recommended for future research."},
                    {"number": 40, "type": "fill_in_blank", "prompt": "The lecturer concludes that ___ is the most critical factor.", "answer": "[Audio-dependent answer]", "answerLine": "Stated as the main conclusion in the final minutes of Section 4."},
                ]
            }
        ]
    }

def make_reading(book, test):
    # Use custom passages for books 1 and 2, generate for others
    if book in READING_PASSAGE_SETS and test == 1:
        passages = READING_PASSAGE_SETS[book]
    else:
        idx = (book - 1) % len(READING_TOPICS)
        t1_title, t2_hint, t3_title = READING_TOPICS[idx]
        t2_title = f"The Impact of {t2_hint.split(',')[0].strip().title()}"
        passages = [
            (t1_title, _make_passage_text(book, test, 1, t1_title), _make_passage_questions(book, test, 1)),
            (t2_title, _make_passage_text(book, test, 2, t2_title), _make_passage_questions(book, test, 2, offset=13)),
            (t3_title, _make_passage_text(book, test, 3, t3_title), _make_passage_questions(book, test, 3, offset=26)),
        ]

    parts = []
    for i, (title, text, questions) in enumerate(passages, 1):
        tips_sets = [
            ["TRUE/FALSE: answer only from the text, not from background knowledge.", "Scan for key nouns from each question before reading paragraph by paragraph.", "NOT GIVEN: the passage neither confirms nor denies — resist assumptions."],
            ["Match headings to paragraph topics, not isolated details.", "MCQ: identify what the question asks before reading options.", "Fill-in-blank: the exact word(s) from the passage are usually correct."],
            ["Passage 3 is the most difficult — allocate 25 minutes.", "Track argument structure: claim → evidence → counter-claim.", "Do not bring in external knowledge — answer from the text only."],
        ]
        parts.append({
            "partNumber": i,
            "title": f"Passage {i}: {title}",
            "text": text,
            "tips": tips_sets[i-1],
            "questions": questions
        })

    return {
        "title": f"Cambridge {book} Test {test} - Reading",
        "introduction": f"Three academic passages covering {BOOK_THEMES.get(book, 'diverse topics')}. 60 minutes, 40 questions.",
        "audioUrl": None,
        "examConfig": {"module": "Reading", "durationMinutes": 60, "totalQuestions": 40, "partCount": 3},
        "parts": parts
    }

def _make_passage_text(book, test, passage_num, title):
    theme = BOOK_THEMES.get(book, "academic and scientific research")
    variations = [
        f"Research into {title.lower()} has expanded significantly over the past two decades. Scientists and policymakers alike have recognised that understanding this phenomenon is critical to addressing broader challenges in {theme.lower()}. Early studies, conducted primarily in laboratory settings, established foundational principles that have since been refined through field research and longitudinal observation.\n\nThe most significant finding concerns the relationship between scale and impact. At local levels, effects are often manageable and reversible. However, when multiplied across global systems, cumulative impacts can reach tipping points that trigger disproportionate and sometimes irreversible change. Researchers working in {theme.lower()} have identified several such thresholds, though the precise conditions under which they are crossed remain subject to ongoing scientific debate.\n\nPolicy responses have been mixed. Some governments have implemented proactive frameworks informed by precautionary principles, accepting economic costs in exchange for reduced long-term risk. Others have prioritised short-term economic considerations, delaying regulatory action pending clearer scientific consensus. International cooperation has been inconsistent: while multilateral agreements exist, enforcement mechanisms remain weak and compliance voluntary in many cases.\n\nEconomic modelling suggests that early investment in prevention and adaptation is significantly more cost-effective than remediation after harm has occurred. Nevertheless, political short-termism and competing national interests continue to obstruct the level of coordinated action that scientists argue is required.",
        f"{title} represents one of the most actively studied questions in contemporary {theme.lower()} research. Historical records trace awareness of the issue to the early twentieth century, though systematic investigation only began in earnest following methodological advances in the 1980s and 1990s. Today, an interdisciplinary community of researchers draws on data from satellite monitoring, field surveys, laboratory experiments, and computational modelling.\n\nA central debate within the field concerns the relative contributions of natural variability and human activity. Long-term datasets spanning multiple centuries reveal cycles of fluctuation that predate industrialisation, complicating causal attribution. However, the speed and scale of change observed since the mid-twentieth century fall outside historical norms in multiple independent datasets, leading the majority of researchers to conclude that anthropogenic factors are the dominant driver of current trends.\n\nSocial dimensions add further complexity. Communities most directly affected by changes in {theme.lower()} are often those with the least political and economic power to influence the policies shaping those changes. This asymmetry raises fundamental questions about equity, consent, and responsibility that extend well beyond the technical dimensions of the problem. Advocates argue that effective solutions must address power imbalances alongside technical and scientific challenges.\n\nLooking ahead, scenario modelling projects a range of possible futures depending on the choices made in the coming decade. The most optimistic projections assume coordinated international action and rapid deployment of available technologies. More pessimistic models reflect continued fragmentation of political will and prioritisation of economic growth over sustainability. The gap between best and worst outcomes remains large, underscoring the significance of near-term decisions.",
    ]
    return variations[(book + test + passage_num) % len(variations)]

def _make_passage_questions(book, test, passage_num, offset=0):
    base_q = offset + 1
    count = 13 if passage_num < 3 else 14
    question_templates = [
        {"type": "true_false", "prompt_template": "The passage states that the topic is fully understood by all researchers.", "answer": "FALSE", "answerLine": "The precise conditions remain subject to ongoing scientific debate."},
        {"type": "true_false", "prompt_template": "Policy responses to the issue have been uniform across countries.", "answer": "FALSE", "answerLine": "Policy responses have been mixed."},
        {"type": "true_false", "prompt_template": "Early investment in prevention is more cost-effective than later remediation.", "answer": "TRUE", "answerLine": "Early investment is significantly more cost-effective than remediation after harm."},
        {"type": "mcq", "prompt_template": "What makes the issue more difficult to address at a global level?", "options": ["A. Lack of scientific awareness", "B. Cumulative impacts reaching tipping points", "C. Too much international cooperation"], "answer": "B", "answerLine": "When multiplied across global systems, cumulative impacts reach tipping points."},
        {"type": "fill_in_blank", "prompt_template": "Governments prioritising short-term goals have delayed ___ action.", "answer": "regulatory", "answerLine": "Delaying regulatory action pending clearer scientific consensus."},
        {"type": "true_false", "prompt_template": "The passage says all communities are equally affected by the changes described.", "answer": "NOT GIVEN", "answerLine": "The passage notes asymmetry but does not explicitly compare all communities."},
        {"type": "mcq", "prompt_template": "What do the most optimistic projections assume?", "options": ["A. Natural recovery without human action", "B. Coordinated international action and rapid technology deployment", "C. That the problem will resolve itself"], "answer": "B", "answerLine": "Coordinated international action and rapid deployment of available technologies."},
        {"type": "fill_in_blank", "prompt_template": "Communities most affected are often those with the least ___ power.", "answer": "political", "answerLine": "Communities with the least political and economic power."},
        {"type": "true_false", "prompt_template": "All researchers agree that human activity alone causes the observed changes.", "answer": "FALSE", "answerLine": "A debate concerns relative contributions of natural variability and human activity."},
        {"type": "matching", "prompt_template": "Best heading: the gap between different future projections", "answer": "iv", "answerLine": "The gap between best and worst outcomes remains large."},
        {"type": "matching", "prompt_template": "Best heading: why communities affected have little influence", "answer": "v", "answerLine": "Least political and economic power to influence policies."},
        {"type": "mcq", "prompt_template": "The writer's overall tone is best described as", "options": ["A. Optimistic about rapid solutions", "B. Analytically balanced with concern", "C. Dismissive of scientific findings"], "answer": "B", "answerLine": "The passage presents multiple perspectives with clear concern about the gap between projections."},
        {"type": "fill_in_blank", "prompt_template": "International agreements lack effective ___ mechanisms.", "answer": "enforcement", "answerLine": "Enforcement mechanisms remain weak and compliance voluntary."},
        {"type": "true_false", "prompt_template": "The issue described has been studied for less than ten years.", "answer": "FALSE", "answerLine": "Research expanded significantly over the past two decades."},
    ]
    questions = []
    for i in range(count):
        qt = question_templates[i % len(question_templates)]
        q = dict(qt)
        q["number"] = base_q + i
        q["prompt"] = qt["prompt_template"]
        q.pop("prompt_template", None)
        questions.append(q)
    return questions

def make_writing(book, test):
    idx = (book - 1) % len(WRITING_TOPICS)
    task1_title, task2_prompt = WRITING_TOPICS[idx]

    # Vary task2 slightly by test number
    task2_variants = [
        task2_prompt,
        task2_prompt.replace("Discuss both views.", "Discuss both views and give your opinion.").replace("Do you agree?", "To what extent do you agree or disagree?"),
        f"Some people think that {task2_prompt.split(' is ')[0].lower() if ' is ' in task2_prompt else 'modern approaches'} should change. Others disagree. Discuss both views and give your own opinion.",
        f"What are the advantages and disadvantages of {task2_prompt.split('.')[0].lower() if '.' in task2_prompt else 'the situation described'}?",
    ]
    task2_text = task2_variants[(test - 1) % len(task2_variants)]

    return {
        "title": f"Cambridge {book} Test {test} - Writing",
        "introduction": "Task 1: minimum 150 words, 20 minutes. Task 2: minimum 250 words, 40 minutes.",
        "audioUrl": None,
        "examConfig": {"module": "Writing", "durationMinutes": 60, "totalQuestions": 2, "partCount": 2},
        "parts": [
            {
                "partNumber": 1,
                "title": f"Task 1: {task1_title.title()}",
                "text": f"The diagram/graph below shows information about {task1_title.lower()}. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.\n\nWrite at least 150 words.",
                "tips": [
                    "Begin with an overview of the most striking trend or feature.",
                    "Group related data — do not describe every single figure.",
                    "Use precise comparative language: 'rose sharply', 'remained relatively stable', 'fell significantly'."
                ],
                "questions": [
                    {"number": 1, "type": "fill_in_blank", "prompt": "Planning check: Identify the most noticeable trend in the data.", "answer": "open", "answerLine": "Identify the key trend before writing."},
                    {"number": 2, "type": "fill_in_blank", "prompt": "Overview check: What comparison is most relevant?", "answer": "open", "answerLine": "State the most important comparison in your overview paragraph."},
                ]
            },
            {
                "partNumber": 2,
                "title": "Task 2: Essay",
                "text": f"{task2_text}\n\nGive reasons for your answer and include relevant examples. Write at least 250 words.",
                "tips": [
                    "Clearly state your position in the introduction.",
                    "Each body paragraph should have one main idea + evidence + explanation.",
                    "Conclude by restating your view — do not introduce new ideas."
                ],
                "questions": [
                    {"number": 3, "type": "fill_in_blank", "prompt": "Planning: Write your thesis statement in one sentence.", "answer": "open", "answerLine": "Draft your thesis before writing the full essay."},
                    {"number": 4, "type": "fill_in_blank", "prompt": "Planning: Name your two main supporting arguments.", "answer": "open", "answerLine": "Identify your two body paragraph topics."},
                ]
            }
        ]
    }

def make_speaking(book, test):
    idx = (book - 1) % len(SPEAKING_TOPICS)
    p1_topics, cue_card, p3_topic = SPEAKING_TOPICS[idx]

    # Generate varied cue card by test
    cue_card_variants = [
        cue_card,
        f"{cue_card} that you remember from your childhood",
        f"{cue_card} that was different from what you expected",
        f"{cue_card} that you would recommend to a friend",
    ]
    selected_cue = cue_card_variants[(test - 1) % len(cue_card_variants)]

    return {
        "title": f"Cambridge {book} Test {test} - Speaking",
        "introduction": "Speaking test: Part 1 (4-5 min), Part 2 (3-4 min), Part 3 (4-5 min). Speak naturally and extend each answer.",
        "audioUrl": None,
        "examConfig": {"module": "Speaking", "durationMinutes": 15, "totalQuestions": 12, "partCount": 3},
        "parts": [
            {
                "partNumber": 1,
                "title": "Part 1: Introductory Interview",
                "text": f"The examiner will ask about familiar topics: {p1_topics}. Give natural answers of 2-4 sentences each.",
                "tips": [
                    "Do not memorise scripts — speak naturally and conversationally.",
                    "Add one reason or example to each answer.",
                    "Avoid one-word responses."
                ],
                "questions": [
                    {"number": 1, "type": "fill_in_blank", "prompt": f"Tell me about {p1_topics.split(',')[0].strip()} — do you enjoy it?", "answer": "open", "answerLine": "Personal response."},
                    {"number": 2, "type": "fill_in_blank", "prompt": f"How important is {p1_topics.split(',')[1].strip() if ',' in p1_topics else 'this topic'} in your daily life?", "answer": "open", "answerLine": "Personal response."},
                    {"number": 3, "type": "fill_in_blank", "prompt": f"Has your attitude to {p1_topics.split(',')[0].strip()} changed over the years?", "answer": "open", "answerLine": "Personal response."},
                    {"number": 4, "type": "fill_in_blank", "prompt": "What do you usually do to relax after a busy day?", "answer": "open", "answerLine": "Personal response."},
                    {"number": 5, "type": "fill_in_blank", "prompt": "Do you think people in your country have enough leisure time?", "answer": "open", "answerLine": "Personal response."},
                ]
            },
            {
                "partNumber": 2,
                "title": "Part 2: Cue Card",
                "text": f"{selected_cue}.\nYou should say:\n- what it is\n- when and where you experienced it\n- what was memorable about it\nand explain why it has stayed in your memory.\n\nYou have 1 minute to prepare notes and up to 2 minutes to speak.",
                "tips": [
                    "Use your 1 minute to note 4-5 key words or phrases.",
                    "Speak continuously for up to 2 minutes — do not stop early.",
                    "End with the 'why' section — it carries significant marks."
                ],
                "questions": [
                    {"number": 6, "type": "fill_in_blank", "prompt": "Preparation keyword 1 (what/when/where)", "answer": "open", "answerLine": "Self-note."},
                    {"number": 7, "type": "fill_in_blank", "prompt": "Preparation keyword 2 (memorable detail)", "answer": "open", "answerLine": "Self-note."},
                    {"number": 8, "type": "fill_in_blank", "prompt": "Preparation keyword 3 (why it stayed in your memory)", "answer": "open", "answerLine": "Self-note."},
                ]
            },
            {
                "partNumber": 3,
                "title": "Part 3: Discussion",
                "text": f"Broader questions about {p3_topic}. Develop each answer with an idea, reason, and example or prediction.",
                "tips": [
                    "Show range with phrases like: 'It depends on...', 'From a different perspective...'",
                    "Use hedging language: 'I would argue that...', 'It seems to me that...'",
                    "Compare across time, cultures, or social groups where relevant."
                ],
                "questions": [
                    {"number": 9, "type": "fill_in_blank", "prompt": f"How has {p3_topic.split(',')[0] if ',' in p3_topic else p3_topic} changed in recent years in your country?", "answer": "open", "answerLine": "Discussion question."},
                    {"number": 10, "type": "fill_in_blank", "prompt": f"What role should governments play in {p3_topic.split(',')[0] if ',' in p3_topic else p3_topic}?", "answer": "open", "answerLine": "Discussion question."},
                    {"number": 11, "type": "fill_in_blank", "prompt": f"Do you think attitudes to {p3_topic.split(',')[0] if ',' in p3_topic else p3_topic} will change in the future?", "answer": "open", "answerLine": "Discussion question."},
                    {"number": 12, "type": "fill_in_blank", "prompt": f"What can individuals do about challenges related to {p3_topic.split(',')[0] if ',' in p3_topic else p3_topic}?", "answer": "open", "answerLine": "Discussion question."},
                ]
            }
        ]
    }

# ─── Main generation ──────────────────────────────────────────────────────────

records = []
for book in range(1, 21):
    for test in range(1, 5):
        for module, maker in [
            ("Listening", make_listening),
            ("Reading", make_reading),
            ("Writing", make_writing),
            ("Speaking", make_speaking),
        ]:
            content = maker(book, test)
            records.append({
                "bookNumber": book,
                "testNumber": test,
                "module": module,
                "audioUrl": audio_url(book, test, 1) if module == "Listening" else None,
                "content": content,
            })

output = {"records": records}
out_path = os.path.join(os.path.dirname(__file__), "bulk_import_books_1_20.json")
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(output, f, ensure_ascii=False, indent=2)

print(f"Generated {len(records)} records.")
print(f"Saved to: {out_path}")
file_size = os.path.getsize(out_path) / (1024 * 1024)
print(f"File size: {file_size:.1f} MB")
