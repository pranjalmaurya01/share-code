pipeline {
  agent any
  stages {
    stage('Checkout Code') {
      steps {
        git(url: 'https://github.com/pranjalmaurya01/share-code', branch: 'main')
        sh 'ls -a'
      }
    }

    stage('Node Setup') {
      steps {
        nvm(version: 'v20.4.0') {
          sh 'bash install.sh'
        }

      }
    }

  }
}