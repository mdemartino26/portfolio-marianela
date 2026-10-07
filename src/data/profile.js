// Datos profesionales. Es la única fuente para las páginas Sobre mí, CV,
// Contacto y para el PDF del CV. Los campos { es, en } son bilingües.
export const profile = {
  name: 'Marianela De Martino',

  // TODO: completar con tu correo (lo usan el formulario de contacto y el PDF).
  email: '',

  // Dejá en '' los que no quieras mostrar.
  links: {
    linkedin: '',
    github: '',
    behance: '',
  },

  role: {
    es: 'Desarrolladora Frontend & Diseñadora Multimedia',
    en: 'Frontend Developer & Multimedia Designer',
  },

  tagline: {
    es: 'Desarrolladora Frontend, estudiante de Analista de Sistemas en Escuela Da Vinci y Licenciada en Tecnología Multimedia por la Universidad Maimónides.',
    en: 'Frontend Developer, Systems Analyst student at Escuela Da Vinci and Multimedia Technology graduate from Universidad Maimónides.',
  },

  bio: [
    {
      es: 'Combino desarrollo frontend y diseño multimedia para crear interfaces claras, accesibles y con carácter. Mi formación une la Licenciatura en Tecnología Multimedia con la carrera de Analista de Sistemas, que curso actualmente.',
      en: "I combine frontend development and multimedia design to build clear, accessible interfaces with character. My background brings together a degree in Multimedia Technology and the Systems Analyst program I'm currently studying.",
    },
    {
      es: 'Enseño tecnologías frontend y UX/UI en Digital House, y antes trabajé del lado del cliente y del negocio como Ejecutiva de Cuentas en Agencia Micó y en e-commerce. Esa mezcla me permite pensar un producto desde el código, el diseño y las personas que lo usan.',
      en: 'I teach frontend technologies and UX/UI at Digital House, and previously worked on the client and business side as an Account Executive at Agencia Micó and in e-commerce. That mix lets me think about a product from the code, the design and the people who use it.',
    },
  ],

  // "period" es opcional: completalo (ej. '2022 — Actualidad') para mostrarlo.
  experience: [
    {
      role: { es: 'Profesora de Tecnologías Frontend', en: 'Frontend Technologies Instructor' },
      company: 'Digital House',
      period: '',
      description: {
        es: 'Dictado de clases de tecnologías frontend y acompañamiento de estudiantes en sus proyectos.',
        en: 'Teaching frontend technologies and mentoring students through their projects.',
      },
    },
    {
      role: { es: 'Profesora Adjunta de UX/UI', en: 'UX/UI Adjunct Instructor' },
      company: 'Digital House',
      period: '',
      description: {
        es: 'Docencia en diseño de experiencia de usuario e interfaces.',
        en: 'Teaching user experience and interface design.',
      },
    },
    {
      role: { es: 'Ejecutiva de Cuentas', en: 'Account Executive' },
      company: 'Agencia Micó',
      period: '',
      description: {
        es: 'Gestión de cuentas y relación con clientes de la agencia.',
        en: 'Account management and client relations for the agency.',
      },
    },
    {
      role: { es: 'E-commerce', en: 'E-commerce' },
      company: '',
      period: '',
      description: {
        es: 'Experiencia en gestión y operación de tiendas online.',
        en: 'Experience managing and operating online stores.',
      },
    },
  ],

  education: [
    {
      title: { es: 'Analista de Sistemas', en: 'Systems Analyst' },
      place: 'Escuela Da Vinci',
      status: { es: 'En curso', en: 'In progress' },
    },
    {
      title: { es: 'Licenciatura en Tecnología Multimedia', en: "Bachelor's Degree in Multimedia Technology" },
      place: 'Universidad Maimónides',
      status: { es: 'Graduada', en: 'Graduated' },
    },
  ],

  awards: [
    {
      title: { es: '2.º puesto · UX Challenge', en: '2nd place · UX Challenge' },
      detail: { es: 'Proyecto GreenMint', en: 'GreenMint project' },
    },
  ],

  // "value" (0-100) solo dibuja la barra de nivel.
  languages: [
    { name: { es: 'Español', en: 'Spanish' }, level: { es: 'Nativo', en: 'Native' }, value: 100 },
    { name: { es: 'Inglés', en: 'English' }, level: { es: 'C2', en: 'C2' }, value: 95 },
    { name: { es: 'Chino', en: 'Chinese' }, level: { es: 'Básico', en: 'Basic' }, value: 25 },
    { name: { es: 'Coreano', en: 'Korean' }, level: { es: 'Básico', en: 'Basic' }, value: 25 },
  ],

  // TODO: ajustá esta lista a tu stack real.
  skills: [
    {
      group: { es: 'Frontend', en: 'Frontend' },
      items: ['HTML', 'CSS', 'JavaScript', 'React'],
    },
    {
      group: { es: 'Diseño', en: 'Design' },
      items: [
        'UX/UI',
        { es: 'Diseño multimedia', en: 'Multimedia design' },
        { es: 'Prototipado', en: 'Prototyping' },
      ],
    },
    {
      group: { es: 'Profesional', en: 'Professional' },
      items: [
        { es: 'Docencia', en: 'Teaching' },
        { es: 'Gestión de cuentas', en: 'Account management' },
        'E-commerce',
      ],
    },
  ],
};
