import type { CategoryKey, ToolMeta } from "../types";

type Spec = [string, string, string, string, string[], string[], [string, string][]];
const SPECS: Spec[] = [
 [
  "resume-builder",
  "Free Resume Builder (PDF, No Signup)",
  "text-tools",
  "Build a resume and download it as a PDF for free, with no watermark, no trial and no account.",
  [
   "free resume builder",
   "resume builder no sign up",
   "resume maker pdf free download"
  ],
  [
   "Fill in your contact details, summary, experience, education and skills. The tool lays them out as a clean single-column resume that works well with applicant tracking systems, and you download it as a PDF, HTML or text file.",
   "Many resume sites let you build for free and then ask for a paid trial before you can download the PDF. This one has no paywall, no watermark and no account. Your details never leave your browser.",
   "Start each experience line with the job title, company and dates separated by a bar, then add bullet points that start with a dash. Keep it to one page where you can, and use numbers to show results."
  ],
  [
   [
    "Is the PDF really free?",
    "Yes. There is no trial, watermark or signup."
   ],
   [
    "Is the layout ATS friendly?",
    "Yes. It is plain text in one column, with no tables or images that confuse parsers."
   ],
   [
    "Is my data saved?",
    "No. It stays in your browser and is gone when you close the tab."
   ]
  ]
 ],
 [
  "invoice-generator",
  "Free Invoice Generator (No Watermark)",
  "finance",
  "Create a professional invoice with tax and discount and download it as a PDF, free and with no signup.",
  [
   "free invoice generator",
   "invoice maker no signup",
   "invoice pdf generator no watermark"
  ],
  [
   "Enter your business and client details, add line items with quantity and price, and set tax and discount. The totals update as you type, and you download the invoice as a PDF.",
   "Free invoice makers often add a watermark or limit how many invoices you can send each month. This one has no limits and no account, and it runs fully in your browser.",
   "Use a running invoice number, state the due date and add payment details in the notes. Check local rules for what an invoice must show, such as a tax or VAT number."
  ],
  [
   [
    "Is there a watermark?",
    "No."
   ],
   [
    "Can I use any currency?",
    "Yes. Type any currency symbol."
   ],
   [
    "Does it store my invoices?",
    "No. Nothing is saved or uploaded."
   ]
  ]
 ],
 [
  "mock-data-generator",
  "Mock Data Generator (JSON, CSV, SQL)",
  "developer-tools",
  "Generate up to 200,000 rows of fake test data as JSON, CSV or SQL INSERT statements.",
  [
   "mock data generator",
   "fake data generator",
   "random test data json csv sql"
  ],
  [
   "Pick the fields you need, such as names, emails, cities, prices and dates, choose how many rows, and pick JSON, CSV or SQL INSERT output. Copy it or download the file.",
   "Some popular generators cap the free plan at 1,000 rows per file. This one runs in your browser with a limit of 200,000 rows and no daily limit.",
   "The data is random and fake. Do not use the emails or phone numbers to contact anyone. For repeatable data in tests, save the file and reuse it."
  ],
  [
   [
    "Is the data real?",
    "No. It is random and made up."
   ],
   [
    "How many rows can I make?",
    "Up to 200,000 in one go."
   ],
   [
    "Does it call a server?",
    "No. It runs in your browser."
   ]
  ]
 ],
 [
  "sign-pdf-online",
  "Sign PDF Online Free (No Limits)",
  "pdf-tools",
  "Draw your signature and place it on any page of a PDF, then download it. Free, unlimited, private.",
  [
   "sign pdf online free",
   "sign pdf without account",
   "electronic signature pdf free"
  ],
  [
   "Upload a PDF, draw your signature with a mouse or finger, then click on the page where it should go. You can add it more than once, on any page, then download the signed PDF.",
   "Big PDF sites limit free users to a couple of tasks per day. This tool has no limit, and your file is never uploaded, because everything runs in your browser.",
   "This adds an image of your signature to the file. It is not a certificate based digital signature, which some contracts require. Check what the other party accepts."
  ],
  [
   [
    "Is my PDF uploaded?",
    "No. It stays on your device."
   ],
   [
    "Is it legally valid?",
    "Simple electronic signatures are accepted for many documents, but check your local rules and the receiver's needs."
   ],
   [
    "Can I sign several pages?",
    "Yes."
   ]
  ]
 ],
 [
  "add-text-to-pdf",
  "Add Text to PDF (Fill Forms Online)",
  "pdf-tools",
  "Click anywhere on a PDF to type text on it. Fill in forms and add dates or notes, then download.",
  [
   "add text to pdf",
   "fill pdf form online free",
   "write on pdf"
  ],
  [
   "Upload a PDF, type the text you want, set a size, and click on the page where it should appear. Repeat for each field, then download the PDF with the text added.",
   "It is the quickest way to fill in a flat form that has no fillable fields, such as a scanned application or a printed template.",
   "The text is added as normal page text in Helvetica. Letters outside the Latin alphabet, such as Arabic, are not supported in this version."
  ],
  [
   [
    "Does it work on scanned PDFs?",
    "Yes, you place text on top of the page image."
   ],
   [
    "Is my file private?",
    "Yes. Nothing is uploaded."
   ],
   [
    "Can I undo?",
    "Yes, use the Undo button before saving."
   ]
  ]
 ],
 [
  "image-to-text-ocr",
  "Image to Text (Free OCR, No Limits)",
  "image-tools",
  "Extract text from a photo or screenshot in your browser. Supports Arabic, English and many more languages.",
  [
   "image to text",
   "ocr online free",
   "extract text from image"
  ],
  [
   "Choose the language in the picture, drop in an image or screenshot, and the tool reads the text and shows it so you can copy it or save it as a text file.",
   "Online OCR services usually cap the free plan at a handful of requests per month. This tool runs the open source Tesseract engine in your browser, so the image is not uploaded and there is no cap.",
   "Results are best with sharp, straight, high contrast images. The language data is downloaded the first time you use a language, so the first run is slower."
  ],
  [
   [
    "Does it read Arabic?",
    "Yes, choose Arabic as the language."
   ],
   [
    "Is the image uploaded?",
    "No. It is processed on your device."
   ],
   [
    "Why is the first run slow?",
    "The language data file is downloaded once."
   ]
  ]
 ],
 [
  "heic-to-jpg-converter",
  "HEIC to JPG Converter (Unlimited, Private)",
  "image-tools",
  "Convert iPhone HEIC photos to JPG or PNG in your browser. Many files at once, no daily limit.",
  [
   "heic to jpg",
   "convert heic to jpg free",
   "iphone photo converter"
  ],
  [
   "Drop in one or many HEIC photos, pick JPG or PNG, and download each file or all of them as a ZIP. The conversion happens on your device.",
   "iPhones save photos as HEIC, which many apps and websites do not accept. Some converters allow only a few files a day. This one has no limit and never uploads your photos.",
   "JPG is smaller and works everywhere. Pick PNG if you need lossless output, but expect bigger files."
  ],
  [
   [
    "Is there a file limit?",
    "No limit, though very large batches depend on your device memory."
   ],
   [
    "Are my photos uploaded?",
    "No."
   ],
   [
    "Is EXIF data kept?",
    "Location and camera data may be dropped in the converted file."
   ]
  ]
 ],
 [
  "mermaid-diagram-editor",
  "Mermaid Diagram Editor (Free, Export SVG/PNG)",
  "developer-tools",
  "Write Mermaid code and see flowcharts, sequence diagrams and Gantt charts live. Export SVG or PNG.",
  [
   "mermaid live editor",
   "flowchart maker online free",
   "mermaid diagram online"
  ],
  [
   "Type Mermaid code on the left and the diagram appears on the right. Start from a template for a flowchart, sequence diagram, Gantt chart, pie chart or class diagram, then download it as SVG or PNG.",
   "Hosted diagram apps often limit free accounts to a few diagrams. This editor has no account and no limit, and it renders in your browser.",
   "If the preview shows an error, check the first line for the diagram type and look for missing arrows or brackets. Mermaid code is plain text, so you can keep it in your repo."
  ],
  [
   [
    "Do I need an account?",
    "No."
   ],
   [
    "Can I export an image?",
    "Yes, SVG and PNG."
   ],
   [
    "Is my diagram uploaded?",
    "No."
   ]
  ]
 ]
];

export const wave7Tools: ToolMeta[] = SPECS.map(([slug, title, category, desc, keywords, paras, faqs]) => ({
  slug, title, shortDescription: desc, metaDescription: desc.length > 158 ? desc.slice(0, 155) + "..." : desc, category: category as CategoryKey, keywords,
  componentKey: `Pop:${slug}`, article: paras.join("\n\n"), faqs: faqs.map(([q, a]) => ({ q, a })),
}));
