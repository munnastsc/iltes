export const CAMBRIDGE_18_TEST_1_READING_PASSAGE_1 = {
    title: "Urban farming",
    introduction: "In 2015, Pascal Hardy, an engineer and sustainable development consultant, began a project to build the world’s largest rooftop farm.",
    parts: [
        {
            partNumber: 1,
            title: "Nature Urbaine",
            text: `In 2015, Pascal Hardy, an engineer and sustainable development consultant, began experimenting with vertical farming and aeroponic growing towers on his Paris apartment block roof. This experimental work preceded his leadership of the project to build Nature Urbaine, which opened in 2020 atop Pavilion 6 of the Paris Expo Porte de Versailles in Paris, France.

Spanning 14,000 square metres - roughly the size of two football pitches - Nature Urbaine is recognized as one of the world's largest urban rooftop farms. The facility utilizes soil-free aeroponic and hydroponic techniques to grow a variety of fruits and vegetables to supply local residents and businesses.

The farm aims to produce up to 1,000 kg of fresh produce every day during the high season. It focuses on nutrient-rich crops like lettuces, strawberries, and aromatic herbs. By growing food in the heart of the city, the project reduces the carbon footprint associated with long-distance food consumption and transportation.

Urban farming projects like this also provide an opportunity for city dwellers to reconnect with nature. Nature Urbaine offers educational workshops and even leases out small plots for individuals to grow their own crops. This social aspect is as important as the agricultural output, fostering a sense of community and awareness about sustainable food systems.`,
            tips: [
                "Scan for names (Pascal Hardy) and dates (2015, 2020) to find the relevant paragraph.",
                "Pay attention to units (kg, square metres) for completion questions.",
                "True/False/Not Given requires finding the exact statement in the text."
            ],
            questions: [
                { number: 1, prompt: "The farm focuses on nutrient-rich crops like ___.", answer: "lettuces", answerLine: "crops like lettuces, strawberries" },
                { number: 2, prompt: "The farm aims to produce up to ___ of fresh produce every day.", answer: "1,000 kg", answerLine: "produce up to 1,000 kg" },
                { number: 3, prompt: "The project reduces the carbon footprint associated with long-distance ___.", answer: "food consumption", answerLine: "long-distance food consumption" },
                { number: 4, prompt: "The facility does not use ___ to grow plants.", answer: "pesticides", answerLine: "soil-free aeroponic" }, // Assumption for demo
                { number: 8, prompt: "Nature Urbaine is the world's largest urban rooftop farm.", answer: "TRUE", answerLine: "recognized as one of the world's largest" }
            ]
        }
    ]
};

export const CAMBRIDGE_18_TEST_1_LISTENING_PART_1 = {
    title: "Transport Survey",
    introduction: "A student is being interviewed about her transport habits for a local survey.",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", // Placeholder for real audio
    parts: [
        {
            partNumber: 1,
            title: "Personal Details & Trip Info",
            text: `Interviewer: Excuse me. Would you mind if I asked you some questions? We're doing a survey on transport.
Sadie: Yes, that's OK.
Interviewer: First of all, can I take your name?
Sadie: Yes. It's Sadie Jones.
Interviewer: And could I have your date of birth – just the year will do...
Sadie: It's 1991.
Interviewer: So next your postcode, please.
Sadie: It's DW30 7YZ.
Interviewer: Is that in Wells?
Sadie: No, it's actually in Harborne.
Interviewer: ...what was the reason for your trip today? I can see you've got some shopping with you.
Sadie: Yes. I did some shopping but the main reason I came here was to go to the dentist.`,
            tips: [
                "Listen for corrections! Sadie first says she did shopping but then clarifies the main reason is the dentist.",
                "Spellings are important for postcodes and area names.",
                "Numbers like 1991 are common in Part 1."
            ],
            questions: [
                { number: 1, prompt: "Year of birth: ___", answer: "1991", answerLine: "It's 1991" },
                { number: 2, prompt: "Postcode: ___", answer: "DW30 7YZ", answerLine: "It's DW30 7YZ" },
                { number: 3, prompt: "Area: ___", answer: "Harborne", answerLine: "it's actually in Harborne" },
                { number: 4, prompt: "Main reason for trip: ___", answer: "dentist", answerLine: "main reason I came here was to go to the dentist" }
            ]
        }
    ]
};

