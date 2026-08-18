const dotenv = require('dotenv');
const readline = require('readline');
const { askGeneralQuestion } = require('./src/services/aiService');

dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log("=== AI Tutor Terminal Tester ===");
console.log("Type any question below (type 'exit' to quit):\n");

const askLoop = () => {
  rl.question('Question: ', async (userInput) => {
    const trimmedInput = userInput.trim();

    if (trimmedInput.toLowerCase() === 'exit') {
      console.log('\nExiting AI Tutor Terminal Tester. Goodbye!');
      rl.close();
      return;
    }

    if (!trimmedInput) {
      console.log("Please enter a valid question.\n");
      askLoop();
      return;
    }

    console.log('\nProcessing response...\n');

    try {
      const result = await askGeneralQuestion({ question: trimmedInput, grade: 7 });

      console.log("--- AI RESPONSE ---");
      console.log(`Answer:\n${result.answer || 'No answer provided.'}\n`);

      // Displays the visual diagram ONLY when one was generated
      if (Array.isArray(result.visualDiagram) && result.visualDiagram.length > 0) {
        console.log(`Visual Diagram:\n${result.visualDiagram.join('\n')}\n`);
      } else if (typeof result.visualDiagram === 'string' && result.visualDiagram.trim() !== '' && result.visualDiagram !== 'N/A') {
        console.log(`Visual Diagram:\n${result.visualDiagram}\n`);
      }

      console.log(`Example: ${result.example || 'N/A'}`);
      console.log(`Tip:     ${result.tip || 'N/A'}`);
      console.log("-------------------\n");
    } catch (err) {
      console.error("[Error Processing Request]:", err.message, "\n");
    }

    askLoop();
  });
};

askLoop();