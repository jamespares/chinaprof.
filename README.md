# ChinaProf - Teacher Productivity App

A local-first teacher productivity app for English teachers in China. Store student data, lesson plans, and assessment records in one calming, ultra-fast interface.

## 🚀 Phase 1: Local Desktop App

This is the Phase 1 implementation focusing on offline desktop functionality with Next.js and SQLite.

## ✨ Features

- **Student Management**: Track student progress and information
- **Homework Tracking**: Daily tick/untick bulk entry with RAG grid view  
- **Grammar Error Logging**: Fast dropdown for common CN-ESL errors
- **Lesson Planning**: Organized lesson plan creation and management
- **Comments & Feedback**: Rich-text comments with evidence tracking
- **Reports**: Generate bilingual student progress reports (EN/中文)

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 with TypeScript
- **Database**: SQLite (better-sqlite3)
- **UI Components**: Radix UI + shadcn/ui
- **Styling**: Tailwind CSS with custom design system
- **Icons**: Lucide React

## 🎨 Design System

- **Colors**: Blue (#E3F2FD), Mint (#E8F5E9), Lavender (#F3E8FD), Orange (#FFF3E0)
- **Typography**: Inter font, 14px base size
- **Spacing**: 4/8pt grid system
- **Radius**: 12px consistent rounding
- **Shadows**: Soft rgba(0,0,0,0.05) shadows

## 🏗️ Getting Started

1. **Install dependencies**:
   \`\`\`bash
   npm install
   \`\`\`

2. **Start development server**:
   \`\`\`bash
   npm run dev
   \`\`\`

3. **Initialize database** (optional):
   \`\`\`bash
   node scripts/init-db.js
   \`\`\`

4. **Open application**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

\`\`\`
src/
├── app/                    # Next.js app router pages
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── layout/            # Layout components  
│   └── features/          # Feature-specific components
├── lib/
│   ├── db/               # Database layer
│   ├── types/            # TypeScript definitions
│   └── utils/            # Utility functions
\`\`\`

## 🗄️ Database Schema

The SQLite database includes tables for:
- Students and their information
- Subjects and lesson plans  
- Homework tracking
- Grammar error logging
- Comments and feedback
- Test scores and exams
- Essay feedback with AI integration

## 🎯 Roadmap

- **Phase 1** (Current): Local-only desktop app
- **Phase 2**: Online deployment with authentication
- **Phase 3**: Payment integration and wider rollout

## 📄 License

Private project for educational use.