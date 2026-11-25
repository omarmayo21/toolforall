import type { CategoryKey, ToolMeta } from "../types";

type Spec = [slug: string, title: string, desc: string, kw: string[], paras: [string, string, string], faqs: [string, string][]];
const P: [string, string] = ["Is my data sent to a server?", "No. Everything runs in your browser. Nothing you type is uploaded or stored."];
const CAT: CategoryKey = "developer-tools";

const SPECS: Spec[] = [
  ["sha1-hash-generator", "SHA-1 Hash Generator", "Generate the SHA-1 hash of any text in your browser.", ["sha1 generator", "sha1 hash online", "sha-1 checksum"], [
    "Type or paste text and the 40 character SHA-1 hash appears instantly in hexadecimal. The hash is computed with the Web Crypto API built into your browser.",
    "SHA-1 is still used for Git object ids, legacy checksums and file identification. It is not safe for passwords or signatures because collisions can be produced.",
    "For new work, choose SHA-256 or SHA-512. The same input always gives the same hash, and a one character change gives a completely different result."],
    [["How long is a SHA-1 hash?", "160 bits, shown as 40 hex characters."], ["Can SHA-1 be reversed?", "No. It is a one way function, but short or common inputs can be guessed."], P]],
  ["sha384-hash-generator", "SHA-384 Hash Generator", "Create a SHA-384 hash of any text.", ["sha384 generator", "sha-384 hash online"], [
    "Enter text to see its SHA-384 digest, a 96 character hex string computed locally with the Web Crypto API.",
    "SHA-384 is a truncated variant of SHA-512. It is used in TLS certificates, subresource integrity attributes for scripts and some government standards.",
    "For the integrity attribute in HTML, the browser expects the hash in Base64 with a sha384- prefix, so convert the output if needed."],
    [["How is SHA-384 different from SHA-512?", "It uses different starting values and cuts the output to 384 bits."], ["Is it secure?", "Yes, it is part of the SHA-2 family and has no known practical attacks."], P]],
  ["sha512-hash-generator", "SHA-512 Hash Generator", "Generate a SHA-512 hash of any text.", ["sha512 generator", "sha-512 hash online", "sha512 checksum"], [
    "Paste text and get its 128 character SHA-512 hash. It runs in your browser through the Web Crypto API.",
    "SHA-512 is a SHA-2 hash with a 512 bit output. It is fast on 64 bit processors and is used in signatures, Linux password hashes and integrity checks.",
    "Do not store passwords with a plain SHA-512 hash. Use a slow password hash such as bcrypt or Argon2 with a salt."],
    [["Is SHA-512 stronger than SHA-256?", "It has a longer output and larger security margin. Both are considered safe today."], ["Why is the hash 128 characters?", "512 bits is 64 bytes, which is 128 hex digits."], P]],
  ["hmac-generator", "HMAC Generator (SHA-256)", "Compute an HMAC-SHA256 signature from a message and a secret key.", ["hmac generator", "hmac sha256 online", "hmac calculator", "webhook signature"], [
    "Enter a message and a secret key. The tool returns the HMAC-SHA256 in hex, the same value your server computes to sign a request.",
    "HMAC proves that a message came from someone with the key and was not changed. Webhook providers such as Stripe and GitHub sign payloads this way, so you can use the tool to debug a signature mismatch.",
    "Mind exact bytes: a trailing newline or different character encoding in the message changes the result. The tool uses UTF-8."],
    [["Why does my signature not match?", "Check whitespace, encoding and that you sign the raw body, not parsed JSON."], ["Is HMAC the same as a hash?", "No. HMAC mixes in a secret key, so only key holders can produce it."], ["Is it safe to paste my secret here?", "Everything stays in your browser, but use test keys, never production secrets."]]],
  ["crc32-calculator", "CRC32 Checksum Calculator", "Calculate the CRC32 checksum of a text in hex and decimal.", ["crc32 calculator", "crc32 checksum online", "crc32 generator"], [
    "Type text to get the CRC32 checksum as an 8 digit hex value and as a decimal number. It uses the standard IEEE polynomial used by ZIP, PNG and Ethernet.",
    "CRC32 detects accidental changes in data. It is quick and tiny, which is why file formats and network protocols use it.",
    "It is not a secure hash. Anyone can craft different data with the same CRC, so do not use it for security."],
    [["Which polynomial is used?", "0xEDB88320 (reversed IEEE 802.3), as in ZIP and PNG."], ["Is it the same as a hash?", "It is a checksum for error detection, not a cryptographic hash."], P]],
  ["base32-encode-decode", "Base32 Encoder and Decoder", "Encode text to Base32 or decode Base32 back to text (RFC 4648).", ["base32 encode", "base32 decode", "base32 converter"], [
    "Choose encode or decode and paste your input. The tool uses the RFC 4648 alphabet, with A to Z and 2 to 7, and adds = padding.",
    "Base32 is common in authenticator app secrets (TOTP), case insensitive identifiers and file names, since it avoids symbols and similar looking characters.",
    "It makes data about 60 percent larger. Base64 is more compact but has case sensitive and symbol characters."],
    [["Where do I see Base32?", "In 2FA setup keys and some URL safe ids."], ["Is it encryption?", "No. Anyone can decode it."], P]],
  ["base64url-encode-decode", "Base64URL Encoder and Decoder", "Encode or decode URL safe Base64, the format used in JWTs.", ["base64url encode", "base64url decode", "url safe base64"], [
    "Base64URL replaces + with - and / with _, and drops the = padding, so the result can be used in URLs, cookies and file names.",
    "Use it to read the parts of a JWT by hand, build signed links or debug API tokens. The tool handles UTF-8 text correctly.",
    "If your input has missing padding, the decoder adds it back for you."],
    [["How is it different from Base64?", "It uses - and _ and has no padding."], ["Can I decode a JWT part?", "Yes, paste one segment of the token."], P]],
  ["html-entities-encoder-decoder", "HTML Entities Encoder and Decoder", "Convert special characters to HTML entities and back.", ["html entities", "html entity encoder", "html entity decoder", "escape html characters"], [
    "Paste text to replace characters like <, >, & and quotes with entities such as &lt; and &amp;. Common symbols such as &copy; and &euro; get named entities, and other non ASCII characters become numeric ones.",
    "Escaping prevents broken markup and helps stop injection when you place text into HTML. Decode mode turns entities back into readable text, including numeric and hex forms.",
    "Always escape user content on the server too. A browser tool is for quick conversions and checking."],
    [["Why encode ampersands?", "A bare & can be read as the start of an entity."], ["Does it decode &#8364;?", "Yes. Decimal and hex numeric entities are supported."], P]],
  ["json-to-yaml-converter", "JSON to YAML Converter", "Convert JSON to clean, readable YAML.", ["json to yaml", "convert json to yaml online", "json yaml converter"], [
    "Paste valid JSON and get YAML with two space indentation. Nested objects and arrays are preserved, and strings are quoted only when YAML needs it.",
    "Useful for Kubernetes manifests, GitHub Actions, Docker Compose and OpenAPI files, where you start from JSON output of a tool.",
    "If the JSON is invalid, the tool says so. Fix the syntax first, for example trailing commas and single quotes."],
    [["Are comments kept?", "JSON has no comments, so none appear."], ["Can I convert YAML to JSON?", "Yes, use the YAML to JSON converter."], P]],
  ["json-sort-keys", "JSON Key Sorter", "Sort the keys of a JSON object alphabetically, including nested objects.", ["sort json keys", "json sorter", "alphabetize json"], [
    "Paste JSON and every object is rewritten with keys in alphabetical order, at every depth. Array order is kept.",
    "Sorted keys make diffs and code reviews cleaner, and help when comparing two API responses or config files.",
    "The output is pretty printed with two space indentation."],
    [["Does it sort arrays?", "No. Array order has meaning, so it stays."], ["Is the data changed?", "Only the order of keys."], P]],
  ["json-flatten-tool", "JSON Flatten Tool", "Flatten nested JSON into single level keys like user.name and tags[0].", ["flatten json", "json flattener", "json dot notation"], [
    "Paste nested JSON and get a flat object whose keys are paths, such as user.address.city or items[2].id.",
    "Flat data is easier to move into spreadsheets, environment variables, translation files and search indexes.",
    "Empty objects and arrays are kept as values so no key disappears."],
    [["What notation is used?", "Dots for objects and [n] for array positions."], ["Can I unflatten it?", "Not with this tool."], P]],
  ["json-stringify-escape", "JSON String Escape and Unescape", "Escape text as a JSON string value or unescape one back.", ["json escape", "json stringify online", "json unescape", "escape string for json"], [
    "Paste any text, including quotes, new lines and tabs, and get it as a valid JSON string with the needed backslashes. The reverse mode reads an escaped string back to plain text.",
    "Use it when you must embed a multi line message or HTML snippet inside a JSON payload, or when a log shows an escaped body you want to read.",
    "Output includes the surrounding double quotes."],
    [["Which characters are escaped?", "Quotes, backslashes and control characters such as new lines."], ["Does it handle emoji?", "Yes, they stay as they are."], P]],
  ["json-to-typescript", "JSON to TypeScript Interface Generator", "Generate TypeScript interfaces from a JSON sample.", ["json to typescript", "json to ts interface", "generate typescript types from json"], [
    "Paste a JSON response and the tool builds exported interfaces, one for each nested object, with the field types it finds: string, number, boolean, null and arrays.",
    "It saves time when you start using a new API. Treat the result as a starting point: a single sample cannot show optional fields or union types, so refine them by hand.",
    "Property names that are not valid identifiers are quoted automatically."],
    [["Does it detect optional fields?", "No. It reads one sample."], ["What about arrays of objects?", "It uses the first item's shape."], P]],
  ["json-to-go-struct", "JSON to Go Struct Generator", "Turn a JSON sample into Go structs with json tags.", ["json to go struct", "json to golang", "go struct from json"], [
    "Paste JSON and get Go struct definitions with exported field names and json tags. Whole numbers become int, decimals float64, and nested objects become their own structs.",
    "It is a fast way to start decoding an API response with encoding/json.",
    "A sample cannot tell if a number is sometimes a decimal or a field is optional, so use pointers or omitempty where needed."],
    [["How are field names made?", "Keys become PascalCase, and the original key goes in the json tag."], ["Is null supported?", "It becomes interface{}."], P]],
  ["json-to-sql-insert", "JSON to SQL INSERT Generator", "Create INSERT statements from a JSON array of objects.", ["json to sql", "json to insert statements", "json to sql insert"], [
    "Paste a JSON array and the tool writes one INSERT statement per object. Column names are the union of all keys, strings are quoted, quotes are doubled and missing values become NULL.",
    "Replace my_table with your table name. Nested objects are stored as JSON text.",
    "For large imports, use your database's bulk loader instead."],
    [["Which SQL dialect?", "Standard SQL that works in MySQL, PostgreSQL and SQLite."], ["How are quotes handled?", "A single quote becomes two."], P]],
  ["csv-to-sql-insert", "CSV to SQL INSERT Generator", "Convert CSV rows into SQL INSERT statements.", ["csv to sql", "csv to insert statements", "csv to sql converter"], [
    "Paste CSV with a header row. The header names become columns, and each following row becomes an INSERT statement. Numbers stay unquoted, text is quoted and empty cells become NULL.",
    "Quoted CSV fields with commas and doubled quotes are read correctly.",
    "Change my_table to your own table name before running the script."],
    [["Does the first row need to be a header?", "Yes."], ["Can it handle commas inside values?", "Yes, when the value is wrapped in double quotes."], P]],
  ["sql-in-clause-generator", "SQL IN Clause Generator", "Turn a list of values into an SQL IN (...) clause.", ["sql in clause generator", "list to sql in", "comma separated to in clause"], [
    "Paste values separated by new lines or commas and get a ready IN (...) clause. Numbers stay as they are and text is wrapped in single quotes.",
    "It is handy when you copy ids from a spreadsheet into a query.",
    "Most databases limit the size of an IN list, so use a temporary table for thousands of values."],
    [["Does it escape quotes?", "Yes."], ["Does it remove duplicates?", "No."], P]],
  ["sql-escape-string", "SQL String Escape", "Escape single quotes in text so it is safe inside an SQL string literal.", ["sql escape string", "escape single quote sql", "sql string escape"], [
    "Paste text and each single quote is doubled, which is the standard way to escape quotes in SQL string literals.",
    "It helps when you write a one off query by hand.",
    "In application code, never build queries from user input this way. Use parameterized queries, which prevent SQL injection."],
    [["Does it protect from SQL injection?", "Not reliably. Use parameters."], ["What about backslashes?", "Some databases such as MySQL also treat backslash as an escape."], P]],
  ["csv-to-markdown-table", "CSV to Markdown Table Converter", "Convert CSV or tab separated data into a Markdown table.", ["csv to markdown table", "excel to markdown table", "markdown table generator"], [
    "Paste CSV, or cells copied from Excel or Google Sheets, and get a Markdown table with a header separator row.",
    "Use it for README files, GitHub issues, docs and wikis.",
    "Pipe characters inside cells are escaped so the table does not break."],
    [["Can I paste from Excel?", "Yes, tab separated data is detected."], ["Is the first row a header?", "Yes."], P]],
  ["query-string-to-json", "Query String to JSON Converter", "Parse a URL query string into a JSON object.", ["query string to json", "url params to json", "parse query string"], [
    "Paste a full URL or just the part after the question mark. Parameters are decoded and returned as JSON. Repeated keys become arrays.",
    "It helps when debugging tracking links, OAuth redirects and API calls.",
    "Everything after a # is ignored."],
    [["Are values decoded?", "Yes, %20 and + become spaces."], ["What about repeated keys?", "They become an array."], P]],
  ["json-to-query-string", "JSON to Query String Converter", "Convert a JSON object into a URL encoded query string.", ["json to query string", "object to url params", "json to url parameters"], [
    "Paste a flat JSON object and get key=value pairs joined with &, with proper encoding of spaces and special characters.",
    "Arrays create repeated keys, such as tag=a&tag=b.",
    "Nested objects are not expanded. Flatten them first with the JSON flatten tool."],
    [["Is the output encoded?", "Yes."], ["Does it add the ?", "No. Add it yourself."], P]],
  ["css-minifier", "CSS Minifier", "Minify CSS by removing comments, whitespace and the last semicolons.", ["css minifier", "minify css online", "compress css"], [
    "Paste your stylesheet and get a compact version without comments, extra spaces and line breaks. This reduces file size and speeds up loading.",
    "The tool is a safe whitespace minifier. It does not rename or merge rules, so the result behaves like the original.",
    "Keep your readable source file and minify only the output you deploy."],
    [["How much does it save?", "Usually 10 to 40 percent before gzip."], ["Will it break my CSS?", "Plain CSS is safe. Strings with special spacing in content may need a check."], P]],
  ["sql-minifier", "SQL Minifier", "Remove comments and extra whitespace from an SQL query.", ["sql minifier", "compress sql", "minify sql online"], [
    "Paste a query and get it on one line without comments and extra spaces.",
    "It is useful for logs, config files and embedding SQL in code.",
    "String literals with several spaces may be changed, so check queries with text containing multiple spaces."],
    [["Does it remove comments?", "Yes, both -- and /* */."], ["Is the query still valid?", "Yes, for normal queries."], P]],
  ["xml-minifier", "XML Minifier", "Strip comments and whitespace between tags in XML.", ["xml minifier", "minify xml online", "compress xml"], [
    "Paste XML and get it without comments and without whitespace between elements.",
    "Smaller XML helps with API payloads, sitemaps and feeds.",
    "Whitespace inside text nodes is kept, because it can be meaningful."],
    [["Are comments removed?", "Yes."], ["Does it validate the XML?", "No. Use the XML validator."], P]],
  ["ulid-generator", "ULID Generator", "Generate sortable ULIDs, unique ids that start with a timestamp.", ["ulid generator", "ulid online", "generate ulid"], [
    "Each ULID has 26 characters: a 48 bit millisecond timestamp followed by 80 random bits, in Crockford Base32. Generate up to 100 at a time.",
    "ULIDs sort by creation time, which keeps database indexes tidy, unlike random UUID v4. They are URL safe and case insensitive.",
    "Random bits come from the secure random generator of your browser."],
    [["ULID or UUID?", "ULIDs sort by time and are shorter. UUIDs are more widely supported."], ["Can two be the same?", "Practically never."], P]],
  ["nanoid-generator", "NanoID Generator", "Generate secure, URL friendly NanoIDs of any length.", ["nanoid generator", "nanoid online", "random id generator"], [
    "Pick a length (21 by default) and a count to generate NanoIDs using the standard 64 character URL safe alphabet.",
    "NanoIDs are shorter than UUIDs and are popular for short links, record ids and file names.",
    "Collision risk depends on length. At 21 characters it is comparable to UUID v4."],
    [["What characters are used?", "A to Z, a to z, 0 to 9, _ and -."], ["Is it secure?", "It uses crypto.getRandomValues."], P]],
  ["random-string-generator", "Random String Generator", "Generate random alphanumeric strings of any length.", ["random string generator", "random text generator", "random token generator"], [
    "Choose a length and how many strings you want. Each one uses letters and digits chosen with your browser's secure random generator.",
    "Use it for test data, API keys during development, coupon codes and session ids.",
    "For production secrets, generate values on your server or in a secrets manager."],
    [["Which characters are included?", "A-Z, a-z and 0-9."], ["How long should a token be?", "At least 32 characters for secrets."], P]],
  ["mac-address-generator", "MAC Address Generator", "Generate random, locally administered unicast MAC addresses.", ["mac address generator", "random mac address", "fake mac address"], [
    "Generate random MAC addresses in the format aa:bb:cc:dd:ee:ff. The first byte is set so the address is unicast and locally administered, so it will not clash with real manufacturer ranges.",
    "Use them for testing, virtual machines, containers and network labs.",
    "Changing the MAC address of a real device on networks you do not own can break the terms of service."],
    [["Is it a real device address?", "No, it is random."], ["Why locally administered?", "It marks the address as not assigned by a manufacturer."], P]],
  ["subnet-calculator", "IPv4 Subnet Calculator", "Find network, broadcast, mask and host range for any IPv4 address and prefix.", ["subnet calculator", "ip subnet calculator", "cidr calculator", "subnet mask calculator"], [
    "Enter an IPv4 address and a prefix length such as /24. You get the network address, broadcast address, subnet mask, wildcard mask, first and last usable host and the number of hosts.",
    "Network engineers use it for planning VLANs and firewall rules. Students use it to check subnetting exercises.",
    "A /31 is treated as a point to point link with two usable addresses, and a /32 as a single host."],
    [["How many hosts are in a /24?", "254 usable addresses."], ["What is a wildcard mask?", "The inverse of the subnet mask, used in ACLs."], P]],
  ["cidr-to-ip-range", "CIDR to IP Range Converter", "Convert CIDR notation such as 10.0.0.0/22 to its address range.", ["cidr to ip range", "cidr calculator", "cidr notation converter"], [
    "Type a CIDR block and see the first and last address, the mask and the host count.",
    "Useful for cloud security groups, allow lists and routing tables in AWS, Azure and Google Cloud.",
    "If the address has host bits set, the tool shows the network that contains it."],
    [["What does /22 mean?", "The first 22 bits are the network, giving 1,024 addresses."], ["Does it support IPv6?", "Not yet. IPv4 only."], P]],
  ["ip-to-decimal-converter", "IP Address to Decimal Converter", "Convert an IPv4 address to decimal, hex and binary, or a number back to an IP.", ["ip to decimal", "ip to integer", "decimal to ip", "ip to hex"], [
    "Enter 192.168.1.1 to get its 32 bit integer, hex and binary forms. Enter a number to get the dotted address.",
    "Databases often store IPs as integers because they are compact and easy to compare in ranges.",
    "Only IPv4 is supported."],
    [["What is 192.168.1.1 as a number?", "3232235777."], ["Why store IPs as numbers?", "Range queries are fast."], P]],
  ["ip-address-validator", "IP Address Validator", "Check whether text is a valid IPv4 or IPv6 address, one per line.", ["ip address validator", "validate ip address", "is valid ipv4", "ipv6 validator"], [
    "Paste one or many addresses, one per line. Each is marked as a valid IPv4, a valid IPv6 or not valid.",
    "IPv4 octets must be 0 to 255 with no extra leading text. IPv6 can use compressed forms such as ::1.",
    "A valid format does not mean the address is in use or reachable."],
    [["Are leading zeros allowed?", "Values like 192.168.001.1 are accepted as numbers up to 3 digits."], ["Does it ping?", "No. It only checks the format."], P]],
  ["port-numbers-lookup", "Common Port Numbers Lookup", "Search well known TCP and UDP ports and the service that uses them.", ["port numbers list", "common ports", "default port for", "tcp udp port lookup"], [
    "Search by number or service name, for example 5432 or redis. The table lists common ports for web, mail, databases and development servers.",
    "Ports 0 to 1023 are well known and assigned by IANA. 1024 to 49151 are registered, and the rest are dynamic.",
    "Defaults are only conventions. Any service can run on another port."],
    [["What port is HTTPS?", "443."], ["What port does PostgreSQL use?", "5432."], P]],
  ["mime-types-lookup", "MIME Types Lookup", "Find the MIME type (content type) for a file extension.", ["mime types list", "content type for file extension", "mime type lookup"], [
    "Search by extension, such as webp, or by type, such as video. Each row shows the Content-Type header value for common web, document, media and font files.",
    "A correct Content-Type makes browsers handle downloads and scripts safely, and helps with CDN and upload settings.",
    "Newer types, such as text/javascript for scripts, replace older ones such as application/javascript."],
    [["What is the type for .js?", "text/javascript."], ["What if the type is unknown?", "Use application/octet-stream."], P]],
  ["px-to-rem-converter", "PX to REM Converter", "Convert pixels to rem units, with an adjustable base font size.", ["px to rem", "pixels to rem converter", "px to rem calculator"], [
    "Enter a pixel value and the root font size, 16px by default. The tool gives the rem value, for example 24px is 1.5rem.",
    "rem scales with the user's browser font setting, which helps accessibility. Many teams size text and spacing in rem.",
    "If you set html font-size to 62.5 percent, change the base to 10."],
    [["What is 16px in rem?", "1rem at the default base."], ["Why use rem?", "It respects user font size preferences."], P]],
  ["px-to-em-converter", "PX to EM Converter", "Convert pixels to em units for a given parent font size.", ["px to em", "pixels to em converter", "px to em calculator"], [
    "Enter pixels and the parent element's font size. The tool gives the value in em.",
    "em is relative to the parent, so nested elements compound. That is useful for components that scale from their own font size, such as buttons.",
    "For predictable sizing across a page, rem is usually easier."],
    [["What is 20px in em at 16px?", "1.25em."], ["Do ems compound?", "Yes, when nested."], P]],
  ["rem-to-px-converter", "REM to PX Converter", "Convert rem to pixels using your base font size.", ["rem to px", "rem to pixels converter", "rem to px calculator"], [
    "Enter a rem value and the root font size to see the pixel size, for example 2rem is 32px at 16px.",
    "Use it to check designs against your CSS or to read values in a stylesheet.",
    "Users can change their browser font size, so the real pixel size may differ."],
    [["What is 1.5rem in px?", "24px at a 16px base."], ["Is the base always 16?", "It is the browser default."], P]],
  ["css-clamp-generator", "CSS Clamp() Generator for Fluid Typography", "Generate a clamp() value that scales between two sizes across a viewport range.", ["css clamp generator", "fluid typography calculator", "clamp function css"], [
    "Enter the minimum and maximum size in pixels and the viewport widths where scaling should start and end. The tool outputs a clamp() with rem and vw values.",
    "Fluid sizes replace many media queries. Text grows smoothly from phone to desktop and never goes beyond the limits.",
    "Use it for font sizes, padding and gaps. Test with browser zoom for accessibility."],
    [["How does clamp work?", "clamp(min, preferred, max) picks the preferred value but stays between min and max."], ["Why rem plus vw?", "The rem part keeps zoom support."], P]],
  ["css-text-shadow-generator", "CSS Text Shadow Generator", "Design a text shadow with sliders and copy the CSS.", ["css text shadow generator", "text shadow css", "text shadow generator"], [
    "Move the sliders for horizontal and vertical offset, blur and opacity and watch the preview. The text-shadow line is ready to copy.",
    "Soft shadows can improve readability of text on images. Keep contrast in mind.",
    "Several shadows can be combined with commas in your own CSS for glow effects."],
    [["What are the values?", "x offset, y offset, blur radius and color."], ["Does it affect performance?", "Very little."], P]],
  ["css-flexbox-generator", "CSS Flexbox Generator", "Build a flex container with live preview and copy the CSS.", ["css flexbox generator", "flexbox playground", "flexbox layout generator"], [
    "Choose direction, justify-content, align-items, wrap and gap, and watch the boxes rearrange in a live preview. Copy the CSS when it looks right.",
    "Flexbox is for one dimensional layout, in a row or in a column. Main axis settings use justify-content, and cross axis settings use align-items.",
    "For two dimensional layouts with rows and columns together, try the CSS Grid generator."],
    [["justify-content or align-items?", "The first aligns along the main axis, the second across it."], ["When to use wrap?", "When items should move to a new line instead of shrinking."], P]],
  ["css-grid-generator", "CSS Grid Generator", "Create a CSS grid layout with columns, rows and gap, and copy the code.", ["css grid generator", "css grid layout generator", "grid template columns generator"], [
    "Set the number of columns and rows, the gap and the column size. The preview shows the grid and the CSS is ready to copy.",
    "Grid handles rows and columns at once, so it suits page layouts, galleries and dashboards.",
    "Use 1fr for equal flexible columns, and minmax(0, 1fr) to stop long content from stretching them."],
    [["What does 1fr mean?", "One share of the free space."], ["Grid or flexbox?", "Grid for two dimensions, flexbox for one."], P]],
  ["css-specificity-calculator", "CSS Specificity Calculator", "Calculate the specificity of CSS selectors, one per line.", ["css specificity calculator", "css selector specificity", "specificity checker"], [
    "Paste selectors, one per line. Each shows specificity as (ids, classes and attributes, elements), for example #header .logo is (1, 1, 0).",
    "When two rules conflict, the one with higher specificity wins, left to right. If equal, the later rule wins.",
    "Inline styles and !important override these scores. The calculator treats :not() by its argument and ignores :where()."],
    [["What counts as a class level?", "Classes, attribute selectors and pseudo classes."], ["Do pseudo elements count?", "They count as elements."], P]],
  ["semver-bump-calculator", "Semantic Version Bump Calculator", "Find the next patch, minor and major version from a semver number.", ["semver calculator", "semantic version bump", "next version number"], [
    "Enter your current version, like 1.4.2, and see the next patch, minor and major versions.",
    "Semantic versioning uses MAJOR.MINOR.PATCH. Increase patch for bug fixes, minor for backward compatible features and major for breaking changes.",
    "A leading v is accepted. Pre release tags, such as 2.0.0-beta.1, are read too."],
    [["What happens to lower numbers on a bump?", "They reset to zero."], ["When is 1.0.0?", "When the public API is stable."], P]],
];

export const wave3Tools: ToolMeta[] = SPECS.map(([slug, title, desc, keywords, paras, faqs]) => ({
  slug, title, shortDescription: desc, metaDescription: desc.length > 158 ? desc.slice(0, 155) + "..." : desc, category: CAT, keywords,
  componentKey: `Pop:${slug}`, article: paras.join("\n\n"), faqs: faqs.map(([q, a]) => ({ q, a })),
}));
