import { type Chapter, h2, h3, p, ul, code, tryit, note, table, sim, cards, compare, steps, diagram, PEXELS } from './types';

export const ch1: Chapter = {
  id: 'intro', num: 1, unit: 1,
  title: 'Introduction to Web Design & the Internet', short: 'Web & Internet',
  tagline: 'Discover how websites are made and how a page travels across the world to your screen.',
  color: 'sky', icon: 'Globe', image: 'images/ch-internet.jpg', minutes: 25,
  objectives: [
    'Explain what web design is and who builds websites',
    'Differentiate between the Internet and the World Wide Web',
    'Describe how a browser gets a web page from a server',
    'Identify every part of a URL',
    'Compare static and dynamic websites',
  ],
  blocks: [
    h2('What is Web Design?'),
    p("**Web design** is the process of planning, creating and arranging the content of a website so that it is attractive, easy to use and works on every device. It combines **visual design** (layout, colours, fonts, images) with **user experience** (how easily visitors find information and complete tasks)."),
    p("Every website you use — Google, YouTube, your bank's app or your favourite online shop — was designed by someone who decided where the logo goes, which colours to use and how the menu should work. In this course you will learn to do the same using three core languages: **HTML** (structure), **CSS** (style) and **JavaScript** (behaviour)."),
    cards(
      ['Web Designer', 'Plans the look and feel — layout, colours and typography — often using tools like Figma or Canva.', 'PenTool'],
      ['Front-end Developer', 'Turns designs into working pages with HTML, CSS and JavaScript that run in the browser.', 'CodeXml'],
      ['Back-end Developer', 'Builds the server side — databases, logins and logic — using PHP, Python, Node.js, etc.', 'Server'],
    ),
    h2('The Internet vs the World Wide Web'),
    p('People often use these words as if they mean the same thing, but they are different. The Internet is the **road network**; the Web is one of the **vehicles** that travels on it.'),
    compare('🌐 Internet', [
      'A global network of interconnected computers — a "network of networks"',
      'Hardware and infrastructure: cables, routers, satellites, towers',
      'Began as ARPANET (USA) in 1969',
      'Carries many services: e-mail, WWW, FTP, video calls, online games',
    ], '🕸️ World Wide Web (WWW)', [
      'A huge collection of linked web pages and resources',
      'An information system (software) that runs on the Internet',
      'Invented by Tim Berners-Lee at CERN in 1989',
      'Built on three technologies: HTML, URL and HTTP',
    ]),
    note('fact', "The world's first website, **info.cern.ch**, went live in 1991 — and it is still online today!", 'Did you know?'),
    h2('Key Terms You Must Know'),
    table(['Term', 'Meaning', 'Example'],
      ['Web page', 'A single document on the web, written in HTML', '`about.html`'],
      ['Website', 'A collection of related web pages under one domain name', 'wikipedia.org'],
      ['Home page', 'The first / main page of a website', '`index.html`'],
      ['Web browser', 'Software used to request and display web pages', 'Chrome, Firefox, Edge, Safari'],
      ['Web server', 'A computer that stores websites and sends pages when requested', 'Apache, Nginx, IIS'],
      ['URL', 'Uniform Resource Locator — the unique address of a resource', '`https://example.com/index.html`'],
      ['HTTP / HTTPS', 'HyperText Transfer Protocol — rules for transferring web pages. HTTPS is the secure (encrypted) version', '`https://`'],
      ['IP address', 'A unique number that identifies a device on a network', '`142.250.183.14`'],
      ['DNS', 'Domain Name System — the "phone book" that converts domain names into IP addresses', 'google.com → 142.250.x.x'],
      ['ISP', 'Internet Service Provider — the company that connects you to the Internet', 'Airtel, Jio, Comcast, Vodafone'],
      ['Hyperlink', 'Clickable text or image that opens another page', 'Underlined blue text'],
    ),
    h2('How Does a Web Page Reach You?'),
    p('When you type an address and press **Enter**, many things happen in less than a second. The web works on the **client–server model**: your browser (the **client**) *requests* a page and a **server** *responds* by sending it.'),
    diagram('client-server', 'Figure 1.1 — The client–server model of the web'),
    steps(
      ['You enter a URL', 'You type https://www.example.com in the address bar and press Enter.'],
      ['DNS lookup', 'The browser asks a DNS server: "What is the IP address of www.example.com?"'],
      ['HTTP request', 'Using that IP address, the browser sends a request such as GET /index.html to the web server.'],
      ['Server response', 'The server finds the file and replies with a status code (200 OK) and the HTML content.'],
      ['Rendering', 'The browser reads the HTML, downloads CSS, images and JavaScript, and paints the page on your screen.'],
    ),
    sim('web-works'),
    table(['Status code', 'Meaning'],
      ['200 OK', 'Success — the page was found and sent'],
      ['301 Moved Permanently', 'The page has a new address (redirect)'],
      ['404 Not Found', 'The requested page does not exist'],
      ['500 Internal Server Error', 'Something went wrong on the server'],
    ),
    h2('Anatomy of a URL'),
    p('A URL is like a complete postal address for a file on the web. Each part has a specific job. Edit the URL below or pick an example to see how it is broken down.'),
    sim('url-anatomy'),
    h2('Static vs Dynamic Websites'),
    compare('📄 Static website', [
      'Shows the same content to every visitor',
      'Made with HTML and CSS (and some JavaScript)',
      'Fast, cheap and easy to host',
      'Example: personal portfolio, restaurant menu, event page',
    ], '⚡ Dynamic website', [
      'Content changes for each user or over time',
      'Uses server-side languages (PHP, Python) and databases',
      'Supports logins, search, shopping carts and comments',
      'Example: Amazon, YouTube, online banking',
    ]),
    h2('Tools of a Web Designer'),
    cards(
      ['Text / Code Editor', 'Notepad, VS Code, Sublime Text — used to write HTML, CSS and JavaScript code.', 'FileText'],
      ['Web Browser', 'Chrome, Firefox, Edge — used to test pages. Press F12 to open the Developer Tools.', 'Globe'],
      ['Design Tools', 'Figma, Adobe XD, Canva — used to plan wireframes and mockups before coding.', 'PenTool'],
      ['Image Editors', 'GIMP, Photoshop, Photopea — used to crop, resize and optimise graphics.', 'Image'],
    ),
    note('tip', 'You can start building websites with just **Notepad** and a **browser**! Write your code, save the file with a `.html` extension and double-click it to open.'),
  ],
  summary: [
    'Web design is planning and arranging content to make websites attractive, usable and accessible.',
    'The Internet is a worldwide network of networks; the WWW is a service of linked pages that runs on it.',
    'Browsers (clients) request pages from web servers using HTTP/HTTPS — the client–server model.',
    'DNS translates human-friendly domain names into IP addresses.',
    'A URL contains a protocol, domain, optional port, path, query string and fragment.',
    'Static websites show fixed content; dynamic websites generate content using server programs and databases.',
  ],
  exercises: [
    { q: 'Differentiate between the Internet and the World Wide Web.', a: 'The Internet is the global network of connected computers (infrastructure). The WWW is a collection of linked web pages that is accessed over the Internet using browsers, HTTP and URLs.' },
    { q: 'What is the role of DNS?', a: 'DNS (Domain Name System) converts domain names like google.com into numeric IP addresses so that the browser can locate the correct server.' },
    { q: 'Name any four web browsers and two web servers.', a: 'Browsers: Google Chrome, Mozilla Firefox, Microsoft Edge, Safari. Web servers: Apache, Nginx (also Microsoft IIS).' },
    { q: 'What does HTTPS stand for, and why is it preferred over HTTP?', a: 'HyperText Transfer Protocol Secure. It encrypts the data exchanged between browser and server, protecting passwords and personal information from being read by others.' },
    { q: 'Identify the protocol, domain name and path in https://www.example.org/blog/post.html', a: 'Protocol: https · Domain: www.example.org (sub-domain www, domain example, TLD .org) · Path: /blog/post.html' },
  ],
};

