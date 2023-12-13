import React, { useState } from "react";
import {
  Connection,
  PublicKey,
  clusterApiUrl,
  ConfirmOptions,
} from "@solana/web3.js";
import {
  Program,
  AnchorProvider,
  web3,
  utils,
  // BN,
} from "@project-serum/anchor";
import idl from "./idl.json";

import { Buffer } from "buffer";

window.Buffer = Buffer;

const network = clusterApiUrl("devnet");
const programID = new PublicKey(idl.metadata.address);
const opts = {
  preflightCommitment: "processed" as ConfirmOptions,
};

function Home() {
  const [address, setAddress] = useState(null);

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

  async function getProvider() {
    const connection = new Connection(network, opts.preflightCommitment);
    const provider = new AnchorProvider(
      connection,
      window.solana,
      opts.preflightCommitment
    );
  }

  return <div></div>;
}

export default Home;
