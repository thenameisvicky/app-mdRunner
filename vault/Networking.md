## Core Networking Fundamentals

|Layer|Name|What It Handles|Real-World Example|
|---|---|---|---|
|7|Application|Apps interacting with network|HTTP, FTP, DNS, SSH|
|6|Presentation|Data formatting, encryption, compression|TLS/SSL, JSON, JPEG|
|5|Session|Session management|Keep-alive, cookies, sockets|
|4|Transport|Reliable delivery, flow control|TCP, UDP|
|3|Network|Routing and addressing|IP, ICMP|
|2|Data Link|Frames between connected devices|MAC addresses, Ethernet, ARP|
|1|Physical|Raw bits on wire or wireless|Cables, Wi-Fi, fiber, radio|

- ##### Physical
    - _**Encoding and Transmission Techniques -**_
        - The physical layer does not just define cables, it also defines how bits 0s and 1s are converted into electrical, optical and radio signals.
        - Common methods like NRZ, Manchester Encoding, Differential Manchester etc.. used to line encode the digital data to present them physically.
        - Transmission Modes namely -
            - Serial - 1 bit at a time ex: USB.
            - Parallel - Multiple bit at a time ex: CPU to RAM or Device to Printer.
            - Simplex - one way transmission ex: Keyboard to computer.
            - Half Duplex - both ways one at a time ex: Wakie Takies.
            - Full Duplex - Simultaneously transmission ex: web sockets, HTTP/2, HTTP/3, HTTPS.
    - _**Origins and Early analog transmission**_ _**-**_
        - The Physical layer roots back to analog communication systems, such as Amplitude modulation and Frequency modulation.
        - These methods were simple and cost effective but were highly susceptible to noise and interference.
    - _**Digital Revolution** **-**_
        - In 1980’s and 1990’s, networks began shifting toward digital transmission, providing greater relaiablity and performance.
        - Techniques like Pulse Code Modulation (PCM), Binary Phase Shif Keying (BPSK) and Quadrature Amplitive Modulation (QAM) became prevelant.
    - _**Rise of Ethernet and Shared Medium** **-**_
        - Inspired by the university of Hawaii’s Aloha Network in late 1960’s, Ethernet at Xerox PARC in 1970’s implemented CSMA / CD, dramatically improving channel utilization and robustness.
        - Ethernet evolved from 3 Mbps to 100 Mbps, Gigabit Ethernet and eventually 10, 40, 100 Gbps and beyond! while maintaining backward compatablity and standardization.
    - _**Topology and Physical Media -**_
        - Physical layer defines the very nature of connections, cabling layers such as
            - Coaxial - TV connections.
            - Twisted pair - copper wire twister to reduce interference (**E**lectro **M**agenetic **I**nterference) why? because the EMI device’s sound frequency was higher, which made the frequency of network disort - _bad news,_ so twisting these wire with each other helped to countreact to outside frequency - _good news_.
            - Fiber optics - A router connected with fiber cable to nearest ISP tower.
        - Topology layer defines how the device internconnected to each other in network
            - Bus Topology - All device share a single communication line which is the Bus, only one device can transmit at a time. In real world the boardcast systems, radio systems, these happened end to end between only two transmitters which handled the streaming / data sharing.
            - Star Topology - Each device connected to a central switch ( a WI-FI router ), in this case each device has seperate connection to centralized network provider in real world, LAN a central hub where all the devices connected via ethernet cable.
            - Ring Topology - Each device shares data in a ring, if one device fails other wont get the data if there is no 2 way ring.
            - Mesh Topology - Each device connected to a web ( Internet ) which has multiple route for the data to travel if one is blocked another one will be available always which makes this relaiable but back in days it was expensive.
    - _**Wireless and Optical Advancements -**_
        - Here comes the `GOAT` - the WiFi emerged in late 1990’s first at 2 mbps, evolving to meet increasing demands for speed and relaibility.
        - Fiber optics ( fiber net ) revolutionized transmission with high bandwidth, low loss, and long distances. Encoding innovations—like wave‑division multiplexing—further enhanced performance.
    - _**Modern Innovation and challenges -**_
        - MIMO - Multiple Input and Multiple Output and advanced modulation techniques improved wireless capacity and resilience.
        - Physical layer security emerged as vital to defend againts eavesdropping and jamming in wireless networks.
        - As approaching 6G and IOT scaling, new challenges such as low latency, massive device density, communication etc will emerge.
