import { useState, useEffect, useMemo, useCallback } from "react";
import {
  ChevronRight, ChevronDown, Check, X, Circle, Clock, Award,
  Calculator, Brain, MessageSquare, Mic, Code, Database, Cpu, Users,
  ArrowLeft, RotateCcw, Sparkles, Lock
} from "lucide-react";

/* ============================================================
   TOKENS
   navy-900 #0E1A2B bg | navy-800 #16273D card | navy-700 #1E3350 raised
   brass #C9A24B primary accent | mint #4FB286 correct | coral #E1614A incorrect
   paper #EDE7D9 light text | ink-300 #8CA0B3 secondary text
   Display: Fraunces (serif, ledger feel) | Body: Inter | Utility: IBM Plex Mono
   ============================================================ */

const FONTS_LINK = "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap";

const C = {
  bg: "#0E1A2B",
  card: "#16273D",
  raised: "#1E3350",
  border: "#26405F",
  brass: "#C9A24B",
  brassDim: "#8A7440",
  mint: "#4FB286",
  coral: "#E1614A",
  paper: "#EDE7D9",
  ink300: "#8CA0B3",
  ink500: "#5E7690",
};

/* ============================================================
   SECTION / TOPIC MASTER LIST (skeleton — content loaded per topic)
   ============================================================ */

const SECTION_META = [
  { id: "quant", name: "Quantitative Aptitude", icon: Calculator, blurb: "Numbers, arithmetic, DI" },
  { id: "reasoning", name: "Logical Reasoning", icon: Brain, blurb: "Series, puzzles, arrangement" },
  { id: "verbal", name: "Verbal Ability (English)", icon: MessageSquare, blurb: "Grammar, vocabulary, RC" },
  { id: "verbal-reasoning", name: "Verbal Reasoning", icon: Mic, blurb: "Critical & analytical reasoning" },
  { id: "python", name: "Python Programming", icon: Code, blurb: "Syntax to OOP & DS" },
  { id: "coding", name: "C / C++ / Java", icon: Code, blurb: "Core language rounds" },
  { id: "dsa", name: "Data Structures & Algorithms", icon: Cpu, blurb: "Arrays to DP" },
  { id: "dbms", name: "DBMS & SQL", icon: Database, blurb: "Queries to normalization" },
  { id: "os-cn", name: "OS & Computer Networks", icon: Cpu, blurb: "Core CS fundamentals" },
  { id: "hr", name: "HR / Behavioral", icon: Users, blurb: "Interview readiness" },
];

const TOPIC_LISTS = {
  quant: [
    ["Percentages", 1], ["Number System", 1], ["HCF & LCM", 1], ["Simplification", 1],
    ["Square & Cube Roots", 1], ["Average", 1], ["Ratio & Proportion", 1], ["Ages Problems", 1],
    ["Simple Interest", 1], ["Surds & Indices", 1],
    ["Profit & Loss", 2], ["Compound Interest", 2], ["Partnership", 2], ["Mixture & Alligation", 2],
    ["Time & Work", 2], ["Pipes & Cisterns", 2], ["Time Speed & Distance", 2], ["Boats & Streams", 2],
    ["Trains", 2], ["Mensuration (Area/Volume)", 2], ["Linear Equations", 2], ["Quadratic Equations", 2],
    ["Permutation & Combination", 3], ["Probability", 3], ["Data Interpretation", 3], ["Progressions (AP/GP/HP)", 3],
    ["Logarithms", 3], ["Clocks & Calendars", 3], ["Races & Games", 3], ["Stocks & Shares", 3],
    ["Trigonometry", 3], ["Geometry", 3], ["Coordinate Geometry", 3], ["Set Theory", 3], ["Binomial Theorem", 3],
  ],
  reasoning: [
    ["Number & Alphabet Series", 1], ["Analogy", 1], ["Classification / Odd One Out", 1], ["Coding-Decoding", 1],
    ["Blood Relations", 1], ["Direction Sense", 1], ["Ranking & Order", 1], ["Missing Numbers", 1],
    ["Syllogism", 2], ["Statement & Conclusion", 2], ["Statement & Assumption", 2], ["Seating Arrangement", 2],
    ["Puzzles (Basic)", 2], ["Venn Diagrams", 2], ["Alphanumeric Series", 2], ["Inequality", 2],
    ["Complex Puzzles (Floor/Box)", 3], ["Data Sufficiency", 3], ["Critical Reasoning", 3], ["Cause & Effect", 3],
    ["Statement & Argument", 3], ["Input-Output", 3], ["Cube & Dice", 3], ["Mirror & Water Images", 3],
    ["Paper Folding", 3], ["Figure Series & Matrix", 3],
  ],
  verbal: [
    ["Synonyms", 1], ["Antonyms", 1], ["Spelling Correction", 1], ["One Word Substitution", 1],
    ["Articles", 1], ["Tenses", 1], ["Prepositions", 1], ["Subject-Verb Agreement", 1],
    ["Sentence Correction", 2], ["Sentence Improvement", 2], ["Fill in the Blanks", 2], ["Idioms & Phrases", 2],
    ["Active-Passive Voice", 2], ["Direct-Indirect Speech", 2], ["Para Jumbles", 2], ["Cloze Test", 2],
    ["Reading Comprehension", 3], ["Critical Reasoning Passages", 3], ["Sentence Rearrangement", 3],
    ["Error Spotting (Advanced)", 3], ["Word Usage in Context", 3], ["Verbal Analogies", 3],
    ["Paragraph Completion", 3], ["Summary / Theme Detection", 3],
  ],
  "verbal-reasoning": [
    ["Letter / Symbol Series", 1], ["Word Formation", 1], ["Coding-Decoding (Direction based)", 1],
    ["Logical Sequence of Words", 2], ["Statement - Course of Action", 2], ["Verbal Classification", 2],
    ["Analytical Reasoning Passages", 2],
    ["Strengthen / Weaken Argument", 3], ["Assumption Identification", 3], ["Logical Deduction", 3],
    ["Decision-Making Scenarios", 3], ["Data Sufficiency (Verbal)", 3],
  ],
  python: [
    ["Variables & Data Types", 1], ["Operators", 1], ["Input / Output", 1], ["Conditional Statements", 1],
    ["Loops", 1], ["Strings Basics", 1], ["Lists Basics", 1], ["Type Conversion", 1],
    ["Functions", 2], ["Tuples", 2], ["Dictionaries", 2], ["Sets", 2], ["String Methods", 2],
    ["List Comprehension", 2], ["Exception Handling", 2], ["File Handling", 2], ["Modules & Packages", 2], ["Recursion", 2],
    ["OOPs Concepts", 3], ["Lambda & Higher-order Functions", 3], ["Generators & Iterators", 3], ["Decorators", 3],
    ["Multithreading", 3], ["Regular Expressions", 3], ["Data Structures in Python", 3], ["Sorting & Searching", 3],
    ["NumPy / Pandas Basics", 3], ["API Handling", 3], ["DB Connectivity", 3],
  ],
  coding: [
    ["Syntax Basics", 1], ["Data Types", 1], ["Operators", 1], ["Control Statements", 1], ["Loops", 1], ["Arrays", 1],
    ["Functions", 2], ["Pointers (C/C++)", 2], ["String Handling", 2], ["Structures / Classes", 2],
    ["OOPs Concepts", 2], ["Constructors / Destructors", 2],
    ["Inheritance & Polymorphism", 3], ["Exception Handling", 3], ["Templates / Generics", 3], ["STL (C++)", 3],
    ["Collections Framework (Java)", 3], ["File I/O", 3], ["Multithreading", 3], ["Design Patterns", 3],
  ],
  dsa: [
    ["Arrays", 1], ["Strings", 1], ["Linear & Binary Search", 1],
    ["Sorting Algorithms", 2], ["Linked List", 2], ["Stack", 2], ["Queue", 2], ["Recursion", 2], ["Time Complexity", 2],
    ["Trees (Binary/BST/AVL)", 3], ["Graphs (BFS/DFS)", 3], ["Hashing", 3], ["Heaps", 3],
    ["Dynamic Programming", 3], ["Greedy Algorithms", 3], ["Backtracking", 3], ["Space-Time Complexity Analysis", 3],
  ],
  dbms: [
    ["Basic SQL Queries", 1], ["Data Types", 1], ["Keys (Primary/Foreign)", 1],
    ["Joins", 2], ["Group By / Having", 2], ["Subqueries", 2], ["Normalization (1NF-3NF)", 2], ["Aggregate Functions", 2],
    ["Indexing", 3], ["Transactions & ACID", 3], ["Views", 3], ["Stored Procedures", 3], ["Triggers", 3],
    ["Query Optimization", 3], ["ER Diagrams", 3],
  ],
  "os-cn": [
    ["OS Basics", 1], ["Process vs Thread", 1], ["Memory Types", 1],
    ["Scheduling Algorithms", 2], ["Deadlock", 2], ["Paging & Segmentation", 2], ["OSI / TCP-IP Model", 2],
    ["Synchronization (Semaphores/Mutex)", 3], ["Virtual Memory", 3], ["Concurrency", 3],
    ["Network Protocols", 3], ["IP Addressing / Subnetting", 3],
  ],
  hr: [
    ["Tell Me About Yourself", 1], ["Strengths & Weaknesses", 1], ["Why This Company", 1],
    ["Situational Questions", 2], ["Teamwork Examples", 2], ["Conflict Resolution", 2], ["Career Goals", 2],
    ["Leadership Scenarios", 3], ["Ethical Dilemmas", 3], ["Case-based HR Questions", 3],
    ["Salary Negotiation", 3], ["Company / Role Fit Questions", 3],
  ],
};

function slug(s) { return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""); }

/* ============================================================
   DEMO QUESTION CONTENT — a handful of topics loaded with real
   questions to prove the engine end-to-end. Everything else is
   scaffolded with planned:300 and empty levels until filled.
   ============================================================ */

const Q = (type, prompt, extra) => ({ type, prompt, ...extra });

const DEMO_CONTENT = {
  "quant/percentages": {
    1: [
      Q("mcq", "Convert 1/5 into a percentage.", { options: ["15%", "20%", "25%", "12.5%"], correct: 1 }),
      Q("nat", "What is 40% of 250?", { correct: "100" }),
      Q("mcq", "1/8 expressed as a percentage is:", { options: ["8%", "12.5%", "18%", "8.5%"], correct: 1 }),
      Q("nat", "Express 3/4 as a percentage (just the number, no % sign).", { correct: "75" }),
      Q("mcq", "68 is 25% of which number?", { options: ["204", "272", "285", "136"], correct: 1 }),
      Q("nat", "If 40% of a number is 12 less than 60% of the same number, find the number.", { correct: "60" }),
      Q("mcq", "50% expressed as a fraction is:", { options: ["1/5", "1/4", "1/2", "1/3"], correct: 2 }),
      Q("nat", "20% of 25% of 300 = ?", { correct: "15" }),
    ],
    2: [
      Q("mcq", "A's income is 25% more than B's. B's income is what % less than A's?", { options: ["20%", "25%", "30%", "15%"], correct: 0 }),
      Q("nat", "A candidate got 60% of votes and won by 4000 votes. Find total votes polled.", { correct: "20000" }),
      Q("mcq", "Price is increased 20% then decreased 20%. Net change is:", { options: ["No change", "4% decrease", "4% increase", "2% decrease"], correct: 1 }),
      Q("nat", "A shopkeeper marks goods 40% above cost and gives 10% discount. Find profit % (number only).", { correct: "26" }),
      Q("mcq", "In a class of 60, 40% are girls. 5 more girls join. New % of girls (approx)?", { options: ["42%", "44.6%", "46%", "48%"], correct: 1 }),
      Q("nat", "A reduction of 25% in sugar price lets a buyer get 5 kg more for Rs.600. Find original price per kg.", { correct: "40" }),
      Q("mcq", "Two numbers are 20% and 50% more than a third number. First is what % of second?", { options: ["70%", "75%", "80%", "85%"], correct: 2 }),
      Q("nat", "Population increases 10% annually, currently 22000. Find population 2 years ago (nearest integer).", { correct: "18182" }),
    ],
    3: [
      Q("mcq", "If 20%(A+B) = 50% of B, then (2A−B)/(2A+B) equals:", { options: ["1/3", "1/2", "2/3", "1/4"], correct: 1 }),
      Q("nat", "Difference of two numbers is 1660. 7.5% of one = 12.5% of other. Find the smaller number.", { correct: "2490" }),
      Q("mcq", "Length and breadth of a rectangle increase by 15% and 20%. Area increases by:", { options: ["35%", "38%", "40%", "32%"], correct: 1 }),
      Q("nat", "Each side of a cube increases by 10%. Find % increase in volume (nearest whole number).", { correct: "33" }),
      Q("mcq", "A's salary increased 150% then decreased 50%. Net % change is:", { options: ["No change", "25% increase", "50% increase", "75% increase"], correct: 1 }),
      Q("nat", "Price of rice increases 20%. By what % should consumption reduce to keep expenditure same? (nearest whole %)", { correct: "17" }),
      Q("mcq", "B is 17.5% less than A; C is 22.5% more than B. If C = 8085, A equals:", { options: ["7000", "8000", "8500", "7500"], correct: 1 }),
      Q("nat", "A number increased by 216 becomes 140% of itself. Find the number.", { correct: "540" }),
    ],
  },
  "reasoning/number-alphabet-series": {
    1: [
      Q("nat", "Find the next number: 2, 4, 6, 8, ?", { correct: "10" }),
      Q("mcq", "Find the odd one: 3, 5, 7, 10, 11", { options: ["3", "5", "10", "11"], correct: 2 }),
      Q("nat", "Find the next letter: A, C, E, G, ?", { correct: "I" }),
      Q("nat", "Find the missing number: 5, 10, 20, 40, ?", { correct: "80" }),
      Q("mcq", "Next term in 1, 4, 9, 16, ?", { options: ["20", "24", "25", "23"], correct: 2 }),
      Q("nat", "Find next: 100, 90, 80, 70, ?", { correct: "60" }),
      Q("nat", "Find next letter pair: AZ, BY, CX, ?", { correct: "DW" }),
      Q("mcq", "Odd one out: 2, 3, 5, 9, 11", { options: ["2", "3", "9", "11"], correct: 2 }),
    ],
    2: [
      Q("nat", "Find the next number: 3, 6, 11, 18, 27, ?", { correct: "38" }),
      Q("nat", "Find the missing term: 7, 14, 28, 56, ?", { correct: "112" }),
      Q("mcq", "Find the wrong number in series: 2, 5, 10, 17, 26, 35", { options: ["17", "26", "35", "10"], correct: 2 }),
      Q("nat", "Series: 1, 1, 2, 3, 5, 8, ? (Fibonacci)", { correct: "13" }),
      Q("nat", "Find next: 4, 9, 16, 25, 36, ?", { correct: "49" }),
      Q("mcq", "Next letter group: ZA, YB, XC, ?", { options: ["WD", "WE", "VD", "WC"], correct: 0 }),
      Q("nat", "Series: 2, 6, 12, 20, 30, ?", { correct: "42" }),
      Q("nat", "Find missing: 8, 27, 64, 125, ? (cubes)", { correct: "216" }),
    ],
    3: [
      Q("nat", "Find next term: 1, 2, 6, 24, 120, ?", { correct: "720" }),
      Q("mcq", "Find the wrong term: 3, 8, 15, 24, 34, 48", { options: ["24", "34", "48", "15"], correct: 1 }),
      Q("nat", "Series: 2, 3, 5, 9, 17, ?", { correct: "33" }),
      Q("nat", "Find next: 5, 11, 23, 47, ?", { correct: "95" }),
      Q("mcq", "Next in series: 1, 4, 10, 22, 46, ?", { options: ["94", "90", "88", "96"], correct: 0 }),
      Q("nat", "Series: 6, 11, 21, 36, 56, ?", { correct: "81" }),
      Q("nat", "Find missing: 10, 17, 26, 37, ?", { correct: "50" }),
      Q("mcq", "Odd one out (logic-based): 121, 144, 169, 200, 225", { options: ["144", "169", "200", "225"], correct: 2 }),
    ],
  },
  "verbal/synonyms": {
    1: [
      Q("mcq", "Synonym of 'Happy':", { options: ["Sad", "Joyful", "Angry", "Tired"], correct: 1 }),
      Q("mcq", "Synonym of 'Big':", { options: ["Small", "Huge", "Short", "Thin"], correct: 1 }),
      Q("mcq", "Synonym of 'Begin':", { options: ["End", "Start", "Stop", "Pause"], correct: 1 }),
      Q("mcq", "Synonym of 'Brave':", { options: ["Coward", "Fearful", "Courageous", "Weak"], correct: 2 }),
      Q("mcq", "Synonym of 'Quick':", { options: ["Slow", "Fast", "Lazy", "Late"], correct: 1 }),
      Q("mcq", "Synonym of 'Smart':", { options: ["Dull", "Clever", "Slow", "Careless"], correct: 1 }),
      Q("mcq", "Synonym of 'Calm':", { options: ["Angry", "Peaceful", "Loud", "Nervous"], correct: 1 }),
      Q("mcq", "Synonym of 'Old':", { options: ["Ancient", "New", "Young", "Fresh"], correct: 0 }),
    ],
    2: [
      Q("mcq", "Synonym of 'Meticulous':", { options: ["Careless", "Precise", "Lazy", "Hasty"], correct: 1 }),
      Q("mcq", "Synonym of 'Candid':", { options: ["Dishonest", "Frank", "Secretive", "Vague"], correct: 1 }),
      Q("mcq", "Synonym of 'Diligent':", { options: ["Lazy", "Hardworking", "Careless", "Slow"], correct: 1 }),
      Q("mcq", "Synonym of 'Ambiguous':", { options: ["Clear", "Unclear", "Certain", "Obvious"], correct: 1 }),
      Q("mcq", "Synonym of 'Resilient':", { options: ["Fragile", "Tough", "Weak", "Brittle"], correct: 1 }),
      Q("mcq", "Synonym of 'Pragmatic':", { options: ["Idealistic", "Practical", "Emotional", "Unrealistic"], correct: 1 }),
      Q("mcq", "Synonym of 'Reluctant':", { options: ["Eager", "Willing", "Unwilling", "Happy"], correct: 2 }),
      Q("mcq", "Synonym of 'Concise':", { options: ["Lengthy", "Brief", "Vague", "Detailed"], correct: 1 }),
    ],
    3: [
      Q("mcq", "Synonym of 'Ephemeral':", { options: ["Permanent", "Fleeting", "Eternal", "Lasting"], correct: 1 }),
      Q("mcq", "Synonym of 'Ubiquitous':", { options: ["Rare", "Omnipresent", "Scarce", "Hidden"], correct: 1 }),
      Q("mcq", "Synonym of 'Cogent':", { options: ["Weak", "Convincing", "Confusing", "Irrelevant"], correct: 1 }),
      Q("mcq", "Synonym of 'Ostentatious':", { options: ["Modest", "Showy", "Simple", "Plain"], correct: 1 }),
      Q("mcq", "Synonym of 'Vindicate':", { options: ["Accuse", "Justify", "Blame", "Condemn"], correct: 1 }),
      Q("mcq", "Synonym of 'Taciturn':", { options: ["Talkative", "Silent", "Loud", "Friendly"], correct: 1 }),
      Q("mcq", "Synonym of 'Pernicious':", { options: ["Harmless", "Harmful", "Helpful", "Kind"], correct: 1 }),
      Q("mcq", "Synonym of 'Placate':", { options: ["Anger", "Soothe", "Provoke", "Irritate"], correct: 1 }),
    ],
  },
  "python/variables-data-types": {
    1: [
      Q("mcq", "Which of these is a mutable data type in Python?", { options: ["tuple", "string", "list", "int"], correct: 2 }),
      Q("nat", "What is the output of: print(type(5))  — write just the type name shown, e.g. int", { correct: "int" }),
      Q("mcq", "Which symbol is used for comments in Python?", { options: ["//", "#", "--", "/*"], correct: 1 }),
      Q("nat", "What is the result of 7 // 2 in Python?", { correct: "3" }),
      Q("mcq", "Which is NOT a valid Python variable name?", { options: ["_value", "value1", "1value", "Value_1"], correct: 2 }),
      Q("nat", "What is the result of 2 ** 5?", { correct: "32" }),
      Q("mcq", "Python is a ___ typed language.", { options: ["Statically", "Dynamically", "Weakly only", "Not typed"], correct: 1 }),
      Q("nat", "What does bool(0) evaluate to? (write True or False)", { correct: "False" }),
    ],
    2: [
      Q("mcq", "What does the following return: len('hello')", { options: ["4", "5", "6", "Error"], correct: 1 }),
      Q("nat", "What is the output of: 'ab' * 3", { correct: "ababab" }),
      Q("mcq", "Which function converts a string to an integer?", { options: ["str()", "int()", "float()", "chr()"], correct: 1 }),
      Q("nat", "What is the output of list(range(3))? (write as e.g. [0, 1, 2])", { correct: "[0, 1, 2]" }),
      Q("mcq", "What does a dictionary use to store data?", { options: ["Index", "Key-value pairs", "Only values", "Nodes"], correct: 1 }),
      Q("nat", "What is the output of: 10 % 3", { correct: "1" }),
      Q("mcq", "Which of these creates an empty set correctly?", { options: ["{}", "set()", "[]", "()"], correct: 1 }),
      Q("nat", "What is the output of: sorted([3,1,2]) — write as [1, 2, 3]", { correct: "[1, 2, 3]" }),
    ],
    3: [
      Q("mcq", "What is the time complexity of dictionary lookup on average?", { options: ["O(n)", "O(log n)", "O(1)", "O(n^2)"], correct: 2 }),
      Q("nat", "What is the output of: [x**2 for x in range(4)] — write as [0, 1, 4, 9]", { correct: "[0, 1, 4, 9]" }),
      Q("mcq", "Which keyword is used to create a generator function?", { options: ["return", "yield", "gen", "async"], correct: 1 }),
      Q("nat", "What does 'self' refer to inside a Python class method?", { correct: "the instance" }),
      Q("mcq", "Which decorator is used for defining a static method?", { options: ["@classmethod", "@staticmethod", "@property", "@abstractmethod"], correct: 1 }),
      Q("nat", "What is the output of: bool([]) — write True or False", { correct: "False" }),
      Q("mcq", "Which module is used for regular expressions in Python?", { options: ["regex", "re", "pyregex", "restring"], correct: 1 }),
      Q("nat", "What is the output of: 3 == 3.0 — write True or False", { correct: "True" }),
    ],
  },
};

/* ============================================================
   QUANT QUESTION GENERATORS
   Formula-based generators — every call with a fresh RNG state
   produces a structurally-identical but numerically distinct
   question. This is how 300 genuinely different questions per
   topic get produced without hand-authoring each one.
   ============================================================ */

