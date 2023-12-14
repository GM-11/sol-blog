"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import "./page.css";
import { getProgram, blog, baseAccount } from "@/utils/utils";

import { BN } from "@project-serum/anchor";

import {
  ConnectionProvider,
  WalletProvider,
  useWallet,
} from "@solana/wallet-adapter-react";
import {
  WalletDisconnectButton,
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  SolongWalletAdapter,
  LedgerWalletAdapter,
} from "@solana/wallet-adapter-wallets";
require("@solana/wallet-adapter-react-ui/styles.css");

import { clusterApiUrl } from "@solana/web3.js";

function Home() {
  const endpoint =
    "https://solana-devnet.g.alchemy.com/v2/ZFG02ef0_jSJa_ZvgJkvNGhxz4cgNzpm";
  // const network = WalletAdapterNetwork.Devnet;
  // const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = React.useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new SolongWalletAdapter(),
      new LedgerWalletAdapter(),
    ],
    []
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <div>
          <Main />
        </div>{" "}
      </WalletProvider>
    </ConnectionProvider>
  );
}

function Main() {
  const wallet = useWallet();
  const [address, setAddress] = useState<null | String>(null);
  const [blogs, setBlogs] = useState<[]>([]);
  const { connected } = wallet;

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
    async function loadAddress() {
      if (wallet.connected && wallet.publicKey) {
        const address = wallet.publicKey.toString();
        setAddress(address);
      }
    }

    loadAddress();
  });

  // useEffect(() => {
  //   async function onLoad() {
  //     await checkSolanaWallet();
  //   }
  //   window.addEventListener("load", onLoad);
  //   return function () {
  //     return window.removeEventListener("load", onLoad);
  //   };
  // }, [checkSolanaWallet]);

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
                    <p>
                      Upvotes: <strong>{Number(blog.likes)}</strong>
                    </p>
                  </Link>
                );
              })}
            </div>
          )}
        </>
      ) : (
        <>
          <WalletModalProvider>
            <WalletMultiButton />
          </WalletModalProvider>
        </>
      )}
    </div>
  );
}

export default Home;
