export type Project = {
  slug: string;
  name: string;
  date: string;
  src: string;
  span: string;
  aspect: string;
  services: string;
  overview: string;
  images: string[];
};

export const projects: Project[] = [
  {
    slug: 'hilary-eden',
    name: 'Hilary Eden',
    date: '12 Oct 2025',
    src: 'https://picsum.photos/seed/p1/1600/900',
    span: 'col-span-12 md:col-span-5',
    aspect: 'aspect-[4/3]',
    services: 'Web Design / Web Development',
    overview: 'Hilary Eden approached us to redesign their digital presence with a focus on modern, intuitive user experiences and performant tech stacks. The result is a quiet, confident digital space that lets the products speak.',
    images: Array.from({ length: 6 }).map((_, i) => `https://picsum.photos/seed/p1-${i}/800/600`),
  },
  {
    slug: 'jump-factory',
    name: 'Jump Factory',
    date: '04 Nov 2025',
    src: 'https://picsum.photos/seed/p2/1600/900',
    span: 'col-span-12 md:col-span-3',
    aspect: 'aspect-[3/4]',
    services: 'Brand Identity / Product Design',
    overview: 'For Jump Factory, we crafted a unique brand identity and translated it into a cohesive product design system that spans both digital and physical touchpoints.',
    images: Array.from({ length: 6 }).map((_, i) => `https://picsum.photos/seed/p2-${i}/800/600`),
  },
  {
    slug: 'adcker',
    name: 'Adcker',
    date: '22 Jan 2026',
    src: 'https://picsum.photos/seed/p3/1600/900',
    span: 'col-span-12 md:col-span-4',
    aspect: 'aspect-[4/5]',
    services: 'SaaS / Marketing Site',
    overview: 'For Adcker, a marketing analytics SaaS, we designed a conversion-focused landing page that clearly communicates complex technical benefits.',
    images: Array.from({ length: 6 }).map((_, i) => `https://picsum.photos/seed/p3-${i}/800/600`),
  },
  {
    slug: 'jochi-labs',
    name: 'Jochi Labs',
    date: '15 Feb 2026',
    src: 'https://picsum.photos/seed/p4/1600/900',
    span: 'col-span-12 md:col-span-4',
    aspect: 'aspect-square',
    services: 'Web Design / Motion Graphics',
    overview: 'Jochi Labs required a bold, forward-looking website. We integrated heavy motion graphics to communicate their innovative approach to marketing.',
    images: Array.from({ length: 6 }).map((_, i) => `https://picsum.photos/seed/p4-${i}/800/600`),
  },
  {
    slug: 'sonder',
    name: 'Sonder',
    date: '03 Mar 2026',
    src: 'https://picsum.photos/seed/p5/1600/900',
    span: 'col-span-12 md:col-span-4',
    aspect: 'aspect-[4/5]',
    services: 'Web Development / Digital Strategy',
    overview: 'We built a robust digital strategy for Sonder, accompanied by a custom-developed web application that streamlines their operations.',
    images: Array.from({ length: 6 }).map((_, i) => `https://picsum.photos/seed/p5-${i}/800/600`),
  },
  {
    slug: 'marianna-von-fedak',
    name: 'Marianna Von Fedak',
    date: '19 Apr 2026',
    src: 'https://picsum.photos/seed/p6/1600/900',
    span: 'col-span-12 md:col-span-4',
    aspect: 'aspect-[4/3]',
    services: 'Portfolio / Personal Branding',
    overview: 'A sleek, minimalist portfolio for photographer Marianna, designed to let stunning visual work take center stage without distractions.',
    images: Array.from({ length: 6 }).map((_, i) => `https://picsum.photos/seed/p6-${i}/800/600`),
  },
  {
    slug: 'farah-gorayeb',
    name: 'Farah Gorayeb',
    date: '08 May 2026',
    src: 'https://picsum.photos/seed/p7/1600/900',
    span: 'col-span-12 md:col-span-6',
    aspect: 'aspect-square',
    services: 'Web App / UI/UX',
    overview: 'Farah Gorayeb needed a next-gen fitness app. We handled the complete UI/UX design and frontend development to create a highly engaging user experience.',
    images: Array.from({ length: 6 }).map((_, i) => `https://picsum.photos/seed/p7-${i}/800/600`),
  },
  {
    slug: 'newol',
    name: 'Newol',
    date: '27 Jun 2026',
    src: 'https://picsum.photos/seed/p8/1600/900',
    span: 'col-span-12 md:col-span-6',
    aspect: 'aspect-video',
    services: 'E-commerce / Art Direction',
    overview: 'Newol needed an e-commerce platform that felt as luxurious as their products. We delivered an art-directed experience with seamless purchasing flows.',
    images: Array.from({ length: 6 }).map((_, i) => `https://picsum.photos/seed/p8-${i}/800/600`),
  },
];
