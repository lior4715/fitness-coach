const pool = require('../db');

exports.createWorkout = async (req, res) => {
  const { date, notes } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO workouts (user_id, date, notes) VALUES ($1, $2, $3) RETURNING *',
      [req.userId, date, notes]
    );
    res.status(201).json(result.rows[0]);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getWorkouts = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM workouts WHERE user_id = $1 ORDER BY date DESC',
      [req.userId]
    );
    res.json(result.rows);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.addSet = async (req, res) => {
  const { workoutId } = req.params;
  const { exercise_name, set_number, reps, weight, rpe } = req.body;
  try {
    // get or create exercise
    let exercise = await pool.query(
      'SELECT id FROM exercises WHERE name = $1',
      [exercise_name]
    );
    if (exercise.rows.length === 0) {
      exercise = await pool.query(
        'INSERT INTO exercises (name) VALUES ($1) RETURNING id',
        [exercise_name]
      );
    }
    const exerciseId = exercise.rows[0].id;

    const result = await pool.query(
      'INSERT INTO workout_sets (workout_id, exercise_id, set_number, reps, weight, rpe) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [workoutId, exerciseId, set_number, reps, weight, rpe]
    );
    res.status(201).json(result.rows[0]);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getLastSession = async (req, res) => {
  const { exerciseName } = req.params;
  try {
    const result = await pool.query(
      `SELECT ws.* FROM workout_sets ws
       JOIN exercises e ON ws.exercise_id = e.id
       JOIN workouts w ON ws.workout_id = w.id
       WHERE w.user_id = $1 AND e.name = $2
       ORDER BY w.date DESC, ws.set_number ASC
       LIMIT 10`,
      [req.userId, exerciseName]
    );
    res.json(result.rows);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getProgress = async (req, res) => {
  const { exerciseName } = req.params;
  try {
    const result = await pool.query(
      `SELECT w.date, MAX(ws.weight) as max_weight, MAX(ws.rpe) as max_rpe
       FROM workout_sets ws
       JOIN exercises e ON ws.exercise_id = e.id
       JOIN workouts w ON ws.workout_id = w.id
       WHERE w.user_id = $1 AND e.name = $2
       GROUP BY w.date
       ORDER BY w.date ASC`,
      [req.userId, exerciseName]
    );
    res.json(result.rows);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
};