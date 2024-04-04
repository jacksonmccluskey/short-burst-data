# Iridium Short Burst Data® (SBD®) Unofficial Data Engineering Systems by Jackson McCluskey

This project focuses on building data pipelines to retrieve and manage Iridium SBD messages from your Iridium-connected devices.

Iridium SBD is a real-time, two-way messaging service enabling frequent data transmissions between remote equipment and centralized computer systems via Iridium's Low-Earth Orbit (LEO) satellite network. It offers several advantages, including:

- **Global Availability:** Reliable coverage from pole-to-pole through a mesh of 66 active Iridium satellites.
- **Real-Time Communication:** Low-latency connections due to shorter transmission paths compared to traditional satellite networks.
- **Two-Way Connectivity:** Gain insights and send commands to manage assets remotely anywhere in the world.
- **Range of Module Options:** Choose from small, lightweight, and low-power modules to integrate Iridium SBD into your custom solutions.
  
IMPORTANT NOTE: This project is not affiliated with Iridium.

### Iridium Offers 3 SBD Communication Methods

   1. Iridium DirectIP

   2. Iridium CloudConnect (AWS)

   3. Email

NOTE: All destinations will be provisioned through Iridium SPNet Pro (https://spnetpro.iridium.com).

### Iridium DirectIP

This is the industry standard communication protocol for Iridium SBD communication. "The advantage DirectIP has over the existing email protocol is the efficiency with which DirectIP transfers SBD between the Iridium Gateway and client applications and smaller latencies. DirectIP is comprised of a specialized socket-oriented communications protocol which uses direct connections between the Iridium gateway and the client applications. The DirectIP protocol consists of separate gateway components for the transfer of MO and MT messages. The interaction can be likened to client/server architecture. The MO and MT DirectIP protocols utilize bi-directional TCP/IP socket connections." (NAL Research Corporation, 2006)

NOTE: For this project, I am referencing open-source solutions by Guilherme Castelao (https://github.com/castelao/DirectIP), Chris X Edwards (http://xed.ch/project/isbd), and Pete Gadomski (https://github.com/gadomski/sbd), as well as my own knowledge from working with Iridium-connected devices at my company.

// Data Pipeline Description In-Progress

1. 

### Iridium CloudConnect
This is the result of a new AWS Partnership, however, it is not a service, it is a template to setup AWS SQS queues (MO, MT, MC, and ME) that you will provision with the Iridium team for bi-directional data. "The first and only global cloud-based satellite solution. Together with Amazon Web Services (AWS), Iridium CloudConnect provides a powerful tool for developers seeking a singular communications platform to manage connected devices. Iridium CloudConnect enables devices to send and receive messages through the AWS-hosted service without having to develop a connecting service to the Iridium Short Burst Data® (SBD®) gateway. Data Transfer: Data is transferred through closed carrier networks and dedicated secure private connections between Iridium and AWS. Authentication: Iridium CloudConnect is set up using cross-account authentication, and a simple script that creates the necessary infrastructure. Data Delivery: Customers receive their SBD device data in a Simple Queue Service (SQS) queue in JavaScript Object Notation (JSON) format. Private Queues: Queues reside in the customer’s own AWS Virtual Private Cloud (VPC) environment." (Iridium, n.d.)

NOTE: I contacted my Iridium representative and met with the Iridium engineering team to setup and provision the AWS SQS queue(s) (https://github.com/aws-samples/aws-iot-iridium-satellite/blob/main/sbd-getting-started/README.md).

// Data Pipeline Description In-Progress

1. AWS SQS MO, MT, ME, MC queues provisioned and collecting messages from Iridium.
2. Service is subscribed or serverless function is triggered to retrieve messages from queue(s).
3. Service or serverless function stores messages as raw JSON objects in a semi-structured database or object storage.
4. Another scheduled or triggered function reads the raw JSON objects from the database or storage, processes and transforms the data, and stores it in a structured database.

### Email
Provision an email destination on Iridium SPNet Pro to your self-hosted email server.

NOTE: I setup and deployed a self-hosted, self-managed email server, then provisioned the email address through SPNet Pro.

// Data Pipeline Description In-Progress

# You Can Use These Projects

### Iridium DirectIP (Development In-Progress)

// Implementation In-Progress

### Iridium CloudConnect w/ My Preferred Stack
You need Node.js and npm installed on your development machine (https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).

### Installation
```git clone https://github.com/jacksonmccluskey/short-burst-data.git```

1. Navigate to the project directory
   
```cd short-burst-data/iridium-cloudconnect```

2. Install dependencies
   
```npm install```

### Running

1. Start

```npm run development``` or add custom `.env` file then ```npm run production```

2. The service will listen for incoming messages in the AWS SQS after .env file is configured with connection strings.

### Technologies (My Preferred Stack w/ Iridium CloudConnect) *Semi-Managed: High Performance; Highest Scalability; Highest Cost: $$$*

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
