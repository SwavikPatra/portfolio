export interface NavLink {
  label: string
  href: string
}

export interface Stat {
  id: string
  value: number
  suffix: string
  label: string
  note?: string
}

export interface SkillGroup {
  id: string
  title: string
  summary: string
  skills: { name: string; level: number }[]
}

export interface Project {
  id: string
  name: string
  tag: string
  category: 'Full Stack' | 'Frontend' | 'Tooling' | 'Open Source'
  description: string
  stack: string[]
  highlights: string[]
  links: { label: string; url: string }[]
  image: string
}

export interface Role {
  id: string
  title: string
  company: string
  period: string
  location: string
  summary: string
  bullets: string[]
  stack: string[]
}

export interface TimelineEntry {
  id: string
  date: string
  title: string
  org: string
  description: string
}

export const profile = {
  name: 'Swavik',
  fullName: 'Swavik Patra',
  initials: 'SP',
  monogram: 'SP',
  role: 'Backend Engineer',
  tagline: 'Software engineer building Go and Python services (FastAPI, PostgreSQL, Redis) for API-heavy products.',
  location: 'Bhubaneswar, India',
  timezone: 'IST · Open to relocate',
  email: 'swavikpatra@gmail.com',
  phone: '+91 97778 53386',
  experienceYears: 2,
  availability: 'Immediate joiner',
  resumeUrl: 'https://drive.google.com/drive/folders/1EQh9Hco8BKgbs4p38RrokXK80b1U-tWv?usp=sharing',
  // Swap this path for your own cut-out PNG (transparent background, portrait crop).
  portrait: `${import.meta.env.BASE_URL}me.png`,
  socials: [
    { label: 'GitHub', url: 'https://github.com/SwavikPatra', icon: 'github' as const },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/swavik-patra-140482231/', icon: 'linkedin' as const },
    { label: 'LeetCode', url: 'https://leetcode.com/u/Swavik/', icon: 'x' as const },
  ],
  nav: [
    { label: 'Home', href: '#top' },
    { label: 'Work', href: '#work' },
    { label: 'About', href: '#about' },
    { label: 'Experience', href: '#experience' },
    { label: 'Contact', href: '#contact' },
  ] satisfies NavLink[],
}

// PLACEHOLDER VALUES — replace with your real numbers before launching.
export const stats: Stat[] = [
  { id: 'years', value: 2, suffix: '+', label: 'Years building backend systems' },
  { id: 'projects', value: 2, suffix: '', label: 'Production-grade projects' },
  { id: 'connections', value: 50, suffix: 'K', label: 'Concurrent chat connections tested' },
  { id: 'gate', value: 98, suffix: '%ile', label: 'GATE CSE 2022' },
]

export const about = {
  lead: 'I build Go and Python services — the API contracts, the data model, and the systems that stay fast under load.',
  bio: [
    'I am a software engineer focused on backend work: REST APIs, microservices, WebSockets, and the databases and caches behind them. I have shipped a no-code connector framework with OAuth and API-key auth, a role-based task manager with chat and attachments, and a distributed real-time chat platform.',
    'I work mostly with Go (Gin), Python (FastAPI, SQLAlchemy, Pydantic), PostgreSQL and Redis. I care about the unglamorous parts — query plans, predictable failures, sensible defaults — because that is what keeps a product pleasant to operate six months after launch.',
    'I hold an M.Tech in Computer Science from NIT Warangal and scored in the top 2% nationally in GATE CSE 2022. Away from the desk I am usually reading about system design or tinkering with a side project.',
  ],
  facts: [
    { key: 'Based in', value: 'Bhubaneswar, India' },
    { key: 'Focus', value: 'Backend — Go & Python' },
    { key: 'Work style', value: 'Remote-first, open to relocate' },
    { key: 'Languages', value: 'English, Odia, Hindi' },
    { key: 'Education', value: 'M.Tech CSE, NIT Warangal' },
    { key: 'Availability', value: 'Immediate joiner' },
  ],
  interests: ['Distributed systems', 'System design', 'Open source', 'Competitive programming'],
  timeline: [
    {
      id: 't1',
      date: '2017 — 2020',
      title: 'MCA, Ravenshaw University',
      org: 'Cuttack, Odisha',
      description: 'Master of Computer Applications with GPA 8.79/10.',
    },
    {
      id: 't2',
      date: '2022',
      title: 'GATE CSE 2022',
      org: '98.16 percentile — top 2% nationally',
      description: 'Scored 98.16 percentile, opening the door to a master’s at NIT Warangal.',
    },
    {
      id: 't3',
      date: '2022 — 2024',
      title: 'M.Tech Computer Science',
      org: 'NIT Warangal',
      description: 'Master of Technology in Computer Science Engineering, GPA 7.38/10.',
    },
    {
      id: 't4',
      date: '2024 — now',
      title: 'Backend / full-stack engineer',
      org: 'Datafoundry → Grassstone AI',
      description:
        'Built Go and Python services: connector frameworks, notification pipelines, and a distributed chat platform load-tested to 50K concurrent connections.',
    },
  ] satisfies TimelineEntry[],
}

