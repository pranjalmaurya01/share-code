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

    stage('Build Frontend') {
      steps {
        sh '''cd front
npm run build'''
      }
    }

    stage('Run Frontend') {
      parallel {
        stage('Run Frontend') {
          steps {
            sh '''cd front
npm run start'''
          }
        }

        stage('Run Backend') {
          steps {
            sh '''cd back
npm run dev'''
          }
        }

      }
    }

  }
}