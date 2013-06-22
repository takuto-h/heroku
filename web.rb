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
  results = client.search("#{params[:q]}", since_id: params[:since_id], count: 100)
  profile_image_urls = []
  results.statuses.each do |tweet|
    break if tweet.id == params[:since_id]
    profile_image_urls << tweet.user.profile_image_url
  end
  response = {
    profile_image_urls: profile_image_urls,
    max_id: results.max_id,
  }
  content_type :json
  response.to_json
end
