"use client";

import React, { useCallback, useEffect, useState } from "react";

import { useParams } from "next/navigation";
import { baseAccount, blog, getProgram, getProvider } from "@/utils/utils";
import { BN } from "@project-serum/anchor";
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
      <h1>This is blog page</h1>
      <br />
      {blog ? (
        <>
          <p>{blog!.author.toString()}</p>
          <h2>{blog!.title}</h2>
          <p>{blog!.content}</p>
          <p>{Number(blog!.likes)}</p>
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
