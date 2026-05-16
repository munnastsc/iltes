// Cambridge IELTS 9–15 Academic Reading — Answer Keys
// Source: ieltsprogress.com, ieltstrainingonline.com
// Format: answers[i] = Q(i+1) correct answer; "" = not available
// Multiple accepted: "/" separator (e.g. "three/3"); alternatives: "A,B"

export interface ReadingAnswer {
    correct_answer: string;
    explanation: string;
}

export interface ReadingTestData {
    book: number;
    test: number;
    pdfPath: string;
    passages: string[];
    answers: ReadingAnswer[];
    totalQuestions: number;
    // legacy fields kept for fallback
    passage_text?: string;
    question_text?: string;
}

type RawEntry = {
    book: number;
    test: number;
    passages: [string, string, string];
    a: string[]; // 40 answers
};

const PDF: Record<number, string> = {
    9:  '/pdfs/cambridge/Cambridge%20IELTS%2009%20www.iac-uk.com.pdf',
    10: '/pdfs/cambridge/Cambridge%20IELTS%2010%20www.iac-uk.com.pdf',
    11: '/pdfs/cambridge/Cambridge%20IELTS%2011%20AC%20www.iac-uk.com.pdf',
    12: '/pdfs/cambridge/Cambridge%20IELTS%2012%20www.iac-uk.com.pdf',
    13: '/pdfs/cambridge/Cambridge%20IELTS%2013%20www.iac-uk.com.pdf',
    14: '/pdfs/cambridge/Cambridge%20IELTS%2014%20www.iac-uk.com.pdf',
    15: '/pdfs/cambridge/Cambridge%20IELTS%2015.pdf',
};

