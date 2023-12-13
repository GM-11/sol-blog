import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { SolBlog } from "../target/types/sol_blog";
import { BN, web3 } from "@project-serum/anchor"
import { SystemProgram } from "@solana/web3.js";


describe("sol-blog", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.SolBlog as Program<SolBlog>;

  it("Is initialized!", async () => {
    const baseAccount = web3.Keypair.generate()
    const user = web3.Keypair.generate()
    const tx = await program.methods.initialize()
      .accounts({
        baseAccount: baseAccount.publicKey, user: user.publicKey, systemProgram: SystemProgram.programId
      })
      .signers([baseAccount, user])
      .rpc();
    console.log("Your transaction signature", tx);
  });

  it("adding blog", async () => {
    const timestamp = Date.now()
    const baseAccount = web3.Keypair.generate()
    const user = web3.Keypair.generate()
    const tx = await program.methods.addBlog("this is blog contnent", "i wrote this blog", new BN(timestamp)).accounts({
      baseAccount: baseAccount.publicKey, user: user.publicKey
    }).signers([baseAccount, user]).rpc()

    const blogs = await program.account.blogs.fetch(baseAccount.publicKey)
    console.log(`Total blogs: ${blogs.totalBlogs}`)
    console.log(`Blogs: ${blogs.blogsList}`)
  })
});
