ChinaProf.

- This is a tool for managing student performance and teacher’s lesson plans. It is about reducing teacher’s stress and ensuring that they have all the key data that they need to boost their students’ English level. The target audience is English teachers living in China. The app should be neatly tailored to them. It should be adaptable for training centre teachers, American curriculum, GCSE, IB etc. It should be customisable so teachers can make it their one-top-shop for all their work and student data. I want this tool to be used by lots of teachers in China and I want it to boost the English level of Chinese kids significantly. 

- Features:
    - HW tracker
        - Allows teacher to input HW status for all students on a daily basis
        - This feeds into a database and then outputs a visual grid with RAG rating to reflect student submission
        - This also outputs a percentage HW submission rate (percentage of HW submitted on time over the year)
    - Grammar errors
        - This allows the teacher to input errors made by the students as they occur
        - This should follow ultra quick data entry principles to minimise friction for teachers using the tool
        - Grammar errors should be recorded from a drop-down including all the most common errors for Chinese students learning English (subject-verb agreement, verb tenses, pronouns, prepositions etc.)
    - Comment system
        - This should allow teachers to input comments for selected students
        - Comments will be assigned to that student but also assigned to a particular subject from a dropdown (based on the subjects the teacher is teaching that students - it could be multiple - in my case UOI, English and then General Behaviour)
        - Teachers should input a comment, followed by some classroom evidence from that lesson (will require separate entry boxes)
        - There will be a button in this section to generate a summative comment (this will use an AI API to send all the comments against that student and produce a summative comment for each subject to show the parent at the end of the year) for parents to see the teacher’s view on their child’s behaviour and performance
    - Essay Marker
        - Teachers can copy and paste an essay written by a student and use an AI API call to mark it and generate feedback. The tool should capture all the errors and record them next to that student’s name. The most common errors in essay writing should be fed to the AI so it knows what to look out for in a detailed prompt giving it the right context (student age, curriculum, writing task, writing style requirement etc.). The feedback should be available in both English and Chinese. My students are preparing for the ISA writing exam which involves opinion and creative writing so I’d like the interface to take this information from me and then include it in the prompt. Other teachers might be preparing kids for another writing exam with different rubric, so it’s important that this feature is adaotable. 
    - Exam grades
        - It should be possible for teachers to input any significant exam grades that the students receive throughout the year
    - Weekly test
        - It should also be possible for the teacher to set up a weekly test data entry system so that they can test students weekly and input the students percentage score
        - For example, I want to record each student’s performance in a weekly spelling test that tests the students’ ability to spelling a word and use it in context. This will be out of 20 and I will record the students score out of 20 and the programme will calculate and output the percentage.
        - This feature will require some set up - i.e., ‘Add new weekly test’ and then set the total score and the name of the test etc. 
        - This allows consistent tracking of student performance beyond just exams
    - Lesson plans
        - There should be an interface for teachers to input and save and view their lesson plans for the upcoming semester
        - The interface should guide the teachers to make standardised lesson plans that follow a structure: intro, objectives, explanation, activity, quiz, summary or some such system 
        - It should allow teacher to store resources like PDFs, PPTs, YT video links

- UI
    - The software should have a vertical side column that can fold away like the ChatGPT and Claude interface
    - It should use Radix UI
    - It should be minimalist, with rounded edges and soft colours like light blue, light lavendar, sage and light orange - this creates a calming effect for stressed teachers needing soothing and calming aesthetics
    - Along the vertical side column should be the following options:
        - Add data
            - This allows the teacher to select between adding HW, grammar, weekly test or comments data
                - I am still not sure exactly how to structure this in terms of UI
        - My students (can rotate classes with a top right drop-down box if teacher has multiple classes)
        - My subjects (can rotate subjects with a top-right drop-down box if teacher has multiple)
        - My reports (teacher 
    - Font Inter, Nunito, or Manrope (clean + readable)
    - Soft sky blue #E3F2FD, soft mint #E8F5E9, white, greys #F5F5F5
    - Accents: Pastel orange or lavender for status tags
    - Generous padding and margin; use whitespace liberally
        - Gives teachers space to think and makes it easier to focus on priority information - this should be a very focused and simple UI (following a one-thing-at-a-time principle - though not necessarily exactly one thing)
    - Simple line icons (e.g. Tabler Icons, Lucide)
    - Rounded 12px radius, drop shadows only if needed
    - There should be a language toggle that allows teachers to switch to Chinese so that they can show their Chinese colleagues and any parents that do not speak English can still read reports on their children (bilinguality is very important for this!). I may add French later. 

￼

- Tech
    - Use next.js (local only in the first phase)
    - Use a local database for now, I want to be able to download and export the data, simplicity and speed is key
    - My development plan is to (1) build this tool as a local only application which is essentially an interface for a local database, (2) after perfecting the interface and the database schema, I will then turn it into an online application, add auth (next-auth with prisma) and allow my colleagues to test it out, (3) after that I will launch it and aim to recruit 1000 users in the next 5 years (£5 per month) - this whole process will be roughly 12 months long
    - My priority is that this application works seamlessly smooth and it is simple and effective. I want llightweight but scalable tech. I want tech that is easy to fix too as I am not an experience developer. 
    - After the initial phase I will add stripe payment. 
