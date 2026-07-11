export const EDUCATION_CONTENT_TYPES = [
  'Course',
  'Note',
  'Video',
  'Tool',
  'Download',
  'Guide',
  'Calculator',
  'Quiz',
] as const

export type EducationContentType = (typeof EDUCATION_CONTENT_TYPES)[number]

export const EDUCATION_CONTENT_LABELS: Record<string, string> = {
  Course: 'Courses',
  Note: 'Notes',
  Video: 'Videos',
  Tool: 'Tools',
  Download: 'Downloads',
  Guide: 'Guides',
  Calculator: 'Calculators',
  Quiz: 'Quizzes',
}

export const EDUCATION_CONTENT_DESCRIPTIONS: Record<string, string> = {
  Course: 'Structured classes and guided learning tracks.',
  Note: 'Concise study notes, revision sheets, and summaries.',
  Video: 'Direct-file learning videos and recordings.',
  Tool: 'Interactive helpers for study or decision making.',
  Download: 'PDFs, checklists, templates, and handouts.',
  Guide: 'Long-form learning guides and how-to articles.',
  Calculator: 'SEO-friendly tools, estimators, and simple calculators.',
  Quiz: 'Quick knowledge checks and practice tests.',
}

export const EDUCATION_FALLBACK_CONTENT = [
  {
    title: 'GST Starter Course',
    slug: 'gst-basics-students-beginners',
    contentType: 'Course',
    category: 'Taxation',
    excerpt: 'A beginner-friendly course path for first-time learners.',
    body: 'Use this for lessons, chapters, assignments, and notes.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format&fit=crop',
    ctaLabel: 'Open course',
    isFeatured: true,
  },
  {
    title: 'Income Tax Notes',
    slug: 'income-tax-revision-notes',
    contentType: 'Note',
    category: 'Revision',
    excerpt: 'Short revision notes for quick reading.',
    body: 'Place formula sheets, summaries, and key points here.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1200&auto=format&fit=crop',
    ctaLabel: 'Read notes',
  },
  {
    title: 'Tally Practice Class',
    slug: 'tally-practice-video',
    contentType: 'Video',
    category: 'Software',
    excerpt: 'A practical lesson for accounting workflows.',
    body: 'This can point to a direct MP4 file or storage URL.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop',
    assetUrl: '/videos/tally-practice.mp4',
    ctaLabel: 'Watch video',
  },
  {
    title: 'EMI Calculator',
    slug: 'emi-calculator',
    contentType: 'Calculator',
    category: 'Tools',
    excerpt: 'A simple calculator page for students and visitors.',
    body: 'Connect this to a calculator UI or an external tool later.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=1200&auto=format&fit=crop',
    externalUrl: '/resources/calculators',
    ctaLabel: 'Use tool',
    showOnHomePopup: true,
    isFeatured: true,
  },
  {
    title: 'Study Planner PDF',
    slug: 'study-planner-pdf',
    contentType: 'Download',
    category: 'Downloads',
    excerpt: 'A downloadable planner template for students.',
    body: 'This can point to a PDF, worksheet, or handout.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=1200&auto=format&fit=crop',
    assetUrl: '/downloads/study-planner.pdf',
    ctaLabel: 'Download PDF',
  },
] as const
