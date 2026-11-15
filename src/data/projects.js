// Every fact here comes from the project's README or Mahad's public posts. Nothing is invented.
export const projects = [
  {
    slug: 'mise',
    color: '#b5452c',
    name: 'Mise',
    tagline: 'Ordering, kitchen and revenue platform for independent restaurants.',
    year: '2026',
    role: 'Solo: product, backend, both web apps',
    stack: ['FastAPI', 'Next.js 15', 'PostgreSQL 16', 'Redis 7', 'SSE', 'Playwright', 'Docker'],
    repo: 'https://github.com/imahad-dev/mise',
    problem:
      'An independent restaurant runs on paper tickets and guesswork. The Wi-Fi drops halfway through an order, an allergy gets lost between the waiter and the kitchen, and the owner cannot say which dishes actually make money.',
    process: [
      ['Allergens are never left to a model', 'Food allergies can kill, so dietary checks use exact set matching against the EU-14 allergen list. No embeddings, no generated guesses.'],
      ['Orders survive bad Wi-Fi', 'The server hashes every order payload with SHA-256. A retried request returns the existing order, so the kitchen never cooks the same ticket twice.'],
      ['Staff stay in charge', 'Staff open a table before guests can order and approve the first order of each visit. Guests can ask to pay, but only staff settle a bill.'],
      ['The model writes words, the code writes numbers', 'Revenue, margins and the 7-day forecast are computed in SQL and a backtested model. A summary is rejected unless every number in it already exists in the computed facts.'],
      ['Tax is data, not code', 'Punjab, Islamabad, the UK and Dubai each have dated tax rates with their legal source, their own currency, rounding and payment methods.'],
    ],
    outcome: [
      'Guest ordering app, owner dashboard and live kitchen display, streaming over Server-Sent Events',
      'Nine table states on the floor view, with amber and red timers taken from service research',
      '7-day demand forecast that picks the method with the lowest error in a 14-day backtest',
      'Browser tests cover every guest screen at 360 px on slow 3G, including a dropped connection during payment',
      '122 commits in November 2026, MIT licensed',
    ],
    flow: ['Guest scans the table QR', 'Staff open the table', 'First order approved', 'Kitchen display', 'One bill per table', 'Staff confirm payment', 'Owner revenue brief'],
  },
  {
    slug: 'hifazat',
    color: '#17805c',
    name: 'Hifazat',
    tagline: 'A WhatsApp guardian that catches scams in Urdu and Punjabi before the money moves.',
    year: '2026',
    role: 'Solo: research, architecture, build',
    stack: ['LangGraph', 'FastAPI', 'Groq', 'Gemini', 'faster-whisper', 'MMS-TTS', 'Green API', 'Pydantic v2'],
    repo: 'https://github.com/imahad-dev/hifazat',
    problem:
      "I was scammed. No OTP was ever sent to me and the transaction still went through. Pakistan is one of eight countries that together hold over half of the world's 1.3 billion unbanked adults (World Bank Global Findex, 2025), and most fraud there follows one script: a fake bank call, manufactured urgency, a request for an OTP.",
    process: [
      ['No app, no reading required', 'It lives in WhatsApp, which people already have open. Voice notes go in through Whisper and the explanation comes back as spoken Urdu.'],
      ['Keywords before the model', 'Known scam phrases are matched first at zero cost. The language model only runs when a message is ambiguous.'],
      ['Nothing touches money without a human', 'Flagging a sender or recording a transaction goes to an approval queue. A reviewer decides, never the agent.'],
      ['Every dependency can fail', 'Each model, speech and voice call has a timeout and a canned fallback, so a failure degrades the reply instead of breaking it.'],
      ['Built for Pakistan, three times', 'Free tiers I planned around were unavailable here or not free, so I rebuilt the messaging and model layers three times in a few weeks.'],
    ],
    outcome: [
      'Core pipeline, voice in and out, WhatsApp channel, approval queue and reviewer dashboard are built and tested',
      'Webhook acknowledges in under 500 ms and drops duplicate deliveries',
      'The build-in-public post reached 47,006 impressions, 112 reactions and 20 comments on LinkedIn',
      'Still in active development: fraud patterns are being calibrated against real Pakistani scam messages',
    ],
    flow: ['WhatsApp message or voice note', 'Fast acknowledgement', 'Whisper speech to text', 'Intent classifier', 'Agent', 'Risk gate', 'Human approval queue', 'Urdu voice reply'],
  },
  {
    slug: 'mark-xxxv',
    color: '#14b8c4',
    name: 'Mark XXXV',
    tagline: 'A voice assistant that hears, sees and operates Windows, and keeps working for hours.',
    year: '2026',
    role: 'Solo: architecture and build',
    stack: ['Python', 'Gemini Live', 'Silero VAD', 'faster-whisper', 'SQLite WAL', 'ChromaDB', 'Playwright', 'PowerShell'],
    repo: 'https://github.com/imahad-dev/Mark-XXXV',
    problem:
      'Voice assistants answer questions and run fixed macros. Agents that can do real multi-step work on a computer tend to be slow to talk to, forget what they were doing, and are risky to leave alone with a shell and an API bill.',
    process: [
      ['Conversation without the pause', 'Audio streams both ways over the Gemini Live WebSocket, with Silero voice detection and local Whisper transcription. You can interrupt it mid-sentence.'],
      ['Goals that run for hours', 'A goal orchestrator breaks an objective into sub-tasks and runs them on a background queue, while spoken commands always take priority.'],
      ['Memory that does not silently vanish', 'When the history nears the token limit it is summarised in chunks, and pinned facts stay above the scratchpad where truncation cannot reach them.'],
      ['Hard limits, not good intentions', 'Each goal stops at a $2.00 budget and a delegation depth of three, and high-risk shell commands wait for approval.'],
      ['Crash and resume', 'Every step, tool call and token cost is logged to SQLite in WAL mode, so a restart picks up where it stopped.'],
    ],
    outcome: [
      'Four of six roadmap phases shipped: voice engine, OS control, parallel agents, long-term goal loop',
      '297 tests passing across the engines, persistence and concurrency controls',
      'Embeddings, task records and transcripts stay on the local disk',
    ],
    flow: ['Microphone and screen', 'Voice detection and transcription', 'Event bus', 'Live voice stream', 'Goal orchestrator', 'ReAct agent', 'Shell, windows, browser', 'SQLite cost ledger'],
  },
  {
    slug: 'ai-company',
    color: '#2f6bff',
    name: 'AI Company',
    tagline: 'A 14-agent software company pipeline where every file write waits for approval.',
    year: '2026',
    role: 'Solo: backend, dashboard, CI',
    stack: ['Python', 'FastAPI', 'TypeScript', 'SQLite', 'Docker', 'GitHub Actions'],
    repo: 'https://github.com/imahad-dev/AI-Employee.Company-',
    problem:
      'Multi-agent coding demos look impressive until you notice they write files, install packages and push commits with nobody watching, while spending API credits on every run.',
    process: [
      ['Mock provider by default', 'Development runs against a mock model, so building and testing the pipeline spends nothing. Anthropic, OpenAI, Gemini, Groq, OpenRouter and local servers are chosen per project.'],
      ['Mutations are requests', 'File writes, dependency installs, commits, shell commands and deployments are stored as approval requests before anything changes.'],
      ['Work is scored before handoff', "Each agent's output gets a quality score and is retried when it misses required detail, so weak work does not flow downstream."],
      ['Secrets are treated as secrets', 'Provider and GitHub tokens are encrypted at rest, and an optional operator key protects every mutating endpoint.'],
      ['It delivers through pull requests', 'The dashboard creates the repository, opens a pull request from approved files, runs preflight checks and polls merge readiness.'],
    ],
    outcome: [
      '14-agent pipeline with streamed progress and SQLite persistence',
      'CI runs backend tests, compile checks, frontend builds and Docker image builds on every push',
      'One command starts the whole stack locally',
    ],
    flow: ['Project brief', '14 agents in sequence', 'Quality score and retry', 'Approval request', 'Workspace files', 'GitHub pull request', 'Preflight checks'],
  },
  {
    slug: 'thetaguard',
    color: '#1fbf75',
    name: 'ThetaGuard',
    tagline: 'Five trading agents that refuse to hold a position through a scheduled macro release.',
    year: '2026',
    role: 'Solo, Alpaca × lablab.ai hackathon',
    stack: ['Python', 'LangGraph', 'FastAPI', 'Alpaca SDK', 'MCP', 'pytest'],
    repo: 'https://github.com/imahad-dev/ThetaGuard',
    problem:
      'Selling options premium earns steadily until one scheduled data release moves the market through your strikes. And an agent can report success on every cycle while it is quietly broken.',
    process: [
      ['Stand down on principle', 'An event-risk agent closes positions before the JOLTS and NFP releases and only resumes once implied volatility has been measured again.'],
      ['Defined risk only', 'Put credit spreads five dollars wide on SPY and QQQ, short delta between -0.15 and -0.20. No naked puts, and other symbols are rejected in code.'],
      ['Caps reject, they do not resize', 'At most two spreads, 5% of equity at risk in total and 2% per spread. A trade over the cap is refused outright.'],
      ['The reason is written first', 'The full decision is saved to the audit trail before the order is sent, so filled and rejected orders both leave a trace.'],
      ['I audited my own agent', 'A volatility figure labelled live was a hardcoded fallback, and expired positions could never close. I found both by checking the maths, then added data-source labels to every reading.'],
    ],
    outcome: [
      'Built in seven days for the Alpaca AI Trading Agents Hackathon, paper trading only',
      'Six components: event risk, strategy, risk gate, position monitor, execution, reporter',
      'Take-profit rests at 50% of credit and the stop-loss is polled at 200%',
      'The kickoff post reached 5,551 impressions on LinkedIn',
    ],
    flow: ['Market data and option chains', 'Event-risk agent', 'Strategy selector', 'Pre-trade risk gate', 'Execution agent', 'Position monitor', 'Reporter'],
  },
  {
    slug: 'tablesync',
    color: '#c98a4b',
    name: 'TableSync',
    tagline: 'Two robot arms that hand objects to each other, planned by a model and moved by maths.',
    year: '2026',
    role: 'Solo: simulation and control',
    stack: ['Python', 'MuJoCo', 'Gemini API', 'Pydantic', 'Inverse kinematics'],
    repo: 'https://github.com/imahad-dev/TableSync',
    problem:
      "A language model can look at a table and plan who should pick up what. It cannot be trusted to move a joint. Robot control has to be repeatable, and a model's output is not.",
    process: [
      ['A typed boundary', 'The planner sees the overhead camera and returns a plan as JSON, validated against a Pydantic schema. Nothing unvalidated reaches the arms.'],
      ['Deterministic motion', 'Damped least-squares inverse kinematics and generated waypoints move the joints the same way every run.'],
      ['One fixed handoff point', 'Both arms meet at a single waypoint that each can reach, defined once in the contract.'],
      ['Grip is verified, not assumed', 'A grasp only counts after ten consecutive frames of contact in the physics engine.'],
    ],
    outcome: [
      'Four-tier architecture: perception and reasoning, contract, control, physics',
      'Bimanual pick, handoff and place in MuJoCo',
      'Apache 2.0 licensed',
    ],
    flow: ['Overhead camera frame', 'Gemini task planner', 'Pydantic contract', 'Inverse kinematics', 'MuJoCo physics', 'Contact verification'],
  },
];

