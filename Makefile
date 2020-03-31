SHELL = /bin/sh

aws-ci-login:
	aws configure set aws_access_key_id ${AWS_CI_ACCESS_KEY_ID}
	aws configure set aws_secret_access_key ${AWS_CI_SECRET_ACCESS_KEY}
	aws configure set region ${AWS_CI_REGION}

