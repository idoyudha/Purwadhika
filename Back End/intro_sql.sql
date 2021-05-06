SELECT * FROM db_first.biodata; -- read all data from table
SELECT idbiodata as id, name, age from biodata; -- read selected column from table 

INSERT INTO biodata (name,age, address) VALUES ('Jerry', 20, 'Surabaya');
INSERT INTO biodata VALUES (null, 'Kaka', 26, 'Milan', 'Active');

SELECT * FROM db_first.biodata;

INSERT INTO biodata (name, age, address) values
('Tom', 21, 'Depok'), ('Dodo', 23, 'Semarang'); 

SELECT * FROM db_first.biodata;

UPDATE biodata SET age=24, status='Non-Active' WHERE idbiodata = 6; 

SELECT * FROM biodata order by age DESC; 
SELECT * FROM biodata LIMIT 4;
SELECT * FROM biodata LIMIT 2,3; -- 3 data from after first 2 data 

SELECT * FROM biodata ORDER BY age DESC LIMIT 4;
SELECT * FROM biodata WHERE address='Surabaya' ORDER BY age DESC;
SELECT * FROM biodata WHERE age < 28 AND status = 'Active';
SELECT * FROM biodata WHERE age BETWEEN 22 AND 27;

SELECT * from biodata WHERE name LIKE '%a%';
SELECT COUNT(*) AS total_data,
SUM(age) as total_age, 
MIN(age) AS min_age, 
MAX(age) AS max_age, 
AVG(age) AS average_age 
FROM biodata;

SELECT * FROM biodata GROUP BY address;

SELECT address, COUNT(address) as total, SUM(age)/COUNT(age) as average FROM biodata GROUP BY address;
