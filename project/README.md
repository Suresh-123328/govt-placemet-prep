# Exam Prep Register

A placement & government-exam practice app covering **10 sections, 202 topics, ~18,000+ questions**, mixing MCQ and Numeric Answer Type (NAT) questions across three difficulty levels — built for SSC / Banking / RRB style government exams and IT placement drives (TCS, Infosys, Wipro, Capgemini, Cognizant, etc.).

## Sections covered

| Section | Topics | Approach |
|---|---|---|
| Quantitative Aptitude | 35 | Formula-based generators (randomized numbers, always-correct answers) |
| Logical Reasoning | 26 | Generators + curated logic pools |
| Verbal Ability (English) | 24 | Curated word/grammar pools |
| Verbal Reasoning | 12 | Generators + curated pools |
| Python Programming | 29 | Code-trace generators + concept pools |
| C / C++ / Java | 20 | Code-trace generators + concept pools |
| Data Structures & Algorithms | 17 | Computational generators (sorting, complexity, DP, etc.) |
| DBMS & SQL | 15 | Curated concept pools + numeric aggregate generators |
| OS & Computer Networks | 12 | Curated concept pools |
| HR / Behavioral | 12 | Best-practice MCQ pools |

Most Quant/Reasoning/DSA topics generate close to 100 genuinely distinct questions per level (seeded random generation — different every practice session). Some topics are intentionally smaller where the domain itself is small (e.g. there are only 5 standard trigonometry angles tested in any real exam) — the app always reports the **real, honest count**, never a fake number.

## Tech stack

- React 18 + Vite
- No CSS framework — all styling is inline (ledger/exam-hall visual theme: navy, brass, mint/coral for correct/incorrect, monospace for numbers)
- [`lucide-react`](https://lucide.dev) for icons
- Zero backend — all question generation and scoring happens client-side

## Running locally

```bash
npm install
npm run dev
```

Then open the printed local URL (typically `http://localhost:5173`).

## Building for production

```bash
npm run build
npm run preview   # to test the production build locally
```

The static output lands in `dist/` and can be hosted anywhere (Netlify, Vercel, GitHub Pages, S3, etc.).

## Deploying to GitHub Pages

A ready-made workflow is included at `.github/workflows/deploy.yml`. After pushing this repo to GitHub:

1. Go to **Settings → Pages** in your repo.
2. Under **Build and deployment**, set **Source** to **GitHub Actions**.
3. Push to `main` (or run the workflow manually from the Actions tab).

Your app will be live at `https://<your-username>.github.io/<repo-name>/`.

## How progress is stored

The app was originally built for an in-chat AI artifact runtime that provides an async `window.storage` API. For this standalone build, `src/main.jsx` includes a small shim that reimplements the same API using the browser's `localStorage`, so **all scores and progress persist locally in each visitor's own browser** — no backend, no accounts, no data leaves the device.

## Project structure

```
├── index.html
├── package.json
├── vite.config.js
├── src/
│   ├── main.jsx        # entry point + localStorage shim for window.storage
│   ├── App.jsx          # the entire app: data, question generators, UI
│   └── index.css
└── .github/workflows/deploy.yml
```

`App.jsx` is intentionally a single file — it contains:

- `SECTION_META` / `TOPIC_LISTS` — the full section → topic map
- `GEN` — an object of `topicKey → (level, rng) => question` generator functions (the bulk of the file)
- `DEMO_CONTENT` — a few hand-authored static topics
- UI components: `Home`, `SectionView`, `TopicRow`, `QuizScreen`, `OMRRail`

## Extending it

To add or deepen a topic, add an entry to `GEN` keyed as `"section-id/topic-slug"`:

```js
"quant/my-new-topic": (level, rng) => {
  // use the provided helpers: randInt(rng, min, max), randChoice(rng, arr), etc.
  const a = randInt(rng, 1, 100);
  return { type: "nat", prompt: `What is ${a} + 1?`, correct: String(a + 1) };
},
```

For static/curated content instead of a formula, use the `poolGen({1: [...], 2: [...], 3: [...]})` helper — it turns a hand-written array of question objects into a generator, and the app will honestly report the pool size as the topic's capacity.

## License

MIT — do whatever you like with it.
