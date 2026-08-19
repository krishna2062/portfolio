export interface ProjectTechStack {
  frontend?: string;
  backend?: string;
  database?: string;
  tools?: string;
}

export interface ProjectItem {
  slug: string;
  name: string;
  category: string;
  description: string;
  detailedDescription: string;
  features: string[];
  architecture: string;
  tech: string[];
  techStack: ProjectTechStack;
  status: string;
  github?: string;
  demo?: string;
}

export const PROJECTS_DATA: ProjectItem[] = [
  {
    slug: 'hamro-kirana',
    name: 'Hamro Kirana',
    category: 'E-Commerce / Nepal Local Quick-Commerce Platform',
    description:
      'Hamro Kirana is a Nepal-focused local quick-commerce and e-commerce platform designed to connect customers with local sellers and provide a fast, convenient shopping experience.',
    detailedDescription:
      'Hamro Kirana addresses neighborhood grocery and essential commerce needs across Nepal. Designed with localized address handling, fast cart operations, and multi-vendor workflows, it connects customers with nearby merchants while providing dedicated consoles for product discovery, checkout, order fulfillment, and seller management.',
    features: [
      'Product discovery, real-time catalog search, and multi-category filtering',
      'Shopping cart and wishlist operations with dynamic price and inventory validation',
      'Multi-step checkout workflow with Nepal-specific localized address fields',
      'End-to-end order lifecycle management (Placed, Processing, Dispatched, Delivered)',
      'Seller management console with product catalog controls, stock alerts, and commission tracking',
      'Administrative control center for customer oversight, seller approvals, and sales analytics',
      'Delivery workflow routing and transparent payment management',
    ],
    architecture:
      'React frontend user interface paired with a high-performance C# ASP.NET Core backend architecture, ASP.NET Core Web API RESTful services, Entity Framework Core for data mapping, and SQL Server relational schema for transactional integrity.',
    tech: ['React.js', 'HTML/CSS', 'JavaScript', 'C#', 'ASP.NET Core', 'ASP.NET Core Web API', 'Entity Framework Core', 'SQL Server / Database'],
    techStack: {
      frontend: 'React / HTML / CSS / JavaScript',
      backend: 'C# / ASP.NET Core / ASP.NET Core Web API',
      database: 'SQL Server / Entity Framework Core',
      tools: 'Visual Studio / Git / Postman',
    },
    status: 'Production Ready',
    github: 'https://github.com/krishnaprasadbhandari',
  },
  {
    slug: 'skillnepal',
    name: 'SkillNepal',
    category: 'Skill / Learning / Professional Platform',
    description:
      'SkillNepal is a digital platform focused on connecting learners, skills, opportunities, and practical learning resources through a modern user-centered interface.',
    detailedDescription:
      'SkillNepal empowers students and tech aspirants with structured learning paths, skill assessment resources, and community guidance. It provides an intuitive environment for skill discovery, tracking course progress, and finding career opportunities across Nepal.',
    features: [
      'User profiles with personalized skill tags, portfolios, and learning goal tracking',
      'Interactive skill discovery catalog with learning resources and categorized roadmaps',
      'Career opportunities board and tech community announcement updates',
      'Structured technical learning tracks for web development, software engineering, and systems',
      'Fast multi-attribute search and category filtering for learning modules',
      'Responsive, accessible user interface optimized for mobile and desktop learners',
    ],
    architecture:
      'React frontend component architecture, Node.js and Express.js RESTful API service layer, MongoDB document storage for flexible curriculum records, and JWT token authentication.',
    tech: ['React.js', 'JavaScript', 'HTML/CSS', 'Node.js', 'Express.js', 'MongoDB', 'Tailwind CSS'],
    techStack: {
      frontend: 'React.js / HTML / CSS / JavaScript',
      backend: 'Node.js / Express.js REST APIs',
      database: 'MongoDB',
      tools: 'VS Code / Git / Postman',
    },
    status: 'Active Platform',
    github: 'https://github.com/krishnaprasadbhandari',
  },
  {
    slug: 'together',
    name: 'Together',
    category: 'Social Media / Social Networking Platform',
    description:
      'Together is a social networking platform concept designed to provide users with a modern space for connecting, sharing content, and interacting with other users.',
    detailedDescription:
      'Together is a social networking application crafted to foster digital connection, collaboration, and community discussions. It provides users with profile management, interactive community feeds, rich media sharing, comment threads, and direct messaging channels.',
    features: [
      'Customizable user profiles with bios, avatars, and activity timelines',
      'Interactive community feed with support for posts, rich text, and media sharing',
      'Social interaction mechanisms including likes, comments, reactions, and bookmarks',
      'Direct messaging concept for peer-to-peer real-time communication',
      'Real-time notifications for post interactions and new messages',
      'Clean, fluid mobile-first user experience with modern component styling',
    ],
    architecture:
      'Modern React.js and Tailwind CSS frontend application with modular component architecture, client-side state handling, Firebase real-time synchronized data layer, and responsive UI layouts.',
    tech: ['React.js', 'JavaScript', 'HTML/CSS', 'Tailwind CSS', 'Firebase'],
    techStack: {
      frontend: 'React.js / HTML / CSS / JavaScript',
      backend: 'Firebase Realtime Services',
      database: 'Firebase Firestore',
      tools: 'VS Code / Git',
    },
    status: 'Frontend Concept',
    github: 'https://github.com/krishnaprasadbhandari',
  },
  {
    slug: 'iot-air-purification',
    name: 'IoT Air Purification & Fire Detection',
    category: 'IoT & Telemetry Dashboard',
    description:
      'Real-time environmental sensor monitoring dashboard for air quality metrics, purification triggers, and early hazard/fire detection alerts.',
    detailedDescription:
      'An integrated hardware-software monitoring ecosystem linking environmental telemetry sensors (smoke, flame, PM2.5, temperature, humidity) to a live web dashboard. The system continuously evaluates atmospheric data, automatically engages purification systems upon reaching thresholds, and triggers instant safety alerts.',
    features: [
      'Sub-second live sensor telemetry stream with interactive gauges and live charts',
      'Automated purification trigger logic activated when PM2.5/AQI surpasses safe levels',
      'Multi-sensor flame and smoke early-warning detection pipeline with instant alert banners',
      'Custom threshold calibration for indoor and industrial environment presets',
      'Historical environmental logging for analyzing air quality trends over time',
    ],
    architecture:
      'Microcontroller hardware sensors streaming telemetry via serial/HTTP, FastAPI (Python) real-time collector service, WebSockets for low-latency push, and dynamic React visualizers.',
    tech: ['IoT Sensors', 'React.js', 'WebSockets', 'Python / FastAPI', 'Tailwind CSS'],
    techStack: {
      frontend: 'React.js / Tailwind CSS / Charts',
      backend: 'Python / FastAPI / WebSockets',
      database: 'SQLite / Time-Series Logs',
      tools: 'Hardware Microcontrollers / Arduino IDE / Git',
    },
    status: 'Hardware Integrated',
    github: 'https://github.com/krishnaprasadbhandari',
  },
  {
    slug: 'smart-face-attendance',
    name: 'Smart Face Attendance',
    category: 'Computer Vision & Web App',
    description:
      'Automated face recognition attendance system designed for educational institutions and workplaces with instant verification and record logging.',
    detailedDescription:
      'A computer-vision-powered attendance tracking system designed to eliminate manual roll calls and proxy attendance. Using OpenCV facial landmark detection and feature vector comparison, the system captures student/employee presence in real-time, logs entry timestamps, and provides administration with automated attendance reports.',
    features: [
      'Real-time video feed face detection and 68-point facial landmark alignment',
      'High-accuracy face encoding comparison against an enrolled biometric database',
      'Anti-proxy single-timestamp registration per student per lecture session',
      'Instructor & administrator management console for exporting daily/monthly attendance CSVs',
      'Student profile onboarding module with multi-angle image enrollment',
    ],
    architecture:
      'Python & OpenCV computer vision engine, FastAPI backend API service, SQLite database for local logs, and a clean React administrative dashboard.',
    tech: ['Python', 'OpenCV', 'FastAPI', 'React.js', 'SQLite'],
    techStack: {
      frontend: 'React.js / Administrative Dashboard',
      backend: 'Python / OpenCV / FastAPI',
      database: 'SQLite Database',
      tools: 'OpenCV / VS Code / Git',
    },
    status: 'Functional Prototype',
    github: 'https://github.com/krishnaprasadbhandari',
  },
  {
    slug: 'iot-gps-bus-tracking',
    name: 'IoT GPS Bus Tracking',
    category: 'IoT & Geolocation',
    description:
      'Live vehicle tracking system with GPS module telemetry, real-time map plotting, and route ETA prediction for public transit fleets.',
    detailedDescription:
      'A real-time transit telemetry solution that tracks public and college buses using onboard GPS hardware modules. Passengers and administrators can view real-time vehicle positions on an interactive map, inspect upcoming transit stops, and monitor route timelines with minimal latency.',
    features: [
      'Continuous GPS hardware telemetry stream parsing NMEA coordinates and velocity',
      'Interactive map interface with smooth vehicle marker animation and directional heading',
      'Route corridor visualization with designated passenger pickup and dropoff waypoints',
      'Estimated Time of Arrival (ETA) calculation based on vehicle speed and distance',
      'Fleet manager overview for tracking all active buses simultaneously',
    ],
    architecture:
      'Onboard GPS hardware transmitter, Node.js WebSocket coordination server, and React frontend integrating interactive mapping libraries.',
    tech: ['IoT GPS Modules', 'Node.js', 'Leaflet', 'React.js', 'WebSockets'],
    techStack: {
      frontend: 'React.js / Leaflet Maps',
      backend: 'Node.js / WebSockets',
      database: 'JSON / Transit Log Store',
      tools: 'GPS Modules / Hardware Transmitters',
    },
    status: 'Tested & Deployed',
    github: 'https://github.com/krishnaprasadbhandari',
  },
  {
    slug: 'django-mongodb-ecommerce',
    name: 'Django + MongoDB E-Commerce',
    category: 'Backend Architecture',
    description:
      'Scalable multi-vendor store backend with asynchronous task processing, custom auth pipelines, and document-based catalog storage.',
    detailedDescription:
      'A robust backend architecture built for handling high-volume e-commerce catalogs with flexible product schema requirements. Leveraging Django REST Framework and MongoDB document storage, it handles complex variant attributes, cart workflows, and secure token-based user authentication.',
    features: [
      'Dynamic document schema accommodating varied product specifications without schema migration overhead',
      'Role-based access control (Customer, Store Manager, System Administrator) with JWT tokens',
      'Cart management pipeline supporting coupons, bulk pricing, and checkout locks',
      'Asynchronous task processing for invoice generation and automated email dispatches',
      'RESTful endpoints with parameterized search, filtering, and pagination',
    ],
    architecture:
      'Python 3, Django REST Framework, PyMongo / Djongo database driver, MongoDB document store, and Dockerized microservice architecture.',
    tech: ['Python', 'Django', 'MongoDB', 'REST APIs', 'Docker'],
    techStack: {
      frontend: 'Swagger UI / REST Client Interface',
      backend: 'Python / Django REST Framework',
      database: 'MongoDB Document Database',
      tools: 'Docker / Postman / Git',
    },
    status: 'Completed',
    github: 'https://github.com/krishnaprasadbhandari',
  },
];

