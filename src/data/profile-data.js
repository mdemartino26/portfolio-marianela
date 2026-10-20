// All the professional content of the site, taken from the CV.
// Fields with { es, en } are bilingual. Edit here to update the site.
export const profile = {
  name: 'Marianela De Martino',
  location: 'CABA, Argentina',
  email: 'm.demartino99@gmail.com',

  // TODO: paste your URLs. Empty ones are hidden.
  links: {
    github: '',
    linkedin: '',
    behance: '',
  },

  role: {
    es: 'Desarrolladora Frontend · UX/UI · Estudiante de Analista de Sistemas',
    en: 'Frontend Developer · UX/UI · Systems Analyst student',
  },

  bio: [
    {
      es: 'Soy estudiante de Analista de Sistemas y Desarrolladora Frontend, con una base sólida en diseño UX/UI y coordinación de proyectos digitales.',
      en: "I'm a Systems Analyst student and Frontend Developer with a solid background in UX/UI design and digital project coordination.",
    },
    {
      es: 'Desarrollo aplicaciones web responsivas con JavaScript (ES6+), React y arquitecturas basadas en componentes. Además enseño desarrollo frontend y React Native en Digital House.',
      en: 'I build responsive web apps with JavaScript (ES6+), React and component-based architectures. I also teach frontend development and React Native at Digital House.',
    },
  ],

  award: {
    es: '2.º puesto · UX Challenge — Proyecto GreenMint',
    en: '2nd place · UX Challenge — GreenMint project',
  },

  languages: [
    { es: 'Inglés · C2', en: 'English · C2' },
    { es: 'Español · Nativo', en: 'Spanish · Native' },
    { es: 'Chino · Básico', en: 'Chinese · Basic' },
    { es: 'Coreano · Básico', en: 'Korean · Basic' },
  ],

  skills: [
    {
      group: { es: 'Desarrollo', en: 'Development' },
      items: ['JavaScript', 'React.js', 'React Native', 'HTML', 'CSS'],
    },
    {
      group: { es: 'Sistemas', en: 'Systems' },
      items: ['Java', 'SQL', 'Firebase'],
    },
    {
      group: { es: 'Diseño y herramientas', en: 'Design & tools' },
      items: ['Figma', 'Illustrator', 'Photoshop', 'Git', 'Notion'],
    },
    {
      group: { es: 'Gestión', en: 'Management' },
      items: [
        { es: 'Planificación de proyectos', en: 'Project planning' },
        { es: 'Comunicación efectiva', en: 'Clear communication' },
        { es: 'Mentoría técnica', en: 'Technical mentoring' },
      ],
    },
  ],

  // "current: true" shows "Present". "end" is optional.
  experience: [
    {
      role: {
        es: 'Profesora · Desarrollo Frontend & Programación Web',
        en: 'Professor · Frontend Development & Web Programming',
      },
      company: 'Digital House',
      start: { es: 'Jul 2026', en: 'Jul 2026' },
      current: true,
      points: [
        {
          es: 'Dicto clases y llevo adelante el plan de estudio de programas de desarrollo web.',
          en: 'I teach classes and run the curriculum of web development programs.',
        },
        {
          es: 'Evalúo entregas y sigo el progreso técnico de cada estudiante.',
          en: "I review assignments and track each student's technical progress.",
        },
        {
          es: 'Enseño arquitectura de componentes y desarrollo mobile con React Native.',
          en: 'I teach component architecture and mobile development with React Native.',
        },
      ],
    },
    {
      role: { es: 'Ejecutiva de Cuentas', en: 'Account Executive' },
      company: 'Agencia Micó',
      start: { es: 'Ago 2024', en: 'Aug 2024' },
      current: true,
      points: [
        {
          es: 'Coordino el trabajo entre los equipos creativos y los clientes.',
          en: 'I coordinate the work between creative teams and clients.',
        },
        {
          es: 'Hago seguimiento de objetivos y gestiono campañas digitales.',
          en: 'I track goals and manage digital campaigns.',
        },
      ],
    },
    {
      role: { es: 'Profesora Adjunta · UX/UI & Frontend', en: 'Teaching Assistant · UX/UI & Frontend' },
      company: 'Digital House',
      start: { es: 'Ago 2024', en: 'Aug 2024' },
      end: { es: 'Jul 2026', en: 'Jul 2026' },
      points: [
        {
          es: 'Acompañé a estudiantes en cursos de desarrollo frontend y de diseño UX/UI.',
          en: 'I supported students in frontend development and UX/UI design courses.',
        },
        {
          es: 'Acompañé proyectos de diseño centrado en el usuario y prototipado en Figma.',
          en: 'I supported user-centered design projects and Figma prototyping.',
        },
        {
          es: 'Di feedback sobre usabilidad y arquitectura de información.',
          en: 'I gave feedback on usability and information architecture.',
        },
      ],
    },
    {
      role: { es: 'Especialista en E-commerce y Community Manager', en: 'E-commerce Specialist & Community Manager' },
      company: 'Farmacia Daneri / Pininfarina Segno',
      start: { es: '2022', en: '2022' },
      end: { es: '2024', en: '2024' },
      points: [
        {
          es: 'Gestioné plataformas de venta (Tiendanube, Mercado Libre) y sitios en WordPress.',
          en: 'I managed sales platforms (Tiendanube, Mercado Libre) and WordPress sites.',
        },
      ],
    },
  ],

  education: [
    {
      title: { es: 'Analista de Sistemas', en: 'Systems Analyst' },
      place: 'Escuela Da Vinci',
      status: { es: 'En curso', en: 'In progress' },
    },
    {
      title: { es: 'Licenciatura en Tecnología Multimedia', en: "Bachelor's in Multimedia Technology" },
      place: 'Universidad Maimónides',
      status: { es: '2025', en: '2025' },
    },
    {
      title: { es: 'Desarrollo Web, JavaScript y React', en: 'Web Development, JavaScript & React' },
      place: 'Coderhouse',
      status: { es: '2024', en: '2024' },
    },
  ],
};
