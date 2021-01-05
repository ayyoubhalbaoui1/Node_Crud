const express = require('express')
const app = express()
const bodyParser = require('body-parser')
var mysql = require('mysql')

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'node_crud'
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine', 'ejs');


var obj = {};
app.get('/', function(req, rep) {
    connection.query('SELECT product.*, category.catname FROM product  JOIN category  ON product.id_category = category.id', function(err, result) {
        if (err) {
            throw err;
        } else {
            obj = {
                produits: result
            };
            rep.render('produits', obj);
        }
    });
})



app.get('/addcat', function(req, rep) {
    rep.render('addcat');
})


app.get('/category', function(req, rep) {
    connection.query('SELECT * FROM category', function(err, result) {
        if (err) {
            throw err;
        } else {
            obj = {
                category: result
            };
            rep.render('category', obj);
        }
    });
})


app.get('/addprod', function(req, rep) {


    connection.query('SELECT catname FROM category', function(err, result) {
        if (err) {
            throw err;
        } else {
            obj.category = result;
            rep.render('addprod', obj);
            console.log(obj)
        }
    });
});







app.post('/addprod', function(req, res, next) {
    let id = null;
    let nom = req.body.nom;
    let prix = req.body.prix;
    let categorie = req.body.categ;
    let errors = false;


    if (!errors) {



        connection.query('SELECT id FROM category WHERE catname= ?', categorie, function(err, result) {
            if (err) {
                throw err;
            } else {

                categorie = result[0].id

                var form_produit = {
                    id: id,
                    name: nom,
                    price: prix,
                    id_category: categorie
                }
                connection.query('INSERT INTO product SET ?', form_produit, function(err, result) {
                    if (err) {
                        throw err;


                    } else {
                        res.redirect('/');
                    }
                })
            }
        });

    }
});






app.post('/addcat', function(req, res, next) {

    let id = null;
    let categorie = req.body.categorie;


    let errors = false;



    if (!errors) {

        var form_cat = {
            id: id,
            catname: categorie



        }
        connection.query('INSERT INTO category SET ?', form_cat, function(err, result) {
            if (err) {
                throw err;


            } else {
                res.redirect('/addprod');
            }
        })
    }
})










app.get('/updateproduct/:id', function(req, rep, next) {

    let id = req.params.id

    connection.query("SELECT * FROM product WHERE id = '" + id + "' ", (err, result) => {
        if (!err) {

            rep.render('updateprod', { test: result })


        } else {
            rep.send(err)

        }
    })

})

app.post('/updateproduct/:id', (req, res) => {

    let id = req.params.id;
    let nom = req.body.nom;
    let prix = req.body.prix;



    connection.query("UPDATE product SET name = '" + nom + "', price = '" + prix + "' WHERE id = '" + id + "'", (err, result) => {
        if (!err) {
            res.redirect("/")
        } else {
            res.send(err)

        }

    })

})



app.get('/updatecategory/:id', function(req, res) {

    let catId = req.params.id

    connection.query("SELECT * FROM category WHERE id = '" + catId + "' ", (err, result) => {
        if (!err) {
            res.render('updatecategory.ejs', { test: result })

        } else {
            res.send(err)
        }
    })

})

app.post('/updatecategory/:id', (req, res) => {

    let id = req.params.id;
    let categorie = req.body.categorie;



    connection.query("UPDATE category SET catname = '" + categorie + "' WHERE id = '" + id + "'", (err, result) => {
        if (!err) {
            res.redirect("/category")
        } else {
            res.send(err)

        }

    })

})









app.get('/delete/(:id)', function(req, res, next) {
    let id = req.params.id;
    connection.query('DELETE FROM product WHERE id = ' + id, function(err, result) {
        if (err) {

            res.redirect('/')
        } else {

            res.redirect('/')
        }
    })
})



app.get('/delete/cat/(:id)', function(req, res, next) {
    let id = req.params.id;
    connection.query('DELETE FROM category WHERE id = ' + id, function(err, result) {
        if (err) {

            res.redirect('/category')
        } else {

            res.redirect('/category')
        }
    })
})






connection.connect((err) => {
    if (!err)
        console.log('DB connection succeded.')
    else
        console.log('DB connection failed \n Error :' + JSON.stringify(err, undefined, 2))
})





app.listen(3000, () => console.log('Listening on port 3000...'))