// const { resolve } = require("@angular/compiler-cli");
const mysql = require("mysql");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "mysql@123",
  database: "mydatabase",
  connectionLimit: 10,
  port: 3306,
});
let rootdb = {};
rootdb.getAuthorBooks = () => {
  return new Promise((resolve, reject) => {
    sql = `select b.id,b.title,a.name from book b inner join author a
    on a.id=b.author_id;`;
    pool.query(sql, (err, result) => {
      if (err) {
        console.log(err);
        return reject(err);
      } else {
        return resolve(result);
      }
    });
  });
};
rootdb.insertAuthorBooks = (input) => {
  return new Promise((resolve, reject) => {
    sql = `insert into author(name)
    value(?);
    `;
    sql2 = `insert into book(title,author_id)
    value(?,?);`;
    pool.query(
      `select count(id) from author where name=?`,
      input.name,
      (err, result) => {
        if (err) {
          return reject(err);
        }
        console.log(result[0]["count(id)"]);
        let count = result[0]["count(id)"];
        //
        console.log(result);
        if (count > 0) {
          pool.query(
            `select id from author where name=? order by id desc limit 1`,
            input.name,
            (err, result) => {
              if (err) {
                return reject(err);
              }
              console.log("first");
              console.log("from sec", result[0]["id"]);
              input.author_id = result[0]["id"];
              pool.query(
                sql2,
                [input.title, input.author_id],
                (err, result) => {
                  if (err) {
                    console.log(err);
                    return reject(err);
                  } else {
                    console.log(result);
                    return resolve(true);
                  }
                }
              );
            }
          );
        } else {
          console.log("second");
          pool.query(sql, [input.name], (err, result) => {
            if (err) {
              console.log(err);
              return reject(err);
            }
            input.author_id = result.insertId;
            pool.query(sql2, [input.title, input.author_id], (err, result) => {
              if (err) {
                console.log(err);
                return reject(err);
              } else {
                console.log(result);
                return resolve(true);
              }
            });
          });
        }
        //
      }
    );
  });
};
rootdb.updateAuthorBooks = (input) => {
  sql = `update author a inner join book b
on a.id=b.author_id
set a.name=?,b.title=?
where b.id =? ;`;

  return new Promise((resolve, reject) => {
    pool.query(sql, [input.name, input.title, input.id], (err, result) => {
      if (err) {
        console.log(err);
        return reject(err);
      } else {
        return resolve(true);
      }
    });
  });
};
// note : here we delete the item using author id not book id
rootdb.deletAuthorBooks = (id) => {
  return new Promise((resolve, reject) => {
    sql1 = `delete from book
    where author_id=?;
   `;
    sql2 = ` delete from author
   where id=?;`;
    pool.query(sql1, id, (err, result) => {
      if (err) {
        console.log(err);
        return reject(err);
      }
      console.log(result);
      pool.query(sql2, id, (err, result) => {
        if (err) {
          console.log(err);
          return reject(err);
        } else {
          return resolve(true);
        }
      });
    });
  });
};

module.exports = rootdb;
