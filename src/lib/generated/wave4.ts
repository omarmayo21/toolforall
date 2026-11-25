import type { CategoryKey, ToolMeta } from "../types";

type Spec = [slug: string, title: string, cat: CategoryKey, desc: string, kw: string[], paras: [string, string, string], faqs: [string, string][]];
const I = "image-tools" as CategoryKey, D = "pdf-tools" as CategoryKey;
const P: [string, string] = ["Is my file uploaded?", "No. Everything runs in your browser. Your file never leaves your device."];

const SPECS: Spec[] = [
  ["black-and-white-image-converter", "Black and White Image Converter", I, "Turn any photo into black and white online, with an adjustable amount.", ["black and white photo converter", "convert image to grayscale", "photo to black and white", "grayscale image online"], [
    "Drop a photo and it is converted to grayscale at once. Use the slider to keep some of the original color, from a full black and white picture to a faded look.",
    "The conversion uses the standard luminance weights, which match how the eye sees brightness, so skin and skies keep natural tones instead of going flat.",
    "Download the result as a JPG. Use the original file if you need it later, since the new file has no color data."],
    [["Does it reduce quality?", "The result is saved as a high quality JPG, so there is little visible loss."], ["Can I keep part of the color?", "Yes. Lower the amount below 100 percent."], P]],
  ["sepia-photo-filter", "Sepia Photo Filter", I, "Give a photo a warm vintage sepia tone and download it.", ["sepia filter online", "vintage photo filter", "sepia effect photo", "old photo effect"], [
    "Upload a picture and apply the classic brown sepia tone. The strength slider lets you mix in as much of the original color as you want.",
    "Sepia gives pictures the look of early prints. It works well for portraits, travel photos and old family pictures.",
    "For a cooler look, use the black and white converter instead."],
    [["How does sepia work?", "Each pixel's red, green and blue values are mixed using a fixed brown tone matrix."], ["Can I undo it?", "Keep your original file, as the download is a new image."], P]],
  ["invert-image-colors", "Invert Image Colors", I, "Create a negative of any image by inverting its colors.", ["invert image colors", "negative image online", "image color inverter", "invert photo"], [
    "Upload an image and every color is replaced by its opposite. Black becomes white, and blue becomes orange.",
    "Use it for photo negatives, dark mode versions of black on white diagrams and screenshots, or artistic effects.",
    "Transparency is kept, so PNG logos stay transparent after inversion."],
    [["Does it keep transparency?", "Yes."], ["Can I invert a logo for dark mode?", "Yes. Black text turns white, but check brand colors."], P]],
  ["image-brightness-contrast-editor", "Image Brightness and Contrast Editor", I, "Make a photo brighter or darker and adjust its contrast with live preview.", ["adjust image brightness online", "photo contrast editor", "brighten a photo online", "increase contrast image"], [
    "Move the brightness and contrast sliders and watch the result update. You can lighten a dark photo or tone down a washed out one.",
    "Brightness shifts all tones up or down. Contrast makes the difference between lights and darks stronger or weaker.",
    "Strong changes can lose detail in the brightest or darkest areas, so make small steps and compare to the original."],
    [["What is the difference between brightness and contrast?", "Brightness moves everything lighter or darker. Contrast changes the gap between light and dark."], ["Can I fix an underexposed photo?", "Mild cases, yes. Heavily dark areas lose detail."], P]],
  ["image-hue-saturation-editor", "Image Hue and Saturation Editor", I, "Shift the colors of a picture and make them more vivid or muted.", ["change image hue online", "saturation editor", "desaturate image", "recolor image online"], [
    "Rotate the hue to shift all colors around the color wheel, for example turning a red car blue. Change saturation to make colors richer or fade them toward gray.",
    "Use it for quick recoloring of icons, product shots and graphics, or to calm down overly bright photos.",
    "Hue shifts apply to the whole image. For a single object, use an editor with selection tools."],
    [["What does hue shift mean?", "It rotates every color by an angle on the color wheel."], ["Will skin tones change?", "Yes, hue shifts affect every color."], P]],
  ["image-opacity-changer", "Image Opacity Changer", I, "Make an image semi transparent and save it as a PNG.", ["change image opacity", "make image transparent online", "image transparency tool", "reduce image opacity"], [
    "Upload an image, set the opacity from 0 to 100 percent and download a PNG with that transparency.",
    "Faded images work well as backgrounds, watermarks and overlays on slides and web pages.",
    "The output is always PNG so the transparency is kept."],
    [["Which format is the result?", "PNG, as JPG cannot be transparent."], ["Can I change a part of the image?", "No. The whole image gets the same opacity."], P]],
  ["remove-white-background", "Remove White Background from Image", I, "Make the white background of a logo or drawing transparent.", ["remove white background", "make background transparent", "white to transparent png", "remove background from logo"], [
    "Upload a logo, signature or scan on a white background. Pixels close to white become transparent, and the edge fades smoothly to avoid a harsh outline.",
    "Raise the tolerance if some off white or gray background remains. Lower it if parts of the artwork disappear.",
    "This works for simple flat backgrounds. It is not an AI cutout tool for photos with complex scenery."],
    [["Does it work on photos?", "Only if the background is plain white. Complex backgrounds need an AI tool."], ["What format is saved?", "PNG with transparency."], P]],
  ["pixelate-image", "Pixelate Image", I, "Pixelate a picture to hide details or get a retro look.", ["pixelate image online", "pixelate photo", "pixel art effect", "censor image pixelate"], [
    "Choose a block size and the image is turned into large square pixels. Small blocks keep the shape. Large blocks hide almost everything.",
    "People use it to hide license plates, names or faces in screenshots, or for pixel art style graphics.",
    "To hide private data, use a large block size. Light pixelation can sometimes be reversed by software."],
    [["Is pixelation safe for hiding text?", "Only with very large blocks. Covering with a solid box is safer."], ["Can I keep the original size?", "Yes, the output has the same dimensions."], P]],
  ["add-border-to-image", "Add Border to Image", I, "Add a colored border or frame around a photo.", ["add border to image", "add frame to photo", "image border online", "white border for instagram"], [
    "Pick a border width in pixels and a color, and the tool adds it around your image. The image size grows by twice the border width.",
    "A white border is a common way to show a full photo on Instagram or to create a print style frame. Dark borders make light images stand out.",
    "The result is saved as a PNG."],
    [["Does it crop the image?", "No. The border is added outside."], ["Can I use a transparent border?", "Use the Make Image Square tool with a transparent background."], P]],
  ["make-image-square", "Make Image Square (Add Padding)", I, "Turn any image into a square by adding padding, without cropping.", ["make image square", "square image for instagram", "add padding to image to make square", "fit image into square"], [
    "Upload a wide or tall picture and the tool adds space on the sides or top to make it a perfect square, keeping the full photo.",
    "Choose a solid color or transparent padding. Squares are needed for profile pictures, app icons, marketplace listings and Instagram grids.",
    "The longest side sets the size of the square."],
    [["Is the picture cropped?", "No. It is centered inside the square."], ["Can the padding be transparent?", "Yes, the result is a PNG."], P]],
  ["round-image-corners", "Round Image Corners", I, "Round the corners of an image and save it with transparent corners.", ["round image corners", "rounded corners image online", "image with rounded corners", "make corners round png"], [
    "Set the roundness from sharp corners to a full pill or circle shape. The corners become transparent in the PNG.",
    "Rounded images look friendly for app icons, avatars, cards and presentation slides.",
    "100 percent roundness turns a square into a circle and a rectangle into a pill."],
    [["Are the corners transparent?", "Yes."], ["Can I make a circle?", "Use roundness 100 on a square image, or the circle crop tool."], P]],
  ["circle-crop-image", "Circle Crop Image", I, "Crop a picture into a circle for profile photos.", ["circle crop image", "crop image to circle", "round profile picture maker", "circular image"], [
    "Upload a photo and it is cropped to the biggest centered circle, with transparent corners. Download it as a PNG.",
    "It is made for profile pictures on social networks, websites, team pages and chat apps.",
    "The crop is centered. If your face is off center, crop the picture first with the image cropper."],
    [["Is the background transparent?", "Yes."], ["What if the picture is not square?", "The circle uses the shorter side."], P]],
  ["add-watermark-to-image", "Add Text Watermark to Image", I, "Place a text watermark on a photo, in a corner or tiled across it.", ["add watermark to photo", "watermark image online", "text watermark maker", "protect photo with watermark"], [
    "Type your name or brand, choose the position, size, opacity and color, and see it on the image. Tiled mode repeats the text diagonally across the whole picture.",
    "A watermark discourages casual copying and gives credit if the image is shared. A tiled watermark is harder to crop out than a corner one.",
    "Watermarks do not stop a determined person, so share smaller previews of valuable work."],
    [["Where should the watermark go?", "Corners are less intrusive. Tiled is safer against cropping."], ["Can I use a logo?", "This tool supports text only."], P]],
  ["passport-photo-resizer", "Passport Photo Resizer", I, "Resize a photo to common passport, visa and ID photo sizes.", ["passport photo resizer", "passport size photo maker", "resize photo for visa", "35x45 mm photo online"], [
    "Pick a size such as 35 x 45 mm, 2 x 2 inches or 4 x 6 cm and the tool crops and scales your photo to the exact pixel size at 300 DPI.",
    "Start with a photo that follows the rules: plain light background, face centered, neutral expression. Agencies reject edited or filtered pictures.",
    "Always check the latest requirements of the issuing office, since sizes and background colors vary by country."],
    [["What DPI is used?", "300 DPI, common for printing."], ["Does it change the background?", "No. It only crops and resizes."], P]],
  ["social-media-image-resizer", "Social Media Image Resizer", I, "Resize an image for Instagram, YouTube, Facebook, X, LinkedIn and Pinterest.", ["social media image sizes", "resize image for instagram", "youtube thumbnail resizer", "facebook cover size"], [
    "Choose a platform preset, such as 1080 x 1920 for stories or 1280 x 720 for YouTube thumbnails, and the tool resizes your image to that exact size.",
    "Pick how to fit: fill and crop the edges, fit inside with a background color, or stretch. Fill and crop looks best for photos.",
    "Platform sizes change from time to time, so check the platform if a layout looks off."],
    [["Which fit mode is best?", "Fill and crop for photos, fit inside when nothing may be cut."], ["Is quality lost?", "Large images are scaled down with high quality smoothing."], P]],
  ["compress-image-to-50kb", "Compress Image to 50 KB", I, "Reduce a photo to under 50 KB for forms, profile pictures and uploads.", ["compress image to 50kb", "reduce image size to 50 kb", "jpg under 50kb", "50kb photo resizer"], [
    "Upload a picture and the tool tries different quality levels to reach a file under 50 KB. If that is not enough, it also shrinks the dimensions.",
    "50 KB limits are common on government forms, job portals and exam registrations for photos and signatures.",
    "The result is a JPG. Transparent areas become white."],
    [["Will it be exactly 50 KB?", "It aims just under 50 KB, not above."], ["Why did the size shrink?", "Very large photos need smaller dimensions to fit."], P]],
  ["compress-image-to-100kb", "Compress Image to 100 KB", I, "Reduce a photo to under 100 KB without a visible drop in quality.", ["compress image to 100kb", "reduce image size to 100 kb", "jpg under 100kb", "photo to 100kb"], [
    "Upload a photo and get a JPG under 100 KB. The tool lowers the quality in small steps and finds the highest quality that fits.",
    "100 KB is a common upload limit for application forms, CMS fields and email signature images.",
    "Most photos stay sharp at this size if the dimensions are around 1000 pixels or less."],
    [["Does it keep the dimensions?", "Yes when possible. It shrinks them only if quality changes are not enough."], ["Which formats can I upload?", "Any image your browser can open, such as JPG, PNG and WebP."], P]],
  ["compress-image-to-200kb", "Compress Image to 200 KB", I, "Shrink an image to under 200 KB for web pages and uploads.", ["compress image to 200kb", "reduce image size to 200kb", "jpg under 200kb", "image under 200 kb"], [
    "Upload a photo and the tool finds the best JPG quality under 200 KB.",
    "200 KB is a good size for web page images: fast to load, but still clear on most screens. It also meets many upload limits.",
    "For website use, also check the display size. Serving a 4000 pixel photo in a 600 pixel box wastes data."],
    [["Is 200 KB good for a website?", "Yes, for most content images."], ["Can it handle PNG?", "Yes, it converts the result to JPG."], P]],
  ["image-size-checker", "Image Size Checker", I, "See the pixel size, aspect ratio, megapixels and file size of any image.", ["image size checker", "check image dimensions", "image resolution checker", "image width and height"], [
    "Drop an image to see its width and height in pixels, file size, type, aspect ratio and megapixels. It also shows the print size at 300 DPI.",
    "Use it before uploading to a site with size rules, or to find out whether a photo is large enough to print.",
    "The tool reads the file locally and shows nothing but its properties."],
    [["How large can I print?", "Divide pixels by 300 for inches at good print quality."], ["What is the aspect ratio?", "The ratio of width to height, such as 16:9."], P]],
  ["image-color-picker", "Image Color Picker", I, "Click any point of an image to get its HEX and RGB color code.", ["image color picker", "pick color from image", "get hex code from image", "eyedropper tool online"], [
    "Upload a picture and click on it. The color of that pixel is shown as HEX and RGB, ready to copy.",
    "Designers use it to match a brand color from a logo or photo. Developers use it to take colors from screenshots.",
    "Compression can change colors slightly, so for exact brand values use the source design file."],
    [["Is the color exact?", "It is the exact pixel color of the loaded image."], ["Can I pick from a screenshot?", "Yes, upload it first."], P]],
  ["image-color-palette-extractor", "Image Color Palette Extractor", I, "Extract the main colors from an image as a palette of HEX codes.", ["extract colors from image", "color palette from image", "image palette generator", "dominant colors of image"], [
    "Upload a picture and get up to eight dominant colors with their share of the image. Click a swatch to copy its HEX code.",
    "Use palettes from photos for websites, presentations, interior ideas and branding.",
    "Similar colors are merged so each swatch is clearly different."],
    [["How are colors chosen?", "Pixels are grouped by similar color and ranked by how common they are."], ["Does it include transparent pixels?", "No."], P]],
  ["merge-images", "Merge Images into One", I, "Combine several images into one picture, vertically or side by side.", ["merge images online", "combine images into one", "join photos together", "stitch images vertically"], [
    "Drop two or more images, choose top to bottom or left to right, set a gap and a background color and download one combined PNG.",
    "It is handy for before and after pictures, collages of screenshots and long images for chats and documents.",
    "Images of different sizes are centered in the row or column."],
    [["Can I add more images later?", "Yes, drop more files."], ["Is the order the upload order?", "Yes."], P]],
  ["svg-to-png-converter", "SVG to PNG Converter", I, "Convert SVG code or files to PNG at up to 8x resolution.", ["svg to png", "convert svg to png online", "svg to png transparent", "svg to image"], [
    "Upload an SVG or paste its code, choose a scale from 1x to 8x and a transparent or white background, then download a PNG.",
    "PNG works where SVG is not accepted, such as some social platforms, documents and email clients.",
    "The SVG needs width and height or a viewBox. External fonts and linked images inside the SVG may not render."],
    [["Does it keep transparency?", "Yes, with the transparent background option."], ["Why is my text missing?", "Fonts are not embedded in SVG files. Convert text to paths first."], P]],
  ["remove-exif-data-from-image", "Remove EXIF Data from Image", I, "Strip GPS location, camera details and other metadata from a photo.", ["remove exif data", "remove metadata from photo", "strip gps from image", "exif remover online"], [
    "Photos from phones can hide the exact location, date and device. Upload a picture and the tool saves a clean copy without that data.",
    "It works by redrawing the picture to a new file in your browser, so none of the original metadata is carried over.",
    "JPG output is saved at 95 percent quality. Color profiles are dropped too, which can slightly change colors on some screens."],
    [["What is EXIF?", "Hidden data in a photo, like GPS position, camera model and time."], ["Is the image changed?", "The pixels are the same, but the JPG is re-encoded."], P]],
  ["delete-pdf-pages", "Delete Pages from PDF", D, "Remove unwanted pages from a PDF online.", ["delete pages from pdf", "remove pages from pdf", "remove page from pdf free", "pdf page remover"], [
    "Upload a PDF, type the pages to delete, such as 2,4-6, and download the file without them.",
    "Use it to cut blank pages, cover sheets or private pages before you send a document.",
    "The other pages are copied as they are, with text and images unchanged."],
    [["How do I list pages?", "Use commas and ranges, such as 1,3,5-8."], ["Can I undo it?", "Keep the original file. The tool makes a new one."], P]],
  ["extract-pdf-pages", "Extract Pages from PDF", D, "Save selected pages of a PDF as a new PDF.", ["extract pages from pdf", "save part of pdf", "pdf page extractor", "get pages from pdf"], [
    "Enter the pages you want to keep, such as 1-3,8, and get a new PDF containing only those pages in order.",
    "It helps when you need one chapter, a single invoice from a bundle or a form page from a long document.",
    "To split a file into many parts, use the split PDF tool."],
    [["Does the order stay?", "Pages appear in numeric order."], ["What about bookmarks?", "Outlines and links to removed pages are not kept."], P]],
  ["reverse-pdf-pages", "Reverse PDF Pages", D, "Reverse the order of all pages in a PDF.", ["reverse pdf pages", "reverse pdf order", "flip page order pdf", "reverse pdf online"], [
    "Upload a PDF and the last page becomes the first. Useful for scans made in the wrong order and for printing in reverse.",
    "The tool changes the order only. It does not rotate pages or change their contents.",
    "For a custom order, extract pages in separate steps and merge them."],
    [["Does it change quality?", "No."], ["Can I reverse only some pages?", "Not with this tool. It reverses the entire document."], P]],
  ["add-watermark-to-pdf", "Add Watermark to PDF", D, "Stamp a text watermark such as CONFIDENTIAL on every PDF page.", ["add watermark to pdf", "pdf watermark online", "stamp text on pdf", "confidential watermark pdf"], [
    "Enter your text, choose size, opacity and angle, and the watermark is added to every page.",
    "Watermarks mark a draft, label a document as confidential or show who received a copy.",
    "The built in font supports English letters, digits and common symbols. Arabic and other scripts are not supported yet."],
    [["Can the watermark be removed?", "An editor can remove it, so it is a label, not protection."], ["Is the text behind the content?", "It is drawn on top with transparency."], P]],
  ["add-blank-page-to-pdf", "Add Blank Page to PDF", D, "Insert one or more blank pages into a PDF at any position.", ["add blank page to pdf", "insert blank page pdf", "add empty page to pdf"], [
    "Choose after which page to insert the blank page, 0 for the start, and how many pages to add. The blank page uses the size of the neighboring page.",
    "Useful for double sided printing, chapter breaks and extra note space.",
    "The rest of the document stays the same."],
    [["Can I add it at the end?", "Yes. Enter the last page number."], ["Which size is used?", "The size of the page before the insert point."], P]],
  ["crop-pdf-margins", "Crop PDF Margins", D, "Trim white margins from every page of a PDF.", ["crop pdf", "crop pdf margins", "remove margins from pdf", "trim pdf pages"], [
    "Set the top, bottom, left and right margin in millimeters to remove from every page. The visible area is cropped.",
    "It helps with scanned pages that have wide borders, or slides you want to read on a small screen.",
    "Cropping hides the outer area. The content is still inside the file, so it is not a redaction tool."],
    [["Is cropped content deleted?", "No. It is only hidden by the crop box."], ["Can I set margins per page?", "No. They apply to all pages."], P]],
  ["pdf-metadata-editor", "PDF Metadata Editor", D, "View and edit the title, author, subject and keywords of a PDF.", ["pdf metadata editor", "edit pdf properties", "change pdf author", "pdf title editor"], [
    "Upload a PDF to see its title, author, subject, keywords, creator and producer. Edit any field and save a new file.",
    "A clear title helps search and shows in the browser tab. Cleaning author names is useful before you share a file publicly.",
    "Some programs store extra XMP metadata that this tool does not change."],
    [["Does it change the content?", "No. Only the document information fields."], ["Can I remove the author?", "Yes, empty the field and apply."], P]],
  ["pdf-page-counter", "PDF Page Counter", D, "Count the pages of a PDF and see its page size.", ["pdf page counter", "count pages in pdf", "how many pages is my pdf", "pdf page size checker"], [
    "Drop a PDF to see its number of pages, the paper size (A4, Letter or custom) and the average size per page.",
    "It is useful before printing, checking upload limits and filling forms that ask for the page count.",
    "The page size shown comes from the first page."],
    [["Which sizes are detected?", "A3, A4, A5, Letter and Legal."], ["Does it work on large files?", "Yes, as long as your browser can load it."], P]],
];

export const wave4Tools: ToolMeta[] = SPECS.map(([slug, title, category, desc, keywords, paras, faqs]) => ({
  slug, title, shortDescription: desc, metaDescription: desc.length > 158 ? desc.slice(0, 155) + "..." : desc, category, keywords,
  componentKey: `Pop:${slug}`, article: paras.join("\n\n"), faqs: faqs.map(([q, a]) => ({ q, a })),
}));
