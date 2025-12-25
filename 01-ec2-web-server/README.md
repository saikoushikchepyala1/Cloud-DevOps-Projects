# Hosting a Static Website on AWS EC2 using Nginx

This project demonstrates how to host a static website on an AWS EC2 instance using the Nginx web server.  
It covers cloud networking basics, secure access, web server setup, deployment, and cost management.

---

## Project Overview

- Launch a virtual server (EC2) on AWS
- Configure networking using VPC, subnet, and Internet Gateway
- Secure access using Security Groups
- Install and configure Nginx
- Deploy a static website
- Follow cost-aware cloud practices

---

## Architecture

```text
User (Browser)
     |
 Internet
     |
Internet Gateway
     |
Public Route Table
     |
Public Subnet
     |
EC2 Instance (Ubuntu)
     |
Nginx Web Server
     |
Static Website
```
---

## Technologies Used

- AWS EC2
- AWS VPC (Subnet, Route Table, Internet Gateway)
- Security Groups
- Nginx Web Server
- Linux (Ubuntu)
- HTML, CSS, JavaScript

---

## Prerequisites

Before starting this project, ensure you have:

- An active AWS account
- Basic understanding of Linux commands
- An EC2 key pair for SSH access
- A static website (HTML, CSS, JavaScript files)

---

## Step-by-Step Implementation

  ### Step 1: Create a VPC

  - Navigate to **AWS Console → VPC → Create VPC**
  - Select **VPC only**
  - Provide the following details:
    - Name: `the-vpc-1`
    - IPv4 CIDR block: `10.0.0.0/16`
  - Click **Create VPC**

**Result:** An isolated virtual private cloud is created.

---

### Step 2: Create a Public Subnet

- Navigate to **VPC → Subnets → Create subnet**
- Select the previously created VPC
- Provide the following details:
  - Subnet name: `the-public-subnet-1`
  - CIDR block: `10.0.1.0/24`
- Click **Create Subnet**
- Enable **Auto-assign public IPv4**

**Result:** A public subnet is created to host EC2 instances.

---

### Step 3: Create and Attach an Internet Gateway

- Navigate to **VPC → Internet Gateways → Create**
- Name it : `the-igw-1`
- Attach the Internet Gateway to `the-vpc-1`

**Result:** The VPC is now connected to the internet.

---

### Step 4: Configure Route Table

- Navigate to **VPC → Route Tables**
- Create a new **route table** for the VPC
- Add the following route:
  - Destination: `0.0.0.0/0`
  - Target: Internet Gateway
- Associate the route table with the public subnet

**Result:** Subnet traffic is routed to the internet.

---

### Step 5: Create a Security Group

- Navigate to **EC2 → Security Groups → Create**
- Select the VPC
- Add inbound rules:
  - `SSH (22)` – for administration
  - `HTTP (80)` – for website access

- Keep default outbound rules

**Result:** Secure access to the EC2 instance is configured.

---

### Step 6: Launch EC2 Instance

- Navigate to **EC2 → Launch Instance**
- Choose an Ubuntu AMI
- Select instance type: `t2.micro` (Free Tier eligible)
- Configure network settings:
  - VPC: `the-vpc-1`
  - Subnet: `the-public-subnet-1`
- Attach the created security group
- Launch the instance

**Result:** The EC2 instance is running with a public IPv4 address.

---

### Step 7: Connect to EC2 using SSH

  ```bash
  ssh -i your-key.pem ubuntu@<EC2-PUBLIC-IP>
  ```
**Result:** You are now logged in to the Ubuntu EC2 instance.
  
---

### Step 8: Install and Start Nginx

- Update the package index and install Nginx on the EC2 instance
- Start the Nginx service and verify its status

```bash
sudo apt update
sudo apt install nginx -y
sudo systemctl start nginx
sudo systemctl status nginx
```

- Open a browser and access the EC2 public IP:

```bash
http://<EC2-PUBLIC-IP>
```

**Result:** The default Nginx welcome page is displayed, confirming that the web server is running successfully.

---

### Step 9: Deploy Website Files

- On the EC2 instance, navigate to the Nginx web root directory:
  ```bash
  cd /var/www/html
  ```
  
- Remove the default Nginx page:
  ```bash
  sudo rm index.nginx-debian.html
  ```
  
- Create and edit the website files directly inside `/var/www/html` on the EC2 instance,
  depending on your workflow.

- Alternatively, if the website files are available on your local machine, upload them
  to the EC2 instance.
  
  - **From your local machine**, copy the static website directory to the EC2 instance:
    ```bash
    scp -i your-key.pem -r <local-static-site-directory> ubuntu@<EC2-PUBLIC-IP>:/home/ubuntu/
    ```

    `NOTE: Replace <local-static-site-directory> with the folder containing your static website files.`

  - Then, on the EC2 instance, move the website files to the Nginx web root:
    ```bash
    sudo mv /home/ubuntu/<local-static-site-directory>/* /var/www/html/
    ```

- Restart the Nginx service to apply the changes:
  ```bash
  sudo systemctl restart nginx
  ```
  
- Open the browser and access the EC2 public IP:
  ```bash
  http://<EC2-PUBLIC-IP>
  ```

**Result:** The custom static website is successfully deployed and accessible over the internet.

---

### Step 10: Cost Safety

- Navigate to **AWS Console → EC2 → Instances**
- Select the EC2 instance
- Click **Instance state → Stop**

**Result:** The EC2 instance is stopped, preventing unnecessary compute charges.

---
  

## Screenshots

All important screenshots are available in the `screenshots/` directory for reference.

---


