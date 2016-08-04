namespace :test do
  task :all => [:environment, :spec, :client] {  }
  task :client => :environment do
    sh 'npm run test:client'
  end
end
