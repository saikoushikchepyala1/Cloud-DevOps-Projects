terraform {
  backend "s3" {
    bucket         = "terraform-state-project-07"
    key            = "project-07/terraform.tfstate"
    region         = "ap-south-1"
    dynamodb_table = "terraform-state-locks-project-07"
    encrypt        = true
  }
}
