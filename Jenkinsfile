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
        sh '''curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
nvm install 20
nvm use 20'''
      }
    }

  }
}