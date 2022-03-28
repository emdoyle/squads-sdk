import {
  Commitment,
  Connection,
  GetProgramAccountsConfig,
  PublicKey,
} from "@solana/web3.js";
import { Proposal, ProposalItem, Squad, SquadItem } from "./accounts";
import { SquadsSchema } from "./schema";

export const getSquads = async (
  programId: PublicKey,
  connection: Connection,
  config?: GetProgramAccountsConfig
): Promise<SquadItem[]> => {
  const layout = SquadsSchema.get(Squad);
  if (!layout) throw new Error("Missing schema entry for Squad!");

  const mergedConfig = config
    ? { ...config, filters: [...config.filters, { dataSize: 10228 }] }
    : { filters: [{ dataSize: 10228 }] };
  const accounts = await connection.getProgramAccounts(programId, mergedConfig);
  return accounts.map((account) => ({
    account: layout.decode(account.account.data),
    pubkey: account.pubkey,
  }));
};

export const getSquad = async (
  connection: Connection,
  squad: PublicKey,
  commitment?: Commitment
): Promise<Squad> => {
  const layout = SquadsSchema.get(Squad);
  if (!layout) throw new Error("Missing schema entry for Squad!");

  const accountInfo = await connection.getAccountInfo(squad, commitment);
  return layout.decode(accountInfo.data);
};

export const getProposals = async (
  programId: PublicKey,
  connection: Connection,
  squad: PublicKey,
  config?: GetProgramAccountsConfig
): Promise<ProposalItem[]> => {
  const layout = SquadsSchema.get(Proposal);
  if (!layout) throw new Error("Missing schema entry for Proposal!");

  const defaultFilters = [
    { dataSize: 6002 },
    { memcmp: { offset: 114, bytes: squad.toBase58() } },
  ];
  let mergedConfig;
  if (config) {
    config.filters.push(...defaultFilters);
    mergedConfig = config;
  } else {
    mergedConfig = { filters: defaultFilters };
  }

  const accounts = await connection.getProgramAccounts(programId, mergedConfig);
  return accounts.map((account) => ({
    account: layout.decode(account.account.data),
    pubkey: account.pubkey,
  }));
};

export const getProposal = async (
  connection: Connection,
  proposal: PublicKey,
  commitment?: Commitment
): Promise<Proposal> => {
  const layout = SquadsSchema.get(Proposal);
  if (!layout) throw new Error("Missing schema entry for Proposal!");

  const accountInfo = await connection.getAccountInfo(proposal, commitment);
  return layout.decode(accountInfo.data);
};
