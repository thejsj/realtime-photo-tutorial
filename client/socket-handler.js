/**
 * Client Side
 *
 * Query an element and listen to files being drarg and dropped in order to
 * send the file to the server throuth a POST and a PUT request
 */

// You must have an element with the ID `dropzone`
var socket = io.connect('http://localhost:8000');


socket.on('Photo:update', function (photo) {
  var reader = new FileReader();
  reader.onload = function(e) {
    var base64 = e.target.result.match(/^data:([A-Za-z-+\/]*);base64,(.+)$/);
    var src = 'data:' + photo.type  + ';base64,' + base64[2];
    $('#images')
      .html('<img src="' + src + '" />');
  }.bind(this);
  reader.readAsDataURL(new Blob([photo.file]));
});
