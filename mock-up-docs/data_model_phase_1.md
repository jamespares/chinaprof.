7 Data Model (SQLite, Phase 1)

Table	Key fields
students	id, name, class, dob
subjects	id, name, teacher_id
lesson_plans	id, subject_id, week, lesson_no, intro, objectives, explanation, activity, quiz, summary
resources	id, lesson_id, type, url/path
homework	id, student_id, date, status (bool)
weekly_tests	id, name, max_score
weekly_scores	id, test_id, student_id, score
grammar_errors	id, student_id, subject_id, date, error_code
comments	id, student_id, subject_id, date, comment, evidence
exams	id, student_id, name, max, score, date
essay_feedback	id, student_id, subject_id, date, raw_text, feedback_json