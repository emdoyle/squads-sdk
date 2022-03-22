import { PublicKey } from "@solana/web3.js";
import * as anchor from "@project-serum/anchor";

export async function getSquadAddressAndBump(
  programId: PublicKey,
  admin: PublicKey,
  randomId: string
) {
  return await PublicKey.findProgramAddress(
    [admin.toBuffer(), Buffer.from(randomId), Buffer.from("!squad")],
    programId
  );
}

export function getMemberEquityAddressAndBumpSync(
  programId: PublicKey,
  member: PublicKey,
  squad: PublicKey
) {
  return anchor.utils.publicKey.findProgramAddressSync(
    [member.toBuffer(), squad.toBuffer(), Buffer.from("!memberequity")],
    programId
  );
}

export async function getMemberEquityAddressAndBump(
  programId: PublicKey,
  member: PublicKey,
  squad: PublicKey
) {
  return await PublicKey.findProgramAddress(
    [member.toBuffer(), squad.toBuffer(), Buffer.from("!memberequity")],
    programId
  );
}

export async function getSquadMintAddressAndBump(
  programId: PublicKey,
  squad: PublicKey
) {
  return await PublicKey.findProgramAddress(
    [squad.toBuffer(), Buffer.from("!squadmint")],
    programId
  );
}

export async function getProposalAccountAddressAndBump(
  programId: PublicKey,
  squad: PublicKey,
  nonce: number
) {
  let nonceBuf = Buffer.alloc(4);
  nonceBuf.writeInt32LE(nonce);
  return await PublicKey.findProgramAddress(
    [squad.toBuffer(), nonceBuf, Buffer.from("!proposal")],
    programId
  );
}

export async function getVoteAccountAddressAndBump(
  programId: PublicKey,
  proposal: PublicKey,
  member: PublicKey
) {
  return await PublicKey.findProgramAddress(
    [proposal.toBuffer(), member.toBuffer(), Buffer.from("!vote")],
    programId
  );
}

export async function getSquadTreasuryAddressAndBump(
  programId: PublicKey,
  squad: PublicKey
) {
  return await PublicKey.findProgramAddress(
    [squad.toBuffer(), Buffer.from("!squadsol")],
    programId
  );
}