function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { [a, b] = [b, a % b]; } return a || 1; }
function reduceFrac(n, d) { if (d < 0) { n = -n; d = -d; } const g = gcd(n, d) || 1; return [n / g, d / g]; }
function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function hashStr(s) { let h = 0; for (let i = 0; i < s.length; i++) { h = (h << 5) - h + s.charCodeAt(i); h |= 0; } return h; }
function randInt(rng, min, max) { return Math.floor(rng() * (max - min + 1)) + min; }
function randChoice(rng, arr) { return arr[randInt(rng, 0, arr.length - 1)]; }
function shuffleArr(rng, arr) { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = randInt(rng, 0, i); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function round2(x) { return Math.round(x * 100) / 100; }
function fmt2(x) { const r = round2(x); return Number.isInteger(r) ? String(r) : r.toFixed(2); }
function modPow(base, exp, mod) {
  base = BigInt(base) % BigInt(mod); exp = BigInt(exp); mod = BigInt(mod); let result = 1n;
  while (exp > 0n) { if (exp & 1n) result = (result * base) % mod; base = (base * base) % mod; exp >>= 1n; }
  return Number(result);
}
function mcqOptions(rng, correctDisplay, distractorGen) {
  const opts = new Set([correctDisplay]);
  let guard = 0;
  while (opts.size < 4 && guard < 80) { guard++; const d = distractorGen(rng); if (d !== undefined && d !== null && !opts.has(String(d))) opts.add(String(d)); }
  let filler = 1;
  while (opts.size < 4) { opts.add(correctDisplay + "·" + filler++); }
  const arr = shuffleArr(rng, [...opts]);
  return { options: arr, correct: arr.indexOf(correctDisplay) };
}
function numDistractor(correct, spreadFn) { return (rng) => { const d = spreadFn(rng); return d === 0 ? undefined : correct + d; }; }
function asType(rng, natWeight = 0.5) { return rng() < natWeight ? "nat" : "mcq"; }

// Turns a curated {1:[...],2:[...],3:[...]} pool of question objects into a
// GEN-compatible function. Capacity is honestly the pool size at that level.
function poolGen(poolByLevel) {
  return (level, rng) => {
    const pool = poolByLevel[level] || [];
    if (!pool.length) return null;
    return pool[randInt(rng, 0, pool.length - 1)];
  };
}
// Builds a plain-fact MCQ from {q, a, wrong:[...]}
function factMcq(rng, q, a, wrong) {
  const opts = mcqOptions(rng, a, (r) => randChoice(r, wrong));
  return { type: "mcq", prompt: q, options: opts.options, correct: opts.correct };
}

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const GEN = {
  "quant/percentages": (level, rng) => {
    if (level === 1) {
      const variants = [
        () => { const d = randChoice(rng, [2,4,5,8,10,20,25,40,50]); const val = randInt(rng,2,40); const n = val*d; const pct = fmt2(100/d);
          return { type:"nat", prompt:`Convert 1/${d} into a percentage (just the number, no % sign).`, correct: pct }; },
        () => { const pct = randChoice(rng,[5,10,15,20,25,30,40,50,60,75,80]); const base = randInt(rng,4,50)*20; const ans = round2(base*pct/100);
          return { type:"nat", prompt:`What is ${pct}% of ${base}?`, correct: fmt2(ans) }; },
        () => { const pct = randChoice(rng,[10,20,25,40,50,60,75]); const base = randInt(rng,20,400); const num = randInt(rng,10,90); const val = round2(base*pct/100);
          const t = asType(rng); const q = {type:t, prompt:`${val} is ${pct}% of which number? `, };
          if(t==="nat"){ q.correct = fmt2(base); } else { const opts = mcqOptions(rng, fmt2(base), numDistractor(base,(r)=>randInt(r,-40,40)*(r()<0.5?1:2))); q.options=opts.options; q.correct=opts.correct; }
          return q; },
      ];
      return randChoice(rng, variants)();
    }
    if (level === 2) {
      const variants = [
        () => { const base = randInt(rng,2,20)*10; const more = randChoice(rng,[10,20,25,30,40,50]); const bigger = base*(100+more)/100;
          const lessPct = round2(more/(100+more)*100);
          return { type:"nat", prompt:`A's income is ${more}% more than B's. B's income is what % less than A's? (round to 2 decimals)`, correct: fmt2(lessPct) }; },
        () => { const winPct = randChoice(rng,[52,55,58,60,62,65,70]); const margin = randInt(rng,5,80)*100;
          const total = Math.round(margin/((2*winPct-100)/100));
          return { type:"nat", prompt:`A candidate got ${winPct}% of votes and won by ${margin} votes. Find total votes polled.`, correct: fmt2(total) }; },
        () => { const up = randChoice(rng,[10,20,25,30,40]); const down = randChoice(rng,[10,20,25,30,40]);
          const net = round2(((100+up)*(100-down)/100 - 100));
          const t = asType(rng);
          const q = { type:t, prompt:`Price is increased by ${up}% and then decreased by ${down}%. Find the net % change (negative if decrease).` };
          if(t==="nat"){ q.correct = fmt2(net); } else { const opts=mcqOptions(rng, fmt2(net), numDistractor(net,(r)=>randInt(r,-10,10))); q.options=opts.options; q.correct=opts.correct; }
          return q; },
        () => { const cp=randInt(rng,50,400); const markUp=randChoice(rng,[10,20,25,30,40,50]); const disc=randChoice(rng,[5,10,15,20]);
          const profit = round2(((100+markUp)*(100-disc)/100)-100);
          return { type:"nat", prompt:`A shopkeeper marks goods ${markUp}% above cost price and gives a ${disc}% discount. Find his profit % (round 2 decimals).`, correct: fmt2(profit) }; },
      ];
      return randChoice(rng, variants)();
    }
    // level 3
    const variants = [
      () => { const B = randInt(rng,2,20)*10; const A = round2(B*(100+randChoice(rng,[10,20,25,30]))/100);
        return { type:"nat", prompt:`If 20% of (A+B) = 50% of B, and B = ${B}, find A (round 2 decimals). [Hint: derive A from 0.2A+0.2B=0.5B]`, correct: fmt2(round2(1.5*B)) }; },
      () => { const smaller = randInt(rng,10,200)*10; const bigPct=randChoice(rng,[125,140,150,160,175]); const diff = round2(smaller*(bigPct-100)/100);
        return { type:"nat", prompt:`The difference between two numbers is ${fmt2(diff)}. The bigger number is ${bigPct}% of the smaller. Find the smaller number.`, correct: fmt2(smaller) }; },
      () => { const l=randInt(rng,5,15); const b=randInt(rng,5,15); const incL=randChoice(rng,[10,15,20,25]); const incB=randChoice(rng,[10,15,20,25]);
        const areaInc = round2(((100+incL)*(100+incB)/100)-100);
        return { type:"nat", prompt:`Length and breadth of a rectangle increase by ${incL}% and ${incB}% respectively. Find % increase in area (round 2 decimals).`, correct: fmt2(areaInc) }; },
      () => { const side=randInt(rng,3,20); const inc=randChoice(rng,[5,10,15,20,25]); const volInc = round2((Math.pow(1+inc/100,3)-1)*100);
        return { type:"nat", prompt:`Each side of a cube increases by ${inc}%. Find % increase in volume (round 2 decimals).`, correct: fmt2(volInc) }; },
      () => { const up = randChoice(rng,[10,20,25,30,40,50]); const reduceNeeded = round2(up/(100+up)*100);
        return { type:"nat", prompt:`The price of an item increases by ${up}%. By what % should consumption be reduced so expenditure stays the same? (round 2 decimals)`, correct: fmt2(reduceNeeded) }; },
    ];
    return randChoice(rng, variants)();
  },

  "quant/number-system": (level, rng) => {
    if (level === 1) {
      const n = randInt(rng, 100, 999); const d = randInt(rng, 3, 12);
      return { type: "nat", prompt: `Find the remainder when ${n} is divided by ${d}.`, correct: String(n % d) };
    }
    if (level === 2) {
      const a = randInt(rng, 10, 200); const b = randInt(rng, a + 10, a + 300); const d = randInt(rng, 2, 9);
      const cnt = Math.floor(b / d) - Math.floor((a - 1) / d);
      return { type: "nat", prompt: `How many numbers between ${a} and ${b} (inclusive) are divisible by ${d}?`, correct: String(cnt) };
    }
    const a = randChoice(rng, [2,3,4,6,7,8,9,11,12,13,14]); const b = randInt(rng, 20, 500);
    const ud = modPow(a, b, 10);
    return { type: "nat", prompt: `Find the unit digit of ${a}^${b}.`, correct: String(ud) };
  },

  "quant/hcf-lcm": (level, rng) => {
    if (level === 1) {
      const h = randInt(rng, 2, 15); const p = randInt(rng, 2, 8); const q = randInt(rng, 2, 8);
      if (gcd(p, q) !== 1) return GEN["quant/hcf-lcm"](1, rng);
      return { type: "nat", prompt: `Find the HCF of ${h*p} and ${h*q}.`, correct: String(h) };
    }
    if (level === 2) {
      const h = randInt(rng, 2, 12); const p = randInt(rng, 2, 9); const q = randInt(rng, 2, 9);
      if (gcd(p, q) !== 1) return GEN["quant/hcf-lcm"](2, rng);
      const lcm = h * p * q;
      return { type: "nat", prompt: `Find the LCM of ${h*p} and ${h*q}.`, correct: String(lcm) };
    }
    const h = randInt(rng, 2, 10); const p = randInt(rng, 2, 8); const q = randInt(rng, 2, 8);
    if (gcd(p, q) !== 1) return GEN["quant/hcf-lcm"](3, rng);
    const l = h * p * q; const x = h * p; const other = h * q;
    return { type: "nat", prompt: `HCF and LCM of two numbers are ${h} and ${l}. If one number is ${x}, find the other.`, correct: String(other) };
  },

  "quant/simplification": (level, rng) => {
    if (level === 1) {
      const e = randInt(rng, 2, 9); const dq = randInt(rng, 2, 12); const d = dq * e;
      const a = randInt(rng, 10, 90); const b = randInt(rng, 2, 12); const c = randInt(rng, 2, 15);
      const result = a + b * c - dq;
      return { type: "nat", prompt: `Simplify: ${a} + ${b} × ${c} − ${d} ÷ ${e} = ?`, correct: String(result) };
    }
    if (level === 2) {
      const b1 = randInt(rng, 2, 9), b2 = randInt(rng, 2, 9); const a1 = randInt(rng, 1, b1 - 1 || 1), a2 = randInt(rng, 1, b2 - 1 || 1);
      const num = a1 * b2 + a2 * b1; const den = b1 * b2; const [rn, rd] = reduceFrac(num, den);
      return { type: "nat", prompt: `Simplify: ${a1}/${b1} + ${a2}/${b2} = ? (answer as reduced fraction p/q)`, correct: `${rn}/${rd}` };
    }
    const a = randInt(rng, 2, 20), b = randInt(rng, 2, 20), c = randInt(rng, 2, 9); const e = randInt(rng, 2, 9);
    const inner = (a + b) * c; const dq = randInt(rng, 2, 10); const d = dq * e; const result = Math.round((inner - d) / e);
    return { type: "nat", prompt: `Simplify: [(${a}+${b}) × ${c} − ${d}] ÷ ${e} = ?`, correct: String(result) };
  },

  "quant/square-cube-roots": (level, rng) => {
    if (level === 1) { const n = randInt(rng, 10, 109); return { type: "nat", prompt: `Find the square root of ${n * n}.`, correct: String(n) }; }
    if (level === 2) { const n = randInt(rng, 4, 103); return { type: "nat", prompt: `Find the cube root of ${n * n * n}.`, correct: String(n) }; }
    const k = randInt(rng, 2, 6), m = randInt(rng, 2, 10); const a = k * k * m * m; const j = randInt(rng, 2, 6);
    const b = j * j; const val = k * m + j;
    return { type: "nat", prompt: `Simplify: √${a} + √${b} (both are perfect squares).`, correct: String(val) };
  },

  "quant/average": (level, rng) => {
    if (level === 1) {
      const k = randInt(rng, 4, 7); const nums = Array.from({ length: k }, () => randInt(rng, 10, 99));
      const sum = nums.reduce((s, x) => s + x, 0);
      return { type: "nat", prompt: `Find the average of: ${nums.join(", ")} (round to 2 decimals if needed).`, correct: fmt2(sum / k) };
    }
    if (level === 2) {
      const k = randInt(rng, 5, 12); const avg = randInt(rng, 20, 80); const x = randInt(rng, 10, 100);
      const newAvg = (avg * k + x) / (k + 1);
      return { type: "nat", prompt: `The average of ${k} numbers is ${avg}. A new number ${x} is added. Find the new average (round 2 decimals).`, correct: fmt2(newAvg) };
    }
    const n = randInt(rng, 2, 101);
    return { type: "nat", prompt: `Find the average of the first ${n} natural numbers (round 2 decimals).`, correct: fmt2((n + 1) / 2) };
  },

  "quant/ratio-proportion": (level, rng) => {
    if (level === 1) {
      const g = randInt(rng, 2, 12); const p = randInt(rng, 2, 15), q = randInt(rng, 2, 15);
      if (gcd(p, q) !== 1) return GEN["quant/ratio-proportion"](1, rng);
      return { type: "nat", prompt: `Simplify the ratio ${g*p}:${g*q} to its lowest terms (as p:q).`, correct: `${p}:${q}` };
    }
    if (level === 2) {
      const a = randInt(rng, 2, 9), b = randInt(rng, 2, 9), c = randInt(rng, 2, 9);
      const ac = a * c, bc = b * c; const [an, bn] = reduceFrac(ac, bc);
      return { type: "nat", prompt: `If a:b = ${a}:${b} and b:c = ${b}:${c}, find a:c (as p:q reduced).`, correct: `${an}:${bn}` };
    }
    const a = randInt(rng, 2, 6), b = randInt(rng, 2, 6), c = randInt(rng, 2, 6); const N = (a + b + c) * randInt(rng, 2, 10);
    const unit = N / (a + b + c); const largest = Math.max(a, b, c) * unit;
    return { type: "nat", prompt: `Divide ${N} in the ratio ${a}:${b}:${c}. Find the largest share.`, correct: String(largest) };
  },

  "quant/ages-problems": (level, rng) => {
    if (level === 1) { const x = randInt(rng, 20, 60); const y = randInt(rng, 2, 15); return { type: "nat", prompt: `A person is ${x} years old today. Find the age ${y} years ago.`, correct: String(x - y) }; }
    if (level === 2) {
      const r = randInt(rng, 2, 4); const y = randInt(rng, 2, 10); const B = randInt(rng, 8, 20); const A = r * B; const S = A + B + 2 * y;
      return { type: "nat", prompt: `A's present age is ${r} times B's. After ${y} years, sum of their ages will be ${S}. Find A's present age.`, correct: String(A) };
    }
    const p = randInt(rng, 2, 6), q = randInt(rng, p + 1, p + 6); const k = randInt(rng, 2, 8); const A = p * k, B = q * k; const y = randInt(rng, 2, 12);
    const [p2, q2] = reduceFrac(A + y, B + y);
    return { type: "nat", prompt: `Present ages of A and B are in ratio ${p}:${q}. After ${y} years, the ratio becomes ${p2}:${q2}. Find A's present age.`, correct: String(A) };
  },

  "quant/simple-interest": (level, rng) => {
    if (level === 1) { const P = randInt(rng, 5, 50) * 100; const R = randChoice(rng, [4,5,6,8,10,12]); const T = randInt(rng, 2, 6); const SI = P*R*T/100; return { type: "nat", prompt: `Find the Simple Interest on ₹${P} at ${R}% p.a. for ${T} years.`, correct: fmt2(SI) }; }
    if (level === 2) { const P = randInt(rng, 5, 50) * 100; const R = randChoice(rng, [4,5,6,8,10]); const T = randInt(rng, 2, 5); const A = P + P*R*T/100; return { type: "nat", prompt: `Find the amount when ₹${P} is invested at ${R}% p.a. Simple Interest for ${T} years.`, correct: fmt2(A) }; }
    const T = randChoice(rng, [2,4,5,8,10,20,25]); const R = fmt2(100 / T);
    return { type: "nat", prompt: `At what rate % p.a. will a sum double itself in ${T} years at Simple Interest? (round 2 decimals)`, correct: R };
  },

  "quant/surds-indices": (level, rng) => {
    if (level === 1) { const a = randChoice(rng, [2,3,4,5,6,7]); const m = randInt(rng, 1, 6), n = randInt(rng, 1, 6); return { type: "nat", prompt: `Simplify: ${a}^${m} × ${a}^${n} (give the numeric value).`, correct: String(Math.pow(a, m + n)) }; }
    if (level === 2) { const a = randChoice(rng, [2,3,4]); const m = randInt(rng, 1, 4), n = randInt(rng, 1, 3), k = randInt(rng, 0, 3); const exp = m*n - k; if (exp < 0 || exp > 14) return GEN["quant/surds-indices"](2, rng); return { type: "nat", prompt: `Simplify: (${a}^${m})^${n} ÷ ${a}^${k} (give the numeric value).`, correct: String(Math.pow(a, exp)) }; }
    const b = randChoice(rng, [2,3,5]); const t = randInt(rng, 3, 9); const c = randInt(rng, 0, 3); const N = Math.pow(b, t);
    return { type: "nat", prompt: `Solve for x: ${b}^(x+${c}) = ${N}`, correct: String(t - c) };
  },

  "quant/profit-loss": (level, rng) => {
    if (level === 1) { const CP = randInt(rng, 50, 900); const pct = randChoice(rng, [-30,-20,-10,10,15,20,25,30,40]); const SP = round2(CP * (100 + pct) / 100); return { type: "nat", prompt: `An article bought for ₹${CP} is sold for ₹${SP}. Find profit or loss % (enter negative for loss, round 2 decimals).`, correct: fmt2(pct) }; }
    if (level === 2) { const m = randChoice(rng, [10,15,20,25,30,35,40,45,50]); const d = randChoice(rng, [5,8,10,12,15,18,20]); const profit = round2(((100+m)*(100-d)/100)-100); return { type: "nat", prompt: `A shopkeeper marks goods ${m}% above CP and gives ${d}% discount. Find profit % (round 2 decimals).`, correct: fmt2(profit) }; }
    const SP1 = randInt(rng, 200, 900); const L = randChoice(rng, [5,10,15,20]); const G = randChoice(rng, [10,15,20,25,30]);
    const CP = round2(SP1 * 100 / (100 - L)); const newSP = round2(CP * (100 + G) / 100);
    return { type: "nat", prompt: `By selling an article for ₹${SP1}, a man loses ${L}%. At what price should he sell to gain ${G}%? (round 2 decimals)`, correct: fmt2(newSP) };
  },

  "quant/compound-interest": (level, rng) => {
    if (level === 1) { const P = randInt(rng, 5, 50) * 100; const R = randChoice(rng, [4,5,8,10,12,20]); const CI = round2(P * (Math.pow(1 + R/100, 2) - 1)); return { type: "nat", prompt: `Find the Compound Interest on ₹${P} at ${R}% p.a. for 2 years (compounded annually, round 2 decimals).`, correct: fmt2(CI) }; }
    if (level === 2) { const P = randInt(rng, 5, 50) * 100; const R = randChoice(rng, [5,8,10,12]); const T = randInt(rng, 2, 4); const A = round2(P * Math.pow(1 + R/100, T)); return { type: "nat", prompt: `Find the amount on ₹${P} at ${R}% p.a. for ${T} years, compounded annually (round 2 decimals).`, correct: fmt2(A) }; }
    const P = randInt(rng, 5, 50) * 100; const R = randChoice(rng, [5,8,10,12,20]); const diff = round2(P * Math.pow(R/100, 2));
    return { type: "nat", prompt: `Find the difference between CI and SI on ₹${P} at ${R}% p.a. for 2 years (round 2 decimals).`, correct: fmt2(diff) };
  },

  "quant/partnership": (level, rng) => {
    if (level === 1) { const a = randInt(rng, 2, 20) * 100; const b = randInt(rng, 2, 20) * 100; const P = randInt(rng, 10, 90) * 100; const share = round2(P * a / (a + b)); return { type: "nat", prompt: `A and B invest ₹${a} and ₹${b} respectively. If the total profit is ₹${P}, find A's share (round 2 decimals).`, correct: fmt2(share) }; }
    if (level === 2) { const a = randInt(rng, 2, 10) * 100, t1 = randInt(rng, 2, 12); const b = randInt(rng, 2, 10) * 100, t2 = randInt(rng, 2, 12); const P = randInt(rng, 10, 90) * 100; const share = round2(P * (b*t2) / (a*t1 + b*t2)); return { type: "nat", prompt: `A invests ₹${a} for ${t1} months, B invests ₹${b} for ${t2} months. Profit is ₹${P}. Find B's share (round 2 decimals).`, correct: fmt2(share) }; }
    const r1 = randInt(rng, 2, 6), r2 = randInt(rng, 2, 6), r3 = randInt(rng, 2, 6); const S = r1+r2+r3; const P = S * randInt(rng, 10, 100);
    return { type: "nat", prompt: `A, B, C invest in ratio ${r1}:${r2}:${r3}. If total profit is ₹${P}, find A's share.`, correct: String(P * r1 / S) };
  },

  "quant/mixture-alligation": (level, rng) => {
    if (level === 1) { const p1 = randInt(rng, 10, 40), p2 = randInt(rng, p1+5, p1+40); const pm = randInt(rng, p1+1, p2-1); const [rn, rd] = reduceFrac(p2-pm, pm-p1); return { type: "nat", prompt: `Tea at ₹${p1}/kg is mixed with tea at ₹${p2}/kg to get a mixture worth ₹${pm}/kg. Find the ratio (cheaper:dearer) (as p:q reduced).`, correct: `${rn}:${rd}` }; }
    if (level === 2) { const a = randInt(rng, 2, 9), b = randInt(rng, 2, 9); const pct = round2(a/(a+b)*100); return { type: "nat", prompt: `A mixture contains milk and water in ratio ${a}:${b}. Find the % of milk in the mixture (round 2 decimals).`, correct: fmt2(pct) }; }
    const V = randInt(rng, 20, 100); const x = randInt(rng, 2, Math.floor(V/3)); const n = randInt(rng, 2, 3);
    const remaining = round2(V * Math.pow(1 - x/V, n));
    return { type: "nat", prompt: `A container has ${V} L of milk. ${x} L is replaced with water, and this is repeated ${n} times. Find remaining milk (L, round 2 decimals).`, correct: fmt2(remaining) };
  },

  "quant/time-work": (level, rng) => {
    if (level === 1) { const a = randInt(rng, 5, 30); const d = randInt(rng, 1, a-1); const [rn, rd] = reduceFrac(d, a); return { type: "nat", prompt: `A can complete a work in ${a} days. Find the work done by A in ${d} days (as reduced fraction p/q).`, correct: `${rn}/${rd}` }; }
    if (level === 2) { const a = randInt(rng, 5, 30), b = randInt(rng, 5, 30); const t = round2(a*b/(a+b)); return { type: "nat", prompt: `A can do a work in ${a} days, B in ${b} days. In how many days can they finish it together? (round 2 decimals)`, correct: fmt2(t) }; }
    const a = randInt(rng, 6, 20); const ab = randInt(rng, 2, a-1); const B = round2(ab*a/(a-ab));
    return { type: "nat", prompt: `A and B together finish a work in ${ab} days. A alone takes ${a} days. In how many days can B alone finish it? (round 2 decimals)`, correct: fmt2(B) };
  },

  "quant/pipes-cisterns": (level, rng) => {
    if (level === 1) { const a = randInt(rng, 5, 20); const t = randInt(rng, 1, a-1); const [rn, rd] = reduceFrac(t, a); return { type: "nat", prompt: `A pipe fills a tank in ${a} hours. What fraction of the tank fills in ${t} hours? (as reduced fraction p/q)`, correct: `${rn}/${rd}` }; }
    if (level === 2) { const b = randInt(rng, 8, 25); const a = randInt(rng, 2, b-1); const t = round2(1/(1/a - 1/b)); return { type: "nat", prompt: `Pipe A fills a tank in ${a} hrs; pipe B empties it in ${b} hrs. If both are opened together, find the time to fill the tank (hrs, round 2 decimals).`, correct: fmt2(t) }; }
    const a = randInt(rng, 4, 12), b = randInt(rng, 4, 12); const t = randInt(rng, 1, 4);
    const T = round2((1 + t/a) / (1/a + 1/b));
    return { type: "nat", prompt: `Pipes A and B fill a tank in ${a} and ${b} hours resp. Both are opened together but A is closed ${t} hours before the tank is full. Find total time to fill (hrs, round 2 decimals).`, correct: fmt2(T) };
  },

  "quant/time-speed-distance": (level, rng) => {
    if (level === 1) { const s = randInt(rng, 20, 100); const t = randInt(rng, 1, 8); const d = s * t; return { type: "nat", prompt: `A car travels ${d} km in ${t} hours. Find its speed (km/h).`, correct: String(s) }; }
    if (level === 2) { const s = randInt(rng, 20, 120); const t = randInt(rng, 1, 8); const d = s * t; return { type: "nat", prompt: `A train travels at ${s} km/h. How long will it take to cover ${d} km? (hours)`, correct: String(t) }; }
    const s1 = randInt(rng, 30, 80), s2 = randInt(rng, 30, 80); const t = randInt(rng, 1, 6); const D = (s1+s2)*t;
    return { type: "nat", prompt: `Two trains ${D} km apart move toward each other at ${s1} km/h and ${s2} km/h. After how many hours will they meet?`, correct: String(t) };
  },

  "quant/boats-streams": (level, rng) => {
    if (level === 1) { const b = randInt(rng, 10, 25), s = randInt(rng, 1, 8); return { type: "nat", prompt: `Boat speed in still water is ${b} km/h, stream speed is ${s} km/h. Find downstream speed (km/h).`, correct: String(b+s) }; }
    if (level === 2) { const b = randInt(rng, 15, 30), s = randInt(rng, 1, b-5); return { type: "nat", prompt: `Boat speed in still water is ${b} km/h, stream speed is ${s} km/h. Find upstream speed (km/h).`, correct: String(b-s) }; }
    const down = randInt(rng, 15, 40), up = randInt(rng, 5, down-2); const d = down * up * randInt(rng,1,2);
    const t1 = round2(d/down), t2 = round2(d/up); const boat = round2((down+up)/2);
    return { type: "nat", prompt: `A boat covers ${d} km downstream in ${fmt2(t1)} hours and returns upstream in ${fmt2(t2)} hours. Find its speed in still water (km/h, round 2 decimals).`, correct: fmt2(boat) };
  },

  "quant/trains": (level, rng) => {
    if (level === 1) { const L = randInt(rng, 100, 300); const t = randInt(rng, 5, 20); const speed = round2((L/t)*18/5); return { type: "nat", prompt: `A train ${L} m long crosses a pole in ${t} seconds. Find its speed (km/h, round 2 decimals).`, correct: fmt2(speed) }; }
    if (level === 2) { const L = randInt(rng, 100, 250), P = randInt(rng, 50, 200); const t = randInt(rng, 10, 30); return { type: "nat", prompt: `A train ${L} m long crosses a ${P} m platform in ${t} seconds. Find its speed (m/s, round 2 decimals).`, correct: fmt2(round2((L+P)/t)) }; }
    const L1 = randInt(rng, 100, 200), L2 = randInt(rng, 100, 200); const s1 = randInt(rng, 40, 80), s2 = randInt(rng, 40, 80);
    const relSpeed = (s1+s2)*5/18; const time = round2((L1+L2)/relSpeed);
    return { type: "nat", prompt: `Two trains ${L1} m and ${L2} m long run in opposite directions at ${s1} km/h and ${s2} km/h. Find the time taken to cross each other (seconds, round 2 decimals).`, correct: fmt2(time) };
  },

  "quant/mensuration-area-volume": (level, rng) => {
    if (level === 1) { const l = randInt(rng, 4, 40), b = randInt(rng, 4, 40); return { type: "nat", prompt: `Find the area of a rectangle with length ${l} and breadth ${b}.`, correct: String(l*b) }; }
    if (level === 2) { const r = randInt(rng, 1, 20) * 7; const area = round2((22/7)*r*r); return { type: "nat", prompt: `Find the area of a circle with radius ${r} (use π = 22/7, round 2 decimals).`, correct: fmt2(area) }; }
    const r = randChoice(rng, [7,14,21]); const h = randInt(rng, 5, 20); const vol = round2((22/7)*r*r*h);
    return { type: "nat", prompt: `Find the volume of a cylinder with radius ${r} and height ${h} (use π = 22/7, round 2 decimals).`, correct: fmt2(vol) };
  },

  "quant/linear-equations": (level, rng) => {
    if (level === 1) { const a = randInt(rng, 2, 40), b = randInt(rng, 10, 100); return { type: "nat", prompt: `Solve for x: x + ${a} = ${b}`, correct: String(b-a) }; }
    if (level === 2) { const a = randInt(rng, 2, 9); const x = randInt(rng, 2, 30); const b = randInt(rng, 1, 30); const c = a*x + b; return { type: "nat", prompt: `Solve for x: ${a}x + ${b} = ${c}`, correct: String(x) }; }
    const x = randInt(rng, 2, 30), y = randInt(rng, 2, 30); const s = x+y, d = x-y;
    return { type: "nat", prompt: `Solve: x + y = ${s}, x − y = ${d}. Find x.`, correct: String(x) };
  },

  "quant/quadratic-equations": (level, rng) => {
    if (level === 1) { const r1 = randInt(rng, -10, 10) || 1, r2 = randInt(rng, -10, 10) || 2; const sum = r1+r2, prod = r1*r2; return { type: "nat", prompt: `Find the smaller root of x² − (${sum})x + (${prod}) = 0.`, correct: String(Math.min(r1,r2)) }; }
    if (level === 2) { const r1 = randInt(rng, -10, 10) || 1, r2 = randInt(rng, -10, 10) || 2; const sum = r1+r2, prod = r1*r2; return { type: "nat", prompt: `Find the product of the roots of x² − (${sum})x + (${prod}) = 0.`, correct: String(prod) }; }
    const a = randInt(rng, 1, 5), b = randInt(rng, -15, 15) || 2, c = randInt(rng, -15, 15) || 3; const D = b*b - 4*a*c;
    return { type: "nat", prompt: `Find the discriminant of ${a}x² + (${b})x + (${c}) = 0.`, correct: String(D) };
  },

  "quant/permutation-combination": (level, rng) => {
    const fact = (n) => { let f = 1; for (let i = 2; i <= n; i++) f *= i; return f; };
    if (level === 1) { const n = randInt(rng, 3, 12); return { type: "nat", prompt: `In how many ways can ${n} people be arranged in a row?`, correct: String(fact(n)) }; }
    if (level === 2) { const n = randInt(rng, 5, 15); const r = randInt(rng, 2, n-1); const val = fact(n)/(fact(r)*fact(n-r)); return { type: "nat", prompt: `Find the number of ways to choose ${r} people from ${n} people (nCr).`, correct: String(Math.round(val)) }; }
    const n = randInt(rng, 5, 11); const k = randChoice(rng, [2,3,4]); if (k >= n) return GEN["quant/permutation-combination"](3, rng); const val = Math.round(fact(n)/fact(k));
    return { type: "nat", prompt: `Find the number of ways to arrange the letters of a word with ${n} letters, where one letter repeats ${k} times.`, correct: String(val) };
  },

  "quant/probability": (level, rng) => {
    if (level === 1) {
      const variants = [
        () => { const k = randInt(rng, 1, 5); const fav = 6-k; const [rn, rd] = reduceFrac(fav, 6); return { prompt: `A die is rolled once. Find the probability of getting a number greater than ${k} (as reduced fraction p/q).`, correct: `${rn}/${rd}` }; },
        () => { const k = randInt(rng, 2, 6); const fav = k-1; const [rn, rd] = reduceFrac(fav, 6); return { prompt: `A die is rolled once. Find the probability of getting a number less than ${k} (as reduced fraction p/q).`, correct: `${rn}/${rd}` }; },
        () => { const [rn, rd] = reduceFrac(3, 6); return { prompt: `A die is rolled once. Find the probability of getting an even number (as reduced fraction p/q).`, correct: `${rn}/${rd}` }; },
        () => { const [rn, rd] = reduceFrac(3, 6); return { prompt: `A die is rolled once. Find the probability of getting an odd number (as reduced fraction p/q).`, correct: `${rn}/${rd}` }; },
        () => { const [rn, rd] = reduceFrac(3, 6); return { prompt: `A die is rolled once. Find the probability of getting a prime number (as reduced fraction p/q).`, correct: `${rn}/${rd}` }; },
        () => { const k = randChoice(rng, [2,3]); const fav = Math.floor(6/k); const [rn, rd] = reduceFrac(fav, 6); return { prompt: `A die is rolled once. Find the probability of getting a multiple of ${k} (as reduced fraction p/q).`, correct: `${rn}/${rd}` }; },
        () => { const bag = randInt(rng,3,10); const red = randInt(rng,1,bag-1); const [rn, rd] = reduceFrac(red, bag); return { prompt: `A bag has ${bag} balls, of which ${red} are red. Find the probability of drawing a red ball (as reduced fraction p/q).`, correct: `${rn}/${rd}` }; },
      ];
      const v = randChoice(rng, variants)(); return { type: "nat", ...v };
    }
    if (level === 2) {
      const cats = [
        ["an ace", 4], ["a king", 4], ["a queen", 4], ["a jack", 4],
        ["a heart", 13], ["a spade", 13], ["a club", 13], ["a diamond", 13],
        ["a red card", 26], ["a black card", 26], ["a face card", 12],
        ["a number card (2 to 10)", 36], ["a black king", 2], ["a red queen", 2], ["a 10", 4],
      ];
      const [label, fav] = randChoice(rng, cats); const [rn, rd] = reduceFrac(fav, 52);
      return { type: "nat", prompt: `A card is drawn from a well-shuffled pack of 52 cards. Find the probability of drawing ${label} (as reduced fraction p/q).`, correct: `${rn}/${rd}` };
    }
    const variants = [
      () => { const s = randInt(rng, 3, 11); let count = 0; for (let i=1;i<=6;i++) for (let j=1;j<=6;j++) if (i+j===s) count++; const [rn, rd] = reduceFrac(count, 36); return { prompt: `Two dice are rolled. Find the probability that the sum is ${s} (as reduced fraction p/q).`, correct: `${rn}/${rd}` }; },
      () => { let count = 0; for (let i=1;i<=6;i++) for (let j=1;j<=6;j++) if (i===j) count++; const [rn, rd] = reduceFrac(count, 36); return { prompt: `Two dice are rolled together. Find the probability of getting a doublet (same number on both dice) (as reduced fraction p/q).`, correct: `${rn}/${rd}` }; },
      () => { const total = randInt(rng, 8, 20); const w = randInt(rng, 2, total-2); const draw2Both = round2((w/total)*((w-1)/(total-1))); const [rn,rd] = reduceFrac(Math.round(w*(w-1)), total*(total-1)); return { prompt: `A bag has ${total} balls, of which ${w} are white. Two balls are drawn without replacement. Find the probability that both are white (as reduced fraction p/q).`, correct: `${rn}/${rd}` }; },
    ];
    const v = randChoice(rng, variants)(); return { type: "nat", ...v };
  },

  "quant/data-interpretation": (level, rng) => {
    if (level === 1) { const b = randInt(rng, 20, 60), g = randInt(rng, 20, 60); const pct = round2(b/(b+g)*100); return { type: "nat", prompt: `In a class, there are ${b} boys and ${g} girls. What % of the class is boys? (round 2 decimals)`, correct: fmt2(pct) }; }
    if (level === 2) { const total = randInt(rng, 100, 500); const n1 = randInt(rng, 10, Math.floor(total*0.4)); const n2 = randInt(rng, 10, Math.floor(total*0.4)); const pct = round2((total-n1-n2)/total*100); return { type: "nat", prompt: `A survey of ${total} people shows ${n1} prefer product A and ${n2} prefer product B. Find the % preferring neither (round 2 decimals).`, correct: fmt2(pct) }; }
    const s1 = randInt(rng, 1000, 5000); const pct = randChoice(rng, [-30,-20,-10,10,15,20,25,30,40]); const s2 = Math.round(s1*(100+pct)/100);
    return { type: "nat", prompt: `Sales were ₹${s1} last year and ₹${s2} this year. Find the % growth (negative if decline, round 2 decimals).`, correct: fmt2(round2((s2-s1)/s1*100)) };
  },

  "quant/progressions-ap-gp-hp": (level, rng) => {
    if (level === 1) { const a = randInt(rng, 1, 20), d = randInt(rng, 1, 10); const n = randInt(rng, 5, 30); return { type: "nat", prompt: `Find the ${n}th term of an AP with first term ${a} and common difference ${d}.`, correct: String(a + (n-1)*d) }; }
    if (level === 2) { const a = randInt(rng, 1, 20), d = randInt(rng, 1, 10); const n = randInt(rng, 5, 20); const sum = n/2*(2*a+(n-1)*d); return { type: "nat", prompt: `Find the sum of the first ${n} terms of an AP with first term ${a} and common difference ${d}.`, correct: String(sum) }; }
    const a = randInt(rng, 1, 9), r = randChoice(rng, [2,3,4]); const n = randInt(rng, 3, 8);
    return { type: "nat", prompt: `Find the ${n}th term of a GP with first term ${a} and common ratio ${r}.`, correct: String(a * Math.pow(r, n-1)) };
  },

  "quant/logarithms": (level, rng) => {
    if (level === 1) { const b = randChoice(rng, [2,3,5,10]); const n = randInt(rng, 1, 10); return { type: "nat", prompt: `Find log base ${b} of ${Math.pow(b,n)} (i.e. log_${b}(${Math.pow(b,n)})).`, correct: String(n) }; }
    const L2 = 0.3010, L3 = 0.4771;
    const table = { 4: 2*L2, 8: 3*L2, 16: 4*L2, 32: 5*L2, 6: L2+L3, 9: 2*L3, 27: 3*L3, 12: 2*L2+L3, 24: 3*L2+L3, 18: L2+2*L3, 36: 2*L2+2*L3, 48: 4*L2+L3, 54: L2+3*L3 };
    if (level === 2) { const keys = Object.keys(table); const k = randChoice(rng, keys); return { type: "nat", prompt: `Given log 2 = 0.3010 and log 3 = 0.4771, find log ${k} (round to 4 decimals).`, correct: table[k].toFixed(4) }; }
    const b = randChoice(rng, [2,3,5]); const n = randInt(rng, 1, 8);
    return { type: "nat", prompt: `Solve for x: log base ${b} of x = ${n} (i.e. find x).`, correct: String(Math.pow(b, n)) };
  },

  "quant/clocks-calendars": (level, rng) => {
    if (level === 1) { const h = randInt(rng, 1, 12); let angle = Math.abs(30*h); angle = Math.min(angle, 360-angle); return { type: "nat", prompt: `Find the angle between the hour and minute hands at ${h}:00 (degrees).`, correct: String(angle) }; }
    if (level === 2) { const h = randInt(rng, 1, 12), m = randInt(rng, 5, 55); let angle = Math.abs(30*h - 5.5*m); angle = round2(Math.min(angle, 360-angle)); return { type: "nat", prompt: `Find the angle between the hour and minute hands at ${h}:${m < 10 ? "0"+m : m} (degrees, round 2 decimals).`, correct: fmt2(angle) }; }
    const dayIdx = randInt(rng, 0, 6); const n = randInt(rng, 1, 60); const newIdx = (dayIdx + n) % 7;
    return { type: "nat", prompt: `Today is ${DAYS[dayIdx]}. What day will it be after ${n} days?`, correct: DAYS[newIdx] };
  },

  "quant/races-games": (level, rng) => {
    if (level === 1) { const d = randInt(rng, 100, 500); const x = randInt(rng, 5, d-10); const [rn, rd] = reduceFrac(d, d-x); return { type: "nat", prompt: `In a race of ${d} m, A beats B by ${x} m. Find the ratio of speeds of A:B (reduced p:q).`, correct: `${rn}:${rd}` }; }
    if (level === 2) { const d = randInt(rng, 80, 200), d2 = randInt(rng, 60, d-10); const D = randInt(rng, 300, 1000); const beat = round2(D - D*(d2/d)); return { type: "nat", prompt: `A can run ${d} m in the time B runs ${d2} m. In a race of ${D} m, by how many meters does A beat B? (round 2 decimals)`, correct: fmt2(beat) }; }
    const d = randInt(rng, 100, 400); const x = randInt(rng, 5, 50); const y = randInt(rng, 5, 50);
    const combined = round2(x + y - (x*y/d));
    return { type: "nat", prompt: `In a race of ${d} m, A can beat B by ${x} m and B can beat C by ${y} m. By how many meters can A beat C? (approx, round 2 decimals)`, correct: fmt2(combined) };
  },

  "quant/stocks-shares": (level, rng) => {
    if (level === 1) { const N = randInt(rng, 10, 200); const F = randChoice(rng, [10,50,100]); const r = randChoice(rng, [5,8,10,12,15]); const income = round2(N*F*r/100); return { type: "nat", prompt: `Find the income from ${N} shares of face value ₹${F} paying ${r}% dividend.`, correct: fmt2(income) }; }
    if (level === 2) { const inv = randInt(rng, 20,100)*100; const r = randChoice(rng, [5,8,10,12]); const price = randInt(rng, 80, 150); const income = round2(inv*r/price); return { type: "nat", prompt: `By investing ₹${inv} in a ${r}% stock at ₹${price}, find the annual income (face value ₹100, round 2 decimals).`, correct: fmt2(income) }; }
    const inv = randInt(rng, 20,100)*100; const price = randChoice(rng, [80,90,95,100,110,120,125]); const shares = round2(inv/price);
    return { type: "nat", prompt: `By investing ₹${inv} in a stock at market price ₹${price} (face value ₹100), find the number of shares bought (round 2 decimals).`, correct: fmt2(shares) };
  },

  "quant/trigonometry": (level, rng) => {
    const vals = { sin: {0:0,30:0.5,45:0.7071,60:0.8660,90:1}, cos: {0:1,30:0.8660,45:0.7071,60:0.5,90:0}, tan: {0:0,30:0.5774,45:1,60:1.7321,90:null} };
    if (level === 1) { const th = randChoice(rng, [0,30,45,60,90]); return { type: "nat", prompt: `Find the value of sin ${th}° (round 4 decimals).`, correct: vals.sin[th].toFixed(4) }; }
    if (level === 2) { const th = randChoice(rng, [0,30,45,60]); return { type: "nat", prompt: `Find the value of tan ${th}° (round 4 decimals).`, correct: vals.tan[th].toFixed(4) }; }
    const th = randChoice(rng, [30,45,60]); const s = vals.sin[th];
    return { type: "nat", prompt: `If sin θ = ${s.toFixed(4)} (θ = ${th}°), find cos θ using sin²θ + cos²θ = 1 (round 4 decimals).`, correct: Math.sqrt(1-s*s).toFixed(4) };
  },

  "quant/geometry": (level, rng) => {
    if (level === 1) { const l = randInt(rng, 5, 40), b = randInt(rng, 5, 40); return { type: "nat", prompt: `Find the perimeter of a rectangle with length ${l} and breadth ${b}.`, correct: String(2*(l+b)) }; }
    if (level === 2) { const base = randInt(rng, 4, 40), h = randInt(rng, 4, 40); return { type: "nat", prompt: `Find the area of a triangle with base ${base} and height ${h} (round 2 decimals).`, correct: fmt2(0.5*base*h) }; }
    const r = randInt(rng, 1, 20) * 7; return { type: "nat", prompt: `Find the circumference of a circle with radius ${r} (use π = 22/7, round 2 decimals).`, correct: fmt2(round2(2*(22/7)*r)) };
  },

  "quant/coordinate-geometry": (level, rng) => {
    const triples = [[3,4,5],[6,8,10],[5,12,13],[8,15,17],[7,24,25]];
    if (level === 1) { const [a,b,c] = randChoice(rng, triples); const x1=randInt(rng,0,10), y1=randInt(rng,0,10); return { type: "nat", prompt: `Find the distance between (${x1},${y1}) and (${x1+a},${y1+b}).`, correct: String(c) }; }
    if (level === 2) { const x1=randInt(rng,0,20), y1=randInt(rng,0,20); const x2=x1+randInt(rng,0,10)*2, y2=y1+randInt(rng,0,10)*2; return { type: "nat", prompt: `Find the midpoint of the line joining (${x1},${y1}) and (${x2},${y2}). (format as x,y)`, correct: `${(x1+x2)/2},${(y1+y2)/2}` }; }
    const x1=randInt(rng,0,15), y1=randInt(rng,0,15); const dx = randInt(rng,1,8); const m = randInt(rng,-5,5)||2; const x2=x1+dx; const y2=y1+m*dx;
    return { type: "nat", prompt: `Find the slope of the line joining (${x1},${y1}) and (${x2},${y2}).`, correct: String(m) };
  },

  "quant/set-theory": (level, rng) => {
    if (level === 1) { const a = randInt(rng, 10, 50), b = randInt(rng, 10, 50), i = randInt(rng, 1, Math.min(a,b)-1); return { type: "nat", prompt: `If n(A) = ${a}, n(B) = ${b}, n(A∩B) = ${i}, find n(A∪B).`, correct: String(a+b-i) }; }
    if (level === 2) { const a = randInt(rng, 10, 50), b = randInt(rng, 10, 50); const u = randInt(rng, Math.max(a,b), a+b-1); return { type: "nat", prompt: `If n(A∪B) = ${u}, n(A) = ${a}, n(B) = ${b}, find n(A∩B).`, correct: String(a+b-u) }; }
    const a = randInt(rng, 20, 60), b = randInt(rng, 20, 60), both = randInt(rng, 5, Math.min(a,b)-1); const t = a+b-both+randInt(rng,5,30);
    return { type: "nat", prompt: `In a survey of ${t} people, ${a} like tea, ${b} like coffee, and ${both} like both. How many like neither?`, correct: String(t-(a+b-both)) };
  },

  "quant/binomial-theorem": (level, rng) => {
    if (level === 1) { const n = randInt(rng, 3, 20); return { type: "nat", prompt: `Find the number of terms in the expansion of (x+y)^${n}.`, correct: String(n+1) }; }
    const fact = (n) => { let f=1; for(let i=2;i<=n;i++) f*=i; return f; };
    if (level === 2) { const n = randInt(rng, 5, 15); const k = randInt(rng, 1, n-1); const val = Math.round(fact(n)/(fact(k)*fact(n-k))); return { type: "nat", prompt: `Find the coefficient of x^${k} in the expansion of (1+x)^${n} (i.e. nCk).`, correct: String(val) }; }
    const n = randInt(rng, 2, 20) * 2; return { type: "nat", prompt: `Find the position of the middle term in the expansion of (x+y)^${n} (n is even).`, correct: String(n/2 + 1) };
  },

  /* ============================ REASONING ============================ */

  "reasoning/number-alphabet-series": (level, rng) => {
    const LET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (level === 1) {
      const variants = [
        () => { const a = randInt(rng,1,10), d = randInt(rng,1,10); const s = [a,a+d,a+2*d,a+3*d]; return { prompt: `Find the next number: ${s.join(", ")}, ?`, correct: String(a+4*d) }; },
        () => { const a = randInt(rng,1,10), r = randChoice(rng,[2,3]); const s = [a,a*r,a*r*r]; return { prompt: `Find the next number: ${s.join(", ")}, ?`, correct: String(a*r*r*r) }; },
        () => { const start = randInt(rng,0,20); const step = randChoice(rng,[2,3,4]); const idx = randInt(rng,0,20); const first = start + idx*step; const li = LET.charCodeAt(0); let ci = randInt(rng,0,20); const s=[0,1,2,3].map(i=>LET[(ci+i*step)%26]); return { prompt: `Find the next letter: ${s.join(", ")}, ?`, correct: LET[(ci+4*step)%26] }; },
      ];
      const v = randChoice(rng, variants)(); return { type: "nat", ...v };
    }
    if (level === 2) {
      const variants = [
        () => { const a = randInt(rng,1,5); const s=[a]; let d=randInt(rng,1,4); for(let i=0;i<4;i++){ s.push(s[s.length-1]+d); d+=randInt(rng,1,3);} return { prompt: `Find the next number: ${s.join(", ")}, ?`, correct: String(s[s.length-1]+d) }; },
        () => { let a=1,b=1; const s=[a,b]; for(let i=0;i<4;i++){ const c=a+b; s.push(c); a=b; b=c;} return { prompt: `Find the next number (Fibonacci-style): ${s.join(", ")}, ?`, correct: String(a+b) }; },
        () => { const start=randInt(rng,2,6); const s=[0,1,2,3].map(i=>Math.pow(start+i,2)); return { prompt: `Find the next number: ${s.join(", ")}, ?`, correct: String(Math.pow(start+4,2)) }; },
      ];
      const v = randChoice(rng, variants)(); return { type: "nat", ...v };
    }
    const variants = [
      () => { let a=1; const facts=[]; for(let i=1;i<=5;i++){a*=i; facts.push(a);} return { prompt: `Find the next term: ${facts.join(", ")}, ?`, correct: String(a*6) }; },
      () => { const a=randInt(rng,1,4); const s=[a]; for(let i=0;i<4;i++) s.push(s[s.length-1]*2+randInt(rng,1,3)); return { prompt: `Find the next number: ${s.join(", ")}, ? (find the pattern)`, correct: String(s[s.length-1]*2+randInt(rng,1,3)) }; },
    ];
    const v = randChoice(rng, variants)(); return { type: "nat", ...v };
  },

  "reasoning/analogy": poolGen({
    1: [
      { type:"nat", prompt:"Dog is to Puppy as Cat is to ?", correct:"Kitten" },
      { type:"nat", prompt:"Hot is to Cold as Day is to ?", correct:"Night" },
      { type:"nat", prompt:"Bird is to Fly as Fish is to ?", correct:"Swim" },
      { type:"nat", prompt:"Doctor is to Hospital as Teacher is to ?", correct:"School" },
      { type:"nat", prompt:"Pen is to Write as Knife is to ?", correct:"Cut" },
      { type:"nat", prompt:"Foot is to Leg as Hand is to ?", correct:"Arm" },
      { type:"nat", prompt:"Cow is to Calf as Horse is to ?", correct:"Foal" },
      { type:"nat", prompt:"Sun is to Day as Moon is to ?", correct:"Night" },
      { type:"nat", prompt:"Book is to Read as Song is to ?", correct:"Sing" },
      { type:"nat", prompt:"Author is to Book as Sculptor is to ?", correct:"Statue" },
    ],
    2: [
      { type:"nat", prompt:"Thermometer is to Temperature as Barometer is to ?", correct:"Pressure" },
      { type:"nat", prompt:"Tailor is to Cloth as Carpenter is to ?", correct:"Wood" },
      { type:"nat", prompt:"Ornithologist is to Birds as Entomologist is to ?", correct:"Insects" },
      { type:"nat", prompt:"Democracy is to Vote as Monarchy is to ?", correct:"Throne" },
      { type:"nat", prompt:"Library is to Books as Museum is to ?", correct:"Artifacts" },
      { type:"nat", prompt:"Herbivore is to Plants as Carnivore is to ?", correct:"Meat" },
      { type:"nat", prompt:"Novel is to Chapters as House is to ?", correct:"Rooms" },
      { type:"nat", prompt:"Pilot is to Airplane as Captain is to ?", correct:"Ship" },
    ],
    3: [
      { type:"nat", prompt:"Cartography is to Maps as Lexicography is to ?", correct:"Dictionaries" },
      { type:"nat", prompt:"Symphony is to Composer as Verdict is to ?", correct:"Judge" },
      { type:"nat", prompt:"Ephemeral is to Permanent as Transient is to ?", correct:"Enduring" },
      { type:"nat", prompt:"Diagnosis is to Doctor as Prognosis is to ?", correct:"Physician" },
      { type:"nat", prompt:"Anarchy is to Order as Chaos is to ?", correct:"Structure" },
    ],
  }),

  "reasoning/classification-odd-one-out": poolGen({
    1: [
      { type:"mcq", prompt:"Find the odd one out:", options:["Apple","Mango","Potato","Banana"], correct:2 },
      { type:"mcq", prompt:"Find the odd one out:", options:["Triangle","Square","Circle","Rose"], correct:3 },
      { type:"mcq", prompt:"Find the odd one out:", options:["Delhi","Mumbai","India","Chennai"], correct:2 },
      { type:"mcq", prompt:"Find the odd one out:", options:["Pen","Pencil","Eraser","Notebook"], correct:3 },
      { type:"mcq", prompt:"Find the odd one out:", options:["2","4","7","8"], correct:2 },
      { type:"mcq", prompt:"Find the odd one out:", options:["Lion","Tiger","Elephant","Cobra"], correct:3 },
      { type:"mcq", prompt:"Find the odd one out:", options:["Guitar","Violin","Flute","Drum"], correct:2 },
      { type:"mcq", prompt:"Find the odd one out:", options:["Gold","Silver","Iron","Diamond"], correct:3 },
      { type:"mcq", prompt:"Find the odd one out:", options:["Rose","Lily","Lotus","Mango"], correct:3 },
      { type:"mcq", prompt:"Find the odd one out:", options:["January","March","Monday","July"], correct:2 },
      { type:"mcq", prompt:"Find the odd one out:", options:["Circle","Sphere","Square","Triangle"], correct:1 },
      { type:"mcq", prompt:"Find the odd one out:", options:["Milk","Curd","Cheese","Egg"], correct:3 },
    ],
    2: [
      { type:"mcq", prompt:"Find the odd one out:", options:["Kidney","Heart","Lung","Skin"], correct:3 },
      { type:"mcq", prompt:"Find the odd one out (number pattern):", options:["9","16","25","30"], correct:3 },
      { type:"mcq", prompt:"Find the odd one out:", options:["Democracy","Monarchy","Dictatorship","Parliament"], correct:3 },
      { type:"mcq", prompt:"Find the odd one out:", options:["Mercury","Venus","Earth","Sun"], correct:3 },
      { type:"mcq", prompt:"Find the odd one out:", options:["Cricket","Football","Hockey","Referee"], correct:3 },
      { type:"mcq", prompt:"Find the odd one out (number pattern):", options:["121","144","169","200"], correct:3 },
      { type:"mcq", prompt:"Find the odd one out:", options:["Rupee","Dollar","Euro","Bank"], correct:3 },
      { type:"mcq", prompt:"Find the odd one out:", options:["Novel","Poem","Essay","Publisher"], correct:3 },
      { type:"mcq", prompt:"Find the odd one out (number pattern):", options:["8","27","64","90"], correct:3 },
    ],
    3: [
      { type:"mcq", prompt:"Find the odd one out (based on underlying logic):", options:["Whale","Dolphin","Shark","Bat"], correct:2 },
      { type:"mcq", prompt:"Find the odd one out:", options:["Barometer","Thermometer","Hygrometer","Telescope"], correct:3 },
      { type:"mcq", prompt:"Find the odd one out:", options:["Sonnet","Haiku","Ballad","Novel"], correct:3 },
      { type:"mcq", prompt:"Find the odd one out (based on relationship, not category):", options:["Author-Book","Sculptor-Statue","Composer-Symphony","Book-Library"], correct:3 },
      { type:"mcq", prompt:"Find the odd one out:", options:["Photosynthesis","Respiration","Digestion","Gravity"], correct:3 },
    ],
  }),

  "reasoning/coding-decoding": (level, rng) => {
    const LET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const words = ["TABLE","CHAIR","WATER","MOUSE","PAPER","LIGHT","PHONE","GARDEN","WINDOW","PENCIL","MARKET","FRIEND","SCHOOL","CAMERA","BASKET"];
    const shift = (w, k) => w.split("").map(c => LET[(LET.indexOf(c) + k + 26) % 26]).join("");
    if (level === 1) {
      const k = randInt(rng, 1, 5); const w = randChoice(rng, words); const coded = shift(w, k);
      return { type: "nat", prompt: `If each letter of a word is shifted forward by ${k} positions in the alphabet, "${w}" becomes "${coded}". Using the same rule, encode the word "${randChoice(rng, words.filter(x=>x!==w))}".`, correct: shift(randChoice(rng, words), k) };
    }
    if (level === 2) {
      const k = randInt(rng, 1, 8); const w = randChoice(rng, words); const coded = shift(w, k);
      return { type: "nat", prompt: `In a certain code, "${w}" is written as "${coded}". What is the shift value (k, forward shift in the alphabet) used?`, correct: String(k) };
    }
    const k1 = randInt(rng, 1, 4), k2 = randInt(rng, 1, 4); const w = randChoice(rng, words);
    const coded = shift(shift(w, k1).split("").reverse().join(""), k2);
    return { type: "nat", prompt: `In a code, each letter of "${w}" is shifted forward by ${k1}, then the result is reversed, then shifted forward by ${k2}. What is the coded word?`, correct: coded };
  },

  "reasoning/blood-relations": (level, rng) => {
    if (level === 1) {
      const templates = [
        { p: "A is the father of B.", q: "B is the ___ of A.", a: "son/daughter" },
        { p: "A is the mother of B.", q: "B is the ___ of A.", a: "son/daughter" },
        { p: "A is the son of B.", q: "B is the ___ of A (if B is male).", a: "father" },
        { p: "A is the daughter of B.", q: "B is the ___ of A (if B is female).", a: "mother" },
        { p: "A is the brother of B.", q: "B is the ___ of A (if B is female).", a: "sister" },
        { p: "A is the sister of B.", q: "B is the ___ of A (if B is male).", a: "brother" },
        { p: "A's father is B's son.", q: "What is B to A?", a: "Grandfather" },
        { p: "A is B's husband.", q: "B is A's ___.", a: "wife" },
      ];
      const t = randChoice(rng, templates);
      return { type: "nat", prompt: `${t.p} ${t.q}`, correct: t.a };
    }
    if (level === 2) {
      const variants = [
        () => ({ prompt: `Pointing to a photograph, A said, "She is the daughter of my grandfather's only son." How is the girl in the photograph related to A? (answer 'Sister')`, correct: "Sister" }),
        () => ({ prompt: `X introduces Y saying, "Y's mother is the only daughter of my mother." How is X related to Y?`, correct: "Mother" }),
        () => ({ prompt: `A is B's sister. C is B's mother. D is C's father. How is A related to D?`, correct: "Granddaughter" }),
        () => ({ prompt: `Pointing to a man, a woman says, "His mother is the only daughter of my mother." How is the woman related to the man?`, correct: "Mother" }),
      ];
      const v = randChoice(rng, variants)(); return { type: "nat", ...v };
    }
    const variants = [
      () => ({ prompt: `A's mother is the sister of B and has a son C. D is B's maternal uncle. How is C related to D?`, correct: "Grandson" }),
      () => ({ prompt: `Introducing a man, a woman said, "His wife is the only daughter of my father." How is the woman related to the man?`, correct: "Wife" }),
      () => ({ prompt: `P is Q's brother. R is Q's mother. S is R's father. T is S's mother. How is P related to S?`, correct: "Grandson" }),
      () => ({ prompt: `A and B are sisters. C is A's son. D is C's sister. How is D related to B?`, correct: "Niece" }),
      () => ({ prompt: `M is N's father. N is O's mother. P is O's brother. How is M related to P?`, correct: "Grandfather" }),
    ];
    const v = randChoice(rng, variants)(); return { type: "nat", ...v };
  },

  "reasoning/direction-sense": (level, rng) => {
    if (level === 1) {
      const dirs = ["North","South","East","West"]; const d = randChoice(rng, dirs); const dist = randInt(rng, 2, 20);
      return { type: "nat", prompt: `A person walks ${dist} km toward ${d} from his starting point. How far (in km) is he from the starting point?`, correct: String(dist) };
    }
    if (level === 2) {
      const d1 = randInt(rng, 3, 15), d2 = randInt(rng, 3, 15);
      return { type: "nat", prompt: `A person walks ${d1} km North, then turns East and walks ${d2} km. How far (in km, straight-line, round 2 decimals) is he from his starting point?`, correct: fmt2(Math.sqrt(d1*d1+d2*d2)) };
    }
    const a = randInt(rng,3,10), b = randInt(rng,3,10), c = randInt(rng,3,10);
    return { type: "nat", prompt: `A person walks ${a} km North, ${b} km East, then ${c} km North again. What is his straight-line distance (km, round 2 decimals) from the starting point?`, correct: fmt2(Math.sqrt(b*b + (a+c)*(a+c))) };
  },

  "reasoning/ranking-order": (level, rng) => {
    if (level === 1) { const total = randInt(rng, 20, 50); const fromTop = randInt(rng, 2, total-1); return { type: "nat", prompt: `In a class of ${total} students, Raj ranks ${fromTop}th from the top. What is his rank from the bottom?`, correct: String(total - fromTop + 1) }; }
    if (level === 2) { const total = randInt(rng, 20, 60); const fromTop = randInt(rng, 2, total-2); const fromBottom = total - fromTop + 1; return { type: "nat", prompt: `In a row of ${total} students, a boy is ${fromTop}th from the left. Find his position from the right.`, correct: String(fromBottom) }; }
    const fromTop = randInt(rng, 5, 20), fromBottom = randInt(rng, 5, 20);
    return { type: "nat", prompt: `In a class, a student ranks ${fromTop}th from the top and ${fromBottom}th from the bottom. Find the total number of students in the class.`, correct: String(fromTop + fromBottom - 1) };
  },

  "reasoning/missing-numbers": (level, rng) => {
    if (level === 1) { const rows=[]; const mul = randInt(rng,2,9); for(let r=0;r<3;r++){const a=randInt(rng,1,9); rows.push([a, mul, a*mul]);} const missingRow = randInt(rng,0,2); return { type:"nat", prompt: `Find the missing number: If ${rows[0][0]} × ${rows[0][1]} = ${rows[0][2]} and ${rows[1][0]} × ${rows[1][1]} = ${rows[1][2]}, then ${rows[2][0]} × ${rows[2][1]} = ?`, correct: String(rows[2][2]) }; }
    if (level === 2) { const a=randInt(rng,2,9),b=randInt(rng,2,9); return { type:"nat", prompt: `In the pattern, each number is the sum of squares of two numbers beside it: if a=${a}, b=${b}, find a²+b².`, correct: String(a*a+b*b) }; }
    const a=randInt(rng,2,9),b=randInt(rng,2,9),c=randInt(rng,2,9); return { type:"nat", prompt: `Find the missing number in the grid pattern: (${a}×${b})+${c} = ?`, correct: String(a*b+c) };
  },

  "reasoning/syllogism": (level, rng) => {
    const cats = [["Cats","Animals","Mammals"],["Roses","Flowers","Plants"],["Doctors","Professionals","Graduates"],["Pens","Stationery","Objects"],["Students","People","Humans"],["Squares","Rectangles","Quadrilaterals"]];
    const [A,B,C] = randChoice(rng, cats);
    if (level === 1) {
      return { type: "nat", prompt: `Statements: All ${A} are ${B}. All ${B} are ${C}. Conclusion: All ${A} are ${C}. Is the conclusion valid? (Yes/No)`, correct: "Yes" };
    }
    if (level === 2) {
      const valid = rng() < 0.5;
      if (valid) return { type: "nat", prompt: `Statements: Some ${A} are ${B}. All ${B} are ${C}. Conclusion: Some ${A} are ${C}. Is the conclusion valid? (Yes/No)`, correct: "Yes" };
      return { type: "nat", prompt: `Statements: All ${A} are ${B}. Some ${B} are ${C}. Conclusion: All ${A} are ${C}. Is the conclusion valid? (Yes/No)`, correct: "No" };
    }
    return { type: "nat", prompt: `Statements: No ${A} are ${B}. All ${C} are ${B}. Conclusion: No ${A} are ${C}. Is the conclusion valid? (Yes/No)`, correct: "Yes" };
  },

  "reasoning/statement-conclusion": poolGen({
    1: [
      { type:"nat", prompt:"Statement: All employees must wear ID cards. Conclusion: ID cards help identify employees. Is this conclusion implied? (Yes/No)", correct:"Yes" },
      { type:"nat", prompt:"Statement: The store is open from 9 AM to 9 PM daily. Conclusion: The store is open for 12 hours a day. Is this conclusion implied? (Yes/No)", correct:"Yes" },
      { type:"nat", prompt:"Statement: Only members are allowed inside the club. Conclusion: Non-members cannot enter the club. Is this conclusion implied? (Yes/No)", correct:"Yes" },
      { type:"nat", prompt:"Statement: It is raining outside. Conclusion: The ground outside is wet. Is this conclusion definitely implied? (Yes/No)", correct:"Yes" },
    ],
    2: [
      { type:"nat", prompt:"Statement: Company X's profits dropped 20% after the new policy was introduced. Conclusion: The new policy was solely responsible for the drop. Is this conclusion definitely true? (Yes/No)", correct:"No" },
      { type:"nat", prompt:"Statement: Every student who studies regularly passes the exam. Ravi passed the exam. Conclusion: Ravi studied regularly. Is this conclusion definitely true? (Yes/No)", correct:"No" },
      { type:"nat", prompt:"Statement: All squares are rectangles. This shape is a rectangle. Conclusion: This shape is a square. Is this conclusion definitely true? (Yes/No)", correct:"No" },
      { type:"nat", prompt:"Statement: Most people who exercise daily are healthy. Conclusion: All healthy people exercise daily. Is this conclusion definitely true? (Yes/No)", correct:"No" },
    ],
    3: [
      { type:"nat", prompt:"Statement: All members present voted in favor. The motion passed unanimously. Conclusion: Every member of the organization was present. Is this conclusion definitely true? (Yes/No)", correct:"No" },
      { type:"nat", prompt:"Statement: The train was delayed and all passengers who had connecting flights missed them. Conclusion: Every passenger on the train had a connecting flight. Is this conclusion definitely true? (Yes/No)", correct:"No" },
      { type:"nat", prompt:"Statement: If the alarm is triggered, the sprinklers activate. The sprinklers did not activate. Conclusion: The alarm was not triggered. Is this conclusion logically valid (contrapositive)? (Yes/No)", correct:"Yes" },
    ],
  }),

  "reasoning/statement-assumption": poolGen({
    1: [
      { type:"nat", prompt:"Statement: 'Please switch off the lights when you leave the room.' Assumption: The lights are currently on. Is this a valid assumption? (Yes/No)", correct:"Yes" },
      { type:"nat", prompt:"Statement: 'Bring an umbrella, it might rain today.' Assumption: Rain is possible today. Is this a valid assumption? (Yes/No)", correct:"Yes" },
      { type:"nat", prompt:"Statement: 'Drink plenty of water to stay hydrated.' Assumption: Water helps with hydration. Is this a valid assumption? (Yes/No)", correct:"Yes" },
    ],
    2: [
      { type:"nat", prompt:"Statement: 'Buy two, get one free this weekend only.' Assumption: Some customers are motivated by discounts. Is this a valid assumption? (Yes/No)", correct:"Yes" },
      { type:"nat", prompt:"Statement: 'All staff must complete the online training by Friday.' Assumption: Staff have access to the internet. Is this a valid assumption? (Yes/No)", correct:"Yes" },
      { type:"nat", prompt:"Statement: 'The library will be closed for renovation next month.' Assumption: No one will need library services next month. Is this a valid assumption? (Yes/No)", correct:"No" },
    ],
    3: [
      { type:"nat", prompt:"Statement: 'The company will only hire candidates with 5+ years experience for this role.' Assumption: No fresher can perform this role well. Is this a valid assumption? (Yes/No)", correct:"No" },
      { type:"nat", prompt:"Statement: 'We must cut costs by 15% or the project will be shut down.' Assumption: Cutting costs by 15% is achievable. Is this a valid assumption? (Yes/No)", correct:"Yes" },
      { type:"nat", prompt:"Statement: 'This diet plan works for everyone who follows it.' Assumption: Individual biological differences don't affect diet outcomes. Is this a valid (reasonable) assumption? (Yes/No)", correct:"No" },
    ],
  }),

  "reasoning/data-sufficiency": poolGen({
    1: [
      { type:"nat", prompt:"Question: What is the value of x? Statement I: x + 5 = 12. Statement II: x is even. Which statement(s) alone are sufficient? (Answer: I / II / Both / Either / Neither)", correct:"I" },
      { type:"nat", prompt:"Question: Is today Monday? Statement I: Yesterday was Sunday. Statement II: Tomorrow is Tuesday. Which statement(s) alone are sufficient? (Answer: I / II / Both / Either / Neither)", correct:"Either" },
    ],
    2: [
      { type:"nat", prompt:"Question: Is n divisible by 6? Statement I: n is divisible by 2. Statement II: n is divisible by 3. Which statement(s) alone are sufficient? (Answer: I / II / Both / Either / Neither)", correct:"Both" },
      { type:"nat", prompt:"Question: What is the value of y? Statement I: 2y = x + 4. Statement II: x = 6. Which statement(s) alone are sufficient? (Answer: I / II / Both / Either / Neither)", correct:"Both" },
    ],
    3: [
      { type:"nat", prompt:"Question: What is the area of the rectangle? Statement I: The perimeter is 20. Statement II: The length is 6. Which statement(s) alone are sufficient? (Answer: I / II / Both / Either / Neither)", correct:"Both" },
      { type:"nat", prompt:"Question: Is x > y? Statement I: x + 3 > y + 3. Statement II: 2x > 2y. Which statement(s) alone are sufficient? (Answer: I / II / Both / Either / Neither)", correct:"Either" },
    ],
  }),

  "reasoning/critical-reasoning": poolGen({
    1: [
      { type:"nat", prompt:"Argument: 'We should ban cars in the city center because it will reduce pollution.' What is the main assumption? (Answer: Cars are a significant / minor source of pollution — type 'significant' or 'minor')", correct:"significant" },
      { type:"nat", prompt:"Argument: 'She must be rich because she drives an expensive car.' This assumes the car is (owned/rented) — which word fits the flawed assumption?", correct:"owned" },
    ],
    2: [
      { type:"nat", prompt:"Argument: 'Sales increased after the ad campaign, so the campaign caused the increase.' This reasoning is an example of which fallacy? (type 'correlation-causation')", correct:"correlation-causation" },
      { type:"nat", prompt:"Argument: 'Everyone I know supports this policy, so it must be popular nationwide.' This is an example of which fallacy? (type 'sampling-bias')", correct:"sampling-bias" },
    ],
    3: [
      { type:"nat", prompt:"Argument: 'Since every swan we've seen is white, all swans must be white.' This is an example of which type of reasoning? (Answer: inductive or deductive)", correct:"inductive" },
      { type:"nat", prompt:"Argument: 'All mammals are warm-blooded. Whales are mammals. Therefore whales are warm-blooded.' This is an example of which type of reasoning? (Answer: inductive or deductive)", correct:"deductive" },
    ],
  }),

  "reasoning/cause-effect": poolGen({
    1: [
      { type:"nat", prompt:"Statement I: The road was flooded. Statement II: It rained heavily all night. Which is the cause? (I/II)", correct:"II" },
      { type:"nat", prompt:"Statement I: The plant wilted. Statement II: No one watered it for two weeks. Which is the cause? (I/II)", correct:"II" },
    ],
    2: [
      { type:"nat", prompt:"Statement I: The company's stock price fell sharply. Statement II: The company reported lower than expected profits. Which is the cause? (I/II)", correct:"II" },
      { type:"nat", prompt:"Statement I: Traffic was heavily congested on the highway. Statement II: A truck broke down blocking one lane. Which is the cause? (I/II)", correct:"II" },
    ],
    3: [
      { type:"nat", prompt:"Statement I: Crop yield in the region declined. Statement II: A prolonged drought affected the region. Which is the cause? (I/II)", correct:"II" },
      { type:"nat", prompt:"Statement I: The bridge was closed for six months. Statement II: Engineers found structural cracks during inspection. Which is the cause? (I/II)", correct:"II" },
    ],
  }),

  "reasoning/statement-argument": poolGen({
    1: [
      { type:"nat", prompt:"Statement: Should smoking be banned in public places? Argument: Yes, because it harms the health of non-smokers too. Is this a strong argument? (Yes/No)", correct:"Yes" },
      { type:"nat", prompt:"Statement: Should students wear school uniforms? Argument: Yes, because it reduces peer pressure related to clothing and expense differences. Is this a strong argument? (Yes/No)", correct:"Yes" },
    ],
    2: [
      { type:"nat", prompt:"Statement: Should homework be abolished in schools? Argument: Yes, because my friend doesn't like doing homework. Is this a strong argument? (Yes/No)", correct:"No" },
      { type:"nat", prompt:"Statement: Should the minimum wage be raised? Argument: No, because prices might go up a little. Is this a strong argument? (Yes/No)", correct:"No" },
    ],
    3: [
      { type:"nat", prompt:"Statement: Should India invest more in renewable energy? Argument: Yes, because it reduces long-term dependence on fossil fuel imports and cuts emissions. Is this a strong argument? (Yes/No)", correct:"Yes" },
      { type:"nat", prompt:"Statement: Should companies allow permanent remote work? Argument: Yes, because studies show it can improve employee productivity and reduce overhead costs. Is this a strong argument? (Yes/No)", correct:"Yes" },
    ],
  }),

  "reasoning/paper-folding": poolGen({
    1: [
      { type:"nat", prompt:"A square paper is folded once in half. How many layers of paper are there now?", correct:"2" },
      { type:"nat", prompt:"A rectangular paper is folded in half along its length. How many layers of paper result?", correct:"2" },
    ],
    2: [
      { type:"nat", prompt:"A square paper is folded in half, then in half again. How many layers of paper are there now?", correct:"4" },
      { type:"nat", prompt:"A paper is folded in half 3 times. How many layers result?", correct:"8" },
    ],
    3: [
      { type:"nat", prompt:"A paper is folded in half twice, then a hole is punched through all layers near the center. How many holes will appear when unfolded?", correct:"4" },
      { type:"nat", prompt:"A paper is folded in half 4 times, then a hole is punched through all layers. How many holes appear when fully unfolded?", correct:"16" },
    ],
  }),

  "reasoning/seating-arrangement": (level, rng) => {
    const names = ["A","B","C","D","E","F","G"];
    if (level === 1) {
      const n = randInt(rng, 5, 7); const arranged = shuffleArr(rng, names.slice(0,n));
      const pos = randInt(rng, 1, n);
      return { type: "nat", prompt: `${n} people (${arranged.join(", ")}) sit in a row in that left-to-right order. Who is sitting in position ${pos} from the left?`, correct: arranged[pos-1] };
    }
    if (level === 2) {
      const n = randInt(rng, 5, 6); const arranged = shuffleArr(rng, names.slice(0,n));
      const who = randChoice(rng, arranged); const idx = arranged.indexOf(who);
      return { type: "nat", prompt: `${n} people sit in a row: ${arranged.join(", ")} (left to right). Who is sitting immediately to the right of ${who}?`, correct: idx === n-1 ? "No one" : arranged[idx+1] };
    }
    const n = 6; const arranged = shuffleArr(rng, names.slice(0,n));
    const who = arranged[2];
    return { type: "nat", prompt: `6 people sit around a circular table facing the center: ${arranged.join(", ")} (in clockwise order). Who is sitting third to the clockwise of ${arranged[0]}?`, correct: who };
  },

  "reasoning/puzzles-basic": (level, rng) => {
    if (level === 1) { const total = randInt(rng, 30, 60); const a = randInt(rng, 5, total-10); const b = total - a; return { type: "nat", prompt: `A basket has ${total} fruits: apples and oranges. If there are ${a} apples, how many oranges are there?`, correct: String(b) }; }
    if (level === 2) { const age1 = randInt(rng, 20, 40); const diff = randInt(rng, 2, 10); return { type: "nat", prompt: `A father is ${diff} years older than twice his son's current relationship gap suggests; if the father is ${age1} and the son is ${age1-2*diff>0?age1-2*diff:10} less... A is ${diff} years older than B, and A+B = ${age1}. Find A's age.`, correct: String(Math.round((age1+diff)/2)) }; }
    const total = randInt(rng, 50, 200); const ratio1 = randInt(rng,2,5), ratio2 = randInt(rng,2,5);
    return { type: "nat", prompt: `A sum of ₹${total*(ratio1+ratio2)} is split between two people in ratio ${ratio1}:${ratio2}. Find the smaller share.`, correct: String(total*Math.min(ratio1,ratio2)) };
  },

  "reasoning/venn-diagrams": (level, rng) => {
    if (level === 1) { const a = randInt(rng,15,40), b = randInt(rng,15,40), both = randInt(rng,3,Math.min(a,b)-1); return { type: "nat", prompt: `In a group, ${a} people like Tea, ${b} like Coffee, and ${both} like both. How many like only Tea?`, correct: String(a-both) }; }
    if (level === 2) { const a = randInt(rng,15,40), b = randInt(rng,15,40), both = randInt(rng,3,Math.min(a,b)-1); return { type: "nat", prompt: `In a group, ${a} people like Tea, ${b} like Coffee, and ${both} like both. How many like Tea or Coffee (at least one)?`, correct: String(a+b-both) }; }
    const a = randInt(rng,20,50), b = randInt(rng,20,50), c = randInt(rng,20,50); const ab=randInt(rng,3,10), bc=randInt(rng,3,10), ac=randInt(rng,3,10), abc=randInt(rng,1,3);
    const union = a+b+c-ab-bc-ac+abc;
    return { type: "nat", prompt: `n(A)=${a}, n(B)=${b}, n(C)=${c}, n(A∩B)=${ab}, n(B∩C)=${bc}, n(A∩C)=${ac}, n(A∩B∩C)=${abc}. Find n(A∪B∪C).`, correct: String(union) };
  },

  "reasoning/alphanumeric-series": (level, rng) => {
    const LET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (level === 1) { const ci = randInt(rng, 0, 20); const step = randInt(rng, 1, 3); const s = [0,1,2].map(i => `${LET[(ci+i*step)%26]}${(i+1)*2}`); return { type: "nat", prompt: `Find the next term: ${s.join(", ")}, ?`, correct: `${LET[(ci+3*step)%26]}8` }; }
    if (level === 2) { const ci = randInt(rng, 0, 20); const n0 = randInt(rng, 1, 5); const s = [0,1,2].map(i => `${LET[(ci+i)%26]}${n0+i*2}`); return { type: "nat", prompt: `Find the next term: ${s.join(", ")}, ?`, correct: `${LET[(ci+3)%26]}${n0+6}` }; }
    const ci = randInt(rng, 0, 15); const s = [0,1,2,3].map(i => LET[(ci + i*i) % 26]);
    return { type: "nat", prompt: `Find the next letter (position increases by consecutive squares): ${s.join(", ")}, ?`, correct: LET[(ci+16)%26] };
  },

  "reasoning/inequality": (level, rng) => {
    if (level === 1) {
      const variants = [
        () => ({ prompt: `Statements: A > B, B > C. Does A > C follow? (Yes/No)`, correct: "Yes" }),
        () => ({ prompt: `Statements: A < B, B < C. Does A < C follow? (Yes/No)`, correct: "Yes" }),
        () => ({ prompt: `Statements: A = B, B > C. Does A > C follow? (Yes/No)`, correct: "Yes" }),
        () => ({ prompt: `Statements: A > B, B < C. Does A > C follow necessarily? (Yes/No)`, correct: "No" }),
      ];
      const v = randChoice(rng, variants)(); return { type: "nat", ...v };
    }
    if (level === 2) {
      const variants = [
        () => ({ prompt: `Statements: A ≥ B, B = C, C > D. Conclusion: A > D. Is this conclusion definitely true? (Yes/No)`, correct: "Yes" }),
        () => ({ prompt: `Statements: A > B ≥ C = D. Conclusion: A > D. Is this conclusion definitely true? (Yes/No)`, correct: "Yes" }),
        () => ({ prompt: `Statements: A ≤ B, C ≤ B, C ≥ D. Conclusion: A ≤ D. Is this conclusion definitely true? (Yes/No)`, correct: "No" }),
        () => ({ prompt: `Statements: A > B, B ≥ C, C > D. Conclusion: A > D. Is this conclusion definitely true? (Yes/No)`, correct: "Yes" }),
      ];
      const v = randChoice(rng, variants)(); return { type: "nat", ...v };
    }
    const variants = [
      () => ({ prompt: `Statements: A > B, C > B, C < D. Conclusion: A > D. Is this conclusion definitely true? (Yes/No)`, correct: "No" }),
      () => ({ prompt: `Statements: A > B > C, D > C, D < A. Conclusion: B > D. Is this conclusion definitely true? (Yes/No)`, correct: "No" }),
      () => ({ prompt: `Statements: A ≥ B > C ≥ D. Conclusion: A > D. Is this conclusion definitely true? (Yes/No)`, correct: "Yes" }),
      () => ({ prompt: `Statements: A < B, C < B, A < D. Conclusion: C < D. Is this conclusion definitely true? (Yes/No)`, correct: "No" }),
    ];
    const v = randChoice(rng, variants)(); return { type: "nat", ...v };
  },

  "reasoning/complex-puzzles-floor-box": (level, rng) => {
    const names = ["A","B","C","D","E"];
    if (level === 1) { const n = randInt(rng,4,5); const order = shuffleArr(rng, names.slice(0,n)); const p = randInt(rng,1,n); return { type: "nat", prompt: `A building has ${n} floors (1=bottom). ${order.join(", ")} live on floors 1 to ${n} respectively in that order. Who lives on floor ${p}?`, correct: order[p-1] }; }
    if (level === 2) { const n=5; const order = shuffleArr(rng, names); const who = randChoice(rng, order); return { type: "nat", prompt: `5 people ${order.join(", ")} live on floors 1(bottom) to 5(top) in that order. Who lives directly above ${who}?`, correct: order.indexOf(who)===4 ? "No one" : order[order.indexOf(who)+1] }; }
    const n = 6; const order = shuffleArr(rng, names.concat(["F"])); const p = randInt(rng,1,n);
    return { type: "nat", prompt: `6 boxes ${order.join(", ")} are stacked with box 1 at the bottom in that order. How many boxes are above box in position ${p}?`, correct: String(n-p) };
  },

  "reasoning/input-output": (level, rng) => {
    if (level === 1) {
      const n = randInt(rng, 4, 6); const arr = Array.from({length:n}, () => randInt(rng,10,90));
      const sorted = [...arr].sort((a,b)=>b-a);
      return { type: "nat", prompt: `Input: ${arr.join(" ")}\nMachine rearranges numbers in descending order, moving the largest to the front one step at a time. After Step 1, which number is at the front?`, correct: String(sorted[0]) };
    }
    if (level === 2) {
      const n = randInt(rng, 5, 7); const arr = Array.from({length:n}, () => randInt(rng,10,99));
      const sorted = [...arr].sort((a,b)=>b-a); const step = randInt(rng, 2, n-1);
      return { type: "nat", prompt: `Input: ${arr.join(" ")}\nEach step, the machine picks the largest remaining number and places it next in the output (descending order). What is the output after Step ${step}? (give the number placed at that step)`, correct: String(sorted[step-1]) };
    }
    const n = randInt(rng, 5, 7); const arr = Array.from({length:n}, () => randInt(rng,10,99));
    const sorted = [...arr].sort((a,b)=>a-b);
    return { type: "nat", prompt: `Input: ${arr.join(" ")}\nA machine rearranges numbers in ascending order, one number per step (smallest first). What is the complete final output sequence? (space-separated)`, correct: sorted.join(" ") };
  },

  "reasoning/cube-dice": (level, rng) => {
    if (level === 1) { return { type: "nat", prompt: `On a standard die, opposite faces sum to 7. If the top face shows ${randInt(rng,1,6) || 3}, what number is on the bottom face? (Assume top shown is 3)`, correct: "4" }; }
    if (level === 2) {
      const top = randInt(rng,1,6); const bottom = 7-top;
      return { type: "nat", prompt: `On a standard die (opposite faces sum to 7), if the top face shows ${top}, what number is on the bottom face?`, correct: String(bottom) };
    }
    const faces = [1,2,3,4,5,6]; const front = randChoice(rng, faces); const opp = 7-front;
    return { type: "nat", prompt: `A standard die shows ${front} on the face pointing toward you. What number is on the face directly opposite (away from you)?`, correct: String(opp) };
  },

  "reasoning/mirror-water-images": (() => {
    const MIRROR = { A:"A", H:"H", I:"I", M:"M", O:"O", T:"T", U:"U", V:"V", W:"W", X:"X", Y:"Y", b:"d", d:"b", p:"q", q:"p", "2":"S-like(non-standard)", "3":"E-like(non-standard)" };
    const simpleLetters = ["A","H","I","M","O","T","U","V","W","X","Y"];
    const swapPairs = [["b","d"],["d","b"],["p","q"],["q","p"]];
    return (level, rng) => {
      if (level === 1) { const l = randChoice(rng, simpleLetters); return { type: "nat", prompt: `What is the mirror image of the letter '${l}'? (it should look identical if the letter is symmetric)`, correct: l }; }
      if (level === 2) { const [a,b] = randChoice(rng, swapPairs); return { type: "nat", prompt: `What is the mirror image of the letter '${a}'?`, correct: b }; }
      const digits = ["0","1","8"]; const d = randChoice(rng, digits);
      return { type: "nat", prompt: `What is the mirror image of the digit '${d}'? (it should look identical since it is symmetric)`, correct: d };
    };
  })(),

  "reasoning/figure-series-matrix": (level, rng) => {
    if (level === 1) { const start = randInt(rng,3,5); const s=[start,start+1,start+2,start+3]; return { type: "nat", prompt: `A series of shapes has ${s.join(", ")} sides respectively. How many sides does the next shape have?`, correct: String(start+4) }; }
    if (level === 2) { const start = randInt(rng,3,6); const s=[start,start*2,start*3]; return { type: "nat", prompt: `A series of figures has ${s.join(", ")} dots respectively (multiples pattern). How many dots does the next figure have?`, correct: String(start*4) }; }
    const start = randInt(rng,2,4); const s=[start, start*start, start*start*start];
    return { type: "nat", prompt: `A figure series shows ${s.join(", ")} elements (power pattern with base ${start}). How many elements in the next figure (${start}^4)?`, correct: String(Math.pow(start,4)) };
  },

  /* =============================== DSA =============================== */

  "dsa/arrays": (level, rng) => {
    if (level === 1) { const n = randInt(rng,5,8); const arr = Array.from({length:n},()=>randInt(rng,1,50)); return { type: "nat", prompt: `Given array [${arr.join(", ")}], find the sum of all elements.`, correct: String(arr.reduce((a,b)=>a+b,0)) }; }
    if (level === 2) { const n = randInt(rng,5,8); const arr = Array.from({length:n},()=>randInt(rng,1,99)); const sorted=[...arr].sort((a,b)=>b-a); return { type: "nat", prompt: `Given array [${arr.join(", ")}], find the second largest element.`, correct: String(sorted[1]) }; }
    const n = randInt(rng,5,9); const arr = Array.from({length:n},()=>randInt(rng,1,50)); const target = randChoice(rng, arr);
    return { type: "nat", prompt: `Given array [${arr.join(", ")}] (0-indexed), find the index of the first occurrence of ${target}.`, correct: String(arr.indexOf(target)) };
  },

  "dsa/strings": (level, rng) => {
    const words = ["algorithm","function","variable","iteration","recursion","compiler","database","network","structure","pointer"];
    if (level === 1) { const w = randChoice(rng, words); return { type: "nat", prompt: `Find the length of the string "${w}".`, correct: String(w.length) }; }
    if (level === 2) { const w = randChoice(rng, words); const vowels = (w.match(/[aeiou]/g)||[]).length; return { type: "nat", prompt: `Count the number of vowels in the string "${w}".`, correct: String(vowels) }; }
    const w = randChoice(rng, words); const rev = w.split("").reverse().join("");
    return { type: "nat", prompt: `Reverse the string "${w}".`, correct: rev };
  },

  "dsa/linear-binary-search": (level, rng) => {
    if (level === 1) { const n = randInt(rng, 8, 30); return { type: "nat", prompt: `In the worst case, how many comparisons does Linear Search need on an array of ${n} elements?`, correct: String(n) }; }
    if (level === 2) { const n = Math.pow(2, randInt(rng, 3, 8)); return { type: "nat", prompt: `In the worst case, how many comparisons does Binary Search need on a sorted array of ${n} elements (i.e. ceil(log2(${n}+1)))?`, correct: String(Math.ceil(Math.log2(n+1))) }; }
    const n = randInt(rng, 20, 200);
    return { type: "nat", prompt: `An array has ${n} elements. What is the maximum number of comparisons Binary Search needs (round up log2(n+1))?`, correct: String(Math.ceil(Math.log2(n+1))) };
  },

  "dsa/sorting-algorithms": (level, rng) => {
    if (level === 1) { const n = randInt(rng,4,7); const arr = Array.from({length:n},()=>randInt(rng,1,50)); let a=[...arr],swaps=0; for(let i=0;i<a.length;i++) for(let j=0;j<a.length-i-1;j++) if(a[j]>a[j+1]){[a[j],a[j+1]]=[a[j+1],a[j]]; swaps++;} return { type: "nat", prompt: `Given array [${arr.join(", ")}], how many swaps does Bubble Sort take to sort it in ascending order?`, correct: String(swaps) }; }
    if (level === 2) { const n = randInt(rng, 6, 15); return { type: "nat", prompt: `What is the time complexity exponent 'k' such that Merge Sort runs in O(n log n) for an array of size ${n}? (just answer with the word 'nlogn')`, correct: "nlogn" }; }
    const n = randInt(rng,4,7); const arr = Array.from({length:n},()=>randInt(rng,1,50)); let a=[...arr],comparisons=0; for(let i=1;i<a.length;i++){let key=a[i],j=i-1; while(j>=0){comparisons++; if(a[j]>key){a[j+1]=a[j];j--;}else break;} a[j+1]=key;}
    return { type: "nat", prompt: `Given array [${arr.join(", ")}], how many comparisons does Insertion Sort make while sorting it in ascending order?`, correct: String(comparisons) };
  },

  "dsa/linked-list": (level, rng) => {
    if (level === 1) { const n = randInt(rng, 5, 20); const k = randInt(rng, 1, n); return { type: "nat", prompt: `A singly linked list has ${n} nodes. After deleting the ${k}th node, how many nodes remain?`, correct: String(n-1) }; }
    if (level === 2) { const n = randInt(rng, 5, 20); return { type: "nat", prompt: `A singly linked list has ${n} nodes. Using the slow-fast pointer technique, after how many steps of the fast pointer (moving 2 at a time) will it reach or pass the end (ceil(${n}/2))?`, correct: String(Math.ceil(n/2)) }; }
    const n = randInt(rng, 5, 15);
    return { type: "nat", prompt: `A singly linked list has ${n} nodes. Find the position (1-indexed from head) of the middle node using the slow-fast pointer method (slow moves 1, fast moves 2; when fast reaches end, slow is at the middle).`, correct: String(Math.ceil((n+1)/2)) };
  },

  "dsa/stack": (level, rng) => {
    if (level === 1) { const n = randInt(rng, 4, 8); const ops = Array.from({length:n}, () => randInt(rng,1,50)); return { type: "nat", prompt: `Starting with an empty stack, push these values in order: ${ops.join(", ")}. What is the top element after all pushes?`, correct: String(ops[ops.length-1]) }; }
    if (level === 2) { const n = randInt(rng, 5, 8); const ops = Array.from({length:n}, () => randInt(rng,1,50)); const popN = randInt(rng, 1, 3); const stack=[...ops]; for(let i=0;i<popN;i++) stack.pop(); return { type: "nat", prompt: `Push ${ops.join(", ")} onto an empty stack, then pop ${popN} times. What is the top element now?`, correct: String(stack[stack.length-1]) }; }
    const n = randInt(rng,6,10); const seq = []; const stack=[]; let pushCount=0;
    for (let i=1;i<=n;i++){ seq.push(`push(${i})`); stack.push(i); if (i%2===0 && stack.length>0){ seq.push('pop()'); stack.pop(); } }
    return { type: "nat", prompt: `Starting empty, perform: ${seq.join(", ")}. What is the final size of the stack?`, correct: String(stack.length) };
  },

  "dsa/queue": (level, rng) => {
    if (level === 1) { const n = randInt(rng, 4, 8); const ops = Array.from({length:n}, () => randInt(rng,1,50)); return { type: "nat", prompt: `Starting with an empty queue, enqueue these values in order: ${ops.join(", ")}. What is the front element after all enqueues?`, correct: String(ops[0]) }; }
    if (level === 2) { const n = randInt(rng, 5, 8); const ops = Array.from({length:n}, () => randInt(rng,1,50)); const deqN = randInt(rng, 1, 3); const q=[...ops]; for(let i=0;i<deqN;i++) q.shift(); return { type: "nat", prompt: `Enqueue ${ops.join(", ")} into an empty queue, then dequeue ${deqN} times. What is the front element now?`, correct: String(q[0]) }; }
    const n = randInt(rng,6,10); const q=[]; for(let i=1;i<=n;i++){ q.push(i); if(i%3===0) q.shift(); }
    return { type: "nat", prompt: `Starting empty, for i = 1 to ${n}: enqueue(i); if i is divisible by 3, dequeue(). What is the final size of the queue?`, correct: String(q.length) };
  },

  "dsa/recursion": (level, rng) => {
    if (level === 1) { const n = randInt(rng, 4, 10); let f=1; for(let i=2;i<=n;i++) f*=i; return { type: "nat", prompt: `Using the recursive definition factorial(n) = n × factorial(n-1), factorial(0)=1, find factorial(${n}).`, correct: String(f) }; }
    if (level === 2) { const n = randInt(rng, 5, 15); let a=0,b=1; for(let i=0;i<n;i++){[a,b]=[b,a+b];} return { type: "nat", prompt: `Using the recursive Fibonacci definition fib(0)=0, fib(1)=1, fib(n)=fib(n-1)+fib(n-2), find fib(${n}).`, correct: String(a) }; }
    const n = randInt(rng, 3, 8); let calls = 0; function fibCalls(k){ calls++; if(k<=1) return; fibCalls(k-1); fibCalls(k-2); } fibCalls(n);
    return { type: "nat", prompt: `For the naive recursive Fibonacci function fib(n) = fib(n-1) + fib(n-2), how many total function calls (including the initial call) occur for fib(${n})?`, correct: String(calls) };
  },

  "dsa/time-complexity": poolGen({
    1: [
      { type:"nat", prompt:"What is the time complexity of accessing an element in an array by index?", correct:"O(1)" },
      { type:"nat", prompt:"What is the time complexity of Linear Search in the worst case?", correct:"O(n)" },
      { type:"nat", prompt:"What is the time complexity of a single for-loop that runs n times?", correct:"O(n)" },
      { type:"nat", prompt:"What is the time complexity of Binary Search in the worst case?", correct:"O(log n)" },
    ],
    2: [
      { type:"nat", prompt:"What is the time complexity of two nested for-loops, each running n times?", correct:"O(n^2)" },
      { type:"nat", prompt:"What is the average time complexity of Quick Sort?", correct:"O(n log n)" },
      { type:"nat", prompt:"What is the time complexity of Merge Sort in all cases?", correct:"O(n log n)" },
      { type:"nat", prompt:"What is the time complexity of inserting an element at the head of a linked list?", correct:"O(1)" },
    ],
    3: [
      { type:"nat", prompt:"What is the worst-case time complexity of Quick Sort?", correct:"O(n^2)" },
      { type:"nat", prompt:"What is the time complexity of the naive recursive Fibonacci algorithm?", correct:"O(2^n)" },
      { type:"nat", prompt:"What is the time complexity of building a heap from n elements?", correct:"O(n)" },
      { type:"nat", prompt:"What is the time complexity of Dijkstra's algorithm using a binary heap, for V vertices and E edges?", correct:"O((V+E) log V)" },
    ],
  }),

  "dsa/trees-binary-bst-avl": (level, rng) => {
    if (level === 1) { const n = randInt(rng, 3, 15); return { type: "nat", prompt: `A full binary tree has ${n} internal nodes (every internal node has exactly 2 children). How many leaf nodes does it have?`, correct: String(n+1) }; }
    if (level === 2) { const n = randInt(rng, 5, 500); return { type: "nat", prompt: `What is the minimum possible height of a binary tree with ${n} nodes (height of a single node = 0)? [floor(log2(n+1)) - 1]`, correct: String(Math.floor(Math.log2(n+1))-1) }; }
    const n = randInt(rng, 3, 20);
    return { type: "nat", prompt: `What is the maximum number of nodes possible in a binary tree of height ${n} (root height = 0)? [2^(h+1) - 1]`, correct: String(Math.pow(2,n+1)-1) };
  },

  "dsa/graphs-bfs-dfs": (level, rng) => {
    if (level === 1) { const n = randInt(rng, 4, 10); return { type: "nat", prompt: `A complete undirected graph has ${n} vertices. How many edges does it have? [n(n-1)/2]`, correct: String(n*(n-1)/2) }; }
    if (level === 2) { const n = randInt(rng, 4, 12); return { type: "nat", prompt: `A tree (connected, acyclic graph) has ${n} vertices. How many edges does it have?`, correct: String(n-1) }; }
    const n = randInt(rng, 5, 10);
    return { type: "nat", prompt: `A complete directed graph (with edges in both directions between every pair) has ${n} vertices. How many directed edges does it have? [n(n-1)]`, correct: String(n*(n-1)) };
  },

  "dsa/hashing": (level, rng) => {
    if (level === 1) { const k = randInt(rng, 100, 999); const m = randChoice(rng, [7,10,11,13]); return { type: "nat", prompt: `Using hash function h(k) = k mod ${m}, find h(${k}).`, correct: String(k % m) }; }
    if (level === 2) { const keys = Array.from({length: randInt(rng,5,8)}, () => randInt(rng, 10, 99)); const m = randChoice(rng, [5,7]); const buckets = {}; keys.forEach(k => { const h = k % m; buckets[h] = (buckets[h]||0)+1; }); const collisions = Object.values(buckets).reduce((s,c) => s + Math.max(0,c-1), 0); return { type: "nat", prompt: `Keys [${keys.join(", ")}] are hashed using h(k) = k mod ${m}. How many collisions occur (extra keys mapping to an already-used slot)?`, correct: String(collisions) }; }
    const n = randInt(rng, 10, 30); const m = randInt(rng, 5, 15);
    return { type: "nat", prompt: `${n} keys are inserted into a hash table with ${m} slots using separate chaining. What is the load factor (n/m, round 2 decimals)?`, correct: fmt2(round2(n/m)) };
  },

  "dsa/heaps": (level, rng) => {
    if (level === 1) { const i = randInt(rng, 1, 30); return { type: "nat", prompt: `In a 0-indexed array-based binary heap, find the parent index of the node at index ${i}. [floor((i-1)/2)]`, correct: String(Math.floor((i-1)/2)) }; }
    if (level === 2) { const i = randInt(rng, 0, 30); return { type: "nat", prompt: `In a 0-indexed array-based binary heap, find the left child index of the node at index ${i}. [2i+1]`, correct: String(2*i+1) }; }
    const n = randInt(rng, 10, 1000);
    return { type: "nat", prompt: `What is the time complexity (as a power, e.g. enter just the value of k in O(log k) style — actually just answer 'O(log n)') of inserting an element into a binary heap of ${n} elements?`, correct: "O(log n)" };
  },

  "dsa/dynamic-programming": (level, rng) => {
    if (level === 1) { const n = randInt(rng, 5, 20); let a=0,b=1; for(let i=0;i<n;i++){[a,b]=[b,a+b];} return { type: "nat", prompt: `Using DP (bottom-up), find the ${n}th Fibonacci number (fib(0)=0, fib(1)=1).`, correct: String(a) }; }
    if (level === 2) { const n = randInt(rng, 3, 20); let a=1,b=2; if(n===1) return { type:"nat", prompt: `A staircase has ${n} step(s). You can climb 1 or 2 steps at a time. In how many distinct ways can you reach the top?`, correct: "1" }; for(let i=3;i<=n;i++){[a,b]=[b,a+b];} return { type: "nat", prompt: `A staircase has ${n} steps. You can climb 1 or 2 steps at a time. In how many distinct ways can you reach the top?`, correct: String(b) }; }
    const coins = [1,2,5]; const amount = randInt(rng, 3, 15);
    let dp = new Array(amount+1).fill(Infinity); dp[0]=0; for(let i=1;i<=amount;i++) for(const c of coins) if(c<=i) dp[i]=Math.min(dp[i], dp[i-c]+1);
    return { type: "nat", prompt: `Using coin denominations [1, 2, 5], find the minimum number of coins needed to make amount ${amount} (DP / min-coins problem).`, correct: String(dp[amount]) };
  },

  "dsa/greedy-algorithms": (level, rng) => {
    if (level === 1) { const amount = randInt(rng, 10, 500); const denoms = [1,2,5,10,20,50,100]; let rem = amount, count = 0; for (const d of denoms.slice().reverse()) { count += Math.floor(rem/d); rem %= d; } return { type: "nat", prompt: `Using the greedy coin change method with denominations [1,2,5,10,20,50,100], find the minimum number of coins to make ₹${amount}.`, correct: String(count) }; }
    if (level === 2) { const n = randInt(rng, 5, 9); const activities = Array.from({length:n}, () => { const s = randInt(rng,1,20); return [s, s+randInt(rng,1,6)]; }); const sorted = [...activities].sort((a,b)=>a[1]-b[1]); let count=1, lastEnd=sorted[0][1]; for(let i=1;i<sorted.length;i++){ if(sorted[i][0]>=lastEnd){count++; lastEnd=sorted[i][1];} } return { type: "nat", prompt: `Given activities with (start,end) times: ${activities.map(a=>`(${a[0]},${a[1]})`).join(", ")}, using the greedy activity-selection method (earliest finish time first), find the maximum number of non-overlapping activities that can be selected.`, correct: String(count) }; }
    const n = randInt(rng, 5, 8); const weights = Array.from({length:n}, () => randInt(rng,1,20)); const values = weights.map(w => w + randInt(rng,1,10)); const cap = randInt(rng, 15, 40);
    const items = weights.map((w,i)=>({w, v: values[i], ratio: values[i]/w})).sort((a,b)=>b.ratio-a.ratio);
    let rem = cap, total = 0; for (const it of items) { if (it.w <= rem) { total += it.v; rem -= it.w; } else { total += it.ratio*rem; rem = 0; break; } }
    return { type: "nat", prompt: `Fractional Knapsack: items with weights [${weights.join(",")}] and values [${values.join(",")}], capacity ${cap}. Using the greedy value/weight ratio method, find the maximum total value achievable (round 2 decimals).`, correct: fmt2(round2(total)) };
  },

  "dsa/backtracking": poolGen({
    1: [
      { type:"nat", prompt:"How many distinct solutions exist for the 4-Queens problem (placing 4 non-attacking queens on a 4×4 board)?", correct:"2" },
      { type:"nat", prompt:"How many distinct solutions exist for the 1-Queen problem (1×1 board)?", correct:"1" },
    ],
    2: [
      { type:"nat", prompt:"How many distinct solutions exist for the 5-Queens problem (5×5 board)?", correct:"10" },
      { type:"nat", prompt:"How many distinct solutions exist for the 6-Queens problem (6×6 board)?", correct:"4" },
    ],
    3: [
      { type:"nat", prompt:"How many distinct solutions exist for the 8-Queens problem (8×8 board)?", correct:"92" },
      { type:"nat", prompt:"How many distinct solutions exist for the 7-Queens problem (7×7 board)?", correct:"40" },
    ],
  }),

  "dsa/space-time-complexity-analysis": poolGen({
    1: [
      { type:"nat", prompt:"An algorithm uses a fixed number of extra variables regardless of input size. What is its space complexity?", correct:"O(1)" },
      { type:"nat", prompt:"An algorithm creates a copy of the input array of size n. What is its space complexity?", correct:"O(n)" },
    ],
    2: [
      { type:"nat", prompt:"Recursive Fibonacci fib(n) (naive, no memoization) — what is its space complexity, considering the call stack depth?", correct:"O(n)" },
      { type:"nat", prompt:"Merge Sort — what is its space complexity (auxiliary arrays used for merging)?", correct:"O(n)" },
    ],
    3: [
      { type:"nat", prompt:"An algorithm builds a 2D DP table of size n×m. What is its space complexity?", correct:"O(nm)" },
      { type:"nat", prompt:"In-place Quick Sort — what is its average space complexity (recursion stack)?", correct:"O(log n)" },
    ],
  }),

  /* ============================= VERBAL =============================== */

  "verbal/synonyms": poolGen({
    1: [ ["Happy","Joyful"],["Big","Huge"],["Begin","Start"],["Brave","Courageous"],["Quick","Fast"],["Smart","Clever"],["Calm","Peaceful"],["Old","Ancient"],["Sad","Unhappy"],["Angry","Furious"],["Kind","Gentle"],["Strong","Powerful"] ].map(([w,s])=>({type:"nat", prompt:`Give a synonym of '${w}'.`, correct:s})),
    2: [ ["Meticulous","Precise"],["Candid","Frank"],["Diligent","Hardworking"],["Ambiguous","Unclear"],["Resilient","Tough"],["Pragmatic","Practical"],["Reluctant","Unwilling"],["Concise","Brief"],["Genuine","Authentic"],["Frugal","Thrifty"] ].map(([w,s])=>({type:"nat", prompt:`Give a synonym of '${w}'.`, correct:s})),
    3: [ ["Ephemeral","Fleeting"],["Ubiquitous","Omnipresent"],["Cogent","Convincing"],["Ostentatious","Showy"],["Vindicate","Justify"],["Taciturn","Silent"],["Pernicious","Harmful"],["Placate","Soothe"],["Ineffable","Indescribable"],["Sycophant","Flatterer"] ].map(([w,s])=>({type:"nat", prompt:`Give a synonym of '${w}'.`, correct:s})),
  }),

  "verbal/antonyms": poolGen({
    1: [ ["Happy","Sad"],["Big","Small"],["Fast","Slow"],["Hot","Cold"],["Light","Dark"],["Easy","Difficult"],["Strong","Weak"],["Rich","Poor"],["Full","Empty"],["Young","Old"],["Open","Closed"],["Win","Lose"] ].map(([w,s])=>({type:"nat", prompt:`Give an antonym of '${w}'.`, correct:s})),
    2: [ ["Generous","Stingy"],["Optimistic","Pessimistic"],["Abundant","Scarce"],["Ancient","Modern"],["Cautious","Reckless"],["Genuine","Fake"],["Humble","Arrogant"],["Voluntary","Compulsory"],["Expand","Contract"],["Praise","Criticize"] ].map(([w,s])=>({type:"nat", prompt:`Give an antonym of '${w}'.`, correct:s})),
    3: [ ["Benevolent","Malevolent"],["Frugal","Extravagant"],["Verbose","Terse"],["Transient","Permanent"],["Obscure","Evident"],["Meticulous","Careless"],["Candid","Deceptive"],["Prudent","Reckless"],["Amiable","Hostile"],["Nascent","Mature"] ].map(([w,s])=>({type:"nat", prompt:`Give an antonym of '${w}'.`, correct:s})),
  }),

  "verbal/spelling-correction": poolGen({
    1: [ ["Recieve","Receive"],["Definately","Definitely"],["Occured","Occurred"],["Seperate","Separate"],["Untill","Until"],["Adress","Address"],["Wich","Which"],["Beleive","Believe"] ].map(([w,s])=>({type:"nat", prompt:`Correct the spelling: '${w}'`, correct:s})),
    2: [ ["Accomodate","Accommodate"],["Embarass","Embarrass"],["Neccessary","Necessary"],["Occassion","Occasion"],["Priviledge","Privilege"],["Rythm","Rhythm"],["Tommorrow","Tomorrow"],["Wierd","Weird"] ].map(([w,s])=>({type:"nat", prompt:`Correct the spelling: '${w}'`, correct:s})),
    3: [ ["Consciencious","Conscientious"],["Millenium","Millennium"],["Liaision","Liaison"],["Entrepeneur","Entrepreneur"],["Idiosyncracy","Idiosyncrasy"] ].map(([w,s])=>({type:"nat", prompt:`Correct the spelling: '${w}'`, correct:s})),
  }),

  "verbal/one-word-substitution": poolGen({
    1: [
      { type:"nat", prompt:"One word for 'a person who studies stars and planets':", correct:"Astronomer" },
      { type:"nat", prompt:"One word for 'a place where books are kept':", correct:"Library" },
      { type:"nat", prompt:"One word for 'a person who cannot read or write':", correct:"Illiterate" },
      { type:"nat", prompt:"One word for 'a person who travels to different places':", correct:"Traveler" },
      { type:"nat", prompt:"One word for 'a doctor who treats animals':", correct:"Veterinarian" },
      { type:"nat", prompt:"One word for 'a place where aircraft take off and land':", correct:"Airport" },
    ],
    2: [
      { type:"nat", prompt:"One word for 'a person who has no permanent home':", correct:"Vagrant" },
      { type:"nat", prompt:"One word for 'government by the people':", correct:"Democracy" },
      { type:"nat", prompt:"One word for 'a word that sounds the same as another but has a different meaning':", correct:"Homophone" },
      { type:"nat", prompt:"One word for 'a statement that appears self-contradictory but may be true':", correct:"Paradox" },
      { type:"nat", prompt:"One word for 'one who loves mankind':", correct:"Philanthropist" },
      { type:"nat", prompt:"One word for 'handwriting that cannot be read':", correct:"Illegible" },
    ],
    3: [
      { type:"nat", prompt:"One word for 'a person who is present everywhere':", correct:"Omnipresent" },
      { type:"nat", prompt:"One word for 'the study of the origin of words':", correct:"Etymology" },
      { type:"nat", prompt:"One word for 'a government by a small group of powerful people':", correct:"Oligarchy" },
      { type:"nat", prompt:"One word for 'incapable of being corrected':", correct:"Incorrigible" },
      { type:"nat", prompt:"One word for 'a word engraved on a tomb':", correct:"Epitaph" },
    ],
  }),

  "verbal/articles": poolGen({
    1: [
      { type:"nat", prompt:"Fill the blank: ___ apple a day keeps the doctor away. (a/an/the)", correct:"An" },
      { type:"nat", prompt:"Fill the blank: She is ___ honest person. (a/an/the)", correct:"An" },
      { type:"nat", prompt:"Fill the blank: ___ sun rises in the east. (a/an/the)", correct:"The" },
      { type:"nat", prompt:"Fill the blank: I saw ___ dog in the park. (a/an/the)", correct:"A" },
      { type:"nat", prompt:"Fill the blank: He is ___ engineer. (a/an/the)", correct:"An" },
    ],
    2: [
      { type:"nat", prompt:"Fill the blank: ___ Ganga is the longest river in India. (a/an/the)", correct:"The" },
      { type:"nat", prompt:"Fill the blank: She plays ___ violin every evening. (a/an/the)", correct:"The" },
      { type:"nat", prompt:"Fill the blank: He wants to be ___ IAS officer. (a/an/the)", correct:"An" },
      { type:"nat", prompt:"Fill the blank: ___ Everest is the highest mountain. (a/an/the)", correct:"The" },
    ],
    3: [
      { type:"nat", prompt:"Fill the blank: ___ poor are often overlooked by policymakers. (a/an/the)", correct:"The" },
      { type:"nat", prompt:"Fill the blank: ___ university near my house offers evening classes. (a/an/the) [Hint: consonant sound]", correct:"A" },
      { type:"nat", prompt:"Fill the blank: It took ___ hour to finish the test. (a/an/the) [Hint: silent 'h']", correct:"An" },
    ],
  }),

  "verbal/tenses": poolGen({
    1: [
      { type:"nat", prompt:"Change to past tense: 'She walks to school.'", correct:"She walked to school." },
      { type:"nat", prompt:"Change to future tense: 'He plays cricket.'", correct:"He will play cricket." },
      { type:"nat", prompt:"Change to present tense: 'They watched a movie.'", correct:"They watch a movie." },
    ],
    2: [
      { type:"nat", prompt:"Change to present perfect tense: 'She writes a letter.'", correct:"She has written a letter." },
      { type:"nat", prompt:"Change to past continuous tense: 'He reads a book.'", correct:"He was reading a book." },
      { type:"nat", prompt:"Change to future perfect tense: 'They finish the project.'", correct:"They will have finished the project." },
    ],
    3: [
      { type:"nat", prompt:"Rewrite using past perfect continuous: 'She ___ for two hours before he arrived.' (study)", correct:"had been studying" },
      { type:"nat", prompt:"Identify the tense: 'By next year, I will have been working here for a decade.'", correct:"Future perfect continuous" },
    ],
  }),

  "verbal/prepositions": poolGen({
    1: [
      { type:"nat", prompt:"Fill the blank: The book is ___ the table. (on/in/at)", correct:"on" },
      { type:"nat", prompt:"Fill the blank: She arrived ___ 5 PM. (on/in/at)", correct:"at" },
      { type:"nat", prompt:"Fill the blank: He lives ___ Mumbai. (on/in/at)", correct:"in" },
      { type:"nat", prompt:"Fill the blank: We met ___ Monday. (on/in/at)", correct:"on" },
    ],
    2: [
      { type:"nat", prompt:"Fill the blank: She is good ___ mathematics. (at/in/on)", correct:"at" },
      { type:"nat", prompt:"Fill the blank: He was accused ___ theft. (of/for/with)", correct:"of" },
      { type:"nat", prompt:"Fill the blank: The train arrived ___ time. (on/in/at)", correct:"on" },
    ],
    3: [
      { type:"nat", prompt:"Fill the blank: She is married ___ a doctor. (to/with/for)", correct:"to" },
      { type:"nat", prompt:"Fill the blank: He is capable ___ handling pressure. (of/in/for)", correct:"of" },
    ],
  }),

  "verbal/subject-verb-agreement": poolGen({
    1: [
      { type:"nat", prompt:"Choose the correct verb: 'Each of the boys ___ (is/are) present.'", correct:"is" },
      { type:"nat", prompt:"Choose the correct verb: 'The team ___ (is/are) winning.'", correct:"is" },
      { type:"nat", prompt:"Choose the correct verb: 'She ___ (write/writes) every day.'", correct:"writes" },
    ],
    2: [
      { type:"nat", prompt:"Choose the correct verb: 'Neither of the answers ___ (is/are) correct.'", correct:"is" },
      { type:"nat", prompt:"Choose the correct verb: 'The number of students ___ (has/have) increased.'", correct:"has" },
      { type:"nat", prompt:"Choose the correct verb: 'A number of students ___ (has/have) failed.'", correct:"have" },
    ],
    3: [
      { type:"nat", prompt:"Choose the correct verb: 'Mathematics ___ (is/are) my favorite subject.'", correct:"is" },
      { type:"nat", prompt:"Choose the correct verb: 'Either the manager or the employees ___ (is/are) responsible.'", correct:"are" },
    ],
  }),

  "verbal/sentence-correction": poolGen({
    1: [
      { type:"nat", prompt:"Correct the sentence: 'She don't like tea.'", correct:"She doesn't like tea." },
      { type:"nat", prompt:"Correct the sentence: 'He go to school daily.'", correct:"He goes to school daily." },
    ],
    2: [
      { type:"nat", prompt:"Correct the sentence: 'Neither of them are ready.'", correct:"Neither of them is ready." },
      { type:"nat", prompt:"Correct the sentence: 'She is senior than me.'", correct:"She is senior to me." },
    ],
    3: [
      { type:"nat", prompt:"Correct the sentence: 'Each of the players have their own kit.'", correct:"Each of the players has his/her own kit." },
      { type:"nat", prompt:"Fix: 'The data is insufficient.' → 'The data ___ insufficient.'", correct:"are" },
    ],
  }),

  "verbal/sentence-improvement": poolGen({
    1: [ { type:"nat", prompt:"Improve: 'He is very much interested in cricket.' (remove redundancy)", correct:"He is very interested in cricket." } ],
    2: [ { type:"nat", prompt:"Improve: 'In my opinion, I think this plan is good.' (remove redundancy)", correct:"I think this plan is good." } ],
    3: [ { type:"nat", prompt:"Improve: 'The reason is because the traffic was heavy.'", correct:"The reason is that the traffic was heavy." } ],
  }),

  "verbal/fill-in-the-blanks": poolGen({
    1: [
      { type:"nat", prompt:"Fill in the blank: She ___ to the market yesterday. (go/went/goes)", correct:"went" },
      { type:"nat", prompt:"Fill in the blank: They ___ playing football now. (is/are/am)", correct:"are" },
    ],
    2: [
      { type:"nat", prompt:"Fill in the blank: Despite the rain, they ___ the match. (completed/complete/completing)", correct:"completed" },
      { type:"nat", prompt:"Fill in the blank: If I ___ rich, I would travel the world. (was/were/am)", correct:"were" },
    ],
    3: [
      { type:"nat", prompt:"Fill in the blank: Had she studied harder, she ___ passed. (would have/will have/would)", correct:"would have" },
      { type:"nat", prompt:"Fill in the blank: Scarcely had he left ___ it started raining. (than/when/then)", correct:"when" },
    ],
  }),

  "verbal/idioms-phrases": poolGen({
    1: [
      { type:"nat", prompt:"What does the idiom 'break the ice' mean?", correct:"To start a conversation" },
      { type:"nat", prompt:"What does the idiom 'piece of cake' mean?", correct:"Something very easy" },
      { type:"nat", prompt:"What does the idiom 'hit the books' mean?", correct:"To study" },
    ],
    2: [
      { type:"nat", prompt:"What does the idiom 'burn the midnight oil' mean?", correct:"To work late into the night" },
      { type:"nat", prompt:"What does the idiom 'once in a blue moon' mean?", correct:"Rarely" },
      { type:"nat", prompt:"What does the idiom 'let the cat out of the bag' mean?", correct:"To reveal a secret" },
    ],
    3: [
      { type:"nat", prompt:"What does the idiom 'a Pyrrhic victory' mean?", correct:"A victory with heavy losses" },
      { type:"nat", prompt:"What does the idiom 'bury the hatchet' mean?", correct:"To make peace" },
    ],
  }),

  "verbal/active-passive-voice": poolGen({
    1: [
      { type:"nat", prompt:"Convert to passive voice: 'She writes a letter.'", correct:"A letter is written by her." },
      { type:"nat", prompt:"Convert to passive voice: 'The boy broke the window.'", correct:"The window was broken by the boy." },
    ],
    2: [
      { type:"nat", prompt:"Convert to passive voice: 'They are building a house.'", correct:"A house is being built by them." },
      { type:"nat", prompt:"Convert to passive voice: 'The teacher has taught the lesson.'", correct:"The lesson has been taught by the teacher." },
    ],
    3: [
      { type:"nat", prompt:"Convert to passive voice: 'The committee will have completed the review by Monday.'", correct:"The review will have been completed by the committee by Monday." },
    ],
  }),

  "verbal/direct-indirect-speech": poolGen({
    1: [
      { type:"nat", prompt:"Convert to indirect speech: He said, \"I am happy.\"", correct:"He said that he was happy." },
      { type:"nat", prompt:"Convert to indirect speech: She said, \"I like tea.\"", correct:"She said that she liked tea." },
    ],
    2: [
      { type:"nat", prompt:"Convert to indirect speech: He said, \"I will go tomorrow.\"", correct:"He said that he would go the next day." },
      { type:"nat", prompt:"Convert to indirect speech: She asked, \"Where do you live?\"", correct:"She asked where I lived." },
    ],
    3: [
      { type:"nat", prompt:"Convert to indirect speech: He said, \"I have finished my homework.\"", correct:"He said that he had finished his homework." },
    ],
  }),

  "verbal/para-jumbles": poolGen({
    1: [ { type:"nat", prompt:"Which sentence comes FIRST: A) The sun set. B) It got dark. C) Birds returned to their nests. D) The day ended.", correct:"A" } ],
    2: [ { type:"nat", prompt:"Which sentence comes FIRST: A) They celebrated the victory. B) The team practiced for months. C) They won the finals. D) The coach praised them.", correct:"B" } ],
    3: [ { type:"nat", prompt:"Which sentence comes LAST: A) The company launched a new product. B) Sales increased rapidly. C) Market research was conducted. D) The product design was finalized.", correct:"B" } ],
  }),

  "verbal/cloze-test": poolGen({
    1: [ { type:"nat", prompt:"Fill in the blank: The weather was so ___ that we decided to stay indoors. (pleasant/terrible/normal)", correct:"terrible" } ],
    2: [ { type:"nat", prompt:"Fill in the blank: Despite his ___, he failed to win the race. (effort/laziness/talent)", correct:"effort" } ],
    3: [ { type:"nat", prompt:"Fill in the blank: The negotiations were ___ , leading to a swift agreement. (amicable/hostile/prolonged)", correct:"amicable" } ],
  }),

  "verbal/reading-comprehension": poolGen({
    1: [ { type:"nat", prompt:"Passage: 'Solar energy is a renewable resource that reduces dependence on fossil fuels.' Why is solar energy beneficial per the passage?", correct:"reduces fossil fuel dependence" } ],
    2: [ { type:"nat", prompt:"Passage: 'While automation increases efficiency, it also raises concerns about job displacement.' What concern does the passage raise?", correct:"job displacement" } ],
    3: [ { type:"nat", prompt:"Passage: 'Although the policy aimed to reduce inequality, critics argue it disproportionately benefited large corporations.' What is the critics' main argument?", correct:"it disproportionately benefited large corporations" } ],
  }),

  "verbal/critical-reasoning-passages": poolGen({
    1: [ { type:"nat", prompt:"Passage: 'All successful entrepreneurs take risks. John took a big risk.' Can we conclude John is a successful entrepreneur? (Yes/No)", correct:"No" } ],
    2: [ { type:"nat", prompt:"Passage: 'Studies show coffee drinkers report higher alertness.' Does this prove coffee causes alertness? (Yes/No)", correct:"No" } ],
    3: [ { type:"nat", prompt:"Passage: 'The new law reduced accidents in the pilot cities, so it should be adopted nationwide.' Is this definitely justified without further evidence? (Yes/No)", correct:"No" } ],
  }),

  "verbal/sentence-rearrangement": poolGen({
    1: [ { type:"nat", prompt:"Rearrange: 'school / to / I / go / everyday'", correct:"I go to school everyday" } ],
    2: [ { type:"nat", prompt:"Rearrange: 'the / despite / rain / match / continued / heavy'", correct:"Despite the heavy rain, the match continued" } ],
    3: [ { type:"nat", prompt:"Rearrange: 'had / she / not / studied / hard / would / passed / have / not'", correct:"Had she not studied hard, she would not have passed" } ],
  }),

  "verbal/error-spotting-advanced": poolGen({
    1: [ { type:"nat", prompt:"Spot the error: 'He don't know the answer.' (write the corrected word only)", correct:"doesn't" } ],
    2: [ { type:"nat", prompt:"Spot the error: 'Each of the students have submitted their assignment.' (corrected word only)", correct:"has" } ],
    3: [ { type:"nat", prompt:"Spot the error: 'One of the biggest challenge facing India are poverty.' (corrected word for 'challenge')", correct:"challenges" } ],
  }),

  "verbal/word-usage-in-context": poolGen({
    1: [ { type:"nat", prompt:"Choose the correct word: 'I ___ (accept/except) your apology.'", correct:"accept" } ],
    2: [ { type:"nat", prompt:"Choose the correct word: 'The effect of the policy was significant, and it will ___ (affect/effect) many businesses.'", correct:"affect" } ],
    3: [ { type:"nat", prompt:"Choose the correct word: 'The committee will ___ (elicit/illicit) responses from the public.'", correct:"elicit" } ],
  }),

  "verbal/verbal-analogies": poolGen({
    1: [ { type:"nat", prompt:"Complete the analogy: Hot : Cold :: Up : ?", correct:"Down" }, { type:"nat", prompt:"Complete the analogy: Big : Small :: Fast : ?", correct:"Slow" } ],
    2: [ { type:"nat", prompt:"Complete the analogy: Doctor : Patient :: Teacher : ?", correct:"Student" }, { type:"nat", prompt:"Complete the analogy: Author : Book :: Director : ?", correct:"Film" } ],
    3: [ { type:"nat", prompt:"Complete the analogy: Frugal : Extravagant :: Timid : ?", correct:"Bold" } ],
  }),

  "verbal/paragraph-completion": poolGen({
    1: [ { type:"nat", prompt:"Complete: 'The sun was setting, and the sky turned ___.' (a fitting color word)", correct:"orange" } ],
    2: [ { type:"nat", prompt:"Complete: 'The economy grew steadily for years. However, the recent downturn ___.'", correct:"raised concerns" } ],
    3: [ { type:"nat", prompt:"Complete: 'While technology has connected people globally, it has also ___.'", correct:"isolated many individuals" } ],
  }),

  "verbal/summary-theme-detection": poolGen({
    1: [ { type:"nat", prompt:"Passage: 'Exercise improves physical and mental health.' What is the main theme?", correct:"health benefits of exercise" } ],
    2: [ { type:"nat", prompt:"Passage: 'Despite economic challenges, the startup scaled through innovative marketing.' What is the main theme?", correct:"overcoming challenges through innovation" } ],
    3: [ { type:"nat", prompt:"Passage: 'While globalization boosts trade, it also threatens local industries unable to compete.' What is the main theme?", correct:"trade-offs of globalization" } ],
  }),

  /* ========================= VERBAL REASONING ========================= */

  "verbal-reasoning/letter-symbol-series": (level, rng) => {
    const LET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (level === 1) { const ci = randInt(rng,0,20); const step = randInt(rng,1,3); const s=[0,1,2].map(i=>LET[(ci+i*step)%26]); return { type: "nat", prompt: `Find the next letter: ${s.join(", ")}, ?`, correct: LET[(ci+3*step)%26] }; }
    const symbols = ["@","#","$","%","&"];
    if (level === 2) { const s = shuffleArr(rng, symbols).slice(0,3); return { type: "nat", prompt: `If the pattern repeats every 3 symbols: ${s.join(" ")} ${s.join(" ")} ..., what is the 8th symbol?`, correct: s[(8-1)%3] }; }
    const ci = randInt(rng,0,20); const s=[0,2,4].map(i=>LET[(ci+i)%26]);
    return { type: "nat", prompt: `Find the next letter (skip pattern +2): ${s.join(", ")}, ?`, correct: LET[(ci+6)%26] };
  },

  "verbal-reasoning/word-formation": poolGen({
    1: [ { type:"nat", prompt:"Can the word 'TABLE' be formed using only the letters in 'ESTABLISH'? (Yes/No)", correct:"Yes" }, { type:"nat", prompt:"Can the word 'CHAIR' be formed using only the letters in 'RICHES'? (Yes/No)", correct:"No" } ],
    2: [ { type:"nat", prompt:"Can the word 'GRAND' be formed using only the letters in 'GARDENING'? (Yes/No)", correct:"Yes" } ],
    3: [ { type:"nat", prompt:"Can the word 'STONE' be formed using only the letters in 'HONESTY'? (Yes/No)", correct:"No" } ],
  }),

  "verbal-reasoning/coding-decoding-direction": (level, rng) => {
    const dirs = ["North","East","South","West"];
    if (level === 1) { const start = randInt(rng,0,3); const turns = randInt(rng,1,2); return { type: "nat", prompt: `If a person facing ${dirs[start]} turns 90° clockwise ${turns} time(s), which direction does he face now?`, correct: dirs[(start+turns)%4] }; }
    if (level === 2) { const start = randInt(rng,0,3); const turns = randInt(rng,1,3); return { type: "nat", prompt: `If a person facing ${dirs[start]} turns 90° anticlockwise ${turns} time(s), which direction does he face now?`, correct: dirs[(start-turns+400)%4] }; }
    const start = randInt(rng,0,3); const cw = randInt(rng,1,3), acw = randInt(rng,1,3);
    return { type: "nat", prompt: `A person facing ${dirs[start]} turns 90° clockwise ${cw} time(s), then 90° anticlockwise ${acw} time(s). Which direction does he face now?`, correct: dirs[(start+cw-acw+400)%4] };
  },

  "verbal-reasoning/logical-sequence-of-words": poolGen({
    1: [ { type:"nat", prompt:"Arrange in logical order: 1) Seed 2) Tree 3) Fruit 4) Sapling — enter the order as numbers, e.g. 1234", correct:"1243" } ],
    2: [ { type:"nat", prompt:"Arrange in logical order: 1) Graduation 2) School 3) Job 4) College — enter the order as numbers", correct:"2413" } ],
    3: [ { type:"nat", prompt:"Arrange in logical order: 1) Verdict 2) Trial 3) Arrest 4) Investigation — enter the order as numbers", correct:"3421" } ],
  }),

  "verbal-reasoning/statement-course-of-action": poolGen({
    1: [ { type:"nat", prompt:"Statement: 'Absenteeism among employees has increased significantly.' Course of Action: Investigate the reasons. Reasonable? (Yes/No)", correct:"Yes" } ],
    2: [ { type:"nat", prompt:"Statement: 'The bridge shows signs of structural damage.' Course of Action: Close it immediately for inspection. Reasonable? (Yes/No)", correct:"Yes" } ],
    3: [ { type:"nat", prompt:"Statement: 'Customer complaints slightly increased this month.' Course of Action: Discontinue the product immediately. Reasonable? (Yes/No)", correct:"No" } ],
  }),

  "verbal-reasoning/verbal-classification": poolGen({
    1: [ { type:"mcq", prompt:"Find the word that does not belong:", options:["Run","Jump","Swim","Table"], correct:3 } ],
    2: [ { type:"mcq", prompt:"Find the word that does not belong:", options:["Whisper","Shout","Murmur","Walk"], correct:3 } ],
    3: [ { type:"mcq", prompt:"Find the word that does not belong (subtle category):", options:["Concur","Agree","Assent","Deny"], correct:3 } ],
  }),

  "verbal-reasoning/analytical-reasoning-passages": poolGen({
    1: [ { type:"nat", prompt:"Chetan is taller than Amit, who is taller than Bala. Who is the tallest?", correct:"Chetan" } ],
    2: [ { type:"nat", prompt:"X is older than Y, Y is older than Z, Z is older than W. Who is the youngest?", correct:"W" } ],
    3: [ { type:"nat", prompt:"Four teams scored: A > B, C > A, D < B. Who scored the highest?", correct:"C" } ],
  }),

  "verbal-reasoning/strengthen-weaken-argument": poolGen({
    1: [ { type:"nat", prompt:"Argument: 'Exercise improves health.' Which strengthens it more: 'A study of 10,000 people confirms this' or 'My friend feels good after jogging'?", correct:"study" } ],
    2: [ { type:"nat", prompt:"Argument: 'This new drug is effective.' Which weakens it: 'The trial had no control group' or 'The trial included 500 participants'?", correct:"The trial had no control group" } ],
    3: [ { type:"nat", prompt:"Argument: 'Remote work increases productivity.' Which weakens it: 'A well-controlled study found no significant difference' or 'Employees report liking remote work'?", correct:"A well-controlled study found no significant difference" } ],
  }),

  "verbal-reasoning/assumption-identification": poolGen({
    1: [ { type:"nat", prompt:"Statement: 'Turn off the tap to save water.' Assumption: Water is being wasted. Valid? (Yes/No)", correct:"Yes" } ],
    2: [ { type:"nat", prompt:"Statement: 'Switch to renewable energy to cut costs.' Assumption: Renewable energy is cheaper here. Valid? (Yes/No)", correct:"Yes" } ],
    3: [ { type:"nat", prompt:"Statement: 'Since the product is popular abroad, it will succeed here too.' Assumption: Consumer preferences are identical across markets. Reasonable? (Yes/No)", correct:"No" } ],
  }),

  "verbal-reasoning/logical-deduction": poolGen({
    1: [ { type:"nat", prompt:"All cats are animals. Tom is a cat. Is Tom an animal? (Yes/No)", correct:"Yes" } ],
    2: [ { type:"nat", prompt:"All squares have 4 sides. This shape has 4 sides. Is this shape definitely a square? (Yes/No)", correct:"No" } ],
    3: [ { type:"nat", prompt:"If it rains, the ground gets wet. The ground is wet. Did it definitely rain? (Yes/No)", correct:"No" } ],
  }),

  "verbal-reasoning/decision-making-scenarios": poolGen({
    1: [ { type:"nat", prompt:"You have a deadline in 1 hour and unfinished work. Best action: ask for help / panic / ignore it?", correct:"ask for help" } ],
    2: [ { type:"nat", prompt:"A teammate keeps missing deadlines. Best first step: report to manager / discuss with teammate first / ignore it?", correct:"discuss with teammate first" } ],
    3: [ { type:"nat", prompt:"You find a minor error in a report already sent to a client. Best action: ignore it / send a correction promptly / blame a colleague?", correct:"send a correction promptly" } ],
  }),

  "verbal-reasoning/data-sufficiency-verbal": poolGen({
    1: [ { type:"nat", prompt:"Is Ravi taller than Suresh? I: Ravi is taller than Mohan. II: Mohan is taller than Suresh. Which alone sufficient? (I/II/Both/Either/Neither)", correct:"Neither" } ],
    2: [ { type:"nat", prompt:"Is Ravi taller than Suresh? I: Ravi is taller than Mohan, who is taller than Suresh. II: Suresh is shortest in the group. Which alone sufficient? (I/II/Both/Either/Neither)", correct:"Either" } ],
    3: [ { type:"nat", prompt:"Who is tallest among A,B,C? I: A is taller than B. II: C is shorter than B. Which alone sufficient? (I/II/Both/Either/Neither)", correct:"Both" } ],
  }),

  /* =========================== PYTHON =========================== */

  "python/variables-data-types": (level, rng) => {
    if (level === 1) {
      const variants = [
        () => ({ prompt: "Which of these is a mutable data type: tuple, string, list, int? (answer with the type)", correct: "list" }),
        () => ({ prompt: "Which symbol is used for comments in Python?", correct: "#" }),
        () => { const a = randInt(rng,10,50), b = randInt(rng,2,9); return { prompt: `What is the result of ${a} // ${b} (integer division)?`, correct: String(Math.floor(a/b)) }; },
        () => { const a = randInt(rng,2,10), b = randInt(rng,2,5); return { prompt: `What is the result of ${a} ** ${b}?`, correct: String(Math.pow(a,b)) }; },
        () => ({ prompt: "Python is a ___ typed language (statically/dynamically)?", correct: "dynamically" }),
      ];
      const v = randChoice(rng, variants)(); return { type: "nat", ...v };
    }
    if (level === 2) {
      const variants = [
        () => { const w = randChoice(rng, ["hello","world","python","coding","object"]); return { prompt: `What is the output of: len('${w}')`, correct: String(w.length) }; },
        () => { const a = randInt(rng,10,99), b = randInt(rng,2,9); return { prompt: `What is the output of: ${a} % ${b}`, correct: String(a % b) }; },
        () => ({ prompt: "Which function converts a string to an integer in Python?", correct: "int()" }),
        () => { const w = randChoice(rng, ["ab","xy","hi"]); const n = randInt(rng,2,4); return { prompt: `What is the output of: '${w}' * ${n}`, correct: w.repeat(n) }; },
        () => ({ prompt: "What does a Python dictionary use to store data?", correct: "key-value pairs" }),
      ];
      const v = randChoice(rng, variants)(); return { type: "nat", ...v };
    }
    const variants = [
      () => ({ prompt: "What is the average time complexity of a dictionary lookup in Python?", correct: "O(1)" }),
      () => ({ prompt: "Which keyword is used to create a generator function in Python?", correct: "yield" }),
      () => ({ prompt: "Which decorator defines a static method in a Python class?", correct: "@staticmethod" }),
      () => ({ prompt: "Which module provides regular expressions in Python?", correct: "re" }),
      () => { const n = randInt(rng,3,6); const arr = Array.from({length:n},(_,i)=>i*i); return { prompt: `What is the output of: [x**2 for x in range(${n})] (format like [0, 1, 4])`, correct: `[${arr.join(", ")}]` }; },
    ];
    const v = randChoice(rng, variants)(); return { type: "nat", ...v };
  },

  "python/operators": (level, rng) => {
    if (level === 1) { const a = randInt(rng,1,20), b = randInt(rng,1,20); const op = randChoice(rng, ["+","-","*"]); const val = op==="+"?a+b:op==="-"?a-b:a*b; return { type: "nat", prompt: `What is the output of: ${a} ${op} ${b}`, correct: String(val) }; }
    if (level === 2) { const a = randInt(rng,1,20), b = randInt(rng,1,20); return { type: "nat", prompt: `What is the output of: ${a} == ${b} (write True or False)`, correct: a===b ? "True" : "False" }; }
    const a = randInt(rng,1,10), b = randInt(rng,1,10); return { type: "nat", prompt: `What is the output of: (${a} > ${b}) and (${a} < ${b+5}) (write True or False)`, correct: (a>b && a<b+5) ? "True" : "False" };
  },

  "python/input-output": poolGen({
    1: [ { type:"nat", prompt:"Which function prints output to the console in Python?", correct:"print()" }, { type:"nat", prompt:"Which function takes user input in Python?", correct:"input()" } ],
    2: [ { type:"nat", prompt:"What is the output of: print(1, 2, sep='-')", correct:"1-2" }, { type:"nat", prompt:"What is the output of: print('a', end=''); print('b')", correct:"ab" } ],
    3: [ { type:"nat", prompt:"What data type does input() return by default in Python?", correct:"str" } ],
  }),

  "python/conditional-statements": (level, rng) => {
    if (level === 1) { const a = randInt(rng,1,50); return { type: "nat", prompt: `x = ${a}\nif x > 25:\n    print("big")\nelse:\n    print("small")\nWhat is printed?`, correct: a>25 ? "big" : "small" }; }
    if (level === 2) { const a = randInt(rng,1,100); return { type: "nat", prompt: `x = ${a}\nif x % 15 == 0:\n    print("fizzbuzz")\nelif x % 3 == 0:\n    print("fizz")\nelif x % 5 == 0:\n    print("buzz")\nelse:\n    print(x)\nWhat is printed?`, correct: a%15===0?"fizzbuzz":a%3===0?"fizz":a%5===0?"buzz":String(a) }; }
    const a = randInt(rng,1,20), b = randInt(rng,1,20);
    return { type: "nat", prompt: `x, y = ${a}, ${b}\nif x > y and x % 2 == 0:\n    print("A")\nelif x > y:\n    print("B")\nelse:\n    print("C")\nWhat is printed?`, correct: (a>b && a%2===0) ? "A" : (a>b ? "B" : "C") };
  },

  "python/loops": (level, rng) => {
    if (level === 1) { const n = randInt(rng,3,7); let sum=0; for(let i=0;i<n;i++) sum+=i; return { type: "nat", prompt: `total = 0\nfor i in range(${n}):\n    total += i\nprint(total)\nWhat is printed?`, correct: String(sum) }; }
    if (level === 2) { const n = randInt(rng,3,8); let prod=1; for(let i=1;i<=n;i++) prod*=i; return { type: "nat", prompt: `result = 1\nfor i in range(1, ${n}+1):\n    result *= i\nprint(result)\nWhat is printed?`, correct: String(prod) }; }
    const n = randInt(rng,5,12); let count=0; let i=0; while(i<n){ if(i%2===0) count++; i++; }
    return { type: "nat", prompt: `count = 0\ni = 0\nwhile i < ${n}:\n    if i % 2 == 0:\n        count += 1\n    i += 1\nprint(count)\nWhat is printed?`, correct: String(count) };
  },

  "python/strings-basics": (level, rng) => {
    const words = ["python","coding","hello","world","openai"];
    if (level === 1) { const w = randChoice(rng, words); return { type: "nat", prompt: `s = "${w}"\nprint(s.upper())\nWhat is printed?`, correct: w.toUpperCase() }; }
    if (level === 2) { const w = randChoice(rng, words); const i = randInt(rng, 0, w.length-1); return { type: "nat", prompt: `s = "${w}"\nprint(s[${i}])\nWhat is printed?`, correct: w[i] }; }
    const w = randChoice(rng, words); const i = randInt(rng,0,2), j = randInt(rng, i+1, w.length);
    return { type: "nat", prompt: `s = "${w}"\nprint(s[${i}:${j}])\nWhat is printed?`, correct: w.slice(i,j) };
  },

  "python/lists-basics": (level, rng) => {
    if (level === 1) { const n = randInt(rng,3,6); const arr = Array.from({length:n},()=>randInt(rng,1,20)); return { type: "nat", prompt: `lst = [${arr.join(", ")}]\nprint(len(lst))\nWhat is printed?`, correct: String(n) }; }
    if (level === 2) { const n = randInt(rng,4,7); const arr = Array.from({length:n},()=>randInt(rng,1,20)); const i = randInt(rng,0,n-1); return { type: "nat", prompt: `lst = [${arr.join(", ")}]\nprint(lst[${i}])\nWhat is printed?`, correct: String(arr[i]) }; }
    const n = randInt(rng,4,7); const arr = Array.from({length:n},()=>randInt(rng,1,20)); const sorted = [...arr].sort((a,b)=>a-b);
    return { type: "nat", prompt: `lst = [${arr.join(", ")}]\nprint(sorted(lst))\nWhat is printed? (format: [1, 2, 3])`, correct: `[${sorted.join(", ")}]` };
  },

  "python/type-conversion": poolGen({
    1: [ { type:"nat", prompt:"What is the output of: int('42')", correct:"42" }, { type:"nat", prompt:"What is the output of: str(100)", correct:"100" }, { type:"nat", prompt:"What is the output of: float('3.5')", correct:"3.5" } ],
    2: [ { type:"nat", prompt:"What is the output of: int(7.9)", correct:"7" }, { type:"nat", prompt:"What is the output of: bool(0)", correct:"False" }, { type:"nat", prompt:"What is the output of: bool('')", correct:"False" } ],
    3: [ { type:"nat", prompt:"What happens with: int('3.5')? (answer: error)", correct:"error" }, { type:"nat", prompt:"What is the output of: list('abc')", correct:"['a', 'b', 'c']" } ],
  }),

  "python/functions": (level, rng) => {
    if (level === 1) { const a = randInt(rng,1,20), b = randInt(rng,1,20); return { type: "nat", prompt: `def add(x, y):\n    return x + y\nprint(add(${a}, ${b}))\nWhat is printed?`, correct: String(a+b) }; }
    if (level === 2) { const a = randInt(rng,1,10); return { type: "nat", prompt: `def square(x):\n    return x * x\nprint(square(${a}))\nWhat is printed?`, correct: String(a*a) }; }
    const a = randInt(rng,2,5);
    return { type: "nat", prompt: `def f(x, y=10):\n    return x + y\nprint(f(${a}))\nWhat is printed?`, correct: String(a+10) };
  },

  "python/tuples": poolGen({
    1: [ { type:"nat", prompt:"t = (1, 2, 3)\nprint(len(t))\nWhat is printed?", correct:"3" }, { type:"nat", prompt:"t = (10, 20, 30)\nprint(t[1])\nWhat is printed?", correct:"20" } ],
    2: [ { type:"nat", prompt:"t = (1, 2, 3)\nt[0] = 5\nWhat happens? (answer: error)", correct:"error" } ],
    3: [ { type:"nat", prompt:"a, b = (5, 10)\nprint(a + b)\nWhat is printed?", correct:"15" } ],
  }),

  "python/dictionaries": (level, rng) => {
    if (level === 1) { const k = randChoice(rng, ["a","b","c"]); const v = randInt(rng,1,50); return { type: "nat", prompt: `d = {'${k}': ${v}}\nprint(d['${k}'])\nWhat is printed?`, correct: String(v) }; }
    if (level === 2) { return { type: "nat", prompt: `d = {'x': 1, 'y': 2, 'z': 3}\nprint(len(d))\nWhat is printed?`, correct: "3" }; }
    return { type: "nat", prompt: `d = {'a': 1, 'b': 2}\nd['c'] = 3\nprint(list(d.keys()))\nWhat is printed? (format: ['a', 'b', 'c'])`, correct: "['a', 'b', 'c']" };
  },

  "python/sets": poolGen({
    1: [ { type:"nat", prompt:"s = {1, 2, 2, 3, 3, 3}\nprint(len(s))\nWhat is printed?", correct:"3" } ],
    2: [ { type:"nat", prompt:"a = {1, 2, 3}\nb = {2, 3, 4}\nprint(sorted(a & b))\nWhat is printed? (format: [2, 3])", correct:"[2, 3]" } ],
    3: [ { type:"nat", prompt:"a = {1, 2, 3}\nb = {2, 3, 4}\nprint(sorted(a ^ b))\nWhat is printed? (format: [1, 4])", correct:"[1, 4]" } ],
  }),

  "python/string-methods": (level, rng) => {
    if (level === 1) { return { type: "nat", prompt: `s = "  hello  "\nprint(s.strip())\nWhat is printed?`, correct: "hello" }; }
    if (level === 2) { return { type: "nat", prompt: `s = "Python"\nprint(s.lower())\nWhat is printed?`, correct: "python" }; }
    return { type: "nat", prompt: `s = "a,b,c"\nprint(s.split(','))\nWhat is printed? (format: ['a', 'b', 'c'])`, correct: "['a', 'b', 'c']" };
  },

  "python/list-comprehension": (level, rng) => {
    if (level === 1) { const n = randInt(rng,3,6); const arr = Array.from({length:n},(_,i)=>i); return { type: "nat", prompt: `print([x for x in range(${n})])\nWhat is printed?`, correct: `[${arr.join(", ")}]` }; }
    if (level === 2) { const n = randInt(rng,3,6); const arr = Array.from({length:n},(_,i)=>i*i); return { type: "nat", prompt: `print([x**2 for x in range(${n})])\nWhat is printed?`, correct: `[${arr.join(", ")}]` }; }
    const n = randInt(rng,5,10); const arr = []; for(let i=0;i<n;i++) if(i%2===0) arr.push(i);
    return { type: "nat", prompt: `print([x for x in range(${n}) if x % 2 == 0])\nWhat is printed?`, correct: `[${arr.join(", ")}]` };
  },

  "python/exception-handling": poolGen({
    1: [ { type:"nat", prompt:"Which keyword catches exceptions in Python?", correct:"except" }, { type:"nat", prompt:"Which block always executes, exception or not?", correct:"finally" } ],
    2: [ { type:"nat", prompt:"What exception is raised when dividing by zero?", correct:"ZeroDivisionError" }, { type:"nat", prompt:"What exception is raised when accessing an invalid list index?", correct:"IndexError" } ],
    3: [ { type:"nat", prompt:"What exception is raised when a dictionary key is not found?", correct:"KeyError" }, { type:"nat", prompt:"Which keyword manually raises an exception?", correct:"raise" } ],
  }),

  "python/file-handling": poolGen({
    1: [ { type:"nat", prompt:"Which function opens a file in Python?", correct:"open()" }, { type:"nat", prompt:"Which mode opens a file for reading only?", correct:"r" } ],
    2: [ { type:"nat", prompt:"Which mode opens a file for writing (overwrites content)?", correct:"w" }, { type:"nat", prompt:"Which mode appends content to a file?", correct:"a" } ],
    3: [ { type:"nat", prompt:"Which statement auto-closes a file even if an exception occurs?", correct:"with" } ],
  }),

  "python/modules-packages": poolGen({
    1: [ { type:"nat", prompt:"Which keyword imports a module in Python?", correct:"import" }, { type:"nat", prompt:"Which module provides math functions like sqrt()?", correct:"math" } ],
    2: [ { type:"nat", prompt:"Which module generates random numbers?", correct:"random" }, { type:"nat", prompt:"Which module handles dates and times?", correct:"datetime" } ],
    3: [ { type:"nat", prompt:"What file marks a directory as a Python package (older Python)?", correct:"__init__.py" } ],
  }),

  "python/recursion": (level, rng) => {
    if (level === 1) { const n = randInt(rng,3,8); let f=1; for(let i=2;i<=n;i++) f*=i; return { type: "nat", prompt: `def fact(n):\n    if n == 0:\n        return 1\n    return n * fact(n-1)\nprint(fact(${n}))\nWhat is printed?`, correct: String(f) }; }
    if (level === 2) { const n = randInt(rng,5,12); let a=0,b=1; for(let i=0;i<n;i++){[a,b]=[b,a+b];} return { type: "nat", prompt: `def fib(n):\n    if n <= 1:\n        return n\n    return fib(n-1) + fib(n-2)\nprint(fib(${n}))\nWhat is printed?`, correct: String(a) }; }
    const num = randInt(rng,100,9999);
    return { type: "nat", prompt: `def sum_digits(n):\n    if n == 0:\n        return 0\n    return n % 10 + sum_digits(n // 10)\nprint(sum_digits(${num}))\nWhat is printed?`, correct: String(String(num).split("").reduce((s,d)=>s+Number(d),0)) };
  },

  "python/oops-concepts": poolGen({
    1: [ { type:"nat", prompt:"Which keyword defines a class in Python?", correct:"class" }, { type:"nat", prompt:"What is the constructor method called in a Python class?", correct:"__init__" } ],
    2: [ { type:"nat", prompt:"What does 'self' refer to inside a class method?", correct:"the instance" }, { type:"nat", prompt:"Which OOP concept lets a child class reuse a parent's code?", correct:"inheritance" } ],
    3: [ { type:"nat", prompt:"Which OOP concept allows the same method name to behave differently across classes?", correct:"polymorphism" }, { type:"nat", prompt:"Which OOP concept restricts direct access to internal state?", correct:"encapsulation" } ],
  }),

  "python/lambda-higher-order-functions": (level, rng) => {
    if (level === 1) { const a = randInt(rng,1,20), b=randInt(rng,1,20); return { type: "nat", prompt: `add = lambda x, y: x + y\nprint(add(${a}, ${b}))\nWhat is printed?`, correct: String(a+b) }; }
    if (level === 2) { const n = randInt(rng,3,6); const arr = Array.from({length:n},(_,i)=>i+1); const doubled = arr.map(x=>x*2); return { type: "nat", prompt: `nums = [${arr.join(", ")}]\nprint(list(map(lambda x: x*2, nums)))\nWhat is printed?`, correct: `[${doubled.join(", ")}]` }; }
    const n = randInt(rng,5,8); const arr = Array.from({length:n},(_,i)=>i+1); const filtered = arr.filter(x=>x%2===0);
    return { type: "nat", prompt: `nums = [${arr.join(", ")}]\nprint(list(filter(lambda x: x % 2 == 0, nums)))\nWhat is printed?`, correct: `[${filtered.join(", ")}]` };
  },

  "python/generators-iterators": poolGen({
    1: [ { type:"nat", prompt:"Which keyword turns a function into a generator?", correct:"yield" } ],
    2: [ { type:"nat", prompt:"Which built-in function retrieves the next item from an iterator?", correct:"next()" } ],
    3: [ { type:"nat", prompt:"What exception is raised when next() is called on an exhausted iterator?", correct:"StopIteration" } ],
  }),

  "python/decorators": poolGen({
    1: [ { type:"nat", prompt:"What symbol applies a decorator to a function?", correct:"@" } ],
    2: [ { type:"nat", prompt:"Which built-in decorator marks a method as not requiring an instance?", correct:"@staticmethod" } ],
    3: [ { type:"nat", prompt:"Which built-in decorator lets a method be accessed like an attribute?", correct:"@property" } ],
  }),

  "python/multithreading": poolGen({
    1: [ { type:"nat", prompt:"Which module is used for multithreading in Python?", correct:"threading" } ],
    2: [ { type:"nat", prompt:"What does GIL stand for in Python?", correct:"Global Interpreter Lock" } ],
    3: [ { type:"nat", prompt:"For CPU-bound parallelism bypassing the GIL, which module is preferred?", correct:"multiprocessing" } ],
  }),

  "python/regular-expressions": poolGen({
    1: [ { type:"nat", prompt:"Which module provides regex support in Python?", correct:"re" } ],
    2: [ { type:"nat", prompt:"Which re function returns the first match anywhere in a string?", correct:"search" } ],
    3: [ { type:"nat", prompt:"Which re function returns all non-overlapping matches as a list?", correct:"findall" } ],
  }),

  "python/data-structures-in-python": poolGen({
    1: [ { type:"nat", prompt:"Which built-in type implements a stack most efficiently (append/pop from end)?", correct:"list" } ],
    2: [ { type:"nat", prompt:"Which module provides a double-ended queue (deque)?", correct:"collections" } ],
    3: [ { type:"nat", prompt:"Which module provides a heap (priority queue) implementation?", correct:"heapq" } ],
  }),

  "python/sorting-searching": (level, rng) => {
    if (level === 1) { const n = randInt(rng,4,7); const arr = Array.from({length:n},()=>randInt(rng,1,50)); const sorted = [...arr].sort((a,b)=>a-b); return { type: "nat", prompt: `lst = [${arr.join(", ")}]\nprint(sorted(lst))\nWhat is printed?`, correct: `[${sorted.join(", ")}]` }; }
    if (level === 2) { const n = randInt(rng,4,7); const arr = Array.from({length:n},()=>randInt(rng,1,50)); const sorted = [...arr].sort((a,b)=>b-a); return { type: "nat", prompt: `lst = [${arr.join(", ")}]\nprint(sorted(lst, reverse=True))\nWhat is printed?`, correct: `[${sorted.join(", ")}]` }; }
    const n = randInt(rng,5,10); const arr = Array.from({length:n},()=>randInt(rng,1,99)).sort((a,b)=>a-b); const target = randChoice(rng, arr);
    return { type: "nat", prompt: `Using binary search on sorted list ${JSON.stringify(arr)}, what index does value ${target} appear at first?`, correct: String(arr.indexOf(target)) };
  },

  "python/numpy-pandas-basics": poolGen({
    1: [ { type:"nat", prompt:"Which library provides fast array operations, commonly imported as 'np'?", correct:"numpy" }, { type:"nat", prompt:"Which library provides DataFrames, commonly imported as 'pd'?", correct:"pandas" } ],
    2: [ { type:"nat", prompt:"Which numpy function creates evenly spaced values within a range?", correct:"arange" }, { type:"nat", prompt:"Which pandas method reads a CSV file into a DataFrame?", correct:"read_csv" } ],
    3: [ { type:"nat", prompt:"Which pandas method gives summary statistics of a DataFrame?", correct:"describe" } ],
  }),

  "python/api-handling": poolGen({
    1: [ { type:"nat", prompt:"Which popular library makes HTTP requests in Python?", correct:"requests" } ],
    2: [ { type:"nat", prompt:"Which requests method sends a GET request?", correct:"requests.get" } ],
    3: [ { type:"nat", prompt:"Which method on a requests Response object parses JSON content?", correct:"json()" } ],
  }),

  "python/db-connectivity": poolGen({
    1: [ { type:"nat", prompt:"Which built-in module connects to SQLite databases?", correct:"sqlite3" } ],
    2: [ { type:"nat", prompt:"Which method executes a SQL query using a cursor object?", correct:"execute" } ],
    3: [ { type:"nat", prompt:"Which method saves changes made to an SQLite database?", correct:"commit" } ],
  }),

  /* ========================= C/C++/JAVA (coding) ========================= */

  "coding/syntax-basics": poolGen({
    1: [ { type:"nat", prompt:"In C/C++, which symbol ends a statement?", correct:";" }, { type:"nat", prompt:"Which function is the entry point of a C/C++ program?", correct:"main" } ],
    2: [ { type:"nat", prompt:"In Java, what must the public class name match?", correct:"the filename" } ],
    3: [ { type:"nat", prompt:"Which C++ operator is used for scope resolution?", correct:"::" } ],
  }),

  "coding/data-types": poolGen({
    1: [ { type:"nat", prompt:"In C, which type stores a single character?", correct:"char" }, { type:"nat", prompt:"In Java, which type stores true/false?", correct:"boolean" } ],
    2: [ { type:"nat", prompt:"In C++, typical size (bytes) of 'int' on most modern systems?", correct:"4" }, { type:"nat", prompt:"In Java, which type stores a 64-bit integer?", correct:"long" } ],
    3: [ { type:"nat", prompt:"In C, which keyword defines a user-defined data type combining variables?", correct:"struct" } ],
  }),

  "coding/operators": (level, rng) => {
    if (level === 1) { const a = randInt(rng,1,20), b=randInt(rng,1,20); return { type:"nat", prompt: `int result = ${a} + ${b}; What is result?`, correct: String(a+b) }; }
    if (level === 2) { const a = randInt(rng,10,50), b = randInt(rng,2,9); return { type:"nat", prompt: `int result = ${a} % ${b}; What is result?`, correct: String(a%b) }; }
    const a = randInt(rng,1,10); return { type:"nat", prompt: `int x = ${a}; int result = x++ + ++x; What is result?`, correct: String(a + (a+2)) };
  },

  "coding/control-statements": (level, rng) => {
    if (level === 1) { const a = randInt(rng,1,50); return { type: "nat", prompt: `int x = ${a};\nif (x > 25) { print("big"); } else { print("small"); }\nWhat is printed?`, correct: a>25?"big":"small" }; }
    const a = randInt(rng,1,20), b = randInt(rng,1,20);
    return { type: "nat", prompt: `int x = ${a}, y = ${b};\nif (x > y) print("x wins"); else print("y wins or tie");\nWhat is printed?`, correct: a>b ? "x wins" : "y wins or tie" };
  },

  "coding/loops": (level, rng) => {
    if (level === 1) { const n = randInt(rng,3,8); let sum=0; for(let i=1;i<=n;i++) sum+=i; return { type: "nat", prompt: `int sum = 0;\nfor (int i = 1; i <= ${n}; i++) { sum += i; }\nWhat is the final value of sum?`, correct: String(sum) }; }
    const n = randInt(rng,4,10); let count=0; for(let i=0;i<n;i++) if(i%2===0) count++;
    return { type: "nat", prompt: `int count = 0;\nfor (int i = 0; i < ${n}; i++) { if (i % 2 == 0) count++; }\nWhat is the final value of count?`, correct: String(count) };
  },

  "coding/arrays": (level, rng) => {
    if (level === 1) { const n = randInt(rng,4,7); const arr = Array.from({length:n},()=>randInt(rng,1,50)); return { type: "nat", prompt: `int arr[] = {${arr.join(", ")}};\nWhat is the size of this array?`, correct: String(n) }; }
    const n = randInt(rng,4,7); const arr = Array.from({length:n},()=>randInt(rng,1,50)); const i = randInt(rng,0,n-1);
    return { type: "nat", prompt: `int arr[] = {${arr.join(", ")}};\nWhat is arr[${i}]?`, correct: String(arr[i]) };
  },

  "coding/functions": (level, rng) => {
    if (level === 1) { const a = randInt(rng,1,20), b = randInt(rng,1,20); return { type: "nat", prompt: `int add(int x, int y) { return x + y; }\nprint(add(${a}, ${b}));\nWhat is printed?`, correct: String(a+b) }; }
    const a = randInt(rng,1,10); return { type: "nat", prompt: `int square(int x) { return x * x; }\nprint(square(${a}));\nWhat is printed?`, correct: String(a*a) };
  },

  "coding/pointers-c-cpp": poolGen({
    1: [ { type:"nat", prompt:"In C, which operator gets the address of a variable?", correct:"&" }, { type:"nat", prompt:"In C, which operator dereferences a pointer?", correct:"*" } ],
    2: [ { type:"nat", prompt:"int x = 5; int *p = &x; *p = 10; What is x now?", correct:"10" } ],
    3: [ { type:"nat", prompt:"In C++, which pointer type cannot be reassigned but can change the value it points to?", correct:"a constant pointer (Type* const p)" } ],
  }),

  "coding/string-handling": (level, rng) => {
    const words = ["hello","world","coding","java"];
    if (level === 1) { const w = randChoice(rng, words); return { type: "nat", prompt: `In C/Java, what is the length of "${w}"?`, correct: String(w.length) }; }
    const w = randChoice(rng, words); return { type: "nat", prompt: `String s = "${w}"; System.out.println(s.toUpperCase()); What is printed?`, correct: w.toUpperCase() };
  },

  "coding/structures-classes": poolGen({
    1: [ { type:"nat", prompt:"In C, which keyword defines a structure?", correct:"struct" }, { type:"nat", prompt:"In C++/Java, which keyword defines a class?", correct:"class" } ],
    2: [ { type:"nat", prompt:"In C++, default access specifier for 'class' members?", correct:"private" }, { type:"nat", prompt:"In C++, default access specifier for 'struct' members?", correct:"public" } ],
    3: [ { type:"nat", prompt:"In Java, which keyword prevents a class from being subclassed?", correct:"final" } ],
  }),

  "coding/oops-concepts": poolGen({
    1: [ { type:"nat", prompt:"Which OOP concept means bundling data and methods together?", correct:"encapsulation" } ],
    2: [ { type:"nat", prompt:"Which OOP concept lets a subclass inherit from a superclass?", correct:"inheritance" } ],
    3: [ { type:"nat", prompt:"Which OOP concept allows one interface for different underlying forms?", correct:"polymorphism" } ],
  }),

  "coding/constructors-destructors": poolGen({
    1: [ { type:"nat", prompt:"In Java, what must a constructor's name match?", correct:"the class name" } ],
    2: [ { type:"nat", prompt:"In C++, which symbol precedes a destructor's name?", correct:"~" } ],
    3: [ { type:"nat", prompt:"What is it called when a constructor calls another constructor of the same class?", correct:"constructor chaining" } ],
  }),

  "coding/inheritance-polymorphism": poolGen({
    1: [ { type:"nat", prompt:"In Java, which keyword lets a class inherit from another?", correct:"extends" } ],
    2: [ { type:"nat", prompt:"In Java, which keyword lets a class implement multiple interfaces?", correct:"implements" } ],
    3: [ { type:"nat", prompt:"What is it called when a subclass provides its own implementation of a superclass method?", correct:"method overriding" } ],
  }),

  "coding/exception-handling-cpp-java": poolGen({
    1: [ { type:"nat", prompt:"Which block catches exceptions in Java/C++?", correct:"catch" } ],
    2: [ { type:"nat", prompt:"Which block always executes regardless of exceptions?", correct:"finally" } ],
    3: [ { type:"nat", prompt:"Which Java keyword declares a method might throw a checked exception?", correct:"throws" } ],
  }),

  "coding/templates-generics": poolGen({
    1: [ { type:"nat", prompt:"In C++, which keyword introduces a template?", correct:"template" } ],
    2: [ { type:"nat", prompt:"Java generics are primarily used for what — compile-time type safety or runtime speed?", correct:"compile-time type safety" } ],
    3: [ { type:"nat", prompt:"In Java generics, which wildcard symbol represents an unknown type?", correct:"?" } ],
  }),

  "coding/stl-cpp": poolGen({
    1: [ { type:"nat", prompt:"Which C++ STL container implements a dynamic array?", correct:"vector" } ],
    2: [ { type:"nat", prompt:"Which C++ STL container stores unique keys in sorted order?", correct:"set" } ],
    3: [ { type:"nat", prompt:"Which C++ STL container gives O(1) average key-value lookups?", correct:"unordered_map" } ],
  }),

  "coding/collections-framework-java": poolGen({
    1: [ { type:"nat", prompt:"Which Java Collections interface represents a dynamic ordered list?", correct:"List" } ],
    2: [ { type:"nat", prompt:"Which Java class implements a resizable array as a List?", correct:"ArrayList" } ],
    3: [ { type:"nat", prompt:"Which Java Collections class gives O(1) average key-value lookups?", correct:"HashMap" } ],
  }),

  "coding/file-io": poolGen({
    1: [ { type:"nat", prompt:"Which Java class commonly reads text files line by line?", correct:"BufferedReader" } ],
    2: [ { type:"nat", prompt:"Which C++ header provides file stream classes (ifstream/ofstream)?", correct:"fstream" } ],
    3: [ { type:"nat", prompt:"Which Java interface must a class implement to be object-serialized to a file?", correct:"Serializable" } ],
  }),

  "coding/multithreading-cpp-java": poolGen({
    1: [ { type:"nat", prompt:"In Java, which class/interface creates a new thread?", correct:"Thread (or Runnable)" } ],
    2: [ { type:"nat", prompt:"In Java, which keyword ensures only one thread executes a method/block at a time?", correct:"synchronized" } ],
    3: [ { type:"nat", prompt:"In C++11+, which header provides thread support?", correct:"thread" } ],
  }),

  "coding/design-patterns": poolGen({
    1: [ { type:"nat", prompt:"Which design pattern ensures a class has only one instance?", correct:"Singleton" } ],
    2: [ { type:"nat", prompt:"Which design pattern creates objects without specifying their concrete classes?", correct:"Factory" } ],
    3: [ { type:"nat", prompt:"Which design pattern notifies dependent objects automatically when state changes?", correct:"Observer" } ],
  }),

  /* =============================== DBMS =============================== */

  "dbms/basic-sql-queries": poolGen({
    1: [
      { type:"nat", prompt:"Which SQL keyword retrieves data from a table?", correct:"SELECT" },
      { type:"nat", prompt:"Which SQL clause filters rows based on a condition?", correct:"WHERE" },
      { type:"nat", prompt:"Which SQL keyword sorts the result set?", correct:"ORDER BY" },
      { type:"nat", prompt:"Which SQL command adds new rows to a table?", correct:"INSERT" },
    ],
    2: [
      { type:"nat", prompt:"Which SQL command modifies existing rows?", correct:"UPDATE" },
      { type:"nat", prompt:"Which SQL command removes rows from a table?", correct:"DELETE" },
      { type:"nat", prompt:"Which SQL keyword removes duplicate rows from a result set?", correct:"DISTINCT" },
    ],
    3: [
      { type:"nat", prompt:"Which SQL command removes an entire table structure and its data?", correct:"DROP" },
      { type:"nat", prompt:"Which SQL command removes all rows but keeps the table structure?", correct:"TRUNCATE" },
    ],
  }),

  "dbms/data-types": poolGen({
    1: [ { type:"nat", prompt:"Which SQL type stores variable-length character strings?", correct:"VARCHAR" }, { type:"nat", prompt:"Which SQL type stores whole numbers?", correct:"INT" } ],
    2: [ { type:"nat", prompt:"Which SQL type stores date and time together?", correct:"DATETIME" }, { type:"nat", prompt:"Which SQL type stores true/false values?", correct:"BOOLEAN" } ],
    3: [ { type:"nat", prompt:"Which SQL type is used for exact fixed-point numbers (e.g. currency)?", correct:"DECIMAL" } ],
  }),

  "dbms/keys-primary-foreign": poolGen({
    1: [ { type:"nat", prompt:"Which key uniquely identifies each record in a table?", correct:"Primary Key" }, { type:"nat", prompt:"Which key refers to a primary key in another table?", correct:"Foreign Key" } ],
    2: [ { type:"nat", prompt:"Can a table have more than one candidate key?", correct:"Yes" }, { type:"nat", prompt:"Can a primary key column contain NULL values?", correct:"No" } ],
    3: [ { type:"nat", prompt:"What is a key formed from two or more columns to uniquely identify a row called?", correct:"Composite Key" } ],
  }),

  "dbms/joins": poolGen({
    1: [ { type:"nat", prompt:"Which JOIN returns only matching rows from both tables?", correct:"INNER JOIN" } ],
    2: [ { type:"nat", prompt:"Which JOIN returns all rows from the left table and matches from the right?", correct:"LEFT JOIN" }, { type:"nat", prompt:"Which JOIN returns all rows from the right table and matches from the left?", correct:"RIGHT JOIN" } ],
    3: [ { type:"nat", prompt:"Which JOIN returns all rows when there's a match in either table (NULLs otherwise)?", correct:"FULL OUTER JOIN" } ],
  }),

  "dbms/group-by-having": poolGen({
    1: [ { type:"nat", prompt:"Which SQL clause groups rows sharing a common value for aggregation?", correct:"GROUP BY" } ],
    2: [ { type:"nat", prompt:"Which SQL clause filters groups after aggregation?", correct:"HAVING" } ],
    3: [ { type:"nat", prompt:"With GROUP BY and HAVING COUNT(*) > 5, what does this filter for?", correct:"groups with more than 5 rows" } ],
  }),

  "dbms/subqueries": poolGen({
    1: [ { type:"nat", prompt:"What is a query nested inside another SQL query called?", correct:"Subquery" } ],
    2: [ { type:"nat", prompt:"Which SQL operator checks if a value exists in a subquery's result set?", correct:"IN" } ],
    3: [ { type:"nat", prompt:"Which subquery type references a column from the outer query and re-executes per outer row?", correct:"Correlated subquery" } ],
  }),

  "dbms/normalization": poolGen({
    1: [ { type:"nat", prompt:"Which normal form requires all column values to be atomic?", correct:"1NF" } ],
    2: [ { type:"nat", prompt:"Which normal form removes partial dependency on a composite primary key?", correct:"2NF" } ],
    3: [ { type:"nat", prompt:"Which normal form removes transitive dependency between non-key attributes?", correct:"3NF" } ],
  }),

  "dbms/aggregate-functions": (level, rng) => {
    const arr = Array.from({length: randInt(rng,4,7)}, () => randInt(rng,10,99));
    if (level === 1) { return { type: "nat", prompt: `Given column values [${arr.join(", ")}], what does SUM() return?`, correct: String(arr.reduce((a,b)=>a+b,0)) }; }
    if (level === 2) { return { type: "nat", prompt: `Given column values [${arr.join(", ")}], what does AVG() return (round 2 decimals)?`, correct: fmt2(round2(arr.reduce((a,b)=>a+b,0)/arr.length)) }; }
    return { type: "nat", prompt: `Given column values [${arr.join(", ")}], what does MAX() return?`, correct: String(Math.max(...arr)) };
  },

  "dbms/indexing": poolGen({
    1: [ { type:"nat", prompt:"What is the main purpose of an index on a database table?", correct:"speed up data retrieval" } ],
    2: [ { type:"nat", prompt:"What is the typical time complexity of a B-Tree index lookup?", correct:"O(log n)" } ],
    3: [ { type:"nat", prompt:"What downside do many indexes have on write operations?", correct:"they slow down writes" } ],
  }),

  "dbms/transactions-acid": poolGen({
    1: [ { type:"nat", prompt:"What does the 'A' in ACID stand for?", correct:"Atomicity" }, { type:"nat", prompt:"What does the 'C' in ACID stand for?", correct:"Consistency" } ],
    2: [ { type:"nat", prompt:"What does the 'I' in ACID stand for?", correct:"Isolation" }, { type:"nat", prompt:"What does the 'D' in ACID stand for?", correct:"Durability" } ],
    3: [ { type:"nat", prompt:"Which SQL command permanently saves changes made in a transaction?", correct:"COMMIT" }, { type:"nat", prompt:"Which SQL command undoes uncommitted transaction changes?", correct:"ROLLBACK" } ],
  }),

  "dbms/views": poolGen({
    1: [ { type:"nat", prompt:"What SQL command creates a virtual table based on a query?", correct:"CREATE VIEW" } ],
    2: [ { type:"nat", prompt:"Does a view store data physically by default?", correct:"No" } ],
    3: [ { type:"nat", prompt:"What type of view stores computed data physically for faster access?", correct:"Materialized View" } ],
  }),

  "dbms/stored-procedures": poolGen({
    1: [ { type:"nat", prompt:"What SQL command creates a stored procedure?", correct:"CREATE PROCEDURE" } ],
    2: [ { type:"nat", prompt:"What SQL command executes a stored procedure?", correct:"CALL" } ],
    3: [ { type:"nat", prompt:"What performance benefit does a stored procedure give over individual queries?", correct:"reduced network round-trips / precompiled execution" } ],
  }),

  "dbms/triggers": poolGen({
    1: [ { type:"nat", prompt:"What SQL command creates a trigger?", correct:"CREATE TRIGGER" } ],
    2: [ { type:"nat", prompt:"Name a triggering event that fires a trigger (INSERT, UPDATE, or DELETE — any one).", correct:"INSERT" } ],
    3: [ { type:"nat", prompt:"What is a trigger that fires once for the whole statement (not per row) called?", correct:"statement-level trigger" } ],
  }),

  "dbms/query-optimization": poolGen({
    1: [ { type:"nat", prompt:"What SQL command shows the execution plan of a query?", correct:"EXPLAIN" } ],
    2: [ { type:"nat", prompt:"Does SELECT * instead of naming columns generally help or hurt performance?", correct:"hurt" } ],
    3: [ { type:"nat", prompt:"What database object most commonly improves query performance on filtered/joined columns?", correct:"index" } ],
  }),

  "dbms/er-diagrams": poolGen({
    1: [ { type:"nat", prompt:"In an ER diagram, what shape represents an entity?", correct:"Rectangle" }, { type:"nat", prompt:"In an ER diagram, what shape represents a relationship?", correct:"Diamond" } ],
    2: [ { type:"nat", prompt:"In an ER diagram, what shape represents an attribute?", correct:"Ellipse" } ],
    3: [ { type:"nat", prompt:"What term describes a relationship where one entity relates to many instances of another?", correct:"one-to-many" } ],
  }),

  /* ============================= OS & CN ============================= */

  "os-cn/os-basics": poolGen({
    1: [ { type:"nat", prompt:"What is the core program managing hardware and software resources called?", correct:"Operating System" }, { type:"nat", prompt:"What is a program in execution called?", correct:"Process" } ],
    2: [ { type:"nat", prompt:"What term describes the OS switching the CPU between processes to simulate parallel execution?", correct:"multitasking" } ],
    3: [ { type:"nat", prompt:"What OS component directly interacts with hardware?", correct:"kernel" } ],
  }),

  "os-cn/process-vs-thread": poolGen({
    1: [ { type:"nat", prompt:"Do processes have their own separate memory space? (Yes/No)", correct:"Yes" }, { type:"nat", prompt:"Do threads within the same process share memory space? (Yes/No)", correct:"Yes" } ],
    2: [ { type:"nat", prompt:"Which is generally lighter weight to create — a process or a thread?", correct:"thread" } ],
    3: [ { type:"nat", prompt:"What term describes a terminated process still holding a process table entry?", correct:"zombie process" } ],
  }),

  "os-cn/memory-types": poolGen({
    1: [ { type:"nat", prompt:"Which memory type is volatile, used for active program execution?", correct:"RAM" }, { type:"nat", prompt:"Which memory type is non-volatile and stores boot firmware?", correct:"ROM" } ],
    2: [ { type:"nat", prompt:"Which small, fast memory sits between CPU and RAM?", correct:"Cache" } ],
    3: [ { type:"nat", prompt:"What technique lets a program use more memory than physically available via disk?", correct:"Virtual Memory" } ],
  }),

  "os-cn/scheduling-algorithms": poolGen({
    1: [ { type:"nat", prompt:"Which scheduling algorithm processes jobs strictly in arrival order?", correct:"FCFS (First Come First Served)" } ],
    2: [ { type:"nat", prompt:"Which scheduling algorithm always picks the smallest execution time job next?", correct:"SJF (Shortest Job First)" } ],
    3: [ { type:"nat", prompt:"Which scheduling algorithm gives each process a fixed time slice in rotation?", correct:"Round Robin" } ],
  }),

  "os-cn/deadlock": poolGen({
    1: [ { type:"nat", prompt:"What term describes processes waiting forever for resources held by each other?", correct:"Deadlock" } ],
    2: [ { type:"nat", prompt:"Name one necessary condition for deadlock (Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait).", correct:"Mutual Exclusion" } ],
    3: [ { type:"nat", prompt:"Which algorithm is used for deadlock avoidance by checking safe states?", correct:"Banker's Algorithm" } ],
  }),

  "os-cn/paging-segmentation": poolGen({
    1: [ { type:"nat", prompt:"What technique divides memory into fixed-size blocks?", correct:"Paging" } ],
    2: [ { type:"nat", prompt:"What technique divides a program into variable-sized logical units?", correct:"Segmentation" } ],
    3: [ { type:"nat", prompt:"What data structure maps virtual page numbers to physical frames?", correct:"Page Table" } ],
  }),

  "os-cn/osi-tcp-ip-model": poolGen({
    1: [ { type:"nat", prompt:"How many layers does the OSI model have?", correct:"7" }, { type:"nat", prompt:"Which OSI layer routes packets between networks?", correct:"Network layer" } ],
    2: [ { type:"nat", prompt:"How many layers does the TCP/IP model typically have?", correct:"4" }, { type:"nat", prompt:"Which OSI layer manages sessions between applications?", correct:"Session layer" } ],
    3: [ { type:"nat", prompt:"Which OSI layer handles encryption, compression, and translation?", correct:"Presentation layer" } ],
  }),

  "os-cn/synchronization-semaphores-mutex": poolGen({
    1: [ { type:"nat", prompt:"Which synchronization tool allows only one thread into a critical section at a time?", correct:"Mutex" } ],
    2: [ { type:"nat", prompt:"Which semaphore type can take any non-negative integer, useful for multiple resource instances?", correct:"Counting Semaphore" } ],
    3: [ { type:"nat", prompt:"What is the code section where shared resources are accessed and must be protected called?", correct:"Critical Section" } ],
  }),

  "os-cn/virtual-memory": poolGen({
    1: [ { type:"nat", prompt:"What event occurs when a program accesses a page not currently in memory?", correct:"Page Fault" } ],
    2: [ { type:"nat", prompt:"Which page replacement algorithm replaces the least-recently-used page?", correct:"LRU (Least Recently Used)" } ],
    3: [ { type:"nat", prompt:"What term describes excessive paging that severely degrades performance?", correct:"Thrashing" } ],
  }),

  "os-cn/concurrency": poolGen({
    1: [ { type:"nat", prompt:"What term describes multiple tasks making progress during overlapping time periods?", correct:"Concurrency" } ],
    2: [ { type:"nat", prompt:"What term describes tasks executing at the exact same instant (multi-core)?", correct:"Parallelism" } ],
    3: [ { type:"nat", prompt:"What condition occurs when concurrent outcomes depend on unpredictable thread timing?", correct:"Race Condition" } ],
  }),

  "os-cn/network-protocols": poolGen({
    1: [ { type:"nat", prompt:"Which protocol translates domain names into IP addresses?", correct:"DNS" }, { type:"nat", prompt:"Which protocol is the foundation of data communication on the Web?", correct:"HTTP" } ],
    2: [ { type:"nat", prompt:"Which protocol auto-assigns IP addresses to devices?", correct:"DHCP" }, { type:"nat", prompt:"Which secure HTTP variant encrypts data with TLS/SSL?", correct:"HTTPS" } ],
    3: [ { type:"nat", prompt:"Which protocol provides reliable, ordered, connection-oriented delivery?", correct:"TCP" }, { type:"nat", prompt:"Which protocol provides fast, connectionless delivery (used for streaming)?", correct:"UDP" } ],
  }),

  "os-cn/ip-addressing-subnetting": (level, rng) => {
    if (level === 1) { return { type: "nat", prompt: `An IPv4 address has how many octets (groups of 8 bits)?`, correct: "4" }; }
    if (level === 2) { const cidr = randChoice(rng, [24,25,26,27,28]); return { type: "nat", prompt: `For a subnet with CIDR /${cidr}, how many host bits are available?`, correct: String(32-cidr) }; }
    const cidr = randChoice(rng, [24,25,26,27,28,29]); const usable = Math.pow(2,32-cidr)-2;
    return { type: "nat", prompt: `For a subnet with CIDR /${cidr}, how many usable host addresses (excluding network/broadcast)?`, correct: String(usable) };
  },

  /* ================================ HR ================================ */

  "hr/tell-me-about-yourself": poolGen({
    1: [ { type:"mcq", prompt:"Best structure for 'Tell me about yourself'?", options:["List your full life history","Present-Past-Future: current role, relevant background, why excited for this role","Talk only about hobbies","Recite your resume word for word"], correct:1 } ],
    2: [ { type:"mcq", prompt:"How long should this answer typically be?", options:["30 seconds","1-2 minutes","10 minutes","As long as possible"], correct:1 } ],
    3: [ { type:"mcq", prompt:"For a career-change scenario, what should you emphasize most?", options:["Why you disliked your last job","Transferable skills relevant to the new role","Salary expectations","Personal problems"], correct:1 } ],
  }),

  "hr/strengths-weaknesses": poolGen({
    1: [ { type:"mcq", prompt:"Best approach for discussing a weakness?", options:["Say you have no weaknesses","Mention a real weakness and your improvement steps","Mention a fake weakness with no plan","Criticize a former employer"], correct:1 } ],
    2: [ { type:"mcq", prompt:"Strongest way to describe a strength?", options:["'I'm a hard worker' with no evidence","A specific strength backed by a concrete example and result","Listing 10 strengths quickly","Comparing yourself to a coworker"], correct:1 } ],
    3: [ { type:"mcq", prompt:"For a senior role, weaknesses should show what?", options:["Lack of self-awareness","Self-awareness plus a proactive growth plan","No weaknesses at all","Blame on the team"], correct:1 } ],
  }),

  "hr/why-this-company": poolGen({
    1: [ { type:"mcq", prompt:"What makes a strong 'Why this company' answer?", options:["Generic praise","Specific research-based reasons linking your goals to the company's mission","Mentioning only salary","Saying you need any job"], correct:1 } ],
    2: [ { type:"mcq", prompt:"Which preparation step best supports this answer?", options:["Skip research and improvise","Research recent news, products, and values beforehand","Only read the job title","Ask a friend what to say"], correct:1 } ],
    3: [ { type:"mcq", prompt:"For a senior role, this answer should also reflect what?", options:["Only personal growth","Alignment between company strategy and the value you add","Complaints about competitors","Nothing about the company"], correct:1 } ],
  }),

  "hr/situational-questions": poolGen({
    1: [ { type:"mcq", prompt:"Recommended framework for situational/behavioral questions?", options:["STAR (Situation, Task, Action, Result)","ABC","SWOT","PEST"], correct:0 } ],
    2: [ { type:"mcq", prompt:"The 'Result' portion should emphasize what?", options:["Blame on others","Measurable outcome and what you learned","How stressful it was","Nothing, skip it"], correct:1 } ],
    3: [ { type:"mcq", prompt:"For a hypothetical future scenario question, best approach?", options:["Refuse to answer","Reason through it using relevant past experience as a guide","Say you'd ask your manager for everything","Give a one-word answer"], correct:1 } ],
  }),

  "hr/teamwork-examples": poolGen({
    1: [ { type:"mcq", prompt:"A strong teamwork example should highlight?", options:["Only your individual achievements","Your specific contribution and the team's outcome","Doing everything alone","Criticizing teammates"], correct:1 } ],
    2: [ { type:"mcq", prompt:"Best framing for a difficult team member story?", options:["Complain extensively","How you adapted your approach to reach a good outcome","Say you avoided them entirely","Blame management"], correct:1 } ],
    3: [ { type:"mcq", prompt:"What detail adds most credibility in a cross-functional example?", options:["Vague generalities","Specific roles, decisions, and measurable results","Only your title","Team size alone"], correct:1 } ],
  }),

  "hr/conflict-resolution": poolGen({
    1: [ { type:"mcq", prompt:"Best first step describing conflict resolution?", options:["Immediately escalate to HR","Understand the other person's perspective first","Ignore the conflict","Assign blame publicly"], correct:1 } ],
    2: [ { type:"mcq", prompt:"A strong conflict story should show what quality?", options:["Avoidance of all confrontation","Calm, constructive problem-solving toward mutual benefit","Winning at all costs","Involving as many people as possible"], correct:1 } ],
    3: [ { type:"mcq", prompt:"Best approach for conflict with a senior stakeholder?", options:["Refuse to engage","Address privately and respectfully with supporting evidence","Complain to peers","Escalate publicly in a meeting"], correct:1 } ],
  }),

  "hr/career-goals": poolGen({
    1: [ { type:"mcq", prompt:"Career goals should demonstrate what?", options:["Goals unrelated to the role","Alignment between your growth path and this role's opportunities","That you'll leave in 6 months","No plans at all"], correct:1 } ],
    2: [ { type:"mcq", prompt:"A good 5-year goal answer balances what?", options:["Only salary growth","Skill development, growing responsibility, realistic ambition","Wanting the interviewer's job","Vague uncertainty"], correct:1 } ],
    3: [ { type:"mcq", prompt:"For leadership-track candidates, goals should reflect?", options:["Individual contribution only","Growing impact through leading and developing others","Avoiding responsibility","Changing industries entirely"], correct:1 } ],
  }),

  "hr/leadership-scenarios": poolGen({
    1: [ { type:"mcq", prompt:"A strong leadership example should show?", options:["Taking all the credit","Enabling others toward a shared goal, with a measurable result","Micromanaging every detail","Avoiding decisions"], correct:1 } ],
    2: [ { type:"mcq", prompt:"When leading through a setback, what's most valued?", options:["Hiding it from stakeholders","Transparent communication and keeping the team motivated","Blaming a team member publicly","Giving up on the project"], correct:1 } ],
    3: [ { type:"mcq", prompt:"For senior leadership, what matters most beyond individual results?", options:["Personal recognition","Organizational impact and developing other leaders","Avoiding all risk","Working alone"], correct:1 } ],
  }),

  "hr/ethical-dilemmas": poolGen({
    1: [ { type:"mcq", prompt:"An ethical dilemma answer should center on?", options:["Personal gain","Doing the right thing with clear rationale","Avoiding the situation entirely","Following the crowd"], correct:1 } ],
    2: [ { type:"mcq", prompt:"If a manager asks for something unethical, best answer shows?", options:["Blind compliance","Respectful pushback and proper escalation","Public confrontation","Quitting immediately with no discussion"], correct:1 } ],
    3: [ { type:"mcq", prompt:"For a senior role, this answer should also demonstrate?", options:["Indifference to consequences","Awareness of broader stakeholder impact","Avoiding responsibility","Deferring entirely with no personal judgment"], correct:1 } ],
  }),

  "hr/case-based-hr-questions": poolGen({
    1: [ { type:"mcq", prompt:"Best structure for a case-style HR question (e.g. underperforming employee)?", options:["One-word answer","Diagnose cause, outline a supportive plan, define success metrics","Recommend immediate termination","Ignore the issue"], correct:1 } ],
    2: [ { type:"mcq", prompt:"In a team conflict case as manager, priority first?", options:["Punish someone","Understand both perspectives before deciding","Ignore to avoid awkwardness","Public reprimand"], correct:1 } ],
    3: [ { type:"mcq", prompt:"For a budget-cut case affecting your team, balance what?", options:["Only cost-cutting","Business needs with transparent, empathetic communication","Avoiding the decision","Blaming leadership"], correct:1 } ],
  }),

  "hr/salary-negotiation": poolGen({
    1: [ { type:"mcq", prompt:"Safe approach when asked salary expectations early?", options:["State an exact number with no research","Give a well-researched range based on market data","Refuse to answer","Ask for an unreasonably high number"], correct:1 } ],
    2: [ { type:"mcq", prompt:"What strengthens your negotiating position most?", options:["Ultimatums","Market data and clear articulation of your value","Personal financial needs alone","Comparing to a friend's salary"], correct:1 } ],
    3: [ { type:"mcq", prompt:"For full compensation negotiation, what's often overlooked but valuable?", options:["Nothing but base pay matters","Bonus structure, equity, benefits, growth opportunities","Only job title","Office location"], correct:1 } ],
  }),

  "hr/company-role-fit-questions": poolGen({
    1: [ { type:"mcq", prompt:"What best demonstrates 'culture fit'?", options:["Pretending to agree with everything","Genuine alignment between your values and the company's","Talking only about perks","Avoiding the topic"], correct:1 } ],
    2: [ { type:"mcq", prompt:"For 'why should we hire you over others,' strongest focus?", options:["Putting other candidates down","Specific, relevant value you uniquely bring","Saying you need the job most","Generic confidence with no evidence"], correct:1 } ],
    3: [ { type:"mcq", prompt:"For a role needing high autonomy, fit answer should emphasize?", options:["Needing constant direction","Comfort with ambiguity and self-directed problem solving","Preferring rigid structure","Avoiding independent decisions"], correct:1 } ],
  }),
};

function generateSet(genFn, level, count, seedKey) {
  const rng = mulberry32(hashStr(seedKey));
  const out = []; const seen = new Set(); let guard = 0;
  while (out.length < count && guard < count * 15) {
    guard++;
    const q = genFn(level, rng);
    if (!q || seen.has(q.prompt)) continue;
    seen.add(q.prompt);
    out.push(q);
  }
  return out;
}

const CAPACITY_CACHE = {};
function getCapacity(genKey, level) {
  const ck = `${genKey}-${level}`;
  if (CAPACITY_CACHE[ck] !== undefined) return CAPACITY_CACHE[ck];
  const n = generateSet(GEN[genKey], level, 100, `${ck}-capacity-probe`).length;
  CAPACITY_CACHE[ck] = n;
  return n;
}

function getTopics(sectionId) {
  const list = TOPIC_LISTS[sectionId] || [];
  return list.map(([name, defaultLevel]) => {
    const id = slug(name);
    const key = `${sectionId}/${id}`;
    const content = DEMO_CONTENT[key];
    const hasGen = !!GEN[key];
    const levels = hasGen
      ? { 1: getCapacity(key, 1), 2: getCapacity(key, 2), 3: getCapacity(key, 3) }
      : { 1: content?.[1]?.length || 0, 2: content?.[2]?.length || 0, 3: content?.[3]?.length || 0 };
    const loaded = levels[1] + levels[2] + levels[3];
    return { id, key, name, levels, loaded, planned: 300, generated: hasGen };
  });
}

/* ============================================================
   STORAGE HELPERS
   ============================================================ */

async function saveProgress(key, data) {
  try { await window.storage.set(`progress:${key}`, JSON.stringify(data)); } catch (e) { /* ignore */ }
}
async function loadProgress(key) {
  try {
    const r = await window.storage.get(`progress:${key}`);
    return r ? JSON.parse(r.value) : null;
  } catch (e) { return null; }
}
async function loadAllProgress() {
  try {
    const r = await window.storage.list("progress:");
    if (!r || !r.keys) return {};
    const out = {};
    for (const k of r.keys) {
      try {
        const v = await window.storage.get(k);
        if (v) out[k.replace("progress:", "")] = JSON.parse(v.value);
      } catch (e) { /* skip */ }
    }
    return out;
  } catch (e) { return {}; }
}

/* ============================================================
   UI PRIMITIVES
   ============================================================ */

function LevelChip({ level, count, active, disabled, onClick }) {
  const label = ["", "L1", "L2", "L3"][level];
  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      style={{
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 12,
        padding: "6px 10px",
        borderRadius: 6,
        border: `1px solid ${disabled ? C.border : C.brass}`,
        background: disabled ? "transparent" : active ? C.brass : "transparent",
        color: disabled ? C.ink500 : active ? C.bg : C.brass,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.45 : 1,
        transition: "all .15s",
        display: "flex",
        alignItems: "center",
        gap: 4,
        whiteSpace: "nowrap",
      }}
    >
      {disabled && <Lock size={10} />}
      {label} · {count}
    </button>
  );
}

