use anchor_lang::{prelude::*, system_program};

use crate::{constants::*, error::SuperMeshError, state::*};

#[derive(Accounts)]
pub struct RegisterDevice<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,

    /// Hardware key of the physical sensor; must co-sign registration to
    /// prove the registrant controls the device.
    pub device_signer: Signer<'info>,

    #[account(
        mut,
        seeds = [SEED_NETWORK, network.name.as_bytes()],
        bump = network.bump,
    )]
    pub network: Account<'info, Network>,

    #[account(
        init,
        payer = owner,
        space = 8 + Device::INIT_SPACE,
        seeds = [SEED_DEVICE, network.key().as_ref(), device_signer.key().as_ref()],
        bump,
    )]
    pub device: Account<'info, Device>,

    #[account(
        mut,
        seeds = [SEED_TREASURY, network.key().as_ref()],
        bump = network.treasury_bump,
    )]
    pub treasury: Account<'info, Treasury>,

    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<RegisterDevice>, stake: u64, geohash: String) -> Result<()> {
    let network = &mut ctx.accounts.network;
    require!(!network.paused, SuperMeshError::NetworkPaused);
    require!(stake >= network.min_stake, SuperMeshError::InsufficientStake);

    // Move stake into the treasury PDA.
    system_program::transfer(
        CpiContext::new(
            ctx.accounts.system_program.key(),
            system_program::Transfer {
                from: ctx.accounts.owner.to_account_info(),
                to: ctx.accounts.treasury.to_account_info(),
            },
        ),
        stake,
    )?;

    let device = &mut ctx.accounts.device;
    device.owner = ctx.accounts.owner.key();
    device.network = network.key();
    device.device_signer = ctx.accounts.device_signer.key();
    device.staked = stake;
    device.pending_rewards = 0;
    device.reading_count = 0;
    device.last_reading_slot = 0;
    device.reputation = REPUTATION_START;
    device.open_challenges = 0;
    device.active = true;
    device.geohash = geohash;
    device.bump = ctx.bumps.device;

    network.device_count = network
        .device_count
        .checked_add(1)
        .ok_or(SuperMeshError::MathOverflow)?;

    msg!(
        "Device {} registered with {} lamports staked",
        device.device_signer,
        stake
    );
    Ok(())
}
