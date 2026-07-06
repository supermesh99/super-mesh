//! End-to-end lifecycle tests for the SuperMesh program on LiteSVM.

use {
    anchor_lang::{
        prelude::Pubkey, solana_program::instruction::Instruction, AccountDeserialize,
        InstructionData, ToAccountMetas,
    },
    litesvm::LiteSVM,
    supermesh::state::{Device, Network, Reading, ReadingStatus},
    solana_keypair::Keypair,
    solana_message::{Message, VersionedMessage},
    solana_signer::Signer,
    solana_transaction::versioned::VersionedTransaction,
};

const NETWORK_NAME: &str = "pm25-blr";
const MIN_STAKE: u64 = 1_000_000_000; // 1 SOL
const REWARD_PER_READING: u64 = 10_000_000; // 0.01 SOL
const CHALLENGE_BOND: u64 = 100_000_000; // 0.1 SOL
const CHALLENGE_WINDOW_SLOTS: u64 = 100;

struct Harness {
    svm: LiteSVM,
    authority: Keypair,
    owner: Keypair,
    device_signer: Keypair,
    network: Pubkey,
    treasury: Pubkey,
    device: Pubkey,
}

impl Harness {
    fn new() -> Self {
        let program_id = supermesh::id();
        let mut svm = LiteSVM::new();
        let bytes = include_bytes!("../../../target/deploy/supermesh.so");
        svm.add_program(program_id, bytes).unwrap();

        let authority = Keypair::new();
        let owner = Keypair::new();
        let device_signer = Keypair::new();
        svm.airdrop(&authority.pubkey(), 10_000_000_000).unwrap();
        svm.airdrop(&owner.pubkey(), 10_000_000_000).unwrap();

        let (network, _) = Pubkey::find_program_address(
            &[b"network", NETWORK_NAME.as_bytes()],
            &program_id,
        );
        let (treasury, _) =
            Pubkey::find_program_address(&[b"treasury", network.as_ref()], &program_id);
        let (device, _) = Pubkey::find_program_address(
            &[b"device", network.as_ref(), device_signer.pubkey().as_ref()],
            &program_id,
        );

        Self {
            svm,
            authority,
            owner,
            device_signer,
            network,
            treasury,
            device,
        }
    }

    fn send(&mut self, ixs: &[Instruction], signers: &[&Keypair]) -> Result<(), String> {
        let blockhash = self.svm.latest_blockhash();
        let msg = Message::new_with_blockhash(ixs, Some(&signers[0].pubkey()), &blockhash);
        let tx = VersionedTransaction::try_new(VersionedMessage::Legacy(msg), signers)
            .map_err(|e| e.to_string())?;
        self.svm
            .send_transaction(tx)
            .map(|_| ())
            .map_err(|e| format!("{:?}", e.err))
    }

    fn account<T: AccountDeserialize>(&self, key: &Pubkey) -> T {
        let data = self.svm.get_account(key).unwrap().data;
        T::try_deserialize(&mut data.as_slice()).unwrap()
    }

    fn reading_pda(&self, index: u64) -> Pubkey {
        Pubkey::find_program_address(
            &[b"reading", self.device.as_ref(), index.to_le_bytes().as_ref()],
            &supermesh::id(),
        )
        .0
    }

    fn init_network(&mut self) {
        let ix = Instruction::new_with_bytes(
            supermesh::id(),
            &supermesh::instruction::InitNetwork {
                name: NETWORK_NAME.to_string(),
                min_stake: MIN_STAKE,
                reward_per_reading: REWARD_PER_READING,
                challenge_bond: CHALLENGE_BOND,
                challenge_window_slots: CHALLENGE_WINDOW_SLOTS,
            }
            .data(),
            supermesh::accounts::InitNetwork {
                authority: self.authority.pubkey(),
                network: self.network,
                treasury: self.treasury,
                system_program: anchor_lang::solana_program::system_program::ID,
            }
            .to_account_metas(None),
        );
        let authority = self.authority.insecure_clone();
        self.send(&[ix], &[&authority]).unwrap();

        // Fund the treasury with a reward budget.
        self.svm.airdrop(&self.treasury, 5_000_000_000).unwrap();
    }

