use anchor_lang::prelude::*;

use crate::{constants::*, error::SuperMeshError, state::*};

/// Permissionless crank: anyone can finalize a reading whose challenge
/// window has elapsed without a dispute. The device accrues its reward.
#[derive(Accounts)]
pub struct FinalizeReading<'info> {
    /// Any wallet may crank finalization.
    pub cranker: Signer<'info>,

    #[account(
        mut,
        seeds = [SEED_NETWORK, network.name.as_bytes()],
        bump = network.bump,
    )]
    pub network: Account<'info, Network>,

    #[account(
        mut,
        seeds = [SEED_DEVICE, network.key().as_ref(), device.device_signer.as_ref()],
        bump = device.bump,
        has_one = network,
    )]
    pub device: Account<'info, Device>,

    #[account(
        mut,
        seeds = [
            SEED_READING,
            device.key().as_ref(),
            reading.index.to_le_bytes().as_ref(),
        ],
        bump = reading.bump,
        constraint = reading.device == device.key(),
    )]
    pub reading: Account<'info, Reading>,
}

pub fn handler(ctx: Context<FinalizeReading>) -> Result<()> {
    let network = &mut ctx.accounts.network;
    let reading = &mut ctx.accounts.reading;

    require!(
        reading.status == ReadingStatus::Pending,
        SuperMeshError::ReadingNotPending
    );

    let clock = Clock::get()?;
    require!(
        clock.slot > reading.submitted_slot + network.challenge_window_slots,
        SuperMeshError::ChallengeWindowOpen
    );

    reading.status = ReadingStatus::Finalized;

    let device = &mut ctx.accounts.device;
    device.pending_rewards = device
        .pending_rewards
        .checked_add(network.reward_per_reading)
        .ok_or(SuperMeshError::MathOverflow)?;
    device.reputation = device.reputation.saturating_add(REPUTATION_GAIN);

    network.total_finalized_readings = network
        .total_finalized_readings
        .checked_add(1)
        .ok_or(SuperMeshError::MathOverflow)?;

    msg!(
        "Reading #{} finalized; device {} earned {} lamports",
        reading.index,
        device.device_signer,
        network.reward_per_reading
    );
    Ok(())
}
