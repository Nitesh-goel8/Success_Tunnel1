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
    title: 'GST Basics for Students and Beginners',
    slug: 'gst-basics-students-beginners',
    contentType: 'Course',
    category: 'Taxation',
    excerpt: 'A beginner-friendly course path that explains GST in simple steps.',
    body: 'This dummy course structure can later be replaced with lessons, chapters, assignments, and downloadable resources.',
    ctaLabel: 'Open course',
    isFeatured: true,
  },
  {
    title: 'Income Tax Revision Notes',
    slug: 'income-tax-revision-notes',
    contentType: 'Note',
    category: 'Revision',
    excerpt: 'Short notes for exam prep, quick revision, and classroom reference.',
    body: 'Use this area for chapter notes, formula sheets, or summaries that students can read quickly.',
    ctaLabel: 'Read notes',
  },
  {
    title: 'Tally Practice Video',
    slug: 'tally-practice-video',
    contentType: 'Video',
    category: 'Software',
    excerpt: 'A direct-file video lesson for practical accounting workflows.',
    body: 'This can point to an MP4 file stored in your public folder or external storage.',
    assetUrl: '/videos/tally-practice.mp4',
    ctaLabel: 'Watch video',
  },
  {
    title: 'EMI Calculator',
    slug: 'emi-calculator',
    contentType: 'Calculator',
    category: 'Tools',
    excerpt: 'A simple calculator landing page for students and visitors.',
    body: 'This can later connect to a real calculator UI, lead form, or external tool.',
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
    excerpt: 'A downloadable study planner template for students.',
    body: 'This placeholder can later point to a PDF, worksheet, or handout.',
    assetUrl: '/downloads/study-planner.pdf',
    ctaLabel: 'Download PDF',
  },
] as const
