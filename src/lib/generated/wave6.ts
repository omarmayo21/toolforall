import type { CategoryKey, ToolMeta } from "../types";

type Spec = [slug: string, title: string, cat: string, desc: string, kw: string[], paras: [string, string, string], faqs: [string, string][]];
const P: [string, string] = ["Is my data sent to a server?", "No. Everything runs in your browser. Nothing you type is uploaded or stored."];
const F = "finance", H = "health-fitness", M = "math-converters", E = "education", DT = "date-time", FUN = "fun-random";

const SPECS: Spec[] = [
  ["salary-to-hourly-calculator", "Salary to Hourly Wage Calculator", F, "Convert an annual salary to an hourly, daily, weekly and monthly wage.", ["salary to hourly calculator", "annual salary to hourly", "yearly to hourly wage"], [
    "Enter your yearly salary, the hours you work per week and the weeks per year. The tool divides the salary and shows your hourly, daily, weekly and monthly pay.",
    "Use it to compare a job offer with an hourly job, or to see what your time is worth. A 60,000 salary at 40 hours a week and 52 weeks is about 28.85 per hour.",
    "Use fewer weeks if you want to remove unpaid time off. The result is before tax."],
    [["How many working hours are in a year?", "About 2,080 for a 40 hour week over 52 weeks."], ["Is the number before tax?", "Yes."], P]],
  ["overtime-pay-calculator", "Overtime Pay Calculator", F, "Calculate regular pay, overtime pay and total pay for a work period.", ["overtime pay calculator", "overtime calculator", "time and a half calculator"], [
    "Enter your hourly rate, regular hours, overtime hours and the overtime multiplier, such as 1.5 for time and a half. You get regular pay, overtime pay and the total.",
    "The multiplier and the point where overtime starts depend on your country, contract and sometimes the day worked.",
    "The result is before tax and deductions."],
    [["What is time and a half?", "1.5 times your normal hourly rate."], ["What is double time?", "A multiplier of 2."], P]],
  ["sales-tax-calculator", "Sales Tax Calculator", F, "Add sales tax to a price or find the price before tax.", ["sales tax calculator", "calculate sales tax", "price before tax calculator"], [
    "Choose whether to add tax to a price, or to take tax out of a price that already includes it. Enter the tax rate and see the tax amount and the total or pre tax price.",
    "To remove tax, the price is divided by 1 plus the rate. It is not the same as subtracting the rate from the price.",
    "Rates differ by place, so use your local rate."],
    [["Why not subtract 8 percent from the total?", "The tax was calculated on the pre tax price, so you divide by 1.08."], ["Does this work for VAT?", "Yes. The VAT calculator is made for that too."], P]],
  ["gst-calculator", "GST Calculator (India and others)", F, "Add or remove GST and see the CGST and SGST split.", ["gst calculator", "gst calculator india", "calculate gst inclusive exclusive"], [
    "Enter an amount and a GST rate and say if the amount includes GST or not. The tool shows the net amount, the GST, the CGST and SGST halves and the total.",
    "Common slabs in India are 5, 12, 18 and 28 percent. Other countries with GST, such as Australia, Canada and Singapore, use different rates.",
    "For invoices, check the HSN or SAC code to confirm the correct rate for the item."],
    [["What are CGST and SGST?", "Central and state GST. Each is half the total within a state."], ["How do I remove GST from a total?", "Choose Including GST."], P]],
  ["debt-to-income-ratio-calculator", "Debt-to-Income Ratio Calculator", F, "Find your DTI ratio from monthly debt payments and income.", ["debt to income ratio calculator", "dti calculator", "dti for mortgage"], [
    "Enter your total monthly debt payments, such as loans, cards and rent or mortgage, and your gross monthly income. The tool shows your DTI as a percent.",
    "Lenders use DTI to see if you can take on more debt. 36 percent or lower is considered healthy, and many mortgage programs accept up to 43 percent.",
    "To improve it, pay down debt or raise income. Do not count utilities or groceries as debt."],
    [["Which income do I use?", "Gross income, before tax."], ["Do I include rent?", "Include housing costs if you want the full ratio."], P]],
  ["zakat-calculator", "Zakat Calculator", F, "Estimate the zakat due on cash, gold and investments.", ["zakat calculator", "zakat on gold calculator", "حاسبة الزكاة", "calculate zakat on savings"], [
    "Enter your cash, gold in grams with today's gold price, investments, money owed to you and debts due now. The tool finds your net wealth, the nisab and the zakat of 2.5 percent when you are above it.",
    "The nisab here is 85 grams of gold. Some scholars use the silver nisab, which is lower, so confirm which one applies to you.",
    "Zakat is due after the wealth has been held for one lunar year. This tool is an aid, not a fatwa. Ask a trusted scholar about unusual assets."],
    [["Which nisab should I use?", "Scholars differ. The gold nisab is 85 g and the silver nisab is 595 g."], ["Do I pay on jewelry?", "Opinions differ. Ask a scholar."], P]],
  ["bmr-calculator", "BMR Calculator", H, "Estimate your basal metabolic rate and daily calorie needs.", ["bmr calculator", "basal metabolic rate calculator", "calories at rest", "tdee"], [
    "Enter sex, weight, height and age. The tool uses the Mifflin-St Jeor equation, which is among the most accurate for most adults, to estimate the calories your body burns at rest.",
    "It also multiplies BMR by activity levels to show daily calorie needs for maintenance. Eat below that to lose weight and above it to gain.",
    "These numbers are estimates. Muscle mass, genetics and health conditions change real needs."],
    [["What is BMR?", "Calories your body uses at rest for basic functions."], ["How much deficit is safe?", "Many guides suggest 300 to 500 kcal per day. Ask a professional for personal advice."], P]],
  ["sleep-calculator", "Sleep Cycle Calculator", H, "Find the best bedtime or wake time based on 90 minute sleep cycles.", ["sleep calculator", "bedtime calculator", "wake up time calculator", "sleep cycle calculator"], [
    "Tell the tool when you must wake up, and it lists bedtimes that end a sleep cycle. Or enter your bedtime to see good wake times.",
    "A cycle lasts about 90 minutes. Waking at the end of a cycle often feels easier than being woken in deep sleep. The tool adds 15 minutes to fall asleep.",
    "Most adults need 7 to 9 hours. Cycle length varies from person to person, so use the times as a guide."],
    [["How many cycles do I need?", "Five or six cycles, which is 7.5 to 9 hours."], ["Does it include falling asleep?", "Yes, 15 minutes."], P]],
  ["ovulation-calculator", "Ovulation Calculator", H, "Estimate your ovulation day, fertile window and next period.", ["ovulation calculator", "fertile window calculator", "when do i ovulate"], [
    "Enter the first day of your last period and your average cycle length. The tool estimates ovulation about 14 days before the next period, and shows the fertile window of six days.",
    "It works best for regular cycles. Stress, illness and other factors move ovulation, so the dates are estimates.",
    "It is not medical advice and not a way to prevent pregnancy. Talk to a doctor if you have irregular cycles or questions."],
    [["When is the fertile window?", "The five days before ovulation and the day after."], ["Is it accurate with irregular cycles?", "No. Use ovulation tests or ask a doctor."], P]],
  ["calories-burned-calculator", "Calories Burned Calculator", H, "Estimate calories burned in 13 activities from weight and time.", ["calories burned calculator", "calories burned walking", "calories burned running", "exercise calorie calculator"], [
    "Choose an activity, enter your weight and the minutes you did it. The tool uses MET values to estimate calories burned and the hourly rate.",
    "A heavier person burns more calories in the same activity. A 70 kg person burns about 150 kcal in 30 minutes of 8 km/h running.",
    "Intensity, fitness and terrain change the numbers. Treat the result as an estimate."],
    [["What is MET?", "A measure of how hard an activity is compared with rest."], ["Is it the same as fitness tracker numbers?", "They can differ by 10 to 30 percent."], P]],
  ["percentage-difference-calculator", "Percentage Difference Calculator", M, "Calculate the percentage difference between two numbers.", ["percentage difference calculator", "percent difference between two numbers", "calculate percent difference"], [
    "Enter two values to see the percentage difference, the absolute difference and the percent change from A to B.",
    "Percentage difference compares two values with their average, so the order does not matter. Percentage change measures growth from a starting value, so the order does.",
    "Use difference when neither number is the reference, and change when one is the starting point."],
    [["Difference or change?", "Change has a starting value. Difference treats both equally."], ["What if one value is zero?", "The difference is 200 percent."], P]],
  ["mean-median-mode-calculator", "Mean, Median and Mode Calculator", M, "Find the mean, median, mode, range, sum and count of a list of numbers.", ["mean median mode calculator", "average median mode", "range calculator"], [
    "Paste your numbers separated by commas, spaces or new lines. You get the count, sum, mean, median, mode, minimum, maximum and range.",
    "The mean is the average, the median is the middle value and the mode is the most frequent one. The median is less affected by extreme values.",
    "If every value appears once, the list has no mode."],
    [["When should I use the median?", "When there are extreme values, such as incomes."], ["Can there be two modes?", "Yes. The tool lists them all."], P]],
  ["standard-deviation-calculator", "Standard Deviation Calculator", M, "Calculate sample and population standard deviation and variance.", ["standard deviation calculator", "variance calculator", "population vs sample standard deviation"], [
    "Enter a list of numbers and get the mean, standard deviation and variance for both a sample and a population.",
    "Standard deviation shows how spread out numbers are. A small value means they sit close to the mean.",
    "Use the sample formula (n minus 1) when your data is part of a larger group and the population formula when you have every value."],
    [["Sample or population?", "Sample if the data is a part of something larger."], ["What is variance?", "The square of the standard deviation."], P]],
  ["permutation-combination-calculator", "Permutation and Combination Calculator", M, "Calculate nPr and nCr for any n and r.", ["permutation and combination calculator", "ncr calculator", "npr calculator"], [
    "Enter the total items n and the number chosen r to get the permutations P(n,r), where order matters, and combinations C(n,r), where it does not.",
    "Choosing 3 runners out of 10 for gold, silver and bronze is a permutation (720). Choosing 3 people for a team is a combination (120).",
    "Large results are shown in scientific notation."],
    [["What is the formula?", "P = n! / (n-r)!, C = n! / (r!(n-r)!)."], ["Does order matter?", "In permutations yes, in combinations no."], P]],
  ["triangle-area-calculator", "Triangle Area Calculator", M, "Find the area of a triangle from base and height or from three sides.", ["triangle area calculator", "heron's formula calculator", "area of triangle with three sides"], [
    "Enter the base and height, or all three sides, or both. The tool uses half base times height, and Heron's formula for the sides.",
    "Heron's formula needs only the side lengths: with s as half the perimeter, the area is the square root of s(s-a)(s-b)(s-c).",
    "If three sides cannot form a triangle, the tool tells you."],
    [["What units are used?", "Whatever unit you enter. The area is in square units."], ["Why does it say not a triangle?", "The two shorter sides must add up to more than the longest."], P]],
  ["area-calculator", "Area Calculator", M, "Calculate the area of a rectangle, circle, triangle, trapezoid or ellipse.", ["area calculator", "area of a circle calculator", "area of a rectangle", "trapezoid area"], [
    "Choose a shape and enter the values listed for it, such as length and width for a rectangle or the radius for a circle. The tool gives the area, and perimeter or circumference where relevant.",
    "Use the same unit for every value. The result is in square units, such as m² when you enter meters.",
    "For rooms and gardens, split an odd shape into rectangles and add the areas."],
    [["Which value goes where?", "Follow the order in the shape name."], ["Is pi exact?", "It uses the full value of pi in your browser."], P]],
  ["volume-calculator", "Volume Calculator", M, "Calculate the volume of a box, cylinder, sphere or cone.", ["volume calculator", "volume of a cylinder calculator", "volume of a sphere", "cone volume"], [
    "Pick a shape, enter its dimensions and get the volume and the surface area, or slant height for a cone.",
    "Volume is in cubic units. 1,000 cubic centimeters equal 1 liter.",
    "Use the same unit for all values or the result will be wrong."],
    [["How do I convert to liters?", "1,000 cm³ is 1 liter, and 1 m³ is 1,000 liters."], ["What is the cylinder formula?", "Pi x radius squared x height."], P]],
  ["grade-percentage-calculator", "Grade Percentage Calculator", E, "Turn marks into a percentage and a letter grade.", ["grade percentage calculator", "marks to percentage", "test score percentage calculator"], [
    "Enter the marks you got and the total marks. The tool gives the percentage, a US style letter grade and how many marks you lost.",
    "Use it for exams, quizzes and assignments. Grade boundaries differ across schools and countries, so the letter is only a guide.",
    "To combine several items with different weights, use the weighted grade calculator."],
    [["What is the formula?", "Marks obtained divided by total marks, times 100."], ["Is 70 percent a pass?", "It depends on your school."], P]],
  ["cgpa-to-percentage-calculator", "CGPA to Percentage Calculator", E, "Convert CGPA to percentage with CBSE, VTU or a simple method.", ["cgpa to percentage", "cgpa to percentage calculator", "convert cgpa to percentage cbse"], [
    "Enter your CGPA and the scale, then choose a method. CBSE multiplies CGPA by 9.5. VTU uses (CGPA minus 0.75) times 10. The simple method divides by the scale.",
    "Universities and employers can use their own rules, so check which one applies before you put a percentage on an application.",
    "The result is for guidance and is not an official conversion."],
    [["What is the CBSE formula?", "Percentage = CGPA x 9.5."], ["Is there one global formula?", "No. Each institution decides."], P]],
  ["weighted-grade-calculator", "Weighted Grade Calculator", E, "Calculate your weighted average from scores and their weights.", ["weighted grade calculator", "weighted average grade", "final course grade calculator"], [
    "Enter one line for each item as score, weight, for example 85, 30. The tool multiplies each score by its weight and divides by the total weight.",
    "Courses often weigh exams more than homework. Weights do not need to add up to 100, since the tool divides by their sum.",
    "To find what you need on the final exam, use the final grade calculator."],
    [["Do weights need to total 100?", "No."], ["Can I use points instead of percent?", "Enter each item as a percentage score."], P]],
  ["time-card-calculator", "Time Card Calculator", DT, "Add up your work hours from start and end times, with breaks.", ["time card calculator", "timesheet calculator", "work hours calculator", "hours worked calculator"], [
    "Enter one line per day, such as 09:00-17:30, 30 where 30 is the unpaid break in minutes. The tool shows hours for each line and the total, including decimal hours for payroll.",
    "Times past midnight are handled, so 22:00-06:00 counts as 8 hours.",
    "Use 24 hour time. Multiply the decimal total by your hourly rate for gross pay."],
    [["How do I add a break?", "Write the minutes after a comma."], ["What are decimal hours?", "7 h 30 min is 7.5 hours."], P]],
  ["time-duration-calculator", "Time Duration Calculator", DT, "Find the time between two clock times.", ["time duration calculator", "hours between two times", "time difference calculator", "elapsed time calculator"], [
    "Enter a start time and an end time in 24 hour format. The tool shows the duration in hours and minutes, in decimal hours and in minutes.",
    "If the end is earlier than the start, it assumes the end is on the next day, which suits night shifts.",
    "For dates and days, use the days between dates calculator."],
    [["Can it cross midnight?", "Yes."], ["Does it support AM and PM?", "Use 24 hour time, such as 17:45 for 5:45 PM."], P]],
  ["coin-flip", "Coin Flip", FUN, "Flip a virtual coin and see heads or tails, with a running count.", ["coin flip", "flip a coin", "heads or tails", "coin toss online"], [
    "Press the button to flip a coin. The result uses your browser's secure random generator, so each flip is fair and independent.",
    "It keeps a tally of heads and tails for your last 30 flips. Many people use it to settle small choices.",
    "Past flips do not change the next one. A streak of heads does not make tails more likely."],
    [["Is it fair?", "Yes. Each flip is 50 percent."], ["Can I flip many times?", "Yes, press as often as you like."], P]],
  ["random-team-generator", "Random Team Generator", FUN, "Split a list of names into fair random teams.", ["random team generator", "team maker", "split into teams randomly", "group generator"], [
    "Paste names, one per line, choose the number of teams and get a random split. Teams are balanced to within one person.",
    "Use it for games, classes, workshops and sports. Press shuffle for a new split.",
    "Names are not stored. The shuffle uses secure randomness."],
    [["Are teams equal in size?", "As close as possible."], ["Can I keep two people together?", "Not with this tool. Reshuffle or adjust by hand."], P]],
  ["lottery-number-generator", "Lottery Number Generator", FUN, "Generate random lottery number sets for any pick size and range.", ["lottery number generator", "random lottery numbers", "lotto number picker"], [
    "Choose how many numbers per set, the highest number and how many sets. Each set has unique numbers sorted from low to high.",
    "Set it to 6 of 49 for a classic lotto, or 5 of 69 for Powerball style picks.",
    "Random numbers have the same chance as any others. No tool can predict a draw. Play within your budget."],
    [["Does it improve my chances?", "No. All combinations are equally likely."], ["Are numbers repeated in a set?", "No."], P]],
  ["cups-to-grams-converter", "Cups to Grams Converter (Baking)", M, "Convert cups, tablespoons and teaspoons of common ingredients into grams.", ["cups to grams", "cups to grams flour", "baking measurement converter", "tablespoon to grams"], [
    "Pick an ingredient and an amount in cups, tablespoons or teaspoons. The tool gives grams, ounces and milliliters.",
    "A cup of flour weighs about 120 g, but a cup of sugar weighs about 200 g and a cup of honey 340 g, so a single cups to grams number cannot work for all ingredients.",
    "Scooping, packing and brand change weights. For consistent baking, weigh your ingredients."],
    [["How many grams is a cup of flour?", "About 120 g for all-purpose flour."], ["Which cup is used?", "The US cup of 236.6 ml."], P]],
  ["paint-calculator", "Paint Calculator", M, "Estimate how many liters of paint a room needs.", ["paint calculator", "how much paint do i need", "room paint calculator"], [
    "Enter the room length, width and wall height, the number of doors and windows, the coats and the coverage of your paint. The tool shows the wall area and liters needed, with 10 percent extra.",
    "Most paints cover 8 to 12 m² per liter. The label on the can gives the exact number.",
    "The ceiling is not included. Dark colors and rough walls may need more coats and paint."],
    [["How much extra should I buy?", "About 10 percent."], ["Are doors deducted?", "Yes, as 1.9 m² each, and windows as 1.4 m²."], P]],
  ["tile-calculator", "Tile Calculator", M, "Work out how many tiles you need for a floor, with waste.", ["tile calculator", "how many tiles do i need", "floor tile calculator"], [
    "Enter the floor length and width, the tile size and a waste allowance. The tool shows the floor area and the number of tiles to buy.",
    "Waste covers cuts and breakage. 10 percent is common, and diagonal or patterned layouts need around 15 percent.",
    "Buy all tiles from the same batch, since colors can differ between batches."],
    [["Why add waste?", "Edge cuts and broken tiles."], ["Does it include grout lines?", "No. Add a little if grout lines are wide."], P]],
  ["concrete-calculator", "Concrete Calculator", M, "Estimate the volume of concrete for a slab or path.", ["concrete calculator", "concrete volume calculator", "how much concrete do i need"], [
    "Enter the length, width and thickness of the slab. The tool shows the volume in cubic meters, with 10 percent extra, and in cubic yards.",
    "A 4 x 3 m slab 10 cm thick needs 1.2 m³, or 1.32 m³ with extra. Ready mix is sold by the cubic meter or cubic yard.",
    "Uneven ground, forms and spillage use more concrete, so order a little extra."],
    [["How thick should a slab be?", "10 cm for paths, 10 to 15 cm for garage floors."], ["How many bags is it?", "That depends on the bag size. Check the yield on the bag."], P]],
  ["fuel-cost-calculator", "Fuel Cost Calculator", M, "Estimate fuel used and trip cost from distance, consumption and price.", ["fuel cost calculator", "trip cost calculator", "gas mileage cost calculator"], [
    "Choose metric (km, L/100 km, price per liter) or US units (miles, mpg, price per gallon). Enter distance, consumption and price to see the fuel needed and the trip cost.",
    "Use your real consumption, not the brochure figure. Highway driving, air conditioning, loads and speed change it.",
    "Share the total cost with passengers, or compare a drive with a train or flight."],
    [["What is a normal consumption?", "6 to 9 L/100 km for many cars."], ["How do I convert mpg?", "L/100 km = 235.2 divided by mpg (US)."], P]],
];

export const wave6Tools: ToolMeta[] = SPECS.map(([slug, title, category, desc, keywords, paras, faqs]) => ({
  slug, title, shortDescription: desc, metaDescription: desc.length > 158 ? desc.slice(0, 155) + "..." : desc, category: category as CategoryKey, keywords,
  componentKey: `Pop:${slug}`, article: paras.join("\n\n"), faqs: faqs.map(([q, a]) => ({ q, a })),
}));
