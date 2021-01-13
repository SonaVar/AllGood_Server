DROP TABLE IF EXISTS vendors CASCADE;

CREATE TABLE vendors (
  id SERIAL PRIMARY KEY NOT NULL,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  company VARCHAR(255) NOT NULL,
  title VARCHAR(255),
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(255) NOT NULL,
  company_url VARCHAR(255),
  contact_method VARCHAR(255),
  handle VARCHAR(255),
  description VARCHAR(255) NOT NULL,
  comments VARCHAR(255),
  stage_id INTEGER REFERENCES stages(id) ON DELETE CASCADE,
  reviewer_id INTEGER REFERENCES reviewers(id) ON DELETE CASCADE
);