const { db } = require("../config/firebase");

// Sample subjects data
const subjects = [
  {
    id: "mathematics",
    name: "Mathematics",
    description:
      "Advanced mathematics including algebra, calculus, and geometry",
    difficulty: "intermediate",
    icon: "🧮",
    color: "#3B82F6",
    avgTime: 20,
    totalQuizzes: 5,
  },
  {
    id: "science",
    name: "Science",
    description: "General science covering physics, chemistry, and biology",
    difficulty: "beginner",
    icon: "🔬",
    color: "#10B981",
    avgTime: 15,
    totalQuizzes: 3,
  },
  {
    id: "history",
    name: "History",
    description: "World history from ancient civilizations to modern times",
    difficulty: "beginner",
    icon: "📚",
    color: "#F59E0B",
    avgTime: 18,
    totalQuizzes: 4,
  },
  {
    id: "literature",
    name: "Literature",
    description: "Classic and contemporary literature analysis",
    difficulty: "intermediate",
    icon: "📖",
    color: "#8B5CF6",
    avgTime: 22,
    totalQuizzes: 6,
  },
  {
    id: "programming",
    name: "Programming",
    description: "Computer programming and software development",
    difficulty: "advanced",
    icon: "💻",
    color: "#EF4444",
    avgTime: 25,
    totalQuizzes: 8,
  },
];

// Sample notes data
const sampleNotes = [
  {
    title: "Introduction to Calculus",
    content: `Calculus is a branch of mathematics that deals with continuous change. It has two major branches:

1. **Differential Calculus**: Studies rates of change and slopes of curves
2. **Integral Calculus**: Studies accumulation of quantities and areas under curves

Key Concepts:
- Limits: The foundation of calculus
- Derivatives: Rate of change
- Integrals: Accumulation of change

Applications:
- Physics (motion, forces)
- Engineering (optimization)
- Economics (marginal analysis)
- Biology (population growth)`,
    subject: "Mathematics",
    description: "A comprehensive introduction to calculus fundamentals",
    isPublic: true,
    tags: ["calculus", "mathematics", "derivatives", "integrals"],
    authorName: "Dr. Smith",
    readTime: 15,
    rating: 4.8,
    reviews: 12,
    views: 156,
  },
  {
    title: "The Scientific Method",
    content: `The scientific method is a systematic approach to research that involves:

1. **Observation**: Noticing something interesting
2. **Question**: Asking why it happens
3. **Hypothesis**: Making an educated guess
4. **Prediction**: Stating what you expect to happen
5. **Experiment**: Testing your hypothesis
6. **Analysis**: Examining the results
7. **Conclusion**: Drawing conclusions

This method ensures reliable and reproducible results in scientific research.`,
    subject: "Science",
    description: "Understanding the fundamental process of scientific inquiry",
    isPublic: true,
    tags: ["scientific method", "research", "hypothesis", "experiment"],
    authorName: "Prof. Johnson",
    readTime: 8,
    rating: 4.6,
    reviews: 8,
    views: 89,
  },
  {
    title: "World War II: Key Events",
    content: `World War II (1939-1945) was a global conflict involving most nations:

**Major Events:**
- 1939: Germany invades Poland
- 1941: Pearl Harbor attack, US enters war
- 1944: D-Day invasion of Normandy
- 1945: Atomic bombs dropped on Japan

**Key Figures:**
- Winston Churchill (UK)
- Franklin D. Roosevelt (US)
- Adolf Hitler (Germany)
- Joseph Stalin (Soviet Union)

**Impact:**
- Redrew world borders
- Led to Cold War
- Accelerated technological development
- Established United Nations`,
    subject: "History",
    description:
      "Overview of the most significant global conflict of the 20th century",
    isPublic: true,
    tags: ["world war ii", "history", "20th century", "global conflict"],
    authorName: "Dr. Williams",
    readTime: 12,
    rating: 4.7,
    reviews: 15,
    views: 203,
  },
  {
    title: "Shakespeare's Sonnets",
    content: `William Shakespeare wrote 154 sonnets, exploring themes of:

**Love and Beauty:**
- Sonnet 18: "Shall I compare thee to a summer's day?"
- Sonnet 130: "My mistress' eyes are nothing like the sun"

**Time and Mortality:**
- Sonnet 60: "Like as the waves make towards the pebbled shore"
- Sonnet 73: "That time of year thou mayst in me behold"

**Structure:**
- 14 lines
- ABAB CDCD EFEF GG rhyme scheme
- Iambic pentameter

**Analysis Tips:**
- Look for metaphors and imagery
- Consider the volta (turn) in line 9
- Examine the couplet's resolution`,
    subject: "Literature",
    description: "Analysis of Shakespeare's famous sonnet collection",
    isPublic: true,
    tags: ["shakespeare", "sonnets", "poetry", "renaissance"],
    authorName: "Prof. Davis",
    readTime: 18,
    rating: 4.9,
    reviews: 22,
    views: 312,
  },
  {
    title: "JavaScript Fundamentals",
    content: `JavaScript is a versatile programming language essential for web development:

**Core Concepts:**
- Variables and data types
- Functions and scope
- Objects and arrays
- Event handling

**Modern Features:**
- ES6+ syntax (arrow functions, destructuring)
- Async/await for promises
- Modules and imports
- Template literals

**Best Practices:**
- Use const and let instead of var
- Write readable, self-documenting code
- Handle errors gracefully
- Test your code thoroughly

**Example:**
\`\`\`javascript
const greet = (name) => \`Hello, \${name}!\`;
console.log(greet('World')); // Hello, World!
\`\`\``,
    subject: "Programming",
    description: "Essential JavaScript concepts for beginners",
    isPublic: true,
    tags: ["javascript", "programming", "web development", "es6"],
    authorName: "Code Master",
    readTime: 20,
    rating: 4.5,
    reviews: 18,
    views: 178,
  },
];

