# Cloud & DevOps Projects

**Cloud-DevOps-Projects** contains a collection of Cloud and DevOps projects built using real cloud infrastructure and DevOps workflows. The repository demonstrates how cloud resources and automation are designed, configured, deployed, and managed.

The projects cover practical implementations of cloud services, Infrastructure as Code, automation pipelines, monitoring, serverless systems, containers, and orchestration.

---


## Repository Structure

```text
Cloud-DevOps-Projects/
│
├── .github/
│   └── workflows/
│
├── 01-ec2-web-server/
├── 02-ec2-rds-secure-app/
├── 03-ec2-cloudwatch-monitoring/
├── 04-aws-serverless-guestbook/
├── 05-serverless-microservices/
├── 06-terraform-aws-secure-ec2-rds/
├── 07-iac-ci-cd-pipeline/
│
└── README.md

```

---


## Automation and Workflows

The `.github` directory contains shared automation workflows used by selected projects.

**CI/CD workflows are defined under:**

```
.github/workflows/
```

**Note:**
- Workflows use path-based triggers so only affected project pipelines run.
- Required secrets by workflows must be set in the repository’s GitHub Actions secrets.
- Workflow configuration and required secrets are included in the corresponding project folder.

---


## Projects Overview

## 01-ec2-web-server
- To host a static website on an AWS EC2 instance using the Nginx web server.
- EC2-based web server deployment with basic networking and access configuration.

### 02-ec2-rds-secure-app  
- To build a secure 2-tier application architecture on AWS
- Host a database in private subnets using Amazon RDS
- Allow secure communication between EC2 and RDS

### 03-ec2-cloudwatch-monitoring  
- Collect system-level metrics (CPU, Memory, Disk) from multiple EC2 instances
- Visualize infrastructure health using CloudWatch Dashboards
- Configure CloudWatch Alarms for high CPU usage

### 04-aws-serverless-guestbook  
- To build a fully serverless guestbook web application on AWS using managed cloud services.
- Data is stored securely in Amazon DynamoDB

### 05-serverless-microservices  
- Secure and scalable serverless microservices backend on AWS using fully managed cloud services.
- Serverless Microservice-Oriented Notes Platform
- Implement user authentication and authorization using Amazon Cognito.
- The backend is reusable and can be integrated with any frontend application

### 06-terraform-aws-secure-ec2-rds  
- Infrastructure provisioning using Terraform with remote state management.
- All resources managed using Terraform

### 07-iac-ci-cd-pipeline  
- Infrastructure automation using Infrastructure as Code with CI/CD integration.
- CI/CD pipeline using GitHub Actions.

---

## Technologies Used

### Cloud & Infrastructure
- Amazon Web Services (EC2, VPC, RDS, IAM, S3, DynamoDB, CloudWatch)
- Serverless services (Lambda, API Gateway)

### Infrastructure & Automation
- Git and GitHub
- Terraform
- GitHub Actions

### Operating Systems & Tooling
Linux
Command-line tools

---

## Prerequisites
Common requirements to work with most projects:
- Git
- AWS account with configured credentials
- Terraform (for IaC projects)

**Verify installations:**
```bash
git --version
aws --version
terraform --version
```

---

## Local Setup

Clone the repository:
```bash
git clone https://github.com/saikoushikchepyala1/Cloud-DevOps-Projects.git
cd Cloud-DevOps-Projects
```

### AWS authentication:

Projects that interact with AWS require authentication. Configure your credentials using:
aws configure
```bash
aws configure
```

### Working with Projects

Navigate to any project directory to review, run, or update it:

```bash
cd <project-directory>
```

Each project includes its own README.md, which contains:

- A short description, objectives, and architecture flow
- The tools and services used
- Setup and deployment instructions
- Infrastructure or configuration files, if applicable


---