# -*- coding: utf-8 -*-

require 'sinatra'
require 'twitter'

get '/' do
  "Hello, world"
end

get '/nagametter' do
  Twitter.home_timeline.to_s
end
