pipeline {
    agent any

    environment {
        AWS_DEFAULT_REGION = 'ap-south-2'   // change if needed
        S3_BUCKET = 'stocks-crop'      // 🔴 replace with your bucket
    }

    stages {

        stage('Clone Repo') {
            steps {
                git 'https://github.com/subramanyam-code/Trading-Stocks.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build Project') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Deploy to S3') {
            steps {
                sh '''
                aws s3 sync build/ s3://$S3_BUCKET --delete
                '''
            }
        }

    post {
        success {
            echo '✅ Deployment to S3 successful!'
        }
        failure {
            echo '❌ Deployment failed!'
        }
    }
}