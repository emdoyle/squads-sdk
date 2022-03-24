import { BN } from "@project-serum/anchor";

/*
 * NOTES:
 * - strings MUST be padded to their max length due to use of Pack in on-chain program
 */

export enum SquadsInstruction {
  CreateSquad,
  CreateMultiSig,
  CreateProposalAccount,
  CastVote,
  CastMultisigVote,
  ExecuteProposal,
  ExecuteMultisigProposal,
  AddMembersToSquad,
}

// TODO: this most likely does not handle multi-byte ASCII chars
function ensureLength(input: string, length: number) {
  if (input.length > length) {
    return input.slice(0, length);
  }
  return input.padEnd(length);
}

export class CreateSquadArgs {
  instruction: SquadsInstruction = SquadsInstruction.CreateSquad;
  allocationType: number = 1; // TeamCoordination
  voteSupport: number; // 1-100
  voteQuorum: number; // 1-100
  coreThreshold: number = 0; // unused (1 byte)
  squadName: string; // 24 chars
  description: string; // 36 chars
  token: string; // 6 chars
  randomId: string; // 10 random ASCII chars
  constructor(args: {
    voteSupport: number;
    voteQuorum: number;
    squadName: string;
    description: string;
    token: string;
    randomId: string;
  }) {
    this.voteSupport = args.voteSupport;
    this.voteQuorum = args.voteQuorum;
    this.squadName = ensureLength(args.squadName, 24);
    this.description = ensureLength(args.description, 36);
    this.token = ensureLength(args.token, 6);
    this.randomId = ensureLength(args.randomId, 10);
  }
}

export class AddMembersToSquadArgs {
  instruction: SquadsInstruction = SquadsInstruction.AddMembersToSquad;
  membersNum: number; // 1 byte
  allocationTable: BN[]; // u64[]
  constructor(args: { allocationTable: BN[] }) {
    this.membersNum = args.allocationTable.length;
    this.allocationTable = args.allocationTable;
  }
}

export class CreateProposalAccountArgs {
  instruction: SquadsInstruction = SquadsInstruction.CreateProposalAccount;
  proposalType: number; // 1 byte
  title: string; // 36 chars
  description: string; // 496 chars
  link: string; // 48 chars
  votesNum: number; // 1 byte
  votesLabels: string[]; // 220 total bytes (5 * 44)
  startTimestamp: BN; // i64
  closeTimestamp: BN; // i64
  amount: BN; // OPTIONAL u64 (only needed for certain proposal types)
  minimumOut: BN; // OPTIONAL u64 (only needed for certain proposal types)
  constructor(args: {
    proposalType: number;
    title: string;
    description: string;
    link: string;
    votesNum: number;
    votesLabels: string[];
    startTimestamp: BN;
    closeTimestamp: BN;
    amount?: BN;
    minimumOut?: BN;
  }) {
    // TODO: more validation
    if (args.votesLabels.length > 5) {
      throw new RangeError("Cannot set more than 5 votesLabels");
    }
    this.proposalType = args.proposalType;
    this.title = ensureLength(args.title, 36);
    this.description = ensureLength(args.description, 496);
    this.link = ensureLength(args.link, 48);
    this.votesNum = args.votesNum;
    this.votesLabels = args.votesLabels.map((label) => ensureLength(label, 44));
    // JS timestamps are in milliseconds, Solana cluster timestamp is in seconds
    this.startTimestamp = args.startTimestamp.div(new BN(1_000));
    this.closeTimestamp = args.closeTimestamp.div(new BN(1_000));
    this.amount = args.amount;
    this.minimumOut = args.minimumOut;
  }
}

export class CastVoteArgs {
  instruction: SquadsInstruction = SquadsInstruction.CastVote;
  vote: number;
  constructor(args: { vote: number }) {
    this.vote = args.vote;
  }
}

export class ExecuteProposalArgs {
  instruction: SquadsInstruction = SquadsInstruction.ExecuteProposal;
  randomId: string;
  constructor(args: { randomId: string }) {
    this.randomId = ensureLength(args.randomId, 10);
  }
}
