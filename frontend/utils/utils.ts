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
    BN,
    // BN,
} from "@project-serum/anchor";
import kp from "./keypair.json"
const arr = Object.values(kp._keypair.secretKey);
const secret = new Uint8Array(arr);
const baseAccount = web3.Keypair.fromSecretKey(secret);


import idl from "../app/idl.json"


export const network = clusterApiUrl("devnet");
export const programID = new PublicKey(idl.metadata.address);
export const opts = {
    preflightCommitment: "processed" as ConfirmOptions,
};

async function getProvider() {
    if (window.solana) {
        await window.solana.connect({
            onlyIfTrusted: true,
        });


        const connection = new Connection(network, opts.preflightCommitment);
        const provider = new AnchorProvider(
            connection,
            window.solana,
            opts.preflightCommitment
        );

        return provider;
    }
}

async function getConnection() {
    const connection = new Connection(network, opts.preflightCommitment)
    return connection;
}

async function getProgram() {
    const provider = await getProvider();
    return new Program(
        JSON.parse(JSON.stringify(idl)),
        programID,
        provider
    );

}

async function initializeAccount() {
    const provider = await getProvider();
    const program = await getProgram();

    await program.methods.initialize().accounts({
        baseAccount: baseAccount.publicKey,
        user: provider?.wallet.publicKey,
        systemProgram: web3.SystemProgram.programId

    }).signers([baseAccount])
        .rpc()
}

type b = {
    author: web3.PublicKey, content: String, title: String, likes: BN, timestamp: BN,
}

export { getProvider, getProgram, getConnection, initializeAccount, baseAccount }

export type blog = b;