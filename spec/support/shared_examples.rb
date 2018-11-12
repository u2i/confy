RSpec.shared_examples 'successfull request' do |parameter|
  it 'responds with 200' do
    subject
    expect(response).to have_http_status(:success)
  end
end

RSpec.shared_examples 'unauthenticated request' do |parameter|
  let(:headers) { {} }

  it 'responds with 401' do
    subject
    expect(response).to have_http_status(401)
  end
end
