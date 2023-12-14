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
      const res = await window.solana.connect();
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
    <div className="main">
      {address ? (
        <>
          <br />
          <h1>SolBlog</h1>
          <br />

          <Link className="make-blog-button" href="/makeNewBlog">
            Make your own blog
          </Link>
          <br />
          <br />
          <p>
            Your phantom wallet address: <strong>{address}</strong>
          </p>
          <br />
          {blogs.length === 0 ? (
            <p>No blogs to show</p>
          ) : (
            <div className="blog-container">
              {blogs.map(function (blog: blog) {
                return (
                  <Link
                    href={`/getBlog/${blog.timestamp}`}
                    className="blog-card"
                    key={Number(blog.timestamp)}
                  >
                    <h1>{blog.title}</h1>
                    <strong>
                      {new Date(Number(blog.timestamp)).toLocaleDateString(
                        "en-gb",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </strong>
                    <p>{blog.author.toString()}</p>
                  </Link>
                );
              })}
            </div>
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
