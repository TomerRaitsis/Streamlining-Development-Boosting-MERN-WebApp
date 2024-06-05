# # Fetch existing ECS task execution role
# data "aws_iam_role" "ecs_task_execution_role" {
#   name = "ecsTaskExecutionRole"  # Update with the name of your existing ECS task execution role
# }

# # Define the ECS cluster
# resource "aws_ecs_cluster" "DevCluster" {
#   name = "DevCluster"
# }

# # Define the ECS task definition for MongoDB
# resource "aws_ecs_task_definition" "mongo_task" {
#     family                   = "mongo-task"
#     network_mode             = "awsvpc"
#     cpu                      = 512
#     memory                   = 1024
#     requires_compatibilities = ["FARGATE"]

#     execution_role_arn = data.aws_iam_role.ecs_task_execution_role.arn

#     container_definitions = jsonencode([
#         {
#             "name": "mongodb-container",
#             "image": "mongo:latest",
#             "cpu": 0,
#             "portMappings": [
#                 {
#                     "name": "mongodb-container-27017-tcp",
#                     "containerPort": 27017,
#                     "hostPort": 27017,
#                     "protocol": "tcp",
#                     "appProtocol": "http"
#                 }
#             ],
#             "essential": true,
#             "environment": [],
#             "environmentFiles": [],
#             "mountPoints": [],
#             "volumesFrom": [],
#             "ulimits": [],
#             "logConfiguration": {
#                 "logDriver": "awslogs",
#                 "options": {
#                     "awslogs-create-group": "true",
#                     "awslogs-group": "/ecs/mongo-task",
#                     "awslogs-region": "eu-central-1",
#                     "awslogs-stream-prefix": "ecs"
#                 },
#                 "secretOptions": []
#             },
#             "systemControls": []
#         }
#     ])
# }

# # Define the ECS service for MongoDB
# resource "aws_ecs_service" "db-service" {
#     name            = "db-service"
#     cluster         = aws_ecs_cluster.DevCluster.id
#     task_definition = aws_ecs_task_definition.mongo_task.arn
#     desired_count   = 1
#     launch_type     = "FARGATE"
#     platform_version = "LATEST"

#     network_configuration {
#         security_groups  = ["sg-07b5a31f11a551200"]
#         subnets          = ["subnet-033bd7d1a7aaf9f8f","subnet-0e0376808ba0e1efb","subnet-0c2eadf32ecd51702"]
#         assign_public_ip = true
#     }
# }

# # Define the ECS task definition for seeding
# resource "aws_ecs_task_definition" "seeding_task" {
#     family                   = "seeding-task"
#     network_mode             = "awsvpc"
#     cpu                      = 512
#     memory                   = 1024
#     requires_compatibilities = ["FARGATE"]

#     execution_role_arn = data.aws_iam_role.ecs_task_execution_role.arn

#     container_definitions = jsonencode([
#         {
#             "name": "seeding-container",
#             "image": "507618868373.dkr.ecr.eu-central-1.amazonaws.com/db-seeding-repo:latest",
#             "cpu": 0,
#             "portMappings": [
#                 {
#                     "name": "seeding-container-27017-tcp",
#                     "containerPort": 27017,
#                     "hostPort": 27017,
#                     "protocol": "tcp",
#                     "appProtocol": "http"
#                 }
#             ],
#             "essential": true,
#             "environment": [
#                 {
#                     "name": "MONGO_URI",
#                     "value": "mongodb://db-service.mongodb-container:27017"
#                 }
#             ],
#             "environmentFiles": [],
#             "mountPoints": [],
#             "volumesFrom": [],
#             "ulimits": [],
#             "logConfiguration": {
#                 "logDriver": "awslogs",
#                 "options": {
#                     "awslogs-create-group": "true",
#                     "awslogs-group": "/ecs/seeding-task",
#                     "awslogs-region": "eu-central-1",
#                     "awslogs-stream-prefix": "ecs"
#                 },
#                 "secretOptions": []
#             },
#             "systemControls": []
#         }
#     ])
# }

# # Define the ECS service for seeding
# resource "aws_ecs_service" "seeding-service" {
#     name            = "seeding-service"
#     cluster         = aws_ecs_cluster.DevCluster.id
#     task_definition = aws_ecs_task_definition.seeding_task.arn
#     desired_count   = 1
#     launch_type     = "FARGATE"
#     platform_version = "LATEST"

#     network_configuration {
#         security_groups  = ["sg-07b5a31f11a551200"]
#         subnets          = ["subnet-033bd7d1a7aaf9f8f","subnet-0e0376808ba0e1efb","subnet-0c2eadf32ecd51702"]
#         assign_public_ip = true
#     }

#     depends_on = [aws_ecs_service.db-service]
# }
