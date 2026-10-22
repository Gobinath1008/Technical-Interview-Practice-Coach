/**
 * Configuration and constants for Technical Interview Practice Coach
 */

// Production n8n webhook URL for evaluating answers and generating questions
export const N8N_INTERVIEW_COACH_WEBHOOK_URL =
  'https://sowdarya.app.n8n.cloud/webhook/interview-coach';

// Supported company choices
export const COMPANY_OPTIONS = [
  'TCS',
  'Infosys',
  'Wipro',
  'Accenture',
  'Other',
];

// Supported job roles
export const ROLE_OPTIONS = [
  'Software Development Engineer (SDE)',
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'Data Analyst / Data Engineer',
  'DevOps & Cloud Engineer',
  'QA / Test Automation Engineer',
  'Other Role',
];

// Supported interview topics
export const TOPIC_OPTIONS = [
  'Core Java',
  'Python',
  'Data Structures & Algorithms',
  'SQL & Databases',
  'React & Frontend',
  'Node.js & Backend APIs',
  'System Design & Microservices',
  'Object-Oriented Programming (OOP)',
  'Operating Systems & Networking',
  'Cloud (AWS/Azure) & CI/CD',
];

// Difficulty levels
export const DIFFICULTY_OPTIONS = [
  {
    id: 'Easy',
    label: 'Easy',
    desc: 'Foundations & conceptual definitions (Fresher / 0-1 YOE)',
    badgeClass: 'diff-easy',
  },
  {
    id: 'Medium',
    label: 'Medium',
    desc: 'Implementation, trade-offs & edge cases (1-3 YOE)',
    badgeClass: 'diff-medium',
  },
  {
    id: 'Hard',
    label: 'Hard',
    desc: 'Architecture, internal mechanics & optimization (Senior / 4+ YOE)',
    badgeClass: 'diff-hard',
  },
];

// Number of questions options
export const QUESTION_COUNT_OPTIONS = [5, 10, 15];

// Curated sample interview questions for Quick Evaluation mode
export const SAMPLE_QUESTIONS = [
  {
    company: 'TCS',
    topic: 'Java',
    question: 'What is the difference between String, StringBuilder, and StringBuffer in Java?',
    answer: 'String is immutable in Java, so any modification creates a new string object in the string pool. StringBuilder and StringBuffer are mutable sequences of characters. The key distinction is that StringBuffer methods are synchronized making it thread-safe for multi-threaded applications, while StringBuilder is unsynchronized and faster, making it ideal for single-threaded usage.',
  },
  {
    company: 'Infosys',
    topic: 'SQL / Databases',
    question: 'What is the difference between WHERE and HAVING clauses in SQL?',
    answer: 'The WHERE clause filters individual rows before any aggregation operations are performed, and cannot be used with aggregate functions like COUNT or SUM. The HAVING clause filters grouped rows after aggregation has been calculated by the GROUP BY clause.',
  },
  {
    company: 'Wipro',
    topic: 'Object-Oriented Programming',
    question: 'Explain Method Overloading vs Method Overriding with practical examples.',
    answer: 'Method Overloading happens within the same class where multiple methods have the exact same name but different parameter lists (types, number of parameters). It is resolved at compile time (static polymorphism). Method Overriding occurs when a child subclass provides a specific implementation of a method defined in its parent superclass with identical name, return type, and parameters. It is resolved at runtime (dynamic polymorphism).',
  },
  {
    company: 'Accenture',
    topic: 'REST API & Web Architecture',
    question: 'What are idempotent HTTP methods and why are PUT and DELETE considered idempotent while POST is not?',
    answer: 'An HTTP method is idempotent if making multiple identical requests has the same intended effect on the server state as making a single request. PUT is idempotent because updating a resource with identical data replaces or sets the exact state repeatedly. DELETE is idempotent because deleting an existing resource once or multiple times leaves that resource deleted. POST is not idempotent because each call typically creates a distinct new resource or triggers side-effects.',
  },
];

/**
 * Intelligent question fallback generator:
 * Used if the online n8n webhook only has the evaluate node configured,
 * ensuring the conversational mock interview runs seamlessly without failing.
 */
