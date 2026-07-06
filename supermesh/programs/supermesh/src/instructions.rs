pub mod claim_rewards;
pub mod deactivate_device;
pub mod challenge_reading;
pub mod finalize_reading;
pub mod init_network;
pub mod register_device;
pub mod resolve_challenge;
pub mod set_pause;
pub mod submit_reading;

// Glob re-exports are required so the #[program] macro can see the
// Anchor-generated helper modules; every module defines a `handler` fn,
// which makes the globs ambiguous — call handlers via full paths instead.
#[allow(ambiguous_glob_reexports)]
pub use {
    claim_rewards::*, challenge_reading::*, deactivate_device::*, finalize_reading::*,
    init_network::*, register_device::*, resolve_challenge::*, set_pause::*, submit_reading::*,
};
