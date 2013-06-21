jQuery(document).ready(function ($){

  var ext_params = null
  
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
    var params = $.extend({q: query}, ext_params);
    $.getJSON("/nagametter/search", params, function (response){
      ext_params = {since_id: response.max_id};
      addImages(response.profile_image_urls);
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
