"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import "./page.css";
import {
  getConnection,
  getProvider,
  getProgram,
  blog,
  baseAccount,
} from "@/utils/utils";

import { BN } from "@project-serum/anchor";

function Home() {
  const [address, setAddress] = useState(null);
  const [blogs, setBlogs] = useState<[]>([]);

  async function checkSolanaWallet() {
    if (window.solana) {
      console.log("Phantom detected");
      const res = await window.solana.connect({
        onlyIfTrusted: true,
      });
      setAddress(res.publicKey.toString());
    } else {
      alert("Please install phantom wallet");
    }
  }

  async function connectSolanaWallet() {
    if (window.solana) {
      console.log("Phantom detected");
      const res = await window.solana.connect({
        onlyIfTrusted: true,
      });
      setAddress(res.publicKey.toString());
    } else {
      alert("Please install phantom wallet");
    }
  }

  async function getAllBlogs() {
    const program = await getProgram();
    const account = (await program.account.blogs.fetch(
      baseAccount.publicKey
    )) as {
      totalBlogs: BN;
      blogsList: [];
    };

    const blogs = account.blogsList;

    blogs.sort((a: blog, b: blog) => Number(b.likes) - Number(a.likes));

    setBlogs(blogs);
  }

  useEffect(() => {
    async function onLoad() {
      await checkSolanaWallet();
    }
    window.addEventListener("load", onLoad);
    return function () {
      return window.removeEventListener("load", onLoad);
    };
  }, []);

  useEffect(() => {
    connectSolanaWallet();
    getAllBlogs();
  }, []);

  return (
    <div>
      {address ? (
        <>
          <p>{address}</p>
          <br />
          <Link href="/makeNewBlog" className="new-blog-button">
            Make new blog
          </Link>
          <br />
          {blogs.length === 0 ? (
            <h1>No blogs to show</h1>
          ) : (
            blogs.map(function (blog: blog) {
              return (
                <Link
                  key={Number(blog.timestamp)}
                  href={`/getBlog/${blog.timestamp}`}
                  className="blog-card"
                >
                  <h2>{blog.title}</h2>
                  <p>{Number(blog.likes)}</p>
                </Link>
              );
            })
          )}
        </>
      ) : (
        <>
          <button onClick={connectSolanaWallet}>Connect Wallet</button>
        </>
      )}
    </div>
  );
}

export default Home;
