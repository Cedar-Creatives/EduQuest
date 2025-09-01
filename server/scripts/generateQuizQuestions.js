const { db } = require('../config/firebase');

// Subjects from the client code
const subjects = [
  { id: 'mathematics', name: 'Mathematics' },
  { id: 'science', name: 'Science' },
  { id: 'history', name: 'History' },
  { id: 'literature', name: 'Literature' },
  { id: 'art', name: 'Art' },
  { id: 'music', name: 'Music' },
  { id: 'programming', name: 'Programming' },
  { id: 'biology', name: 'Biology' }
];

// Difficulty levels
const difficultyLevels = ['beginner', 'intermediate', 'advanced'];

// Generate questions for each subject and difficulty
async function generateQuestions() {
  console.log('Starting to generate quiz questions...');
  
  // First, ensure all subjects exist in the database
  await ensureSubjectsExist();
  
  // Generate questions for each subject and difficulty
  for (const subject of subjects) {
    console.log(`Generating questions for ${subject.name}...`);
    
    for (const difficulty of difficultyLevels) {
      console.log(`- Difficulty: ${difficulty}`);
      
      // Check how many questions already exist for this subject and difficulty
      const existingQuestions = await db.collection('questions')
        .where('subject', '==', subject.id)
        .where('difficulty', '==', difficulty)
        .get();
      
      console.log(`  Found ${existingQuestions.size} existing questions`);
      
      // Generate more questions if needed
      const questionsToGenerate = Math.max(0, 50 - existingQuestions.size);
      
      if (questionsToGenerate > 0) {
        console.log(`  Generating ${questionsToGenerate} new questions`);
        await generateQuestionsForSubjectAndDifficulty(subject, difficulty, questionsToGenerate);
      } else {
        console.log(`  Already have enough questions for ${subject.name} (${difficulty})`);
      }
    }
  }
  
  console.log('Quiz question generation complete!');
}

// Ensure all subjects exist in the database
async function ensureSubjectsExist() {
  console.log('Ensuring subjects exist in the database...');
  
  for (const subject of subjects) {
    const subjectRef = db.collection('subjects').doc(subject.id);
    const subjectDoc = await subjectRef.get();
    
    if (!subjectDoc.exists) {
      console.log(`Creating subject: ${subject.name}`);
      await subjectRef.set({
        name: subject.name,
        description: `Questions about ${subject.name}`,
        icon: subject.id.toLowerCase(),
        createdAt: new Date()
      });
    } else {
      console.log(`Subject already exists: ${subject.name}`);
    }
  }
}

// Generate questions for a specific subject and difficulty
async function generateQuestionsForSubjectAndDifficulty(subject, difficulty, count) {
  const questions = generateQuestionsData(subject, difficulty, count);
  
  // Add questions to the database
  const batch = db.batch();
  
  for (const question of questions) {
    const questionRef = db.collection('questions').doc();
    batch.set(questionRef, {
      ...question,
      createdAt: new Date()
    });
  }
  
  await batch.commit();
  console.log(`  Added ${questions.length} questions to the database`);
}

// Generate question data based on subject and difficulty
function generateQuestionsData(subject, difficulty, count) {
  const questions = [];
  
  // Get the appropriate question generator for the subject
  const questionGenerator = questionGenerators[subject.id] || questionGenerators.default;
  
  for (let i = 0; i < count; i++) {
    questions.push(questionGenerator(subject, difficulty));
  }
  
  return questions;
}

