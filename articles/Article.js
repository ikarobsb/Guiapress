const Sequelize = require('sequelize');
const connection = require('../database/database');
const Category = require ('../categories/Category');

const Article = connection.define('articles', {
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    slug: {
        type: Sequelize.STRING,
        allowNull: false
    },
    body: {
        type: Sequelize.TEXT,
        allowNull: false
    }
});

Category.hasMany(Article); // uma categoria tem muitos artigos

Article.belongsTo(Category); // criando a relação entre as tabelas - relacionamento 1/1 (um artigo pertence a uma categoria)

// OBS - bastaria ter um dos relacionamentos acima.

// Sincronizano com o db (cria a tabela)

// Article.sync({force: true});

module.exports = Article;