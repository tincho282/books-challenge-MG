const bcryptjs = require('bcryptjs');
const db = require('../database/models');

const mainController = {
  home: (req, res) => {
    db.Book.findAll({
      include: [{ association: 'authors' }]
    })
      .then((books) => {
        res.render('home', { books });
      })
      .catch((error) => console.log(error));
  },
  bookDetail: (req, res) => {
    const id = req.params.id
    db.Book.findByPk(id)
    .then(books => res.render("bookDetail", {books}))
    // Implement look for details in the database
  },
  bookSearch: (req, res) => {
    res.render('search', { books: [] });
  },
  bookSearchResult: async (req, res) => {
    // Implement search by title
    let books = await db.Book.findOne({where:{title: `${req.body.title}`}})
    
    res.render('bookDetail',{ books});
  },
  deleteBook: (req, res) => {
    // Implement delete book
    let id = req.params.id;
        db.Books.destroy({
            where: { id: id }, forcer: true
        })
        .then(() => {
            return res.redirect("/books/edit"); // Revisar este redirect
        })
        .catch(error => res.send(error)) 
    res.render('home');
  },
  authors: (req, res) => {
    db.Author.findAll()
      .then((authors) => {
        res.render('authors', { authors });
      })
      .catch((error) => console.log(error));
  },
  authorBooks: (req, res) => {
    // Implement books by author
    res.render('authorBooks');
  },
  register: (req, res) => {
    res.render('register');
  },
  processRegister: (req, res) => {
    db.User.create({
      Name: req.body.name,
      Email: req.body.email,
      Country: req.body.country,
      Pass: bcryptjs.hashSync(req.body.password, 10),
      CategoryId: req.body.category
    })
      .then(() => {
        res.redirect('/');
      })
      .catch((error) => console.log(error));
  },
  login: async (req, res) => {
    // Implement login process
    let userToLog = await db.User.findOne({ where: { email: `${req.body.email}` } })
    if (userToLog) {
      let passwordCorrect = bcryptjs.compareSync(`${req.body.password}`, `${userToLog.password}`);
      if (passwordCorrect) {
        delete userToLog.password;
        req.session.userLogged = userToLog;

      }
    }
    res.render('login');
  },
  processLogin: async (req, res) => {
    // Implement login process
    let userToLog = await db.User.findOne({ where: { email: `${req.body.email}` } })
    if (userToLog) {
      let passwordCorrect = bcryptjs.compareSync(`${req.body.password}`, `${userToLog.password}`);
      if (passwordCorrect) {
        delete userToLog.password;
        req.session.userLogged = userToLog;

        if (req.body.remember - user) {
          res.cookie('userEmail', req.body.email, { maxAge: (1000 * 60) * 2 })
        }
        return res.render('home', { userToLog })
      }
      return res.render('home', {
        errors: {
          email: {
            msg: 'Credenciales incorrectas'
          }
        }
      });
    }

    return res.render('login', {
      errors: {
        email: {
          msg: 'Email no registrado'
        }
      }
    })
    /* res.render('home'); */
  },
  edit: (req, res) => {
    Id = req.params.id;
    db.Books.update({
        title: req.body.title,
        cover: req.body.cover,
        description: req.body.description
    }, {
        where: { id: books.id } // Acá sería bookId?
    }) 
        .then(() => {
            return res.redirect("books/edit", { book }); // Es correcto este redirect?
        })
        .catch(error => res.send(error))  
    // Implement edit book
    res.render('editBook', {id: req.params.id})
  },
  processEdit: (req, res) => {
    let id = req.params.id
    db.Books.findByPk(id)
        .then(book => {
            return res.render('books', { book })
        });
    // Implement edit book
    res.render('home');
  },
  logout: (req, res) => {
    res.clearCookie('userEmail');
    req.session.destroy();
    return res.redirect('/');
  }
};

module.exports = mainController;