export const CAMBRIDGE_17_TEST_1_READING_PASSAGE_1 = {
    title: "The development of the London underground railway",
    introduction: "In the first half of the 1800s, London's population grew at an astonishing rate, and the central area became increasingly congested.",
    parts: [
        {
            partNumber: 1,
            title: "Congestion and Charles Pearson",
            text: `In the first half of the 1800s, London's population grew at an astonishing rate, and the central area became increasingly congested. The problem was exacerbated by the expansion of the railways, which brought thousands of commuters into the city every day.

Charles Pearson, a solicitor for the City of London, saw both a cause and a solution. He argued that the railways were driving people into the suburbs, but the lack of efficient transport back into the city was the real issue. He proposed an underground railway to connect the main line stations and provide a way for businessmen to reach the central area.

However, funding was a major hurdle. Pearson's ideas were met with skepticism by the press and the public. It wasn't until the 1850s that a group of investors was formed to back the project. The construction used the 'cut and cover' method, which involved digging up the road, building the tunnel, and then covering it back up. This was only possible because the soil in London was relatively soft and easy to dig.`,
            tips: [
                "The first part of the text usually contains the answers for the first set of questions.",
                "Look for names like 'Charles Pearson' to find the relevant section.",
                "Note completion usually follows the order of the text."
            ],
            questions: [
                { number: 1, prompt: "London's ___ grew rapidly in the 1800s.", answer: "population", answerLine: "population grew at an astonishing rate" },
                { number: 2, prompt: "Pearson argued railways drove people to the ___.", answer: "suburbs", answerLine: "driving people into the suburbs" },
                { number: 3, prompt: "The goal was to help ___ reach the city center.", answer: "businessmen", answerLine: "way for businessmen to reach" },
                { number: 4, prompt: "A major hurdle for the project was ___.", answer: "funding", answerLine: "funding was a major hurdle" },
                { number: 5, prompt: "Pearson's ideas were criticized by the ___.", answer: "press", answerLine: "skepticism by the press" },
            ]
        }
    ]
};

export const CAMBRIDGE_19_TEST_1_READING_PASSAGE_1 = {
    title: "How tennis rackets have changed",
    introduction: "Modern professional tennis is a game of tiny margins. Even the smallest modification to a racket can be the difference between winning and losing.",
    parts: [
        {
            partNumber: 1,
            title: "Racket Customization",
            text: `In 2016, Andy Murray became the world's top tennis player. While his talent was never in doubt, many attributed his surge in performance to the subtle changes he made to his rackets. These modifications were so small that they passed more or less unnoticed by the general public, but for Murray, they were essential.

Professional players often customize their rackets with specific string types, weights, and grips. For instance, Pete Sampras was known to add lead weights to his racket frames to increase the power of his serve. Mike and Bob Bryan, the most successful doubles pair in history, even experimented with the types of paint used on their racket frames to achieve a specific feel.

The rules of tennis also play a role in racket technology. In the late 1970s, the 'spaghetti-strung' racket was banned because of the extreme amount of topspin it generated, which was seen as unfair to opponents. Today, changes to rackets are treated as seriously as a player's diet or training regime. Even the weather can influence a player's choice of strings, with many adjusting their equipment based on climatic conditions.`,
            tips: [
                "Look for names like 'Andy Murray', 'Pete Sampras', and 'Bob Bryan' to find the relevant sections.",
                "True/False/Not Given questions require careful reading for subtle details.",
                "Note completion usually requires identifying a single word from the text."
            ],
            questions: [
                { number: 1, prompt: "People had expected Andy Murray to become the world's top player for five years before 2016.", answer: "FALSE", answerLine: "previously regarded as a 'talented outsider'" },
                { number: 2, prompt: "The changes Andy Murray made to his rackets attracted a lot of attention.", answer: "FALSE", answerLine: "so subtle as to pass more or less unnoticed" },
                { number: 6, prompt: "The weather can affect how professional players adjust their strings.", answer: "TRUE", answerLine: "adjusting their equipment based on climatic conditions" },
                { number: 7, prompt: "Pete Sampras's racket changes helped his strong serve.", answer: "TRUE", answerLine: "addition of lead weights... increase the power of his serve" },
                { number: 8, prompt: "The Bryan brothers made changes to the type of ___ used on their frames.", answer: "paint", answerLine: "types of paint used on their racket frames" },
                { number: 9, prompt: "Spaghetti-strung rackets were banned because of the amount of ___ they created.", answer: "topspin", answerLine: "extreme amount of topspin it generated" }
            ]
        }
    ]
};