// [name, description, repo, tags]
export const more = [
  ['CareerVault', 'Scores a resume against a job description, shows the missing skills, then rewrites the bullets and exports to PDF or DOCX.', 'https://github.com/imahad-dev/careervault-resume.generator', ['React', 'FastAPI', 'Gemini', 'Stripe']],
  ['AgroSentinel', 'Built for the Kaggle × Google hackathon: agents diagnose crop disease from a photo and draft a parametric insurance claim.', 'https://github.com/imahad-dev/AgroSentinel', ['Multi-agent', 'Python', 'Vision']],
  ['Mini Jarvis Onboarder', 'Reads a GitHub repository and writes the codebase briefing, starter tickets and welcome email for a new engineer.', 'https://github.com/imahad-dev/Mini-Jarvis-Onboarder', ['Multi-agent', 'Gemma 4', 'Fireworks AI']],
];

export const skills = [
  ['Languages', [['Py', 'Python'], ['Ts', 'TypeScript'], ['Js', 'JavaScript'], ['C+', 'C++'], ['C#', 'C#'], ['Sq', 'SQL'], ['Sh', 'Bash']]],
  ['Backend and AI', [['Fa', 'FastAPI'], ['Dj', 'Django'], ['Fl', 'Flask'], ['No', 'Node.js'], ['Lg', 'LangGraph'], ['Rg', 'RAG'], ['Ge', 'Gemini API'], ['Mc', 'MCP']]],
  ['Frontend', [['Re', 'React'], ['Nx', 'Next.js'], ['Tw', 'Tailwind'], ['Vi', 'Vite']]],
  ['Cloud and DevOps', [['Aw', 'AWS'], ['Az', 'Azure'], ['Do', 'Docker'], ['K8', 'Kubernetes'], ['Ga', 'GitHub Actions'], ['Tf', 'Terraform'], ['Lx', 'Linux']]],
  ['Data', [['Pg', 'PostgreSQL'], ['Rd', 'Redis'], ['Mg', 'MongoDB'], ['Sl', 'SQLite']]],
  ['Hardware and IoT', [['Es', 'ESP-32'], ['Em', 'Embedded C++'], ['Io', 'IoT']]],
];

// As listed under Licenses & certifications on LinkedIn: [name, issuer, logo file in public/logos]
export const certs = [
  ['Claude Code in Action', 'Claude Academy, Anthropic', 'claude.svg'],
  ['Azure Administrator Associate', 'Microsoft', 'microsoft'],
  ['DevOps Engineer Expert, AZ-400 (in progress)', 'Microsoft Learning', 'microsoft'],
  ['AWS Cloud Practitioner Essentials', 'Amazon Web Services', 'aws'],
  ['Agentic AI Vibe Coding Specialist, Google Hackathon Performer', 'Google Developer Experts', 'google'],
  ['React Front-End Development', 'Meta', 'meta'],
  ['Python Programming Specialist', 'Kaggle', 'kaggle'],
  ['Pandas and Data Manipulation', 'Kaggle', 'kaggle'],
  ['Shell Scripting Master', 'Linux', 'linux'],
  ['Data Science and Analytics', 'HP', 'hp'],
  ['AI for Beginners', 'HP', 'hp'],
];

export const email ='chmahad005@gmail.com';
export const github = 'https://github.com/imahad-dev';
export const linkedin = 'https://www.linkedin.com/in/mahad-amir-3382a5426/';