export const ch2: Chapter = {
  id: 'html-basics', num: 2, unit: 1,
  title: 'HTML Fundamentals', short: 'HTML Basics',
  tagline: 'Learn the language that gives every web page its structure — tags, elements and attributes.',
  color: 'orange', icon: 'FileCode', image: 'images/ch-html.jpg', minutes: 30,
  objectives: [
    'Explain what HTML is and why it is called a markup language',
    'Distinguish between tags, elements and attributes',
    'Differentiate container (paired) and empty (void) tags',
    'Write the basic structure of an HTML5 document',
    'Create, save and open your first web page',
  ],
  blocks: [
    h2('What is HTML?'),
    p('**HTML (HyperText Markup Language)** is the standard language for creating web pages. It describes the **structure** of a page — headings, paragraphs, images, links, tables and forms — using special codes called **tags**. The browser reads these tags and decides how to display the content.'),
    cards(
      ['HyperText', 'Text that contains links (hyperlinks) to other pages, letting you jump from one document to another.', 'Link'],
      ['Markup', 'Tags that "mark up" plain text to tell the browser what each part is — a heading, a list, an image…', 'CodeXml'],
      ['Language', 'It has its own vocabulary (tags) and grammar (rules called syntax) that must be followed.', 'BookOpen'],
    ),
    note('info', 'HTML is **not a programming language**. It cannot do calculations or make decisions — it only describes structure and meaning. That is why it is called a *markup* language.', 'Remember'),
    h3('A Short History of HTML'),
    table(['Version', 'Year', 'Highlights'],
      ['HTML 1.0', '1991', 'Created by Tim Berners-Lee; basic text, headings and links'],
      ['HTML 2.0', '1995', 'Added forms; first official standard'],
      ['HTML 3.2', '1997', 'Tables, applets and text flowing around images'],
      ['HTML 4.01', '1999', 'Support for CSS style sheets and scripting'],
      ['XHTML 1.0', '2000', 'Stricter XML-based rules (lowercase tags, every tag closed)'],
      ['HTML5', '2014 →', 'Audio, video, canvas, semantic tags, new form inputs — now a "Living Standard"'],
    ),
    h2('Tags, Elements & Attributes'),
    p('A **tag** is a keyword written inside angle brackets, such as `<p>`. Most tags come in pairs — an **opening tag** `<p>` and a **closing tag** `</p>` that contains a forward slash. The opening tag, the content and the closing tag together form an **element**. Hover over (or tap) each part below.'),
    diagram('element-anatomy', 'Figure 2.1 — Anatomy of an HTML element'),
    cards(
      ['Container (paired) tags', 'Have an opening and a closing tag and wrap content: `<p>…</p>`, `<h1>…</h1>`, `<b>…</b>`, `<table>…</table>`.', 'Box'],
      ['Empty (void) tags', 'Have no closing tag and no content: `<br>`, `<hr>`, `<img>`, `<input>`, `<meta>`, `<link>`.', 'Minus'],
      ['Attributes', 'Extra information written inside the opening tag as name="value" pairs, e.g. `<img src="cat.jpg" alt="A cat">`.', 'Hash'],
    ),
    table(['Global attribute', 'Purpose', 'Example'],
      ['id', 'A unique name for one element', '`<h1 id="top">`'],
      ['class', 'A group name used to style many elements', '`<p class="note">`'],
      ['style', 'Applies inline CSS', '`<p style="color:red">`'],
      ['title', 'Shows a tooltip on mouse hover', '`<abbr title="World Wide Web">`'],
      ['lang', 'Declares the language of the content', '`<html lang="en">`'],
    ),
    h2('Basic Structure of an HTML Document'),
    p('Every HTML5 page follows the same skeleton. The browser needs this structure to understand the document correctly.'),
    code('html', `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My First Web Page</title>
</head>
<body>
  <h1>Hello, World!</h1>
  <p>This is my first web page.</p>
</body>
</html>`, 'index.html'),
    diagram('html-structure', 'Figure 2.2 — How the basic elements are nested'),
    table(['Part', 'Purpose'],
      ['`<!DOCTYPE html>`', 'Tells the browser this is an HTML5 document. It is a declaration, not a tag.'],
      ['`<html>`', 'The root element — it contains every other element on the page.'],
      ['`<head>`', 'Holds information *about* the page (title, character set, CSS links). Not shown on the page.'],
      ['`<meta charset="UTF-8">`', 'Sets character encoding so all languages and symbols display correctly.'],
      ['`<title>`', 'Text shown on the browser tab, in bookmarks and in search results.'],
      ['`<body>`', 'Contains everything visible: text, images, links, tables, forms…'],
    ),
    tryit('Your first web page', `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>My First Web Page</title>
</head>
<body>
  <h1>Hello, World! 👋</h1>
  <p>My name is <b>Alex</b> and I love <i>building things</i>.</p>
  <p>I am learning <mark>web design</mark> this year.</p>
  <!-- Change the text above and watch the output update -->
</body>
</html>`),
    h2('Creating and Running an HTML File'),
    steps(
      ['Open an editor', 'Open Notepad (Windows), TextEdit in plain-text mode (Mac) or VS Code.'],
      ['Write the code', 'Type the basic HTML structure shown above.'],
      ['Save as .html', 'Click File → Save As, choose "All Files", and name it index.html (encoding UTF-8).'],
      ['Open in a browser', 'Double-click the saved file. It opens in your default web browser.'],
      ['Edit & refresh', 'Make changes, save (Ctrl + S) and press F5 in the browser to see them.'],
    ),
    h2('Comments in HTML'),
    p('Comments are notes for people reading the code. The browser ignores them completely. They begin with `<!--` and end with `-->`.'),
    code('html', `
<!-- This is a comment. It will not appear on the page -->
<p>This paragraph is visible.</p>`),
    h2('Golden Rules for Writing HTML'),
    ul(
      'Tags are **not case-sensitive**, but always write them in **lowercase**.',
      'Always **close** container tags: `<p>Text</p>`.',
      'Nest tags properly — the tag opened last is closed first: `<b><i>Hi</i></b>` ✔ not `<b><i>Hi</b></i>` ✘.',
      'Write attribute values inside **double quotes**: `width="200"`.',
      'Use **indentation** to show which elements are inside others — it makes code readable.',
      'Browsers ignore extra spaces and line breaks in code (*whitespace collapsing*).',
    ),
    h2('The DOM — How the Browser Sees Your Page'),
    p('When a browser loads HTML, it builds a family tree of elements called the **DOM (Document Object Model)**. Every tag becomes a **node**. A tag inside another is its **child**; the outer tag is its **parent**; tags at the same level are **siblings**. Edit the code below and watch the tree change!'),
    sim('dom-tree'),
    note('tip', 'Right-click any web page and choose **View Page Source** (Ctrl + U) to read its HTML, or **Inspect** (F12) to explore its live DOM tree.'),
  ],
  summary: [
    'HTML (HyperText Markup Language) defines the structure of web pages using tags.',
    'An element = opening tag + content + closing tag. Empty tags like `<br>` and `<img>` have no closing tag.',
    'Attributes give extra information and are written as name="value" inside the opening tag.',
    'Every page has `<!DOCTYPE html>`, `<html>`, `<head>` (with `<title>`) and `<body>`.',
    'HTML files are saved with the .html or .htm extension and opened in a web browser.',
    'The browser converts HTML into a tree of nodes called the DOM.',
  ],
  exercises: [
    { q: 'What is the difference between a tag and an element?', a: 'A tag is the keyword in angle brackets, e.g. <p> or </p>. An element is the complete unit: opening tag + content + closing tag, e.g. <p>Hello</p>.' },
    { q: 'Name four empty (void) tags.', a: '<br>, <hr>, <img> and <input> (also <meta> and <link>).' },
    { q: 'Why is HTML called a markup language and not a programming language?', a: 'Because it only marks up content to describe its structure; it has no logic, variables, loops or calculations.' },
    { q: 'Which part of an HTML document is displayed in the browser window?', a: 'Only the content inside <body>. The <head> contains information about the page, such as the <title> shown on the tab.' },
    { q: 'Correct the nesting error: <p><b>Welcome</p></b>', a: '<p><b>Welcome</b></p> — the tag opened last (<b>) must be closed first.' },
  ],
};

