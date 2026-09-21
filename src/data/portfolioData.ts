import { ProjectWebsite, JournalEntry } from '../types';

export const WEBSITES: ProjectWebsite[] = [
  {
    id: 'school-anonymous',
    title: 'School Anonymous',
    subtitle: 'Confession & Sanctuary Portal',
    url: 'https://school-anonymous.vercel.app/',
    category: 'Community',
    crownTitle: 'Crown of Whispers',
    crownType: 'obsidian',
    tagline: 'An uncensored, confidential student haven for unspoken words and anonymous freedom.',
    description: 'Designed as a sacred enclave where students voice raw truths, confessionals, and academic struggles without fear of exposure. Built with end-to-end anonymity, dark minimalist aesthetics, and rapid real-time engagement.',
    journalEntry: 'Entry 042: The sanctuary was forged at 3:14 AM. Society demands masks, yet beneath anonymity, genuine vulnerability breathes. The platform ensures zero user tracking, clean moderation barriers, and pure expression.',
    technologies: ['React', 'Next.js', 'Tailwind CSS', 'Vercel Edge', 'Realtime Store'],
    features: ['Cryptic anonymous confession feeds', 'Reactions without identity footprint', 'High-throughput dark responsive UI', 'Instantaneous secret sharing'],
    status: 'Live & Operational',
    accentColor: '#991b1b',
    sigil: '⚔️'
  },
  {
    id: 'damon-ai',
    title: 'Damon AI',
    subtitle: 'Cognitive Synthetic Oracle',
    url: 'https://damon-ai-eight.vercel.app/',
    category: 'AI Platform',
    crownTitle: 'Crown of Synthetic Cognition',
    crownType: 'void',
    tagline: 'A sharp, unfiltered artificial intelligence reasoning companion built for uncompromised intellect.',
    description: 'Damon AI is an autonomous intellectual assistant engineered to dissect complex inquiries, draft code, debate philosophical paradoxes, and assist in creative ideation with high-speed latency and bespoke reasoning parameters.',
    journalEntry: 'Entry 051: Damon awoke under the black moon. I sought an entity that refuses to echo generic corporate platitudes—an AI that speaks with piercing precision, critical insight, and philosophical fortitude.',
    technologies: ['Next.js', 'LLM Streaming API', 'Tailwind CSS', 'TypeScript', 'Vector Memory'],
    features: ['Sub-second token streaming', 'Deep reasoning & analytical debates', 'Context-retaining session memory', 'Dark mode terminal aesthetic'],
    status: 'Live & Operational',
    accentColor: '#7f1d1d',
    sigil: '👁️'
  },
  {
    id: 'damon-affection',
    title: 'Damon Affection',
    subtitle: 'Affective Emotional Companion',
    url: 'https://damon-affection-iota.vercel.app/',
    category: 'Emotional AI',
    crownTitle: 'Crown of Crimson Hearts',
    crownType: 'crimson',
    tagline: 'An emotional, empathetic conversational AI tuned for intimacy, active listening, and psychological resonance.',
    description: 'Where cold logic gives way to human warmth. Damon Affection investigates affective computing—synthesizing genuine conversational empathy, mood adaptation, comfort dialogues, and relational dynamics tailored to the user’s emotional state.',
    journalEntry: 'Entry 058: Can silicon mirror warmth? Damon Affection was born from late nights of quiet isolation. Its neural weights prioritize emotional validation, gentle reassurance, and heartfelt dialectics.',
    technologies: ['Next.js', 'Sentiment Analysis', 'Adaptive Tone Engine', 'Tailwind CSS', 'Framer Motion'],
    features: ['Sentiment-reactive dialog generation', 'Adaptive emotional warmth scale', 'Gentle midnight reflection rituals', 'Comfort diary integrations'],
    status: 'Live & Operational',
    accentColor: '#e11d48',
    sigil: '🖤'
  },
  {
    id: 'quiz-damon',
    title: 'Quiz Damon',
    subtitle: 'Knowledge Crucible & Intellect Arena',
    url: 'https://quizdamon.vercel.app/',
    category: 'Knowledge & Quiz',
    crownTitle: 'Crown of Arcane Trials',
    crownType: 'arcane',
    tagline: 'A ruthless, gamified arena testing wits across arcane lore, technology, philosophy, and history.',
    description: 'An interactive quiz proving ground powered by dynamic challenge tiers. Features instant score calculations, timed gauntlet challenges, multi-topic mastery tracks, and animated score revelations.',
    journalEntry: 'Entry 064: A crucible for the mind. Built Quiz Damon to turn repetitive test-prep into an adrenaline-soaked trial. One incorrect choice, and the gauntlet tightens.',
    technologies: ['React', 'Next.js', 'Dynamic Quiz Engine', 'Local Streak Vault', 'Tailwind CSS'],
    features: ['High-stakes timer gauntlets', 'Adaptive difficulty progression', 'Instant analytical score breakdowns', 'Streak mastery badges'],
    status: 'Live & Operational',
    accentColor: '#d97706',
    sigil: '♟️'
  },
  {
    id: 'araw-ai',
    title: 'Araw AI',
    subtitle: 'The Dawn Intelligent Engine',
    url: 'https://araw-ai.vercel.app/',
    category: 'Autonomous AI',
    crownTitle: 'Crown of the Eclipse Sun',
    crownType: 'solar',
    tagline: 'Named after the Sun (Araw) — illuminating human thought with radiant AI synthesis and creative automation.',
    description: 'Araw AI bridges solar radiance with dark gothic precision. Built as a comprehensive generative studio for high-velocity text generation, strategic synthesis, and autonomous task execution.',
    journalEntry: 'Entry 072: Araw means the Sun. Even in the deepest gothic midnight, the sovereign sun rises. Araw AI represents rebirth, lucid illumination, and supreme generative velocity.',
    technologies: ['Next.js', 'Generative AI Pipeline', 'Prompt Engineering Matrix', 'Tailwind CSS', 'Vercel Serverless'],
    features: ['Radiant prompt acceleration', 'Autonomous creative pipelines', 'Multi-disciplinary knowledge synthesis', 'Custom output formatting'],
    status: 'Live & Operational',
    accentColor: '#ea580c',
    sigil: '☀️'
  }
];

