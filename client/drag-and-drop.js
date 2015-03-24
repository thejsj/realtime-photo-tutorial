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

  // Get the first file only
  var file = evt.dataTransfer.files[0]; // FileList object.
  var reader = new FileReader();

  var data = new FormData();
  data.append('file', file);
  data.append('fileName', file.name);
  data.append('type', file.type);

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
}, false);

el.addEventListener('dragover', function (evt) {
  evt.stopPropagation();
  evt.preventDefault();
  evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
});
