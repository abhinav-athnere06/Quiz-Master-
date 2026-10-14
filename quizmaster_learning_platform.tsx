import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  BookOpen, Trophy, Award, CheckCircle2, XCircle, AlertCircle, Clock,
  ChevronRight, ChevronLeft, ArrowRight, RotateCcw, Search, Filter,
  BarChart3, User, Settings, Info, Home, LayoutDashboard, Compass,
  Sparkles, Check, HelpCircle, Moon, Sun, Volume2, VolumeX, Trash2,
  Bookmark, Flag, Play, GraduationCap, ShieldCheck, Cpu, Code2,
  Terminal, Globe, Zap, AlertTriangle, ArrowUpDown, RefreshCw, Eye
} from 'lucide-react';

// ==========================================
// TYPES & DATA CONTRACTS
// ==========================================

export type Category = 
  | 'C Programming'
  | 'Computer Fundamentals'
  | 'Cybersecurity'
  | 'Digital Logic'
  | 'General Knowledge'
  | 'Web Development';

export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface Question {
  id: string;
  category: Category;
  subtopic: string;
  difficulty: Difficulty;
  questionText: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface QuizMeta {
  id: string;
  title: string;
  description: string;
  category: Category;
  difficulty: Difficulty;
  estimatedMinutes: number;
  icon: string;
}

export interface QuizAttemptRecord {
  id: string;
  quizId: string;
  quizTitle: string;
  category: Category;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  unanswered: number;
  scorePercentage: number;
  timeSpentSeconds: number;
  timestamp: number;
  userAnswers: Record<number, number>; // index in shuffledQuestions -> selected option index
  shuffledQuestions: Question[];
}

export interface UserProfile {
  name: string;
  theme: 'light' | 'dark';
  soundEnabled: boolean;
  studentName: string;
  collegeName: string;
  branch: string;
  projectTitle: string;
}

export const QUESTION_BANK: Question[] = [
  // --- C Programming (20 questions) ---
  {
    id: 'c-01',
    category: 'C Programming',
    subtopic: 'Data Types',
    difficulty: 'Easy',
    questionText: 'What is the format specifier used to print a standard signed integer in C with printf()?',
    options: ['%c', '%f', '%d', '%s'],
    correctIndex: 2,
    explanation: '%d (or %i) is the standard format specifier used for signed decimal integers in C.'
  },
  {
    id: 'c-02',
    category: 'C Programming',
    subtopic: 'Variables',
    difficulty: 'Easy',
    questionText: 'Which of the following is a syntactically valid variable identifier in C?',
    options: ['2total', 'total_count', 'int', 'total-count'],
    correctIndex: 1,
    explanation: 'Identifiers in C cannot begin with a digit, cannot contain hyphens, and cannot match reserved keywords.'
  },
  {
    id: 'c-03',
    category: 'C Programming',
    subtopic: 'Keywords',
    difficulty: 'Easy',
    questionText: 'How many reserved keywords are defined in the ANSI C89 standard?',
    options: ['32', '48', '64', '24'],
    correctIndex: 0,
    explanation: 'The ANSI C (C89/C90) standard defines exactly 32 reserved keywords (e.g., auto, break, case, int).'
  },
  {
    id: 'c-04',
    category: 'C Programming',
    subtopic: 'Operators',
    difficulty: 'Medium',
    questionText: 'What is the evaluated result of the expression 5 / 2 in standard C integer arithmetic?',
    options: ['2.5', '2', '3', 'Compilation Error'],
    correctIndex: 1,
    explanation: 'When both operands are integers, C performs integer division and truncates the fractional portion, producing 2.'
  },
  {
    id: 'c-05',
    category: 'C Programming',
    subtopic: 'Pointers',
    difficulty: 'Medium',
    questionText: 'Which operator is known as the "address-of" operator in C?',
    options: ['*', '&', '->', '.'],
    correctIndex: 1,
    explanation: 'The unary & operator retrieves the memory address of its operand, whereas * is the dereference operator.'
  },
  {
    id: 'c-06',
    category: 'C Programming',
    subtopic: 'Arrays',
    difficulty: 'Easy',
    questionText: 'In C, what is the default zero-based starting index for any array?',
    options: ['-1', '0', '1', 'Compiler-dependent'],
    correctIndex: 1,
    explanation: 'C arrays use 0-based indexing; indices for an array of size N range from 0 to N-1.'
  },
  {
    id: 'c-07',
    category: 'C Programming',
    subtopic: 'Memory',
    difficulty: 'Hard',
    questionText: 'Which standard memory allocation function allocates requested memory without zero-initializing it?',
    options: ['calloc()', 'malloc()', 'realloc()', 'free()'],
    correctIndex: 1,
    explanation: 'malloc() allocates raw uninitialized memory holding garbage values; calloc() zeroes out the allocated memory.'
  },
  {
    id: 'c-08',
    category: 'C Programming',
    subtopic: 'Strings',
    difficulty: 'Medium',
    questionText: 'What sentinel character marks the termination of a string in C?',
    options: ["'\\0'", "'\\n'", "'EOF'", "' '"],
    correctIndex: 0,
    explanation: "C strings are null-terminated character sequences ending with '\\0' (ASCII 0)."
  },
  {
    id: 'c-09',
    category: 'C Programming',
    subtopic: 'Control Flow',
    difficulty: 'Medium',
    questionText: 'Which keyword immediately exits from the innermost loop or switch block?',
    options: ['continue', 'exit', 'break', 'return'],
    correctIndex: 2,
    explanation: 'The break statement terminates execution of the innermost enclosing switch or loop.'
  },
  {
    id: 'c-10',
    category: 'C Programming',
    subtopic: 'Functions',
    difficulty: 'Medium',
    questionText: 'What return type is declared for a C function that does not return any value?',
    options: ['null', 'void', 'empty', 'int'],
    correctIndex: 1,
    explanation: 'The void keyword indicates that a function produces no return value.'
  },
  {
    id: 'c-11',
    category: 'C Programming',
    subtopic: 'Preprocessors',
    difficulty: 'Hard',
    questionText: 'Which preprocessor directive is used to define macro replacements and symbolic constants?',
    options: ['#include', '#define', '#pragma', '#macro'],
    correctIndex: 1,
    explanation: '#define creates macro substitutions and symbolic constants evaluated during preprocessing.'
  },
  {
    id: 'c-12',
    category: 'C Programming',
    subtopic: 'Operators',
    difficulty: 'Medium',
    questionText: 'If int x = 5; what will be the value of x after evaluating x += 3 * 2?',
    options: ['16', '11', '13', '10'],
    correctIndex: 1,
    explanation: 'Multiplication (*) has higher precedence than compound assignment (+=). 3 * 2 = 6, and 5 + 6 = 11.'
  },
  {
    id: 'c-13',
    category: 'C Programming',
    subtopic: 'Pointers',
    difficulty: 'Hard',
    questionText: 'What does a pointer assigned to NULL represent in C?',
    options: ['Points to address 0 (safe null sentinel)', 'Random heap memory', 'Stack top pointer', 'Program counter'],
    correctIndex: 0,
    explanation: 'A NULL pointer represents an intentional sentinel value pointing to address 0, meaning it references no valid object.'
  },
  {
    id: 'c-14',
    category: 'C Programming',
    subtopic: 'Structures',
    difficulty: 'Medium',
    questionText: 'Which operator is used to access structure members through a pointer to the structure?',
    options: ['.', '->', '*', '&'],
    correctIndex: 1,
    explanation: 'The arrow operator (->) dereferences the pointer and accesses the member, equivalent to (*ptr).member.'
  },
  {
    id: 'c-15',
    category: 'C Programming',
    subtopic: 'Storage Classes',
    difficulty: 'Hard',
    questionText: 'Which storage class preserves local variable values between function invocations?',
    options: ['auto', 'register', 'static', 'extern'],
    correctIndex: 2,
    explanation: 'Static local variables maintain their persistent value across function calls throughout the program lifetime.'
  },
  {
    id: 'c-16',
    category: 'C Programming',
    subtopic: 'Loops',
    difficulty: 'Easy',
    questionText: 'Which loop is guaranteed to execute its code body at least once?',
    options: ['for loop', 'while loop', 'do-while loop', 'nested loop'],
    correctIndex: 2,
    explanation: 'A do-while loop evaluates its conditional check at the bottom after executing the loop body once.'
  },
  {
    id: 'c-17',
    category: 'C Programming',
    subtopic: 'File I/O',
    difficulty: 'Hard',
    questionText: 'What value does fopen() return when it fails to open the requested file path?',
    options: ['-1', '0', 'NULL', 'EOF'],
    correctIndex: 2,
    explanation: 'When fopen() encounters an error, it returns a NULL pointer to signify failure.'
  },
  {
    id: 'c-18',
    category: 'C Programming',
    subtopic: 'Bitwise Operators',
    difficulty: 'Medium',
    questionText: 'What arithmetic operation does bitwise left shift (x << 1) accomplish on positive integers?',
    options: ['Division by 2', 'Multiplication by 2', 'Modulo by 2', 'Inversion'],
    correctIndex: 1,
    explanation: 'Left shifting bits by 1 position shifts each binary digit up a power of two, multiplying by 2.'
  },
  {
    id: 'c-19',
    category: 'C Programming',
    subtopic: 'Data Types',
    difficulty: 'Easy',
    questionText: 'Which compile-time operator evaluates the storage size in bytes of a data type in C?',
    options: ['length()', 'size()', 'sizeof', 'dim()'],
    correctIndex: 2,
    explanation: 'sizeof is a built-in operator in C that returns the size of an operand in bytes.'
  },
  {
    id: 'c-20',
    category: 'C Programming',
    subtopic: 'Functions',
    difficulty: 'Hard',
    questionText: 'What error occurs when a recursive function fails to hit an exit base case?',
    options: ['Memory fragmentation', 'Stack Overflow', 'Deadlock', 'Buffer Underrun'],
    correctIndex: 1,
    explanation: 'Unchecked recursive calls push activation records onto the call stack continuously until the stack overflows.'
  },

  // --- Computer Fundamentals (20 questions) ---
  {
    id: 'cf-01',
    category: 'Computer Fundamentals',
    subtopic: 'Hardware',
    difficulty: 'Easy',
    questionText: 'Which central component is considered the primary processing "brain" of a computer?',
    options: ['Hard Disk Drive', 'Random Access Memory', 'Central Processing Unit', 'Graphics Card'],
    correctIndex: 2,
    explanation: 'The Central Processing Unit (CPU) executes software instructions and coordinates system resources.'
  },
  {
    id: 'cf-02',
    category: 'Computer Fundamentals',
    subtopic: 'Memory',
    difficulty: 'Easy',
    questionText: 'Which computer memory type is volatile and loses its data immediately upon power outage?',
    options: ['ROM', 'SSD', 'RAM', 'Optical Disk'],
    correctIndex: 2,
    explanation: 'RAM requires active power to sustain stored charge states, making it volatile memory.'
  },
  {
    id: 'cf-03',
    category: 'Computer Fundamentals',
    subtopic: 'Data Representation',
    difficulty: 'Easy',
    questionText: 'How many binary bits make up one standard byte?',
    options: ['4 bits', '8 bits', '16 bits', '32 bits'],
    correctIndex: 1,
    explanation: 'One standard byte consists of 8 binary digits (bits).'
  },
  {
    id: 'cf-04',
    category: 'Computer Fundamentals',
    subtopic: 'Operating Systems',
    difficulty: 'Medium',
    questionText: 'What is the core internal component of an operating system responsible for resource management?',
    options: ['Shell', 'Kernel', 'Compiler', 'BIOS'],
    correctIndex: 1,
    explanation: 'The kernel is the foundational core module mediating access between hardware devices and software processes.'
  },
  {
    id: 'cf-05',
    category: 'Computer Fundamentals',
    subtopic: 'Storage',
    difficulty: 'Easy',
    questionText: 'What does SSD stand for in contemporary computer storage hardware?',
    options: ['Super Speed Disk', 'Solid State Drive', 'Synchronized Storage Device', 'Static System Disk'],
    correctIndex: 1,
    explanation: 'SSD stands for Solid State Drive, utilizing flash-based non-volatile memory without moving mechanical parts.'
  },
  {
    id: 'cf-06',
    category: 'Computer Fundamentals',
    subtopic: 'Networking',
    difficulty: 'Medium',
    questionText: 'What does the Domain Name System (DNS) translate domain names into?',
    options: ['MAC Addresses', 'IP Addresses', 'Port Numbers', 'HTML Code'],
    correctIndex: 1,
    explanation: 'DNS translates user-friendly domain names (like example.com) into machine-routable IP addresses.'
  },
  {
    id: 'cf-07',
    category: 'Computer Fundamentals',
    subtopic: 'Architecture',
    difficulty: 'Hard',
    questionText: 'In computer architecture, what describes the Von Neumann bottleneck?',
    options: [
      'Slow optical mouse polling',
      'Throughput limits between CPU and memory sharing a single bus',
      'Cooling fan physical limitations',
      'Graphics processing rendering latency'
    ],
    correctIndex: 1,
    explanation: 'The Von Neumann bottleneck arises because data transfers and instruction fetches share a single physical bus.'
  },
  {
    id: 'cf-08',
    category: 'Computer Fundamentals',
    subtopic: 'Bootstrapping',
    difficulty: 'Medium',
    questionText: 'What firmware program initiates hardware self-tests and boots the operating system?',
    options: ['Kernel', 'BIOS / UEFI', 'GRUB Loader', 'Virtual Machine'],
    correctIndex: 1,
    explanation: 'BIOS/UEFI initiates POST (Power-On Self-Test) hardware diagnostics and loads the OS bootloader.'
  },
  {
    id: 'cf-09',
    category: 'Computer Fundamentals',
    subtopic: 'OS Concepts',
    difficulty: 'Medium',
    questionText: 'What memory management technique uses secondary drive space to emulate additional RAM?',
    options: ['Virtual Memory', 'Cache Mapping', 'Pipelining', 'Direct Memory Access'],
    correctIndex: 0,
    explanation: 'Virtual memory leverages disk space (paging/swap) to extend available physical RAM addressing space.'
  },
  {
    id: 'cf-10',
    category: 'Computer Fundamentals',
    subtopic: 'CPU',
    difficulty: 'Medium',
    questionText: 'Which sub-unit of the CPU specifically carries out arithmetic and logical evaluations?',
    options: ['Control Unit', 'Arithmetic Logic Unit (ALU)', 'Instruction Register', 'Bus Interface'],
    correctIndex: 1,
    explanation: 'The ALU executes mathematical calculations (addition, subtraction) and Boolean comparisons.'
  },
  {
    id: 'cf-11',
    category: 'Computer Fundamentals',
    subtopic: 'Networking',
    difficulty: 'Easy',
    questionText: 'Which protocol is the standard foundation of the World Wide Web for transferring web documents?',
    options: ['FTP', 'HTTP', 'SMTP', 'SSH'],
    correctIndex: 1,
    explanation: 'HTTP (Hypertext Transfer Protocol) is the foundational application-layer protocol powering web communications.'
  },
  {
    id: 'cf-12',
    category: 'Computer Fundamentals',
    subtopic: 'System Software',
    difficulty: 'Medium',
    questionText: 'What software translates high-level code into machine code prior to program execution?',
    options: ['Interpreter', 'Compiler', 'Debugger', 'Linker'],
    correctIndex: 1,
    explanation: 'A compiler converts an entire high-level program into machine-executable binary ahead of runtime.'
  },
  {
    id: 'cf-13',
    category: 'Computer Fundamentals',
    subtopic: 'Number Systems',
    difficulty: 'Medium',
    questionText: 'What is the base radix of the Hexadecimal numbering system?',
    options: ['8', '10', '16', '32'],
    correctIndex: 2,
    explanation: 'Hexadecimal is a base-16 positional numeral system using characters 0-9 and A-F.'
  },
  {
    id: 'cf-14',
    category: 'Computer Fundamentals',
    subtopic: 'Memory Hierarchy',
    difficulty: 'Medium',
    questionText: 'Which cache level is located closest to CPU processor cores and provides the lowest access latency?',
    options: ['L1 Cache', 'L3 Cache', 'Main DRAM', 'SATA SSD'],
    correctIndex: 0,
    explanation: 'L1 cache is integrated directly within processor cores, delivering the fastest sub-nanosecond access speeds.'
  },
  {
    id: 'cf-15',
    category: 'Computer Fundamentals',
    subtopic: 'OS Management',
    difficulty: 'Hard',
    questionText: 'What condition occurs when two or more processes wait forever for resources locked by each other?',
    options: ['Starvation', 'Race Condition', 'Deadlock', 'Thrashing'],
    correctIndex: 2,
    explanation: 'A deadlock represents mutual circular waiting where none of the processes can proceed.'
  },
  {
    id: 'cf-16',
    category: 'Computer Fundamentals',
    subtopic: 'Input/Output',
    difficulty: 'Medium',
    questionText: 'What feature enables hardware peripherals to transfer data directly to RAM without CPU overhead?',
    options: ['Polling', 'Direct Memory Access (DMA)', 'Interrupt Cascading', 'Bus Mastering'],
    correctIndex: 1,
    explanation: 'DMA lets hardware subsystems access main system memory independently of the primary CPU.'
  },
  {
    id: 'cf-17',
    category: 'Computer Fundamentals',
    subtopic: 'Networks',
    difficulty: 'Easy',
    questionText: 'How many abstraction layers exist in the theoretical standard OSI reference networking model?',
    options: ['4', '5', '7', '8'],
    correctIndex: 2,
    explanation: 'The OSI model comprises 7 layers: Physical, Data Link, Network, Transport, Session, Presentation, Application.'
  },
  {
    id: 'cf-18',
    category: 'Computer Fundamentals',
    subtopic: 'Data Storage',
    difficulty: 'Easy',
    questionText: 'Approximately how many bytes are contained in one Gigabyte (1 GB) in standard SI decimal units?',
    options: ['1,000 bytes', '1,000,000 bytes', '1,000,000,000 bytes', '1,000,000,000,000 bytes'],
    correctIndex: 2,
    explanation: 'In the SI decimal standard, 1 Gigabyte equals 1,000,000,000 (10^9) bytes.'
  },
  {
    id: 'cf-19',
    category: 'Computer Fundamentals',
    subtopic: 'Processes',
    difficulty: 'Medium',
    questionText: 'What is the smallest unit of programmed instructions managed independently by an OS scheduler?',
    options: ['Subroutine', 'Thread', 'Fiber', 'Daemon'],
    correctIndex: 1,
    explanation: 'A thread is the smallest schedulable execution entity within a process sharing the parent process resources.'
  },
  {
    id: 'cf-20',
    category: 'Computer Fundamentals',
    subtopic: 'System Software',
    difficulty: 'Hard',
    questionText: 'Which utility program combines individual compiled object files into a single executable binary?',
    options: ['Loader', 'Linker', 'Preprocessor', 'Assembler'],
    correctIndex: 1,
    explanation: 'The linker resolves cross-module references and bundles object files and libraries into an executable program.'
  },

  // --- Cybersecurity (20 questions) ---
  {
    id: 'cs-01',
    category: 'Cybersecurity',
    subtopic: 'Social Engineering',
    difficulty: 'Easy',
    questionText: 'What deceptive technique tricks individuals into revealing credentials via fraudulent emails?',
    options: ['Spamming', 'Phishing', 'Buffer Overflow', 'Trojan Horse'],
    correctIndex: 1,
    explanation: 'Phishing utilizes deceptive emails pretending to be trustworthy entities to extract sensitive credentials.'
  },
  {
    id: 'cs-02',
    category: 'Cybersecurity',
    subtopic: 'Principles',
    difficulty: 'Medium',
    questionText: 'What three core principles form the cornerstone "CIA Triad" of information security?',
    options: [
      'Control, Inspection, Authorization',
      'Confidentiality, Integrity, Availability',
      'Cryptography, Identity, Authentication',
      'Compliance, Isolation, Audit'
    ],
    correctIndex: 1,
    explanation: 'The CIA Triad stands for Confidentiality, Integrity, and Availability.'
  },
  {
    id: 'cs-03',
    category: 'Cybersecurity',
    subtopic: 'Malware',
    difficulty: 'Medium',
    questionText: 'What type of malware encrypts victim files and demands financial ransom for the decryption key?',
    options: ['Adware', 'Spyware', 'Ransomware', 'Rootkit'],
    correctIndex: 2,
    explanation: 'Ransomware locks or encrypts files on victim machines and blackmails the victim for payment.'
  },
  {
    id: 'cs-04',
    category: 'Cybersecurity',
    subtopic: 'Authentication',
    difficulty: 'Easy',
    questionText: 'What security method requires two distinct verification mechanisms before granting access?',
    options: ['Single Sign-On', 'Two-Factor Authentication (2FA)', 'Hash Verification', 'Biometric Only'],
    correctIndex: 1,
    explanation: 'Two-Factor Authentication (2FA) enhances security by requiring two distinct factors (e.g. password + OTP).'
  },
  {
    id: 'cs-05',
    category: 'Cybersecurity',
    subtopic: 'Attacks',
    difficulty: 'Medium',
    questionText: 'What attack overwhelms online servers with bogus traffic from many compromised zombie devices?',
    options: ['SQL Injection', 'DDoS (Distributed Denial of Service)', 'Cross-Site Scripting', 'Man-in-the-Middle'],
    correctIndex: 1,
    explanation: 'A DDoS attack floods target bandwidth or server resources using distributed botnets to cause downtime.'
  },
  {
    id: 'cs-06',
    category: 'Cybersecurity',
    subtopic: 'Cryptography',
    difficulty: 'Hard',
    questionText: 'In asymmetric public-key cryptography, which key must the owner keep strictly private and secure?',
    options: ['Public Key', 'Private Key', 'Session Ticket', 'Certificate Authority Root'],
    correctIndex: 1,
    explanation: 'The private key decrypts data or signs tokens and must never be exposed or shared with outside parties.'
  },
  {
    id: 'cs-07',
    category: 'Cybersecurity',
    subtopic: 'Firewalls',
    difficulty: 'Easy',
    questionText: 'What network barrier inspects and filters incoming and outgoing traffic based on security rules?',
    options: ['Modem', 'Switch', 'Firewall', 'Repeater'],
    correctIndex: 2,
    explanation: 'A firewall monitors and enforces predefined network security policies on data packet flow.'
  },
  {
    id: 'cs-08',
    category: 'Cybersecurity',
    subtopic: 'Passwords',
    difficulty: 'Medium',
    questionText: 'What cryptographic security process converts passwords into irreversible fixed-length strings?',
    options: ['Compression', 'Hashing', 'Encoding', 'Serialization'],
    correctIndex: 1,
    explanation: 'Cryptographic hashing (e.g., SHA-256, bcrypt) maps variable text into irreversible fixed-length digests.'
  },
  {
    id: 'cs-09',
    category: 'Cybersecurity',
    subtopic: 'Web Security',
    difficulty: 'Hard',
    questionText: 'What vulnerability occurs when unsanitized user input is executed directly inside a database query?',
    options: ['Buffer Overflow', 'SQL Injection (SQLi)', 'Cross-Site Request Forgery', 'DNS Spoofing'],
    correctIndex: 1,
    explanation: 'SQL Injection happens when untrusted user input alters database queries, risking data leaks or tampering.'
  },
  {
    id: 'cs-10',
    category: 'Cybersecurity',
    subtopic: 'Web Security',
    difficulty: 'Hard',
    questionText: 'What web attack injects malicious client-side scripts into viewed pages of unsuspecting users?',
    options: ['XSS (Cross-Site Scripting)', 'ARP Poisoning', 'Clickjacking', 'Zero-Day Exploit'],
    correctIndex: 0,
    explanation: 'Cross-Site Scripting (XSS) injects malicious JavaScript into legitimate web pages rendered by other users.'
  },
  {
    id: 'cs-11',
    category: 'Cybersecurity',
    subtopic: 'Vulnerabilities',
    difficulty: 'Medium',
    questionText: 'What is a software vulnerability that is actively exploited before developers have published a patch?',
    options: ['Legacy Bug', 'Zero-Day Vulnerability', 'Regression Bug', 'Deprecation Leak'],
    correctIndex: 1,
    explanation: 'A zero-day vulnerability is an undisclosed security flaw that attackers exploit before developers can fix it.'
  },
  {
    id: 'cs-12',
    category: 'Cybersecurity',
    subtopic: 'Safe Browsing',
    difficulty: 'Easy',
    questionText: 'What browser address bar indicator signals an encrypted TLS/SSL connection with a website?',
    options: ['Red exclamation mark', 'Padlock icon with "https://"', 'Orange gear symbol', 'Blue download arrow'],
    correctIndex: 1,
    explanation: 'A padlock icon and "https://" signify that communications are protected with TLS/SSL encryption.'
  },
  {
    id: 'cs-13',
    category: 'Cybersecurity',
    subtopic: 'Malware',
    difficulty: 'Medium',
    questionText: 'What malicious software masquerades as legitimate beneficial software to deceive users into installing it?',
    options: ['Worm', 'Trojan Horse', 'Spyware', 'Keylogger'],
    correctIndex: 1,
    explanation: 'Named after the mythological Greek horse, a Trojan hides malicious payloads inside seemingly harmless files.'
  },
  {
    id: 'cs-14',
    category: 'Cybersecurity',
    subtopic: 'Network Security',
    difficulty: 'Medium',
    questionText: 'What does a VPN (Virtual Private Network) do to protect user Internet traffic on public Wi-Fi?',
    options: [
      'Increases hardware processor frequency',
      'Creates an encrypted secure tunnel for data',
      'Removes all computer viruses automatically',
      'Provides limitless battery life'
    ],
    correctIndex: 1,
    explanation: 'A VPN encapsulates and encrypts Internet traffic across untrusted public networks.'
  },
  {
    id: 'cs-15',
    category: 'Cybersecurity',
    subtopic: 'Access Control',
    difficulty: 'Hard',
    questionText: 'What security principle dictates giving users only the minimal permissions necessary for their duties?',
    options: ['Principle of Least Privilege (PoLP)', 'Defense in Depth', 'Fail-Safe Defaults', 'Open Design'],
    correctIndex: 0,
    explanation: 'The Principle of Least Privilege restricts system access rights to the bare minimum required for assigned tasks.'
  },
  {
    id: 'cs-16',
    category: 'Cybersecurity',
    subtopic: 'Attacks',
    difficulty: 'Medium',
    questionText: 'What attack eavesdrops or intercepts communication between two parties without their awareness?',
    options: ['Man-in-the-Middle (MitM)', 'Brute Force', 'Dictionary Attack', 'Phishing'],
    correctIndex: 0,
    explanation: 'In a MitM attack, an unauthorized actor intercepts, relays, or modifies messages between two communicating parties.'
  },
  {
    id: 'cs-17',
    category: 'Cybersecurity',
    subtopic: 'Malware',
    difficulty: 'Medium',
    questionText: 'Which malware monitors and records all keyboard keystrokes to steal passwords and secrets?',
    options: ['Ransomware', 'Keylogger', 'Rootkit', 'Adware'],
    correctIndex: 1,
    explanation: 'A keylogger covertly logs user keystrokes to harvest passwords, banking pins, and confidential data.'
  },
  {
    id: 'cs-18',
    category: 'Cybersecurity',
    subtopic: 'Password Security',
    difficulty: 'Hard',
    questionText: 'What random string is appended to passwords prior to hashing to thwart rainbow table attacks?',
    options: ['Pepper', 'Salt', 'Token', 'Nonce'],
    correctIndex: 1,
    explanation: 'A cryptographic salt is unique random data appended to plaintext passwords before hashing to defeat lookup tables.'
  },
  {
    id: 'cs-19',
    category: 'Cybersecurity',
    subtopic: 'Malware',
    difficulty: 'Medium',
    questionText: 'Unlike viruses, which self-replicating malware spreads across networks without needing a host program?',
    options: ['Worm', 'Macro Virus', 'Boot Sector Virus', 'Adware'],
    correctIndex: 0,
    explanation: 'A computer worm is a standalone malicious program that replicates across networks without human intervention.'
  },
  {
    id: 'cs-20',
    category: 'Cybersecurity',
    subtopic: 'Authentication',
    difficulty: 'Easy',
    questionText: 'Which practice is considered the most secure way to manage multiple complex online passwords?',
    options: [
      'Writing them on sticky notes',
      'Using the same password everywhere',
      'Using a dedicated password manager with master password',
      'Saving them in a plaintext document'
    ],
    correctIndex: 2,
    explanation: 'Password managers store strongly encrypted, unique passwords across sites with a master passphrase.'
  },

  // --- Digital Logic (20 questions) ---
  {
    id: 'dl-01',
    category: 'Digital Logic',
    subtopic: 'Logic Gates',
    difficulty: 'Easy',
    questionText: 'Which basic logic gate produces an output of 1 only when BOTH of its inputs are 1?',
    options: ['OR Gate', 'AND Gate', 'NOT Gate', 'XOR Gate'],
    correctIndex: 1,
    explanation: 'An AND gate outputs HIGH (1) if and only if all of its inputs are HIGH (1).'
  },
  {
    id: 'dl-02',
    category: 'Digital Logic',
    subtopic: 'Logic Gates',
    difficulty: 'Easy',
    questionText: 'What is another common name for the single-input NOT logic gate?',
    options: ['Inverter', 'Amplifier', 'Buffer', 'Multiplexer'],
    correctIndex: 0,
    explanation: 'A NOT gate inverts its binary input (0 becomes 1; 1 becomes 0), hence it is called an inverter.'
  },
  {
    id: 'dl-03',
    category: 'Digital Logic',
    subtopic: 'Number Conversions',
    difficulty: 'Easy',
    questionText: 'What is the binary equivalent of the decimal integer 13?',
    options: ['1101', '1011', '1110', '1001'],
    correctIndex: 0,
    explanation: '13 in binary = 8 + 4 + 0 + 1, which represents binary 1101.'
  },
  {
    id: 'dl-04',
    category: 'Digital Logic',
    subtopic: 'Logic Gates',
    difficulty: 'Medium',
    questionText: 'Which gates are celebrated as "Universal Gates" because any logic function can be constructed from them?',
    options: ['AND and OR', 'NAND and NOR', 'XOR and XNOR', 'NOT and AND'],
    correctIndex: 1,
    explanation: 'NAND and NOR gates are universal gates capable of synthesizing any Boolean logic gate or circuit.'
  },
  {
    id: 'dl-05',
    category: 'Digital Logic',
    subtopic: 'Boolean Algebra',
    difficulty: 'Easy',
    questionText: 'In Boolean algebra, what is the simplified value of the identity expression (A + 0)?',
    options: ['0', '1', 'A', "A'"],
    correctIndex: 2,
    explanation: 'By the Identity Law of Boolean algebra, ORing any variable with 0 yields the variable itself (A + 0 = A).'
  },
  {
    id: 'dl-06',
    category: 'Digital Logic',
    subtopic: 'De Morgan',
    difficulty: 'Medium',
    questionText: "According to De Morgan's Law, what does the expression (A . B)' expand to?",
    options: ["A' + B'", "A' . B'", "A + B", "(A + B)'"],
    correctIndex: 0,
    explanation: "De Morgan's first theorem states: (A . B)' = A' + B' (the complement of a product is the sum of complements)."
  },
  {
    id: 'dl-07',
    category: 'Digital Logic',
    subtopic: 'Logic Gates',
    difficulty: 'Medium',
    questionText: 'What logic gate produces a 1 output when an ODD number of inputs are 1?',
    options: ['AND', 'NOR', 'XOR', 'XNOR'],
    correctIndex: 2,
    explanation: 'The Exclusive-OR (XOR) gate yields true when the count of true inputs is odd.'
  },
  {
    id: 'dl-08',
    category: 'Digital Logic',
    subtopic: 'Complements',
    difficulty: 'Medium',
    questionText: "How is the 2's complement of an 8-bit binary number calculated?",
    options: [
      "Invert all bits and add 1",
      "Subtract 1 from all bits",
      "Reverse the bit order",
      "Multiply by 2"
    ],
    correctIndex: 0,
    explanation: "2's complement is found by taking the 1's complement (inverting all bits) and adding 1 to the result."
  },
  {
    id: 'dl-09',
    category: 'Digital Logic',
    subtopic: 'Boolean Algebra',
    difficulty: 'Easy',
    questionText: "In Boolean algebra, what is the value of the complement law (A . A')?",
    options: ['0', '1', 'A', "A'"],
    correctIndex: 0,
    explanation: "By the Complement Law, a variable ANDed with its own inverse is always false (0)."
  },
  {
    id: 'dl-10',
    category: 'Digital Logic',
    subtopic: 'Truth Tables',
    difficulty: 'Medium',
    questionText: 'How many rows are present in the truth table for a logic circuit with 4 digital input variables?',
    options: ['8', '16', '32', '64'],
    correctIndex: 1,
    explanation: 'For n digital inputs, the truth table requires 2^n input permutations; 2^4 = 16 rows.'
  },
  {
    id: 'dl-11',
    category: 'Digital Logic',
    subtopic: 'Arithmetic Circuits',
    difficulty: 'Medium',
    questionText: 'What combinational circuit adds two 1-bit inputs and produces both Sum and Carry outputs?',
    options: ['Full Adder', 'Half Adder', 'Demultiplexer', 'Flip-Flop'],
    correctIndex: 1,
    explanation: 'A half adder adds two single bits yielding Sum (via XOR) and Carry (via AND).'
  },
  {
    id: 'dl-12',
    category: 'Digital Logic',
    subtopic: 'Arithmetic Circuits',
    difficulty: 'Medium',
    questionText: 'How many input bits does a Full Adder circuit take into account?',
    options: ['2 bits', '3 bits (two inputs + carry-in)', '4 bits', '1 bit'],
    correctIndex: 1,
    explanation: 'A Full Adder accepts three binary inputs: operand A, operand B, and an incoming carry bit (Cin).'
  },
  {
    id: 'dl-13',
    category: 'Digital Logic',
    subtopic: 'Combinational Logic',
    difficulty: 'Hard',
    questionText: 'Which circuit selects one of many analog or digital input signals and forwards it into a single line?',
    options: ['Decoder', 'Encoder', 'Multiplexer (MUX)', 'Flip-Flop'],
    correctIndex: 2,
    explanation: 'A Multiplexer (MUX) is a data selector routing one of several input signals into a single output channel.'
  },
  {
    id: 'dl-14',
    category: 'Digital Logic',
    subtopic: 'Sequential Logic',
    difficulty: 'Hard',
    questionText: 'What is the fundamental 1-bit memory building block used in sequential digital circuits?',
    options: ['Counter', 'Flip-Flop', 'Multiplexer', 'Comparator'],
    correctIndex: 1,
    explanation: 'Flip-flops (bistable multivibrators) are basic electronic circuits storing one bit of state memory.'
  },
  {
    id: 'dl-15',
    category: 'Digital Logic',
    subtopic: 'Boolean Algebra',
    difficulty: 'Medium',
    questionText: "What does the Boolean Idempotent Law state for the expression (A + A)?",
    options: ['A', '2A', '1', '0'],
    correctIndex: 0,
    explanation: 'The Idempotent Law defines that A + A = A and A . A = A.'
  },
  {
    id: 'dl-16',
    category: 'Digital Logic',
    subtopic: 'Number Conversions',
    difficulty: 'Easy',
    questionText: 'What is the decimal equivalent of the binary number 1111?',
    options: ['14', '15', '16', '12'],
    correctIndex: 1,
    explanation: 'Binary 1111 = 8 + 4 + 2 + 1 = 15 in base-10 decimal.'
  },
  {
    id: 'dl-17',
    category: 'Digital Logic',
    subtopic: 'Simplification',
    difficulty: 'Hard',
    questionText: 'What graphical tool is commonly used to simplify Boolean expressions without algebraic manipulation?',
    options: ['Venn Diagram', 'Karnaugh Map (K-Map)', 'Bode Plot', 'State Chart'],
    correctIndex: 1,
    explanation: 'Karnaugh Maps (K-Maps) use Gray code grid groupings to visually simplify Boolean algebraic expressions.'
  },
  {
    id: 'dl-18',
    category: 'Digital Logic',
    subtopic: 'Binary Codes',
    difficulty: 'Hard',
    questionText: 'In which binary code does each successive numeric value differ by only one single bit position?',
    options: ['Excess-3 Code', 'Gray Code', 'BCD (Binary Coded Decimal)', 'ASCII'],
    correctIndex: 1,
    explanation: 'Gray code (reflected binary) is an unweighted code where adjacent values change in exactly one bit position.'
  },
  {
    id: 'dl-19',
    category: 'Digital Logic',
    subtopic: 'Boolean Algebra',
    difficulty: 'Medium',
    questionText: "What is the result of the Boolean Absorption Law expression: A + (A . B)?",
    options: ['B', 'A . B', 'A', '1'],
    correctIndex: 2,
    explanation: 'The Absorption Law dictates that A + (A . B) = A, since A absorbs the conjunction term.'
  },
  {
    id: 'dl-20',
    category: 'Digital Logic',
    subtopic: 'Logic Gates',
    difficulty: 'Easy',
    questionText: 'What logic gate produces a LOW (0) output only when ALL its inputs are HIGH (1)?',
    options: ['NOR Gate', 'NAND Gate', 'XOR Gate', 'OR Gate'],
    correctIndex: 1,
    explanation: 'A NAND gate is an inverted AND gate; it yields 0 only when both inputs are 1.'
  },

  // --- General Knowledge (20 questions) ---
  {
    id: 'gk-01',
    category: 'General Knowledge',
    subtopic: 'Science',
    difficulty: 'Easy',
    questionText: 'Which planet in our solar system is known as the "Red Planet"?',
    options: ['Venus', 'Mars', 'Jupiter', 'Mercury'],
    correctIndex: 1,
    explanation: 'Mars is called the Red Planet because iron oxide on its surface gives it a reddish hue.'
  },
  {
    id: 'gk-02',
    category: 'General Knowledge',
    subtopic: 'Chemistry',
    difficulty: 'Easy',
    questionText: 'What is the chemical formula for ordinary pure water?',
    options: ['CO2', 'H2O', 'NaCl', 'O2'],
    correctIndex: 1,
    explanation: 'Water is composed of two hydrogen atoms covalently bonded to one oxygen atom (H2O).'
  },
  {
    id: 'gk-03',
    category: 'General Knowledge',
    subtopic: 'Geography',
    difficulty: 'Easy',
    questionText: 'What is the largest ocean on Earth by surface area and volume?',
    options: ['Atlantic Ocean', 'Indian Ocean', 'Pacific Ocean', 'Arctic Ocean'],
    correctIndex: 2,
    explanation: 'The Pacific Ocean is the largest and deepest ocean basin on planet Earth.'
  },
  {
    id: 'gk-04',
    category: 'General Knowledge',
    subtopic: 'History',
    difficulty: 'Medium',
    questionText: 'Who is widely celebrated for developing the General Theory of Relativity?',
    options: ['Isaac Newton', 'Albert Einstein', 'Galileo Galilei', 'Niels Bohr'],
    correctIndex: 1,
    explanation: 'Albert Einstein published the General Theory of Relativity in 1915.'
  },
  {
    id: 'gk-05',
    category: 'General Knowledge',
    subtopic: 'Biology',
    difficulty: 'Easy',
    questionText: 'Which organelle is universally referred to as the "powerhouse of the cell"?',
    options: ['Nucleus', 'Ribosome', 'Mitochondria', 'Endoplasmic Reticulum'],
    correctIndex: 2,
    explanation: 'Mitochondria produce the biochemical energy currency of cells known as ATP.'
  },
  {
    id: 'gk-06',
    category: 'General Knowledge',
    subtopic: 'Geography',
    difficulty: 'Medium',
    questionText: 'Which is the longest river in the world according to global geographical consensus?',
    options: ['Amazon River', 'Nile River', 'Yangtze River', 'Mississippi River'],
    correctIndex: 1,
    explanation: 'The Nile River in northeastern Africa is traditionally recognized as the longest river (~6,650 km).'
  },
  {
    id: 'gk-07',
    category: 'General Knowledge',
    subtopic: 'Physics',
    difficulty: 'Medium',
    questionText: 'What is the approximate speed of light in a vacuum?',
    options: ['300,000 km/s', '150,000 km/s', '3,000 km/s', '3,000,000 km/s'],
    correctIndex: 0,
    explanation: 'The speed of light in vacuum is approximately 299,792 km/s (often rounded to 300,000 km/s or 3x10^8 m/s).'
  },
  {
    id: 'gk-08',
    category: 'General Knowledge',
    subtopic: 'Chemistry',
    difficulty: 'Easy',
    questionText: 'What gas do green plants absorb from the atmosphere during photosynthesis?',
    options: ['Oxygen', 'Carbon Dioxide', 'Nitrogen', 'Argon'],
    correctIndex: 1,
    explanation: 'Plants absorb carbon dioxide (CO2) and release oxygen as a byproduct of photosynthesis.'
  },
  {
    id: 'gk-09',
    category: 'General Knowledge',
    subtopic: 'History',
    difficulty: 'Medium',
    questionText: 'In which year did the historic Apollo 11 mission achieve the first human Moon landing?',
    options: ['1965', '1969', '1971', '1975'],
    correctIndex: 1,
    explanation: 'Apollo 11 landed astronauts Neil Armstrong and Buzz Aldrin on the Moon on July 20, 1969.'
  },
  {
    id: 'gk-10',
    category: 'General Knowledge',
    subtopic: 'Geography',
    difficulty: 'Easy',
    questionText: 'What is the capital city of Japan?',
    options: ['Kyoto', 'Tokyo', 'Osaka', 'Hiroshima'],
    correctIndex: 1,
    explanation: 'Tokyo has served as the capital and seat of government of Japan since 1868.'
  },
  {
    id: 'gk-11',
    category: 'General Knowledge',
    subtopic: 'Science',
    difficulty: 'Medium',
    questionText: 'Which element possesses the lowest atomic number (1) in the Periodic Table?',
    options: ['Helium', 'Hydrogen', 'Lithium', 'Carbon'],
    correctIndex: 1,
    explanation: 'Hydrogen has atomic number 1, with an atomic structure containing one single proton.'
  },
  {
    id: 'gk-12',
    category: 'General Knowledge',
    subtopic: 'Mathematics',
    difficulty: 'Easy',
    questionText: 'What is the sum of all interior angles inside a planar triangle?',
    options: ['90 degrees', '180 degrees', '270 degrees', '360 degrees'],
    correctIndex: 1,
    explanation: 'In Euclidean geometry, the three interior angles of any triangle always sum to 180 degrees.'
  },
  {
    id: 'gk-13',
    category: 'General Knowledge',
    subtopic: 'Literature',
    difficulty: 'Medium',
    questionText: 'Who wrote the celebrated dramatic tragedy "Romeo and Juliet"?',
    options: ['Charles Dickens', 'William Shakespeare', 'Jane Austen', 'Mark Twain'],
    correctIndex: 1,
    explanation: 'William Shakespeare penned Romeo and Juliet early in his theatrical career.'
  },
  {
    id: 'gk-14',
    category: 'General Knowledge',
    subtopic: 'Biology',
    difficulty: 'Easy',
    questionText: 'What hard substance makes up the outer protective coating of human teeth?',
    options: ['Keratin', 'Enamel', 'Dentin', 'Bone marrow'],
    correctIndex: 1,
    explanation: 'Tooth enamel is the hardest, most mineralized tissue substance in the human body.'
  },
  {
    id: 'gk-15',
    category: 'General Knowledge',
    subtopic: 'Atmosphere',
    difficulty: 'Medium',
    questionText: 'Which gas is the most abundant element in Earth’s atmospheric air composition?',
    options: ['Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Hydrogen'],
    correctIndex: 1,
    explanation: 'Nitrogen gas accounts for approximately 78% of Earth’s atmosphere by volume.'
  },
  {
    id: 'gk-16',
    category: 'General Knowledge',
    subtopic: 'Geography',
    difficulty: 'Hard',
    questionText: 'Which is the largest hot desert on Earth?',
    options: ['Gobi Desert', 'Kalahari Desert', 'Sahara Desert', 'Arabian Desert'],
    correctIndex: 2,
    explanation: 'The Sahara Desert spans northern Africa and is the largest non-polar hot desert in the world.'
  },
  {
    id: 'gk-17',
    category: 'General Knowledge',
    subtopic: 'Science',
    difficulty: 'Medium',
    questionText: 'What scale measures the relative acidity or alkalinity of an aqueous chemical solution?',
    options: ['Mohs Scale', 'Richter Scale', 'pH Scale', 'Kelvin Scale'],
    correctIndex: 2,
    explanation: 'The pH scale ranges from 0 (highly acidic) to 14 (highly basic), with 7 being neutral.'
  },
  {
    id: 'gk-18',
    category: 'General Knowledge',
    subtopic: 'Everyday Physics',
    difficulty: 'Easy',
    questionText: 'Which fundamental invisible force pulls dropped objects down toward the center of the Earth?',
    options: ['Magnetism', 'Gravity', 'Electrostatic Force', 'Centrifugal Force'],
    correctIndex: 1,
    explanation: 'Gravity is the natural attractive force between masses discovered and formalized by Sir Isaac Newton.'
  },
  {
    id: 'gk-19',
    category: 'General Knowledge',
    subtopic: 'Mathematics',
    difficulty: 'Easy',
    questionText: 'What is the mathematical square root of 144?',
    options: ['10', '11', '12', '14'],
    correctIndex: 2,
    explanation: '12 multiplied by 12 equals 144, making 12 its positive principal square root.'
  },
  {
    id: 'gk-20',
    category: 'General Knowledge',
    subtopic: 'Geography',
    difficulty: 'Hard',
    questionText: 'Which country spans the greatest number of contiguous time zones globally?',
    options: ['Canada', 'United States', 'Russia', 'China'],
    correctIndex: 2,
    explanation: 'Russia spans 11 distinct continuous standard time zones across Europe and Asia.'
  },

  // --- Web Development (20 questions) ---
  {
    id: 'wd-01',
    category: 'Web Development',
    subtopic: 'HTML',
    difficulty: 'Easy',
    questionText: 'What does the acronym HTML stand for in modern web development?',
    options: [
      'Hyper Text Markup Language',
      'High Transfer Machine Language',
      'Hyperlink and Text Model Language',
      'Home Tool Markup Language'
    ],
    correctIndex: 0,
    explanation: 'HTML stands for HyperText Markup Language, the structural standard for web documents.'
  },
  {
    id: 'wd-02',
    category: 'Web Development',
    subtopic: 'CSS',
    difficulty: 'Easy',
    questionText: 'Which CSS property is used to alter the background color of an HTML element?',
    options: ['color', 'background-color', 'bgcolor', 'fill-color'],
    correctIndex: 1,
    explanation: 'The background-color property sets the background tone of any CSS box model container.'
  },
  {
    id: 'wd-03',
    category: 'Web Development',
    subtopic: 'JavaScript',
    difficulty: 'Easy',
    questionText: 'Which modern keyword declares a block-scoped variable that cannot be reassigned in JavaScript?',
    options: ['var', 'let', 'const', 'static'],
    correctIndex: 2,
    explanation: 'The const keyword creates an immutable identifier binding scoped to the enclosing block.'
  },
  {
    id: 'wd-04',
    category: 'Web Development',
    subtopic: 'DOM',
    difficulty: 'Medium',
    questionText: 'What does the DOM represent in browser-based web programming?',
    options: [
      'Document Object Model',
      'Data Operation Mechanism',
      'Digital Output Medium',
      'Dynamic Online Module'
    ],
    correctIndex: 0,
    explanation: 'The Document Object Model (DOM) is an object-oriented structural representation of HTML documents.'
  },
  {
    id: 'wd-05',
    category: 'Web Development',
    subtopic: 'HTML',
    difficulty: 'Easy',
    questionText: 'Which HTML tag creates a clickable hyperlink to another web page?',
    options: ['<link>', '<a>', '<href>', '<url>'],
    correctIndex: 1,
    explanation: 'The anchor tag <a> along with the href attribute defines hyperlinks in HTML.'
  },
  {
    id: 'wd-06',
    category: 'Web Development',
    subtopic: 'CSS',
    difficulty: 'Medium',
    questionText: 'What CSS layout module is explicitly designed for one-dimensional row OR column layouts?',
    options: ['CSS Grid', 'Flexbox', 'Floats', 'Absolute Positioning'],
    correctIndex: 1,
    explanation: 'Flexbox (Flexible Box Layout) is designed for 1-dimensional layouts; CSS Grid is for 2-dimensional grids.'
  },
  {
    id: 'wd-07',
    category: 'Web Development',
    subtopic: 'JavaScript',
    difficulty: 'Medium',
    questionText: 'What will typeof null evaluate to in standard JavaScript engines?',
    options: ['"null"', '"undefined"', '"object"', '"boolean"'],
    correctIndex: 2,
    explanation: 'Due to a historical legacy bug in JavaScript since its origin, typeof null yields "object".'
  },
  {
    id: 'wd-08',
    category: 'Web Development',
    subtopic: 'CSS',
    difficulty: 'Easy',
    questionText: 'In the CSS Box Model, which layer is situated immediately outside the padding?',
    options: ['Content', 'Border', 'Margin', 'Outline'],
    correctIndex: 1,
    explanation: 'The box model layers from inside out are: Content -> Padding -> Border -> Margin.'
  },
  {
    id: 'wd-09',
    category: 'Web Development',
    subtopic: 'Responsive Design',
    difficulty: 'Medium',
    questionText: 'Which CSS technique applies styling rules conditionally based on device screen widths?',
    options: ['Media Queries', 'Keyframe Animations', 'CSS Transforms', 'Attribute Selectors'],
    correctIndex: 0,
    explanation: 'Media queries (@media) inspect viewport dimensions and adapt layouts for mobile, tablet, and desktop.'
  },
  {
    id: 'wd-10',
    category: 'Web Development',
    subtopic: 'JavaScript',
    difficulty: 'Medium',
    questionText: 'Which equality operator checks for equality of BOTH value and data type without coercion?',
    options: ['==', '===', '=', '!='],
    correctIndex: 1,
    explanation: 'The strict equality operator (===) verifies that both operands share the same type and equivalent values.'
  },
  {
    id: 'wd-11',
    category: 'Web Development',
    subtopic: 'HTTP',
    difficulty: 'Medium',
    questionText: 'Which HTTP response status code signifies that a requested URL could not be found?',
    options: ['200', '301', '404', '500'],
    correctIndex: 2,
    explanation: 'HTTP 404 Not Found indicates that the server cannot locate the requested resource.'
  },
  {
    id: 'wd-12',
    category: 'Web Development',
    subtopic: 'HTML5',
    difficulty: 'Easy',
    questionText: 'Which HTML5 semantic element is intended for autonomous, self-contained syndicatable content?',
    options: ['<div>', '<article>', '<span>', '<aside>'],
    correctIndex: 1,
    explanation: 'The <article> tag is intended to represent a standalone, independently distributable composition.'
  },
  {
    id: 'wd-13',
    category: 'Web Development',
    subtopic: 'Web Storage',
    difficulty: 'Medium',
    questionText: 'How long does data persisted inside browser localStorage stay preserved by default?',
    options: [
      'Until the browser tab closes',
      'For 24 hours',
      'Indefinitely until explicitly cleared by user or script',
      'Until device reboot'
    ],
    correctIndex: 2,
    explanation: 'localStorage retains saved key-value data with no expiration time until manually or programmatically erased.'
  },
  {
    id: 'wd-14',
    category: 'Web Development',
    subtopic: 'JavaScript',
    difficulty: 'Hard',
    questionText: 'What term describes a JavaScript function bundled with references to its surrounding lexical environment?',
    options: ['Callback', 'Closure', 'Generator', 'Promise'],
    correctIndex: 1,
    explanation: 'A closure gives a function persistent access to variables from its outer lexical scope even after that scope has returned.'
  },
  {
    id: 'wd-15',
    category: 'Web Development',
    subtopic: 'CSS',
    difficulty: 'Medium',
    questionText: 'What is the default display property value for standard <div> elements in HTML?',
    options: ['inline', 'block', 'inline-block', 'flex'],
    correctIndex: 1,
    explanation: 'A <div> is by default a block-level container occupying the full available width of its parent.'
  },
  {
    id: 'wd-16',
    category: 'Web Development',
    subtopic: 'JavaScript Async',
    difficulty: 'Medium',
    questionText: 'What keyword can only be used inside an async function to pause until a Promise settles?',
    options: ['defer', 'wait', 'await', 'yield'],
    correctIndex: 2,
    explanation: 'The await expression pauses execution within an async function until the target Promise is fulfilled or rejected.'
  },
  {
    id: 'wd-17',
    category: 'Web Development',
    subtopic: 'HTML',
    difficulty: 'Easy',
    questionText: 'Which HTML attribute provides alternative descriptive text for screen readers when images fail to load?',
    options: ['title', 'alt', 'desc', 'caption'],
    correctIndex: 1,
    explanation: 'The alt attribute furnishes assistive text descriptions and acts as fallback if images fail to load.'
  },
  {
    id: 'wd-18',
    category: 'Web Development',
    subtopic: 'DOM',
    difficulty: 'Medium',
    questionText: 'Which JavaScript method attaches an event handler function to a designated DOM node?',
    options: ['addEventListener()', 'attachEvent()', 'listen()', 'bindEvent()'],
    correctIndex: 0,
    explanation: 'addEventListener() registers an event listener callback on an EventTarget without overwriting existing listeners.'
  },
  {
    id: 'wd-19',
    category: 'Web Development',
    subtopic: 'Web Concepts',
    difficulty: 'Medium',
    questionText: 'What does JSON stand for in data exchange protocols?',
    options: [
      'JavaScript Object Notation',
      'Java System Output Network',
      'Joined Script Online Name',
      'JavaScript Organized Numbers'
    ],
    correctIndex: 0,
    explanation: 'JSON stands for JavaScript Object Notation, a ubiquitous lightweight text format for structured data interchange.'
  },
  {
    id: 'wd-20',
    category: 'Web Development',
    subtopic: 'CSS',
    difficulty: 'Hard',
    questionText: 'Which CSS selector has the highest specificity weight in CSS calculation rules?',
    options: [
      'Element selector (div)',
      'Class selector (.menu)',
      'ID selector (#navbar)',
      'Universal selector (*)'
    ],
    correctIndex: 2,
    explanation: 'ID selectors carry a specificity weight of (0, 1, 0, 0), overriding class selectors (0, 0, 1, 0) and tags (0, 0, 0, 1).'
  }
];

export const READY_QUIZZES: QuizMeta[] = [
  {
    id: 'quiz-c-basics',
    title: 'C Programming Essentials',
    description: 'Master core C syntax, format specifiers, operators, loops, and memory fundamentals.',
    category: 'C Programming',
    difficulty: 'Easy',
    estimatedMinutes: 8,
    icon: 'Code2'
  },
  {
    id: 'quiz-c-advanced',
    title: 'C Pointers & Memory Management',
    description: 'Deep dive into pointers, dynamic allocation (malloc/calloc), structures, and recursion.',
    category: 'C Programming',
    difficulty: 'Hard',
    estimatedMinutes: 12,
    icon: 'Terminal'
  },
  {
    id: 'quiz-cf-intro',
    title: 'Computer Fundamentals: Core Concepts',
    description: 'Test your understanding of CPUs, RAM, storage devices, and binary representations.',
    category: 'Computer Fundamentals',
    difficulty: 'Easy',
    estimatedMinutes: 7,
    icon: 'Cpu'
  },
  {
    id: 'quiz-cf-os',
    title: 'Operating Systems & Architecture',
    description: 'Explore kernels, virtual memory, threads, deadlocks, and the Von Neumann model.',
    category: 'Computer Fundamentals',
    difficulty: 'Hard',
    estimatedMinutes: 10,
    icon: 'Zap'
  },
  {
    id: 'quiz-sec-basics',
    title: 'Cybersecurity & Online Safety',
    description: 'Learn to identify phishing, malware types, strong passwords, and 2FA protection.',
    category: 'Cybersecurity',
    difficulty: 'Easy',
    estimatedMinutes: 8,
    icon: 'ShieldCheck'
  },
  {
    id: 'quiz-sec-crypto',
    title: 'Network Defense & Web Security',
    description: 'Investigate DDoS, XSS, SQL Injection, cryptographic salts, and public-key cryptography.',
    category: 'Cybersecurity',
    difficulty: 'Hard',
    estimatedMinutes: 12,
    icon: 'ShieldCheck'
  },
  {
    id: 'quiz-dl-gates',
    title: 'Digital Logic & Gate Fundamentals',
    description: 'Practice AND, OR, NOT, NAND, NOR, and XOR truth tables and binary conversions.',
    category: 'Digital Logic',
    difficulty: 'Easy',
    estimatedMinutes: 8,
    icon: 'Zap'
  },
  {
    id: 'quiz-dl-boolean',
    title: 'Boolean Algebra & Arithmetic Circuits',
    description: "Tackle De Morgan's laws, Karnaugh maps, Adders, and Multiplexers.",
    category: 'Digital Logic',
    difficulty: 'Medium',
    estimatedMinutes: 10,
    icon: 'Cpu'
  },
  {
    id: 'quiz-gk-general',
    title: 'World Science & General Knowledge',
    description: 'Explore astronomy, chemistry, geography, physics, and world history.',
    category: 'General Knowledge',
    difficulty: 'Easy',
    estimatedMinutes: 6,
    icon: 'Compass'
  },
  {
    id: 'quiz-gk-math-sci',
    title: 'Scientific Discoveries & Earth Geography',
    description: 'Engage with periodic elements, mathematics, famous authors, and world time zones.',
    category: 'General Knowledge',
    difficulty: 'Medium',
    estimatedMinutes: 9,
    icon: 'BookOpen'
  },
  {
    id: 'quiz-wd-html-css',
    title: 'Web Dev: HTML5 & Modern CSS',
    description: 'Test your understanding of semantic markup, Flexbox, the CSS Box Model, and media queries.',
    category: 'Web Development',
    difficulty: 'Easy',
    estimatedMinutes: 8,
    icon: 'Globe'
  },
  {
    id: 'quiz-wd-js',
    title: 'JavaScript Essentials & DOM APIs',
    description: 'Master JS data types, strict equality, async/await, closures, and local storage.',
    category: 'Web Development',
    difficulty: 'Medium',
    estimatedMinutes: 10,
    icon: 'Globe'
  }
];

// Sample Leaderboard Cohort (Simulated demonstration data)
interface LeaderboardEntry {
  id: string;
  name: string;
  avatarSeed: string;
  quizzesCompleted: number;
  avgScore: number;
  topCategory: Category;
  badge: string;
}

const SAMPLE_LEADERBOARD: LeaderboardEntry[] = [
  { id: 'lb-1', name: 'Aarav Sharma', avatarSeed: 'AS', quizzesCompleted: 18, avgScore: 94, topCategory: 'C Programming', badge: 'Diamond' },
  { id: 'lb-2', name: 'Priya Patel', avatarSeed: 'PP', quizzesCompleted: 15, avgScore: 91, topCategory: 'Cybersecurity', badge: 'Diamond' },
  { id: 'lb-3', name: 'Rohan Deshmukh', avatarSeed: 'RD', quizzesCompleted: 14, avgScore: 88, topCategory: 'Digital Logic', badge: 'Gold' },
  { id: 'lb-4', name: 'Sneha Reddy', avatarSeed: 'SR', quizzesCompleted: 12, avgScore: 86, topCategory: 'Web Development', badge: 'Gold' },
  { id: 'lb-5', name: 'Vikram Mehta', avatarSeed: 'VM', quizzesCompleted: 10, avgScore: 84, topCategory: 'Computer Fundamentals', badge: 'Silver' },
  { id: 'lb-6', name: 'Ananya Verma', avatarSeed: 'AV', quizzesCompleted: 9, avgScore: 82, topCategory: 'General Knowledge', badge: 'Silver' },
  { id: 'lb-7', name: 'Devendra Joshi', avatarSeed: 'DJ', quizzesCompleted: 8, avgScore: 78, topCategory: 'C Programming', badge: 'Bronze' }
];

const STORAGE_KEYS = {
  HISTORY: 'quizmaster_history_v2',
  PROFILE: 'quizmaster_profile_v2'
};

const DEFAULT_PROFILE: UserProfile = {
  name: 'Abhinav Athnere',
  theme: 'light',
  soundEnabled: true,
  studentName: 'Abhinav Athnere',
  collegeName: 'Madhav Institute of Technology & Science',
  branch: 'Computer Science & Engineering',
  projectTitle: 'QuizMaster — Smart Educational Quiz Engine'
};

function loadStoredProfile(): UserProfile {
  try {
    const item = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (item) {
      const parsed = JSON.parse(item);
      // Migrate previously saved local storage placeholders to current credentials
      if (parsed.studentName === 'Alex Mercer') {
        parsed.studentName = 'Abhinav Athnere';
        if (parsed.name === 'Alex Mercer') parsed.name = 'Abhinav Athnere';
      }
      if (parsed.collegeName === 'Apex Institute of Technology') {
        parsed.collegeName = 'Madhav Institute of Technology & Science';
      }
      return { ...DEFAULT_PROFILE, ...parsed };
    }
  } catch (err) {
    console.error('Failed to load profile', err);
  }
  return DEFAULT_PROFILE;
}

function saveStoredProfile(profile: UserProfile) {
  try {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  } catch (err) {
    console.error('Failed to save profile', err);
  }
}

function loadStoredHistory(): QuizAttemptRecord[] {
  try {
    const item = localStorage.getItem(STORAGE_KEYS.HISTORY);
    if (item) {
      const parsed = JSON.parse(item);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.error('Failed to load history', err);
  }
  return [];
}

function saveStoredHistory(records: QuizAttemptRecord[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(records));
  } catch (err) {
    console.error('Failed to save history', err);
  }
}

// Sound effects synthesizer using Web Audio API (No external sound files required)
function playBeep(type: 'select' | 'submit' | 'alert' | 'complete', enabled: boolean) {
  if (!enabled) return;
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;
    if (type === 'select') {
      osc.frequency.setValueAtTime(580, now);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === 'submit') {
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
      osc.start(now);
      osc.stop(now + 0.16);
    } else if (type === 'alert') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.linearRampToValueAtTime(240, now + 0.2);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      osc.start(now);
      osc.stop(now + 0.22);
    } else if (type === 'complete') {
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.setValueAtTime(659.25, now + 0.1);
      osc.frequency.setValueAtTime(783.99, now + 0.2);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      osc.start(now);
      osc.stop(now + 0.4);
    }
  } catch {
    // Audio contexts may be blocked by browser policy prior to gesture
  }
}

