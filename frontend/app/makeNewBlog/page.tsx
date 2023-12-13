"use client";

import React, { useState } from "react";
import { getProvider, getProgram } from "../../utils/utils";
import "./page.css";
import { BN, web3 } from "@project-serum/anchor";
import kp from "../../utils/keypair.json";
import { redirect } from 'next/navigation'


const arr = Object.values(kp._keypair.secretKey);
const secret = new Uint8Array(arr);
const baseAccount = web3.Keypair.fromSecretKey(secret);

function Page() {
  const [blogContent, setBlogContent] = useState("");
  const [blogTitle, setBlogTitle] = useState("");
  const [titleError, setTitleError] = useState(false);
  const [contentError, setContentError] = useState(false);

  async function submitBlog() {
    try {
      if (blogTitle.length < 3) {
        setTitleError(true);
      }
      if (blogContent.length < 20) {
        setContentError(true);
      } else {
        setContentError(false);
        setTitleError(false);
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

        alert("Blog added");
        redirect("/")


      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  }

  return (
    <div>
      <h1>Make new blog</h1>
      <>
        <input
          value={blogTitle}
          type="text"
          placeholder="Blog Title"
          onChange={function (e) {
            setBlogTitle(e.target.value);
          }}
        />
        <br />
        {titleError && (
          <p className="error">
            Please include atleast 3 characters in the title
          </p>
        )}
        <br />
        <textarea
          value={blogContent}
          placeholder="Blog content"
          className="content"
          onChange={function (e) {
            setBlogContent(e.target.value);
          }}
        />

        {contentError && (
          <p className="error">
            Please include atleast 20 characters in the content
          </p>
        )}
      </>
      <br />
      <br />
      <button onClick={submitBlog}>
        <strong>Submit</strong>
      </button>
    </div>
  );
}

export default Page;
