class CalendarController < ApplicationController

  def index
    @days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
    start_time = Time.now.at_beginning_of_day
    end_time = Time.now.at_end_of_day
    step = 30.minutes
    @times = (start_time.to_i..end_time.to_i).step(step).collect { |time| Time.at time }
  end

end
