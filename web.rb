# -*- coding: utf-8 -*-

require 'sinatra'
require 'twitter'
require 'haml'

get '/' do
  "Hello, world"
end

get '/nagametter' do
  client = Twitter::Client.new(
    consumer_key: ENV["CONSUMER_KEY"],
    consumer_secret: ENV["CONSUMER_SECRET"],
  )
  @images = ""
  client.search(params[:q]).statuses.each do |tweet|
    @images << haml(
      "%img{src: tweet.user.profile_image_url}", locals: {tweet: tweet}
    )
  end
  haml :nagametter
end

__END__

@@ nagametter
%html
  %head
    %title Nagametter
  %body
    = @images
