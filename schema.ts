import {
  Layout as AbstractLayout,
  OffsetLayout,
  Structure,
  uint8ArrayToBuffer,
} from "@solana/buffer-layout";
import { SquadsInstruction } from "./instruction";
import { BN } from "@project-serum/anchor";
import { Proposal, Squad, SquadsAccountType } from "./accounts";
import { Connection, PublicKey } from "@solana/web3.js";
const Layout = require("@solana/buffer-layout");

declare module "@solana/buffer-layout" {
  let fixedUtf8: (length: number, property?: string) => FixedLengthUTF8;
  let u64: (property?: string) => U64;
  let i64: (property?: string) => I64;
  let pubkey: (property?: string) => Pubkey;
}

class FixedLengthUTF8 extends AbstractLayout<string> {
  constructor(length: number, property?: string) {
    super(length, property);
  }
  /** @override */
  decode(b: Uint8Array, offset: number = 0): string {
    return uint8ArrayToBuffer(b)
      .slice(offset, offset + this.span)
      .toString("utf-8");
  }
  /** @override */
  encode(src: string, b: Uint8Array, offset: number = 0): number {
    const srcb = Buffer.from(src, "utf8");
    const span = srcb.length;
    if (this.span < span) {
      throw new RangeError("text length exceeds intended span");
    }
    if (this.span + offset > b.length) {
      throw new RangeError(
        `encoding overruns Buffer (${
          this.property ?? "(unnamed)"
        }: FixedLengthUTF8)`
      );
    }

    srcb.copy(uint8ArrayToBuffer(b), offset);
    return span;
  }
}

Layout.fixedUtf8 = (length, property?) => new FixedLengthUTF8(length, property);

class U64 extends AbstractLayout<BN> {
  constructor(property?: string) {
    super(8, property);
  }
  /** @override */
  decode(b: Uint8Array, offset: number = 0): BN {
    const buffer = uint8ArrayToBuffer(b);
    return new BN(buffer.slice(offset, offset + this.span), "le");
  }
  /** @override */
  encode(src: BN, b: Uint8Array, offset: number = 0): number {
    if (src.isNeg()) {
      throw new RangeError(
        `BN with negative value ${src.toString()} cannot be encoded as u64`
      );
    }
    if (this.span + offset > b.length) {
      throw new RangeError(
        `encoding overruns Buffer (${this.property ?? "(unnamed)"}: U64)`
      );
    }
    const srcb = src.toArrayLike(Buffer, "le", this.span);
    srcb.copy(uint8ArrayToBuffer(b), offset);
    return this.span;
  }
}

Layout.u64 = (property?) => new U64(property);

class I64 extends AbstractLayout<BN> {
  constructor(property?: string) {
    super(8, property);
  }
  /** @override */
  decode(b: Uint8Array, offset: number = 0): BN {
    const buffer = uint8ArrayToBuffer(b);
    return new BN(buffer.slice(offset, offset + this.span), "le").fromTwos(
      this.span * 8
    );
  }
  /** @override */
  encode(src: BN, b: Uint8Array, offset: number = 0): number {
    if (this.span + offset > b.length) {
      throw new RangeError(
        `encoding overruns Buffer (${this.property ?? "(unnamed)"}: I64)`
      );
    }
    const srcb = src.toTwos(64).toArrayLike(Buffer, "le", this.span);
    srcb.copy(uint8ArrayToBuffer(b), offset);
    return 8;
  }
}

Layout.i64 = (property?) => new I64(property);

class Pubkey extends AbstractLayout<PublicKey> {
  constructor(property?: string) {
    super(32, property);
  }
  /** @override */
  decode(b: Uint8Array, offset: number = 0): PublicKey {
    const buffer = uint8ArrayToBuffer(b);
    return new PublicKey(buffer.slice(offset, offset + this.span));
  }
  /** @override */
  encode(src: PublicKey, b: Uint8Array, offset: number = 0): number {
    if (this.span + offset > b.length) {
      throw new RangeError(
        `encoding overruns Buffer (${this.property ?? "(unnamed)"}: Pubkey)`
      );
    }
    const srcb = src.toBuffer();
    srcb.copy(uint8ArrayToBuffer(b), offset);
    return this.span;
  }
}

Layout.pubkey = (property?) => new Pubkey(property);

export const SquadsSchema = new Map<
  SquadsInstruction | SquadsAccountType,
  Structure<any>
>([
  [
    SquadsInstruction.CreateSquad,
    Layout.struct([
      Layout.u8("instruction"),
      Layout.u8("allocationType"),
      Layout.u8("voteSupport"),
      Layout.u8("voteQuorum"),
      Layout.u8("coreThreshold"),
      Layout.fixedUtf8(24, "squadName"),
      Layout.fixedUtf8(36, "description"),
      Layout.fixedUtf8(6, "token"),
      Layout.fixedUtf8(10, "randomId"),
    ]),
  ],
  [
    SquadsInstruction.AddMembersToSquad,
    Layout.struct([
      Layout.u8("instruction"),
      Layout.u8("membersNum"),
      Layout.u64(), // ignored
      Layout.seq(
        Layout.u64(),
        new OffsetLayout(Layout.u8(), -9),
        "allocationTable"
      ),
    ]),
  ],
  [
    SquadsInstruction.CreateProposalAccount,
    Layout.struct(
      [
        Layout.u8("instruction"),
        Layout.u8("proposalType"),
        Layout.fixedUtf8(36, "title"),
        Layout.fixedUtf8(496, "description"),
        Layout.fixedUtf8(48, "link"),
        Layout.u8("votesNum"),
        Layout.seq(Layout.fixedUtf8(44), 5, "votesLabels"),
        Layout.i64("startTimestamp"),
        Layout.i64("closeTimestamp"),
        Layout.u64("amount"), // optional
        Layout.u64("minimumOut"), // optional
      ],
      undefined,
      true
    ),
  ],
  [
    SquadsInstruction.CastVote,
    Layout.struct([Layout.u8("instruction"), Layout.u8("vote")]),
  ],
  [
    SquadsInstruction.ExecuteProposal,
    Layout.struct([Layout.u8("instruction"), Layout.fixedUtf8(10, "randomId")]),
  ],
  [
    Squad,
    Layout.struct([
      Layout.u8("isInitialized"),
      Layout.u8("open"),
      Layout.u8("emergencyLock"),
      Layout.u8("allocationType"),
      Layout.u8("voteSupport"),
      Layout.u8("voteQuorum"),
      Layout.u8("coreThreshold"),
      Layout.fixedUtf8(24, "squadName"),
      Layout.fixedUtf8(36, "description"),
      Layout.fixedUtf8(6, "token"),
      Layout.seq(Layout.u8(), 5), // future settings placeholders
      Layout.pubkey("admin"),
      Layout.pubkey("mint"),
      Layout.pubkey("solAccount"),
      Layout.seq(Layout.seq(Layout.u8(), 32), 5), // future address placeholders
      Layout.u32("proposalNonce"),
      Layout.i64("createdOn"),
      Layout.u32(), // members length (redundant)
      Layout.seq(Layout.u8(), 9604), // skipping members for now,
      Layout.fixedUtf8(10, "randomId"),
      Layout.u32("childIndex"),
      Layout.u32("memberLockIndex"),
      Layout.seq(Layout.u64(), 32), // reserved
    ]),
  ],
  [Proposal, Layout.struct([])],
]);
