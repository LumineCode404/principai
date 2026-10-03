/**
 * The Principai registry — an exhaustive, research-backed catalog of software
 * engineering principles, laws, heuristics, and practices.
 *
 * Rules this file obeys (same as the whole library):
 *  - No completeness claims. This catalog is long because research is wide,
 *    not because a number was promised. Gaps are expected and tracked.
 *  - Status words only: "sudah digali" (dug — has a full page, linked),
 *    "belum digali" (not yet dug), "tidak yakin" (attribution or boundary
 *    is genuinely uncertain).
 *  - Every entry carries a real source. Folklore items are marked
 *    "tidak yakin" rather than dressed up with a borrowed citation.
 *
 * Research basis (web research pass over primary and standard sources):
 * Saltzer & Schroeder 1975; NIST SP 800-207; OWASP ASVS; ISO/IEC 25010;
 * WCAG 2.2; Nielsen Norman Group; Google SRE Book; DORA/Accelerate;
 * Twelve-Factor App; PEP 20; The Art of Unix Programming; Release It!;
 * Transaction Processing (Gray & Reuter); Brewer 2000 & Abadi 2012;
 * Deutsch's fallacies; Cavoukian 2009; GDPR Art. 5; Dwork 2006; Lamport;
 * Cheriton; Nygard; Fowler; Martin; Evans; and the works cited inline.
 */

export type RegistryStatus = "sudah digali" | "belum digali" | "tidak yakin";

export interface RegistryEntry {
  /** Canonical English name (repo language is English). */
  name: string;
  domain: string;
  /** One-line definition — what it advises. */
  def: string;
  /** Canonical source: paper, book, standard, or well-documented origin. */
  src: string;
  status: RegistryStatus;
  /** Present when a full page exists in the archive. */
  href?: string;
}

export interface RegistryDomain {
  id: string;
  label: string;
  /** One-line scope of the domain. */
  blurb: string;
}

export const REGISTRY_DOMAINS: RegistryDomain[] = [
  { id: "security", label: "Security", blurb: "Who may do what, and what contains mistakes." },
  { id: "reliability", label: "Reliability", blurb: "How systems fail visibly and how failure stays small." },
  { id: "data", label: "Data", blurb: "How data survives mistakes, time, and scale." },
  { id: "architecture", label: "Architecture", blurb: "How structure shapes outcomes." },
  { id: "api", label: "API", blurb: "Contracts between systems." },
  { id: "design", label: "Design", blurb: "Judgment under ambiguity." },
  { id: "testing", label: "Testing", blurb: "Evidence that software works, and keeps working." },
  { id: "ops", label: "Operations & SRE", blurb: "Running software without being run by it." },
  { id: "distributed", label: "Distributed Systems", blurb: "Many machines, one system, no shared truth." },
  { id: "performance", label: "Performance", blurb: "Speed earned by measurement, not hope." },
  { id: "accessibility", label: "Accessibility", blurb: "Software usable by everyone." },
  { id: "ux", label: "UX", blurb: "How humans actually experience software." },
  { id: "humans", label: "Humans & Teams", blurb: "The part of the system that has meetings." },
  { id: "privacy", label: "Privacy", blurb: "Data about people, handled with care." },
  { id: "concurrency", label: "Concurrency", blurb: "Time, interleavings, and shared state." },
  { id: "aiml", label: "AI & ML Systems", blurb: "Learning from data changes the failure modes." },
  { id: "formal", label: "Formal Methods", blurb: "Proof instead of hope, where the cost is worth it." },
  { id: "docs", label: "Documentation & i18n", blurb: "Software is read by humans in many languages." },
];

