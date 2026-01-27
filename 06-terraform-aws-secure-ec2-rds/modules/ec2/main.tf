resource "aws_instance" "app" {
  ami                    = "ami-0f5ee92e2d63afc18"
  instance_type          = "t3.micro"
  subnet_id              = var.subnet_id
  vpc_security_group_ids = [var.security_group_id]
  key_name               = var.key_pair_name

  user_data = <<-EOF
              #!/bin/bash
              apt update -y
              apt install apache2 php php-mysql -y
              systemctl enable apache2
              systemctl start apache2
              EOF

  tags = {
    Name = "app-ec2"
  }
}
