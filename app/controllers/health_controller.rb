class HealthController < ApplicationController
  def check_health
    head :ok
  end
end
