import { type Chapter, h2, h3, p, ul, code, tryit, note, table, sim, cards, compare, steps, diagram } from './types';

export const ch9: Chapter = {
  id: 'box-layout', num: 9, unit: 2,
  title: 'Box Model & Page Layout', short: 'Box Model & Layout',
  tagline: 'Every element is a box. Learn to size, space and arrange boxes with Flexbox and Grid.',
  color: 'teal', icon: 'LayoutGrid', image: 'images/ch-layout.jpg', minutes: 40,
  objectives: [
    'Describe the four layers of the CSS box model',
    'Calculate the total size of an element',
    'Use display and position to control element flow',
    'Build one-dimensional layouts with Flexbox',
    'Build two-dimensional layouts with CSS Grid',
  ],
  blocks: [
    h2('The CSS Box Model'),
    p('In CSS, **every element is a rectangular box**. The box model describes the four layers that make up that box, from the inside out:'),
    diagram('box-model', 'Figure 9.1 — The CSS box model'),
    table(['Layer', 'Description', 'Properties'],
      ['Content', 'The actual text or image', '`width`, `height`'],
      ['Padding', 'Transparent space **inside** the border, around the content', '`padding`, `padding-top`…'],
      ['Border', 'A line drawn around the padding', '`border`, `border-width`…'],
      ['Margin', 'Transparent space **outside** the border that separates it from other elements', '`margin`, `margin-left`…'],
    ),
    code('css', `
.box {
  width: 200px;
  padding: 20px;
  border: 5px solid black;
  margin: 10px;
}
/* Total width = 200 + (20 x 2) + (5 x 2) + (10 x 2) = 270px */`),
    note('info', 'Shorthand values go **clockwise from the top**: `margin: 10px 20px 30px 40px;` means top 10, right 20, bottom 30, left 40. With two values: vertical | horizontal.', 'Remember "TRouBLe" — Top, Right, Bottom, Left'),
    p('By default (`box-sizing: content-box`) padding and border are **added** to the width. With `box-sizing: border-box` they are included **inside** the width, which makes sizing much easier. Use the simulator to compare.'),
    sim('box-model'),
    h2('The display Property'),
    table(['Value', 'Behaviour', 'Default for'],
      ['block', 'Starts on a new line and takes the full width', '`<div>`, `<p>`, `<h1>`, `<ul>`, `<form>`'],
      ['inline', 'Sits within a line; width and height cannot be set', '`<span>`, `<a>`, `<b>`, `<em>`'],
      ['inline-block', 'Sits within a line but accepts width and height', 'Buttons, `<img>`, `<input>`'],
      ['none', 'Hides the element completely (takes no space)', '—'],
      ['flex', 'Makes a flexible one-dimensional layout container', '—'],
      ['grid', 'Makes a two-dimensional grid layout container', '—'],
    ),
    tryit('Block vs inline vs inline-block', `
<div class="block">I am a block (div)</div>
<div class="block">Another block — I start on a new line</div>
<span class="inline">inline span</span>
<span class="inline">another inline</span>
<span class="ib">inline-block</span>
<span class="ib">I accept width!</span>`, `
body { font-family: sans-serif; }
.block { background: #ccfbf1; border: 2px solid #14b8a6; padding: 8px; margin: 6px 0; }
.inline { background: #fef3c7; border: 2px solid #f59e0b; padding: 4px; width: 300px; /* ignored! */ }
.ib { display: inline-block; width: 140px; background: #ede9fe; border: 2px solid #8b5cf6;
  padding: 8px; margin-top: 8px; text-align: center; }`),
    h2('Positioning'),
    table(['position', 'Description'],
      ['static', 'Default. Follows the normal flow of the page; top/left have no effect'],
      ['relative', 'Moved relative to its normal position; its original space is kept'],
      ['absolute', 'Removed from the flow and placed relative to the nearest positioned ancestor'],
      ['fixed', 'Fixed to the browser window — stays put while scrolling (e.g. a chat button)'],
      ['sticky', 'Acts relative until a scroll point, then sticks (e.g. sticky headers)'],
    ),
    p('`z-index` controls which positioned element appears on top when they overlap — a higher value comes forward. The **Position** tab of the Layout Lab below lets you try every value.'),
    h2('Flexbox — One-Dimensional Layout'),
    p('**Flexbox** arranges items in a single **row or column** and makes it easy to align them and share out space. Apply `display: flex` to a **container**; its direct children become **flex items**.'),
    table(['Container property', 'Common values', 'Purpose'],
      ['flex-direction', 'row, row-reverse, column, column-reverse', 'Direction of the main axis'],
      ['justify-content', 'flex-start, center, flex-end, space-between, space-around, space-evenly', 'Alignment along the main axis'],
      ['align-items', 'stretch, flex-start, center, flex-end, baseline', 'Alignment along the cross axis'],
      ['flex-wrap', 'nowrap, wrap', 'Whether items move onto new lines'],
      ['gap', '10px, 1rem', 'Space between items'],
    ),
    p('Flex items can use `flex-grow` (take extra space), `flex-shrink`, `flex-basis`, `order` and `align-self`.'),
    sim('layout-lab'),
    tryit('Navigation bar with Flexbox', `
<nav class="navbar">
  <div class="logo">🌐 MySite</div>
  <ul class="menu">
    <li><a href="#">Home</a></li>
    <li><a href="#">About</a></li>
    <li><a href="#">Projects</a></li>
    <li><a href="#">Contact</a></li>
  </ul>
</nav>`, `
body { margin: 0; font-family: sans-serif; }
.navbar { display: flex; justify-content: space-between; align-items: center;
  background: #0f766e; padding: 12px 20px; flex-wrap: wrap; gap: 8px; }
.logo { color: white; font-weight: bold; font-size: 20px; }
.menu { display: flex; gap: 18px; list-style: none; margin: 0; padding: 0; }
.menu a { color: #ccfbf1; text-decoration: none; }
.menu a:hover { color: white; text-decoration: underline; }`, undefined, 160),
    h2('CSS Grid — Two-Dimensional Layout'),
    p('**CSS Grid** divides a container into **rows and columns** at the same time — perfect for whole-page layouts and photo galleries. The `fr` unit means "one fraction of the free space".'),
    code('css', `
.gallery {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 3 equal columns */
  gap: 10px;
}
.featured { grid-column: span 2; }       /* stretches across 2 columns */`),
    tryit('Photo gallery with Grid', `
<div class="gallery">
  <div class="featured">1 (span 2)</div>
  <div>2</div><div>3</div><div>4</div><div>5</div><div>6</div>
</div>`, `
body { font-family: sans-serif; }
.gallery { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
.gallery div { background: linear-gradient(135deg, #2dd4bf, #0ea5e9); color: white; font-weight: bold;
  height: 70px; border-radius: 10px; display: flex; align-items: center; justify-content: center; }
.featured { grid-column: span 2; }`, undefined, 260),
    compare('Flexbox', [
      'One-dimensional: a row **or** a column',
      'Content-first: items decide their own size',
      'Best for navbars, button groups and centring',
    ], 'Grid', [
      'Two-dimensional: rows **and** columns together',
      'Layout-first: the grid decides where items go',
      'Best for page layouts, galleries and dashboards',
    ]),
  ],
  summary: [
    'Every element is a box made of content, padding, border and margin.',
    'With content-box, total width = width + padding + border (+ margin); border-box includes padding and border in the width.',
    'display controls flow (block, inline, inline-block, none, flex, grid).',
    'position (static, relative, absolute, fixed, sticky) with top/left/z-index places elements precisely.',
    'Flexbox lays items out in one dimension; Grid lays them out in rows and columns.',
  ],
  exercises: [
    { q: 'Calculate the total width: width 300px, padding 15px, border 2px, margin 10px (content-box).', a: '300 + 2×15 + 2×2 + 2×10 = 354px of horizontal space (the visible box itself is 334px wide).' },
    { q: 'What is the difference between padding and margin?', a: 'Padding is space inside the border (between border and content) and shows the background colour. Margin is transparent space outside the border, separating the element from others.' },
    { q: 'Differentiate between block and inline elements with examples.', a: 'Block elements start on a new line and take full width (div, p, h1). Inline elements stay within the line and take only needed width (span, a, b).' },
    { q: 'Write CSS to centre items horizontally and vertically inside a flex container.', a: '.container { display: flex; justify-content: center; align-items: center; }' },
    { q: 'What does grid-template-columns: 1fr 2fr 1fr create?', a: 'Three columns where the middle column gets twice the free space of each side column.' },
  ],
};