export interface EducationItem {
  degree: string;
  institution: string;
  university?: string;
  status: string;
  currentSemester?: string;
  field: string;
  gpa?: string;
  period?: string;
  details: string;
}

export const EDUCATION_DATA: EducationItem[] = [
  {
    degree: 'Bachelor of Engineering in Computer Engineering',
    institution: 'Lumbini Engineering College',
    university: 'Pokhara University',
    status: 'Currently Pursuing',
    currentSemester: '4th Semester',
    field: 'Computer Engineering',
    period: 'Current — 4th Semester',
    details:
      'Studying core computer engineering disciplines including Data Structures & Algorithms, Object-Oriented Programming, Database Management Systems, Computer Networks, Operating Systems, Microprocessors, and Software Engineering.',
  },
  {
    degree: 'SLC (School Leaving Certificate)',
    institution: 'Higher Secondary Technical Education',
    status: 'Completed',
    field: 'IT Engineering',
    gpa: '3.36',
    period: 'Graduated',
    details:
      'Completed secondary technical education specializing in IT Engineering with strong fundamentals in computer systems, mathematics, and programming logic.',
  },
  {
    degree: 'SEE (Secondary Education Examination)',
    institution: 'Secondary Technical School',
    status: 'Completed',
    field: 'IT Engineering',
    gpa: '3.28',
    period: 'Graduated',
    details:
      'Foundational technical schooling in IT Engineering covering basic software concepts, hardware components, and applied science.',
  },
];

