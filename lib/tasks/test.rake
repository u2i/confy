namespace :test do
  task :all => :environment do
    sh 'rspec'
    sh 'npm run test:client'
  end
  task :rails => :environment do
    sh 'rspec'
  end
  task :client => :environment do
    sh 'npm run test:client'
  end
end
