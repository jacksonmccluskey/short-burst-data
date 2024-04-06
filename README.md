# Iridium Short Burst Data® (SBD®) Unofficial Data Engineering Systems by Jackson McCluskey

This project focuses on building data pipelines to retrieve and manage Iridium SBD messages from your Iridium-connected devices.

Iridium SBD is a real-time, two-way messaging service enabling frequent data transmissions between remote equipment and centralized computer systems via Iridium's Low-Earth Orbit (LEO) satellite network. It offers several advantages, including:

- **Global Availability:** Reliable coverage from pole-to-pole through a mesh of 66 active Iridium satellites.
- **Real-Time Communication:** Low-latency connections due to shorter transmission paths compared to traditional satellite networks.
- **Two-Way Connectivity:** Gain insights and send commands to manage assets remotely anywhere in the world.
- **Range of Module Options:** Choose from small, lightweight, and low-power modules to integrate Iridium SBD into your custom solutions.

IMPORTANT NOTE: This project is not affiliated with Iridium.

### Iridium Offers 3 SBD Communication Methods

1.  Iridium DirectIP

2.  Iridium CloudConnect (AWS)

3.  Email

NOTE: All destinations will be provisioned through Iridium SPNet Pro (https://spnetpro.iridium.com).

### Iridium DirectIP

This is the industry standard communication protocol for Iridium SBD communication. "The advantage DirectIP has over the existing email protocol is the efficiency with which DirectIP transfers SBD between the Iridium Gateway and client applications and smaller latencies. DirectIP is comprised of a specialized socket-oriented communications protocol which uses direct connections between the Iridium gateway and the client applications. The DirectIP protocol consists of separate gateway components for the transfer of MO and MT messages. The interaction can be likened to client/server architecture. The MO and MT DirectIP protocols utilize bi-directional TCP/IP socket connections." (NAL Research Corporation, 2006)

NOTE: For this project, I am referencing open-source solutions by Guilherme Castelao (https://github.com/castelao/DirectIP), Chris X Edwards (http://xed.ch/project/isbd), and Pete Gadomski (https://github.com/gadomski/sbd), as well as my own knowledge from working with Iridium-connected devices at my company.

1. **Device-to-Gateway (MO):**

   Iridium-connected device initiates a session and transmits an SBD message (payload) to the Iridium Gateway.
   The message includes the device's IMEI (identifier), session status, and optional location information.

2. **MO DirectIP Connection:**

   Iridium Gateway establishes a temporary connection with a designated server (yours) using the DirectIP protocol.
   The Gateway transmits the complete MO message, including header and payload, to your server.
   Your server receives and processes the MO message data.

3. **(Optional) Server Response:**

   Depending on your application's design, your server may send an acknowledgement back to the Gateway after processing the MO message.
   The DirectIP protocol itself doesn't require this acknowledgement for MO messages.

4. **Gateway-to-Device (MT):**

   Your application sends an MT message (payload) along with destination IMEI and any desired flags to your server.
   The flags can specify actions for the Iridium Gateway, such as queuing the message for later delivery or sending a ring alert to the device.

5. **MT DirectIP Connection:**

   Your server initiates a connection with the Iridium Gateway using DirectIP.
   Your server transmits the complete MT message, including header and payload (if applicable), to the Gateway.

6. **Gateway Processing:**

   The Iridium Gateway validates the MT message (IMEI validity, payload size, etc.).
   Based on the flags in the message, the Gateway performs actions like:
   Queuing the payload for future delivery to the destination device.
   Sending a ring alert to the destination device.

7. **Confirmation to Server:**

   The Iridium Gateway sends a confirmation message back to your server indicating success or failure of the MT message processing.
   The confirmation may include details like the position of the queued message in the device's queue (for successful delivery) or an error code (for failed delivery).

NOTE: This is a simplified overview defined by myself based on my personal experiences in related developments. The actual data pipeline may involve additional steps depending on your specific configuration and Iridium network interactions.

### Iridium CloudConnect

This is the result of a new AWS Partnership, however, it is not a service, it is a template to setup AWS SQS queues (MO, MT, MC, and ME) that you will provision with the Iridium team for bi-directional data. "The first and only global cloud-based satellite solution. Together with Amazon Web Services (AWS), Iridium CloudConnect provides a powerful tool for developers seeking a singular communications platform to manage connected devices. Iridium CloudConnect enables devices to send and receive messages through the AWS-hosted service without having to develop a connecting service to the Iridium Short Burst Data® (SBD®) gateway. Data Transfer: Data is transferred through closed carrier networks and dedicated secure private connections between Iridium and AWS. Authentication: Iridium CloudConnect is set up using cross-account authentication, and a simple script that creates the necessary infrastructure. Data Delivery: Customers receive their SBD device data in a Simple Queue Service (SQS) queue in JavaScript Object Notation (JSON) format. Private Queues: Queues reside in the customer’s own AWS Virtual Private Cloud (VPC) environment." (Iridium, n.d.)

NOTE: I contacted my Iridium representative and met with the Iridium engineering team to setup and provision the AWS SQS queue(s) (https://github.com/aws-samples/aws-iot-iridium-satellite/blob/main/sbd-getting-started/README.md).

// Data Pipeline Description In-Progress

1. AWS SQS MO, MT, ME, MC queues provisioned and collecting messages from Iridium.
2. Service is subscribed or serverless function is triggered to retrieve messages from queue(s).
3. Service or serverless function stores messages as raw JSON objects in a semi-structured database or object storage.
4. Another scheduled or triggered function reads the raw JSON objects from the database or storage, processes and transforms the data, and stores it in a structured database.

### Email

Provision an email destination (email address) on Iridium SPNet Pro so Iridium can send SBD data to your email server as email messages.

NOTE: I deployed a self-hosted, self-managed email server with Mail-in-a-Box, then provisioned the email address through Iridium SPNet Pro so I can programmatically read the raw data after receiving the emails from my email server using IMAP from another service.

Emails will be sent with an attached SBD file (.sbd file type; ex. XXX_ZZZ.sbd).

**Subject:**

```
SBD Msg From Unit: *IMEI_NUMBER*
```

**Body:**

```
MOMSN: *MOMSN_NUMBER*
MTMSN: *MTMSN_NUMBER*
Time of Session (UTC): *Day Mon DD HH:MM:SS YYYY*
Session Status: 00 - Transfer OK


Message Size (bytes): *NUMBER_OF_BYTES*

Unit Location: Lat = *LATITUDE_NUMBER* Long = *LONGITUDE_NUMBER*
CEPradius = *CEP_RADIUS_NUMBER*
```

NOTE: Contact Iridium for your exact email message formatting.

### Installation

`git clone https://github.com/jacksonmccluskey/short-burst-data.git`