export const ch10: Chapter = {
  id: 'responsive', num: 10, unit: 2,
  title: 'Responsive Web Design', short: 'Responsive Design',
  tagline: 'One website, every screen — viewport, flexible units and media queries.',
  color: 'cyan', icon: 'MonitorSmartphone', image: 'images/ch-responsive.jpg', minutes: 25,
  objectives: [
    'Explain what responsive web design is and why it matters',
    'Use the viewport meta tag',
    'Use relative units and flexible images',
    'Write media queries using common breakpoints',
    'Apply the mobile-first approach',
  ],
  blocks: [
    h2('What is Responsive Web Design?'),
    p('**Responsive web design (RWD)** means building one website that automatically adapts its layout to any screen — phone, tablet, laptop or TV. The term was coined by **Ethan Marcotte** in 2010. Today more than half of all web traffic comes from mobile phones, so responsiveness is essential.'),
    cards(
      ['Fluid grids', 'Layouts use relative units like % and fr instead of fixed pixels, so columns stretch and shrink.', 'LayoutGrid'],
      ['Flexible images', 'Images scale within their containers using max-width: 100%.', 'Image'],
      ['Media queries', 'CSS rules that apply only when the screen matches a condition, such as a minimum width.', 'MonitorSmartphone'],
    ),
    h2('Step 1: The Viewport Meta Tag'),
    p('Without this tag, phones pretend to be about 980px wide and shrink the page until it is unreadable. Always put it inside `<head>`:'),
    code('html', `<meta name="viewport" content="width=device-width, initial-scale=1.0">`),
    table(['Part', 'Meaning'],
      ['width=device-width', 'Make the page as wide as the device screen'],
      ['initial-scale=1.0', 'Do not zoom in or out when the page first loads'],
    ),
    h2('Step 2: Flexible Units & Images'),
    code('css', `
.container { width: 90%; max-width: 1100px; margin: 0 auto; }
img { max-width: 100%; height: auto; }  /* never overflow the screen */
h1 { font-size: 2rem; }                 /* scales with the root font size */
.hero { height: 60vh; }                 /* 60% of the screen height */`),
    h2('Step 3: Media Queries'),
    p('A **media query** applies CSS only when a condition is true. The most common condition is the width of the viewport.'),
    code('css', `
/* Default styles: mobile (1 column) */
.cards { display: grid; grid-template-columns: 1fr; gap: 16px; }

/* Tablets: 600px and wider -> 2 columns */
@media (min-width: 600px) {
  .cards { grid-template-columns: 1fr 1fr; }
}

/* Laptops: 1024px and wider -> 3 columns */
@media (min-width: 1024px) {
  .cards { grid-template-columns: repeat(3, 1fr); }
}`),
    table(['Device', 'Typical breakpoint'],
      ['📱 Mobile phones', 'up to 599px'],
      ['📲 Tablets', '600px – 1023px'],
      ['💻 Laptops', '1024px – 1279px'],
      ['🖥️ Desktops', '1280px and above'],
    ),
    p('Switch between devices in the simulator and watch the same page rearrange itself. The active media query is highlighted.'),
    sim('responsive'),
    h2('Mobile-First Design'),
    compare('Mobile-first (recommended)', [
      'Write the base CSS for small screens first',
      'Add features for larger screens with min-width queries',
      'Faster on phones; forces you to prioritise content',
    ], 'Desktop-first', [
      'Write CSS for large screens first',
      'Override for smaller screens with max-width queries',
      'Often leads to heavy, slow pages on mobile',
    ]),
    tryit('Responsive cards — use the width buttons above the output', `
<h2>Explore Topics</h2>
<div class="cards">
  <div class="card">🎨 Art</div>
  <div class="card">💻 Technology</div>
  <div class="card">🎵 Music</div>
  <div class="card">⚽ Sports</div>
  <div class="card">📚 Books</div>
  <div class="card">🔬 Science</div>
</div>
<p class="hint"></p>`, `
body { font-family: sans-serif; margin: 12px; }
.cards { display: grid; grid-template-columns: 1fr; gap: 10px; }
.card { background: #cffafe; border: 2px solid #06b6d4; border-radius: 12px; padding: 18px;
  text-align: center; font-weight: bold; }
.hint::after { content: "📱 Mobile layout: 1 column"; color: #0e7490; }
@media (min-width: 400px) {
  .cards { grid-template-columns: 1fr 1fr; }
  .hint::after { content: "📲 Tablet layout: 2 columns"; }
}
@media (min-width: 700px) {
  .cards { grid-template-columns: repeat(3, 1fr); }
  .hint::after { content: "💻 Desktop layout: 3 columns"; }
}`, undefined, 400),
    note('tip', 'In Chrome press **F12** and then **Ctrl + Shift + M** to open the Device Toolbar and preview your page on different phones and tablets.'),
    h2('Responsive Images & Testing Tips'),
    p('The `<picture>` element and the `srcset` attribute let the browser download a small image on phones and a large one on desktops, saving mobile data:'),
    code('html', `
<picture>
  <source media="(max-width: 600px)" srcset="photo-small.jpg">
  <img src="photo-large.jpg" alt="City skyline at sunset">
</picture>`),
    ul(
      'Test on real devices and in the browser\'s device mode.',
      'Make buttons and links at least **44 × 44 px** so they are easy to tap.',
      'Avoid horizontal scrolling — nothing should be wider than the screen.',
      'Use readable font sizes (at least 16px) on mobile.',
    ),
  ],
  summary: [
    'Responsive design makes one website adapt to all screen sizes.',
    'The viewport meta tag (width=device-width, initial-scale=1) is essential for mobile.',
    'Fluid layouts use %, fr, rem, vw and vh; images use max-width: 100%.',
    'Media queries such as @media (min-width: 600px) apply CSS at breakpoints.',
    'Mobile-first design starts with small screens and enhances for larger ones.',
  ],
  exercises: [
    { q: 'Why is the viewport meta tag needed?', a: 'Without it mobile browsers render the page at about 980px wide and zoom out, making text tiny. It tells the browser to use the device width and normal zoom.' },
    { q: 'Write a media query that changes the body background to lightblue on screens 768px wide or more.', a: '@media (min-width: 768px) { body { background: lightblue; } }' },
    { q: 'What does img { max-width: 100%; } do?', a: 'It prevents images from becoming wider than their container, so they shrink on small screens instead of overflowing.' },
    { q: 'Differentiate between min-width and max-width media queries.', a: 'min-width applies styles when the screen is at least that wide (used in mobile-first); max-width applies when the screen is at most that wide (used in desktop-first).' },
    { q: 'What are the three pillars of responsive design?', a: 'Fluid grids, flexible images and media queries.' },
  ],
};

