---
title: DynamoDB
tags: AWS | DynamoDB
created: 2025-07-31
updated: 2025-07-31
---

## What is DynamoDB

- Full managed.
- NoSQL, supports both key-value and document data models.
- ACID transactions

**ACID** stands for four key properties of a reliable database transaction:

- Atomicity – All operations in a transaction succeed or none do.
- Consistency – The database stays in a valid state before and after the
  transaction.
- Isolation – Transactions don’t interfere with each other; partial changes
  aren’t visible.
- Durability – Once committed, changes are permanent, even after failures.

Transaction means a group of read/write operations that must be processed
together. In DynamoDB, a transaction ensures either all the changes succeed or
none happen at all, across one or more items (even across tables).

## Components of DynamoDB

### Table

A table is a collection of items.

- Store data in tables using a key-value or document model.
- Data is denormalized, store in as few tables as possible, often a single table
  per application

### Item

An item is a collection of attributes.

- Similar to a rows in relational database
- Can stroe complex, hierarchical data within a single item.

### Attribute

An attribute is a fundamental data element, which does not need to be broken
down any futher.

- Similar to fields or columns in relational database.
- Can be a scalar(single-valued) or nested. Strings and numbers are common
  examples of scalars. DynamoDB supports nested attributes up to 32 levels deep.
- Each item can have its own distinct attributes.
- Do not need to define them before storing items.

### Primary Key

Each item in the table has a primary key, which is an unique identifier of each
item.

- You must designate the primary key for each table.
- Select one attribute as the primary key.
- Optionally, select a second attribute as the sort key.
- Each primary key attribute must be a scalar(single-valued).

So there are two different kinds of primary keys:

- Partition key
- Partition key + sort key - Referred to as a composite primary key.

### Partitions

A partition is an allocation of storage of a table, backed by SSDs, it is
automatically repolicated across mutiple AZ **within** an AWS Region.

### Partition key(hash attribute)

- DynamoDB uses partition key to determine the location in which an item is
  stored.
- A simple primary key consists of only a partition key.
- DynamoDB stores items with the same partition key physically store together.

### Sort key(range attribute)

- A composite primary key uses the partition key and a sort key to uniquely
  identify items.
- Sort the order of the items with the same partition key.

## Identifying items in DynamoDB

- With a simple primary key, each partition key alone uniquely identifies an
  item.
- With a composite primary key, partition key + sort key together uniquely
  identify an item.
- Access partterns based on non-key attributes is not efficient(scan the table).

## Troubleshoots
