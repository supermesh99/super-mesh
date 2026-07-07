// Posts 1–50 — Day 1: the hook. Day 2: the oracle problem.
// k = card type, g = graphic data, t = tweet text
// mix: A=article-style long, M=medium, S=short, X=meme
export const POSTS_A = [
  // ---- DAY 1 ----
  {
    // A — thread-opener style long
    k: "map",
    g: { title: "THE WORLD IS UNVERIFIED", tags: ["rain: trust me", "AQI: trust me", "kWh: trust me"], note: "every sensor on earth is a rumor until someone stakes on it" },
    t: `Everything you trade on Solana is cryptographically verified.\n\nEverything that actually matters — rainfall, power, air quality — is still "trust me bro."\n\n80 billion sensors on earth. Zero can prove what they measured.\n\nWe're fixing that. This week I'll show you how.`,
  },
  {
    // S
    k: "stat",
    g: { kick: "SENSORS VS HUMANS", big: "10 : 1", cap: "machines outnumber us — and not one can testify", foot: "supermesh gives machines the ability to prove" },
    t: `80 billion sensors.\n8 billion humans.\n\nThe machines outnumber us 10:1 and not a single one can prove what it measured.\n\nUntil now.`,
  },
  {
    // M — the core loop
    k: "flow",
    g: { title: "THE SUPERMESH LOOP", sub: "PHYSICAL TRUTH, SETTLED ON SOLANA", steps: [["STAKE", "SOL locked"], ["REPORT", "signed on-device"], ["CHALLENGE", "anyone, bonded"], ["SETTLE", "truth pays"]], hot: 3, note: "lie once → stake gone. tell truth → earn forever." },
    t: `How SuperMesh works, in one picture:\n\n1. Sensor operator stakes SOL\n2. Device signs its readings (Ed25519)\n3. Anyone on earth can challenge with a bond\n4. Fraud → operator slashed, challenger paid\n\nSkin in the game for physical data. Finally.`,
  },
  {
    // X — meme
    k: "meme",
    g: { top: "your oracle:", bottom: "a google sheet and a prayer", stamp: "UNVERIFIED", stampColor: "red" },
    t: `there are 8-figure TVL protocols whose "oracle" is a cron job hitting an API maintained by one guy named dave\n\nwe don't talk about dave enough`,
  },
  {
    // M — why solana
    k: "bars",
    g: { title: "COST: 1 SENSOR REPORTING FOR 1 YEAR", bars: [["ethereum", "~$2,000,000", 1, false], ["L2s", "~$15,000", 0.35, false], ["solana", "~$50", 0.03, true]], note: "525,600 readings/yr. DePIN doesn't choose Solana. physics does." },
    t: `A sensor reporting every 60 seconds = 525,600 txs a year.\n\nEthereum: ~$2M in gas\nL2s: ~$15K\nSolana: ~$50\n\nDePIN doesn't have a chain choice. It has a chain requirement.`,
  },
  {
    // S
    k: "quote",
    g: { q: "Data without stake is just a rumor with good formatting.", a: "— the supermesh thesis" },
    t: `Data without stake is just a rumor with good formatting.`,
  },
  {
    // A — sector thesis long
    k: "tl",
    g: { title: "EVERY 'BORING' INFRA PLAY, IN HINDSIGHT", ev: [["2018", "LINK $0.30 'boring'"], ["2020", "HNT 'router thing'"], ["2021", "RNDR 'gpu nonsense'"], ["2024", "PYTH 'just feeds'"], ["NOW", "verified sensors"]], note: "infra always looks boring right before it doesn't" },
    t: `Chainlink was "boring infra" at $0.30.\nHelium was "a router thing" before the 100x.\nRender was "GPU nonsense" at 5 cents.\n\nEvery cycle has one infra narrative that looks boring until it's vertical.\n\nVerified physical data is this cycle's. Screenshot this.`,
  },
  {
    // X
    k: "drake",
    g: { no: "trusting 7 nodes on an approved list", yes: "trusting a slashing condition with SOL behind it" },
    t: `"decentralized oracle" (it's 7 nodes and a slack channel)\n\nvs\n\na slashing condition`,
  },
  {
    // M
    k: "stack",
    g: { title: "THE DEPIN STACK ON SOLANA", layers: [["COMPUTE", "render · io.net", false], ["STORAGE", "filecoin · shdw", false], ["BANDWIDTH", "helium", false], ["MAPPING", "hivemapper", false], ["TRUTH", "supermesh — the missing layer", true]], note: "the last primitive is the biggest one" },
    t: `The Solana DePIN stack:\n\nCompute ✅ Render, io.net\nStorage ✅ Shadow\nBandwidth ✅ Helium\nMapping ✅ Hivemapper\nTruth ⬜️ ...\n\nEvery layer got built except the one that verifies the others aren't lying.\n\nThat's the layer we're building.`,
  },
  {
    // S
    k: "meme",
    g: { top: "gm", bottom: "(signed, staked, challengeable)", stamp: "VERIFIED", stampColor: "green" },
    t: `anyone can say gm\n\na supermesh sensor says gm with an Ed25519 signature, staked SOL, and a challenge window\n\ngm (verified) > gm (vibes)`,
  },
  {
    // A — helium comparison long
    k: "vs",
    g: { title: "DEPIN 1.0 vs DEPIN 2.0", l: { h: "COVERAGE MINING", items: ["paid for existing", "data assumed honest", "spoofing epidemics", "rewards ≠ usefulness"] }, r: { h: "TRUTH MINING", items: ["paid for being correct", "every reading staked", "lying = slashed", "rewards = revenue"] }, v: "the difference between the two is the entire trade" },
    t: `DePIN 1.0 (Helium era): reward hardware for EXISTING. Hope the data is real. Result: spoofing epidemics, rewards decoupled from usefulness.\n\nDePIN 2.0: reward data for being CORRECT. Stake behind every reading, slashing for lies.\n\nCoverage was chapter one. Truth is chapter two.`,
  },
  {
    // S
    k: "stat",
    g: { kick: "SENSOR TO SETTLEMENT", big: "400ms", cap: "a raindrop in Mumbai becomes a financial fact", foot: "only possible on solana" },
    t: `A raindrop hits a sensor in Mumbai.\n\n400ms later it's signed, staked, and settled on Solana — challengeable by anyone, forever.\n\nNo other chain can do this at sensor economics.`,
  },
  {
    // X
    k: "meme",
    g: { top: "weatherman wrong again", bottom: "consequences: zero. still employed.", stamp: "NO STAKE", stampColor: "red" },
    t: `weathermen have been wrong with impunity since the invention of television\n\nimagine if being wrong about the weather cost money\n\nok stop imagining, we built it`,
  },
  {
    // M
    k: "check",
    g: { title: "WHAT A SUPERMESH READING CARRIES", items: [["ed25519 signature — made on the device", "ok"], ["timestamp — solana slot precision", "ok"], ["operator stake — slashable SOL", "ok"], ["challenge window — open to anyone", "ok"], ["admin override", "no"], ["customer support line", "no"]], note: "proof of physical work > proof of hype" },
    t: `Every SuperMesh reading ships with:\n\n✅ on-device Ed25519 signature\n✅ slot-precision timestamp\n✅ slashable SOL stake\n✅ an open challenge window\n\n❌ admin override\n❌ "contact support"\n\nProof of physical work.`,
  },
  {
    // M — market size
    k: "bars",
    g: { title: "PHYSICAL DATA MARKETS (ANNUAL)", bars: [["traffic data", "$12B", 0.35, false], ["air quality", "$6B", 0.2, false], ["weather", "$2B", 0.08, false], ["IoT by 2030", "$3.5T", 1, true]], note: "share of it that's cryptographically verifiable today: ~0%" },
    t: `Weather data: $2B market\nTraffic: $12B\nAir quality: $6B\nIoT overall: $3.5 TRILLION by 2030\n\nAmount that's cryptographically verifiable: approximately zero.\n\nThe gap between those numbers is the trade.`,
  },
  {
    // S
    k: "quote",
    g: { q: "You can fork code in a weekend. You can't fork a thousand staked sensors standing in fields.", a: "— why physical networks compound" },
    t: `DeFi protocols get forked in a weekend.\n\nA network of staked, geographically distributed, reputation-bearing sensors? Try copy-pasting that.\n\nPhysical networks compound. Code doesn't.`,
  },
  {
    // X
    k: "drake",
    g: { no: "buying a $500 branded box to join a DePIN", yes: "any sensor that can sign joins, stakes, earns" },
    t: `most DePIN plays: buy our $500 box first\n\nsupermesh: got anything that can sign with Ed25519? cool, stake and start earning\n\nwe're not a gadget company. we're a truth market.`,
  },
  {
    // A — challenger economy long
    k: "flow",
    g: { title: "A NEW JOB ON SOLANA: DATA BOUNTY HUNTER", sub: "ZERO HARDWARE REQUIRED", steps: [["SCAN", "watch readings"], ["SPOT", "find the lie"], ["BOND", "post SOL"], ["COLLECT", "win their stake"]], hot: 3, accent: "green", note: "the liar's slashed stake pays the person who caught them" },
    t: `SuperMesh creates a new job on Solana: professional data watchdog.\n\nSpot a fraudulent sensor reading → post a bond → win a share of the operator's slashed stake.\n\nMEV searchers already have the skills. This is the same hunt with a new prey: lies.\n\nZero hardware required.`,
  },
  {
    // S
    k: "meme",
    g: { top: "trust issues?", bottom: "you'll fit right in", stamp: "WELCOME", stampColor: "green" },
    t: `supermesh was designed by asking one question on repeat:\n\n"ok but what if they're lying"\n\noperators? stake. challengers? bonds. us? open source, no admin key on truth.\n\nparanoia as a service.`,
  },
  {
    // M
    k: "map",
    g: { title: "WHERE TRUTH MATTERS MOST", tags: ["crop insurance", "grid metering", "air quality"], note: "verifiable data matters most where institutions are weakest" },
    t: `Verifiable data matters MOST where institutions are weakest.\n\nCrop insurance in India. Grid metering in Lagos. Air quality in Jakarta.\n\nDePIN's killer markets aren't in San Francisco. They're everywhere trust infrastructure never existed.`,
  },
  {
    // M — RWA hook
    k: "vs",
    g: { title: "RWA SZN HAS A DEPENDENCY", l: { h: "RWA TODAY", items: ["tokenized solar farm", "yield from a PDF", "quarterly attestations", "auditor invoice"] }, r: { h: "RWA + SUPERMESH", items: ["tokenized solar farm", "yield from staked meters", "per-slot verification", "slashing if it lies"] }, v: "tokenize the output, not the paperwork" },
    t: `Everyone's bullish RWA.\n\nNobody asks: when you tokenize a solar farm, who verifies it's actually producing?\n\nRWA without verified physical data is a PDF with extra steps.\n\nStaked meters that get slashed for lying — that's the missing dependency.`,
  },
  {
    // S
    k: "stat",
    g: { kick: "PARAMETRIC INSURANCE", big: "$40B", cap: "pays out automatically when data crosses a threshold", foot: "its single point of failure is the data source" },
    t: `Parametric insurance: $40B market that pays out the moment data crosses a threshold.\n\nRainfall > X mm → farmer paid. Instantly. No adjuster.\n\nIts single point of failure? The data source.\n\nGuess what we're building.`,
  },
  {
    // X
    k: "meme",
    g: { top: "one honest sensor", bottom: "> 1000 corporate APIs", stamp: "SLASHABLE", stampColor: "green" },
    t: `a sensor with $500 of staked SOL behind its readings is more trustworthy than a thousand corporate APIs with a terms of service\n\none can be slashed. the other can be quietly edited.`,
  },
  {
    // M
    k: "term",
    g: { title: "supermesh — settlement, live", lines: [["$", "supermesh submit --value 47mm --sign device.key"], ["", "reading #4021 staked · window open 60m"], ["$", "supermesh challenge 4021 --bond 1"], ["", "resolving against evidence..."], ["err", "FRAUD DETECTED — operator slashed 10 SOL"], ["ok", "challenger paid. treasury funded. truth settled."]], note: "no courts. no tickets. no mercy." },
    t: `The entire dispute lifecycle:\n\nchallenge() — bond posted against a reading\nresolve() — outcome determined\nclaim() — winner paid, liar slashed\n\nThree instructions. No courts. No support tickets. No mercy.`,
  },
  {
    // A — building in public long
    k: "check",
    g: { title: "SHIPPED BEFORE THE FIRST TWEET", items: [["anchor program: stake/report/challenge/slash", "ok"], ["fraud-path test suite (LiteSVM)", "ok"], ["live console in the browser", "ok"], ["on-device signing pipeline", "ok"], ["whitepaper with no product", "no"], ["roadmap deck, 40 slides", "no"]], note: "show > tell" },
    t: `Some projects launch with a deck and a dream.\n\nWe launched with:\n— a working Anchor program (stake, report, challenge, slash)\n— a fraud-path test suite\n— a live console you can click today\n\nNot a promise. A protocol.\n\ngithub.com/supermesh99`,
  },
  {
    // S
    k: "quote",
    g: { q: "Never trust a forecast from someone who loses nothing when they're wrong.", a: "— taleb-pilled infrastructure" },
    t: `Never trust a forecast from someone who loses nothing when wrong.\n\nWeathermen. Analysts. Oracles. Same disease.\n\nOur cure: every data point is a position. Wrong = liquidated.`,
  },
  {
    // X
    k: "meme",
    g: { top: "sir, a second sensor", bottom: "has confirmed the rainfall", stamp: "FINALIZED", stampColor: "green" },
    t: `sir, a second sensor has confirmed the rainfall\n\n(the challenge window closed clean. the reading is immutable. the insurance paid out while tradfi was still opening a claim file.)`,
  },
  {
    // M
    k: "loop",
    g: { title: "WHY THE MESH COMPOUNDS", center: "TRUST", centerSub: "THE FLYWHEEL", nodes: ["more staked SOL", "more trusted data", "more paying consumers", "higher operator yield", "more operators join"], note: "every loop tightens security and grows revenue" },
    t: `The flywheel:\n\nmore staked SOL → more trustworthy data → more consumers pay → operator yields rise → more operators stake\n\nEvery rotation tightens security AND grows revenue.\n\nFlywheels beat roadmaps.`,
  },
  {
    // S
    k: "stat",
    g: { kick: "CHALLENGE ANYTHING", big: "1 SOL", cap: "is all it takes to put a reading on trial", foot: "false challenges burn the bond — griefing doesn't pay" },
    t: `On SuperMesh, 1 SOL puts any reading on trial.\n\nWin → you take the liar's stake.\nLose → your bond burns.\n\nBoth sides have skin in the game. Only liars lose sleep.`,
  },
  {
    // day-1 closer, M
    k: "map",
    g: { title: "FIND THE 3,000 WHO GET IT", tags: ["you, probably"], note: "early is a choice, not an accident" },
    t: `We're not marketing to millions.\n\nWe're looking for 3,000 people who understand why verifiable physical data on Solana is inevitable.\n\nIf you read this far, you're probably one of them.\n\n@supermesh99`,
  },

  // ---- DAY 2: the oracle problem ----
  {
    // A — day opener long
    k: "vs",
    g: { title: "THE ORACLE PROBLEM ISN'T SOLVED. IT'S OUTSOURCED.", l: { h: "COMMITTEE ORACLE", items: ["trust these N nodes", "reputation at risk", "wrong feed = post-mortem", "governance fixes it later"] }, r: { h: "STAKED ORACLE", items: ["trust the math", "capital at risk", "wrong feed = slashed", "code fixes it now"] }, v: "an oracle without slashing is a trust assumption" },
    t: `gm. Day 2. Crypto's biggest unsolved problem.\n\nEvery major oracle asks you to trust a committee. When the feed lies, what gets slashed? Nothing. A post-mortem blog if you're lucky.\n\nAn oracle without slashing is a trust assumption.\nAn oracle with slashing is a security budget.`,
  },
  {
    // S
    k: "stat",
    g: { kick: "SECURED BY ORACLES TODAY", big: "$12B+", cap: "and if a feed lies tomorrow, what exactly gets slashed?", foot: "for most oracles the honest answer is: nothing", color: "red" },
    t: `Oracles secure tens of billions in DeFi.\n\nAsk your favorite one: if your feed lies tomorrow, what EXACTLY gets slashed?\n\nSit with the answer.`,
  },
  {
    // X
    k: "meme",
    g: { top: "7 nodes signing a price", bottom: "is a committee with a costume", stamp: "THEATER", stampColor: "red" },
    t: `7 nodes signing a price is not decentralization\n\nit's a committee with a costume`,
  },
  {
    // M — optimistic insight
    k: "flow",
    g: { title: "WHY CONSENSUS FAILS FOR PHYSICAL DATA", sub: "THERE IS NO SECOND RAIN GAUGE IN THAT FIELD", steps: [["PRICES", "20 sources, aggregate"], ["PHYSICS", "1 source, standing there"], ["ANSWER", "challenge games"]], hot: 2, note: "you can't put 21 validators in a rain gauge" },
    t: `Price oracles aggregate 20 exchanges. Fine.\n\nBut a rain gauge in one field? There is exactly ONE source of truth standing in that field.\n\nConsensus doesn't work for physical data. Optimistic challenge games do.\n\nThat's the entire design insight.`,
  },
  {
    // M
    k: "bars",
    g: { title: "COST OF LYING, BY SYSTEM", bars: [["corporate API", "an apology", 0.05, false], ["committee oracle", "reputation", 0.18, false], ["supermesh", "entire stake", 1, true]], note: "when cheating costs 1000x what it earns, nobody cheats" },
    t: `Game theory of the mesh:\n\nHonest reporting → earn fees forever\nOne detected lie → entire stake gone + reputation zeroed\n\nWhen cheating costs 1000x what it earns, nobody cheats.\n\nEconomics > audits.`,
  },
  {
    // S
    k: "quote",
    g: { q: "Pyth solved prices. Nobody solved physics.", a: "— the open slot on solana" },
    t: `Pyth solved financial data on Solana. 400+ feeds, sub-second. Genuinely great.\n\nBut no price feed can tell you if it's raining in Nairobi or if a solar panel is producing.\n\nPhysical data needs a different design. We're building it.`,
  },
  {
    // X
    k: "drake",
    g: { no: "SLA: 'we'll refund you if we fail' (call our lawyers)", yes: "SLASH: the money is already escrowed, code decides" },
    t: `an SLA says "we'll refund you if we fail"\n\na slash says "the money is already escrowed and code decides"\n\none requires lawyers. one requires a block.`,
  },
  {
    // A — API house of cards long
    k: "check",
    g: { title: "YOUR 'RELIABLE' DATA API CAN...", items: [["silently rewrite historical data", "no"], ["rate-limit you mid-product", "no"], ["get acquired and shut down", "no"], ["answer to shareholders, not users", "no"], ["...on-chain readings can do none of these", "ok"]], note: "immutable, permissionless, forever" },
    t: `Your "reliable" weather API:\n\n— can silently rewrite historical data\n— can rate-limit you mid-product\n— can be acquired and killed on a Tuesday\n— answers to shareholders, not users\n\nA finalized on-chain reading can do none of these things. It just sits there, being true, forever.`,
  },
  {
    // S
    k: "meme",
    g: { top: "the challenge window", bottom: "does not care about your feelings", stamp: "DEADLINE", stampColor: "green" },
    t: `the challenge window doesn't extend because you were early\nthe slash doesn't reverse because you apologized\nthe reading doesn't change because it's inconvenient\n\nthe least emotional counterparty in crypto`,
  },
  {
    // M
    k: "tl",
    g: { title: "A BRIEF HISTORY OF 'TRUST ME BRO'", ev: [["2017", "the API said so"], ["2019", "the committee said so"], ["2021", "the TWAP said so"], ["2023", "restakers said so"], ["2026", "say it with stake"]], note: "evolution complete" },
    t: `History of oracles:\n\n2017: "the API said so"\n2019: "the committee said so"\n2021: "the TWAP said so"\n2023: "the restakers said so"\n2026: say it with your stake.\n\nEvolution complete.`,
  },
  {
    // M — slash math
    k: "flow",
    g: { title: "SLASHING MATH, CONCRETE", sub: "10:1 ASYMMETRY AGAINST LYING", steps: [["OPERATOR", "stakes 10 SOL"], ["LIES", "fake reading"], ["CHALLENGER", "bonds 1 SOL"], ["OUTCOME", "10 SOL moves"]], hot: 3, accent: "red", note: "challenger keeps bond + wins slash share. operator keeps nothing." },
    t: `Concrete example:\n\nOperator stakes 10 SOL, submits a fraudulent reading.\nChallenger bonds 1 SOL. Wins.\n\nChallenger: bond back + slash share.\nOperator: zero.\n\n10:1 asymmetry against lying. That's the whole security model.`,
  },
  {
    // S
    k: "stat",
    g: { kick: "THE ONLY INEQUALITY THAT MATTERS", big: "C > V", cap: "cost of corrupting data must exceed value gained", foot: "supermesh makes the left side explicit: it's the stake" },
    t: `Oracle security in one inequality:\n\ncost of corruption > value of corruption\n\nMost oracles can't tell you their left side. Ours is explicit: it's the staked SOL, tuned per network.\n\nSecurity you can compute. Not vibes.`,
  },
  {
    // X
    k: "meme",
    g: { top: "anon, your defi protocol", bottom: "reads a google sheet", stamp: "SEVERE", stampColor: "red" },
    t: `oracle risk tier list:\n\nS: staked + slashable\nA: N-of-M committee\nB: single API, signed\nC: single API\nD: google sheet\nF: the founder types it in\n\nmost of DeFi lives in C-F and pretends it doesn't`,
  },
  {
    // M
    k: "loop",
    g: { title: "EVERY ATTACK MAKES US STRONGER", center: "TREASURY", centerSub: "ANTIFRAGILE BY DESIGN", nodes: ["liar slashed", "challenger paid", "treasury grows", "security deepens"], note: "bad actors literally fund the defense budget" },
    t: `Where do slashed stakes go?\n\nPart to the challenger (bounty). Part to the network treasury.\n\nEvery caught liar makes the network richer and its defenders better paid.\n\nAntifragile by design.`,
  },
  {
    // S
    k: "quote",
    g: { q: "Validators stake to secure transactions. Operators stake to secure reality.", a: "— same cryptoeconomics, new asset class" },
    t: `Validators stake to secure transactions.\nSuperMesh operators stake to secure reality.\n\nSame cryptoeconomics. New asset class.\n\nThe people who understood validator economics early did very well. Just saying.`,
  },
  {
    // M — griefing answer
    k: "vs",
    g: { title: "'CAN'T PEOPLE GRIEF HONEST SENSORS?'", l: { h: "WITHOUT BONDS", items: ["spam challenges free", "honest operators bleed", "network unusable"] }, r: { h: "WITH BONDS", items: ["false challenge burns bond", "griefing has a price", "only liars get hunted"] }, v: "mechanism design 101: both sides post collateral" },
    t: `"Can't people grief honest sensors with fake challenges?"\n\nNo — challengers post a bond too. False challenge = bond burned.\n\nBoth sides have collateral on the table. The only profitable move is telling the truth about liars.\n\nMechanism design 101.`,
  },
  {
    // X
    k: "meme",
    g: { top: "pov: you caught a fake", bottom: "rainfall reading", stamp: "PAID", stampColor: "green" },
    t: `watching resolve() move a liar's 10 SOL into your wallet because you caught them faking rainfall data\n\nfeeling: unmatched\ngas: $0.0001\ncourt appearances: zero\n\nbounty hunting is legal here`,
  },
  {
    // A — replay/idempotency nerd post long
    k: "term",
    g: { title: "replay attack — attempted", lines: [["$", "replay reading #4021 (same index)"], ["", "deriving PDA [reading, device, 4021]..."], ["err", "account already exists — tx failed at runtime"], ["hi", "solana's account model IS the guard clause"], ["ok", "duplicates are physically impossible"]], note: "the runtime does the security work for free" },
    t: `Nerd detail I love:\n\nNo "did this already happen?" checks needed. Every reading PDA derives from a monotonic index — same index twice collides at the address level and fails.\n\nSolana's account model is the guard clause. Write less code, break less.`,
  },
  {
    // S
    k: "stat",
    g: { kick: "CHALLENGE CONFIRMATION", big: "$0.0001", cap: "the cost of policing truth on solana", foot: "on a congested L1 the challenger misses the window" },
    t: `Challenge windows only work if challenges LAND in time.\n\nOn a congested chain, the challenger misses the window and fraud finalizes.\n\nOn Solana: 400ms, $0.0001.\n\nFast finality isn't marketing for an optimistic oracle. It's load-bearing.`,
  },
  {
    // day 2 closer, M
    k: "check",
    g: { title: "DAY 2 RECAP: WHY STAKED ORACLES WIN", items: [["committees can't be slashed — stake can", "ok"], ["physics has one source — challenge it", "ok"], ["bonds make griefing unprofitable", "ok"], ["slashes fund the defenders", "ok"], ["solana speed makes windows work", "ok"]], note: "tomorrow: the code" },
    t: `Day 2 recap:\n\n— committees can't be slashed; stake can\n— physical truth has ONE source; challenge it\n— bonds make griefing unprofitable\n— slashes pay the defenders\n— Solana speed makes it all land\n\nTomorrow we open the code.`,
  },
];
