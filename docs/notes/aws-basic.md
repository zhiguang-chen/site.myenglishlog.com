---
title: AWS basic
tags: AWS
created: 2025-07-26
updated: 2025-07-26
---

## Module 1: Introduction to the Cloud

### What is Cloud Computing:

Cloud computing is essentially the on-demand delivery of IT resources over the
internet with pay-as-you-go pricing

https://aws.amazon.com/what-is-cloud-computing/

### Benefits of the AWS Cloud

- Trade fixed expense for variable expense
- Benefit from massive economies of scale
- Stop guessing capacity
- Increase speed and agility
- Stop spending money to run and maintain data centers
- Go global in minutes

### Introduction to AWS Global Infrastructure

https://aws.amazon.com/about-aws/global-infrastructure/regions_az/

### The AWS Shared Responsibility Model

AWS Regions are physical locations around the world that contain groups of data
centers. These groups of data centers are called Availability Zones. Each AWS
Region consists of a minimum of three physically separate Availability Zones
within a geographic area.
https://aws.amazon.com/compliance/shared-responsibility-model/

An Availability Zone consists of one or more data centers with redundant power,
networking, and connectivity. Regions and Availability Zones are designed to
provide low-latency, fault-tolerant access to services for users within a given
area.

### The AWS Shared Responsibility Model

The AWS Shared Responsibility Model is a concept designed to help AWS and
customers work together to create a secure, functional cloud environment
Applying Cloud Concepts to Real Life Use Cases

## Module 2: Compute in the Cloud

### Introduction to Amazon EC2

- Amazon Elastic Compute Cloud (Amazon EC2)
- Amazon Machine Image (AMI), which defines the operating system and might
  include additional software
- instance type, which determines the underlying hardware resources, such as
  CPU, memory, and network performance.

Scalability is about a system’s potential to grow over time, whereas elasticity
is about the dynamic, on-demand adjustment of resources.

## AWS CLI

```bash
aws <command> <subcommand> [options and parameters]
```

### aws configure

https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html

```bash
# config a profile
aws configure --profile profile-dev

# list all profiles
aws configure list-profiles

# list s3 with a profile
aws s3 ls --profile profile-dev
```

https://docs.aws.amazon.com/prescriptive-guidance/latest/patterns/implement-path-based-api-versioning-by-using-custom-domains.html

## Tools, devs

For testing CDK locally, install SAM cli:
https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html
https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/using-sam-cli-local-invoke.html