export interface SkillCategory {
  category: string;
  skills: string[];
}

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    category: 'Frontend Development',
    skills: ['React.js', 'HTML', 'CSS', 'JavaScript', 'Next.js', 'Tailwind CSS', 'Framer Motion'],
  },
  {
    category: 'Backend & Specialization',
    skills: ['C#', 'ASP.NET Core', 'ASP.NET Web API', 'ASP.NET', 'Node.js', 'Express.js', 'Django', 'FastAPI'],
  },
  {
    category: 'Databases & Storage',
    skills: ['MongoDB', 'SQL', 'Firebase', 'PostgreSQL', 'SQLite'],
  },
  {
    category: 'Programming Languages',
    skills: ['C', 'C++', 'C#', 'Java', 'Python', 'JavaScript', 'TypeScript'],
  },
  {
    category: 'Developer Tools & Environments',
    skills: ['Git', 'GitHub', 'VS Code', 'Visual Studio', 'Kali Linux', 'Docker', 'Postman'],
  },
  {
    category: 'Research & Emerging Areas',
    skills: ['APIs & Architecture', 'Cybersecurity', 'IoT Telemetry', 'AI & Computer Vision', 'New Technologies'],
  },
];

export interface ExperienceItem {
  role: string;
  organization: string;
  period: string;
  type: string;
  tech: string[];
  description: string;
  backendResponsibilities: string[];
  techLeadResponsibilities: string[];
}

