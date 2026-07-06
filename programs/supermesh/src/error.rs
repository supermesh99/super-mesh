use anchor_lang::prelude::*;

#[error_code]
pub enum SuperMeshError {
    #[msg("The network is paused")]
    NetworkPaused,
    #[msg("Stake amount is below the network minimum")]
    InsufficientStake,
    #[msg("Device is not active")]
    DeviceNotActive,
    #[msg("Device is already deactivated")]
    DeviceAlreadyDeactivated,
    #[msg("Submitting readings too fast; rate limit not met")]
    RateLimited,
    #[msg("Reading is not in a pending state")]
    ReadingNotPending,
    #[msg("Reading is not under challenge")]
    ReadingNotChallenged,
    #[msg("Challenge window has already closed")]
    ChallengeWindowClosed,
    #[msg("Challenge window is still open")]
    ChallengeWindowOpen,
    #[msg("A device owner cannot challenge their own reading")]
    SelfChallenge,
    #[msg("Provided challenger account does not match the recorded challenger")]
    ChallengerMismatch,
    #[msg("No rewards available to claim")]
    NothingToClaim,
    #[msg("Device has unresolved challenges")]
    OpenChallenges,
    #[msg("Arithmetic overflow")]
    MathOverflow,
    #[msg("Unauthorized")]
    Unauthorized,
}
