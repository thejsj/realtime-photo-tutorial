/**
 * Client Side
 *
 * Query an element and listen to files being drarg and dropped in order to
 * send the file to the server throuth a POST and a PUT request
 */

// You must have an element with the ID `dropzone`
var el = document.getElementById('dropzone');

el.addEventListener("drop", function(evt) {

  // prevent default action (open as link for some elements)
  evt.preventDefault();
  evt.stopPropagation();

  // Save the X and Y position fo the mouse, to send it to the server
  var x = evt.clientX, y = evt.clientY;

  // Get the first file only
  var file = evt.dataTransfer.files[0]; // FileList object.
  var reader = new FileReader();

  reader.onload = function(e) {

    // e.target.result resturns a string with the image encoded as base64
    var base64 = e.target.result;

    // We want to find the MIME Type for this image
    var matches = base64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);

   // Add the image and metadata to a FormData object
    var data = new FormData();
    data.append('file', e.target.result);
    data.append('fileName', file.name);
    data.append('type', matches[1]);
    data.append('x', x);
    data.append('y', y);

    // Send an HTTP POST request using the jquery
    $.ajax({
      url: '/image',
      data: data,
      processData: false,
      contentType: false,
      type: 'POST',
      success: function(data){
        console.log('Image uploaded!');
      }
    });
  }.bind(this);

  // Read only the first file
  reader.readAsDataURL(file);
}, false);

el.addEventListener('dragover', function (evt) {
  evt.stopPropagation();
  evt.preventDefault();
  evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
});