export const ch3: Chapter = {
  id: 'text-lists', num: 3, unit: 1,
  title: 'Text Formatting & Lists', short: 'Text & Lists',
  tagline: 'Headings, paragraphs, formatting tags, special characters and lists — the building blocks of content.',
  color: 'rose', icon: 'Type', image: PEXELS.code, minutes: 30,
  objectives: [
    'Use heading tags `<h1>`–`<h6>` to create a clear hierarchy',
    'Create paragraphs, line breaks and horizontal rules',
    'Apply physical and logical text-formatting tags',
    'Insert special characters using HTML entities',
    'Build ordered, unordered, description and nested lists',
  ],
  blocks: [
    h2('Headings: <h1> to <h6>'),
    p('HTML provides six levels of headings. `<h1>` is the most important (largest) and `<h6>` the least important (smallest). Headings are **block-level** elements — each starts on a new line with space above and below.'),
    tryit('Six levels of headings', `
<h1>Heading 1 — Page title</h1>
<h2>Heading 2 — Main section</h2>
<h3>Heading 3 — Sub-section</h3>
<h4>Heading 4</h4>
<h5>Heading 5</h5>
<h6>Heading 6 — Smallest</h6>`, undefined, undefined, 300),
    note('tip', 'Use only **one** `<h1>` per page and do not skip levels. Search engines (SEO) and screen readers use headings to understand your page, just like a table of contents.'),
    h2('Paragraphs, Line Breaks & Rules'),
    table(['Tag', 'Type', 'What it does'],
      ['`<p>`', 'Container', 'Creates a paragraph with space above and below'],
      ['`<br>`', 'Empty', 'Inserts a line break without starting a new paragraph'],
      ['`<hr>`', 'Empty', 'Draws a horizontal rule (line) to separate sections'],
      ['`<pre>`', 'Container', 'Preformatted text — keeps spaces and line breaks exactly as typed, in a monospace font'],
    ),
    note('info', 'Browsers **collapse whitespace**: ten spaces or five Enter key presses in your code show as a single space. Use `<br>` for new lines, `&nbsp;` for extra spaces, or `<pre>` to keep formatting.'),
    tryit('Paragraphs, breaks and rules', `
<p>Roses are red,<br>Violets are blue,<br>HTML is fun,<br>And so are you!</p>
<hr>
<p>This    text    has    many    spaces, but the browser shows only one.</p>
<pre>
  This text   keeps
     its   spacing
        exactly!
</pre>`),
    h2('Text Formatting Tags'),
    p('Formatting tags change how text looks or what it means. **Physical tags** only change the appearance, while **logical (semantic) tags** also describe meaning — useful for search engines and screen readers.'),
    table(['Tag', 'Output', 'Type / Use'],
      ['`<b>`', '**Bold**', 'Physical — bold text'],
      ['`<strong>`', '**Strong**', 'Logical — important text (also bold)'],
      ['`<i>`', '*Italic*', 'Physical — italic text'],
      ['`<em>`', '*Emphasis*', 'Logical — stressed emphasis (also italic)'],
      ['`<u>`', 'Underline', 'Underlined text'],
      ['`<mark>`', 'Highlighted', 'Highlights text like a marker pen'],
      ['`<small>`', 'Smaller text', 'Fine print, e.g. copyright notes'],
      ['`<del>` / `<s>`', 'Struck through', 'Deleted or no longer correct text'],
      ['`<ins>`', 'Inserted', 'Newly inserted text (underlined)'],
      ['`<sub>`', 'H₂O', 'Subscript — chemical formulae'],
      ['`<sup>`', 'x²', 'Superscript — powers, footnotes, 1st'],
      ['`<code>`', 'Monospace', 'Computer code'],
      ['`<blockquote>` / `<q>`', 'Quotation', 'Long (indented) and short (inline) quotations'],
      ['`<abbr>`', 'WWW', 'Abbreviation; full form in the title attribute'],
    ),
    tryit('Formatting in action', `
<p><b>Bold</b>, <strong>strong</strong>, <i>italic</i> and <em>emphasised</em> text.</p>
<p>Water is H<sub>2</sub>O and Einstein wrote E = mc<sup>2</sup>.</p>
<p>Price: <del>₹999</del> <ins>₹499</ins> — <mark>50% off!</mark></p>
<p><small>© 2025 My Website</small></p>
<p>The <abbr title="World Wide Web">WWW</abbr> was invented in 1989.</p>
<blockquote>"The Web does not just connect machines, it connects people." — Tim Berners-Lee</blockquote>`, undefined, undefined, 300),
    note('info', '`<b>` and `<strong>` look the same, but `<strong>` tells screen readers the text is **important**, so they may read it with stress. Prefer logical tags in modern HTML.', '<b> vs <strong>'),
    h2('HTML Entities (Special Characters)'),
    p('Some characters such as `<` and `>` are reserved in HTML. To display them — or symbols not on your keyboard — use **entities**, which start with `&` and end with `;`.'),
    table(['Character', 'Entity name', 'Entity number', 'Description'],
      ['<', '`&lt;`', '`&#60;`', 'Less than'],
      ['>', '`&gt;`', '`&#62;`', 'Greater than'],
      ['&', '`&amp;`', '`&#38;`', 'Ampersand'],
      ['(space)', '`&nbsp;`', '`&#160;`', 'Non-breaking space'],
      ['©', '`&copy;`', '`&#169;`', 'Copyright'],
      ['®', '`&reg;`', '`&#174;`', 'Registered trademark'],
      ['₹', '—', '`&#8377;`', 'Indian Rupee'],
      ['"', '`&quot;`', '`&#34;`', 'Double quotation mark'],
    ),
    h2('Lists'),
    p('Lists organise related items. HTML offers three kinds. Each item inside `<ol>` or `<ul>` is written with the `<li>` (list item) tag.'),
    cards(
      ['Ordered list <ol>', 'Numbered items where order matters — steps of a recipe, rankings, instructions.', 'ListChecks'],
      ['Unordered list <ul>', 'Bulleted items where order does not matter — a shopping list or features.', 'Sparkles'],
      ['Description list <dl>', 'Terms `<dt>` with their descriptions `<dd>` — glossaries, FAQs.', 'BookOpen'],
    ),
    table(['Attribute (on <ol>)', 'Values', 'Effect'],
      ['type', '1, A, a, I, i', 'Numbering style: 1 2 3 / A B C / a b c / I II III / i ii iii'],
      ['start', 'any number', 'Begins numbering from this value, e.g. start="5"'],
      ['reversed', '(no value)', 'Counts downwards: 3, 2, 1'],
    ),
    p('For `<ul>`, the bullet shape is set with the CSS property `list-style-type: disc | circle | square | none;` (older HTML used the `type` attribute).'),
    tryit('All three list types + nesting', `
<h3>My Learning Plan (ordered, type="I")</h3>
<ol type="I">
  <li>Understand how the web works</li>
  <li>Practise a little every day</li>
  <li>Learn the three core languages
    <ul style="list-style-type: square">
      <li>HTML</li>
      <li>CSS</li>
      <li>JavaScript</li>
    </ul>
  </li>
</ol>

<h3>Things I need (unordered)</h3>
<ul>
  <li>Laptop</li>
  <li>Text editor</li>
  <li>Curiosity!</li>
</ul>

<h3>Glossary (description list)</h3>
<dl>
  <dt>HTML</dt>
  <dd>Language for structuring web pages.</dd>
  <dt>CSS</dt>
  <dd>Language for styling web pages.</dd>
</dl>`, undefined, undefined, 440),
    note('tip', 'A list placed inside an `<li>` of another list is called a **nested list**. Browsers automatically change the bullet style for each level.'),
  ],
  summary: [
    '`<h1>`–`<h6>` create six levels of headings; use one `<h1>` per page.',
    '`<p>` makes paragraphs, `<br>` breaks lines, `<hr>` draws a rule and `<pre>` keeps formatting.',
    'Physical tags (`<b>`, `<i>`) change appearance; logical tags (`<strong>`, `<em>`) add meaning.',
    '`<sub>` and `<sup>` create subscripts and superscripts.',
    'Entities like `&lt;`, `&amp;` and `&copy;` display reserved and special characters.',
    'Lists: `<ol>` (numbered), `<ul>` (bulleted) and `<dl>` (term + description); lists can be nested.',
  ],
  exercises: [
    { q: 'Write HTML to display: H₂SO₄ and (a+b)²', a: 'H<sub>2</sub>SO<sub>4</sub> and (a+b)<sup>2</sup>' },
    { q: 'Differentiate between <br> and <p>.', a: '<br> is an empty tag that only moves text to the next line. <p> is a container tag that creates a separate paragraph with space above and below.' },
    { q: 'How can you start an ordered list from 5 and use Roman numerals?', a: '<ol type="I" start="5"> … </ol> — numbering starts at V.' },
    { q: 'Which entity displays the © symbol? Why do we need entities?', a: '&copy; — entities display reserved characters (like < and >) and symbols that are not on the keyboard.' },
    { q: 'Name the three tags used in a description list.', a: '<dl> (description list), <dt> (term) and <dd> (description).' },
  ],
};

