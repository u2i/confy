namespace :test do
  task :all => [:environment, :spec, :client] {  }
  task :client do
    sh 'npm run test:client'
  end
end
