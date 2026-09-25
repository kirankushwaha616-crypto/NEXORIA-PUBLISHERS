import { BookPart, SampleProject } from '../types.ts';

export const BOOK_PARTS: BookPart[] = [
  {
    number: 1,
    title: 'Super Easy Projects',
    range: 'Projects 1 – 20',
    description: 'Quick projects to start with. Each one is short, runnable in your browser, and teaches a single new idea.',
    projectCount: 20,
    color: 'emerald',
    badge: 'Beginner Foundations',
    projects: [
      { id: 1, title: 'Hello Name Greeter', difficulty: '⭐', summary: 'Personalized greeting with instant live update as you type' },
      { id: 2, title: 'Age in Days Calculator', difficulty: '⭐', summary: 'Date math calculating days lived and days until next birthday' },
      { id: 3, title: 'Days Until Summer', difficulty: '⭐', summary: 'Live solstice countdown updating every minute with encouraging messages' },
      { id: 4, title: 'Random Compliment Generator', difficulty: '⭐', summary: 'Curated positive phrases with smooth CSS fade animation' },
      { id: 5, title: 'Colour of the Day', difficulty: '⭐', summary: 'Auto-detects the day of the week and paints the screen with its color swatch' },
      { id: 6, title: 'Even or Odd Checker', difficulty: '⭐', summary: 'Modulo operator test with real-time educational explanation' },
      { id: 7, title: 'Temperature Mood Translator', difficulty: '⭐', summary: 'Celsius ranges mapped to cozy and fun weather mood messages' },
      { id: 8, title: 'Reverse a Word', difficulty: '⭐', summary: 'Reverses text character by character with palindrome detection' },
      { id: 9, title: 'Simple Counter with Limits', difficulty: '⭐', summary: 'State management with boundary constraints and button disable states' },
      { id: 10, title: 'Tip Calculator', difficulty: '⭐', summary: 'Bill calculation with percentage slider and per-person split math' },
      { id: 11, title: 'Dice Roller Simulator', difficulty: '⭐', summary: 'Rolls 1-10 dice using custom SVG pip layouts and sums total' },
      { id: 12, title: 'BMI Calculator', difficulty: '⭐', summary: 'Calculates BMI with color-coded scale bar and health category guidance' },
      { id: 13, title: 'Coin Toss Counter', difficulty: '⭐', summary: 'Flips coins with live tally, ratio visualization bar, and auto-flip mode' },
      { id: 14, title: 'Word Length Sorter', difficulty: '⭐', summary: 'Splits sentences and sorts words by length with character count' },
      { id: 15, title: 'Magic 8-Ball', difficulty: '⭐', summary: 'Tap to trigger CSS shake keyframes and reveal 20 classic fortune answers' },
      { id: 16, title: 'Number Pyramid Printer', difficulty: '⭐', summary: 'Generates centered symmetric numeric pyramids with configurable height' },
      { id: 17, title: 'Basic Calculator', difficulty: '⭐', summary: 'Four-function calculator grid with operator parsing and live expression' },
      { id: 18, title: 'Time Zone Buddy', difficulty: '⭐', summary: 'World clock comparing 10 major global cities with business hours badge' },
      { id: 19, title: 'Word Counter Tool', difficulty: '⭐', summary: 'Real-time text stats: words, characters, sentences, and reading time' },
      { id: 20, title: 'Digital Greeting Card', difficulty: '⭐', summary: 'Custom name card with animated falling confetti effect on tap' }
    ]
  },
  {
    number: 2,
    title: 'Web Projects',
    range: 'Projects 21 – 40',
    description: 'Real interactive websites. Each project adds a new layer — DOM manipulation, responsive layouts, components, and persistence.',
    projectCount: 20,
    color: 'blue',
    badge: 'Responsive DOM & UI',
    projects: [
      { id: 21, title: 'Personal Landing Page', difficulty: '⭐⭐', summary: 'Semantic HTML5 structure with responsive cards and mobile-first CSS grid' },
      { id: 22, title: 'Notes Saver', difficulty: '⭐⭐', summary: 'Complete CRUD notes app with live search and JSON localStorage persistence' },
      { id: 23, title: 'Responsive Photo Grid', difficulty: '⭐⭐', summary: 'Auto-fitting CSS grid with full-screen keyboard-navigable lightbox' },
      { id: 24, title: 'Markdown Previewer', difficulty: '⭐⭐', summary: 'Two-pane split editor with real-time regex-based markdown-to-HTML parser' },
      { id: 25, title: 'Real-time Clock Display', difficulty: '⭐⭐', summary: 'Day progress visualizer with smooth background color transitions' },
      { id: 26, title: 'Sticky Notes Board', difficulty: '⭐⭐', summary: 'Click anywhere to drop draggable sticky notes with persistent coordinates' },
      { id: 27, title: 'Animated CSS Buttons', difficulty: '⭐⭐', summary: 'Playground of 7 modern button animations: glow, pulse, neon, 3D press' },
      { id: 28, title: 'Form Validator', difficulty: '⭐⭐', summary: 'Client-side validation with password strength meter and inline feedback' },
      { id: 29, title: 'Drag-and-Drop Kanban', difficulty: '⭐⭐', summary: 'Three-column board (To Do, Doing, Done) using native HTML5 drag API' },
      { id: 30, title: 'Mini Online Storefront', difficulty: '⭐⭐', summary: 'Product catalog with cart state and hash-based client routing' },
      { id: 31, title: 'Weather UI with Mock Data', difficulty: '⭐⭐', summary: 'Forecast cards, hourly bar, and current temperature layout' },
      { id: 32, title: 'Tabbed Interface', difficulty: '⭐⭐', summary: 'Accessible ARIA tabs with URL hash sync and arrow-key cycling' },
      { id: 33, title: 'Image Filter Playground', difficulty: '⭐⭐', summary: 'CSS filter sliders for brightness, blur, sepia, and hue rotation' },
      { id: 34, title: 'Accordion FAQ', difficulty: '⭐⭐', summary: 'Accessible details/summary accordion with keyboard focus and smooth transitions' },
      { id: 35, title: 'Searchable Movie List', difficulty: '⭐⭐', summary: 'Filterable, sortable, and paginated catalog with live search' },
      { id: 36, title: 'Toast Notification System', difficulty: '⭐⭐', summary: 'Auto-dismissing popups with four states and stacked queue management' },
      { id: 37, title: 'Analog Clock', difficulty: '⭐⭐', summary: 'Circular wall clock face with smoothly rotating SVG hands and tick marks' },
      { id: 38, title: 'Personal Blog Template', difficulty: '⭐⭐', summary: 'Article listing and reader views with reading-time calculations' },
      { id: 39, title: 'Recipe Card Component', difficulty: '⭐⭐', summary: 'Ingredient checklist with interactive serving-size scaling' },
      { id: 40, title: 'Resume Builder', difficulty: '⭐⭐', summary: 'Live-rendered resume generator with print CSS and HTML export' }
    ]
  },
  {
    number: 3,
    title: 'Games & Interactive Projects',
    range: 'Projects 41 – 60',
    description: 'Games teach timing, state, animations, and user feedback — the parts of code that feel alive.',
    projectCount: 20,
    color: 'amber',
    badge: 'Game Loops & State',
    projects: [
      { id: 41, title: 'Number Guessing Game', difficulty: '⭐', summary: 'Higher/lower feedback engine with multiple difficulty levels and scores' },
      { id: 42, title: 'Rock Paper Scissors', difficulty: '⭐', summary: 'Animated hand duel with streak counter and symmetrical win logic' },
      { id: 43, title: 'Tic Tac Toe', difficulty: '⭐⭐', summary: 'Two-player 3x3 grid with win-line detection and board state evaluation' },
      { id: 44, title: 'Memory Match Game', difficulty: '⭐⭐', summary: '12-card card-matching game with Fisher-Yates shuffle and move timer' },
      { id: 45, title: 'Snake Game', difficulty: '⭐⭐⭐', summary: 'Canvas snake moving on a grid, eating fruit and avoiding self-collision' },
      { id: 46, title: 'Breakout / Brick Breaker', difficulty: '⭐⭐⭐', summary: 'Bouncing ball physics with paddle controls and brick collision matrices' },
      { id: 47, title: 'Typing Speed Tester', difficulty: '⭐⭐', summary: 'WPM, accuracy, and error tracking with per-character green/red highlighting' },
      { id: 48, title: 'Reaction Time Tester', difficulty: '⭐⭐', summary: 'Three-color state machine measuring sub-millisecond reaction times' },
      { id: 49, title: 'Whack-a-Mole', difficulty: '⭐⭐⭐', summary: 'Random mole popups on a 3x3 grid with accelerating speed intervals' },
      { id: 50, title: 'Pomodoro Timer', difficulty: '⭐⭐', summary: '25/5 focus cycles with WebAudio alert chime and daily tally log' },
      { id: 51, title: 'Hangman', difficulty: '⭐⭐', summary: '50-word dictionary with dynamic SVG stick-figure progression' },
      { id: 52, title: 'Maze Generator and Solver', difficulty: '⭐⭐⭐', summary: 'Recursive backtracking generator with animated BFS pathfinder' },
      { id: 53, title: 'Quiz Game', difficulty: '⭐⭐', summary: 'Multiple-choice timed quiz with randomized question pools and final review' },
      { id: 54, title: 'Tower of Hanoi Visualiser', difficulty: '⭐⭐⭐', summary: 'Animates the classic recursive algorithm sliding disks across pegs' },
      { id: 55, title: 'Drawing Pad', difficulty: '⭐⭐', summary: 'HTML5 canvas sketching app with brush sizing, eraser, undo, and PNG export' },
      { id: 56, title: 'Space Shooter', difficulty: '⭐⭐⭐', summary: 'Pilot a ship, shoot falling asteroids, and track score across lives' },
      { id: 57, title: 'Bouncing DVD Logo', difficulty: '⭐', summary: 'Diagonal velocity physics simulation with corner hit detection' },
      { id: 58, title: 'Connect Four AI', difficulty: '⭐⭐⭐', summary: '7x6 gravity board with lookahead AI that blocks opponent wins' },
      { id: 59, title: 'Simon Says Colour Memory', difficulty: '⭐⭐', summary: 'Sequential pattern memory game with WebAudio synthesized tone cues' },
      { id: 60, title: 'Stop The Clock Race', difficulty: '⭐⭐', summary: 'Target timing game with average millisecond deviation scoring' }
    ]
  },
  {
    number: 4,
    title: 'Productivity & Useful Tools',
    range: 'Projects 61 – 80',
    description: 'Build tools you will actually use. Habits, timers, planners, and study helpers written from scratch.',
    projectCount: 20,
    color: 'teal',
    badge: 'Utility & Tooling',
    projects: [
      { id: 61, title: 'Habit Tracker', difficulty: '⭐⭐', summary: 'Weekly habit grid with running streaks and completion status' },
      { id: 62, title: 'Expense Tracker', difficulty: '⭐⭐', summary: 'Log expenses by category with a dynamic canvas pie chart breakdown' },
      { id: 63, title: 'Flashcard Study App', difficulty: '⭐⭐', summary: '3D card flip animation with multi-deck support and known/unknown sorting' },
      { id: 64, title: 'Markdown Editor', difficulty: '⭐⭐', summary: 'Multi-tab document editor with live HTML preview and .md export' },
      { id: 65, title: 'QR Code Generator UI', difficulty: '⭐⭐', summary: 'Converts URLs and text into downloadable SVG QR code matrices' },
      { id: 66, title: 'Text Analyzer', difficulty: '⭐⭐', summary: 'Word frequencies, readability score, vowel counts, and longest words' },
      { id: 67, title: 'Daily Planner', difficulty: '⭐⭐', summary: '6 AM to 11 PM vertical timeline with clickable task block schedule' },
      { id: 68, title: 'Pomodoro Habit Combo', difficulty: '⭐⭐⭐', summary: 'Connects completed focus intervals directly to tracked habit goals' },
      { id: 69, title: 'Stock Portfolio Tracker (Mock)', difficulty: '⭐⭐⭐', summary: 'Simulated market fluctuations with profit/loss metrics and live tickers' },
      { id: 70, title: 'Personal CRM', difficulty: '⭐⭐', summary: 'Tracks relationship touchpoints with automatic follow-up reminders' },
      { id: 71, title: 'Unit Converter', difficulty: '⭐', summary: 'Multi-category converter for length, weight, volume, and temperature' },
      { id: 72, title: 'Random Quote Generator with Originals', difficulty: '⭐', summary: 'Curated reflective quotes with clipboard copy and favorites shelf' },
      { id: 73, title: 'Password Strength Tester', difficulty: '⭐⭐', summary: 'Client-side entropy calculator with specific character breakdown' },
      { id: 74, title: 'Workout Timer', difficulty: '⭐⭐', summary: 'HIIT interval timer with work/rest cycles and WebAudio voice beeps' },
      { id: 75, title: 'Book Reading Tracker', difficulty: '⭐⭐', summary: 'Reading list manager with slider progress and annual page count' },
      { id: 76, title: 'Daily Affirmation Spinner', difficulty: '⭐', summary: 'Rotational wheel with cubic-bezier deceleration physics' },
      { id: 77, title: 'Movie Watch List', difficulty: '⭐⭐', summary: 'Filterable watchlist with custom star ratings and review notes' },
      { id: 78, title: 'Invoice Generator', difficulty: '⭐⭐', summary: 'Line-item invoice creator with auto tax, discounts, and print CSS' },
      { id: 79, title: 'Markdown Notes Wiki', difficulty: '⭐⭐⭐', summary: 'Personal wiki with [[WikiLinks]] and automatic backlinks index' },
      { id: 80, title: 'Reading Speed Adjuster', difficulty: '⭐⭐', summary: 'Rapid Serial Visual Presentation trainer from 120 to 1000 WPM' }
    ]
  },
  {
    number: 5,
    title: 'Advanced Beginner Projects',
    range: 'Projects 81 – 100',
    description: 'Combine everything you have learned — mathematical models, synthesis, simulation, and a capstone portfolio site.',
    projectCount: 20,
    color: 'violet',
    badge: 'Algorithms & Capstone',
    projects: [
      { id: 81, title: 'Interactive Solar System', difficulty: '⭐⭐⭐', summary: 'Realistic relative orbital physics with clickable planet fact cards' },
      { id: 82, title: 'Colour Palette Generator', difficulty: '⭐⭐', summary: 'HSL color wheel math for complementary, triadic, and analogous harmonies' },
      { id: 83, title: 'Procedural Terrain Generator', difficulty: '⭐⭐⭐', summary: 'Value noise simulation with multi-pass smoothing and biome coloring' },
      { id: 84, title: 'Particle Explosion Simulator', difficulty: '⭐⭐⭐', summary: 'Newtonian gravity particles with opacity trails and velocity vectors' },
      { id: 85, title: 'Drum Machine / Step Sequencer', difficulty: '⭐⭐⭐', summary: '16-step grid synthesizing kicks, snares, hats via WebAudio API' },
      { id: 86, title: 'Projectile Motion Simulator', difficulty: '⭐⭐⭐', summary: 'Parabolic trajectory calculator with angle, initial speed, and gravity controls' },
      { id: 87, title: 'Chord Progression Player', difficulty: '⭐⭐⭐', summary: 'Roman numeral music theory chord engine with virtual keyboard visualizer' },
      { id: 88, title: 'ASCII Art Image Converter', difficulty: '⭐⭐', summary: 'Luminance downsampling canvas that renders images into text art' },
      { id: 89, title: 'Cipher Encoder & Decoder', difficulty: '⭐⭐', summary: 'Interactive Caesar shift, Vigenère keyword, and Atbash encryption tools' },
      { id: 90, title: 'Random Story Generator', difficulty: '⭐⭐', summary: 'Combinatorial mad-lib narrative generator with saved story favorites' },
      { id: 91, title: 'Meme Generator', difficulty: '⭐⭐', summary: 'Canvas text-stroke renderer with auto line-wrapping and PNG export' },
      { id: 92, title: 'Data Dashboard', difficulty: '⭐⭐⭐', summary: 'Canvas bar, line, and pie charts with aggregate metric cards' },
      { id: 93, title: 'Snakes & Ladders Game', difficulty: '⭐⭐', summary: 'Classic 100-cell board game with dice rolls and ladder/snake animations' },
      { id: 94, title: 'Mini Search Engine', difficulty: '⭐⭐⭐', summary: 'In-memory TF-IDF indexer with tokenization and query ranking' },
      { id: 95, title: 'Recipe Randomizer', difficulty: '⭐⭐', summary: 'Generates 10,000+ dinner combinations from balanced ingredient pools' },
      { id: 96, title: 'Decision Spinner (Weighted)', difficulty: '⭐⭐', summary: 'Weighted probability roulette wheel with cumulative distribution math' },
      { id: 97, title: 'Mini Synthesizer', difficulty: '⭐⭐⭐', summary: '13-key keyboard instrument with 4 oscillators and recording track' },
      { id: 98, title: 'Sudoku Solver', difficulty: '⭐⭐⭐', summary: 'Backtracking search algorithm with constraint propagation and step count' },
      { id: 99, title: 'Tiny Generative Art Wallpaper', difficulty: '⭐⭐⭐', summary: 'Pseudorandom seeded art generator creating downloadable vector wallpapers' },
      { id: 100, title: 'Capstone: Personal Portfolio Site', difficulty: '⭐⭐⭐', summary: 'Master synthesis project combining layouts, projects catalog, and contact form' }
    ]
  }
];

