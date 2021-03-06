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
  options = {result_type: "recent", count: 100}
  if params[:since_id]
    options[:since_id] = params[:since_id]
  end
  result = client.search("#{params[:q]}", options)
  statuses = []
  result.statuses.each do |tweet|
    if params[:since_id] && tweet.id <= params[:since_id].to_i
      break
    end
    if params[:since_time] && tweet.created_at < Time.at(params[:since_time].to_i / 1000)
      break
    end
    statuses << {
      id_str: tweet.id.to_s,
      text: tweet.full_text,
      user: {
        screen_name: tweet.user.screen_name,
        profile_image_url: tweet.user.profile_image_url,
      },
    }
  end
  response = {statuses: statuses, max_id_str: result.max_id.to_s}
  content_type :json
  response.to_json
end
