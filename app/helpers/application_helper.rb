module ApplicationHelper
  def with_confirmation?
    params[:confirmation] == 'true'.freeze
  end

  def date_param
    Date.parse(params[:date])
  rescue
    Date.today
  end

  def span_param
    TimeInterval.new(Time.parse(params[:start]), Time.parse(params[:end]))
  rescue
    TimeInterval.week(date_param)
  end

  def delete_button_to(title, url, options = {})
    html_options = {
      class: 'delete_button_to',
      method: :delete
    }.merge(options.delete(:html_options) || {})

    form_for :delete, url: url, html: html_options do |f|
      f.submit title, options
    end
  end
end
