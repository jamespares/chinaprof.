3 Functional Requirements

Module	Must-have behaviour
Homework tracker	• Daily tick/untick bulk entry • RAG grid view • Year-to-date % auto-calc
Grammar errors	• Fast dropdown (common CN-ESL errors) • Timestamp & lesson ref • CSV export
Comments	• Rich-text comment + evidence box • Subject selector • “Generate summary” → OpenAI API call returns EN & CN paragraph
Essay Marker	• Paste essay → prompt builder captures age, rubric, task • Returns marked text + JSON list of errors • Stores feedback row
Exam grades	Arbitrary exam type, max score, score, date
Weekly tests	Teacher defines test name & total, then rapid weekly entry; auto-percent
Lesson Plans	Term > Week > Lesson tree • Fields: intro, objectives, explanation, activity, quiz, summary, materials[] • Drag-drop file / YouTube link
Reports	Per-student PDF & bilingual HTML; can export to ManageBac CSV schema


9 API / Services (local)

Service	Function
openai.markEssay()	POST essay text + context → returns annotated HTML + JSON errors
openai.summariseComments()	POST student_id → returns EN/CN summary
Local CRUD	Wrapped via tRPC-like helper for type-safety