export const ch4: Chapter = {
  id: 'links-media', num: 4, unit: 1,
  title: 'Links, Images & Multimedia', short: 'Links & Media',
  tagline: 'Connect pages together and bring them to life with images, audio, video and embedded content.',
  color: 'emerald', icon: 'Link', image: 'images/ch-media.jpg', minutes: 30,
  objectives: [
    'Create hyperlinks using the anchor tag and its attributes',
    'Differentiate absolute and relative URLs',
    'Insert images with proper alt text and choose suitable image formats',
    'Embed audio, video and other pages with iframe',
  ],
  blocks: [
    h2('Hyperlinks with the <a> Tag'),
    p('Links are what make the web a *web*. The **anchor** tag `<a>` creates a hyperlink; its `href` (hypertext reference) attribute holds the destination address.'),
    code('html', `<a href="https://www.wikipedia.org" target="_blank" title="Open Wikipedia">Visit Wikipedia</a>`),
    table(['Attribute', 'Purpose', 'Example'],
      ['href', 'Destination URL of the link', '`href="about.html"`'],
      ['target', '`_blank` opens a new tab; `_self` (default) opens in the same tab', '`target="_blank"`'],
      ['title', 'Tooltip shown on hover', '`title="Go home"`'],
      ['download', 'Downloads the file instead of opening it', '`<a href="notes.pdf" download>`'],
    ),
    h3('Absolute vs Relative URLs'),
    compare('Absolute URL', [
      'The complete address, including protocol and domain',
      'Used to link to other websites',
      'Example: `https://www.example.com/index.html`',
    ], 'Relative URL', [
      "A path relative to the current page's location",
      'Used to link pages and images within your own website',
      'Examples: `contact.html`, `images/logo.png`, `../index.html`',
    ]),
    h3('Types of Links'),
    table(['Link type', 'Code'],
      ['External website', '`<a href="https://google.com">Google</a>`'],
      ['Another page of your site', '`<a href="contact.html">Contact</a>`'],
      ['Section on the same page (bookmark)', '`<a href="#faq">FAQ</a>` … `<h2 id="faq">`'],
      ['E-mail', '`<a href="mailto:hello@example.com">Mail us</a>`'],
      ['Phone call', '`<a href="tel:+911234567890">Call</a>`'],
      ['Image as a link', '`<a href="home.html"><img src="logo.png" alt="Home"></a>`'],
    ),
    tryit('Different kinds of links', `
<h2 id="top">Useful Links</h2>
<ul>
  <li><a href="https://developer.mozilla.org" target="_blank">MDN Web Docs</a> (new tab)</li>
  <li><a href="mailto:hello@example.com">Send us an email</a></li>
  <li><a href="tel:+911234567890">Call our help desk</a></li>
  <li><a href="#bottom">Jump to the bottom ⬇</a></li>
</ul>
<p style="height:300px;background:#ecfdf5;padding:10px">Scroll down…</p>
<p id="bottom">You reached the bottom! <a href="#top">Back to top ⬆</a></p>`),
    h2('Images with the <img> Tag'),
    p('The `<img>` tag embeds an image. It is an **empty** tag. The `src` attribute gives the image location and `alt` provides alternative text that is shown if the image cannot load — and read aloud by screen readers.'),
    code('html', `<img src="images/taj-mahal.jpg" alt="The Taj Mahal at sunrise" width="400" height="250">`),
    table(['Attribute', 'Purpose'],
      ['src', 'Path or URL of the image file (required)'],
      ['alt', 'Alternative text describing the image (required for accessibility)'],
      ['width / height', 'Size in pixels; set only one to keep the aspect ratio'],
      ['title', 'Tooltip text on hover'],
      ['loading="lazy"', 'Loads the image only when it is about to scroll into view'],
    ),
    table(['Format', 'Best for', 'Transparency', 'Animation'],
      ['JPEG / JPG', 'Photographs (small file size)', '✘', '✘'],
      ['PNG', 'Logos, screenshots, sharp graphics', '✔', '✘'],
      ['GIF', 'Simple animations (256 colours)', '✔', '✔'],
      ['SVG', 'Icons and logos — vector, scales without blur', '✔', '✔'],
      ['WebP', 'Modern format — smaller than JPEG and PNG', '✔', '✔'],
    ),
    note('warning', 'Always write meaningful `alt` text. It helps visually impaired users, appears when an image fails to load and improves search-engine ranking.'),
    tryit('Images, figures and image links', `
<figure>
  <img src="https://picsum.photos/id/1018/400/220" alt="Mountain landscape" width="320">
  <figcaption>Fig 1: A mountain landscape (figure + figcaption)</figcaption>
</figure>

<p>Clickable image (opens in a new tab):</p>
<a href="https://picsum.photos" target="_blank">
  <img src="https://picsum.photos/id/237/200/130" alt="A black puppy" title="Click me!" width="160">
</a>

<p>Broken image showing its alt text:</p>
<img src="missing.jpg" alt="⚠ This image could not be loaded" width="220">`, undefined, undefined, 470),
    h2('Audio and Video'),
    p('HTML5 introduced the `<audio>` and `<video>` tags, so media plays directly in the browser without plug-ins.'),
    code('html', `
<audio controls>
  <source src="song.mp3" type="audio/mpeg">
  Your browser does not support audio.
</audio>

<video width="480" controls poster="thumbnail.jpg">
  <source src="lesson.mp4" type="video/mp4">
  Your browser does not support video.
</video>`),
    table(['Attribute', 'Meaning'],
      ['controls', 'Shows play / pause / volume buttons'],
      ['autoplay', 'Starts playing automatically (browsers usually also require muted)'],
      ['muted', 'Starts with the sound off'],
      ['loop', 'Plays again from the start when it ends'],
      ['poster', '(video only) Image shown before the video plays'],
    ),
    h2('Embedding Pages with <iframe>'),
    p('An **inline frame** displays another web page inside your page — commonly used for YouTube videos and maps.'),
    code('html', `
<iframe width="560" height="315"
  src="https://www.youtube.com/embed/VIDEO_ID"
  title="YouTube video" allowfullscreen></iframe>`),
    tryit('Video player & embedded map', `
<h3>HTML5 Video</h3>
<video width="300" controls muted poster="https://picsum.photos/id/1043/300/170">
  <source src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" type="video/mp4">
</video>
<h3>Iframe — Taj Mahal on a map</h3>
<iframe src="https://www.openstreetmap.org/export/embed.html?bbox=78.035%2C27.170%2C78.050%2C27.180&amp;layer=mapnik" width="300" height="180" style="border:1px solid #ccc"></iframe>`, undefined, undefined, 500),
    note('fact', 'Before HTML5, playing video on a website required the Adobe Flash Player plug-in, which was officially discontinued at the end of 2020.'),
  ],
  summary: [
    'The `<a>` tag with the `href` attribute creates hyperlinks; `target="_blank"` opens a new tab.',
    'Absolute URLs contain the full address; relative URLs point to files within the same website.',
    'Links can open pages, page sections (#id), e-mail (mailto:) and phone numbers (tel:).',
    '`<img>` is an empty tag; `src` and `alt` are its most important attributes.',
    'Choose JPEG for photos, PNG/SVG for logos and graphics, GIF for simple animation, WebP for modern sites.',
    '`<audio>`, `<video>` and `<iframe>` embed media and other pages directly in a web page.',
  ],
  exercises: [
    { q: 'Write the code to open https://www.wikipedia.org in a new tab with the link text "Wikipedia".', a: '<a href="https://www.wikipedia.org" target="_blank">Wikipedia</a>' },
    { q: 'What is the purpose of the alt attribute?', a: 'It provides alternative text that describes the image. It is displayed if the image fails to load, read by screen readers and used by search engines.' },
    { q: 'Differentiate between absolute and relative URLs with an example.', a: 'Absolute: full address with protocol and domain, e.g. https://example.com/about.html. Relative: path from the current page, e.g. about.html or images/pic.jpg.' },
    { q: 'How do you create a link that jumps to a section with id="contact" on the same page?', a: '<a href="#contact">Contact us</a> — and the target element must have id="contact".' },
    { q: 'Name the attribute that shows play/pause buttons on a video.', a: 'controls — e.g. <video src="clip.mp4" controls></video>' },
  ],
};
