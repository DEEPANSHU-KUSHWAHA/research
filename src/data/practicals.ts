export interface Practical {
  id: string;
  title: string;
  aim: string;
  concepts: string[];
  html: string;
  height?: number;
}

const P = (id: string, title: string, aim: string, concepts: string[], html: string, height?: number): Practical => ({
  id, title, aim, concepts, html: html.trim(), height,
});

export const practicals: Practical[] = [
  P('p1', 'My Introduction Page', 'Create a web page that introduces yourself using headings, paragraphs, line breaks and a horizontal rule.',
    ['<h1>–<h3>', '<p>', '<br>', '<hr>', 'Document structure'], `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>About Me</title>
</head>
<body>
  <h1>Hello! I am Aarav Mehta</h1>
  <h3>Aspiring Web Designer · Chess Lover</h3>
  <hr>
  <h2>About Me</h2>
  <p>I live in Jaipur, Rajasthan. I love solving puzzles,<br>
     playing chess and building websites.</p>
  <h2>My Goal</h2>
  <p>I want to design websites and apps that are
     simple, beautiful and useful for everyone.</p>
  <hr>
  <p><i>Thank you for visiting my page!</i></p>
</body>
</html>`, 360),

  P('p2', 'Formulas & Text Formatting', 'Display chemical formulae, mathematical expressions and styled text using text-formatting tags.',
    ['<sub>', '<sup>', '<b>', '<i>', '<mark>', '<del>/<ins>'], `
<!DOCTYPE html>
<html>
<head><title>Formatting Tags</title></head>
<body>
  <h2>Chemistry Formulae</h2>
  <p>Water: H<sub>2</sub>O</p>
  <p>Sulphuric acid: H<sub>2</sub>SO<sub>4</sub></p>
  <p>Glucose: C<sub>6</sub>H<sub>12</sub>O<sub>6</sub></p>

  <h2>Mathematics</h2>
  <p>(a + b)<sup>2</sup> = a<sup>2</sup> + 2ab + b<sup>2</sup></p>
  <p>E = mc<sup>2</sup></p>

  <h2>Text Styles</h2>
  <p><b>Bold</b>, <i>Italic</i>, <u>Underline</u>, <mark>Highlighted</mark></p>
  <p>Old price <del>₹1200</del> New price <ins>₹899</ins></p>
</body>
</html>`, 400),

  P('p3', 'My Learning Roadmap (Lists)', 'Create a web page that shows a learning roadmap using ordered, unordered, nested and description lists.',
    ['<ol type start>', '<ul>', 'Nested lists', '<dl> <dt> <dd>'], `
<!DOCTYPE html>
<html>
<head><title>My Roadmap</title></head>
<body>
  <h2>My Web Design Roadmap</h2>
  <ol type="1">
    <li>HTML basics</li>
    <li>CSS styling</li>
    <li>Page layout
      <ul style="list-style-type: circle">
        <li>Flexbox</li>
        <li>CSS Grid</li>
      </ul>
    </li>
    <li>JavaScript</li>
  </ol>

  <h2>Practice Days</h2>
  <ol type="A" start="3">
    <li>Monday – HTML exercises</li>
    <li>Wednesday – CSS layouts</li>
  </ol>

  <h2>Key Terms</h2>
  <dl>
    <dt><b>HTML</b></dt><dd>HyperText Markup Language</dd>
    <dt><b>CSS</b></dt><dd>Cascading Style Sheets</dd>
  </dl>
</body>
</html>`, 460),

  P('p4', 'Favourite Tourist Place', 'Create a page about a tourist place with an image, an external link, an internal (bookmark) link and an e-mail link.',
    ['<img src alt width>', '<a href target>', 'Bookmark links', 'mailto:'], `
<!DOCTYPE html>
<html>
<head><title>Incredible India</title></head>
<body>
  <h1 id="top">The Taj Mahal, Agra</h1>
  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Taj_Mahal_%28Edited%29.jpeg/640px-Taj_Mahal_%28Edited%29.jpeg"
       alt="The Taj Mahal" width="320">
  <p>The Taj Mahal is a white marble mausoleum built by Shah Jahan in memory of Mumtaz Mahal.
     It is one of the Seven Wonders of the World.</p>
  <p>Read more on
    <a href="https://en.wikipedia.org/wiki/Taj_Mahal" target="_blank">Wikipedia</a>.</p>
  <p><a href="#contact">Go to contact section ⬇</a></p>
  <h2 id="contact">Contact</h2>
  <p>Questions? <a href="mailto:tourism@example.com">E-mail us</a></p>
  <p><a href="#top">Back to top ⬆</a></p>
</body>
</html>`, 470),

  P('p5', 'Weekly Schedule', 'Design a weekly schedule using a table with a caption, header cells, colspan and rowspan.',
    ['<table>', '<caption>', '<th>/<td>', 'colspan', 'rowspan'], `
<!DOCTYPE html>
<html>
<head><title>Weekly Schedule</title></head>
<body>
  <table border="1" cellpadding="8" cellspacing="0" style="text-align:center">
    <caption><b>MY WEEKLY SCHEDULE</b></caption>
    <tr style="background:#c7d2fe">
      <th>Day</th><th>7 AM</th><th>9 AM</th><th>1 PM</th><th>4 PM</th><th>7 PM</th>
    </tr>
    <tr>
      <th>Monday</th><td>Jog</td><td>Work</td>
      <td rowspan="5" style="background:#fde68a"><b>L<br>U<br>N<br>C<br>H</b></td>
      <td>Work</td><td>Guitar</td>
    </tr>
    <tr>
      <th>Tuesday</th><td>Yoga</td><td>Work</td>
      <td colspan="2" style="background:#bbf7d0">Online Coding Course</td>
    </tr>
    <tr>
      <th>Wednesday</th><td>Jog</td><td>Work</td><td>Work</td><td>Cooking</td>
    </tr>
    <tr>
      <th>Thursday</th><td>Yoga</td><td>Work</td><td>Meeting</td><td>Reading</td>
    </tr>
    <tr>
      <th>Friday</th><td colspan="2" style="background:#fecaca">Day Trip</td><td>Movies</td><td>Friends</td>
    </tr>
  </table>
</body>
</html>`, 330),

  P('p6', 'Feedback Form', 'Design a website feedback form using text, email, radio buttons, checkboxes, a drop-down list, a textarea and buttons.',
    ['<form>', '<input> types', '<select>', '<textarea>', '<label>', '<fieldset>'], `
<!DOCTYPE html>
<html>
<head><title>Feedback Form</title></head>
<body>
  <form action="#" method="post" onsubmit="event.preventDefault(); alert('Thank you for your feedback!');">
    <fieldset>
      <legend><b>Website Feedback</b></legend>
      <label>Name: <input type="text" name="name" required></label><br><br>
      <label>E-mail: <input type="email" name="email"></label><br><br>
      Age group:
      <select name="age">
        <option>Under 18</option><option selected>18–30</option><option>31–50</option><option>50+</option>
      </select><br><br>
      Rating:
      <input type="radio" name="rating" value="5" checked> Excellent
      <input type="radio" name="rating" value="3"> Good
      <input type="radio" name="rating" value="1"> Poor<br><br>
      Liked:
      <input type="checkbox" name="liked" value="design"> Design
      <input type="checkbox" name="liked" value="content"> Content
      <input type="checkbox" name="liked" value="speed"> Speed<br><br>
      Suggestions:<br>
      <textarea name="msg" rows="3" cols="35"></textarea><br><br>
      <input type="submit" value="Send">
      <input type="reset" value="Clear">
    </fieldset>
  </form>
</body>
</html>`, 430),

  P('p7', 'Styled Profile Card (CSS)', 'Create a profile card using internal CSS: colours, fonts, borders, border-radius, box-shadow, padding and margin.',
    ['Internal CSS', 'Class selectors', 'Box model', 'border-radius', 'box-shadow', ':hover'], `
<!DOCTYPE html>
<html>
<head>
<title>Profile Card</title>
<style>
  body { background: linear-gradient(135deg, #e0e7ff, #fae8ff); font-family: "Segoe UI", sans-serif;
         display: flex; justify-content: center; padding: 30px; }
  .card { background: white; width: 260px; padding: 24px; border-radius: 18px; text-align: center;
          box-shadow: 0 10px 25px rgba(0,0,0,.15); }
  .avatar { width: 90px; height: 90px; border-radius: 50%; border: 4px solid #818cf8; }
  h2 { margin: 10px 0 2px; color: #312e81; }
  .role { color: #6b7280; font-size: 14px; margin: 0 0 12px; }
  .skills span { display: inline-block; background: #eef2ff; color: #4338ca; padding: 4px 10px;
                 margin: 3px; border-radius: 99px; font-size: 12px; }
  .btn { display: inline-block; margin-top: 14px; padding: 8px 20px; background: #4f46e5; color: white;
         border-radius: 8px; text-decoration: none; transition: background .3s; }
  .btn:hover { background: #3730a3; }
</style>
</head>
<body>
  <div class="card">
    <img class="avatar" src="https://i.pravatar.cc/150?img=12" alt="Profile photo">
    <h2>Riya Sharma</h2>
    <p class="role">UI Designer · Front-end Developer</p>
    <div class="skills"><span>HTML</span><span>CSS</span><span>JavaScript</span></div>
    <a class="btn" href="#">Contact Me</a>
  </div>
</body>
</html>`, 400),

  P('p8', 'Flexbox Navbar & Cards', 'Build a café website header and a row of feature cards using CSS Flexbox.',
    ['display: flex', 'justify-content', 'align-items', 'gap', 'flex-wrap'], `
<!DOCTYPE html>
<html>
<head>
<title>Flexbox Layout</title>
<style>
  body { margin: 0; font-family: sans-serif; background: #f1f5f9; }
  nav { display: flex; justify-content: space-between; align-items: center; background: #0f766e;
        padding: 12px 24px; color: white; }
  nav ul { display: flex; gap: 20px; list-style: none; margin: 0; padding: 0; }
  nav a { color: #ccfbf1; text-decoration: none; }
  .features { display: flex; flex-wrap: wrap; gap: 16px; padding: 24px; justify-content: center; }
  .card { flex: 1 1 160px; max-width: 220px; background: white; padding: 18px; border-radius: 12px;
          box-shadow: 0 4px 10px rgba(0,0,0,.08); text-align: center; }
  .card div { font-size: 34px; }
</style>
</head>
<body>
  <nav>
    <b>☕ Bean &amp; Brew Café</b>
    <ul><li><a href="#">Home</a></li><li><a href="#">Menu</a></li><li><a href="#">Contact</a></li></ul>
  </nav>
  <section class="features">
    <div class="card"><div>☕</div><h3>Coffee</h3><p>Freshly roasted beans</p></div>
    <div class="card"><div>🥐</div><h3>Bakery</h3><p>Baked every morning</p></div>
    <div class="card"><div>📶</div><h3>Free Wi-Fi</h3><p>Work or relax</p></div>
  </section>
</body>
</html>`, 360),

  P('p9', 'Responsive Photo Gallery', 'Create a responsive image gallery using CSS Grid and media queries (1, 2 or 3 columns depending on width).',
    ['display: grid', 'grid-template-columns', '@media', 'object-fit', 'viewport meta'], `
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Gallery</title>
<style>
  body { font-family: sans-serif; margin: 16px; }
  .gallery { display: grid; grid-template-columns: 1fr; gap: 10px; }
  .gallery img { width: 100%; height: 130px; object-fit: cover; border-radius: 10px; }
  @media (min-width: 420px) { .gallery { grid-template-columns: 1fr 1fr; } }
  @media (min-width: 700px) { .gallery { grid-template-columns: repeat(3, 1fr); } }
</style>
</head>
<body>
  <h2>📷 Nature Gallery</h2>
  <div class="gallery">
    <img src="https://picsum.photos/id/1015/400/300" alt="River">
    <img src="https://picsum.photos/id/1016/400/300" alt="Canyon">
    <img src="https://picsum.photos/id/1018/400/300" alt="Mountains">
    <img src="https://picsum.photos/id/1019/400/300" alt="Sea">
    <img src="https://picsum.photos/id/1039/400/300" alt="Waterfall">
    <img src="https://picsum.photos/id/1043/400/300" alt="Forest">
  </div>
</body>
</html>`, 480),

  P('p10', 'Simple Calculator (JavaScript)', 'Create a calculator that adds, subtracts, multiplies and divides two numbers using JavaScript functions and events.',
    ['Functions', 'onclick', 'getElementById', 'Number()', 'if…else'], `
<!DOCTYPE html>
<html>
<head>
<title>Calculator</title>
<style>
  body { font-family: sans-serif; display: flex; justify-content: center; padding: 20px; }
  .calc { background: #fefce8; padding: 20px; border-radius: 14px; box-shadow: 0 4px 14px rgba(0,0,0,.1); }
  input { width: 90px; padding: 8px; font-size: 16px; }
  button { width: 44px; height: 40px; font-size: 18px; margin: 4px; border-radius: 8px; border: none;
           background: #eab308; cursor: pointer; }
  #result { font-size: 22px; font-weight: bold; margin-top: 12px; color: #854d0e; }
</style>
</head>
<body>
  <div class="calc">
    <h3>🧮 Calculator</h3>
    <input id="a" type="number" value="12"> <input id="b" type="number" value="4"><br>
    <button onclick="calc('+')">+</button>
    <button onclick="calc('-')">−</button>
    <button onclick="calc('*')">×</button>
    <button onclick="calc('/')">÷</button>
    <div id="result">Result: </div>
  </div>
  <script>
    function calc(op) {
      const a = Number(document.getElementById("a").value);
      const b = Number(document.getElementById("b").value);
      let r;
      if (op === "+") r = a + b;
      else if (op === "-") r = a - b;
      else if (op === "*") r = a * b;
      else r = b === 0 ? "Cannot divide by 0" : a / b;
      document.getElementById("result").innerHTML = "Result: " + r;
    }
  </script>
</body>
</html>`, 300),

  P('p11', 'Step Tracker (JavaScript)', 'Accept the step counts for five days, then calculate the total, the daily average and an activity rating using JavaScript.',
    ['Loops', 'querySelectorAll()', 'if…else if', 'toFixed()', 'DOM output'], `
<!DOCTYPE html>
<html>
<head>
<title>Step Tracker</title>
<style>
  body { font-family: sans-serif; padding: 16px; }
  input { width: 70px; padding: 6px; margin: 3px; }
  button { padding: 8px 16px; background: #4f46e5; color: white; border: none; border-radius: 6px; cursor: pointer; }
  #out { margin-top: 12px; font-size: 18px; }
</style>
</head>
<body>
  <h3>👟 Weekly Step Tracker</h3>
  <p>Enter your steps for five days:</p>
  <input class="s" value="8200"> <input class="s" value="10450"> <input class="s" value="6300">
  <input class="s" value="12000"> <input class="s" value="9100"><br><br>
  <button onclick="track()">Calculate</button>
  <div id="out"></div>
  <script>
    function track() {
      const boxes = document.querySelectorAll(".s");
      let total = 0;
      for (let i = 0; i < boxes.length; i++) {
        total += Number(boxes[i].value);
      }
      const avg = total / boxes.length;
      let rating;
      if (avg >= 10000) rating = "Excellent 🏆";
      else if (avg >= 7500) rating = "Very good 💪";
      else if (avg >= 5000) rating = "Good 👍";
      else rating = "Let's move more! 🚶";
      document.getElementById("out").innerHTML =
        "Total: <b>" + total + " steps</b><br>Daily average: <b>" + avg.toFixed(0) + "</b><br>Rating: <b>" + rating + "</b>";
    }
  </script>
</body>
</html>`, 320),

  P('p12', 'Mini Project: Personal Portfolio', 'Combine HTML, CSS and JavaScript to build a one-page portfolio with semantic layout, styled sections and a dark-mode toggle.',
    ['Semantic tags', 'Flexbox', 'CSS variables', 'classList.toggle', 'Events'], `
<!DOCTYPE html>
<html lang="en">
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>My Portfolio</title>
<style>
  :root { --bg: #ffffff; --text: #1e293b; --card: #f1f5f9; --accent: #6366f1; }
  body.dark { --bg: #0f172a; --text: #e2e8f0; --card: #1e293b; }
  body { margin: 0; font-family: "Segoe UI", sans-serif; background: var(--bg); color: var(--text); transition: .3s; }
  header { display: flex; justify-content: space-between; align-items: center; padding: 14px 24px;
           background: var(--accent); color: white; }
  header button { background: white; border: none; border-radius: 99px; padding: 6px 14px; cursor: pointer; }
  .hero { text-align: center; padding: 40px 20px; }
  .hero h1 { margin: 0; font-size: 34px; }
  .hero span { color: var(--accent); }
  .projects { display: flex; flex-wrap: wrap; gap: 14px; justify-content: center; padding: 0 20px 30px; }
  .project { background: var(--card); padding: 16px; border-radius: 12px; width: 180px; }
  footer { text-align: center; padding: 14px; font-size: 13px; opacity: .7; }
</style>
</head>
<body>
  <header>
    <b>Riya.dev</b>
    <button onclick="toggleTheme()">🌙 Dark mode</button>
  </header>
  <main>
    <section class="hero">
      <h1>Hi, I'm <span>Riya</span> 👋</h1>
      <p>Self-taught designer who loves building for the web.</p>
    </section>
    <section class="projects">
      <article class="project"><h3>🧮 Calculator</h3><p>JavaScript functions & events.</p></article>
      <article class="project"><h3>📷 Gallery</h3><p>Responsive CSS Grid layout.</p></article>
      <article class="project"><h3>📝 Forms</h3><p>Validated sign-up form.</p></article>
    </section>
  </main>
  <footer>© 2025 Riya Sharma · Made with HTML, CSS & JS</footer>
  <script>
    function toggleTheme() {
      document.body.classList.toggle("dark");
      const btn = document.querySelector("header button");
      btn.textContent = document.body.classList.contains("dark") ? "☀️ Light mode" : "🌙 Dark mode";
    }
  </script>
</body>
</html>`, 460),
];
