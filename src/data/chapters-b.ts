import { type Chapter, h2, h3, p, ol, code, tryit, note, table, sim, cards, compare, diagram, PEXELS } from './types';

export const ch5: Chapter = {
  id: 'tables', num: 5, unit: 1,
  title: 'HTML Tables', short: 'Tables',
  tagline: 'Organise data into rows and columns — price lists, schedules, scores and comparisons.',
  color: 'amber', icon: 'Table', image: PEXELS.laptop, minutes: 25,
  objectives: [
    'Create tables using `<table>`, `<tr>`, `<th>` and `<td>`',
    'Add captions and group rows with `<thead>`, `<tbody>` and `<tfoot>`',
    'Merge cells using colspan and rowspan',
    'Style tables with HTML attributes and with CSS',
  ],
  blocks: [
    h2('Why Use Tables?'),
    p('Tables arrange data in **rows** and **columns** — perfect for price lists, schedules, sports scores and comparisons. In HTML a table is built **row by row**: first create a row, then fill it with cells.'),
    table(['Tag', 'Name', 'Purpose'],
      ['`<table>`', 'Table', 'Container for the entire table'],
      ['`<caption>`', 'Caption', 'Title of the table (written just after `<table>`)'],
      ['`<tr>`', 'Table row', 'Creates a horizontal row'],
      ['`<th>`', 'Table header', 'Header cell — bold and centred by default'],
      ['`<td>`', 'Table data', 'A normal data cell'],
      ['`<thead>` `<tbody>` `<tfoot>`', 'Row groups', 'Group the header, body and footer rows'],
    ),
    tryit('A simple price list', `
<table border="1" cellpadding="8">
  <caption>Café Menu</caption>
  <tr>
    <th>Item</th>
    <th>Size</th>
    <th>Price</th>
  </tr>
  <tr>
    <td>Cappuccino</td>
    <td>Regular</td>
    <td>₹180</td>
  </tr>
  <tr>
    <td>Green tea</td>
    <td>Large</td>
    <td>₹120</td>
  </tr>
</table>`),
    h2('Table Attributes'),
    p('Older HTML used attributes to style tables. Browsers still support them, but modern websites use **CSS** instead.'),
    table(['Attribute', 'Purpose', 'Modern CSS equivalent'],
      ['border="1"', 'Border thickness around cells', '`border: 1px solid black;`'],
      ['cellpadding="8"', 'Space inside each cell', '`padding: 8px;`'],
      ['cellspacing="0"', 'Space between cells', '`border-collapse: collapse;`'],
      ['width="80%"', 'Width of the table', '`width: 80%;`'],
      ['align="center"', 'Alignment of the table / cell content', '`margin: auto;` / `text-align: center;`'],
      ['bgcolor="yellow"', 'Background colour', '`background-color: yellow;`'],
    ),
    h2('Merging Cells: colspan & rowspan'),
    p('`colspan` makes a cell stretch **across** several columns; `rowspan` makes it stretch **down** several rows. Both are written on `<td>` or `<th>`. Remember to leave out the cells that are covered by the merged cell!'),
    tryit('Weekly plan with merged cells', `
<table border="1" cellpadding="8" style="border-collapse:collapse;text-align:center">
  <caption><b>My Weekly Fitness Plan</b></caption>
  <tr style="background:#fef3c7">
    <th>Day</th><th>6 AM</th><th>7 AM</th><th>1 PM</th><th>6 PM</th>
  </tr>
  <tr>
    <th>Mon</th><td>Jog</td><td>Stretch</td>
    <td rowspan="3" style="background:#fde68a">LUNCH<br>BREAK</td>
    <td>Gym</td>
  </tr>
  <tr>
    <th>Tue</th><td colspan="2" style="background:#dcfce7">Yoga class (2 hours)</td><td>Swim</td>
  </tr>
  <tr>
    <th>Wed</th><td>Cycle</td><td>Stretch</td><td>Dance</td>
  </tr>
</table>`, undefined, undefined, 280),
    p('Experiment with the **Table Builder**: click any cell, increase its colspan or rowspan and watch both the table and the generated HTML change.'),
    sim('table-builder'),
    h2('Styling Tables with CSS'),
    tryit('Modern striped table', `
<table>
  <thead>
    <tr><th>Rank</th><th>Language</th><th>Used for</th></tr>
  </thead>
  <tbody>
    <tr><td>1</td><td>HTML</td><td>Structure</td></tr>
    <tr><td>2</td><td>CSS</td><td>Style</td></tr>
    <tr><td>3</td><td>JavaScript</td><td>Behaviour</td></tr>
    <tr><td>4</td><td>Python</td><td>Back-end</td></tr>
  </tbody>
</table>`, `
table { border-collapse: collapse; width: 100%; font-family: sans-serif; }
th { background: #d97706; color: white; }
th, td { padding: 10px 14px; text-align: left; }
tbody tr:nth-child(even) { background: #fef3c7; }
tbody tr:hover { background: #fde68a; }`),
    note('warning', 'Use tables only for **tabular data**, never for page layout. Layouts should be built with CSS Flexbox or Grid (Chapter 9).'),
  ],
  summary: [
    'A table is made of rows (`<tr>`) containing header cells (`<th>`) or data cells (`<td>`).',
    '`<caption>` gives the table a title; `<thead>`, `<tbody>` and `<tfoot>` group rows.',
    'colspan merges cells horizontally; rowspan merges cells vertically.',
    'Attributes like border, cellpadding and cellspacing are older ways to style tables.',
    'CSS (border-collapse, padding, nth-child) is the modern way to style tables.',
  ],
  exercises: [
    { q: 'What is the difference between <th> and <td>?', a: '<th> defines a header cell (bold and centred by default); <td> defines a normal data cell.' },
    { q: 'Differentiate between cellpadding and cellspacing.', a: 'cellpadding is the space between the cell border and its content; cellspacing is the space between neighbouring cells.' },
    { q: 'Write the code for a header cell that spans 3 columns with the text "Prices".', a: '<th colspan="3">Prices</th>' },
    { q: 'Which CSS property removes the double borders between table cells?', a: 'border-collapse: collapse;' },
    { q: 'Why should tables not be used for page layout?', a: 'They make code complex, are hard to make responsive and confuse screen readers. CSS Flexbox/Grid should be used for layout.' },
  ],
};

