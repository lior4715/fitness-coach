const router = require('express').Router();
const auth = require('../middleware/auth');
const {
  createWorkout,
  getWorkouts,
  addSet,
  getLastSession,
  getProgress
} = require('../controllers/workoutController');

router.use(auth); // all workout routes require login

router.post('/', createWorkout);
router.get('/', getWorkouts);
router.post('/:workoutId/sets', addSet);
router.get('/last-session/:exerciseName', getLastSession);
router.get('/progress/:exerciseName', getProgress);

module.exports = router;