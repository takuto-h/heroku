jQuery(document).ready(function ($){
  $("#search").click(function (event){
    search(query);
  });

  $("#query").keypress(function (event){
    if (event.which == 13){
      event.preventDefault();
      search(query);
    }
  });

  function search(){
    var query = $("#query").val();
    if (query == "") {
      return;
    }
    $("#query").attr("disabled", "disabled");
    $("#search").attr("disabled", "disabled");
    $.getJSON("/nagametter/search", {q: query}, function (images){
      addImages(images);
      $("#query").removeAttr("disabled");
      $("#search").removeAttr("disabled");
    });
  }

  function addImages(images){
    var p = $("<p></p>");
    $.each(images, function (index, image_url){
      p.append($("<img />", {src: image_url}));
    });
    $("#images").prepend(p)
  }
});