export const EXPERIENCE_DATA: ExperienceItem[] = [
  {
    role: 'Backend Developer & Tech Lead',
    organization: 'NeoVertex Solution',
    period: 'Current Role',
    type: 'Backend Engineering & Technical Leadership',
    tech: ['C#', 'ASP.NET', 'ASP.NET Core', 'ASP.NET Web API'],
    description:
      'Working as a Backend Developer and Tech Lead at NeoVertex Solution, focusing on designing and developing scalable backend systems, APIs, and application architecture using C# and ASP.NET. I also contribute to technical decision-making, backend architecture, integration, code quality, and overall development workflow.',
    backendResponsibilities: [
      'Developing backend applications and scalable server architectures using C#',
      'Building RESTful APIs using ASP.NET Core and ASP.NET Web API',
      'Designing backend architecture, data models, and database access layers',
      'Implementing secure authentication and authorization mechanisms',
      'Handling API integrations, business rules, and backend debugging/optimization',
      'Writing maintainable, performant code and supporting frontend-backend integration',
    ],
    techLeadResponsibilities: [
      'Contributing to technical decision-making and backend architecture planning',
      'Conducting code reviews and upholding robust development standards',
      'Providing technical guidance and helping resolve complex implementation roadblocks',
      'Coordinating API structure, integration workflows, and development execution',
      'Supporting development team productivity and reviewing implementation approaches',
    ],
  },
];

export interface ServiceItem {
  title: string;
  description: string;
  details: string[];
}

export const SERVICES_DATA: ServiceItem[] = [
  {
    title: 'Full Stack Web Development',
    description:
      'End-to-end web applications combining responsive React frontends with robust, scalable C# / ASP.NET Core backend systems.',
    details: [
      'Production-ready React.js single-page applications with clean component architecture',
      'High-performance ASP.NET Core and ASP.NET Web API backend services',
      'Clean data modelling with SQL, PostgreSQL, and MongoDB databases',
      'Responsive, mobile-optimized layouts with Tailwind CSS',
    ],
  },
  {
    title: 'Backend Systems & REST APIs',
    description:
      'Designing structured, maintainable backend architectures, RESTful APIs, and business rules in C# and ASP.NET Core.',
    details: [
      'REST API design with structured filtering, validation, and pagination',
      'Secure authentication, authorization, and role-based access control',
      'Robust database access with Entity Framework Core and SQL databases',
      'Backend debugging, performance optimization, and third-party API integration',
    ],
  },
  {
    title: 'Frontend & UI Engineering',
    description:
      'Crafting intuitive, accessible, high-speed interfaces using React.js, HTML, CSS, and modern JavaScript.',
    details: [
      'Fluid animations and interactive physics with Framer Motion',
      'Component-driven architecture and reusable interface patterns',
      'State management and efficient asynchronous data fetching',
      'Accessible, clean cross-browser responsive design',
    ],
  },
  {
    title: 'Database Design & IoT Telemetry',
    description:
      'Designing relational and document schemas alongside real-time hardware data dashboards.',
    details: [
      'PostgreSQL & SQL relational schema normalization and indexing',
      'MongoDB flexible document store structuring',
      'Sub-second live sensor telemetry streaming via WebSockets',
      'Hardware sensor interfacing (GPS, air quality, gas/flame)',
    ],
  },
];

