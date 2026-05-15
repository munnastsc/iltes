import type { ListeningTest, ListeningSection, QGroup, Question } from './listeningData';

export interface SimpleListeningTest {
    book: number;
    test: number;
    sections: [string, string, string, string];
    answers: string[];
}

function makeSection(
    sectionNum: 1 | 2 | 3 | 4,
    topic: string,
    answers: string[],
    startQ: number,
): ListeningSection {
    const allLetters = answers.every(a => /^[a-i](\/[a-i])?$/i.test(a));
    const instruction = allLetters
        ? 'Choose the correct letter for each answer.'
        : 'Write ONE WORD AND/OR A NUMBER for each answer.';
    const qs: Question[] = answers.map((ans, i) => ({
        n: startQ + i,
        type: 'fill' as const,
        pre: '',
        post: '',
        ans,
    }));
    const group: QGroup = {
        range: [startQ, startQ + 9],
        type: 'fill',
        instruction,
        qs,
    };
    return { section: sectionNum, topic, groups: [group] };
}

export function simpleToListeningTest(s: SimpleListeningTest): ListeningTest {
    return {
        book: s.book,
        test: s.test,
        sections: [
            makeSection(1, s.sections[0], s.answers.slice(0, 10), 1),
            makeSection(2, s.sections[1], s.answers.slice(10, 20), 11),
            makeSection(3, s.sections[2], s.answers.slice(20, 30), 21),
            makeSection(4, s.sections[3], s.answers.slice(30, 40), 31),
        ],
    };
}

