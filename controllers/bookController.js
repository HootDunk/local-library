// import all models
var Book = require('../models/book');
var Author = require('../models/author');
var Genre = require('../models/genre');
var BookInstance = require('../models/bookinstance');

var async = require('async');


exports.index = function(req, res) {   
    
    async.parallel({
        book_count: function(callback) {
            Book.countDocuments({}, callback); // Pass an empty object as match condition to find all documents of this collection
        },
        book_instance_count: function(callback) {
            BookInstance.countDocuments({}, callback);
        },
        book_instance_available_count: function(callback) {
            BookInstance.countDocuments({status:'Available'}, callback);
        },
        author_count: function(callback) {
            Author.countDocuments({}, callback);
        },
        genre_count: function(callback) {
            Genre.countDocuments({}, callback);
        }
    }, function(err, results) {
        res.render('index', { title: 'Local Library Home', error: err, data: results });
    });
};

// Display list of all Books.
exports.book_list = function(req, res, next) {

    Book.find({}, 'title author')
      .populate('author')
      .exec(function (err, list_books) {
        if (err) { return next(err); }
        //Successful, so render
        res.render('book_list', { title: 'Book List', book_list: list_books });
      });
      
  };

// Display detail page for a specific book.
exports.book_detail = function(req, res) {
    // Book.findById(req.params.id)
    // .populate('genre')
    // .populate('author')
    // .exec(function(err, book_info) {
    //     if(err) { return next(err); }
    //     // Succesful, so render
    //     res.render('book_detail', {title: 'Title: ' + book_info.title, book_detail: book_info})
    // })

    async.parallel({
        book_info: function(callback) {
            Book.findById(req.params.id)
            .populate('genre')
            .populate('author')
                .exec(callback);
        },

        book_instances: function(callback) {
            BookInstance.find({'book': req.params.id})
                .exec(callback)
        },
    }, function(err, results) {
        if(err) { return next(err); }
        if (results.book_info == null){
            let err = new Error("Author not found");
            err.status = 404;;
            return next(err);
        }
        res.render('book_detail', {title: 'Title: ' + results.book_info.title, book_info: results.book_info, book_instances: results.book_instances})
    })
};

// Display book create form on GET.
exports.book_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Book create GET');
};

// Handle book create on POST.
exports.book_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Book create POST');
};

// Display book delete form on GET.
exports.book_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Book delete GET');
};

// Handle book delete on POST.
exports.book_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Book delete POST');
};

// Display book update form on GET.
exports.book_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Book update GET');
};

// Handle book update on POST.
exports.book_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Book update POST');
};