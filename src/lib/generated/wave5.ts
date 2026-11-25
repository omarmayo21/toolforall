import type { CategoryKey, ToolMeta } from "../types";

type Spec = [slug: string, title: string, cat: string, desc: string, kw: string[], paras: [string, string, string], faqs: [string, string][]];
const P: [string, string] = ["Is my data sent to a server?", "No. Everything runs in your browser. Nothing you type is uploaded or stored."];
const S = "seo-webmaster-tools", I = "image-tools", F = "finance";

const SPECS: Spec[] = [
  ["whatsapp-link-generator", "WhatsApp Link Generator (wa.me)", S, "Create a click to chat WhatsApp link with a ready message.", ["whatsapp link generator", "wa.me link", "click to chat link", "whatsapp direct link"], [
    "Enter a phone number with the country code and an optional message. You get a wa.me link that opens a WhatsApp chat with that number and the text already typed.",
    "Put the link on your website, Instagram bio, email signature or ads, so customers can message you in one tap. No saved contact is needed.",
    "Write the number in international format using digits only: no plus sign, spaces or leading zeros. For Egypt, 01001234567 becomes 201001234567."],
    [["Do I need a WhatsApp Business account?", "No. It works with any WhatsApp number."], ["Can I add a message?", "Yes. It is URL encoded for you."], P]],
  ["telegram-link-generator", "Telegram Link Generator (t.me)", S, "Make a t.me link to your Telegram profile, channel or group, with optional text.", ["telegram link generator", "t.me link", "telegram direct message link"], [
    "Type a Telegram username and, if you like, a pre-filled message. The tool builds a t.me link that opens the chat in the app or in the browser.",
    "Use it on websites, bios and QR codes to make it easy to reach you.",
    "The username must be set in Telegram settings. Phone numbers are not used in these links."],
    [["Does it work for channels?", "Yes, use the channel username."], ["How long can usernames be?", "5 to 32 characters, with letters, digits and underscores."], P]],
  ["mailto-link-generator", "Mailto Link Generator", S, "Build a mailto link with subject, body, CC and BCC.", ["mailto link generator", "email link generator", "mailto subject and body", "html mailto"], [
    "Fill in the recipient, subject and message and get a mailto link. The subject and body are encoded, so line breaks and special characters work.",
    "Use it as the href of a button or link on a page. It opens the visitor's default email app with the draft ready.",
    "Spam bots can read mailto links in your HTML. Use a contact form if you worry about that."],
    [["Can I add several recipients?", "Yes. Separate addresses with commas."], ["Why does nothing open?", "The visitor has no default email app set up."], P]],
  ["youtube-thumbnail-grabber", "YouTube Thumbnail Grabber", S, "Get the thumbnail image of any YouTube video in several sizes.", ["youtube thumbnail downloader", "youtube thumbnail grabber", "get youtube video thumbnail", "youtube thumbnail url"], [
    "Paste a YouTube link, a Shorts link or a video ID. The tool shows the thumbnail in four sizes, up to 1280 x 720, and links to each image.",
    "Creators use it to review their own thumbnails or to find a reference. Bloggers use it to see how a video looks when shared.",
    "Thumbnails belong to the video owner. Ask permission before you reuse them."],
    [["Why is max resolution missing?", "Not all videos have a 1280 x 720 thumbnail."], ["Does it download the video?", "No. Only the image."], P]],
  ["youtube-timestamp-link-generator", "YouTube Timestamp Link Generator", S, "Create a YouTube link that starts at a specific time.", ["youtube timestamp link", "youtube link start at time", "youtube start time generator"], [
    "Paste a video link and enter hours, minutes and seconds. The tool gives a short youtu.be link with the t parameter that starts playback there.",
    "Share the exact moment in a chat, add it to show notes or point readers to the answer inside a long video.",
    "The time is converted to seconds, so 1:30 becomes t=90."],
    [["Does it work with Shorts?", "Yes, with the video ID."], ["Can I do it by hand?", "Yes, add ?t=90 to the link."], P]],
  ["instagram-line-break-generator", "Instagram Line Break Generator", S, "Keep empty lines and paragraph spacing in Instagram captions and bios.", ["instagram line break", "instagram caption spacing", "blank line instagram bio", "instagram space generator"], [
    "Instagram can remove blank lines when you paste a caption. This tool replaces empty lines with an invisible Braille blank, so the gaps survive.",
    "Write your caption here, copy the result and paste it into Instagram. It also works for bios, Facebook and TikTok captions.",
    "The character is invisible but counts toward your character limit."],
    [["Why do blank lines disappear?", "Some apps trim empty lines when pasting."], ["Does it work in the bio?", "Yes."], P]],
  ["social-media-character-counter", "Social Media Character Counter", S, "Check your text against the limits of X, Instagram, LinkedIn, YouTube, Google and more.", ["character counter for twitter", "instagram caption length", "social media post limits", "youtube title length"], [
    "Type your text and see the count against 12 limits at once, such as 280 for X, 2,200 for Instagram captions and 100 for YouTube titles. Bars turn red when you go over.",
    "Links count as 23 characters on X, and the tool follows that rule.",
    "Platforms change their limits sometimes, so verify when your text is close to the maximum."],
    [["How are emoji counted?", "Each emoji counts as one character here. X counts some as two."], ["Does it count spaces?", "Yes."], P]],
  ["wifi-qr-code-generator", "WiFi QR Code Generator", I, "Create a QR code that lets guests join your WiFi by scanning.", ["wifi qr code generator", "qr code for wifi password", "share wifi with qr code"], [
    "Enter your network name, password and security type, and download a QR code. Phones that scan it offer to join the network.",
    "Print it for guests, cafes, offices and rentals. No more spelling out the password.",
    "The code contains your password in plain form, so only share it where you would share the password. The code is made in your browser."],
    [["Which security do I choose?", "WPA for nearly all modern routers."], ["Does it work on iPhone and Android?", "Yes, the camera app reads it."], P]],
  ["vcard-qr-code-generator", "vCard QR Code Generator", I, "Make a QR code with your contact details that saves to a phone.", ["vcard qr code generator", "contact qr code", "business card qr code"], [
    "Add your name, company, job title, phone, email and website. Scanning the QR code lets the other person save you as a contact.",
    "Put it on a business card, a presentation slide or an email signature.",
    "The details are stored in the code itself, so it works offline and never expires."],
    [["Can I change details later?", "No. Create a new code."], ["Which format is it?", "vCard 3.0, supported by iOS and Android."], P]],
  ["whatsapp-qr-code-generator", "WhatsApp QR Code Generator", I, "Create a QR code that opens a WhatsApp chat with your number.", ["whatsapp qr code generator", "qr code for whatsapp chat", "whatsapp business qr code"], [
    "Enter your number with country code and an optional first message. The QR code opens a chat when scanned.",
    "Use it on flyers, shop windows, menus and packaging to take customers directly to your chat.",
    "Test the code with your own phone before printing."],
    [["Does it need WhatsApp Business?", "No."], ["Can the message be empty?", "Yes."], P]],
  ["ads-txt-generator", "ads.txt Generator", S, "Create an ads.txt file for AdSense and other ad networks.", ["ads.txt generator", "ads txt file", "adsense ads.txt", "adsterra ads.txt"], [
    "Enter your AdSense publisher ID and add the lines your other ad networks give you. The tool creates the full ads.txt text to download.",
    "The file lists who may sell ads on your site, which fights fake inventory. Missing ads.txt can lower ad earnings.",
    "Save it as ads.txt and upload it to the root of your domain, so it opens at yourdomain.com/ads.txt. Copy other networks' lines exactly as they provide them."],
    [["Where does the file go?", "In the root folder of your site."], ["Where do I find my publisher ID?", "In your AdSense account under Account information."], P]],
  ["llms-txt-generator", "llms.txt Generator", S, "Create an llms.txt file that helps AI tools understand your site.", ["llms.txt generator", "llms txt file", "llms.txt example"], [
    "Enter your site name, a one line summary and your main pages. The tool formats them in Markdown the way the llms.txt proposal describes.",
    "The file is placed at the root of your site. It points language models to your key pages in a clean form.",
    "It is a proposal, not a standard that all search or AI systems follow, so it is optional and its effect on rankings is unproven."],
    [["Does it improve SEO?", "There is no proof. It is a low cost extra."], ["Where do I put it?", "At yourdomain.com/llms.txt."], P]],
  ["security-txt-generator", "security.txt Generator", S, "Create a security.txt file so researchers know how to report issues.", ["security.txt generator", "security txt file", "well-known security.txt"], [
    "Add a contact email or URL, optional policy link and languages. The tool writes the file with a required Expires date one year from today.",
    "Upload it at /.well-known/security.txt. It follows RFC 9116.",
    "Renew the Expires date each year, because stale files are ignored."],
    [["Is it required?", "No, but it is good practice."], ["Is the contact public?", "Yes. Use a monitored mailbox."], P]],
  ["manifest-json-generator", "Web App Manifest Generator", S, "Create a manifest.json for a progressive web app.", ["manifest json generator", "pwa manifest generator", "web app manifest", "manifest.json example"], [
    "Fill in the app name, colors, start URL and display mode to get a valid manifest.json with the standard icon entries.",
    "Link it in your page head with link rel manifest. With a manifest and a service worker, browsers can offer Add to Home Screen.",
    "You still need to create the icon files at the listed paths: 192 and 512 pixels, plus a maskable 512."],
    [["Which display mode is best?", "standalone for most apps."], ["Do I need a service worker?", "For install prompts in most browsers, yes."], P]],
  ["robots-txt-tester", "Robots.txt Tester", S, "Test if a URL path is allowed or blocked for a crawler by your robots.txt.", ["robots.txt tester", "test robots.txt", "robots txt checker", "is url blocked by robots"], [
    "Paste your robots.txt, set a user agent and list the paths to test. Each path is marked allowed or blocked, with the rule that decided it.",
    "It follows Google's logic: the most specific, longest rule wins, and Allow wins a tie. Wildcards and the end anchor are supported.",
    "A block in robots.txt stops crawling, not indexing. A blocked page can still appear in results if other pages link to it."],
    [["Does a named agent use the * rules too?", "No. A specific group replaces the * group."], ["Is this Google's tool?", "No, it is an independent check. Verify important rules in Search Console."], P]],
  ["email-signature-generator", "Email Signature Generator", S, "Create a clean HTML email signature you can paste into Gmail or Outlook.", ["email signature generator", "html email signature", "professional email signature"], [
    "Enter your name, role, company and contact details and choose an accent color. You get a table based HTML signature with a live preview.",
    "Table layouts with inline styles work in almost all email clients. The signature has no images, so nothing is blocked or hidden.",
    "Paste the HTML in the signature setting of your email program, in source or HTML mode when available."],
    [["Why no logo?", "Images are often blocked. You can add one after pasting."], ["Does it work in Gmail?", "Yes. Gmail needs the signature pasted as formatted text or from a rich editor."], P]],
  ["domain-extractor-from-urls", "Domain Extractor from URLs", S, "Extract the unique domain names from a list of URLs or any text.", ["extract domain from url", "url to domain", "domain extractor", "get domains from list of urls"], [
    "Paste URLs or any text and the tool lists every unique domain, without protocol, path and www.",
    "SEO people use it to prepare link audits, disavow lists and outreach sheets.",
    "Subdomains are kept as they are. blog.example.com and example.com count as different entries."],
    [["Does it remove duplicates?", "Yes."], ["Does it find domains without http?", "Yes, such as example.com/page."], P]],
  ["meta-title-pixel-width-checker", "Meta Title Pixel Width Checker", S, "Measure the pixel width of a title and description to avoid truncation in Google.", ["title pixel width checker", "meta title length pixels", "serp title width", "meta description pixel width"], [
    "Google cuts titles by width, about 580 pixels on desktop, not by a number of characters. Type your title to measure it in your browser with Arial 20px.",
    "The description is measured against about 920 pixels. Wide letters take more room, so a title with many W and M can be cut at 50 characters, while many i and l letters fit more.",
    "These numbers are estimates. Google changes its display from time to time."],
    [["Is 60 characters a safe limit?", "Usually, but pixel width is the real rule."], ["Does it use Google's font?", "It uses Arial, a close match."], P]],
  ["privacy-policy-generator", "Privacy Policy Generator", S, "Generate a basic privacy policy for a website, including ads and analytics.", ["privacy policy generator", "free privacy policy for website", "adsense privacy policy", "privacy policy template"], [
    "Answer a few questions about your site: contact forms, analytics, ads and browser only tools. The generator writes a plain language privacy policy with the right sections.",
    "AdSense and many ad networks require a privacy policy page that mentions cookies and third party ads. Publish the text on a page and link it in your footer.",
    "It is a general template and not legal advice. Laws such as GDPR and CCPA add duties for some sites, so ask a lawyer if you collect personal data."],
    [["Is it enough for AdSense?", "It covers the common points. Check the current program policies."], ["Do I need to update it?", "Yes, when you change what you collect."], P]],
  ["terms-and-conditions-generator", "Terms and Conditions Generator", S, "Generate simple terms and conditions for a website.", ["terms and conditions generator", "terms of service template", "website terms and conditions"], [
    "Enter your site name, owner, country and whether users can submit content. The generator writes terms for use, ownership, no warranty, liability, third party links and governing law.",
    "Terms set expectations and can limit your liability. Link them in the footer next to the privacy policy.",
    "This is a general template and not legal advice. Have a lawyer review it if your site sells products or handles sensitive data."],
    [["Are terms required by law?", "Usually not for simple sites, but they are strongly recommended."], ["Can I copy another site's terms?", "No. Copyright applies, and their needs differ."], P]],
  ["affiliate-disclosure-generator", "Affiliate Disclosure Generator", S, "Create an affiliate disclosure statement for your site and posts.", ["affiliate disclosure generator", "affiliate disclosure example", "amazon associates disclosure"], [
    "Enter your site and affiliate programs and get a full disclosure page and a short version for the top of a post.",
    "Many countries, such as the US through the FTC, expect clear disclosure of paid links, and programs like Amazon Associates require it.",
    "Place the short version near the top of the post, before the first link, in plain words. This is a general template and not legal advice."],
    [["Where should it go?", "Near the links, and on a separate disclosure page."], ["Does it need exact wording?", "Some programs require specific text. Check their rules."], P]],
  ["ctr-calculator", "CTR Calculator (Click Through Rate)", F, "Calculate click through rate from clicks and impressions.", ["ctr calculator", "click through rate calculator", "calculate ctr", "google ads ctr"], [
    "Enter clicks and impressions to get your click through rate as a percentage, plus clicks per 1,000 views.",
    "CTR shows how often people who saw your ad, search result or email clicked. Search Console shows it for your pages, and 1 to 3 percent is common for ads.",
    "A low CTR on a page with many impressions often means the title and description need work."],
    [["What is a good CTR?", "It depends on position and channel. Position 1 in Google averages near 30 percent, while display ads average under 1 percent."], ["Formula?", "Clicks divided by impressions, times 100."], P]],
  ["cpc-calculator", "CPC Calculator (Cost Per Click)", F, "Work out your average cost per click from spend and clicks.", ["cpc calculator", "cost per click calculator", "calculate cpc"], [
    "Enter your ad spend and the clicks received to see the cost per click, and how many clicks each 100 buys.",
    "CPC lets you compare campaigns and keywords. If a click costs more than a visit is worth, change targeting or the ad.",
    "Compare CPC with conversion rate: a cheap click that never converts is more expensive than a pricey one that does."],
    [["How is CPC set in ads?", "By auction: bids, quality and competition."], ["CPC or CPM?", "CPC for traffic goals, CPM for awareness."], P]],
  ["roas-calculator", "ROAS Calculator (Return on Ad Spend)", F, "Calculate return on ad spend and your break-even ROAS.", ["roas calculator", "return on ad spend calculator", "break even roas"], [
    "Enter the revenue from your ads and what you spent. ROAS shows how much revenue each unit of spend brings. Add your margin to see the break-even ROAS and profit after ads.",
    "A 4x ROAS looks good, but with a 20 percent margin you need 5x just to break even. Margin decides what is profitable.",
    "ROAS ignores other costs such as shipping, tools and time."],
    [["What is a good ROAS?", "Above your break-even ROAS. Many stores aim for 3 to 5x."], ["ROAS or ROI?", "ROAS uses revenue. ROI uses profit."], P]],
  ["conversion-rate-calculator", "Conversion Rate Calculator", F, "Find your conversion rate and revenue per visitor.", ["conversion rate calculator", "website conversion rate", "calculate conversion rate"], [
    "Enter conversions and visitors to see your conversion rate. Add an average order value to see revenue per visitor.",
    "Typical e-commerce conversion rates are 1 to 4 percent. Lead forms often convert 5 to 15 percent, and the range is wide by niche.",
    "Measure over enough traffic. A few visits can give a misleading rate."],
    [["What counts as a conversion?", "Any goal you set: sale, sign up, download or call."], ["How can I improve it?", "Test headlines, page speed, trust signals and form length."], P]],
  ["adsense-earnings-calculator", "AdSense Earnings Calculator", F, "Estimate ad income from page views, ads per page, CTR and CPC.", ["adsense earnings calculator", "website ad revenue calculator", "how much does adsense pay", "ad revenue estimator"], [
    "Enter daily page views, ads per page, ad CTR and average CPC to estimate earnings per day, month and year, and your page RPM.",
    "Use it to set expectations. For example, 1,000 views a day with 3 ads, 1 percent CTR and 0.25 CPC gives about 7.50 per day.",
    "Real earnings vary. CPC depends heavily on country, niche and season, and traffic from some countries pays many times more than others."],
    [["Is the result a promise?", "No. It is an estimate from the numbers you enter."], ["Does it work for Adsterra?", "It works for any CPC based model. CPM networks pay per views, so use your RPM."], P]],
  ["ab-test-significance-calculator", "A/B Test Significance Calculator", F, "Check whether the difference between two versions is statistically significant.", ["ab test calculator", "a/b test significance calculator", "statistical significance calculator", "conversion test p-value"], [
    "Enter visitors and conversions for versions A and B. The tool runs a two sided z-test for two proportions and shows the lift, p-value, confidence and a plain verdict.",
    "A p-value below 0.05 means a difference this large would be unlikely by chance if both versions were equal. It is a common but not absolute rule.",
    "Decide the sample size before you start and avoid stopping when you first see a winner. Repeated peeking raises the chance of false results."],
    [["How many visitors do I need?", "Small lifts need thousands of visitors per version."], ["What does not significant mean?", "There is not enough evidence yet, not that versions are equal."], P]],
  ["ltv-cac-calculator", "LTV and CAC Calculator", F, "Calculate customer lifetime value, LTV to CAC ratio and payback time.", ["ltv cac calculator", "customer lifetime value calculator", "cac payback period", "ltv to cac ratio"], [
    "Enter monthly revenue per customer, gross margin, expected lifetime and what it costs to acquire one customer. You get LTV, the LTV to CAC ratio and the payback months.",
    "A ratio of 3 to 1 or more is a common target for subscription businesses. A long payback period can strain cash even if the ratio looks fine.",
    "Lifetime is an estimate. If you have churn, lifetime is about one divided by monthly churn."],
    [["How do I estimate lifetime?", "One divided by monthly churn rate."], ["What is CAC?", "Sales and marketing spend divided by new customers."], P]],
  ["engagement-rate-calculator", "Social Media Engagement Rate Calculator", S, "Calculate engagement rate by followers or reach for any post.", ["engagement rate calculator", "instagram engagement rate", "tiktok engagement rate calculator", "social media engagement"], [
    "Enter likes, comments, shares and saves with your follower count, and optionally reach. You get the engagement rate by followers and by reach.",
    "Brands use it to compare posts and judge influencers. Rates of 1 to 5 percent are common, and small accounts usually score higher than large ones.",
    "Use the same formula when you compare. Some tools count only likes and comments."],
    [["Followers or reach?", "Reach is more accurate for a single post. Followers is common for comparison."], ["Do saves count?", "Include them if you want a broader measure."], P]],
  ["youtube-money-calculator", "YouTube Money Calculator", F, "Estimate YouTube earnings from views and an RPM range.", ["youtube money calculator", "youtube earnings calculator", "how much does youtube pay per view", "youtube rpm calculator"], [
    "Enter your views and a low and high RPM, the revenue per 1,000 views, to estimate earnings. The tool shows low, high and midpoint numbers.",
    "RPM depends on the topic, the countries of your viewers and the season. Finance and tech channels can see far higher RPM than entertainment ones.",
    "Check your own RPM in YouTube Studio under Analytics for a better estimate."],
    [["What is RPM?", "Revenue per 1,000 views, after YouTube's share."], ["Does this include sponsorships?", "No. Only ad revenue estimates."], P]],
];

export const wave5Tools: ToolMeta[] = SPECS.map(([slug, title, category, desc, keywords, paras, faqs]) => ({
  slug, title, shortDescription: desc, metaDescription: desc.length > 158 ? desc.slice(0, 155) + "..." : desc, category: category as CategoryKey, keywords,
  componentKey: `Pop:${slug}`, article: paras.join("\n\n"), faqs: faqs.map(([q, a]) => ({ q, a })),
}));
