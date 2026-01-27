variable "aws_region" {
  description = "AWS region for the infrastructure"
  type        = string
  default     = "ap-south-1"
}

variable "project_name" {
  description = "Project name prefix"
  type        = string
  default     = "terraform-secure-ec2-rds"
}

variable "key_pair_name" {
  description = "Existing EC2 Key Pair name"
  type        = string
}