export const ch6: Chapter = {
  id: 'forms', num: 6, unit: 1,
  title: 'HTML Forms', short: 'Forms',
  tagline: 'Collect information from users with text boxes, buttons, drop-downs and more.',
  color: 'violet', icon: 'ClipboardList', image: PEXELS.team, minutes: 30,
  objectives: [
    'Create forms using `<form>` with the action and method attributes',
    'Differentiate between the GET and POST methods',
    'Use the main input types and form controls',
    'Apply useful attributes such as required, placeholder and name',
  ],
  blocks: [
    h2('What is an HTML Form?'),
    p('A **form** collects information from users — login pages, sign-up pages, feedback, checkout and search boxes are all forms. When the user clicks **Submit**, the data is sent to a server for processing as **name = value** pairs.'),
    code('html', `
<form action="/register" method="post">
  <!-- form controls go here -->
</form>`),
    table(['Form attribute', 'Purpose'],
      ['action', 'The URL / server script that receives the data'],
      ['method', 'How data is sent: GET or POST'],
      ['name', 'A name to identify the form'],
      ['target', 'Where to show the response (_self, _blank)'],
      ['enctype', 'Encoding type — use multipart/form-data when uploading files'],
    ),
    compare('GET method', [
      'Data is added to the URL: `?name=Riya&city=Pune`',
      'Visible in the address bar — never use for passwords',
      'Limited length (about 2000 characters)',
      'Can be bookmarked; used for search forms',
    ], 'POST method', [
      'Data is sent inside the body of the request',
      'Not visible in the URL — more secure',
      'No practical size limit; supports file uploads',
      'Used for login, registration and payments',
    ]),
    h2('The <input> Element'),
    p('`<input>` is an **empty** tag that creates many different controls depending on its `type` attribute.'),
    table(['type', 'Creates', 'Example use'],
      ['text', 'Single-line text box', 'Name, city'],
      ['password', 'Text box that hides characters', 'Password'],
      ['email', 'Text box that checks for a valid e-mail', 'E-mail address'],
      ['number', 'Number box with arrows (min, max, step)', 'Age, quantity'],
      ['tel / url', 'Phone number / web address', 'Contact details'],
      ['date / time', 'Date or time picker', 'Date of birth'],
      ['radio', 'Choose **one** option from a group (same name)', 'Gender, T-shirt size'],
      ['checkbox', 'Choose **many** options', 'Hobbies, accept terms'],
      ['range', 'Slider', 'Volume, rating'],
      ['color', 'Colour picker', 'Favourite colour'],
      ['file', 'File-upload button', 'Photo, document'],
      ['submit / reset', 'Button to send / clear the form', 'Submit, Reset'],
      ['hidden', 'Invisible field sent with the form', 'User ID'],
    ),
    h2('Other Form Controls'),
    table(['Tag', 'Purpose'],
      ['`<label for="id">`', 'Caption for a control; clicking it focuses the control (better accessibility)'],
      ['`<textarea rows cols>`', 'Multi-line text box — address, comments'],
      ['`<select>` + `<option>`', 'Drop-down list; add `multiple` to allow several choices'],
      ['`<button>`', 'Clickable button (type = submit, reset or button)'],
      ['`<fieldset>` + `<legend>`', 'Groups related controls inside a box with a title'],
      ['`<datalist>`', 'Gives suggestions for a text input'],
    ),
    h3('Useful Input Attributes'),
    table(['Attribute', 'Effect'],
      ['name', 'Name of the data sent to the server (name=value)'],
      ['value', 'Default / initial value'],
      ['placeholder', 'Grey hint text shown inside an empty box'],
      ['required', 'The form cannot be submitted if this is empty'],
      ['readonly / disabled', 'Cannot be edited / is greyed out and not sent'],
      ['maxlength', 'Maximum number of characters allowed'],
      ['min / max / step', 'Limits for number, range and date inputs'],
      ['checked / selected', 'Pre-selects a radio button or checkbox / an option'],
      ['autofocus', 'Places the cursor here when the page loads'],
    ),
    tryit('Workshop sign-up form', `
<form onsubmit="event.preventDefault(); alert('Form submitted! Thank you.');">
  <fieldset>
    <legend>Workshop Sign-up</legend>

    <label for="name">Full name:</label><br>
    <input type="text" id="name" name="name" placeholder="e.g. Priya Sharma" required><br><br>

    <label for="email">E-mail:</label><br>
    <input type="email" id="email" name="email" placeholder="you@example.com"><br><br>

    <label for="dob">Date of birth:</label>
    <input type="date" id="dob" name="dob"><br><br>

    Experience:
    <input type="radio" id="beg" name="level" value="beginner" checked>
    <label for="beg">Beginner</label>
    <input type="radio" id="mid" name="level" value="intermediate">
    <label for="mid">Intermediate</label>
    <input type="radio" id="adv" name="level" value="advanced">
    <label for="adv">Advanced</label><br><br>

    Hobbies:
    <input type="checkbox" name="hobby" value="coding"> Coding
    <input type="checkbox" name="hobby" value="music"> Music
    <input type="checkbox" name="hobby" value="sports"> Sports<br><br>

    <label for="city">City:</label>
    <select id="city" name="city">
      <option>Delhi</option>
      <option>Mumbai</option>
      <option selected>Bengaluru</option>
    </select><br><br>

    <label for="addr">Address:</label><br>
    <textarea id="addr" name="address" rows="3" cols="30"></textarea><br><br>

    <input type="submit" value="Register">
    <input type="reset" value="Clear">
  </fieldset>
</form>`, `
body { font-family: sans-serif; }
fieldset { border: 2px solid #8b5cf6; border-radius: 10px; padding: 16px; }
legend { font-weight: bold; color: #6d28d9; padding: 0 6px; }
input[type=text], input[type=email], textarea, select { padding: 6px; border: 1px solid #c4b5fd; border-radius: 6px; }
input[type=submit] { background: #7c3aed; color: white; border: none; padding: 8px 18px; border-radius: 6px; cursor: pointer; }`, undefined, 560),
    note('tip', 'Radio buttons that share the **same name** form a group — selecting one automatically deselects the others. Checkboxes are independent.'),
    h2('Build Your Own Form'),
    p('Add fields to the form below, choose GET or POST and press **Submit** to see exactly what data a server would receive.'),
    sim('form-builder'),
  ],
  summary: [
    'Forms collect user input; `<form>` uses action (where to send) and method (how to send).',
    'GET adds data to the URL (visible, limited); POST sends it in the request body (secure, unlimited).',
    '`<input>` creates many controls based on type: text, password, email, radio, checkbox, date, file, submit…',
    '`<textarea>`, `<select>`/`<option>`, `<button>`, `<label>` and `<fieldset>` are other form elements.',
    'Attributes like name, placeholder, required, maxlength and checked control behaviour and validation.',
  ],
  exercises: [
    { q: 'Differentiate between radio buttons and checkboxes.', a: 'Radio buttons with the same name allow only one choice from a group; checkboxes allow selecting multiple options independently.' },
    { q: 'Why should the POST method be used for a login form?', a: 'POST sends data in the request body, so the password does not appear in the URL, browser history or bookmarks.' },
    { q: 'Write HTML for a drop-down list of three cities with Mumbai pre-selected.', a: '<select name="city"><option>Delhi</option><option selected>Mumbai</option><option>Chennai</option></select>' },
    { q: 'What is the purpose of the <label> tag?', a: 'It provides a caption for a form control. When linked with for="id", clicking the label focuses the control, improving usability and accessibility.' },
    { q: 'Which attribute makes it compulsory to fill in a field?', a: 'required — e.g. <input type="text" name="name" required>' },
  ],
};

