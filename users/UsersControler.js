const express = require("express");
const router = express.Router();
const User = require("./User");
const bcrypt = require("bcryptjs");
const adminAuth = require("../middlewares/adminAuth");

router.get("/admin/users", adminAuth,  (req, res) => {
  User.findAll().then((users) => {
    res.render("admin/users/index", { users });
  });
});

router.get("/admin/users/create", adminAuth, (req, res) => {
  res.render("admin/users/create");
});

router.post("/users/create", adminAuth, (req, res) => {
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

router.get("/login", (req, res) => {
  res.render("admin/users/login");
});

router.post("/authenticate", (req, res) => {
  var email = req.body.email;
  var password = req.body.password;

  User.findOne({ where: { email: email } }).then((user) => {
    if (user != undefined) {
      //Se existe um usuário, valida a senha
      var correct = (bcrypt.compareSync(password, user.password));
      if (correct) {
        req.session.user = {
          id: user.id,
          email: user.email,
        }; //criando session para login
        // res.json(req.session.user) // testando se a session foi criada
        res.redirect("/admin/articles");
      } else {
        res.redirect("/login");
      }
    } else {
      res.redirect("/login");
    }
  });
});

router.get("/logout", function(req, res) {
  req.session.user = undefined;
  res.redirect("/");
})

module.exports = router;
