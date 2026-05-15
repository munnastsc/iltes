import { IELTS_MODULES, makeBookContentTemplate } from '../src/lib/bookTemplates';
import { upsertLocalBook } from '../src/lib/localStore';

async function addMockTest() {
    const bookNumber = 101; // Mock Test 1

    console.log(`Generating Mock Test 1 (Book ID: 101)...`);

    for (const moduleName of IELTS_MODULES) {
        // Just adding Test 1 for the Mock Test
        const testNumber = 1; 
        
        const content = makeBookContentTemplate(bookNumber, testNumber, moduleName);
        content.title = `Full Mock Test 1 - ${moduleName}`;
        content.introduction = "This is a full exam simulation. Follow strict timing.";

        await upsertLocalBook({
            bookNumber,
            testNumber,
            module: moduleName,
            content: content as any,
            audioUrl: content.audioUrl || null,
        });
        
        console.log(`Saved Mock Test 1 - ${moduleName}`);
    }

    console.log('Mock Test 1 generation complete!');
}

addMockTest().catch(console.error);
