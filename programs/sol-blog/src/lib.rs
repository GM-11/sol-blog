use anchor_lang::prelude::*;

declare_id!("DgNYxvrmjUVzyLKfxamnbRXJVGCDhH8Ypr3TheKYP3gA");

#[program]
pub mod sol_blog {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
