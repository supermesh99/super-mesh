use anchor_lang::prelude::*;

use crate::{constants::*, state::*};

#[derive(Accounts)]
#[instruction(name: String)]
pub struct InitNetwork<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        init,
        payer = authority,
        space = 8 + Network::INIT_SPACE,
        seeds = [SEED_NETWORK, name.as_bytes()],
        bump,
    )]
    pub network: Account<'info, Network>,

    /// Program-owned lamport vault holding stakes, bonds and reward funds.
    #[account(
        init,
        payer = authority,
        space = 8 + Treasury::INIT_SPACE,
        seeds = [SEED_TREASURY, network.key().as_ref()],
        bump,
    )]
    pub treasury: Account<'info, Treasury>,

    pub system_program: Program<'info, System>,
}

pub fn handler(
    ctx: Context<InitNetwork>,
    name: String,
    min_stake: u64,
    reward_per_reading: u64,
    challenge_bond: u64,
    challenge_window_slots: u64,
) -> Result<()> {
    let network = &mut ctx.accounts.network;
    network.authority = ctx.accounts.authority.key();
    network.name = name;
    network.min_stake = min_stake;
    network.reward_per_reading = reward_per_reading;
    network.challenge_bond = challenge_bond;
    network.challenge_window_slots = challenge_window_slots;
    network.device_count = 0;
    network.total_finalized_readings = 0;
    network.paused = false;
    network.bump = ctx.bumps.network;
    network.treasury_bump = ctx.bumps.treasury;

    let treasury = &mut ctx.accounts.treasury;
    treasury.network = network.key();
    treasury.bump = ctx.bumps.treasury;

    msg!("SuperMesh network '{}' initialized", network.name);
    Ok(())
}
