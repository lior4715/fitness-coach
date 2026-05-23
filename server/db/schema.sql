CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  rest_timer_enabled BOOLEAN DEFAULT FALSE,
  rest_timer_seconds INT DEFAULT 90,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE workouts (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE exercises (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE workout_sets (
  id SERIAL PRIMARY KEY,
  workout_id INT REFERENCES workouts(id) ON DELETE CASCADE,
  exercise_id INT REFERENCES exercises(id),
  set_number INT NOT NULL,
  reps INT NOT NULL,
  weight DECIMAL(6,2) NOT NULL,
  rpe DECIMAL(3,1) CHECK (rpe >= 1 AND rpe <= 10)
);