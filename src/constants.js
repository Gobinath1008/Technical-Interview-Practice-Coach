/**
 * Configuration and constants for Technical Interview Practice Coach
 */

// Production n8n webhook URL for evaluating answers
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

// Curated sample interview questions to test quickly
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

