jQuery(document).ready(function ($){

  var ext_params = null
  
  $("#search").click(function (event){
    start();
  });

  $("#query").keypress(function (event){
    if (event.which == 13){
      event.preventDefault();
      start();
    }
  });

  function start(){
    var query = $("#query").val();
    if (query == "") {
      return;
    }
    $("#query").attr("disabled", "disabled");
    $("#search").attr("disabled", "disabled");
    search();
  }

  function search(){
    var query = $("#query").val();
    var params = $.extend({q: query}, ext_params);
    $.getJSON("/nagametter/search", params, function (response){
      ext_params = {since_id: response.max_id};
      addImages(response.profile_image_urls);
      setTimers()
    });
  }

  function addImages(images){
    var p = $("<p></p>");
    $.each(images, function (index, image_url){
      p.append($("<img />", {src: image_url}));
    });
    $("#images").prepend(p)
  }

  function setTimers(){
    var count = 30;
    function countdown(){
      if (count >= 0) {
        $("#countdown").text(count--);
        setTimeout(countdown, 1 * 1000);
      }
      else {
        $("#countdown").text("Waiting...");
      }
    }
    countdown();
    setTimeout(search, 30 * 1000);
  }
});
