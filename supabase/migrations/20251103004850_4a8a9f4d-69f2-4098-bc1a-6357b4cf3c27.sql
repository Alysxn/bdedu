-- Add separate columns for database structure and example data to desafios table
ALTER TABLE desafios 
ADD COLUMN database_structure jsonb,
ADD COLUMN example_data jsonb;

-- Comment explaining the structure
COMMENT ON COLUMN desafios.database_structure IS 'JSON array of table structures with columns: [{"table": "books", "columns": [{"name": "id", "type": "INT"}, ...]}]';
COMMENT ON COLUMN desafios.example_data IS 'JSON array of table data: [{"table": "books", "rows": [[1, "Title", "Author"], ...]}]';