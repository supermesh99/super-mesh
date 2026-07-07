// Posts 51–100 — Day 3: the code / builder cred. Day 4: economics.
export const POSTS_B = [
  // ---- DAY 3: under the hood ----
  {
    // A — opener long
    k: "term",
    g: { title: "supermesh — anchor program", lines: [["$", "anchor build && cargo test"], ["", "compiling supermesh v0.1.0..."], ["ok", "test_stake_and_report ... ok"], ["ok", "test_challenge_honest_reading ... ok"], ["ok", "test_fraud_slash_and_claim ... ok"], ["ok", "test_treasury_accrual ... ok"], ["hi", "4 passed · 0 failed · fraud path green"]], note: "when your protocol destroys stake, you test like it" },
    t: `gm. Day 3. Opening the hood.\n\nToday: the Anchor program, the PDAs, the slashing math, on-device signing.\n\nEverything I show today is running code you can clone and break. If you like protocols more than promises, this is your day.\n\ngithub.com/supermesh99`,
  },
  {
    // M — PDA design
    k: "stack",
    g: { title: "3 ACCOUNTS. THAT'S THE PROTOCOL.", layers: [["NETWORK PDA", 'seeds = ["network", name] — rules + treasury', false], ["DEVICE PDA", 'seeds = ["device", network, signer] — identity + stake', false], ["READING PDA", 'seeds = ["reading", device, index] — data + window', true]], note: "simple systems survive. complex systems get exploited." },
    t: `The entire on-chain design:\n\nNETWORK — the rules + treasury\nDEVICE — identity + staked SOL\nREADING — data + challenge window\n\nThree accounts. Every reading is its own addressable, composable, challengeable Solana account.\n\nSimple systems survive.`,
  },
  {
    // S
    k: "quote",
    g: { q: "If it's not in the program, it doesn't exist.", a: "— no backend. the chain is the backend." },
    t: `SuperMesh has no backend server deciding outcomes.\n\nStake accounting, windows, slash math, payouts — 100% on-chain Rust.\n\nIf it's not in the program, it doesn't exist.`,
  },
  {
    // X
    k: "drake",
    g: { no: "whitepaper section 4.2 explains our slashing", yes: "here's the literal rust function, ~40 lines, public" },
    t: `them: "our whitepaper explains the slashing mechanism"\n\nus: here's the literal Rust function that moves a liar's stake to the challenger. 40 lines. go read it.\n\ngithub.com/supermesh99`,
  },
  {
    // M — pipeline timing
    k: "flow",
    g: { title: "RAIN TO RECEIPT", sub: "THE FULL PIPELINE, TIMED", steps: [["0.0s", "sensor measures"], ["0.1s", "ed25519 sig on-device"], ["0.5s", "landed on solana"], ["60m", "window closes"], ["DONE", "immutable + paid"]], hot: 4, note: "physical event → financial fact, same hour" },
    t: `The pipeline, timed:\n\n0.0s — sensor measures\n0.1s — signed on the device itself\n0.5s — landed on Solana\n60m — challenge window closes clean\n✓ — finalized, immutable, operator paid\n\nPhysical event to financial fact in one hour.`,
  },
  {
    // S
    k: "stat",
    g: { kick: "KEY MANAGEMENT", big: "1 KEY", cap: "a device IS its keypair. no signup. no KYC for sensors.", foot: "generate → stake → report. identity in one instruction." },
    t: `On SuperMesh a device IS its keypair.\n\nNo signup forms. No API keys to leak. No KYC for rain gauges.\n\nGenerate key → stake → start reporting.\n\nPermissionless hardware onboarding, as it should be.`,
  },
  {
    // M — signing at edge
    k: "flow",
    g: { title: "SIGNED AT THE SOURCE", sub: "NOT AT THE SERVER", steps: [["SENSOR", "measures 47mm"], ["SECURE CHIP", "signs in hardware"], ["ANYWHERE", "laptop? cloud? can't forge"], ["SOLANA", "verifies the curve"]], hot: 1, note: "ed25519 — the same curve your wallet uses" },
    t: `Readings are signed ON THE DEVICE with Ed25519 — the same curve Solana wallets use.\n\nThe operator's laptop can't forge them. Their cloud can't. Nobody in between can.\n\nHardware root of trust → on-chain settlement. Clean pipeline, no soft middle.`,
  },
  {
    // X
    k: "meme",
    g: { top: "our test suite starts", bottom: "with the fraud path", stamp: "GREEN", stampColor: "green" },
    t: `most teams test the happy path first\n\nthe first E2E test we wrote: an operator LYING and getting slashed\n\nstake → report → challenge → resolve(fraud) → slash → claim\n\nthe unhappy path IS the product`,
  },
  {
    // A — console long
    k: "check",
    g: { title: "THE CONSOLE IS LIVE", items: [["register a device", "ok"], ["submit signed readings", "ok"], ["fire a challenge", "ok"], ["watch a slash settle", "ok"], ["claim the bounty", "ok"], ["talk to a salesperson first", "no"]], note: "touch the protocol before you judge it" },
    t: `The SuperMesh console is live.\n\nRegister devices. Submit readings. Fire challenges. Watch slashing settle in real time — from your browser, against the chain.\n\nNo demo call. No waitlist. Just the protocol.\n\nsupermesh.live/console`,
  },
  {
    // S
    k: "quote",
    g: { q: "Working code is the only whitepaper that matters.", a: "— clone it, run it, break it" },
    t: `Don't trust screenshots.\n\nClone the repo. Run the demo. Watch a full stake→report→challenge→slash cycle execute on a local validator in seconds.\n\nWorking code is the only whitepaper that matters.\n\ngithub.com/supermesh99`,
  },
  {
    // M — challenge window dial
    k: "bars",
    g: { title: "CHALLENGE WINDOWS: A DIAL, NOT A DOGMA", bars: [["traffic data", "minutes", 0.15, false], ["weather nets", "1 hour", 0.4, false], ["insurance triggers", "24 hours", 1, true]], note: "each network tunes latency vs security. the market picks." },
    t: `Every network sets its own challenge window.\n\nFast data (traffic): minutes.\nInsurance triggers: 24 hours of scrutiny.\n\nSecurity is a dial, not a dogma. The market picks the setting per use case.`,
  },
  {
    // X
    k: "meme",
    g: { top: "finalized means final", bottom: "not 'final unless support edits it'", stamp: "IMMUTABLE", stampColor: "green" },
    t: `"finalized" in web2: final unless support edits it\n"finalized" in a committee oracle: final unless governance votes\n"finalized" on supermesh: final like a solana block is final\n\nbuild on that.`,
  },
  {
    // M — composability
    k: "flow",
    g: { title: "CONSUME A READING IN 3 STEPS", sub: "INTEGRATION IS A CPI, NOT A CONTRACT NEGOTIATION", steps: [["PASS", "the reading PDA"], ["CHECK", "finalized flag"], ["READ", "the value"]], hot: 2, accent: "green", note: "no api keys. no invoices. no meetings." },
    t: `Integrating SuperMesh into your Solana program:\n\n1. Pass the reading PDA\n2. Check the finalized flag\n3. Read the value\n\nThat's the integration. No API keys, no invoices, no BD calls.\n\nComposability is the moat nobody prices.`,
  },
  {
    // S
    k: "stat",
    g: { kick: "ACCOUNT SIZE GOLF", big: "BYTES", cap: "at millions of readings, every wasted byte is rent forever", foot: "we golf account sizes like our economics depend on it. they do." },
    t: `A reading account is deliberately tiny.\n\nAt sensor scale — millions of readings — every wasted byte is rent someone pays forever.\n\nWe golf account sizes like our economics depend on it. Because they do.`,
  },
  {
    // M — reputation
    k: "check",
    g: { title: "A DEVICE'S PUBLIC TRACK RECORD", items: [["readings submitted: 10,412", "ok"], ["challenges survived: 17", "ok"], ["slashes absorbed: 0", "ok"], ["age: 214 epochs", "ok"], ["bought followers", "no"]], note: "a 2-year unblemished sensor is worth more than a fresh one" },
    t: `Every device accumulates a public on-chain record:\n\nreadings submitted · challenges survived · slashes · age\n\nConsumers price data by device reputation. A 2-year unblemished sensor earns more than a fresh one.\n\nYou can't buy it, fake it, or astroturf it.`,
  },
  {
    // X
    k: "meme",
    g: { top: "my sensor has better", bottom: "onchain stats than you", stamp: "FLAWLESS", stampColor: "green" },
    t: `flex tier list:\n\nD: pfp\nC: rare handle\nB: early LP position\nA: profitable perps history\nS: a sensor with 10,000 finalized readings and zero slashes\n\nonchain reputation for machines is the new flex`,
  },
  {
    // M — network factory
    k: "stack",
    g: { title: "NOT ONE NETWORK. A FACTORY.", layers: [["WEATHER NET", "insurance-grade windows", false], ["AIR NET", "city-scale AQI", false], ["ENERGY NET", "meter settlement", false], ["YOUR NET", "init one instruction, your rules", true]], note: "anyone can deploy a network. permissionless." },
    t: `SuperMesh isn't "a weather network."\n\nIt's a factory: anyone can init a network PDA — define the data type, stake minimums, window length, rewards.\n\nWeather nets, noise nets, energy nets. Same trust machine underneath.`,
  },
  {
    // S
    k: "quote",
    g: { q: "The treasury is a PDA. No human holds its key, because it has no key.", a: "— compare with 'treasury' = founder's ledger" },
    t: `The treasury is a program-derived address.\n\nNo human holds its key, because it HAS no key. Only slash/claim logic can move funds.\n\nCompare with projects where "treasury" means the founder's Ledger.`,
  },
  {
    // A — roadmap receipts long
    k: "tl",
    g: { title: "STATUS: SHIPPED VS NEXT", ev: [["done", "core program"], ["done", "fraud tests"], ["done", "live console"], ["next", "devnet season"], ["next", "mainnet genesis"]], note: "the roadmap is a commit log running in reverse" },
    t: `Where SuperMesh stands:\n\n✅ core program (stake/report/challenge/slash/claim)\n✅ LiteSVM test suite incl. fraud paths\n✅ live console\n✅ E2E verified on localnet\n🔜 devnet operator season\n🔜 audit → mainnet genesis\n\nOur roadmap format: commits, not slides. github.com/supermesh99`,
  },
  {
    // day 3 closer S
    k: "meme",
    g: { top: "day 3 complete", bottom: "the code is the pitch", stamp: "OPEN SOURCE", stampColor: "green" },
    t: `day 3 done.\n\neverything shown today is public rust you can read tonight.\n\ntomorrow: the economics — who earns, who pays, and why the flywheel spins.`,
  },

  // ---- DAY 4: economics ----
  {
    // A — opener long
    k: "loop",
    g: { title: "DAY 4: FOLLOW THE MONEY", center: "SOL", centerSub: "VALUE FLOW", nodes: ["consumers pay fees", "operators earn", "liars get slashed", "challengers collect", "treasury compounds"], note: "every arrow is enforced by code, not contracts" },
    t: `gm. Day 4. Enough tech — let's follow the money.\n\nWho pays: insurers, prediction markets, RWA protocols, agents.\nWho earns: honest operators + sharp challengers.\nWho funds the treasury: liars.\n\nEvery arrow enforced by code. Thread of the day below.`,
  },
  {
    // M
    k: "vs",
    g: { title: "YIELD VS YIELD", l: { h: "DEFI 'YIELD'", items: ["emissions", "dilution", "musical chairs", "dies with incentives"] }, r: { h: "OPERATOR YIELD", items: ["consumers pay for data", "slashed stakes of liars", "revenue, not printing", "grows with usage"] }, v: "the difference matters when the music stops" },
    t: `DeFi yield: emissions, dilution, musical chairs.\n\nSuperMesh operator yield: consumers paying for data + slashed stakes of caught liars.\n\nYield backed by revenue and enforced honesty. The difference matters when the music stops.`,
  },
  {
    // S
    k: "stat",
    g: { kick: "IOT DEVICES BY 2030", big: "75B", cap: "if 0.1% ever need verified readings, that's 75M staked devices", foot: "do the math on network revenue. then look at depin valuations." },
    t: `75,000,000,000 IoT devices projected by 2030.\n\nIf 0.1% ever need verifiable readings: 75M staked devices.\n\nAt tiny per-reading fees, run the network revenue math yourself. Then look at where DePIN valuations sit today.`,
  },
  {
    // X
    k: "meme",
    g: { top: "real yield?", bottom: "we prefer real rain", stamp: "REVENUE", stampColor: "green" },
    t: `2021: "real yield" (it was emissions)\n2023: "real yield" (it was points)\n2026: an insurer paid the network because it verifiably rained 47mm in Pune\n\nrealer yield`,
  },
  {
    // M — micro fees
    k: "bars",
    g: { title: "WHY MICROPAYMENTS NEVER WORKED (UNTIL NOW)", bars: [["data point value", "$0.001", 0.25, false], ["eth gas per tx", "$0.50+", 1, false], ["solana fee per tx", "$0.0001", 0.02, true]], note: "settlement must cost less than the data is worth" },
    t: `Why per-reading payments never existed:\n\na $0.50 gas fee on a $0.001 data point is absurd.\n\nSolana flips it — settlement costs LESS than the data is worth.\n\nMicro-economies need micro-fees. That's the whole unlock.`,
  },
  {
    // S
    k: "quote",
    g: { q: "Stake is inventory. Readings are sales. A slash is bankruptcy for fraud.", a: "— a sector you can model with an actual P&L" },
    t: `Think of an operator like a business:\n\nStake = working capital at risk\nReadings = units sold\nChallenges survived = quality record\nSlash = bankruptcy for fraud\n\nA crypto sector you can model with an actual P&L. Rare.`,
  },
  {
    // M — demand side
    k: "check",
    g: { title: "WHO PAYS FOR VERIFIED DATA", items: [["insurers settling parametric claims", "ok"], ["prediction markets needing resolution", "ok"], ["RWA protocols proving output", "ok"], ["AI agents needing ground truth", "ok"], ["cities auditing pollution", "ok"], ["'hypothetical demand'", "no"]], note: "demand isn't hypothetical. it's unserved." },
    t: `"But who actually pays for this?"\n\n— insurers settling parametric claims\n— prediction markets needing resolution\n— RWA protocols proving asset output\n— AI agents needing ground truth\n— cities auditing pollution\n\nDemand isn't hypothetical. It's unserved.`,
  },
  {
    // X
    k: "drake",
    g: { no: "valuing depin by TVL like it's a bank", yes: "verified-data throughput x price per reading" },
    t: `stop valuing DePIN with TVL. it's infrastructure, not a bank.\n\nthe metric: verified data throughput × price per reading\n\nthat's revenue. that's real. that's the number we optimize.`,
  },
  {
    // A — north star long
    k: "bars",
    g: { title: "THE NORTH STAR METRIC", bars: [["vanity: followers", "ignore", 0.3, false], ["vanity: TVL", "ignore", 0.5, false], ["revenue / staked SOL", "everything", 1, true]], note: "published publicly, every epoch. hold us to it." },
    t: `Forget price. The metric SuperMesh lives and dies by:\n\nrevenue per staked SOL\n\nIf consumers pay more than stakers could earn elsewhere, the network grows. Period.\n\nWe'll publish it every epoch, publicly. Hold us to it.`,
  },
  {
    // S
    k: "stat",
    g: { kick: "HARDWARE PAYBACK TARGET", big: "WEEKS", cap: "sensor kit ~$50-150, stake refundable, rewards per reading", foot: "helium hotspots peaked at $2,500. we learned from history." },
    t: `Operator unit economics (genesis targets):\n\nSensor kit: $50–150\nStake: refundable\nRewards: per verified reading\nPayback: weeks, not years\n\nHelium hotspots peaked at $2,500 a box. We learned from history.`,
  },
  {
    // M — keeper class
    k: "flow",
    g: { title: "MEV SEARCHERS → DATA SEARCHERS", sub: "SAME SKILLS, NEW ALPHA", steps: [["SCAN", "every reading"], ["MODEL", "cross-check reality"], ["STRIKE", "bond vs fraud"], ["PROFIT", "slash share"]], hot: 3, accent: "green", note: "solana already has thousands of these hunters. we give them prey." },
    t: `Solana already has thousands of sophisticated actors scanning mempools for arbitrage.\n\nSuperMesh hands them a new hunt: fraudulent readings with slashable stake.\n\nSame skills. New alpha. The keeper class polices the network for profit.`,
  },
  {
    // X
    k: "meme",
    g: { top: "some of you have never", bottom: "been slashed and it shows", stamp: "HUMBLE", stampColor: "red" },
    t: `the confidence of a data provider who's never had capital at risk is unearned\n\nevery supermesh operator posts with the humility of someone whose stake is one lie from zero\n\nskin in the game is a personality upgrade`,
  },
  {
    // M — honest bear case
    k: "vs",
    g: { title: "THE BEAR CASE (YES, WE HAVE ONE)", l: { h: "RISKS", items: ["cold start: buyers first?", "oracle-of-oracle disputes", "hardware costs"] }, r: { h: "MITIGATIONS", items: ["genesis rewards bootstrap", "layered resolution", "hardware-agnostic design"] }, v: "teams that hide risks ARE the risk" },
    t: `The honest bear case:\n\n— cold start: do buyers come before sellers?\n— who resolves disputed resolutions?\n— hardware still costs money\n\nMitigations: bootstrap-rewarded genesis networks, layered resolution, any-sensor design.\n\nTeams that hide risks are the risk.`,
  },
  {
    // S
    k: "quote",
    g: { q: "Bull markets buy stories. Bear markets demand proof. Verification wins in both.", a: "— long truth. works in every regime." },
    t: `Bull markets buy stories.\nBear markets demand proof.\n\nVerification infrastructure is the rare asset that gets MORE valuable when trust collapses.\n\nLong truth. Works in every regime.`,
  },
  {
    // M — SOL denominated
    k: "stat",
    g: { kick: "STAKES DENOMINATED IN", big: "SOL", cap: "network security rides the fastest-growing budget in crypto", foot: "solana up → every reading more secure. zero extra work." },
    t: `SuperMesh stakes are in SOL.\n\nAs Solana grows, the economic security behind every sensor reading grows with it — automatically.\n\nBuilding on an appreciating security budget is a feature, not an accident.`,
  },
  {
    // X
    k: "meme",
    g: { top: "wen token?", bottom: "wen truth.", stamp: "PATIENCE", stampColor: "green" },
    t: `"wen token"\n\nanon we're building the machine that makes physical reality tradeable and you're asking about the ticker\n\n(genesis operators eat first. that's all we'll say. keep following.)`,
  },
  {
    // M — stages
    k: "tl",
    g: { title: "HOW EVERY INFRA ROTATION PLAYS OUT", ev: [["stage 1", "builders ship, silence"], ["stage 2", "CT catches on"], ["stage 3", "metrics vertical"], ["stage 4", "'it was obvious'"], ["YOU", "are at stage 1-2"]], note: "by stage 3 the easy part is over" },
    t: `How rotations start:\n\n1. proof (working product) ← we are here\n2. narrative (CT catches on) ← you are here\n3. liquidity (everyone piles in)\n4. "it was obvious all along"\n\nBy stage 3 the easy part is over. Timestamped.`,
  },
  {
    // S
    k: "stat",
    g: { kick: "TRADFI WEATHER DERIVATIVES", big: "$25B", cap: "notional, settled off indexes, T+days", foot: "on-chain version: settle off a finalized reading in one slot" },
    t: `TradFi weather derivatives: $25B notional, settled against slow indexes, T+days.\n\nOn-chain version: anyone writes a rainfall option, settlement reads a finalized on-chain reading, payout in one slot.\n\nA derivatives class waiting for its oracle.`,
  },
  {
    // M — challenge rate health
    k: "bars",
    g: { title: "READING NETWORK HEALTH", bars: [["challenge rate 0%", "nobody's checking", 0.1, false], ["challenge rate 40%", "war zone", 1, false], ["small + steady", "immune system works", 0.3, true]], note: "a data network that never slashes anyone isn't honest. it's unwatched." },
    t: `Counterintuitive health metric:\n\nIf a data network NEVER slashes anyone, either everyone's perfectly honest (unlikely) or nobody's checking (likely).\n\nA small, steady slash rate = the immune system works.\n\nWe designed to be checked.`,
  },
  {
    // day 4 closer, A
    k: "check",
    g: { title: "WHAT TRADERS SHOULD ACTUALLY WATCH", items: [["total staked SOL (security)", "ok"], ["readings per day (activity)", "ok"], ["challenge rate (health)", "ok"], ["slash volume (enforcement)", "ok"], ["consumer fees (REVENUE) ← this one", "ok"]], note: "number 5 is the one that matters" },
    t: `Day 4 closes. When we publish network stats, watch:\n\n1. total staked SOL — security\n2. readings/day — activity\n3. challenge rate — health\n4. slash volume — enforcement\n5. consumer fees — REVENUE\n\nNumber 5 is the only one that can't be faked.\n\nTomorrow: what gets BUILT on truth.`,
  },
  // ---- extra day-3/4 fillers ----
  {
    k: "meme",
    g: { top: "rust or it", bottom: "didn't happen", stamp: "ON-CHAIN", stampColor: "green" },
    t: `"our backend handles disputes"\n\nanon if your dispute resolution isn't in the program, your protocol has a customer service department, not a settlement layer`,
  },
  {
    k: "stat",
    g: { kick: "SETTLEMENT LOGIC", big: "~200", cap: "lines of rust decide who gets paid", foot: "small enough to audit over coffee. that's the point." },
    t: `The entire settlement core — stake, challenge, slash, claim — is ~200 lines of open Rust.\n\nSmall enough to audit over coffee.\n\nThat's not a limitation. That's the design goal.`,
  },
  {
    k: "quote",
    g: { q: "Complexity is where exploits live. We evicted them.", a: "— 3 accounts, 3 instructions, 0 admin keys" },
    t: `Every major exploit post-mortem has the same sentence: "an edge case in complex interaction logic."\n\nOur answer: 3 account types, a handful of instructions, no admin keys on truth.\n\nComplexity is where exploits live. We evicted them.`,
  },
  {
    k: "drake",
    g: { no: "trusting the operator's cloud server", yes: "verifying the device's signature on-chain" },
    t: `the difference between "our sensors are secure" and "the runtime rejects anything the device didn't sign" is the difference between a promise and a protocol`,
  },
  {
    k: "flow",
    g: { title: "WHERE YIELD ACTUALLY COMES FROM", sub: "NO EMISSIONS. NO PONZINOMICS.", steps: [["CONSUMER", "pays for reading"], ["PROTOCOL", "takes network fee"], ["OPERATOR", "earns the rest"], ["LIARS", "subsidize everyone"]], hot: 3, accent: "green", note: "the only inflation here is the treasury growing" },
    t: `Where operator yield comes from:\n\n1. consumers paying for readings\n2. slash shares from caught liars\n\nWhere it doesn't come from:\n\n1. token emissions\n2. your exit liquidity\n\nSimple test for any DePIN: delete the emissions. Is there still yield?`,
  },
  {
    k: "meme",
    g: { top: "delete the emissions", bottom: "is there still yield?", stamp: "THE TEST", stampColor: "green" },
    t: `one-question test for every depin project:\n\ndelete the token emissions. is there still yield?\n\nif the answer is no, you're the yield`,
  },
  {
    k: "stat",
    g: { kick: "PER-READING PRICE FLOOR", big: "$0.001", cap: "even at fractions of a cent, sensor-scale = real revenue", foot: "1M readings/day x $0.001 = $365K/yr per network. do the map math." },
    t: `Skeptic: "who pays real money for a temperature reading?"\n\nAt $0.001 per reading, one mid-size network doing 1M readings/day = $365K/year.\n\nNow count how many networks fit on one planet.`,
  },
  {
    k: "vs",
    g: { title: "BUY DATA vs BUY TRUTH", l: { h: "DATA VENDOR", items: ["license agreement", "annual contract", "no recourse if wrong", "price: opaque"] }, r: { h: "THE MESH", items: ["pay per reading", "cancel any slot", "wrong = slashed + refunded", "price: on-chain"] }, v: "one is procurement. the other is a market." },
    t: `Buying data today: license agreement, annual contract, zero recourse when it's wrong, opaque pricing.\n\nBuying truth on the mesh: pay per reading, cancel any slot, wrong data = slash + recourse, price discovered on-chain.\n\nOne is procurement. The other is a market.`,
  },
  {
    k: "quote",
    g: { q: "The best time to understand an infra protocol is before the dashboard exists.", a: "— day 4, timestamped" },
    t: `The best time to understand an infra protocol is before the public dashboard exists.\n\nAfter the dashboard, you're reading the same chart as everyone else.\n\nRight now the "dashboard" is a repo. That's the edge.`,
  },
  {
    k: "meme",
    g: { top: "operator yield is just", bottom: "getting paid to not lie", stamp: "BASED", stampColor: "green" },
    t: `supermesh operator yield is literally getting paid to not lie\n\nthe most honest job in crypto`,
  },
];
