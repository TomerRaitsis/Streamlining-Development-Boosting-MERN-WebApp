# main.tf

provider "aws" {
  region  = "eu-central-1"
  profile = "default"
}

resource "aws_ecr_repository" "backend_ecr_repo" {
  name = "backend-repo"
  
}

resource "aws_ecr_repository" "frontend_ecr_repo" {
  name = "frontend-repo"
}

resource "aws_ecr_repository" "db_seeding_ecr_repo" {
  name = "db-seeding-repo"
}