function OMRRail({ total, current, states, onJump }) {
  // states: array of null | 'correct' | 'incorrect' | 'answered'
  return (
    <div style={{
      display: "flex", flexDirection: "column", gap: 6, alignItems: "center",
      maxHeight: "70vh", overflowY: "auto", padding: "4px 6px", scrollbarWidth: "thin",
    }}>
      {Array.from({ length: total }).map((_, i) => {
        const st = states[i];
        const isCurrent = i === current;
        let bg = "transparent", border = C.border, color = C.ink500;
        if (st === "correct") { bg = C.mint; border = C.mint; color = C.bg; }
        else if (st === "incorrect") { bg = C.coral; border = C.coral; color = C.bg; }
        else if (st === "answered") { bg = C.brass; border = C.brass; color = C.bg; }
        if (isCurrent && !st) { border = C.brass; color = C.brass; }
        return (
          <button key={i} onClick={() => onJump && onJump(i)} style={{
            width: 26, height: 26, borderRadius: "50%", border: `2px solid ${border}`,
            background: bg, color, display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, fontWeight: 600, cursor: "pointer",
            boxShadow: isCurrent ? `0 0 0 3px ${C.brass}33` : "none", flexShrink: 0,
          }}>
            {i + 1}
          </button>
        );
      })}
    </div>
  );
}

