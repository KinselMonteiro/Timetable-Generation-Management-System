CREATE DATABASE IF NOT EXISTS timetable;

USE timetable;

DROP TABLE IF EXISTS users;

CREATE TABLE users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password VARCHAR(255),
  role VARCHAR(20),
  department VARCHAR(50),
  faculty_name VARCHAR(100)
);

INSERT INTO users
(name, email, password, role, department, faculty_name)
VALUES

('Admin','admin@dbce.com','admin123','admin','ALL','Admin'),

('Avil D''sa','avil.d.sa@dbce.com','teacher123','teacher','MECH','Avil D''sa'),
('Dr. Amit Naik','amit.naik@dbce.com','teacher123','teacher','ECS','Dr. Amit Naik'),
('Dr. Amrita Naik','amrita.naik@dbce.com','teacher123','teacher','COMP','Dr. Amrita Naik'),
('Dr. Chetan Gaonkar','chetan.gaonkar@dbce.com','teacher123','teacher','MECH','Dr. Chetan Gaonkar'),
('Dr. D S Vidya','d.s.vidya@dbce.com','teacher123','teacher','ECS','Dr. D S Vidya'),
('Dr. Kala Nayak','kala.nayak@dbce.com','teacher123','teacher','UNIVERSAL','Dr. Kala Nayak'),
('Dr. Neena Panandikar','neena.panandikar@dbce.com','teacher123','teacher','UNIVERSAL','Dr. Neena Panandikar'),
('Dr. Nilesh Fondekar','nilesh.fondekar@dbce.com','teacher123','teacher','MECH','Dr. Nilesh Fondekar'),
('Dr. Rolando Da Cruz','rolando.da.cruz@dbce.com','teacher123','teacher','ECS','Dr. Rolando Da Cruz'),
('Dr. Shreyas Simu','shreyas@dbce.com','teacher123','teacher','ECS','Dr. Shreyas'),
('Dr. Shwetha Prasanna','shwetha.prasanna@dbce.com','teacher123','teacher','CIVIL','Dr. Shwetha Prasanna'),

('Mr. Ajit Salunke','ajit.salunke@dbce.com','teacher123','teacher','MECH','Mr. Ajit Salunke'),
('Mr. Amey Tilve','amey.tilve@dbce.com','teacher123','teacher','COMP','Mr. Amey Tilve'),
('Mr. Deron Rodrigues','deron.rodrigues@dbce.com','teacher123','teacher','ECS','Mr. Deron Rodrigues'),
('Mr. Gitesh Mestri','gitesh.mestri@dbce.com','teacher123','teacher','CIVIL','Mr. Gitesh Mestri'),
('Mr. Harison Cota','harison.cota@dbce.com','teacher123','teacher','SCIENCE AND HUMANITIES','Mr. Harison Cota'),
('Mr. Jhanvi Naik','jhanvi.naik@dbce.com','teacher123','teacher','COMP','Mr. Jhanvi Naik'),
('Mr. Mithil Parab','mithil.parab@dbce.com','teacher123','teacher','COMP','Mr. Mithil Parab'),
('Mr. Selvyn Fernandes','selvyn.fernandes@dbce.com','teacher123','teacher','ECS','Mr. Selvyn Fernandes'),
('Mr. Yeshudas Muttu','yeshudas.muttu@dbce.com','teacher123','teacher','ECS','Mr. Yeshudas Muttu'),

('Mrs. Michelle Araujo e Viegas','michelle.araujo.e.viegas@dbce.com','teacher123','teacher','ECS','Mrs. Michelle Araujo e Viegas'),
('Mrs. Samantha Cardoso','samantha.cardoso@dbce.com','teacher123','teacher','ECS','Mrs. Samantha Cardoso'),
('Mrs. Trima Fernandes e Fizardo','trima.fernandes.e.fizardo@dbce.com','teacher123','teacher','ECS','Mrs. Trima Fernandes e Fizardo'),

('Ms. Anisha Cotta','anisha.cotta@dbce.com','teacher123','teacher','ECS','Ms. Anisha Cotta'),
('Ms. Avila Naik','avila.naik@dbce.com','teacher123','teacher','SCIENCE AND HUMANITIES','Ms. Avila Naik'),
('Ms. Carol Cardozo','carol.cardozo@dbce.com','teacher123','teacher','SCIENCE AND HUMANITIES','Ms. Carol Cardozo'),
('Ms. Esta Pereira','esta.pereira@dbce.com','teacher123','teacher','SCIENCE AND HUMANITIES','Ms. Esta Pereira'),
('Ms. Genevieve Fernandes','genevieve.fernandes@dbce.com','teacher123','teacher','CIVIL','Ms. Genevieve Fernandes'),
('Ms. Mathilda Colaco','mathilda.colaco@dbce.com','teacher123','teacher','ECS','Ms. Mathilda Colaco'),
('Ms. Melba DSouza','melba.dsouza@dbce.com','teacher123','teacher','ECS','Ms. Melba DSouza'),
('Ms. Mohini Naik','mohini.naik@dbce.com','teacher123','teacher','ECS','Ms. Mohini Naik'),

('Prof. Akshay Naik','akshay.naik@dbce.com','teacher123','teacher','MECH','Prof. Akshay Naik'),
('Prof. B.R. Anirudha','b.r.anirudha@dbce.com','teacher123','teacher','CIVIL','Prof. B.R. Anirudha'),
('Prof. Kaushik Pai Fondekar','kaushik.pai.fondekar@dbce.com','teacher123','teacher','CIVIL','Prof. Kaushik Pai Fondekar'),

('Student ECS','student.ecs@dbce.com','student123','student','ECS',''),
('Student MECH','student.mech@dbce.com','student123','student','MECH',''),
('Student CIVIL','student.civil@dbce.com','student123','student','CIVIL',''),
('Student COMP','student.comp@dbce.com','student123','student','COMP','');

SELECT * FROM users;
