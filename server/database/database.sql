use mydatabase;
CREATE TABLE author (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);

CREATE TABLE book (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author_id INT,
  FOREIGN KEY (author_id) REFERENCES author(id) 
);

update author a inner join book b
on a.id=b.author_id
set a.name="test",b.title="test tsssitle"
where b.id =5 and b.title="ww3";
-- update check 1

select count(a.name) from author a inner join book b
on a.id=b.author_id
where a.id=3;
-- create new author

insert into author(name)
value("vaibhav");
insert into author1(name)
value("james"),
("Ram"),("gopal"),
("yash");


insert into book(title,author_id)
value("fake world",4),
("war the world",4);

select b.id,b.title,a.name from book b inner join author a
on a.id=b.author_id;
select * from author;
select * from book;

drop table author;
-- some other query
select id from author where name="gopal" 
order by id desc
limit 1;

select name from author 
where id = (select  author_id from book where id=4);

DELETE author, book
FROM author
JOIN book ON author.id = book.author_id
WHERE author.id = 3;

SET SQL_SAFE_UPDATES = 0;

delete from book
where author_id=3;
delete from author
where id=3;

