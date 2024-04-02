# short-burst-data
Iridium Short Burst Data (SBD) Data Engineering

This project establishes a data pipeline to process SBD messages in JSON format.

1. Iridium devices transmit SBD messages through satellite telemetry systems.
2. AWS SQS queue(s) captures these messages.
3. A service (Node/Express on AWS EC2) is subscribed to the queue or serverless function (AWS Lambda) is triggered after messages are received.
4. The service or serverless function stores the JSON data in a NoSQL database (MongoDB on AWS EC2) or managed storage (AWS S3).
5. A service with scheduled functions (Node/Express) retrieves the stored, raw JSON object from the NoSQL database (MongoDB on AWS EC2) or serverless function (AWS Lambda) is triggered to retrieve the raw JSON object from storage (AWS S3).
6. After the raw JSON object is extracted from data source, it is transformed and loaded (ETL Pipeline) into a SQL database.

### Prerequisites (My Self-Managed Stack with Iridium CloudConnect)
Node.js and npm installed on your development machine.

### Installation
```git clone https://github.com/jacksonmccluskey/short-burst-data.git```

1. Navigate to the project directory
   
```cd short-burst-data```

3. Install dependencies
   
```npm install```

### Running

1. Start

```npm run production```

2. The service will listen for incoming messages in the AWS SQS after .env file is configured with connection strings.

### Technologies (Self-Managed Provisioned w/ Iridium CloudConnect) *Semi-Managed: Best Performance; Highest Scalability $ Highest Cost*

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

### Technologies (100% Cloud Technologies on AWS Provisioned w/ Iridium CloudConnect) *Fully-Managed: Moderate Performance; Moderate Scalability $ Moderate Cost*

- AWS SQS (for message queueing)
- Python (for scripting)
- AWS Lambda (for serverless functions)
- AWS IAM (for security)
- AWS S3 (for scalable storage)
- AWS DocumentDB (for managed NoSQL database)
- AWS RDS (for managed SQL database)
- AWS API Gateway (
- AWS CloudWatch

### Technologies (Self-Hosted & Self-Managed w/ Email Collection Provisioned w/ Iridium) *Self-Managed: Worst Performance; Worst Scalability $ Lowest Cost*

- AWS EC2 (Ubuntu 22.04) (or on-premise VM)
- Mail-in-a-Box [https://github.com/mail-in-a-box/mailinabox]
- AWS Route 53 (or preferred DNS manager)
- AWS SES (optional: service for outbound emails) (or preferred email relay)
- AWS EC2 (Amazon Linux 2023) (or on-premise VM)
- Node.js (or Python) (or preferred programming language)
- Express.js (or preferred API development library)
- MongoDB (for NoSQL database deployed on AWS EC2 or on-premise VM)
- SQL Server (for SQL database deployed on AWS EC2 or on-premise VM)
