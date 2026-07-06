use anchor_lang::prelude::*;

use crate::{constants::*, error::SuperMeshError, state::*};

#[derive(Accounts)]
pub struct SetPause<'info> {
    #[account(address = network.authority @ SuperMeshError::Unauthorized)]
    pub authority: Signer<'info>,

    #[account(
        mut,
        seeds = [SEED_NETWORK, network.name.as_bytes()],
        bump = network.bump,
    )]
    pub network: Account<'info, Network>,
}

pub fn handler(ctx: Context<SetPause>, paused: bool) -> Result<()> {
    ctx.accounts.network.paused = paused;
    msg!("Network paused = {}", paused);
    Ok(())
}
