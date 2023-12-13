"use client";

import React, { useCallback, useEffect, useState } from "react";

import { useParams } from "next/navigation";
import { baseAccount, blog, getProgram } from "@/utils/utils";
import { BN } from "@project-serum/anchor";
function Page() {
  const params = useParams();

  const [blog, setBlog] = useState<blog>();

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
      {/* {!blog && (
        <>
        </>
      )} */}

      <h1>This is blog page</h1>

      {blog ? (
        <>
          <p>{blog!.author.toString()}</p>
          <h2>{blog!.title}</h2>
          <p>{blog!.content}</p>
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
