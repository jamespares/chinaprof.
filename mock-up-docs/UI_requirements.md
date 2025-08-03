4 Non-functional

Area	Target
Performance	Render main dashboard < 150 ms on 2018 laptop
Offline	Whole app usable without internet; data = local SQLite
Accessibility	WCAG 2.2 AA; keyboard-only nav
Internationalisation	i18n (EN/中文) via next-i18next; future locale hooks
5 UI Framework & Design Tokens

Radix UI primitives + shadcn/ui wrapper
12 px radius, 4/8 pt spacing grid, soft shadows (rgba(0,0,0,0.05))
Palette - light blue, light grey, black
Accent text	#1E3A8A
Typography: Inter (400/600), 14 px base
Icons: Lucide (outline)

- The UI should follow the principles that ONLY interactable buttons/navigation should be animated or highlighted. the UI must guide the user's eyes and interactions to interact with the application efficiently. there should be minimal clutter. this application is all about saving time and calming the user's mind.

- The theme is crystal clear glass. or crystal clear fresh running water. the idea is clarity, cleanliness, precision, calm, cool. i like the idea of a glass-like semi-translucent effect in the animations like apple is using in their latest software. 

- Icons should be used sparingly and only where they add value. This should be a thoughtful, parsimonious application. Not a cluttered mess. 