// Sample quizzes data
const sampleQuizzes = [
  {
    subject: "Mathematics",
    difficulty: "beginner",
    title: "Basic Algebra Quiz",
    description: "Test your knowledge of fundamental algebraic concepts",
    questions: [
      {
        question: "What is the value of x in the equation 2x + 5 = 13?",
        options: ["3", "4", "5", "6"],
        correctAnswer: 1,
        explanation: "2x + 5 = 13 → 2x = 8 → x = 4",
      },
      {
        question: "Simplify: 3(x + 2) - 2x",
        options: ["x + 6", "x + 2", "5x + 6", "x - 6"],
        correctAnswer: 0,
        explanation: "3(x + 2) - 2x = 3x + 6 - 2x = x + 6",
      },
    ],
    timeLimit: 300, // 5 minutes
    passingScore: 70,
  },
  {
    subject: "Science",
    difficulty: "beginner",
    title: "Scientific Method Quiz",
    description: "Test your understanding of the scientific method",
    questions: [
      {
        question: "What is the first step of the scientific method?",
        options: [
          "Form a hypothesis",
          "Make observations",
          "Conduct experiments",
          "Draw conclusions",
        ],
        correctAnswer: 1,
        explanation:
          "The scientific method begins with making observations about the natural world.",
      },
      {
        question: "A hypothesis must be:",
        options: [
          "Always correct",
          "Testable and falsifiable",
          "Based on opinion",
          "Complex and detailed",
        ],
        correctAnswer: 1,
        explanation:
          "A hypothesis must be testable and potentially falsifiable to be scientific.",
      },
    ],
    timeLimit: 240, // 4 minutes
    passingScore: 75,
  },
];

// Function to seed subjects
async function seedSubjects() {
  console.log("🌱 Seeding subjects...");

  for (const subject of subjects) {
    try {
      await db
        .collection("subjects")
        .doc(subject.id)
        .set({
          ...subject,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      console.log(`✅ Added subject: ${subject.name}`);
    } catch (error) {
      console.error(`❌ Error adding subject ${subject.name}:`, error.message);
    }
  }
}

// Function to seed notes
async function seedNotes() {
  console.log("📝 Seeding notes...");

  for (const note of sampleNotes) {
    try {
      const noteData = {
        ...note,
        userId: "system", // System-generated notes
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await db.collection("notes").add(noteData);
      console.log(`✅ Added note: ${note.title}`);
    } catch (error) {
      console.error(`❌ Error adding note ${note.title}:`, error.message);
    }
  }
}

// Function to seed quizzes
async function seedQuizzes() {
  console.log("🧠 Seeding quizzes...");

  for (const quiz of sampleQuizzes) {
    try {
      const quizData = {
        ...quiz,
        createdBy: "system",
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
        totalQuestions: quiz.questions.length,
      };

      await db.collection("quizzes").add(quizData);
      console.log(`✅ Added quiz: ${quiz.title}`);
    } catch (error) {
      console.error(`❌ Error adding quiz ${quiz.title}:`, error.message);
    }
  }
}

// Main seeding function
async function seedAllData() {
  try {
    console.log("🚀 Starting database seeding...\n");

    await seedSubjects();
    console.log("");

    await seedNotes();
    console.log("");

    await seedQuizzes();
    console.log("");

    console.log("🎉 Database seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("💥 Error during seeding:", error);
    process.exit(1);
  }
}

// Run the seeding if this file is executed directly
if (require.main === module) {
  seedAllData();
}

module.exports = { seedSubjects, seedNotes, seedQuizzes, seedAllData };