export const CONVERSATIONAL_QUESTION_BANK = {
  'Core Java': {
    Easy: [
      'Explain the difference between JDK, JRE, and JVM in Java.',
      'What are the primary differences between primitive types and wrapper classes in Java, and what is autoboxing?',
      'Why is the main method in Java declared as public, static, and void?',
      'What is the difference between equals() method and == operator when comparing objects in Java?',
      'Explain the significance of the final keyword with variables, methods, and classes.',
    ],
    Medium: [
      'How does HashMap work internally in Java 8+? Explain hashing, buckets, and treeification threshold.',
      'Explain the difference between checked and unchecked exceptions with real-world examples of when to use each.',
      'What is the purpose of the volatile keyword in Java, and how does it relate to instruction reordering and memory visibility?',
      'Compare ConcurrentHashMap with synchronized HashMap and Collections.synchronizedMap in multi-threaded scenarios.',
      'What are Java Streams and functional interfaces? Differentiate between intermediate and terminal operations.',
    ],
    Hard: [
      'How does Java Garbage Collection work? Compare the G1 GC and ZGC collectors in terms of pause times and memory overhead.',
      'Explain the Java Memory Model (JMM), happens-before relationship, and cache coherency.',
      'How would you detect and resolve a dead-lock or thread starvation situation in a high-throughput Java production service?',
      'Explain Java ClassLoader architecture, delegation hierarchy, and how custom ClassLoaders handle memory leaks.',
    ],
  },
  'React & Frontend': {
    Easy: [
      'What is JSX and how does it differ from traditional HTML? How does Babel compile it?',
      'Explain the difference between Props and State in React components.',
      'What are React Hooks and what rules must be followed when using them?',
      'Explain the purpose of the key prop when rendering lists of elements in React.',
      'What is the difference between controlled and uncontrolled components in React forms?',
    ],
    Medium: [
      'Explain how React Reconciliation and the Virtual DOM diffing algorithm operate under the hood.',
      'When should you use useMemo and useCallback, and what are the performance overheads of over-using them?',
      'Explain the React useEffect cleanup function and give examples of avoiding race conditions during data fetching.',
      'How does the React Context API compare with external state management libraries like Redux Toolkit or Zustand?',
      'Explain the differences between client-side rendering (CSR), server-side rendering (SSR), and hydration.',
    ],
    Hard: [
      'How does React 18+ Fiber architecture enable concurrent features such as startTransition and Suspense?',
      'Design a custom hook to manage infinite scrolling with intersection observer, debouncing, and cache invalidation.',
      'How would you diagnose and optimize severe rendering bottlenecks in a large React dashboard with real-time WebSocket feeds?',
      'Explain how React Compiler (React Forget) automatically optimizes memoization without manual useMemo/useCallback.',
    ],
  },
  'SQL & Databases': {
    Easy: [
      'What is the difference between Primary Key, Foreign Key, and Unique Key in a relational database?',
      'Explain the difference between INNER JOIN, LEFT JOIN, and FULL OUTER JOIN with visual or practical examples.',
      'What is the difference between DROP, TRUNCATE, and DELETE commands in SQL?',
      'What is normalization in databases, and why do we aim for 3rd Normal Form (3NF)?',
      'Explain aggregate functions in SQL and how they work with the GROUP BY clause.',
    ],
    Medium: [
      'How do B-Tree indexes work in databases like PostgreSQL or MySQL, and when does an index scan become a sequential scan?',
      'Explain the difference between optimistic and pessimistic locking in database transactions.',
      'What are database transactions, and how do ACID properties ensure data consistency during system crashes?',
      'Explain SQL Window functions (ROW_NUMBER(), RANK(), DENSE_RANK(), and LEAD/LAG) with practical use cases.',
      'How do you identify and optimize slow queries using EXPLAIN ANALYZE?',
    ],
    Hard: [
      'Explain Database Isolation Levels (Read Uncommitted, Read Committed, Repeatable Read, Serializable) and the anomalies they prevent.',
      'How would you architect database sharding and read-replicas for a system handling 50,000 queries per second?',
      'Compare relational SQL databases with NoSQL databases (Document, Key-Value, Columnar) in terms of the CAP theorem.',
    ],
  },
  'Data Structures & Algorithms': {
    Easy: [
      'What is Big O notation, and how do you calculate time and space complexity of an algorithm?',
      'Explain the difference between an Array and a Linked List in memory allocation and time complexity for insertion/lookup.',
      'How does a Stack differ from a Queue? Provide real-world computer science applications for both.',
      'Explain Binary Search algorithm and why the input array must be sorted.',
      'What is recursion and what happens in the call stack if a base case is omitted?',
    ],
    Medium: [
      'Explain the Two-Pointer technique and Sliding Window pattern with examples of problems they solve in O(n) time.',
      'How does a Hash Table resolve hash collisions? Compare separate chaining vs open addressing.',
      'Explain Depth First Search (DFS) vs Breadth First Search (BFS) in trees and graphs, and when to choose each.',
      'How does QuickSort work, and why does its worst-case time complexity degrade to O(n²)? How can that be mitigated?',
      'What is Dynamic Programming? Contrast Memoization (top-down) with Tabulation (bottom-up).',
    ],
    Hard: [
      'How would you design an LRU (Least Recently Used) Cache with O(1) get and put operations?',
      'Explain Dijkstra’s algorithm vs A* search for finding the shortest path in a weighted graph.',
      'How do Trie data structures work, and how would you implement an efficient autocomplete system for millions of search queries?',
    ],
  },
  'Python': {
    Easy: [
      'What is the difference between list and tuple in Python? When would you choose one over the other?',
      'Explain how Python handles memory management and what reference counting with garbage collection is.',
      'What are list comprehensions and dictionary comprehensions in Python, and why are they preferred?',
      'Explain the difference between mutable and immutable data types in Python.',
      'What are *args and **kwargs in Python function definitions?',
    ],
    Medium: [
      'What is the Global Interpreter Lock (GIL) in CPython and how does it affect multi-threading vs multi-processing?',
      'Explain Python Generators and the yield keyword. How do they enable memory-efficient stream processing?',
      'What are Python Decorators? Write a conceptual decorator that measures the execution time of any function.',
      'Explain the difference between deepcopy and shallow copy in Python with nested objects.',
      'How do Python context managers and the with statement work behind the scenes (__enter__ and __exit__)?',
    ],
    Hard: [
      'Explain Python’s asyncio event loop, coroutines, and how tasks are scheduled concurrently without threads.',
      'How do Python Metaclasses work, and what are real-world use cases for overriding __new__ or __init_subclass__?',
      'How would you optimize CPU-bound and memory-intensive Python code for high-throughput batch pipelines?',
    ],
  },
};

