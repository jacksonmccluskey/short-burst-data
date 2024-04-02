# short-burst-data
Iridium Short Burst Data (SBD) Data Engineering

This project establishes a data pipeline to process SBD messages in JSON format.

1. Iridium devices transmit SBD messages through satellite telemetry systems.
2. (a) The Iridium CloudConnect template will setup AWS SQS queue(s) to capture these messages. (b) An email server can be provisioned with Iridium to send SBD messages via email. (c) The Iridium DirectIP service is not discussed.
3. (a) A service is subscribed to the queue and retrieves messages. (b) A serverless function is triggered by new messages in the queue. (c) A scheduled task reads emails from the email server.
4. (a) A service stores the JSON data in a NoSQL database (MongoDB on AWS EC2) (b) A serverless function stores managed storage (AWS S3) (c) Emails with SBD messages are stored in email server.
5. (a) A service with scheduled functions retrieves the stored, raw JSON objects from a NoSQL database (b) A serverless function is scheduled to retrieve the raw JSON objects from cloud storage (c) A scheduled task reads emails.
6. After the raw data is extracted from source, it is transformed and loaded (ETL Pipeline) into a SQL database.

### Prerequisites (My Self-Managed Stack w/ Iridium CloudConnect)
Node.js and npm installed on your development machine.

### Installation
```git clone https://github.com/jacksonmccluskey/short-burst-data.git```

1. Navigate to the project directory
   
```cd short-burst-data```

2. Install dependencies
   
```npm install```

### Running

1. Start

```npm run production```

2. The service will listen for incoming messages in the AWS SQS after .env file is configured with connection strings.

### Technologies (My Self-Managed Stack Provisioned w/ Iridium CloudConnect) *Semi-Managed: Best Performance; Highest Scalability; Highest Cost: $$$*

- AWS SQS (for message queueing)
- TypeScript (for type safety and improved development experience)
- Node.js (for scripting)
- Express.js (for API development)
- Docker (for containerized deploymentS)
- AWS IAM (for security)
- AWS EC2 (Amazon Linux 2023)
- MongoDB (for NoSQL database deployed on AWS EC2)
- SQL Server (for SQL database deployed on AWS EC2)

# Alternatives

### Technologies (100% Cloud Technologies on AWS Provisioned w/ Iridium CloudConnect) *Fully-Managed: Moderate Performance; Moderate Scalability; Moderate Cost $$*

- AWS SQS (for message queueing)
- Python (for scripting)
- AWS Lambda (for serverless functions)
- AWS IAM (for security)
- AWS S3 (for scalable storage)
- AWS DocumentDB (for managed NoSQL database)
- AWS RDS (for managed SQL database)
- AWS API Gateway (for managed API development)
- AWS CloudWatch (for service analytics)

### Technologies (Self-Hosted & Self-Managed w/ Email Collection Provisioned w/ Iridium) *Self-Managed: Worst Performance; Worst Scalability; Lowest Cost $*

- AWS EC2 (Ubuntu 22.04) (or on-premise VM)
- Mail-in-a-Box [https://github.com/mail-in-a-box/mailinabox]
- AWS Route 53 (or preferred DNS manager)
- AWS SES (optional: service for outbound emails) (or preferred email relay)
- AWS EC2 (Amazon Linux 2023) (or on-premise VM)
- Node.js (or Python) (or preferred programming language)
- Express.js (or preferred API development library)
- MongoDB (for NoSQL database deployed on AWS EC2 or on-premise VM)
- SQL Server (for SQL database deployed on AWS EC2 or on-premise VM)
