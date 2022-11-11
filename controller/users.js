const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { generateAccessToken, generateRefreshToken } = require("../helper/auth");
const commonHelper = require("../helper/common");
const { findEmail, findNip, insertUser } = require("../models/users");

let refreshTokens = [];
const usersController = {
  register: async (req, res) => {
    try {
      const { id, name, email, nip, password } = req.body;
      const textNip = nip.toString();
      const firstDigitNip = textNip.split("")[0];
      let role = "";

      //Verifikasi kelengkapan data untuk diinsert ke tabel users
      if (!id || !name || !email || !nip || !password) {
        commonHelper.response(
          res,
          [],
          400,
          "Data is incomplete! Check your input!"
        );
      }

      //Verifikasi email dan pengecekan apakah email sudah terdaftar
      const emailChecker =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (!String(email).toLowerCase().match(emailChecker)) {
        commonHelper.response(res, [], 400, "Email is invalid");
      }

      const resultEmail = await findEmail(email);

      if (resultEmail[0]["COUNT(*)"] > 0) {
        commonHelper.response(res, [], 409, "Email already registered");
      }

      //Verifikasi NIP dan pengecekan apakah NIP sudah terdaftar
      if (
        !Number.isInteger(nip) ||
        nip < 0 ||
        firstDigitNip < 1 ||
        firstDigitNip > 3
      ) {
        commonHelper.response(res, [], 400, "Invalid NIP");
      }
      if (nip.toString().length < 8 || nip.toString().length > 20) {
        commonHelper.response(res, [], 400, "NIP must be 8 - 20 digit number");
      }

      const resultNip = await findNip(nip);
      if (resultNip[0]["COUNT(*)"] > 0) {
        commonHelper.response(res, [], 409, "NIP already registered");
      }

      //Verifikasi password dan hash password
      if (password.length < 6 || password.length > 20) {
        commonHelper.response(
          res,
          [],
          400,
          "Password must be 6 - 20 characters"
        );
      }
      const passwordHash = bcrypt.hashSync(password, 10);

      //Penentuan Role dilihat dari digit pertama NIP
      if (firstDigitNip === "1") {
        role = "superuser";
      } else if (firstDigitNip === "2") {
        role = "admin";
      } else if (firstDigitNip === "3") {
        role = "user";
      }

      const insertData = {
        id,
        name,
        email,
        nip,
        passwords: passwordHash,
        role,
      };
      
      insertUser(insertData)
      .then(result => commonHelper.response(res, {affectedRows: result.affectedRows}, 200, "Succesfully registered"))
      .catch(error => commonHelper.response(res, error, 500, "Internal server error"));

    } catch (error) {
      console.log(error);
    }
  },

  login: async (req, res) => {
    try {
      const username = req.body.username;
      const user = { name: username };
      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);
      refreshTokens.push(refreshToken);
      commonHelper.response(
        res,
        { accessToken: accessToken, refreshToken: refreshToken },
        200,
        "Login successful"
      );
    } catch (error) {
      console.log(error);
    }
  },

  refreshToken: async (req, res) => {
    try {
      const refreshToken = req.body.refreshToken;
      if (!refreshToken) {
        return commonHelper.response(res, [], 401, "No refresh token detected");
      }

      if (!refreshTokens.includes(refreshToken)) {
        return commonHelper.response(res, [], 401, "Invalid refresh token");
      }

      jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, user) => {
          if (err) return commonHelper.response(res, err, 403, "Forbidden");
          const accessToken = generateAccessToken({ name: user.name });
          commonHelper.response(
            res,
            { accessToken: accessToken },
            201,
            "Access token generated succesfully"
          );
        }
      );
    } catch (error) {
      console.log(error);
    }
  },

  logout: async (req, res) => {
    try {
      refreshTokens = refreshTokens.filter((token) => token !== req.body.token);
      commonHelper.response(res, [], 204, "");
    } catch (error) {
      console.log(error);
    }
  },

  profile: (req, res) => {
    const posts = [
      {
        name: "user1",
        role: "admin",
      },
      {
        name: "user2",
        role: "superuser",
      },
    ];

    try {
      res.json(posts.filter((post) => post.name === req.user.name));
    } catch (error) {
      console.log(error);
    }
  },
};

module.exports = usersController;