export const skillGroups: SkillGroup[] = [
  {
    id: 'languages',
    title: 'Languages',
    summary: 'The tools I reach for without thinking.',
    skills: [
      { name: 'Go (Golang)', level: 88 },
      { name: 'Python', level: 92 },
      { name: 'SQL', level: 86 },
      { name: 'TypeScript', level: 78 },
      { name: 'JavaScript', level: 80 },
    ],
  },
  {
    id: 'backend',
    title: 'Backend & Systems',
    summary: 'Services with clear contracts and honest error states.',
    skills: [
      { name: 'FastAPI', level: 92 },
      { name: 'Gin', level: 86 },
      { name: 'REST APIs', level: 92 },
      { name: 'WebSockets', level: 85 },
      { name: 'gRPC', level: 72 },
    ],
  },
  {
    id: 'data',
    title: 'Data & Caching',
    summary: 'Storage, delivery, and knowing where the bottleneck is.',
    skills: [
      { name: 'PostgreSQL', level: 90 },
      { name: 'Redis (Cache, Pub/Sub)', level: 88 },
      { name: 'Celery', level: 80 },
      { name: 'SQLAlchemy / Pydantic', level: 88 },
      { name: 'Docker', level: 84 },
    ],
  },
  {
    id: 'cloud',
    title: 'Cloud & Frontend',
    summary: 'Shipping to the cloud, with enough UI to be dangerous.',
    skills: [
      { name: 'AWS (EC2, RDS, S3)', level: 80 },
      { name: 'React', level: 78 },
      { name: 'Git & Linux', level: 88 },
      { name: 'Pytest / Go testing', level: 84 },
      { name: 'LLM tool calling', level: 70 },
    ],
  },
  {
    id: 'practices',
    title: 'Core Concepts',
    summary: 'How the work stays maintainable.',
    skills: [
      { name: 'System design', level: 85 },
      { name: 'DSA', level: 85 },
      { name: 'OOP / design patterns', level: 82 },
      { name: 'Concurrency', level: 84 },
      { name: 'Microservices', level: 80 },
    ],
  },
]

