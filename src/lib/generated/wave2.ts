import type { CategoryKey, ToolMeta } from "../types";

type Spec = [slug: string, title: string, desc: string, kw: string[], paras: [string, string, string], faqs: [string, string][]];
const P: [string, string] = ["Is my text sent to a server?", "No. Everything runs in your browser. Nothing you type is uploaded or stored."];
const CAT: CategoryKey = "text-tools";

const SPECS: Spec[] = [
  ["fancy-text-generator", "Fancy Text Generator", "Turn plain text into bold, italic, script, gothic, circled and other Unicode styles you can paste anywhere.", ["fancy text generator", "cool fonts copy paste", "unicode text styles", "bold text generator"], [
    "Type your text once and see it in about 13 styles at the same time: bold, italic, script, fraktur, double-struck, monospace, circled, small caps, strikethrough and underline. Press the copy button next to the style you like.",
    "These are not real fonts. They are special Unicode characters, so they work in Instagram bios, WhatsApp, X, Discord, TikTok and anywhere that accepts text.",
    "Screen readers may read fancy characters badly, and some platforms or fonts may show boxes for rare styles. Keep important information in plain text."],
    [["Why does it work on social media?", "Unicode includes mathematical alphabets that look like fonts."], ["Do all letters change?", "Latin letters and digits change. Other scripts such as Arabic stay as they are."], P]],
  ["email-extractor", "Email Extractor", "Find and list all email addresses in any text, with duplicates removed.", ["email extractor", "extract emails from text", "find email addresses in text"], [
    "Paste any text, such as a web page, a document or a mailing list export, and the tool pulls out every email address and lists each one once.",
    "Use it to clean contact lists, collect addresses from a long thread or check what a text exposes.",
    "Only collect and use addresses where you have a lawful reason and permission to contact people."],
    [["Does it remove duplicates?", "Yes."], ["Does it validate addresses?", "It finds text shaped like an address. It cannot check that the mailbox exists."], P]],
  ["url-extractor", "URL Extractor", "Extract every http and https link from a block of text.", ["url extractor", "extract links from text", "find urls in text"], [
    "Paste text and the tool lists every link that starts with http:// or https://, one per line, with duplicates removed.",
    "It is useful for pulling links from emails, chat exports, documents and page source.",
    "Links without a protocol, such as example.com, are not detected."],
    [["Does it follow the links?", "No. It only reads the text you paste."], ["Are duplicates removed?", "Yes."], P]],
  ["number-extractor", "Number Extractor", "Pull all numbers out of a text, including decimals and negatives.", ["number extractor", "extract numbers from text", "find numbers in text"], [
    "Paste text and every number is listed on its own line. Decimals and negative numbers are kept, and thousands separators such as 1,250 are read as one number.",
    "Use it with the average calculator to analyze figures hidden in a report or message.",
    "Dates and phone numbers are split into parts, so check results when they appear in the text."],
    [["Does it read 1,250 as one number?", "Yes."], ["Does it find negatives?", "Yes."], P]],
  ["remove-duplicate-words", "Remove Duplicate Words", "Delete repeated words from a text, keeping the first occurrence of each.", ["remove duplicate words", "delete repeated words", "unique words from text"], [
    "Paste text and each word appears only once, in original order. Comparison ignores capital letters and punctuation.",
    "Useful for cleaning keyword lists, tag lists and messy copy.",
    "Be careful with normal prose, because removing repeated words like the and of will change its meaning."],
    [["Is it case sensitive?", "No."], ["Does it remove duplicate lines?", "Use Remove Duplicate Lines for that."], P]],
  ["list-to-comma-separated", "List to Comma Separated Converter", "Turn a list with one item per line into a single comma separated line.", ["list to comma separated", "column to comma", "new line to comma converter"], [
    "Paste a list with one item per line, such as a column copied from Excel, and get a single line separated by commas.",
    "Useful for SQL IN clauses, tag fields, email recipient lists and spreadsheet formulas.",
    "Empty lines are skipped and each item is trimmed."],
    [["Can I go the other way?", "Yes, use the comma separated to list tool."], ["Does it add quotes?", "No."], P]],
  ["comma-separated-to-list", "Comma Separated to List Converter", "Split a comma or semicolon separated string into one item per line.", ["comma separated to list", "comma to new line", "split by comma"], [
    "Paste values separated by commas or semicolons and get one value per line.",
    "Useful for turning a tag field, a CSV row or a pasted array into a column.",
    "Extra spaces around items are removed."],
    [["Does it handle semicolons?", "Yes."], ["Does it handle quoted commas?", "No. It splits on every comma."], P]],
  ["add-line-numbers", "Add Line Numbers to Text", "Number each line of your text, starting at 1.", ["add line numbers", "number lines online", "line numbering tool"], [
    "Paste your text and every line gets a number in the form 1. text. It is handy for code reviews, poems, scripts and legal text.",
    "Blank lines are numbered too, so references stay aligned with the original.",
    "Copy the result and paste it into your document."],
    [["Can I start from another number?", "Not yet. It starts at 1."], ["Can I remove numbers?", "Use find and replace with a pattern."], P]],
  ["remove-empty-lines", "Remove Empty Lines", "Delete blank lines from text and keep only lines with content.", ["remove empty lines", "delete blank lines", "remove blank lines online"], [
    "Paste your text and lines that are empty or contain only spaces are deleted.",
    "Useful for cleaning copied web text, logs, CSV exports and code.",
    "If you need to keep paragraph breaks, use the remove extra spaces tool instead."],
    [["Does it remove lines with only spaces?", "Yes."], ["Does it change the other lines?", "No."], P]],
  ["trim-lines-whitespace", "Trim Whitespace from Each Line", "Remove leading and trailing spaces from every line of text.", ["trim whitespace", "remove leading spaces", "trim lines"], [
    "Paste text and spaces and tabs at the start and end of every line are removed. Spaces inside a line stay.",
    "Useful for cleaning indented pasted text, lists and data before importing.",
    "It keeps empty lines. Combine with Remove Empty Lines if you want those gone."],
    [["Does it remove spaces inside lines?", "No."], ["Does it remove tabs?", "Yes, at the ends of lines."], P]],
  ["title-case-converter", "Title Case Converter", "Capitalize a headline in title case, keeping small words like of, and, the lowercase.", ["title case converter", "capitalize title", "headline capitalization", "title capitalization tool"], [
    "Paste a headline and each main word is capitalized while short words such as a, an, the, and, of and in stay lowercase unless they start the title.",
    "This follows a common simplified version of AP and Chicago style. Style guides differ on prepositions and hyphenated words, so check yours.",
    "For all words capitalized, use the case converter."],
    [["Which words stay lowercase?", "Short articles, conjunctions and prepositions."], ["Is the first word always capitalized?", "Yes."], P]],
  ["sentence-case-converter", "Sentence Case Converter", "Convert text, such as all caps, to normal sentence case with a capital at the start of each sentence.", ["sentence case converter", "uppercase to sentence case", "fix all caps text"], [
    "Paste text in capitals or mixed case and the tool lowercases it and capitalizes the first letter of each sentence.",
    "Useful for fixing text typed with caps lock on and for cleaning headlines.",
    "Names and acronyms are lowercased too, so fix them afterward."],
    [["Does it keep proper names?", "No. Fix those by hand after converting."], ["Does it work with other languages?", "Yes for scripts with letter case."], P]],
  ["camelcase-snake-case-converter", "camelCase, snake_case, kebab-case Converter", "Convert any phrase to camelCase, snake_case, kebab-case, PascalCase or CONSTANT_CASE.", ["camelcase converter", "snake case converter", "kebab case converter", "pascal case"], [
    "Type or paste a phrase or an identifier and choose a format. The tool splits words at spaces, hyphens, underscores and capital letters, then joins them in the style you pick.",
    "Developers use these formats for variables, file names, URL slugs, CSS classes and environment variables.",
    "Use one style consistently in a project."],
    [["Which style do JavaScript variables use?", "camelCase."], ["Which style do Python variables use?", "snake_case."], P]],
  ["arabic-diacritics-remover", "Arabic Diacritics Remover (Tashkeel)", "Remove tashkeel (fatha, damma, kasra, shadda, sukun) from Arabic text.", ["remove arabic diacritics", "tashkeel remover", "حذف التشكيل", "ازالة التشكيل"], [
    "الصق النص العربي المشكول وسيتم حذف جميع الحركات مثل الفتحة والضمة والكسرة والشدة والسكون. Paste Arabic text and all diacritical marks and tatweel are removed.",
    "Useful for searching, comparing texts, data cleaning and typing without marks. Letters themselves are not changed.",
    "Removing diacritics can make some words ambiguous, so keep the original for Quran and poetry."],
    [["Does it remove the tatweel?", "Yes."], ["Does it change letters?", "No."], P]],
  ["arabic-numbers-converter", "Arabic Numerals Converter", "Convert between Western digits (0-9) and Arabic-Indic digits (٠-٩) in any text.", ["arabic numbers converter", "convert numbers to arabic", "تحويل الأرقام", "arabic indic numerals"], [
    "Choose a direction and paste text. All digits are replaced, and the rest of the text stays the same.",
    "Eastern Arabic-Indic digits are used in many Arabic-speaking countries, while Western digits are common in North Africa and online. Persian digits are also converted to Western.",
    "Check forms that only accept one style."],
    [["Does it convert Persian digits?", "Yes, to Western digits."], ["Does it change letters?", "No."], P]],
  ["arabic-keyboard-converter", "Wrong Keyboard Layout Converter (Arabic / English)", "Fix text typed with the wrong keyboard: English keys to Arabic letters and back.", ["arabic keyboard converter", "wrong keyboard layout fix", "تحويل الكيبورد", "hgsghl"], [
    "If you typed with the English layout and meant Arabic, such as hgsghl for السلام, paste it and choose English keys to Arabic. The other direction converts Arabic typed with the Arabic layout back to the English keys.",
    "The mapping follows the standard Arabic 101 keyboard. Shifted keys and some symbols are not converted.",
    "It is handy for passwords and URLs typed on the wrong layout."],
    [["Which layout is used?", "Standard Arabic 101."], ["Does it support Shift characters?", "Not yet."], P]],
  ["text-to-hex-converter", "Text to Hex Converter", "Convert text to hexadecimal bytes and hex back to text, using UTF-8.", ["text to hex", "hex to text converter", "string to hex", "hex decoder"], [
    "Type text to get each UTF-8 byte as two hex digits. Switch the mode to decode a hex string back to readable text.",
    "Developers use hex to inspect data, debug encodings and write byte strings.",
    "Separate bytes with spaces or commas. A prefix 0x is accepted."],
    [["What is the hex for A?", "41."], ["Does it support Arabic or emoji?", "Yes, through UTF-8."], P]],
  ["text-to-ascii-converter", "Text to ASCII Code Converter", "Convert characters to their ASCII or Unicode code numbers and back.", ["text to ascii", "ascii to text", "character code converter", "char code"], [
    "Type text to get the decimal code of each character, or paste codes separated by spaces to get text.",
    "ASCII covers codes 0 to 127. Higher numbers are Unicode code points, so accents, Arabic and emoji work too.",
    "Useful for programming exercises and debugging."],
    [["What is the ASCII code of A?", "65."], ["What is code 97?", "The letter a."], P]],
  ["unicode-escape-converter", "Unicode Escape Converter", "Convert text to \\uXXXX escapes for JavaScript and JSON, and convert escapes back.", ["unicode escape", "unicode to text", "u escape sequence", "json unicode escape"], [
    "Paste text to replace each non-ASCII character with its \\u escape, or paste escaped text to read it again. Characters beyond the basic plane use the \\u{...} form.",
    "Escapes keep source files and JSON safe from encoding problems.",
    "ASCII characters are left as they are."],
    [["Does it support emoji?", "Yes, with \\u{...}."], ["Is this the same as URL encoding?", "No. Use the URL encoder for that."], P]],
  ["caesar-cipher-tool", "Caesar Cipher Encoder and Decoder", "Encrypt and decrypt text with a Caesar cipher using any shift from 1 to 25.", ["caesar cipher", "caesar cipher decoder", "shift cipher", "caesar cipher online"], [
    "The Caesar cipher shifts every letter by a fixed number of places. With shift 3, A becomes D. Choose the shift, choose encrypt or decrypt and enter your text.",
    "It is one of the oldest ciphers and is easy to break, so use it for puzzles and learning, never for real secrets.",
    "Only the 26 letters of the English alphabet are shifted. Everything else is unchanged."],
    [["How do I decode without the key?", "Try all 25 shifts."], ["Is it secure?", "No."], P]],
  ["rot13-converter", "ROT13 Encoder and Decoder", "Encode or decode text with ROT13, the Caesar cipher with shift 13.", ["rot13", "rot13 decoder", "rot13 encoder"], [
    "ROT13 replaces each letter with the one 13 places later. Because the alphabet has 26 letters, applying it twice returns the original, so the same tool encodes and decodes.",
    "It is used to hide spoilers and puzzle answers, not for security.",
    "Digits, spaces and punctuation are unchanged."],
    [["How do I decode ROT13?", "Apply ROT13 again."], ["Is it encryption?", "No, it only hides text from a casual glance."], P]],
  ["nato-phonetic-alphabet-converter", "NATO Phonetic Alphabet Converter", "Spell any text with the NATO alphabet: Alfa, Bravo, Charlie and so on.", ["nato phonetic alphabet", "phonetic alphabet converter", "spell with nato alphabet"], [
    "Type a name, code or word and the tool shows how to spell it aloud: Alfa, Bravo, Charlie, Delta. Digits use the standard words, including Niner for 9.",
    "It is used in aviation, radio, military and customer service to avoid confusion between letters like B and D.",
    "Spaces are shown as a slash."],
    [["Why Alfa and Juliett?", "They are the official spellings, chosen so they are pronounced correctly worldwide."], ["Does it handle numbers?", "Yes."], P]],
  ["pig-latin-translator", "Pig Latin Translator", "Translate English text into Pig Latin.", ["pig latin translator", "pig latin generator", "translate to pig latin"], [
    "Words that start with a consonant move that consonant cluster to the end and add ay, so pig becomes igpay. Words that start with a vowel add way.",
    "It is a playful language game for kids and word puzzles.",
    "There are several variants. This tool uses the common one."],
    [["How does Pig Latin work?", "Move the starting consonants to the end and add ay."], ["What about words that start with vowels?", "Add way to the end."], P]],
  ["leetspeak-converter", "Leetspeak Converter", "Convert text to leetspeak (1337), replacing letters with similar numbers.", ["leetspeak converter", "1337 translator", "leet speak generator"], [
    "Type text and common letters are swapped for digits: a to 4, e to 3, i to 1, o to 0, s to 5 and t to 7.",
    "Leetspeak started in online games and hacker culture. Use it for usernames, nicknames and fun.",
    "It is not a secure way to make passwords."],
    [["What is 1337?", "Leet, short for elite."], ["Can I convert back?", "Not automatically."], P]],
  ["invisible-character-generator", "Invisible Character Generator", "Copy blank or invisible Unicode characters for empty names and blank messages.", ["invisible character", "blank character copy paste", "empty character", "invisible text"], [
    "Pick a blank character and copy it. Hangul filler and Braille blank are commonly used for empty usernames and blank chat messages. Zero-width characters are fully invisible.",
    "Some apps strip or reject certain characters, so try another one if the first does not work.",
    "Do not use invisible characters to deceive people or evade moderation."],
    [["Which one works for blank names?", "Hangul filler often works. Try Braille blank if not."], ["Is it safe?", "It is plain text, but some sites block it."], P]],
  ["palindrome-checker", "Palindrome Checker", "Check whether a word or phrase reads the same forwards and backwards.", ["palindrome checker", "is it a palindrome", "palindrome test"], [
    "Type a word or a sentence. The tool ignores spaces, punctuation and capital letters, then compares the text with its reverse.",
    "Famous examples include racecar and A man, a plan, a canal: Panama.",
    "Letters from any language work."],
    [["Are spaces ignored?", "Yes."], ["Is a single letter a palindrome?", "Yes."], P]],
  ["anagram-checker", "Anagram Checker", "Check if two words or phrases are anagrams of each other.", ["anagram checker", "are these anagrams", "anagram test"], [
    "Enter two words or phrases. They are anagrams if they use exactly the same letters the same number of times, ignoring spaces, capitals and punctuation.",
    "For example, listen and silent are anagrams.",
    "It checks a pair. It does not search for all possible anagrams."],
    [["Are spaces ignored?", "Yes."], ["Does it find new anagrams?", "No. It only compares two texts."], P]],
  ["letter-frequency-counter", "Letter Frequency Counter and Vowel Counter", "Count how many times each letter appears and how many vowels and consonants a text has.", ["letter frequency counter", "vowel counter", "count letters in text", "character frequency"], [
    "Paste text to see each letter with its count, plus totals for vowels and consonants.",
    "Frequency analysis is used in cryptography, linguistics and word games.",
    "Vowels are counted as a, e, i, o and u in Latin text."],
    [["Are capital letters merged?", "Yes."], ["Does it count digits?", "No. Only letters."], P]],
  ["sentence-counter", "Sentence Counter", "Count the sentences, words and characters in your text.", ["sentence counter", "count sentences", "how many sentences"], [
    "Paste text and the tool counts sentences by looking for ending marks such as periods, question marks and exclamation marks.",
    "It also shows the word and character count for essays and assignments.",
    "Abbreviations like Dr. can add extra sentences, so check short texts by hand."],
    [["How are sentences detected?", "By . ? and ! marks."], ["Does it work for Arabic?", "Mostly, since it uses the same marks."], P]],
  ["paragraph-counter", "Paragraph Counter", "Count paragraphs, words and characters in a text.", ["paragraph counter", "count paragraphs", "how many paragraphs"], [
    "Paste text and the tool counts blocks separated by blank lines as paragraphs.",
    "Useful for essays and article length targets.",
    "Single line breaks within a block do not start a new paragraph."],
    [["What counts as a paragraph?", "A block of text separated by an empty line."], ["Does it count words?", "Yes."], P]],
  ["syllable-counter", "Syllable Counter", "Estimate the number of syllables in English text, for poems, haiku and readability.", ["syllable counter", "count syllables", "haiku syllable counter"], [
    "Paste English text for an estimate of its syllables. The tool uses vowel group rules, which are right for most words.",
    "Poets use it for haiku (5-7-5) and meter, and teachers use it to check reading level.",
    "English has many exceptions, so treat the number as a close estimate."],
    [["How accurate is it?", "Right for most common words, with a few exceptions."], ["Does it work for other languages?", "It is designed for English."], P]],
  ["reading-time-calculator", "Reading Time Calculator", "Estimate how long it takes to read a text, from its word count.", ["reading time calculator", "how long to read", "estimated reading time"], [
    "Paste your article and the tool divides the word count by a reading speed. The default is 238 words per minute, an average for adults reading silently. You can change it.",
    "Blogs add this estimate to posts. Students use it to plan study sessions.",
    "Dense or technical text takes longer."],
    [["What is the average reading speed?", "About 200 to 250 words per minute."], ["Can I change the speed?", "Yes."], P]],
  ["speaking-time-calculator", "Speaking Time Calculator", "Estimate how long a speech or script takes to say aloud.", ["speaking time calculator", "speech length calculator", "words to minutes", "presentation time"], [
    "Paste your speech and see how long it takes at a normal speaking speed of 130 words per minute. Change the speed for slower or faster delivery.",
    "A 5 minute speech is about 650 words. Presentations with pauses and slides need fewer.",
    "Practice aloud once to confirm."],
    [["How many words per minute do people speak?", "About 120 to 150."], ["How many words is a 10 minute speech?", "Around 1,300."], P]],
  ["text-wrapper", "Text Wrapper (Word Wrap)", "Wrap long lines of text to a fixed width in characters.", ["word wrap online", "text wrapper", "wrap text at 80 characters", "line wrap tool"], [
    "Paste text, set the maximum line width and the tool breaks lines at word boundaries.",
    "Useful for emails, code comments, README files and plain text documents, where 72 or 80 characters is common.",
    "Words longer than the width stay on their own line."],
    [["What width should I use?", "72 to 80 for code and email."], ["Does it keep paragraphs?", "Yes. Existing line breaks stay."], P]],
  ["tabs-spaces-converter", "Tabs to Spaces Converter", "Convert tabs to spaces or spaces back to tabs in code and text.", ["tabs to spaces", "spaces to tabs", "convert tabs"], [
    "Choose a direction and paste text. Tabs become four spaces, or each run of four spaces becomes a tab.",
    "It keeps indentation consistent across editors and teams.",
    "For other widths, use find and replace."],
    [["How many spaces per tab?", "Four in this tool."], ["Does it change other whitespace?", "No."], P]],
  ["reverse-words-tool", "Reverse Words Tool", "Reverse the order of words in a sentence, or reverse the letters inside each word.", ["reverse words", "reverse word order", "reverse each word"], [
    "Choose a mode. Reverse word order turns one two three into three two one. Reverse letters in each word keeps word order but flips every word.",
    "It is a quick tool for puzzles and string exercises.",
    "To reverse the whole text letter by letter, use Reverse Text."],
    [["What is the difference from Reverse Text?", "Reverse Text flips everything. This one works on words."], ["Does it keep punctuation?", "It treats punctuation as part of a word."], P]],
];

export const wave2Tools: ToolMeta[] = SPECS.map(([slug, title, desc, keywords, paras, faqs]) => ({
  slug, title, shortDescription: desc, metaDescription: desc.length > 158 ? desc.slice(0, 155) + "..." : desc, category: CAT, keywords,
  componentKey: `Pop:${slug}`, article: paras.join("\n\n"), faqs: faqs.map(([q, a]) => ({ q, a })),
}));
