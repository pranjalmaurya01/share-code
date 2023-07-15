pipeline {
  agent any
  stages {
    stage('Checkout Code') {
      steps {
        git(url: 'https://github.com/pranjalmaurya01/share-code', branch: 'main')
        sh 'ls -a'
      }
    }

    stage('NVM') {
      steps {
        sh '''nvm install 20
nvm use 20'''
      }
    }

  }
}