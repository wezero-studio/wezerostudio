export type Project = {
  slug: string;
  name: string;
  date: string;
  src: string;
  heroSmall: string;
  span: string;
  aspect: string;
  services: string;
  overview: string;
  images: string[];
  last?: string;
  zoomSlots?: number[];
  imgStyles?: Record<number, { transform?: string; transformOrigin?: string; objectPosition?: string }>;
  zoomLast?: boolean;
  url?: string;
};

export const projects: Project[] = [
  {
    slug: 'interraform',
    name: 'Interraform',
    date: '15 Jun 2026',
    src: '/images/interraform/hero.webp',
    heroSmall: '/images/interraform/herosmall.webp',
    span: 'col-span-12 md:col-span-5',
    aspect: 'aspect-[4/3]',
    services: 'Brand Identity / Web Design',
    overview: 'Interraform designs interiors that linger. They needed a digital presence as considered as the spaces they build — editorial in feel, refined in detail, and visual-first. We built a site where the work speaks and nothing else gets in the way.',
    images: [
      '/images/interraform/Screenshot 2026-06-27 011642.webp',
      '/images/interraform/Screenshot 2026-06-27 011702.webp',
      '/images/interraform/Screenshot 2026-06-27 011724.webp',
      '/images/interraform/Screenshot 2026-06-27 011744.webp',
      '/images/interraform/Screenshot 2026-06-27 011840.webp',
      '/images/interraform/Screenshot 2026-06-27 011853.webp',
      '/images/interraform/Screenshot 2026-06-27 011932.webp',
      '/images/interraform/2nd last.png',
    ],
    last: '/images/interraform/last.png',
    url: 'https://c72cff65.interraform.pages.dev/',
  },
  {
    slug: 'aliandashford',
    name: 'Ali & Ashford',
    date: '01 Jun 2026',
    src: '/images/aliandashford/hero.webp',
    heroSmall: '/images/aliandashford/herosmall.webp',
    span: 'col-span-12 md:col-span-7',
    aspect: 'aspect-[4/3]',
    services: 'Web Design / Legal Branding',
    overview: 'Ali & Ashford deliver elite paralegal support to clients navigating complex legal ground. They needed a website that projected authority and precision — not a brochure, but a statement. We built a presence that earns trust before the first conversation.',
    images: [
      '/images/aliandashford/Screenshot 2026-06-26 185436.webp',
      '/images/aliandashford/Screenshot 2026-06-26 185538.webp',
      '/images/aliandashford/Screenshot 2026-06-26 185553.webp',
      '/images/aliandashford/4.png',
      '/images/aliandashford/Screenshot 2026-06-26 185641.webp',
      '/images/aliandashford/6.png',
      '/images/aliandashford/Screenshot 2026-06-26 185709.webp',
      '/images/aliandashford/2nd last.png',
    ],
    last: '/images/aliandashford/last.png',
    url: 'https://stuartandali.pages.dev/',
    zoomSlots: [4],
    imgStyles: { 7: { transform: 'translateY(15px) scale(1.2)', transformOrigin: 'center top' } },
  },
  {
    slug: 'exerra',
    name: 'Exerra',
    date: '12 Jun 2026',
    src: '/images/exerra/hero.png',
    heroSmall: '/images/exerra/hero.png',
    span: 'col-span-12 md:col-span-4',
    aspect: 'aspect-[4/5]',
    services: 'Web Development / Motion Design',
    overview: 'Exerra is an independent digital agency covering full-stack development, cloud infrastructure, and everything in between. They wanted a site that felt built, not templated — technically sharp, motion-rich, and aimed squarely at other builders. We made it.',
    images: [
      '/images/exerra/Screenshot 2026-06-27 012245.webp',
      '/images/exerra/2nd.png',
      '/images/exerra/Screenshot 2026-06-27 012351.webp',
      '/images/exerra/Screenshot 2026-06-27 012418.webp',
      '/images/exerra/Screenshot 2026-06-27 012429.webp',
      '/images/exerra/Screenshot 2026-06-27 012440.webp',
      '/images/exerra/Screenshot 2026-06-27 012453.webp',
      '/images/exerra/2nd last.png',
    ],
    last: '/images/exerra/last.png',
    url: 'https://exerraai.com/',
    zoomSlots: [7],
    imgStyles: { 2: { transform: 'translateY(18px) scale(1.2)', transformOrigin: 'center top' } },
  },
  {
    slug: 'miya',
    name: 'Miya',
    date: '27 Jun 2026',
    src: '/images/miya/hero.webp',
    heroSmall: '/images/miya/herosmall.webp',
    span: 'col-span-12 md:col-span-4',
    aspect: 'aspect-[4/3]',
    services: 'Web Design / Web Development',
    overview: 'Miya helps students find and secure scholarships they would otherwise miss. The platform needed to feel approachable without being lightweight — clear paths, fast load times, and a tone that respects the stakes. We built something students actually come back to.',
    images: [
      '/images/miya/Screenshot 2026-06-27 011145.webp',
      '/images/miya/Screenshot 2026-06-27 011203.webp',
      '/images/miya/Screenshot 2026-06-27 011222.webp',
      '/images/miya/Screenshot 2026-06-27 011238.webp',
      '/images/miya/Screenshot 2026-06-27 011311.webp',
      '/images/miya/Screenshot 2026-06-27 011405.webp',
      '/images/miya/Screenshot 2026-06-27 011447.webp',
      '/images/miya/2nd last.png',
    ],
    last: '/images/miya/last.png',
    url: 'https://feb4e127.miyainternational.pages.dev/',
    zoomSlots: [7],
  },
  {
    slug: 'aamml',
    name: 'Aamml',
    date: '08 Jun 2026',
    src: '/images/aamml/hero.webp',
    heroSmall: '/images/aamml/herosmall.webp',
    span: 'col-span-12 md:col-span-4',
    aspect: 'aspect-[4/5]',
    services: 'Web Design / Brand Strategy',
    overview: 'AAMML Holdings is a private venture platform built for serious founders. They needed a website with institutional weight — no clutter, no noise, just a direct statement of intent. We kept it lean and made every word count.',
    images: [
      '/images/aamml/Screenshot 2026-06-27 012648.webp',
      '/images/aamml/Screenshot 2026-06-27 012703.webp',
      '/images/aamml/Screenshot 2026-06-27 012726.webp',
      '/images/aamml/Screenshot 2026-06-27 012739.webp',
      '/images/aamml/Screenshot 2026-06-27 012758.webp',
      '/images/aamml/Screenshot 2026-06-27 012937.webp',
      '/images/aamml/Screenshot 2026-06-27 012953.webp',
      '/images/aamml/2nd last.png',
    ],
    last: '/images/aamml/last.webp',
    url: 'https://aamml-holdings.com/',
    zoomLast: true,
  },
];
