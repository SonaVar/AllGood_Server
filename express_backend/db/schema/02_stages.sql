DROP TABLE IF EXISTS stages CASCADE;

CREATE TABLE stages (
  id SERIAL PRIMARY KEY NOT NULL,
  description VARCHAR(255) NOT NULL
);