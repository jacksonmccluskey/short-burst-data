# Iridium Short Burst Data® (SBD®) Unofficial Data Engineering Systems by Jackson McCluskey

This project focuses on building data pipelines to retrieve and manage Iridium SBD messages from your Iridium-connected devices.

Iridium SBD is a real-time, two-way messaging service enabling frequent data transmissions between remote equipment and centralized computer systems via Iridium's Low-Earth Orbit (LEO) satellite network. It offers several advantages, including:

- **Global Availability:** Reliable coverage from pole-to-pole through a mesh of 66 active Iridium satellites.
- **Real-Time Communication:** Low-latency connections due to shorter transmission paths compared to traditional satellite networks.
- **Two-Way Connectivity:** Gain insights and send commands to manage assets remotely anywhere in the world.
- **Range of Module Options:** Choose from small, lightweight, and low-power modules to integrate Iridium SBD into your custom solutions.

IMPORTANT NOTE: This project is not affiliated with Iridium.

### Iridium Offers 3 SBD Communication Methods

1.  Iridium DirectIP (TCP/IP)

2.  Iridium CloudConnect (AWS SQS)

3.  Email (SMTP)

NOTE: All destinations will be provisioned through Iridium SPNet Pro (https://spnetpro.iridium.com).

### Iridium DirectIP

This is the industry standard communication protocol for Iridium SBD communication. "The advantage DirectIP has over the existing email protocol is the efficiency with which DirectIP transfers SBD between the Iridium Gateway and client applications and smaller latencies. DirectIP is comprised of a specialized socket-oriented communications protocol which uses direct connections between the Iridium gateway and the client applications. The DirectIP protocol consists of separate gateway components for the transfer of MO and MT messages. The interaction can be likened to client/server architecture. The MO and MT DirectIP protocols utilize bi-directional TCP/IP socket connections." (NAL Research Corporation, 2006)

![DirectIP-Client-Server-Architecture](./DirectIP/DirectIP-Client-Server-Architecture.png)

**MO Message Buffer**

```
0x01, // Protocol Revision Number
0x00, // Overall Message Length
0x00, // Overall Message Length
0x01, // MO Header IEI
0x00, // MO Header Length
0x00, // MO Header Length
0x00, // CDR Reference
... x 4
0x00, // IMEI
... x 15
0x00, // Session Status
0x00, // MOMSN
0x00, // MOMSN
0x00, // MTMSN
0x00, // MTMSN
0x00, // Time Of Session
... x 4
0x02, // MO Payload IEI
0x00, // MO Payload Length (N)
0x00, // MO Payload Length (N)
0x00, // MO Payload
... x N
```

**MT Message Buffer**

```
0x01, // Protocol Revision Number
0x00, // Overall Message Length
0x00, // Overall Message Length
0x41, // MT Header IEI
0x00, // MT Header Length
0x00, // MT Header Length
0x00, // Unique Client Message ID
... x4
0x00, // IMEI
... x 15
0x00, // MT Disposition Flags
0x00, // MT Disposition Flags
0x42, // MT Payload IEI
0x00, // MT Payload Length (N)
0x00, // MT Payload Length (N)
0x00, // MT Payload
... x N
```

**MT Confirmation Message Buffer**

```
0x01, // Protocol Revision Number
0x00, // Overall Message Length
0x00, // Overall Message Length
0x43, // MT Confirmation IEI
0x00, // MT Confirmation Message Length
0x00, // MT Confirmation Message Length
0x00, // Unique Client Message ID
... x4
0x00, // IMEI
... x15
0x00, // Auto ID Reference
... x4
0x00, // MT Message Status
0x00 // MT Message Status
```

NOTE: For this project, I am referencing open-source solutions by Guilherme Castelao (https://github.com/castelao/DirectIP), Chris X Edwards (http://xed.ch/project/isbd), and Pete Gadomski (https://github.com/gadomski/sbd), as well as my own knowledge from working with Iridium-connected devices at my company.

### Iridium CloudConnect

This is the result of a new AWS Partnership, however, it is not a service, it is a template to setup AWS SQS queues (MO, MT, MC, and ME) that you will provision with the Iridium team for bi-directional data. "The first and only global cloud-based satellite solution. Together with Amazon Web Services (AWS), Iridium CloudConnect provides a powerful tool for developers seeking a singular communications platform to manage connected devices. Iridium CloudConnect enables devices to send and receive messages through the AWS-hosted service without having to develop a connecting service to the Iridium Short Burst Data® (SBD®) gateway. Data Transfer: Data is transferred through closed carrier networks and dedicated secure private connections between Iridium and AWS. Authentication: Iridium CloudConnect is set up using cross-account authentication, and a simple script that creates the necessary infrastructure. Data Delivery: Customers receive their SBD device data in a Simple Queue Service (SQS) queue in JavaScript Object Notation (JSON) format. Private Queues: Queues reside in the customer’s own AWS Virtual Private Cloud (VPC) environment." (Iridium, n.d.)

1. AWS SQS MO, MT, ME, MC queues provisioned and collecting messages from Iridium Gateway & client application(s).
2. Service is subscribed or serverless function is triggered to retrieve and delete messages from queue(s).
3. Service or serverless function stores messages as raw JSON objects in a semi-structured database or object storage.
4. Another scheduled or triggered function reads the raw JSON objects from the NoSQL database or document storage, processes and transforms the data, and stores it in a structured database.

```
{
  "_id": {
    "$oid": "abc123"
  },
  "api_version": 1,
  "data": {
    "mo_header": {
      "cdr_reference": 123456789,
      "session_status_int": 0,
      "session_status": "No error.",
      "momsn": 12345,
      "mtmsn": 0,
      "imei": "123456789012345",
      "time_of_session": "2024-01-30 22:08:15"
    },
    "location_information": {
      "cep_radius": 1,
      "latitude": "11.12345", // Degrees-Minutes-Seconds Format
      "longitude": "-111.54321" // Degrees-Minutes-Seconds Format
    },
    "payload": "0123456789abcde"
  }
}
```

NOTE: I contacted my Iridium representative and met with the Iridium engineering team to setup and provision the AWS SQS queue(s) (https://github.com/aws-samples/aws-iot-iridium-satellite/blob/main/sbd-getting-started/README.md).

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

### Use These Projects

`git clone https://github.com/jacksonmccluskey/short-burst-data.git`