const RAW: RawEntry[] = [
    // ─── Cambridge 9 ──────────────────────────────────────────────────────────
    {
        book: 9, test: 1,
        passages: ['William Henry Perkin', 'Is there anybody out there?', 'The history of the tortoise'],
        a: ['FALSE','NOT GIVEN','FALSE','TRUE','NOT GIVEN','TRUE','NOT GIVEN',
            'the rich','commercial possibilities','mauve','robert pullar','france','malaria',
            'iv','vii','i','ii','several billion years','radio waves','1000',
            'YES','YES','NOT GIVEN','NO','NOT GIVEN','NO',
            'plants','breathing/reproduction','gills','dolphins',
            'NOT GIVEN','FALSE','TRUE',
            '3 measurements/three measurements','triangular graph','cluster','amphibious','halfway/half way','dry-land tortoises','D'],
    },
    {
        book: 9, test: 2,
        passages: ['Venus in transit', 'Hearing impairment', 'A neuroscientist reveals how to think differently'],
        a: ['H','C','B','I','D','A',
            'two decades','crowd noise','invisible','Objective 3','A,C','A,C','C',
            'F','D','G','E','D','A','B','C',
            'FALSE','FALSE','TRUE','NOT GIVEN','TRUE',
            'C','B','D','C','B',
            'YES','YES','NOT GIVEN','NO','NOT GIVEN','NO','A','B','C'],
    },
    {
        book: 9, test: 3,
        passages: ['Attitudes to language', 'Tidal Power', 'Information theory – the big idea'],
        a: ['ii','i','v','vii',
            'TRUE','NOT GIVEN','NOT GIVEN','TRUE','NOT GIVEN','FALSE',
            'source of income/industry','employer','domestic tourism',
            'C','B','H','B','E','sunlight/sun','upper','dry','north',
            'FALSE','TRUE','NOT GIVEN','B',
            'B','F','I','G','D','C',
            'A','D','C',
            'NO','YES','NOT GIVEN','YES','NOT GIVEN'],
    },
    {
        book: 9, test: 4,
        passages: ['The life and work of Marie Curie', "Young children's sense of identity", 'The development of Museums'],
        a: ['FALSE','NOT GIVEN','TRUE','FALSE','TRUE','NOT GIVEN',
            'thorium','pitchblende','radium','soldiers','illness','neutron','leukaemia',
            'G','C','G','D','H','E','D','B','E',
            'C','mirror','communication','ownership',
            'ii','vi','i','iii','B','A',
            'D','D','C','B',
            'FALSE','NOT GIVEN','FALSE','TRUE'],
    },

    // ─── Cambridge 10 ─────────────────────────────────────────────────────────
    {
        book: 10, test: 1,
        passages: ['Stepwells', 'European Transport Systems 1990–2010', 'The Psychology of Innovation'],
        a: ['FALSE','TRUE','NOT GIVEN','NOT GIVEN','TRUE',
            'pavilions','drought','tourists','earthquake','4 sides/four sides','tank','verandas/verandahs','underwater',
            'viii','iii','xi','i','v','x','ii','iv',
            'TRUE','FALSE','NOT GIVEN','NOT GIVEN','FALSE',
            'C','A','D','B','G','E','A','F','B',
            'NO','YES','NOT GIVEN','NOT GIVEN','NO'],
    },
    {
        book: 10, test: 2,
        passages: ['Tea and the Industrial Revolution', 'Gifted Children and Learning', 'Museums of Fine Art and Their Public'],
        a: ['iv','viii','vii','i','vi','ix','ii',
            'NOT GIVEN','TRUE','FALSE','FALSE','NOT GIVEN','TRUE',
            'A','D','F','D','B','D','E','A','C',
            'books and activities','internal regulation/self-regulation','emotional awareness','spoon-feeding',
            'B','H','L','G','D','C','D','A','D',
            'NOT GIVEN','NO','YES','NOT GIVEN','NO'],
    },
    {
        book: 10, test: 3,
        passages: ['The Context, Meaning and Scope of Tourism', 'Autumn Leaves', 'Beyond the Blue Horizon'],
        a: ['ii','i','v','vii',
            'TRUE','NOT GIVEN','NOT GIVEN','TRUE','NOT GIVEN','FALSE',
            'source of income/industry','employer','domestic tourism',
            'C','B','H','B','E','sunlight/sun','upper','dry','north',
            'FALSE','TRUE','NOT GIVEN','B',
            'B','F','I','G','D','C',
            'A','D','C',
            'NO','YES','NOT GIVEN','YES','NOT GIVEN'],
    },
    {
        book: 10, test: 4,
        passages: ['The Megafires of California', 'Second Nature', 'When Evolution Runs Backwards'],
        a: ['spread','10 times/ten times','below','fuel','seasons','homes/housing',
            'TRUE','FALSE','TRUE','TRUE','NOT GIVEN','FALSE','FALSE',
            'transformation/change','young age','optimism','skills/techniques','negative emotions/feelings',
            'E','C','G','A','E','C','G','H',
            'C','D','C','B','A','F','G','A','B','D',
            'NOT GIVEN','YES','NO','YES'],
    },

    // ─── Cambridge 11 ─────────────────────────────────────────────────────────
    {
        book: 11, test: 1,
        passages: ['Vertical Farming', 'The Falkirk Wheel', 'Geo-engineering'],
        a: ['update','urban centres/urban centers','energy','fossil fuels','artificial','stacked trays/trays','urban rooftops/rooftops',
            'NOT GIVEN','TRUE','FALSE','TRUE','FALSE','TRUE',
            'FALSE','NOT GIVEN','TRUE','NOT GIVEN','FALSE','TRUE',
            'gates','clamp','axle','cogs','aqueduct','wall','locks',
            'B','B','A','sunshade','iron','algae','clouds','cables','snow','rivers',
            'B','D','C','A'],
    },
    {
        book: 11, test: 2,
        passages: ['Raising the Mary Rose', 'Polynesian Migration', 'The Search for Artemis'],
        a: ['TRUE','NOT GIVEN','TRUE','FALSE','C','B','G','A',
            'lifting frame','hydraulic jacks','stabbing guides','lifting cradle','air bags',
            'ii','ix','viii','i','iv','vii','vi',
            'farming','canoes','birds','wood','B','C',
            'C','D','B','A','C','B','H',
            'NOT GIVEN','YES','NO','NO','YES','NOT GIVEN','A'],
    },
    {
        book: 11, test: 3,
        passages: ['Silk', 'Animal Migration', 'Mathematics for General Readers'],
        a: ['tea','reel','women','royalty','currency','paper','wool','monks','nylon',
            'FALSE','TRUE','FALSE','NOT GIVEN',
            'FALSE','TRUE','NOT GIVEN','TRUE','FALSE',
            'G','C','A','E','speed','plains','bottlenecks','corridor',
            'D','B','G','C','B','E','A','F',
            'beginner','arithmetic','intuitive','scientists','experiments','theorems'],
    },
    {
        book: 11, test: 4,
        passages: ['Nature and Nurture', 'The Role of Sound in Film', 'Language and Communication'],
        a: ['FALSE','NOT GIVEN','NOT GIVEN','TRUE',
            'A','C','B','A','B','D','B','E','F',
            'C','A','B','D','C',
            'TRUE','TRUE','NOT GIVEN','TRUE','FALSE',
            'C','A','E',
            'vi','iv','ii','vii','i','v',
            'E','G','B','F',
            'NO','YES','NOT GIVEN','YES'],
    },

    // ─── Cambridge 12 ─────────────────────────────────────────────────────────
    {
        book: 12, test: 1,
        passages: ['Cork', 'Collecting as a Hobby', 'Arson for Profit'],
        a: ['NOT GIVEN','FALSE','FALSE','TRUE','TRUE',
            'taste','cheaper','convenient','image','sustainable','recycled','biodiversity','desertification',
            'antiques','triumph','information','contact/meetings','hunt/desire','aimless/empty','educational','trainspotting',
            'NOT GIVEN','FALSE','NOT GIVEN','TRUE','TRUE',
            'vi','viii','ii','iv','iii','vii',
            'fire science','investigators','evidence','prosecution',
            'NOT GIVEN','YES','NO','NO'],
    },
    {
        book: 12, test: 2,
        passages: ['Food Production and Farming', 'Bingham and Machu Picchu', 'Bilingualism and Cognition'],
        a: ['A','B','H','D','B','C','G','B','A','D','E','C','D',
            'iv','vi','viii','v','i','vii','iii',
            'B','FALSE','FALSE','NOT GIVEN','rubber','farmer',
            'eye movements','language co-activation','Stroop Task','conflict management','cognitive control',
            'YES','NOT GIVEN','NO','NO','NOT GIVEN',
            'D','G','B','C'],
    },
    {
        book: 12, test: 3,
        passages: ['The Galápagos Islands', 'Health Geography', 'Music and the Brain'],
        a: ['v','iii','viii','i','iv','vi','ii',
            'pirates','food','oil','settlers','species','eggs',
            'D','C','F','G','D','B',
            'vaccinations','antibiotics','mosquitos','factories','forests','polio','mountain',
            'dopamine','pleasure','caudate','anticipatory phase','food',
            'B','C','A','B','D','F','B','E','C'],
    },
    {
        book: 12, test: 4,
        passages: ['The History of Glass', 'Saving the Soil', 'The Return of Artisanship'],
        a: ['obsidian','spears','beads','impurities','romans','lead','clouding',
            'taxes','TRUE','FALSE','NOT GIVEN','TRUE','FALSE',
            'D','A','C','A','C','E','D','F','A',
            'NO','NOT GIVEN','YES','YES',
            'iv','ii','vi','viii','vii','i','iii',
            'YES','NOT GIVEN','NO','NO',
            'information','financial','investors/shareholders'],
    },

    // ─── Cambridge 13 ─────────────────────────────────────────────────────────
    {
        book: 13, test: 1,
        passages: ['The Pleasure of Reading', 'Boredom Research', 'Computer-Generated Art'],
        a: ['update','environment','captain','films','season','accommodation','blog',
            'FALSE','NOT GIVEN','FALSE','TRUE','NOT GIVEN','TRUE',
            'iv','vi','i','v','viii','iii',
            'E','B','D','A','focus','pleasure','curiosity',
            'B','C','C','D','A','D',
            'A','E','C','G','B',
            'YES','NOT GIVEN','NO'],
    },
    {
        book: 13, test: 2,
        passages: ['Perfume – the Story of a Murderer', 'Laughter', 'Disappearing Delta'],
        a: ['oils','friendship','funerals','wealth','indigestion','india','camels','alexandria','venice',
            'TRUE','FALSE','NOT GIVEN','FALSE',
            'B','F','B','E','A','B','C',
            'animals','childbirth','placebo','game','strangers','names',
            'D','C','A','D','D','D','C','B','A','C','A','B','C','D'],
    },
    {
        book: 13, test: 3,
        passages: ['Coconut', 'Baby Talk', 'The Harappan Civilization'],
        a: ['furniture','sugar','ropes','charcoal','bowls','hormones','cosmetics','dynamite',
            'FALSE','FALSE','NOT GIVEN','TRUE','NOT GIVEN',
            'B','C','A','B',
            'recording devices','dads/fathers','bridge hypothesis','repertoire','audio-recording vests/vests','vocabulary',
            'F','A','E',
            'C','H','A','B','D',
            'shells','lake','rainfall','grains','pottery',
            'B','A','D','A'],
    },
    {
        book: 13, test: 4,
        passages: ['Cutty Sark', 'The Soil Beneath Our Feet', 'The Happiness Industry'],
        a: ['FALSE','FALSE','TRUE','TRUE','FALSE','TRUE','NOT GIVEN','TRUE',
            'wool','navigator','gale','training','fire',
            'minerals','carbon','water','agriculture',
            'C','E','A','D','E','C','F','G','F',
            'D','A','B','F','B','G','E','A',
            'YES','NOT GIVEN','NO','NOT GIVEN','YES','NO'],
    },

    // ─── Cambridge 14 ─────────────────────────────────────────────────────────
    {
        book: 14, test: 1,
        passages: ["The Importance of Children's Play", 'The Growth of Bike-Sharing Schemes', 'Motivational Factors and the Hospitality Industry'],
        a: ['creativity','rules','cities','traffic','crime','competition','evidence','life',
            'TRUE','TRUE','NOT GIVEN','FALSE','TRUE',
            'E','C','F','C','A','D','B','E','D',
            'activists','consumerism','leaflets','police',
            'E','D','B','D','C',
            'YES','NO','NO','NOT GIVEN',
            'restaurants','performance','turnover','goals','characteristics'],
    },
    {
        book: 14, test: 2,
        passages: ['Alexander Henderson', 'Back to the Future of Skyscraper Design', 'Why Companies Should Welcome Disorder'],
        a: ['FALSE','TRUE','NOT GIVEN','FALSE','NOT GIVEN','TRUE','FALSE','TRUE',
            'merchant','equipment','gifts','canoe','mountains',
            'F','C','E','D','B',
            'designs','pathogens','tuberculosis','wards','communal','public','miasmas','cholera',
            'vi','i','iii','ii','ix','vii','iv','viii',
            'productive','perfectionists','dissatisfied',
            'TRUE','FALSE','NOT GIVEN'],
    },
    {
        book: 14, test: 3,
        passages: ['The Concept of Intelligence', 'Saving Bugs to Find New Drugs', 'The Power of Play'],
        a: ['B','A','D','NOT GIVEN','NO','YES','B','C','B','A','A','C','A',
            'C','H','A','F','I','B','E','B,C','B,C',
            'ecology','prey','habitats','antibiotics',
            'B','G','F','E','C',
            'NO','YES','NOT GIVEN','NO','YES',
            'encouraging','desire','autonomy','targeted'],
    },
    {
        book: 14, test: 4,
        passages: ['The Secret of Staying Young', 'Why Zoos Are Good', 'Marine Debris'],
        a: ['four/4','young','food','light','aggressively','location','neurons','chemicals',
            'FALSE','TRUE','FALSE','NOT GIVEN','TRUE',
            'B','E','C','A',
            'TRUE','TRUE','NOT GIVEN','FALSE','NOT GIVEN',
            'B,D','B,D','B,E','B,E',
            'FALSE','NOT GIVEN','FALSE','TRUE','FALSE','TRUE','NOT GIVEN',
            'large','microplastic','populations','concentrations','predators','disasters','A'],
    },

    // ─── Cambridge 15 ─────────────────────────────────────────────────────────
    {
        book: 15, test: 1,
        passages: ['Nutmeg – a valuable spice', 'Driverless cars', 'What is exploration?'],
        a: ['oval','husk','seed','mace',
            'FALSE','NOT GIVEN','TRUE',
            'arabs','plague','lime','run','mauritius','tsunami',
            'C','B','E','G','D',
            'human error','car-sharing','ownership','mileage',
            'C','D','A','E',
            'A','C','C','D','A','D',
            'E','A','D','B',
            'expeditions','isolated/uncontacted','land surface'],
    },
    {
        book: 15, test: 2,
        passages: ['Smart Motorways', 'Back from the Brink', 'The Psychology of Colour'],
        a: ['B','C','F','D','E','A',
            'safety','traffic','carriageway','mobile','dangerous','communities','healthy',
            'F','B','D','A',
            'genetic traits','heat loss','ears','insulating fat/fat','carbon emissions/emissions',
            'B','C','D','F',
            'C','A','B','B','D',
            'emotion','amusing','boring','anxiety','stimulating',
            'NOT GIVEN','YES','NO','NO'],
    },
    {
        book: 15, test: 3,
        passages: ['The Linen Industry', 'A Better Filter', 'Music and Horror Films'],
        a: ['TRUE','FALSE','NOT GIVEN','TRUE','NOT GIVEN','FALSE','TRUE',
            'resignation','materials','miners','family','collectors','income',
            'iii','vi','v','x','iv','viii','i',
            'wheels','film','filter','waste','performance','servicing',
            'C','B','F','A','E',
            'links','variations','events','warning','horror',
            'B','D','A','A'],
    },
    {
        book: 15, test: 4,
        passages: ['The Return of the Huarango', 'Silbo Gomero', 'Environmental Practices of Big Business'],
        a: ['water','diet','drought','erosion','desert','branches','leaves and bark','trunk',
            'NOT GIVEN','FALSE','TRUE','FALSE','NOT GIVEN',
            'NOT GIVEN','FALSE','TRUE','FALSE','FALSE','TRUE',
            'words','finger','direction','commands','fires','technology','award',
            'moral standards','control','involvement','overfishing','trees',
            'C','D','B',
            'YES','NOT GIVEN','NO','YES','NOT GIVEN','D'],
    },
    // Cambridge 16
    {
        book: 16, test: 1,
        passages: ['Passage 1', 'Passage 2', 'Passage 3'],
        a: ['FALSE','FALSE','NOT GIVEN','TRUE','TRUE','FALSE','TRUE','violent','tool','meat','photographer','game','frustration','iv','vii','ii','v','i','viii','vi','city','priests','trench','location','B,D','B,D','B','D','C','D','G','E','C','F','B','A','C','A','B','C'],
    },
    {
        book: 16, test: 2,
        passages: ['Passage 1', 'Passage 2', 'Passage 3'],
        a: ['TRUE','NOT GIVEN','TRUE','FALSE','FALSE','TRUE','TRUE','NOT GIVEN','Ridgeway','documents','soil','fertility','Rhiannon','D','C','A','G','B','H','E','YES','NO','NOT GIVEN','YES','NOT GIVEN','NO','B','C','B','D','D','A','C','F','G','FALSE','NOT GIVEN','NOT GIVEN','TRUE','TRUE'],
    },
    {
        book: 16, test: 3,
        passages: ['Passage 1', 'Passage 2', 'Passage 3'],
        a: ['FALSE','NOT GIVEN','FALSE','TRUE','TRUE','lightweight','bronze','levels','hull','triangular','music','grain','towboats','D','C','F','H','G','B','microorganisms','reindeer','insects','B,C','B,C','A,C','A,C','NOT GIVEN','TRUE','TRUE','NOT GIVEN','FALSE','FALSE','H','D','G','C','A','warm winter/warm','summer','mustard plant/mustard plants'],
    },
    {
        book: 16, test: 4,
        passages: ['Passage 1', 'Passage 2', 'Passage 3'],
        a: ['posts','canal','ventilation','lid','weight','climbing','FALSE','NOT GIVEN','FALSE','TRUE','gold','architect','harbour','A','B','D','B','D','H','F','B','C','YES','NO','NOT GIVEN','YES','iii','vi','ii','i','vii','v','C','B','A','NO','NOT GIVEN','YES','NO','YES'],
    },
    // Cambridge 17
    {
        book: 17, test: 1,
        passages: ['Passage 1', 'Passage 2', 'Passage 3'],
        a: ['population','suburbs','businessmen','funding','press','soil','FALSE','NOT GIVEN','TRUE','TRUE','FALSE','FALSE','NOT GIVEN','A','F','E','D','fortress','bullfights','opera','salt','shops','C','D','B','E','H','J','F','B','D','NOT GIVEN','NO','NO','YES','B','C','A','B','D'],
    },
    {
        book: 17, test: 2,
        passages: ['Passage 1', 'Passage 2', 'Passage 3'],
        a: ['rock','cave','clay','Essenes','Hebrew','NOT GIVEN','FALSE','TRUE','TRUE','FALSE','FALSE','TRUE','NOT GIVEN','C','B','E','A','C','B','D','A','C','A','flavour/flavor','size','salt','D','A','A','C','A','NO','NOT GIVEN','YES','NO','NOT GIVEN','F','D','E','B'],
    },
    {
        book: 17, test: 3,
        passages: ['Passage 1', 'Passage 2', 'Passage 3'],
        a: ['carnivorous','scent','pouch','fossil','habitat','TRUE','FALSE','NOT GIVEN','FALSE','NOT GIVEN','FALSE','TRUE','NOT GIVEN','F','G','A','H','B','E','C','B,C','B,C','solid','sumatran orangutan/orangutan','carbon stocks','biodiversity','A','B','C','D','C','NO','YES','NOT GIVEN','NO','H','D','I','B','F'],
    },
    {
        book: 17, test: 4,
        passages: ['Passage 1', 'Passage 2', 'Passage 3'],
        a: ['FALSE','FALSE','NOT GIVEN','TRUE','NOT GIVEN','TRUE','droppings','coffee','mosquitoes','protein','unclean','culture','houses','E','A','D','F','C','descendants','sermon','fine','innovation','B','E','B','D','D','E','F','B','H','E','FALSE','NOT GIVEN','NOT GIVEN','TRUE','memory','numbers','communication','visual'],
    },
    // Cambridge 18
    {
        book: 18, test: 1,
        passages: ['Passage 1', 'Passage 2', 'Passage 3'],
        a: ['lettuces','1000 kg','food consumption/consumption','pesticides','journeys','producers','flavour/flavor','TRUE','NOT GIVEN','FALSE','TRUE','FALSE','NOT GIVEN','B','A','C','E','B','B','C','C','fire','nutrients','cavities','hawthorn','rare','C','F','A','E','B','sustainability','fuel','explosions','bankrupt','C','D','B','D','A'],
    },
    {
        book: 18, test: 2,
        passages: ['Passage 1', 'Passage 2', 'Passage 3'],
        a: ['(deer) antlers','(timber) posts','tree trunks','oxen','glaciers','druids','burial','calendar','TRUE','FALSE','FALSE','TRUE','NOT GIVEN','C','A','B','D','C','D','YES','NOT GIVEN','NO','YES','C','A','E','NOT GIVEN','NOT GIVEN','TRUE','FALSE','TRUE','NOT GIVEN','FALSE','transport','staircases','engineering','rule','Roman','Paris','outwards'],
    },
    {
        book: 18, test: 3,
        passages: ['Passage 1', 'Passage 2', 'Passage 3'],
        a: ['G','D','C','F','architects','moisture','layers','speed','C','A','B','D','A','iii','viii','vi','v','vii','i','iv','A','C','B','speed','fifty/50','strict','B','A','C','C','H','D','F','E','B','NO','NOT GIVEN','YES','NO','NOT GIVEN'],
    },
    {
        book: 18, test: 4,
        passages: ['Passage 1', 'Passage 2', 'Passage 3'],
        a: ['D','C','E','B','D','energy','food','gardening','obesity','C','D','A','D','B','C','D','C','B','A','E','B','D','YES','NO','NOT GIVEN','YES','YES','NOT GIVEN','NO','NO','I','F','A','C','H','E','B','A','D','C'],
    },
    // Cambridge 19
    {
        book: 19, test: 1,
        passages: ['Passage 1', 'Passage 2', 'Passage 3'],
        a: ['FALSE','FALSE','NOT GIVEN','FALSE','NOT GIVEN','TRUE','TRUE','paint','topspin','training','intestines/gut','weights','grips','D','G','C','A','G','B','B','D','C','E','grain','punishment','ransom','D','A','C','D','G','J','H','B','E','C','YES','NOT GIVEN','NO','NOT GIVEN'],
    },
    {
        book: 19, test: 2,
        passages: ['Passage 1', 'Passage 2', 'Passage 3'],
        a: ['piston','coal','workshops','labour/labor','quality','railway/railways','sanitation','NOT GIVEN','FALSE','NOT GIVEN','TRUE','TRUE','NOT GIVEN','D','F','A','C','F','injury','serves','excitement','visualisation/visualization','B','D','A','E','H','A','C','B','J','I','YES','NOT GIVEN','YES','NOT GIVEN','NO','C','B','D'],
    },
    {
        book: 19, test: 3,
        passages: ['Passage 1', 'Passage 2', 'Passage 3'],
        a: ['FALSE','FALSE','TRUE','NOT GIVEN','TRUE','NOT GIVEN','FALSE','caves','stone','bones','beads','pottery','spices','G','A','H','B','carbon','fires','biodiversity','ditches','subsidence','A','C','D','B','D','A','C','B','C','E','F','B','NO','YES','NO','NOT GIVEN','NOT GIVEN','YES'],
    },
    {
        book: 19, test: 4,
        passages: ['Passage 1', 'Passage 2', 'Passage 3'],
        a: ['FALSE','TRUE','FALSE','NOT GIVEN','FALSE','TRUE','colonies','spring','endangered','habitat/habitats','europe','southern','diet','C','F','E','D','D','B','A','E','B','C','waste','machinery','caution','C','C','B','A','egalitarianism','status','hunting','domineering','autonomy','NOT GIVEN','NO','YES','NOT GIVEN','NO'],
    },
    // Cambridge 20
    {
        book: 20, test: 1,
        passages: ['Passage 1', 'Passage 2', 'Passage 3'],
        a: ['FALSE','FALSE','FALSE','NOT GIVEN','TRUE','TRUE','bulbs','soil','feathers','deer','1980','funding','stakeholders','C','G','B','E','C','B','A','B','C','A','oak','flooring','keel','C','A','D','C','B','G','F','E','D','YES','NOT GIVEN','NO','YES','YES'],
    },
    {
        book: 20, test: 2,
        passages: ['Passage 1', 'Passage 2', 'Passage 3'],
        a: ['tail','flippers','hair','seagrasses','lips','buoyancy','TRUE','NOT GIVEN','FALSE','NOT GIVEN','TRUE','NOT GIVEN','TRUE','B','F','B','laziness','anxious','threats','exams','perfectionists','guilt','A','C','A','E','NO','YES','NOT GIVEN','NO','NOT GIVEN','YES','F','D','H','B','G','B','D','C'],
    },
    {
        book: 20, test: 3,
        passages: ['Passage 1', 'Passage 2', 'Passage 3'],
        a: ['potatoes','butter','meat','crystals','cellophane','tin','refrigerator','NOT GIVEN','TRUE','FALSE','TRUE','FALSE','NOT GIVEN','v','ii','iv','vii','iii','vi','C','E','B','D','tentacles','protection','colour','A','C','B','A','B','A','C','C','B','D','B','C','B','C'],
    },
    {
        book: 20, test: 4,
        passages: ['Passage 1', 'Passage 2', 'Passage 3'],
        a: ['teacher','charcoal','skyscrapers','flowers','bones','landscape','rivers','FALSE','TRUE','FALSE','TRUE','NOT GIVEN','NOT GIVEN','C','A','D','F','pumps','dams','float','crops','trees','B','E','A','C','D','G','B','C','B','D','E','B','C','A','jackals','diseases','food','foxes'],
    },
];

