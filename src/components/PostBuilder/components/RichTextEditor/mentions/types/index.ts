export interface IMention {
  index: string;
  denotationChar: string;
  id: string;
  value: string;
}

export interface IInsertOp {
  insert: string | { mention: IMention };
}

export interface ITransformedOp {
  insert: string | { hashtag: IMention } | Array<any>;
  attributes: Record<string, any>;
}

export interface IQuillDelta {
  ops: IInsertOp[];
}

export interface TransformedQuillDelta {
  ops: ITransformedOp[];
}

export interface IHashtags {
  _id: string;
  name: string;
  orgId: string;
  createdAt: string;
  updatedAt: string;
}
