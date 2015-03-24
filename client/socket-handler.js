/**
 * Client Side
 *
 * Query an element and listen to files being drarg and dropped in order to
 * send the file to the server throuth a POST and a PUT request
 */

// You must have an element with the ID `dropzone`
var socket = io.connect('http://localhost:8000');

socket.on('Image:update', function (image) {
  var reader = new FileReader();
  reader.onload = function(e) {
    $('#images')
      .html('<img src="' + e.target.result + '" />');
  }.bind(this);
  reader.readAsDataURL(new Blob([image.file]));
});
