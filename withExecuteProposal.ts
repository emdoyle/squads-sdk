import {
  PublicKey,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
  TransactionInstruction,
} from "@solana/web3.js";
import {
  ExecuteProposalArgs,
  SquadsInstruction,
  SquadsSchema,
} from "./instruction";
import {
  getSquadMintAddressAndBump,
  getSquadTreasuryAddressAndBump,
} from "./address";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";

export const withExecuteProposal = async (
  instructions: TransactionInstruction[],
  programId: PublicKey,
  payer: PublicKey,
  squad: PublicKey,
  proposal: PublicKey,
  randomId: string
) => {
  const args = new ExecuteProposalArgs({
    randomId,
  });
  const data = Buffer.alloc(11);
  SquadsSchema.get(SquadsInstruction.ExecuteProposal).encode(args, data);

  const [squadSol] = await getSquadTreasuryAddressAndBump(squad);
  const [squadMint] = await getSquadMintAddressAndBump(squad);

  const keys = [
    { pubkey: payer, isWritable: true, isSigner: true },
    { pubkey: squad, isWritable: true, isSigner: false },
    { pubkey: squadMint, isWritable: false, isSigner: false },
    { pubkey: proposal, isWritable: true, isSigner: true },
    { pubkey: squadSol, isWritable: true, isSigner: false },
    { pubkey: payer, isWritable: true, isSigner: true },
    { pubkey: SystemProgram.programId, isWritable: false, isSigner: false },
    { pubkey: TOKEN_PROGRAM_ID, isWritable: false, isSigner: false },
    { pubkey: ASSOCIATED_TOKEN_PROGRAM_ID, isWritable: false, isSigner: false },
    { pubkey: SYSVAR_RENT_PUBKEY, isWritable: false, isSigner: false },
  ];

  instructions.push(
    new TransactionInstruction({
      keys,
      programId,
      data,
    })
  );
};
