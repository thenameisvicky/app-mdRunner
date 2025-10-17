---
title: Leetcode Patterns
date: 2025-07-03
---

# Phase 1 - Foundational Patterns
- Complexities 
    1. O ( 1 ) constant - Always takes same time, does not grow with input size.
    2. O ( log n ) - Time shrinks as input grows, each steps cut the problem in half.
    3. O ( n ) - Time grows directly with input size. 
    4. O ( n log n ) - Time shrinks as input grows but the divide and conquer ( log n ) is applied n times.
    5. O ( $n^2$ ) - Time grows fast as input, Time  = $n*2$.
    6. O ( n! ) - Time grows faster as input, Time = $n*n-1$.
- Binary search O( log n )
    1. Use to search efficiently for a target in a sorted array or range.
    2. Repeatedly split the search space in half meaning that unlike other two pointer techniques binary search do not need to increment pointers by one as we need a optimal search just cut the search area.
- Two Pointers O( n )
    1. Used to compare 2 elements in an array from both ends or maintain a pair of 2 indices two pointers is best practice.
    2. Start with two pointers and move them based on condition( incrementing the pointers by one ).
- Sliding window O( n )
    1. Use when working with contiguous sub arrays or sub strings and try maintain a window that satisfies a condition.
    2. Expand window to include new elements and shrink it down from left as needed to meet conditions.
- Prefix sum / cumulative sum O( n )
    1. Use when you need to calculate sum over a range of multiple times or track cumulative effects.
    2. Precompute a prefix sum of array where each index holds sum of start → index.
- Hash-map / set basics O( 1 )
    1. Use hash-maps when you want to track some elements behaviour or occurrence kind of places ( key-values ).
    2. Set and map are same but set do not allow repeated ones by default where map allows it ( only keys ).
    3. Hashing allows O( 1 ) average time complexity for insertion, deletion and lookup.
- Math + Bit manipulation
    1. Primes , Greatest common Divisor, Lowest Common Divisor, modulo operations.
    2. Combinators, permutations, combinations.
    3. Number properties
    4. Checking even/odd: n & 1
    5. Turning off/on a bit: n | (1 << k), n & ~(1 << k)
    6. Counting set bits: n & (n - 1) trick
# Phase 2 - Data structure Patterns
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

# Phase 3 - Problem solving Patterns
- Recursion and Backtracking
- Top K Elements
- Merge interval
- Greedy Patterns
- Fast and Slow Pointers
- Subsets / Power set
- Matrix Traversals
- Intervals+ Sweep Line techniques

# Phase 4 - Graph theory
- BFS , DFS ( Iterative and Recursive)
- ToPological sort
- Union-Find / Disjoint Set Union
- Dijkstra’s Algorithm
- Bellman-Ford
- Floyd Warshall
- Minimum spanning Tree

# Phase 5 - Dynamic Programming
- Memoization VS Tabulation
- 1 Dimensional Dynamic Programming
- 2 Dimensional Dynamic Programming
- Sub sequence DP
- Partition DP
- MCM and DP on trees
- Bit-mask DP