// Utility: Fisher-Yates array shuffle
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Prepare randomized quiz questions with shuffled options while tracking correct index
function prepareShuffledQuiz(category: Category, count: number): Question[] {
  const matching = QUESTION_BANK.filter(q => q.category === category);
  const pool = matching.length >= count ? matching : QUESTION_BANK;
  const picked = shuffleArray(pool).slice(0, count);

  return picked.map(q => {
    const originalCorrectOption = q.options[q.correctIndex];
    const shuffledOpts = shuffleArray(q.options);
    const newCorrectIdx = shuffledOpts.indexOf(originalCorrectOption);
    return {
      ...q,
      options: shuffledOpts,
      correctIndex: newCorrectIdx
    };
  });
}

export default function App() {
  // Navigation Routing States
  // 'home' | 'dashboard' | 'explore' | 'instructions' | 'quiz' | 'results' | 'review' | 'leaderboard' | 'progress' | 'profile' | 'about'
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // User Profile & Settings
  const [profile, setProfile] = useState<UserProfile>(loadStoredProfile);
  const [history, setHistory] = useState<QuizAttemptRecord[]>(loadStoredHistory);

  // Active Quiz Flow States
  const [selectedQuizMeta, setSelectedQuizMeta] = useState<QuizMeta>(READY_QUIZZES[0]);
  const [questionCountChoice, setQuestionCountChoice] = useState<number>(10);
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [markedForReview, setMarkedForReview] = useState<Record<number, boolean>>({});
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState<number>(600);
  const [initialTimeSeconds, setInitialTimeSeconds] = useState<number>(600);
  const [quizStartTime, setQuizStartTime] = useState<number>(0);
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);
  const [lastCompletedAttempt, setLastCompletedAttempt] = useState<QuizAttemptRecord | null>(null);

  // Explore Filter States
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('All');
  const [selectedDifficultyFilter, setSelectedDifficultyFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'title' | 'difficulty' | 'time'>('title');

  // Confirmation Modals for settings
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });

  // Apply Theme to DOM
  useEffect(() => {
    saveStoredProfile(profile);
  }, [profile]);

  useEffect(() => {
    saveStoredHistory(history);
  }, [history]);

  // Sync dark class on body
  const isDark = profile.theme === 'dark';

  useEffect(() => {
    if (currentPage !== 'quiz') return;

    if (timeRemainingSeconds <= 0) {
      handleFinalSubmit(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeRemainingSeconds(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinalSubmit(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentPage, timeRemainingSeconds]);

  // Keyboard navigation support for active quiz
  useEffect(() => {
    if (currentPage !== 'quiz') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // 1, 2, 3, 4 for options
      if (['1', '2', '3', '4'].includes(e.key)) {
        const optionIdx = parseInt(e.key, 10) - 1;
        handleSelectOption(optionIdx);
      } else if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'n') {
        if (currentQuestionIdx < activeQuestions.length - 1) {
          setCurrentQuestionIdx(prev => prev + 1);
        }
      } else if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'p') {
        if (currentQuestionIdx > 0) {
          setCurrentQuestionIdx(prev => prev - 1);
        }
      } else if (e.key.toLowerCase() === 'm') {
        toggleMarkForReview();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, currentQuestionIdx, activeQuestions.length, userAnswers]);

  const startQuizFlow = (meta: QuizMeta) => {
    setSelectedQuizMeta(meta);
    setQuestionCountChoice(10);
    setCurrentPage('instructions');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const launchInteractiveQuiz = () => {
    const questions = prepareShuffledQuiz(selectedQuizMeta.category, questionCountChoice);
    const allocatedTime = questionCountChoice * 60; // 60 seconds per question
    setActiveQuestions(questions);
    setCurrentQuestionIdx(0);
    setUserAnswers({});
    setMarkedForReview({});
    setTimeRemainingSeconds(allocatedTime);
    setInitialTimeSeconds(allocatedTime);
    setQuizStartTime(Date.now());
    setCurrentPage('quiz');
    playBeep('select', profile.soundEnabled);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectOption = (optIndex: number) => {
    setUserAnswers(prev => ({
      ...prev,
      [currentQuestionIdx]: optIndex
    }));
    playBeep('select', profile.soundEnabled);
  };

  const clearCurrentAnswer = () => {
    setUserAnswers(prev => {
      const updated = { ...prev };
      delete updated[currentQuestionIdx];
      return updated;
    });
  };

  const toggleMarkForReview = () => {
    setMarkedForReview(prev => ({
      ...prev,
      [currentQuestionIdx]: !prev[currentQuestionIdx]
    }));
  };

  const handleFinalSubmit = (autoExpired = false) => {
    setShowSubmitModal(false);
    const total = activeQuestions.length;
    let correct = 0;
    let incorrect = 0;
    let unanswered = 0;

    activeQuestions.forEach((q, idx) => {
      const userChoice = userAnswers[idx];
      if (userChoice === undefined) {
        unanswered++;
      } else if (userChoice === q.correctIndex) {
        correct++;
      } else {
        incorrect++;
      }
    });

    const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
    const timeSpent = Math.max(1, Math.floor((Date.now() - quizStartTime) / 1000));

    const record: QuizAttemptRecord = {
      id: 'attempt-' + Date.now(),
      quizId: selectedQuizMeta.id,
      quizTitle: selectedQuizMeta.title,
      category: selectedQuizMeta.category,
      totalQuestions: total,
      correctAnswers: correct,
      incorrectAnswers: incorrect,
      unanswered: unanswered,
      scorePercentage: percentage,
      timeSpentSeconds: Math.min(timeSpent, initialTimeSeconds),
      timestamp: Date.now(),
      userAnswers: { ...userAnswers },
      shuffledQuestions: [...activeQuestions]
    };

    setHistory(prev => [record, ...prev]);
    setLastCompletedAttempt(record);
    setCurrentPage('results');
    playBeep('complete', profile.soundEnabled);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRetakeQuiz = () => {
    launchInteractiveQuiz();
  };

  const analytics = useMemo(() => {
    if (history.length === 0) {
      return {
        totalQuizzes: 0,
        avgScore: 0,
        bestScore: 0,
        totalQuestionsAnswered: 0,
        categoryBreakdown: {} as Record<Category, { attempts: number; avgScore: number }>,
        weakTopics: [] as string[]
      };
    }

    const totalQuizzes = history.length;
    const scoreSum = history.reduce((sum, h) => sum + h.scorePercentage, 0);
    const avgScore = Math.round(scoreSum / totalQuizzes);
    const bestScore = Math.max(...history.map(h => h.scorePercentage));
    const totalQuestionsAnswered = history.reduce((sum, h) => sum + (h.correctAnswers + h.incorrectAnswers), 0);

    // Category breakdown
    const catStats: Record<string, { totalScore: number; count: number }> = {};
    const subtopicMissCount: Record<string, number> = {};

    history.forEach(att => {
      if (!catStats[att.category]) {
        catStats[att.category] = { totalScore: 0, count: 0 };
      }
      catStats[att.category].totalScore += att.scorePercentage;
      catStats[att.category].count += 1;

      // Track weak subtopics from missed questions
      att.shuffledQuestions.forEach((q, idx) => {
        const choice = att.userAnswers[idx];
        if (choice === undefined || choice !== q.correctIndex) {
          subtopicMissCount[q.subtopic] = (subtopicMissCount[q.subtopic] || 0) + 1;
        }
      });
    });

    const categoryBreakdown: Record<string, { attempts: number; avgScore: number }> = {};
    Object.keys(catStats).forEach(c => {
      categoryBreakdown[c] = {
        attempts: catStats[c].count,
        avgScore: Math.round(catStats[c].totalScore / catStats[c].count)
      };
    });

    // Top weak subtopics
    const weakTopics = Object.entries(subtopicMissCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([topic]) => topic);

    return {
      totalQuizzes,
      avgScore,
      bestScore,
      totalQuestionsAnswered,
      categoryBreakdown,
      weakTopics
    };
  }, [history]);

  const filteredQuizzes = useMemo(() => {
    return READY_QUIZZES.filter(quiz => {
      const matchesSearch = quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            quiz.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            quiz.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategoryFilter === 'All' || quiz.category === selectedCategoryFilter;
      const matchesDifficulty = selectedDifficultyFilter === 'All' || quiz.difficulty === selectedDifficultyFilter;
      return matchesSearch && matchesCategory && matchesDifficulty;
    }).sort((a, b) => {
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      if (sortBy === 'difficulty') {
        const order: Record<Difficulty, number> = { Easy: 1, Medium: 2, Hard: 3 };
        return order[a.difficulty] - order[b.difficulty];
      }
      if (sortBy === 'time') return a.estimatedMinutes - b.estimatedMinutes;
      return 0;
    });
  }, [searchQuery, selectedCategoryFilter, selectedDifficultyFilter, sortBy]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const getDifficultyBadge = (diff: Difficulty) => {
    switch (diff) {
      case 'Easy':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">Easy</span>;
      case 'Medium':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">Medium</span>;
      case 'Hard':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300">Hard</span>;
    }
  };

  const getCategoryIcon = (cat: Category) => {
    switch (cat) {
      case 'C Programming': return <Code2 className="w-5 h-5 text-indigo-500" />;
      case 'Computer Fundamentals': return <Cpu className="w-5 h-5 text-blue-500" />;
      case 'Cybersecurity': return <ShieldCheck className="w-5 h-5 text-purple-500" />;
      case 'Digital Logic': return <Zap className="w-5 h-5 text-amber-500" />;
      case 'General Knowledge': return <Compass className="w-5 h-5 text-emerald-500" />;
      case 'Web Development': return <Globe className="w-5 h-5 text-cyan-500" />;
    }
  };

  const renderNavbar = () => (
    <header className="sticky top-0 z-40 w-full border-b backdrop-blur-md transition-colors duration-200 border-slate-200/80 bg-white/90 dark:border-slate-800 dark:bg-slate-900/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            onClick={() => { setCurrentPage('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent dark:from-indigo-400 dark:to-purple-400">
                QuizMaster
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs font-medium px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300">
                College Edition
              </span>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            <button
              onClick={() => setCurrentPage('home')}
              className={`px-3 py-2 rounded-lg transition-colors ${currentPage === 'home' ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 dark:text-indigo-400 font-semibold' : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'}`}
            >
              Home
            </button>
            <button
              onClick={() => setCurrentPage('dashboard')}
              className={`px-3 py-2 rounded-lg transition-colors ${currentPage === 'dashboard' ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 dark:text-indigo-400 font-semibold' : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'}`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setCurrentPage('explore')}
              className={`px-3 py-2 rounded-lg transition-colors ${currentPage === 'explore' ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 dark:text-indigo-400 font-semibold' : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'}`}
            >
              Explore Quizzes
            </button>
            <button
              onClick={() => setCurrentPage('leaderboard')}
              className={`px-3 py-2 rounded-lg transition-colors ${currentPage === 'leaderboard' ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 dark:text-indigo-400 font-semibold' : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'}`}
            >
              Leaderboard
            </button>
            <button
              onClick={() => setCurrentPage('progress')}
              className={`px-3 py-2 rounded-lg transition-colors ${currentPage === 'progress' ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 dark:text-indigo-400 font-semibold' : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'}`}
            >
              My Progress
            </button>
            <button
              onClick={() => setCurrentPage('about')}
              className={`px-3 py-2 rounded-lg transition-colors ${currentPage === 'about' ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 dark:text-indigo-400 font-semibold' : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'}`}
            >
              About
            </button>
          </nav>

          {/* Quick Action & Theme Controls */}
          <div className="flex items-center gap-2">
            <button
              title={profile.theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              onClick={() => setProfile(p => ({ ...p, theme: p.theme === 'dark' ? 'light' : 'dark' }))}
              className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
            >
              {profile.theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            <button
              title={profile.soundEnabled ? 'Mute Sounds' : 'Enable Sounds'}
              onClick={() => {
                const updated = !profile.soundEnabled;
                setProfile(p => ({ ...p, soundEnabled: updated }));
                if (updated) playBeep('select', true);
              }}
              className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
            >
              {profile.soundEnabled ? <Volume2 className="w-4 h-4 text-indigo-500" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
            </button>

            <button
              onClick={() => setCurrentPage('profile')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors ${currentPage === 'profile' ? 'bg-indigo-600 text-white border-indigo-600' : 'border-slate-200 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800'}`}
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:inline-block max-w-[100px] truncate">{profile.name}</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
            >
              <ArrowUpDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-1">
            {[
              { id: 'home', label: 'Home' },
              { id: 'dashboard', label: 'Dashboard' },
              { id: 'explore', label: 'Explore Quizzes' },
              { id: 'leaderboard', label: 'Leaderboard' },
              { id: 'progress', label: 'My Progress' },
              { id: 'profile', label: 'Profile & Settings' },
              { id: 'about', label: 'About Project' },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentPage(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`text-left px-3 py-2 rounded-md text-sm font-medium ${currentPage === item.id ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400 font-semibold' : 'text-slate-600 dark:text-slate-300'}`}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );

  const renderHomePage = () => {
    const totalQuestionsCount = QUESTION_BANK.length;
    const totalQuizzesCount = READY_QUIZZES.length;

    return (
      <div className="space-y-16 py-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 text-white p-8 sm:p-14 shadow-2xl">
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs sm:text-sm font-medium text-indigo-200">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Smart Local Computer Science & Engineering Learning Platform</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              Challenge Your Mind. <br />
              <span className="bg-gradient-to-r from-blue-300 via-indigo-200 to-purple-300 bg-clip-text text-transparent">
                Test Your Knowledge.
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-indigo-100/90 leading-relaxed max-w-2xl">
              An offline-first, client-powered quiz testing suite designed for first-year engineering students. Practice C Programming, Computer Architecture, Cybersecurity, Digital Logic, and Web Technologies with real-time analytics.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => {
                  startQuizFlow(READY_QUIZZES[0]);
                }}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold shadow-lg shadow-indigo-500/30 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>Start Learning Now</span>
              </button>

              <button
                onClick={() => setCurrentPage('explore')}
                className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold backdrop-blur-md transition-all flex items-center gap-2"
              >
                <Compass className="w-5 h-5" />
                <span>Explore All Quizzes</span>
              </button>
            </div>
          </div>
        </div>

        {/* Live Fact-Based Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-sm text-center">
            <div className="text-3xl sm:text-4xl font-extrabold text-indigo-600 dark:text-indigo-400">
              {totalQuestionsCount}+
            </div>
            <div className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
              Verified Technical Questions
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-sm text-center">
            <div className="text-3xl sm:text-4xl font-extrabold text-blue-600 dark:text-blue-400">
              {totalQuizzesCount}
            </div>
            <div className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
              Ready-to-Play Modules
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-sm text-center">
            <div className="text-3xl sm:text-4xl font-extrabold text-purple-600 dark:text-purple-400">
              6
            </div>
            <div className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
              Curated Core Subjects
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-sm text-center">
            <div className="text-3xl sm:text-4xl font-extrabold text-emerald-600 dark:text-emerald-400">
              {history.length}
            </div>
            <div className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
              Locally Saved Attempts
            </div>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Engineered For Active Learning
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mt-2 text-sm sm:text-base">
              Designed with cognitive retention principles, immediate explanations, and persistent progress analytics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-lg text-slate-900 dark:text-white">Interactive Quizzes</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                Shuffled answer choices, question palettes, mark for review, and keyboard shortcuts.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-lg text-slate-900 dark:text-white">Instant Results</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                Detailed score ring breakdowns, elapsed time analysis, and complete question reviews.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/70 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-lg text-slate-900 dark:text-white">Progress Tracking</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                Category accuracy gauges, score trend visualizations, and weak topic identification.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-lg text-slate-900 dark:text-white">Multiple Categories</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                120+ verified technical questions spanning C, OS, Networking, Logic Gates, and Security.
              </p>
            </div>
          </div>
        </div>

        {/* Featured Quizzes Carousel / Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Featured Quizzes</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Recommended starting points for first-year coursework</p>
            </div>
            <button
              onClick={() => setCurrentPage('explore')}
              className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <span>View All 12</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {READY_QUIZZES.slice(0, 3).map(quiz => (
              <div
                key={quiz.id}
                className="group p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-400 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                      {getCategoryIcon(quiz.category)}
                    </span>
                    {getDifficultyBadge(quiz.difficulty)}
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {quiz.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 line-clamp-2">
                    {quiz.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>~{quiz.estimatedMinutes} mins</span>
                  </div>
                  <button
                    onClick={() => startQuizFlow(quiz)}
                    className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-colors"
                  >
                    Start Quiz
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <footer className="pt-12 border-t border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-sm">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <span className="font-bold text-slate-900 dark:text-white">QuizMaster</span>
              </div>
              <p className="text-xs leading-relaxed">
                Smart Offline-First Educational Quiz Engine designed for university examinations and self-paced technical learning.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-2 text-xs uppercase tracking-wider">Features</h4>
              <ul className="space-y-1.5 text-xs">
                <li>Dynamic Question Randomization</li>
                <li>Instant Review & Explanations</li>
                <li>Real LocalStorage Persistence</li>
                <li>Keyboard Quiz Shortcuts</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-2 text-xs uppercase tracking-wider">Curriculum</h4>
              <ul className="space-y-1.5 text-xs">
                <li>C Programming & Logic</li>
                <li>Computer Architecture</li>
                <li>Cybersecurity Practices</li>
                <li>Digital Electronics</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-2 text-xs uppercase tracking-wider">Project Info</h4>
              <p className="text-xs">
                {profile.projectTitle}
              </p>
              <p className="text-xs mt-1 text-slate-400">
                Created by {profile.studentName} ({profile.collegeName}).
              </p>
            </div>
          </div>
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800/60 text-center text-xs">
            © {new Date().getFullYear()} QuizMaster Platform. Built with React, TypeScript & Tailwind CSS.
          </div>
        </footer>
      </div>
    );
  };

  const renderDashboard = () => {
    return (
      <div className="space-y-8 py-6">
        {/* Header Greeting */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-indigo-500/10 via-blue-500/10 to-purple-500/10 border border-indigo-200/50 dark:border-indigo-900/40">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Welcome back, {profile.name}! 👋
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Ready to test your technical skills today? Pick a module and sharpen your grasp.
            </p>
          </div>
          <button
            onClick={() => {
              // Quick Start picks random quiz
              const randomQuiz = READY_QUIZZES[Math.floor(Math.random() * READY_QUIZZES.length)];
              startQuizFlow(randomQuiz);
            }}
            className="self-start sm:self-auto px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-md shadow-indigo-600/20 text-sm flex items-center gap-2 transition-all hover:scale-105"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Quick Start Quiz</span>
          </button>
        </div>

        {/* Real Performance Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase">
              <span>Quizzes Taken</span>
              <BookOpen className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="mt-3 text-3xl font-black text-slate-900 dark:text-white">
              {analytics.totalQuizzes}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              From local browser history
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase">
              <span>Average Score</span>
              <Trophy className="w-4 h-4 text-amber-500" />
            </div>
            <div className="mt-3 text-3xl font-black text-slate-900 dark:text-white">
              {analytics.avgScore}%
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Cumulative weighted mean
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase">
              <span>Best Score</span>
              <Award className="w-4 h-4 text-purple-500" />
            </div>
            <div className="mt-3 text-3xl font-black text-slate-900 dark:text-white">
              {analytics.bestScore}%
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Top recorded attempt
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase">
              <span>Questions Answered</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="mt-3 text-3xl font-black text-slate-900 dark:text-white">
              {analytics.totalQuestionsAnswered}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Total validated answers
            </div>
          </div>
        </div>

        {/* Dashboard Main Grid: Charts & Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Cols: Category Progress & Score Chart */}
          <div className="lg:col-span-2 space-y-6">
            {/* Category-wise Performance */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                Category Proficiency
              </h3>

              {history.length === 0 ? (
                <div className="py-12 text-center">
                  <BookOpen className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    No quizzes completed yet.
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                    Complete your first test module to view category-wise performance analytics.
                  </p>
                  <button
                    onClick={() => setCurrentPage('explore')}
                    className="mt-4 px-4 py-2 rounded-lg bg-indigo-600 text-white text-xs font-semibold"
                  >
                    Take a Quiz
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {(['C Programming', 'Computer Fundamentals', 'Cybersecurity', 'Digital Logic', 'General Knowledge', 'Web Development'] as Category[]).map(cat => {
                    const data = analytics.categoryBreakdown[cat] || { attempts: 0, avgScore: 0 };
                    return (
                      <div key={cat} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                            {getCategoryIcon(cat)}
                            {cat}
                          </span>
                          <span className="text-slate-500 dark:text-slate-400">
                            {data.attempts > 0 ? `${data.avgScore}% avg (${data.attempts} attempts)` : 'No attempts'}
                          </span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-500"
                            style={{ width: `${data.avgScore}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Score History Graph (SVG Responsive Line Chart) */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Recent Score Trend
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
                Progression of your last 7 quiz attempts
              </p>

              {history.length < 2 ? (
                <div className="py-8 text-center text-xs text-slate-400 dark:text-slate-500">
                  Complete at least 2 quizzes to generate your score trend line.
                </div>
              ) : (
                <div className="h-44 w-full">
                  {/* Lightweight pure SVG Sparkline / Chart */}
                  {(() => {
                    const recentAttempts = [...history].reverse().slice(-7);
                    const width = 500;
                    const height = 140;
                    const padding = 25;
                    const points = recentAttempts.map((att, i) => {
                      const x = padding + (i / Math.max(1, recentAttempts.length - 1)) * (width - 2 * padding);
                      const y = height - padding - (att.scorePercentage / 100) * (height - 2 * padding);
                      return { x, y, score: att.scorePercentage, title: att.quizTitle };
                    });
                    const pathD = points.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`, '');

                    return (
                      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
                        {/* Horizontal Grid lines */}
                        <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="currentColor" strokeDasharray="3,3" className="text-slate-200 dark:text-slate-700" />
                        <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="currentColor" strokeDasharray="3,3" className="text-slate-200 dark:text-slate-700" />
                        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="currentColor" strokeDasharray="3,3" className="text-slate-200 dark:text-slate-700" />

                        {/* Trend path */}
                        <path d={pathD} fill="none" stroke="#6366f1" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

                        {/* Interactive Data points */}
                        {points.map((p, idx) => (
                          <g key={idx}>
                            <circle cx={p.x} cy={p.y} r="5" className="fill-indigo-600 stroke-white dark:stroke-slate-900" strokeWidth="2" />
                            <text x={p.x} y={p.y - 10} textAnchor="middle" className="text-[10px] font-bold fill-slate-700 dark:fill-slate-300">
                              {p.score}%
                            </text>
                          </g>
                        ))}
                      </svg>
                    );
                  })()}
                </div>
              )}
            </div>
          </div>

          {/* Right Col: Recent Activity & Recommendations */}
          <div className="space-y-6">
            {/* Recent Activity Card */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                Recent Attempts
              </h3>

              {history.length === 0 ? (
                <p className="text-xs text-slate-400 dark:text-slate-500 text-center py-6">
                  No activity yet.
                </p>
              ) : (
                <div className="space-y-3">
                  {history.slice(0, 4).map((att) => (
                    <div
                      key={att.id}
                      className="p-3 rounded-xl border border-slate-100 dark:border-slate-700/60 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between text-xs"
                    >
                      <div className="space-y-1 max-w-[170px]">
                        <p className="font-semibold text-slate-900 dark:text-white truncate">
                          {att.quizTitle}
                        </p>
                        <p className="text-slate-500 dark:text-slate-400">
                          {new Date(att.timestamp).toLocaleDateString()} • {att.correctAnswers}/{att.totalQuestions} correct
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded-md font-bold text-xs ${att.scorePercentage >= 70 ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'}`}>
                        {att.scorePercentage}%
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recommended Quizzes */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-900 to-purple-900 text-white shadow-md">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-amber-300" />
                <h3 className="font-bold text-base">Recommended For You</h3>
              </div>
              <p className="text-xs text-indigo-200 mb-4">
                Strengthen core subjects commonly asked in engineering placements & viva exams.
              </p>

              <div className="space-y-2.5">
                {READY_QUIZZES.slice(3, 5).map(q => (
                  <div
                    key={q.id}
                    onClick={() => startQuizFlow(q)}
                    className="p-3 rounded-xl bg-white/10 hover:bg-white/15 cursor-pointer backdrop-blur-sm border border-white/10 transition-colors flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-semibold text-white">{q.title}</p>
                      <p className="text-indigo-200 text-[11px]">{q.category} • {q.difficulty}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-white" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderExplorePage = () => {
    const categories: ('All' | Category)[] = [
      'All',
      'C Programming',
      'Computer Fundamentals',
      'Cybersecurity',
      'Digital Logic',
      'General Knowledge',
      'Web Development'
    ];

    const difficulties: ('All' | Difficulty)[] = ['All', 'Easy', 'Medium', 'Hard'];

    return (
      <div className="space-y-8 py-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Explore All Quizzes
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Browse through 12 ready-to-play interactive quizzes covering university curriculum.
          </p>
        </div>

        {/* Filter & Search Bar Controls */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search Input */}
            <div className="relative md:col-span-2">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search quiz by title, topic, or keyword..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Difficulty Filter */}
            <div>
              <select
                value={selectedDifficultyFilter}
                onChange={e => setSelectedDifficultyFilter(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {difficulties.map(d => (
                  <option key={d} value={d}>
                    Difficulty: {d}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Options */}
            <div>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as 'title' | 'difficulty' | 'time')}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="title">Sort by Title (A-Z)</option>
                <option value="difficulty">Sort by Difficulty</option>
                <option value="time">Sort by Duration</option>
              </select>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategoryFilter(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${selectedCategoryFilter === cat ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
              >
                {cat}
              </button>
            ))}

            {(searchQuery || selectedCategoryFilter !== 'All' || selectedDifficultyFilter !== 'All') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategoryFilter('All');
                  setSelectedDifficultyFilter('All');
                }}
                className="px-3 py-1.5 rounded-full text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-1 transition-colors ml-auto"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>
        </div>

        {/* Quizzes Grid */}
        {filteredQuizzes.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">No quizzes match your filters</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Try adjusting your search query, difficulty, or category selections.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategoryFilter('All');
                setSelectedDifficultyFilter('All');
              }}
              className="mt-4 px-4 py-2 rounded-lg bg-indigo-600 text-white text-xs font-semibold"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQuizzes.map(quiz => (
              <div
                key={quiz.id}
                className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-400 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                      {getCategoryIcon(quiz.category)}
                    </span>
                    {getDifficultyBadge(quiz.difficulty)}
                  </div>
                  <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                    {quiz.category}
                  </span>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white mt-1">
                    {quiz.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                    {quiz.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>~{quiz.estimatedMinutes} mins</span>
                  </div>
                  <button
                    onClick={() => startQuizFlow(quiz)}
                    className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-colors"
                  >
                    Start Quiz
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderInstructionsPage = () => {
    const availablePool = QUESTION_BANK.filter(q => q.category === selectedQuizMeta.category);

    return (
      <div className="max-w-3xl mx-auto py-8">
        <button
          onClick={() => setCurrentPage('explore')}
          className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 mb-6"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Explore</span>
        </button>

        <div className="p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60">
                {getCategoryIcon(selectedQuizMeta.category)}
              </div>
              <div>
                <span className="text-xs font-bold uppercase text-indigo-600 dark:text-indigo-400">
                  {selectedQuizMeta.category}
                </span>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {selectedQuizMeta.title}
                </h1>
              </div>
            </div>
            {getDifficultyBadge(selectedQuizMeta.difficulty)}
          </div>

          <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
            {selectedQuizMeta.description}
          </p>

          {/* Configurable Question Count */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 space-y-2">
            <label className="text-sm font-bold text-slate-900 dark:text-white">
              Select Question Count:
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[5, 10, 15].map(cnt => {
                const isSelected = questionCountChoice === cnt;
                return (
                  <button
                    key={cnt}
                    onClick={() => setQuestionCountChoice(cnt)}
                    className={`py-2.5 rounded-lg border text-sm font-semibold transition-all ${isSelected ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                  >
                    {cnt} Questions
                    <span className="block text-[10px] font-normal opacity-80">
                      (~{cnt} mins limit)
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {availablePool.length} verified questions are available in the {selectedQuizMeta.category} repository.
            </p>
          </div>

          {/* Quiz Rules & Regulations */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Exam Rules & Interface Guidelines
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                <span><strong>Randomized Content:</strong> Questions and options are shuffled on every attempt to prevent memorization bias.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                <span><strong>Timed Session:</strong> Countdown timer allocates 60 seconds per question. Automatic submission triggers when time reaches 00:00.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                <span><strong>Mark for Review:</strong> Flag uncertain questions and revisit them anytime using the question palette.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                <span><strong>Keyboard Shortcuts:</strong> Press keys <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 font-mono text-xs">1-4</kbd> to select options, <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 font-mono text-xs">N</kbd> for Next, <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 font-mono text-xs">P</kbd> for Previous, and <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 font-mono text-xs">M</kbd> to Mark for Review.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                <span><strong>Scoring:</strong> 1 point per correct answer. 0 points for incorrect or unanswered questions (No negative marking).</span>
              </li>
            </ul>
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-700">
            <button
              onClick={() => setCurrentPage('explore')}
              className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              onClick={launchInteractiveQuiz}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold text-sm shadow-md shadow-indigo-500/20 flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Start Quiz Now</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderQuizEnginePage = () => {
    if (activeQuestions.length === 0) return null;

    const currentQ = activeQuestions[currentQuestionIdx];
    const totalQ = activeQuestions.length;
    const isLowTime = timeRemainingSeconds <= 60;
    const progressPercent = Math.round(((currentQuestionIdx + 1) / totalQ) * 100);
    const selectedOption = userAnswers[currentQuestionIdx];
    const isMarked = !!markedForReview[currentQuestionIdx];

    // Count stats for confirmation
    const answeredCount = Object.keys(userAnswers).length;
    const unansweredCount = totalQ - answeredCount;

    return (
      <div className="max-w-5xl mx-auto py-6 space-y-6">
        {/* Quiz Top Navigation Bar & Timer */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase text-indigo-600 dark:text-indigo-400">
              {selectedQuizMeta.category}
            </span>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white truncate max-w-sm sm:max-w-md">
              {selectedQuizMeta.title}
            </h2>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            {/* Countdown Timer with Low-Time Visual Warning */}
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-bold font-mono transition-colors ${
                isLowTime
                  ? 'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-900 animate-pulse'
                  : 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>{formatTime(timeRemainingSeconds)}</span>
            </div>

            <button
              onClick={() => setShowSubmitModal(true)}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-colors"
            >
              Submit Quiz
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 px-1">
            <span>Question {currentQuestionIdx + 1} of {totalQ}</span>
            <span>{answeredCount} Answered • {unansweredCount} Left</span>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
            <div
              className="h-full rounded-full bg-indigo-600 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Main Quiz Layout: Question Card on Left, Palette on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Question Box (2 Cols) */}
          <div className="lg:col-span-2 p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between space-y-6">
            <div>
              {/* Question Header & Subtopic */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                  Topic: {currentQ.subtopic}
                </span>
                <button
                  onClick={toggleMarkForReview}
                  className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md border transition-colors ${
                    isMarked
                      ? 'bg-amber-50 border-amber-300 text-amber-700 dark:bg-amber-950 dark:border-amber-800 dark:text-amber-300'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
                  }`}
                >
                  <Bookmark className={`w-3.5 h-3.5 ${isMarked ? 'fill-amber-500' : ''}`} />
                  <span>{isMarked ? 'Marked for Review' : 'Mark for Review'}</span>
                </button>
              </div>

              {/* Question Text */}
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-relaxed">
                {currentQ.questionText}
              </h3>

              {/* Four Options */}
              <div className="mt-6 space-y-3">
                {currentQ.options.map((opt, oIdx) => {
                  const isChecked = selectedOption === oIdx;
                  return (
                    <div
                      key={oIdx}
                      onClick={() => handleSelectOption(oIdx)}
                      className={`group p-4 rounded-xl border text-sm font-medium cursor-pointer transition-all flex items-center justify-between ${
                        isChecked
                          ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 dark:bg-indigo-950/60 dark:border-indigo-500 dark:text-indigo-200 ring-2 ring-indigo-500/20'
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold font-mono transition-colors ${
                            isChecked
                              ? 'bg-indigo-600 text-white'
                              : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 group-hover:bg-slate-200'
                          }`}
                        >
                          {oIdx + 1}
                        </span>
                        <span className="leading-snug">{opt}</span>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                          isChecked
                            ? 'border-indigo-600 bg-indigo-600 text-white'
                            : 'border-slate-300 dark:border-slate-600'
                        }`}
                      >
                        {isChecked && <Check className="w-3.5 h-3.5" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Controls */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  disabled={currentQuestionIdx === 0}
                  onClick={() => setCurrentQuestionIdx(prev => prev - 1)}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                {selectedOption !== undefined && (
                  <button
                    onClick={clearCurrentAnswer}
                    className="px-3 py-2 rounded-xl text-rose-600 dark:text-rose-400 text-xs font-semibold hover:bg-rose-50 dark:hover:bg-rose-950/40"
                  >
                    Clear Answer
                  </button>
                )}
              </div>

              {currentQuestionIdx < totalQ - 1 ? (
                <button
                  onClick={() => setCurrentQuestionIdx(prev => prev + 1)}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm flex items-center gap-1.5"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => setShowSubmitModal(true)}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Review & Submit</span>
                </button>
              )}
            </div>
          </div>

          {/* Question Palette Sidebar (1 Col) */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">
              Question Palette
            </h4>

            {/* Grid of question number buttons */}
            <div className="grid grid-cols-5 gap-2">
              {activeQuestions.map((_, idx) => {
                const isCurrent = idx === currentQuestionIdx;
                const isAns = userAnswers[idx] !== undefined;
                const isMkd = markedForReview[idx];

                let btnClass = 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800';
                if (isAns) {
                  btnClass = 'bg-emerald-600 text-white border-emerald-600 shadow-sm';
                }
                if (isMkd) {
                  btnClass = 'bg-amber-500 text-white border-amber-500 shadow-sm';
                }
                if (isCurrent) {
                  btnClass += ' ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-slate-800 font-black';
                }

                return (
                  <button
                    key={idx}
                    onClick={() => setCurrentQuestionIdx(idx)}
                    className={`h-10 rounded-xl text-xs font-semibold border flex items-center justify-center transition-all ${btnClass}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-600" />
                <span>Answered</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-500" />
                <span>Marked for Review</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600" />
                <span>Unanswered</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full ring-2 ring-indigo-500 bg-indigo-50" />
                <span>Current Question</span>
              </div>
            </div>

            {/* Keyboard Shortcuts Hint */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
              <span className="font-semibold block text-slate-700 dark:text-slate-300">Keyboard Shortcuts:</span>
              <p><kbd className="px-1 rounded bg-slate-200 dark:bg-slate-700">1-4</kbd> Choose option</p>
              <p><kbd className="px-1 rounded bg-slate-200 dark:bg-slate-700">N</kbd> / <kbd className="px-1 rounded bg-slate-200 dark:bg-slate-700">→</kbd> Next</p>
              <p><kbd className="px-1 rounded bg-slate-200 dark:bg-slate-700">P</kbd> / <kbd className="px-1 rounded bg-slate-200 dark:bg-slate-700">←</kbd> Previous</p>
              <p><kbd className="px-1 rounded bg-slate-200 dark:bg-slate-700">M</kbd> Mark review</p>
            </div>
          </div>
        </div>

        {/* Confirmation Modal Before Submission */}
        {showSubmitModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
            <div className="max-w-md w-full p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl space-y-5">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
                <AlertCircle className="w-6 h-6" />
              </div>

              <div className="text-center">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Confirm Quiz Submission
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Are you ready to submit your test for scoring?
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 grid grid-cols-3 gap-2 text-center text-xs">
                <div>
                  <span className="font-bold text-base text-slate-900 dark:text-white block">{totalQ}</span>
                  <span className="text-slate-500">Total</span>
                </div>
                <div>
                  <span className="font-bold text-base text-emerald-600 block">{answeredCount}</span>
                  <span className="text-slate-500">Answered</span>
                </div>
                <div>
                  <span className="font-bold text-base text-rose-500 block">{unansweredCount}</span>
                  <span className="text-slate-500">Unanswered</span>
                </div>
              </div>

              {unansweredCount > 0 && (
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>You still have {unansweredCount} unanswered question(s). You can return and complete them before submitting.</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => setShowSubmitModal(false)}
                  className="py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  Return to Quiz
                </button>
                <button
                  onClick={() => handleFinalSubmit(false)}
                  className="py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-600/20"
                >
                  Yes, Submit Now
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderResultsPage = () => {
    if (!lastCompletedAttempt) {
      return (
        <div className="py-16 text-center">
          <p className="text-slate-500">No recent result available.</p>
          <button
            onClick={() => setCurrentPage('explore')}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold"
          >
            Explore Quizzes
          </button>
        </div>
      );
    }

    const { scorePercentage, correctAnswers, incorrectAnswers, unanswered, totalQuestions, timeSpentSeconds } = lastCompletedAttempt;
    const isPassing = scorePercentage >= 60;

    // SVG Circular score ring calculation
    const radius = 60;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (scorePercentage / 100) * circumference;

    return (
      <div className="max-w-3xl mx-auto py-8 space-y-8">
        <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg text-center space-y-6">
          <div className="inline-flex p-3 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
            {isPassing ? <Trophy className="w-8 h-8 text-amber-500" /> : <Award className="w-8 h-8 text-indigo-500" />}
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {isPassing ? 'Outstanding Work!' : 'Good Effort! Keep Practicing!'}
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-md mx-auto">
              You completed the <strong>{lastCompletedAttempt.quizTitle}</strong> assessment module.
            </p>
          </div>

          {/* Animated SVG Score Ring */}
          <div className="relative w-44 h-44 mx-auto flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="88"
                cy="88"
                r={radius}
                className="stroke-slate-100 dark:stroke-slate-700"
                strokeWidth="12"
                fill="transparent"
              />
              <circle
                cx="88"
                cy="88"
                r={radius}
                className="stroke-indigo-600 transition-all duration-1000 ease-out"
                strokeWidth="12"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-3xl font-black text-slate-900 dark:text-white">
                {scorePercentage}%
              </span>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Accuracy
              </span>
            </div>
          </div>

          {/* Numerical Breakdown Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-100 dark:border-slate-700">
            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/60">
              <div className="flex items-center justify-center gap-1 text-emerald-600 dark:text-emerald-400 text-xs font-bold mb-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Correct</span>
              </div>
              <span className="text-2xl font-black text-emerald-700 dark:text-emerald-300">
                {correctAnswers}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900/60">
              <div className="flex items-center justify-center gap-1 text-rose-600 dark:text-rose-400 text-xs font-bold mb-1">
                <XCircle className="w-3.5 h-3.5" />
                <span>Incorrect</span>
              </div>
              <span className="text-2xl font-black text-rose-700 dark:text-rose-300">
                {incorrectAnswers}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900/60">
              <div className="flex items-center justify-center gap-1 text-amber-600 dark:text-amber-400 text-xs font-bold mb-1">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Unanswered</span>
              </div>
              <span className="text-2xl font-black text-amber-700 dark:text-amber-300">
                {unanswered}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60">
              <div className="flex items-center justify-center gap-1 text-indigo-600 dark:text-indigo-400 text-xs font-bold mb-1">
                <Clock className="w-3.5 h-3.5" />
                <span>Time Taken</span>
              </div>
              <span className="text-2xl font-black text-indigo-700 dark:text-indigo-300">
                {formatTime(timeSpentSeconds)}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <button
              onClick={() => setCurrentPage('review')}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-600/20 flex items-center gap-1.5"
            >
              <Eye className="w-4 h-4" />
              <span>Review Detailed Answers</span>
            </button>

            <button
              onClick={handleRetakeQuiz}
              className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake Quiz</span>
            </button>

            <button
              onClick={() => setCurrentPage('dashboard')}
              className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderReviewPage = () => {
    if (!lastCompletedAttempt) return null;

    return (
      <div className="max-w-4xl mx-auto py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Answer Review & Explanations
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Review correct answers, your choices, and conceptual rationales.
            </p>
          </div>

          <button
            onClick={() => setCurrentPage('results')}
            className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            Back to Score
          </button>
        </div>

        {/* List of reviewed questions */}
        <div className="space-y-4">
          {lastCompletedAttempt.shuffledQuestions.map((q, idx) => {
            const userChoice = lastCompletedAttempt.userAnswers[idx];
            const isCorrect = userChoice === q.correctIndex;
            const isUnanswered = userChoice === undefined;

            return (
              <div
                key={q.id}
                className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Question {idx + 1} • {q.subtopic}
                  </span>

                  {/* Status Badge with accessible icons */}
                  {isCorrect && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Correct (+1)</span>
                    </span>
                  )}
                  {!isCorrect && !isUnanswered && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Incorrect (0)</span>
                    </span>
                  )}
                  {isUnanswered && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>Unanswered (0)</span>
                    </span>
                  )}
                </div>

                <h3 className="font-semibold text-base text-slate-900 dark:text-white leading-snug">
                  {q.questionText}
                </h3>

                {/* Options List */}
                <div className="space-y-2 pt-2">
                  {q.options.map((opt, optIdx) => {
                    const isUserPick = userChoice === optIdx;
                    const isRealCorrect = q.correctIndex === optIdx;

                    let optStyle = 'border-slate-100 dark:border-slate-700/60 bg-slate-50 dark:bg-slate-900/40 text-slate-700 dark:text-slate-300';
                    if (isRealCorrect) {
                      optStyle = 'border-emerald-300 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/60 dark:border-emerald-800 dark:text-emerald-200 font-semibold';
                    } else if (isUserPick && !isRealCorrect) {
                      optStyle = 'border-rose-300 bg-rose-50 text-rose-900 dark:bg-rose-950/60 dark:border-rose-800 dark:text-rose-200';
                    }

                    return (
                      <div
                        key={optIdx}
                        className={`p-3 rounded-xl border text-xs sm:text-sm flex items-center justify-between ${optStyle}`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="font-mono text-xs opacity-70">
                            {['A', 'B', 'C', 'D'][optIdx]}.
                          </span>
                          <span>{opt}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs">
                          {isRealCorrect && (
                            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                              <Check className="w-3.5 h-3.5" /> Correct Answer
                            </span>
                          )}
                          {isUserPick && !isRealCorrect && (
                            <span className="flex items-center gap-1 text-rose-600 dark:text-rose-400 font-bold">
                              <XCircle className="w-3.5 h-3.5" /> Your Choice
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Explanation Card */}
                <div className="p-3.5 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 text-xs text-indigo-950 dark:text-indigo-200 leading-relaxed">
                  <span className="font-bold block mb-0.5 text-indigo-700 dark:text-indigo-300">
                    💡 Explanation:
                  </span>
                  {q.explanation}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderLeaderboardPage = () => {
    return (
      <div className="max-w-4xl mx-auto py-8 space-y-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Demonstration Leaderboard
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1 text-sm">
            Simulated student cohort rankings to demonstrate scoring hierarchies and academic benchmarks.
          </p>
        </div>

        {/* Transparency Notice */}
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-3">
          <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <strong className="block font-semibold">Offline Standalone Architecture Notice:</strong>
            QuizMaster operates without a centralized cloud server. All profiles listed below are demonstration samples representing typical engineering scores. Your personal statistics are calculated purely from your local browser storage.
          </div>
        </div>

        {/* Table of Leaders */}
        <div className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 text-xs font-bold uppercase text-slate-500 dark:text-slate-400">
                  <th className="py-3.5 px-4">Rank</th>
                  <th className="py-3.5 px-4">Student</th>
                  <th className="py-3.5 px-4">Focus Category</th>
                  <th className="py-3.5 px-4 text-center">Quizzes</th>
                  <th className="py-3.5 px-4 text-right">Avg Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                {/* Insert User Current Profile if they have completed a quiz */}
                {analytics.totalQuizzes > 0 && (
                  <tr className="bg-indigo-50/70 dark:bg-indigo-950/50 font-semibold">
                    <td className="py-3.5 px-4">
                      <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">
                        ★
                      </span>
                    </td>
                    <td className="py-3.5 px-4 flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">
                        {profile.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <span className="text-indigo-950 dark:text-indigo-200">{profile.name} (You)</span>
                        <span className="block text-[11px] text-indigo-600 dark:text-indigo-400">Current Session</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-600 dark:text-slate-300">
                      Engineering General
                    </td>
                    <td className="py-3.5 px-4 text-center text-xs">
                      {analytics.totalQuizzes}
                    </td>
                    <td className="py-3.5 px-4 text-right font-black text-indigo-600 dark:text-indigo-400">
                      {analytics.avgScore}%
                    </td>
                  </tr>
                )}

                {SAMPLE_LEADERBOARD.map((user, idx) => (
                  <tr key={user.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/20">
                    <td className="py-3.5 px-4 text-xs font-bold text-slate-500">
                      #{idx + 1}
                    </td>
                    <td className="py-3.5 px-4 flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center text-xs font-bold">
                        {user.avatarSeed}
                      </div>
                      <span className="font-semibold text-slate-900 dark:text-white">{user.name}</span>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-600 dark:text-slate-300">
                      {user.topCategory}
                    </td>
                    <td className="py-3.5 px-4 text-center text-xs text-slate-600 dark:text-slate-300">
                      {user.quizzesCompleted}
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-slate-900 dark:text-white">
                      {user.avgScore}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderProgressPage = () => {
    return (
      <div className="space-y-8 py-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            My Learning Progress
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Real performance telemetry derived from your completed quiz sessions.
          </p>
        </div>

        {history.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-4">
            <BarChart3 className="w-16 h-16 text-indigo-400 mx-auto" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">No attempts recorded yet</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Your analytics dashboard will track overall accuracy, identify weak technical subtopics, and plot score trends once you begin taking quizzes.
            </p>
            <button
              onClick={() => setCurrentPage('explore')}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-xs shadow-md"
            >
              Start First Quiz
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Top Stat Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="text-xs font-semibold text-slate-500">Total Attempts</span>
                <p className="text-3xl font-black text-slate-900 dark:text-white mt-2">{analytics.totalQuizzes}</p>
              </div>
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="text-xs font-semibold text-slate-500">Overall Accuracy</span>
                <p className="text-3xl font-black text-indigo-600 dark:text-indigo-400 mt-2">{analytics.avgScore}%</p>
              </div>
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="text-xs font-semibold text-slate-500">Personal Best</span>
                <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-2">{analytics.bestScore}%</p>
              </div>
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="text-xs font-semibold text-slate-500">Total Questions</span>
                <p className="text-3xl font-black text-purple-600 dark:text-purple-400 mt-2">{analytics.totalQuestionsAnswered}</p>
              </div>
            </div>

            {/* Weak Technical Subtopics derived from mistakes */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                Identified Growth Areas
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Subtopics where you missed questions in recent tests:
              </p>

              {analytics.weakTopics.length === 0 ? (
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                  🎉 Great job! No prominent weak subtopics recorded yet.
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {analytics.weakTopics.map(topic => (
                    <span
                      key={topic}
                      className="px-3 py-1.5 rounded-lg bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 text-xs font-semibold border border-rose-200 dark:border-rose-900 flex items-center gap-1.5"
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      {topic}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Complete Attempt History Log */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                Detailed Test History
              </h3>

              <div className="space-y-3">
                {history.map((record) => (
                  <div
                    key={record.id}
                    className="p-4 rounded-xl border border-slate-100 dark:border-slate-700/60 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <span className="font-bold text-sm text-slate-900 dark:text-white block">
                        {record.quizTitle}
                      </span>
                      <span className="text-slate-500 dark:text-slate-400">
                        {record.category} • {new Date(record.timestamp).toLocaleString()} • {formatTime(record.timeSpentSeconds)} duration
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="font-black text-sm text-indigo-600 dark:text-indigo-400 block">
                          {record.scorePercentage}%
                        </span>
                        <span className="text-slate-400">
                          {record.correctAnswers}/{record.totalQuestions} correct
                        </span>
                      </div>

                      <button
                        onClick={() => {
                          setLastCompletedAttempt(record);
                          setCurrentPage('review');
                        }}
                        className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold hover:bg-slate-300 dark:hover:bg-slate-600"
                      >
                        Review
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderProfileSettingsPage = () => {
    return (
      <div className="max-w-3xl mx-auto py-8 space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Profile & Platform Settings
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1 text-sm">
            Manage your display preferences, audio feedback, and local device storage.
          </p>
        </div>

        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
          <div className="flex items-center gap-4 pb-6 border-b border-slate-100 dark:border-slate-700">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white text-xl font-bold shadow-md shadow-indigo-600/20">
              {profile.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">{profile.name}</h2>
              <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">Local Student Profile</span>
            </div>
          </div>

          {/* Edit Display Name */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-slate-600 dark:text-slate-400">
              Student Display Name
            </label>
            <input
              type="text"
              value={profile.name}
              onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Theme Mode Toggle */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-700/60">
            <div>
              <span className="text-sm font-bold text-slate-900 dark:text-white block">Theme Appearance</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">Toggle dark / light display interface</span>
            </div>
            <button
              onClick={() => setProfile(p => ({ ...p, theme: p.theme === 'dark' ? 'light' : 'dark' }))}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold flex items-center gap-2"
            >
              {profile.theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
              <span>{profile.theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
            </button>
          </div>

          {/* Audio Synthesizer Toggle */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-700/60">
            <div>
              <span className="text-sm font-bold text-slate-900 dark:text-white block">Interactive Sound Effects</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">Web Audio API tones on selection and quiz submission</span>
            </div>
            <button
              onClick={() => {
                const nextState = !profile.soundEnabled;
                setProfile(p => ({ ...p, soundEnabled: nextState }));
                if (nextState) playBeep('select', true);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-semibold border flex items-center gap-2 ${profile.soundEnabled ? 'bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-950 dark:border-indigo-800 dark:text-indigo-300' : 'bg-slate-100 border-slate-200 text-slate-500 dark:bg-slate-800 dark:border-slate-700'}`}
            >
              {profile.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <span>{profile.soundEnabled ? 'Enabled' : 'Disabled'}</span>
            </button>
          </div>

          {/* Privacy & Storage Notice */}
          <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 text-xs text-indigo-950 dark:text-indigo-200 space-y-1">
            <span className="font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              Local Privacy Assurance
            </span>
            <p>
              QuizMaster stores all attempt scores, bookmarks, and display settings directly inside your browser’s localStorage. No private data is ever dispatched to external cloud servers.
            </p>
          </div>

          {/* Danger Zone: Reset Data */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-700 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
              Reset & Storage Management
            </h3>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  setConfirmDialog({
                    isOpen: true,
                    title: 'Clear Quiz History?',
                    message: 'This will erase all past quiz attempts and reset your dashboard statistics. This action cannot be reversed.',
                    onConfirm: () => {
                      setHistory([]);
                      localStorage.removeItem(STORAGE_KEYS.HISTORY);
                      setConfirmDialog(prev => ({ ...prev, isOpen: false }));
                    }
                  });
                }}
                className="px-4 py-2.5 rounded-xl border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-semibold flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Reset Quiz History Only</span>
              </button>

              <button
                onClick={() => {
                  setConfirmDialog({
                    isOpen: true,
                    title: 'Reset Entire Application Data?',
                    message: 'This will restore default settings, reset student credentials, and clear all test records.',
                    onConfirm: () => {
                      setHistory([]);
                      setProfile(DEFAULT_PROFILE);
                      localStorage.clear();
                      setConfirmDialog(prev => ({ ...prev, isOpen: false }));
                    }
                  });
                }}
                className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Clear All Saved Data</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderAboutPage = () => {
    return (
      <div className="max-w-4xl mx-auto py-8 space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            About QuizMaster
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1 text-sm">
            Academic software project documentation and technical system architecture.
          </p>
        </div>

        {/* Project Objectives */}
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            1. Problem Statement & Motivation
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            First-year engineering students often struggle with retention across fundamental technical courses—specifically ANSI C programming, digital logic, and operating system mechanics. Commercial platforms frequently demand online connectivity, account registrations, or paid memberships.
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <strong>QuizMaster</strong> is developed as a zero-dependency, self-contained educational tool that runs locally in modern browsers, delivering instant feedback and analytics without privacy infringements or external API latencies.
          </p>
        </div>

        {/* Editable Student Credentials Card for Viva / Submission */}
        <div className="p-8 rounded-3xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-slate-800 dark:to-slate-800 border border-indigo-200/60 dark:border-indigo-900/40 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span>Academic Submission Credentials</span>
            </h2>
            <span className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">(Editable for Viva)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Student Name</label>
              <input
                type="text"
                value={profile.studentName}
                onChange={e => setProfile(p => ({ ...p, studentName: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Department / Branch</label>
              <input
                type="text"
                value={profile.branch}
                onChange={e => setProfile(p => ({ ...p, branch: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-bold text-slate-500 uppercase">College / University Name</label>
              <input
                type="text"
                value={profile.collegeName}
                onChange={e => setProfile(p => ({ ...p, collegeName: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Project Title</label>
              <input
                type="text"
                value={profile.projectTitle}
                onChange={e => setProfile(p => ({ ...p, projectTitle: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* System Architecture */}
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            2. Technical Stack & Implementation Architecture
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
              <strong className="block text-indigo-600 dark:text-indigo-400 mb-1">Frontend Layer</strong>
              <p className="text-slate-600 dark:text-slate-400">
                React 18 with TypeScript functional components, custom state hooks, and Tailwind CSS responsive utility classes.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
              <strong className="block text-indigo-600 dark:text-indigo-400 mb-1">State & Storage</strong>
              <p className="text-slate-600 dark:text-slate-400">
                Synchronous localStorage integration with JSON schemas and fallback resilience for missing browser items.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
              <strong className="block text-indigo-600 dark:text-indigo-400 mb-1">Audio Feedback</strong>
              <p className="text-slate-600 dark:text-slate-400">
                Hardware-accelerated sound synthesis powered by the standard browser Web Audio API oscillator nodes.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
              <strong className="block text-indigo-600 dark:text-indigo-400 mb-1">Question Bank</strong>
              <p className="text-slate-600 dark:text-slate-400">
                Over 120 fact-checked questions across 6 core fields, with zero external network request dependency.
              </p>
            </div>
          </div>
        </div>

        {/* Future Enhancements */}
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            3. Future Project Scope
          </h2>
          <ul className="list-disc list-inside space-y-1 text-sm text-slate-600 dark:text-slate-400">
            <li>Exporting result reports to PDF format for academic grading portfolios.</li>
            <li>Custom question authoring interface for teachers to upload CSV question banks.</li>
            <li>Multiplayer live classroom quiz sessions via WebRTC peer data channels.</li>
          </ul>
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${isDark ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50/60 text-slate-900'}`}>
      {/* Reusable Navbar */}
      {renderNavbar()}

      {/* Main Page Router */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {currentPage === 'home' && renderHomePage()}
        {currentPage === 'dashboard' && renderDashboard()}
        {currentPage === 'explore' && renderExplorePage()}
        {currentPage === 'instructions' && renderInstructionsPage()}
        {currentPage === 'quiz' && renderQuizEnginePage()}
        {currentPage === 'results' && renderResultsPage()}
        {currentPage === 'review' && renderReviewPage()}
        {currentPage === 'leaderboard' && renderLeaderboardPage()}
        {currentPage === 'progress' && renderProgressPage()}
        {currentPage === 'profile' && renderProfileSettingsPage()}
        {currentPage === 'about' && renderAboutPage()}
      </main>

      {/* Reusable Confirmation Dialog for Data Resets */}
      {confirmDialog.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="max-w-md w-full p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {confirmDialog.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {confirmDialog.message}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
                className="py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={confirmDialog.onConfirm}
                className="py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs shadow-md shadow-rose-600/20"
              >
                Yes, Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}