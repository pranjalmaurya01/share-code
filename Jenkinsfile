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
        nvm(version: 'v0.39.3', nvmInstallURL: 'https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh') {
          sh 'node --version'
        }

      }
    }

  }
}