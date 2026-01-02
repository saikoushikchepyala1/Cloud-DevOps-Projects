# Centralized Monitoring & Alerting on AWS using CloudWatch

This project demonstrates how to build a **centralized monitoring and alerting system on AWS**
using **Amazon CloudWatch**, **EC2**, **IAM Roles**, and **SNS notifications**.

Two EC2 instances are monitored from a single CloudWatch setup to collect system metrics,
application logs, visualize them on dashboards, and send alerts when thresholds are breached.

---


## Project Objectives

In real-world production environments, monitoring is critical to detect issues before users are affected
This project shows how to:

- Securely monitor EC2 instances using IAM Roles (no access keys on servers)
- Collect system-level metrics (CPU, Memory, Disk) from multiple EC2 instances
- Collect Apache web server logs from a public-facing EC2 instance
- Centralize metrics and logs using Amazon CloudWatch
- Visualize infrastructure health using CloudWatch Dashboards
- Configure CloudWatch Alarms for high CPU usage
- Send real-time email alerts using Amazon SNS

---

## Architecture Overview

```text

User / Engineer
      |
      | (SSH, HTTP)
      v
+-------------------------+
| EC2 Instance 01         |
| (Web Server)            |
|-------------------------|
| - CPU, Memory, Disk     |
| - Apache Logs           |
| - CloudWatch Agent      |
+-----------▲-------------+
            |
            | IAM Role (CloudWatchAgentRole-03)
            |
+-----------▼-------------+
| EC2 Instance 02         |
| (Second Monitored EC2)  |
|-------------------------|
| - CPU, Memory, Disk     |
| - CloudWatch Agent      |
+-----------▲-------------+
            |
            | Metrics & Logs
            v
+----------------------------------+
| Amazon CloudWatch                |
|----------------------------------|
| - Metrics                        |
| - Logs                           |
| - Dashboards                     |
| - Alarms                         |
+-----------▲----------------------+
            |
            | Alarm Trigger
            v
+----------------------------+
| Amazon SNS                 |
|----------------------------|
| - Email Notifications      |
+----------------------------+

```

---

## Technologies Used

- AWS EC2
- Amazon CloudWatch (Metrics, Logs, Dashboards, Alarms)
- Amazon SNS
- AWS IAM Roles
- Apache Web Server
- Amazon CloudWatch Agent
- Amazon Linux
- Linux Command Line

---


## Step-by-Step Implementation

### Step 1: Create Security Group

- Create a security group named: ` ec2-monitor-sg-03 `
  
**Inbound rules:**
  - SSH (22) → ` Your IP `
  - HTTP (80) → ` 0.0.0.0/0 `

- Attach this security group to both EC2 instances.

**Result:** Both EC2 instances are accessible via SSH, and the web server can be accessed over HTTP.

---


### Step 2: Launch Two EC2 Instances

- Create two EC2 instances to be monitored.

**Instance names:**
 - `ec2-monitor-01`
 - `ec2-monitor-02`

**Common configuration for both instances:**
  - AMI: **Amazon Linux (Free Tier eligible)**
  - Instance type:`t3.micro`
  - Key pair: `the-kp-03.pem` (Use this same Key Pair for both instances)
  - VPC & Subnet: Default (Same VPC and subnet for both instances)
  - Auto-assign public IP: `Enabled`
  - Security group: ` ec2-monitor-sg-03 `

**Result:** Two EC2 instances are successfully launched and can be accessed securely using SSH.

---


### Step 3: Create IAM Role for CloudWatch Agent

- To allow EC2 instances to send system metrics and logs to Amazon CloudWatch, we must grant them proper permissions.
- Instead of using access keys (which is insecure), we attch IAM Roles directly to EC2 instances.
- **Navigate to IAM → Roles → Create role**
  - Trusted entity: **AWS Service** → `EC2`
  - Attach policy: ` CloudWatchAgentServerPolicy `
  - Role name: `CloudWatchAgentRole-03`
- Attach this role to both EC2 instances.

**Result:** The CloudWatch Agent uses this role to send metrics and logs securely without storing credentials on EC2.

---


### Step 4: Install Apache (Only on ec2-monitor-01)

- SSH into ec2-monitor-01 and install Apache:
  ```bash
  sudo yum update -y
  sudo yum install httpd -y
  sudo systemctl start httpd
  sudo systemctl enable httpd
  ```

- Verify in browser:
  ```text
  http://<ec2-monitor-01-PUBLIC-IP>
  ```
  - You should see `“It works!”`

**Result:** Apache web server is running and serving the default page.

---


### Step 5: Install CloudWatch Agent on Both EC2 Instances

- On both EC2 instances, run:
  ```bash
  sudo yum install amazon-cloudwatch-agent -y
  ```
  
**Result:** CloudWatch Agent is installed on both servers.

---


### Step 6: Configure CloudWatch Agent (ec2-monitor-01)

- Connect to ec2-monitor-01 using SSH:
  ```bash
  ssh -i your-key.pem ec2-user@<EC2-01-PUBLIC-IP>
  ```
- The CloudWatch Agent needs a configuration file to know which metrics and logs to collect.
  
**OPTION 1: Use the provided configuration file**
- This project already includes a ready-to-use CloudWatch Agent configuration file:
  `/cloudwatch-agent/amazon-cloudwatch-agent.json`