export const projects: Project[] = [
  {
    id: 'tripsquad',
    name: 'TripSquad',
    tag: 'Platform',
    category: 'Full Stack',
    description:
      'Group trip coordination platform: real-time chat, live location, expense splitting with debt settlement, polls and itineraries.',
    stack: ['Go/Gin', 'PostgreSQL', 'WebSockets', 'AWS S3', 'Google OAuth', 'React Native'],
    highlights: [
      'Go/Gin backend with real-time chat and live location over WebSockets',
      'Google OAuth (PKCE) login with a pluggable Google Drive / S3 media connector',
      'Mobile client generated with Expo/React Native using AI-assisted development',
    ],
    image: `${import.meta.env.BASE_URL}projects/tripsquad.svg`,
    links: [
      { label: 'Live demo', url: 'https://tripsquad.onrender.com/' },
      { label: 'GitHub', url: 'https://github.com/SwavikPatra' },
    ],
  },
  {
    id: 'chat-platform',
    name: 'Distributed Chat Platform',
    tag: 'Real-time',
    category: 'Full Stack',
    description:
      'Distributed Go chat platform with WebSockets, Redis Pub/Sub, a custom round-robin load balancer and health checks.',
    stack: ['Go/Gin', 'Gorilla WebSocket', 'Redis Pub/Sub', 'PostgreSQL', 'React', 'JWT', 'Docker'],
    highlights: [
      'Load-tested to 50K concurrent connections across 3 servers (0% message loss, p99 ≈ 320 ms)',
      'Channel-based room event loops with slow-client eviction and cursor-based history backfill',
      'JWT auth, throttled typing indicators and Redis-backed presence tracking',
    ],
    image: `${import.meta.env.BASE_URL}projects/chat.svg`,
    links: [
      {
        label: 'GitHub',
        url: 'https://github.com/SwavikPatra/Distributed-Real-Time-Chat-Platform',
      },
    ],
  },
]

export const projectCategories = ['All', 'Full Stack', 'Frontend', 'Tooling', 'Open Source'] as const

export const roles: Role[] = [
  {
    id: 'r1',
    title: 'Fullstack Engineer Consultant',
    company: 'Grassstone AI',
    period: 'Jul 2025 — Oct 2026',
    location: 'Remote, India',
    summary: 'Designed and built backend systems for an AI-focused product team.',
    bullets: [
      'Designed a no-code connector framework in Go: admins add integrations via JSON on a super-admin panel, supporting OAuth and API-key authentication with goroutine-based token auto-refresh.',
      'Developed a Go/PostgreSQL task module with role-based access, letting teams assign tasks to external guest users, with attachments, chat, and due dates.',
      'Optimized PostgreSQL queries using execution plans and added Redis caching, improving API response times and reducing database load.',
      'Fine-tuned BioBERT to classify FDA warning letters into 12 categories; implemented a Python risk-evaluation pipeline.',
    ],
    stack: ['Go (Golang)', 'Python', 'FastAPI', 'PostgreSQL', 'Redis', 'REST APIs', 'Docker'],
  },
  {
    id: 'r2',
    title: 'Software Engineer',
    company: 'Datafoundry',
    period: 'Nov 2024 — Feb 2025',
    location: 'India',
    summary: 'Built notification ingestion and async data-processing pipelines.',
    bullets: [
      'Engineered a notification ingestion layer: buffered events in Redis and flushed them to PostgreSQL in batches of 100, reducing write load.',
      'Built async FastAPI REST APIs (Pydantic, SQLAlchemy) with Celery workers for medical data processing.',
      'Maintained a Python data pipeline with article extraction (web scraping) across 20+ biomedical journals.',
    ],
    stack: ['Python', 'FastAPI', 'PostgreSQL', 'Celery', 'Redis', 'TypeScript'],
  },
  {
    id: 'r3',
    title: 'Backend Engineer Intern',
    company: 'Datafoundry',
    period: 'Aug 2024 — Nov 2024',
    location: 'India',
    summary: 'First professional backend role, focused on multi-tenancy and data isolation.',
    bullets: [
      'Added sub-tenant data isolation: the sub-tenant ID is read from the JWT, stored on each row, and enforced on every read query.',
    ],
    stack: ['Python', 'FastAPI', 'PostgreSQL', 'JavaScript'],
  },
]

export const education = [
  {
    id: 'e1',
    date: '2022 — 2024',
    title: 'M.Tech in Computer Science Engineering',
    org: 'National Institute of Technology, Warangal',
    description: 'GPA 7.38/10.',
  },
  {
    id: 'e2',
    date: '2017 — 2020',
    title: 'Master of Computer Applications',
    org: 'Ravenshaw University, Cuttack',
    description: 'GPA 8.79/10.',
  },
  {
    id: 'e3',
    date: '2022',
    title: 'GATE CSE 2022 — 98.16 percentile',
    org: 'Top 2% nationally',
    description: 'Graduate Aptitude Test in Engineering, Computer Science.',
  },
]
