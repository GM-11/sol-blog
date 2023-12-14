import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { SolBlog } from "../target/types/sol_blog";
import { BN, web3 } from "@project-serum/anchor"
import { SystemProgram } from "@solana/web3.js";


describe("sol-blog", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const baseAccount = web3.Keypair.generate()
  const program = anchor.workspace.SolBlog as Program<SolBlog>;

  it("Is initialized!", async () => {
    const tx = await program.methods.initialize()
      .accounts({
        baseAccount: baseAccount.publicKey, user: provider.wallet.publicKey, systemProgram: SystemProgram.programId
      })
      .signers([baseAccount])
      .rpc();
    console.log("Your transaction signature", tx);
  });

  it("adding blog", async () => {
    const timestamp = Date.now()
    const tx = await program.methods.addBlog("this is blog contnent", "i wrote this blog", new BN(timestamp)).accounts({
      baseAccount: baseAccount.publicKey, user: provider.wallet.publicKey
    }).rpc()

    const blogs = await program.account.blogs.fetch(baseAccount.publicKey)
    console.log(`Total blogs: ${blogs.totalBlogs}`)
    console.log(`Blogs: ${blogs.blogsList}`)
  })
});
