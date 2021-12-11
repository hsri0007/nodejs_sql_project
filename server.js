const express = require("express");
const app = express();
app.use(express.json());
var jwt = require("jsonwebtoken");

var mysql = require("mysql");
var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "hari",
});

connection.connect();

app.get("/create", (req, res) => {
  connection.query(
    `CREATE TABLE hello (
    PersonID int NOT NULL AUTO_INCREMENT,
    Gmail varchar(255),
    Password varchar(255),
    PRIMARY KEY (PersonID)
);`
  );

  res.send("sql connected");
});

app.get("/delete/:id", (req, res) => {
  console.log(req.params.id);
  connection.query(
    `DELETE FROM users WHERE PersonID=${req.params.id};
  `,
    (request, response) => {
      res.send("deleted");
      console.log(response);
    }
  );
});

app.post("/signup", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  console.log(req.body);

  connection.query(
    `INSERT INTO users (Gmail, Password) VALUES ('${email}', '${password}');`,
    (request, response) => {
      console.log(response);
    }
  );

  res.send(req.body);
});
app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  connection.query(
    `SELECT * FROM users WHERE Gmail='${email}' AND Password='${password}';`,
    (request, response) => {
      if (response[0]) {
        var token = jwt.sign({ foo: response[0].Gmail }, "shhhhh");

        const data = {
          gmail: response[0].Gmail,
          token,
        };

        res.send(data);
      } else {
        res.send("invalid credentials");
      }
    }
  );
});

app.get("/users", (req, res) => {
  connection.query(`SELECT * FROM users;`, (request, response) => {
    res.send(response);
  });
});

app.get("/users/1", (req, res) => {
  connection.query(
    `SELECT * FROM users WHERE PersonID=1;`,
    (request, response) => {
      res.send(response);
      // res.send(request);
    }
  );
});

app.listen(5000);