- ##### Data Link
    - _**Data link layer is responsible for -**_
        - Turning data into frames techinically packets.
        - MAC addressing the devices on network so that the devices identify each other.
        - Ensures integrity using checksums for error detection.
        - Prevents fast senders from overwhelmning the slow receivers.
        - Controls how devices share a medium.
    - _**Whats inside a Packet? -**_
        - Source IP.
        - Destination IP.
        - TTL.
        - Protocol ( TCP / UDP ).
        - Checksum.
        - IP version.
        - Source Port.
        - Destination Port.
        - Sequence Number.
        - Acknowledgement Number.
        - Flags.
        - Window Size.
        - POST /login HTTP/1.1 Host: [www.arka.com](http://www.arka.com/) Content-Type: application/json Body: {"username":"abc", "password":"123"}
    - _**Sub Layers -**_
        - `MAC` Layer - Media access control address is used to control how devices access the physical medium ( access internet via ethernet ).
        - `LLC` Layer - Logical link control Identifies protocols like IP and does error / flow checking
    - _**Deep dive into History -**_
        - Ethernet and MAC addressing
            - Introduced in 1970s, Ethernet became the standard for LAN communication.
            - It bought MAC address - a unique 48 bit hardware address for every Devices connected to a shared Medium.
            - Devices use MAC address to talk to each other ( texting while conneted to same network ).
        - Shared medium Problem
            - Early networks were like party lines — if two devices spoke at once, there was collision.
            - `CSMA/CD` (Carrier Sense Multiple Access with Collision Detection) solved this in wired Ethernet.
            - `CSMA/CA` (Collision Avoidance) is used in Wi-Fi instead, since you can't "detect" a collision over wireless.
        - Error Detection
            - Checksums like `CRC` - Cyclic Redudancy check were introduced to detect transmission errors.
            - This layers does not fixes just detects and drops/retries.
        - Switching revolution
            - Switches replaced hubs in the 1990’s as unlike hubs switches understnad MAC address and forward frames only to intended recipients, reducing traffic and increasing speed.
            - This is where performance spiked.
        - Devices comes under concept
            - MAC Address - Wi Fi chips on any device.
            - Ethernet frame - This is the packet (frame) transmitter when device is connected to internet via ethernet cable.
            - ARP - When accessing internet this tool will convert the local IP address into MAC address on a local network, happens inside device.
            - Switch - WiFi router or ISP tower.
            - Bridge - Hotspot mode.
            - VLANs - Segments a single network into virtural seperate LANs, found in enterprise level WiFi routers.
- ##### Network
    
    |Field|Description|
    |---|---|
    |**Destination Network**|A range of IPs (e.g., `10.0.0.0/8`, `192.168.1.0/24`)|
    |**Next Hop IP**|Where to send the packet next|
    |**Interface**|Outgoing interface (e.g., `eth0`, `Gig0/1`)|
    |**Metric/Cost**|How "expensive" this path is|
    |**Routing Protocol**|Source of the route (e.g., BGP, OSPF, static)|
    |**Administrative Distance**|Trust level of the source|
    
    - _**Routing and Addressing -**_
        - Network layer is responsible for identifyng devices beyond local reach and routing packets across networks.
        - This uses IP Address ( logical identifiers ) rather than MAC ( hardware identifiers ).
            - `IPv4 - 32` Bit written as 4 Octets.
            - `IPv6 - 64` Bit written in hexadecimal ( future proof ).
        - Unlike MAC address IP Address are not fixed the can change and hierarchical ( network → subnet → host ).
        - Subnet is an IP address which has the other IPs grouped this subnet is to group and manage IP addresses.
    - _**Packet Switching and Forwarding with Routing Protocols -**_
        - Packets are routed from source to destination via intermediate routers.
        - Each router
            - Checks the destination IP.
            - Looks up its routing table.
            - Forwards the packet to next best hop toward the target how? the router finds the longest prefix match with the destination IP.                
            - After choosing the IP it checks the Administrative distance if more paths exists for same destinatoin then router choose the cost effective and shortest path.   
            - Cost is calculated by routing protocols RIP, OSPF, BGP etc…                
            - After this the forwarding decisions made as the router knows the interface and next hop ( nearest IP ).
                
                |Protocol|Stands For|How It Chooses Path|
                |---|---|---|
                |RIP|Routing Information Protocol|Fewest hops (max 15 hops)|
                |OSPF|Open Shortest Path First|Cost = Bandwidth + Delay|
                |BGP|Border Gateway Protocol|Policy-based, complex rules|
                |EIGRP|Cisco's Enhanced Protocol|Delay + bandwidth + load|
                
        - After packet sent to next hop ( router ) what will happen? here -
            - MAC address resolution -
                - If the next hop is on the same network then the router uses **A**ddress **R**esolution **P**rotocol - `ARP` to get the MAC address of the next hop.
                - If not same then it will send the packet to it’s gateway router then again it all happens.
            - Encapsulation -
                - The router updates the packet’s layer 2 ( ethernet header ) with its source `MAC` = this router’s interface and destination’s MAC = next hop’s MAC
            - TTL Decerement -
                - The router decreases the **T**ime **T**o **L**ive by 1.
                - If `TTL` goes 0 then packet is discarded.
            - Queue and Send -
                - If the packet is placed in outbound queue of the interface.
                - It is then transmitted to next router or device.
    - _**Fragmentation -**_
        - Fragmentation is the process of breaking large IP packets into smaller chunks ( fragement ) that don’t fit in **M**aximum **T**ransmission **U**nit, these packets will be reassembled in Destination router not in intermediate routers.
        - This happens because each layer has a limit, each layer must respect the next layer’s MTU.
        - `IPv6` Do not fragment if packet is big it discards the packet, if need to fragment mean it will happen in source device not the router and reassembled in Destination.
        - IPv6 the host is expected to use Path MTU Discovery ( PMTUD ) to find smallest path to Destination along the route.
        - `IPv4` Fragmentation metrics
            - Identification - An ID for fragments to reassemble in Destination.
            - `Flags - MF` ( More Fragments ) flag used to control fragmentation below are the bit positions that does the action
                - 0 there are no fragments.
                - 1 do not fragment.                    
                - 2 more fragment.                    
                - These bits are used in reassemby each fragment has a bit to that controls reassembly                    
                    [Fragment 1] MF=1 → Not last [Fragment 2] MF=1 → Not last [Fragment 3] MF=0 → Last fragment                    
            - Fragment offset - Tells where the fragment fits in the reassembled packet.        
            - Total length - Denotes the size of a Fragment.                
        - Fragmentation comes with risk of getting `DoS-ed` ( cyber security attack to make system fail by overloading payload ) and Performance loss.
        - To Avoid Fragmentation -
            - use Path `MTU` Discovery to find smallest MTU along the route.
            - set `MSS` ( Maximum segment size ) of a TCP payload to avoid fragmentation.     
            - Manually control MTU with ping
	            - ping -M do -s 1472 google.com
                
                |Tool|Use|
                |---|---|
                |`ping -s`|Manually test MTU sizes|
                |`traceroute`|See packet paths|
                |`tcpdump`|Capture and inspect IP fragments|
                |`Wireshark`|Visualize reassembled packets|
                |`iptables` or `firewall-cmd`|Block or log fragments for security auditing|
                
    - _**Important Protocols -**_
        - IP ( Internet Protocol ) - lays out rules for addressing and routing. stateless and unrelaiable. This does not gurantee delivery.
        - ICMP ( Internet Control Message Protocol ) - Error reporting and diagnostic, used by ping, traceout tools. Ex: when TTL reaches 0 `Time Exceeded` error sent back.
        - IGMP ( Internet Group Management Protocol ) - For managing multicast groups, used in streamig the packets to multiple receviers example google meet or conference internet calls.
    - _**NAT ( Network Address Translation ) -**_
        - Public IPv4 addresses are limited, NAT allows single IP addresses shared among multiple private devices.
        - This is done by home router or ISP edge devices.
            
            |Concept|Description|
            |---|---|
            |**Private IP**|IP address used only inside local network (e.g., `192.168.0.5`)|
            |**Public IP**|IP address assigned by ISP to the outside world|
            |**NAT Table**|Mapping table stored by your router to keep track of which internal device started which request|
            |**PAT (Port Address Translation)**|The most common form of NAT – also called **“NAT Overload”** – uses different port numbers to map multiple private IPs to one public IP|
        
        - laptop IP is a private IP given by router, when request is sent the router will convert the private IP into public IP and maps with a new port, when response for the request coming to router the router will checks the mapping table and forward it to the public IP then response received in private IP device.
            
            |Problem|Why It Happens|Example|
            |---|---|---|
            |**Peer-to-peer issues**|NAT hides internal IPs, so two clients behind NAT can’t connect easily|Torrenting, video calls|
            |**Port forwarding needed**|You can’t receive **unsolicited traffic** from internet unless you configure your router|Hosting a game server, remote SSH|
            |**VoIP/WebRTC issues**|Voice/video apps need two-way real-time communication|Skype, Google Meet|
            |**NAT Traversal**|Need help to punch through NATs|STUN/TURN servers (used in WebRTC)|
            
- ##### Transport
    
    - _**Core Responsibilities -**_
        - End to end delivery between application processes not just devices.
            
        - Provides relaiablity, ordering, error recovery, flow control and multiplexing.
            
        - Works between IP address and Port numbers to make sure the data reaches right service on the right machine.
            
            |Concept|Description|Real-World Example|
            |---|---|---|
            |**Port Number**|Identifies application-level services on a device|HTTP → port 80, HTTPS → port 443|
            |**Multiplexing/Demultiplexing**|Handling multiple conversations at once|Multiple browser tabs open = multiple TCP streams|
            |**Reliability**|Ensures data arrives complete & in order|TCP ensures file downloads don’t get corrupted|
            |**Flow Control**|Prevents fast sender from overwhelming a slow receiver|Sender waits until receiver is ready|
            |**Error Detection & Recovery**|Detect and retransmit lost or damaged packets|TCP resends missing packets|
            |**Congestion Control**|Adjusts sending rate based on network traffic|TCP slows down during traffic surge|
            |**Connection-Oriented vs Connectionless**|TCP is connection-based, UDP is not|TCP = phone call, UDP = letter|
            
    - _**Major Protocols -**_
        - TCP - Transmission Control Protocol
            
            - Relaiable, connection-oriented, ordered.
                
            - Ensures no packet is lost or duplicated.
                
            - Slower compared to UDP, due to overhead ( handshakes, extra headers etc.. ), but guranteed delivery.
                
                |Feature|Description|
                |---|---|
                |**3-Way Handshake**|`SYN` → `SYN-ACK` → `ACK` before data transfer|
                |**Sequencing**|Keeps track of byte numbers for ordering|
                |**Acknowledgement**|Confirms successful delivery|
                |**Retransmission**|Lost packets are resent|
                |**Flow Control**|Uses **Window Size** to manage data flow|
                |**Congestion Control**|Adapts to network congestion (e.g., TCP Tahoe, Reno, Cubic)|
                |**Connection Teardown**|`FIN` → `ACK` → `FIN` → `ACK` closes connection|
                
            - TCP headers
                
                |Field|Description|
                |---|---|
                |**Source Port / Destination Port**|Which app/service is sending and receiving|
                |**Sequence Number**|Order of bytes being sent|
                |**Acknowledgment Number**|Confirms receipt of data|
                |**Flags**|Control bits: SYN, ACK, FIN, RST|
                |**Window Size**|Flow control (how much data receiver can handle)|
                |**Checksum**|Error detection|
                |**Urgent Pointer**|Used in rare urgent data transfers|
                
        - UDP - User Datagram Protocol
            
            - Unrelaiable, connectionless, fast.
                
            - No guranteed delivery, no ordering or error checking.
                
            - Less overhead = speed.
                
                |Feature|Description|
                |---|---|
                |**No Handshake**|Data sent immediately|
                |**No Retransmission**|Lost packets are ignored|
                |**No Ordering**|Packets may arrive out of order|
                |**Lightweight**|Fewer headers = faster transmission|
                
        - Common Ports and Real - life services
            
            |Port|Service|
            |---|---|
            |80|HTTP|
            |443|HTTPS|
            |22|SSH|
            |53|DNS|
            |25|SMTP (email)|
            |3306|MySQL|
            |6379|Redis|
            |27017|MongoDB|
            
        - Common Tools used in Transport layer only to debug in network level
            
            |Tool|What It Does|
            |---|---|
            |`tcpdump`|shows you what packets are moving in/out of your server.|
            |`Wireshark`|GUI version of `tcpdump` analyze traffic visually with protocol decoding.|
            |`netstat` / `ss`|Show open ports and active connections to server.|
            |`nc`|Send/receive TCP/UDP data manually, to debug certain port.|
            |`telnet`|Test open TCP ports, to check if the port is healthy.|
            |`iperf`|Test TCP/UDP bandwidth speed ( performance ) between 2 machines.|
            
        - TCP concepts -
            
            - How the TCP connection life cycle will work ?
                - First a SYN is sent from client to server, then SYN - ACK synchronization is acknowledged by server and sent to client, then ACK is received in client side then connection established.
                - While connection teardown FIN/ACK finished will be sent from server to client then the connection is closed RST is sent to client - when server shuts down immedietly without any ACK.
            - What are connection queues and backlogs in TCP ?
                - When a connection is accepted it is sent to queue and the OS will recognize how many backlog connection is waiting in SYN queue before they get accepted.
                - listen(server , 128) → number of backlogs.
                - If the number of backlogs overloaded then the server throws `ECCONREFUSED` to identify many connections have been sent and overloaded in TCP queue so we wait and retry.
            - Nagle’s Algorithum -
                - This is one of the TCP optimization to combine small packets before sending.
                - This is enabled by default, this puts some delay before sending a request to disable this, use `socket,setNoDelay(true)` .
            - What are TCP Keepalive / Heartbeats ?
                - OS sends keepalive packets ( similar to preflight to ensure connection ) to ensure the health of a long lived TCP connection this will be disabled by default but can enable it.
                - Heartbeats are used in websocket to test the connection between 2 machines ( client and server ).
                - Both are used to detect dead peers or dead connections.
- ##### Session
    
    - _**Core Responsiblities -**_
        
        - The session layer is responsible for establishing, managing and terminating sessions between application.
            
        - The session refers to a sustained interaction or connection between two devices for communication.
            
            |Feature|Description|Real-World Analogy|
            |---|---|---|
            |**Session Establishment**|Begins a logical communication (negotiation) between endpoints|Dialing into a Zoom meeting|
            |**Session Maintenance**|Keeps track of data exchange, monitors session status|Staying connected to your Zoom call|
            |**Session Termination**|Gracefully ends a session once tasks are done|Leaving a Zoom call|
            |**Synchronization**|Adds checkpoints or sync-points for data resumption if interrupted|Saving game progress at checkpoints|
            |**Dialog Control**|Manages who can send data and when (half/full-duplex control)|Taking turns in a conversation or talking simultaneously|
            |**Authentication & Authorization (when applicable)**|Initiates or supports secure exchanges via tokens or credentials|Logging in to a system using username & password before interaction|
            
    - _**Major Protocols -**_
        
        |Protocol / Technology|Description|Real-World Example|
        |---|---|---|
        |**NetBIOS**|Establishes sessions between Windows machines for file/print sharing|Legacy LAN communication|
        |**RPC (Remote Procedure Call)**|Allows a program to invoke functions on a remote server like a local function|Microservices calling each other|
        |**WebSockets**|Persistent, full-duplex communication between client and server over a single TCP connection|Real-time apps like Slack, games, or stock tickers|
        |**SMB (Server Message Block)**|Used by Windows systems for file and printer sharing over a network|Accessing shared folders on Windows|
        |**RDP (Remote Desktop Protocol)**|GUI-based session to interact with remote systems|Accessing your work PC from home|
        |**PPTP / L2TP / IPSec / OpenVPN**|Establish and manage VPN sessions across untrusted networks|Corporate VPNs or remote access|
        |**TLS Handshake (partly in Session)**|Though TLS is mostly in the presentation layer, the _handshake_ phase establishes secure session context|HTTPS setup phase|
        |**gRPC**|A modern RPC framework by Google built on HTTP/2, often used in microservices|Kubernetes internals|
        
    - _**Dialog control -**_
        
        |Type|Description|Examples|
        |---|---|---|
        |**Full Duplex**|Both parties can send and receive data simultaneously|WebSockets, HTTP/2|
        |**Half Duplex**|Only one party sends data at a time|Walkie-talkies|
        |**Simplex**|One-way only communication|TV broadcast|
        
    - _**Session vs connection -**_
        
        |Concept|Session|Transport Connection|
        |---|---|---|
        |Purpose|Logical link between applications|Physical or virtual link between devices|
        |Tracks|State, user identity, session tokens|Packets and bytes (delivery mechanism)|
        |Examples|HTTP cookie sessions, WebSocket channels|TCP/UDP connections|
        
    - _**Use cases in Software Development -**_
        
        - In Web Applications, sessions help to maintain state of users who logged-In using session IDs or tokens.
        - In Networking, sessions are used to control long lived connections ( interactions ) such as database connections, voice calls ( VoIP ), websockets.
        - Session Management is critical in -
            - Authentication Flows.
            - APIs that need persistent state.
            - Retry / Resume mechanisms after disconnects.
    - _**Tools Releated to session Layer -**_
        
        |Tool|Purpose|
        |---|---|
        |**Wireshark**|Can track session-level protocols like SMB, RDP, WebSockets|
        |**netstat / ss**|Monitor established sessions and open ports|
        |**Session ID Analyzers**|In web frameworks to debug login/session issues|
        |**WebSocket Sniffers**|Inspect WebSocket handshakes and traffic|
        
    - _**Session layer and Web Applications -**_
        
        - While HTTP is stateless, web framework implement session tracking using
            - Session cookies.
            - Tokens.
            - In Memory storage or session storage ( Redis ).
        - Most of the Micro-frontend Architecture serves micro frontend build after verifying the session storage’s user ID and Workspace ID by authenticating with backend.
    - _**Security Considerations -**_
        
        - Session hijacking and session fixacation are serious threats, will need to build a system that is faster, it hits back before getting hit.
        - Using -
            - HTTPS ( TLS ) for encrypted sessions.
            - Regenerate Session Ids after login.
            - Encode and decode session ids.
            - Set session timeouts and invalidatation.
            - Use secure flags on cookies.
        
        |Metric|REST (JSON)|GraphQL|gRPC (Protobuf)|
        |---|---|---|---|
        |1000 requests/sec|~300 ms avg|~280 ms avg|~90 ms avg|
        |Payload size|1 KB|1 KB|200 bytes|
        
- ##### Presentation
    
    - _**Core Responsiblities -**_
        
        - The Presentation layer acts as translator of the OSI model, it make sure the data sent by an Application Layer of one system is undestood by Application layer of another system.
            
        - It prepares data for display or processing by formatting, compressing, encrypting or converting into a universally understandable format.
            
            |Feature|Description|Real-World Analogy|
            |---|---|---|
            |**Data Translation**|Converts data formats between sender and receiver (e.g., EBCDIC ↔ ASCII)|Translating English to Spanish during a call|
            |**Data Encryption/Decryption**|Ensures confidentiality by encrypting data before transmission and decrypting on reception|Locking a letter in a safe before mailing|
            |**Data Compression/Decompression**|Reduces the size of data to save bandwidth or time|Zipping files before sending them|
            |**Serialization/Deserialization**|Converts structured data to/from byte stream for transmission|Packing structured content into a shipping box and unpacking|
            |**Encoding/Decoding**|Handles media types (text, image, audio, video), character sets (Unicode, UTF-8), and binary formats|Ensures proper fonts/images load in a web browser|
            |**Syntax Negotiation**|Agreeing on common syntax before data exchange|Agreeing on language before talking in a meeting|
            
    - _**Functions and Responsibilities -**_
        
        - **Data Formatting -** Ensures Systems using different data structures can communicate.
        - **Character Encoding -** Different systems may represent characters differently UTF-8 vs ASCII to EBCDIC for legacy systems.
        - **Compression -** Reduce data size to have faster transmissions (converting to zip).
        - **Encryption -** Secure data to prevent eaves dropping ( TLS/SSL encryption).
        - **Decryption and Decompression -** The receving system use same method to intrepert ( decrypt / decompress ) the incoming data.
    - _**Presentation layer protocols and standards -**_
        
        |Protocol / Standard|What It Does|Examples|
        |---|---|---|
        |**TLS / SSL**|Encrypts data for secure communication over the network|HTTPS, FTPS, SMTPS|
        |**ASCII / Unicode / UTF-8**|Character encoding standards|Web content, emails|
        |**JPEG / PNG / GIF**|Image compression and formatting|Displaying images on websites|
        |**MPEG / MP4 / AVI**|Video/audio formats and compression|Streaming media|
        |**JSON / XML / YAML**|Structured data formats for API communication|REST APIs, config files|
        |**Base64**|Encodes binary data into text|Email attachments, JWT payloads|
        |**XDR / ASN.1 / Protobuf / Avro**|Cross-platform serialization formats|RPC, gRPC, big data frameworks|
        |**Gzip / Brotli / Deflate**|Data compression techniques|HTTP compression for faster web pages|
        
    - _**Real world scenario -**_
        
        |Scenario|How the Presentation Layer Helps|
        |---|---|
        |Visiting a secure website (`https://`)|Encrypts the page using TLS|
        |Viewing a YouTube video|Decompresses and decodes MPEG stream|
        |Reading a JSON API response|Translates raw HTTP body into JSON format|
        |Downloading a ZIP file|Compresses it before transfer; decompresses upon open|
        |Translating emojis in a chat|Handles UTF-8 character encoding|
        
    - _**Tools Involved in Presentation layer -**_
        
        - openssl - Test and analyze TLS / SSL certificates.
        - base64 - encode / decode data for safe transport.
        - file - A command that detect the file format.
        - gzip, brotli, zstd - compress / decompress files.
        - curl -I - Inspect HTTP headers like content-encoding.
    - _**Security considerations -**_
        
        - Vulnerabilities in Presentation layer -
            - Data leakage because of weak encryption.
            - man-in-middle attacks because of misconfigured TLS.
            - Parsing attacks malformed JSON / XML.
        - Best Practices to follow -
            - Always use HTTPS with TLS encryption.
            - Validate and sanitize serialized / deserialized data.
            - use standard and updated libraries for compression/encoding.
    - _**Connection with Other Layers -**_
        
        _**Application**_ layer will ask the _**Presentation**_ layer to transform this data, Presentation layer wll ask the data that stored in _**Session**_ layer through the Transport layer the _**Transport**_ layer will just passes the data stored in session storage, This way the data is flowed to Application layer in universal format.
        
- ##### Application
    
    The Application layer is closest to user and serves as interface between user facing software and the network. It provides network services directly to applications and defines how data should be presented, transmitted and received. This does not refer direct UI of any specific app but the UI → Netowork will happen here in Application layer of every App.
    
    - _**Core Responsibilities -**_
        
        |Feature|Description|Real-World Analogy|
        |---|---|---|
        |**User Interface to Network**|Provides a way for applications to access network services|Using Gmail to send email over the internet|
        |**Service Advertisement**|Tells what services are available on a network|A website advertising an API|
        |**Resource Sharing**|Access to files, printers, or data remotely|Google Docs sharing over the cloud|
        |**Application Protocols**|Standardize data formats & interactions|HTTP for web, DNS for name resolution|
        |**Authentication**|Starts login & identity verification process|Username/password in a web app|
        |**Data Integrity & Synchronization**|Ensures data is correct and in sync with remote apps|Dropbox syncing files|
        
    - _**Functions of Application layer -**_
        
        - Provides network services directly to clients.
        - Establishes rules and protocols on how communication among Application works.
        - Handles request and response between client and servers.
        - Translates user actions into network operations, and vice versa.
        - Manages sessions, authentication, and configuration at the app level.
        - Interacts heavily with Presentation and session layers.
    - _**Common Protocols in Applicatoin Layer -**_
        
        - _HTTP_ - Hyper text transfer protocol, standard protocol for web communication without any security.
        - _HTTPS_ - Hyper text transfer protocol Secure, standard protocol but with security such as TLS, encrypted version of HTTP.
        - _FTP_ - File Transfer Protocol, transfers files insecure.
        - _SFTP -_ SSH file transfer Protocol, secured file transfer over SSH.
        - SMTP - Simple mail transfer protocol, sends outgoing emails.
        - _IMAP -_ Internet message access protocol, retrieves emails sync across devices.
        - _POP3 -_ Post Office protocol v3, Downloads emails, deletes from server.
        - _DNS_ - Domain name system, used to find domains across internet.
        - _DCHP_ - Dynamic host configuration protocol, Assigns private IP address dynamically when connection to router established.
        - _SSH -_ Secure shell, remote terminal access to servers , running commands in VM.
        - _TELNET_ - Telecommunication network, Insecure remote shell.
        - _SNMP_ - Simple network management protocol, monitors and manages network devices.
        - _NTP -_ Network time protocol, synchronize clocks across systems.
        - _LDAP -_ Lighweight directory accessing protocol, Centralized user directory & authentictation used in enterprise systems ( SSO ). **
        - _RDP -_ Remote Desktop protocol, GUI based remote access to windows machines.
        - _VNC -_ Virtual Network computing, GUI based remote desktop access cross platform.
        - _REST -_ Representational State transfer, stateless API architecture using HTTP web.
        - _SOAP -_ Simple object Access protocol, XML- based strict API communication.
        - _websocket_ - Duplex communication between clients and server.
    - _**Tools for Troubleshooting Application layer -**_
        
        |Tool|Use|
        |---|---|
        |`curl`|Send HTTP requests and test APIs|
        |`wget`|Download files over HTTP/S, FTP|
        |`dig` / `nslookup`|Look up DNS records|
        |`telnet`|Test TCP connection to application ports|
        |`ssh`|Securely access remote servers|
        |`ftp` / `sftp`|Transfer files|
        |`openssl s_client`|Inspect HTTPS/TLS handshakes|
        |Postman / Insomnia|GUI tools to interact with APIs|
        
    - _**Security considerations in Application Layer -**_
        
        |Threat|Description|Example|
        |---|---|---|
        |**Phishing / Social Engineering**|Trick users via email or websites|Fake login page|
        |**Man-in-the-middle (MIM)**|Intercept unencrypted data|HTTP traffic sniffing|
        |**Injection Attacks**|Malicious input to trick systems|SQL injection|
        |**Cross-Site Scripting (XSS)**|Malicious scripts in web pages|JavaScript stealing cookies|
        |**Session Hijacking**|Taking over valid user sessions|Stolen cookies|
        |**Data Leakage**|Poor validation exposes sensitive data|Misconfigured APIs|
        
    - _**Key Application Layer concepts -**_
        
        |Concept|Explanation|
        |---|---|
        |**Client-Server Model**|One device requests (client), other responds (server)|
        |**Stateless Protocols**|Each request is independent (e.g., HTTP)|
        |**Stateful Protocols**|Maintain session state (e.g., FTP, WebSocket)|
        |**Headers and Payloads**|Protocols define metadata + data|
        |**Request-Response Cycle**|Client sends request, server returns response|
        |**RESTful APIs**|Stateless, HTTP-based APIs using JSON/XML|
        |**Session Tokens / Cookies**|Maintain login state in stateless protocols|
        
    - _**Releation with Other layers -**_
        
        - Application layer uses _**Presentation**_ layer to encrypt the outgoing data for security purpose.
        - Applcation layer request _**Session**_ layer to maintain long lived sessions.
        - Application layer uses TCP or UDP to transmit data using _**Transport**_ layer ( packets ).
        - Other layers functions under above mentioned layers.

## IP Addressing and Subnetting

- Introduction
    
    An IP ( Internet Protocol ) address is a logical identifier for a device in a network. It helps route packets between device
    
    - IPv4 - `198.168.1.1` 4 Octets, 32 Bits.
    - IPv6 - `2001:0db8:85a3:0000:0000:8a2e:0370:7334` 16 Octets, 128 Bits.
- Types of IP Address
    
    |Type|Description|Example|
    |---|---|---|
    |**Public IP**|Assigned by ISP, accessible over internet|`203.0.113.1`|
    |**Private IP**|Used within local network (LAN)|`192.168.x.x`, `10.x.x.x`|
    |**Static IP**|Manually assigned, doesn’t change|Web server, DNS Author|
    |**Dynamic IP**|Assigned temporarily by DHCP|Wi-Fi device|
    |**Loopback**|Refers to self|`127.0.0.1`|
    |**APIPA**|Auto-assigned when DHCP fails|`169.254.x.x`|
    |**Broadcast**|Sends data to all in a subnet|`192.168.1.255`|
    
- Address Classes
    
    - IPv6 -
        
        - IPv6 Do not use Address classes in the same way as IPv4, instead they are categorized in types, scope and range.
            
        - Can have short forms `::1` mean the local IPv6 as 128Bits IPv6 allows shortforms.
            
            - `2000::/3` - Global uni cast ( starts with `2000s`, `3000s` ).
            - `fe80::/10`- Local LAN only routers, neighbour’s discovery ( starts with `fe`).
            - `fc00::/7` - Private Networks IP ( starts with `fc` , `fd` ).
            - `ff00::/8` - One to many ( starts with `ff` ).
        - IPv6 uses Multicast instead of Boardcast, and NDP - Neighbour Discovery Protocol is used instead of ARP - Address Resolution Protocol.
            
        - To know the MAC address of another IPv6 address, it sends a Neighbour Soliciation - NS to solicited-node multicast address ( generated by sender using reciver IPv6 ), it replies with Neighbor Advertisement (NA) which has the info about device - MAC address.
            
        - Types
            
            |Address Type|Description|
            |---|---|
            |**Unicast**|Identifies a single interface. A packet sent to a unicast address is delivered to one interface.|
            |**Multicast**|Identifies multiple interfaces. A packet sent to a multicast address is delivered to all interfaces in the group.|
            |**Anycast**|Identifies a group of interfaces, but a packet is delivered to the _nearest_ one (according to routing distance).|
            
        - Scope
            
            |Prefix - Shortened IPv6|Address Type|Use Case / Scope|
            |---|---|---|
            |`::1`|Loopback|Used for testing, like `127.0.0.1` in IPv4|
            |`::`|Unspecified|Used when a device doesn't yet have an address|
            |`fe80::/10`|Link-local|Used on the local link only|
            |`fc00::/7` (`fd00::/8`)|Unique local (ULA)|Private networks (like IPv4 private IPs)|
            |`2000::/3`|Global unicast|Globally routable, like public IPv4 addresses|
            |`ff00::/8`|Multicast|Multicast communication|
            
        - Range
            
            |Address Range - Shortened IPv6|Type|Notes|
            |---|---|---|
            |`::/128`|Unspecified|Used when an address is not yet assigned|
            |`::1/128`|Loopback|Local host communication|
            |`fe80::/10`|Link-local|Auto-configured, not routable beyond link|
            |`fc00::/7`|Unique Local|Not routable on the global internet|
            |`2000::/3`|Global Unicast|Routable on the public internet|
            |`ff00::/8`|Multicast|One-to-many communication|
            
    - IPv4 -
        
        |Class|Range|Default Subnet Mask|Use Case|
        |---|---|---|---|
        |**A**|1.0.0.0 – 126.255.255.255|255.0.0.0|Huge networks (gov, ISP)|
        |**B**|128.0.0.0 – 191.255.255.255|255.255.0.0|Medium-sized orgs|
        |**C**|192.0.0.0 – 223.255.255.255|255.255.255.0|Small businesses, homes|
        |**D**|224.0.0.0 – 239.255.255.255|—|Multicast|
        |**E**|240.0.0.0 – 255.255.255.255|—|Experimental|
        
- Classless Inter Domain Routing ( CIDR )
    
    - CIDR - also helps router to maintain the routing table by grouping similar IPs under a genric / summarized address as router will get longest prefix match ( LPM ) this will let the router get those IPs ease.
    - **CIDR** - Classless inter Domain Routing eliminates strict IP classes ( A, B, C, D, E ) and allows flexible subnetting.
        - `192.168.1.0/24` the `/24` indicates the number of network bits available in the address.
            
        - Binary - `11111111.11111111.11111111.00000000` subnet mask will be → `255.255.255.0`
            
        - `/24` means first `24 bit` are for network and rest `8 bit` ( can be 0s and 1s so 2^8 ⇒ 256 IPs) are for host ( total `32 bit` in `IPv4` ).
            
        - Address Range : `192.168.1.0` → `192.168.1.255` , total usable IPs = 254 (subracting network and broadcast IPs).
            
        - More bits = fewer hosts per subnet, but more subnets.
            
        - CIDR Mapping -
            
            |CIDR|Subnet Mask|Usable Hosts|
            |---|---|---|
            |`/24`|255.255.255.0|254|
            |`/25`|255.255.255.128|126|
            |`/26`|255.255.255.192|62|
            |`/27`|255.255.255.224|30|
            |`/28`|255.255.255.240|14|
            |`/29`|255.255.255.248|6|
            |`/30`|255.255.255.252|2|
            
- Subnetting
    
    - Subnetting is the process in which the larger network bits ( `/24` ) are broke down into smaller segments to organize.
        
        |Benefit|Description|
        |---|---|
        |**Performance**|Reduces broadcast domains|
        |**Security**|Isolates traffic between subnets|
        |**Efficient IP Use**|Avoids wasting IPs in large unused blocks|
        |**Scalability**|Easier to organize large networks|
        
    - Formula to calculate number of IPs-
        
        Number of Subnets = 2^(new bits added to the subnet mask) Number of Hosts = 2^(host bits) - 2 # (1 for network, 1 for broadcast)
        
    - `192.168.10.0/26` → `26` network bits available and `6` for hosts subnet mask will be `255.255.255.192` .
        
        |Subnet|Subnet Address|IP Range|Usable IPs|Broadcast Address|
        |---|---|---|---|---|
        |1|`192.168.10.0/26`|`192.168.10.0 – 192.168.10.63`|`.1 – .62`|`.63`|
        |2|`192.168.10.64/26`|`192.168.10.64 – 192.168.10.127`|`.65 – .126`|`.127`|
        |3|`192.168.10.128/26`|`192.168.10.128 – 192.168.10.191`|`.129 – .190`|`.191`|
        |4|`192.168.10.192/26`|`192.168.10.192 – 192.168.10.255`|`.193 – .254`|`.255`|
        
- Routing
    
    - Formula to determine the IP local or remote -
        - Device will check it’s own IP address and subnet mask, it applies subnet mask to determine if destination IP or local or remote.
            - Formula - `ownIP && ownSubnet === destIP && ownSubnet` if `true` then `local` else `remote`.
            - If local it will get the `MAC Address` with `ARP` else it will get the IP of router then `sends` the packet to `router` ( default gateway ).
        - Case _Local_ -
            - Device Broadcasts ( within subnet ) ARP request asking who has this IP?.
                
            - Destination device replies with MAC Address ( IPs will match which will be configured when the device connected to internet via DHCP ).
                
            - Now sender stores the address in ARP cache ( will time out after minutes ) and device builds the packet with frames, frame is directly sent to destination device.
                
                |Scenario|Action|
                |---|---|
                |**Local**|Use **ARP** to get target's MAC → Send frame directly to device|
                |**Remote**|Use **ARP** to get **router’s MAC** → Send frame to router (gateway)|
                
        - Case _Remote -_
            - When none of the device replied the default gatway ( router ) will reply with MAC address and packet is built by source and recieved by router.
            - Checks the destination IP.
            - Looks up its routing table.
            - Forwards the packet to next best hop toward the target how? the router finds the longest prefix match with the destination IP ( from own routing table the BGP will help for this - Border Gatway Protocol ).
            - After choosing the IP it checks the Administrative distance if more paths exists for same destinatoin then router choose the cost effective and shortest path.
            - Cost is calculated by routing protocols RIP, OSPF, BGP etc…
            - After this the forwarding decisions made as the router knows the interface and next hop ( nearest IP ).
            - If the IP belongs to the router’s subnet then ARP is used to get MAC address via boardcasting.
- NAT - Network Address Translation
    
    - NAT is a concept used by routers to modify the next IP address information in the packets as it travels. To be simple it translates Private IP to Public IP.
    - NAT is manily needed for security, isolation and network flexibility as it hides the private IP to outside world.
    - Types - static NAT, Dynamic NAT and PAT ( Port address translation ).
    - Working -
        - Your private server `10.0.0.5` wants to connect to `8.8.8.8` (Google DNS).
        - Server sends a packet with source IP `10.0.0.5`.
        - Router/firewall doing NAT replaces the source IP with the router’s public IP (e.g., `203.0.113.5`) and remembers this mapping.
        - When the reply comes back to `203.0.113.5`, the router uses its NAT table to forward the packet back to `10.0.0.5`.
    - Security -
        - NAT provides a form of basic ****firewall because unsolicited inbound traffic can’t directly reach internal hosts unless explicitly allowed.
        - But NAT itself is not a security feature; you still need firewall rules to control traffic.
- ARP - Address Resolution Protocol
    
    - ARP - is used internally when packet reaches the router.
    - ARP is an internal NAT but instead of modifying the IPs, ARP resolves the IPs with MAC address ( appropiate destination’s MAC ).
- CLI Tools
    
    |Command|Use|
    |---|---|
    |`ipconfig` / `ifconfig`|Check assigned IPs|
    |`ip a`|Show all interfaces & IPs (Linux)|
    |`netstat -rn`|View routing table|
    |`ipcalc`|CIDR to subnet calculation|
    |`traceroute` / `tracepath`|Visualize path based on IP routing|
    |`whois <IP>`|Check IP ownership / ASN|
    

## DNS , DHCP & Router

- DHCP - Dynamic host configuration Protocol
    - _**History**_
        
        - BOOTP - Bootstrap Protocol was the predecessor to DCHP in the 1980s.
        - This could assign IP address but lacked dynamic allocation and lease control.
        - DHCP introduced in 1993, later updated to automate IP address assignment with better control.
    - _**Problem DHCP solves**_
        
        - Every device needs a manual IP configuration (IP, subnet, default gateway, DNS etc).
        - Time consuming and error prone in large networks.
        - DHCP automates this process, dynamically assigning network settings to devices.
    - _**Process DORA ( UDP based client - Port 67, server - Port 68)**_
        
        - Device will have in built DCHP client which will talks to DHCP server in router.
        - Discover ( DHCPDISCOVER ) - Device sends broadcast asking for IP configuration.
        - Offer ( DHCPOFFER ) - DHCP server offers an IP address and config.
        - Request ( DHCPREQUEST ) - Device requests the offerred IP.
        - Acknowledge ( DHCPACK ) - Server confrims and leases the IP to device.
        - Now that the IP configurations have done now device sends broadcast ARP request to get the MAC address of default gateway ( router ).
    - _**DHPC Components**_
        
        |Component|Function|
        |---|---|
        |**DHCP Client**|The device (host) that needs IP config|
        |**DHCP Server**|Assigns IP, gateway, DNS, etc.|
        |**DHCP Relay Agent**|Forwards DHCP requests between different subnets|
        |**Lease**|Temporary ownership of an IP address|
        |**Scope**|The IP range available for assignment|
        |**Reservation**|Fixed IP for specific MAC configrable via dashboard of router (like a printer)|
        |**Options**|Extra settings (DNS, default gateway, NTP, etc.)|
        
    - _**Lease Time & Renewal**_
        
        - IP is leased for a certain period ( 24 hours ).
            
        - Belwo example DHCP is 24 Hours ( configured in DHCP server )
            
            |Time|Action|
            |---|---|
            |**T1 (50%) 12 Hours**|Client tries to renew lease with same server|
            |**T2 (87.5%) 21 Hours**|If server not available, broadcast to renew with any DHCP server|
            |**T3 (100%) 24 Hours**|Lease expires — client starts over with DHCP Discover|
            
    - _**Issues with DHCP**_
        
        |Issue|Cause|
        |---|---|
        |**IP Conflict**|Static and DHCP overlap|
        |**No IP address**|DHCP server down or scope exhausted|
        |**Wrong gateway/DNS**|Misconfigured options|
        |**DHCP not reaching client**|No relay in different subnet|
        
- DNS - Domain Name Server
    - _**History**_
        
        - Before DNS systems used a static hosts.txt file.
        - DNS introduced in 1983, defined in RFC 1034 and 1035.
        - Designed to scale and automate name-to-IP resolution.
    - _**Problem DNS solves**_
        
        - Humans can remember names like [www.arka.com](http://www.arka.com) not IPs like 142.250.72.68.
        - DNS translates domain names → IP addresses.
    - _**DNS components**_
        
        |Component|Role|
        |---|---|
        |**DNS Resolver (Client)**|Requests DNS info|
        |**Recursive Resolver**|Asks other servers and returns result, full flow root → TLD → authoritative.|
        |**Iterative Resolver**|Server gives referral: “Ask him <IP address of other server> “.|
        |**Root DNS Server**|Directs to TLD servers|
        |**TLD Server (.com, .org, .net, etc.)**|Directs to authoritative DNS|
        |**Authoritative DNS Server**|Holds the actual IP of the domain|
        
    - _**DNS Resolution Process ( recursive lookup )**_
        
        Example: `www.openai.com`
        
        1. Client asks local DNS resolver: “What is the IP of [www.openai.com?”](http://www.openai.com/?%E2%80%9D&utm_source=chatgpt.com)
        2. Resolver checks its **cache**
        3. If not cached:
            - → Asks Root Server
                - Root says: Ask `.com` TLD server
            - → Asks `.com` TLD ( Top Level Domains ) server
                - TLD says: Ask OpenAI’s authoritative DNS ( cloud fare or aws )
            - → Asks Authoritative Server
                - Returns IP: `104.18.12.123`
        4. Resolver gives IP to client and caches it
    - _**DNS Record Type**_
        
        |Type|Description|
        |---|---|
        |**A**|Maps hostname to IPv4 address|
        |**AAAA**|Maps hostname to IPv6 address|
        |**CNAME**|Canonical name (alias to another domain)|
        |**MX**|Mail server records|
        |**NS**|Name server|
        |**TXT**|Human-readable info (e.g., SPF, verification)|
        |**PTR**|Reverse lookup (IP → Domain)|
        
    - _**DNS caching & TTL**_
        
        - Every DNS response includes a TTL - Time To Live.
        - Cached in -
            - OS
            - Browser
            - DNS resolvers
        - Reduces DNS traffic and speeds up repeated lookups
    - _**DNS Security issues**_
        
        |Threat|Description|
        |---|---|
        |**DNS Spoofing/Poisoning**|Attacker injects fake DNS entry into cache|
        |**DNS Hijacking**|Redirect DNS queries to malicious servers|
        |**Solution**|Use **DNSSEC**, encrypted DNS (DoH/DoT), trusted resolvers|
        
    - _**DNS tools & commands**_
        
        |Tool|Purpose|
        |---|---|
        |`nslookup`|Query DNS manually|
        |`dig`|More advanced DNS queries|
        |`host`|Simple DNS lookup|
        |`ipconfig /flushdns`|Clear DNS cache (Windows)|
        |`systemd-resolve --statistics`|View DNS stats (Linux)|
        
    - _**Types of DNS Queries**_
        
        |Type|Description|
        |---|---|
        |**Recursive**|Client asks DNS to resolve full name (waits for final answer)|
        |**Iterative**|Server responds with referral — "try this next DNS server"|
        |**Reverse**|Converts IP → domain (uses **PTR record**)|
        
- How does device knows there is a Router / WI-FI
    - **Beacon Frames -**
        - Routers, hotspots or any AP ( Access Points ) will broadcast `Beacon` frames every `~100ms` .
        - These are digital signals which includes
            - SSID - WIFI name.
            - Supported speed.
            - Encryption type.
            - Channel info.
            - MAC Address ( BSSID ).
        - Device will listen for these beacons on different channels to detect available WI-FI networks in range.
    - **WI-FI Radio Scanning -**
        - WI-FI enabled devices continuosly scan the surrounding environment using their wireless network interface ( a hardware component in device ).
        - Two types of scanning
            - Passive Scannig -
                - The device listens for `Beacon frames` from nearby APs ( Access Points ).
                - This is less power-consuming and more stealthy ( common in smart phones to save battery ).
            - Active Scanning -
                - The device sends out `Probe Requests` on various `channels` ( waves ) asking for any available WI-FI networks.
                - More power usage and less stealthy.
- Router
    - Router is a network device that forwards data packets between different networks. This acts like e Postal hub, that receives packages ( packets ), checks the address, and forwards them to the correct destination - even accross the globe.
        
    - Core Functionalities
        
        |Function|What It Does|
        |---|---|
        |**Routing**|Moves data between different IP subnets or networks|
        |**NAT** (Network Address Translation)|Translates private IPs (like 192.168.x.x) to public IPs|
        |**DHCP Server** (optional)|Assigns IPs to devices in home/small networks|
        |**Firewall**|Controls what traffic is allowed in/out|
        |**Packet Filtering**|Blocks or allows packets based on IP, port, protocol|
        |**Port Forwarding**|Redirects incoming requests to specific internal devices|
        |**Static/Dynamic Routing**|Learns how to reach networks via manual routes or routing protocols (e.g., OSPF, BGP)|
        
    - Router’s role
        
        - Home router, routes between local network and internet ( WiFi + NAT + DHCP ).
        - Enterprise connects VLAN’s, enforces security, routes between internal networks and WAN.
        - Cloud virtual routers control routing tables for subnets and VPNs.
    - Routing Metrics
        
        |Field|Example|
        |---|---|
        |**Destination Network**|`192.168.1.0/24`|
        |**Next Hop**|`192.168.1.1`|
        |**Interface**|`eth0`|
        |**Metric**|Priority of the route (lower = preferred)|
        
    - Types of Routing
        
        |Type|Description|
        |---|---|
        |**Static Routing**|Admin manually sets the paths. Simple but not scalable.|
        |**Dynamic Routing**|Routers exchange routes using protocols:|
        |→ **OSPF**|Internal networks — uses cost and link state|
        |→ **BGP**|Used on internet and cloud — scalable, controls path selection|
        |→ **EIGRP**|Cisco proprietary — hybrid of distance vector and link state|
        
    - Router as security device
        
        - Routers offer
            - Access control list ( ACL ) - Rules for what traffic ( domains, IP’s ) is allowed.
            - Stateful firewalls - understands connection states ( TCP handshake ).
            - VPN support - site to site and remote access.
    - How router enable the internet
        
        - Every time a site is opened the packet sent to default gateway ( router ).
        - It gets NATed and forwarded to ISP’s roouter.
        - Then BGP takes over accross ISP’s.
        - Routers guide the packet by hop-by-hop to the destination.
        - Packets which returned follow the same or better path back.
- Switch
    - A switch is a Layer 2 ( data link ) device. It connects the devices within same LAN - Local Area Network and forwards Ethernet frames based on MAC address.
        
    - Core Functionalities
        
        |Function|What It Does|
        |---|---|
        |**MAC Learning**|Learns which MAC addresses are connected to which port ( ethernet or network port not local device ports )|
        |**Frame Forwarding**|Forwards Ethernet frames to the correct port using MAC table|
        |**Flooding**|If destination MAC unknown, sends frame to all ports (except source)|
        |**Loop Prevention (STP)**|Uses Spanning Tree Protocol to prevent network loops|
        |**VLAN Support**|Segments LAN into separate virtual networks|
        |**Port Security**|Restricts MACs allowed per port (security feature)|
        |**Switching Logic**|Operates at Layer 2 (Ethernet/MAC), but some L3 switches support IP routing|
        
    - Switch’s role
        
        - Home / Small networks, connecting devices such as computer, printer etc…
        - Enterprise networks, Used in access layer ( user facing ), distrubution ( between switches ) and sometimes core layer.
        - Cloud virtualization, switch replaced by bridges, virtual switches or SDN ( software defined networks ).
    - MAC ( CAM ) Address table
        
        |Field|Description|
        |---|---|
        |**MAC Address**|Unique hardware address of device|
        |**Port**|The switch port that learned the MAC|
        |**Timestamp**|Optional - aging timer to refresh or remove stale entries|
        
    - Switch modes and features
        
        |Mode/Feature|Description|
        |---|---|
        |**Store-and-Forward**|Receives full frame, checks for errors, then forwards|
        |**Cut-Through**|Starts forwarding as soon as destination MAC is read — lower latency|
        |**VLAN Tagging (802.1Q)**|Adds VLAN ID into Ethernet frame — allows trunk links|
        |**Trunk vs Access Ports**|Trunk carries multiple VLANs, Access carries only one|
        |**PoE (Power over Ethernet)**|Some switches power devices like IP cameras or phones via Ethernet|
        
    - VLANs ( Virtual Local Area Networks )
        
        - VLANs seprate traffic on the same physical switch into isolated broadcast domains.
        - Used to isolate traffic by department, security level and function.
        - Communicating between VLANs requires a Router or layer 3 switch ( inter-VLANRouting ).
        
        |Example|Description|
        |---|---|
        |VLAN 10|HR Department (10.0.10.0/24)|
        |VLAN 20|Engineering (10.0.20.0/24)|
        |VLAN 99|Management (10.0.99.0/24)|
        
    - Security capabilities
        
        - Port security, Limits the number of devices per port.
        - DHCP spoofing, Prevent rouge DHCP servers.
        - Dynamic ARP Inspection ( DAI ), Protects against ARP spoofing.
        - BPDU Guard, Prevents accidental STP ( Spanning Tree Protocol ) changes from unauthorized devices.
    - Difference among Switch, Hub and Router
        
        |Device|Operates At|Uses|Intelligent?|Broadcast Domains|Collision Domains|
        |---|---|---|---|---|---|
        |**Hub**|Layer 1|Bit-level signaling|No|1|1|
        |**Switch**|Layer 2|MAC address|Yes|1 per VLAN|1 per port|
        |**Router**|Layer 3|IP address|2x Yes|Many|Many|
        
    - Packet flow in Switch
        
        - Device A sends a frame to Device B’s MAC.
        - Switch checks MAC table:
            - If found: forwards directly to that port.
            - If not: floods the frame.
        - Learns source MAC and updates its table.
        - Next time — sends directly without flooding.

## NAT - Network Address Translation

## BGP Basic

## HTTP, HTTPS, WebSockets, gRPC

- SNAT, DNAT, PAT
- NAT in Kubernetes (kube-proxy, NAT table)
- NAT traversal in WebRTC, STUN/TURN

## Load Balancing and Reverse Proxy

## CDNs

## Caching in Networking

## Networking in Cloud

- SNAT, DNAT, PAT
- NAT traversal in WebRTC, STUN/TURN.
- Ingress controllers.
- Kubernets NAT ( comunication among clusters ).
- In depth containerization.
- In depth kubernetes working and configuration.
- NAT in Kubernetes (kube-proxy, NAT table)
- NAT traversal in WebRTC, STUN/TURN

|**Component**|**MERN Analogy**|**Purpose in Private Cloud**|
|---|---|---|
|**IP Space**|Application Namespace|`10.0.0.0/16` → your entire private cloud “address range”|
|**Subnets**|Modules: Front-end / Backend|Split into `10.0.1.0/24`, `10.0.2.0/24`; differentiate roles (web, db, mgmt)|
|**VLANs (L2)**|Feature Flags / Dev vs Prod|Use VLAN IDs to isolate traffic even within same IP ranges|
|**Routing**|Express Router Logic|Use pfSense or Linux VM to route between subnets or toward the internet|
|**NAT / Firewall**|Security Middleware / Proxy|Use pfSense firewall VM to govern access and provide NAT for internet access|
|**Internet Access**|External API Calls|NAT + gateway allow outbound but block inbound direct access|
|**DNS / DHCP**|Dynamic Routing / Config|Run DHCP/DNS service in a management VM to assign IPs and names|

|Layer|Purpose|
|---|---|
|VPC (Virtual Network)|Your full IP space (`10.0.0.0/16`)|
|Subnets|Split for isolation and purpose (public/private)|
|Routing|Internet access, internal routing|
|NAT / Firewall|Control access in/out|
|VLANs (Proxmox)|Optional if you want L2 segmentation|

## Securing Network and Achitecture

|Defense Mechanism|How It Helps|
|---|---|
|**Rate Limiting**|Limits number of requests per user/IP|
|**Web Application Firewall (WAF)**|Filters malicious requests|
|**CDNs**|Absorb/fight traffic at the edge (e.g. Cloudflare)|
|**IP Blacklisting**|Blocks traffic from known bad IPs|
|**Reverse Proxies**|Offload and filter requests before reaching main server|
|**Scaling Infrastructure**|Auto-scaling can absorb temporary surges|

## VPNs and site → site Tunnels

## Message Queues and Async communication

## Behind the Scenes when you visit a website

## Observability and Debugging