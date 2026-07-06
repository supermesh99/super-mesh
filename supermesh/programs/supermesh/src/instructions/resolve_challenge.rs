use anchor_lang::prelude::*;

use crate::{constants::*, error::SuperMeshError, state::*};

/// Network authority adjudicates a challenged reading (v1: trusted oracle
/// committee; upgrade path: zk-proof or consensus-based resolution).
///
/// * fraud proven  -> device slashed 20% of stake; challenger gets bond back
///   plus the slash amount; device reputation drops (suspended at <= 0).
/// * fraud not proven -> challenger forfeits bond to the device; reading is
///   finalized and the reward accrues as usual.
#[derive(Accounts)]
pub struct ResolveChallenge<'info> {
    #[account(address = network.authority @ SuperMeshError::Unauthorized)]
    pub authority: Signer<'info>,

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

    /// CHECK: must match the challenger recorded on the reading.
    #[account(
        mut,
        constraint = challenger.key() == reading.challenger @ SuperMeshError::ChallengerMismatch,
    )]
    pub challenger: UncheckedAccount<'info>,

    #[account(
        mut,
        seeds = [SEED_TREASURY, network.key().as_ref()],
        bump = network.treasury_bump,
    )]
    pub treasury: Account<'info, Treasury>,
}

pub fn handler(ctx: Context<ResolveChallenge>, fraud_proven: bool) -> Result<()> {
    let reading = &mut ctx.accounts.reading;
    require!(
        reading.status == ReadingStatus::Challenged,
        SuperMeshError::ReadingNotChallenged
    );

    let device = &mut ctx.accounts.device;
    let network = &mut ctx.accounts.network;
    let bond = reading.challenge_bond;

    if fraud_proven {
        // Slash the device.
        let slash = device
            .staked
            .checked_mul(SLASH_BPS)
            .ok_or(SuperMeshError::MathOverflow)?
            / 10_000;
        device.staked = device
            .staked
            .checked_sub(slash)
            .ok_or(SuperMeshError::MathOverflow)?;

        // Pay challenger: bond refund + slash amount, straight from treasury.
        let payout = bond
            .checked_add(slash)
            .ok_or(SuperMeshError::MathOverflow)?;
        transfer_from_treasury(
            &ctx.accounts.treasury.to_account_info(),
            &ctx.accounts.challenger.to_account_info(),
            payout,
        )?;

        device.reputation = device.reputation.saturating_sub(REPUTATION_LOSS);
        if device.reputation <= REPUTATION_SUSPEND_THRESHOLD {
            device.active = false;
        }

        reading.status = ReadingStatus::Rejected;
        msg!(
            "Fraud proven: device {} slashed {} lamports; challenger paid {}",
            device.device_signer,
            slash,
            payout
        );
    } else {
        // Challenger loses the bond to the honest device; reading finalizes.
        device.pending_rewards = device
            .pending_rewards
            .checked_add(bond)
            .ok_or(SuperMeshError::MathOverflow)?
            .checked_add(network.reward_per_reading)
            .ok_or(SuperMeshError::MathOverflow)?;
        device.reputation = device.reputation.saturating_add(REPUTATION_GAIN);

        network.total_finalized_readings = network
            .total_finalized_readings
            .checked_add(1)
            .ok_or(SuperMeshError::MathOverflow)?;

        reading.status = ReadingStatus::Finalized;
        msg!(
            "Challenge failed: device {} keeps reward and gains bond {}",
            device.device_signer,
            bond
        );
    }

    device.open_challenges = device.open_challenges.saturating_sub(1);
    reading.challenge_bond = 0;
    Ok(())
}

/// Move lamports out of a program-owned PDA by direct lamport arithmetic.
fn transfer_from_treasury<'info>(
    treasury: &AccountInfo<'info>,
    to: &AccountInfo<'info>,
    amount: u64,
) -> Result<()> {
    let mut from_lamports = treasury.try_borrow_mut_lamports()?;
    let mut to_lamports = to.try_borrow_mut_lamports()?;
    **from_lamports = from_lamports
        .checked_sub(amount)
        .ok_or(SuperMeshError::MathOverflow)?;
    **to_lamports = to_lamports
        .checked_add(amount)
        .ok_or(SuperMeshError::MathOverflow)?;
    Ok(())
}
