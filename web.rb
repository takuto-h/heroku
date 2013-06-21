# -*- coding: utf-8 -*-

require 'sinatra'
require 'twitter'
require 'json'

get '/' do
  "Hello, world"
end

use Rack::Static, root: "public", urls: {
  "/nagametter" => "/nagametter/index.html",
  "/nagametter/" => "/nagametter/index.html",
}

get '/nagametter/search' do
  client = Twitter::Client.new(
    consumer_key: ENV["CONSUMER_KEY"],
    consumer_secret: ENV["CONSUMER_SECRET"],
  )
  profile_image_urls = []
  client.search("#{params[:q]}").statuses.each do |tweet|
    profile_image_urls << tweet.user.profile_image_url
  end
  content_type :json
  profile_image_urls.to_json
end
