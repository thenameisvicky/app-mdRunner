---
title: Leetcode Patterns
date: 2025-07-03
---

## Phase 1 - Mental Models for Pattern Recognition

- **Ask the change + Condition Question**
  - Does the problem describe a value that changes repeatedly until a condition is met ?
  - Example -
    - Original value doubles while it exists in the array.
    - Pattern a simple while loop with membership (presence as condition) check.
    - No DP, no Pointers, no recursions needed.
  - Mental trick -
    - Look for words like keep **X** until **Y**.
    - Often maps directly to while loops or simple iterative processes using for loop and incrementing the for loop pointer conditionally.
- **Check if the problem really needs Optimization Patterns**
  - Does it involve overlapping subproblems? - DP.
  - Does it involve structure like sorted arrays, trees, graphs? - Two pointers/BFS/DFS.
  - Does it involve windowed computations? - Sliding window.
  - If none of this met apply simple patters first.
- **Visualize the process as state transitions**
  - Every operation moves the system from one state to another.
  - If the number of states is small and discrete - simple iterative loop.
  - If the number of states is combinatorial - likely DP, backtracking, recursion.
  - Example -
    - original -> doubles -> check the array -> new original -> doubles -> check again.
    - States: 2 -> 4 -> 8 -> ...
    - States are predictable and linear so Iterative is enough.
- **Use Incremental Check thinking**
  - If each step depends only on the current state, no need for memorzation (DP).
  - If each step depends on multiple previous state - DP.
  - Example -
    - Doubling original depends only on its current value, not the sequence that came before - iterative loop.
    - Fibonacci sequence depends on two previous numbers - DP or iterative formula.
- **Keep a Pattern safety checklist**
  - Before jumping into pattern check the constrains if
    1. Is the input small enough for a simple scan?
    2. Can a brute-force approach give correct answer?
    3. Are there repeated computations that could be avoided with memoization?
    4. Does the problem hint a state transition or path counting?
  - If the answer is yes for 1-2 start simple else try DP or graph based apprach.

## Phase 2 - Foundational Patterns

- Only way to master pattern recogination is to re-solving the problems you solved again and again until you see a statement and come up with a mental pattern.
- Don't jump into patterns always, read the statement throughly and decide is pattern really needed or can just solve this in traditional way.
- Most problems solved with simple techiniques not with complex patterns.
- **Complexities**
    1. O(1) constant - Always takes same time, does not grow with input size.
    2. O(logn) - Time shrinks as input grows, each steps cut the problem in half.
    3. O(n) - Time grows directly with input size.
    4. O(nlogn) - Time shrinks as input grows but the divide and conquer (logn) is applied n times.
    5. O(n<sup>2</sup>) - Time grows fast as input, Time  = n<sup>n-1</sup>.
- **Two Pointers**
    1. Used when the array needs to be scanned from both ends, maintaining two positions and shrink or expand with a condition.
    2. Commonly used in problems like Pair sum, container with most water, removing duplicates, two sum, cycle detection, rotated array search etc...
    3. Not only on above problems can use this patterns to solve any problem as needed.
- **Sliding window**
    1. Used when a window (pairs) of string or values need to be kept track of.

## Phase 2 - Data structure Patterns

- Stack and Queue
- Heap / Priority Queue
  - A binary tree which satisfies -
    - Complete binary tree ( left to right ) not full binary tree ( 0 or 2 child ).
    - Heap Property - Max heap every parent node must be greater than or equal to their children , Min heap every parent node must be less than or equal to their children.
  - Efficient access to maximum or minimum values.
  - Used heavily in Priority Queues, scheduling , Dijkstra's Algorithm and Top-K Problems.
  - Time complexities
    - Insert  - O ( log n ).
    - Remove - O ( log n ).
- Hash-Map + Frequency map
- Trie
- Binary Tree Traversal (BFS / DFS)
- Binary search Tree
- Union - Find / DSU
- Segment Tree

## Phase 3 - Problem solving Patterns

- Recursion and Backtracking
- Top K Elements
- Merge interval
- Greedy Patterns
- Fast and Slow Pointers
- Subsets / Power set
- Matrix Traversals
- Intervals+ Sweep Line techniques

## Phase 4 - Graph theory

- BFS , DFS ( Iterative and Recursive)
- ToPological sort
- Union-Find / Disjoint Set Union
- Dijkstra’s Algorithm
- Bellman-Ford
- Floyd Warshall
- Minimum spanning Tree

## Phase 5 - Dynamic Programming

- Memoization VS Tabulation
- 1 Dimensional Dynamic Programming
- 2 Dimensional Dynamic Programming
- Sub sequence DP
- Partition DP
- MCM and DP on trees
- Bit-mask DP
