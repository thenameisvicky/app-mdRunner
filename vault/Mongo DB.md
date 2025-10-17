---
title: Mongo DB
date: 2025-07-03
---

## The Database
- #### Introduction
	 Mongo DB is a document oriented database designed for flexibility, scalability, and ease of development. Instead of tables and rows mongo DB has collections and documents. Documents are stored in BSON format allowing rich, hierarchical data.
- #### Data Modelling
	- Designing Schema
		1. Identifying Application workload.
		2. Map Relationships.
		3. Apply design patterns.
		4. Create Indexes.
## The Storage Engine - [[WiredTiger.png]]
- #### Introduction
	- WiredTiger is default storage engine in MongoDB.
	- It supports
		- ACID - complaint at transactions.
		- Multi-version concurrency control ( MVCC ).
		- Document level locking.
		- Compression, Journaling and check pointing.
- #### Concurrency Handling
	- WiredTiger allows multiple operations to read or write different documents in parallel.
	* However, concurrent writes to the same document (even to different fields) are serialised internally — one will wait, retry, or operate on stale values, especially in expression-based updates.
- #### Architectural Features
	- **MVCC** -
		Enables readers to see a consistent snapshot of data even while writes are happening, avoiding blocking reads by writers.
	- **Transactions and Concurrency** -
		Supports ACID transactions and uses optimistic concurrency control for most read/write operations. When conflicts occur, operations may be retried.
	- **Document level locking and Concurrency** -
		In MongoDB’s use of WiredTiger, write operations can occur concurrently at the document level (not locking the entire collection).
	- **Snapshots and Checkpoints** -
		WiredTiger periodically takes checkpoints to flush data to disk in a consistent manner; these act as recovery points in case of failures.
	- **Journaling and Write - ahead logs** -
		Changes between checkpoints are recorded in a journal/log which helps in crash recovery (i.e. replaying operations that weren’t yet checkpointed).
	- **Compression and data encoding** -
		- WiredTiger supports block-level compression, prefix compression, dictionary encoding, etc....
		- This reduces on-disk foot print.
	- **Flexible storage models** -
		- Supports row-oriented storage, column-oriented storage, and Log-Structured Merge Tree (LSM) approach depending on workload needs.
	- **Caching and Eviction** -
		- Maintains an in-memory cache of pages (internal nodes, leaf nodes) and uses eviction strategies (reconciling, writing dirty pages) when memory limits are reached.
	- **No overwrite Design** -
		- WiredTiger’s design aims to prevent partial writes (“torn writes”) from corrupting data.
- #### Write Operation Flow 
	- Query parsed by MongoDB query engine.
	- WiredTiger creates MVCC snapshot.
	- Changes are written to the journal (WAL).
	- Changes are applied to in-memory cache.
	- Later, flushed to disk during checkpoint.
	- Other readers still see old snapshot until commit.
	- After commit, new version becomes visible via MVCC.
- #### Read Operation Flow
	- Reader requests document.
	- WiredTiger provides MVCC snapshot (document state at read start time).
	- Reads are non-blocking, even if a write is happening.
	- Reader does NOT see changes made by ongoing uncommitted transactions.
	- If read happens after commit, new version is visible.
- #### Limitations
	- **No field-level (key-level) locking**  
		- Cannot safely update different fields of the same document concurrently.
	- **MVCC Snapshots are isolated per operation**  
		- If two writers act concurrently, both may read the same stale state.
	- **Write Conflicts** can occur:
		- You may see unexpected behaviour with conditional logic like `$cond`
		- To avoid: use Redis lock or app-level versioning.      
- #### Configurations
    - Configure `wiredTigerConcurrentReadTransactions` and `wiredTigerConcurrentWriteTransactions` to control concurrency limits.
    - Use `writeConcern: "majority"` to ensure durability.        
    - Monitor WiredTiger cache usage via `serverStatus().wiredTiger.cache`.
