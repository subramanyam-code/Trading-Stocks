pipeline {
    agent any

    environment {
        AWS_DEFAULT_REGION = 'ap-south-2'
        S3_BUCKET = 'stocks-crop'
    }

    stages {

        stage('Install Dependencies') {
            steps {
                bat 'npm install'
            }
        }

        stage('Build Project') {
            steps {
                bat 'npm run build'
            }
        }

        stage('Deploy to S3') {
            steps {
                bat '''
                aws s3 sync dist s3://%S3_BUCKET% --delete
                '''
            }
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