export const ch7: Chapter = {
  id: 'css-basics', num: 7, unit: 2,
  title: 'Introduction to CSS', short: 'CSS Basics',
  tagline: 'Give your pages style — syntax, three ways of adding CSS, selectors and the cascade.',
  color: 'pink', icon: 'Paintbrush', image: 'images/ch-css.jpg', minutes: 35,
  objectives: [
    'Explain what CSS is and why we separate style from structure',
    'Write CSS rules using selectors, properties and values',
    'Apply inline, internal and external CSS',
    'Use element, class, ID, group, descendant and pseudo-class selectors',
    'Understand the cascade, specificity and inheritance',
  ],
  blocks: [
    h2('What is CSS?'),
    p('**CSS (Cascading Style Sheets)** is the language used to describe how HTML elements should look — colours, fonts, spacing, layout and even animations. HTML builds the structure; CSS decorates it.'),
    p('Think of a house: **HTML** is the bricks and walls, **CSS** is the paint, furniture and decoration, and **JavaScript** is the electricity that makes things work.'),
    cards(
      ['Saves time', 'One external CSS file can style hundreds of pages. Change it once — every page updates.', 'Zap'],
      ['Consistent design', 'All pages share the same fonts, colours and layout for a professional look.', 'Layers'],
      ['Cleaner HTML', 'Separating content (HTML) from presentation (CSS) makes code easier to read and maintain.', 'FileText'],
      ['Responsive', 'Media queries let one page adapt to phones, tablets and desktops.', 'MonitorSmartphone'],
    ),
    note('fact', 'CSS was proposed by **Håkon Wium Lie** in 1994 and became a W3C recommendation (CSS1) in 1996. Today we use CSS3, which is split into many modules.'),
    h2('CSS Syntax'),
    p('A CSS **rule** has a **selector** (which elements to style) and a **declaration block** inside curly braces. Each **declaration** is a **property: value;** pair ending with a semicolon.'),
    diagram('css-syntax', 'Figure 7.1 — Parts of a CSS rule'),
    h2('Three Ways to Add CSS'),
    h3('1. Inline CSS'),
    p('Written inside an element using the `style` attribute. It affects only that one element.'),
    code('html', `<h1 style="color: blue; text-align: center;">Welcome</h1>`),
    h3('2. Internal (Embedded) CSS'),
    p('Written inside a `<style>` tag in the `<head>` section. It affects the whole page.'),
    code('html', `
<head>
  <style>
    body { background-color: #f0f9ff; }
    h1   { color: navy; }
  </style>
</head>`),
    h3('3. External CSS'),
    p('Written in a separate `.css` file and connected using the `<link>` tag. One file can style an entire website — this is the **recommended** method.'),
    code('html', `<link rel="stylesheet" href="style.css">`, 'index.html'),
    code('css', `
/* style.css */
body { font-family: Arial, sans-serif; }
h1 { color: navy; }`, 'style.css'),
    table(['Method', 'Where it is written', 'Scope', 'Best for'],
      ['Inline', 'style attribute of a tag', 'One element', 'Quick tests, one-off changes'],
      ['Internal', '`<style>` in `<head>`', 'One page', 'Single-page websites'],
      ['External', 'Separate .css file', 'Whole website', 'Real websites (recommended)'],
    ),
    note('info', 'If the same property is set in several places, the priority is: **Inline > Internal / External** (whichever comes later) **> Browser default**.'),
    tryit('Internal CSS in action', `
<!DOCTYPE html>
<html>
<head>
<style>
  body { background: #fdf2f8; font-family: Georgia, serif; }
  h1 { color: #be185d; text-align: center; border-bottom: 3px solid #f9a8d4; }
  p { color: #374151; font-size: 18px; line-height: 1.6; }
  .note { background: #fce7f3; padding: 10px; border-left: 5px solid #db2777; }
</style>
</head>
<body>
  <h1>I am styled with CSS</h1>
  <p>This paragraph uses internal CSS defined in the head.</p>
  <p class="note">This paragraph has the class "note".</p>
  <p style="color: green;">This one uses inline CSS, which wins!</p>
</body>
</html>`, undefined, undefined, 320),
    h2('CSS Selectors'),
    p('Selectors decide **which** elements a rule applies to. Mastering selectors is the key to writing good CSS.'),
    table(['Selector', 'Example', 'Selects'],
      ['Universal', '`* { }`', 'Every element'],
      ['Element / Type', '`p { }`', 'All `<p>` elements'],
      ['Class', '`.note { }`', 'Elements with class="note" (reusable)'],
      ['ID', '`#header { }`', 'The one element with id="header" (unique)'],
      ['Group', '`h1, h2, h3 { }`', 'All h1, h2 and h3 elements'],
      ['Descendant', '`div p { }`', '`<p>` anywhere inside a `<div>`'],
      ['Child', '`ul > li { }`', '`<li>` that are direct children of `<ul>`'],
      ['Adjacent sibling', '`h2 + p { }`', 'The `<p>` immediately after an `<h2>`'],
      ['Attribute', '`a[target] { }`', '`<a>` elements that have a target attribute'],
      ['Pseudo-class', '`a:hover`, `li:first-child`', 'Elements in a special state or position'],
      ['Pseudo-element', '`p::first-line`, `::before`', 'A specific part of an element'],
    ),
    p('Try it! Type any selector in the **Selector Lab** and the matching elements light up instantly, along with their specificity score.'),
    sim('selector-lab'),
    h2('Cascade, Specificity & Inheritance'),
    p('**Cascade** means that when two rules target the same element, the browser follows these rules to decide which one wins:'),
    ol(
      '**Importance** — a declaration marked `!important` beats normal ones (use rarely!).',
      '**Specificity** — the more specific selector wins: inline style (1000) > ID (100) > class, attribute, pseudo-class (10) > element (1).',
      '**Source order** — if specificity is equal, the rule written **later** wins.',
    ),
    p('**Inheritance** means some properties such as `color`, `font-family` and `line-height` pass from a parent to its children automatically. Others, like `border`, `margin` and `padding`, are not inherited.'),
    tryit('Which colour wins?', `
<p id="intro" class="lead">What colour am I?</p>
<p class="lead">And me?</p>
<p>Plain paragraph</p>`, `
p { color: gray; }          /* specificity 0-0-1 */
.lead { color: green; }     /* specificity 0-1-0 */
#intro { color: crimson; }  /* specificity 1-0-0 — wins! */
p { font-size: 20px; font-family: sans-serif; }`, undefined, 200),
    h2('CSS Units'),
    table(['Unit', 'Type', 'Meaning'],
      ['px', 'Absolute', 'Pixels — a fixed size on screen'],
      ['pt', 'Absolute', 'Points (1pt = 1/72 inch) — mostly for print'],
      ['%', 'Relative', 'Percentage of the parent element'],
      ['em', 'Relative', 'Relative to the font-size of the parent (2em = 2×)'],
      ['rem', 'Relative', 'Relative to the font-size of the root `<html>` element'],
      ['vw / vh', 'Relative', '1% of the viewport (browser window) width / height'],
    ),
    h2('CSS Comments'),
    code('css', `
/* This is a CSS comment — the browser ignores it */
h1 { color: teal; } /* Comments can also be at the end of a line */`),
  ],
  summary: [
    'CSS (Cascading Style Sheets) controls the presentation of HTML: colours, fonts, spacing and layout.',
    'A rule = selector + { property: value; } declarations.',
    'CSS can be inline (style attribute), internal (`<style>` tag) or external (.css file via `<link>`).',
    'Selectors target elements by type, class (.), ID (#), relationship, attribute or state (:hover).',
    'Conflicts are resolved by importance, specificity and source order; some properties are inherited.',
    'Units can be absolute (px, pt) or relative (%, em, rem, vw, vh).',
  ],
  exercises: [
    { q: 'Write a CSS rule to make all <h2> headings red and centred.', a: 'h2 { color: red; text-align: center; }' },
    { q: 'Differentiate between a class selector and an ID selector.', a: 'A class (.name) can be used on many elements; an ID (#name) must be unique on a page. ID selectors have higher specificity (100) than class selectors (10).' },
    { q: 'Which way of adding CSS is best for a website with many pages? Why?', a: 'External CSS — one .css file is linked to every page, so the whole site can be restyled by editing a single file. It also keeps HTML clean and is cached by the browser.' },
    { q: 'If p { color: blue } and .note { color: green } both apply to <p class="note">, what colour is it?', a: 'Green — the class selector has higher specificity than the element selector.' },
    { q: 'What is the difference between em and rem?', a: 'em is relative to the font size of the parent element; rem is relative to the font size of the root (html) element.' },
  ],
};

