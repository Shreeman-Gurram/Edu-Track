const mongoose = require('mongoose');
require('dotenv').config();

const Question = require('../models/Question');

const questions = [

  {
    questionText: 'What is the zero of the polynomial p(x) = x - 5?',
    grade: '10',
    subject: 'Mathematics',
    topic: 'Polynomials',
    concept: 'Zeroes of Polynomials',
    options: [
      { text: '3', value: '3' },
      { text: '5', value: '5' },
      { text: '-5', value: '-5' },
      { text: '0', value: '0' }
    ],
    correctAnswer: '5',
    difficulty: 'easy'
  },

  {
    questionText: 'If p(x) = 2x + 6, what is its zero?',
    grade: '10',
    subject: 'Mathematics',
    topic: 'Polynomials',
    concept: 'Zeroes of Polynomials',
    options: [
      { text: '3', value: '3' },
      { text: '-3', value: '-3' },
      { text: '6', value: '6' },
      { text: '-6', value: '-6' }
    ],
    correctAnswer: '-3',
    difficulty: 'easy'
  },

  {
    questionText: 'The graph of a polynomial intersects the x-axis at how many points if it has two distinct zeroes?',
    grade: '10',
    subject: 'Mathematics',
    topic: 'Polynomials',
    concept: 'Geometrical Meaning of Zeroes',
    options: [
      { text: '0', value: '0' },
      { text: '1', value: '1' },
      { text: '2', value: '2' },
      { text: '3', value: '3' }
    ],
    correctAnswer: '2',
    difficulty: 'easy'
  },

  {
    questionText: 'If the zeroes of x² - 5x + 6 are 2 and 3, what is their sum?',
    grade: '10',
    subject: 'Mathematics',
    topic: 'Polynomials',
    concept: 'Relationship Between Zeroes and Coefficients',
    options: [
      { text: '1', value: '1' },
      { text: '5', value: '5' },
      { text: '6', value: '6' },
      { text: '-5', value: '-5' }
    ],
    correctAnswer: '5',
    difficulty: 'easy'
  },

  {
    questionText: 'For the quadratic polynomial ax² + bx + c, the sum of zeroes is:',
    grade: '10',
    subject: 'Mathematics',
    topic: 'Polynomials',
    concept: 'Relationship Between Zeroes and Coefficients',
    options: [
      { text: 'b/a', value: 'b/a' },
      { text: '-b/a', value: '-b/a' },
      { text: 'c/a', value: 'c/a' },
      { text: '-c/a', value: '-c/a' }
    ],
    correctAnswer: '-b/a',
    difficulty: 'medium'
  },

  {
    questionText: 'For the polynomial 3x² - 7x + 2, what is the product of its zeroes?',
    grade: '10',
    subject: 'Mathematics',
    topic: 'Polynomials',
    concept: 'Relationship Between Zeroes and Coefficients',
    options: [
      { text: '2/3', value: '2/3' },
      { text: '-2/3', value: '-2/3' },
      { text: '7/3', value: '7/3' },
      { text: '-7/3', value: '-7/3' }
    ],
    correctAnswer: '2/3',
    difficulty: 'medium'
  },

  {
    questionText: 'If the zeroes of x² + px + 12 are 3 and 4, what is the value of p?',
    grade: '10',
    subject: 'Mathematics',
    topic: 'Polynomials',
    concept: 'Relationship Between Zeroes and Coefficients',
    options: [
      { text: '7', value: '7' },
      { text: '-7', value: '-7' },
      { text: '12', value: '12' },
      { text: '-12', value: '-12' }
    ],
    correctAnswer: '-7',
    difficulty: 'medium'
  },

  {
    questionText: 'If one zero of the polynomial 2x² + 5x + k is -1, find k.',
    grade: '10',
    subject: 'Mathematics',
    topic: 'Polynomials',
    concept: 'Zeroes of Polynomials',
    options: [
      { text: '3', value: '3' },
      { text: '7', value: '7' },
      { text: '-3', value: '-3' },
      { text: '-7', value: '-7' }
    ],
    correctAnswer: '3',
    difficulty: 'medium'
  },

  {
    questionText: 'If the zeroes of a quadratic polynomial are equal, what is the geometrical meaning of its graph?',
    grade: '10',
    subject: 'Mathematics',
    topic: 'Polynomials',
    concept: 'Geometrical Meaning of Zeroes',
    options: [
      { text: 'It does not meet the x-axis', value: 'It does not meet the x-axis' },
      { text: 'It touches the x-axis at one point', value: 'It touches the x-axis at one point' },
      { text: 'It crosses the x-axis at two points', value: 'It crosses the x-axis at two points' },
      { text: 'It is a straight line', value: 'It is a straight line' }
    ],
    correctAnswer: 'It touches the x-axis at one point',
    difficulty: 'hard'
  },

  {
    questionText: 'If α and β are the zeroes of 2x² - 5x + 3, find α² + β².',
    grade: '10',
    subject: 'Mathematics',
    topic: 'Polynomials',
    concept: 'Relationship Between Zeroes and Coefficients',
    options: [
      { text: '13/4', value: '13/4' },
      { text: '25/4', value: '25/4' },
      { text: '7/4', value: '7/4' },
      { text: '1/4', value: '1/4' }
    ],
    correctAnswer: '13/4',
    difficulty: 'hard'
  },


  // =====================================================
  // CHAPTER 4 - PAIR OF LINEAR EQUATIONS (10)
  // =====================================================

  {
    questionText: 'What is the degree of a linear equation in two variables?',
    grade: '10',
    subject: 'Mathematics',
    topic: 'Pair of Linear Equations in Two Variables',
    concept: 'Graphical Method',
    options: [
      { text: '1', value: '1' },
      { text: '2', value: '2' },
      { text: '3', value: '3' },
      { text: '0', value: '0' }
    ],
    correctAnswer: '1',
    difficulty: 'easy'
  },

  {
    questionText: 'The graph of a linear equation in two variables is a:',
    grade: '10',
    subject: 'Mathematics',
    topic: 'Pair of Linear Equations in Two Variables',
    concept: 'Graphical Method',
    options: [
      { text: 'Circle', value: 'Circle' },
      { text: 'Parabola', value: 'Parabola' },
      { text: 'Straight line', value: 'Straight line' },
      { text: 'Ellipse', value: 'Ellipse' }
    ],
    correctAnswer: 'Straight line',
    difficulty: 'easy'
  },

  {
    questionText: 'The solution of a pair of linear equations represents the point where their graphs:',
    grade: '10',
    subject: 'Mathematics',
    topic: 'Pair of Linear Equations in Two Variables',
    concept: 'Graphical Method',
    options: [
      { text: 'Are parallel', value: 'Are parallel' },
      { text: 'Intersect', value: 'Intersect' },
      { text: 'Do not exist', value: 'Do not exist' },
      { text: 'Become circles', value: 'Become circles' }
    ],
    correctAnswer: 'Intersect',
    difficulty: 'easy'
  },

  {
    questionText: 'Solve: x + y = 7 and x - y = 1.',
    grade: '10',
    subject: 'Mathematics',
    topic: 'Pair of Linear Equations in Two Variables',
    concept: 'Algebraic Method',
    options: [
      { text: '(3, 4)', value: '(3, 4)' },
      { text: '(4, 3)', value: '(4, 3)' },
      { text: '(5, 2)', value: '(5, 2)' },
      { text: '(2, 5)', value: '(2, 5)' }
    ],
    correctAnswer: '(4, 3)',
    difficulty: 'easy'
  },

  {
    questionText: 'Solve: 2x + y = 8 and x + y = 5.',
    grade: '10',
    subject: 'Mathematics',
    topic: 'Pair of Linear Equations in Two Variables',
    concept: 'Algebraic Method',
    options: [
      { text: '(3, 2)', value: '(3, 2)' },
      { text: '(2, 3)', value: '(2, 3)' },
      { text: '(4, 1)', value: '(4, 1)' },
      { text: '(1, 4)', value: '(1, 4)' }
    ],
    correctAnswer: '(3, 2)',
    difficulty: 'easy'
  },

  {
    questionText: 'If two lines are parallel, the pair of linear equations has:',
    grade: '10',
    subject: 'Mathematics',
    topic: 'Pair of Linear Equations in Two Variables',
    concept: 'Graphical Method',
    options: [
      { text: 'Exactly one solution', value: 'Exactly one solution' },
      { text: 'No solution', value: 'No solution' },
      { text: 'Two solutions', value: 'Two solutions' },
      { text: 'Infinitely many solutions', value: 'Infinitely many solutions' }
    ],
    correctAnswer: 'No solution',
    difficulty: 'medium'
  },

  {
    questionText: 'If two lines coincide, the pair of equations has:',
    grade: '10',
    subject: 'Mathematics',
    topic: 'Pair of Linear Equations in Two Variables',
    concept: 'Graphical Method',
    options: [
      { text: 'No solution', value: 'No solution' },
      { text: 'One solution', value: 'One solution' },
      { text: 'Infinitely many solutions', value: 'Infinitely many solutions' },
      { text: 'Exactly two solutions', value: 'Exactly two solutions' }
    ],
    correctAnswer: 'Infinitely many solutions',
    difficulty: 'medium'
  },

  {
    questionText: 'Solve: 3x + 2y = 12 and x + y = 5.',
    grade: '10',
    subject: 'Mathematics',
    topic: 'Pair of Linear Equations in Two Variables',
    concept: 'Algebraic Method',
    options: [
      { text: '(2, 3)', value: '(2, 3)' },
      { text: '(3, 2)', value: '(3, 2)' },
      { text: '(4, 1)', value: '(4, 1)' },
      { text: '(1, 4)', value: '(1, 4)' }
    ],
    correctAnswer: '(2, 3)',
    difficulty: 'medium'
  },

  {
    questionText: 'For what value of k will the equations 2x + 3y = 5 and 4x + ky = 10 have infinitely many solutions?',
    grade: '10',
    subject: 'Mathematics',
    topic: 'Pair of Linear Equations in Two Variables',
    concept: 'Algebraic Method',
    options: [
      { text: '3', value: '3' },
      { text: '6', value: '6' },
      { text: '9', value: '9' },
      { text: '12', value: '12' }
    ],
    correctAnswer: '6',
    difficulty: 'hard'
  },

  {
    questionText: 'The equations 2x + 3y = 7 and 4x + 6y = 14 represent:',
    grade: '10',
    subject: 'Mathematics',
    topic: 'Pair of Linear Equations in Two Variables',
    concept: 'Graphical Method',
    options: [
      { text: 'Intersecting lines', value: 'Intersecting lines' },
      { text: 'Parallel lines', value: 'Parallel lines' },
      { text: 'Coincident lines', value: 'Coincident lines' },
      { text: 'Perpendicular lines', value: 'Perpendicular lines' }
    ],
    correctAnswer: 'Coincident lines',
    difficulty: 'hard'
  },


  // =====================================================
  // CHAPTER 5 - QUADRATIC EQUATIONS (10)
  // =====================================================

  {
    questionText: 'Which of the following is the standard form of a quadratic equation?',
    grade: '10',
    subject: 'Mathematics',
    topic: 'Quadratic Equations',
    concept: 'Standard Form',
    options: [
      { text: 'ax + b = 0', value: 'ax + b = 0' },
      { text: 'ax² + bx + c = 0', value: 'ax² + bx + c = 0' },
      { text: 'ax³ + bx² + c = 0', value: 'ax³ + bx² + c = 0' },
      { text: 'ax² + c = 1', value: 'ax² + c = 1' }
    ],
    correctAnswer: 'ax² + bx + c = 0',
    difficulty: 'easy'
  },

  {
    questionText: 'Solve x² - 5x + 6 = 0.',
    grade: '10',
    subject: 'Mathematics',
    topic: 'Quadratic Equations',
    concept: 'Solution by Factorization',
    options: [
      { text: '2, 3', value: '2, 3' },
      { text: '-2, -3', value: '-2, -3' },
      { text: '1, 6', value: '1, 6' },
      { text: '-1, -6', value: '-1, -6' }
    ],
    correctAnswer: '2, 3',
    difficulty: 'easy'
  },

  {
    questionText: 'What are the roots of x² - 9 = 0?',
    grade: '10',
    subject: 'Mathematics',
    topic: 'Quadratic Equations',
    concept: 'Solution by Factorization',
    options: [
      { text: '3, 3', value: '3, 3' },
      { text: '-3, -3', value: '-3, -3' },
      { text: '3, -3', value: '3, -3' },
      { text: '9, -9', value: '9, -9' }
    ],
    correctAnswer: '3, -3',
    difficulty: 'easy'
  },

  {
    questionText: 'For x² + 7x + 12 = 0, the roots are:',
    grade: '10',
    subject: 'Mathematics',
    topic: 'Quadratic Equations',
    concept: 'Solution by Factorization',
    options: [
      { text: '3 and 4', value: '3 and 4' },
      { text: '-3 and -4', value: '-3 and -4' },
      { text: '2 and 6', value: '2 and 6' },
      { text: '-2 and -6', value: '-2 and -6' }
    ],
    correctAnswer: '-3 and -4',
    difficulty: 'easy'
  },

  {
    questionText: 'The quadratic formula for ax² + bx + c = 0 is:',
    grade: '10',
    subject: 'Mathematics',
    topic: 'Quadratic Equations',
    concept: 'Quadratic Formula',
    options: [
      { text: '(-b ± √(b² - 4ac))/(2a)', value: '(-b ± √(b² - 4ac))/(2a)' },
      { text: '(b ± √(b² + 4ac))/(2a)', value: '(b ± √(b² + 4ac))/(2a)' },
      { text: '(-b ± √(b² + 4ac))/a', value: '(-b ± √(b² + 4ac))/a' },
      { text: '(b ± √(b² - 4ac))/a', value: '(b ± √(b² - 4ac))/a' }
    ],
    correctAnswer: '(-b ± √(b² - 4ac))/(2a)',
    difficulty: 'easy'
  },

  {
    questionText: 'Find the roots of x² - 4x + 3 = 0.',
    grade: '10',
    subject: 'Mathematics',
    topic: 'Quadratic Equations',
    concept: 'Solution by Factorization',
    options: [
      { text: '1 and 3', value: '1 and 3' },
      { text: '-1 and -3', value: '-1 and -3' },
      { text: '2 and 2', value: '2 and 2' },
      { text: '3 and 4', value: '3 and 4' }
    ],
    correctAnswer: '1 and 3',
    difficulty: 'medium'
  },

  {
    questionText: 'What is the discriminant of 2x² + 5x + 3 = 0?',
    grade: '10',
    subject: 'Mathematics',
    topic: 'Quadratic Equations',
    concept: 'Quadratic Formula',
    options: [
      { text: '1', value: '1' },
      { text: '25', value: '25' },
      { text: '49', value: '49' },
      { text: '1/4', value: '1/4' }
    ],
    correctAnswer: '1',
    difficulty: 'medium'
  },

  {
    questionText: 'If the discriminant of a quadratic equation is zero, its roots are:',
    grade: '10',
    subject: 'Mathematics',
    topic: 'Quadratic Equations',
    concept: 'Quadratic Formula',
    options: [
      { text: 'Real and distinct', value: 'Real and distinct' },
      { text: 'Real and equal', value: 'Real and equal' },
      { text: 'Not real', value: 'Not real' },
      { text: 'Always positive', value: 'Always positive' }
    ],
    correctAnswer: 'Real and equal',
    difficulty: 'medium'
  },

  {
    questionText: 'Solve 2x² - 7x + 3 = 0.',
    grade: '10',
    subject: 'Mathematics',
    topic: 'Quadratic Equations',
    concept: 'Quadratic Formula',
    options: [
      { text: '3 and 1/2', value: '3 and 1/2' },
      { text: '2 and 3', value: '2 and 3' },
      { text: '-3 and -1/2', value: '-3 and -1/2' },
      { text: '1 and 3/2', value: '1 and 3/2' }
    ],
    correctAnswer: '3 and 1/2',
    difficulty: 'hard'
  },

  {
    questionText: 'Solve x² + 6x + 5 = 0 using completing the square.',
    grade: '10',
    subject: 'Mathematics',
    topic: 'Quadratic Equations',
    concept: 'Completing the Square',
    options: [
      { text: '-1 and -5', value: '-1 and -5' },
      { text: '1 and 5', value: '1 and 5' },
      { text: '-2 and -4', value: '-2 and -4' },
      { text: '2 and 4', value: '2 and 4' }
    ],
    correctAnswer: '-1 and -5',
    difficulty: 'hard'
  },


  // =====================================================
  // CHAPTER 7 - COORDINATE GEOMETRY (10)
  // =====================================================

  {
    questionText: 'What is the distance between the points (0, 0) and (3, 4)?',
    grade: '10',
    subject: 'Mathematics',
    topic: 'Coordinate Geometry',
    concept: 'Distance Formula',
    options: [
      { text: '3', value: '3' },
      { text: '4', value: '4' },
      { text: '5', value: '5' },
      { text: '7', value: '7' }
    ],
    correctAnswer: '5',
    difficulty: 'easy'
  },

  {
    questionText: 'The distance formula between (x₁, y₁) and (x₂, y₂) is:',
    grade: '10',
    subject: 'Mathematics',
    topic: 'Coordinate Geometry',
    concept: 'Distance Formula',
    options: [
      { text: '√((x₂-x₁)²+(y₂-y₁)²)', value: '√((x₂-x₁)²+(y₂-y₁)²)' },
      { text: '(x₂-x₁)+(y₂-y₁)', value: '(x₂-x₁)+(y₂-y₁)' },
      { text: '√((x₂+x₁)²+(y₂+y₁)²)', value: '√((x₂+x₁)²+(y₂+y₁)²)' },
      { text: '(x₂-x₁)²+(y₂-y₁)²', value: '(x₂-x₁)²+(y₂-y₁)²' }
    ],
    correctAnswer: '√((x₂-x₁)²+(y₂-y₁)²)',
    difficulty: 'easy'
  },

  {
    questionText: 'What is the midpoint of (2, 4) and (6, 8)?',
    grade: '10',
    subject: 'Mathematics',
    topic: 'Coordinate Geometry',
    concept: 'Section Formula',
    options: [
      { text: '(4, 6)', value: '(4, 6)' },
      { text: '(3, 5)', value: '(3, 5)' },
      { text: '(8, 12)', value: '(8, 12)' },
      { text: '(2, 2)', value: '(2, 2)' }
    ],
    correctAnswer: '(4, 6)',
    difficulty: 'easy'
  },

  {
    questionText: 'What is the area of the triangle with vertices (0,0), (4,0), and (0,3)?',
    grade: '10',
    subject: 'Mathematics',
    topic: 'Coordinate Geometry',
    concept: 'Area of Triangle',
    options: [
      { text: '6 square units', value: '6 square units' },
      { text: '12 square units', value: '12 square units' },
      { text: '7 square units', value: '7 square units' },
      { text: '5 square units', value: '5 square units' }
    ],
    correctAnswer: '6 square units',
    difficulty: 'easy'
  },

  {
    questionText: 'The point dividing the line segment joining (2,3) and (8,9) internally in the ratio 1:1 is:',
    grade: '10',
    subject: 'Mathematics',
    topic: 'Coordinate Geometry',
    concept: 'Section Formula',
    options: [
      { text: '(5,6)', value: '(5,6)' },
      { text: '(3,5)', value: '(3,5)' },
      { text: '(6,5)', value: '(6,5)' },
      { text: '(4,6)', value: '(4,6)' }
    ],
    correctAnswer: '(5,6)',
    difficulty: 'medium'
  },

  {
    questionText: 'Find the distance between (-2, 3) and (4, 11).',
    grade: '10',
    subject: 'Mathematics',
    topic: 'Coordinate Geometry',
    concept: 'Distance Formula',
    options: [
      { text: '8', value: '8' },
      { text: '10', value: '10' },
      { text: '12', value: '12' },
      { text: '14', value: '14' }
    ],
    correctAnswer: '10',
    difficulty: 'medium'
  },

  {
    questionText: 'Find the area of the triangle with vertices (1,1), (4,1), and (1,5).',
    grade: '10',
    subject: 'Mathematics',
    topic: 'Coordinate Geometry',
    concept: 'Area of Triangle',
    options: [
      { text: '6 square units', value: '6 square units' },
      { text: '8 square units', value: '8 square units' },
      { text: '10 square units', value: '10 square units' },
      { text: '12 square units', value: '12 square units' }
    ],
    correctAnswer: '6 square units',
    difficulty: 'medium'
  },

  {
    questionText: 'A point divides the line joining (1,2) and (7,8) in the ratio 2:1. What are its coordinates?',
    grade: '10',
    subject: 'Mathematics',
    topic: 'Coordinate Geometry',
    concept: 'Section Formula',
    options: [
      { text: '(5,6)', value: '(5,6)' },
      { text: '(3,4)', value: '(3,4)' },
      { text: '(4,5)', value: '(4,5)' },
      { text: '(6,7)', value: '(6,7)' }
    ],
    correctAnswer: '(5,6)',
    difficulty: 'hard'
  },

  {
    questionText: 'If the distance between (x, 2) and (3, 6) is 5, what can x be?',
    grade: '10',
    subject: 'Mathematics',
    topic: 'Coordinate Geometry',
    concept: 'Distance Formula',
    options: [
      { text: '0 or 6', value: '0 or 6' },
      { text: '1 or 5', value: '1 or 5' },
      { text: '2 or 4', value: '2 or 4' },
      { text: '-1 or 7', value: '-1 or 7' }
    ],
    correctAnswer: '0 or 6',
    difficulty: 'hard'
  },

  {
    questionText: 'For what value of k are the points (2,3), (4,k), and (6,7) collinear?',
    grade: '10',
    subject: 'Mathematics',
    topic: 'Coordinate Geometry',
    concept: 'Area of Triangle',
    options: [
      { text: '4', value: '4' },
      { text: '5', value: '5' },
      { text: '6', value: '6' },
      { text: '7', value: '7' }
    ],
    correctAnswer: '5',
    difficulty: 'hard'
  },

  // ==================== PHYSICS QUESTIONS ====================

{
  questionText: "A concave mirror has a focal length of 15 cm. What is its focal length according to the Cartesian sign convention?",
  grade: "10",
  subject: "Physics",
  topic: "Light and Optics",
  concept: "Reflection of light at curved surfaces",
  options: [
    { text: "-15 cm", value: "-15 cm" },
    { text: "15 cm", value: "15 cm" },
    { text: "-30 cm", value: "-30 cm" },
    { text: "30 cm", value: "30 cm" }
  ],
  correctAnswer: "-15 cm",
  difficulty: "easy"
},

{
  questionText: "Which mirror is commonly used as a rear-view mirror in vehicles?",
  grade: "10",
  subject: "Physics",
  topic: "Light and Optics",
  concept: "Reflection of light at curved surfaces",
  options: [
    { text: "Concave mirror", value: "Concave mirror" },
    { text: "Convex mirror", value: "Convex mirror" },
    { text: "Plane mirror", value: "Plane mirror" },
    { text: "Parabolic mirror", value: "Parabolic mirror" }
  ],
  correctAnswer: "Convex mirror",
  difficulty: "easy"
},

{
  questionText: "An object is placed at the centre of curvature of a concave mirror. Where is the image formed?",
  grade: "10",
  subject: "Physics",
  topic: "Light and Optics",
  concept: "Reflection of light at curved surfaces",
  options: [
    { text: "At the focus", value: "At the focus" },
    { text: "Between focus and pole", value: "Between focus and pole" },
    { text: "At the centre of curvature", value: "At the centre of curvature" },
    { text: "Behind the mirror", value: "Behind the mirror" }
  ],
  correctAnswer: "At the centre of curvature",
  difficulty: "medium"
},

{
  questionText: "What is the relationship between focal length and radius of curvature of a spherical mirror?",
  grade: "10",
  subject: "Physics",
  topic: "Light and Optics",
  concept: "Reflection of light at curved surfaces",
  options: [
    { text: "f = R", value: "f = R" },
    { text: "f = R/2", value: "f = R/2" },
    { text: "f = 2R", value: "f = 2R" },
    { text: "f = R²", value: "f = R²" }
  ],
  correctAnswer: "f = R/2",
  difficulty: "easy"
},

{
  questionText: "A concave mirror has focal length 10 cm and an object is placed 20 cm in front of it. Where will the image form?",
  grade: "10",
  subject: "Physics",
  topic: "Light and Optics",
  concept: "Mirror formula",
  options: [
    { text: "10 cm in front of the mirror", value: "10 cm in front of the mirror" },
    { text: "20 cm in front of the mirror", value: "20 cm in front of the mirror" },
    { text: "20 cm behind the mirror", value: "20 cm behind the mirror" },
    { text: "40 cm behind the mirror", value: "40 cm behind the mirror" }
  ],
  correctAnswer: "20 cm in front of the mirror",
  difficulty: "medium"
},

{
  questionText: "According to the laws of reflection, the angle of incidence is equal to:",
  grade: "10",
  subject: "Physics",
  topic: "Light and Optics",
  concept: "Reflection of light at curved surfaces",
  options: [
    { text: "Angle of refraction", value: "Angle of refraction" },
    { text: "Angle of reflection", value: "Angle of reflection" },
    { text: "Angle of deviation", value: "Angle of deviation" },
    { text: "90 degrees", value: "90 degrees" }
  ],
  correctAnswer: "Angle of reflection",
  difficulty: "easy"
},

{
  questionText: "When light travels from air into glass, it generally:",
  grade: "10",
  subject: "Physics",
  topic: "Light and Optics",
  concept: "Refraction of light at curved surfaces",
  options: [
    { text: "Speeds up", value: "Speeds up" },
    { text: "Slows down", value: "Slows down" },
    { text: "Stops completely", value: "Stops completely" },
    { text: "Does not change speed", value: "Does not change speed" }
  ],
  correctAnswer: "Slows down",
  difficulty: "easy"
},

{
  questionText: "Which law relates the angle of incidence and angle of refraction?",
  grade: "10",
  subject: "Physics",
  topic: "Light and Optics",
  concept: "Refraction of light at curved surfaces",
  options: [
    { text: "Ohm's law", value: "Ohm's law" },
    { text: "Snell's law", value: "Snell's law" },
    { text: "Joule's law", value: "Joule's law" },
    { text: "Faraday's law", value: "Faraday's law" }
  ],
  correctAnswer: "Snell's law",
  difficulty: "easy"
},

{
  questionText: "The refractive index of a medium is defined as the ratio of:",
  grade: "10",
  subject: "Physics",
  topic: "Light and Optics",
  concept: "Refraction of light at curved surfaces",
  options: [
    { text: "Speed of light in medium to speed in vacuum", value: "Speed of light in medium to speed in vacuum" },
    { text: "Speed of light in vacuum to speed in medium", value: "Speed of light in vacuum to speed in medium" },
    { text: "Wavelength to frequency", value: "Wavelength to frequency" },
    { text: "Frequency to wavelength", value: "Frequency to wavelength" }
  ],
  correctAnswer: "Speed of light in vacuum to speed in medium",
  difficulty: "medium"
},

{
  questionText: "Which type of lens is thicker at the centre than at the edges?",
  grade: "10",
  subject: "Physics",
  topic: "Light and Optics",
  concept: "Refraction of light at curved surfaces",
  options: [
    { text: "Concave lens", value: "Concave lens" },
    { text: "Convex lens", value: "Convex lens" },
    { text: "Plane mirror", value: "Plane mirror" },
    { text: "Cylindrical mirror", value: "Cylindrical mirror" }
  ],
  correctAnswer: "Convex lens",
  difficulty: "easy"
},

{
  questionText: "The focal length of a convex lens is 20 cm. What is its power?",
  grade: "10",
  subject: "Physics",
  topic: "Light and Optics",
  concept: "Refraction of light at curved surfaces",
  options: [
    { text: "2 D", value: "2 D" },
    { text: "5 D", value: "5 D" },
    { text: "-5 D", value: "-5 D" },
    { text: "0.2 D", value: "0.2 D" }
  ],
  correctAnswer: "5 D",
  difficulty: "medium"
},

{
  questionText: "Which part of the human eye controls the amount of light entering the eye?",
  grade: "10",
  subject: "Physics",
  topic: "Light and Optics",
  concept: "Human eye and colourful world",
  options: [
    { text: "Retina", value: "Retina" },
    { text: "Iris", value: "Iris" },
    { text: "Cornea", value: "Cornea" },
    { text: "Optic nerve", value: "Optic nerve" }
  ],
  correctAnswer: "Iris",
  difficulty: "easy"
},

{
  questionText: "Myopia is commonly corrected using which type of lens?",
  grade: "10",
  subject: "Physics",
  topic: "Light and Optics",
  concept: "Defects of vision",
  options: [
    { text: "Convex lens", value: "Convex lens" },
    { text: "Concave lens", value: "Concave lens" },
    { text: "Plane lens", value: "Plane lens" },
    { text: "Cylindrical mirror", value: "Cylindrical mirror" }
  ],
  correctAnswer: "Concave lens",
  difficulty: "easy"
},

{
  questionText: "Hypermetropia is corrected using:",
  grade: "10",
  subject: "Physics",
  topic: "Light and Optics",
  concept: "Defects of vision",
  options: [
    { text: "Concave lens", value: "Concave lens" },
    { text: "Convex lens", value: "Convex lens" },
    { text: "Plane mirror", value: "Plane mirror" },
    { text: "Concave mirror", value: "Concave mirror" }
  ],
  correctAnswer: "Convex lens",
  difficulty: "easy"
},

{
  questionText: "The ability of the eye lens to change its focal length is called:",
  grade: "10",
  subject: "Physics",
  topic: "Light and Optics",
  concept: "Accommodation",
  options: [
    { text: "Dispersion", value: "Dispersion" },
    { text: "Accommodation", value: "Accommodation" },
    { text: "Reflection", value: "Reflection" },
    { text: "Refraction", value: "Refraction" }
  ],
  correctAnswer: "Accommodation",
  difficulty: "easy"
},

{
  questionText: "The splitting of white light into its constituent colours is called:",
  grade: "10",
  subject: "Physics",
  topic: "Light and Optics",
  concept: "Dispersion of light",
  options: [
    { text: "Reflection", value: "Reflection" },
    { text: "Refraction", value: "Refraction" },
    { text: "Dispersion", value: "Dispersion" },
    { text: "Diffraction", value: "Diffraction" }
  ],
  correctAnswer: "Dispersion",
  difficulty: "easy"
},

{
  questionText: "Which colour of visible light has the longest wavelength?",
  grade: "10",
  subject: "Physics",
  topic: "Light and Optics",
  concept: "Dispersion of light",
  options: [
    { text: "Violet", value: "Violet" },
    { text: "Blue", value: "Blue" },
    { text: "Green", value: "Green" },
    { text: "Red", value: "Red" }
  ],
  correctAnswer: "Red",
  difficulty: "easy"
},

{
  questionText: "According to Ohm's law, at constant temperature, the current through a conductor is directly proportional to:",
  grade: "10",
  subject: "Physics",
  topic: "Electricity and Magnetism",
  concept: "Electric current",
  options: [
    { text: "Resistance", value: "Resistance" },
    { text: "Voltage", value: "Voltage" },
    { text: "Power", value: "Power" },
    { text: "Time", value: "Time" }
  ],
  correctAnswer: "Voltage",
  difficulty: "easy"
},

{
  questionText: "A resistor has a resistance of 5 ohms and a current of 2 A flows through it. What is the potential difference?",
  grade: "10",
  subject: "Physics",
  topic: "Electricity and Magnetism",
  concept: "Ohm's law",
  options: [
    { text: "2.5 V", value: "2.5 V" },
    { text: "7 V", value: "7 V" },
    { text: "10 V", value: "10 V" },
    { text: "25 V", value: "25 V" }
  ],
  correctAnswer: "10 V",
  difficulty: "medium"
},

{
  questionText: "When resistors are connected in series, the total resistance is:",
  grade: "10",
  subject: "Physics",
  topic: "Electricity and Magnetism",
  concept: "Series and parallel circuits",
  options: [
    { text: "Less than the smallest resistance", value: "Less than the smallest resistance" },
    { text: "Equal to zero", value: "Equal to zero" },
    { text: "The sum of individual resistances", value: "The sum of individual resistances" },
    { text: "Always equal to the largest resistance", value: "Always equal to the largest resistance" }
  ],
  correctAnswer: "The sum of individual resistances",
  difficulty: "easy"
},

{
  questionText: "In a parallel circuit, the potential difference across each branch is:",
  grade: "10",
  subject: "Physics",
  topic: "Electricity and Magnetism",
  concept: "Series and parallel circuits",
  options: [
    { text: "The same", value: "The same" },
    { text: "Always zero", value: "Always zero" },
    { text: "Different for every branch", value: "Different for every branch" },
    { text: "Always twice the supply voltage", value: "Always twice the supply voltage" }
  ],
  correctAnswer: "The same",
  difficulty: "easy"
},

{
  questionText: "Which quantity is measured in ohms?",
  grade: "10",
  subject: "Physics",
  topic: "Electricity and Magnetism",
  concept: "Resistance",
  options: [
    { text: "Current", value: "Current" },
    { text: "Voltage", value: "Voltage" },
    { text: "Resistance", value: "Resistance" },
    { text: "Power", value: "Power" }
  ],
  correctAnswer: "Resistance",
  difficulty: "easy"
},

{
  questionText: "Joule's law of heating states that the heat produced in a resistor is proportional to:",
  grade: "10",
  subject: "Physics",
  topic: "Electricity and Magnetism",
  concept: "Joule's heating law",
  options: [
    { text: "I²Rt", value: "I²Rt" },
    { text: "IR/t", value: "IR/t" },
    { text: "V/R", value: "V/R" },
    { text: "R/It", value: "R/It" }
  ],
  correctAnswer: "I²Rt",
  difficulty: "medium"
},

{
  questionText: "A device consumes 1000 J of energy in 10 seconds. What is its power?",
  grade: "10",
  subject: "Physics",
  topic: "Electricity and Magnetism",
  concept: "Electric power",
  options: [
    { text: "10 W", value: "10 W" },
    { text: "100 W", value: "100 W" },
    { text: "1000 W", value: "1000 W" },
    { text: "10000 W", value: "10000 W" }
  ],
  correctAnswer: "100 W",
  difficulty: "medium"
},

{
  questionText: "Which instrument is used to measure electric current?",
  grade: "10",
  subject: "Physics",
  topic: "Electricity and Magnetism",
  concept: "Electric current",
  options: [
    { text: "Voltmeter", value: "Voltmeter" },
    { text: "Ammeter", value: "Ammeter" },
    { text: "Galvanometer only", value: "Galvanometer only" },
    { text: "Barometer", value: "Barometer" }
  ],
  correctAnswer: "Ammeter",
  difficulty: "easy"
},

{
  questionText: "A voltmeter is connected in a circuit:",
  grade: "10",
  subject: "Physics",
  topic: "Electricity and Magnetism",
  concept: "Electric circuits",
  options: [
    { text: "In series", value: "In series" },
    { text: "In parallel", value: "In parallel" },
    { text: "Only with a switch", value: "Only with a switch" },
    { text: "Without any connection", value: "Without any connection" }
  ],
  correctAnswer: "In parallel",
  difficulty: "easy"
},

{
  questionText: "What produces a magnetic field around a straight conductor?",
  grade: "10",
  subject: "Physics",
  topic: "Electricity and Magnetism",
  concept: "Electromagnetism",
  options: [
    { text: "Electric current", value: "Electric current" },
    { text: "Only voltage", value: "Only voltage" },
    { text: "Only resistance", value: "Only resistance" },
    { text: "Heat alone", value: "Heat alone" }
  ],
  correctAnswer: "Electric current",
  difficulty: "easy"
},

{
  questionText: "The direction of the magnetic field around a current-carrying straight conductor can be determined using:",
  grade: "10",
  subject: "Physics",
  topic: "Electricity and Magnetism",
  concept: "Magnetic fields",
  options: [
    { text: "Right-hand thumb rule", value: "Right-hand thumb rule" },
    { text: "Ohm's law", value: "Ohm's law" },
    { text: "Joule's law", value: "Joule's law" },
    { text: "Snell's law", value: "Snell's law" }
  ],
  correctAnswer: "Right-hand thumb rule",
  difficulty: "easy"
},

{
  questionText: "What happens when a current-carrying conductor is placed in a magnetic field?",
  grade: "10",
  subject: "Physics",
  topic: "Electricity and Magnetism",
  concept: "Magnetic fields",
  options: [
    { text: "It may experience a force", value: "It may experience a force" },
    { text: "Its mass becomes zero", value: "Its mass becomes zero" },
    { text: "Its temperature becomes zero", value: "Its temperature becomes zero" },
    { text: "Nothing can happen", value: "Nothing can happen" }
  ],
  correctAnswer: "It may experience a force",
  difficulty: "medium"
},

{
  questionText: "Electromagnetic induction is the production of:",
  grade: "10",
  subject: "Physics",
  topic: "Electricity and Magnetism",
  concept: "Electromagnetic induction",
  options: [
    { text: "Heat due to resistance", value: "Heat due to resistance" },
    { text: "Electric current due to changing magnetic field", value: "Electric current due to changing magnetic field" },
    { text: "Light due to pressure", value: "Light due to pressure" },
    { text: "Sound due to vibration", value: "Sound due to vibration" }
  ],
  correctAnswer: "Electric current due to changing magnetic field",
  difficulty: "medium"
},

{
  questionText: "Which law explains electromagnetic induction?",
  grade: "10",
  subject: "Physics",
  topic: "Electricity and Magnetism",
  concept: "Electromagnetic induction",
  options: [
    { text: "Faraday's law", value: "Faraday's law" },
    { text: "Ohm's law", value: "Ohm's law" },
    { text: "Newton's law", value: "Newton's law" },
    { text: "Snell's law", value: "Snell's law" }
  ],
  correctAnswer: "Faraday's law",
  difficulty: "easy"
},

{
  questionText: "Which device converts electrical energy into mechanical energy?",
  grade: "10",
  subject: "Physics",
  topic: "Electricity and Magnetism",
  concept: "Electric motors",
  options: [
    { text: "Electric motor", value: "Electric motor" },
    { text: "Generator", value: "Generator" },
    { text: "Transformer", value: "Transformer" },
    { text: "Battery", value: "Battery" }
  ],
  correctAnswer: "Electric motor",
  difficulty: "easy"
},

{
  questionText: "Which device converts mechanical energy into electrical energy?",
  grade: "10",
  subject: "Physics",
  topic: "Electricity and Magnetism",
  concept: "Electric generators",
  options: [
    { text: "Motor", value: "Motor" },
    { text: "Generator", value: "Generator" },
    { text: "Resistor", value: "Resistor" },
    { text: "Capacitor", value: "Capacitor" }
  ],
  correctAnswer: "Generator",
  difficulty: "easy"
},

{
  questionText: "The principle of an electric generator is based on:",
  grade: "10",
  subject: "Physics",
  topic: "Electricity and Magnetism",
  concept: "Electric generators",
  options: [
    { text: "Electromagnetic induction", value: "Electromagnetic induction" },
    { text: "Joule heating", value: "Joule heating" },
    { text: "Reflection", value: "Reflection" },
    { text: "Dispersion", value: "Dispersion" }
  ],
  correctAnswer: "Electromagnetic induction",
  difficulty: "easy"
},

{
  questionText: "What is the function of a split-ring commutator in a DC motor?",
  grade: "10",
  subject: "Physics",
  topic: "Electricity and Magnetism",
  concept: "Electric motors",
  options: [
    { text: "To reverse current direction in the coil", value: "To reverse current direction in the coil" },
    { text: "To increase resistance", value: "To increase resistance" },
    { text: "To produce light", value: "To produce light" },
    { text: "To store electrical energy", value: "To store electrical energy" }
  ],
  correctAnswer: "To reverse current direction in the coil",
  difficulty: "medium"
},

{
  questionText: "A wire carries a current of 3 A through a resistance of 4 ohms. What is the power dissipated?",
  grade: "10",
  subject: "Physics",
  topic: "Electricity and Magnetism",
  concept: "Electric power",
  options: [
    { text: "12 W", value: "12 W" },
    { text: "24 W", value: "24 W" },
    { text: "36 W", value: "36 W" },
    { text: "48 W", value: "48 W" }
  ],
  correctAnswer: "36 W",
  difficulty: "medium"
},

{
  questionText: "Two resistors of 4 ohms and 6 ohms are connected in series. What is their equivalent resistance?",
  grade: "10",
  subject: "Physics",
  topic: "Electricity and Magnetism",
  concept: "Series and parallel circuits",
  options: [
    { text: "2 ohms", value: "2 ohms" },
    { text: "10 ohms", value: "10 ohms" },
    { text: "24 ohms", value: "24 ohms" },
    { text: "1.2 ohms", value: "1.2 ohms" }
  ],
  correctAnswer: "10 ohms",
  difficulty: "easy"
},

{
  questionText: "Two resistors of 6 ohms each are connected in parallel. What is their equivalent resistance?",
  grade: "10",
  subject: "Physics",
  topic: "Electricity and Magnetism",
  concept: "Series and parallel circuits",
  options: [
    { text: "12 ohms", value: "12 ohms" },
    { text: "6 ohms", value: "6 ohms" },
    { text: "3 ohms", value: "3 ohms" },
    { text: "1 ohm", value: "1 ohm" }
  ],
  correctAnswer: "3 ohms",
  difficulty: "medium"
},

{
  questionText: "Which pole of a magnet attracts the south pole of another magnet?",
  grade: "10",
  subject: "Physics",
  topic: "Electricity and Magnetism",
  concept: "Magnetic fields",
  options: [
    { text: "North pole", value: "North pole" },
    { text: "South pole", value: "South pole" },
    { text: "Both poles repel", value: "Both poles repel" },
    { text: "Neither pole", value: "Neither pole" }
  ],
  correctAnswer: "North pole",
  difficulty: "easy"
},

{
  questionText: "The magnetic field is strongest where the magnetic field lines are:",
  grade: "10",
  subject: "Physics",
  topic: "Electricity and Magnetism",
  concept: "Magnetic fields",
  options: [
    { text: "Far apart", value: "Far apart" },
    { text: "Closest together", value: "Closest together" },
    { text: "Circular only", value: "Circular only" },
    { text: "Absent", value: "Absent" }
  ],
  correctAnswer: "Closest together",
  difficulty: "easy"
},

{
  questionText: "Which of the following is an example of electromagnetic induction?",
  grade: "10",
  subject: "Physics",
  topic: "Electricity and Magnetism",
  concept: "Electromagnetic induction",
  options: [
    { text: "A generator producing electricity", value: "A generator producing electricity" },
    { text: "A bulb glowing due to a battery", value: "A bulb glowing due to a battery" },
    { text: "A resistor producing heat", value: "A resistor producing heat" },
    { text: "A mirror reflecting light", value: "A mirror reflecting light" }
  ],
  correctAnswer: "A generator producing electricity",
  difficulty: "medium"
},

{
  questionText: "If the voltage across a resistor is doubled while its resistance remains constant, the current becomes:",
  grade: "10",
  subject: "Physics",
  topic: "Electricity and Magnetism",
  concept: "Ohm's law",
  options: [
    { text: "Half", value: "Half" },
    { text: "Double", value: "Double" },
    { text: "Four times", value: "Four times" },
    { text: "Unchanged", value: "Unchanged" }
  ],
  correctAnswer: "Double",
  difficulty: "medium"
},

{
  questionText: "Which phenomenon explains why a pencil appears bent when partially immersed in water?",
  grade: "10",
  subject: "Physics",
  topic: "Light and Optics",
  concept: "Refraction of light at curved surfaces",
  options: [
    { text: "Reflection", value: "Reflection" },
    { text: "Refraction", value: "Refraction" },
    { text: "Dispersion", value: "Dispersion" },
    { text: "Scattering", value: "Scattering" }
  ],
  correctAnswer: "Refraction",
  difficulty: "easy"
},

{
  questionText: "Which part of the eye receives the image formed by the eye lens?",
  grade: "10",
  subject: "Physics",
  topic: "Light and Optics",
  concept: "Human eye and colourful world",
  options: [
    { text: "Iris", value: "Iris" },
    { text: "Retina", value: "Retina" },
    { text: "Pupil", value: "Pupil" },
    { text: "Cornea", value: "Cornea" }
  ],
  correctAnswer: "Retina",
  difficulty: "easy"
},

{
  questionText: "A convex lens forms a real, inverted image when the object is placed:",
  grade: "10",
  subject: "Physics",
  topic: "Light and Optics",
  concept: "Refraction of light at curved surfaces",
  options: [
    { text: "Beyond its focal point", value: "Beyond its focal point" },
    { text: "Exactly at the optical centre only", value: "Exactly at the optical centre only" },
    { text: "Only between the lens and focus", value: "Only between the lens and focus" },
    { text: "Nowhere", value: "Nowhere" }
  ],
  correctAnswer: "Beyond its focal point",
  difficulty: "medium"
},

{
  questionText: "Which colour deviates the most when white light passes through a glass prism?",
  grade: "10",
  subject: "Physics",
  topic: "Light and Optics",
  concept: "Dispersion of light",
  options: [
    { text: "Red", value: "Red" },
    { text: "Yellow", value: "Yellow" },
    { text: "Green", value: "Green" },
    { text: "Violet", value: "Violet" }
  ],
  correctAnswer: "Violet",
  difficulty: "medium"
},

{
  questionText: "What happens to the resistance of a metallic conductor when its length is increased, keeping its cross-sectional area constant?",
  grade: "10",
  subject: "Physics",
  topic: "Electricity and Magnetism",
  concept: "Resistance",
  options: [
    { text: "It increases", value: "It increases" },
    { text: "It decreases", value: "It decreases" },
    { text: "It becomes zero", value: "It becomes zero" },
    { text: "It remains exactly the same", value: "It remains exactly the same" }
  ],
  correctAnswer: "It increases",
  difficulty: "medium"
},

{
  questionText: "What is the SI unit of electric power?",
  grade: "10",
  subject: "Physics",
  topic: "Electricity and Magnetism",
  concept: "Electric power",
  options: [
    { text: "Joule", value: "Joule" },
    { text: "Watt", value: "Watt" },
    { text: "Volt", value: "Volt" },
    { text: "Ohm", value: "Ohm" }
  ],
  correctAnswer: "Watt",
  difficulty: "easy"
},

// ==================== CHEMISTRY QUESTIONS ====================

{
  questionText: "Which of the following is a chemical change?",
  grade: "10",
  subject: "Chemistry",
  topic: "Chemical Reactions and Equations",
  concept: "Types of Chemical Reactions",
  options: [
    { text: "Melting of ice", value: "A" },
    { text: "Boiling of water", value: "B" },
    { text: "Rusting of iron", value: "C" },
    { text: "Breaking of glass", value: "D" }
  ],
  correctAnswer: "C",
  difficulty: "easy"
},

{
  questionText: "Which type of reaction occurs when two or more substances combine to form a single product?",
  grade: "10",
  subject: "Chemistry",
  topic: "Chemical Reactions and Equations",
  concept: "Combination Reaction",
  options: [
    { text: "Decomposition reaction", value: "A" },
    { text: "Combination reaction", value: "B" },
    { text: "Displacement reaction", value: "C" },
    { text: "Double displacement reaction", value: "D" }
  ],
  correctAnswer: "B",
  difficulty: "easy"
},

{
  questionText: "What is the balanced equation for the reaction between hydrogen and oxygen?",
  grade: "10",
  subject: "Chemistry",
  topic: "Chemical Reactions and Equations",
  concept: "Balancing Chemical Equations",
  options: [
    { text: "H2 + O2 → H2O", value: "A" },
    { text: "2H2 + O2 → 2H2O", value: "B" },
    { text: "H2 + 2O2 → H2O", value: "C" },
    { text: "2H2 + 2O2 → H2O", value: "D" }
  ],
  correctAnswer: "B",
  difficulty: "medium"
},

{
  questionText: "Oxidation can be described as:",
  grade: "10",
  subject: "Chemistry",
  topic: "Chemical Reactions and Equations",
  concept: "Oxidation and Reduction",
  options: [
    { text: "Addition of oxygen", value: "A" },
    { text: "Removal of oxygen", value: "B" },
    { text: "Addition of hydrogen only", value: "C" },
    { text: "Removal of nitrogen", value: "D" }
  ],
  correctAnswer: "A",
  difficulty: "easy"
},

{
  questionText: "A reaction in which a more reactive metal displaces a less reactive metal from its compound is called:",
  grade: "10",
  subject: "Chemistry",
  topic: "Chemical Reactions and Equations",
  concept: "Displacement Reaction",
  options: [
    { text: "Combination reaction", value: "A" },
    { text: "Decomposition reaction", value: "B" },
    { text: "Displacement reaction", value: "C" },
    { text: "Neutralization reaction", value: "D" }
  ],
  correctAnswer: "C",
  difficulty: "medium"
},

{
  questionText: "A solution with a pH of 2 is:",
  grade: "10",
  subject: "Chemistry",
  topic: "Acids, Bases, and Salts",
  concept: "pH Scale",
  options: [
    { text: "Strongly acidic", value: "A" },
    { text: "Weakly acidic", value: "B" },
    { text: "Neutral", value: "C" },
    { text: "Basic", value: "D" }
  ],
  correctAnswer: "A",
  difficulty: "easy"
},

{
  questionText: "Which substance is commonly used to neutralize excess acidity in the stomach?",
  grade: "10",
  subject: "Chemistry",
  topic: "Acids, Bases, and Salts",
  concept: "Neutralization",
  options: [
    { text: "Antacid", value: "A" },
    { text: "Vinegar", value: "B" },
    { text: "Hydrochloric acid", value: "C" },
    { text: "Lemon juice", value: "D" }
  ],
  correctAnswer: "A",
  difficulty: "easy"
},

{
  questionText: "What is formed when an acid reacts with a base?",
  grade: "10",
  subject: "Chemistry",
  topic: "Acids, Bases, and Salts",
  concept: "Neutralization",
  options: [
    { text: "Only water", value: "A" },
    { text: "Salt and water", value: "B" },
    { text: "Only salt", value: "C" },
    { text: "Hydrogen gas", value: "D" }
  ],
  correctAnswer: "B",
  difficulty: "easy"
},

{
  questionText: "Which of the following has a pH greater than 7?",
  grade: "10",
  subject: "Chemistry",
  topic: "Acids, Bases, and Salts",
  concept: "pH Scale",
  options: [
    { text: "Lemon juice", value: "A" },
    { text: "Vinegar", value: "B" },
    { text: "Soap solution", value: "C" },
    { text: "Pure water", value: "D" }
  ],
  correctAnswer: "C",
  difficulty: "medium"
},

{
  questionText: "Which salt is commonly known as baking soda?",
  grade: "10",
  subject: "Chemistry",
  topic: "Acids, Bases, and Salts",
  concept: "Common Salts",
  options: [
    { text: "Sodium chloride", value: "A" },
    { text: "Sodium hydrogen carbonate", value: "B" },
    { text: "Calcium carbonate", value: "C" },
    { text: "Sodium hydroxide", value: "D" }
  ],
  correctAnswer: "B",
  difficulty: "medium"
},

{
  questionText: "Which subatomic particle has a negative charge?",
  grade: "10",
  subject: "Chemistry",
  topic: "Structure of Atom",
  concept: "Subatomic Particles",
  options: [
    { text: "Proton", value: "A" },
    { text: "Neutron", value: "B" },
    { text: "Electron", value: "C" },
    { text: "Nucleus", value: "D" }
  ],
  correctAnswer: "C",
  difficulty: "easy"
},

{
  questionText: "According to Bohr's model, electrons revolve around the nucleus in:",
  grade: "10",
  subject: "Chemistry",
  topic: "Structure of Atom",
  concept: "Bohr Atomic Model",
  options: [
    { text: "Random paths", value: "A" },
    { text: "Fixed energy levels", value: "B" },
    { text: "The nucleus", value: "C" },
    { text: "Straight lines", value: "D" }
  ],
  correctAnswer: "B",
  difficulty: "easy"
},

{
  questionText: "What is the electronic configuration of sodium (atomic number 11)?",
  grade: "10",
  subject: "Chemistry",
  topic: "Structure of Atom",
  concept: "Electronic Configuration",
  options: [
    { text: "2, 8, 1", value: "A" },
    { text: "2, 7, 2", value: "B" },
    { text: "2, 8, 2", value: "C" },
    { text: "8, 3", value: "D" }
  ],
  correctAnswer: "A",
  difficulty: "medium"
},

{
  questionText: "The atomic number of an element represents the number of:",
  grade: "10",
  subject: "Chemistry",
  topic: "Structure of Atom",
  concept: "Atomic Number",
  options: [
    { text: "Neutrons", value: "A" },
    { text: "Protons", value: "B" },
    { text: "Shells", value: "C" },
    { text: "Molecules", value: "D" }
  ],
  correctAnswer: "B",
  difficulty: "easy"
},

{
  questionText: "Which particle has approximately the same mass as a proton but no electric charge?",
  grade: "10",
  subject: "Chemistry",
  topic: "Structure of Atom",
  concept: "Subatomic Particles",
  options: [
    { text: "Electron", value: "A" },
    { text: "Neutron", value: "B" },
    { text: "Ion", value: "C" },
    { text: "Photon", value: "D" }
  ],
  correctAnswer: "B",
  difficulty: "medium"
},

{
  questionText: "Who proposed the Modern Periodic Law based on atomic number?",
  grade: "10",
  subject: "Chemistry",
  topic: "Classification of Elements (Periodic Table)",
  concept: "Modern Periodic Table",
  options: [
    { text: "Mendeleev", value: "A" },
    { text: "Newlands", value: "B" },
    { text: "Moseley", value: "C" },
    { text: "Dobereiner", value: "D" }
  ],
  correctAnswer: "C",
  difficulty: "medium"
},

{
  questionText: "Dobereiner arranged elements into groups of:",
  grade: "10",
  subject: "Chemistry",
  topic: "Classification of Elements (Periodic Table)",
  concept: "Dobereiner Triads",
  options: [
    { text: "Two", value: "A" },
    { text: "Three", value: "B" },
    { text: "Four", value: "C" },
    { text: "Eight", value: "D" }
  ],
  correctAnswer: "B",
  difficulty: "easy"
},

{
  questionText: "Newlands' law of octaves stated that every eighth element had properties similar to the:",
  grade: "10",
  subject: "Chemistry",
  topic: "Classification of Elements (Periodic Table)",
  concept: "Newlands Law of Octaves",
  options: [
    { text: "First element", value: "A" },
    { text: "Second element", value: "B" },
    { text: "Third element", value: "C" },
    { text: "Seventh element", value: "D" }
  ],
  correctAnswer: "A",
  difficulty: "easy"
},

{
  questionText: "In the modern periodic table, elements are arranged according to increasing:",
  grade: "10",
  subject: "Chemistry",
  topic: "Classification of Elements (Periodic Table)",
  concept: "Modern Periodic Law",
  options: [
    { text: "Atomic mass", value: "A" },
    { text: "Atomic number", value: "B" },
    { text: "Number of neutrons", value: "C" },
    { text: "Density", value: "D" }
  ],
  correctAnswer: "B",
  difficulty: "easy"
},

{
  questionText: "Elements in the same group generally have similar:",
  grade: "10",
  subject: "Chemistry",
  topic: "Classification of Elements (Periodic Table)",
  concept: "Groups and Periods",
  options: [
    { text: "Atomic masses", value: "A" },
    { text: "Chemical properties", value: "B" },
    { text: "Number of shells", value: "C" },
    { text: "Atomic sizes", value: "D" }
  ],
  correctAnswer: "B",
  difficulty: "medium"
},

{
  questionText: "A bond formed by transfer of electrons from one atom to another is called:",
  grade: "10",
  subject: "Chemistry",
  topic: "Chemical Bonding",
  concept: "Ionic Bond",
  options: [
    { text: "Covalent bond", value: "A" },
    { text: "Ionic bond", value: "B" },
    { text: "Metallic bond", value: "C" },
    { text: "Hydrogen bond", value: "D" }
  ],
  correctAnswer: "B",
  difficulty: "easy"
},

{
  questionText: "A covalent bond is formed by:",
  grade: "10",
  subject: "Chemistry",
  topic: "Chemical Bonding",
  concept: "Covalent Bond",
  options: [
    { text: "Transfer of protons", value: "A" },
    { text: "Sharing of electrons", value: "B" },
    { text: "Transfer of neutrons", value: "C" },
    { text: "Loss of the nucleus", value: "D" }
  ],
  correctAnswer: "B",
  difficulty: "easy"
},

{
  questionText: "Which compound is formed mainly by ionic bonding?",
  grade: "10",
  subject: "Chemistry",
  topic: "Chemical Bonding",
  concept: "Ionic Compounds",
  options: [
    { text: "NaCl", value: "A" },
    { text: "CH4", value: "B" },
    { text: "CO2", value: "C" },
    { text: "H2", value: "D" }
  ],
  correctAnswer: "A",
  difficulty: "easy"
},

{
  questionText: "Which property is generally associated with ionic compounds?",
  grade: "10",
  subject: "Chemistry",
  topic: "Chemical Bonding",
  concept: "Properties of Ionic Compounds",
  options: [
    { text: "Low melting points", value: "A" },
    { text: "High melting points", value: "B" },
    { text: "Always gases at room temperature", value: "C" },
    { text: "Insoluble in all solvents", value: "D" }
  ],
  correctAnswer: "B",
  difficulty: "medium"
},

{
  questionText: "How many electrons are shared between two atoms forming a single covalent bond?",
  grade: "10",
  subject: "Chemistry",
  topic: "Chemical Bonding",
  concept: "Covalent Bond",
  options: [
    { text: "One", value: "A" },
    { text: "Two", value: "B" },
    { text: "Three", value: "C" },
    { text: "Four", value: "D" }
  ],
  correctAnswer: "B",
  difficulty: "medium"
},

{
  questionText: "A mineral from which a metal can be extracted economically is called:",
  grade: "10",
  subject: "Chemistry",
  topic: "Principles of Metallurgy",
  concept: "Ores and Minerals",
  options: [
    { text: "Alloy", value: "A" },
    { text: "Ore", value: "B" },
    { text: "Slag", value: "C" },
    { text: "Flux", value: "D" }
  ],
  correctAnswer: "B",
  difficulty: "easy"
},

{
  questionText: "Which process is commonly used to remove unwanted earthy impurities from an ore?",
  grade: "10",
  subject: "Chemistry",
  topic: "Principles of Metallurgy",
  concept: "Concentration of Ore",
  options: [
    { text: "Concentration", value: "A" },
    { text: "Electrolysis", value: "B" },
    { text: "Alloying", value: "C" },
    { text: "Corrosion", value: "D" }
  ],
  correctAnswer: "A",
  difficulty: "easy"
},

{
  questionText: "Which method is commonly used for extracting highly reactive metals such as sodium?",
  grade: "10",
  subject: "Chemistry",
  topic: "Principles of Metallurgy",
  concept: "Extraction of Metals",
  options: [
    { text: "Reduction with carbon", value: "A" },
    { text: "Electrolysis", value: "B" },
    { text: "Roasting only", value: "C" },
    { text: "Heating with water", value: "D" }
  ],
  correctAnswer: "B",
  difficulty: "medium"
},

{
  questionText: "Rusting of iron requires:",
  grade: "10",
  subject: "Chemistry",
  topic: "Principles of Metallurgy",
  concept: "Corrosion",
  options: [
    { text: "Only oxygen", value: "A" },
    { text: "Only water", value: "B" },
    { text: "Oxygen and moisture", value: "C" },
    { text: "Only carbon dioxide", value: "D" }
  ],
  correctAnswer: "C",
  difficulty: "easy"
},

{
  questionText: "Which method protects iron from corrosion by coating it with zinc?",
  grade: "10",
  subject: "Chemistry",
  topic: "Principles of Metallurgy",
  concept: "Corrosion Prevention",
  options: [
    { text: "Galvanization", value: "A" },
    { text: "Distillation", value: "B" },
    { text: "Roasting", value: "C" },
    { text: "Electrolysis", value: "D" }
  ],
  correctAnswer: "A",
  difficulty: "medium"
},

{
  questionText: "Which element is mainly responsible for the unique ability of carbon to form long chains?",
  grade: "10",
  subject: "Chemistry",
  topic: "Carbon and its Compounds",
  concept: "Catenation",
  options: [
    { text: "Hydrogen", value: "A" },
    { text: "Carbon", value: "B" },
    { text: "Oxygen", value: "C" },
    { text: "Nitrogen", value: "D" }
  ],
  correctAnswer: "B",
  difficulty: "easy"
},

{
  questionText: "Which of the following is an allotrope of carbon?",
  grade: "10",
  subject: "Chemistry",
  topic: "Carbon and its Compounds",
  concept: "Allotropes of Carbon",
  options: [
    { text: "Diamond", value: "A" },
    { text: "Water", value: "B" },
    { text: "Sodium chloride", value: "C" },
    { text: "Ammonia", value: "D" }
  ],
  correctAnswer: "A",
  difficulty: "easy"
},

{
  questionText: "Which functional group is present in alcohols?",
  grade: "10",
  subject: "Chemistry",
  topic: "Carbon and its Compounds",
  concept: "Functional Groups",
  options: [
    { text: "-OH", value: "A" },
    { text: "-COOH", value: "B" },
    { text: "-CHO", value: "C" },
    { text: "-CO-", value: "D" }
  ],
  correctAnswer: "A",
  difficulty: "easy"
},

{
  questionText: "Which of the following is a saturated hydrocarbon?",
  grade: "10",
  subject: "Chemistry",
  topic: "Carbon and its Compounds",
  concept: "Hydrocarbons",
  options: [
    { text: "Ethene", value: "A" },
    { text: "Ethyne", value: "B" },
    { text: "Ethane", value: "C" },
    { text: "Benzene", value: "D" }
  ],
  correctAnswer: "C",
  difficulty: "medium"
},

{
  questionText: "What is the molecular formula of methane?",
  grade: "10",
  subject: "Chemistry",
  topic: "Carbon and its Compounds",
  concept: "Hydrocarbons",
  options: [
    { text: "CH4", value: "A" },
    { text: "C2H6", value: "B" },
    { text: "C2H4", value: "C" },
    { text: "CH3OH", value: "D" }
  ],
  correctAnswer: "A",
  difficulty: "easy"
},

{
  questionText: "Which functional group represents a carboxylic acid?",
  grade: "10",
  subject: "Chemistry",
  topic: "Carbon and its Compounds",
  concept: "Functional Groups",
  options: [
    { text: "-OH", value: "A" },
    { text: "-COOH", value: "B" },
    { text: "-CHO", value: "C" },
    { text: "-NH2", value: "D" }
  ],
  correctAnswer: "B",
  difficulty: "medium"
},

{
  questionText: "Which type of bond is predominantly present in carbon compounds?",
  grade: "10",
  subject: "Chemistry",
  topic: "Carbon and its Compounds",
  concept: "Covalent Bonding in Carbon",
  options: [
    { text: "Ionic bond", value: "A" },
    { text: "Covalent bond", value: "B" },
    { text: "Metallic bond", value: "C" },
    { text: "Hydrogen bond", value: "D" }
  ],
  correctAnswer: "B",
  difficulty: "easy"
},

{
  questionText: "Which compound contains a carbon-carbon double bond?",
  grade: "10",
  subject: "Chemistry",
  topic: "Carbon and its Compounds",
  concept: "Unsaturated Hydrocarbons",
  options: [
    { text: "Ethane", value: "A" },
    { text: "Methane", value: "B" },
    { text: "Ethene", value: "C" },
    { text: "Propane", value: "D" }
  ],
  correctAnswer: "C",
  difficulty: "medium"
},

{
  questionText: "The process of adding hydrogen to an unsaturated hydrocarbon in the presence of a catalyst is called:",
  grade: "10",
  subject: "Chemistry",
  topic: "Carbon and its Compounds",
  concept: "Hydrogenation",
  options: [
    { text: "Oxidation", value: "A" },
    { text: "Hydrogenation", value: "B" },
    { text: "Substitution", value: "C" },
    { text: "Combustion", value: "D" }
  ],
  correctAnswer: "B",
  difficulty: "medium"
},

{
  questionText: "Which of the following is a characteristic property of carbon compounds?",
  grade: "10",
  subject: "Chemistry",
  topic: "Carbon and its Compounds",
  concept: "Properties of Carbon Compounds",
  options: [
    { text: "They are generally ionic", value: "A" },
    { text: "They generally have covalent bonds", value: "B" },
    { text: "They always conduct electricity", value: "C" },
    { text: "They all have high melting points", value: "D" }
  ],
  correctAnswer: "B",
  difficulty: "medium"
},

{
  questionText: "Which of the following represents an alkene?",
  grade: "10",
  subject: "Chemistry",
  topic: "Carbon and its Compounds",
  concept: "Hydrocarbon Classification",
  options: [
    { text: "C2H6", value: "A" },
    { text: "C3H8", value: "B" },
    { text: "C2H4", value: "C" },
    { text: "CH4", value: "D" }
  ],
  correctAnswer: "C",
  difficulty: "hard"
},

{
  questionText: "Which of the following is an irrational number?",
  grade: "9",
  subject: "Maths",
  topic: "Number Systems",
  concept: "Rational and Irrational Numbers",
  options: [
    { text: "0.25", value: "A" },
    { text: "3/5", value: "B" },
    { text: "√2", value: "C" },
    { text: "0.75", value: "D" }
  ],
  correctAnswer: "C",
  difficulty: "easy"
},
{
  questionText: "Which of the following is a rational number?",
  grade: "9",
  subject: "Maths",
  topic: "Number Systems",
  concept: "Rational Numbers",
  options: [
    { text: "√3", value: "A" },
    { text: "√5", value: "B" },
    { text: "0.125", value: "C" },
    { text: "π", value: "D" }
  ],
  correctAnswer: "C",
  difficulty: "easy"
},
{
  questionText: "The decimal expansion of 1/8 is:",
  grade: "9",
  subject: "Maths",
  topic: "Number Systems",
  concept: "Decimal Representation",
  options: [
    { text: "0.125", value: "A" },
    { text: "0.25", value: "B" },
    { text: "0.375", value: "C" },
    { text: "0.625", value: "D" }
  ],
  correctAnswer: "A",
  difficulty: "easy"
},
{
  questionText: "Which number lies between 2 and 3?",
  grade: "9",
  subject: "Maths",
  topic: "Number Systems",
  concept: "Irrational Numbers on Number Line",
  options: [
    { text: "√3", value: "A" },
    { text: "√5", value: "B" },
    { text: "√10", value: "C" },
    { text: "√12", value: "D" }
  ],
  correctAnswer: "B",
  difficulty: "medium"
},
{
  questionText: "What is the value of (√5)²?",
  grade: "9",
  subject: "Maths",
  topic: "Number Systems",
  concept: "Properties of Irrational Numbers",
  options: [
    { text: "5", value: "A" },
    { text: "10", value: "B" },
    { text: "√5", value: "C" },
    { text: "25", value: "D" }
  ],
  correctAnswer: "A",
  difficulty: "easy"
},

{
  questionText: "What is the degree of the polynomial 4x³ + 2x² - 7?",
  grade: "9",
  subject: "Maths",
  topic: "Polynomials",
  concept: "Degree of a Polynomial",
  options: [
    { text: "1", value: "A" },
    { text: "2", value: "B" },
    { text: "3", value: "C" },
    { text: "4", value: "D" }
  ],
  correctAnswer: "C",
  difficulty: "easy"
},
{
  questionText: "What is the coefficient of x² in 5x³ - 4x² + 7x - 2?",
  grade: "9",
  subject: "Maths",
  topic: "Polynomials",
  concept: "Coefficients of Polynomials",
  options: [
    { text: "5", value: "A" },
    { text: "-4", value: "B" },
    { text: "7", value: "C" },
    { text: "-2", value: "D" }
  ],
  correctAnswer: "B",
  difficulty: "easy"
},
{
  questionText: "If p(x) = x + 5, what is p(2)?",
  grade: "9",
  subject: "Maths",
  topic: "Polynomials",
  concept: "Value of a Polynomial",
  options: [
    { text: "5", value: "A" },
    { text: "6", value: "B" },
    { text: "7", value: "C" },
    { text: "8", value: "D" }
  ],
  correctAnswer: "C",
  difficulty: "easy"
},
{
  questionText: "Which of the following is a linear polynomial?",
  grade: "9",
  subject: "Maths",
  topic: "Polynomials",
  concept: "Types of Polynomials",
  options: [
    { text: "x² + 1", value: "A" },
    { text: "3x + 2", value: "B" },
    { text: "x³ - 1", value: "C" },
    { text: "x² + x + 1", value: "D" }
  ],
  correctAnswer: "B",
  difficulty: "easy"
},
{
  questionText: "What is the value of x² - 9 at x = 3?",
  grade: "9",
  subject: "Maths",
  topic: "Polynomials",
  concept: "Polynomial Evaluation",
  options: [
    { text: "0", value: "A" },
    { text: "3", value: "B" },
    { text: "6", value: "C" },
    { text: "9", value: "D" }
  ],
  correctAnswer: "A",
  difficulty: "easy"
},

{
  questionText: "The coordinates of the origin are:",
  grade: "9",
  subject: "Maths",
  topic: "Coordinate Geometry",
  concept: "Cartesian Plane",
  options: [
    { text: "(1,0)", value: "A" },
    { text: "(0,1)", value: "B" },
    { text: "(0,0)", value: "C" },
    { text: "(-1,0)", value: "D" }
  ],
  correctAnswer: "C",
  difficulty: "easy"
},
{
  questionText: "A point on the x-axis has which coordinate equal to zero?",
  grade: "9",
  subject: "Maths",
  topic: "Coordinate Geometry",
  concept: "Coordinates of Points",
  options: [
    { text: "x-coordinate", value: "A" },
    { text: "y-coordinate", value: "B" },
    { text: "Both coordinates", value: "C" },
    { text: "Neither coordinate", value: "D" }
  ],
  correctAnswer: "B",
  difficulty: "easy"
},
{
  questionText: "In which quadrant is the point (-3, 4)?",
  grade: "9",
  subject: "Maths",
  topic: "Coordinate Geometry",
  concept: "Quadrants",
  options: [
    { text: "I", value: "A" },
    { text: "II", value: "B" },
    { text: "III", value: "C" },
    { text: "IV", value: "D" }
  ],
  correctAnswer: "B",
  difficulty: "easy"
},

{
  questionText: "Which ordered pair satisfies x + y = 5?",
  grade: "9",
  subject: "Maths",
  topic: "Linear Equations in Two Variables",
  concept: "Solutions of Linear Equations",
  options: [
    { text: "(2,3)", value: "A" },
    { text: "(1,1)", value: "B" },
    { text: "(4,2)", value: "C" },
    { text: "(5,5)", value: "D" }
  ],
  correctAnswer: "A",
  difficulty: "easy"
},
{
  questionText: "How many solutions does a linear equation in two variables generally have?",
  grade: "9",
  subject: "Maths",
  topic: "Linear Equations in Two Variables",
  concept: "Solutions of Linear Equations",
  options: [
    { text: "One", value: "A" },
    { text: "Two", value: "B" },
    { text: "No solution", value: "C" },
    { text: "Infinitely many", value: "D" }
  ],
  correctAnswer: "D",
  difficulty: "medium"
},
{
  questionText: "If x + y = 10 and x = 4, what is y?",
  grade: "9",
  subject: "Maths",
  topic: "Linear Equations in Two Variables",
  concept: "Solving Linear Equations",
  options: [
    { text: "4", value: "A" },
    { text: "5", value: "B" },
    { text: "6", value: "C" },
    { text: "7", value: "D" }
  ],
  correctAnswer: "C",
  difficulty: "easy"
},

{
  questionText: "The sum of angles on a straight line is:",
  grade: "9",
  subject: "Maths",
  topic: "Lines and Angles",
  concept: "Linear Pair",
  options: [
    { text: "90°", value: "A" },
    { text: "180°", value: "B" },
    { text: "270°", value: "C" },
    { text: "360°", value: "D" }
  ],
  correctAnswer: "B",
  difficulty: "easy"
},
{
  questionText: "Vertically opposite angles are:",
  grade: "9",
  subject: "Maths",
  topic: "Lines and Angles",
  concept: "Vertically Opposite Angles",
  options: [
    { text: "Unequal", value: "A" },
    { text: "Equal", value: "B" },
    { text: "Supplementary", value: "C" },
    { text: "Complementary", value: "D" }
  ],
  correctAnswer: "B",
  difficulty: "easy"
},
{
  questionText: "If one angle of a linear pair is 65°, the other angle is:",
  grade: "9",
  subject: "Maths",
  topic: "Lines and Angles",
  concept: "Linear Pair",
  options: [
    { text: "25°", value: "A" },
    { text: "65°", value: "B" },
    { text: "115°", value: "C" },
    { text: "125°", value: "D" }
  ],
  correctAnswer: "C",
  difficulty: "easy"
},

{
  questionText: "The sum of the angles of a triangle is:",
  grade: "9",
  subject: "Maths",
  topic: "Triangles",
  concept: "Angle Sum Property",
  options: [
    { text: "90°", value: "A" },
    { text: "180°", value: "B" },
    { text: "270°", value: "C" },
    { text: "360°", value: "D" }
  ],
  correctAnswer: "B",
  difficulty: "easy"
},
{
  questionText: "A triangle with all three sides equal is called:",
  grade: "9",
  subject: "Maths",
  topic: "Triangles",
  concept: "Types of Triangles",
  options: [
    { text: "Scalene", value: "A" },
    { text: "Isosceles", value: "B" },
    { text: "Equilateral", value: "C" },
    { text: "Right-angled", value: "D" }
  ],
  correctAnswer: "C",
  difficulty: "easy"
},
{
  questionText: "An isosceles triangle has:",
  grade: "9",
  subject: "Maths",
  topic: "Triangles",
  concept: "Properties of Isosceles Triangle",
  options: [
    { text: "No equal sides", value: "A" },
    { text: "Two equal sides", value: "B" },
    { text: "Three unequal sides", value: "C" },
    { text: "Three right angles", value: "D" }
  ],
  correctAnswer: "B",
  difficulty: "easy"
},
{
  questionText: "A triangle with sides 3 cm, 4 cm and 5 cm is:",
  grade: "9",
  subject: "Maths",
  topic: "Triangles",
  concept: "Right Angled Triangle",
  options: [
    { text: "Equilateral", value: "A" },
    { text: "Isosceles", value: "B" },
    { text: "Right-angled", value: "C" },
    { text: "Obtuse", value: "D" }
  ],
  correctAnswer: "C",
  difficulty: "medium"
},

{
  questionText: "The sum of the interior angles of a quadrilateral is:",
  grade: "9",
  subject: "Maths",
  topic: "Quadrilaterals",
  concept: "Angle Sum Property",
  options: [
    { text: "180°", value: "A" },
    { text: "270°", value: "B" },
    { text: "360°", value: "C" },
    { text: "540°", value: "D" }
  ],
  correctAnswer: "C",
  difficulty: "easy"
},
{
  questionText: "A parallelogram has opposite sides that are:",
  grade: "9",
  subject: "Maths",
  topic: "Quadrilaterals",
  concept: "Properties of Parallelogram",
  options: [
    { text: "Unequal", value: "A" },
    { text: "Parallel and equal", value: "B" },
    { text: "Perpendicular", value: "C" },
    { text: "Always curved", value: "D" }
  ],
  correctAnswer: "B",
  difficulty: "easy"
},
{
  questionText: "A quadrilateral with all sides equal and all angles 90° is a:",
  grade: "9",
  subject: "Maths",
  topic: "Quadrilaterals",
  concept: "Properties of Square",
  options: [
    { text: "Rhombus", value: "A" },
    { text: "Rectangle", value: "B" },
    { text: "Square", value: "C" },
    { text: "Trapezium", value: "D" }
  ],
  correctAnswer: "C",
  difficulty: "easy"
},

{
  questionText: "The distance from the centre of a circle to any point on the circle is called:",
  grade: "9",
  subject: "Maths",
  topic: "Circles",
  concept: "Radius of a Circle",
  options: [
    { text: "Diameter", value: "A" },
    { text: "Radius", value: "B" },
    { text: "Chord", value: "C" },
    { text: "Arc", value: "D" }
  ],
  correctAnswer: "B",
  difficulty: "easy"
},
{
  questionText: "The diameter of a circle is twice its:",
  grade: "9",
  subject: "Maths",
  topic: "Circles",
  concept: "Radius and Diameter",
  options: [
    { text: "Chord", value: "A" },
    { text: "Radius", value: "B" },
    { text: "Circumference", value: "C" },
    { text: "Area", value: "D" }
  ],
  correctAnswer: "B",
  difficulty: "easy"
},
{
  questionText: "A line segment joining two points on a circle is called:",
  grade: "9",
  subject: "Maths",
  topic: "Circles",
  concept: "Chord",
  options: [
    { text: "Radius", value: "A" },
    { text: "Diameter", value: "B" },
    { text: "Chord", value: "C" },
    { text: "Tangent", value: "D" }
  ],
  correctAnswer: "C",
  difficulty: "easy"
},

{
  questionText: "What is the semi-perimeter of a triangle with sides 5 cm, 6 cm and 7 cm?",
  grade: "9",
  subject: "Maths",
  topic: "Heron's Formula",
  concept: "Semi-Perimeter",
  options: [
    { text: "8 cm", value: "A" },
    { text: "9 cm", value: "B" },
    { text: "10 cm", value: "C" },
    { text: "18 cm", value: "D" }
  ],
  correctAnswer: "B",
  difficulty: "medium"
},
{
  questionText: "Heron's formula is used to find the:",
  grade: "9",
  subject: "Maths",
  topic: "Heron's Formula",
  concept: "Area of Triangle",
  options: [
    { text: "Volume of a cube", value: "A" },
    { text: "Area of a triangle", value: "B" },
    { text: "Circumference of a circle", value: "C" },
    { text: "Area of a rectangle", value: "D" }
  ],
  correctAnswer: "B",
  difficulty: "easy"
},

{
  questionText: "The volume of a cube with side a is:",
  grade: "9",
  subject: "Maths",
  topic: "Surface Areas and Volumes",
  concept: "Volume of Cube",
  options: [
    { text: "a²", value: "A" },
    { text: "3a", value: "B" },
    { text: "a³", value: "C" },
    { text: "6a²", value: "D" }
  ],
  correctAnswer: "C",
  difficulty: "easy"
},
{
  questionText: "The total surface area of a cube of side 4 cm is:",
  grade: "9",
  subject: "Maths",
  topic: "Surface Areas and Volumes",
  concept: "Surface Area of Cube",
  options: [
    { text: "16 cm²", value: "A" },
    { text: "64 cm²", value: "B" },
    { text: "96 cm²", value: "C" },
    { text: "128 cm²", value: "D" }
  ],
  correctAnswer: "C",
  difficulty: "medium"
},
{
  questionText: "The volume of a cuboid measuring 2 cm × 3 cm × 4 cm is:",
  grade: "9",
  subject: "Maths",
  topic: "Surface Areas and Volumes",
  concept: "Volume of Cuboid",
  options: [
    { text: "9 cm³", value: "A" },
    { text: "12 cm³", value: "B" },
    { text: "24 cm³", value: "C" },
    { text: "36 cm³", value: "D" }
  ],
  correctAnswer: "C",
  difficulty: "easy"
},

{
  questionText: "The average of a set of observations is called the:",
  grade: "9",
  subject: "Maths",
  topic: "Statistics",
  concept: "Mean",
  options: [
    { text: "Median", value: "A" },
    { text: "Mode", value: "B" },
    { text: "Mean", value: "C" },
    { text: "Range", value: "D" }
  ],
  correctAnswer: "C",
  difficulty: "easy"
},
{
  questionText: "Find the mean of 2, 4, 6 and 8.",
  grade: "9",
  subject: "Maths",
  topic: "Statistics",
  concept: "Calculating Mean",
  options: [
    { text: "4", value: "A" },
    { text: "5", value: "B" },
    { text: "6", value: "C" },
    { text: "7", value: "D" }
  ],
  correctAnswer: "B",
  difficulty: "easy"
},
{
  questionText: "The value that occurs most frequently in a data set is called:",
  grade: "9",
  subject: "Maths",
  topic: "Statistics",
  concept: "Mode",
  options: [
    { text: "Mean", value: "A" },
    { text: "Median", value: "B" },
    { text: "Mode", value: "C" },
    { text: "Range", value: "D" }
  ],
  correctAnswer: "C",
  difficulty: "easy"
},

{
  questionText: "What is the probability of getting a head when a fair coin is tossed?",
  grade: "9",
  subject: "Maths",
  topic: "Probability",
  concept: "Basic Probability",
  options: [
    { text: "0", value: "A" },
    { text: "1/4", value: "B" },
    { text: "1/2", value: "C" },
    { text: "1", value: "D" }
  ],
  correctAnswer: "C",
  difficulty: "easy"
},
{
  questionText: "The probability of an impossible event is:",
  grade: "9",
  subject: "Maths",
  topic: "Probability",
  concept: "Probability of Impossible Event",
  options: [
    { text: "0", value: "A" },
    { text: "1/2", value: "B" },
    { text: "1", value: "C" },
    { text: "2", value: "D" }
  ],
  correctAnswer: "A",
  difficulty: "easy"
},
{
  questionText: "The probability of a sure event is:",
  grade: "9",
  subject: "Maths",
  topic: "Probability",
  concept: "Probability of Sure Event",
  options: [
    { text: "0", value: "A" },
    { text: "1/4", value: "B" },
    { text: "1/2", value: "C" },
    { text: "1", value: "D" }
  ],
  correctAnswer: "D",
  difficulty: "easy"
},
{
  questionText: "What is the SI unit of distance?",
  grade: "9",
  subject: "Physics",
  topic: "Motion",
  concept: "SI Units",
  options: [
    { text: "Kilometre", value: "A" },
    { text: "Metre", value: "B" },
    { text: "Centimetre", value: "C" },
    { text: "Millimetre", value: "D" }
  ],
  correctAnswer: "B",
  difficulty: "easy"
},
{
  questionText: "Which of the following is a scalar quantity?",
  grade: "9",
  subject: "Physics",
  topic: "Motion",
  concept: "Scalar and Vector Quantities",
  options: [
    { text: "Displacement", value: "A" },
    { text: "Velocity", value: "B" },
    { text: "Speed", value: "C" },
    { text: "Acceleration", value: "D" }
  ],
  correctAnswer: "C",
  difficulty: "easy"
},
{
  questionText: "The rate of change of distance with respect to time is called:",
  grade: "9",
  subject: "Physics",
  topic: "Motion",
  concept: "Speed",
  options: [
    { text: "Velocity", value: "A" },
    { text: "Speed", value: "B" },
    { text: "Acceleration", value: "C" },
    { text: "Displacement", value: "D" }
  ],
  correctAnswer: "B",
  difficulty: "easy"
},
{
  questionText: "A car travels 100 metres in 20 seconds. What is its speed?",
  grade: "9",
  subject: "Physics",
  topic: "Motion",
  concept: "Calculation of Speed",
  options: [
    { text: "2 m/s", value: "A" },
    { text: "5 m/s", value: "B" },
    { text: "10 m/s", value: "C" },
    { text: "20 m/s", value: "D" }
  ],
  correctAnswer: "B",
  difficulty: "easy"
},
{
  questionText: "Which quantity describes the shortest distance between the initial and final positions of an object?",
  grade: "9",
  subject: "Physics",
  topic: "Motion",
  concept: "Displacement",
  options: [
    { text: "Distance", value: "A" },
    { text: "Speed", value: "B" },
    { text: "Displacement", value: "C" },
    { text: "Acceleration", value: "D" }
  ],
  correctAnswer: "C",
  difficulty: "medium"
},
{
  questionText: "The slope of a distance-time graph represents:",
  grade: "9",
  subject: "Physics",
  topic: "Motion",
  concept: "Distance-Time Graph",
  options: [
    { text: "Acceleration", value: "A" },
    { text: "Speed", value: "B" },
    { text: "Force", value: "C" },
    { text: "Displacement", value: "D" }
  ],
  correctAnswer: "B",
  difficulty: "medium"
},
{
  questionText: "An object moving with uniform velocity has:",
  grade: "9",
  subject: "Physics",
  topic: "Motion",
  concept: "Uniform Motion",
  options: [
    { text: "Constant speed and constant direction", value: "A" },
    { text: "Changing speed only", value: "B" },
    { text: "Changing direction only", value: "C" },
    { text: "Constant acceleration only", value: "D" }
  ],
  correctAnswer: "A",
  difficulty: "medium"
},
{
  questionText: "What is the SI unit of acceleration?",
  grade: "9",
  subject: "Physics",
  topic: "Motion",
  concept: "Acceleration",
  options: [
    { text: "m/s", value: "A" },
    { text: "m/s²", value: "B" },
    { text: "km/h", value: "C" },
    { text: "N", value: "D" }
  ],
  correctAnswer: "B",
  difficulty: "easy"
},

{
  questionText: "Newton's first law of motion is also known as the law of:",
  grade: "9",
  subject: "Physics",
  topic: "Force and Laws of Motion",
  concept: "Newton's First Law",
  options: [
    { text: "Acceleration", value: "A" },
    { text: "Inertia", value: "B" },
    { text: "Momentum", value: "C" },
    { text: "Gravitation", value: "D" }
  ],
  correctAnswer: "B",
  difficulty: "easy"
},
{
  questionText: "The tendency of an object to resist a change in its state of motion is called:",
  grade: "9",
  subject: "Physics",
  topic: "Force and Laws of Motion",
  concept: "Inertia",
  options: [
    { text: "Momentum", value: "A" },
    { text: "Inertia", value: "B" },
    { text: "Force", value: "C" },
    { text: "Pressure", value: "D" }
  ],
  correctAnswer: "B",
  difficulty: "easy"
},
{
  questionText: "The SI unit of force is:",
  grade: "9",
  subject: "Physics",
  topic: "Force and Laws of Motion",
  concept: "SI Unit of Force",
  options: [
    { text: "Joule", value: "A" },
    { text: "Newton", value: "B" },
    { text: "Watt", value: "C" },
    { text: "Pascal", value: "D" }
  ],
  correctAnswer: "B",
  difficulty: "easy"
},
{
  questionText: "According to Newton's second law, force is equal to:",
  grade: "9",
  subject: "Physics",
  topic: "Force and Laws of Motion",
  concept: "Newton's Second Law",
  options: [
    { text: "Mass × velocity", value: "A" },
    { text: "Mass × acceleration", value: "B" },
    { text: "Mass × distance", value: "C" },
    { text: "Velocity × acceleration", value: "D" }
  ],
  correctAnswer: "B",
  difficulty: "medium"
},
{
  questionText: "What happens to the momentum of an object if its velocity is doubled while its mass remains constant?",
  grade: "9",
  subject: "Physics",
  topic: "Force and Laws of Motion",
  concept: "Momentum",
  options: [
    { text: "It becomes half", value: "A" },
    { text: "It remains the same", value: "B" },
    { text: "It doubles", value: "C" },
    { text: "It becomes four times", value: "D" }
  ],
  correctAnswer: "C",
  difficulty: "medium"
},
{
  questionText: "Newton's third law states that every action has:",
  grade: "9",
  subject: "Physics",
  topic: "Force and Laws of Motion",
  concept: "Newton's Third Law",
  options: [
    { text: "No reaction", value: "A" },
    { text: "An equal and opposite reaction", value: "B" },
    { text: "A smaller reaction", value: "C" },
    { text: "A greater reaction", value: "D" }
  ],
  correctAnswer: "B",
  difficulty: "easy"
},
{
  questionText: "A force of 10 N acts on a body of mass 2 kg. What is its acceleration?",
  grade: "9",
  subject: "Physics",
  topic: "Force and Laws of Motion",
  concept: "Force and Acceleration",
  options: [
    { text: "2 m/s²", value: "A" },
    { text: "5 m/s²", value: "B" },
    { text: "10 m/s²", value: "C" },
    { text: "20 m/s²", value: "D" }
  ],
  correctAnswer: "B",
  difficulty: "medium"
},

{
  questionText: "The force with which the Earth attracts an object is called:",
  grade: "9",
  subject: "Physics",
  topic: "Gravitation",
  concept: "Gravitational Force",
  options: [
    { text: "Friction", value: "A" },
    { text: "Weight", value: "B" },
    { text: "Pressure", value: "C" },
    { text: "Momentum", value: "D" }
  ],
  correctAnswer: "B",
  difficulty: "easy"
},
{
  questionText: "The SI unit of weight is:",
  grade: "9",
  subject: "Physics",
  topic: "Gravitation",
  concept: "Weight",
  options: [
    { text: "Kilogram", value: "A" },
    { text: "Newton", value: "B" },
    { text: "Joule", value: "C" },
    { text: "Pascal", value: "D" }
  ],
  correctAnswer: "B",
  difficulty: "easy"
},
{
  questionText: "The value of acceleration due to gravity near the Earth's surface is approximately:",
  grade: "9",
  subject: "Physics",
  topic: "Gravitation",
  concept: "Acceleration Due to Gravity",
  options: [
    { text: "4.9 m/s²", value: "A" },
    { text: "9.8 m/s²", value: "B" },
    { text: "19.6 m/s²", value: "C" },
    { text: "98 m/s²", value: "D" }
  ],
  correctAnswer: "B",
  difficulty: "easy"
},
{
  questionText: "Which force keeps planets in their orbits around the Sun?",
  grade: "9",
  subject: "Physics",
  topic: "Gravitation",
  concept: "Universal Gravitation",
  options: [
    { text: "Magnetic force", value: "A" },
    { text: "Gravitational force", value: "B" },
    { text: "Frictional force", value: "C" },
    { text: "Electrostatic force", value: "D" }
  ],
  correctAnswer: "B",
  difficulty: "easy"
},
{
  questionText: "What happens to the weight of an object when it is taken to the Moon?",
  grade: "9",
  subject: "Physics",
  topic: "Gravitation",
  concept: "Mass and Weight",
  options: [
    { text: "It increases", value: "A" },
    { text: "It decreases", value: "B" },
    { text: "It becomes zero", value: "C" },
    { text: "It remains exactly the same", value: "D" }
  ],
  correctAnswer: "B",
  difficulty: "medium"
},
{
  questionText: "The mass of an object on the Moon compared with its mass on Earth is:",
  grade: "9",
  subject: "Physics",
  topic: "Gravitation",
  concept: "Mass and Weight",
  options: [
    { text: "Greater", value: "A" },
    { text: "Smaller", value: "B" },
    { text: "The same", value: "C" },
    { text: "Zero", value: "D" }
  ],
  correctAnswer: "C",
  difficulty: "easy"
},

{
  questionText: "Work is said to be done when a force causes:",
  grade: "9",
  subject: "Physics",
  topic: "Work and Energy",
  concept: "Work",
  options: [
    { text: "Only force", value: "A" },
    { text: "Displacement in the direction of force", value: "B" },
    { text: "Only displacement", value: "C" },
    { text: "No movement", value: "D" }
  ],
  correctAnswer: "B",
  difficulty: "easy"
},
{
  questionText: "The SI unit of work is:",
  grade: "9",
  subject: "Physics",
  topic: "Work and Energy",
  concept: "SI Unit of Work",
  options: [
    { text: "Newton", value: "A" },
    { text: "Joule", value: "B" },
    { text: "Watt", value: "C" },
    { text: "Pascal", value: "D" }
  ],
  correctAnswer: "B",
  difficulty: "easy"
},
{
  questionText: "A force of 20 N moves an object through 5 m in the direction of the force. What is the work done?",
  grade: "9",
  subject: "Physics",
  topic: "Work and Energy",
  concept: "Calculation of Work",
  options: [
    { text: "25 J", value: "A" },
    { text: "50 J", value: "B" },
    { text: "100 J", value: "C" },
    { text: "200 J", value: "D" }
  ],
  correctAnswer: "C",
  difficulty: "medium"
},
{
  questionText: "The energy possessed by an object due to its motion is called:",
  grade: "9",
  subject: "Physics",
  topic: "Work and Energy",
  concept: "Kinetic Energy",
  options: [
    { text: "Potential energy", value: "A" },
    { text: "Kinetic energy", value: "B" },
    { text: "Chemical energy", value: "C" },
    { text: "Heat energy", value: "D" }
  ],
  correctAnswer: "B",
  difficulty: "easy"
},
{
  questionText: "The energy possessed by an object due to its position is called:",
  grade: "9",
  subject: "Physics",
  topic: "Work and Energy",
  concept: "Potential Energy",
  options: [
    { text: "Kinetic energy", value: "A" },
    { text: "Potential energy", value: "B" },
    { text: "Sound energy", value: "C" },
    { text: "Electrical energy", value: "D" }
  ],
  correctAnswer: "B",
  difficulty: "easy"
},
{
  questionText: "The SI unit of power is:",
  grade: "9",
  subject: "Physics",
  topic: "Work and Energy",
  concept: "Power",
  options: [
    { text: "Joule", value: "A" },
    { text: "Newton", value: "B" },
    { text: "Watt", value: "C" },
    { text: "Pascal", value: "D" }
  ],
  correctAnswer: "C",
  difficulty: "easy"
},
{
  questionText: "Power is defined as:",
  grade: "9",
  subject: "Physics",
  topic: "Work and Energy",
  concept: "Definition of Power",
  options: [
    { text: "Work × time", value: "A" },
    { text: "Work / time", value: "B" },
    { text: "Force / distance", value: "C" },
    { text: "Energy × time", value: "D" }
  ],
  correctAnswer: "B",
  difficulty: "medium"
},

{
  questionText: "Sound is produced by:",
  grade: "9",
  subject: "Physics",
  topic: "Sound",
  concept: "Production of Sound",
  options: [
    { text: "Vibrating objects", value: "A" },
    { text: "Stationary objects", value: "B" },
    { text: "Only liquids", value: "C" },
    { text: "Only gases", value: "D" }
  ],
  correctAnswer: "A",
  difficulty: "easy"
},
{
  questionText: "Sound cannot travel through:",
  grade: "9",
  subject: "Physics",
  topic: "Sound",
  concept: "Propagation of Sound",
  options: [
    { text: "Solids", value: "A" },
    { text: "Liquids", value: "B" },
    { text: "Gases", value: "C" },
    { text: "Vacuum", value: "D" }
  ],
  correctAnswer: "D",
  difficulty: "easy"
},
{
  questionText: "The number of vibrations made by a source in one second is called:",
  grade: "9",
  subject: "Physics",
  topic: "Sound",
  concept: "Frequency",
  options: [
    { text: "Amplitude", value: "A" },
    { text: "Frequency", value: "B" },
    { text: "Time period", value: "C" },
    { text: "Wavelength", value: "D" }
  ],
  correctAnswer: "B",
  difficulty: "easy"
},
{
  questionText: "The SI unit of frequency is:",
  grade: "9",
  subject: "Physics",
  topic: "Sound",
  concept: "Unit of Frequency",
  options: [
    { text: "Decibel", value: "A" },
    { text: "Hertz", value: "B" },
    { text: "Metre", value: "C" },
    { text: "Second", value: "D" }
  ],
  correctAnswer: "B",
  difficulty: "easy"
},
{
  questionText: "The loudness of sound mainly depends on its:",
  grade: "9",
  subject: "Physics",
  topic: "Sound",
  concept: "Amplitude",
  options: [
    { text: "Frequency", value: "A" },
    { text: "Amplitude", value: "B" },
    { text: "Time period", value: "C" },
    { text: "Speed", value: "D" }
  ],
  correctAnswer: "B",
  difficulty: "easy"
},
{
  questionText: "The pitch of a sound depends on its:",
  grade: "9",
  subject: "Physics",
  topic: "Sound",
  concept: "Pitch and Frequency",
  options: [
    { text: "Amplitude", value: "A" },
    { text: "Frequency", value: "B" },
    { text: "Speed", value: "C" },
    { text: "Wavelength only", value: "D" }
  ],
  correctAnswer: "B",
  difficulty: "easy"
},
{
  questionText: "A sound wave has a frequency of 500 Hz. How many vibrations does it make per second?",
  grade: "9",
  subject: "Physics",
  topic: "Sound",
  concept: "Frequency",
  options: [
    { text: "50", value: "A" },
    { text: "100", value: "B" },
    { text: "500", value: "C" },
    { text: "1000", value: "D" }
  ],
  correctAnswer: "C",
  difficulty: "medium"
},
{
  questionText: "Which characteristic of sound allows us to distinguish between two sounds having the same pitch and loudness?",
  grade: "9",
  subject: "Physics",
  topic: "Sound",
  concept: "Quality of Sound",
  options: [
    { text: "Amplitude", value: "A" },
    { text: "Frequency", value: "B" },
    { text: "Quality or timbre", value: "C" },
    { text: "Speed", value: "D" }
  ],
  correctAnswer: "C",
  difficulty: "medium"
},
{
  questionText: "Which of the following is a physical change?",
  grade: "9",
  subject: "Chemistry",
  topic: "Matter in Our Surroundings",
  concept: "Physical and Chemical Changes",
  options: [
    { text: "Burning of paper", value: "A" },
    { text: "Rusting of iron", value: "B" },
    { text: "Melting of ice", value: "C" },
    { text: "Digestion of food", value: "D" }
  ],
  correctAnswer: "C",
  difficulty: "easy"
},
{
  questionText: "Which state of matter has a definite shape and definite volume?",
  grade: "9",
  subject: "Chemistry",
  topic: "Matter in Our Surroundings",
  concept: "States of Matter",
  options: [
    { text: "Solid", value: "A" },
    { text: "Liquid", value: "B" },
    { text: "Gas", value: "C" },
    { text: "Plasma", value: "D" }
  ],
  correctAnswer: "A",
  difficulty: "easy"
},
{
  questionText: "Which state of matter has particles that are very far apart?",
  grade: "9",
  subject: "Chemistry",
  topic: "Matter in Our Surroundings",
  concept: "Particle Arrangement",
  options: [
    { text: "Solid", value: "A" },
    { text: "Liquid", value: "B" },
    { text: "Gas", value: "C" },
    { text: "All of these", value: "D" }
  ],
  correctAnswer: "C",
  difficulty: "easy"
},
{
  questionText: "The process by which a solid changes directly into a gas is called:",
  grade: "9",
  subject: "Chemistry",
  topic: "Matter in Our Surroundings",
  concept: "Sublimation",
  options: [
    { text: "Evaporation", value: "A" },
    { text: "Condensation", value: "B" },
    { text: "Sublimation", value: "C" },
    { text: "Freezing", value: "D" }
  ],
  correctAnswer: "C",
  difficulty: "easy"
},
{
  questionText: "Which of the following has the highest kinetic energy of particles?",
  grade: "9",
  subject: "Chemistry",
  topic: "Matter in Our Surroundings",
  concept: "Kinetic Energy of Particles",
  options: [
    { text: "Solid", value: "A" },
    { text: "Liquid", value: "B" },
    { text: "Gas", value: "C" },
    { text: "All have equal kinetic energy", value: "D" }
  ],
  correctAnswer: "C",
  difficulty: "medium"
},
{
  questionText: "Evaporation causes cooling because:",
  grade: "9",
  subject: "Chemistry",
  topic: "Matter in Our Surroundings",
  concept: "Evaporation",
  options: [
    { text: "Low-energy particles escape", value: "A" },
    { text: "High-energy particles escape", value: "B" },
    { text: "Particles stop moving", value: "C" },
    { text: "Temperature always increases", value: "D" }
  ],
  correctAnswer: "B",
  difficulty: "medium"
},
{
  questionText: "Which factor does NOT affect the rate of evaporation?",
  grade: "9",
  subject: "Chemistry",
  topic: "Matter in Our Surroundings",
  concept: "Factors Affecting Evaporation",
  options: [
    { text: "Surface area", value: "A" },
    { text: "Temperature", value: "B" },
    { text: "Humidity", value: "C" },
    { text: "Colour of the liquid", value: "D" }
  ],
  correctAnswer: "D",
  difficulty: "medium"
},
{
  questionText: "The SI unit of temperature is:",
  grade: "9",
  subject: "Chemistry",
  topic: "Matter in Our Surroundings",
  concept: "Temperature",
  options: [
    { text: "Celsius", value: "A" },
    { text: "Fahrenheit", value: "B" },
    { text: "Kelvin", value: "C" },
    { text: "Joule", value: "D" }
  ],
  correctAnswer: "C",
  difficulty: "easy"
},

{
  questionText: "A homogeneous mixture of two or more substances is called:",
  grade: "9",
  subject: "Chemistry",
  topic: "Is Matter Around Us Pure",
  concept: "Homogeneous Mixture",
  options: [
    { text: "Solution", value: "A" },
    { text: "Suspension", value: "B" },
    { text: "Colloid", value: "C" },
    { text: "Compound", value: "D" }
  ],
  correctAnswer: "A",
  difficulty: "easy"
},
{
  questionText: "In a salt solution, salt is the:",
  grade: "9",
  subject: "Chemistry",
  topic: "Is Matter Around Us Pure",
  concept: "Solute and Solvent",
  options: [
    { text: "Solvent", value: "A" },
    { text: "Solute", value: "B" },
    { text: "Suspension", value: "C" },
    { text: "Colloid", value: "D" }
  ],
  correctAnswer: "B",
  difficulty: "easy"
},
{
  questionText: "Which of the following is a heterogeneous mixture?",
  grade: "9",
  subject: "Chemistry",
  topic: "Is Matter Around Us Pure",
  concept: "Heterogeneous Mixture",
  options: [
    { text: "Salt solution", value: "A" },
    { text: "Air", value: "B" },
    { text: "Sugar solution", value: "C" },
    { text: "Sand and water", value: "D" }
  ],
  correctAnswer: "D",
  difficulty: "easy"
},
{
  questionText: "Which method is used to separate cream from milk?",
  grade: "9",
  subject: "Chemistry",
  topic: "Is Matter Around Us Pure",
  concept: "Centrifugation",
  options: [
    { text: "Filtration", value: "A" },
    { text: "Centrifugation", value: "B" },
    { text: "Sublimation", value: "C" },
    { text: "Chromatography", value: "D" }
  ],
  correctAnswer: "B",
  difficulty: "medium"
},
{
  questionText: "Which method is commonly used to separate different colours in ink?",
  grade: "9",
  subject: "Chemistry",
  topic: "Is Matter Around Us Pure",
  concept: "Chromatography",
  options: [
    { text: "Filtration", value: "A" },
    { text: "Distillation", value: "B" },
    { text: "Chromatography", value: "C" },
    { text: "Decantation", value: "D" }
  ],
  correctAnswer: "C",
  difficulty: "easy"
},
{
  questionText: "Which of the following is a pure substance?",
  grade: "9",
  subject: "Chemistry",
  topic: "Is Matter Around Us Pure",
  concept: "Pure Substances",
  options: [
    { text: "Air", value: "A" },
    { text: "Milk", value: "B" },
    { text: "Distilled water", value: "C" },
    { text: "Soil", value: "D" }
  ],
  correctAnswer: "C",
  difficulty: "easy"
},
{
  questionText: "A suspension is a mixture in which particles:",
  grade: "9",
  subject: "Chemistry",
  topic: "Is Matter Around Us Pure",
  concept: "Suspension",
  options: [
    { text: "Are completely dissolved", value: "A" },
    { text: "Are large enough to settle down", value: "B" },
    { text: "Cannot be seen at all", value: "C" },
    { text: "Always form a compound", value: "D" }
  ],
  correctAnswer: "B",
  difficulty: "medium"
},
{
  questionText: "Which separation technique is used to obtain salt from seawater?",
  grade: "9",
  subject: "Chemistry",
  topic: "Is Matter Around Us Pure",
  concept: "Evaporation",
  options: [
    { text: "Filtration", value: "A" },
    { text: "Evaporation", value: "B" },
    { text: "Centrifugation", value: "C" },
    { text: "Chromatography", value: "D" }
  ],
  correctAnswer: "B",
  difficulty: "easy"
},

{
  questionText: "Who proposed the law of conservation of mass?",
  grade: "9",
  subject: "Chemistry",
  topic: "Atoms and Molecules",
  concept: "Law of Conservation of Mass",
  options: [
    { text: "Dalton", value: "A" },
    { text: "Lavoisier", value: "B" },
    { text: "Rutherford", value: "C" },
    { text: "Bohr", value: "D" }
  ],
  correctAnswer: "B",
  difficulty: "easy"
},
{
  questionText: "The smallest particle of an element that takes part in a chemical reaction is called:",
  grade: "9",
  subject: "Chemistry",
  topic: "Atoms and Molecules",
  concept: "Atom",
  options: [
    { text: "Molecule", value: "A" },
    { text: "Atom", value: "B" },
    { text: "Ion", value: "C" },
    { text: "Compound", value: "D" }
  ],
  correctAnswer: "B",
  difficulty: "easy"
},
{
  questionText: "The molecular mass of water (H₂O) is:",
  grade: "9",
  subject: "Chemistry",
  topic: "Atoms and Molecules",
  concept: "Molecular Mass",
  options: [
    { text: "16 u", value: "A" },
    { text: "18 u", value: "B" },
    { text: "20 u", value: "C" },
    { text: "22 u", value: "D" }
  ],
  correctAnswer: "B",
  difficulty: "easy"
},
{
  questionText: "How many atoms are present in one molecule of carbon dioxide (CO₂)?",
  grade: "9",
  subject: "Chemistry",
  topic: "Atoms and Molecules",
  concept: "Molecular Formula",
  options: [
    { text: "1", value: "A" },
    { text: "2", value: "B" },
    { text: "3", value: "C" },
    { text: "4", value: "D" }
  ],
  correctAnswer: "C",
  difficulty: "easy"
},
{
  questionText: "The valency of oxygen is:",
  grade: "9",
  subject: "Chemistry",
  topic: "Atoms and Molecules",
  concept: "Valency",
  options: [
    { text: "1", value: "A" },
    { text: "2", value: "B" },
    { text: "3", value: "C" },
    { text: "4", value: "D" }
  ],
  correctAnswer: "B",
  difficulty: "easy"
},
{
  questionText: "What is the formula of calcium chloride?",
  grade: "9",
  subject: "Chemistry",
  topic: "Atoms and Molecules",
  concept: "Writing Chemical Formulae",
  options: [
    { text: "CaCl", value: "A" },
    { text: "CaCl₂", value: "B" },
    { text: "Ca₂Cl", value: "C" },
    { text: "Ca₂Cl₂", value: "D" }
  ],
  correctAnswer: "B",
  difficulty: "medium"
},
{
  questionText: "One mole of any substance contains approximately:",
  grade: "9",
  subject: "Chemistry",
  topic: "Atoms and Molecules",
  concept: "Mole Concept",
  options: [
    { text: "6.022 × 10²³ particles", value: "A" },
    { text: "6.022 × 10²² particles", value: "B" },
    { text: "3.011 × 10²³ particles", value: "C" },
    { text: "1 × 10²³ particles", value: "D" }
  ],
  correctAnswer: "A",
  difficulty: "medium"
},
{
  questionText: "What is the atomic mass of oxygen?",
  grade: "9",
  subject: "Chemistry",
  topic: "Atoms and Molecules",
  concept: "Atomic Mass",
  options: [
    { text: "8 u", value: "A" },
    { text: "12 u", value: "B" },
    { text: "16 u", value: "C" },
    { text: "32 u", value: "D" }
  ],
  correctAnswer: "C",
  difficulty: "easy"
},

{
  questionText: "The negatively charged particle present in an atom is:",
  grade: "9",
  subject: "Chemistry",
  topic: "Structure of the Atom",
  concept: "Subatomic Particles",
  options: [
    { text: "Proton", value: "A" },
    { text: "Neutron", value: "B" },
    { text: "Electron", value: "C" },
    { text: "Nucleus", value: "D" }
  ],
  correctAnswer: "C",
  difficulty: "easy"
},
{
  questionText: "The positively charged particle in an atom is:",
  grade: "9",
  subject: "Chemistry",
  topic: "Structure of the Atom",
  concept: "Proton",
  options: [
    { text: "Electron", value: "A" },
    { text: "Proton", value: "B" },
    { text: "Neutron", value: "C" },
    { text: "Photon", value: "D" }
  ],
  correctAnswer: "B",
  difficulty: "easy"
},
{
  questionText: "The nucleus of an atom contains:",
  grade: "9",
  subject: "Chemistry",
  topic: "Structure of the Atom",
  concept: "Atomic Nucleus",
  options: [
    { text: "Only electrons", value: "A" },
    { text: "Protons and neutrons", value: "B" },
    { text: "Only neutrons", value: "C" },
    { text: "Protons and electrons", value: "D" }
  ],
  correctAnswer: "B",
  difficulty: "easy"
},
{
  questionText: "The atomic number of an element is equal to the number of:",
  grade: "9",
  subject: "Chemistry",
  topic: "Structure of the Atom",
  concept: "Atomic Number",
  options: [
    { text: "Neutrons", value: "A" },
    { text: "Protons", value: "B" },
    { text: "Protons and neutrons", value: "C" },
    { text: "Electrons and neutrons", value: "D" }
  ],
  correctAnswer: "B",
  difficulty: "easy"
},
{
  questionText: "Atoms of the same element having different numbers of neutrons are called:",
  grade: "9",
  subject: "Chemistry",
  topic: "Structure of the Atom",
  concept: "Isotopes",
  options: [
    { text: "Isobars", value: "A" },
    { text: "Isotopes", value: "B" },
    { text: "Ions", value: "C" },
    { text: "Molecules", value: "D" }
  ],
  correctAnswer: "B",
  difficulty: "medium"
},
{
  questionText: "According to Bohr's model, electrons revolve around the nucleus in:",
  grade: "9",
  subject: "Chemistry",
  topic: "Structure of the Atom",
  concept: "Bohr Model",
  options: [
    { text: "Random paths", value: "A" },
    { text: "Fixed shells or energy levels", value: "B" },
    { text: "The nucleus", value: "C" },
    { text: "Straight lines", value: "D" }
  ],
  correctAnswer: "B",
  difficulty: "easy"
},
{
  questionText: "An atom has 11 protons. What is its atomic number?",
  grade: "9",
  subject: "Chemistry",
  topic: "Structure of the Atom",
  concept: "Atomic Number",
  options: [
    { text: "10", value: "A" },
    { text: "11", value: "B" },
    { text: "12", value: "C" },
    { text: "22", value: "D" }
  ],
  correctAnswer: "B",
  difficulty: "easy"
},
{
  questionText: "An atom has 17 protons and 18 neutrons. What is its mass number?",
  grade: "9",
  subject: "Chemistry",
  topic: "Structure of the Atom",
  concept: "Mass Number",
  options: [
    { text: "17", value: "A" },
    { text: "18", value: "B" },
    { text: "35", value: "C" },
    { text: "36", value: "D" }
  ],
  correctAnswer: "C",
  difficulty: "medium"
},

{
  questionText: "Which of the following is an example of a chemical change?",
  grade: "9",
  subject: "Chemistry",
  topic: "Chemical Reactions",
  concept: "Chemical Change",
  options: [
    { text: "Melting ice", value: "A" },
    { text: "Boiling water", value: "B" },
    { text: "Rusting of iron", value: "C" },
    { text: "Cutting paper", value: "D" }
  ],
  correctAnswer: "C",
  difficulty: "easy"
},
{
  questionText: "Which gas is released when an acid reacts with a metal?",
  grade: "9",
  subject: "Chemistry",
  topic: "Chemical Reactions",
  concept: "Acid-Metal Reaction",
  options: [
    { text: "Oxygen", value: "A" },
    { text: "Nitrogen", value: "B" },
    { text: "Hydrogen", value: "C" },
    { text: "Carbon dioxide", value: "D" }
  ],
  correctAnswer: "C",
  difficulty: "medium"
},
{
  questionText: "A reaction in which two or more substances combine to form a single product is called:",
  grade: "9",
  subject: "Chemistry",
  topic: "Chemical Reactions",
  concept: "Combination Reaction",
  options: [
    { text: "Decomposition reaction", value: "A" },
    { text: "Combination reaction", value: "B" },
    { text: "Displacement reaction", value: "C" },
    { text: "Neutralisation reaction", value: "D" }
  ],
  correctAnswer: "B",
  difficulty: "medium"
},
{
  questionText: "A reaction in which a compound breaks down into two or more simpler substances is called:",
  grade: "9",
  subject: "Chemistry",
  topic: "Chemical Reactions",
  concept: "Decomposition Reaction",
  options: [
    { text: "Combination reaction", value: "A" },
    { text: "Decomposition reaction", value: "B" },
    { text: "Displacement reaction", value: "C" },
    { text: "Redox reaction", value: "D" }
  ],
  correctAnswer: "B",
  difficulty: "easy"
},
{
  questionText: "When zinc reacts with dilute hydrochloric acid, the gas produced is:",
  grade: "9",
  subject: "Chemistry",
  topic: "Chemical Reactions",
  concept: "Metal and Acid Reaction",
  options: [
    { text: "Oxygen", value: "A" },
    { text: "Hydrogen", value: "B" },
    { text: "Chlorine", value: "C" },
    { text: "Carbon dioxide", value: "D" }
  ],
  correctAnswer: "B",
  difficulty: "medium"
},
{
  questionText: "Which type of reaction occurs when one element replaces another element in a compound?",
  grade: "9",
  subject: "Chemistry",
  topic: "Chemical Reactions",
  concept: "Displacement Reaction",
  options: [
    { text: "Combination", value: "A" },
    { text: "Decomposition", value: "B" },
    { text: "Displacement", value: "C" },
    { text: "Neutralisation", value: "D" }
  ],
  correctAnswer: "C",
  difficulty: "easy"
},
{
  questionText: "Which of the following observations can indicate that a chemical reaction has occurred?",
  grade: "9",
  subject: "Chemistry",
  topic: "Chemical Reactions",
  concept: "Indicators of Chemical Reaction",
  options: [
    { text: "Change in colour", value: "A" },
    { text: "Evolution of gas", value: "B" },
    { text: "Formation of a precipitate", value: "C" },
    { text: "All of these", value: "D" }
  ],
  correctAnswer: "D",
  difficulty: "easy"
},
{
  questionText: "The reaction between an acid and a base to form salt and water is called:",
  grade: "9",
  subject: "Chemistry",
  topic: "Chemical Reactions",
  concept: "Neutralisation",
  options: [
    { text: "Displacement", value: "A" },
    { text: "Combination", value: "B" },
    { text: "Neutralisation", value: "C" },
    { text: "Decomposition", value: "D" }
  ],
  correctAnswer: "C",
  difficulty: "easy"
}
];

async function seedQuestions() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log('Connected to MongoDB');

    await Question.deleteMany({});

    const insertedQuestions = await Question.insertMany(questions);

    console.log(
      `${insertedQuestions.length} questions inserted successfully`
    );

    await mongoose.disconnect();

    console.log('MongoDB connection closed');
  } catch (error) {
    console.error('Failed to seed questions:', error);
    process.exit(1);
  }
}

seedQuestions();