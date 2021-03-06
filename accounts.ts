import { PublicKey } from "@solana/web3.js";
import BN from "bn.js";

export type SquadsAccountType = typeof Squad | typeof Proposal;

export class Squad {
  isInitialized: boolean;
  open: boolean;
  emergencyLock: boolean;
  allocationType: number;
  voteSupport: number;
  voteQuorum: number;
  coreThreshold: number;
  squadName: string;
  description: string;
  token: string;
  admin: PublicKey;
  solAccount: PublicKey;
  mint: PublicKey;
  proposalNonce: number;
  createdOn: BN;
  members?: Map<PublicKey, PublicKey>;
  randomId: string;
  childIndex: number;
  memberLockIndex: number;
  constructor(args: {
    isInitialized: boolean;
    open: boolean;
    emergencyLock: boolean;
    allocationType: number;
    voteSupport: number;
    voteQuorum: number;
    coreThreshold: number;
    squadName: string;
    description: string;
    token: string;
    admin: PublicKey;
    solAccount: PublicKey;
    mint: PublicKey;
    proposalNonce: number;
    createdOn: BN;
    members: Map<PublicKey, PublicKey>;
    randomId: string;
    childIndex: number;
    memberLockIndex: number;
  }) {
    this.isInitialized = args.isInitialized;
    this.open = args.open;
    this.emergencyLock = args.emergencyLock;
    this.allocationType = args.allocationType;
    this.voteSupport = args.voteSupport;
    this.voteQuorum = args.voteQuorum;
    this.coreThreshold = args.coreThreshold;
    this.squadName = args.squadName;
    this.description = args.description;
    this.token = args.token;
    this.admin = args.admin;
    this.solAccount = args.solAccount;
    this.mint = args.mint;
    this.proposalNonce = args.proposalNonce;
    this.createdOn = args.createdOn;
    this.members = args.members;
    this.randomId = args.randomId;
    this.childIndex = args.childIndex;
    this.memberLockIndex = args.memberLockIndex;
  }
}

export class SquadItem {
  account: Squad;
  pubkey: PublicKey;
}

export class Proposal {
  isInitialized: boolean;
  proposalType: number;
  executionAmount: BN;
  executionAmountOut: BN;
  executionSource: PublicKey;
  executionDestination: PublicKey;
  creator: PublicKey;
  squad: PublicKey;
  title: string;
  description: string;
  link: string;
  votesNum: number;
  hasVotedNum: number;
  hasVoted: PublicKey[];
  votes: BN[];
  votesLabels: string[];
  startTimestamp: BN;
  closeTimestamp: BN;
  createdTimestamp: BN;
  supplyAtExecute: BN;
  membersAtExecute: number;
  thresholdAtExecute: number;
  executed: boolean;
  executeReady: boolean;
  executionDate: BN;
  instructionIndex: number;
  multipleChoice: boolean;
  executedBy: PublicKey;
  proposalIndex: number;
  constructor(args: {
    isInitialized: boolean;
    proposalType: number;
    executionAmount: BN;
    executionAmountOut: BN;
    executionSource: PublicKey;
    executionDestination: PublicKey;
    creator: PublicKey;
    squad: PublicKey;
    title: string;
    description: string;
    link: string;
    votesNum: number;
    hasVotedNum: number;
    hasVoted: PublicKey[];
    votes: BN[];
    votesLabels: string[];
    startTimestamp: BN;
    closeTimestamp: BN;
    createdTimestamp: BN;
    supplyAtExecute: BN;
    membersAtExecute: number;
    thresholdAtExecute: number;
    executed: boolean;
    executeReady: boolean;
    executionDate: BN;
    instructionIndex: number;
    multipleChoice: boolean;
    executedBy: PublicKey;
    proposalIndex: number;
  }) {
    this.isInitialized = args.isInitialized;
    this.proposalType = args.proposalType;
    this.executionAmount = args.executionAmount;
    this.executionAmountOut = args.executionAmountOut;
    this.executionSource = args.executionSource;
    this.executionDestination = args.executionDestination;
    this.creator = args.creator;
    this.squad = args.squad;
    this.title = args.title;
    this.description = args.description;
    this.link = args.link;
    this.votesNum = args.votesNum;
    this.hasVotedNum = args.hasVotedNum;
    this.hasVoted = args.hasVoted;
    this.votes = args.votes;
    this.votesLabels = args.votesLabels;
    this.startTimestamp = args.startTimestamp;
    this.closeTimestamp = args.closeTimestamp;
    this.createdTimestamp = args.createdTimestamp;
    this.supplyAtExecute = args.supplyAtExecute;
    this.membersAtExecute = args.membersAtExecute;
    this.thresholdAtExecute = args.thresholdAtExecute;
    this.executed = args.executed;
    this.executeReady = args.executeReady;
    this.executionDate = args.executionDate;
    this.instructionIndex = args.instructionIndex;
    this.multipleChoice = args.multipleChoice;
    this.executedBy = args.executedBy;
    this.proposalIndex = args.proposalIndex;
  }
}

export class ProposalItem {
  account: Proposal;
  pubkey: PublicKey;
}
