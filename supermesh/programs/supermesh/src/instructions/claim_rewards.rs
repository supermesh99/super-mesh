use anchor_lang::prelude::*;

use crate::{constants::*, error::SuperMeshError, state::*};

#[derive(Accounts)]
pub struct ClaimRewards<'info> {
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

pub fn handler(ctx: Context<ClaimRewards>) -> Result<()> {
    let device = &mut ctx.accounts.device;
    let amount = device.pending_rewards;
    require!(amount > 0, SuperMeshError::NothingToClaim);

    device.pending_rewards = 0;

    let treasury = ctx.accounts.treasury.to_account_info();
    let owner = ctx.accounts.owner.to_account_info();
    let mut from = treasury.try_borrow_mut_lamports()?;
    let mut to = owner.try_borrow_mut_lamports()?;
    **from = from
        .checked_sub(amount)
        .ok_or(SuperMeshError::MathOverflow)?;
    **to = to
        .checked_add(amount)
        .ok_or(SuperMeshError::MathOverflow)?;

    msg!("Device owner {} claimed {} lamports", device.owner, amount);
    Ok(())
}
