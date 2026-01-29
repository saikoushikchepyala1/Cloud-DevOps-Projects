variable "aws_region" {
  type    = string
  default = "ap-south-1"
}

variable "key_pair_name" {
  type    = string
  default = "terraform-ec2-key"
}

variable "allowed_ssh_cidr" {
  type    = string
  default = "157.48.150.39/32"
}