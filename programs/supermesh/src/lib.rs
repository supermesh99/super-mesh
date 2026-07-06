//! # SuperMesh — decentralized physical-infrastructure (DePIN) sensor oracle
//!
//! Real-world problem: environmental data (air quality, noise, weather,
//! radiation) is sparse, siloed, and easy to falsify. Cities, insurers and
//! researchers need dense, tamper-evident sensor coverage but can't afford
//! to deploy hardware everywhere themselves.
//!
//! SuperMesh lets anyone deploy a cheap physical sensor, stake SOL as
//! slashable collateral, and get paid per verified reading:
//!
//! 1. `init_network`      — create a data network (e.g. "pm25-blr") with
//!                          economic parameters.
//! 2. `register_device`   — a device's hardware key + owner wallet co-sign;
//!                          owner stakes SOL into the network treasury.
//! 3. `submit_reading`    — device signs a reading (hash of the raw payload
//!                          + scaled value). Optimistically accepted.
//! 4. `challenge_reading` — during a challenge window, anyone can bond SOL
//!                          to dispute a suspicious reading.
//! 5. `resolve_challenge` — authority adjudicates: fraud → device slashed
//!                          20%, challenger rewarded; honest → challenger's
//!                          bond forfeited to the device.
//! 6. `finalize_reading`  — permissionless crank after the window; the
//!                          device accrues its reward.
//! 7. `claim_rewards`     — owner withdraws accrued lamports.
//! 8. `deactivate_device` — exit with stake + rewards (blocked while any
//!                          challenge is open).
//!
//! Security model: optimistic oracle with crypto-economic honesty — lying is
//! unprofitable because stake exceeds cheating gains, and every reading is
//! attributable to a hardware key.

pub mod constants;
pub mod error;
pub mod instructions;
pub mod state;

use anchor_lang::prelude::*;

pub use constants::*;
pub use instructions::*;
pub use state::*;

declare_id!("F61wgBCXWygQ9j4iRuPNWzb7kaL1kdpG7DkVSf6EMqrF");

#[program]
pub mod supermesh {
    use super::*;

    /// Create a new sensor network and its treasury.
    pub fn init_network(
        ctx: Context<InitNetwork>,
        name: String,
        min_stake: u64,
        reward_per_reading: u64,
        challenge_bond: u64,
        challenge_window_slots: u64,
    ) -> Result<()> {
        instructions::init_network::handler(
            ctx,
            name,
            min_stake,
            reward_per_reading,
            challenge_bond,
            challenge_window_slots,
        )
    }

    /// Register a physical device, staking SOL as collateral.
    pub fn register_device(
        ctx: Context<RegisterDevice>,
        stake: u64,
        geohash: String,
    ) -> Result<()> {
        instructions::register_device::handler(ctx, stake, geohash)
    }

    /// Submit a sensor reading (device hardware key must co-sign).
    pub fn submit_reading(
        ctx: Context<SubmitReading>,
        data_hash: [u8; 32],
        value: i64,
        measured_at: i64,
    ) -> Result<()> {
        instructions::submit_reading::handler(ctx, data_hash, value, measured_at)
    }

    /// Bond SOL to dispute a pending reading.
    pub fn challenge_reading(ctx: Context<ChallengeReading>) -> Result<()> {
        instructions::challenge_reading::handler(ctx)
    }

    /// Authority resolves a challenge (fraud proven or not).
    pub fn resolve_challenge(ctx: Context<ResolveChallenge>, fraud_proven: bool) -> Result<()> {
        instructions::resolve_challenge::handler(ctx, fraud_proven)
    }

    /// Permissionless finalization after the challenge window elapses.
    pub fn finalize_reading(ctx: Context<FinalizeReading>) -> Result<()> {
        instructions::finalize_reading::handler(ctx)
    }

    /// Withdraw accrued rewards.
    pub fn claim_rewards(ctx: Context<ClaimRewards>) -> Result<()> {
        instructions::claim_rewards::handler(ctx)
    }

    /// Retire a device and withdraw stake + rewards.
    pub fn deactivate_device(ctx: Context<DeactivateDevice>) -> Result<()> {
        instructions::deactivate_device::handler(ctx)
    }

    /// Emergency pause switch.
    pub fn set_pause(ctx: Context<SetPause>, paused: bool) -> Result<()> {
        instructions::set_pause::handler(ctx, paused)
    }
}
