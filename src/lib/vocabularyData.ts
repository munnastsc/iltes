export type PartOfSpeech = 'noun' | 'verb' | 'adjective' | 'adverb';
export type Topic = 'environment' | 'society' | 'technology' | 'health' | 'education' | 'economy' | 'government' | 'crime' | 'media' | 'transport' | 'general';
export type BandLevel = 6 | 7 | 8;

export interface VocabWord {
    id: string;
    word: string;
    ipa: string;
    pos: PartOfSpeech;
    bangla: string;
    definition: string;
    example: string;
    topic: Topic;
    band: BandLevel;
}

export const TOPICS: Array<{ id: Topic; label: string; icon: string }> = [
    { id: 'environment', label: 'পরিবেশ', icon: '🌿' },
    { id: 'society', label: 'সমাজ', icon: '👥' },
    { id: 'technology', label: 'প্রযুক্তি', icon: '💡' },
    { id: 'health', label: 'স্বাস্থ্য', icon: '🏥' },
    { id: 'education', label: 'শিক্ষা', icon: '📚' },
    { id: 'economy', label: 'অর্থনীতি', icon: '💰' },
    { id: 'government', label: 'সরকার', icon: '🏛️' },
    { id: 'crime', label: 'অপরাধ', icon: '⚖️' },
    { id: 'media', label: 'মিডিয়া', icon: '📺' },
    { id: 'transport', label: 'পরিবহন', icon: '🚌' },
    { id: 'general', label: 'সাধারণ', icon: '📖' },
];

export const POS_LABELS: Record<PartOfSpeech, string> = {
    noun: 'Noun · বিশেষ্য',
    verb: 'Verb · ক্রিয়া',
    adjective: 'Adjective · বিশেষণ',
    adverb: 'Adverb · ক্রিয়া-বিশেষণ',
};

export const POS_SHORT: Record<PartOfSpeech, string> = {
    noun: 'n.',
    verb: 'v.',
    adjective: 'adj.',
    adverb: 'adv.',
};

