"use client";

import React, { useCallback, useEffect, useState } from "react";

import { useParams } from "next/navigation";
import { baseAccount, blog, getProgram, getProvider } from "@/utils/utils";
import { BN } from "@project-serum/anchor";
import "./page.css";
function Page() {
  const params = useParams();

  const [blog, setBlog] = useState<blog>();

  async function upvote() {
    try {
      const program = await getProgram();
      const provider = await getProvider();
      await program.methods
        .upvote(new BN(Number(params.blogId)))
        .accounts({
          baseAccount: baseAccount.publicKey,
          user: provider?.wallet.publicKey,
        })
        // .signers([baseAccount])
        .rpc();

      getBlog();
    } catch (error) {
      console.log(error);
    }
  }

  const getBlog = useCallback(
    async function () {
      const program = await getProgram();
      const account = (await program.account.blogs.fetch(
        baseAccount.publicKey
      )) as {
        totalBlogs: BN;
        blogsList: [];
      };

      for (let index = 0; index < account.blogsList.length; index++) {
        const element = account.blogsList[index] as blog;
        if (Number(element.timestamp) == Number(params.blogId)) {
          setBlog(element);
        }
      }
    },
    [params.blogId]
  );

  useEffect(() => {
    getBlog();
  }, [getBlog]);

  return (
    <div>
      <br />
      {blog ? (
        <>
          <p>{blog!.author.toString()}</p>
          <h1>{blog!.title}</h1>
          <div className="content-container">
            <p>{blog!.content}</p>
          </div>
          <p>
            
            Upvotes: <h2>{Number(blog!.likes)}</h2>
          </p>
          <br />
          <button onClick={upvote}>Upvote</button>
        </>
      ) : (
        <>
          <p>Loading</p>
        </>
      )}
    </div>
  );
}

export default Page;
