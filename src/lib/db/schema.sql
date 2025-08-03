-- SQLite Schema for ChinaProf Phase 1
-- Local-first teacher productivity app

-- Classes table
CREATE TABLE IF NOT EXISTS classes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    year_level INTEGER, -- Grade/Year level (1-12)
    teacher_id TEXT, -- For future Phase 2 auth integration
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Students table
CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    class_id INTEGER, -- Reference to classes table
    class TEXT, -- Legacy field for backward compatibility
    dob TEXT, -- ISO date string
    avatar_url TEXT, -- Path to avatar image (stock or uploaded)
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE SET NULL
);

-- Subjects table
CREATE TABLE IF NOT EXISTS subjects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,  
    name TEXT NOT NULL,
    teacher_id TEXT, -- For future Phase 2 auth integration
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Lesson plans table
CREATE TABLE IF NOT EXISTS lesson_plans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    subject_id INTEGER NOT NULL,
    week INTEGER NOT NULL,
    lesson_no INTEGER NOT NULL,
    intro TEXT,
    objectives TEXT,
    explanation TEXT,
    activity TEXT,
    quiz TEXT,
    summary TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
);

-- Resources table (files, URLs, YouTube links)
CREATE TABLE IF NOT EXISTS resources (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lesson_id INTEGER NOT NULL,
    type TEXT CHECK(type IN ('file', 'url', 'youtube')) NOT NULL,
    url_or_path TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (lesson_id) REFERENCES lesson_plans(id) ON DELETE CASCADE
);

-- Homework tracking table
CREATE TABLE IF NOT EXISTS homework (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    date TEXT NOT NULL, -- ISO date string
    status BOOLEAN NOT NULL DEFAULT 0, -- 0 = incomplete, 1 = complete
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- Weekly tests table
CREATE TABLE IF NOT EXISTS weekly_tests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    max_score INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Weekly test scores table
CREATE TABLE IF NOT EXISTS weekly_scores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    test_id INTEGER NOT NULL,
    student_id INTEGER NOT NULL,
    score INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (test_id) REFERENCES weekly_tests(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- Grammar errors table
CREATE TABLE IF NOT EXISTS grammar_errors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    subject_id INTEGER NOT NULL,
    date TEXT NOT NULL, -- ISO date string
    error_code TEXT NOT NULL, -- Common CN-ESL error codes
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
);

-- Comments table
CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    subject_id INTEGER NOT NULL,
    date TEXT NOT NULL, -- ISO date string
    comment TEXT NOT NULL,
    evidence TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
);

-- Exams table
CREATE TABLE IF NOT EXISTS exams (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    max_score INTEGER NOT NULL,
    score INTEGER NOT NULL,
    date TEXT NOT NULL, -- ISO date string
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- Essay feedback table
CREATE TABLE IF NOT EXISTS essay_feedback (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    subject_id INTEGER NOT NULL,
    date TEXT NOT NULL, -- ISO date string
    raw_text TEXT NOT NULL,
    feedback_json TEXT NOT NULL, -- JSON string of feedback data
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_homework_student_date ON homework(student_id, date);
CREATE INDEX IF NOT EXISTS idx_grammar_errors_student ON grammar_errors(student_id);
CREATE INDEX IF NOT EXISTS idx_comments_student ON comments(student_id);
CREATE INDEX IF NOT EXISTS idx_lesson_plans_subject ON lesson_plans(subject_id);
CREATE INDEX IF NOT EXISTS idx_weekly_scores_student ON weekly_scores(student_id);
CREATE INDEX IF NOT EXISTS idx_exams_student ON exams(student_id);
CREATE INDEX IF NOT EXISTS idx_students_class ON students(class_id);