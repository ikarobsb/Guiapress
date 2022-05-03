const express = require("express");
const router = express.Router();
const User = require("./User");
const bcrypt = require("bcryptjs");

router.get("/admin/users", (req, res) => {
  User.findAll().then((users) => {
    res.render("admin/users/index", { users });
  });
});

router.get("/admin/users/create", (req, res) => {
  res.render("admin/users/create");
});

router.post("/users/create", (req, res) => {
  var email = req.body.email;
  var password = req.body.password;

  User.findOne({ where: { email: email } }).then((user) => {
    if (user == undefined) {
      //e-mail ainda não cadastrado
      var salt = bcrypt.genSaltSync(10);
      var hash = bcrypt.hashSync(password, salt);

      User.create({
        email: email,
        password: hash, //hash - criptografa uma senha, para não guardar a senha no banco
      })
        .then(() => {
          res.redirect("/");
        })
        .catch((err) => {
          res.send(err);
        });
    } else {
      res.redirect("/admin/users/create");
    }
  });
});

module.exports = router;
