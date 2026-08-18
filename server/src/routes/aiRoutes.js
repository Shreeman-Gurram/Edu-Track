import { Router } from 'express';
import { 
  handleGetExplanation, 
  handleGeneratePractice, 
  handleAskQuestion 
} from '../controllers/aiController.js';

const router = Router();

router.post('/explain', handleGetExplanation);
router.post('/generate-practice', handleGeneratePractice);
router.post('/ask', handleAskQuestion);

export default router;