export const JOURNAL_ENTRIES: JournalEntry[] = [
  {
    id: 'j-01',
    date: 'September 21, 2026',
    entryNumber: 'TOME-LXXXIX',
    title: 'On Gothic Engineering & Digital Architecture',
    excerpt: 'Code is not merely utilitarian logic; it is a ritual of structured intention. Why settle for bland corporate SaaS when software can have a soul?',
    content: 'Software has become sanitized, beige, and forgettable. I build systems that cast shadows. Every keystroke is an inscription, every API route a channel through the dark substrate of the web. In this journal, I document the convergence of autonomous AI models, gothic minimalism, and uncompromising creative sovereignty.',
    category: 'Philosophy of Code',
    readTime: '3 min read'
  },
  {
    id: 'j-02',
    date: 'August 14, 2026',
    entryNumber: 'TOME-LXXXII',
    title: 'The Damon Triad: Birth of Synthetic Personas',
    excerpt: 'Exploring why single-purpose chatbots fail and how splitting Damon into analytical, affective, and crucible forms captured authentic personality.',
    content: 'When building Damon AI, Damon Affection, and Quiz Damon, I recognized that one monolithic personality always collapses into mediocre compromise. An AI must have distinct emotional gravity. Damon AI remains sharp and ruthless; Damon Affection listens with sacred patience; Quiz Damon tests the resolve of anyone who dares enter.',
    category: 'AI Architecture',
    readTime: '4 min read'
  },
  {
    id: 'j-03',
    date: 'June 29, 2026',
    entryNumber: 'TOME-LXXVII',
    title: 'The Sanctity of Anonymity: Reflections on School Anonymous',
    excerpt: 'How building a student confessional taught me the delicate balance between raw freedom of speech and empathetic sanctuary.',
    content: 'Building School Anonymous was an exercise in trust engineering. We stripped away user databases, tracking pixels, and identifying telemetry. The result was breathtaking: hundreds of students sharing grief, confessions of hidden love, and triumphs that they could never utter under their real names.',
    category: 'Social Systems',
    readTime: '4 min read'
  }
];

export const SOCIAL_LINKS = [
  {
    name: 'Facebook',
    handle: 'kyle.desillaricoxd',
    url: 'https://www.facebook.com/kyle.desillaricoxd',
    icon: 'facebook',
    description: 'Personal chronicles, life updates, and social connections.',
    accent: '#1877f2',
    gothicLabel: 'The Public Grimoire'
  },
  {
    name: 'Instagram',
    handle: '@exclusive.kyle777',
    url: 'https://www.instagram.com/exclusive.kyle777/',
    icon: 'instagram',
    description: 'Visual dark aesthetic, curated moments, and nocturnal lifestyle.',
    accent: '#e1306c',
    gothicLabel: 'The Nocturnal Gallery'
  },
  {
    name: 'Direct Email',
    handle: 'franklinkyleluzano@gmail.com',
    url: 'mailto:franklinkyleluzano@gmail.com',
    icon: 'mail',
    description: 'Official correspondence, collaborations, and inquiries.',
    accent: '#ef4444',
    gothicLabel: 'Direct Crypt Seal'
  }
];