export const SAMPLE_PROJECTS: SampleProject[] = [
  {
    id: 1,
    title: 'Hello Name Greeter',
    part: 'Part 1 — Super Easy Projects',
    difficulty: '⭐',
    whatYouWillBuild: 'Build a tiny webpage that asks for a name and greets the visitor with a personalized message in real time.',
    skills: ['HTML form', 'JavaScript basics', 'DOM selection', 'Event Listeners'],
    features: ['Text input field', 'Greet button', 'Live preview as you type'],
    aiPrompt: `You are a patient coding tutor. Create a single-file HTML page called 'Hello Name Greeter'. Requirements: a text input where the user types their name, a button labelled 'Greet me', and a paragraph below that shows 'Hello, <name>!' when clicked. Also update the greeting live as the user types. Use only vanilla HTML, CSS and JavaScript inside one file. Add beginner-friendly comments explaining each line.`,
    fileStructure: 'single file: greeter.html',
    howItWorks: `The browser reads the HTML for structure, the CSS for styling, and the JavaScript inside the <script> tag for behaviour. addEventListener('input', ...) fires every time the input value changes, then we update the paragraph's text using template strings with backticks.`,
    customizationIdeas: [
      'Add a colour picker that tints the greeting',
      'Greet in multiple languages using a dropdown',
      "Add a 'clear' button"
    ],
    upgradeChallenge: 'Keep a counter showing how many times the user has been greeted this session.',
    code: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Hello Name Greeter</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 480px; margin: 40px auto; padding: 20px; }
    h1 { color: #2563eb; }
    input { padding: 10px; font-size: 16px; width: 100%; box-sizing: border-box; }
    p.greeting { margin-top: 20px; font-size: 20px; color: #0f172a; }
  </style>
</head>
<body>
  <h1>Hello Name Greeter</h1>
  <p>Type your name below:</p>
  <input id="nameInput" placeholder="e.g. Aisha">
  <p class="greeting" id="output">Hello, friend!</p>

  <script>
    // Grab references to the input and the output paragraph
    const input = document.getElementById("nameInput");
    const output = document.getElementById("output");

    // Update greeting live whenever the user types
    input.addEventListener("input", () => {
      const name = input.value.trim();
      output.textContent = name ? \`Hello, \${name}!\` : "Hello, friend!";
    });
  </script>
</body>
</html>`
  },
  {
    id: 10,
    title: 'Tip Calculator',
    part: 'Part 1 — Super Easy Projects',
    difficulty: '⭐',
    whatYouWillBuild: 'Calculate tip and total bill from a bill amount and a percentage with per-person split.',
    skills: ['Arithmetic', 'Input handling', 'Number formatting', 'DOM updates'],
    features: ['Bill amount input', 'Tip percentage input slider', 'Per-person split', 'Currency formatting'],
    aiPrompt: `Build a single-file 'Tip Calculator'. Inputs: bill amount (positive number), tip percentage (slider 0-50%), number of people (number input, default 1). Outputs: tip amount, total bill, and per-person amount. Use .toFixed(2) for currency. Validate that bill and people are > 0. Vanilla JS.`,
    fileStructure: 'single file: tip.html',
    howItWorks: `Tip = bill × percentage / 100. Total = bill + tip. Per-person = total / people. toFixed(2) keeps two decimal places, perfect for currency display.`,
    customizationIdeas: [
      'Add quick buttons (10%, 15%, 18%, 20%)',
      'Round up option for per-person',
      'Remember the last tip % chosen'
    ],
    upgradeChallenge: 'Add a split quality check that warns if anyone has to pay more than 60% of the bill.',
    code: `<!DOCTYPE html>
<html>
<head>
  <title>Tip Calculator</title>
  <style>
    body { font-family: system-ui; max-width: 420px; margin: 40px auto; padding: 20px; background: #f8fafc; }
    .row { display: flex; justify-content: space-between; margin: 8px 0; }
    label { font-weight: 600; }
    input[type=number] { padding: 6px; width: 100px; }
    input[type=range] { width: 100%; }
    .box { margin-top: 20px; padding: 14px; background: white; border-radius: 10px; }
    .total { font-size: 22px; font-weight: 700; color: #0f766e; }
  </style>
</head>
<body>
  <h1>Tip Calculator</h1>
  <div class="row"><label>Bill ₹</label><input id="bill" type="number" value="1000"></div>
  <div class="row"><label>Tip %</label><span id="pctLbl">15%</span></div>
  <input id="pct" type="range" min="0" max="50" value="15">
  <div class="row"><label>People</label><input id="people" type="number" value="2" min="1"></div>
  <div class="box">
    <div class="row"><span>Tip</span><span id="tip">₹150.00</span></div>
    <div class="row"><span>Total</span><span id="total">₹1150.00</span></div>
    <hr>
    <div class="row total"><span>Per person</span><span id="per">₹575.00</span></div>
  </div>
  <script>
    const bill = document.getElementById("bill");
    const pct = document.getElementById("pct");
    const pctLbl = document.getElementById("pctLbl");
    const people = document.getElementById("people");
    function fmt(n) { return "₹" + n.toFixed(2); }
    function update() {
      pctLbl.textContent = pct.value + "%";
      const b = parseFloat(bill.value) || 0;
      const p = people.value <= 0 ? 1 : parseInt(people.value);
      const tip = b * (pct.value / 100);
      const total = b + tip;
      document.getElementById("tip").textContent = fmt(tip);
      document.getElementById("total").textContent = fmt(total);
      document.getElementById("per").textContent = fmt(total / p);
    }
    [bill, pct, people].forEach(el => el.addEventListener("input", update));
    update();
  </script>
</body>
</html>`
  },
  {
    id: 42,
    title: 'Rock Paper Scissors',
    part: 'Part 3 — Games & Interactive Projects',
    difficulty: '⭐',
    whatYouWillBuild: 'Click rock, paper or scissors. The computer picks its move and the page declares the winner with animated feedback.',
    skills: ['Random selection', 'Win/lose logic', 'Score tracking', 'localStorage'],
    features: ['Three animated hand icons', 'Score tracker', 'Streak counter', 'Reset stats'],
    aiPrompt: `Build 'Rock Paper Scissors'. Three buttons for player moves. Computer picks randomly. Show both choices with emoji animations, the result, and update the score. Streak counter shows consecutive wins. Pure JS.`,
    fileStructure: 'single file: rps.html',
    howItWorks: `We encode who beats whom in a single dictionary: beats.rock = 'scissors' means rock beats scissors. With that one map we can derive both win and loss logic symmetrically.`,
    customizationIdeas: [
      "Add 'lizard' and 'spock' (5-move RPS)",
      'Show a 10-round history',
      'Best-of-N tournament mode'
    ],
    upgradeChallenge: "Build a small AI opponent that learns the player's most-used move (uses a frequency table).",
    code: `<!DOCTYPE html>
<html>
<head>
  <title>Rock Paper Scissors</title>
  <style>
    body { font-family: system-ui; max-width: 480px; margin: 40px auto; text-align: center; }
    h1 { color: #4338ca; }
    .moves button { font-size: 36px; padding: 12px 18px; margin: 6px; cursor: pointer; border-radius: 10px; border: 0; background: white; box-shadow: 0 2px 6px rgba(0,0,0,.1); }
    .res { font-size: 22px; font-weight: 700; margin: 16px 0; }
    .win { color: #16a34a; } .lose { color: #dc2626; }
  </style>
</head>
<body>
  <h1>✊ ✋ ✌ Rock · Paper · Scissors</h1>
  <div class="moves">
    <button onclick="play('rock')">✊</button>
    <button onclick="play('paper')">✋</button>
    <button onclick="play('scissors')">✌</button>
  </div>
  <div id="vs" style="font-size: 32px; margin: 16px 0;">— ? —</div>
  <div class="res" id="res">Pick your move!</div>
  <p id="score">Wins: 0 · Losses: 0 · Draws: 0</p>
  <script>
    const beats = { rock: "scissors", paper: "rock", scissors: "paper" };
    const emoji = { rock: "✊", paper: "✋", scissors: "✌" };
    let stats = { w: 0, l: 0, d: 0 };
    function play(p) {
      const c = ["rock","paper","scissors"][Math.floor(Math.random()*3)];
      document.getElementById("vs").textContent = \`\${emoji[p]} vs \${emoji[c]}\`;
      const r = document.getElementById("res");
      if (p === c) { r.textContent = "Draw!"; r.className = "res"; stats.d++; }
      else if (beats[p] === c) { r.textContent = "You win!"; r.className = "res win"; stats.w++; }
      else { r.textContent = "You lose!"; r.className = "res lose"; stats.l++; }
      document.getElementById("score").textContent = \`Wins: \${stats.w} · Losses: \${stats.l} · Draws: \${stats.d}\`;
    }
  </script>
</body>
</html>`
  },
  {
    id: 45,
    title: 'Snake Game',
    part: 'Part 3 — Games & Interactive Projects',
    difficulty: '⭐⭐⭐',
    whatYouWillBuild: 'The classic Snake: a growing snake moves around the board and eats fruit. Don’t hit the walls or yourself.',
    skills: ['Game loop', 'Direction queue', 'Collision detection', 'HTML5 Canvas'],
    features: ['Arrow-key controlled snake', 'Score and high score', 'Self-collision and wall-collision', 'Instant Restart'],
    aiPrompt: `Build 'Snake'. The snake moves on a fixed grid, eats food to grow, and the game ends if it hits a wall or itself. Arrow keys change direction (no instant 180° turns). Spacebar to pause. Local high score. Canvas or grid divs — your choice. Vanilla JS.`,
    fileStructure: 'single file: snake.html',
    howItWorks: `The snake is a list of grid cells. Each tick we move the head in 'dir' and either grow (if we hit food) or drop the tail. The line '!(m.x === -dir.x && m.y === -dir.y)' guarantees the snake never U-turns into itself on the very next move.`,
    customizationIdeas: [
      'Add a wrap-around mode (no walls)',
      'Add a timer / speed-up mode',
      'Add bonus fruits that award extra score'
    ],
    upgradeChallenge: 'Make a two-player snake on one board that shares the playfield without colliding intentionally.',
    code: `<!DOCTYPE html>
<html>
<head>
  <title>Snake</title>
  <style>
    body { font-family: system-ui; display: flex; flex-direction: column; align-items: center; background: #0f172a; color: white; margin: 0; min-height: 100vh; }
    canvas { background: #1e293b; border: 2px solid #22d3ee; border-radius: 6px; margin: 20px; }
  </style>
</head>
<body>
  <h1 style="color:#22d3ee">Snake</h1>
  <p>Score: <span id="sc">0</span> · High: <span id="hi">0</span></p>
  <canvas id="cv" width="400" height="400"></canvas>
  <p>Arrow keys to move · Space to pause</p>
  <script>
    // Complete 20x20 grid game loop using requestAnimationFrame / setInterval
    // Detailed runnable implementation included in full book
  </script>
</body>
</html>`
  },
  {
    id: 61,
    title: 'Habit Tracker',
    part: 'Part 4 — Productivity & Useful Tools',
    difficulty: '⭐⭐',
    whatYouWillBuild: 'Mark today and the past 6 days for any habit. Build streaks and view visual consistency.',
    skills: ['Date arithmetic', 'localStorage arrays', 'State persistence'],
    features: ['6-day visual history', 'Streak counter', 'Add and remove habits', 'Personal best streak record'],
    aiPrompt: `Build a 'Habit Tracker'. The user can add habits (e.g. Read, Run, Meditate). For each habit, show today's status with a toggle and the past 6 days as small squares. Track current streak and best streak per habit. Pure JS, single file.`,
    fileStructure: 'single file: habits.html',
    howItWorks: `We store each habit's history as a dictionary keyed by ISO date strings. Date.toISOString().slice(0,10) gives us 'YYYY-MM-DD' which sorts lexicographically and round-trips through JSON cleanly.`,
    customizationIdeas: [
      'Add weekly/monthly views',
      'Add reminders via Notifications API',
      'Add import/export buttons'
    ],
    upgradeChallenge: "Add a monthly streak heatmap inspired by GitHub's contribution graph.",
    code: `<!DOCTYPE html>
<html>
<head>
  <title>Habit Tracker</title>
  <style>
    body { font-family: system-ui; max-width: 760px; margin: 30px auto; padding: 20px; }
    .row { background: white; padding: 12px; border-radius: 8px; margin-bottom: 8px; display: flex; align-items: center; gap: 12px; }
    .day { width: 26px; height: 26px; border-radius: 4px; background: #e2e8f0; display: flex; align-items: center; justify-content: center; cursor: pointer; }
    .day.done { background: #16a34a; color: white; }
  </style>
</head>
<body>
  <h1>Habit Tracker</h1>
  <form id="f"><input id="h" placeholder="Add a habit..." required><button>Add</button></form>
  <div id="list"></div>
  <script>
    // Detailed runnable habit storage and streak calculator included in full book
  </script>
</body>
</html>`
  },
  {
    id: 82,
    title: 'Colour Palette Generator',
    part: 'Part 5 — Advanced Beginner Projects',
    difficulty: '⭐⭐',
    whatYouWillBuild: 'Generate harmonious colour palettes from a base colour using HSL math. Copy hex codes with one click.',
    skills: ['HSL math', 'Copy to clipboard', 'Harmonic color wheels'],
    features: ['Base colour picker', 'Five harmony types (analogous, triadic, etc.)', 'Click to copy hex', 'Lock individual colours'],
    aiPrompt: `Build a 'Colour Palette Generator'. Pick a base colour. Five palette types: complementary, analogous, triadic, tetradic, monochrome. Each generates 5 colours. Click any swatch to copy its hex code. Lock any colour to keep it during regeneration. Pure JS.`,
    fileStructure: 'single file: palette.html',
    howItWorks: `HSL math is friendlier than RGB for harmony rules because hue distance directly maps onto colour wheel degrees (30, 60, 90, 120…). Our convert function rebuilds a hex in sRGB from HSL.`,
    customizationIdeas: [
      'Add a contrast checker',
      'Add a 30-60-90 rule palette suggestion',
      'Add export to CSS variables'
    ],
    upgradeChallenge: 'Generate a complete material-design-style theme from a single primary colour.',
    code: `<!DOCTYPE html>
<html>
<head>
  <title>Palette Generator</title>
  <style>
    body { font-family: system-ui; max-width: 720px; margin: 30px auto; padding: 20px; }
    .row { display: flex; gap: 4px; margin: 14px 0; }
    .swatch { flex: 1; height: 110px; border-radius: 8px; cursor: pointer; display: flex; align-items: end; justify-content: center; padding: 8px; color: white; font-family: monospace; }
  </style>
</head>
<body>
  <h1>Palette Generator</h1>
  <div class="row" id="row"></div>
  <script>
    // Mathematical HSL transformation for 5 color harmonies
    // Complete code provided in full book
  </script>
</body>
</html>`
  }
];

export const SKILLS_GAINED = [
  { title: 'Confident HTML, CSS & JavaScript', desc: 'Read and write vanilla web code without reliance on heavy frameworks' },
  { title: 'Browser APIs in Practice', desc: 'Master localStorage, Canvas, WebAudio synthesis, Intl localization, and Fetch' },
  { title: 'AI Prompt Engineering for Code', desc: 'Describe requirements clearly using the exact three-step pattern for AI coding partners' },
  { title: 'Debugging Mindset', desc: 'Read error messages from bottom-up and trace issues directly in browser developer tools' },
  { title: 'Architectural Patterns', desc: 'Recognize state machines, validation rules, client routing, and data persistence' },
  { title: 'Shipping Practical Programs', desc: 'Finish what you start: 100 standalone, runnable projects you can open anytime' }
];

export const THIRTY_DAY_CHALLENGE = [
  { days: 'Days 1 – 5', focus: 'Part 1 (Super Easy)', goal: 'Build 1 project per day to understand HTML structure, CSS layouts, and basic JS events.' },
  { days: 'Days 6 – 15', focus: 'Part 2 (Web Projects)', goal: 'Build interactive websites with DOM manipulation, forms, storage, and component thinking.' },
  { days: 'Days 16 – 25', focus: 'Part 3 (Games & Interactivity)', goal: 'Explore game loops, collision math, canvas rendering, and WebAudio sounds.' },
  { days: 'Days 26 – 30', focus: 'Part 4 (Productivity Tools)', goal: 'Construct real utility tools like habit trackers, expense trackers, and markdown note wikis.' },
  { days: 'Post Day 30', focus: 'Part 5 (Advanced & Capstone)', goal: 'Tackle algorithmic challenges, procedural generation, and build your capstone portfolio.' }
];

export const FAQ_ITEMS = [
  {
    question: 'What exactly is included in this ebook purchase?',
    answer: 'You receive the complete 235-page PDF ebook containing 100 mini projects, 100 tested AI prompts, full runnable code for each project, beginner-friendly explanations, the 30-Day Project Challenge roadmap, difficulty progression guide, skills breakdown, and the final AI Coding Cheat Sheet.'
  },
  {
    question: 'Do I need previous programming experience?',
    answer: 'Zero prior coding experience is required. The book starts with super simple, one-concept projects (like Hello Name Greeter and Age in Days) and gently builds up step by step.'
  },
  {
    question: 'How do I receive the ebook after payment?',
    answer: 'Delivery is immediate. As soon as your ₹29 payment is verified via UPI (FamGateway), you will receive a secure download token on the success page with instant access to the PDF. Your purchase is also tied to your unique Order ID.'
  },
  {
    question: 'What payment methods are supported?',
    answer: 'We support all UPI applications including Google Pay, PhonePe, Paytm, BHIM, and FamPay (FamApp) via FamGateway. You simply scan the dynamic QR code or tap the UPI intent on mobile.'
  },
  {
    question: 'Can I read and build these projects on my phone or tablet?',
    answer: 'Yes! The ebook PDF is formatted for all devices. Many of the early projects can be run on mobile browsers or cloud editors like Replit, though a desktop computer with VS Code or a basic text editor is ideal.'
  },
  {
    question: 'Does this book promise job or income guarantees?',
    answer: 'No. As stated in the book\'s disclaimer, no part of this book promises income or employment outcomes. The true value is in practical practice, hands-on building, and learning how to collaborate with AI to turn ideas into working software.'
  }
];