- Create the same file on the EC2 instance and copy the contents from this configuration file instead of running the wizard.
  
- **NOTE:** This approach is useful when you want consistent configuration across multiple EC2 instances.

**OPTION 2: Configure using the interactive wizard (recommended approcah for first-time)**
- Run the CloudWatch Agent configuration wizard to collect CPU, memory, disk metrics and Apache access/error logs, and save the configuration to:
  ```bash
  sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-config-wizard
  ```
- While running the wizard, choose options:
  - OS: `Linux`
  - Environment: `EC2`
  - Run agent as: `root`
  - Collect system metrics (CPU, memory, disk)
  - Default metrics config: `Standard`
  - Enable log collection: `Yes`
  - Apache access log: `/var/log/httpd/access_log`
  - Apache error log: `/var/log/httpd/error_log`
  - Use {instance_id} as the log stream name
  - Save the configuration locally

**Result:** The CloudWatch Agent configuration is prepared to collect system metrics and Apache logs from ec2-monitor-01.

---


### Step 7: Start CloudWatch Agent (Both EC2s)

- On both EC2 instances, run:
  ```bash
  sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl \
  -a fetch-config \
  -m ec2 \
  -c file:/opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json \
  -s
  ```

- Verify agent status:
  ```bash
  sudo systemctl status amazon-cloudwatch-agent
  ```
  **NOTE:** Logs will appear only for ec2-monitor-01.
  
**Result:** Metrics are sent from both EC2 instances and Logs are sent only from ec2-monitor-01.

---


### Step 8: Verify Metrics & Logs in CloudWatch

**Naviagte to CloudWatch → Metrics → CWAgent → InstanceId**
- Verify metrics for both instances:
  - `swap_used_percent`
  - `disk_inodes_free`
  - `mem_used_percent`
  - `disk_used_percent`
  - `diskio_io_time`

**Naviigate to CloudWatch → Logs → Log groups**
- Verify log groups only from ec2-monitor-01:
  - `/apache/access`
  - `/apache/error`

**Result:** Centralized metrics and logs are visible in CloudWatch.

---


### Step 9: Create CloudWatch Dashboard

- **Navigate to CloudWatch → Dashboards → Create dashboard:**
- Name: `ec2-centralized-monitoring-dashboard`
- Add widgets:  
  - CPU Utilization (AWS/EC2) → both EC2 instances
  - Memory Usage (CWAgent) → both EC2 instances
  - Disk Usage (CWAgent) → both EC2 instances
  - Disk I/O Time (CWAgent) → both EC2 instances
  - Apache Access Logs → ec2-monitor-01 only

**Result:** A single dashboard visualizing the health of both servers.

---

### Step 10: Configure SNS Notifications

- Create SNS topic: `ec2-monitoring-alerts-03`
- Create Subscription
  - Protocol: `Email`  
  - Endpoint: `youremail@gmail.com`  
- Confirm subscription from your email inbox.

**Result:** AWS SNS is ready to send alerts.

---


### Step 11: Create CloudWatch Alarms

**Create two alarms:**
- `HighCPU-ec2-monitor-01`
- `HighCPU-ec2-monitor-02`

- **Navigate to CloudWatch  → Alarms  → Create alarm**

- Select Metric:

  - **AWS Namespace: EC2 → Per-Instance Metrics**
  - Select: ec2-monitor-01 - `CPUUtilization` 

- Conditions:
  
  - Threshold: `> 80%`
  - Evaluation period: `5 minutes`
  - Alarm state trigger: `In alarm`
  - SNS topic: `Select an existing SNS topic`
  - Send a notification to: `ec2-monitoring-alerts-03`

- Alarm Name: `HighCPU-ec2-monitor-01` → **Create alarm**

- Repeat the same process for **Alarm 2** but, here:
  - Alarm Name: `HighCPU-ec2-monitor-02`
  - Select: ec2-monitor-02 - `CPUUtilization` 

**Result:** A CloudWatch alarm is created for each EC2 instance.  
When CPU usage exceeds 80% for 5 minutes, the alarm enters the ALARM state and triggers an SNS email notification.

---


### Step 12: Test & Verify Alerts

**Install stress tool and generate load**
- Run stress test on both EC2s:
  ```bash
  sudo yum install stress -y
  stress --cpu 2 --timeout 300
  ```
  
**Navigate to CloudWatch → Alarms**
- Verify:
  **Alarm state changes from OK → ALARM**
  **SNS Email notification received**

**Result:** This confirms end-to-end monitoring and alerting works correctly.

---


### Step 13: Cost Safety

This project provisions AWS resources that can incur charges if they remain active.

After testing:

- Stop or terminate EC2 instances
- Remove alarms and dashboards if no longer needed

**Result:** This helps to avoid AWS charges.

---

## Screenshots

The screenshots/ directory contains key visuals showing EC2 instances, CloudWatch metrics, logs, dashboards, alarms, and SNS email alerts, providing clear proof of successful monitoring and alerting setup.

---


## What This Project Monitors

In this project, CPU-based alerts are configured to clearly demonstrate the complete monitoring and notification flow.
Memory and disk metrics are also collected and displayed on the dashboard.
Additional alarms can be added easily if required.
