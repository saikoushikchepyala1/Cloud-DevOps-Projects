# Infrastructure as Code CI/CD Pipeline (Terraform + GitHub Actions)

This project demonstrates a fully automated Infrastructure as Code (IaC) workflow on AWS using Terraform,  and execute it via a CI/CD pipeline using GitHub Actions.

The primary focus of this project is **CI/CD-driven infrastructure management**, where all infrastructure changes are applied automatically by the pipeline. After initial setup, Terraform is not intended to be executed manually.

---

## Objectives
- Implement Infrastructure as Code using Terraform
- Enforce automated infrastructure deployment via CI/CD
- Eliminate local Terraform state and manual applies
- Store Terraform state remotely and securely
- Prevent concurrent state corruption using state locking
- Securely manage cloud credentials in automation pipelines
- Enable scalable, repeatable infrastructure provisioning

---

## Overview

The infrastructure provisioned by this project includes:

- A Amazon VPC
- A public subnet with internet connectivity
- Internet Gateway and routing configuration
- Security group with controlled ingress and egress
- An EC2 instance deployed automatically via CI/CD

All resources are managed exclusively using Terraform and applied through GitHub Actions.

---

## Architecture
```
User / Developer
        |
        |  Git Push (Terraform changes)
        v
GitHub Repository
        |
        |  Path-based trigger
        v
GitHub Actions (CI/CD Pipeline)
        |
        |  terraform init
        |  terraform validate
        |  terraform plan
        |  terraform apply
        v
AWS Infrastructure
 ├── VPC
 ├── Public Subnet
 ├── Internet Gateway
 ├── Route Table
 ├── Security Group
 └── EC2 Instance
```
---

## Technologies Used

### AWS Services Used

- Amazon VPC – Network isolation
- Amazon EC2 – Compute instance
- Amazon S3 – Terraform remote state storage
- Amazon DynamoDB – Terraform state locking
- AWS IAM – Secure authentication for CI/CD

### Tools & Automation
- Terraform – Infrastructure as Code
- GitHub Actions – CI/CD automation

---

## Project Structure

```
07-iac-ci-cd-pipeline/
│
├── terraform/
│   ├── backend.tf
│   ├── provider.tf
│   ├── main.tf
│   ├── variables.tf
│   └── outputs.tf
│
├── screenshots/
│
└── README.md
```
---

## Terraform State Management

Remote state management is used in Terraform to support automated workflows and avoid infrastructure inconsistencies.

### Remote State Design

- **Amazon S3** stores the Terraform state file
- **Amazon DynamoDB** provides state locking

This design:
- Prevents concurrent pipeline executions from corrupting state
- Enables safe CI/CD-based Terraform runs
- Eliminates dependency on local Terraform state files

---

## Terraform State Backend Setup 
- The following AWS resources are required to configure the Terraform remote state for **Project 07**.  
- This setup needs to be completed before running the CI/CD pipeline for this project.
- These resources are used by the pipeline and should not be deleted while the project is in use.

### Create S3 Bucket for Terraform State
```bash
aws s3api create-bucket \
  --bucket terraform-state-project-07 \
  --region ap-south-1 \
  --create-bucket-configuration LocationConstraint=ap-south-1
```

### Enable Versioning on State Bucket
```bash
aws s3api put-bucket-versioning \
  --bucket terraform-state-project-07 \
  --versioning-configuration Status=Enabled
```

### Create DynamoDB Table for State Locking
```bash
aws dynamodb create-table \
  --table-name terraform-state-locks-project-07 \
  --billing-mode PAY_PER_REQUEST \
  --attribute-definitions AttributeName=LockID,AttributeType=S \
  --key-schema AttributeName=LockID,KeyType=HASH \
  --region ap-south-1
```

---

## Backend Configuration

Terraform uses the following backend configuration to store state remotely and enable locking:
```hcl
terraform {
  backend "s3" {
    bucket         = "terraform-state-project-07"
    key            = "project-07/terraform.tfstate"
    region         = "ap-south-1"
    dynamodb_table = "terraform-state-locks-project-07"
    encrypt        = true
  }
}
```
This configuration:
- Stores Terraform state in Amazon S3
- Uses DynamoDB for state locking
- Encrypts state data at rest

---

## CI/CD Pipeline Design

### Workflow Location
```
.github/workflows/terraform-ci.yml
```
### Trigger Conditions
The pipeline executes automatically when:
- A commit is pushed to the `main` branch
- Files inside the following path are modified:
```
07-iac-ci-cd-pipeline/terraform/**
```

### Pipeline Stages
- Checkout repository
- Install Terraform CLI
- Configure AWS credentials
- Terraform initialization
- Terraform validation
- Terraform plan
- Terraform apply (auto-approved)

---

## Security and Credential Handling

 ### GitHub Secrets
- AWS credentials are never stored in the repository.
- The CI/CD pipeline consumes credentials securely using GitHub Actions secrets.
- Add the following secrets in the repository:

  **Repository Settings → secrets and variables → Actions**
  - `AWS_ACCESS_KEY_ID` → **paste the Access Key ID from your AWS IAM user**
  - `AWS_SECRET_ACCESS_KEY` → **paste the Secret Access Key from your AWS IAM user**

- The IAM user associated with these credentials must have permissions to manage EC2, VPC, S3, and DynamoDB resources.
- These are used by GitHub Actions to authenticate with AWS.

---

## Terraform Outputs
After a successful pipeline execution, Terraform provides:

`ec2_public_ip = "<PUBLIC_IP_ADDRESS>`

This output confirms successful EC2 provisioning.

---

## Verification
After pipeline completion, the following are verified:
- GitHub Actions workflow completes successfully
- EC2 instance is running in the AWS Console
- Terraform state file exists in the S3 bucket
- DynamoDB table contains lock entries
- EC2 public IP is available in Terraform outputs

Verification screenshots are available in the `screenshots/` directory.

---