jQuery(document).ready(function ($){

  var ext_params = null;
  var interval = 30;
  
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
      countdown();
    });
  }

  function addImages(images){
    var p = $("<p></p>");
    $("#images").prepend(p)
    var index = images.length - 1;
    function add(){
      if (index < 0) {
        return;
      }
      p.prepend($("<img />", {src: images[index--]}));
      setTimeout(add, interval * 1000 / images.length);
    }
    add()
  }

  function countdown(){
    var count = interval;
    function down(){
      if (count == 0) {
        $("#countdown").text("0: Waiting...");
        search();
        return;
      }
      $("#countdown").text(count--);
      setTimeout(down, 1 * 1000);
    }
    down();
  }
});
