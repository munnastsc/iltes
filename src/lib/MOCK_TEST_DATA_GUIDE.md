# Mock Test Data Guide

Use this guide when you send real mock data later. We already prepared a strict format and timing blueprint.

## 1) Core format file

See: `src/lib/mockTestFormat.ts`

Important exports:
- `IELTS_MODULE_BLUEPRINT` (timing, part count, question pattern)
- `buildMockTestShell(mockNumber)` (ready skeleton)
- `validateModuleAgainstBlueprint(module)` (quality check)

## 2) What each module must include

- `title`
- `introduction`
- `examConfig` (use `IELTS_MODULE_BLUEPRINT.<Module>`)
- `parts[]`

Each part:
- `partNumber`
- `title`
- `text` (passage/script/prompt)
- `audioUrl` (optional per part; useful for Listening)
- `tips[]`
- `questions[]`

Each question:
- `number`
- `type` (`fill_in_blank`, `mcq`, `double_mcq`, `true_false`, `matching`, `open`)
- `prompt`
- `answer`
- `answerLine` (recommended for objective tasks)
- `options[]` (for MCQ types)

## 3) Timing pattern we enforce

- Listening: 30 min, 4 parts, 40 questions (10+10+10+10)
- Reading: 60 min, 3 parts, 40 questions (13+13+14)
- Writing: 60 min, 2 tasks
- Speaking: 15 min, 3 parts

## 4) Audio methods

### A) AI TTS preset
- Add script preset in: `src/lib/mockAudioScripts.ts`
- Use URL in data:
  - full: `/api/audio?preset=mock-101-listening-full&voice=alloy`
  - part: `/api/audio?preset=mock-101-listening-part1&voice=alloy`

Requires valid `OPENAI_API_KEY`.

### B) Human-recorded MP3
- Put file in `public/audio/...`
- Use URL like `/audio/mock1/listening-part1.mp3`

## 5) Scoring behavior

- Objective question types are auto-scored in `AnswerPractice`.
- `open` questions are not auto-graded (Writing/Speaking style).
- Attempts are saved to analytics (score, wrong questions, retry mode).

## 6) Your workflow with me

When you send new mock data, send by module in this order:
1. Listening (script + Q1-40 + answers)
2. Reading (3 passages + Q1-40 + answers)
3. Writing (Task 1 + Task 2 prompts)
4. Speaking (Part 1/2/3 prompts)

Then I will:
1. map it to this format
2. validate against blueprint
3. wire audio URLs
4. test build and finalize
