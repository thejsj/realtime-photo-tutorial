/**
 * Server Side
 *
 * Listen to new image objects coming in through the POST /image router and Save them
 * Listen to new images coming in th
 */
var _ = require('lodash');
var r = require('./db');
var multiparty = require('multiparty');
var fs = require('fs');

var imageCreate = function (req, res) {

  var form = new multiparty.Form();
  // This form is a `multipart/form-data` so we need to parse it
  // `form.parse` will get all our images and fields
  form.parse(req, function (err, fields, files) {
    var imageFilePath = files.file[0].path; // Our file in a base64 string
    var image = {
      fileName: fields.fileName[0],
      type: fields.type[0],
    };
    fs.readFile(imageFilePath, function (err, file) {
      // Convert our buffer into a ReQL binary object
      // RethinkDB accepts buffers when saving something as a binary object in the database
      image.file = r.binary(file);
      // Insert image into the database
      r
        .table('photos')
        .insert(image)
        .run(r.conn)
        .then(function (query_result) {
          res.json( {
            id: req.params.id
          });
        });
    })
  });

}

module.exports = imageCreate;