let _cache: Record<string, ReadingTestData> | null = null;

function buildCache(): Record<string, ReadingTestData> {
    const cache: Record<string, ReadingTestData> = {};
    for (const entry of RAW) {
        const answers: ReadingAnswer[] = entry.a.map(a => ({
            correct_answer: a.toLowerCase(),
            explanation: '',
        }));
        // pad to 40 if short
        while (answers.length < 40) answers.push({ correct_answer: '', explanation: '' });

        const totalQuestions = answers.filter(a => a.correct_answer).length;
        const key = `${entry.book}_${entry.test}`;
        cache[key] = {
            book: entry.book,
            test: entry.test,
            pdfPath: PDF[entry.book] ?? '',
            passages: entry.passages,
            answers,
            totalQuestions,
            passage_text: entry.passages.join(' · '),
            question_text: '',
        };
    }
    return cache;
}

function getCache(): Record<string, ReadingTestData> {
    if (!_cache) _cache = buildCache();
    return _cache;
}

export function getReadingTest(book: number, test: number): ReadingTestData | null {
    return getCache()[`${book}_${test}`] ?? null;
}

export function getAvailableReadingTests(): { book: number; test: number }[] {
    return RAW.map(e => ({ book: e.book, test: e.test }));
}

export const READING_BOOKS = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
