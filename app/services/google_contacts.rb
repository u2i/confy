require 'google/apis/admin_directory_v1'

class GoogleContacts
  DEFAULT_FIELDS = 'etag,kind,nextPageToken,users(name/fullName,primaryEmail)'.freeze
  VIEW_TYPE = 'domain_public'.freeze
  CUSTOMER = 'my_customer'.freeze
  MAX_USER_COUNT = 500

  attr_reader :service

  def initialize(credentials, service = nil)
    @credentials = credentials
    @service = service || Google::Apis::AdminDirectoryV1::DirectoryService.new.tap do |s|
      s.authorization = new_auth_client
    end

  end

  def call(fields = DEFAULT_FIELDS, max_results = MAX_USER_COUNT)
    service.list_users(customer: CUSTOMER, view_type: VIEW_TYPE, max_results: max_results, fields: fields)
  rescue Google::Apis::ServerError
  end

  private

  include GoogleOauthClient

  attr_accessor :credentials
end
