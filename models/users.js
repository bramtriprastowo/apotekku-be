const connection = require("../config/db");

const findEmail = (email) => {
  return new Promise((resolve, reject) =>
    connection.query(
      `SELECT COUNT(*) FROM users WHERE email='${email}'`,
      (error, results, fields) => {
        if (!error) {
          resolve(results);
        } else {
          reject(error);
        }
      }
    )
  );
};

const findNip = (nip) => {
  return new Promise((resolve, reject) =>
    connection.query(
      `SELECT COUNT(*) FROM users WHERE nip='${nip}'`,
      (error, results) => {
        if (!error) {
          resolve(results);
        } else {
          reject(error);
        }
      }
    )
  );
};

const insertUser = (data) => {
  const { id, name, email, nip, passwords, role } = data;
  return new Promise((resolve, reject) =>
    connection.query(
      `INSERT INTO users(id,name,email,nip,passwords,role) VALUES(${id},'${name}','${email}',${nip},'${passwords}','${role}')`,
      (error, results) => {
        if (!error) {
          resolve(results);
        } else {
          reject(error);
        }
      }
    )
  );
};

module.exports = { findEmail, findNip, insertUser };
