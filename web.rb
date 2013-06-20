# -*- coding: utf-8 -*-

require 'sinatra'
require 'twitter'

get '/' do
  "Hello, world"
end

get '/nagametter' do
  client = Twitter::Client.new(
    consumer_key: ENV["CONSUMER_KEY"],
    consumer_secret: ENV["CONSUMER_SECRET"],
  )
  client.search(params[:q]).statuses.map do |tweet|
    tweet.user.name
  end.to_s
end
