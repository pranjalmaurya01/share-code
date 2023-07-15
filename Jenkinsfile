pipeline {
  agent any
  stages {
    stage('Checkout Code') {
      steps {
        git(url: 'https://github.com/pranjalmaurya01/share-code', branch: 'main')
        sh 'ls -a'
      }
    }

    stage('') {
      steps {
        nvm(version: 'v0.39.3') {
          sh 'node --version'
        }

      }
    }

  }
}