use anchor_lang::prelude::*;

declare_id!("DgNYxvrmjUVzyLKfxamnbRXJVGCDhH8Ypr3TheKYP3gA");

#[program]
pub mod sol_blog {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let base_account = &mut ctx.accounts.base_account;

        base_account.total_blogs = 0;
        base_account.blogs_list = vec![];

        Ok(())
    }

    pub fn add_blog(
        ctx: Context<AddBlog>,
        content: String,
        title: String,
        timestamp: u64,
    ) -> Result<()> {
        let base_account = &mut ctx.accounts.base_account;
        let user = &mut ctx.accounts.user;

        let blog = Blog {
            author: *user.to_account_info().key,
            content,
            title,
            timestamp,
            likes: 0,
        };

        base_account.blogs_list.push(blog);

        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = user, space = 9000)]
    pub base_account: Account<'info, Blogs>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct AddBlog<'info> {
    #[account(mut)]
    pub base_account: Account<'info, Blogs>,
    #[account(mut)]
    pub user: Signer<'info>,
}

#[derive(Debug, Clone, AnchorSerialize, AnchorDeserialize)]
pub struct Blog {
    pub author: Pubkey,
    pub content: String,
    pub title: String,
    pub likes: u64,
    pub timestamp: u64,
}

#[account]
pub struct Blogs {
    pub total_blogs: u64,
    pub blogs_list: Vec<Blog>,
}
