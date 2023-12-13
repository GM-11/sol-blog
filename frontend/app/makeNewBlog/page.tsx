"use client";

import React, { useEffect, useState } from "react";
import {
  getProvider,
  getProgram,
  getConnection,
  initializeAccount,
} from "../../utils/utils";
import "./page.css";
import { BN, web3 } from "@project-serum/anchor";
import kp from "../../utils/keypair.json";
import { Signer } from "@solana/web3.js";
const arr = Object.values(kp._keypair.secretKey);
const secret = new Uint8Array(arr);
const baseAccount = web3.Keypair.fromSecretKey(secret);

function Page() {
  const [blogContent, setBlogContent] = useState("");
  const [blogTitle, setBlogTitle] = useState("");


  async function submitBlog() {
    try {
      const provider = await getProvider();
      const program = await getProgram();
      console.log(provider!.wallet.publicKey.toString(), program);

      program.methods.initialize();

      await program.methods
        .addBlog(blogContent, blogTitle, new BN(Date.now()))
        .accounts({
          baseAccount: baseAccount.publicKey,
          user: provider!.wallet.publicKey,
        })
        .rpc();
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  }

  return (
    <div>
      <h1>Create new blog</h1>

      <input
        value={blogTitle}
        type="text"
        placeholder="Blog Title"
        onChange={function (e) {
          setBlogTitle(e.target.value);
        }}
      />
      <br />
      <br />
      <input
        value={blogContent}
        type="text"
        placeholder="Blog content"
        min={5}
        max={50}
        onChange={function (e) {
          setBlogContent(e.target.value);
        }}
      />
      <br />
      <br />
      <button onClick={submitBlog}>Submit</button>
    </div>
  );
}

export default Page;
