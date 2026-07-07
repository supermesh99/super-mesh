// Posts 101–150 — Day 5: use cases. Day 6: meme day.
export const POSTS_C = [
  // ---- DAY 5: use cases ----
  {
    // A — opener
    k: "map",
    g: { title: "WHAT DO YOU BUILD ON TRUTH?", tags: ["insurance", "energy", "prediction mkts"], note: "ten markets. one shared dependency." },
    t: `gm. Day 5.\n\nWe covered the why (day 1-2), the how (day 3), the money (day 4).\n\nToday: WHAT gets built on verifiable physical data.\n\nInsurance. Energy. Prediction markets. Carbon. AI. Ten use cases, one per post. Each one a market. 🧵`,
  },
  {
    // A — crop insurance
    k: "flow",
    g: { title: "USE CASE 01: PARAMETRIC CROP INSURANCE", sub: "500M FARMERS CAN'T AFFORD ADJUSTERS", steps: [["SENSOR", "rainfall 12mm"], ["FINALIZE", "below threshold"], ["CONTRACT", "auto-triggers"], ["FARMER", "paid same day"]], hot: 3, accent: "green", note: "no adjuster. no claim forms. no 6-month wait." },
    t: `Use case 01: crop insurance.\n\n500M smallholder farmers can't afford traditional cover — claims take months.\n\nParametric on SuperMesh: rainfall finalizes below threshold → contract pays. Same day. No adjuster, no dispute, no paperwork.\n\nThis alone justifies the protocol.`,
  },
  {
    // M — prediction markets
    k: "vs",
    g: { title: "USE CASE 02: MARKET RESOLUTION", l: { h: "TODAY", items: ["'did it rain in NYC?'", "governance vote", "resolution drama", "days of appeals"] }, r: { h: "ON SUPERMESH", items: ["staked sensor reading", "challenge window", "automatic finality", "minutes"] }, v: "polymarket-scale markets, physics-grade truth" },
    t: `Use case 02: prediction markets.\n\n"Did it rain in NYC on July 4?" should never need a governance vote.\n\nThe staked sensor reading IS the resolution. Automatic, challengeable, final.\n\nEvery weather/climate/physical market unlocks at once.`,
  },
  {
    // M — energy
    k: "flow",
    g: { title: "USE CASE 03: P2P ENERGY", sub: "YOUR ROOF BECOMES A MERCHANT", steps: [["SOLAR ROOF", "produces 8 kWh"], ["METER", "stakes on reading"], ["NEIGHBOR", "consumes"], ["SETTLE", "paid in minutes"]], hot: 3, note: "today a utility takes 40% to do this in 60 days" },
    t: `Use case 03: peer-to-peer energy.\n\nSolar roofs generate. Neighbors consume. Settlement today = a utility taking 40% and 60 days.\n\nWith staked meter readings: produce → prove → paid. Minutes, on Solana.\n\nEnergy DePIN needs truth before it needs tokens.`,
  },
  {
    // A — carbon
    k: "stat",
    g: { kick: "USE CASE 04: CARBON CREDITS", big: "90%", cap: "of some rainforest offsets were found to be worthless", foot: "ghost credits, phantom trees. continuous staked verification fixes this.", color: "red" },
    t: `Use case 04: carbon.\n\nUp to 90% of some rainforest offsets were found worthless. Ghost credits. Phantom trees. Billions in fraud.\n\nFix: continuous sensor verification — growth, moisture, satellite cross-checks — staked and challengeable.\n\nCarbon markets need this layer.`,
  },
  {
    // M — cold chain
    k: "term",
    g: { title: "use case 05 — cold chain", lines: [["$", "query shipment #88 --range full"], ["", "readings: 4,320 · window: closed"], ["ok", "max temp 6.2°C — never breached 8°C"], ["hi", "vaccine batch: provably safe"], ["", "paper logs: not required. trust: not required."]], note: "pharma loses $35B/yr to cold-chain failures" },
    t: `Use case 05: cold chain.\n\nPharma loses $35B/year to cold-chain failures — and the logs are self-reported.\n\nSuperMesh version: the temperature logger stakes on every reading. One excursion above 8°C is permanent, provable, on-chain.\n\nCompliance becomes cryptography.`,
  },
  {
    // M — AI data
    k: "vs",
    g: { title: "USE CASE 06: AI TRAINING DATA", l: { h: "MODELS TODAY", items: ["scraped data", "unverifiable provenance", "increasingly synthetic", "garbage in, gospel out"] }, r: { h: "MESH ARCHIVE", items: ["sensor-signed data", "cryptographic provenance", "staked accuracy", "clean ground truth"] }, v: "the cleanest physical-world dataset ever assembled" },
    t: `Use case 06: AI.\n\nModels train on scraped, unverifiable, increasingly synthetic data.\n\nThe mesh accumulates the opposite: sensor-signed, staked, timestamped physical ground truth.\n\nAI labs will pay for provenance. The archive alone becomes an asset.`,
  },
  {
    // S — RWA
    k: "quote",
    g: { q: "A tokenized solar farm is a PDF until a staked meter proves it's producing.", a: "— use case 07: rwa performance" },
    t: `Use case 07: RWAs.\n\nThe token says "solar farm, 12% yield."\n\nThe staked meter says whether that's true, every slot, with slashing.\n\nAsset performance, verified at the source.`,
  },
  {
    // S — weather derivs
    k: "stat",
    g: { kick: "USE CASE 08", big: "1 SLOT", cap: "weather option settles against a finalized reading", foot: "tradfi does this in T+days off an index you can't audit" },
    t: `Use case 08: weather derivatives on Solana.\n\nWrite a rainfall option → settlement reads the finalized on-chain value → payout in one slot.\n\nTradFi does this at $25B notional, T+days, off indexes you can't audit.`,
  },
  {
    // M — accountability
    k: "map",
    g: { title: "USE CASE 09: CITIZEN MONITORING", tags: ["factory AQI: staked", "city noise: staked"], note: "cities self-report. factories self-report. incentives are... misaligned." },
    t: `Use case 09: accountability.\n\nCities self-report pollution. Factories self-report emissions. The incentives are exactly what you think.\n\nCitizen sensor networks with stake create an independent, unfalsifiable public record.\n\nSousveillance infrastructure.`,
  },
  {
    // M — location
    k: "flow",
    g: { title: "USE CASE 10: PROOF OF LOCATION", sub: "THE PRIMITIVE UNDER EVERYTHING", steps: [["ATTEST", "'this happened HERE'"], ["STAKE", "backed by SOL"], ["UNLOCK", "logistics · geofences"], ["COMPOUND", "primitives stack"]], hot: 0, note: "verified location underlies half of depin" },
    t: `Use case 10: proof of location.\n\nVerified "this happened HERE" unlocks logistics milestones, geofenced payments, supply chain audits, mobility mining.\n\nLocation attestation with slashable stake is a primitive. Primitives compound.`,
  },
  {
    // A — the rollup
    k: "check",
    g: { title: "TEN MARKETS. ONE DEPENDENCY.", items: [["insurance — $40B parametric", "ok"], ["prediction markets — resolution", "ok"], ["energy — p2p settlement", "ok"], ["carbon — anti-fraud", "ok"], ["cold chain — $35B losses", "ok"], ["AI · RWA · derivs · monitoring · location", "ok"]], note: "the shared dependency is data someone staked money on" },
    t: `Count them:\n\ninsurance, prediction markets, energy, carbon, cold chain, AI data, RWAs, weather derivs, monitoring, location.\n\nTen markets. One shared dependency: physical data someone staked money on.\n\nThat dependency is what we're building. That's the asymmetry.`,
  },
  {
    // M — builders CTA
    k: "term",
    g: { title: "builders — the mesh is your backend", lines: [["$", "git clone github.com/supermesh99"], ["$", "npm run demo"], ["ok", "stake → report → challenge → slash: all green"], ["hi", "reading PDAs are CPI-ready"], ["", "build the insurance vault. the data layer is handled."]], note: "hackathon-ready primitives" },
    t: `Solana builders:\n\nreading PDAs you can CPI into ✅\nlive console to test against ✅\nopen Rust + TS reference ✅\n\nBuild the insurance vault. Build the weather market. The data layer is handled.\n\ngithub.com/supermesh99`,
  },
  {
    // S — engagement
    k: "map",
    g: { title: "WHAT WOULD YOU MEASURE?", tags: ["your idea here"], note: "reply with the network you'd launch" },
    t: `You can deploy a SuperMesh network for ANY measurable thing.\n\nWhat would you launch?\n\n🌧 rain · 🔊 noise · ⚡ energy · 🌫 air · 🚗 traffic · 🌊 flood\n\nBest reply gets pinned when network #1 ships. 👇`,
  },
  {
    // M — agents
    k: "flow",
    g: { title: "AGENTS NEED GROUND TRUTH", sub: "THE MACHINE-TO-MACHINE ECONOMY", steps: [["AI AGENT", "needs a fact"], ["QUERY", "the mesh"], ["PAY", "0.001 SOL"], ["SETTLE", "staked answer, 400ms"]], hot: 3, accent: "purple", note: "no humans in the loop. just truth at machine speed." },
    t: `AI agents are about to transact autonomously.\n\nAn agent insuring cargo or settling a bet needs ground truth it can verify WITHOUT trusting a human.\n\nAgents + staked sensors = the machine-to-machine economy.\n\nWe're the truth API for agents.`,
  },
  {
    // S
    k: "quote",
    g: { q: "You can't trade what you can't verify. After the mesh, you can verify everything.", a: "— imagine shorting smog" },
    t: `Once air quality is a finalized on-chain series, someone will build AQI perps.\n\nImagine shorting smog.\n\nYou can't trade what you can't verify. Soon you can verify everything.`,
  },
  {
    // X
    k: "drake",
    g: { no: "'online bookstore' — too niche (1997)", yes: "'staked sensor data on solana' — you are here" },
    t: `"online bookstore" — too niche\n"payments for ebay" — too niche\n"price feeds for defi" — too niche\n\n"staked sensor data on solana" — you are here\n\nniche + inevitable = the entire game`,
  },
  {
    // M — one reading, many consumers
    k: "stat",
    g: { kick: "PROTOCOL LEVERAGE", big: "1 → ∞", cap: "one finalized reading can settle 10,000 policies at once", foot: "one truth, infinite consumers, zero marginal cost" },
    t: `A single finalized rainfall reading can simultaneously:\n\n— settle 10,000 insurance policies\n— resolve 50 prediction markets\n— trigger irrigation payments\n— update a climate index\n\nOne truth, infinite consumers, zero marginal cost. Protocol leverage.`,
  },
  {
    // S
    k: "stat",
    g: { kick: "SENSORS DON'T SLEEP", big: "24/7", cap: "earning per verified reading while you do literally anything else", foot: "passive income that's actually passive. operator season soon." },
    t: `A mesh sensor:\n\nworks 24/7 · never asks for a raise · earns per verified reading · builds reputation while you sleep\n\nPassive income that's actually passive — and actually income.`,
  },
  {
    // day 5 closer
    k: "tl",
    g: { title: "DAY 5 DONE. THE MAP IS DRAWN.", ev: [["day 1-2", "the problem"], ["day 3", "the code"], ["day 4", "the money"], ["day 5", "the markets"], ["day 6", "the memes"]], note: "tomorrow we shitpost. you earned it." },
    t: `Day 5 complete. Ten use cases, ten markets, one dependency.\n\nTomorrow is meme day. The protocol is serious. The timeline doesn't have to be.\n\nSaturday, we shitpost.`,
  },

  // ---- DAY 6: meme day ----
  {
    // X — opener
    k: "meme",
    g: { top: "serious protocol", bottom: "unserious saturday", stamp: "MEME DAY", stampColor: "green" },
    t: `gm. day 6.\n\nthe program is audited by game theory, the timeline is audited by nobody\n\ntoday: memes, hot takes, and uncomfortable oracle truths. buckle up.`,
  },
  {
    k: "drake",
    g: { no: "oracle with a customer support line", yes: "oracle with a slash function" },
    t: `their oracle: "please open a ticket, our team will investigate the incorrect feed"\n\nour oracle: the liar's stake is already in the challenger's wallet\n\nthere is a difference`,
  },
  {
    k: "meme",
    g: { top: "nothing personal kid", bottom: "my reading just finalized", stamp: "SETTLED", stampColor: "green" },
    t: `nothing personal kid, my reading survived its challenge window, finalized on solana, and paid out while you were still arguing in the replies about whether it rained`,
  },
  {
    k: "meme",
    g: { top: "touch grass?", bottom: "we measure it. soil moisture: 34%.", stamp: "STAKED", stampColor: "green" },
    t: `CT: "touch grass"\n\nsupermesh operators: already there. soil moisture 34%, signed on-device, staked 5 SOL, challenge window closes in 58 minutes\n\nthe most grass-touching protocol on solana`,
  },
  {
    // M — five stages
    k: "tl",
    g: { title: "THE FIVE STAGES OF ORACLE GRIEF", ev: [["denial", "'our feed is fine'"], ["anger", "'exploited?!'"], ["bargaining", "'add 2 nodes'"], ["depression", "'trust... everywhere'"], ["acceptance", "stake & slash"]], note: "skip to stage five" },
    t: `the five stages of oracle grief:\n\n1. denial — "our feed is fine"\n2. anger — "the oracle got exploited?!"\n3. bargaining — "maybe add 2 more nodes"\n4. depression — "it's trust assumptions all the way down"\n5. acceptance — stake & slash\n\nskip to stage 5`,
  },
  {
    k: "drake",
    g: { no: "anon influencer (risks nothing when wrong)", yes: "anon rain gauge (stakes everything, every hour)" },
    t: `an anon influencer risks nothing when wrong\n\nan anon SENSOR risks its whole stake on every reading\n\nthe most trustworthy anon on crypto twitter is a rain gauge in a field. think about it.`,
  },
  {
    k: "meme",
    g: { top: "breaking: local protocol", bottom: "trusted an api. lost everything.", stamp: "PREVENTABLE", stampColor: "red" },
    t: `local defi protocol trusted an unverified feed\n\nfeed was wrong for 6 hours. nobody slashed. nobody accountable. a postmortem blog was written.\n\nthis happens monthly and we all just... accept it?`,
  },
  {
    // M — chad table
    k: "vs",
    g: { title: "VIRGIN TRUSTED NODE vs CHAD CHALLENGER", l: { h: "VIRGIN NODE", items: ["begs for allowlist spot", "'please believe my feed'", "slashable: no", "accountability: vibes"] }, r: { h: "CHAD CHALLENGER", items: ["scans every reading", "bonds SOL against liars", "paid from slashed stake", "sleeps well"] }, v: "the mesh breeds chads" },
    t: `virgin trusted-node: "please believe my feed, I'm on the approved list"\n\nchad challenger: scans every reading, bonds SOL against liars, gets paid from their slashed stake, sleeps like a baby`,
  },
  {
    k: "meme",
    g: { top: "it rained. nobody approved it.", bottom: "the chain recorded it anyway.", stamp: "PERMISSIONLESS", stampColor: "green" },
    t: `it rained\na sensor caught it\nthe chain recorded it\nnobody approved it\n\nno data vendor, no committee, no api gateway\n\npermissionless measurement of a permissionless universe`,
  },
  {
    k: "drake",
    g: { no: "tokenize the toaster (hardware coupon)", yes: "tokenize the truth (verified output)" },
    t: `hot take: 90% of depin tokens are loyalty points for buying a gadget\n\nthe value was never the hardware. it's the VERIFIED OUTPUT of the hardware\n\ntokenize the truth, not the toaster`,
  },
  {
    k: "meme",
    g: { top: "why 'supermesh'?", bottom: "because regular mesh wasn't enough", stamp: "HONEST", stampColor: "green" },
    t: `q: why "supermesh"?\n\na: it's a mesh of sensors, stakes, and challenges. also supermesh.live was available.\n\ntransparency is our whole thing. even about naming.`,
  },
  {
    // M — mid-meme engagement
    k: "map",
    g: { title: "WAR STORIES WANTED", tags: ["oracle exploits", "bad feeds", "resolution drama"], note: "what's the most expensive data lie you've witnessed?" },
    t: `engagement experiment:\n\nwhat's the most expensive data failure you've seen in crypto? oracle exploits, bad feeds, resolution drama — war stories welcome 👇\n\nbest story gets a shoutout when we cross 3k`,
  },
  {
    k: "meme",
    g: { top: "the mesh doesn't pivot", bottom: "it accumulates", stamp: "INEVITABLE", stampColor: "green" },
    t: `cheap sensors: inevitable\ncheap blockspace: inevitable\ndemand for verified reality: inevitable\n\na protocol connecting all three: also inevitable\n\nwe're just making sure it's built right`,
  },
  {
    k: "drake",
    g: { no: "roadmap deck, 40 slides, 'testnet q3 2027'", yes: "console live, repo public, demo runs in 1 command" },
    t: `them: 40-slide deck, "testnet Q3 2027"\n\nus: console is live, program is open source, demo runs in one command, slash function has tests\n\nshow > tell\n\nsupermesh.live/console`,
  },
  {
    k: "meme",
    g: { top: "honest operators", bottom: "sleep extremely well", stamp: "COMFY", stampColor: "green" },
    t: `an honest operator's evening:\n\nsensor reporting ✅\nstake safe (the data's real) ✅\nrewards accruing ✅\nreputation compounding ✅\n\nhonesty as a passive income strategy. revolutionary stuff.`,
  },
  {
    // S quote
    k: "quote",
    g: { q: "Ping. The mesh grows.", a: "— somewhere, another device just staked in" },
    t: `somewhere right now:\n\na keypair is generated\na stake instruction lands\na sensor joins the mesh\nthe world gets slightly harder to lie about\n\nping.`,
  },
  {
    k: "meme",
    g: { top: "we're hiring critics", bottom: "unpaid. brutal. essential.", stamp: "APPLY NOW", stampColor: "green" },
    t: `open position: CRITIC\n\nrequirements: read the code, try to break the game theory, post findings publicly\n\ncompensation: being right, publicly, with timestamps\n\napply via github issues. serious offer.\n\ngithub.com/supermesh99`,
  },
  {
    // M — weekend homework
    k: "term",
    g: { title: "weekend homework — 10 minutes", lines: [["$", "open github.com/supermesh99"], ["", "read the README (6 diagrams, no fluff)"], ["$", "open supermesh.live/console"], ["", "click through a challenge yourself"], ["ok", "form your own thesis"], ["hi", "ten minutes now beats fomo later"]], note: "class dismissed" },
    t: `weekend homework for the curious:\n\n1. read the README — github.com/supermesh99\n2. click through the console — supermesh.live\n3. form your own thesis\n\nten minutes now beats FOMO later. class dismissed.`,
  },
  {
    k: "meme",
    g: { top: "day 6 complete", bottom: "the memes were staked too", stamp: "SURVIVED", stampColor: "green" },
    t: `day 6 done. memes delivered.\n\ntomorrow: the vision, the recap, genesis details, and one announcement.\n\nif you've been lurking all week — tomorrow's the day to un-lurk.`,
  },
  {
    // bonus meme-day post
    k: "meme",
    g: { top: "sunday preview:", bottom: "the mesh reveals its plans", stamp: "TOMORROW", stampColor: "green" },
    t: `the quiet ones are watching. we see the profile visits, the repo clones, the console sessions.\n\nyou don't have to post. just keep watching.\n\nthe mesh will do the talking.`,
  },
  // ---- extra day-5/6 fillers ----
  {
    k: "stat",
    g: { kick: "USE CASE MATH", big: "$35B", cap: "lost yearly to cold-chain failures alone", foot: "one vertical. one protocol fee away.", color: "red" },
    t: `Cold chain losses: $35B/year.\nCarbon credit fraud: billions.\nInsurance adjuster overhead: billions.\n\nEvery number on this list is a bug in how the world verifies data.\n\nBugs are bounties.`,
  },
  {
    k: "flow",
    g: { title: "HOW A FARMER GETS PAID", sub: "NO FORMS. NO ADJUSTER. NO WAIT.", steps: [["DROUGHT", "rain < 10mm"], ["READING", "finalizes on-chain"], ["POLICY", "auto-triggers"], ["PAYOUT", "same day"]], hot: 3, accent: "green", note: "insurance without the insurance company experience" },
    t: `How a farmer gets paid on mesh-backed insurance:\n\ndrought happens → reading finalizes below threshold → policy auto-triggers → payout lands same day\n\nNo forms. No adjuster. No 6-month wait. No "claim denied."\n\nInsurance without the insurance-company experience.`,
  },
  {
    k: "drake",
    g: { no: "resolving 'did it rain?' with a dao vote", yes: "resolving it with a staked rain gauge" },
    t: `prediction markets in 2026 still resolving "did it rain in NYC" with governance votes and appeal periods\n\nmeanwhile a $30 rain gauge with staked SOL knows the answer in real time`,
  },
  {
    k: "meme",
    g: { top: "the archive knows", bottom: "what the weather was", stamp: "FOREVER", stampColor: "green" },
    t: `side effect nobody prices:\n\nthe mesh accumulates an immutable, timestamped archive of physical reality\n\nbacktest weather derivs. train models on verified data. audit any moment in history.\n\nthe archive alone becomes an asset`,
  },
  {
    k: "quote",
    g: { q: "Every measurable thing on earth is a potential revenue stream once it's verifiable.", a: "— measurements into markets" },
    t: `Temperature. Rainfall. Noise. Footfall. Voltage. Vibration.\n\nEvery measurable thing on earth is a potential revenue stream once it's verifiable.\n\nWe turn measurements into markets.`,
  },
  {
    k: "meme",
    g: { top: "smart contract lawyers", bottom: "hate this one trick", stamp: "AUTOMATED", stampColor: "green" },
    t: `parametric insurance on the mesh has:\n\nno claims department\nno adjusters\nno appeals process\nno lawyers\n\njust a threshold and a finalized reading\n\nentire professions replaced by an if statement`,
  },
  {
    k: "stat",
    g: { kick: "MEME DAY STAT", big: "0", cap: "admin keys that can edit finalized truth", foot: "we counted twice" },
    t: `number of admin keys that can edit a finalized reading: 0\n\nnumber of times we've been asked "but what if YOU need to fix the data": 14\n\nanon, needing to fix the data IS the exploit`,
  },
  {
    k: "vs",
    g: { title: "WEB2 SENSOR vs MESH SENSOR", l: { h: "WEB2 SENSOR", items: ["reports to a server", "data editable upstream", "paid in exposure", "identity: a database row"] }, r: { h: "MESH SENSOR", items: ["reports to solana", "immutable once final", "paid in SOL", "identity: a keypair"] }, v: "same hardware. different universe." },
    t: `same $30 sensor, two universes:\n\nweb2: reports to a server, data editable upstream, identity is a database row\n\nmesh: reports to solana, immutable once finalized, paid in SOL, identity is a keypair\n\nthe hardware was never the problem`,
  },
  {
    k: "meme",
    g: { top: "day 6 bonus round", bottom: "tag a builder who should see this", stamp: "SPREAD", stampColor: "green" },
    t: `meme day bonus round:\n\ntag one solana builder who should be building on verified physical data\n\nwe'll DM the best matches a genesis preview 👀`,
  },
  {
    k: "quote",
    g: { q: "A protocol that pays people to catch lies will always beat one that asks them not to tell any.", a: "— day 6 wisdom, surprisingly sober" },
    t: `a protocol that PAYS people to catch lies will always beat one that politely asks participants not to tell any\n\nincentives are the only moderation that scales`,
  },
];
