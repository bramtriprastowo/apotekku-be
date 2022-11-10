const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

let refreshTokens = [];
const usersController = {
  register: async (req, res) => {
    const {id, name, email, passwords} = req.body;
  },

  login: async (req, res) => {
    try {
      const username = req.body.username;
      const user = { name: username };
      const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "10s",
      });
      const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "24h",
      });
      refreshTokens.push(refreshToken);
      res.json({ accessToken: accessToken, refreshToken: refreshToken });
    } catch (error) {
      console.log(error);
    }
  },

  refreshToken: async (req, res) => {
    const refreshToken = req.body.refreshToken;
    refreshToken ?? res.status(401).json({ message: "gagal" });

    if (!refreshTokens.includes(refreshToken))
      return res.status(401).json({ message: "refresh token tidak valid!" });

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) return res.status(403).json({ verifikasi: "gagal" });
      const accessToken = jwt.sign(
        { name: user.name },
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: "10s",
        }
      );
      res.status(200).json({ accessToken: accessToken });
    });
  },

  logout: (req, res) => {
    refreshTokens = refreshTokens.filter((token) => token !== req.body.token);
    console.log(refreshTokens);
    res.status(202).json({ message: "logout berhasil" });
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
