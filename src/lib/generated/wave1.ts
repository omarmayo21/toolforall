import type { CategoryKey, ToolMeta } from "../types";

type Spec = [slug: string, title: string, cat: CategoryKey, desc: string, kw: string[], paras: string[], faqs: [string, string][]];
const P: [string, string] = ["Is my data sent to a server?", "No. Everything runs in your browser. Nothing you type is uploaded or stored."];

const SPECS: Spec[] = [
  ["profit-margin-calculator", "Profit Margin Calculator", "finance", "Calculate profit, profit margin and markup from your cost and selling price.", ["profit margin calculator", "gross margin calculator", "margin vs markup"], [
    "Enter what a product costs you and what you sell it for. The calculator shows your profit, your profit margin (profit divided by revenue) and your markup (profit divided by cost).",
    "Margin and markup are often confused. A product bought for 60 and sold for 100 has a 40% margin but a 66.7% markup. Margin can never reach 100%, while markup can be any size.",
    "Use margin to compare how much of each sale you keep, and markup to set prices from costs. Remember to include shipping, fees and your time in the cost."],
    [["What is the margin formula?", "Margin = (revenue - cost) / revenue x 100."], ["What is a good profit margin?", "It depends on the industry. Retail often sees 20% to 50% gross margin, software much higher."], P]],
  ["markup-calculator", "Markup Calculator", "finance", "Find the selling price, profit and margin from a cost and a markup percentage.", ["markup calculator", "markup percentage", "price markup", "retail markup"], [
    "Enter the cost of an item and the markup you want. The selling price is cost x (1 + markup). The calculator also shows the profit in money and the resulting margin.",
    "A 50% markup gives a 33.3% margin. If you want a specific margin, use the profit margin calculator instead.",
    "Markup is how retailers and wholesalers usually price goods: they add a fixed percentage to what they paid."],
    [["How do I add a 30% markup?", "Multiply the cost by 1.30."], ["Is markup the same as margin?", "No. Markup is based on cost, margin on selling price."], P]],
  ["break-even-calculator", "Break-Even Calculator", "finance", "Find how many units you must sell to cover fixed costs, from price and variable cost.", ["break even calculator", "break even point", "break even analysis"], [
    "The break-even point is the sales volume where revenue equals total costs. Enter your fixed costs, the price per unit and the variable cost per unit.",
    "Each unit contributes price minus variable cost toward covering fixed costs. Break-even units = fixed costs / contribution per unit. Sales above that number are profit.",
    "Use it before launching a product, pricing a service or deciding whether a fixed cost like rent is worth it."],
    [["What are fixed costs?", "Costs that do not change with volume, like rent and software subscriptions."], ["What are variable costs?", "Costs per unit, like materials and payment fees."], P]],
  ["inflation-calculator", "Inflation Calculator", "finance", "See how inflation changes the price of goods and the buying power of your money over the years.", ["inflation calculator", "purchasing power calculator", "future cost calculator"], [
    "Enter an amount, an average yearly inflation rate and the number of years. The calculator shows what the same goods will cost in the future and what your money will be able to buy.",
    "At 4% a year, prices rise about 48% in ten years, so 1,000 today buys what about 676 buys then.",
    "Use a rate that matches your country and period. The result is a projection from the rate you enter, not official data."],
    [["How is it calculated?", "Future cost = amount x (1 + rate)^years."], ["Does it use official CPI data?", "No. You enter the rate yourself."], P]],
  ["savings-goal-calculator", "Savings Goal Calculator", "finance", "Work out how much to save each month to reach a goal by a date, with interest.", ["savings goal calculator", "how much to save per month", "savings plan calculator"], [
    "Enter your goal, what you have saved so far, how many years you have and the annual return. The calculator shows the monthly amount you need to deposit.",
    "Interest lowers the amount you must save. With a 0% return the monthly amount is simply the remaining goal divided by the number of months.",
    "Use a cautious rate. Savings account rates change and investments can lose value."],
    [["Does it include compounding?", "Yes, monthly."], ["What if I already reached the goal?", "The monthly amount shows as zero."], P]],
  ["rule-of-72-calculator", "Rule of 72 Calculator", "finance", "Estimate how many years it takes to double your money at a given return.", ["rule of 72", "doubling time calculator", "how long to double money"], [
    "Divide 72 by your annual return and you get the approximate years to double. At 8% it takes about 9 years.",
    "This tool also shows the exact doubling time using logarithms and the time to triple your money.",
    "The rule works best for rates between 6% and 10%."],
    [["Why 72?", "It is close to 100 x ln(2) and has many small divisors, so the mental math is easy."], ["Does it work for debt?", "Yes. It shows how fast debt doubles at a given interest rate."], P]],
  ["salary-raise-calculator", "Salary Raise Calculator", "finance", "Calculate your new salary after a percentage raise, with the monthly and yearly increase.", ["salary raise calculator", "pay raise calculator", "percentage raise"], [
    "Enter your current yearly salary and the raise percentage. You get the new salary, the increase per year and per month, and your new monthly pay.",
    "A raise is multiplied, so 5% on 50,000 adds 2,500. The result is gross pay before tax.",
    "Compare it to inflation. A raise below the inflation rate is a cut in buying power."],
    [["How do I calculate a raise?", "New salary = salary x (1 + raise%)."], ["Is the result after tax?", "No. It is gross."], P]],
  ["credit-card-payoff-calculator", "Credit Card Payoff Calculator", "finance", "See how many months it takes to pay off a card and how much interest you will pay.", ["credit card payoff calculator", "debt payoff calculator", "how long to pay off credit card"], [
    "Enter the balance, the APR and your fixed monthly payment. The calculator simulates each month and shows the number of months, total interest and total paid.",
    "If your payment is lower than the monthly interest, the balance never falls, and the tool warns you.",
    "Paying a little more each month shortens the time a lot. Try different payments to see the effect."],
    [["Does it include new purchases?", "No. Assume you stop using the card."], ["How is monthly interest calculated?", "APR divided by 12 applied to the balance."], P]],
  ["down-payment-calculator", "Down Payment Calculator", "finance", "Work out the down payment, loan amount and rough closing cost for a home price.", ["down payment calculator", "how much down payment", "house down payment"], [
    "Enter the price and the down payment percentage. The calculator shows the down payment in money, the remaining loan amount and a rough closing-cost estimate of 3%.",
    "20% down avoids private mortgage insurance in the US, but many loans accept 3% to 10%.",
    "Use the mortgage calculator next to see the monthly payment."],
    [["How much should I put down?", "Many buyers aim for 10% to 20% depending on the loan type."], ["Are closing costs accurate?", "3% is a rough guide. Real costs vary by country."], P]],
  ["retirement-savings-calculator", "Retirement Savings Calculator", "finance", "Project your savings at retirement from age, current savings, monthly contribution and return.", ["retirement calculator", "retirement savings calculator", "how much will i have at retirement"], [
    "Enter your age, retirement age, current savings, monthly contribution and expected return. The calculator compounds monthly and shows your balance, total contributions and growth.",
    "It also shows a 4% yearly withdrawal, a common rule of thumb for sustainable spending.",
    "Results are projections. Inflation, fees, taxes and market swings will change the outcome."],
    [["What is the 4% rule?", "Withdrawing 4% of your pot in year one, then adjusting for inflation, has historically lasted about 30 years."], ["Is inflation included?", "No. Use a real (after inflation) return for today's money."], P]],
  ["unit-price-calculator", "Unit Price Calculator", "finance", "Compare two products by price per unit to find the better deal.", ["unit price calculator", "price per unit", "which is cheaper", "compare prices"], [
    "Enter the price and quantity of two options, such as 500 g for 4.50 and 1 kg for 8. The calculator shows the price per unit and which is cheaper.",
    "The bigger pack is not always the better deal, and this tool shows the real saving.",
    "Make sure both quantities use the same unit."],
    [["Which unit should I use?", "Any, as long as both options use the same one."], ["Is bulk always cheaper?", "No. Check the unit price."], P]],
  ["sales-commission-calculator", "Sales Commission Calculator", "finance", "Calculate commission earnings from sales and a commission rate, with optional base salary.", ["commission calculator", "sales commission calculator", "commission percentage"], [
    "Enter total sales and the commission rate. The tool shows your commission and total earnings with an optional base salary.",
    "Commission = sales x rate. For tiered plans, run each tier separately and add the results.",
    "Check your contract for what counts as a sale."],
    [["How is commission calculated?", "Sales x rate."], ["Does it handle tiers?", "Not yet. Calculate each tier separately."], P]],
  ["body-fat-calculator", "Body Fat Calculator (US Navy Method)", "health-fitness", "Estimate body fat percentage from height, neck, waist and hip measurements.", ["body fat calculator", "body fat percentage", "navy body fat calculator"], [
    "This calculator uses the US Navy circumference method. Measure your neck and waist (and hip for women) in centimeters, enter your height, and it estimates your body fat percentage and category.",
    "Measure waist at the navel and neck below the larynx, relaxed, with a flexible tape. Repeat twice for accuracy.",
    "It is an estimate within a few percent. DEXA scans and calipers are more accurate. Not medical advice."],
    [["How accurate is it?", "Usually within 3 to 4 percentage points."], ["Why do women need hip size?", "The female formula includes hip circumference."], P]],
  ["water-intake-calculator", "Daily Water Intake Calculator", "health-fitness", "Estimate how much water you should drink per day from weight and exercise.", ["water intake calculator", "how much water to drink", "daily water intake"], [
    "A common estimate is about 33 ml of water per kilogram of body weight, plus about 350 ml for each 30 minutes of exercise. Enter your weight and exercise time to see liters, glasses and ounces.",
    "Needs go up in hot weather, at altitude, in pregnancy and with illness. Food and other drinks also contribute.",
    "This is a general guide. People with kidney or heart conditions should follow their doctor's advice."],
    [["Do coffee and tea count?", "Yes, mostly. They contribute to hydration."], ["Can I drink too much?", "Yes, but it is rare. Spread intake through the day."], P]],
  ["one-rep-max-calculator", "One Rep Max (1RM) Calculator", "health-fitness", "Estimate your one rep max from the weight and reps you lifted, with training percentages.", ["one rep max calculator", "1rm calculator", "max bench calculator", "epley formula"], [
    "Enter the weight you lifted and how many reps you completed. The calculator estimates your one rep max with the Epley and Brzycki formulas and shows their average.",
    "It also lists 90%, 80% and 70% of your max, which are common working weights in strength programs.",
    "Estimates are most accurate for sets of 2 to 10 reps. Never test a true max without a spotter."],
    [["Which formula is better?", "Both are close. Brzycki is slightly lower on high reps."], ["How many reps should I use?", "Under 10 gives the best estimate."], P]],
  ["macro-calculator", "Macro Calculator", "health-fitness", "Split your daily calories into grams of carbs, protein and fat.", ["macro calculator", "macros calculator", "calories to grams", "macro split"], [
    "Enter your daily calorie target and pick a split: balanced, low carb or high protein. The calculator converts the percentages into grams using 4 calories per gram of carbs and protein and 9 per gram of fat.",
    "Use the calorie calculator first to find your target, then apply a split.",
    "These splits are starting points. A dietitian can tailor them to your health and goals."],
    [["How many calories are in a gram of fat?", "9. Carbs and protein have 4."], ["Which split is best?", "It depends on your goals and preferences. Consistency matters most."], P]],
  ["running-pace-calculator", "Running Pace Calculator", "health-fitness", "Calculate your running pace per km and mile, speed and predicted race times.", ["running pace calculator", "pace calculator", "marathon pace calculator", "5k pace"], [
    "Enter a distance in kilometers and your time in minutes. You get your pace per km and per mile, your speed and predicted finish times for 5K, 10K, half marathon and marathon at the same pace.",
    "Real races slow down as distance grows, so treat the marathon time as the best case.",
    "Use it to plan training runs and race targets."],
    [["How do I find pace?", "Divide time by distance."], ["Is the marathon time realistic?", "Only if you can hold the same pace, which is hard for most runners."], P]],
  ["heart-rate-zone-calculator", "Heart Rate Zone Calculator", "health-fitness", "Find your maximum heart rate and the five training zones from your age.", ["heart rate zone calculator", "max heart rate", "target heart rate", "fat burning heart rate"], [
    "Your estimated maximum heart rate is 220 minus your age. Training zones are percentages of that number, from very light (50% to 60%) to maximum effort (90% to 100%).",
    "Zone 2 builds endurance and is where many people burn the highest share of fat. Zones 4 and 5 improve speed and power.",
    "The formula is an average. Individuals differ by 10 bpm or more, and medication can change heart rate."],
    [["What is my max heart rate?", "About 220 minus age."], ["Which zone burns fat?", "Zone 2, 60% to 70%, uses a higher share of fat."], P]],
  ["waist-to-hip-ratio-calculator", "Waist-to-Hip Ratio Calculator", "health-fitness", "Calculate your waist-to-hip ratio and compare it with the WHO health thresholds.", ["waist to hip ratio calculator", "whr calculator", "waist hip ratio"], [
    "Measure your waist at the narrowest point and your hips at the widest, then enter both. The ratio is waist divided by hip.",
    "The WHO considers a ratio above 0.90 for men or 0.85 for women a sign of abdominal obesity and higher health risk.",
    "It is a screening tool. Ask a doctor for a full assessment."],
    [["How do I measure?", "Stand relaxed, tape level with the floor, breathe out."], ["Is it better than BMI?", "It captures fat distribution, which BMI does not."], P]],
  ["protein-intake-calculator", "Protein Intake Calculator", "health-fitness", "Estimate daily protein in grams from your weight and goal.", ["protein intake calculator", "how much protein per day", "protein calculator"], [
    "Pick a goal and enter your weight. Guides range from 0.8 g per kg for sedentary adults to 1.6 g to 2.0 g per kg for people building muscle or cutting.",
    "The result is split across four meals as an example. Spreading protein through the day works well.",
    "People with kidney disease need medical advice before raising protein."],
    [["How much protein do I need?", "At least 0.8 g per kg. More if you train."], ["Can I get it from plants?", "Yes. Beans, lentils, tofu and grains all contribute."], P]],
  ["day-of-week-calculator", "Day of the Week Calculator", "date-time", "Find the weekday for any date, plus the day of the year and days left in the year.", ["day of the week calculator", "what day was i born", "what day is it on", "weekday finder"], [
    "Pick any date, past or future, and see which weekday it falls on, the day number within the year and how many days remain.",
    "It works for dates well beyond the last century and handles leap years.",
    "Use it to find your birth weekday or check a historic date."],
    [["What day was I born?", "Enter your birth date."], ["Does it handle leap years?", "Yes."], P]],
  ["week-number-calculator", "Week Number Calculator", "date-time", "Find the ISO week number and quarter for any date.", ["week number calculator", "what week is it", "iso week number", "week of the year"], [
    "Pick a date to see its ISO 8601 week number, the ISO year and the quarter. ISO weeks start on Monday and week 1 is the week with the first Thursday of the year.",
    "Business reporting, shipping and payroll often use week numbers.",
    "The first and last days of a year can belong to a week of the neighboring year."],
    [["What week number is today?", "Open the tool with today's date, which is preselected."], ["Do all countries use ISO weeks?", "Europe mostly does. The US often starts weeks on Sunday."], P]],
  ["business-days-calculator", "Business Days Calculator", "date-time", "Add or subtract working days from a date, skipping weekends.", ["business days calculator", "working days calculator", "add business days", "workday calculator"], [
    "Enter a start date and a number of business days. The calculator skips Saturdays and Sundays and gives the resulting date. Use a negative number to count backward.",
    "Useful for delivery dates, payment terms and notice periods.",
    "Public holidays are not excluded, so add extra days if one falls in the range. Some regions have a Friday and Saturday weekend, which this tool does not cover."],
    [["Does it skip holidays?", "No. Only Saturdays and Sundays."], ["Can I count backward?", "Yes, enter a negative number."], P]],
  ["leap-year-checker", "Leap Year Checker", "date-time", "Check whether a year is a leap year and find the next one.", ["leap year checker", "is it a leap year", "leap year calculator", "next leap year"], [
    "Enter a year to find out if it has 366 days. A year is a leap year if divisible by 4, except century years, which must be divisible by 400. So 2000 was a leap year and 1900 was not.",
    "The tool also shows the next leap year and how many days February has.",
    "Leap years keep the calendar aligned with the Earth's orbit."],
    [["Is 2100 a leap year?", "No. It is a century year not divisible by 400."], ["Why do we have them?", "A year is about 365.2425 days long."], P]],
  ["gregorian-to-hijri-converter", "Gregorian to Hijri Date Converter", "date-time", "Convert any Gregorian date to the Islamic Hijri date, in English and Arabic.", ["gregorian to hijri", "hijri date converter", "islamic date today", "التاريخ الهجري"], [
    "Pick a Gregorian date and see the Hijri date using the Umm al-Qura calendar, shown in English and in Arabic.",
    "The Hijri calendar is a lunar calendar of 354 or 355 days, so its months move through the seasons. It is used for Ramadan, Eid and Hajj.",
    "Actual month starts depend on moon sighting and can differ by a day from the calculated calendar."],
    [["Which Hijri calendar is used?", "Umm al-Qura, the official calendar in Saudi Arabia."], ["Can the date differ by a day?", "Yes, where moon sighting is used."], P]],
  ["birthday-countdown", "Birthday Countdown", "date-time", "Count the days until your next birthday and see how many days you have lived.", ["birthday countdown", "days until my birthday", "how many days old am i"], [
    "Enter your date of birth to see how many days remain until your next birthday, the age you will turn, the weekday it falls on and the number of days you have lived.",
    "Leap-day birthdays are shown on 1 March in non-leap years.",
    "Share the result with friends or use it for planning."],
    [["How many days old am I?", "The tool shows the number of days since your birth."], ["What if my birthday is today?", "It counts to next year's date."], P]],
  ["gpa-calculator", "GPA Calculator", "education", "Calculate your GPA on a 4.0 scale from letter grades and credit hours.", ["gpa calculator", "grade point average calculator", "college gpa calculator", "semester gpa"], [
    "Enter one course per line with a letter grade and the credit hours, such as A- 3. The calculator converts grades to points, multiplies by credits and divides by total credits.",
    "It uses the standard 4.0 scale: A 4.0, B 3.0, C 2.0, D 1.0, F 0, with plus and minus steps.",
    "Schools differ, especially on A+ and on weighted courses, so check your own scale."],
    [["How is GPA calculated?", "Sum of grade points x credits, divided by total credits."], ["Does it support weighted GPA?", "No. It uses the unweighted 4.0 scale."], P]],
  ["final-grade-calculator", "Final Grade Calculator", "education", "Find the score you need on the final exam to reach your target grade.", ["final grade calculator", "what do i need on my final", "grade needed calculator"], [
    "Enter your current grade, the weight of the final exam and the grade you want. The calculator shows what you need to score on the final.",
    "Needed = (target - current x (1 - weight)) / weight. If the number is above 100%, the target is not possible without extra credit.",
    "Use it to decide how much to study."],
    [["How is it calculated?", "Needed = (target - current x (1 - weight)) / weight."], ["What if it is over 100%?", "You would need extra credit."], P]],
  ["quadratic-equation-solver", "Quadratic Equation Solver", "education", "Solve ax² + bx + c = 0, showing real or complex roots, the discriminant and the vertex.", ["quadratic equation solver", "quadratic formula calculator", "solve quadratic equation", "discriminant calculator"], [
    "Enter a, b and c. The solver uses the quadratic formula x = (-b ± sqrt(b² - 4ac)) / 2a and shows both roots, the discriminant and the vertex of the parabola.",
    "A positive discriminant gives two real roots, zero gives one repeated root and negative gives two complex roots, shown with i.",
    "If a is zero the equation is linear."],
    [["What is the discriminant?", "b² - 4ac. It tells how many real roots there are."], ["Does it show complex roots?", "Yes."], P]],
  ["prime-number-checker", "Prime Number Checker", "education", "Check whether a number is prime and see its prime factorization and the next prime.", ["prime number checker", "is it prime", "prime factorization calculator", "next prime"], [
    "Enter a whole number up to one trillion. The tool tests it by trial division, shows its prime factors and finds the next prime.",
    "A prime has exactly two divisors: 1 and itself. 2 is the only even prime.",
    "Very large numbers used in cryptography need other methods."],
    [["Is 1 prime?", "No."], ["How large can the number be?", "Up to one trillion."], P]],
  ["gcd-lcm-calculator", "GCD and LCM Calculator", "education", "Find the greatest common divisor and least common multiple of two or more numbers.", ["gcd calculator", "lcm calculator", "hcf calculator", "greatest common factor"], [
    "Enter two or more positive whole numbers. The calculator uses Euclid's algorithm for the GCD (also called HCF) and derives the LCM from it.",
    "The GCD simplifies fractions. The LCM helps find a common denominator.",
    "For two numbers, GCD x LCM equals their product."],
    [["What is HCF?", "The same as GCD."], ["Can I enter more than two numbers?", "Yes."], P]],
  ["factorial-calculator", "Factorial Calculator", "education", "Calculate n! for any whole number up to 1000, with exact digits.", ["factorial calculator", "n factorial", "factorial of a number"], [
    "The factorial of n is the product of all whole numbers from 1 to n. Enter n up to 1000 and the calculator uses big integers for the exact result.",
    "Factorials count arrangements: 5 books can be ordered in 5! = 120 ways. 0! is defined as 1.",
    "Large results are shown with the first and last digits and a scientific form."],
    [["What is 0 factorial?", "1."], ["What is the largest n supported?", "1000."], P]],
  ["pythagorean-theorem-calculator", "Pythagorean Theorem Calculator", "education", "Find the hypotenuse or a missing leg of a right triangle, with area and perimeter.", ["pythagorean theorem calculator", "hypotenuse calculator", "right triangle calculator"], [
    "The theorem says a² + b² = c² for a right triangle, where c is the hypotenuse. Enter two sides and find the third.",
    "The tool also gives the area and perimeter when the sides are known.",
    "It only works for right triangles."],
    [["What is the hypotenuse?", "The longest side, opposite the right angle."], ["Can I find a leg?", "Yes, choose Leg a and enter b and c."], P]],
  ["circle-calculator", "Circle Calculator", "education", "Find the diameter, circumference and area of a circle from its radius.", ["circle calculator", "area of a circle", "circumference calculator", "circle area"], [
    "Enter the radius. Diameter = 2r, circumference = 2 pi r and area = pi r².",
    "To start from the diameter, divide it by two first.",
    "Results use the full precision of pi in your browser."],
    [["What is the area formula?", "pi x r²."], ["What is the circumference formula?", "2 x pi x r."], P]],
  ["ratio-calculator", "Ratio Calculator", "education", "Solve A : B = C : D for the missing value and simplify ratios.", ["ratio calculator", "proportion calculator", "solve ratio", "simplify ratio"], [
    "Enter A, B and C to find D so that A / B = C / D. The tool also simplifies A : B to lowest terms.",
    "Ratios are used in recipes, maps, mixing and scaling designs.",
    "For simplifying, whole numbers work best."],
    [["How do I solve a proportion?", "Cross-multiply: D = B x C / A."], ["Can I use decimals?", "Yes for solving, but simplifying needs whole numbers."], P]],
  ["scientific-notation-converter", "Scientific Notation Converter", "education", "Convert a number to scientific, E and engineering notation.", ["scientific notation converter", "standard form calculator", "number to scientific notation", "engineering notation"], [
    "Enter a number such as 123456 or 0.00042 and get it as a x 10^n, in E notation and in engineering notation, where the exponent is a multiple of 3.",
    "Scientific notation keeps very large and very small numbers readable.",
    "The mantissa is shown to ten significant digits."],
    [["What is E notation?", "A text form like 1.23456e+5."], ["What is engineering notation?", "Scientific notation with exponents in steps of 3."], P]],
  ["random-color-generator", "Random Color Generator", "fun-random", "Generate random color palettes with hex codes. Copy them in one click.", ["random color generator", "random hex color", "random palette generator"], [
    "Press the button to get five random colors with their hex codes. Copy them all at once for design mockups, art or games.",
    "Random colors can clash, so use them for inspiration and refine with the color palette generator.",
    "Colors are generated in your browser."],
    [["Can I copy the codes?", "Yes, with the copy button."], ["Are the palettes accessible?", "Not necessarily. Check contrast with the contrast checker."], P]],
  ["yes-or-no-picker", "Yes or No Picker", "fun-random", "Can't decide? Get a random yes or no answer with one click.", ["yes or no picker", "yes or no generator", "decision maker", "random yes no"], [
    "Press the button and get a random yes or no, with equal chance for each.",
    "Use it for small decisions or as a tie-breaker. Pick the answer you hoped for as a hint about your real preference.",
    "For bigger choices, use the random name picker with your options."],
    [["Is it 50/50?", "Yes."], ["Can I add more options?", "Use the random name picker."], P]],
];

export const wave1Tools: ToolMeta[] = SPECS.map(([slug, title, category, desc, keywords, paras, faqs]) => ({
  slug, title, shortDescription: desc, metaDescription: desc.length > 158 ? desc.slice(0, 155) + "..." : desc, category, keywords,
  componentKey: `Pop:${slug}`, article: paras.join("\n\n"), faqs: faqs.map(([q, a]) => ({ q, a })),
}));