    fn register_device(&mut self) {
        let ix = Instruction::new_with_bytes(
            supermesh::id(),
            &supermesh::instruction::RegisterDevice {
                stake: MIN_STAKE,
                geohash: "tdr1w".to_string(),
            }
            .data(),
            supermesh::accounts::RegisterDevice {
                owner: self.owner.pubkey(),
                device_signer: self.device_signer.pubkey(),
                network: self.network,
                device: self.device,
                treasury: self.treasury,
                system_program: anchor_lang::solana_program::system_program::ID,
            }
            .to_account_metas(None),
        );
        let owner = self.owner.insecure_clone();
        let device_signer = self.device_signer.insecure_clone();
        self.send(&[ix], &[&owner, &device_signer]).unwrap();
    }

    fn submit_reading(&mut self, index: u64, value: i64) -> Result<(), String> {
        let ix = Instruction::new_with_bytes(
            supermesh::id(),
            &supermesh::instruction::SubmitReading {
                data_hash: [7u8; 32],
                value,
                measured_at: 1_750_000_000,
            }
            .data(),
            supermesh::accounts::SubmitReading {
                owner: self.owner.pubkey(),
                device_signer: self.device_signer.pubkey(),
                network: self.network,
                device: self.device,
                reading: self.reading_pda(index),
                system_program: anchor_lang::solana_program::system_program::ID,
            }
            .to_account_metas(None),
        );
        let owner = self.owner.insecure_clone();
        let device_signer = self.device_signer.insecure_clone();
        self.send(&[ix], &[&owner, &device_signer])
    }

    fn finalize_reading(&mut self, index: u64) -> Result<(), String> {
        let ix = Instruction::new_with_bytes(
            supermesh::id(),
            &supermesh::instruction::FinalizeReading {}.data(),
            supermesh::accounts::FinalizeReading {
                cranker: self.authority.pubkey(),
                network: self.network,
                device: self.device,
                reading: self.reading_pda(index),
            }
            .to_account_metas(None),
        );
        let authority = self.authority.insecure_clone();
        self.send(&[ix], &[&authority])
    }

    fn challenge_reading(&mut self, index: u64, challenger: &Keypair) -> Result<(), String> {
        let ix = Instruction::new_with_bytes(
            supermesh::id(),
            &supermesh::instruction::ChallengeReading {}.data(),
            supermesh::accounts::ChallengeReading {
                challenger: challenger.pubkey(),
                network: self.network,
                device: self.device,
                reading: self.reading_pda(index),
                treasury: self.treasury,
                system_program: anchor_lang::solana_program::system_program::ID,
            }
            .to_account_metas(None),
        );
        let challenger = challenger.insecure_clone();
        self.send(&[ix], &[&challenger])
    }

    fn resolve_challenge(
        &mut self,
        index: u64,
        challenger: Pubkey,
        fraud_proven: bool,
    ) -> Result<(), String> {
        let ix = Instruction::new_with_bytes(
            supermesh::id(),
            &supermesh::instruction::ResolveChallenge { fraud_proven }.data(),
            supermesh::accounts::ResolveChallenge {
                authority: self.authority.pubkey(),
                network: self.network,
                device: self.device,
                reading: self.reading_pda(index),
                challenger,
                treasury: self.treasury,
            }
            .to_account_metas(None),
        );
        let authority = self.authority.insecure_clone();
        self.send(&[ix], &[&authority])
    }

    fn warp_past_challenge_window(&mut self, submitted_index: u64) {
        let reading: Reading = self.account(&self.reading_pda(submitted_index));
        self.svm
            .warp_to_slot(reading.submitted_slot + CHALLENGE_WINDOW_SLOTS + 1);
        self.svm.expire_blockhash();
    }

    fn warp_forward(&mut self, slots: u64) {
        let clock: anchor_lang::prelude::Clock = self.svm.get_sysvar();
        self.svm.warp_to_slot(clock.slot + slots);
        self.svm.expire_blockhash();
    }
}

