import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';

const storageDir = path.resolve('server/storage');
if (!fs.existsSync(storageDir)) {
  fs.mkdirSync(storageDir, { recursive: true });
}

const outputPath = path.join(storageDir, 'ebook-100-mini-projects.pdf');

console.log('Generating Ebook PDF at:', outputPath);

const doc = new PDFDocument({
  size: 'A4',
  margins: { top: 50, bottom: 50, left: 50, right: 50 },
  bufferPages: true
});

const writeStream = fs.createWriteStream(outputPath);
doc.pipe(writeStream);

// Cover Page
doc.rect(0, 0, 595.28, 841.89).fill('#0f172a');

// Cover text
doc.fillColor('#38bdf8').fontSize(36).font('Helvetica-Bold')
   .text('100 MINI PROJECTS', 50, 180, { align: 'center' });
doc.fillColor('#ffffff').fontSize(32)
   .text('YOU CAN BUILD WITH AI', 50, 230, { align: 'center' });

doc.fillColor('#94a3b8').fontSize(16).font('Helvetica')
   .text('From Beginner to Builder — Practical Projects, AI Prompts & Complete Code', 60, 310, { align: 'center' });

doc.fillColor('#38bdf8').fontSize(13)
   .text('Includes 100 projects · 100 AI prompts · complete runnable code · zero prior coding required', 60, 370, { align: 'center' });

doc.rect(100, 430, 395, 2).fill('#334155');

doc.fillColor('#cbd5e1').fontSize(12).font('Helvetica')
   .text('A practical, build-it-today book for complete beginners — students, self-learners and anyone curious about what AI can do when you put it to work on real projects.', 80, 460, { align: 'center' });

doc.fillColor('#64748b').fontSize(11)
   .text('© 2026 — All Rights Reserved · Official Ebook Edition', 50, 750, { align: 'center' });

// Page 2: Copyright & Disclaimer
doc.addPage();
doc.rect(0, 0, 595.28, 841.89).fill('#ffffff');
doc.fillColor('#0f172a').fontSize(22).font('Helvetica-Bold').text('Copyright & Disclaimer', 50, 60);
doc.moveDown(1);
doc.fillColor('#334155').fontSize(11).font('Helvetica').lineGap(5)
   .text('© 2026 — All rights reserved. This book is intended for personal, educational use. You are welcome to build every project in it, share what you create, and modify the source code freely.')
   .moveDown()
   .text('The code samples in this book are written for educational purposes. They are runnable as published, but as with any software, you should review, test and adapt them before using them in a real product. The author makes no claim about fitness for any particular purpose, and disclaims all liability arising from the use of these examples.')
   .moveDown()
   .text('Names of technologies, services or libraries used in this book belong to their respective owners. Web links and API names were correct at the time of writing; specific URLs may change over time.')
   .moveDown()
   .text('No part of this book should be construed as a promise of income, employment or any specific outcome from completing the projects. The value of the book is in the practice and the skills you build by doing.')
   .moveDown(2);

doc.fillColor('#0f172a').fontSize(18).font('Helvetica-Bold').text('How to Use This Book');
doc.moveDown(0.8);
doc.fillColor('#334155').fontSize(11).font('Helvetica')
   .text('1. Each project takes between 30 minutes and a few hours to complete. Pick what you can finish in one sitting, finish it, and move on. By the time you reach project 100 you will have built the equivalent of a small portfolio.')
   .moveDown(0.5)
   .text('2. Read the AI prompt at the top of every project before you read the code. The prompt is your starting point — paste it into ChatGPT, Claude or Gemini if you need help, want different ideas, or want a deeper explanation of any concept.')
   .moveDown(0.5)
   .text('3. Type the code yourself instead of copy-pasting. Yes, it\'s slower. Yes, it builds real understanding.')
   .moveDown(0.5)
   .text('4. Tweak every project. Change the colours. Change the wording. Replace the icons with ones you like. The upgrade challenge is your friend; finishing it is where most learning actually happens.');

// Page 3: Table of Contents Overview
doc.addPage();
doc.fillColor('#0f172a').fontSize(22).font('Helvetica-Bold').text('Table of Contents', 50, 60);
doc.moveDown(1);
const parts = [
  { part: 'Part 1 — Super Easy Projects', range: 'Projects 1 to 20', desc: 'Short, runnable in your browser, teaching single core ideas (Hello Name Greeter, Tip Calculator, Dice Roller, etc.)' },
  { part: 'Part 2 — Web Projects', range: 'Projects 21 to 40', desc: 'Real interactive websites with DOM manipulation, layouts, components and persistence (Personal Landing Page, Notes Saver, Kanban, Storefront, etc.)' },
  { part: 'Part 3 — Games & Interactive Projects', range: 'Projects 41 to 60', desc: 'Games teaching timing, state, animations and real-time feedback (Tic Tac Toe, Snake, Breakout, Quiz, Space Shooter, etc.)' },
  { part: 'Part 4 — Productivity & Useful Tools', range: 'Projects 61 to 80', desc: 'Tools you will actually use: Habit Tracker, Expense Tracker, Flashcard App, Markdown Editor, Invoice Generator, etc.' },
  { part: 'Part 5 — Advanced Beginner Projects', range: 'Projects 81 to 100', desc: 'Solar System, Procedural Terrain, Particle Simulator, Drum Machine, Chord Player, Sudoku Solver, and Capstone Portfolio.' }
];

