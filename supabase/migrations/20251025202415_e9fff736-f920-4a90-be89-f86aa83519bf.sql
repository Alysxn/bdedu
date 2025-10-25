-- Add skeleton column to exercicios table for SQL examples
ALTER TABLE exercicios
ADD COLUMN skeleton TEXT;

-- Update exercise 1 with its skeleton
UPDATE exercicios
SET skeleton = 'CREATE DATABASE ___;

USE ___;

CREATE TABLE ___ (
    ___ INT PRIMARY KEY,
    ___ VARCHAR(150),
    ___ INT
);'
WHERE id = 1;