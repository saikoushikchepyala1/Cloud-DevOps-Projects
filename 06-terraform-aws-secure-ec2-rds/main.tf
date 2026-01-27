module "vpc" {
  source = "./modules/vpc"
}

module "ec2" {
  source            = "./modules/ec2"
  subnet_id         = module.vpc.public_subnet_id
  security_group_id = module.vpc.app_sg_id
  key_pair_name     = var.key_pair_name
}

module "rds" {
  source            = "./modules/rds"
  subnet_ids        = module.vpc.private_subnet_ids
  security_group_id = module.vpc.db_sg_id
}