export const CAMBRIDGE_19_TEST_1_LISTENING_PART_1 = {
    title: "Hinchingbrooke Country Park",
    introduction: "A teacher is inquiring about educational visits for a local primary school.",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", // Placeholder
    parts: [
        {
            partNumber: 1,
            title: "Park Details & Activities",
            text: `Sally: Good morning. Hinchingbrooke Country Park, Sally speaking. I'm one of the rangers.
John: Oh hello. My name's John Chapman, and I'm a teaching assistant... I've been asked to arrange a visit to the park for two of our classes.
Sally: OK... the park covers 170 acres, that's 69 hectares.
...
Sally: There are also several smaller ones, ponds and a stream that flows through the park.
...
Sally: They also collect and analyse data about the things they see.
Sally: Another focus is on geography... practice reading a map and using a compass.
Sally: Leisure and tourism that focuses on your visitors.
Sally: The children experiment with natural materials to create sounds and explore rhythm.
Sally: I would imagine they get a sense of freedom...
Sally: They develop new skills.
Sally: It's 4.95 pounds per child.
Sally: Adults, such as leaders, are free.`,
            tips: [
                "Listen for numbers (69, 4.95).",
                "Note specific nouns like 'stream', 'data', 'map', 'visitors', 'sounds', 'freedom', 'skills', 'leaders'."
            ],
            questions: [
                { number: 1, prompt: "Total hectares: ___", answer: "69", answerLine: "that's 69 hectares" },
                { number: 2, prompt: "A ___ flows through the park.", answer: "stream", answerLine: "ponds and a stream that flows" },
                { number: 3, prompt: "Children collect and analyse ___.", answer: "data", answerLine: "collect and analyse data" },
                { number: 4, prompt: "Practice reading a ___.", answer: "map", answerLine: "practice reading a map" },
                { number: 5, prompt: "Focus on leisure and tourism for ___.", answer: "visitors", answerLine: "focuses on your visitors" },
                { number: 6, prompt: "Create ___ with natural materials.", answer: "sounds", answerLine: "create sounds and explore rhythm" },
                { number: 7, prompt: "Get a sense of ___.", answer: "freedom", answerLine: "get a sense of freedom" },
                { number: 8, prompt: "Develop new ___.", answer: "skills", answerLine: "develop new skills" },
                { number: 9, prompt: "Cost per child: £___", answer: "4.95", answerLine: "It's 4.95 pounds per child" },
                { number: 10, prompt: "Adults like ___ are free.", answer: "leaders", answerLine: "Adults, such as leaders, are free" }
            ]
        }
    ]
};

export const CAMBRIDGE_19_TEST_1_READING_PASSAGE_2 = {
    title: "The Pirates of the Ancient Mediterranean",
    introduction: "Piracy has been a constant presence in the Mediterranean since antiquity, often flourishing during times of political instability.",
    parts: [
        {
            partNumber: 1,
            title: "Piracy in Antiquity",
            text: `The history of piracy in the Mediterranean is as old as sea trade itself. In the ancient world, pirates were not just outlaws but often state-sponsored agents or members of powerful maritime communities. The rocky coasts of Cilicia and the myriad islands of the Aegean provided perfect hideouts for these marauders.

Pirates targeted merchant vessels carrying valuable goods like grain, wine, and olive oil. They also conducted coastal raids, kidnapping inhabitants for ransom or to be sold into slavery. The threat of piracy was so great that it often dictated the design of ships and the location of coastal settlements, which were built high on hills for defense.

The Roman Republic eventually took decisive action against piracy. In 67 BCE, Pompey the Great was granted extraordinary powers to clear the Mediterranean of pirates. In just three months, he succeeded in suppressing piracy across the entire sea, settling many former pirates in inland communities where they could lead productive lives.`,
            tips: [
                "Look for geographical markers like 'Cilicia' and 'Aegean' to locate the hideouts.",
                "Note the role of Pompey the Great in suppressing piracy.",
                "Identify the goods targeted by pirates (e.g., 'grain')."
            ],
            questions: [
                { number: 14, prompt: "Piracy only emerged after the fall of the Roman Empire.", answer: "FALSE", answerLine: "history of piracy... is as old as sea trade itself" },
                { number: 24, prompt: "Merchant vessels carried valuable goods like ___.", answer: "grain", answerLine: "carrying valuable goods like grain" },
                { number: 26, prompt: "Kidnapped inhabitants were often held for ___.", answer: "ransom", answerLine: "kidnapping inhabitants for ransom" }
            ]
        }
    ]
};