parts.forEach(p => {
  doc.fillColor('#2563eb').fontSize(14).font('Helvetica-Bold').text(p.part);
  doc.fillColor('#64748b').fontSize(10).font('Helvetica-Bold').text(p.range);
  doc.fillColor('#334155').fontSize(10).font('Helvetica').text(p.desc);
  doc.moveDown(1);
});

doc.moveDown(1);
doc.fillColor('#0f172a').fontSize(13).font('Helvetica-Bold').text('Special Included Sections:');
doc.fillColor('#334155').fontSize(10).font('Helvetica')
   .text('• 30-Day Project Challenge roadmap')
   .text('• Project Difficulty & Skills Progression Map')
   .text('• Final AI Coding Cheat Sheet for prompt engineering')
   .text('• Author Note: "Build small. Build often. The rest will come."');

// Add sample project detail pages
const sampleProjects = [
  {
    num: 1,
    name: 'Hello Name Greeter',
    part: 'Part 1 — Super Easy Projects',
    diff: '⭐',
    desc: 'Build a tiny webpage that asks for a name and greets the visitor with a personalized message.',
    skills: 'HTML form, JavaScript basics, DOM selection',
    prompt: `You are a patient coding tutor. Create a single-file HTML page called 'Hello Name Greeter'. Requirements: a text input where the user types their name, a button labelled 'Greet me', and a paragraph below that shows 'Hello, <name>!' when clicked. Also update the greeting live as the user types. Use only vanilla HTML, CSS and JavaScript inside one file. Add beginner-friendly comments explaining each line.`,
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
    const input = document.getElementById("nameInput");
    const output = document.getElementById("output");
    input.addEventListener("input", () => {
      const name = input.value.trim();
      output.textContent = name ? \`Hello, \${name}!\` : "Hello, friend!";
    });
  </script>
</body>
</html>`
  },
  {
    num: 10,
    name: 'Tip Calculator',
    part: 'Part 1 — Super Easy Projects',
    diff: '⭐',
    desc: 'Calculate tip and total bill from a bill amount and a percentage with per-person split.',
    skills: 'Arithmetic, Input handling, Number formatting',
    prompt: `Build a single-file 'Tip Calculator'. Inputs: bill amount (positive number), tip percentage (slider 0-50%), number of people (number input, default 1). Outputs: tip amount, total bill, and per-person amount. Use .toFixed(2) for currency. Validate that bill and people are > 0. Vanilla JS.`,
    code: `<!DOCTYPE html>
<html>
<head>
  <title>Tip Calculator</title>
  <style>
    body { font-family: system-ui; max-width: 420px; margin: 40px auto; padding: 20px; background: #f8fafc; }
    .row { display: flex; justify-content: space-between; margin: 8px 0; }
    .box { margin-top: 20px; padding: 14px; background: white; border-radius: 10px; }
    .total { font-size: 22px; font-weight: 700; color: #0f766e; }
  </style>
</head>
<body>
  <h1>Tip Calculator</h1>
  <div class="row"><label>Bill ₹</label><input id="bill" type="number" value="1000"></div>
  <div class="row"><label>Tip %</label><span id="pctLbl">15%</span></div>
  <input id="pct" type="range" min="0" max="50" value="15" style="width:100%">
  <div class="row"><label>People</label><input id="people" type="number" value="2" min="1"></div>
  <div class="box">
    <div class="row"><span>Tip</span><span id="tip">₹150.00</span></div>
    <div class="row"><span>Total</span><span id="total">₹1150.00</span></div>
    <hr>
    <div class="row total"><span>Per person</span><span id="per">₹575.00</span></div>
  </div>
</body>
</html>`
  },
  {
    num: 45,
    name: 'Snake Game',
    part: 'Part 3 — Games & Interactive Projects',
    diff: '⭐⭐⭐',
    desc: 'The classic Snake game on canvas: arrow keys to move, eats food to grow, self-collision detection, and high score.',
    skills: 'Game loop, Direction queue, Collision detection',
    prompt: `Build 'Snake'. The snake moves on a fixed grid, eats food to grow, and the game ends if it hits a wall or itself. Arrow keys change direction (no instant 180° turns). Spacebar to pause. Local high score. Canvas or grid divs. Vanilla JS.`,
    code: `// Complete HTML/JS implementation included in full book
// Uses 20x20 grid on HTML5 canvas with requestAnimationFrame and collision detection.`
  },
  {
    num: 61,
    name: 'Habit Tracker',
    part: 'Part 4 — Productivity & Useful Tools',
    diff: '⭐⭐',
    desc: 'Mark today and past 6 days for any habit. Streak counter, persistent localStorage, and progress statistics.',
    skills: 'Date arithmetic, localStorage arrays, State tracking',
    prompt: `Build a 'Habit Tracker'. The user can add habits (e.g. Read, Run, Meditate). For each habit, show today's status with a toggle and the past 6 days as small squares. Track current streak and best streak per habit. Pure JS, single file.`,
    code: `// Complete HTML/CSS/JS implementation included in full book
// Stores daily completions by ISO date strings and calculates running streaks.`
  },
  {
    num: 100,
    name: 'Capstone: Personal Portfolio Site',
    part: 'Part 5 — Advanced Beginner Projects',
    diff: '⭐⭐⭐',
    desc: 'A complete responsive portfolio site reflecting everything from the book: hero, About section, featured projects, skills, contact form, and bookshelf listing.',
    skills: 'Composition, Responsive layout, Structured content, Complete CSS Grid',
    prompt: `Build a 'Capstone: Personal Portfolio Site'. This final project composes everything: a hero, About section, 6 featured project cards, a Skills section, a Contact form and a 'Bookshelf' that lists projects 1-100 with their gists. Vanilla JS, single HTML.`,
    code: `// Complete Capstone Project from Page 229-232 of the book
// Demonstrates end-to-end integration of frontend skills.`
  }
];

sampleProjects.forEach(sp => {
  doc.addPage();
  doc.fillColor('#0f172a').fontSize(20).font('Helvetica-Bold').text(`Project ${sp.num}: ${sp.name}`);
  doc.fillColor('#64748b').fontSize(11).font('Helvetica').text(`${sp.part} · Difficulty: ${sp.diff}`);
  doc.moveDown(0.8);
  
  doc.fillColor('#1e293b').fontSize(12).font('Helvetica-Bold').text('What you will build');
  doc.fillColor('#334155').fontSize(10).font('Helvetica').text(sp.desc);
  doc.moveDown(0.5);

  doc.fillColor('#1e293b').fontSize(12).font('Helvetica-Bold').text('Skills you will learn');
  doc.fillColor('#334155').fontSize(10).font('Helvetica').text(`• ${sp.skills}`);
  doc.moveDown(0.8);

  doc.fillColor('#1e40af').fontSize(12).font('Helvetica-Bold').text('Build it with AI — The prompt to paste');
  doc.rect(doc.x, doc.y, 495, 75).fillAndStroke('#eff6ff', '#bfdbfe');
  doc.fillColor('#1e3a8a').fontSize(9.5).font('Helvetica')
     .text(sp.prompt, doc.x + 8, doc.y - 70, { width: 480 });
  doc.moveDown(1.5);

  doc.fillColor('#1e293b').fontSize(12).font('Helvetica-Bold').text('Code implementation');
  doc.fillColor('#0f172a').fontSize(8.5).font('Courier')
     .text(sp.code, { width: 495 });
});

// Final Cheat Sheet & Author Note
doc.addPage();
doc.fillColor('#0f172a').fontSize(20).font('Helvetica-Bold').text('Final AI Coding Cheat Sheet');
doc.moveDown(0.5);
doc.fillColor('#334155').fontSize(10).font('Helvetica')
   .text('When you finish this book, you will not just know 100 things you can build — you will also know how to talk to an AI assistant about building anything else. Save this cheat sheet.')
   .moveDown(0.5)
   .text('1. Describe the goal: "I want a webpage where the user types a temperature and clicks a button, and the page shows one of five mood messages."')
   .text('2. Describe the constraints: "Vanilla HTML, CSS and JavaScript only. One file. No external libraries. Mobile-friendly."')
   .text('3. Describe the UI in detail: "A large input box, primary button labelled Tell me the mood, and result text below."')
   .text('4. Describe what should go wrong: "If the input is empty, show Please enter a temperature."')
   .text('5. Share what you tried: "I tried writing the code myself but returns NaN when empty. Here is the snippet."')
   .text('6. Ask the AI to explain, not just fix: "Explain line 7 as if I am a complete beginner."')
   .text('7. Iterate: "Make the message color match temperature range: blue for cold, orange for hot."');

doc.moveDown(1.5);
doc.fillColor('#0f172a').fontSize(16).font('Helvetica-Bold').text('Author Note');
doc.moveDown(0.5);
doc.fillColor('#334155').fontSize(10).font('Helvetica').lineGap(4)
   .text('Hello, and thank you for picking up this book. I wrote it because I believe the best way to learn anything today is to build, and the best way to build is to start small. Every project in this book is something a complete beginner can finish in an afternoon.')
   .text('If this book is your first step into coding, congratulations — you are already in good company. The trick was always the same: keep building, finish what you start, and don\'t be afraid to ask an AI for help when you get stuck.')
   .moveDown(1)
   .font('Helvetica-BoldOblique').text('Build small. Build often. The rest will come.', { align: 'center' });

doc.end();
writeStream.on('finish', () => {
  console.log('PDF generation complete! File size:', fs.statSync(outputPath).size);
});
