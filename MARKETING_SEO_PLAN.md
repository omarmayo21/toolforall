# ToolForAll: free marketing and SEO plan (30 days)

Goal: 5,000+ international visitors in the first month. Honest note: new pages take 4-12 weeks to rank, so month one traffic comes mostly from launches and communities. SEO compounds in months 2-4.

## Week 0 (day 1-2): technical setup
1. Merge the unit-converter PR. Deploy. Check https://www.toolsforall.cloud/sitemap.xml lists about 1,200 URLs.
2. Google Search Console: add the domain, submit sitemap.xml. Bing Webmaster Tools: import from GSC. Use "Request indexing" for the home page and 10 best tool pages.
3. Pick one host (www or non-www) and keep canonical to it (the site now redirects to www; SITE_URL should match).
4. Confirm Clarity/Vercel analytics tag every tool page. Add UTM links to everything below so you see what works.
5. Roll out the 1,000 pages in waves (about 250 per week) by trimming the families list, so Google does not see 1,000 new URLs at once. Start with the pairs people search most: cm to inches, kg to lbs, lbs to kg, celsius to fahrenheit, mb to gb, feet to meters, miles to km, km to miles, liters to gallons, sq ft to sq m.

## Week 1: launch posts (free, highest traffic)
- Product Hunt: "1,200+ free tools, no sign-up, runs in your browser". Post at 12:01 AM PT on a Tuesday-Thursday.
- Hacker News "Show HN" with the privacy angle (zero server processing).
- Reddit (read each rules page first, no spam): r/SideProject, r/webdev, r/InternetIsBeautiful, r/Frugal, r/learnprogramming. Post a useful tool, not "visit my site".
- Directories: AlternativeTo, Futurepedia-style tool lists, SaaSHub, BetaList, Uneed, Toolify, DevHunt, Indie Hackers. About 20 listings give real backlinks.
- GitHub: make the repo README clear, add the site to "awesome" lists of online tools.

## Week 2-3: content and backlinks
- Write 8-10 short guides that link to tools: "kg to lbs cheat sheet", "MB vs MiB explained", "Mbps vs MB/s", "Celsius to Fahrenheit chart". Publish on the site (/guides) and cross-post to dev.to, Hashnode, Medium, LinkedIn with a canonical link back.
- Answer questions on Quora and Stack Exchange (Unix, Super User, Cooking) with the answer first and a tool link second.
- Embeds: add an "Embed this converter" snippet. Teachers, bloggers and recipe sites link back.
- Short vertical videos (TikTok/Reels/Shorts), 15-30 s, "convert X in 3 seconds".
- Pinterest: printable conversion charts (cups to ml, oven temperatures) link to pages.

## International
- Add real language URLs (/es, /pt, /fr, /de, /ar, /hi, /id) with hreflang. Priority: Spanish, Portuguese, Hindi, Indonesian, Arabic, since unit and file tools have large non-English search volume. Translate title, description and UI first, articles second.
- Egypt and Gulf angle: feddan, gold gram/ounce, riyal/dirham tools in Arabic.

## Metrics to track weekly
Indexed pages (GSC), impressions, clicks, top queries, countries, bounce/engagement in Clarity, Adsterra RPM per country. Low-engagement pages: add more content or noindex.

## Ads note
Adsterra pays far more for US/UK/CA/AU/DE traffic. Social-media traffic from low-RPM countries earns little. Target English-speaking launch communities first. Do not place more than 2-3 ad units per page; ad-heavy thin pages hurt rankings.