/**
 * Returns a fallback question if n8n has not yet been configured with question generation branch.
 */
export function getFallbackQuestion({ topic, difficulty = 'Medium', previousQuestions = [] }) {
  // Normalize topic key
  let topicCategory = 'Core Java';
  if (topic.toLowerCase().includes('react') || topic.toLowerCase().includes('front')) {
    topicCategory = 'React & Frontend';
  } else if (topic.toLowerCase().includes('sql') || topic.toLowerCase().includes('data')) {
    topicCategory = 'SQL & Databases';
  } else if (topic.toLowerCase().includes('struct') || topic.toLowerCase().includes('algo') || topic.toLowerCase().includes('dsa')) {
    topicCategory = 'Data Structures & Algorithms';
  } else if (topic.toLowerCase().includes('python')) {
    topicCategory = 'Python';
  }

  const diffCategory = difficulty.includes('Easy')
    ? 'Easy'
    : difficulty.includes('Hard')
    ? 'Hard'
    : 'Medium';

  const bank =
    CONVERSATIONAL_QUESTION_BANK[topicCategory]?.[diffCategory] ||
    CONVERSATIONAL_QUESTION_BANK['Core Java']['Medium'];

  // Filter out questions that have already been asked
  const remaining = bank.filter((q) => !previousQuestions.includes(q));

  if (remaining.length > 0) {
    return remaining[Math.floor(Math.random() * remaining.length)];
  }

  // Generic fallback if all bank questions have been asked
  return `Can you explain the key architectural design considerations and potential bottlenecks when designing a scalable ${topic} application?`;
}
