const express = require('express');
const router = express.Router();
const {
  generateDescription,
  generateTags,
  generateCaption,
  recommendPrice,
  getTrending,
} = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/description', generateDescription);
router.post('/tags', generateTags);
router.post('/caption', generateCaption);
router.post('/pricing', recommendPrice);
router.post('/trending', getTrending);

module.exports = router;
