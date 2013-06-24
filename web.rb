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
  if params[:since_id]
    results = client.search("#{params[:q]}", since_id: params[:since_id], count: 100)
  else
    results = client.search("#{params[:q]}", count: 100)
  end
  profile_image_urls = []
  results.statuses.each do |tweet|
    if params[:since_id] && tweet.id <= params[:since_id].to_i
      break
    end
    if params[:since_time] && tweet.created_at < Time.at(params[:since_time].to_i / 1000)
      break
    end
    profile_image_urls << tweet.user.profile_image_url
  end
  response = {
    profile_image_urls: profile_image_urls,
    max_id: results.max_id,
  }
  content_type :json
  response.to_json
end