export const REGISTRY: RegistryEntry[] = [
  // ===== Security =====
  { name: "Least Authority", domain: "security", def: "Grant only the authority a task actually needs — never more.", src: "Saltzer & Schroeder, The Protection of Information in Computer Systems, Proc. IEEE 1975", status: "sudah digali", href: "/docs/principles/security/least-authority" },
  { name: "Fail-Safe Defaults", domain: "security", def: "Default to denial; permission must be granted explicitly.", src: "Saltzer & Schroeder, 1975", status: "sudah digali", href: "/docs/principles/security/fail-safe-defaults" },
  { name: "Complete Mediation", domain: "security", def: "Check every access, every time — cached authority is a hole.", src: "Saltzer & Schroeder, 1975", status: "sudah digali", href: "/docs/principles/security/complete-mediation" },
  { name: "Defense in Depth", domain: "security", def: "Layer controls so one failure is not a breach.", src: "Saltzer & Schroeder, 1975; NSA defense-in-depth guidance", status: "sudah digali", href: "/docs/principles/security/defense-in-depth" },
  { name: "Secure by Default", domain: "security", def: "Ship configurations that are safe before they are tuned.", src: "OWASP Secure Coding Practices; CIS Benchmarks", status: "sudah digali", href: "/docs/principles/security/secure-by-default" },
  { name: "Input Validation", domain: "security", def: "Validate at the boundary; trust nothing that crosses it.", src: "OWASP ASVS; Hunt & Thomas, The Pragmatic Programmer", status: "sudah digali", href: "/docs/principles/security/input-validation" },
  { name: "Secrets Hygiene", domain: "security", def: "Secrets live in vaults and rotation, never in code or logs.", src: "OWASP Secrets Management Cheat Sheet", status: "sudah digali", href: "/docs/principles/security/secrets-hygiene" },
  { name: "Supply Chain Vetting", domain: "security", def: "Dependencies are part of your attack surface — verify them.", src: "SLSA framework (slsa.dev); OWASP SCVS", status: "sudah digali", href: "/docs/principles/security/supply-chain-vetting" },
  { name: "Economy of Mechanism", domain: "security", def: "Keep protection mechanisms as simple as possible — complexity is where holes live.", src: "Saltzer & Schroeder, 1975", status: "belum digali" },
  { name: "Open Design", domain: "security", def: "Security must not depend on the secrecy of the design.", src: "Saltzer & Schroeder, 1975; Kerckhoffs, 1883", status: "belum digali" },
  { name: "Separation of Privilege", domain: "security", def: "Require multiple conditions to grant sensitive authority.", src: "Saltzer & Schroeder, 1975", status: "belum digali" },
  { name: "Least Common Mechanism", domain: "security", def: "Minimize shared mechanisms between users — sharing couples failures.", src: "Saltzer & Schroeder, 1975", status: "belum digali" },
  { name: "Psychological Acceptability", domain: "security", def: "If the safe path is harder than the unsafe one, users take the unsafe one.", src: "Saltzer & Schroeder, 1975", status: "belum digali" },
  { name: "Work Factor", domain: "security", def: "Compare the cost of breaking a control against the attacker's resources.", src: "Saltzer & Schroeder, 1975", status: "belum digali" },
  { name: "Compromise Recording", domain: "security", def: "Design so that breaches leave evidence behind.", src: "Saltzer & Schroeder, 1975", status: "belum digali" },
  { name: "Kerckhoffs's Principle", domain: "security", def: "A cryptosystem must remain secure even if everything about it is public except the key.", src: "Auguste Kerckhoffs, La Cryptographie Militaire, 1883", status: "belum digali" },
  { name: "Shannon's Maxim", domain: "security", def: "Design as if the enemy knows the system being used.", src: "Claude Shannon, Communication Theory of Secrecy Systems, 1949", status: "belum digali" },
  { name: "Zero Trust", domain: "security", def: "No implicit trust from network location; verify every request with least authority.", src: "NIST SP 800-207, Zero Trust Architecture, 2020", status: "belum digali" },
  { name: "Assume Breach", domain: "security", def: "Design and drill as if the attacker is already inside.", src: "Microsoft Azure security posture guidance; zero-trust literature", status: "belum digali" },
  { name: "Security Through Obscurity (anti)", domain: "security", def: "Hiding a design is not protecting it — obscurity is a known anti-pattern.", src: "OWASP; applied cryptography literature", status: "belum digali" },
  { name: "TOCTOU Awareness", domain: "security", def: "Between checking a condition and using it, the world changes — check and act atomically.", src: "Bishop & Dilger, Time-of-Check to Time-of-Use, 1996", status: "belum digali" },
  { name: "Trusted Computing Base Minimization", domain: "security", def: "Shrink the set of components that must be correct for security to hold.", src: "Saltzer & Schroeder, 1975; Rushby, 1981", status: "belum digali" },
  { name: "Authentication Factor Diversity", domain: "security", def: "Combine knowledge, possession, and inherence — one factor alone is one phish away.", src: "NIST SP 800-63B Digital Identity Guidelines", status: "belum digali" },
  { name: "Never Roll Your Own Crypto", domain: "security", def: "Use vetted primitives; inventing cryptography is how systems get broken.", src: "Folk saying; Schneier, applied cryptography commentary", status: "tidak yakin" },
  { name: "Memory Safety First", domain: "security", def: "Prefer memory-safe languages and bounds discipline for new security-critical code.", src: "MSRC security bug studies; USA OUSD memory-safety guidance, 2024-2025", status: "belum digali" },
  { name: "Fuzz Early, Fuzz Continuously", domain: "security", def: "Feed malformed inputs automatically and continuously — bugs found by fuzzers are not found by attackers.", src: "Miller et al., An Empirical Study of the Reliability of UNIX Utilities, 1990; OSS-Fuzz", status: "belum digali" },
  { name: "SBOM Provenance", domain: "security", def: "Know exactly what your software contains and where each piece came from.", src: "NTIA SBOM work; OWASP SCVS", status: "belum digali" },
  { name: "CIA Triad", domain: "security", def: "Reason about confidentiality, integrity, and availability explicitly — security trade-offs live between them.", src: "Information security literature; McCumber, 1991", status: "belum digali" },
  { name: "Vulnerability Disclosure Courtesy", domain: "security", def: "Build a kind, fast path for people who find your holes.", src: "ISO/IEC 29147 (vulnerability disclosure); coordinated disclosure practice", status: "belum digali" },

  // ===== Reliability =====
  { name: "Idempotency", domain: "reliability", def: "Re-running an operation must produce the same result as running it once.", src: "Distributed systems literature; HTTP idempotent method semantics (RFC 9110)", status: "sudah digali", href: "/docs/principles/reliability/idempotency" },
  { name: "Graceful Degradation", domain: "reliability", def: "When parts fail, the system gets worse, not dead.", src: "Fault-tolerance literature; web architecture guidance", status: "sudah digali", href: "/docs/principles/reliability/graceful-degradation" },
  { name: "Observability First", domain: "reliability", def: "If you cannot answer questions about it in production, you did not ship it.", src: "Google SRE Book, monitoring chapter, 2016", status: "sudah digali", href: "/docs/principles/reliability/observability-first" },
  { name: "Retry Budget", domain: "reliability", def: "Retries are a loan against the system — cap them and add jitter.", src: "AWS Architecture Blog, Exponential Backoff and Jitter, 2015; Google SRE Book", status: "sudah digali", href: "/docs/principles/reliability/retry-budget" },
  { name: "Blast Radius", domain: "reliability", def: "Bound the maximum damage of any single action or failure.", src: "Release engineering practice; Nygard, Release It!, 2007", status: "sudah digali", href: "/docs/principles/reliability/blast-radius" },
  { name: "Fail Visible", domain: "reliability", def: "Fail loudly and early — silent failure is the worst failure.", src: "Postel counterweight; Unix philosophy; SRE practice", status: "sudah digali", href: "/docs/principles/reliability/fail-visible" },
  { name: "End-to-End Argument", domain: "reliability", def: "Put functions at the ends that have the knowledge; the middle cannot be trusted to know.", src: "Saltzer, Reed & Clark, End-to-End Arguments in System Design, 1984", status: "belum digali" },
  { name: "Fate Sharing", domain: "reliability", def: "Things that depend on each other should fail together — state lives with its users.", src: "Cheriton & Zwaenepoel, 1989; distributed systems design folklore", status: "belum digali" },
  { name: "Circuit Breaker", domain: "reliability", def: "Stop calling a failing dependency long enough for it to recover.", src: "Nygard, Release It!, 2007", status: "belum digali" },
  { name: "Bulkhead Isolation", domain: "reliability", def: "Partition resources so one flooded compartment does not sink the ship.", src: "Nygard, Release It!, 2007 (from naval architecture)", status: "belum digali" },
  { name: "Timeout on Every Call", domain: "reliability", def: "Every outbound call gets a timeout — no exceptions, or the caller becomes the outage.", src: "Nygard, Release It!, 2007", status: "belum digali" },
  { name: "Backpressure", domain: "reliability", def: "Propagate load upstream instead of drowning downstream.", src: "Reactive streams literature; dataflow systems practice", status: "belum digali" },
  { name: "Load Shedding", domain: "reliability", def: "Reject work deliberately to stay alive — a degraded yes beats a total no.", src: "SRE practice; queueing theory admission control", status: "belum digali" },
  { name: "Watchdog Timers", domain: "reliability", def: "An independent watcher restarts the system when it stops making progress.", src: "Embedded systems practice; classic watchdog literature", status: "belum digali" },
  { name: "Hedged Requests", domain: "reliability", def: "For tail-latency-critical reads, ask a second replica before the first one straggles.", src: "Dean & Barroso, The Tail at Scale, CACM 2013", status: "belum digali" },
  { name: "Tail-Aware Design", domain: "reliability", def: "Optimize the p99, not the average — the tail is what users remember.", src: "Dean & Barroso, The Tail at Scale, CACM 2013", status: "belum digali" },
  { name: "Chaos Engineering", domain: "reliability", def: "Inject failures on purpose, in production, before nature does it for free.", src: "Basiri et al., Chaos Engineering, 2016; Netflix Chaos Team", status: "belum digali" },
  { name: "Chandy-Lamport Snapshots", domain: "reliability", def: "Consistent global state of a distributed system can be recorded without stopping it.", src: "Chandy & Lamport, Distributed Snapshots, 1985", status: "belum digali" },
  { name: "Redundant Arrays of Independent Disks", domain: "reliability", def: "Combine cheap failure-prone disks so the array survives member death.", src: "Patterson, Gibson & Katz, A Case for Redundant Arrays of Inexpensive Disks, 1988", status: "belum digali" },
  { name: "MTTR over MTBF", domain: "reliability", def: "Invest in fast recovery before rarer failure — mean time to repair is what users feel.", src: "Google SRE Book; resilience engineering literature", status: "belum digali" },
  { name: "Normal Accidents", domain: "reliability", def: "Tightly coupled complex systems produce failures nobody intended — design for containment, not just prevention.", src: "Charles Perrow, Normal Accidents, 1984", status: "belum digali" },
  { name: "Swiss Cheese Model", domain: "reliability", def: "Layers of defense each have holes; safety comes from the holes rarely lining up.", src: "James Reason, Human Error, 1990", status: "belum digali" },
  { name: "High-Reliability Organization Principles", domain: "reliability", def: "Preoccupation with failure, reluctance to simplify, sensitivity to operations, resilience, deference to expertise.", src: "Weick & Sutcliffe, Managing the Unexpected, 2001", status: "belum digali" },

  // ===== Data =====
  { name: "Tested Backups", domain: "data", def: "A backup that has never been restored is a hope, not a backup.", src: "Operations folklore codified here; GitLab 2017 postmortem", status: "sudah digali", href: "/docs/principles/data/tested-backups" },
  { name: "Soft Delete", domain: "data", def: "Make deletes reversible with a window — hard DELETE is a last resort.", src: "Systems practice; materialized in most SaaS data models", status: "sudah digali", href: "/docs/principles/data/soft-delete" },
  { name: "Append-Only Logs", domain: "data", def: "Record events immutably; derive state from history instead of erasing it.", src: "Event sourcing literature; log-structured systems heritage", status: "sudah digali", href: "/docs/principles/data/append-only-logs" },
  { name: "Expand-Contract Migrations", domain: "data", def: "Deploy schema changes in reversible steps: expand, migrate, contract.", src: "Expand/contract pattern, continuous delivery literature", status: "sudah digali", href: "/docs/principles/data/expand-contract" },
  { name: "ACID", domain: "data", def: "Atomicity, consistency, isolation, durability — the contract a transaction must keep.", src: "Gray & Reuter, Transaction Processing: Concepts and Techniques, 1993", status: "belum digali" },
  { name: "Relational Normalization", domain: "data", def: "Structure data by its dependencies so facts live once and anomalies cannot breed.", src: "E. F. Codd, A Relational Model of Data for Large Shared Data Banks, 1970", status: "belum digali" },
  { name: "Write-Ahead Logging", domain: "data", def: "Log the change before applying it — crash recovery reads the log, not your hopes.", src: "Mohan et al., ARIES, 1992", status: "belum digali" },
  { name: "Optimistic Concurrency Control", domain: "data", def: "Assume conflicts are rare; detect them at commit, then retry.", src: "Kung & Robinson, On Optimistic Methods for Concurrency Control, 1981", status: "belum digali" },
  { name: "Multiversion Concurrency", domain: "data", def: "Keep old versions so readers never block writers and writers never block readers.", src: "Reed, 1978; PostgreSQL MVCC implementation", status: "belum digali" },
  { name: "Two-Phase Commit", domain: "data", def: "Prepare everywhere, then commit everywhere — and know why it still blocks on failure.", src: "Gray, Notes on Data Base Operating Systems, 1978", status: "belum digali" },
  { name: "Saga Pattern", domain: "data", def: "Break a distributed transaction into steps with explicit compensations.", src: "Garcia-Molina & Salem, Sagas, 1987", status: "belum digali" },
  { name: "CQRS", domain: "data", def: "Model reads and writes separately when their shapes and scales diverge.", src: "Greg Young, 2010; Fowler, CQRS article", status: "belum digali" },
  { name: "Event Sourcing", domain: "data", def: "Store the events; state is a replay — audit comes free.", src: "Fowler, Event Sourcing, 2005; enterprise architecture literature", status: "belum digali" },
  { name: "Slowly Changing Dimensions", domain: "data", def: "Track how dimension attributes change over time, explicitly and typed.", src: "Kimball, The Data Warehouse Toolkit, 1996", status: "belum digali" },
  { name: "Data Quality Dimensions", domain: "data", def: "Completeness, uniqueness, timeliness, validity, accuracy, consistency — measure them or lose them.", src: "Ballou & Pazer, 1985; DAMA-DMBOK", status: "belum digali" },
  { name: "Single Source of Truth", domain: "data", def: "Each fact is mastered in exactly one place; everything else is a projection.", src: "SPOT rule, Raymond, The Art of Unix Programming; data management practice", status: "belum digali" },
  { name: "GDPR Data Minimization", domain: "data", def: "Collect only what is adequate, relevant, and necessary for the stated purpose.", src: "EU GDPR Art. 5(1)(c), 2016", status: "belum digali" },
  { name: "Purpose Limitation", domain: "data", def: "Data collected for one purpose does not silently become data for another.", src: "EU GDPR Art. 5(1)(b)", status: "belum digali" },
  { name: "Data Lineage Tracking", domain: "data", def: "Know where each datum came from and what touched it — retraceable beats believable.", src: "Data governance literature; DAMA-DMBOK", status: "belum digali" },
  { name: "Cursor Pagination", domain: "data", def: "Page with stable cursors, not offsets — offsets lie when data moves.", src: "API design practice; documented by major APIs", status: "belum digali" },

  // ===== Architecture =====
  { name: "Conway's Law", domain: "architecture", def: "System designs mirror the communication structures of the organizations that build them.", src: "Melvin Conway, How Do Committees Invent?, 1968", status: "sudah digali", href: "/docs/principles/architecture/conways-law" },
  { name: "Gall's Law", domain: "architecture", def: "Complex systems that work evolved from simple systems that worked.", src: "John Gall, Systemantics, 1975", status: "sudah digali", href: "/docs/principles/architecture/gall-law" },
  { name: "Single Responsibility", domain: "architecture", def: "One module, one actor, one reason to change.", src: "Robert C. Martin, SOLID (2000-2006)", status: "sudah digali", href: "/docs/principles/architecture/single-responsibility" },
  { name: "Dependency Inversion", domain: "architecture", def: "Depend on abstractions, not concretions — the policy outranks the mechanism.", src: "Robert C. Martin, SOLID", status: "sudah digali", href: "/docs/principles/architecture/dependency-inversion" },
  { name: "Information Hiding", domain: "architecture", def: "Module boundaries are drawn around secrets — what changes together stays together.", src: "David Parnas, On the Criteria To Be Used in Decomposing Systems into Modules, 1972", status: "belum digali" },
  { name: "Conceptual Integrity", domain: "architecture", def: "One mind (or a small set of consistent rules) governs the design; everything else serves it.", src: "Brooks, The Mythical Man-Month, 1975", status: "belum digali" },
  { name: "Second-System Effect", domain: "architecture", def: "The second system a designer builds is the most dangerous — overdesigned with borrowed confidence.", src: "Brooks, The Mythical Man-Month, 1975", status: "belum digali" },
  { name: "Plan to Throw One Away", domain: "architecture", def: "The first system teaches you what the real one needed — deliver learning, not sunk cost.", src: "Brooks, The Mythical Man-Month, 1975", status: "belum digali" },
  { name: "Law of Demeter", domain: "architecture", def: "Talk to friends only — a.b.c() couples you to a stranger's stranger.", src: "Lieberherr & Holland, Assuring Good Style for Object-Oriented Programs, 1989", status: "belum digali" },
  { name: "Hexagonal Architecture", domain: "architecture", def: "Business logic at the center, everything else a swappable adapter at a port.", src: "Alistair Cockburn, Hexagonal Architecture, 2005", status: "belum digali" },
  { name: "Clean Architecture", domain: "architecture", def: "Dependencies point inward toward stable domain logic; frameworks are details.", src: "Robert C. Martin, Clean Architecture, 2017", status: "belum digali" },
  { name: "Onion Architecture", domain: "architecture", def: "Layers around a domain core; infrastructure lives on the rim.", src: "Jeffrey Palermo, 2008", status: "belum digali" },
  { name: "Bounded Context", domain: "architecture", def: "A model is only true inside its boundary — one team's Order is another team's nightmare.", src: "Eric Evans, Domain-Driven Design, 2003", status: "belum digali" },
  { name: "Ubiquitous Language", domain: "architecture", def: "One shared vocabulary between code and domain experts, or translation errors become code errors.", src: "Eric Evans, Domain-Driven Design, 2003", status: "belum digali" },
  { name: "Monolith First", domain: "architecture", def: "Start with a monolith; split along the seams that pain reveals, not the ones fashion suggests.", src: "Martin Fowler, MonolithFirst, 2015", status: "belum digali" },
  { name: "Microservice Premium", domain: "architecture", def: "Microservices buy scale and independence at a price in complexity — pay it only when you must.", src: "Martin Fowler, MicroservicePremium, 2015", status: "belum digali" },
  { name: "Strangler Fig Migration", domain: "architecture", def: "Replace a legacy system gradually by growing a new one around it until the old trunk is unnecessary.", src: "Martin Fowler, StranglerFigApplication, 2004", status: "belum digali" },
  { name: "AKF Scale Cube", domain: "architecture", def: "Scale by cloning (x), splitting by function (y), or partitioning by customer (z) — know which axis you are on.", src: "Abbott & Keeven, The Art of Scalability, 2009", status: "belum digali" },
  { name: "Universal Scalability Law", domain: "architecture", def: "Throughput grows, then peaks, then declines as coordination and coherency overhead compound.", src: "Neil Gunther, 1993", status: "belum digali" },
  { name: "Evolutionary Architecture with Fitness Functions", domain: "architecture", def: "Make architectural goals objective and testable, then let the system evolve under them.", src: "Ford, Parsons & Kua, Building Evolutionary Architectures, 2017", status: "belum digali" },
  { name: "Acyclic Dependencies", domain: "architecture", def: "The dependency graph must stay acyclic — build order and reasoning both depend on it.", src: "Robert C. Martin, design principles for package structure", status: "belum digali" },
  { name: "Stable Dependencies Principle", domain: "architecture", def: "Depend in the direction of stability — volatility should not be upstream.", src: "Robert C. Martin, package design principles", status: "belum digali" },
  { name: "Inverse Conway Maneuver", domain: "architecture", def: "Design the team structure to produce the architecture you want, not the one you have.", src: "Skelton & Pais era discussions, ~2015", status: "tidak yakin" },
  { name: "Two-Way Door Decisions", domain: "architecture", def: "Separate reversible decisions (decide fast) from irreversible ones (decide slow).", src: "Jeff Bezos, Amazon shareholder letter, 2015-2016", status: "belum digali" },

  // ===== API =====
  { name: "Explicit Contracts", domain: "api", def: "Interfaces state what they do and what they need — precisely, in machine-checkable form.", src: "Contract-first practice; OpenAPI heritage", status: "sudah digali", href: "/docs/principles/api/explicit-contracts" },
  { name: "Hyrum's Law", domain: "api", def: "With enough users, every observable behavior will be depended on by someone.", src: "Hyrum Wright, 2012 (hyrumslaw.com)", status: "sudah digali", href: "/docs/principles/api/hyrum-law" },
  { name: "Postel's Robustness Principle", domain: "api", def: "Be conservative in what you send, liberal in what you accept — and know the modern backlash against it.", src: "Jon Postel, TCP Implementation Guide (RFC 761, 1980); critique: RFC 9225 era", status: "sudah digali", href: "/docs/principles/api/postel-robustness" },
  { name: "Versioned Contracts", domain: "api", def: "Change the contract without breaking the clients who depend on the old one.", src: "API lifecycle practice; Semantic Versioning 2.0.0, 2010", status: "sudah digali", href: "/docs/principles/api/versioned-contracts" },
  { name: "Richardson Maturity Model", domain: "api", def: "HTTP APIs climb levels: one URI, to resources, to verbs and codes, to hypermedia — know which level you are buying.", src: "Leonard Richardson, 2008; Fowler's write-ups", status: "belum digali" },
  { name: "HATEOAS", domain: "api", def: "Clients follow links the server provides instead of hard-coding the state machine.", src: "Roy Fielding, REST dissertation, 2000", status: "belum digali" },
  { name: "HTTP Method Honesty", domain: "api", def: "GET is safe and idempotent, PUT and DELETE are idempotent, POST is neither — the spec is a contract, not a suggestion.", src: "RFC 9110, HTTP Semantics", status: "belum digali" },
  { name: "Idempotency Keys", domain: "api", def: "Let clients make retries safe by naming operations with stable keys.", src: "Stripe API idempotency-key design (documented public practice)", status: "belum digali" },
  { name: "Backoff and Jitter", domain: "api", def: "Retry with exponential backoff and randomized jitter, or synchronized clients become a DDoS.", src: "AWS Architecture Blog, Exponential Backoff and Jitter, 2015", status: "belum digali" },
  { name: "Consumer-Driven Contracts", domain: "api", def: "Consumers publish their expectations; providers verify against them in CI.", src: "Ian Robinson, 2008; Pact heritage", status: "belum digali" },
  { name: "Deprecation as a Process", domain: "api", def: "Sunsetting an API surface is a communicated lifecycle with dates and migration paths, not a deletion.", src: "Google API deprecation policy; platform engineering practice", status: "belum digali" },
  { name: "Rate Limiting by Default", domain: "api", def: "Public capacity must be bounded — limits protect both sides and must be stated.", src: "API platform practice; rate-limit header RFC drafts", status: "belum digali" },
  { name: "API-First Design", domain: "api", def: "Design the interface and its documentation before the implementation, and keep them in sync.", src: "OpenAPI/contract-first practice", status: "belum digali" },
  { name: "Semantic Versioning", domain: "api", def: "MAJOR.MINOR.PATCH communicates breaking, additive, and fix changes mechanically.", src: "Tom Preston-Werner, Semantic Versioning 2.0.0, 2010", status: "belum digali" },
  { name: "Design for Pagination from Day One", domain: "api", def: "Every collection endpoint will be too big someday — paginate before it is.", src: "API design practice across major platforms", status: "belum digali" },
  { name: "Errors Are Part of the Interface", domain: "api", def: "Error responses are consumed by programs — make them structured, typed, and documented.", src: "RFC 9457, Problem Details for HTTP APIs (formerly 7807)", status: "belum digali" },

  // ===== Design =====
  { name: "Keep It Simple", domain: "design", def: "Choose the simplest design that works — every moving part is a part someone must debug.", src: "Engineering folklore; Kelly Johnson's Skunk Works maxim (KISS)", status: "sudah digali", href: "/docs/principles/design/kiss" },
  { name: "DRY Tension", domain: "design", def: "Duplication is cheaper than the wrong abstraction — knowledge, not text, is what must be singular.", src: "Hunt & Thomas, The Pragmatic Programmer, 1999", status: "sudah digali", href: "/docs/principles/design/dry-tension" },
  { name: "YAGNI", domain: "design", def: "You are not gonna need it — capability without a present requirement is pure liability.", src: "Extreme Programming, Kent Beck & others, c. 1998-2004", status: "sudah digali", href: "/docs/principles/design/yagni" },
  { name: "Least Astonishment", domain: "design", def: "The behavior that surprises the fewest maintainers is the correct one.", src: "POLS/PLA; Raymond, Rule of Least Surprise, Art of Unix Programming", status: "sudah digali", href: "/docs/principles/design/least-astonishment" },
  { name: "Chesterton's Fence", domain: "design", def: "Do not remove a fence until you know why it was put there.", src: "G. K. Chesterton, The Thing, 1929", status: "sudah digali", href: "/docs/principles/design/chesterton-fence" },
  { name: "Goodhart's Law", domain: "design", def: "When a measure becomes a target, it stops being a good measure.", src: "Charles Goodhart, 1975; popular phrasing by Marilyn Strathern, 1997", status: "sudah digali", href: "/docs/principles/design/goodharts-law" },
  { name: "Campbell's Law", domain: "design", def: "The more a quantitative indicator is used for decisions, the more it is corrupted by the pressure.", src: "Donald T. Campbell, 1976", status: "belum digali" },
  { name: "Law of Leaky Abstractions", domain: "design", def: "All non-trivial abstractions leak — the layer below shows through eventually.", src: "Joel Spolsky, The Law of Leaky Abstractions, 2002", status: "belum digali" },
  { name: "Occam's Razor", domain: "design", def: "Among competing explanations, prefer the one with the fewest assumptions — including in incident analysis.", src: "William of Ockham, 14th century; applied in debugging practice", status: "belum digali" },
  { name: "Hanlon's Razor", domain: "design", def: "Never attribute to malice what incompetence, exhaustion, or a race condition explains.", src: "Folk aphorism (Robert Heinlein variant); applied to incident culture", status: "tidak yakin" },
  { name: "Lindy Effect", domain: "design", def: "The longer an idea or dependency has survived, the longer it is likely to keep surviving.", src: "Term: Goldstein, 1964; popularized by Taleb, Antifragile, 2012", status: "belum digali" },
  { name: "Conservation of Complexity (Tesler's Law)", domain: "design", def: "Complexity does not disappear; it moves — decide deliberately who pays it: the system or the user.", src: "Larry Tesler, attributed; HCI lore", status: "tidak yakin" },
  { name: "Rule of Three", domain: "design", def: "Tolerate duplication twice; abstract the third time, when the pattern is real.", src: "Fowler, Refactoring; Martin, Clean Code", status: "belum digali" },
  { name: "Principle of Least Knowledge", domain: "design", def: "Know as little about your collaborators as the work allows.", src: "Lieberherr & Holland, 1989 (Demeter)", status: "belum digali" },
  { name: "Worse is Better", domain: "design", def: "Simple, shippable, imperfect systems can beat correct-but-unshipped ones in the market and in evolution.", src: "Richard Gabriel, Lisp lore, 1989-1991", status: "belum digali" },
  { name: "Wirth's Law", domain: "design", def: "Software gets slower faster than hardware gets faster — efficiency is not automatically won by waiting.", src: "Niklaus Wirth, A Plea for Lean Software, 1995", status: "belum digali" },
  { name: "Shirky Principle", domain: "design", def: "Institutions try to preserve the problem to which they are the solution — audit your own incentives.", src: "Clay Shirky (named by Kevin Kelly), 2009", status: "belum digali" },
  { name: "Zen of Python", domain: "design", def: "Nineteen aphorisms — beautiful is better than ugly; explicit beats implicit; readability counts; refuse the temptation to guess.", src: "Tim Peters, PEP 20, 2004", status: "belum digali" },
  { name: "Rule of Silence", domain: "design", def: "When a program has nothing to say, it should say nothing — noise trains people to ignore output.", src: "Raymond, Art of Unix Programming, 2003", status: "belum digali" },
  { name: "Rule of Repair", domain: "design", def: "Design for clean failure at the boundaries; when something must break, let it break loudly and locally.", src: "Raymond, Art of Unix Programming, 2003", status: "belum digali" },
  { name: "Rule of Representation", domain: "design", def: "Fold knowledge into data so programs can be simple and dumb.", src: "Raymond, Art of Unix Programming, 2003", status: "belum digali" },
  { name: "Rule of Generation", domain: "design", def: "Generate boilerplate instead of copying it — code that writes code stays consistent.", src: "Raymond, Art of Unix Programming, 2003", status: "belum digali" },
  { name: "Rule of Diversity", domain: "design", def: "Distrust all claims of the one true way — heterogeneity survives surprises.", src: "Raymond, Art of Unix Programming, 2003", status: "belum digali" },
  { name: "Composition over Inheritance", domain: "design", def: "Assemble behavior from parts rather than growing it down a class hierarchy.", src: "Gamma et al., Design Patterns, 1994; Effective Java lineage", status: "belum digali" },
  { name: "Program to an Interface", domain: "design", def: "Clients depend on the abstraction; the implementation is a replaceable detail.", src: "Gamma et al., Design Patterns, 1994", status: "belum digali" },
  { name: "Hollywood Principle", domain: "design", def: "Don't call us, we'll call you — frameworks own the flow, components react.", src: "OO framework literature (IoC), Foote & Yoder", status: "belum digali" },
  { name: "Separation of Concerns", domain: "design", def: "Divide the problem so each piece has one nature — then compose.", src: "Dijkstra, On the role of scientific thought, 1974", status: "belum digali" },

  // ===== Testing =====
  { name: "Test Pyramid", domain: "testing", def: "Many fast unit tests, fewer integration tests, few end-to-end tests — shape it by cost and feedback speed.", src: "Mike Cohn, Succeeding with Agile, 2009", status: "belum digali" },
  { name: "F.I.R.S.T. Tests", domain: "testing", def: "Tests must be Fast, Independent, Repeatable, Self-validating, and Timely.", src: "Tim Ottinger; popularized in Martin, Clean Code, ch. 8", status: "tidak yakin" },
  { name: "Arrange-Act-Assert", domain: "testing", def: "Given-When-Then structure makes tests read as little specifications.", src: "xUnit patterns lineage; Meszaros, xUnit Test Patterns, 2007", status: "belum digali" },
  { name: "Test Behavior, Not Implementation", domain: "testing", def: "Tests that mirror the internals break on every refactor and protect nothing.", src: "Testing literature across London/Detroit schools", status: "belum digali" },
  { name: "Defect Clustering", domain: "testing", def: "A small number of modules usually holds most of the defects — hunt where the kills happened.", src: "Myers, The Art of Software Testing, 1979", status: "belum digali" },
  { name: "Pesticide Paradox", domain: "testing", def: "The same tests stop finding new bugs — keep mutating the suite.", src: "Myers, 1979; Bach & Bolton commentary", status: "belum digali" },
  { name: "Absence-of-Errors Fallacy", domain: "testing", def: "A system can pass every test and still be useless — verification is not validation.", src: "ISTQB foundation syllabus; software quality literature", status: "belum digali" },
  { name: "Legacy Code Is Untested Code", domain: "testing", def: "The definition of legacy is the absence of tests — and the cure is seams, not rewrites.", src: "Michael Feathers, Working Effectively with Legacy Code, 2004", status: "belum digali" },
  { name: "Mutation Testing", domain: "testing", def: "Measure the suite by how many seeded defects it catches — coverage measures execution, not detection.", src: "DeMillo, Lipton & Sayward, Hints on Test Data Selection, 1978", status: "belum digali" },
  { name: "Property-Based Testing", domain: "testing", def: "State invariants, let the tool generate inputs — find the cases you would never write.", src: "Claessen & Hughes, QuickCheck, 2000", status: "belum digali" },
  { name: "Contract Testing", domain: "testing", def: "Verify the promises between services independently of end-to-end environments.", src: "Pact lineage; consumer-driven contracts practice", status: "belum digali" },
  { name: "Test Doubles Taxonomy", domain: "testing", def: "Stub, spy, mock, fake — pick the double by what you verify, not by what the framework makes easy.", src: "Meszaros, xUnit Test Patterns, 2007", status: "belum digali" },
  { name: "Don't Mock What You Don't Own", domain: "testing", def: "Wrap third-party APIs behind your own interface; mock only your side of the seam.", src: "Freeman & Pryce, Growing Object-Oriented Software, 2009", status: "belum digali" },
  { name: "Flaky Test Quarantine", domain: "testing", def: "A flaky test is a broken test — quarantine it loudly or it will teach the team to ignore red.", src: "Google Testing Blog, flaky tests series", status: "belum digali" },
  { name: "Boundary Value Analysis", domain: "testing", def: "Defects cluster at the edges of equivalence classes — test the fence posts.", src: "Myers, 1979; ISTQB", status: "belum digali" },
  { name: "Shift Left", domain: "testing", def: "Move verification earlier in the lifecycle — defects get costlier downstream.", src: "Software quality economics; Boehm's defect cost curve, 1981", status: "belum digali" },
  { name: "Chaos Days / Game Days", domain: "testing", def: "Rehearse failure as a team, on a schedule, with notes — incidents should be your second time.", src: "Netflix; SRE practice literature", status: "belum digali" },
  { name: "Golden Master Testing", domain: "testing", def: "Pin current behavior with characterization tests before changing anything.", src: "Feathers, 2004; approval testing lineage", status: "belum digali" },

  // ===== Operations & SRE =====
  { name: "Error Budgets", domain: "ops", def: "The allowed unreliability is a budget — spend it on features, and stop when it is empty.", src: "Google SRE Book, 2016", status: "belum digali" },
  { name: "SLOs over SLAs", domain: "ops", def: "Define the reliability objective you actually intend, measure it, and let it drive priorities.", src: "Google SRE Book; SRE Workbook, 2018", status: "belum digali" },
  { name: "Toil Elimination", domain: "ops", def: "Manual, repetitive, automatable, tactical work has a named cost — measure and reduce it.", src: "Google SRE Book, Eliminating Toil, 2016", status: "belum digali" },
  { name: "Blameless Postmortems", domain: "ops", def: "Incidents come from systems, not villains — punishment hides the evidence.", src: "Google SRE Book; Etsy, blameless postmortems, 2012+", status: "belum digali" },
  { name: "You Build It, You Run It", domain: "ops", def: "The team that ships the code carries the pager for it — ownership shapes design.", src: "Werner Vogels, ACM Queue, 2006", status: "belum digali" },
  { name: "Everything Fails All the Time", domain: "ops", def: "Design for component failure as the normal case, not the exception.", src: "Werner Vogels, ACM Queue, 2006", status: "belum digali" },
  { name: "Canary Releases", domain: "ops", def: "Ship to a small slice, watch, then widen — incremental blast radius by default.", src: "Release engineering practice; documented across large platforms", status: "belum digali" },
  { name: "Blue-Green Deployment", domain: "ops", def: "Keep two switchable environments; deploy to the idle one and flip traffic.", src: "Continuous delivery literature; Humble & Farley, 2010", status: "belum digali" },
  { name: "Feature Flags", domain: "ops", def: "Decouple deploy from release; light the feature up when it is ready, for whom it is ready.", src: "Continuous delivery literature; Humble, 2010", status: "belum digali" },
  { name: "Trunk-Based Development", domain: "ops", def: "Small, merged-fast changes on one mainline — long-lived branches are risk storage.", src: "DORA research; Accelerate, 2018", status: "belum digali" },
  { name: "DORA Four Keys", domain: "ops", def: "Deployment frequency, lead time, change-fail rate, time-to-restore — measure delivery, manage delivery.", src: "Forsgren, Humble & Kim, Accelerate, 2018", status: "belum digali" },
  { name: "Alert on Symptoms, Not Causes", domain: "ops", def: "Page on what users feel; let causes be dashboarded, not paged.", src: "Rob Ewaschuk, Google SRE alerting chapter", status: "belum digali" },
  { name: "Runbooks Are Code", domain: "ops", def: "Every page-worthy alert has a written, versioned, rehearsed response path.", src: "SRE practice; incident response literature", status: "belum digali" },
  { name: "Automation as Force Multiplier", domain: "ops", def: "Automate what is mechanical, but keep the human accountable for the irreversible.", src: "Google SRE Book, automation chapters", status: "belum digali" },
  { name: "Incident Command System", domain: "ops", def: "Roles, communication channels, and a written timeline — improvising structure during fire is how small fires become big.", src: "Firefighting ICS adapted to tech; SRE practice", status: "belum digali" },
  { name: "Operational Readiness Review", domain: "ops", def: "A service earns production the way a ship earns sea — checklists before launch, not after.", src: "SRE practice; pre-mortem lineage", status: "belum digali" },
  { name: "USE Method", domain: "ops", def: "For every resource: check Utilization, Saturation, Errors.", src: "Brendan Gregg, 2012", status: "belum digali" },
  { name: "RED Method", domain: "ops", def: "For every service: watch Rate, Errors, Duration.", src: "Tom Wilcox, 2018; popularized by Grafana", status: "belum digali" },

  // ===== Distributed Systems =====
  { name: "CAP Theorem", domain: "distributed", def: "Under a network partition, a distributed system must choose between consistency and availability.", src: "Eric Brewer, 2000; formalized by Gilbert & Lynch, 2002", status: "belum digali" },
  { name: "PACELC", domain: "distributed", def: "Extend CAP: even without partitions, choose between latency and consistency.", src: "Daniel Abadi, 2012", status: "belum digali" },
  { name: "Fallacies of Distributed Computing", domain: "distributed", def: "Eight comfortable assumptions (reliable network, zero latency, infinite bandwidth, ...) — all false.", src: "Peter Deutsch (and colleagues at Sun), 1994-1997", status: "belum digali" },
  { name: "FLP Impossibility", domain: "distributed", def: "No deterministic consensus can terminate under even one crashed process with an asynchronous network.", src: "Fischer, Lynch & Paterson, 1985", status: "belum digali" },
  { name: "Byzantine Fault Tolerance", domain: "distributed", def: "Consensus is achievable even with lying or arbitrary nodes, if enough honest ones remain.", src: "Lamport, Shostak & Pease, The Byzantine Generals Problem, 1982", status: "belum digali" },
  { name: "Quorum Systems", domain: "distributed", def: "Any majority overlaps any other majority — read and write quorums can never miss each other.", src: "Gifford, Weighted Voting for Replicated Data, 1979", status: "belum digali" },
  { name: "Happens-Before", domain: "distributed", def: "A partial order over events — without it, 'earlier' is a typo.", src: "Leslie Lamport, Time, Clocks, and the Ordering of Events, 1978", status: "belum digali" },
  { name: "Vector Clocks", domain: "distributed", def: "Track causality, not time — wall clocks do not order events across machines.", src: "Lamport 1978 lineage; Parker et al., 1983", status: "belum digali" },
  { name: "CRDTs", domain: "distributed", def: "Data structures whose merges always converge — coordination without consensus.", src: "Shapiro et al., Conflict-free Replicated Data Types, 2011", status: "belum digali" },
  { name: "Exactly-Once Is a Lie", domain: "distributed", def: "Delivery can be at-least-once or at-most-once; 'exactly once' is an effect you build out of idempotency.", src: "Kafka documentation semantics discussion; distributed systems folklore", status: "belum digali" },
  { name: "Split-Brain Avoidance", domain: "distributed", def: "Two masters writing the same state is a design failure — quorums, fencing, or single ownership.", src: "Distributed storage literature; fencing-token guidance in Kafka docs", status: "belum digali" },
  { name: "Gossip Protocols", domain: "distributed", def: "Spread state the way rumors spread — eventually, without a coordinator.", src: "Demers et al., Epidemic Algorithms for Replicated Database Maintenance, 1987", status: "belum digali" },
  { name: "Leadership Election", domain: "distributed", def: "One node acts as coordinator at a time; elections survive the coordinator's death.", src: "Bully/Ring algorithms; Raft's elections (Ongaro & Ousterhout, 2014)", status: "belum digali" },
  { name: "Paxos", domain: "distributed", def: "Consensus on a single value despite crashes — simple to state, famously hard to implement.", src: "Leslie Lamport, The Part-Time Parliament, 1998", status: "belum digali" },
  { name: "Raft Understandability", domain: "distributed", def: "A consensus algorithm designed for comprehensibility as a first-class goal.", src: "Ongaro & Ousterhout, In Search of an Understandable Consensus Algorithm, 2014", status: "belum digali" },
  { name: "CALM Theorem", domain: "distributed", def: "A program can be consistent without coordination if and only if it is monotonic.", src: "Hellerstein & Alvaro, Keeping CALM, 2020", status: "belum digali" },
  { name: "Linearizability", domain: "distributed", def: "Operations appear instantaneously and in order — the strongest single-object consistency you can sell.", src: "Herlihy & Wing, 1990", status: "belum digali" },
  { name: "Sequential Consistency", domain: "distributed", def: "Every process sees one order — but the order need not match wall-clock time.", src: "Leslie Lamport, 1979", status: "belum digali" },
  { name: "Two Generals' Problem", domain: "distributed", def: "Reliable delivery over an unreliable channel is impossible — design around acknowledgments being lies.", src: "Classic result; Akkoyunlu et al. 1975; Gray, 1978", status: "belum digali" },
  { name: "Distributed Monolith (anti)", domain: "distributed", def: "Splitting a system physically while keeping synchronous coupling is the worst of both worlds.", src: "Architecture critique practice; microservices literature", status: "belum digali" },

  // ===== Performance =====
  { name: "Premature Optimization", domain: "performance", def: "Optimize the small percentage identified by measurement — before that, clarity wins.", src: "Knuth, Structured Programming with go to Statements, 1974 (root of all evil quote)", status: "belum digali" },
  { name: "Measure Before Optimizing", domain: "performance", def: "Profile first; the bottleneck is never where the intuition says it is.", src: "Performance engineering practice; Bentley, Writing Efficient Programs, 1982", status: "belum digali" },
  { name: "Locality of Reference", domain: "performance", def: "Exploit temporal and spatial locality — caches work because code and data cluster.", src: "Denning, The Working Set Model, 1968", status: "belum digali" },
  { name: "Amortized Analysis", domain: "performance", def: "Average cost over a sequence, not per call — the dynamic array push is O(1) amortized, not lucky.", src: "Tarjan, Amortized Complexity, 1985", status: "belum digali" },
  { name: "90-90 Rule", domain: "performance", def: "The first 90% of the code takes 90% of the time; the remaining 10% takes the other 90%.", src: "Tom Cargill (Bell Labs), via Knuth, 1986-1995", status: "tidak yakin" },
  { name: "Amdahl's Law", domain: "performance", def: "Speedup is capped by the serial fraction — parallelism cannot fix the sequential core.", src: "Gene Amdahl, 1967", status: "belum digali" },
  { name: "Gustafson's Law", domain: "performance", def: "Scale the problem with the processors and the picture changes — big compute changes the workload.", src: "John Gustafson, 1988", status: "belum digali" },
  { name: "Little's Law", domain: "performance", def: "Concurrency equals throughput times latency — queues obey it, always, everywhere.", src: "John Little, 1961", status: "belum digali" },
  { name: "Universal Latency Psychology", domain: "performance", def: "Perceived responsiveness is psychological — response under a few hundred milliseconds feels instantaneous.", src: "Doherty & Thadani, IBM research on transaction response time, 1982; Miller, 1968", status: "belum digali" },
  { name: "Performance Budgets", domain: "performance", def: "Treat size and speed like money — allocate, enforce in CI, and review spending.", src: "Web performance practice (Kadlec, performance budgets)", status: "belum digali" },
  { name: "RUM over Synthetic (and both)", domain: "performance", def: "Lab data is reproducible; field data is real — decide with both.", src: "Web performance practice; Core Web Vitals methodology", status: "belum digali" },
  { name: "Critical Path Discipline", domain: "performance", def: "Render the minimum blocking path first; everything else waits politely.", src: "Critical rendering path, web performance engineering", status: "belum digali" },

  // ===== Accessibility =====
  { name: "POUR", domain: "accessibility", def: "Content must be Perceivable, Operable, Understandable, Robust — the four WCAG principles.", src: "W3C WCAG 2.2", status: "belum digali" },
  { name: "Design to the Standard, Test with People", domain: "accessibility", def: "Conformance criteria are the floor; disabled users' feedback is the proof.", src: "WCAG; accessibility practice (include disabled users in testing)", status: "belum digali" },
  { name: "Semantic HTML First", domain: "accessibility", def: "The right element is the right accessibility — divs with click handlers are screen-reader deserts.", src: "Web accessibility practice; ARIA Authoring Practices Guide", status: "belum digali" },
  { name: "ARIA Is a Last Resort", domain: "accessibility", def: "First rule of ARIA: don't use ARIA if a native element exists.", src: "W3C ARIA Authoring Practices Guide (first rule of ARIA)", status: "belum digali" },
  { name: "Keyboard or It Doesn't Exist", domain: "accessibility", def: "Every interaction reachable and operable by keyboard, or it is unavailable to real people.", src: "WCAG 2.1.1; keyboard accessibility practice", status: "belum digali" },
  { name: "Focus Must Be Visible", domain: "accessibility", def: "Never remove the focus indicator without replacing it with something better.", src: "WCAG 2.4.7", status: "belum digali" },
  { name: "Respect prefers-reduced-motion", domain: "accessibility", def: "Animation that ignores the operating system's motion setting is a health hazard for some users.", src: "CSS Media Queries Level 5; WCAG 2.3.3 (AAA guidance)", status: "belum digali" },
  { name: "Contrast Is Compulsory", domain: "accessibility", def: "Text contrast must meet the minimum ratio — aesthetics do not outrank readability.", src: "WCAG 1.4.3 (AA)", status: "belum digali" },
  { name: "Alt Text Describes Function", domain: "accessibility", def: "Describe the meaning, not the pixels — decorative images announce themselves as noise.", src: "WCAG 1.1.1; alt decision trees", status: "belum digali" },
  { name: "Accessibility Is a Requirement, Not a Feature", domain: "accessibility", def: "Retrofitting access is expensive; building it in is cheap — the curb-cut applies to software.", src: "Curb-cut effect literature; Section 508, EN 301 549", status: "belum digali" },

  // ===== UX =====
  { name: "Fitts's Law", domain: "ux", def: "Acquisition time grows with distance and shrinks with target size — put the button where the hand is.", src: "Paul Fitts, 1954", status: "belum digali" },
  { name: "Hick's Law", domain: "ux", def: "Decision time grows with the number and complexity of choices — curate.", src: "William Hick & Ray Hyman, 1952", status: "belum digali" },
  { name: "Jakob's Law", domain: "ux", def: "Users spend most of their time on other sites — yours wins by matching their expectations.", src: "Jakob Nielsen, 2000", status: "belum digali" },
  { name: "Miller's Law (and its misuse)", domain: "ux", def: "Working memory holds a handful of chunks — and the exact number was never a design rule.", src: "George Miller, The Magical Number Seven, 1956 (often misapplied)", status: "belum digali" },
  { name: "Visibility of System Status", domain: "ux", def: "The system should always show what is going on — waiting without feedback feels broken.", src: "Nielsen, 10 Usability Heuristics, 1994", status: "belum digali" },
  { name: "Match the Real World", domain: "ux", def: "Speak the user's language, not the system's — metaphors earn comprehension.", src: "Nielsen heuristics, 1994", status: "belum digali" },
  { name: "User Control and Freedom", domain: "ux", def: "Undo, redo, and escape hatches — users explore when mistakes are reversible.", src: "Nielsen heuristics, 1994", status: "belum digali" },
  { name: "Consistency and Standards", domain: "ux", def: "Platform conventions exist so users arrive trained — deviation needs a reason.", src: "Nielsen heuristics, 1994", status: "belum digali" },
  { name: "Error Prevention over Error Messages", domain: "ux", def: "The best error UI is the one the user never sees — constrain and confirm.", src: "Nielsen heuristics, 1994", status: "belum digali" },
  { name: "Recognition over Recall", domain: "ux", def: "Show options instead of demanding memory — recognition is cheap, recall is expensive.", src: "Nielsen heuristics, 1994; cognitive psychology", status: "belum digali" },
  { name: "Progressive Disclosure", domain: "ux", def: "Show what is needed now; reveal the rest on demand — complexity in reserve.", src: "Nielsen, 2006; design practice", status: "belum digali" },
  { name: "Aesthetic-Usability Effect", domain: "ux", def: "Beautiful interfaces are perceived as easier — use the effect, don't be fooled by it.", src: "Kurosu & Kashimura, 1995; Nielsen Norman Group write-ups", status: "belum digali" },
  { name: "Peak-End Rule", domain: "ux", def: "Experiences are remembered by their peak and their end — design the ending deliberately.", src: "Kahneman et al., 1993", status: "belum digali" },
  { name: "Serial Position Effect", domain: "ux", def: "First and last items are remembered; the middle dissolves — order lists accordingly.", src: "Ebbinghaus lineage; Murdock, 1962", status: "belum digali" },
  { name: "Von Restorff Effect", domain: "ux", def: "The item that differs is the item remembered — make the important thing the different thing.", src: "Hedwig von Restorff, 1933", status: "belum digali" },
  { name: "Affordances and Signifiers", domain: "ux", def: "Objects communicate their use — when they fail to, add visible signifiers.", src: "Norman, The Design of Everyday Things, 1988 (2013 revision)", status: "belum digali" },
  { name: "Feedback Within Human Timescales", domain: "ux", def: "Acknowledge input instantly; for long waits, communicate progress and offer freedom.", src: "Nielsen response-time lenses; Norman feedback principles", status: "belum digali" },
  { name: "Conceptual Models", domain: "ux", def: "Users build a model of the system — design the model, or they will invent one.", src: "Norman, The Design of Everyday Things", status: "belum digali" },
  { name: "Don't Make Me Think", domain: "ux", def: "Every moment of cognitive decoding is friction — clarity beats cleverness.", src: "Steve Krug, Don't Make Me Think, 2000", status: "belum digali" },

  // ===== Humans & Teams =====
  { name: "Brooks's Law", domain: "humans", def: "Adding people to a late software project makes it later.", src: "Brooks, The Mythical Man-Month, 1975", status: "belum digali" },
  { name: "The Mythical Man-Month", domain: "humans", def: "Men and months are not interchangeable — work that communicates cannot be divided like wheat.", src: "Brooks, 1975", status: "belum digali" },
  { name: "Parkinson's Law", domain: "humans", def: "Work expands to fill the time available — deadlines are design constraints.", src: "Cyril Northcote Parkinson, The Economist, 1955", status: "belum digali" },
  { name: "Hofstadter's Law", domain: "humans", def: "It always takes longer than you expect, even when you account for this law.", src: "Douglas Hofstadter, Gödel, Escher, Bach, 1979", status: "belum digali" },
  { name: "Planning Fallacy", domain: "humans", def: "Humans predict best-case durations while believing they predict realistic ones — reference class forecasting corrects it.", src: "Kahneman & Tversky, 1979; Flyvbjerg, 2002+", status: "belum digali" },
  { name: "Parkinson's Law of Triviality", domain: "humans", def: "Committees spend disproportionate energy on trivial, understandable items — the bike shed.", src: "C. N. Parkinson, 1957", status: "belum digali" },
  { name: "Psychological Safety", domain: "humans", def: "Teams learn and report failures when interpersonal risk is safe — performance follows.", src: "Edmondson, 1999; Google Project Aristotle, 2016", status: "belum digali" },
  { name: "Cognitive Load as an Organizing Principle", domain: "humans", def: "Limit each team to the cognitive load it can actually hold — team topologies follow.", src: "Skelton & Pais, Team Topologies, 2019", status: "belum digali" },
  { name: "Dunbar's Number", domain: "humans", def: "Relationship layers cap at roughly 150 — communication structure has hard limits.", src: "Robin Dunbar, 1992", status: "belum digali" },
  { name: "Communication Path Explosion", domain: "humans", def: "n people means n(n-1)/2 channels — coordination cost compounds faster than headcount.", src: "Brooks, 1975; organizational design literature", status: "belum digali" },
  { name: "Technical Debt as Metaphor", domain: "humans", def: "Shipping today's shortcut borrows tomorrow's velocity — interest compounds until you pay principal.", src: "Ward Cunningham, OOPSLA experience report, 1992; Fowler's debt quadrant, 2009", status: "belum digali" },
  { name: "Boy Scout Rule", domain: "humans", def: "Leave the code a little cleaner than you found it — every visit pays a little principal.", src: "Robert C. Martin, Clean Code, 2008 (scouting maxim, 1908)", status: "belum digali" },
  { name: "Cunningham's Law of Answers", domain: "humans", def: "The best way to get a correct answer online is to post a wrong one — knowledge flows to corrections.", src: "Folk attribution to Ward Cunningham", status: "tidak yakin" },
  { name: "Linus's Law", domain: "humans", def: "Given enough eyeballs, all bugs are shallow — review depth is defect death.", src: "Eric Raymond, The Cathedral and the Bazaar, 1997 (in homage to Torvalds)", status: "belum digali" },
  { name: "Conway's Reverse Risk", domain: "humans", def: "Ignore Conway's law and the org chart will design your system anyway — and badly.", src: "Organizational design literature; Conway, 1968", status: "belum digali" },
  { name: "Two-Pizza Team Size", domain: "humans", def: "Keep teams small enough to feed with two pizzas — communication overhead scales quadratically.", src: "Amazon lore, widely reported", status: "tidak yakin" },
  { name: "Fundamental Attribution Error in Incidents", domain: "humans", def: "We blame people and ignore systems; almost always, the system handed the person the failure.", src: "Attribution psychology (Ross, 1977); blameless postmortem culture", status: "belum digali" },

  // ===== Privacy =====
  { name: "Privacy by Design", domain: "privacy", def: "Privacy is an architectural property, not a compliance layer bolted on at the end.", src: "Ann Cavoukian, 7 Foundational Principles, 2009; GDPR Art. 25", status: "belum digali" },
  { name: "Privacy as the Default", domain: "privacy", def: "The no-settings configuration must already be the private one.", src: "Cavoukian, principle 2; GDPR data protection by default", status: "belum digali" },
  { name: "Full Functionality (Positive-Sum)", domain: "privacy", def: "Privacy and utility are not a zero-sum trade — embedded design finds both.", src: "Cavoukian, principle 4", status: "belum digali" },
  { name: "End-to-End Security", domain: "privacy", def: "Protect data across its whole lifecycle — collection to destruction, not just transit.", src: "Cavoukian, principle 5", status: "belum digali" },
  { name: "Visibility and Transparency", domain: "privacy", def: "Stakeholders can verify privacy claims — no dark patterns behind the curtain.", src: "Cavoukian, principle 6", status: "belum digali" },
  { name: "Differential Privacy", domain: "privacy", def: "Query answers that barely change when any one person's data changes — usefulness with a provable leakage bound.", src: "Cynthia Dwork, 2006", status: "belum digali" },
  { name: "k-Anonymity", domain: "privacy", def: "Every released record is indistinguishable from k-1 others — and the pitfalls are instructive.", src: "Latanya Sweeney, 2002", status: "belum digali" },
  { name: "Consent Must Be Free", domain: "privacy", def: "Consent extracted by friction or force majeure is not consent.", src: "GDPR Art. 4(11), 7; dark patterns research (Gray et al.)", status: "belum digali" },
  { name: "Data Retention Limits", domain: "privacy", def: "Keep data only as long as necessary for the stated purpose — then delete, provably.", src: "GDPR Art. 5(1)(e), storage limitation", status: "belum digali" },
  { name: "Least Data Interface", domain: "privacy", def: "Interfaces should reveal the minimum personal data needed for the interaction at hand.", src: "Privacy UX practice; data minimization applied to display", status: "belum digali" },
  { name: "Proportionality", domain: "privacy", def: "The intrusiveness of a data practice must be justified by the value of its stated purpose.", src: "Privacy impact assessment practice; GDPR proportionality doctrine", status: "belum digali" },
  { name: "Right to Deletion Must Actually Work", domain: "privacy", def: "A deletion right that leaves copies in backups, logs, and downstream systems is marketing.", src: "GDPR Art. 17 engineering reality; systems practice", status: "belum digali" },

  // ===== Concurrency =====
  { name: "Happens-Before Discipline", domain: "concurrency", def: "Ordering must be established, not assumed — every shared access needs a synchronization edge.", src: "Lamport, 1978", status: "belum digali" },
  { name: "Mutual Exclusion", domain: "concurrency", def: "Critical sections need a lock-like mechanism — and the question is always scope and granularity.", src: "Dijkstra, Cooperating Sequential Processes / semaphores, 1965", status: "belum digali" },
  { name: "Share Memory by Communicating", domain: "concurrency", def: "Do not communicate by sharing memory; share memory by communicating.", src: "Go proverbs (channel philosophy, CSP lineage — Hoare, 1978)", status: "belum digali" },
  { name: "Two-Phase Locking", domain: "concurrency", def: "Grow locks, then shrink — the classic serializability recipe with the deadlock tax to know.", src: "Eswaran et al., The Notion of Consistency and Predicate Locks, 1976", status: "belum digali" },
  { name: "Lock Ordering Discipline", domain: "concurrency", def: "Acquire locks in a global order, or deadlock is scheduled, not accidental.", src: "Systems programming practice (documented across OS literature)", status: "belum digali" },
  { name: "Optimistic Concurrency", domain: "concurrency", def: "Proceed and validate at commit — when conflicts are rare, locking wastes more than retrying.", src: "Kung & Robinson, 1981", status: "belum digali" },
  { name: "Compare-and-Swap Thinking", domain: "concurrency", def: "Lock-free structures rest on atomic conditional writes — and on accepting retry loops.", src: "Herlihy & Shavit, The Art of Multiprocessor Programming, 2008", status: "belum digali" },
  { name: "Sequential Consistency as a Baseline", domain: "concurrency", def: "Know which memory model you are programming against — weaker models reorder your intuitions.", src: "Lamport, 1979; Adve & Gharachorloo, 1996", status: "belum digali" },
  { name: "Structured Concurrency", domain: "concurrency", def: "Child tasks share the parent's lifetime — cancelation and errors propagate, not leak.", src: "Nathaniel Smith, 2017; modern implementations (Kotlin, Swift, Trio)", status: "belum digali" },
  { name: "Avoid False Sharing", domain: "concurrency", def: "Independent variables on one cache line serialize each other — layout is a concurrency decision.", src: "Multiprocessor performance literature (canonical in systems texts)", status: "belum digali" },
  { name: "Race Conditions Live at the Edges", domain: "concurrency", def: "Check-then-act is a two-step dance on shared state — close the gap or lose the race.", src: "Java Concurrency in Practice lineage (Goetz et al., 2006)", status: "belum digali" },
  { name: "CSP Process Composition", domain: "concurrency", def: "Model concurrency as message-passing processes composed like pipes.", src: "Tony Hoare, Communicating Sequential Processes, 1978", status: "belum digali" },

  // ===== AI & ML Systems =====
  { name: "Garbage In, Garbage Out", domain: "aiml", def: "Model quality is bounded by data quality — no architecture rescues poisoned inputs.", src: "Computing folklore; data-centric AI practice (Ng et al., 2021+)", status: "belum digali" },
  { name: "Hidden Technical Debt in ML Systems", domain: "aiml", def: "The ML model is the small box in the corner — pipelines, glue, and feedback loops are the debt.", src: "Sculley et al., NeurIPS, 2015", status: "belum digali" },
  { name: "Rules of Machine Learning", domain: "aiml", def: "Start simple, ship the data pipeline first, avoid pipeline jungles, and know when not to use ML.", src: "Martin Zinkevich, Rules of Machine Learning, Google, 2016-2018", status: "belum digali" },
  { name: "Specification Gaming / Reward Hacking", domain: "aiml", def: "Optimizers exploit the letter of the objective, not its spirit — Goodhart for machines.", src: "Krakovna et al., specification gaming examples, DeepMind, 2020; Amodei et al., Concrete Problems, 2016", status: "belum digali" },
  { name: "No Free Lunch Theorem", domain: "aiml", def: "No learner beats all others on all problems — priors and evaluation decide.", src: "Wolpert & Macready, 1997", status: "belum digali" },
  { name: "Train/Serve Skew", domain: "aiml", def: "The pipeline that built features at training time must be the one that builds them at serving time.", src: "Google ML best practices; Sculley et al. 2015 (glue-code and pipeline-jungle symptoms)", status: "belum digali" },
  { name: "Data and Concept Drift Monitoring", domain: "aiml", def: "The world moves — monitor inputs and outputs for drift, and retrain deliberately.", src: "ML monitoring practice; Gama et al., A Survey on Concept Drift Adaptation, 2014", status: "belum digali" },
  { name: "Human-in-the-Loop for Irreversible Actions", domain: "aiml", def: "Autonomy scales until the blast radius does not — the irreversible stays human-approved.", src: "Safety engineering practice; Principai's own stance", status: "belum digali" },
  { name: "Model Cards and Datasheets", domain: "aiml", def: "Document intended use, evaluation, and data provenance — models carry their nutrition labels.", src: "Mitchell et al., Model Cards, 2019; Gebru et al., Datasheets for Datasets, 2018", status: "belum digali" },
  { name: "Evaluation Before Deployment", domain: "aiml", def: "Evals are the test suites of behavior — run them before the release, not in production.", src: "Software engineering of ML practice (SE4ML best practices, Amershi et al., 2019)", status: "belum digali" },
  { name: "Feedback Loop Awareness", domain: "aiml", def: "A deployed model changes the data it will next train on — the loop is part of the system.", src: "Sculley et al., 2015", status: "belum digali" },
  { name: "Simplicity Baseline First", domain: "aiml", def: "A heuristic or a linear model must beat the deep network before the network earns its complexity.", src: "Zinkevich, Rules of ML, 2016", status: "belum digali" },
  { name: "Version Everything: Data, Features, Model", domain: "aiml", def: "Reproducibility needs the whole triple pinned — one number without the other two is a rumor.", src: "MLOps practice (documented across platforms)", status: "belum digali" },
  { name: "Fail Visible for Agents", domain: "aiml", def: "AI agents need uncertainty surfaced — silent hallucination is the failure mode of our era.", src: "Applied AI safety practice; Principai stance", status: "belum digali" },

  // ===== Formal Methods =====
  { name: "Design by Contract", domain: "formal", def: "Preconditions, postconditions, invariants — obligations and benefits stated where they can be checked.", src: "Bertrand Meyer, Object-Oriented Software Construction, 1992-1997", status: "belum digali" },
  { name: "Hoare Logic", domain: "formal", def: "Program correctness can be derived compositionally — assertions and rules of inference for code.", src: "C. A. R. Hoare, 1969", status: "belum digali" },
  { name: "Model Checking Where It Counts", domain: "formal", def: "Exhaustive state-space verification for protocols and critical cores — the cost buys certainty nothing else can.", src: "Clarke & Emerson, 1981-1982; hardware verification practice", status: "belum digali" },
  { name: "TLA+ for Concurrent Designs", domain: "formal", def: "Specify the algorithm before the implementation; let the checker find the interleavings you missed.", src: "Leslie Lamport, Specifying Systems, 2002", status: "belum digali" },
  { name: "Assertions Document Invariants", domain: "formal", def: "assert is executable documentation of what must be true — and a debugger for the future.", src: "Programming practice; Hoare lineage", status: "belum digali" },
  { name: "Prove the Critical Core", domain: "formal", def: "Formalize the small kernel whose failure is catastrophic; test the rest.", src: "Verified systems practice (seL4 lineage — Klein et al., 2009)", status: "belum digali" },

  // ===== Documentation & i18n =====
  { name: "Docs as Code", domain: "docs", def: "Documentation lives in version control, reviews, and CI with the source it describes.", src: "Documentation engineering practice (Write the Docs community)", status: "belum digali" },
  { name: "Diataxis Framework", domain: "docs", def: "Four modes — tutorials, how-to guides, reference, explanation — mixing them serves nobody.", src: "Daniele Procida, 2017-2019 (diataxis.fr)", status: "belum digali" },
  { name: "README-Driven Development", domain: "docs", def: "Write the README first and the software has a specification it can be held to.", src: "Tom Preston-Werner, README-driven development, 2009", status: "belum digali" },
  { name: "Comments Explain Why, Code Explains What", domain: "docs", def: "A comment that restates the code is noise; the comment that survives review explains intent and constraints.", src: "Programming practice lineage (code-style literature)", status: "belum digali" },
  { name: "One Language Per Pipeline", domain: "docs", def: "Source content is authored in one language; translations are derived with drift detection — meaning flows one way.", src: "Principai's own translation model", status: "belum digali" },
  { name: "Externalize User-Facing Strings", domain: "docs", def: "Strings in code are bugs waiting for the translator — the catalog and the logic must part.", src: "Software internationalization practice (W3C i18n guidance)", status: "belum digali" },
  { name: "Locale, Not Language", domain: "docs", def: "Formats for dates, numbers, and plurals vary within languages — locales, not language tags, format the world.", src: "W3C i18n; ICU/CLDR", status: "belum digali" },
  { name: "Pseudo-Localization Testing", domain: "docs", def: "Fake-translate before real-translate — catch layout breakage while it is cheap.", src: "Microsoft pseudo-localization practice", status: "belum digali" },
  { name: "Write for the Skimmer", domain: "docs", def: "Structure documents so the scanning reader gets the map and the careful reader gets the territory.", src: "Technical writing practice", status: "belum digali" },
];

/** Count of entries per status — used for honest UI, never for claims. */
export function registryStats() {
  const dug = REGISTRY.filter((e) => e.status === "sudah digali").length;
  const unsure = REGISTRY.filter((e) => e.status === "tidak yakin").length;
  return { total: REGISTRY.length, dug, unsure, undug: REGISTRY.length - dug - unsure };
}
