const express = require("express");
const router = express.Router(); // método de criação de rotas nativo do express
const Category = require("./Category");
const slugify = require("slugify");
const adminAuth = require("../middlewares/adminAuth");

router.get("/admin/categories/new", adminAuth,  (req, res) => {
  res.render("admin/categories/new");
});

router.post("/categories/save", adminAuth, (req, res) => {
  var title = req.body.title;
  if (title != undefined) {
    Category.create({
      title: title,
      slug: slugify(title), // slug é uma versão em que os espaços são substituidos por hífens e todas as letras são minúsculas - utilizamos a biblioteca slugify.
    }).then(() => {
      res.redirect("/admin/categories");
    });
  } else {
    res.redirect("/admin/categories/new");
  }
});

router.get("/admin/categories", adminAuth, (req, res) => {
  Category.findAll().then((categories) => {
    res.render("admin/categories/index", { categories: categories });
  });
});

router.post("/categories/delete", (req, res) => {
  var id = req.body.id;
  if (id != undefined) {
    if (!isNaN(id)) {
      Category.destroy({
        where: {
          id: id,
        },
      }).then(() => {
        res.redirect("/admin/categories");
      });
    } else {
      // se id não for um número
      res.redirect("/admin/categories");
    }
  } else {
    // se id for nulo
    res.redirect("/admin/categories");
  }
});

router.get("/admin/categories/edit/:id", adminAuth, (req, res) => {
  var id = req.params.id;
  if (id != undefined) {
    if (!isNaN(id)) {
      Category.findByPk(id).then((category) => {
        res.render("admin/categories/edit", { category: category });
      });
    } else {
      // se id não for um número
      res.redirect("/admin/categories");
    }
  } else {
    // se id for nulo
    res.redirect("/admin/categories");
  }
});

router.post("/categories/update", adminAuth, function (req, res) {
  var id = req.body.id;
  var title = req.body.title;

  Category.update(
    { title: title, slug: slugify(title) },
    {
      where: { id: id },
    }
  ).then(() => {
    res.redirect("/admin/categories");
  });
});

module.exports = router;