#[test]
fn test_init_network_and_register_device() {
    let mut h = Harness::new();
    h.init_network();

    let network: Network = h.account(&h.network);
    assert_eq!(network.name, NETWORK_NAME);
    assert_eq!(network.min_stake, MIN_STAKE);
    assert!(!network.paused);

    h.register_device();
    let device: Device = h.account(&h.device);
    assert_eq!(device.owner, h.owner.pubkey());
    assert_eq!(device.staked, MIN_STAKE);
    assert_eq!(device.reputation, 100);
    assert!(device.active);

    let network: Network = h.account(&h.network);
    assert_eq!(network.device_count, 1);
}

#[test]
fn test_submit_and_finalize_reading_accrues_reward() {
    let mut h = Harness::new();
    h.init_network();
    h.register_device();

    h.submit_reading(0, 4_200).unwrap();
    let reading: Reading = h.account(&h.reading_pda(0));
    assert_eq!(reading.value, 4_200);
    assert!(reading.status == ReadingStatus::Pending);

    // Cannot finalize while the challenge window is open.
    assert!(h.finalize_reading(0).is_err());

    h.warp_past_challenge_window(0);
    h.finalize_reading(0).unwrap();

    let reading: Reading = h.account(&h.reading_pda(0));
    assert!(reading.status == ReadingStatus::Finalized);

    let device: Device = h.account(&h.device);
    assert_eq!(device.pending_rewards, REWARD_PER_READING);
    assert_eq!(device.reputation, 101);
}

#[test]
fn test_rate_limit_blocks_rapid_submissions() {
    let mut h = Harness::new();
    h.init_network();
    h.register_device();

    h.submit_reading(0, 100).unwrap();
    // Immediate second submission must fail (RateLimited).
    let err = h.submit_reading(1, 101).unwrap_err();
    assert!(err.contains("6004"), "expected RateLimited, got: {err}");

    h.warp_forward(21);
    h.submit_reading(1, 101).unwrap();
}

#[test]
fn test_fraud_challenge_slashes_device_and_pays_challenger() {
    let mut h = Harness::new();
    h.init_network();
    h.register_device();
    h.submit_reading(0, 999_999).unwrap();

    let challenger = Keypair::new();
    h.svm.airdrop(&challenger.pubkey(), 1_000_000_000).unwrap();
    let challenger_before = h.svm.get_balance(&challenger.pubkey()).unwrap();

    h.challenge_reading(0, &challenger).unwrap();
    let reading: Reading = h.account(&h.reading_pda(0));
    assert!(reading.status == ReadingStatus::Challenged);

    h.resolve_challenge(0, challenger.pubkey(), true).unwrap();

    let reading: Reading = h.account(&h.reading_pda(0));
    assert!(reading.status == ReadingStatus::Rejected);

    let device: Device = h.account(&h.device);
    let expected_slash = MIN_STAKE * 2_000 / 10_000; // 20%
    assert_eq!(device.staked, MIN_STAKE - expected_slash);
    assert_eq!(device.reputation, 100 - 25);
    assert!(device.active); // reputation still above threshold
    assert_eq!(device.open_challenges, 0);

    // Challenger nets the slash amount (bond refunded, minus tx fees).
    let challenger_after = h.svm.get_balance(&challenger.pubkey()).unwrap();
    assert!(challenger_after > challenger_before + expected_slash - 50_000);
}

#[test]
fn test_failed_challenge_forfeits_bond_to_device() {
    let mut h = Harness::new();
    h.init_network();
    h.register_device();
    h.submit_reading(0, 4_200).unwrap();

    let challenger = Keypair::new();
    h.svm.airdrop(&challenger.pubkey(), 1_000_000_000).unwrap();
    h.challenge_reading(0, &challenger).unwrap();

    h.resolve_challenge(0, challenger.pubkey(), false).unwrap();

    let reading: Reading = h.account(&h.reading_pda(0));
    assert!(reading.status == ReadingStatus::Finalized);

    let device: Device = h.account(&h.device);
    assert_eq!(device.staked, MIN_STAKE); // untouched
    assert_eq!(device.pending_rewards, CHALLENGE_BOND + REWARD_PER_READING);
}

#[test]
fn test_owner_cannot_challenge_own_reading() {
    let mut h = Harness::new();
    h.init_network();
    h.register_device();
    h.submit_reading(0, 4_200).unwrap();

    let owner = h.owner.insecure_clone();
    let err = h.challenge_reading(0, &owner).unwrap_err();
    assert!(err.contains("6009"), "expected SelfChallenge, got: {err}");
}

