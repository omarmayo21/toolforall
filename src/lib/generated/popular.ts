import type { CategoryKey, ToolMeta } from "../types";

type Spec = [slug: string, title: string, cat: CategoryKey, desc: string, kw: string[], paras: string[], faqs: [string, string][]];

const PRIVACY: [string, string] = ["Is my data sent to a server?", "No. Everything runs in your browser. Nothing you type is uploaded or stored."];

const SPECS: Spec[] = [
  ["loan-emi-calculator", "Loan EMI Calculator", "finance", "Calculate your monthly loan payment (EMI), total interest and total cost for any loan amount, rate and term.", ["loan calculator", "emi calculator", "monthly payment calculator", "personal loan calculator", "car loan calculator"], [
    "A loan EMI (equated monthly installment) is the fixed amount you pay each month until a loan is repaid. It covers both interest and a part of the principal. Enter the loan amount, the annual interest rate and the term in years, and the calculator shows your monthly payment, the total you will repay and the total interest.",
    "The formula is EMI = P x r x (1 + r)^n / ((1 + r)^n - 1), where P is the principal, r is the monthly rate (annual rate divided by 12 and by 100) and n is the number of monthly payments. Early payments are mostly interest, and the share of principal grows over time.",
    "Use it to compare loan offers, to see how a longer term lowers the payment but raises total interest, or to check what you can afford. Bank fees, insurance and variable rates are not included, so treat the result as an estimate and confirm the final figure with your lender."],
    [["How is EMI calculated?", "EMI = P x r x (1 + r)^n / ((1 + r)^n - 1), with P the loan amount, r the monthly interest rate and n the number of months."], ["Does a longer term reduce my EMI?", "Yes, the monthly payment falls, but you pay more total interest because the balance stays outstanding longer."], ["Does this include fees or insurance?", "No. It covers principal and interest only. Add processing fees and insurance separately."], PRIVACY]],
  ["mortgage-calculator", "Mortgage Calculator", "finance", "Estimate your monthly mortgage payment including principal, interest, property tax and home insurance.", ["mortgage calculator", "home loan calculator", "monthly mortgage payment", "house payment calculator"], [
    "A mortgage payment has four parts: principal, interest, property tax and homeowners insurance. This calculator takes the home price, your down payment, the interest rate and the term, adds yearly tax and insurance, and shows the total monthly cost and total interest over the life of the loan.",
    "A larger down payment lowers the loan amount and the interest you pay. A shorter term, such as 15 years instead of 30, raises the monthly payment but cuts total interest sharply. Try a few combinations to see the trade-off.",
    "The result is an estimate. Lenders may add mortgage insurance for small down payments, HOA fees, or change the rate. Use it for planning, then ask for an official quote."],
    [["How much house can I afford?", "A common guide is to keep housing costs under 28% of gross monthly income. Enter different prices to see where the payment lands."], ["What is included in the payment?", "Principal and interest, plus the yearly property tax and insurance you enter, divided by 12."], ["Does it include PMI?", "No. Add private mortgage insurance to the insurance field if your lender requires it."], PRIVACY]],
  ["compound-interest-calculator", "Compound Interest Calculator", "finance", "See how savings or investments grow with compound interest and monthly contributions over time.", ["compound interest calculator", "investment growth calculator", "savings calculator", "interest on interest"], [
    "Compound interest means you earn interest on your earlier interest, not only on the original amount. Over long periods this snowball effect is the main reason that starting early matters. Enter a starting amount, a monthly contribution, an annual rate and the number of years.",
    "The calculator applies your chosen compounding frequency (yearly, quarterly, monthly or daily) and adds your contributions each month. It shows the final balance, how much you put in and how much came from interest.",
    "Real returns vary year to year and fees and taxes reduce them, so use a conservative rate for planning. The number is a projection, not a guarantee."],
    [["What is the compound interest formula?", "A = P(1 + r/n)^(nt) for a single deposit, where P is the principal, r the annual rate, n the compounding periods per year and t the years."], ["Does more frequent compounding matter?", "Slightly. Daily compounding earns a little more than yearly at the same rate, but the rate and time matter far more."], ["Are taxes and fees included?", "No. Subtract expected fees and taxes from your rate for a more realistic estimate."], PRIVACY]],
  ["simple-interest-calculator", "Simple Interest Calculator", "finance", "Calculate simple interest and the total amount for a principal, annual rate and number of years.", ["simple interest calculator", "interest calculator", "simple interest formula"], [
    "Simple interest is charged only on the original principal, not on interest already earned. The formula is I = P x r x t, where P is the principal, r is the annual rate as a decimal and t is the time in years.",
    "It is used for short-term loans, some car loans, bonds and school math. Enter the principal, the yearly rate and the years, and you get the interest and the total amount owed or earned.",
    "If interest is added to the balance and earns interest itself, use the compound interest calculator instead."],
    [["What is the simple interest formula?", "I = P x r x t. Total amount = P + I."], ["How is it different from compound interest?", "Compound interest also earns interest on past interest, so it grows faster over long periods."], PRIVACY]],
  ["tip-calculator", "Tip Calculator", "finance", "Work out the tip and split the bill between friends. Enter the bill, tip percent and number of people.", ["tip calculator", "split bill calculator", "gratuity calculator", "restaurant tip"], [
    "Enter the bill total, choose a tip percentage and the number of people sharing, and the calculator shows the tip, the total and the amount each person pays.",
    "Typical tips are 15% to 20% in the United States and Canada. In many other countries a service charge is already included, or tips are small, so check the bill first.",
    "To tip on the pre-tax amount, enter the bill without tax. Rounding up to an easy total per person is fine for friendly splits."],
    [["How much should I tip?", "In the US, 15% to 20% for table service is common. Customs differ by country."], ["Should I tip before or after tax?", "Many people tip on the pre-tax amount. Either is acceptable."], PRIVACY]],
  ["vat-calculator", "VAT / Sales Tax Calculator", "finance", "Add or remove VAT, GST or sales tax from any price. Get net, tax and gross amounts instantly.", ["vat calculator", "gst calculator", "sales tax calculator", "add vat", "remove vat"], [
    "Choose whether your amount already includes tax or not. To add tax, the calculator multiplies the net price by (1 + rate). To remove tax, it divides the gross price by (1 + rate), which is not the same as subtracting the rate percentage.",
    "Set any rate: 14% for Egypt VAT, 20% for the UK, 19% for Germany, 5% for the UAE, or a US state sales tax. The tool shows the net amount, the tax amount and the gross total.",
    "Always check the rate that applies to your product and country, since some goods have reduced or zero rates."],
    [["How do I remove VAT from a price?", "Divide the gross price by 1 + the rate. At 20%, divide by 1.2."], ["Why not subtract 20% from the price?", "Because the tax was added on top of the net price, so it is 20% of the net, not of the gross."], PRIVACY]],
  ["hourly-to-salary-calculator", "Hourly to Salary Calculator", "finance", "Convert an hourly wage to yearly, monthly, weekly and daily pay.", ["hourly to salary", "hourly wage calculator", "salary calculator", "annual income calculator"], [
    "Enter your hourly rate, the hours you work per week and the weeks you work per year. The calculator multiplies them to get your gross yearly pay, then divides to show monthly, weekly and daily amounts.",
    "A full-time job of 40 hours for 52 weeks is 2,080 hours a year. Subtract unpaid weeks if you take time off without pay.",
    "These are gross amounts before tax and deductions. Your take-home pay will be lower."],
    [["How many working hours are in a year?", "About 2,080 for a 40-hour week and 52 weeks."], ["Is the result before or after tax?", "Before tax. It is your gross pay."], PRIVACY]],
  ["days-between-dates-calculator", "Days Between Dates Calculator", "date-time", "Count the days, weeks, months and weekdays between two dates.", ["days between dates", "date difference calculator", "how many days until", "date duration"], [
    "Pick a start date and an end date and the calculator returns the number of days between them, the same span in weeks, in years, months and days, and the number of weekdays (Monday to Friday).",
    "Use it to count down to an event, work out a notice period, check how long a project took or find your length of service. The order of the dates does not matter.",
    "Public holidays are not excluded from the weekday count."],
    [["Does it include the end date?", "It counts the difference, so the end date is not counted. Add one day if you need to include both."], ["How are months counted?", "By calendar months, then the remaining days."], PRIVACY]],
  ["date-calculator", "Date Calculator: Add or Subtract Days, Weeks, Months", "date-time", "Add or subtract days, weeks, months or years from any date.", ["date calculator", "add days to date", "what date is 90 days from now", "subtract days from date"], [
    "Pick a start date, choose add or subtract, enter an amount and a unit, and the calculator shows the resulting date with its weekday.",
    "It handles month lengths and leap years. Use it for deadlines, due dates, warranties and trial periods.",
    "Business days and public holidays are not skipped."],
    [["What is 90 days from today?", "Set the start date to today, choose Add, enter 90 and the unit Days."], ["Does it handle leap years?", "Yes, it uses your browser's calendar."], PRIVACY]],
  ["calorie-calculator", "Calorie Calculator (BMR and TDEE)", "health-fitness", "Estimate your daily calories for maintenance, weight loss or gain using the Mifflin-St Jeor equation.", ["calorie calculator", "bmr calculator", "tdee calculator", "daily calorie needs"], [
    "Your basal metabolic rate (BMR) is the energy your body burns at rest. Multiplying it by an activity factor gives your total daily energy expenditure (TDEE), which is roughly the calories you need to maintain your weight.",
    "This tool uses the Mifflin-St Jeor equation. Enter sex, age, height, weight and activity level. A deficit of about 500 calories a day usually leads to losing roughly 0.5 kg per week, and a surplus of 500 to gaining.",
    "This is an estimate and not medical advice. Do not go below safe minimum intakes without professional guidance."],
    [["What is BMR?", "The calories your body burns at rest to keep you alive."], ["How accurate is it?", "It is within about 10% for most adults. Track your weight for two weeks and adjust."], PRIVACY]],
  ["ideal-weight-calculator", "Ideal Weight Calculator", "health-fitness", "Estimate your ideal body weight by height and sex, with the healthy BMI range.", ["ideal weight calculator", "ideal body weight", "healthy weight range", "weight for height"], [
    "Enter your height and sex to see ideal weight estimates from the Devine and Robinson formulas, plus the weight range that corresponds to a healthy BMI of 18.5 to 24.9.",
    "These formulas give a rough reference. Muscle mass, bone structure and age change what is healthy for a person.",
    "Use the BMI range as the wider guide and talk to a doctor for personal advice."],
    [["Which formula is best?", "None is perfect. The BMI range is a broader guide than a single number."], ["Is BMI reliable for athletes?", "No. Muscle weighs more than fat, so athletes can show a high BMI while being healthy."], PRIVACY]],
  ["roi-calculator", "ROI Calculator", "finance", "Calculate return on investment, profit and annualized return for any investment.", ["roi calculator", "return on investment calculator", "investment return", "profit percentage"], [
    "ROI is the profit from an investment divided by its cost, shown as a percentage. Enter what you invested and the final value, and the calculator shows profit and ROI. If you add how many years you held it, it also shows the annualized return.",
    "ROI = (final value - cost) / cost x 100. Annualized return (CAGR) makes two investments with different holding periods comparable.",
    "Remember fees, taxes and inflation, which reduce your real return."],
    [["What is a good ROI?", "It depends on the asset and risk. Long-term stock market returns average about 7% to 10% a year before inflation."], ["What is the difference between ROI and CAGR?", "ROI is the total return. CAGR is the yearly rate that would produce it."], PRIVACY]],
  ["cagr-calculator", "CAGR Calculator", "finance", "Calculate compound annual growth rate from a starting value, ending value and number of years.", ["cagr calculator", "compound annual growth rate", "annual growth rate", "investment growth rate"], [
    "CAGR is the constant yearly growth rate that would take a value from its start to its end over a period. The formula is (ending / starting)^(1 / years) - 1.",
    "It smooths out ups and downs so you can compare investments, revenue or user growth fairly across different time spans.",
    "CAGR does not show volatility. Two investments can have the same CAGR but very different risk."],
    [["How do I calculate CAGR?", "Divide the end value by the start value, raise it to 1 divided by the years, subtract 1."], ["Can CAGR be negative?", "Yes, if the end value is lower than the start value."], PRIVACY]],
  ["percentage-increase-calculator", "Percentage Increase / Decrease Calculator", "math-converters", "Find the percentage increase or decrease between two numbers.", ["percentage increase calculator", "percent change calculator", "percentage decrease", "percentage difference"], [
    "Enter the old value and the new value to get the percentage change. A positive result is an increase and a negative one is a decrease. The formula is (new - old) / old x 100.",
    "The tool also shows the symmetric percentage difference, which divides by the average of the two values. Use it when neither value is clearly the starting point.",
    "A 50% increase followed by a 50% decrease does not return to the start, because each percentage applies to a different base."],
    [["How do I calculate percent change?", "(new - old) / old x 100."], ["What is percent difference?", "The gap between two values divided by their average, used when there is no baseline."], PRIVACY]],
  ["speed-distance-time-calculator", "Speed, Distance and Time Calculator", "math-converters", "Calculate speed from distance and time, in km/h, mph and running pace.", ["speed calculator", "speed distance time", "pace calculator", "average speed"], [
    "Speed equals distance divided by time. Enter a distance in kilometers and a time in hours to get the average speed in km/h and mph, plus your pace in minutes per kilometer.",
    "To find distance, multiply speed by time. To find time, divide distance by speed. Use decimal hours, so 1 hour 30 minutes is 1.5.",
    "For runners, pace is the number to compare. For drivers, the average speed helps estimate arrival times."],
    [["How do I convert minutes to hours?", "Divide by 60. 45 minutes is 0.75 hours."], ["What is pace?", "The time it takes to cover one kilometer or mile."], PRIVACY]],
  ["pregnancy-due-date-calculator", "Pregnancy Due Date Calculator", "health-fitness", "Estimate your due date and conception date from the first day of your last period.", ["due date calculator", "pregnancy calculator", "pregnancy due date", "conception date calculator"], [
    "Enter the first day of your last menstrual period and your usual cycle length. The calculator adds 280 days (Naegele's rule), adjusted for cycle length, to estimate the due date, and shows an approximate conception date and your current week.",
    "Only about 5% of babies are born on their due date. Most arrive between 37 and 42 weeks. An early ultrasound gives the most accurate dating.",
    "This tool is informational only. Follow your doctor or midwife for medical advice."],
    [["How is the due date calculated?", "280 days (40 weeks) after the first day of the last period."], ["Is it accurate?", "It is an estimate. Ultrasound dating is more accurate."], PRIVACY]],
  ["fraction-calculator", "Fraction Calculator", "math-converters", "Add, subtract, multiply and divide fractions. See the simplified fraction, mixed number and decimal.", ["fraction calculator", "add fractions", "fraction to decimal", "simplify fractions"], [
    "Enter two fractions and choose an operation. The calculator finds a common denominator where needed, simplifies the result using the greatest common divisor, and shows it as a fraction, a mixed number and a decimal.",
    "To add or subtract, the denominators must match, so each fraction is converted first. To multiply, multiply tops and bottoms. To divide, multiply by the reciprocal of the second fraction.",
    "Use it to check homework, recipes and measurements."],
    [["How do I add fractions?", "Find a common denominator, add the numerators and simplify."], ["How do I divide fractions?", "Flip the second fraction and multiply."], PRIVACY]],
  ["average-calculator", "Average Calculator (Mean, Median, Mode)", "math-converters", "Paste a list of numbers and get the mean, median, mode, sum, range and standard deviation.", ["average calculator", "mean median mode calculator", "standard deviation calculator", "statistics calculator"], [
    "Paste or type numbers separated by commas, spaces or lines. The calculator shows the count, sum, mean (average), median (middle value), mode (most frequent value), minimum, maximum and sample standard deviation.",
    "The mean is the sum divided by the count. The median is less affected by extreme values, so it is better for incomes or prices. The standard deviation tells you how spread out the numbers are.",
    "Non-numeric entries are ignored."],
    [["What is the difference between mean and median?", "The mean is the arithmetic average. The median is the middle value when sorted."], ["Is standard deviation sample or population?", "Sample (divides by n - 1)."], PRIVACY]],
  ["random-number-generator", "Random Number Generator", "fun-random", "Generate random numbers in any range, with or without repeats, using your browser's secure random source.", ["random number generator", "random number between", "number picker", "lottery number generator"], [
    "Set a minimum and maximum, choose how many numbers you want and press Generate. Tick No repeats to draw unique numbers, like lottery balls.",
    "Numbers come from the browser's cryptographic random generator, which is suitable for games, giveaways and sampling.",
    "For official draws or security keys follow the rules of your organisation."],
    [["Is it truly random?", "It uses crypto.getRandomValues, a cryptographically strong source."], ["Can I get unique numbers?", "Yes, tick No repeats."], PRIVACY]],
  ["dice-roller", "Dice Roller and Coin Flip", "fun-random", "Roll virtual dice (d4 to d100) or flip a coin. Fair, instant, works on mobile.", ["dice roller", "roll a dice online", "coin flip", "d20 roller", "random dice"], [
    "Choose how many dice and how many sides, then roll. The tool shows each die and the total. It supports d4, d6, d8, d10, d12, d20 and d100 for board games and tabletop RPGs.",
    "The coin flip button gives heads or tails with equal chance.",
    "Rolls use a secure random source and are not stored."],
    [["Are the rolls fair?", "Yes, each side has equal probability."], ["Can I roll more than one die?", "Yes, up to 50 at once."], PRIVACY]],
  ["random-name-picker", "Random Name Picker", "fun-random", "Pick a random winner from a list of names, or shuffle the list. Great for giveaways, classrooms and teams.", ["random name picker", "random picker", "pick a winner", "name shuffler", "giveaway picker"], [
    "Paste one name or item per line. Press Pick a winner to select one at random, or Shuffle to randomize the order of the list for team assignments and presentation order.",
    "It uses a secure random source, so every entry has the same chance.",
    "For public giveaways, record your screen while picking so entrants can verify the draw."],
    [["Is the choice fair?", "Yes, each line has an equal chance."], ["Can I pick more than one?", "Press Pick again, or use Shuffle and take the top names."], PRIVACY]],
  ["stopwatch", "Online Stopwatch", "date-time", "A simple online stopwatch with lap times. Works in your browser, no install.", ["online stopwatch", "stopwatch", "lap timer", "free stopwatch"], [
    "Press Start to begin timing and Pause to stop. Press Lap to record split times while the stopwatch keeps running, and Reset to clear everything.",
    "Time is measured from the system clock, so it stays accurate even if the tab runs slowly in the background.",
    "Keep the page open while you time."],
    [["How accurate is it?", "To about a hundredth of a second, limited by your device."], ["Does it keep running if I switch tabs?", "Yes, it recalculates from the clock when you return."], PRIVACY]],
  ["countdown-timer", "Online Countdown Timer", "date-time", "Set a countdown timer in minutes. Plays a sound when time is up and shows the time in the tab title.", ["countdown timer", "online timer", "timer", "minute timer"], [
    "Enter the number of minutes and press Start. The remaining time appears in large digits and in the browser tab title, so you can work in another tab. A short beep plays when the timer finishes.",
    "Use it for cooking, workouts, presentations, exams and study sessions.",
    "Keep the tab open and your sound on."],
    [["Can I pause the timer?", "Yes, press Pause and Start again to continue."], ["Will it ring if the tab is in the background?", "Usually yes, but some browsers limit background audio, so check the tab title."], PRIVACY]],
  ["pomodoro-timer", "Pomodoro Timer", "date-time", "A Pomodoro timer with 25-minute focus sessions and 5-minute breaks.", ["pomodoro timer", "pomodoro technique", "focus timer", "study timer"], [
    "The Pomodoro technique splits work into focused 25-minute sessions separated by 5-minute breaks. Press Start for a focus session. When it ends you hear a beep, and the timer switches to a break.",
    "After four sessions, take a longer break of 15 to 30 minutes. You can change the minutes at any time.",
    "Remove distractions during a session and write down new tasks to handle later."],
    [["What is the Pomodoro technique?", "A time management method by Francesco Cirillo using 25-minute work blocks and short breaks."], ["Can I change the length?", "Yes, edit the minutes field."], PRIVACY]],
  ["morse-code-translator", "Morse Code Translator", "text-tools", "Translate text to Morse code and Morse code to text. Letters, numbers and common punctuation.", ["morse code translator", "text to morse code", "morse code decoder", "morse code converter"], [
    "Choose a direction and type or paste your text. Letters become dots and dashes separated by spaces, and words are separated by a slash. To decode, paste Morse code with spaces between letters and a slash between words.",
    "Morse code was created for telegraph communication in the 1830s and 1840s and is still used in aviation, amateur radio and as an emergency signal. SOS is three dots, three dashes, three dots.",
    "Unknown symbols are skipped when encoding and shown as a question mark when decoding."],
    [["How do I write SOS in Morse code?", "... --- ..."], ["How do I separate words?", "Use a forward slash between words."], PRIVACY]],
  ["text-to-binary", "Text to Binary Converter", "text-tools", "Convert text to binary code and binary back to text. Supports Unicode through UTF-8.", ["text to binary", "binary translator", "binary to text", "ascii to binary"], [
    "Type text and get its binary representation, one 8-bit byte per character for ASCII. Switch the mode to decode a binary string back to readable text.",
    "Text is encoded as UTF-8, so accented letters, Arabic and emoji work too, using several bytes per character.",
    "Separate bytes with spaces when decoding."],
    [["What is the binary for the letter A?", "01000001."], ["Does it support Arabic or emoji?", "Yes, through UTF-8."], PRIVACY]],
  ["roman-numeral-converter", "Roman Numeral Converter", "text-tools", "Convert numbers to Roman numerals and Roman numerals to numbers (1 to 3999).", ["roman numeral converter", "roman numerals", "number to roman numeral", "roman numeral to number"], [
    "Type a number from 1 to 3999 to get the Roman numeral, or type a Roman numeral to get the number. The tool uses the standard subtractive rules, such as IV for 4 and CM for 900.",
    "Roman numerals use the letters I, V, X, L, C, D and M for 1, 5, 10, 50, 100, 500 and 1000.",
    "Numbers above 3999 have no standard form without extended notation."],
    [["What is 2026 in Roman numerals?", "MMXXVI."], ["Why is the limit 3999?", "Standard Roman numerals have no symbol above M, and MMMM is not used."], PRIVACY]],
  ["number-to-words-converter", "Number to Words Converter", "text-tools", "Convert numbers to English words, for cheques, invoices and writing. Handles decimals and negatives.", ["number to words", "number to text converter", "write numbers in words", "cheque amount in words"], [
    "Enter a number such as 1234.56 and get the English words: one thousand, two hundred and thirty-four point five six. It handles numbers up to the trillions, negatives and decimals.",
    "Writing amounts in words is common on cheques, contracts and invoices to prevent alteration.",
    "Spelling follows British style with and after hundreds."],
    [["How large a number can I convert?", "Up to 999 trillion."], ["Does it support decimals?", "Yes. Decimals are read digit by digit."], PRIVACY]],
  ["text-repeater", "Text Repeater", "text-tools", "Repeat any text or emoji many times with a custom separator.", ["text repeater", "repeat text", "repeat string", "emoji repeater"], [
    "Enter your text, choose how many times to repeat it and pick a separator. Use \\n for a new line. The output can be copied in one click.",
    "Useful for test data, patterns, filling placeholders and social posts.",
    "The limit is 10,000 repeats to keep your browser responsive."],
    [["What is the maximum?", "10,000 repeats."], ["Can I repeat on new lines?", "Yes, use \\n as the separator."], PRIVACY]],
  ["remove-punctuation", "Remove Punctuation from Text", "text-tools", "Strip punctuation and symbols from any text in one click. Works with many languages.", ["remove punctuation", "punctuation remover", "strip punctuation", "remove special characters"], [
    "Paste your text and all punctuation and symbols are removed, leaving letters, numbers and spaces. It works with Unicode, so accented and non-Latin letters are kept.",
    "Useful for cleaning text before analysis, word counts, keyword research or machine learning.",
    "Repeated spaces are collapsed to one."],
    [["Does it remove apostrophes?", "Yes, all punctuation including apostrophes."], ["Does it keep accented letters?", "Yes."], PRIVACY]],
  ["upside-down-text-generator", "Upside Down Text Generator", "text-tools", "Flip your text upside down with special Unicode characters. Copy and paste anywhere.", ["upside down text", "flip text", "upside down text generator", "reverse text unicode"], [
    "Type text and see it flipped upside down and reversed using look-alike Unicode characters. The result can be pasted into social media bios, chats and posts.",
    "It works because Unicode contains characters that resemble rotated letters. Some characters have no flipped version and stay as they are.",
    "Appearance depends on the font of the platform you paste into."],
    [["Where can I paste it?", "Almost anywhere that supports Unicode text, like Instagram, X and WhatsApp."], ["Why do some letters look different?", "Not every letter has an exact rotated Unicode twin."], PRIVACY]],
  ["word-frequency-counter", "Word Frequency Counter", "text-tools", "Count how often each word appears in your text. Sort by frequency, filter by minimum count.", ["word frequency counter", "word counter by frequency", "keyword density", "most common words"], [
    "Paste your text and see every word with its count and percentage, sorted from most to least frequent. Set a minimum count to hide rare words.",
    "Writers use it to catch overused words, students to analyse texts and SEO teams to check keyword usage.",
    "The list shows up to 100 words. Words are lowercased and punctuation is ignored."],
    [["Are common words like the included?", "Yes. All words are counted."], ["Does it work in other languages?", "Yes, it handles Unicode letters."], PRIVACY]],
  ["readability-score-checker", "Readability Score Checker (Flesch)", "text-tools", "Check how easy your English text is to read with the Flesch reading ease score and grade level.", ["readability checker", "flesch reading ease", "reading level calculator", "flesch kincaid grade"], [
    "Paste your text to get the Flesch reading ease score, an estimated US school grade level, word and sentence counts and reading time.",
    "Higher Flesch scores are easier. A score of 60 to 70 is plain English that most adults understand. Shorter sentences and shorter words raise the score.",
    "Syllable counting is approximate for English words, so treat the result as a guide."],
    [["What is a good Flesch score?", "60 to 70 is standard plain English. Web content often aims for 60 or higher."], ["Does it work for Arabic or other languages?", "No. The formula is for English."], PRIVACY]],
  ["number-base-converter", "Number Base Converter (Binary, Octal, Decimal, Hex)", "developer-tools", "Convert numbers between binary, octal, decimal and hexadecimal.", ["binary to decimal", "decimal to binary", "hex to decimal", "number base converter"], [
    "Enter a number and choose its base. The converter shows the same value in binary (base 2), octal (base 8), decimal (base 10) and hexadecimal (base 16). It handles very large numbers using big integers.",
    "Programmers use hexadecimal for colors, memory addresses and bit masks, and binary to see individual bits.",
    "Digits must be valid for the chosen base, so 2 is not valid in binary."],
    [["How do I convert binary to decimal?", "Select base 2, enter the binary number and read the Decimal result."], ["Is hex case sensitive?", "No."], PRIVACY]],
  ["json-minifier", "JSON Minifier", "developer-tools", "Minify JSON by removing whitespace and line breaks. Validates your JSON at the same time.", ["json minifier", "minify json", "compress json", "json compressor"], [
    "Paste formatted JSON and get a compact one-line version with all unnecessary whitespace removed. This reduces payload size for APIs and config files.",
    "The tool parses your JSON first, so invalid input shows an error instead of producing broken output.",
    "Minifying does not change the data, only its formatting. For the reverse, use the JSON formatter."],
    [["Does minifying change my data?", "No, only whitespace is removed."], ["What if my JSON is invalid?", "You will see an error message. Fix the syntax first."], PRIVACY]],
  ["sort-lines-alphabetically", "Sort Lines Alphabetically", "text-tools", "Sort lines of text A to Z, Z to A, by number or length, reverse the order, or shuffle.", ["sort lines alphabetically", "alphabetize list", "sort text lines", "sort list online"], [
    "Paste a list with one item per line and choose a sort mode: A to Z, Z to A, numeric, by length, reversed or random shuffle.",
    "Alphabetical sorting uses locale-aware comparison so accented letters sort sensibly. Numeric sorting reads the number at the start of each line.",
    "Use it for names, keywords, URLs, to-do items and data cleaning."],
    [["Is sorting case sensitive?", "No, A and a sort together."], ["Can I sort numbers properly?", "Yes, choose Numeric so 10 comes after 9."], PRIVACY]],
  ["text-to-pdf", "Text to PDF Converter", "pdf-tools", "Turn plain text into a downloadable PDF in your browser. No upload, no sign-up.", ["text to pdf", "convert text to pdf", "txt to pdf", "create pdf from text"], [
    "Type or paste your text, choose a file name and press Download PDF. The tool lays the text out on A4 pages with margins, wraps long lines and starts new pages automatically.",
    "The PDF is created inside your browser with a PDF library, so your text is never uploaded to a server.",
    "The standard font supports Latin characters. Other scripts are replaced with question marks, so use a full word processor for Arabic or Chinese."],
    [["Is my text uploaded?", "No. It is created locally."], ["Does it support Arabic?", "Not yet. Latin characters only."], PRIVACY]],
  ["time-zone-converter", "Time Zone Converter", "date-time", "Convert a date and time between 25 major time zones at once.", ["time zone converter", "world time converter", "convert time zones", "meeting time planner"], [
    "Pick a date and time, choose the time zone it is in and see the same moment in 25 major zones, including New York, London, Cairo, Dubai, Mumbai, Tokyo and Sydney.",
    "It uses your browser's time zone database, so daylight saving changes are handled for the date you pick.",
    "Use it to schedule meetings and calls across countries."],
    [["Does it handle daylight saving?", "Yes, for the date you choose."], ["Can I add more zones?", "The list covers the most common ones."], PRIVACY]],
];

export const popularTools: ToolMeta[] = SPECS.map(([slug, title, category, desc, keywords, paras, faqs]) => ({
  slug,
  title,
  shortDescription: desc,
  metaDescription: desc.length > 158 ? desc.slice(0, 155) + "..." : desc,
  category,
  keywords,
  componentKey: `Pop:${slug}`,
  article: paras.join("\n\n"),
  faqs: faqs.map(([q, a]) => ({ q, a })),
}));