export const ch11: Chapter = {
  id: 'javascript', num: 11, unit: 3,
  title: 'JavaScript Essentials', short: 'JavaScript',
  tagline: 'Add behaviour — variables, decisions, functions, events and DOM manipulation.',
  color: 'yellow', icon: 'Braces', image: 'images/ch-js.jpg', minutes: 40,
  objectives: [
    'Explain the role of JavaScript in web pages',
    'Add JavaScript using script tags and event attributes',
    'Use variables, data types, operators, conditions, loops and functions',
    'Respond to user events',
    'Change page content and style through the DOM',
  ],
  blocks: [
    h2('What is JavaScript?'),
    p('**JavaScript (JS)** is a programming language that makes web pages **interactive**. HTML gives structure and CSS adds style, while JavaScript adds **behaviour** — it reacts to clicks, checks forms, changes content and creates animations and games. It was created by **Brendan Eich** at Netscape in **1995**, reportedly in just 10 days!'),
    cards(
      ['React to events', 'Run code when the user clicks, types, scrolls or moves the mouse.', 'MousePointerClick'],
      ['Change the page', 'Update text, images and styles without reloading the page.', 'RefreshCw'],
      ['Validate forms', 'Check input (empty fields, valid e-mail) before sending it to a server.', 'CircleCheck'],
      ['Calculate & decide', 'Do maths, make decisions with if…else and repeat tasks with loops.', 'Brain'],
    ),
    note('info', 'Java and JavaScript are **completely different** languages. The similar name was a marketing decision in 1995!', 'Not the same as Java'),
    h2('Adding JavaScript to a Page'),
    code('html', `
<!-- 1. Internal: inside a script element, usually just before the closing body tag -->
<script>
  alert("Hello from JavaScript!");
</script>

<!-- 2. External: in a separate .js file -->
<script src="app.js"></script>

<!-- 3. Inline event attribute -->
<button onclick="alert('Clicked!')">Click me</button>`),
    h2('Displaying Output'),
    table(['Method', 'Where the output appears'],
      ['`alert("Hi")`', 'A pop-up message box'],
      ['`console.log("Hi")`', 'The browser console (F12 → Console) — used for debugging'],
      ['`document.write("Hi")`', 'Writes directly into the page (only for testing)'],
      ['`element.innerHTML = "Hi"`', 'Changes the content of an HTML element — the most common way'],
    ),
    h2('Variables & Data Types'),
    p('A **variable** is a named container that stores a value. Use `let` for values that change and `const` for values that stay the same (`var` is the older way).'),
    code('js', `
let name = "Riya";        // String  (text)
let age = 25;             // Number
let isMember = true;      // Boolean (true / false)
let scores = [90, 85, 77]; // Array  (list of values)
let user = { name: "Riya", city: "Pune" }; // Object
const PI = 3.14159;       // Constant - cannot be reassigned

console.log(name + " is " + age + " years old.");`),
    h2('Operators'),
    table(['Type', 'Operators', 'Example'],
      ['Arithmetic', '`+ - * / % **`', '`10 % 3` gives 1 (remainder)'],
      ['Assignment', '`= += -= *=`', '`x += 5` means x = x + 5'],
      ['Comparison', '`== === != > < >= <=`', '`5 === "5"` is false (checks type too)'],
      ['Logical', '`&& || !`', '`age > 13 && age < 20`'],
      ['Increment / decrement', '`++ --`', '`count++` adds 1'],
    ),
    h2('Decisions, Loops & Functions'),
    code('js', `
// if...else - make decisions
let score = 72;
if (score >= 90) {
  console.log("Gold medal 🥇");
} else if (score >= 60) {
  console.log("Silver medal 🥈");
} else {
  console.log("Keep trying!");
}

// for loop - repeat a task
for (let i = 1; i <= 5; i++) {
  console.log("5 x " + i + " = " + 5 * i);
}

// function - a reusable block of code
function greet(person) {
  return "Hello, " + person + "!";
}
console.log(greet("World"));`),
    tryit('Interactive greeting & calculator', `
<h3>👋 Greeter</h3>
<input id="name" placeholder="Type your name">
<button onclick="greet()">Greet me</button>
<p id="out"></p>

<h3>🧮 Square calculator</h3>
<input id="num" type="number" value="7">
<button onclick="square()">Square it</button>
<p id="result"></p>`, `
body { font-family: sans-serif; }
input { padding: 6px; border: 1px solid #ca8a04; border-radius: 6px; }
button { background: #eab308; border: none; padding: 7px 14px; border-radius: 6px; font-weight: bold; cursor: pointer; }
#out, #result { font-size: 18px; color: #854d0e; }`, `
function greet() {
  let name = document.getElementById("name").value;
  if (name === "") {
    name = "Stranger";
  }
  document.getElementById("out").innerHTML = "Hello, <b>" + name + "</b>! Welcome to JavaScript.";
}

function square() {
  let n = Number(document.getElementById("num").value);
  document.getElementById("result").innerHTML = n + " x " + n + " = " + (n * n);
}`, 360),
    h2('Events'),
    p('An **event** is something that happens on the page — a click, a key press, the page finishing loading. JavaScript can **listen** for events and run a function in response.'),
    table(['Event', 'Happens when…'],
      ['onclick', 'The user clicks an element'],
      ['ondblclick', 'The user double-clicks'],
      ['onmouseover / onmouseout', 'The pointer enters / leaves an element'],
      ['onkeyup / onkeydown', 'A key is released / pressed'],
      ['onchange', 'The value of an input or select changes'],
      ['onsubmit', 'A form is submitted'],
      ['onload', 'The page (or an image) finishes loading'],
    ),
    code('js', `
// Modern way: addEventListener
const btn = document.getElementById("myBtn");
btn.addEventListener("click", function () {
  alert("Button was clicked!");
});`),
    h2('The DOM — Changing the Page with JavaScript'),
    p('Remember the DOM tree from Chapter 2? JavaScript can **find** any element in that tree and **change** it.'),
    table(['Method / Property', 'What it does'],
      ['`document.getElementById("id")`', 'Finds the element with that id'],
      ['`document.querySelector(".cls")`', 'Finds the first element matching a CSS selector'],
      ['`el.innerHTML` / `el.textContent`', 'Gets or sets the content of an element'],
      ['`el.style.color = "red"`', 'Changes an inline CSS property'],
      ['`el.classList.add("active")`', 'Adds a CSS class (also remove, toggle)'],
      ['`document.createElement("li")`', 'Creates a new element'],
      ['`parent.appendChild(el)`', 'Adds an element inside another'],
    ),
    p('The **DOM Playground** runs real JavaScript on a mini web page. Click the buttons or type your own commands.'),
    sim('js-dom'),
    tryit('Mini project: counter & colour changer', `
<div id="card">
  <h2 id="count">0</h2>
  <button onclick="change(-1)">−</button>
  <button onclick="change(1)">+</button>
  <button onclick="reset()">Reset</button>
  <br><br>
  <button onclick="randomColor()">🎨 Random background</button>
</div>`, `
body { font-family: sans-serif; display: flex; justify-content: center; }
#card { text-align: center; padding: 20px 30px; border-radius: 16px; background: #fefce8;
  transition: background .4s; box-shadow: 0 4px 14px rgba(0,0,0,.12); }
#count { font-size: 48px; margin: 6px; }
button { font-size: 16px; padding: 6px 14px; margin: 2px; border-radius: 8px; border: 1px solid #a16207; background: white; cursor: pointer; }`, `
let count = 0;
function change(step) {
  count = count + step;
  const el = document.getElementById("count");
  el.innerHTML = count;
  el.style.color = count < 0 ? "crimson" : (count > 0 ? "green" : "black");
}
function reset() {
  count = 0;
  change(0);
}
function randomColor() {
  const colors = ["#fecaca", "#fde68a", "#bbf7d0", "#bfdbfe", "#ddd6fe", "#fbcfe8"];
  const pick = colors[Math.floor(Math.random() * colors.length)];
  document.getElementById("card").style.background = pick;
}`, 300),
    h3('Form Validation'),
    tryit('Validate before submitting', `
<form onsubmit="return validate()">
  <input id="email" placeholder="E-mail address">
  <input id="pass" type="password" placeholder="Password (min 6 characters)">
  <button>Sign up</button>
  <p id="msg"></p>
</form>`, `
body { font-family: sans-serif; }
input { display: block; margin: 6px 0; padding: 8px; width: 240px; border: 1px solid #ccc; border-radius: 6px; }
button { padding: 8px 16px; background: #ca8a04; color: white; border: none; border-radius: 6px; }
.error { color: crimson; }
.ok { color: green; }`, `
function validate() {
  const email = document.getElementById("email").value;
  const pass = document.getElementById("pass").value;
  const msg = document.getElementById("msg");
  if (!email.includes("@")) {
    msg.className = "error";
    msg.innerHTML = "❌ Please enter a valid e-mail.";
    return false;
  }
  if (pass.length < 6) {
    msg.className = "error";
    msg.innerHTML = "❌ Password must be at least 6 characters.";
    return false;
  }
  msg.className = "ok";
  msg.innerHTML = "✅ All good! The form is valid.";
  return false; // stop real submission in this demo
}`, 260),
  ],
  summary: [
    'JavaScript adds behaviour and interactivity to web pages; it runs in the browser.',
    'Add JS with internal script elements, external .js files or event attributes.',
    'Variables (let, const, var) store data types: string, number, boolean, array, object.',
    'if…else makes decisions, loops repeat tasks and functions group reusable code.',
    'Events (click, change, submit…) trigger functions; the DOM lets JS read and change the page.',
  ],
  exercises: [
    { q: 'Differentiate between let and const.', a: 'A let variable can be reassigned later; a const variable must be assigned once and cannot be reassigned.' },
    { q: 'What is the difference between == and ===?', a: '== compares values after type conversion (5 == "5" is true); === compares both value and type (5 === "5" is false).' },
    { q: 'Write JS to change the text of an element with id="title" to "Welcome".', a: 'document.getElementById("title").innerHTML = "Welcome";' },
    { q: 'Name four JavaScript events.', a: 'onclick, onmouseover, onchange, onsubmit (also onkeyup, onload, ondblclick).' },
    { q: 'Write a for loop that prints numbers 1 to 10 in the console.', a: 'for (let i = 1; i <= 10; i++) { console.log(i); }' },
  ],
};