export const VOCABULARY: VocabWord[] = [
    // ── ENVIRONMENT ──
    { id: 'e01', word: 'deteriorate', ipa: '/dɪˈtɪəriəreɪt/', pos: 'verb', bangla: 'ক্রমশ খারাপ হওয়া', definition: 'to become progressively worse over time', example: 'Air quality continues to deteriorate in major cities.', topic: 'environment', band: 7 },
    { id: 'e02', word: 'sustainable', ipa: '/səˈsteɪnəbəl/', pos: 'adjective', bangla: 'টেকসই', definition: 'able to be maintained without depleting natural resources', example: 'We need sustainable energy solutions for the future.', topic: 'environment', band: 6 },
    { id: 'e03', word: 'emit', ipa: '/ɪˈmɪt/', pos: 'verb', bangla: 'নির্গত করা', definition: 'to produce and discharge gas, heat, or radiation', example: 'Factories emit large quantities of carbon dioxide.', topic: 'environment', band: 6 },
    { id: 'e04', word: 'biodiversity', ipa: '/ˌbaɪəʊdaɪˈvɜːsɪti/', pos: 'noun', bangla: 'জীববৈচিত্র্য', definition: 'the variety of plant and animal life in a habitat', example: 'Deforestation seriously threatens biodiversity.', topic: 'environment', band: 7 },
    { id: 'e05', word: 'conservation', ipa: '/ˌkɒnsəˈveɪʃən/', pos: 'noun', bangla: 'সংরক্ষণ', definition: 'protection of natural environments and wildlife', example: 'Wildlife conservation is crucial for future generations.', topic: 'environment', band: 6 },
    { id: 'e06', word: 'deforestation', ipa: '/dɪˌfɒrɪˈsteɪʃən/', pos: 'noun', bangla: 'বন উজাড়', definition: 'the clearing of forests on a large scale', example: 'Deforestation leads to habitat loss and climate change.', topic: 'environment', band: 7 },
    { id: 'e07', word: 'renewable', ipa: '/rɪˈnjuːəbəl/', pos: 'adjective', bangla: 'নবায়নযোগ্য', definition: 'relating to energy from sources that are not depleted', example: 'Solar is a clean, renewable energy source.', topic: 'environment', band: 6 },
    { id: 'e08', word: 'ecosystem', ipa: '/ˈiːkəʊˌsɪstəm/', pos: 'noun', bangla: 'বাস্তুতন্ত্র', definition: 'a biological community of interacting organisms and environment', example: 'Pollution disrupts the delicate ocean ecosystem.', topic: 'environment', band: 7 },
    { id: 'e09', word: 'contaminate', ipa: '/kənˈtæmɪneɪt/', pos: 'verb', bangla: 'দূষিত করা', definition: 'to make something impure or harmful', example: 'Industrial chemicals contaminated the local river.', topic: 'environment', band: 7 },
    { id: 'e10', word: 'drought', ipa: '/draʊt/', pos: 'noun', bangla: 'খরা', definition: 'a prolonged period of abnormally low rainfall', example: 'The severe drought destroyed crops across the region.', topic: 'environment', band: 6 },
    { id: 'e11', word: 'erosion', ipa: '/ɪˈrəʊʒən/', pos: 'noun', bangla: 'ভূমিক্ষয়', definition: 'gradual destruction by natural forces like wind or water', example: 'Coastal erosion threatens many seaside communities.', topic: 'environment', band: 7 },
    { id: 'e12', word: 'habitat', ipa: '/ˈhæbɪtæt/', pos: 'noun', bangla: 'আবাসস্থল', definition: 'the natural home or environment of an animal or plant', example: 'Many species lose their habitat due to urbanization.', topic: 'environment', band: 6 },
    { id: 'e13', word: 'extinct', ipa: '/ɪkˈstɪŋkt/', pos: 'adjective', bangla: 'বিলুপ্ত', definition: 'no longer in existence', example: 'Many animal species become extinct every year due to human activity.', topic: 'environment', band: 6 },
    { id: 'e14', word: 'emissions', ipa: '/ɪˈmɪʃənz/', pos: 'noun', bangla: 'গ্যাস নির্গমন', definition: 'substances discharged into the air, especially pollutants', example: 'Carbon emissions must be reduced to fight climate change.', topic: 'environment', band: 6 },
    { id: 'e15', word: 'scarcity', ipa: '/ˈskeəsɪti/', pos: 'noun', bangla: 'স্বল্পতা / অভাব', definition: 'the state of being in short supply', example: 'Water scarcity affects billions of people worldwide.', topic: 'environment', band: 7 },
    { id: 'e16', word: 'pollution', ipa: '/pəˈluːʃən/', pos: 'noun', bangla: 'দূষণ', definition: 'the presence of harmful substances in the environment', example: 'Air pollution is a major cause of respiratory illness.', topic: 'environment', band: 6 },

    // ── SOCIETY ──
    { id: 's01', word: 'inequality', ipa: '/ˌɪnɪˈkwɒlɪti/', pos: 'noun', bangla: 'অসমতা', definition: 'difference in social or economic circumstances', example: 'Income inequality has grown significantly in recent decades.', topic: 'society', band: 6 },
    { id: 's02', word: 'discrimination', ipa: '/dɪˌskrɪmɪˈneɪʃən/', pos: 'noun', bangla: 'বৈষম্য', definition: 'unjust treatment of different categories of people', example: 'Gender discrimination still exists in many workplaces.', topic: 'society', band: 6 },
    { id: 's03', word: 'urbanization', ipa: '/ˌɜːbənaɪˈzeɪʃən/', pos: 'noun', bangla: 'নগরায়ণ', definition: 'the process of an area becoming more urban', example: 'Rapid urbanization has caused housing shortages.', topic: 'society', band: 7 },
    { id: 's04', word: 'globalization', ipa: '/ˌɡləʊbəlaɪˈzeɪʃən/', pos: 'noun', bangla: 'বৈশ্বিকীকরণ', definition: 'the process of international integration and exchange', example: 'Globalization has both advantages and disadvantages.', topic: 'society', band: 7 },
    { id: 's05', word: 'migration', ipa: '/maɪˈɡreɪʃən/', pos: 'noun', bangla: 'অভিবাসন', definition: 'movement of people from one place to another', example: 'Economic migration is increasing in many regions.', topic: 'society', band: 6 },
    { id: 's06', word: 'poverty', ipa: '/ˈpɒvəti/', pos: 'noun', bangla: 'দারিদ্র্য', definition: 'the state of being extremely poor', example: 'Education is one of the best tools to reduce poverty.', topic: 'society', band: 6 },
    { id: 's07', word: 'cohesion', ipa: '/kəʊˈhiːʒən/', pos: 'noun', bangla: 'সামাজিক সংহতি', definition: 'unity and solidarity among members of a group', example: 'Social cohesion is essential for a stable society.', topic: 'society', band: 8 },
    { id: 's08', word: 'diverse', ipa: '/daɪˈvɜːs/', pos: 'adjective', bangla: 'বৈচিত্র্যময়', definition: 'showing a great deal of variety', example: 'Modern cities are culturally diverse places to live.', topic: 'society', band: 6 },
    { id: 's09', word: 'prejudice', ipa: '/ˈpredʒʊdɪs/', pos: 'noun', bangla: 'কুসংস্কার / পক্ষপাত', definition: 'preconceived unfair opinion not based on reason', example: 'Prejudice limits opportunities for many people.', topic: 'society', band: 7 },
    { id: 's10', word: 'marginalize', ipa: '/ˈmɑːdʒɪnəlaɪz/', pos: 'verb', bangla: 'প্রান্তিক করা', definition: 'to treat as unimportant or powerless', example: 'Poor communities are often marginalized by society.', topic: 'society', band: 8 },
    { id: 's11', word: 'empower', ipa: '/ɪmˈpaʊə/', pos: 'verb', bangla: 'ক্ষমতায়িত করা', definition: 'to give someone authority or the means to achieve goals', example: 'Education empowers women to achieve their full potential.', topic: 'society', band: 7 },
    { id: 's12', word: 'demographic', ipa: '/ˌdeməˈɡræfɪk/', pos: 'adjective', bangla: 'জনসংখ্যাগত', definition: 'relating to the structure or study of populations', example: 'Demographic changes are affecting many countries.', topic: 'society', band: 7 },
    { id: 's13', word: 'welfare', ipa: '/ˈwelfeə/', pos: 'noun', bangla: 'কল্যাণ', definition: 'the health, happiness, and safety of a person or group', example: 'Child welfare must always be a government priority.', topic: 'society', band: 6 },
    { id: 's14', word: 'segregation', ipa: '/ˌseɡrɪˈɡeɪʃən/', pos: 'noun', bangla: 'বিভাজন / বিচ্ছিন্নতা', definition: 'enforced separation of different groups', example: 'Racial segregation was legally abolished decades ago.', topic: 'society', band: 8 },
    { id: 's15', word: 'integration', ipa: '/ˌɪntɪˈɡreɪʃən/', pos: 'noun', bangla: 'একীভূতকরণ', definition: 'the process of combining parts into a whole', example: 'Cultural integration takes time and mutual respect.', topic: 'society', band: 7 },

    // ── TECHNOLOGY ──
    { id: 't01', word: 'innovation', ipa: '/ˌɪnəˈveɪʃən/', pos: 'noun', bangla: 'উদ্ভাবন', definition: 'a new method, idea, or product', example: 'Technological innovation drives economic growth.', topic: 'technology', band: 6 },
    { id: 't02', word: 'automation', ipa: '/ˌɔːtəˈmeɪʃən/', pos: 'noun', bangla: 'স্বয়ংক্রিয়করণ', definition: 'the use of technology to perform tasks automatically', example: 'Automation is threatening many traditional jobs.', topic: 'technology', band: 7 },
    { id: 't03', word: 'surveillance', ipa: '/səˈveɪləns/', pos: 'noun', bangla: 'নজরদারি', definition: 'close observation, especially by authorities', example: 'CCTV surveillance is increasing in public spaces.', topic: 'technology', band: 7 },
    { id: 't04', word: 'obsolete', ipa: '/ˈɒbsəliːt/', pos: 'adjective', bangla: 'সেকেলে / পুরনো', definition: 'no longer produced or used; out of date', example: 'Paper maps have become largely obsolete.', topic: 'technology', band: 7 },
    { id: 't05', word: 'sophisticated', ipa: '/səˈfɪstɪkeɪtɪd/', pos: 'adjective', bangla: 'পরিশীলিত / উন্নত', definition: 'highly developed and complex', example: 'Modern smartphones are increasingly sophisticated.', topic: 'technology', band: 7 },
    { id: 't06', word: 'algorithm', ipa: '/ˈælɡərɪðəm/', pos: 'noun', bangla: 'অ্যালগরিদম', definition: 'a set of rules followed by a computer to solve a problem', example: 'Search engines use complex algorithms to rank results.', topic: 'technology', band: 8 },
    { id: 't07', word: 'cybersecurity', ipa: '/ˈsaɪbəsɪˌkjʊərɪti/', pos: 'noun', bangla: 'সাইবার নিরাপত্তা', definition: 'protection of computer systems from digital attacks', example: 'Cybersecurity threats are growing rapidly worldwide.', topic: 'technology', band: 7 },
    { id: 't08', word: 'disruptive', ipa: '/dɪsˈrʌptɪv/', pos: 'adjective', bangla: 'ব্যাঘাতকারী', definition: 'causing major changes that shake established industries', example: 'Disruptive technology often changes entire industries overnight.', topic: 'technology', band: 8 },
    { id: 't09', word: 'virtual', ipa: '/ˈvɜːtʃuəl/', pos: 'adjective', bangla: 'ভার্চুয়াল / অনলাইন', definition: 'existing or occurring on computers or the internet', example: 'Virtual meetings have replaced many in-person gatherings.', topic: 'technology', band: 6 },
    { id: 't10', word: 'artificial intelligence', ipa: '/ˌɑːtɪˈfɪʃəl ɪnˈtelɪdʒəns/', pos: 'noun', bangla: 'কৃত্রিম বুদ্ধিমত্তা', definition: 'the simulation of human intelligence processes by machines', example: 'Artificial intelligence will transform the healthcare sector.', topic: 'technology', band: 7 },
    { id: 't11', word: 'digital literacy', ipa: '/ˈdɪdʒɪtəl ˈlɪtərəsi/', pos: 'noun', bangla: 'ডিজিটাল দক্ষতা', definition: 'the ability to use digital technologies effectively', example: 'Digital literacy is essential in the modern job market.', topic: 'technology', band: 7 },

    // ── HEALTH ──
    { id: 'h01', word: 'prevalent', ipa: '/ˈprevələnt/', pos: 'adjective', bangla: 'বিস্তৃত / প্রচলিত', definition: 'widespread in a particular area at a particular time', example: 'Obesity is prevalent in many developed nations.', topic: 'health', band: 7 },
    { id: 'h02', word: 'epidemic', ipa: '/ˌepɪˈdemɪk/', pos: 'noun', bangla: 'মহামারী', definition: 'a widespread occurrence of a disease in a community', example: 'The flu epidemic spread rapidly across several countries.', topic: 'health', band: 6 },
    { id: 'h03', word: 'chronic', ipa: '/ˈkrɒnɪk/', pos: 'adjective', bangla: 'দীর্ঘস্থায়ী', definition: 'persisting for a long time', example: 'He suffers from a chronic respiratory illness.', topic: 'health', band: 6 },
    { id: 'h04', word: 'sedentary', ipa: '/ˈsedəntri/', pos: 'adjective', bangla: 'নিষ্ক্রিয় / বসে থাকার', definition: 'tending to spend much time seated; physically inactive', example: 'A sedentary lifestyle significantly contributes to heart disease.', topic: 'health', band: 8 },
    { id: 'h05', word: 'obesity', ipa: '/əʊˈbiːsɪti/', pos: 'noun', bangla: 'স্থূলতা', definition: 'the condition of being extremely overweight', example: 'Childhood obesity rates have tripled in the past 30 years.', topic: 'health', band: 6 },
    { id: 'h06', word: 'mortality', ipa: '/mɔːˈtælɪti/', pos: 'noun', bangla: 'মৃত্যুহার', definition: 'the rate of death in a given population', example: 'Infant mortality has declined significantly worldwide.', topic: 'health', band: 7 },
    { id: 'h07', word: 'alleviate', ipa: '/əˈliːvieɪt/', pos: 'verb', bangla: 'লাঘব করা', definition: 'to make suffering or a problem less severe', example: 'Exercise helps alleviate symptoms of depression.', topic: 'health', band: 8 },
    { id: 'h08', word: 'malnutrition', ipa: '/ˌmælnjuːˈtrɪʃən/', pos: 'noun', bangla: 'অপুষ্টি', definition: 'lack of proper nutrition due to an inadequate diet', example: 'Malnutrition affects millions of children globally.', topic: 'health', band: 7 },
    { id: 'h09', word: 'eradicate', ipa: '/ɪˈrædɪkeɪt/', pos: 'verb', bangla: 'নির্মূল করা', definition: 'to destroy or eliminate something completely', example: 'Vaccination campaigns have nearly eradicated polio.', topic: 'health', band: 7 },
    { id: 'h10', word: 'susceptible', ipa: '/səˈseptɪbəl/', pos: 'adjective', bangla: 'সংবেদনশীল / ঝুঁকিপূর্ণ', definition: 'likely to be influenced or harmed by something', example: 'Elderly people are more susceptible to infections.', topic: 'health', band: 8 },
    { id: 'h11', word: 'therapeutic', ipa: '/ˌθerəˈpjuːtɪk/', pos: 'adjective', bangla: 'চিকিৎসামূলক', definition: 'relating to the healing of disease', example: 'Music has proven therapeutic benefits for mental health.', topic: 'health', band: 8 },
    { id: 'h12', word: 'pandemic', ipa: '/pænˈdemɪk/', pos: 'noun', bangla: 'বৈশ্বিক মহামারী', definition: 'an epidemic occurring worldwide or over a very wide area', example: 'The COVID-19 pandemic affected every country on earth.', topic: 'health', band: 7 },

    // ── EDUCATION ──
    { id: 'ed01', word: 'curriculum', ipa: '/kəˈrɪkjʊləm/', pos: 'noun', bangla: 'পাঠ্যক্রম', definition: 'the subjects comprising a course of study', example: 'The curriculum needs to include more digital literacy skills.', topic: 'education', band: 6 },
    { id: 'ed02', word: 'vocational', ipa: '/vəʊˈkeɪʃənəl/', pos: 'adjective', bangla: 'বৃত্তিমূলক', definition: 'relating to the skills needed for a particular job', example: 'Vocational training prepares students for specific careers.', topic: 'education', band: 7 },
    { id: 'ed03', word: 'compulsory', ipa: '/kəmˈpʌlsəri/', pos: 'adjective', bangla: 'বাধ্যতামূলক', definition: 'required by law or a rule; obligatory', example: 'Education is compulsory until the age of 16 in many countries.', topic: 'education', band: 6 },
    { id: 'ed04', word: 'scholarship', ipa: '/ˈskɒləʃɪp/', pos: 'noun', bangla: 'বৃত্তি', definition: 'a grant awarded to support a student\'s education', example: 'She received a scholarship to study abroad.', topic: 'education', band: 6 },
    { id: 'ed05', word: 'literacy', ipa: '/ˈlɪtərəsi/', pos: 'noun', bangla: 'সাক্ষরতা', definition: 'the ability to read and write', example: 'Improving literacy rates is a global development priority.', topic: 'education', band: 6 },
    { id: 'ed06', word: 'facilitate', ipa: '/fəˈsɪlɪteɪt/', pos: 'verb', bangla: 'সহজ করা', definition: 'to make an action or process easier', example: 'Technology facilitates learning in new and exciting ways.', topic: 'education', band: 7 },
    { id: 'ed07', word: 'tuition', ipa: '/tjuːˈɪʃən/', pos: 'noun', bangla: 'টিউশন / শিক্ষাব্যয়', definition: 'teaching, or the fee charged for it', example: 'University tuition fees are rising every year.', topic: 'education', band: 6 },
    { id: 'ed08', word: 'acquire', ipa: '/əˈkwaɪə/', pos: 'verb', bangla: 'অর্জন করা', definition: 'to gain knowledge or a skill', example: 'Students acquire crucial skills through practical experience.', topic: 'education', band: 6 },
    { id: 'ed09', word: 'academic', ipa: '/ˌækəˈdemɪk/', pos: 'adjective', bangla: 'একাডেমিক / শিক্ষাগত', definition: 'relating to education and scholarship', example: 'Strong academic performance improves career prospects.', topic: 'education', band: 6 },

    // ── ECONOMY ──
    { id: 'ec01', word: 'inflation', ipa: '/ɪnˈfleɪʃən/', pos: 'noun', bangla: 'মুদ্রাস্ফীতি', definition: 'a general increase in prices over time', example: 'High inflation reduces people\'s purchasing power significantly.', topic: 'economy', band: 6 },
    { id: 'ec02', word: 'recession', ipa: '/rɪˈseʃən/', pos: 'noun', bangla: 'অর্থনৈতিক মন্দা', definition: 'a period of temporary economic decline', example: 'The global recession caused widespread unemployment.', topic: 'economy', band: 6 },
    { id: 'ec03', word: 'entrepreneur', ipa: '/ˌɒntrəprəˈnɜː/', pos: 'noun', bangla: 'উদ্যোক্তা', definition: 'a person who sets up and runs a business', example: 'Young entrepreneurs are driving technological innovation.', topic: 'economy', band: 7 },
    { id: 'ec04', word: 'prosperity', ipa: '/prɒˈsperɪti/', pos: 'noun', bangla: 'সমৃদ্ধি', definition: 'a state of wealth and success', example: 'Education is a key driver of long-term national prosperity.', topic: 'economy', band: 7 },
    { id: 'ec05', word: 'deficit', ipa: '/ˈdefɪsɪt/', pos: 'noun', bangla: 'ঘাটতি', definition: 'an excess of expenditure over income', example: 'The government is struggling with a large budget deficit.', topic: 'economy', band: 7 },
    { id: 'ec06', word: 'fiscal', ipa: '/ˈfɪskəl/', pos: 'adjective', bangla: 'রাজকোষীয় / আর্থিক', definition: 'relating to government revenue and taxation', example: 'Fiscal policy directly affects economic growth.', topic: 'economy', band: 8 },
    { id: 'ec07', word: 'commodity', ipa: '/kəˈmɒdɪti/', pos: 'noun', bangla: 'পণ্যসামগ্রী', definition: 'a raw material or agricultural product', example: 'Oil remains the world\'s most valuable commodity.', topic: 'economy', band: 7 },
    { id: 'ec08', word: 'subsidize', ipa: '/ˈsʌbsɪdaɪz/', pos: 'verb', bangla: 'ভর্তুকি দেওয়া', definition: 'to support financially through grants or subsidies', example: 'The government subsidizes public transport to reduce costs.', topic: 'economy', band: 7 },
    { id: 'ec09', word: 'revenue', ipa: '/ˈrevɪnjuː/', pos: 'noun', bangla: 'রাজস্ব / আয়', definition: 'income, especially of a government or organization', example: 'Tax revenue funds essential public services.', topic: 'economy', band: 7 },
    { id: 'ec10', word: 'expenditure', ipa: '/ɪkˈspendɪtʃə/', pos: 'noun', bangla: 'ব্যয় / খরচ', definition: 'the action of spending money', example: 'Public expenditure on healthcare is increasing.', topic: 'economy', band: 7 },

    // ── GOVERNMENT ──
    { id: 'g01', word: 'legislation', ipa: '/ˌledʒɪˈsleɪʃən/', pos: 'noun', bangla: 'আইন', definition: 'laws collectively; the process of making laws', example: 'New legislation was passed to protect workers\' rights.', topic: 'government', band: 6 },
    { id: 'g02', word: 'democracy', ipa: '/dɪˈmɒkrəsi/', pos: 'noun', bangla: 'গণতন্ত্র', definition: 'a system of government by the whole population', example: 'Democracy requires active citizen participation to function.', topic: 'government', band: 6 },
    { id: 'g03', word: 'bureaucracy', ipa: '/bjʊəˈrɒkrəsi/', pos: 'noun', bangla: 'আমলাতন্ত্র', definition: 'a system of government with complex rules and procedures', example: 'Excessive bureaucracy often slows down decision-making.', topic: 'government', band: 8 },
    { id: 'g04', word: 'corruption', ipa: '/kəˈrʌpʃən/', pos: 'noun', bangla: 'দুর্নীতি', definition: 'dishonest conduct by those in power', example: 'Government corruption undermines public trust in institutions.', topic: 'government', band: 6 },
    { id: 'g05', word: 'regulate', ipa: '/ˈreɡjʊleɪt/', pos: 'verb', bangla: 'নিয়ন্ত্রণ করা', definition: 'to control or supervise by means of rules', example: 'Governments regulate food safety standards strictly.', topic: 'government', band: 6 },
    { id: 'g06', word: 'implement', ipa: '/ˈɪmplɪment/', pos: 'verb', bangla: 'বাস্তবায়ন করা', definition: 'to put a decision or plan into effect', example: 'It is challenging to implement effective policy changes quickly.', topic: 'government', band: 6 },
    { id: 'g07', word: 'accountability', ipa: '/əˌkaʊntəˈbɪlɪti/', pos: 'noun', bangla: 'জবাবদিহিতা', definition: 'the obligation to accept responsibility for one\'s actions', example: 'Governments need greater accountability to their citizens.', topic: 'government', band: 8 },
    { id: 'g08', word: 'transparent', ipa: '/trænsˈpærənt/', pos: 'adjective', bangla: 'স্বচ্ছ', definition: 'open to public scrutiny; without hidden agendas', example: 'Democratic governments should be transparent in their actions.', topic: 'government', band: 7 },
    { id: 'g09', word: 'sovereignty', ipa: '/ˈsɒvrənti/', pos: 'noun', bangla: 'সার্বভৌমত্ব', definition: 'supreme power or authority of a state', example: 'Nations guard their sovereignty carefully against foreign influence.', topic: 'government', band: 8 },
    { id: 'g10', word: 'sanctions', ipa: '/ˈsæŋkʃənz/', pos: 'noun', bangla: 'নিষেধাজ্ঞা', definition: 'penalties imposed to force compliance', example: 'Economic sanctions were imposed on the country.', topic: 'government', band: 7 },

    // ── CRIME ──
    { id: 'c01', word: 'rehabilitation', ipa: '/ˌriːəˌbɪlɪˈteɪʃən/', pos: 'noun', bangla: 'পুনর্বাসন', definition: 'restoring someone to a normal life through therapy and training', example: 'Prison rehabilitation programs significantly reduce reoffending rates.', topic: 'crime', band: 7 },
    { id: 'c02', word: 'deterrent', ipa: '/dɪˈterənt/', pos: 'noun', bangla: 'প্রতিবন্ধক', definition: 'something that discourages an action', example: 'Stricter laws can act as a deterrent to potential criminals.', topic: 'crime', band: 8 },
    { id: 'c03', word: 'juvenile', ipa: '/ˈdʒuːvənaɪl/', pos: 'adjective', bangla: 'কিশোর / অপ্রাপ্তবয়স্ক', definition: 'relating to young people', example: 'Juvenile crime rates have risen in many urban areas.', topic: 'crime', band: 7 },
    { id: 'c04', word: 'prosecute', ipa: '/ˈprɒsɪkjuːt/', pos: 'verb', bangla: 'আইনি পদক্ষেপ নেওয়া', definition: 'to institute legal proceedings against someone', example: 'The company was prosecuted for environmental violations.', topic: 'crime', band: 7 },
    { id: 'c05', word: 'verdict', ipa: '/ˈvɜːdɪkt/', pos: 'noun', bangla: 'রায়', definition: 'a decision reached by a jury or judge', example: 'The jury reached a guilty verdict after three days of deliberation.', topic: 'crime', band: 6 },
    { id: 'c06', word: 'penalty', ipa: '/ˈpenəlti/', pos: 'noun', bangla: 'জরিমানা / শাস্তি', definition: 'a punishment for breaking a rule or law', example: 'The penalty for drunk driving has been increased.', topic: 'crime', band: 6 },

    // ── MEDIA ──
    { id: 'm01', word: 'propaganda', ipa: '/ˌprɒpəˈɡændə/', pos: 'noun', bangla: 'প্রচারণা', definition: 'biased information used to promote a particular viewpoint', example: 'State-controlled media often spreads propaganda.', topic: 'media', band: 7 },
    { id: 'm02', word: 'censorship', ipa: '/ˈsensəʃɪp/', pos: 'noun', bangla: 'সেন্সরশিপ', definition: 'suppression of speech or public communication', example: 'Internet censorship limits freedom of expression.', topic: 'media', band: 7 },
    { id: 'm03', word: 'bias', ipa: '/ˈbaɪəs/', pos: 'noun', bangla: 'পক্ষপাত', definition: 'prejudice in favour of or against one thing', example: 'Media bias can significantly affect public opinion.', topic: 'media', band: 6 },
    { id: 'm04', word: 'credible', ipa: '/ˈkredɪbəl/', pos: 'adjective', bangla: 'বিশ্বাসযোগ্য', definition: 'able to be trusted or believed', example: 'Always use credible sources when researching a topic.', topic: 'media', band: 7 },
    { id: 'm05', word: 'misinformation', ipa: '/ˌmɪsɪnfəˈmeɪʃən/', pos: 'noun', bangla: 'ভুল তথ্য', definition: 'false or inaccurate information', example: 'Misinformation spreads rapidly on social media platforms.', topic: 'media', band: 7 },

    // ── TRANSPORT ──
    { id: 'tr01', word: 'infrastructure', ipa: '/ˈɪnfrəˌstrʌktʃə/', pos: 'noun', bangla: 'অবকাঠামো', definition: 'the basic physical systems of a country', example: 'Investment in transport infrastructure is essential for growth.', topic: 'transport', band: 6 },
    { id: 'tr02', word: 'congestion', ipa: '/kənˈdʒestʃən/', pos: 'noun', bangla: 'যানজট', definition: 'heavy traffic causing a blockage', example: 'Traffic congestion wastes billions of hours annually.', topic: 'transport', band: 6 },
    { id: 'tr03', word: 'commute', ipa: '/kəˈmjuːt/', pos: 'verb', bangla: 'নিয়মিত যাতায়াত করা', definition: 'to travel regularly between home and work', example: 'Many people commute long distances to work each day.', topic: 'transport', band: 6 },
    { id: 'tr04', word: 'pedestrian', ipa: '/pəˈdestriən/', pos: 'noun', bangla: 'পথচারী', definition: 'a person walking rather than using transport', example: 'Cities need safer crossings and paths for pedestrians.', topic: 'transport', band: 6 },
    { id: 'tr05', word: 'transit', ipa: '/ˈtrænsɪt/', pos: 'noun', bangla: 'গণপরিবহন', definition: 'the carrying of people by public transport', example: 'Investing in public transit reduces road congestion significantly.', topic: 'transport', band: 7 },

    // ── GENERAL ACADEMIC ──
    { id: 'gen01', word: 'significant', ipa: '/sɪɡˈnɪfɪkənt/', pos: 'adjective', bangla: 'উল্লেখযোগ্য', definition: 'sufficiently great or important to be worthy of attention', example: 'There has been significant progress in renewable energy.', topic: 'general', band: 6 },
    { id: 'gen02', word: 'substantial', ipa: '/səbˈstænʃəl/', pos: 'adjective', bangla: 'যথেষ্ট / উল্লেখযোগ্য', definition: 'of considerable importance, size, or value', example: 'Substantial evidence supports this theory.', topic: 'general', band: 6 },
    { id: 'gen03', word: 'phenomenon', ipa: '/fɪˈnɒmɪnən/', pos: 'noun', bangla: 'ঘটনা / প্রপঞ্চ', definition: 'a fact or event that is observed to exist', example: 'Social media is a truly global phenomenon.', topic: 'general', band: 7 },
    { id: 'gen04', word: 'advocate', ipa: '/ˈædvəkeɪt/', pos: 'verb', bangla: 'সমর্থন করা', definition: 'to publicly support or recommend a cause', example: 'Many scientists advocate for urgent climate action.', topic: 'general', band: 7 },
    { id: 'gen05', word: 'prominent', ipa: '/ˈprɒmɪnənt/', pos: 'adjective', bangla: 'বিশিষ্ট', definition: 'important or well-known', example: 'She is a prominent figure in environmental policy.', topic: 'general', band: 7 },
    { id: 'gen06', word: 'contradict', ipa: '/ˌkɒntrəˈdɪkt/', pos: 'verb', bangla: 'বিরোধিতা করা', definition: 'to assert the opposite of another statement', example: 'New research contradicts the previous findings.', topic: 'general', band: 7 },
    { id: 'gen07', word: 'inevitable', ipa: '/ɪnˈevɪtəbəl/', pos: 'adjective', bangla: 'অনিবার্য', definition: 'certain to happen and unable to be avoided', example: 'Technological change is inevitable in modern society.', topic: 'general', band: 7 },
    { id: 'gen08', word: 'ambiguous', ipa: '/æmˈbɪɡjuəs/', pos: 'adjective', bangla: 'দ্ব্যর্থবোধক', definition: 'open to more than one interpretation', example: 'The question was ambiguous and confused many students.', topic: 'general', band: 8 },
    { id: 'gen09', word: 'profound', ipa: '/prəˈfaʊnd/', pos: 'adjective', bangla: 'গভীর / সুদূরপ্রসারী', definition: 'very great or intense in effect', example: 'Technology has had a profound impact on modern society.', topic: 'general', band: 7 },
    { id: 'gen10', word: 'enhance', ipa: '/ɪnˈhɑːns/', pos: 'verb', bangla: 'উন্নত করা', definition: 'to intensify, increase, or improve', example: 'Regular exercise enhances both physical and mental health.', topic: 'general', band: 6 },
    { id: 'gen11', word: 'diminish', ipa: '/dɪˈmɪnɪʃ/', pos: 'verb', bangla: 'হ্রাস পাওয়া', definition: 'to make or become less', example: 'Air pollution diminishes quality of life in major cities.', topic: 'general', band: 7 },
    { id: 'gen12', word: 'assess', ipa: '/əˈses/', pos: 'verb', bangla: 'মূল্যায়ন করা', definition: 'to evaluate or estimate the nature of something', example: 'Teachers regularly assess student progress and performance.', topic: 'general', band: 6 },
    { id: 'gen13', word: 'justify', ipa: '/ˈdʒʌstɪfaɪ/', pos: 'verb', bangla: 'ন্যায্যতা দেওয়া', definition: 'to show or prove to be right or reasonable', example: 'The results justify the high cost of the research project.', topic: 'general', band: 7 },
    { id: 'gen14', word: 'fundamental', ipa: '/ˌfʌndəˈmentəl/', pos: 'adjective', bangla: 'মৌলিক', definition: 'forming a necessary base or core; of central importance', example: 'Access to education is a fundamental human right.', topic: 'general', band: 6 },
    { id: 'gen15', word: 'crucial', ipa: '/ˈkruːʃəl/', pos: 'adjective', bangla: 'অত্যন্ত গুরুত্বপূর্ণ', definition: 'of great importance, especially in achieving success', example: 'Time management is crucial for success in IELTS.', topic: 'general', band: 6 },
    { id: 'gen16', word: 'eliminate', ipa: '/ɪˈlɪmɪneɪt/', pos: 'verb', bangla: 'নির্মূল করা', definition: 'to completely remove or get rid of', example: 'We must eliminate wasteful spending from the budget.', topic: 'general', band: 6 },
    { id: 'gen17', word: 'contemporary', ipa: '/kənˈtempərəri/', pos: 'adjective', bangla: 'সমসাময়িক', definition: 'belonging to the present time; modern', example: 'Contemporary society faces many complex challenges.', topic: 'general', band: 7 },
    { id: 'gen18', word: 'ideology', ipa: '/ˌaɪdiˈɒlədʒi/', pos: 'noun', bangla: 'আদর্শ / মতবাদ', definition: 'a system of ideas and ideals forming a political or social theory', example: 'Political ideology directly shapes government policy.', topic: 'general', band: 8 },
    { id: 'gen19', word: 'perspective', ipa: '/pəˈspektɪv/', pos: 'noun', bangla: 'দৃষ্টিভঙ্গি', definition: 'a particular way of thinking about something', example: 'It is important to consider the issue from multiple perspectives.', topic: 'general', band: 7 },
    { id: 'gen20', word: 'controversial', ipa: '/ˌkɒntrəˈvɜːʃəl/', pos: 'adjective', bangla: 'বিতর্কিত', definition: 'causing or likely to cause disagreement or debate', example: 'Capital punishment remains a highly controversial topic.', topic: 'general', band: 6 },
    { id: 'gen21', word: 'indicate', ipa: '/ˈɪndɪkeɪt/', pos: 'verb', bangla: 'নির্দেশ করা', definition: 'to point out or show something', example: 'Research indicates a strong link between diet and health.', topic: 'general', band: 6 },
    { id: 'gen22', word: 'proportion', ipa: '/prəˈpɔːʃən/', pos: 'noun', bangla: 'অনুপাত', definition: 'a part, share, or number considered in relation to a whole', example: 'A large proportion of adults do not exercise regularly.', topic: 'general', band: 6 },
    { id: 'gen23', word: 'demonstrate', ipa: '/ˈdemənstreɪt/', pos: 'verb', bangla: 'প্রদর্শন করা', definition: 'to clearly show the existence or truth of', example: 'The results clearly demonstrate a significant improvement.', topic: 'general', band: 6 },
    { id: 'gen24', word: 'contribute', ipa: '/kənˈtrɪbjuːt/', pos: 'verb', bangla: 'অবদান রাখা', definition: 'to help cause or bring about something', example: 'Regular exercise contributes greatly to better health.', topic: 'general', band: 6 },
    { id: 'gen25', word: 'impact', ipa: '/ˈɪmpækt/', pos: 'noun', bangla: 'প্রভাব', definition: 'a strong effect or influence on something', example: 'Climate change is having a major global impact.', topic: 'general', band: 6 },
    { id: 'gen26', word: 'strategy', ipa: '/ˈstrætɪdʒi/', pos: 'noun', bangla: 'কৌশল', definition: 'a plan of action designed to achieve a long-term goal', example: 'A comprehensive strategy is needed to tackle poverty.', topic: 'general', band: 6 },
    { id: 'gen27', word: 'adequate', ipa: '/ˈædɪkwɪt/', pos: 'adjective', bangla: 'পর্যাপ্ত', definition: 'satisfactory or acceptable in quality or quantity', example: 'Adequate funding is essential for quality public healthcare.', topic: 'general', band: 6 },
    { id: 'gen28', word: 'alternative', ipa: '/ɔːlˈtɜːnətɪv/', pos: 'noun', bangla: 'বিকল্প', definition: 'one of two or more available possibilities', example: 'We urgently need alternatives to fossil fuels.', topic: 'general', band: 6 },
    { id: 'gen29', word: 'majority', ipa: '/məˈdʒɒrɪti/', pos: 'noun', bangla: 'সংখ্যাগরিষ্ঠ', definition: 'the greater number or part', example: 'The majority of people support stronger environmental laws.', topic: 'general', band: 6 },
    { id: 'gen30', word: 'minority', ipa: '/maɪˈnɒrɪti/', pos: 'noun', bangla: 'সংখ্যালঘু', definition: 'the smaller number or part of a group', example: 'Minority rights must always be protected by law.', topic: 'general', band: 6 },
    { id: 'gen31', word: 'consequently', ipa: '/ˈkɒnsɪkwəntli/', pos: 'adverb', bangla: 'ফলস্বরূপ', definition: 'as a result or effect of something', example: 'The factory closed; consequently, many workers lost their jobs.', topic: 'general', band: 7 },
    { id: 'gen32', word: 'furthermore', ipa: '/ˌfɜːðəˈmɔː/', pos: 'adverb', bangla: 'তদুপরি', definition: 'in addition; as an extra or further matter', example: 'Furthermore, studies show that regular sleep improves memory.', topic: 'general', band: 7 },
    { id: 'gen33', word: 'nevertheless', ipa: '/ˌnevəðəˈles/', pos: 'adverb', bangla: 'তথাপি / তবুও', definition: 'in spite of that; however', example: 'The task was difficult; nevertheless, they succeeded.', topic: 'general', band: 7 },
    { id: 'gen34', word: 'approximately', ipa: '/əˈprɒksɪmɪtli/', pos: 'adverb', bangla: 'প্রায়', definition: 'used to show that something is almost but not exactly accurate', example: 'Approximately 60% of adults use social media daily.', topic: 'general', band: 6 },
    { id: 'gen35', word: 'subsequent', ipa: '/ˈsʌbsɪkwənt/', pos: 'adjective', bangla: 'পরবর্তী', definition: 'coming after or following something', example: 'Subsequent research confirmed the initial findings.', topic: 'general', band: 7 },
    { id: 'gen36', word: 'emphasis', ipa: '/ˈemfəsɪs/', pos: 'noun', bangla: 'জোর / গুরুত্ব', definition: 'special importance given to something', example: 'There is increasing emphasis on achieving work-life balance.', topic: 'general', band: 7 },
    { id: 'gen37', word: 'potential', ipa: '/pəˈtenʃəl/', pos: 'noun', bangla: 'সম্ভাবনা', definition: 'latent qualities or abilities that may develop and succeed', example: 'Every student has the potential to achieve great things.', topic: 'general', band: 6 },
    { id: 'gen38', word: 'circumstance', ipa: '/ˈsɜːkəmstəns/', pos: 'noun', bangla: 'পরিস্থিতি', definition: 'a fact or condition connected with an event or action', example: 'The circumstances have changed dramatically since then.', topic: 'general', band: 7 },
    { id: 'gen39', word: 'perceive', ipa: '/pəˈsiːv/', pos: 'verb', bangla: 'উপলব্ধি করা', definition: 'to become aware of or understand something', example: 'People perceive the issue very differently depending on culture.', topic: 'general', band: 7 },
    { id: 'gen40', word: 'exacerbate', ipa: '/ɪɡˈzæsəbeɪt/', pos: 'verb', bangla: 'আরো খারাপ করা', definition: 'to make a problem or bad situation worse', example: 'Cutting public funding will exacerbate the housing crisis.', topic: 'general', band: 8 },
];
