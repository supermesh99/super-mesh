// Posts 151–200 — Day 7: vision, FAQs, genesis CTA, evergreen bangers.
export const POSTS_D = [
  {
    // A — opener
    k: "quote",
    g: { q: "Every fact about the physical world will eventually carry a stake, a challenge window, and a settlement.", a: "— the supermesh thesis. day 7." },
    t: `gm. Day 7. Final day of launch week.\n\nThe thesis, one sentence:\n\nEvery fact about the physical world will eventually carry a stake, a challenge window, and a settlement — and Solana is the only chain fast and cheap enough to host it.\n\nToday: vision, recap, what's next.`,
  },
  {
    // M — recap
    k: "tl",
    g: { title: "LAUNCH WEEK, MAPPED", ev: [["day 1-2", "unverified world"], ["day 3", "the rust"], ["day 4", "the flywheel"], ["day 5", "ten markets"], ["day 6-7", "memes + vision"]], note: "200 posts. 1 thesis. all receipts public." },
    t: `Launch week recap:\n\nDay 1-2: why unverified data breaks everything\nDay 3: the protocol, in Rust\nDay 4: the economics\nDay 5: ten trillion-dollar use cases\nDay 6: memes (important)\nDay 7: you are here\n\nAll receipts: github.com/supermesh99`,
  },
  {
    // M — exists today
    k: "check",
    g: { title: "EXISTS TODAY (NOT A ROADMAP)", items: [["anchor program: stake/report/challenge/slash/claim", "ok"], ["fraud-path test suite", "ok"], ["live console", "ok"], ["open repo", "ok"], ["deck", "no"], ["promises", "no"]], note: "not a pitch. a protocol." },
    t: `What exists today, right now:\n\n✅ Anchor program — stake, report, challenge, slash, claim\n✅ LiteSVM tests incl. fraud paths\n✅ Live console\n✅ Open repo\n\nNot a deck. A protocol.\n\nsupermesh.live · github.com/supermesh99`,
  },
  {
    // A — 10 years
    k: "stat",
    g: { kick: "THE 2036 VIEW", big: "INVISIBLE", cap: "infrastructure wins by disappearing into everything", foot: "nobody says 'verified data' — the other kind just stopped being accepted" },
    t: `2036: every insurance payout, carbon credit, energy trade, and shipment milestone references a staked sensor reading.\n\nNobody says "verifiable data" anymore — the other kind just stopped being accepted.\n\nInfrastructure wins by becoming invisible. Right now it's still visible.`,
  },
  {
    // M — genesis plan
    k: "stack",
    g: { title: "GENESIS NETWORKS", layers: [["MESH 001 — WEATHER", "rainfall + temp, insurance-grade windows", true], ["MESH 002 — AIR", "city-scale AQI", false], ["MESH 003 — COMMUNITY", "you vote on it", false]], note: "genesis operators: boosted rewards + permanent early reputation" },
    t: `Genesis plan:\n\nMESH 001 — weather (rainfall + temp), insurance-grade\nMESH 002 — air quality, city-scale\nMESH 003 — community choice. You vote.\n\nGenesis operators get boosted rewards + a permanent early-device track record no latecomer can replicate.\n\nDetails drop here first.`,
  },
  {
    // S
    k: "quote",
    g: { q: "Early doesn't feel like early. It feels like a repo with 12 stars.", a: "— it only looks obvious in the retrospective thread" },
    t: `Early doesn't feel like early.\n\nIt feels like a repo with 12 stars and a follower count in 3 digits.\n\nIt never feels obvious. It only LOOKS obvious in the retrospective thread.`,
  },
  {
    // M — the ask
    k: "check",
    g: { title: "THE LAUNCH WEEK ASK — PICK ONE", items: [["follow @supermesh99", "ok"], ["QT with your hottest oracle take", "ok"], ["send to one solana builder", "ok"], ["do nothing and fomo later", "no"]], note: "hunting 3,000 people who get it" },
    t: `The launch week ask — pick one:\n\n1. Follow @supermesh99\n2. QT this with your hottest oracle take\n3. Send it to one Solana builder you respect\n\nWe're hunting 3,000 people who get it. Reading this far suggests you're one.`,
  },
  {
    // S — mantra
    k: "flow",
    g: { title: "THE MANTRA", sub: "REMEMBER THREE WORDS", steps: [["SIGNED", "on-device ed25519"], ["STAKED", "SOL behind it"], ["SETTLED", "challenge-tested"]], hot: 2, accent: "green", note: "everything else is commentary" },
    t: `Three words to remember us by:\n\nSIGNED — on the device, Ed25519\nSTAKED — SOL behind every reading\nSETTLED — challenge-tested on Solana\n\nEverything else is commentary.`,
  },
  {
    // FAQ 1
    k: "term",
    g: { title: "faq 01 — 'is there a token?'", lines: [["$", "supermesh faq --q token"], ["", "the protocol runs on SOL stakes today"], ["hi", "anything else: announced ONLY via @supermesh99"], ["err", "anyone else claiming a token = scam"], ["ok", "stay sharp"]], note: "the honest answer" },
    t: `FAQ: "is there a token?"\n\nHonest answer: the protocol runs on SOL stakes today. Anything beyond that gets announced ONLY on @supermesh99 and the repo.\n\nAnyone else claiming a SuperMesh token is scamming you. Stay sharp.`,
  },
  {
    // FAQ 2
    k: "check",
    g: { title: "FAQ 02 — 'DO I NEED HARDWARE?'", items: [["operators: any ed25519-capable sensor", "ok"], ["challengers: zero hardware, just SOL + vigilance", "ok"], ["builders: just the reading PDAs", "ok"], ["buying our branded box", "no"]], note: "three ways in. pick your lane." },
    t: `FAQ: "do I need to buy hardware?"\n\nOperators: any Ed25519-capable sensor works — we sell nothing.\nChallengers: zero hardware. SOL and vigilance.\nBuilders: just the reading PDAs.\n\nThree ways in. Pick your lane.`,
  },
  {
    // FAQ 3
    k: "vs",
    g: { title: "FAQ 03 — 'HOW IS THIS NOT HELIUM?'", l: { h: "HELIUM", items: ["rewards coverage", "infra for existing", "data assumed honest"] }, r: { h: "SUPERMESH", items: ["rewards correctness", "stake behind data", "lying = slashed"] }, v: "complementary layers — only one settles money on data" },
    t: `FAQ: "how is this different from Helium?"\n\nHelium rewards infrastructure for EXISTING (coverage).\nSuperMesh rewards data for being CORRECT (slashing).\n\nComplementary layers — but only one makes data trustworthy enough to settle money on.`,
  },
  {
    // FAQ 4
    k: "flow",
    g: { title: "FAQ 04 — 'WHAT STOPS FAKE SENSORS?'", sub: "RUN ONE FROM YOUR LAPTOP. SEE WHAT HAPPENS.", steps: [["FAKE", "laptop 'sensor'"], ["DIVERGES", "from neighbors + satellites"], ["CHALLENGED", "by anyone"], ["SLASHED", "stake gone"]], hot: 3, accent: "red", note: "faking costs stake. truth earns fees. math does the policing." },
    t: `FAQ: "can't someone run a fake sensor from a laptop?"\n\nSure — and lose their stake the moment their data diverges from neighbors, satellites, or any challenger's evidence.\n\nFaking costs stake. Truth earns fees. The math does the policing.`,
  },
  {
    // FAQ 5
    k: "quote",
    g: { q: "Pulling an API on-chain doesn't verify the API. Garbage in, gospel out.", a: "— faq 05: 'why not just use chainlink?'" },
    t: `FAQ: "why not Chainlink Functions?"\n\nPulling an API on-chain doesn't verify the API. Garbage in, gospel out.\n\nSuperMesh verifies at the SOURCE — device signs, operator stakes, the world challenges.\n\nProvenance > plumbing.`,
  },
  {
    // M — 3-sided market
    k: "loop",
    g: { title: "THE 3-SIDED MARKETPLACE", center: "MESH", centerSub: "EACH SIDE STRENGTHENS THE OTHERS", nodes: ["operators supply staked data", "challengers police for bounties", "consumers pay for settled truth"], note: "three-sided moats are the deepest kind" },
    t: `SuperMesh is a 3-sided market:\n\nOPERATORS supply staked data\nCHALLENGERS police it for bounties\nCONSUMERS pay for settled truth\n\nEach side makes the others stronger. Three-sided moats are the deepest kind.`,
  },
  {
    // M — commitments
    k: "check",
    g: { title: "ON THE RECORD, PERMANENTLY", items: [["admin key that can alter finalized data", "no"], ["paid 'verified' badges for operators", "no"], ["closed-source settlement logic", "no"], ["pivot away from solana", "no"], ["ship code + post memes", "ok"]], note: "screenshot this. hold us to it." },
    t: `On the record, permanently. We will never:\n\n— add an admin key that can alter finalized data\n— sell "verified" badges\n— close-source the settlement logic\n— pivot away from Solana\n\nScreenshot this. Hold us to it.`,
  },
  {
    // S
    k: "stat",
    g: { kick: "ONE WEEK AGO", big: "0", cap: "followers. today: a mesh of traders, builders, operators.", foot: "everyone here is pre-genesis. we don't forget that." },
    t: `One week ago this account had zero followers.\n\nToday: a growing mesh of traders, builders, and future operators who understand the thesis.\n\nEveryone here is pre-genesis. We don't forget that.`,
  },
  {
    // S — bookmark
    k: "meme",
    g: { top: "bookmark this account", bottom: "check the timestamps later", stamp: "RECEIPTS", stampColor: "green" },
    t: `do yourself a favor: bookmark this account.\n\nwhen verifiable physical data is a top-3 solana narrative, come back and check the timestamps.\n\nbeing early only counts if you can prove it. we're big on proof here.`,
  },
  {
    // M
    k: "quote",
    g: { q: "Control the facts and you control the price. That's why data fraud pays — until facts become unfakeable.", a: "— supermesh is a fairness machine" },
    t: `Every asset price is downstream of facts.\n\nControl the facts → control the price. That's why data fraud pays.\n\nMake facts unfakeable and every market downstream gets fairer.\n\nNot a data company. A fairness machine.`,
  },
  {
    // M — DD checklist
    k: "term",
    g: { title: "your DD checklist", lines: [["$", "open github.com/supermesh99"], ["", "[ ] read lib.rs — the instruction set"], ["", "[ ] read the slash tests"], ["", "[ ] run the console flow yourself"], ["", "[ ] check the treasury is a PDA"], ["ok", "dyor is easy when everything's public"]], note: "read the code, not the vibes" },
    t: `SuperMesh DD checklist:\n\n□ read lib.rs — the instruction set\n□ read the slash tests\n□ run the console flow yourself\n□ verify the treasury is a PDA\n\nAll public: github.com/supermesh99\n\nRead the code, not the vibes.`,
  },
  {
    // M — operators prep
    k: "check",
    g: { title: "OPERATORS: START YOUR KEYPAIRS", items: [["a solana keypair", "ok"], ["devnet SOL", "ok"], ["optional: any sensor that can sign", "ok"], ["patience for the cohort drop", "ok"]], note: "devnet season is being finalized. cohort will be small on purpose." },
    t: `Pre-announcement: devnet operator season is being finalized.\n\nPrep:\n— a Solana keypair\n— devnet SOL\n— optionally, any sensor that can sign\n\nCohort size limited on purpose. Genesis reputation won't repeat. Instructions drop here first.`,
  },
  {
    // S
    k: "quote",
    g: { q: "Networks with memory compound.", a: "— every epoch: deeper history, bigger treasury, more integrations" },
    t: `Each epoch the mesh gets harder to kill:\n\nmore finalized history → reputation deepens\nmore slashes → treasury grows\nmore CPIs → integration surface widens\n\nNetworks with memory compound.`,
  },
  {
    // X
    k: "meme",
    g: { top: "physics doesn't need permission", bottom: "neither does measuring it", stamp: "OPEN", stampColor: "green" },
    t: `the rain doesn't ask a committee\nthe sensor doesn't ask an api gateway\nthe chain doesn't ask anyone\n\npermissionless measurement of a permissionless universe`,
  },
  {
    // M
    k: "stat",
    g: { kick: "INTEGRATIONS THAT CAN'T CHURN", big: "CPI", cap: "a program composing with a reading PDA is permanent", foot: "think about what that does to a moat over 5 years" },
    t: `When a protocol integrates a REST API, that's a dependency.\n\nWhen a Solana program CPIs into a mesh reading, that's a permanent, unbreakable composition.\n\nIntegrations that can't churn. Think about what that does to a moat over 5 years.`,
  },
  {
    // S — city question
    k: "map",
    g: { title: "WHERE SHOULD MESH 001 DEPLOY?", tags: ["your city?"], note: "this is not hypothetical — answers shape genesis" },
    t: `Genesis question:\n\nIf MESH 001 (weather) launches in ONE city first — which city and why?\n\nBest answers shape the actual deployment. This is not hypothetical. 👇`,
  },
  {
    // M
    k: "quote",
    g: { q: "Information wants to be verified.", a: "— the 2026 correction to a 1984 slogan" },
    t: `"Information wants to be free" — 1984\n\n2026 correction: information wants to be VERIFIED. Free data drowned us. Verified data saves us.\n\nThe scarcest resource this decade isn't information. It's proof.`,
  },
  {
    // M — week 2 preview
    k: "tl",
    g: { title: "WEEK 2: BUILD WEEK", ev: [["mon", "mesh 001 params"], ["tue", "operator guide"], ["wed", "integration docs"], ["thu", "community vote"], ["fri", "showcase"]], note: "the cadence continues. the mesh compounds." },
    t: `Launch week ends. Build week begins.\n\nNext up:\n— MESH 001 network parameters\n— operator quickstart guide\n— builder integration docs\n— community network vote\n\nSame place. Same cadence.`,
  },
  {
    // S
    k: "meme",
    g: { top: "if you forget everything else", bottom: "remember this one", stamp: "CORE THESIS", stampColor: "green" },
    t: `if you forget everything else from this week:\n\ndata without stake is just a rumor with good formatting.\n\nsupermesh makes data post collateral.`,
  },
  {
    // ---- evergreen bangers to close the 200 ----
    k: "stat",
    g: { kick: "THE LAST UNPRICED MARKET", big: "EARTH", cap: "stocks priced every ms. crypto every slot. rainfall? nobody.", foot: "the biggest dataset on earth has no market. yet." },
    t: `Stocks: priced every millisecond.\nCrypto: every slot.\nRainfall in your city right now: priced by nobody.\n\nThe biggest dataset on earth has no market.\n\nYet.`,
  },
  {
    k: "drake",
    g: { no: "reputation systems built on talk", yes: "reputation = ledger of survived challenges" },
    t: `reputation systems fail because talk is cheap\n\nmesh reputation is a ledger of survived challenges and absorbed slashes — consequence-weighted history\n\nthe only kind that counts`,
  },
  {
    k: "flow",
    g: { title: "HOW A LIE DIES ON THE MESH", sub: "60 MINUTES, START TO FINISH", steps: [["LIE", "fake reading posted"], ["CAUGHT", "challenger bonds"], ["SLASHED", "stake seized"], ["FUNDED", "defenders paid"]], hot: 2, accent: "red", note: "the lie's funeral is publicly indexed" },
    t: `The lifecycle of a lie on the mesh:\n\nposted → challenged → slashed → funds the people who caught it\n\nStart to finish: about an hour. The funeral is publicly indexed forever.`,
  },
  {
    k: "quote",
    g: { q: "We'd rather be forked than followed blindly.", a: "— criticism with receipts is contribution" },
    t: `Best case isn't blind believers — it's builders who read the code, find the sharp edges, and ship on top anyway.\n\nCriticism with receipts is contribution.\n\nRepo's open. Issues welcome.`,
  },
  {
    k: "meme",
    g: { top: "the sensors are", bottom: "already listening", stamp: "PING", stampColor: "green" },
    t: `somewhere, a rain gauge is measuring\na keypair is signing\na stake is waiting to back it\n\nthe mesh doesn't wait for narratives. it accumulates truth, block by block.`,
  },
  {
    k: "bars",
    g: { title: "TRUST, BY COUNTERPARTY", bars: [["a stranger's tweet", "0", 0.04, false], ["a corporate API", "some", 0.3, false], ["a staked sensor", "computable", 1, true]], note: "trust you can compute is the only kind that scales" },
    t: `Trust levels:\n\na stranger's tweet: zero\na corporate API: "some"\na staked sensor with slashing: computable\n\nTrust you can compute is the only kind that scales.`,
  },
  {
    k: "stat",
    g: { kick: "MACHINE ECONOMY SPEED", big: "0.001", cap: "SOL for a staked answer to 'did the shipment stay cold?'", foot: "no humans in the loop. truth at machine speed." },
    t: `End state:\n\nAn AI agent needs to know if a shipment stayed cold. It queries the mesh, pays 0.001 SOL to a machine, gets a staked answer in 400ms, settles a contract.\n\nNo humans in the loop. Truth at machine speed.`,
  },
  {
    k: "vs",
    g: { title: "TWO KINDS OF PROJECTS", l: { h: "LAUNCHED IN HYPE", items: ["announcement first", "product 'soon'", "dies in silence"] }, r: { h: "BUILT IN SILENCE", items: ["product first", "announcement after", "launches into hype"] }, v: "we chose the second kind" },
    t: `Projects launched in hype die in silence.\nProjects built in silence launch into hype.\n\nProgram ✅ tests ✅ console ✅ — all before the first tweet.\n\nWe chose the second kind.`,
  },
  {
    k: "meme",
    g: { top: "your favorite protocol", bottom: "reads reality from our accounts", stamp: "SOON", stampColor: "green" },
    t: `prediction: within 2 years you'll use an app that settles real money on a mesh reading — and you won't even know it\n\ninfrastructure wins by disappearing`,
  },
  {
    k: "check",
    g: { title: "WHY THIS WINS: THE COMPOUNDING LIST", items: [["reputation history — grows daily", "ok"], ["treasury — grows with every slash", "ok"], ["integrations — permanent CPIs", "ok"], ["archive — verified reality, forever", "ok"], ["any of these, fakeable", "no"]], note: "four compounding assets, zero shortcuts" },
    t: `What compounds while we sleep:\n\n— device reputation history\n— protocol treasury (every slash)\n— permanent CPI integrations\n— the verified-reality archive\n\nFour compounding assets. Zero shortcuts available to competitors.`,
  },
  {
    k: "quote",
    g: { q: "The map is not the territory. But a staked map gets close.", a: "— week one, in one line" },
    t: `The map is not the territory.\n\nBut a map where every point is signed, staked, and challenge-tested?\n\nThat gets close enough to settle money on.`,
  },
  {
    k: "tl",
    g: { title: "YOUR POSITION ON THIS CURVE", ev: [["2013", "btc 'too niche'"], ["2017", "eth 'toy'"], ["2020", "sol 'ghost chain'"], ["2024", "depin 'gadgets'"], ["NOW", "verified reality"]], note: "every cycle, the same curve. different name." },
    t: `2013: bitcoin, "too niche"\n2017: ethereum, "a toy"\n2020: solana, "ghost chain"\n2024: depin, "gadget tokens"\nnow: verified physical data\n\nsame curve every cycle. different name. you know where you are on it.`,
  },
  {
    k: "meme",
    g: { top: "week one: complete", bottom: "the mesh is awake", stamp: "GENESIS", stampColor: "green" },
    t: `week one: complete.\n\nthe thesis: physical truth belongs on solana, backed by stake, tested by challenge.\n\nthe proof: github.com/supermesh99\nthe product: supermesh.live\n\nthe mesh is awake. 🕸`,
  },
  {
    k: "stat",
    g: { kick: "FOR THE ONES WHO SCROLLED THIS FAR", big: "YOU", cap: "aren't the audience. you're the cohort.", foot: "dm 'MESH' — the genesis operator list is forming quietly" },
    t: `if you read a week of posts about staked sensor data, you're not the audience.\n\nyou're the cohort.\n\nDM "MESH" — the genesis operator list is forming quietly.`,
  },
  {
    k: "loop",
    g: { title: "SEE YOU IN WEEK TWO", center: "TRUTH", centerSub: "THE LOOP CONTINUES", nodes: ["measure", "sign", "stake", "challenge", "settle"], note: "signed · staked · settled" },
    t: `measure → sign → stake → challenge → settle → repeat\n\nthe loop doesn't stop for weekends, narratives, or bear markets.\n\nsee you in week two. 🕸`,
  },
  {
    k: "quote",
    g: { q: "Twitter is where we talk. Solana is where we prove.", a: "— see you on-chain" },
    t: `Twitter is where we talk.\nSolana is where we prove.\n\nEverything claimed this week is checkable: the program, the tests, the console, the treasury.\n\nSee you on-chain. 🤝`,
  },
  {
    k: "meme",
    g: { top: "still here?", bottom: "go read the code", stamp: "NO EXCUSES", stampColor: "green" },
    t: `you've seen the thesis, the math, the memes\n\nonly one thing left:\n\ngithub.com/supermesh99\n\ngo read the code. then decide.`,
  },
  {
    k: "flow",
    g: { title: "THE ONLY ONBOARDING FLOW", sub: "PICK A LANE, START TODAY", steps: [["TRADER", "follow the metrics"], ["BUILDER", "CPI the readings"], ["OPERATOR", "stake a sensor"], ["HUNTER", "challenge lies"]], hot: 3, accent: "green", note: "the mesh has a seat for every skill" },
    t: `Four ways into the mesh:\n\nTRADER — follow the revenue metrics\nBUILDER — CPI into readings\nOPERATOR — stake a sensor\nHUNTER — challenge lies for bounties\n\nEvery skill has a seat. Pick a lane.`,
  },
  {
    k: "stat",
    g: { kick: "LAUNCH WEEK, MEASURED", big: "200", cap: "posts. 1 protocol. 0 promises without code behind them.", foot: "we're a data protocol. of course we measured it." },
    t: `launch week by the numbers:\n\n200 posts\n7 days\n1 protocol shipped before the first tweet\n0 promises we can't point to code for\n\nwe're a data protocol. of course we measured it.`,
  },
  {
    k: "bars",
    g: { title: "WHAT 7 DAYS BOUGHT US", bars: [["strangers", "day 0", 0.06, false], ["curious lurkers", "day 3", 0.45, false], ["the cohort", "day 7", 1, true]], note: "attention compounds faster than capital" },
    t: `What one week of building in public buys:\n\nday 0: strangers\nday 3: curious lurkers\nday 7: a cohort\n\nAttention compounds faster than capital. And it arrived before the token even exists. Noted.`,
  },
  {
    k: "quote",
    g: { q: "We didn't come this far to only come this far.", a: "— week 2 begins at sunrise" },
    t: `week one was the argument.\nweek two is the evidence.\n\nmesh 001 parameters drop monday. operators, sharpen your keypairs.`,
  },
  {
    k: "map",
    g: { title: "THE MESH, ONE WEEK IN", tags: ["operators", "hunters", "builders"], note: "every dot is someone who got here before the narrative" },
    t: `one week in, the mesh already has all three species:\n\noperators prepping sensors\nhunters studying the challenge game\nbuilders reading the CPI docs\n\nevery one of them arrived before the narrative. that's the cohort.`,
  },
  {
    k: "meme",
    g: { top: "the end", bottom: "(of week one)", stamp: "TO BE CONTINUED", stampColor: "green" },
    t: `end of week one. start of everything.\n\n@supermesh99 · supermesh.live · github.com/supermesh99\n\nsigned. staked. settled. 🕸⚡`,
  },
];
