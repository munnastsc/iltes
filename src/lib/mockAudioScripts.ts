const MOCK_AUDIO_SCRIPTS: Record<string, string> = {
    'mock-101-listening-full': `
Section 1. You will hear a conversation between a student and a library assistant.
Student: Hi, I would like to register for a library membership.
Assistant: Certainly. Your membership number starts with letter L. Your surname?
Student: Rahman. That's R A H M A N.
Assistant: Address?
Student: Nineteen Station Road.
Assistant: You can borrow up to eight books for fourteen days. Late fee is one dollar per day.
Student: What time does the reading room open?
Assistant: It opens at nine a.m. On Saturdays we close at five p.m.
Student: Great. Any workshops this month?
Assistant: Yes, academic writing. Please bring your student ID card when you come.

Section 2. You will hear a guide giving information about a museum.
Guide: Welcome everyone. The temporary exhibition is on level one, opposite the main lift.
Printed maps are free at the entrance desk. Priority lane is for online ticket holders.
In an alarm, follow staff to the outdoor assembly point. Photography is allowed, but no flash.
The science zone is for children aged eight to twelve. The rooftop gallery closes earlier than other areas.
You can register for workshops at reception. The quiet study area is beside the city archive room.
Please arrive at least fifteen minutes before your scheduled slot.

Section 3. You will hear two students discussing a project with their tutor.
Tutor: Narrow your topic to food waste in campus canteens. It is easier to measure.
Student: Our questionnaire currently takes fourteen minutes.
Tutor: Too long. Keep it shorter and aim for around one hundred and fifty responses.
Student: What is the biggest risk?
Tutor: Low response in week two. Send reminders.
Student: Which software for charts?
Tutor: Use Excel first. Also, do a pilot test with ten students and collect both online and paper forms.
Both of you should meet canteen managers. Submit literature review by Friday noon.
Keep interviews to about ten minutes and use APA seventh edition.

Section 4. You will hear a lecture about urban heat islands.
Lecturer: Urban heat often peaks after sunset. Dark surfaces have low albedo and absorb heat.
Vehicle engines are a major heat source. Street trees improve pedestrian comfort.
Green roofs can lower building energy demand. Reflective coatings are most effective on rooftops.
Cooling centers are especially important for the elderly. Cities should publish neighborhood heat maps.
Pilot projects should be evaluated over at least two summers.
Finally, long term success depends on consistent local maintenance.
That is the end of the listening test.
`,
    'mock-101-listening-part1': `
Section 1. Library membership enquiry.
Assistant: Good morning, central city library. How can I help?
Student: I want to register for a membership.
Assistant: Sure. Your membership number starts with letter L. What is your surname?
Student: Rahman. R A H M A N.
Assistant: Address please?
Student: Nineteen Station Road, near the post office.
Assistant: You may borrow eight books for fourteen days. Late fee is one dollar per day.
Student: What time do you open on weekends?
Assistant: We open at nine and close at five.
Student: Any free workshop this month?
Assistant: Yes, academic writing. Bring your student ID card.
`,
    'mock-101-listening-part2': `
Section 2. Museum orientation.
Guide: The temporary exhibition is on level one opposite the lift.
Printed maps are free. Priority entry is for online ticket holders.
If you hear an alarm, follow staff to the outdoor assembly point.
Photography is allowed but no flash.
The science zone is best for children aged eight to twelve.
The rooftop gallery closes earlier than other sections.
Workshops can be booked at reception, and the quiet study area is beside the archive room.
Please arrive fifteen minutes before your slot.
`,
    'mock-101-listening-part3': `
Section 3. Tutor discussion.
Tutor: Narrow your project to food waste in campus canteens.
Student: Our survey takes fourteen minutes now.
Tutor: That is too long. Keep it shorter and target one hundred and fifty participants.
Student: Biggest risk?
Tutor: Low response in week two.
Student: Software?
Tutor: Start with Excel.
Also run a pilot with ten students and use online plus paper forms.
Both of you should meet canteen managers. Submit your literature review by Friday noon.
Keep interviews around ten minutes and use APA seventh edition.
`,
    'mock-101-listening-part4': `
Section 4. Urban heat lecture.
Lecturer: Urban heat often peaks after sunset.
Dark surfaces have low albedo and absorb heat.
Vehicle engines add waste heat.
Street trees improve pedestrian comfort.
Green roofs can reduce building energy demand.
Reflective coatings work best on rooftops.
Cooling centers are important for the elderly.
Cities should publish neighborhood heat maps.
Pilot projects should run for at least two summers.
Long term success depends on maintenance.
`,
};

export function getMockAudioScript(preset: string | null | undefined): string | null {
    if (!preset) return null;
    return MOCK_AUDIO_SCRIPTS[preset] || null;
}
