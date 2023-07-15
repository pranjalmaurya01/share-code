pipeline {
  agent any
  stages {
    stage('Checkout Code') {
      steps {
        git(url: 'https://github.com/pranjalmaurya01/share-code', branch: 'main')
        sh 'ls -a'
      }
    }

    stage('Install Dep') {
      steps {
        nvm(version: 'v20.4.0') {
          sh 'bash install.sh'
        }

      }
    }

    stage('Build Frontend') {
      steps {
        nvm(version: 'v20.4.0') {
          sh '''cd front
npm run build'''
        }

      }
    }

  }
}