jQuery(document).ready(function ($){

  var interval = 30;

  var ctxt = $("#canvas")[0].getContext("2d");
  var canvas_width = 1280;
  var canvas_height = 240;

  var images = [];
  var image_old_gen = 2;
  var image_width = 48;
  var image_height = 48;
  var image_initial_vx = 2;
  var image_initial_vy = 2;
  var image_props = {x: 0, y: 0, vx: image_initial_vx, vy: image_initial_vy, gen: 0};

  var ext_params = {};

  $(window).resize(resize);
  resize();
  
  $("#search").click(function (event){
    start();
  });

  $("#query").keypress(function (event){
    if (event.which == 13){
      event.preventDefault();
      start();
    }
  });

  function resize(){
    var border_width = $("#canvas").outerWidth() - $("#canvas").innerWidth();
    canvas_width = $("body").width() - border_width;
    $("#canvas").attr("width", canvas_width);
    $("#canvas").attr("height", canvas_height);
  }
  
  function start(){
    var query = $("#query").val();
    if (query == "") {
      return;
    }
    $("#query").attr("disabled", "disabled");
    $("#search").attr("disabled", "disabled");
    start_animation();
    ext_params = {since_time: $.now() - interval * 2 * 1000};
    search();
  }
  
  function start_animation(){
    function draw_images() {
      ctxt.clearRect(0, 0, canvas_width, canvas_height);
      $.each(images, function(i, image){
        image.x += image.vx;
        image.y += image.vy;
        if (image.gen < image_old_gen) {
          detect_collision(image);
        }
        ctxt.drawImage(image.elem, image.x, image.y);
      });
      setTimeout(draw_images, 1);
    }
    draw_images();
  }
  
  function detect_collision(image){
    for (var i = 0; i < images.length; i++) {
      var other = images[i];
      if (other == image) {
        continue;
      }
      var dx = Math.abs(image.x - other.x);
      var dy = Math.abs(image.y - other.y);
      if (0 <= dx && dx <= image_width && 0 <= dy && dy <= image_height)  {
        handle_collision_with_other_image(image, other, dx, dy);
        break;
      }
    }
    detect_collision_with_walls(image);
  }

  function handle_collision_with_other_image(image, other, dx, dy){
    if (dy <= dx) {
      if (image.x < other.x) {
        image.vx = -image_initial_vx;
      }
      else {
        image.vx = image_initial_vx;
      }
    }
    if (dx <= dy) {
      if (image.y < other.y) {
        image.vy = -image_initial_vy;
      }
      else {
        image.vy = image_initial_vy;
      }
    }
  }

  function detect_collision_with_walls(image){
    if (image.x < 0) {
      image.vx = image_initial_vx;
    }
    if (canvas_width < image.x + image_width) {
      image.vx = -image_initial_vx;
    }
    if (image.y < 0) {
      image.vy = image_initial_vy;
    }
    if (canvas_height < image.y + image_height) {
      image.vy = -image_initial_vy;
    }
  }
  
  function search(){
    var query = $("#query").val();
    var params = $.extend({q: query}, ext_params);
    $.getJSON("/nagametter/search", params, function (response){
      ext_params = {since_id: response.max_id_str};
      update_image_gens();
      add_images(response.statuses);
      countdown();
    });
  }

  function add_images(statuses){
    var p = $("<p></p>");
    $("#images").prepend(p);
    var index = statuses.length - 1;
    function loop(){
      if (index < 0) {
        return;
      }
      var url =
        "//twitter.com/" + statuses[index].user.screen_name +
        "/statuses/" + statuses[index].id_str;
      var a = $("<a></a>", {href: url, target: "_blank"});
      var img = $("<img />", {
        src: statuses[index].user.profile_image_url,
        title: statuses[index].text,
      });
      a.append(img);
      p.prepend(a);
      images.unshift($.extend({elem: img[0]}, image_props));
      index--;
      setTimeout(loop, interval * 1000 / statuses.length);
    }
    loop();
  }

  function update_image_gens(){
    new_images = [];
    for (var i = 0; i < images.length; i++) {
      if (images[i].gen++ >= image_old_gen) {
        break;
      }
      new_images.push(images[i]);
    }
    images = new_images;
  }

  function countdown(){
    var count = interval;
    function loop(){
      if (count == 0) {
        $("#countdown").text("0: Waiting...");
        search();
        return;
      }
      $("#countdown").text(count--);
      setTimeout(loop, 1 * 1000);
    }
    loop();
  }
});