export const ch8: Chapter = {
  id: 'colors-type', num: 8, unit: 2,
  title: 'Colours, Typography & Backgrounds', short: 'Colour & Type',
  tagline: 'Use colour theory and beautiful typography to make pages attractive and readable.',
  color: 'fuchsia', icon: 'Palette', image: 'images/ch-color.jpg', minutes: 30,
  objectives: [
    'Write colours as names, HEX, RGB(A) and HSL values',
    'Apply basic colour theory and colour psychology',
    'Style text with font and text properties',
    'Use background colours, images and gradients',
  ],
  blocks: [
    h2('Ways to Write Colours in CSS'),
    table(['Format', 'Example', 'Explanation'],
      ['Colour name', '`color: tomato;`', '140+ named colours such as red, navy, gold, tomato'],
      ['HEX', '`color: #FF6347;`', '#RRGGBB — two hexadecimal digits (00–FF) each for red, green and blue'],
      ['Short HEX', '`color: #F63;`', 'Shorthand when the pairs repeat: #F63 = #FF6633'],
      ['RGB', '`color: rgb(255, 99, 71);`', 'Red, green and blue values from 0 to 255'],
      ['RGBA', '`color: rgba(255, 99, 71, 0.5);`', 'RGB + alpha (opacity) from 0 (transparent) to 1 (solid)'],
      ['HSL', '`color: hsl(9, 100%, 64%);`', 'Hue (0–360° on the colour wheel), Saturation, Lightness'],
    ),
    p('Screens create every colour by mixing **red, green and blue** light — the **RGB additive model**. With 256 levels per channel a screen can show 256 × 256 × 256 = **16.7 million colours**. Play with the sliders in the Colour Lab to see how it works.'),
    sim('color-lab'),
    h2('Colour Theory for Designers'),
    cards(
      ['Complementary', 'Opposite colours on the wheel, e.g. blue & orange. Very high contrast — great for call-to-action buttons.', 'Target'],
      ['Analogous', 'Neighbouring colours, e.g. blue, teal & green. Calm and harmonious — good for backgrounds.', 'Layers'],
      ['Triadic', 'Three evenly spaced colours, e.g. red, yellow & blue. Vibrant yet balanced.', 'Atom'],
      ['Monochromatic', 'Different shades and tints of one colour. Clean, elegant and easy to get right.', 'Palette'],
    ),
    table(['Colour', 'Feeling / Association', 'Often used by'],
      ['🔵 Blue', 'Trust, calm, security', 'Banks, social media (Facebook, LinkedIn)'],
      ['🔴 Red', 'Energy, urgency, excitement', 'Food brands, sales, YouTube'],
      ['🟢 Green', 'Nature, growth, success', 'Health, environment, finance'],
      ['🟡 Yellow', 'Optimism, happiness, attention', 'Warnings, children\'s brands'],
      ['🟣 Purple', 'Creativity, luxury, wisdom', 'Beauty and education brands'],
      ['⚫ Black', 'Elegance, power', 'Luxury and fashion brands'],
    ),
    note('tip', 'Follow the **60-30-10 rule**: 60% dominant (usually neutral) colour, 30% secondary colour and 10% accent colour for buttons and highlights.'),
    h2('Typography — Styling Text'),
    p('**Typography** is the art of arranging text so that it is readable and attractive. Good typography is one of the biggest factors in how professional a website looks.'),
    table(['Property', 'Example', 'Effect'],
      ['font-family', '`font-family: "Segoe UI", Arial, sans-serif;`', 'Font to use; list fallbacks and end with a generic family'],
      ['font-size', '`font-size: 18px;`', 'Size of the text'],
      ['font-weight', '`font-weight: bold;` or `700`', 'Thickness: 100 (thin) to 900 (black)'],
      ['font-style', '`font-style: italic;`', 'normal or italic'],
      ['color', '`color: #333;`', 'Text colour'],
      ['text-align', '`text-align: center;`', 'left, right, center, justify'],
      ['text-decoration', '`text-decoration: underline;`', 'underline, overline, line-through, none'],
      ['text-transform', '`text-transform: uppercase;`', 'uppercase, lowercase, capitalize'],
      ['line-height', '`line-height: 1.6;`', 'Space between lines'],
      ['letter-spacing', '`letter-spacing: 2px;`', 'Space between characters'],
      ['word-spacing', '`word-spacing: 5px;`', 'Space between words'],
      ['text-shadow', '`text-shadow: 2px 2px 4px gray;`', 'Shadow behind text'],
    ),
    table(['Generic family', 'Look', 'Examples'],
      ['serif', 'Small "feet" on letters — classic, formal', 'Times New Roman, Georgia'],
      ['sans-serif', 'No feet — clean, modern, best for screens', 'Arial, Verdana, Helvetica'],
      ['monospace', 'Every letter has the same width', 'Courier New, Consolas'],
      ['cursive', 'Handwriting style', 'Comic Sans MS, Brush Script'],
      ['fantasy', 'Decorative, playful', 'Impact, Papyrus'],
    ),
    sim('typography'),
    note('tip', 'For readable text use a body size of **16px or more**, line-height **1.5–1.7**, no more than **2–3 fonts** per site, and about **50–75 characters** per line.'),
    h2('Backgrounds'),
    table(['Property', 'Example / Values'],
      ['background-color', '`background-color: lightyellow;`'],
      ['background-image', '`background-image: url("bg.jpg");`'],
      ['background-repeat', '`repeat` | `repeat-x` | `repeat-y` | `no-repeat`'],
      ['background-size', '`cover` (fill the area) | `contain` (fit whole image) | `200px`'],
      ['background-position', '`center` | `top right` | `50% 50%`'],
      ['background-attachment', '`fixed` keeps the image still while the page scrolls'],
      ['Gradients', '`linear-gradient(to right, red, yellow)` / `radial-gradient(circle, white, blue)`'],
    ),
    tryit('Backgrounds, gradients & shadows', `
<div class="box gradient">Linear gradient</div>
<div class="box radial">Radial gradient</div>
<div class="box photo">Background image</div>`, `
body { font-family: sans-serif; display: grid; gap: 12px; }
.box { height: 80px; border-radius: 14px; display: flex; align-items: center; justify-content: center;
  color: white; font-size: 20px; font-weight: bold; text-shadow: 1px 1px 3px rgba(0,0,0,.5);
  box-shadow: 0 6px 16px rgba(0,0,0,.2); }
.gradient { background: linear-gradient(135deg, #f43f5e, #f59e0b); }
.radial { background: radial-gradient(circle, #e879f9, #581c87); }
.photo { background-image: url("https://picsum.photos/id/1015/600/200"); background-size: cover; background-position: center; }`, undefined, 330),
    h2('Borders, Corners & Shadows'),
    code('css', `
.card {
  border: 2px solid #6366f1;                  /* width  style  colour */
  border-radius: 12px;                        /* rounded corners */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); /* x  y  blur  colour */
}`),
    p('Border styles include `solid`, `dashed`, `dotted`, `double`, `groove`, `ridge` and `none`. Setting `border-radius: 50%` on a square turns it into a circle.'),
  ],
  summary: [
    'Colours can be written as names, HEX (#RRGGBB), RGB/RGBA and HSL values.',
    'Screens mix red, green and blue light (additive model) to make 16.7 million colours.',
    'Colour schemes: complementary, analogous, triadic, monochromatic; colours carry emotions.',
    'Font properties (family, size, weight, style) and text properties (align, transform, decoration, spacing) control typography.',
    'Backgrounds can be colours, images or gradients, controlled with repeat, size and position.',
  ],
  exercises: [
    { q: 'Convert rgb(255, 0, 0) into HEX.', a: '#FF0000 (red = FF, green = 00, blue = 00).' },
    { q: 'What does the "A" in RGBA stand for? Give an example.', a: 'Alpha — the opacity from 0 (fully transparent) to 1 (solid). Example: rgba(0, 0, 255, 0.5) is 50% transparent blue.' },
    { q: 'Differentiate between serif and sans-serif fonts.', a: 'Serif fonts have small strokes ("feet") at the ends of letters (e.g. Times New Roman); sans-serif fonts do not (e.g. Arial) and are easier to read on screens.' },
    { q: 'Write CSS to make a page background an image that covers the whole page without repeating.', a: 'body { background-image: url("bg.jpg"); background-size: cover; background-repeat: no-repeat; }' },
    { q: 'What is the 60-30-10 rule?', a: 'A colour guideline: 60% dominant colour, 30% secondary colour and 10% accent colour, for a balanced design.' },
  ],
};