export interface BlogPost {
  slug: string;
  title: string;
  category: string;
  readTime: string;
  date: string;
  excerpt: string;
  content: string[];
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'building-scalable-backend-systems-aspnet-core',
    title: 'Architecting Scalable RESTful Web APIs with C# and ASP.NET Core',
    category: 'Backend Architecture',
    readTime: '5 min read',
    date: '2026',
    excerpt:
      'Key architectural patterns for designing maintainable ASP.NET Core Web APIs, structured dependency injection, and clean database integration.',
    content: [
      'Designing enterprise-ready backend systems requires clear separation of concerns, structured error handling, and robust API contracts.',
      'In C# and ASP.NET Core, leveraging built-in Dependency Injection alongside clean repository patterns ensures controllers remain lightweight and maintainable.',
      'Implementing secure authentication, token validation, and proper data modeling with Entity Framework Core forms the cornerstone of scalable server architectures.',
    ],
  },
  {
    slug: 'building-scalable-fullstack-apps-in-nepal',
    title: 'Building Scalable Full-Stack Applications for Local Markets in Nepal',
    category: 'Web Development',
    readTime: '4 min read',
    date: '2026',
    excerpt:
      'Insights into developing localized web solutions like Hamro Kirana and SkillNepal with tailored checkout flows, address systems, and mobile-first design.',
    content: [
      'Developing web applications for local markets in Nepal requires thoughtful engineering around mobile connectivity, localized address structures, and intuitive navigation.',
      'When building Hamro Kirana, we prioritized instant cart updates with sub-millisecond local state synchronization and responsive checkout forms that accommodate neighborhood-based delivery points.',
      'Similarly, SkillNepal was designed to empower learners with lightweight, highly accessible technical roadmaps that load swiftly across varying network conditions.',
    ],
  },
  {
    slug: 'real-time-iot-telemetry-with-websockets',
    title: 'Real-Time IoT Sensor Telemetry & Automated Safety Triggers',
    category: 'IoT & Systems',
    readTime: '5 min read',
    date: '2026',
    excerpt:
      'How to connect hardware microcontrollers, smoke/flame sensors, and WebSockets to create low-latency monitoring dashboards.',
    content: [
      'Environmental safety systems require sub-second notification pipelines. In our IoT Air Purification & Fire Detection project, microcontrollers stream analog sensor readings over lightweight HTTP and WebSocket connections.',
      'A FastAPI backend parses telemetry payloads in real-time, checking values against dynamic safety thresholds.',
      'Upon detecting elevated PM2.5 or flame signatures, the backend broadcasts instant push signals to the React dashboard while simultaneously sending activation commands to hardware relays.',
    ],
  },
];

export interface CertificationItem {
  title: string;
  issuer: string;
  year: string;
  field: string;
  description: string;
}

export const CERTIFICATIONS_DATA: CertificationItem[] = [
  {
    title: 'Bachelor of Engineering (Computer) Candidate',
    issuer: 'Lumbini Engineering College / Pokhara University',
    year: 'Current — 4th Semester',
    field: 'Computer Engineering',
    description: 'Pursuing accredited degree in Computer Engineering with focus on software systems, databases, and microprocessors.',
  },
  {
    title: 'SLC in IT Engineering (GPA 3.36)',
    issuer: 'Technical Education Board',
    year: 'Graduated',
    field: 'Information Technology Engineering',
    description: 'Specialized secondary technical certification in computer programming and information technology fundamentals.',
  },
  {
    title: 'SEE in IT Engineering (GPA 3.28)',
    issuer: 'National Examination Board',
    year: 'Graduated',
    field: 'Technical IT Stream',
    description: 'Foundational secondary school technical certification with coursework in computer applications and science.',
  },
];

export interface TestimonialItem {
  name: string;
  role: string;
  context: string;
  text: string;
}

export const TESTIMONIALS_DATA: TestimonialItem[] = [
  {
    name: 'Engineering Collaborator',
    role: 'Full Stack Developer',
    context: 'Full Stack & Backend Collaboration',
    text: 'Krishna demonstrates strong technical depth across C#, ASP.NET Core, and React.js. His methodical approach to backend architecture, API design, and team coordination makes him an exceptional technical lead.',
  },
  {
    name: 'Academic Project Peer',
    role: 'Computer Engineering Student',
    context: 'IoT & Systems Lab Projects',
    text: 'Working with Krishna on engineering projects demonstrated his deep problem-solving skills, curiosity for new technologies, and dedication to high-quality software development.',
  },
];