/* ============================================================
   QUIZ SCREEN
   ============================================================ */

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function QuizScreen({ section, topic, level, questions, onExit }) {
  const [order] = useState(() => shuffle(questions.map((_, i) => i)));
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState({}); // idx -> value
  const [natInput, setNatInput] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [startTime] = useState(Date.now());

  const q = questions[order[idx]];

  useEffect(() => { setNatInput(answers[idx] ?? ""); }, [idx]);

  const isCorrect = (i, val) => {
    const qq = questions[order[i]];
    if (val === undefined || val === null || val === "") return null;
    if (qq.type === "mcq") return val === qq.correct;
    return String(val).trim().toLowerCase() === String(qq.correct).trim().toLowerCase();
  };

  const states = questions.map((_, i) => {
    if (!(i in answers)) return null;
    if (!submitted) return "answered";
    return isCorrect(i, answers[i]) ? "correct" : "incorrect";
  });

  const selectMcq = (optIdx) => {
    setAnswers((a) => ({ ...a, [idx]: optIdx }));
  };
  const commitNat = (val) => {
    setAnswers((a) => ({ ...a, [idx]: val }));
  };

  const answeredCount = Object.keys(answers).length;

  const finish = async () => {
    setSubmitted(true);
    let correct = 0;
    questions.forEach((_, i) => { if (isCorrect(i, answers[i])) correct++; });
    const timeSec = Math.round((Date.now() - startTime) / 1000);
    const key = `${section.id}/${topic.id}/${level}`;
    const prev = await loadProgress(key);
    const record = {
      attempts: (prev?.attempts || 0) + 1,
      lastScore: correct,
      total: questions.length,
      bestScore: Math.max(prev?.bestScore || 0, correct),
      lastDate: new Date().toISOString(),
      timeSec,
    };
    await saveProgress(key, record);
  };

  if (submitted) {
    let correct = 0;
    questions.forEach((_, i) => { if (isCorrect(i, answers[i])) correct++; });
    const pct = Math.round((correct / questions.length) * 100);
    return (
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "32px 20px" }}>
        <div style={{
          background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 28,
          textAlign: "center", marginBottom: 24,
        }}>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: C.brass, letterSpacing: 1, marginBottom: 8 }}>
            RESULT — {topic.name.toUpperCase()} · LEVEL {level}
          </div>
          <div style={{ fontFamily: "'Fraunces', serif", fontSize: 56, fontWeight: 700, color: pct >= 60 ? C.mint : C.coral }}>
            {correct}/{questions.length}
          </div>
          <div style={{ color: C.ink300, fontFamily: "'Inter', sans-serif", marginTop: 4 }}>{pct}% correct</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
          {questions.map((qq, i) => {
            const val = answers[i];
            const ok = isCorrect(i, val);
            return (
              <div key={i} style={{
                background: C.card, border: `1px solid ${ok ? C.mint : val !== undefined ? C.coral : C.border}33`,
                borderLeft: `4px solid ${ok ? C.mint : val !== undefined ? C.coral : C.ink500}`,
                borderRadius: 8, padding: 14,
              }}>
                <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  {ok ? <Check size={16} color={C.mint} style={{ marginTop: 2, flexShrink: 0 }} /> : <X size={16} color={C.coral} style={{ marginTop: 2, flexShrink: 0 }} />}
                  <div style={{ flex: 1 }}>
                    <div style={{ color: C.paper, fontFamily: "'Inter', sans-serif", fontSize: 14, marginBottom: 6 }}>{i + 1}. {qq.prompt}</div>
                    <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: C.ink300 }}>
                      Your answer: {qq.type === "mcq" ? (val !== undefined ? qq.options[val] : "—") : (val || "—")}
                      {!ok && <span style={{ color: C.mint, marginLeft: 12 }}>Correct: {qq.type === "mcq" ? qq.options[qq.correct] : qq.correct}</span>}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <button onClick={onExit} style={btnGhost()}>
            <ArrowLeft size={14} /> Back to topics
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 920, margin: "0 auto", padding: "24px 20px", display: "flex", gap: 24 }}>
      <div style={{ paddingTop: 8 }}>
        <OMRRail total={questions.length} current={idx} states={states} onJump={(i) => setIdx(i)} />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Admit-card style header */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          border: `1px dashed ${C.brassDim}`, borderRadius: 8, padding: "10px 14px", marginBottom: 20,
          fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: C.ink300, flexWrap: "wrap", gap: 8,
        }}>
          <span>SECTION: <span style={{ color: C.brass }}>{section.name}</span></span>
          <span>TOPIC: <span style={{ color: C.brass }}>{topic.name}</span></span>
          <span>LEVEL: <span style={{ color: C.brass }}>{level}</span></span>
          <span>Q {idx + 1}/{questions.length}</span>
        </div>

        <div style={{
          background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24, minHeight: 220,
        }}>
          <div style={{ fontFamily: "'Fraunces', serif", fontSize: 20, color: C.paper, marginBottom: 20, lineHeight: 1.4 }}>
            {q.prompt}
          </div>

          {q.type === "mcq" ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {q.options.map((opt, oi) => {
                const selected = answers[idx] === oi;
                return (
                  <button key={oi} onClick={() => selectMcq(oi)} style={{
                    textAlign: "left", padding: "12px 16px", borderRadius: 8,
                    border: `1.5px solid ${selected ? C.brass : C.border}`,
                    background: selected ? `${C.brass}1A` : "transparent",
                    color: selected ? C.brass : C.paper,
                    fontFamily: "'Inter', sans-serif", fontSize: 14, cursor: "pointer",
                    display: "flex", alignItems: "center", gap: 10, transition: "all .12s",
                  }}>
                    <span style={{
                      width: 20, height: 20, borderRadius: "50%", border: `1.5px solid ${selected ? C.brass : C.ink500}`,
                      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                      fontFamily: "'IBM Plex Mono', monospace", fontSize: 10,
                    }}>
                      {String.fromCharCode(65 + oi)}
                    </span>
                    {opt}
                  </button>
                );
              })}
            </div>
          ) : (
            <div>
              <input
                value={natInput}
                onChange={(e) => { setNatInput(e.target.value); commitNat(e.target.value); }}
                placeholder="Type your answer"
                style={{
                  width: "100%", padding: "12px 16px", borderRadius: 8, border: `1.5px solid ${C.border}`,
                  background: C.raised, color: C.paper, fontFamily: "'IBM Plex Mono', monospace", fontSize: 15,
                  outline: "none",
                }}
                onFocus={(e) => e.target.style.borderColor = C.brass}
                onBlur={(e) => e.target.style.borderColor = C.border}
              />
              <div style={{ fontSize: 11, color: C.ink500, marginTop: 6, fontFamily: "'Inter', sans-serif" }}>
                Numeric Answer Type — enter exact value
              </div>
            </div>
          )}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 18 }}>
          <button onClick={() => setIdx((i) => Math.max(0, i - 1))} disabled={idx === 0} style={btnGhost(idx === 0)}>
            <ArrowLeft size={14} /> Prev
          </button>
          <div style={{ color: C.ink500, fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, alignSelf: "center" }}>
            {answeredCount}/{questions.length} answered
          </div>
          {idx < questions.length - 1 ? (
            <button onClick={() => setIdx((i) => Math.min(questions.length - 1, i + 1))} style={btnPrimary()}>
              Next <ChevronRight size={14} />
            </button>
          ) : (
            <button onClick={finish} style={btnPrimary()}>
              Submit <Check size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function btnPrimary() {
  return {
    display: "flex", alignItems: "center", gap: 6, padding: "10px 18px", borderRadius: 8,
    border: "none", background: C.brass, color: C.bg, fontFamily: "'Inter', sans-serif",
    fontWeight: 600, fontSize: 13, cursor: "pointer",
  };
}
function btnGhost(disabled) {
  return {
    display: "flex", alignItems: "center", gap: 6, padding: "10px 18px", borderRadius: 8,
    border: `1px solid ${C.border}`, background: "transparent", color: disabled ? C.ink500 : C.paper,
    fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: 13, cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.5 : 1,
  };
}

/* ============================================================
   TOPIC LIST (within a section)
   ============================================================ */

function TopicRow({ section, topic, progress, onStart }) {
  const [open, setOpen] = useState(false);
  const totalLoaded = topic.loaded;
  return (
    <div style={{ borderBottom: `1px solid ${C.border}` }}>
      <button onClick={() => setOpen((o) => !o)} style={{
        width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "14px 4px", background: "transparent", border: "none", cursor: "pointer", textAlign: "left",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <ChevronDown size={14} color={C.ink500} style={{ transform: open ? "rotate(0deg)" : "rotate(-90deg)", transition: "transform .15s" }} />
          <span style={{ fontFamily: "'Inter', sans-serif", color: C.paper, fontSize: 14 }}>{topic.name}</span>
        </div>
        <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: totalLoaded ? C.mint : C.ink500 }}>
          {totalLoaded}/{topic.planned}
        </span>
      </button>
      {open && (
        <div style={{ paddingLeft: 24, paddingBottom: 16, display: "flex", gap: 8, flexWrap: "wrap" }}>
          {[1, 2, 3].map((lvl) => {
            const count = topic.levels[lvl];
            const p = progress?.[`${section.id}/${topic.id}/${lvl}`];
            return (
              <div key={lvl} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <LevelChip level={lvl} count={count} disabled={count === 0} onClick={() => onStart(topic, lvl)} />
                {p && (
                  <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, color: C.ink500, textAlign: "center" }}>
                    best {p.bestScore}/{p.total}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function SectionView({ section, progress, onStart, onBack }) {
  const topics = useMemo(() => getTopics(section.id), [section.id]);
  const loadedTopics = topics.filter((t) => t.loaded > 0).length;

  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "24px 20px" }}>
      <button onClick={onBack} style={{ ...btnGhost(), marginBottom: 20 }}>
        <ArrowLeft size={14} /> All sections
      </button>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
        <section.icon size={22} color={C.brass} />
        <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 28, color: C.paper, margin: 0, fontWeight: 600 }}>{section.name}</h1>
      </div>
      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: C.ink300, marginBottom: 24 }}>
        {topics.length} topics · {loadedTopics} with content loaded · target 300 Qs/topic
      </div>
      <div>
        {topics.map((t) => (
          <TopicRow key={t.id} section={section} topic={t} progress={progress} onStart={onStart} />
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   HOME / DASHBOARD
   ============================================================ */

function Home({ progress, onOpenSection }) {
  const stats = useMemo(() => {
    const entries = Object.values(progress || {});
    const attempted = entries.length;
    const totalCorrect = entries.reduce((s, e) => s + (e.bestScore || 0), 0);
    const totalQs = entries.reduce((s, e) => s + (e.total || 0), 0);
    return { attempted, acc: totalQs ? Math.round((totalCorrect / totalQs) * 100) : 0 };
  }, [progress]);

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 20px 60px" }}>
      <div style={{ marginBottom: 36 }}>
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: C.brass, letterSpacing: 2, marginBottom: 10 }}>
          PLACEMENT & GOVT EXAM PREP REGISTER
        </div>
        <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 42, color: C.paper, margin: 0, fontWeight: 700, lineHeight: 1.1 }}>
          Every section.<br />Every topic. <span style={{ color: C.brass }}>Level 1 to 3.</span>
        </h1>
        <p style={{ fontFamily: "'Inter', sans-serif", color: C.ink300, fontSize: 15, marginTop: 14, maxWidth: 520 }}>
          10 sections, {Object.values(TOPIC_LISTS).reduce((s, l) => s + l.length, 0)} topics, built toward 300 questions each — MCQ and Numeric Answer Type mixed, scored and tracked like a real exam.
        </p>
      </div>

      <div style={{ display: "flex", gap: 16, marginBottom: 36, flexWrap: "wrap" }}>
        <StatCard icon={Award} label="Level sets attempted" value={stats.attempted} />
        <StatCard icon={Sparkles} label="Best-run accuracy" value={`${stats.acc}%`} />
        <StatCard icon={Clock} label="Sections live" value={SECTION_META.length} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14 }}>
        {SECTION_META.map((s) => {
          const topics = getTopics(s.id);
          const loaded = topics.filter((t) => t.loaded > 0).length;
          return (
            <button key={s.id} onClick={() => onOpenSection(s)} style={{
              textAlign: "left", background: C.card, border: `1px solid ${C.border}`, borderRadius: 12,
              padding: 18, cursor: "pointer", display: "flex", flexDirection: "column", gap: 10,
              transition: "border-color .15s",
            }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = C.brassDim}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = C.border}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <s.icon size={20} color={C.brass} />
                <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: C.ink500 }}>
                  {topics.length} topics
                </span>
              </div>
              <div>
                <div style={{ fontFamily: "'Fraunces', serif", fontSize: 17, color: C.paper, fontWeight: 600 }}>{s.name}</div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: C.ink300, marginTop: 2 }}>{s.blurb}</div>
              </div>
              <div style={{
                fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: loaded ? C.mint : C.ink500,
                display: "flex", alignItems: "center", gap: 4, marginTop: 4,
              }}>
                <Circle size={6} fill="currentColor" /> {loaded}/{topics.length} topics with live questions
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value }) {
  return (
    <div style={{
      background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 18px",
      display: "flex", alignItems: "center", gap: 12, minWidth: 160,
    }}>
      <Icon size={18} color={C.brass} />
      <div>
        <div style={{ fontFamily: "'Fraunces', serif", fontSize: 20, color: C.paper, fontWeight: 700, lineHeight: 1 }}>{value}</div>
        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: C.ink300, marginTop: 2 }}>{label}</div>
      </div>
    </div>
  );
}

