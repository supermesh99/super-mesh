use anchor_lang::prelude::*;

use crate::{constants::*, error::SuperMeshError, state::*};

#[derive(Accounts)]
pub struct SubmitReading<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,

    /// The device's hardware key must sign every reading, proving the data
    /// originated from the registered sensor and not just its owner's wallet.
    pub device_signer: Signer<'info>,

    #[account(
        seeds = [SEED_NETWORK, network.name.as_bytes()],
        bump = network.bump,
    )]
    pub network: Account<'info, Network>,

    #[account(
        mut,
        seeds = [SEED_DEVICE, network.key().as_ref(), device_signer.key().as_ref()],
        bump = device.bump,
        has_one = owner @ SuperMeshError::Unauthorized,
        has_one = network,
        constraint = device.device_signer == device_signer.key() @ SuperMeshError::Unauthorized,
    )]
    pub device: Account<'info, Device>,

    #[account(
        init,
        payer = owner,
        space = 8 + Reading::INIT_SPACE,
        seeds = [
            SEED_READING,
            device.key().as_ref(),
            device.reading_count.to_le_bytes().as_ref(),
        ],
        bump,
    )]
    pub reading: Account<'info, Reading>,

    pub system_program: Program<'info, System>,
}

pub fn handler(
    ctx: Context<SubmitReading>,
    data_hash: [u8; 32],
    value: i64,
    measured_at: i64,
) -> Result<()> {
    let network = &ctx.accounts.network;
    require!(!network.paused, SuperMeshError::NetworkPaused);

    let device = &mut ctx.accounts.device;
    require!(device.active, SuperMeshError::DeviceNotActive);

    let clock = Clock::get()?;
    require!(
        device.reading_count == 0
            || clock.slot >= device.last_reading_slot + MIN_SLOTS_BETWEEN_READINGS,
        SuperMeshError::RateLimited
    );

    let reading = &mut ctx.accounts.reading;
    reading.device = device.key();
    reading.network = network.key();
    reading.index = device.reading_count;
    reading.data_hash = data_hash;
    reading.value = value;
    reading.measured_at = measured_at;
    reading.submitted_slot = clock.slot;
    reading.status = ReadingStatus::Pending;
    reading.challenger = Pubkey::default();
    reading.challenge_bond = 0;
    reading.bump = ctx.bumps.reading;

    device.reading_count = device
        .reading_count
        .checked_add(1)
        .ok_or(SuperMeshError::MathOverflow)?;
    device.last_reading_slot = clock.slot;

    msg!(
        "Reading #{} submitted by device {} (value {})",
        reading.index,
        device.device_signer,
        value
    );
    Ok(())
}