// Question generators for each subject
const questionGenerators = {
  mathematics: (subject, difficulty) => {
    const questions = {
      beginner: [
        {
          question: 'What is 8 + 5?',
          options: ['12', '13', '14', '15'],
          correctAnswer: 1,
          explanation: '8 + 5 = 13',
          subject: subject.id,
          difficulty: difficulty
        },
        {
          question: 'What is 7 × 6?',
          options: ['36', '42', '48', '54'],
          correctAnswer: 1,
          explanation: '7 × 6 = 42',
          subject: subject.id,
          difficulty: difficulty
        },
        {
          question: 'What is 20 - 7?',
          options: ['11', '12', '13', '14'],
          correctAnswer: 2,
          explanation: '20 - 7 = 13',
          subject: subject.id,
          difficulty: difficulty
        },
        {
          question: 'What is 24 ÷ 8?',
          options: ['2', '3', '4', '6'],
          correctAnswer: 2,
          explanation: '24 ÷ 8 = 3',
          subject: subject.id,
          difficulty: difficulty
        },
        {
          question: 'What is 5 × 9?',
          options: ['40', '45', '50', '54'],
          correctAnswer: 1,
          explanation: '5 × 9 = 45',
          subject: subject.id,
          difficulty: difficulty
        },
        {
          question: 'What is 18 + 7?',
          options: ['23', '24', '25', '26'],
          correctAnswer: 2,
          explanation: '18 + 7 = 25',
          subject: subject.id,
          difficulty: difficulty
        },
        {
          question: 'What is 30 - 12?',
          options: ['16', '17', '18', '19'],
          correctAnswer: 2,
          explanation: '30 - 12 = 18',
          subject: subject.id,
          difficulty: difficulty
        },
        {
          question: 'What is 4 × 7?',
          options: ['21', '24', '28', '32'],
          correctAnswer: 2,
          explanation: '4 × 7 = 28',
          subject: subject.id,
          difficulty: difficulty
        },
        {
          question: 'What is 16 ÷ 4?',
          options: ['2', '3', '4', '5'],
          correctAnswer: 2,
          explanation: '16 ÷ 4 = 4',
          subject: subject.id,
          difficulty: difficulty
        },
        {
          question: 'What is 9 + 8?',
          options: ['15', '16', '17', '18'],
          correctAnswer: 2,
          explanation: '9 + 8 = 17',
          subject: subject.id,
          difficulty: difficulty
        }
      ],
      intermediate: [
        {
          question: 'Solve for x: 3x + 7 = 22',
          options: ['3', '5', '7', '15'],
          correctAnswer: 1,
          explanation: '3x + 7 = 22, 3x = 15, x = 5',
          subject: subject.id,
          difficulty: difficulty
        },
        {
          question: 'What is the area of a rectangle with length 8 cm and width 5 cm?',
          options: ['13 cm²', '26 cm²', '40 cm²', '80 cm²'],
          correctAnswer: 2,
          explanation: 'Area = length × width = 8 × 5 = 40 cm²',
          subject: subject.id,
          difficulty: difficulty
        },
        {
          question: 'What is the value of 2³ × 4²?',
          options: ['64', '96', '128', '256'],
          correctAnswer: 1,
          explanation: '2³ × 4² = 8 × 16 = 128',
          subject: subject.id,
          difficulty: difficulty
        },
        {
          question: 'If a car travels at 60 km/h, how far will it travel in 2.5 hours?',
          options: ['120 km', '150 km', '180 km', '200 km'],
          correctAnswer: 1,
          explanation: 'Distance = speed × time = 60 × 2.5 = 150 km',
          subject: subject.id,
          difficulty: difficulty
        },
        {
          question: 'What is the perimeter of a square with sides of length 7 cm?',
          options: ['14 cm', '21 cm', '28 cm', '49 cm'],
          correctAnswer: 2,
          explanation: 'Perimeter = 4 × side length = 4 × 7 = 28 cm',
          subject: subject.id,
          difficulty: difficulty
        },
        {
          question: 'Simplify: (3 + 5) × (10 - 6)',
          options: ['24', '32', '48', '64'],
          correctAnswer: 1,
          explanation: '(3 + 5) × (10 - 6) = 8 × 4 = 32',
          subject: subject.id,
          difficulty: difficulty
        },
        {
          question: 'What is 25% of 80?',
          options: ['15', '20', '25', '40'],
          correctAnswer: 1,
          explanation: '25% of 80 = 0.25 × 80 = 20',
          subject: subject.id,
          difficulty: difficulty
        },
        {
          question: 'If 3/5 of a number is 24, what is the number?',
          options: ['30', '35', '40', '45'],
          correctAnswer: 2,
          explanation: 'If 3/5 × n = 24, then n = 24 × 5/3 = 40',
          subject: subject.id,
          difficulty: difficulty
        },
        {
          question: 'What is the average of 15, 25, 30, and 50?',
          options: ['25', '30', '35', '40'],
          correctAnswer: 1,
          explanation: 'Average = (15 + 25 + 30 + 50) ÷ 4 = 120 ÷ 4 = 30',
          subject: subject.id,
          difficulty: difficulty
        },
        {
          question: 'Solve for y: 2y - 8 = 16',
          options: ['8', '12', '16', '24'],
          correctAnswer: 1,
          explanation: '2y - 8 = 16, 2y = 24, y = 12',
          subject: subject.id,
          difficulty: difficulty
        }
      ],
      advanced: [
        {
          question: 'Solve for x: 2x² - 5x - 3 = 0',
          options: ['x = -3 and x = 0.5', 'x = -0.5 and x = 3', 'x = -1 and x = 3', 'x = 1 and x = -3'],
          correctAnswer: 1,
          explanation: 'Using the quadratic formula with a=2, b=-5, c=-3: x = (-(-5) ± √((-5)² - 4(2)(-3))) / (2(2)) = (5 ± √(25 + 24)) / 4 = (5 ± √49) / 4 = (5 ± 7) / 4. So x = 3 or x = -0.5',
          subject: subject.id,
          difficulty: difficulty
        },
        {
          question: 'What is the derivative of f(x) = 3x⁴ - 2x² + 5x - 7?',
          options: ['f\'(x) = 12x³ - 4x + 5', 'f\'(x) = 12x³ - 4x - 5', 'f\'(x) = 12x³ - 4x² + 5', 'f\'(x) = 12x³ - 2x + 5'],
          correctAnswer: 0,
          explanation: 'f\'(x) = 12x³ - 4x + 5 (derivative of 3x⁴ is 12x³, derivative of -2x² is -4x, derivative of 5x is 5, derivative of -7 is 0)',
          subject: subject.id,
          difficulty: difficulty
        },
        {
          question: 'What is the integral of g(x) = 2x + cos(x)?',
          options: ['G(x) = x² + sin(x) + C', 'G(x) = x² - sin(x) + C', 'G(x) = 2x² + sin(x) + C', 'G(x) = x² + cos(x) + C'],
          correctAnswer: 0,
          explanation: 'G(x) = x² + sin(x) + C (integral of 2x is x², integral of cos(x) is sin(x))',
          subject: subject.id,
          difficulty: difficulty
        },
        {
          question: 'What is the limit of (sin(x))/x as x approaches 0?',
          options: ['0', '1', 'undefined', 'infinity'],
          correctAnswer: 1,
          explanation: 'The limit of (sin(x))/x as x approaches 0 is 1, which can be proven using L\'Hôpital\'s rule or by analyzing the behavior of the function near x = 0.',
          subject: subject.id,
          difficulty: difficulty
        },
        {
          question: 'In a geometric sequence, if a₁ = 6 and r = 2, what is a₅?',
          options: ['48', '64', '96', '192'],
          correctAnswer: 2,
          explanation: 'In a geometric sequence, aₙ = a₁ × r^(n-1). So a₅ = 6 × 2^(5-1) = 6 × 2⁴ = 6 × 16 = 96',
          subject: subject.id,
          difficulty: difficulty
        },
        {
          question: 'What is the solution to the system of equations: 2x + 3y = 7 and 4x - y = 5?',
          options: ['x = 2, y = 1', 'x = 1, y = 2', 'x = 2, y = -1', 'x = 1, y = -1'],
          correctAnswer: 0,
          explanation: 'From 4x - y = 5, we get y = 4x - 5. Substituting into 2x + 3y = 7: 2x + 3(4x - 5) = 7, 2x + 12x - 15 = 7, 14x = 22, x = 22/14 = 11/7. Then y = 4(11/7) - 5 = 44/7 - 5 = 44/7 - 35/7 = 9/7. So x = 2, y = 1.',
          subject: subject.id,
          difficulty: difficulty
        },
        {
          question: 'What is the value of sin(60°)?',
          options: ['1/2', '√2/2', '√3/2', '1'],
          correctAnswer: 2,
          explanation: 'sin(60°) = √3/2 ≈ 0.866',
          subject: subject.id,
          difficulty: difficulty
        },
        {
          question: 'What is the sum of the infinite geometric series 8 + 4 + 2 + 1 + ... ?',
          options: ['8', '12', '15', '16'],
          correctAnswer: 3,
          explanation: 'For an infinite geometric series with first term a and common ratio r (where |r| < 1), the sum is a/(1-r). Here, a = 8 and r = 1/2, so the sum is 8/(1-1/2) = 8/(1/2) = 16.',
          subject: subject.id,
          difficulty: difficulty
        },
        {
          question: 'What is the domain of the function f(x) = ln(x² - 4)?',
          options: ['x < -2 or x > 2', 'x ≤ -2 or x ≥ 2', '-2 < x < 2', 'All real numbers'],
          correctAnswer: 0,
          explanation: 'For ln(x² - 4) to be defined, we need x² - 4 > 0, which means x² > 4, so x < -2 or x > 2.',
          subject: subject.id,
          difficulty: difficulty
        },
        {
          question: 'What is the value of cos(π/3)?',
          options: ['0', '1/2', '√2/2', '√3/2'],
          correctAnswer: 1,
          explanation: 'cos(π/3) = cos(60°) = 1/2',
          subject: subject.id,
          difficulty: difficulty
        }
      ]
    };
    
    // Return a random question from the appropriate difficulty level
    const difficultyQuestions = questions[difficulty] || [];
    const randomIndex = Math.floor(Math.random() * difficultyQuestions.length);
    return difficultyQuestions[randomIndex];
  },
  
  science: (subject, difficulty) => {
    const questions = {
      beginner: [
        {
          question: 'What is the chemical symbol for water?',
          options: ['H2O', 'CO2', 'O2', 'NaCl'],
          correctAnswer: 0,
          explanation: 'Water is composed of two hydrogen atoms and one oxygen atom, represented by the chemical formula H2O.',
          subject: subject.id,
          difficulty: difficulty
        },
        {
          question: 'Which planet is known as the Red Planet?',
          options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
          correctAnswer: 1,
          explanation: 'Mars is known as the Red Planet due to its reddish appearance caused by iron oxide (rust) on its surface.',
          subject: subject.id,
          difficulty: difficulty
        },
        {
          question: 'What is the process by which plants make their own food using sunlight?',
          options: ['Photosynthesis', 'Respiration', 'Digestion', 'Fermentation'],
          correctAnswer: 0,
          explanation: 'Photosynthesis is the process by which plants convert light energy into chemical energy to fuel their activities.',
          subject: subject.id,
          difficulty: difficulty
        },
        {
          question: 'What is the largest organ in the human body?',
          options: ['Heart', 'Brain', 'Liver', 'Skin'],
          correctAnswer: 3,
          explanation: 'The skin is the largest organ in the human body, covering an area of about 2 square meters in adults.',
          subject: subject.id,
          difficulty: difficulty
        },
        {
          question: 'Which of these is NOT a state of matter?',
          options: ['Solid', 'Liquid', 'Gas', 'Energy'],
          correctAnswer: 3,
          explanation: 'Energy is not a state of matter. The three common states of matter are solid, liquid, and gas (plasma is the fourth).',
          subject: subject.id,
          difficulty: difficulty
        },
        {
          question: 'What force pulls objects toward the center of the Earth?',
          options: ['Magnetism', 'Friction', 'Gravity', 'Tension'],
          correctAnswer: 2,
          explanation: 'Gravity is the force that attracts objects toward each other, particularly drawing objects toward the center of the Earth.',
          subject: subject.id,
          difficulty: difficulty
        },
        {
          question: 'Which of these is a renewable energy source?',
          options: ['Coal', 'Natural gas', 'Solar power', 'Petroleum'],
          correctAnswer: 2,
          explanation: 'Solar power is a renewable energy source as it comes from the sun, which will continue to provide energy for billions of years.',
          subject: subject.id,
          difficulty: difficulty
        },
        {
          question: 'What is the basic unit of life?',
          options: ['Atom', 'Cell', 'Tissue', 'Organ'],
          correctAnswer: 1,
          explanation: 'The cell is considered the basic unit of life as all living organisms are composed of one or more cells.',
          subject: subject.id,
          difficulty: difficulty
        },
        {
          question: 'Which gas do humans breathe in to survive?',
          options: ['Oxygen', 'Carbon dioxide', 'Nitrogen', 'Hydrogen'],
          correctAnswer: 0,
          explanation: 'Humans breathe in oxygen, which is essential for cellular respiration to produce energy.',
          subject: subject.id,
          difficulty: difficulty
        },
        {
          question: 'What is the closest star to Earth?',
          options: ['Proxima Centauri', 'Alpha Centauri', 'Polaris', 'The Sun'],
          correctAnswer: 3,
          explanation: 'The Sun is the closest star to Earth, approximately 150 million kilometers away.',
          subject: subject.id,
          difficulty: difficulty
        }
      ],
      intermediate: [
        {
          question: 'What is the atomic number of carbon?',
          options: ['4', '6', '8', '12'],
          correctAnswer: 1,
          explanation: 'Carbon has 6 protons in its nucleus, giving it an atomic number of 6.',
          subject: subject.id,
          difficulty: difficulty
        },
        {
          question: 'Which of these is NOT one of Newton\'s Laws of Motion?',
          options: ['An object in motion stays in motion unless acted upon by an external force', 'Force equals mass times acceleration', 'For every action, there is an equal and opposite reaction', 'Energy can neither be created nor destroyed'],
          correctAnswer: 3,
          explanation: 'The statement "Energy can neither be created nor destroyed" is the Law of Conservation of Energy, not one of Newton\'s Laws of Motion.',
          subject: subject.id,
          difficulty: difficulty
        },
        {
          question: 'What is the pH of a neutral solution?',
          options: ['0', '7', '10', '14'],
          correctAnswer: 1,
          explanation: 'A neutral solution has a pH of 7. Values below 7 are acidic, and values above 7 are basic/alkaline.',
          subject: subject.id,
          difficulty: difficulty
        },
        {
          question: 'Which organelle is known as the "powerhouse of the cell"?',
          options: ['Nucleus', 'Mitochondria', 'Endoplasmic reticulum', 'Golgi apparatus'],
          correctAnswer: 1,
          explanation: 'Mitochondria are called the "powerhouse of the cell" because they generate most of the cell\'s supply of ATP, which is used as a source of chemical energy.',
          subject: subject.id,
          difficulty: difficulty
        },
        {
          question: 'What is the chemical formula for table salt?',
          options: ['NaCl', 'H2O', 'CO2', 'C6H12O6'],
          correctAnswer: 0,
          explanation: 'Table salt is sodium chloride, which has the chemical formula NaCl.',
          subject: subject.id,
          difficulty: difficulty
        },
        {
          question: 'Which of these is NOT a type of electromagnetic radiation?',
          options: ['X-rays', 'Ultraviolet', 'Infrared', 'Sound waves'],
          correctAnswer: 3,
          explanation: 'Sound waves are mechanical waves that require a medium to travel through, not electromagnetic radiation.',
          subject: subject.id,
          difficulty: difficulty
        },
        {
          question: 'What is the process by which rocks are broken down into smaller pieces?',
          options: ['Erosion', 'Weathering', 'Deposition', 'Subduction'],
          correctAnswer: 1,
          explanation: 'Weathering is the process by which rocks are broken down into smaller pieces through contact with the Earth\'s atmosphere, water, and biological organisms.',
          subject: subject.id,
          difficulty: difficulty
        },
        {
          question: 'Which blood type is known as the universal donor?',
          options: ['A+', 'AB-', 'O-', 'B+'],
          correctAnswer: 2,
          explanation: 'O- (O negative) is known as the universal donor because it can be given to anyone regardless of their blood type.',
          subject: subject.id,
          difficulty: difficulty
        },
        {
          question: 'What is the main function of white blood cells?',
          options: ['Transport oxygen', 'Fight infection', 'Clot blood', 'Regulate temperature'],
          correctAnswer: 1,
          explanation: 'White blood cells (leukocytes) are part of the immune system and help the body fight infection and disease.',
          subject: subject.id,
          difficulty: difficulty
        },
        {
          question: 'Which planet has the most moons in our solar system?',
          options: ['Jupiter', 'Saturn', 'Uranus', 'Neptune'],
          correctAnswer: 1,
          explanation: 'Saturn has the most confirmed moons in our solar system, with over 80 moons.',
          subject: subject.id,
          difficulty: difficulty
        }
      ],
      advanced: [
        {
          question: 'What is the Heisenberg Uncertainty Principle?',
          options: [
            'The principle that states energy cannot be created or destroyed',
            'The principle that states you cannot simultaneously know the exact position and momentum of a particle',
            'The principle that states matter and energy are equivalent',
            'The principle that states all motion is relative'
          ],
          correctAnswer: 1,
          explanation: 'The Heisenberg Uncertainty Principle states that you cannot simultaneously know the exact position and momentum of a particle. The more precisely you measure one property, the less precisely you can know the other.',
          subject: subject.id,
          difficulty: difficulty
        },
        {
          question: 'Which of the following is NOT a fundamental force in physics?',
          options: ['Gravity', 'Electromagnetic force', 'Strong nuclear force', 'Centrifugal force'],
          correctAnswer: 3,
          explanation: 'Centrifugal force is not a fundamental force but rather a fictitious or apparent force that appears in a rotating reference frame. The four fundamental forces are gravity, electromagnetic force, strong nuclear force, and weak nuclear force.',
          subject: subject.id,
          difficulty: difficulty
        },
        {
          question: 'What is the function of ATP in cellular metabolism?',
          options: [
            'It stores genetic information',
            'It serves as the primary energy currency of the cell',
            'It catalyzes biochemical reactions',
            'It forms the cell membrane'
          ],
          correctAnswer: 1,
          explanation: 'ATP (adenosine triphosphate) serves as the primary energy currency of the cell. It stores energy in its phosphate bonds, which is released when ATP is hydrolyzed to ADP (adenosine diphosphate).',
          subject: subject.id,
          difficulty: difficulty
        },
        {
          question: 'What is the significance of the Krebs cycle in cellular respiration?',
          options: [
            'It directly produces ATP',
            'It breaks down glucose into pyruvate',
            'It generates NADH and FADH2 for the electron transport chain',
            'It synthesizes proteins from amino acids'
          ],
          correctAnswer: 2,
          explanation: 'The Krebs cycle (citric acid cycle) is a series of chemical reactions that generates NADH and FADH2, which carry electrons to the electron transport chain for ATP production. It also produces a small amount of ATP directly.',
          subject: subject.id,
          difficulty: difficulty
        },
        {
          question: 'What is the difference between a covalent bond and an ionic bond?',
          options: [
            'Covalent bonds involve the sharing of electrons, while ionic bonds involve the transfer of electrons',
            'Covalent bonds occur between metals, while ionic bonds occur between nonmetals',
            'Covalent bonds are stronger than ionic bonds',
            'Covalent bonds occur in solids, while ionic bonds occur in liquids'
          ],
          correctAnswer: 0,
          explanation: 'Covalent bonds involve the sharing of electrons between atoms, typically between nonmetals. Ionic bonds involve the complete transfer of electrons from one atom to another, typically from a metal to a nonmetal.',
          subject: subject.id,
          difficulty: difficulty
        },
        {
          question: 'What is the significance of the Hardy-Weinberg equilibrium in population genetics?',
          options: [
            'It describes how genetic variation is maintained in a population',
            'It explains how new species evolve',
            'It predicts the rate of mutation in a population',
            'It calculates the carrying capacity of an ecosystem'
          ],
          correctAnswer: 0,
          explanation: 'The Hardy-Weinberg equilibrium is a principle stating that allele and genotype frequencies in a population will remain constant from generation to generation in the absence of evolutionary influences like natural selection, mutation, migration, and genetic drift.',
          subject: subject.id,
          difficulty: difficulty
        },
        {
          question: 'What is the significance of the Doppler effect in astronomy?',
          options: [
            'It explains why stars twinkle',
            'It allows astronomers to measure the rotation of planets',
            'It helps determine if celestial objects are moving toward or away from Earth',
            'It explains the formation of black holes'
          ],
          correctAnswer: 2,
          explanation: 'The Doppler effect in astronomy refers to the change in wavelength of light due to the relative motion of the source and observer. When an object moves away from Earth, its light is shifted toward the red end of the spectrum (redshift); when it moves toward Earth, its light is shifted toward the blue end (blueshift). This allows astronomers to determine if celestial objects are moving toward or away from Earth and at what speed.',
          subject: subject.id,
          difficulty: difficulty
        },
        {
          question: 'What is the role of telomeres in cellular aging?',
          options: [
            'They protect the ends of chromosomes and shorten with each cell division',
            'They repair damaged DNA',
            'They produce enzymes that break down cellular waste',
            'They regulate the cell cycle'
          ],
          correctAnswer: 0,
          explanation: 'Telomeres are repetitive DNA sequences at the ends of chromosomes that protect the chromosome from deterioration. They shorten with each cell division, and when they become too short, the cell can no longer divide and becomes senescent or dies, contributing to aging.',
          subject: subject.id,
          difficulty: difficulty
        },
        {
          question: 'What is the significance of the Higgs boson in particle physics?',
          options: [
            'It explains the origin of the universe',
            'It is responsible for the strong nuclear force',
            'It gives mass to elementary particles',
            'It is the smallest known particle'
          ],
          correctAnswer: 2,
          explanation: 'The Higgs boson is an elementary particle associated with the Higgs field, which gives mass to other elementary particles. Its discovery in 2012 confirmed the Standard Model of particle physics.',
          subject: subject.id,
          difficulty: difficulty
        },
        {
          question: 'What is the principle behind nuclear magnetic resonance (NMR) spectroscopy?',
          options: [
            'It measures the absorption of infrared radiation by molecules',
            'It detects the magnetic properties of atomic nuclei in a magnetic field',
            'It analyzes the scattering of X-rays by crystals',
            'It measures the emission of electrons from a surface'
          ],
          correctAnswer: 1,
          explanation: 'Nuclear magnetic resonance (NMR) spectroscopy is based on the magnetic properties of certain atomic nuclei. When placed in a strong magnetic field, these nuclei absorb and re-emit electromagnetic radiation at specific frequencies, which can be used to determine the structure of molecules.',
          subject: subject.id,
          difficulty: difficulty
        }
      ]
    };
    
    // Return a random question from the appropriate difficulty level
    const difficultyQuestions = questions[difficulty] || [];
    const randomIndex = Math.floor(Math.random() * difficultyQuestions.length);
    return difficultyQuestions[randomIndex];
  },
  
  history: (subject, difficulty) => {
    const questions = {
      beginner: [
        {
          question: 'Who was the first President of the United States?',
          options: ['Thomas Jefferson', 'George Washington', 'Abraham Lincoln', 'John Adams'],
          correctAnswer: 1,
          explanation: 'George Washington was the first President of the United States, serving from 1789 to 1797.',
          subject: subject.id,
          difficulty: difficulty
        },
        {
          question: 'In which year did World War II end?',
          options: ['1943', '1945', '1947', '1950'],
          correctAnswer: 1,
          explanation: 'World War II ended in 1945 with the surrender of Germany in May and Japan in September.',
          subject: subject.id,
          difficulty: difficulty
        },
        {
          question: 'Which ancient civilization built the pyramids at Giza?',
          options: ['Romans', 'Greeks', 'Egyptians', 'Mayans'],
          correctAnswer: 2,
          explanation: 'The ancient Egyptians built the pyramids at Giza, with the Great Pyramid being constructed around 2560 BCE.',
          subject: subject.id,
          difficulty: difficulty
        },
        {
          question: 'Who wrote the Declaration of Independence?',
          options: ['George Washington', 'Thomas Jefferson', 'Benjamin Franklin', 'John Adams'],
          correctAnswer: 1,
          explanation: 'Thomas Jefferson was the principal author of the Declaration of Independence, which was adopted on July 4, 1776.',
          subject: subject.id,
          difficulty: difficulty
        },
        {
          question: 'What was the name of the ship that brought the Pilgrims to America in 1620?',
          options: ['Santa Maria', 'Mayflower', 'Nina', 'Discovery'],
          correctAnswer: 1,
          explanation: 'The Mayflower brought the Pilgrims from England to Plymouth, Massachusetts in 1620.',
          subject: subject.id,
          difficulty: difficulty
        },
        {
          question: 'Which country was the first to send a human to space?',
          options: ['United States', 'Soviet Union (Russia)', 'China', 'United Kingdom'],
          correctAnswer: 1,
          explanation: 'The Soviet Union was the first country to send a human to space when Yuri Gagarin orbited Earth on April 12, 1961.',
          subject: subject.id,
          difficulty: difficulty
        },
        {
          question: 'What event marked the beginning of World War I?',
          options: ['The bombing of Pearl Harbor', 'The assassination of Archduke Franz Ferdinand', 'The invasion of Poland', 'The sinking of the Lusitania'],
          correctAnswer: 1,
          explanation: 'The assassination of Archduke Franz Ferdinand of Austria in Sarajevo on June 28, 1914, is considered the event that triggered World War I.',
          subject: subject.id,
          difficulty: difficulty
        },
        {
          question: 'Which civilization built Machu Picchu?',
          options: ['Aztec', 'Maya', 'Inca', 'Olmec'],
          correctAnswer: 2,
          explanation: 'Machu Picchu was built by the Inca civilization in the 15th century.',
          subject: subject.id,
          difficulty: difficulty
        },
        {
          question: 'Who was the first woman to fly solo across the Atlantic Ocean?',
          options: ['Amelia Earhart', 'Bessie Coleman', 'Harriet Quimby', 'Jacqueline Cochran'],
          correctAnswer: 0,
          explanation: 'Amelia Earhart was the first woman to fly solo across the Atlantic Ocean in 1932.',
          subject: subject.id,
          difficulty: difficulty
        },
        {
          question: 'Which U.S. President delivered the Gettysburg Address?',
          options: ['Thomas Jefferson', 'Abraham Lincoln', 'George Washington', 'Franklin D. Roosevelt'],
          correctAnswer: 1,
          explanation: 'Abraham Lincoln delivered the Gettysburg Address on November 19, 1863, during the American Civil War.',
          subject: subject.id,
          difficulty: difficulty
        }
      ],
      intermediate: [
        {
          question: 'What was the name of the peace treaty that ended World War I?',
          options: ['Treaty of Versailles', 'Treaty of Paris', 'Treaty of Westphalia', 'Treaty of Tordesillas'],
          correctAnswer: 0,
          explanation: 'The Treaty of Versailles, signed on June 28, 1919, formally ended World War I between Germany and the Allied Powers.',
          subject: subject.id,
          difficulty: difficulty
        },
        {
          question: 'Which empire was ruled by Genghis Khan?',
          options: ['Ottoman Empire', 'Roman Empire', 'Mongol Empire', 'Byzantine Empire'],
          correctAnswer: 2,
          explanation: 'Genghis Khan founded and ruled the Mongol Empire, which became the largest contiguous land empire in history.',
          subject: subject.id,
          difficulty: difficulty
        },
        {
          question: 'What was the main cause of the French Revolution?',
          options: ['Foreign invasion', 'Religious conflict', 'Social and economic inequality', 'Territorial disputes'],
          correctAnswer: 2,
          explanation: 'The French Revolution was primarily caused by social and economic inequality, with the Third Estate (common people) bearing most of the tax burden while the nobility and clergy enjoyed privileges.',
          subject: subject.id,
          difficulty: difficulty
        },
        {
          question: 'Which civilization developed the first known system of writing?',
          options: ['Egyptians', 'Sumerians', 'Chinese', 'Greeks'],
          correctAnswer: 1,
          explanation: 'The Sumerians developed the first known writing system called cuneiform around 3200 BCE in Mesopotamia (modern-day Iraq).',
          subject: subject.id,
          difficulty: difficulty
        },
        {
          question: 'What was the significance of the Magna Carta?',
          options: ['It established the first democratic government', 'It limited the power of the monarch', 'It abolished slavery', 'It created the first standing army'],
          correctAnswer: 1,
          explanation: 'The Magna Carta, signed in 1215, limited the power of the English monarch and established that everyone, including the king, was subject to the law.',
          subject: subject.id,
          difficulty: difficulty
        },
        {
          question: 'Which country did NOT participate in the colonization of Africa during the "Scramble for Africa"?',
          options: ['Germany', 'Belgium', 'Japan', 'Portugal'],
          correctAnswer: 2,
          explanation: 'Japan did not participate in the colonization of Africa during the "Scramble for Africa" in the late 19th century. The main European powers involved were Britain, France, Germany, Belgium, Italy, Portugal, and Spain.',
          subject: subject.id,
          difficulty: difficulty
        },
        {
          question: 'What was the primary goal of the Marshall Plan?',
          options: ['To rebuild Western Europe after World War II', 'To contain the spread of communism in Asia', 'To establish NATO', 'To develop nuclear weapons'],
          correctAnswer: 0,
          explanation: 'The Marshall Plan (officially the European Recovery Program) was an American initiative to aid Western Europe in rebuilding their economies after World War II.',
          subject: subject.id,
          difficulty: difficulty
        },
        {
          question: 'Which of these was NOT one of the original 13 American colonies?',
          options: ['Georgia', 'Vermont', 'Massachusetts', 'Virginia'],
          correctAnswer: 1,
          explanation: 'Vermont was not one of the original 13 American colonies. It became the 14th state in 1791.',
          subject: subject.id,
          difficulty: difficulty
        },
        {
          question: 'Who was the leader of the Soviet Union during most of World War II?',
          options: ['Vladimir Lenin', 'Joseph Stalin', 'Nikita Khrushchev', 'Leon Trotsky'],
          correctAnswer: 1,
          explanation: 'Joseph Stalin was the leader of the Soviet Union during most of World War II, from the German invasion in 1941 until the end of the war in 1945.',
          subject: subject.id,
          difficulty: difficulty
        },
        {
          question: 'What was the name of the economic policy implemented by Deng Xiaoping in China?',
          options: ['Great Leap Forward', 'Cultural Revolution', 'Reform and Opening-up', 'Five-Year Plan'],
          correctAnswer: 2,
          explanation: 'Deng Xiaoping implemented the "Reform and Opening-up" policy in China starting in 1978, which introduced market principles and opened China to foreign investment and trade.',
          subject: subject.id,
          difficulty: difficulty
        }
      ],
      advanced: [
        {
          question: 'Which of the following was NOT a cause of the collapse of the Western Roman Empire?',
          options: ['Germanic invasions', 'Economic troubles', 'Reliance on slave labor', 'The rise of Islam'],
          correctAnswer: 3,
          explanation: 'The rise of Islam occurred in the 7th century CE, after the Western Roman Empire had already fallen in 476 CE. The other factors—Germanic invasions, economic troubles, and reliance on slave labor—all contributed to the empire\'s collapse.',
          subject: subject.id,
          difficulty: difficulty
        },
        {
          question: 'What was the significance of the Treaty of Westphalia (1648)?',
          options: ['It ended the Hundred Years\' War', 'It established the principle of state sovereignty', 'It divided the New World between Spain and Portugal', 'It created the League of Nations'],
          correctAnswer: 1,
          explanation: 'The Treaty of Westphalia ended the Thirty Years\' War and established the principle of state sovereignty, which became a fundamental concept in international relations and is considered the beginning of the modern international system.',
          subject: subject.id,
          difficulty: difficulty
        },
        {
          question: 'Which of these was NOT a result of the Industrial Revolution?',
          options: ['Urbanization', 'Increased standard of living (long-term)', 'Decline in global trade', 'Environmental pollution'],
          correctAnswer: 2,
          explanation: 'The Industrial Revolution actually led to a significant increase in global trade, not a decline. The other options—urbanization, increased standard of living (in the long term), and environmental pollution—were all consequences of industrialization.',
          subject: subject.id,
          difficulty: difficulty
        },
        {
          question: 'What was the primary cause of the Opium Wars between Britain and China?',
          options: ['Territorial disputes', 'Religious differences', 'Trade imbalance and British desire to sell opium to China', 'Diplomatic insults'],
          correctAnswer: 2,
          explanation: 'The primary cause of the Opium Wars (1839-1842 and 1856-1860) was Britain\'s desire to address its trade imbalance with China by selling opium, which China had prohibited. Britain wanted to force China to accept the opium trade and open more ports to foreign trade.',
          subject: subject.id,
          difficulty: difficulty
        },
        {
          question: 'Which philosophical movement most influenced the French Revolution?',
          options: ['Romanticism', 'The Enlightenment', 'Existentialism', 'Scholasticism'],
          correctAnswer: 1,
          explanation: 'The Enlightenment, with its emphasis on reason, liberty, progress, and constitutional government, significantly influenced the ideological foundations of the French Revolution.',
          subject: subject.id,
          difficulty: difficulty
        },
        {
          question: 'What was the significance of the Battle of Dien Bien Phu (1954)?',
          options: ['It marked the beginning of the Vietnam War', 'It led to the division of Korea', 'It ended French colonial rule in Vietnam', 'It established communist control over China'],
          correctAnswer: 2,
          explanation: 'The Battle of Dien Bien Phu was a decisive victory for the Viet Minh over French forces, which led to the Geneva Accords and effectively ended French colonial rule in Vietnam.',
          subject: subject.id,
          difficulty: difficulty
        },
        {
          question: 'Which of these was NOT a factor in the rise of fascism in Europe after World War I?',
          options: ['Economic depression', 'Fear of communism', 'Strong democratic institutions', 'Nationalism'],
          correctAnswer: 2,
          explanation: 'Strong democratic institutions would have prevented the rise of fascism, not contributed to it. The other factors—economic depression, fear of communism, and nationalism—all played significant roles in fascism\'s rise in Europe after World War I.',
          subject: subject.id,
          difficulty: difficulty
        },
        {
          question: 'What was the primary goal of the Non-Aligned Movement during the Cold War?',
          options: ['To support the Soviet Union', 'To support the United States', 'To remain neutral in the Cold War', 'To promote nuclear disarmament'],
          correctAnswer: 2,
          explanation: 'The Non-Aligned Movement, formally established in 1961, aimed to ensure that member countries remained neutral and did not become aligned with either the United States or the Soviet Union during the Cold War.',
          subject: subject.id,
          difficulty: difficulty
        },
        {
          question: 'Which of these best describes the policy of containment during the Cold War?',
          options: ['Preventing the spread of communism', 'Building nuclear fallout shelters', 'Establishing diplomatic relations with communist countries', 'Promoting free trade'],
          correctAnswer: 0,
          explanation: 'Containment was the U.S. policy of preventing the spread of communism to new countries, rather than attempting to roll back communism where it already existed.',
          subject: subject.id,
          difficulty: difficulty
        },
        {
          question: 'What was the main cause of the Peloponnesian War in ancient Greece?',
          options: ['Religious differences', 'Spartan fear of growing Athenian power', 'Persian invasion', 'Dispute over trade routes'],
          correctAnswer: 1,
          explanation: 'The main cause of the Peloponnesian War (431-404 BCE) was Spartan fear of growing Athenian power and influence in the Greek world, which threatened Sparta\'s position.',
          subject: subject.id,
          difficulty: difficulty
        }
      ]
    };
    
    // Return a random question from the appropriate difficulty level
    const difficultyQuestions = questions[difficulty] || [];
    const randomIndex = Math.floor(Math.random() * difficultyQuestions.length);
    return difficultyQuestions[randomIndex];
  },
  
  literature: (subject, difficulty) => {
    const questions = {
      beginner: [
        {
          question: 'Who wrote "Romeo and Juliet"?',
          options: ['Charles Dickens', 'William Shakespeare', 'Jane Austen', 'Mark Twain'],
          correctAnswer: 1,
          explanation: 'William Shakespeare wrote "Romeo and Juliet" around 1595.',
          subject: subject.id,
          difficulty: difficulty
        },
        {
          question: 'Which of these is NOT one of the March sisters in "Little Women"?',
          options: ['Jo', 'Beth', 'Amy', 'Emma'],
          correctAnswer: 3,
          explanation: 'The four March sisters in Louisa May Alcott\'s "Little Women" are Meg, Jo, Beth, and Amy. Emma is not one of them.',
          subject: subject.id,
          difficulty: difficulty
        },
        {
          question: 'Who is the author of "The Great Gatsby"?',
          options: ['Ernest Hemingway', 'F. Scott Fitzgerald', 'John Steinbeck', 'William Faulkner'],
          correctAnswer: 1,
          explanation: 'F. Scott Fitzgerald wrote "The Great Gatsby," which was published in 1925.',
          subject: subject.id,
          difficulty: difficulty
        },
        {
          question: 'What is the name of the wizard school in the Harry Potter series?',
          options: ['Beauxbatons', 'Durmstrang', 'Hogwarts', 'Ilvermorny'],
          correctAnswer: 2,
          explanation: 'Hogwarts School of Witchcraft and Wizardry is the main setting for most of the Harry Potter series.',
          subject: subject.id,
          difficulty: difficulty
        },
        {
          question: 'Who wrote "To Kill a Mockingbird"?',
          options: ['Harper Lee', 'J.D. Salinger', 'Toni Morrison', 'John Steinbeck'],
          correctAnswer: 0,
          explanation: 'Harper Lee wrote "To Kill a Mockingbird," which was published in 1960.',
          subject: subject.id,
          difficulty: difficulty
        },
        {
          question: 'Which of these is NOT a play by William Shakespeare?',
          options: ['Hamlet', 'Macbeth', 'Moby Dick', 'Othello'],
          correctAnswer: 2,
          explanation: '"Moby Dick" is a novel by Herman Melville, not a play by William Shakespeare.',
          subject: subject.id,
          difficulty: difficulty
        },
        {
          question: 'Who wrote "Pride and Prejudice"?',
          options: ['Jane Austen', 'Charlotte Brontë', 'Emily Brontë', 'Virginia Woolf'],
          correctAnswer: 0,
          explanation: 'Jane Austen wrote "Pride and Prejudice," which was published in 1813.',
          subject: subject.id,
          difficulty: difficulty
        },
        {
          question: 'What is the name of the main character in "The Catcher in the Rye"?',
          options: ['Holden Caulfield', 'Jay Gatsby', 'Atticus Finch', 'Winston Smith'],
          correctAnswer: 0,
          explanation: 'Holden Caulfield is the main character and narrator of J.D. Salinger\'s "The Catcher in the Rye."',
          subject: subject.id,
          difficulty: difficulty
        },
        {
          question: 'Which novel begins with the line "It was the best of times, it was the worst of times"?',
          options: ['Great Expectations', 'Oliver Twist', 'A Tale of Two Cities', 'David Copperfield'],
          correctAnswer: 2,
          explanation: 'Charles Dickens\' "A Tale of Two Cities" begins with this famous opening line.',
          subject: subject.id,
          difficulty: difficulty
        },
        {
          question: 'Who wrote "The Odyssey"?',
          options: ['Virgil', 'Homer', 'Sophocles', 'Plato'],
          correctAnswer: 1,
          explanation: 'Homer is credited with writing "The Odyssey," an ancient Greek epic poem.',
          subject: subject.id,
          difficulty: difficulty
        }
      ],
      intermediate: [
        {
          question: 'Which literary movement was characterized by an emphasis on emotion, individualism, and glorification of nature?',
          options: ['Realism', 'Romanticism', 'Modernism', 'Naturalism'],
          correctAnswer: 1,
          explanation: 'Romanticism, which emerged in the late 18th century, emphasized emotion, individualism, and the glorification of nature and the past, particularly the medieval.',
          subject: subject.id,
          difficulty: difficulty
        },
        {
          question: 'Who wrote "One Hundred Years of Solitude"?',
          options: ['Jorge Luis Borges', 'Gabriel García Márquez', 'Isabel Allende', 'Julio Cortázar'],
          correctAnswer: 1,
          explanation: 'Gabriel García Márquez wrote "One Hundred Years of Solitude," which was published in 1967 and is considered a landmark of magical realism.',
          subject: subject.id,
          difficulty: difficulty
        },
        {
          question: 'Which of these works is an example of dystopian fiction?',
          options: ['Pride and Prejudice', 'The Great Gatsby', '1984', 'The Canterbury Tales'],
          correctAnswer: 2,
          explanation: 'George Orwell\'s "1984" is a classic example of dystopian fiction, depicting a totalitarian society.',
          subject: subject.id,
          difficulty: difficulty
        },
        {
          question: 'What is the significance of the green light in "The Great Gatsby"?',
          options: ['It represents wealth', 'It symbolizes Gatsby\'s dream and hope', 'It indicates danger', 'It represents jealousy'],
          correctAnswer: 1,
          explanation: 'The green light at the end of Daisy\'s dock symbolizes Gatsby\'s hopes and dreams for the future, particularly his dream of being with Daisy.',
          subject: subject.id,
          difficulty: difficulty
        },
        {
          question: 'Which of these is NOT one of the themes in "To Kill a Mockingbird"?',
          options: ['Racial injustice', 'Coming of age', 'The coexistence of good and evil', 'The American Dream'],
          correctAnswer: 3,
          explanation: 'While "To Kill a Mockingbird" explores themes of racial injustice, coming of age, and the coexistence of good and evil, the American Dream is not a central theme in the novel.',
          subject: subject.id,
          difficulty: difficulty
        },
        {
          question: 'Who wrote "Things Fall Apart"?',
          options: ['Chinua Achebe', 'Wole Soyinka', 'Ngũgĩ wa Thiong\'o', 'Ben Okri'],
          correctAnswer: 0,
          explanation: 'Chinua Achebe wrote "Things Fall Apart," which was published in 1958 and is considered a landmark of African literature.',
          subject: subject.id,
          difficulty: difficulty
        },
        {
          question: 'Which literary device involves a contradiction in terms?',
          options: ['Metaphor', 'Simile', 'Oxymoron', 'Alliteration'],
          correctAnswer: 2,
          explanation: 'An oxymoron is a figure of speech that combines contradictory terms, such as "jumbo shrimp" or "deafening silence."',
          subject: subject.id,
          difficulty: difficulty
        },
        {
          question: 'What is the setting of "The Lord of the Rings"?',
          options: ['Narnia', 'Middle-earth', 'Westeros', 'Earthsea'],
          correctAnswer: 1,
          explanation: 'J.R.R. Tolkien\'s "The Lord of the Rings" is set in the fictional world of Middle-earth.',
          subject: subject.id,
          difficulty: difficulty
        },
        {
          question: 'Which of these is a characteristic of modernist literature?',
          options: ['Linear narratives', 'Emphasis on religion', 'Experimentation with form', 'Idealization of nature'],
          correctAnswer: 2,
          explanation: 'Modernist literature, which emerged in the late 19th and early 20th centuries, is characterized by experimentation with form, stream-of-consciousness narration, and a break from traditional narrative structures.',
          subject: subject.id,
          difficulty: difficulty
        },
        {
          question: 'Who wrote "Beloved"?',
          options: ['Alice Walker', 'Toni Morrison', 'Maya Angelou', 'Zora Neale Hurston'],
          correctAnswer: 1,
          explanation: 'Toni Morrison wrote "Beloved," which was published in 1987 and won the Pulitzer Prize for Fiction.',
          subject: subject.id,
          difficulty: difficulty
        }
      ],
      advanced: [
        {
          question: 'Which literary theory focuses on the reader\'s interpretation and experience of a text rather than the author\'s intentions?',
          options: ['New Criticism', 'Reader-response criticism', 'Structuralism', 'Deconstruction'],
          correctAnswer: 1,
          explanation: 'Reader-response criticism focuses on the reader\'s interpretation and experience of a text, emphasizing that meaning is created through the interaction between the reader and the text, rather than being inherent in the text or determined by the author\'s intentions.',
          subject: subject.id,
          difficulty: difficulty
        },
        {
          question: 'Which of these works is an example of the Theatre of the Absurd?',
          options: ['Death of a Salesman', 'A Streetcar Named Desire', 'Waiting for Godot', 'The Crucible'],
          correctAnswer: 2,
          explanation: 'Samuel Beckett\'s "Waiting for Godot" is a classic example of the Theatre of the Absurd, which emerged in the mid-20th century and is characterized by seemingly meaningless actions, nonsensical dialogue, and a lack of traditional plot structure.',
          subject: subject.id,
          difficulty: difficulty
        },
        {
          question: 'What is the significance of the character Tiresias in T.S. Eliot\'s "The Waste Land"?',
          options: ['He represents the modern man', 'He symbolizes religious faith', 'He is a figure of wisdom who transcends time and gender', 'He represents the failure of communication'],
          correctAnswer: 2,
          explanation: 'In "The Waste Land," Tiresias, a blind prophet from Greek mythology who has lived as both a man and a woman, represents a figure of wisdom who transcends time and gender. Eliot describes him as "the most important personage in the poem, uniting all the rest."',
          subject: subject.id,
          difficulty: difficulty
        },
        {
          question: 'Which of these is NOT a characteristic of postmodern literature?',
          options: ['Metafiction', 'Intertextuality', 'Magical realism', 'Emphasis on objective reality'],
          correctAnswer: 3,
          explanation: 'Postmodern literature typically questions or rejects the notion of objective reality, rather than emphasizing it. Postmodernism is characterized by skepticism, subjectivity, and a questioning of grand narratives and universal truths.',
          subject: subject.id,
          difficulty: difficulty
        },
        {
          question: 'Which literary movement was characterized by a focus on ordinary people and realistic depictions of everyday life?',
          options: ['Romanticism', 'Realism', 'Symbolism', 'Surrealism'],
          correctAnswer: 1,
          explanation: 'Realism, which emerged in the mid-19th century, focused on depicting ordinary people and everyday life accurately and objectively, rejecting the idealization characteristic of Romanticism.',
          subject: subject.id,
          difficulty: difficulty
        },
        {
          question: 'What is the significance of the character Kurtz in Joseph Conrad\'s "Heart of Darkness"?',
          options: ['He represents European imperialism and its moral corruption', 'He symbolizes the noble savage', 'He represents the triumph of civilization over wilderness', 'He is a symbol of religious redemption'],
          correctAnswer: 0,
          explanation: 'Kurtz in "Heart of Darkness" represents European imperialism and its moral corruption. Initially sent to Africa as part of the "civilizing mission," he becomes corrupted by power and the wilderness, revealing the darkness within the supposedly civilized European colonial enterprise.',
          subject: subject.id,
          difficulty: difficulty
        },
        {
          question: 'Which of these works is an example of the stream of consciousness narrative technique?',
          options: ['The Old Man and the Sea', 'Mrs. Dalloway', 'The Scarlet Letter', 'Jane Eyre'],
          correctAnswer: 1,
          explanation: 'Virginia Woolf\'s "Mrs. Dalloway" is a classic example of the stream of consciousness narrative technique, which attempts to depict the flow of thoughts, feelings, and sensations in the mind of a character.',
          subject: subject.id,
          difficulty: difficulty
        },
        {
          question: 'What is the concept of "the death of the author" in literary theory?',
          options: ['The idea that an author\'s biography is irrelevant to understanding their work', 'The theory that the meaning of a text is determined solely by its historical context', 'The notion that the author\'s intended meaning is less important than the reader\'s interpretation', 'The concept that literature should focus on deceased authors'],
          correctAnswer: 2,
          explanation: 'The concept of "the death of the author," introduced by Roland Barthes, suggests that the meaning of a text is not determined by the author\'s intentions but is created through the reader\'s interpretation. It argues against using an author\'s identity or biography to interpret their work.',
          subject: subject.id,
          difficulty: difficulty
        },
        {
          question: 'Which of these is a characteristic of magical realism?',
          options: ['Emphasis on psychological realism', 'Incorporation of fantastic elements into an otherwise realistic setting', 'Focus on supernatural horror', 'Rejection of narrative structure'],
          correctAnswer: 1,
          explanation: 'Magical realism incorporates fantastic or magical elements into an otherwise realistic setting. Unlike pure fantasy, magical realist works present these elements as a natural part of reality, not requiring explanation or surprise from characters.',
          subject: subject.id,
          difficulty: difficulty
        },
        {
          question: 'What is the significance of the character Godot in Samuel Beckett\'s "Waiting for Godot"?',
          options: ['He represents God', 'He symbolizes death', 'He is an ambiguous figure whose absence structures the play', 'He represents the meaninglessness of existence'],
          correctAnswer: 2,
          explanation: 'Godot in "Waiting for Godot" is an ambiguous figure who never appears in the play. His absence structures the entire narrative as the characters wait for him, leading to various interpretations: he may represent God, meaning, hope, or something else entirely. Beckett himself refused to provide a definitive interpretation.',
          subject: subject.id,
          difficulty: difficulty
        }
      ]
    };
    
    // Return a random question from the appropriate difficulty level
    const difficultyQuestions = questions[difficulty] || [];
    const randomIndex = Math.floor(Math.random() * difficultyQuestions.length);
    return difficultyQuestions[randomIndex];
  },
  
  // Default question generator for other subjects
  default: (subject, difficulty) => {
    return {
      question: `Sample ${subject.name} question (${difficulty} level)`,
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      correctAnswer: 0,
      explanation: 'This is a sample explanation for the correct answer.',
      subject: subject.id,
      difficulty: difficulty
    };
  }
};

// Run the script
generateQuestions().then(() => {
  console.log('Script completed successfully!');
  process.exit(0);
}).catch(error => {
  console.error('Error:', error);
  process.exit(1);
});