#[test]
fn test_challenge_after_window_fails() {
    let mut h = Harness::new();
    h.init_network();
    h.register_device();
    h.submit_reading(0, 4_200).unwrap();
    h.warp_past_challenge_window(0);

    let challenger = Keypair::new();
    h.svm.airdrop(&challenger.pubkey(), 1_000_000_000).unwrap();
    let err = h.challenge_reading(0, &challenger).unwrap_err();
    assert!(err.contains("6007"), "expected ChallengeWindowClosed, got: {err}");
}

#[test]
fn test_claim_rewards() {
    let mut h = Harness::new();
    h.init_network();
    h.register_device();
    h.submit_reading(0, 4_200).unwrap();
    h.warp_past_challenge_window(0);
    h.finalize_reading(0).unwrap();

    let owner_before = h.svm.get_balance(&h.owner.pubkey()).unwrap();

    let ix = Instruction::new_with_bytes(
        supermesh::id(),
        &supermesh::instruction::ClaimRewards {}.data(),
        supermesh::accounts::ClaimRewards {
            owner: h.owner.pubkey(),
            network: h.network,
            device: h.device,
            treasury: h.treasury,
        }
        .to_account_metas(None),
    );
    let owner = h.owner.insecure_clone();
    h.send(&[ix], &[&owner]).unwrap();

    let owner_after = h.svm.get_balance(&h.owner.pubkey()).unwrap();
    assert!(owner_after > owner_before + REWARD_PER_READING - 50_000);

    let device: Device = h.account(&h.device);
    assert_eq!(device.pending_rewards, 0);
}

#[test]
fn test_deactivate_returns_stake_and_blocks_during_challenge() {
    let mut h = Harness::new();
    h.init_network();
    h.register_device();
    h.submit_reading(0, 4_200).unwrap();

    let challenger = Keypair::new();
    h.svm.airdrop(&challenger.pubkey(), 1_000_000_000).unwrap();
    h.challenge_reading(0, &challenger).unwrap();

    let deactivate_ix = |h: &Harness| {
        Instruction::new_with_bytes(
            supermesh::id(),
            &supermesh::instruction::DeactivateDevice {}.data(),
            supermesh::accounts::DeactivateDevice {
                owner: h.owner.pubkey(),
                network: h.network,
                device: h.device,
                treasury: h.treasury,
            }
            .to_account_metas(None),
        )
    };

    // Blocked while a challenge is open.
    let owner = h.owner.insecure_clone();
    let ix = deactivate_ix(&h);
    let err = h.send(&[ix], &[&owner]).unwrap_err();
    assert!(err.contains("6012"), "expected OpenChallenges, got: {err}");

    // Resolve (challenge fails) and deactivate successfully.
    h.resolve_challenge(0, challenger.pubkey(), false).unwrap();
    h.svm.expire_blockhash();
    let owner_before = h.svm.get_balance(&h.owner.pubkey()).unwrap();
    let ix = deactivate_ix(&h);
    h.send(&[ix], &[&owner]).unwrap();

    let device: Device = h.account(&h.device);
    assert!(!device.active);
    assert_eq!(device.staked, 0);

    let owner_after = h.svm.get_balance(&h.owner.pubkey()).unwrap();
    // Stake + failed-challenge bond + reward, minus fees.
    assert!(owner_after > owner_before + MIN_STAKE);
}

#[test]
fn test_pause_blocks_submissions() {
    let mut h = Harness::new();
    h.init_network();
    h.register_device();

    let ix = Instruction::new_with_bytes(
        supermesh::id(),
        &supermesh::instruction::SetPause { paused: true }.data(),
        supermesh::accounts::SetPause {
            authority: h.authority.pubkey(),
            network: h.network,
        }
        .to_account_metas(None),
    );
    let authority = h.authority.insecure_clone();
    h.send(&[ix], &[&authority]).unwrap();

    let err = h.submit_reading(0, 4_200).unwrap_err();
    assert!(err.contains("6000"), "expected NetworkPaused, got: {err}");
}
