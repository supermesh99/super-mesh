use anchor_lang::{prelude::*, system_program};

use crate::{constants::*, error::SuperMeshError, state::*};

#[derive(Accounts)]
pub struct ChallengeReading<'info> {
    #[account(mut)]
    pub challenger: Signer<'info>,

    #[account(
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

    #[account(
        mut,
        seeds = [SEED_TREASURY, network.key().as_ref()],
        bump = network.treasury_bump,
    )]
    pub treasury: Account<'info, Treasury>,

    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<ChallengeReading>) -> Result<()> {
    let network = &ctx.accounts.network;
    require!(!network.paused, SuperMeshError::NetworkPaused);

    let reading = &mut ctx.accounts.reading;
    require!(
        reading.status == ReadingStatus::Pending,
        SuperMeshError::ReadingNotPending
    );

    let clock = Clock::get()?;
    require!(
        clock.slot <= reading.submitted_slot + network.challenge_window_slots,
        SuperMeshError::ChallengeWindowClosed
    );

    let device = &mut ctx.accounts.device;
    require!(
        ctx.accounts.challenger.key() != device.owner,
        SuperMeshError::SelfChallenge
    );

    // Challenger bonds lamports; lost if the challenge fails.
    system_program::transfer(
        CpiContext::new(
            ctx.accounts.system_program.key(),
            system_program::Transfer {
                from: ctx.accounts.challenger.to_account_info(),
                to: ctx.accounts.treasury.to_account_info(),
            },
        ),
        network.challenge_bond,
    )?;

    reading.status = ReadingStatus::Challenged;
    reading.challenger = ctx.accounts.challenger.key();
    reading.challenge_bond = network.challenge_bond;

    device.open_challenges = device
        .open_challenges
        .checked_add(1)
        .ok_or(SuperMeshError::MathOverflow)?;

    msg!(
        "Reading #{} of device {} challenged by {}",
        reading.index,
        device.device_signer,
        reading.challenger
    );
    Ok(())
}
