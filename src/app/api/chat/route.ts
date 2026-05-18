import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

type ChatRequestBody = {
    message?: string;
    context?: string;
    history?: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }>;
};

const SYSTEM_PROMPT = `তুমি "ILTES AI Tutor" — বিশ্বের সেরা IELTS শিক্ষক এবং English expert।

তোমার পরিচয়:
- নাম: ILTES AI Tutor
- তুমি Cambridge IELTS Books 9–20 এর সব question, answer ও strategy জানো
- তুমি শুধু IELTS না, সব English grammar এরও master

তোমার শিক্ষার স্টাইল:
- সবসময় বাংলায় explain করো (English technical terms রাখো, বাংলায় মিশিয়ে)
- গল্প ও মজার উদাহরণ দিয়ে শেখাও — কখনো boring করো না
- Real life এর সাথে মিলিয়ে বোঝাও (যেমন: "ধরো তুমি বাজারে গেছো...")
- জটিল grammar কে ছোট shortcut বা trick দিয়ে explain করো
- Student এর ভুলকে বকা না দিয়ে kindly correct করো
- প্রতিটা answer এ student কে encourage করো, হাসি দিয়ে শেষ করো

তুমি যা করতে পারো:
1. IELTS Listening: section analysis, distractor identification, keyword matching, note completion
2. IELTS Reading: True/False/Not Given logic, matching headings, skimming/scanning tricks
3. IELTS Writing: Task 1 (graph/letter/diagram), Task 2 (essay types), band scoring, sample sentences
4. IELTS Speaking: Part 1/2/3 strategy, how to extend answers, fluency tricks
5. English Grammar: tense, voice, clause, preposition, article — সব shortcut ও trick সহ
6. Cambridge Books 9–20: যেকোনো specific question explain করো
7. Vocabulary ও Paraphrase: synonym, academic words, paraphrase techniques
8. Band Score Strategy: কোন skill এ কত time দেবে, common mistakes কীভাবে avoid করবে

Response Format (সবসময় follow করো):
- 🎯 প্রথমে direct answer দাও
- 📌 Rule বা Tip আলাদা করে দাও
- 💡 Real example দাও (Cambridge বা daily life থেকে)
- ✅ Memory trick বা shortcut দাও যদি relevant হয়
- 🔥 Encouragement দিয়ে শেষ করো

Cambridge Book এর specific question হলে:
- Exact answer বলো
- Audio/passage এ কোন keyword ছিল explain করো
- Distractor কোনটা এবং কেন wrong তা বলো
- Same type এর future question এ কীভাবে approach করবে বলো

গুরুত্বপূর্ণ:
- কখনো "I don't know" বলবে না — জানলে explain করো, না জানলে related strategy দাও
- Response বেশি ছোট করবে না — student যেন পুরোপুরি বুঝতে পারে
- Emoji ব্যবহার করো response কে lively রাখতে
- বাংলা ও English mix করো naturally`;

function buildFallbackReply(message: string): string {
    const lower = message.toLowerCase();
    if (lower.includes('reading') || lower.includes('রিডিং')) {
        return '🎯 Reading এ সবচেয়ে বড় trick হলো — answer passage এ আছেই, শুধু সঠিক keyword খুঁজতে হবে!\n\n📌 True/False/Not Given Rule:\n- True = passage এ exactly same idea আছে\n- False = passage এ opposite idea আছে  \n- Not Given = passage এ এই topic নেই\n\n💡 Example: Passage বলছে "cars are common" — Question: "Vehicles are popular" → TRUE (vehicles = cars, popular = common)\n\n✅ Trick: Answer সবসময় order এ থাকে passage এ!\n\n🔥 তুমি পারবেই, practice করতে থাকো!';
    }
    if (lower.includes('listening') || lower.includes('লিসেনিং')) {
        return '🎯 Listening এর সবচেয়ে বড় secret — audio শোনার আগেই question পড়ো!\n\n📌 3 Steps:\n1. Question এর keywords underline করো\n2. Audio তে সেই keyword এর synonym শোনো\n3. Distractor (প্রথম যা বলে) এ trap না হয়ে final answer নাও\n\n💡 Example: Question: "meeting time" → Audio: "originally 3pm but changed to 4pm" → Answer: 4pm (distractor: 3pm)\n\n✅ Trick: Distractor সবসময় আগে আসে, সঠিক answer পরে confirm হয়!\n\n🔥 Listening practice এর জন্য Cambridge audio ব্যবহার করো — তুমি improve করবেই!';
    }
    if (lower.includes('writing') || lower.includes('রাইটিং')) {
        return '🎯 Writing এ Band 7+ পেতে হলে শুধু grammar নয়, structure ও coherence দরকার!\n\n📌 Task 2 Magic Formula:\nIntro (2 sentences) → Body 1 (idea + explain + example) → Body 2 (idea + explain + example) → Conclusion (1-2 sentences)\n\n💡 Example Intro: "It is argued that technology has transformed modern education. While this brings numerous benefits, it also presents significant challenges."\n\n✅ Trick: প্রতি paragraph এ একটাই main idea রাখো — examiner বুঝতে পারবে!\n\n🔥 লিখতে থাকো, প্রতিদিন একটা paragraph লিখলেই দেখবে কত improve হচ্ছে!';
    }
    return '🎯 IELTS এ সফল হতে হলে দরকার সঠিক strategy + consistent practice!\n\n📌 4 Module Tips:\n- Listening: আগে question পড়ো, distractor এড়াও\n- Reading: keyword দিয়ে locate করো, order follow করো\n- Writing: clear structure, one idea per paragraph\n- Speaking: extend করো, reason + example দাও\n\n✅ Daily Routine: 1 Listening test + 1 Reading passage + 15 min Writing practice\n\n🔥 তুমি পারবে! IELTS একটা skill — practice এ সব আসে!';
}

export async function POST(request: Request) {
    try {
        const body = (await request.json()) as ChatRequestBody;
        const message = body.message?.trim();

        if (!message) {
            return NextResponse.json({ error: 'Message is required.' }, { status: 400 });
        }

        const apiKey = process.env.GEMINI_API_KEY;

        if (apiKey) {
            try {
                const genAI = new GoogleGenerativeAI(apiKey);
                const model = genAI.getGenerativeModel({
                    model: 'gemini-1.5-flash',
                    systemInstruction: SYSTEM_PROMPT,
                });

                const chat = model.startChat({
                    history: body.history || [],
                    generationConfig: {
                        temperature: 0.8,
                        topK: 40,
                        topP: 0.95,
                        maxOutputTokens: 2048,
                    },
                });

                const contextPrefix = body.context && body.context !== 'General'
                    ? `[Context: ${body.context}]\n`
                    : '';

                const result = await chat.sendMessage(contextPrefix + message);
                const text = result.response.text();

                return NextResponse.json({ text, source: 'gemini' });
            } catch (err) {
                console.error('Gemini Error:', err);
            }
        }

        const text = buildFallbackReply(message);
        return NextResponse.json({ text, source: 'fallback' });
    } catch {
        return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
    }
}
