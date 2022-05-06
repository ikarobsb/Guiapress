const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const session = require("express-session");
const connection = require("./database/database");

const categoriesController = require("./categories/CategoriesController");
const articlesController = require("./articles/ArticlesController");
const usersController = require("./users/UsersControler");

const Article = require("./articles/Article");
const Category = require("./categories/Category");
const User = require("./users/User");

// View wngine
app.set("view engine", "ejs");

// Sessions
app.use(
  session({
    secret: "qualquercoisa",
    cookie: {
      maxAge: 1000 * 60 * 60 * 2, // 2 horas
    },
  })
);

// Static directory
app.use(express.static("public"));

//Body-Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// database
connection
  .authenticate()
  .then(() => {
    console.log("Conexão com o banco de dados realizada com sucesso!");
  })
  .catch((err) => {
    console.log(err);
  });

app.use("/", categoriesController); // utilizando as rotas criadas pelo categoriesController.js
app.use("/", articlesController); // utilizando as rotas criadas pelo articlesController.js
app.use("/", usersController); // utilizando as rotas criadas pelo usersController.js

// Rotas das sessions para teste
// app.get("/session", (req, res) => {
//   req.session.treinamento = "Formação NodeJS";
//   req.session.ano = 2022;
//   req.session.email = "email@"
//   req.session.user = {
//     name: "João",
//     email: "email@",
//     id: 10
//   }
//   res.send("Sessão criada!");
// })

// app.get("/leitura", (req, res) => {
//   res.json({
//     treinamento: req.session.treinamento,
//     ano: req.session.ano,
//     email: req.session.email,
//     user: req.session.user
//   })
// })

app.get("/", (req, res) => {
  Article.findAll({
    order: [["id", "DESC"]],
    limit: 4,
  }).then((articles) => {
    Category.findAll().then((categories) => {
      res.render("index", { articles: articles, categories: categories });
    });
  });
});

app.get("/:slug", (req, res) => {
  const slug = req.params.slug;
  Article.findOne({
    where: {
      slug: slug,
    },
  })
    .then((article) => {
      if (article != undefined) {
        Category.findAll().then((categories) => {
          res.render("article", { article: article, categories: categories });
        });
      } else {
        res.redirect("/");
      }
    })
    .catch((err) => {
      res.redirect("/");
    });
});

app.get("/category/:slug", (req, res) => {
  const slug = req.params.slug;
  Category.findOne({
    where: {
      slug: slug,
    },
    include: [{ model: Article }],
  })
    .then((category) => {
      if (category != undefined) {
        Category.findAll().then((categories) => {
          res.render("index", {
            articles: category.articles,
            categories: categories,
          });
        });
      } else {
        res.redirect("/");
      }
    })
    .catch((err) => {
      res.redirect("/");
    });
});

app.listen(8080, () => {
  console.log("Example app listening on port 8080!");
});