export const CAMBRIDGE_19_TEST_1_READING_PASSAGE_3 = {
    title: "The Persistence and Peril of Misinformation",
    introduction: "In the digital age, misinformation spreads faster than ever, posing a significant threat to public discourse and democratic institutions.",
    parts: [
        {
            partNumber: 1,
            title: "The Nature of Misinformation",
            text: `Misinformation is not a new phenomenon, but the speed and scale at which it can now be disseminated are unprecedented. Social media algorithms often prioritize engagement over accuracy, creating 'echo chambers' where false information is amplified.

Psychological factors also play a role in the persistence of misinformation. Once a false belief is established, it can be extremely difficult to correct, even when presented with factual evidence. This 'continued influence effect' suggests that the human brain often struggles to overwrite incorrect information once it has been processed.

To combat misinformation, experts suggest a combination of technological solutions, such as improved algorithms and fact-checking tools, and educational initiatives focused on media literacy. Encouraging individuals to think critically about the sources of their information is crucial in reducing the impact of false narratives.`,
            tips: [
                "Understand the difference between misinformation and disinformation.",
                "Identify the psychological factors mentioned, such as the 'continued influence effect'.",
                "Note the proposed solutions for combating misinformation."
            ],
            questions: [
                { number: 37, prompt: "Misinformation is a relatively recent phenomenon.", answer: "FALSE", answerLine: "Misinformation is not a new phenomenon" },
                { number: 39, prompt: "Social media algorithms always prioritize accuracy.", answer: "NO", answerLine: "algorithms often prioritize engagement over accuracy" }
            ]
        }
    ]
};

export const CAMBRIDGE_20_TEST_1_READING_PASSAGE_1 = {
    title: "The Kākāpō",
    introduction: "The kākāpō is the world's only flightless parrot. Native to New Zealand, it was once on the brink of extinction.",
    parts: [
        {
            partNumber: 1,
            title: "A Unique Parrot",
            text: `The kākāpō is a truly remarkable bird. Found only in New Zealand, it is the world's heaviest parrot and, unusually, is completely flightless. Instead of flying, it uses its strong legs to climb trees and hike for miles across the forest floor.

During the daytime, kākāpōs are generally inactive, hiding in the undergrowth. They emerge at night to feed on a variety of plants, including the seeds and bulbs of native trees. They have a keen sense of smell, which helps them find food in the dark soil. Their green and yellow feathers provide excellent camouflage against the forest floor.

The arrival of humans and introduced predators like deer and cats devastated the kākāpō population. By the 1980s, the species was critically endangered, with only a handful of birds remaining on a few offshore islands. Since then, intensive conservation efforts, including government funding and cooperation with local stakeholders, have seen the population slowly begin to recover.`,
            tips: [
                "Scan for unique terms like 'New Zealand', 'flightless', and 'kākāpō' to find the relevant section.",
                "Note completion requires precise word extraction (e.g., 'bulbs', 'soil').",
                "True/False/Not Given questions focus on specific attributes of the bird and its history."
            ],
            questions: [
                { number: 5, prompt: "Kākāpōs have a good sense of smell.", answer: "TRUE", answerLine: "keen sense of smell, which helps them find food" },
                { number: 7, prompt: "Kākāpōs feed on the seeds and ___ of native trees.", answer: "bulbs", answerLine: "seeds and bulbs of native trees" },
                { number: 8, prompt: "They use their sense of smell to find food in the ___.", answer: "soil", answerLine: "find food in the dark soil" },
                { number: 9, prompt: "Their ___ help them stay hidden in the forest.", answer: "feathers", answerLine: "green and yellow feathers provide excellent camouflage" },
                { number: 11, prompt: "The population was at its lowest by the year ___.", answer: "1980", answerLine: "By the 1980s, the species was critically endangered" },
                { number: 12, prompt: "Conservation efforts were supported by government ___.", answer: "funding", answerLine: "including government funding" }
            ]
        }
    ]
};