/* ============================================================
   ROOT APP
   ============================================================ */

export default function App() {
  const [view, setView] = useState({ screen: "home" });
  const [progress, setProgress] = useState({});

  useEffect(() => {
    loadAllProgress().then(setProgress);
  }, []);

  const refreshProgress = useCallback(() => { loadAllProgress().then(setProgress); }, []);

  const openSection = (section) => setView({ screen: "section", section });
  const startQuiz = (topic, level) => {
    const key = `${view.section.id}/${topic.id}`;
    let questions;
    if (GEN[key]) {
      // Fresh random seed per attempt so repeat practice isn't the same 100 questions
      questions = generateSet(GEN[key], level, 100, `${key}-${level}-${Date.now()}-${Math.random()}`);
    } else {
      const content = DEMO_CONTENT[key];
      questions = content?.[level] || [];
    }
    if (!questions.length) return;
    setView({ screen: "quiz", section: view.section, topic, level, questions });
  };
  const exitQuiz = () => {
    refreshProgress();
    setView({ screen: "section", section: view.section });
  };

  return (
    <div style={{ minHeight: "100vh", background: C.bg }}>
      <style>{`
        @import url('${FONTS_LINK}');
        * { box-sizing: border-box; }
        body { margin: 0; }
        button:focus-visible, input:focus-visible { outline: 2px solid ${C.brass}; outline-offset: 2px; }
        @media (prefers-reduced-motion: reduce) { * { transition: none !important; } }
      `}</style>

      {view.screen === "home" && <Home progress={progress} onOpenSection={openSection} />}
      {view.screen === "section" && (
        <SectionView section={view.section} progress={progress} onStart={startQuiz} onBack={() => setView({ screen: "home" })} />
      )}
      {view.screen === "quiz" && (
        <QuizScreen section={view.section} topic={view.topic} level={view.level} questions={view.questions} onExit={exitQuiz} />
      )}
    </div>
  );
}