const DATA: SimpleListeningTest[] = [
    // ─── Cambridge 16 ────────────────────────────────────────────────────────────
    {
        book: 16, test: 1,
        sections: ["Children's Engineering Workshops", "Stevenson's Manufacturing Company", "Art Project Discussion", "Stoicism Philosophy"],
        answers: ['egg','tower','car','animals','bridge','movie/film','decorate','wednesdays','fradstone','parking','c','a','b','c','h','c','g','b','i','a','c/e','c/e','b/e','b/e','d','c','a','h','f','g','practical','publication','choices','negative','play','capitalism','depression','logic','opportunity','practice/practise'],
    },
    {
        book: 16, test: 2,
        sections: ["Copying Photos to Digital Format", "Sleep and Dreams Research", "Health Benefits of Dance", "Health Benefits of Dance Lecture"],
        answers: ['frame','195','payment','grandparents','colour/color','hand','background','focus','10 days','plastic','c','b','a','a','c','d','a','b','b/c','b/c','b','a','c','c','history','paper','humans/people','stress','graph','evaluate','creativity','therapy','fitness','balance','brain','motivation','isolation','calories','obesity','habit'],
    },
    {
        book: 16, test: 3,
        sections: ["Junior Cycle Camp", "Local Heritage Site Tour", "Handcraft Group Project", "History of Hand Knitting"],
        answers: ['park','blue','reference','story','rain','snack','medication','helmet','tent','199','a/c','a/c','b/c','b/c','d','f','a','h','c','g','c/d','c/d','c/e','c/e','c','a','b','a','a','c','grandmother','decade','equipment','economic','basic','round','bone','rough','style','sheep'],
    },
    {
        book: 16, test: 4,
        sections: ["Holiday Rental Enquiry", "Local Council Traffic Report", "Dodo Bird Discussion", "Dodo Bird Extinction Lecture"],
        answers: ['28th','550','chervil','garage','garden','parking','wood','bridge','monument','march','c','a','b','b','c','f','a','i','e','h','b/c','b/c','b/c','b/c','c','f','d','e','b','a','spices/spice','colony/settlement','fat','head','movement','balance/balancing','brain','smell','rats','forest'],
    },
    // ─── Cambridge 17 ────────────────────────────────────────────────────────────
    {
        book: 17, test: 1,
        sections: ["Buckworth Conservation Group", "Boat Trip Round Tasmania", "Veterinary Work Experience", "Labyrinths Lecture"],
        answers: ['litter','dogs','insects','butterflies','wall','island','boots','beginners','spoons','35','a','c','b','b','a/d','a/d','b/c','b/c','d/e','d/e','a','b','b','a','c','c','a','e','f','c','puzzle','logic','confusion','meditation','stone','coins','tree','breathing','paper','anxiety'],
    },
    {
        book: 17, test: 2,
        sections: ["Volunteering in Southoe Village", "Oniton Hall Tour", "Romeo and Juliet Discussion", "Icelandic Language Lecture"],
        answers: ['collecting','records','west','transport','art','hospital','garden','quiz','tickets','poster','b','c','c','b','d','c','g','a','e','f','d/e','d/e','d','c','a','e','f','b','c','c','321,000','vocabulary','podcast','smartphones','bilingual','playground','picture','grammar','identity','fluent'],
    },
    {
        book: 17, test: 3,
        sections: ["Advice on Surfing Holidays", "Extended Hours Childcare Service", "Holly's Work Placement", "Bird Migration Theory"],
        answers: ['family','fit','hotels','carrowniskey','week','bay','september','19/nineteen','30/thirty','boots','b/e','b/e','c','c','a','e','d','g','f','c','b','a','a','b','c','a','d','b','f','h','mud','feathers','shape','moon','neck','evidence','destinations','oceans','recovery','atlas'],
    },
    {
        book: 17, test: 4,
        sections: ["Easy Life Cleaning Services", "Hotel Staff Retention", "Student Training Experience", "Maple Syrup Production"],
        answers: ['floors/floor','fridge','shirts','windows','balcony','electrician','dust','police','training','review','a','a','a','c','a','c','b','c','b','a','c','e','a','d','b','f','a','d','c','g','golden','healthy','climate','rocks','diameter','tube','fire','steam','cloudy','litre/liter'],
    },
    // ─── Cambridge 18 ────────────────────────────────────────────────────────────
    {
        book: 18, test: 1,
        sections: ["Transport Survey", "ACE Volunteer Programme", "Jobs in Fashion Design", "Elephant Translocation"],
        answers: ['DW30 7YZ','24th April','dentist','parking','Claxby','late','evening','supermarket','pollution','storage','c','a','a','b/e','b/e','b','g','d','a','f','a','b','a','c','b','a','b/e','b/e','a/c','a/c','fences','family','helicopters','stress','sides','breathing','feet','employment','weapons','tourism'],
    },
    {
        book: 18, test: 2,
        sections: ["Working at Milo's Restaurants", "Housing Development", "Laki Eruption Study", "Pockets"],
        answers: ['training','discount','taxi','service','english','wivenhoe','equipment','9.75','deliveries','sunday','b','e','b','c','g','c','d','b','h','a','c','a','b','b','a','b','d','a','c','f','convenient','suits','tailor','profession','visible','strings/string','waists/waist','perfume','image','handbag'],
    },
    {
        book: 18, test: 3,
        sections: ["Camera Club Membership", "Wild Mushroom Picking", "Luddites and Future of Work", "Space Traffic Management"],
        answers: ['marrowfield','relative','socialise/socialize','full','domestic life','clouds','timing','animal magic','animal movement','dark','b/c','b/c','b/d','b/d','c','b','b','c','a','a','a/e','a/e','b/d','b/d','g','e','b','c','f','a','technical','cheap','thousands','identification','tracking','military','location','prediction','database','trust'],
    },
    {
        book: 18, test: 4,
        sections: ["Job Employment Agency", "Museum Guide", "Origami Educational Video", "Victor Hugo Biography"],
        answers: ['receptionist','medical','chastons','appointments','database','experience','confident','temporary','1.15','parking','b','a','a','c','f','g','e','a','c','b','b/d','b/d','d','a','c','g','f','a','b','c','plot','poverty','europe','poetry','drawings','furniture','lamps','harbour/harbor','children','relatives'],
    },
    // ─── Cambridge 19 ────────────────────────────────────────────────────────────
    {
        book: 19, test: 1,
        sections: ["Hinchingbrooke Country Park", "Stanthorpe Twinning Association", "Food Trends Discussion", "Céide Fields"],
        answers: ['69','stream','data','map','visitors','sounds','freedom','skills','4.95','leaders','b','a','b','c','a','g','c','b','d','a','b/d','b/d','a/e','a/e','d','g','c','b','f','h','walls','son','fuel','oxygen','rectangular','lamps','family','winter','soil','rain'],
    },
    {
        book: 19, test: 2,
        sections: ["Guitar Group", "Lifeboat Volunteer Work", "Recycling Footwear Project", "Tardigrades"],
        answers: ['mathieson','beginners','college','new','11 am/11am','instrument','ear','clapping','recording','alone','a','b','a','b','c','a','c/e','c/e','a/b','a/b','a','b','b','b','e','b','a','c','c','a','move','short','discs','oxygen','tube','temperatures','protein','space','seaweed','endangered'],
    },
    {
        book: 19, test: 3,
        sections: ["Local Food Shops", "Festival Workshops", "Science Experiment for Year 12", "Microplastics"],
        answers: ['harbour/harbor','bridge','3.30/half 3','rose','sign','purple','samphire','melon','coconut','strawberry','c','d','f','g','b','h','d','e','b','c','c','b','a','a','c','c','h','e','b','f','clothing','mouths','salt','toothpaste','fertilisers/fertilizers','nutrients','growth','weight','acid','society'],
    },
    {
        book: 19, test: 4,
        sections: ["First Day at Work", "Running Training Programs", "Bookshop Discussion", "Tree Planting Reforestation"],
        answers: ['kaeden','lockers/locker','passport','uniform','third/3rd','0412 665 903','yellow','plastic','ice','gloves','c/e','c/e','a/d','a/d','a','b','c','a','c','b','a','c','a','b','c','d','f','a','c','g','competition','food','disease','agriculture','maps','cattle','speed','monkeys','fishing','flooding'],
    },
    // ─── Cambridge 20 ────────────────────────────────────────────────────────────
    {
        book: 20, test: 1,
        sections: ["Restaurants", "Pottery", "Loneliness", "Urban Rivers"],
        answers: ['fish','roof','spanish','vegetarian','audley','hotel','reviews','local','30/thirty','average','a','b','c','a','b','c','a/e','a/e','c/e','c/e','c/e','c/e','a/c','a/c','a/b','a/b','a','b','a','c','factories','dead','whale','apartments','park','art','beaches','ferry','bikes','drone'],
    },
    {
        book: 20, test: 2,
        sections: ["Elderly Care Support", "Volunteer Roles", "Human Geography", "Food Trends"],
        answers: ['break','time','shower','money','memory','lifting','fall','taxi','insurance','stress','d','i','h','e','a','b','b','a','b','a','d','g','b','a','e','c','a','a','b','c','photos/photographs/pictures','vegan','chefs/cooks','journalists/reporters','health','coffee','environment','reputation','price/cost','soil'],
    },
    {
        book: 20, test: 3,
        sections: ["Furniture Rental Companies", "Archaeological Dig", "Theatre Programmes", "Inclusive Design"],
        answers: ['239','modern','lamp','aaron','damage','electronic','insurance','space','app','exchanges','b','a','a','c','b','c','b','a','g','e','b','a','c','a','c','b','f','e','b','d','adaptation','cognitive','desks','taps','blue','voice','pregnant','shoulders','police','temperature'],
    },
    {
        book: 20, test: 4,
        sections: ["Advice on Family Visit", "Football Stadium and History", "Teaching Handwriting", "Bird Sanctuary Research"],
        answers: ["king's",'125','walking','boat','tuesday','space','vegetarian','2.30/2:30','75','port','b/c','b/c','a/c','a/c','d','f','b','h','c','g','c/e','c/e','a/c','a/c','c','a','a','b','b','c','rats','snakes','tourism','traffic','rain','poison','building','dog','noise','combination'],
    },
];

export function getSimpleListeningTest(book: number, test: number): SimpleListeningTest | null {
    return DATA.find(d => d.book === book && d.test === test) ?? null;
}