export const CAMBRIDGE_16_TEST_1_READING_PASSAGE_1 = {
    title: "Why we need to protect polar bears",
    introduction: "Polar bears are being increasingly threatened by the effects of climate change, but their disappearance could also have serious consequences for human health.",
    parts: [
        {
            partNumber: 1,
            title: "Polar Bear Health",
            text: `Polar bears are uniquely adapted to the extreme cold of the Arctic. They have high levels of adipose tissue, which in humans would lead to obesity and heart disease. However, polar bears experience no such problems.

Researchers have found that polar bears possess a gene known as APOB, which helps them process 'bad' cholesterol. This genetic adaptation allows them to maintain a diet high in fat without suffering from cardiovascular issues. Furthermore, female polar bears fast for up to six months while in their maternity dens, yet their bones remain strong and dense.

The study of polar bears is not just about conservation; it also offers potential insights into human health. By understanding how polar bears manage fat and maintain bone density during long periods of inactivity, scientists hope to develop new treatments for conditions like osteoporosis and heart disease in humans.`,
            tips: [
                "Scan for terms like 'APOB' and 'cholesterol' to find the section on genetics.",
                "The text contrasts polar bear health with human health; pay attention to these comparisons.",
                "Note completion usually requires identifying a single word from the text."
            ],
            questions: [
                { number: 1, prompt: "Polar bears suffer from health problems due to their fat levels.", answer: "FALSE", answerLine: "polar bears experience no such problems" },
                { number: 4, prompt: "The APOB gene helps polar bears handle bad cholesterol.", answer: "TRUE", answerLine: "possess a gene known as APOB, which helps them process 'bad' cholesterol" },
                { number: 5, prompt: "Female polar bears fast for six months during the maternity denning period.", answer: "TRUE", answerLine: "female polar bears fast for up to six months while in their maternity dens" },
                { number: 6, prompt: "Their bones become weak during the fasting period.", answer: "FALSE", answerLine: "their bones remain strong and dense" },
                { number: 7, prompt: "Research into polar bears could help humans with heart disease.", answer: "TRUE", answerLine: "hope to develop new treatments for conditions like... heart disease in humans" }
            ]
        }
    ]
};

export const CAMBRIDGE_15_TEST_1_READING_PASSAGE_1 = {
    title: "Nutmeg – a valuable spice",
    introduction: "The nutmeg tree, Myristica fragrans, is a large evergreen tree native to Southeast Asia. Until the late 18th century, it only grew in one place: the Banda Islands of Indonesia.",
    parts: [
        {
            partNumber: 1,
            title: "A Highly Prized Commodity",
            text: `Nutmeg was once one of the most valuable commodities in the world. In medieval Europe, it was highly prized for its medicinal properties and its ability to preserve food. The spice was so costly that the Dutch and the Portuguese fought bloody wars to control its trade.

The nutmeg fruit produces two distinct spices: nutmeg from the inner seed and mace from the lacy, red aril that surrounds it. Because the tree only grew in the remote Banda Islands, the spice trade was shrouded in mystery for centuries, initially controlled by Arab merchants.

In the 17th century, the Dutch East India Company (VOC) gained control of the islands and enforced a strict monopoly. They went to extreme lengths to protect their interests, including treating exported seeds with lime to ensure they could not be grown elsewhere. It wasn't until a volcanic eruption and a subsequent tsunami in 1778 devastated the groves that the Dutch monopoly began to weaken.`,
            tips: [
                "Scan for names like 'Banda Islands' and 'Dutch East India Company' to find the relevant sections.",
                "Note the distinction between nutmeg and mace for completion questions.",
                "Chronological dates (17th century, 1778) are key markers for locating information."
            ],
            questions: [
                { number: 1, prompt: "The nutmeg tree is native to the ___ Islands.", answer: "Banda", answerLine: "Banda Islands of Indonesia" },
                { number: 2, prompt: "The spice ___ is produced from the aril of the fruit.", answer: "mace", answerLine: "mace from the lacy, red aril" },
                { number: 5, prompt: "The Dutch treated seeds with ___ to prevent them being grown elsewhere.", answer: "lime", answerLine: "treating exported seeds with lime" },
                { number: 6, prompt: "A volcanic eruption in the year ___ helped break the Dutch monopoly.", answer: "1778", answerLine: "volcanic eruption... in 1778" }
            ]
        }
    ]
};
