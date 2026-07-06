use anchor_lang::prelude::*;

use crate::{constants::*, error::SuperMeshError, state::*};

/// Retire a device and withdraw its remaining stake plus pending rewards.
/// Blocked while any of the device's readings are under challenge, so a
/// dishonest operator cannot exit ahead of a slash.
#[derive(Accounts)]
pub struct DeactivateDevice<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,

    #[account(
        seeds = [SEED_NETWORK, network.name.as_bytes()],
        bump = network.bump,
    )]
    pub network: Account<'info, Network>,

    #[account(
        mut,
        seeds = [SEED_DEVICE, network.key().as_ref(), device.device_signer.as_ref()],
        bump = device.bump,
        has_one = owner @ SuperMeshError::Unauthorized,
        has_one = network,
    )]
    pub device: Account<'info, Device>,

    #[account(
        mut,
        seeds = [SEED_TREASURY, network.key().as_ref()],
        bump = network.treasury_bump,
    )]
    pub treasury: Account<'info, Treasury>,
}

pub fn handler(ctx: Context<DeactivateDevice>) -> Result<()> {
    let device = &mut ctx.accounts.device;
    require!(device.staked > 0 || device.active, SuperMeshError::DeviceAlreadyDeactivated);
    require!(device.open_challenges == 0, SuperMeshError::OpenChallenges);

    let payout = device
        .staked
        .checked_add(device.pending_rewards)
        .ok_or(SuperMeshError::MathOverflow)?;

    device.staked = 0;
    device.pending_rewards = 0;
    device.active = false;

    if payout > 0 {
        let treasury = ctx.accounts.treasury.to_account_info();
        let owner = ctx.accounts.owner.to_account_info();
        let mut from = treasury.try_borrow_mut_lamports()?;
        let mut to = owner.try_borrow_mut_lamports()?;
        **from = from
            .checked_sub(payout)
            .ok_or(SuperMeshError::MathOverflow)?;
        **to = to
            .checked_add(payout)
            .ok_or(SuperMeshError::MathOverflow)?;
    }

    msg!(
        "Device {} deactivated; {} lamports returned",
        device.device_signer,
        payout
    );
    Ok(())
}
