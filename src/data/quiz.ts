export interface Question { ch: string; q: string; options: string[]; answer: number; explain: string; }

const Q = (ch: string, q: string, options: string[], answer: number, explain: string): Question => ({ ch, q, options, answer, explain });

export const questions: Question[] = [
  // Chapter 1
  Q('intro', 'Who invented the World Wide Web?', ['Bill Gates', 'Tim Berners-Lee', 'Brendan Eich', 'Vint Cerf'], 1, 'Tim Berners-Lee invented the WWW at CERN in 1989.'),
  Q('intro', 'What does DNS do?', ['Encrypts web pages', 'Converts domain names into IP addresses', 'Stores website files', 'Designs web pages'], 1, 'DNS is the "phone book" of the Internet that maps domain names to IP addresses.'),
  Q('intro', 'Which HTTP status code means "Not Found"?', ['200', '301', '404', '500'], 2, '404 means the server could not find the requested resource.'),
  Q('intro', 'In https://www.example.com/about.html, what is "/about.html"?', ['Protocol', 'Domain', 'Path', 'Query string'], 2, 'The path tells the server which file or folder is requested.'),
  // Chapter 2
  Q('html-basics', 'HTML stands for:', ['Hyper Trainer Marking Language', 'HyperText Markup Language', 'HyperText Marketing Language', 'High Text Markup Language'], 1, 'HTML = HyperText Markup Language.'),
  Q('html-basics', 'Which of these is an empty (void) tag?', ['<p>', '<b>', '<br>', '<h1>'], 2, '<br> has no content and no closing tag.'),
  Q('html-basics', 'Where is the <title> tag placed?', ['Inside <body>', 'Inside <head>', 'After </html>', 'Inside <footer>'], 1, '<title> belongs in the <head> section and appears on the browser tab.'),
  Q('html-basics', 'Which is the correct way to write an HTML comment?', ['// comment', '/* comment */', '<!-- comment -->', '# comment'], 2, 'HTML comments start with <!-- and end with -->.'),
  // Chapter 3
  Q('text-lists', 'Which tag produces the largest heading by default?', ['<h6>', '<head>', '<h1>', '<heading>'], 2, '<h1> is the most important and largest heading.'),
  Q('text-lists', 'To write H₂O you would use:', ['H<sup>2</sup>O', 'H<sub>2</sub>O', 'H<small>2</small>O', 'H<i>2</i>O'], 1, '<sub> lowers text as a subscript.'),
  Q('text-lists', 'Which list type shows bullets?', ['<ol>', '<ul>', '<dl>', '<li>'], 1, 'An unordered list <ul> shows bullet points.'),
  Q('text-lists', 'Which entity displays the < symbol?', ['&lt;', '&gt;', '&amp;', '&ls;'], 0, '&lt; stands for "less than".'),
  // Chapter 4
  Q('links-media', 'Which attribute specifies the destination of a link?', ['src', 'href', 'link', 'target'], 1, 'href (hypertext reference) holds the URL of the link.'),
  Q('links-media', 'target="_blank" makes a link:', ['Bold', 'Open in a new tab', 'Download a file', 'Invisible'], 1, '_blank opens the linked document in a new tab or window.'),
  Q('links-media', 'Which attribute provides alternative text for an image?', ['title', 'alt', 'src', 'name'], 1, 'alt text is shown if the image fails and is read by screen readers.'),
  Q('links-media', 'Which image format is best for photographs?', ['GIF', 'JPEG', 'SVG', 'ICO'], 1, 'JPEG compresses photos efficiently.'),
  // Chapter 5
  Q('tables', 'Which tag creates a table row?', ['<td>', '<th>', '<tr>', '<row>'], 2, '<tr> stands for table row.'),
  Q('tables', 'To merge two cells horizontally you use:', ['rowspan="2"', 'colspan="2"', 'merge="2"', 'span="2"'], 1, 'colspan stretches a cell across columns.'),
  Q('tables', 'Text inside <th> is by default:', ['Italic and left aligned', 'Bold and centred', 'Underlined', 'Red'], 1, 'Header cells are bold and centred by default.'),
  Q('tables', 'cellpadding controls the space:', ['Between cells', 'Between cell border and content', 'Around the table', 'Between rows only'], 1, 'cellpadding is the space inside each cell.'),
  // Chapter 6
  Q('forms', 'Which method shows form data in the URL?', ['POST', 'GET', 'PUT', 'SEND'], 1, 'GET appends name=value pairs to the URL.'),
  Q('forms', 'Which input type allows only one choice from a group?', ['checkbox', 'radio', 'select', 'text'], 1, 'Radio buttons with the same name allow a single choice.'),
  Q('forms', 'Which tag creates a multi-line text box?', ['<input type="text">', '<textbox>', '<textarea>', '<text>'], 2, '<textarea> creates a multi-line text field.'),
  Q('forms', 'Which attribute makes a field compulsory?', ['needed', 'required', 'must', 'validate'], 1, 'The required attribute prevents submission while the field is empty.'),
  // Chapter 7
  Q('css-basics', 'CSS stands for:', ['Creative Style Sheets', 'Cascading Style Sheets', 'Computer Style Sheets', 'Colourful Style Sheets'], 1, 'CSS = Cascading Style Sheets.'),
  Q('css-basics', 'Which symbol selects an element by class?', ['#', '.', '*', '@'], 1, 'A dot (.) is the class selector; # is the ID selector.'),
  Q('css-basics', 'Which tag links an external CSS file?', ['<style>', '<css>', '<link>', '<script>'], 2, '<link rel="stylesheet" href="style.css"> connects external CSS.'),
  Q('css-basics', 'Which selector has the highest specificity?', ['p', '.note', '#main', 'div p'], 2, 'ID selectors (100) beat classes (10) and elements (1).'),
  // Chapter 8
  Q('colors-type', 'What colour is #000000?', ['White', 'Black', 'Red', 'Grey'], 1, 'All channels at 00 means no light: black.'),
  Q('colors-type', 'In rgba(0,0,255,0.5), what does 0.5 represent?', ['Brightness', 'Opacity (alpha)', 'Hue', 'Size'], 1, 'The alpha channel sets transparency from 0 to 1.'),
  Q('colors-type', 'Which property changes the font?', ['font-style', 'font-family', 'text-font', 'font-type'], 1, 'font-family sets the typeface.'),
  Q('colors-type', 'Which value of background-size makes an image fill the whole element?', ['contain', 'cover', 'fill', 'auto'], 1, 'cover scales the image to completely cover the area.'),
  // Chapter 9
  Q('box-layout', 'The correct order of the box model from inside out is:', ['Content, margin, border, padding', 'Content, padding, border, margin', 'Padding, content, border, margin', 'Margin, border, padding, content'], 1, 'Content → padding → border → margin.'),
  Q('box-layout', 'Which display value makes an element start on a new line and take full width?', ['inline', 'block', 'inline-block', 'none'], 1, 'Block elements fill the available width and start on a new line.'),
  Q('box-layout', 'Which property aligns flex items along the main axis?', ['align-items', 'justify-content', 'flex-wrap', 'align-content'], 1, 'justify-content distributes items along the main axis.'),
  Q('box-layout', 'Which position keeps an element fixed to the window while scrolling?', ['static', 'relative', 'absolute', 'fixed'], 3, 'position: fixed attaches the element to the viewport.'),
  // Chapter 10
  Q('responsive', 'Which tag is essential for responsive pages on mobile?', ['<meta name="viewport">', '<meta charset>', '<link rel="icon">', '<base>'], 0, 'The viewport meta tag sets the page width to the device width.'),
  Q('responsive', 'Media queries are written using:', ['@import', '@media', '@font-face', '@screen'], 1, '@media applies CSS when conditions match.'),
  Q('responsive', 'Mobile-first CSS usually uses which kind of media query?', ['max-width', 'min-width', 'orientation only', 'print'], 1, 'Mobile-first starts small and adds min-width breakpoints.'),
  Q('responsive', 'img { max-width: 100%; } makes images:', ['Always 100px', 'Never wider than their container', 'Hidden on mobile', 'Full-screen'], 1, 'Images shrink to fit smaller containers.'),
  // Chapter 11
  Q('javascript', 'Which keyword declares a constant?', ['var', 'let', 'const', 'constant'], 2, 'const creates a binding that cannot be reassigned.'),
  Q('javascript', 'What is the result of 5 === "5"?', ['true', 'false', 'error', 'undefined'], 1, '=== compares type as well; number vs string is false.'),
  Q('javascript', 'Which method finds an element by its id?', ['getElement()', 'getElementById()', 'querySelectorAll()', 'findId()'], 1, 'document.getElementById("id") returns that element.'),
  Q('javascript', 'Which event fires when a button is clicked?', ['onchange', 'onclick', 'onload', 'onhover'], 1, 'onclick runs when an element is clicked.'),
  // Chapter 12
  Q('ui-ux', 'UX stands for:', ['User Experience', 'User Extension', 'Universal XML', 'User Exchange'], 0, 'UX = User Experience.'),
  Q('ui-ux', 'Grouping related items close together is the principle of:', ['Contrast', 'Repetition', 'Proximity', 'Alignment'], 2, 'Proximity groups related elements.'),
  Q('ui-ux', 'Minimum recommended contrast ratio for normal text (WCAG AA) is:', ['2:1', '3:1', '4.5:1', '10:1'], 2, 'WCAG AA requires at least 4.5:1 for normal text.'),
  Q('ui-ux', 'Which semantic tag holds the main navigation links?', ['<header>', '<nav>', '<aside>', '<menu>'], 1, '<nav> represents a block of navigation links.'),
];