export const ch12: Chapter = {
  id: 'ui-ux', num: 12, unit: 3,
  title: 'UI/UX Design & the Web Design Process', short: 'UI/UX & Process',
  tagline: 'Design principles, usability, accessibility, semantic HTML and how real websites are built.',
  color: 'indigo', icon: 'Sparkles', image: 'images/ch-uiux.jpg', minutes: 30,
  objectives: [
    'Differentiate between UI and UX',
    'Apply the design principles of contrast, repetition, alignment and proximity',
    'Follow basic usability and accessibility guidelines',
    'Structure pages with semantic HTML5 tags',
    'Describe the stages of the web design process',
  ],
  blocks: [
    h2('UI vs UX'),
    p('**UI (User Interface)** is what users *see and touch* — buttons, colours, icons, fonts and layout. **UX (User Experience)** is how users *feel* while using the product — is it easy, fast, logical and pleasant? A beautiful site with a confusing menu has good UI but poor UX.'),
    compare('🎨 UI — User Interface', [
      'Focuses on the look and the visual elements',
      'Buttons, typography, colours, icons, spacing',
      'Asks: "Does it look good and consistent?"',
      'Tools: Figma, Adobe XD, Photoshop',
    ], '🧭 UX — User Experience', [
      'Focuses on the overall feel and the user journey',
      'Research, user flows, navigation, usability testing',
      'Asks: "Can users reach their goal easily?"',
      'Tools: surveys, wireframes, user testing',
    ]),
    note('fact', 'UI is like the **steering wheel and dashboard** of a car; UX is **how it feels to drive** it.', 'Analogy'),
    h2('Principles of Good Visual Design'),
    p('Designer Robin Williams summarised four core principles with the acronym **C.R.A.P.** — plus a few more every web designer should know:'),
    cards(
      ['Contrast', 'Make different things clearly different — size, colour, weight. Important items should stand out.', 'Eye'],
      ['Repetition', 'Reuse the same colours, fonts and styles everywhere so the site feels unified.', 'RefreshCw'],
      ['Alignment', 'Every element should line up with something else. Nothing is placed randomly.', 'LayoutTemplate'],
      ['Proximity', 'Group related items together; separate unrelated items with space.', 'Puzzle'],
      ['Visual hierarchy', 'Guide the eye from most to least important using size, colour and position.', 'Layers'],
      ['White space', 'Empty space is not wasted — it makes content easier to read and look premium.', 'Sparkles'],
    ),
    p('Switch each principle on in the simulator to watch a poorly designed card transform into a well-designed one.'),
    sim('design-principles'),
    h2('Usability: Making Sites Easy to Use'),
    p('Usability expert **Jakob Nielsen** defined 10 heuristics (rules of thumb). The most important ones for beginners are:'),
    table(['Heuristic', 'In simple words', 'Example'],
      ['Visibility of system status', 'Always tell users what is happening', 'Loading spinners, "Message sent ✔"'],
      ['Match the real world', 'Use familiar words and icons', 'A 🛒 cart icon for shopping'],
      ['User control & freedom', 'Let users undo and go back easily', '"Undo" and "Cancel" buttons'],
      ['Consistency', 'Same things look and work the same everywhere', 'Menu in the same place on every page'],
      ['Error prevention', 'Stop mistakes before they happen', 'Disable "Submit" until required fields are filled'],
      ['Recognition over recall', 'Show options instead of making users remember', 'Drop-down lists, recent searches'],
      ['Minimalist design', 'Remove anything that is not needed', 'A clean home page with one clear goal'],
    ),
    h2('Accessibility (a11y)'),
    p('**Web accessibility** means designing so that **everyone**, including people with visual, hearing, motor or cognitive disabilities, can use your website. The global standard is **WCAG** (Web Content Accessibility Guidelines).'),
    ul(
      'Give every image meaningful `alt` text.',
      'Keep text-to-background **contrast at least 4.5 : 1** (check it in the Colour Lab).',
      'Use real headings (`<h1>`–`<h6>`) and semantic tags so screen readers can navigate.',
      'Connect every form input to a `<label>`.',
      'Make sure the whole site works with only a **keyboard** (Tab, Enter).',
      'Provide captions for videos and never rely on colour alone to convey meaning.',
    ),
    h2('Semantic HTML5 Layout'),
    p('HTML5 introduced **semantic tags** that describe the *meaning* of each part of a page. They replace generic `<div>` soup and help search engines and screen readers.'),
    diagram('semantic-layout', 'Figure 12.1 — A typical semantic page layout'),
    table(['Tag', 'Used for'],
      ['`<header>`', 'Top section: logo, site title, introduction'],
      ['`<nav>`', 'Main navigation links'],
      ['`<main>`', 'The unique main content of the page (only one per page)'],
      ['`<section>`', 'A thematic group of content, usually with a heading'],
      ['`<article>`', 'Self-contained content: blog post, news story'],
      ['`<aside>`', 'Side content: related links, notices, sidebar'],
      ['`<footer>`', 'Bottom section: copyright, contact details, links'],
    ),
    tryit('Semantic page layout', `
<header><h1>🌿 Green City News</h1></header>
<nav><a href="#">Home</a> <a href="#">Events</a> <a href="#">Contact</a></nav>
<div class="wrap">
  <main>
    <article>
      <h2>Tree Plantation Drive</h2>
      <p>Volunteers planted 200 saplings in the city park this weekend.</p>
    </article>
  </main>
  <aside>
    <h3>Upcoming</h3>
    <p>Next drive: 10th March. Everyone is welcome!</p>
  </aside>
</div>
<footer>© 2025 Green City News</footer>`, `
body { margin: 0; font-family: sans-serif; }
header { background: #4f46e5; color: white; padding: 10px 16px; }
header h1 { margin: 0; font-size: 22px; }
nav { background: #e0e7ff; padding: 8px 16px; }
nav a { margin-right: 14px; color: #3730a3; }
.wrap { display: flex; gap: 12px; padding: 12px; }
main { flex: 3; background: #f8fafc; padding: 10px; border-radius: 8px; }
aside { flex: 1; background: #fef9c3; padding: 10px; border-radius: 8px; }
footer { background: #1e1b4b; color: #c7d2fe; text-align: center; padding: 8px; }`, undefined, 330),
    h2('The Web Design Process'),
    p('Professional websites are not built in one go. They follow a step-by-step **process** (life cycle):'),
    diagram('web-process', 'Figure 12.2 — Website development life cycle'),
    steps(
      ['Planning', 'Decide the purpose, target audience, goals and content of the website.'],
      ['Sitemap & wireframe', 'List all pages (sitemap) and sketch simple black-and-white layouts (wireframes).'],
      ['Visual design', 'Create detailed mockups with real colours, fonts and images in tools like Figma.'],
      ['Development', 'Write the HTML, CSS and JavaScript (and back-end code if needed).'],
      ['Testing', 'Check different browsers and devices; fix broken links, typos and bugs; validate the code.'],
      ['Launch', 'Buy a domain name, choose web hosting and upload (publish) the files.'],
      ['Maintenance', 'Keep content fresh, fix issues and improve based on user feedback.'],
    ),
    table(['Stage', 'What it looks like', 'Purpose'],
      ['Wireframe', 'Simple grey boxes and lines (low fidelity)', 'Plan structure and layout'],
      ['Mockup', 'Full-colour static design (high fidelity)', 'Show the final look'],
      ['Prototype', 'Clickable, interactive version', 'Test the user flow before coding'],
    ),
    h2('Publishing Your Website'),
    ul(
      "**Domain name** — your website's address, e.g. `myawesomesite.com` (rented yearly from a registrar).",
      '**Web hosting** — a server that stores your files and keeps them available 24 × 7.',
      '**Free options** — GitHub Pages, Netlify, Cloudflare Pages and Google Sites let you publish for free.',
      '**Uploading** — files are transferred using FTP, the hosting control panel or Git.',
    ),
    note('tip', 'Careers in this field include **UI Designer, UX Researcher, Front-end Developer, Full-stack Developer** and **Accessibility Specialist** — and you can start building your portfolio right now!', 'Career corner'),
  ],
  summary: [
    'UI is the look of an interface; UX is the overall experience of using it.',
    'C.R.A.P. — Contrast, Repetition, Alignment, Proximity — plus hierarchy and white space guide good design.',
    'Usability heuristics and WCAG accessibility rules make sites easy for everyone to use.',
    'Semantic tags (header, nav, main, section, article, aside, footer) describe page structure.',
    'The web design process: plan → wireframe → design → develop → test → launch → maintain.',
  ],
  exercises: [
    { q: 'Differentiate between UI and UX.', a: 'UI (User Interface) is the visual part users interact with — buttons, colours, fonts. UX (User Experience) is how easy and satisfying the whole interaction is.' },
    { q: 'Explain the principle of proximity with an example.', a: 'Related items should be placed close together so they are seen as a group, e.g. a product\'s name, price and "Add to cart" button grouped in one card.' },
    { q: 'List four ways to make a website accessible.', a: 'Alt text for images, sufficient colour contrast (4.5:1), labels for form fields, keyboard navigation (also semantic headings and video captions).' },
    { q: 'Name any five semantic HTML5 tags.', a: '<header>, <nav>, <main>, <article>, <section>, <aside>, <footer> (any five).' },
    { q: 'What is the difference between a wireframe and a mockup?', a: 'A wireframe is a simple low-fidelity sketch of layout and structure; a mockup is a high-fidelity, full-colour design showing how the final page will look.' },
  ],
};
