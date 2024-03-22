
export interface Call {
  id: number;
  idUser: number;
  idCustomer: number;
  tel: string;
  date: Date;
  origin: string;
  type: CallStatusType;
  url: string;
  response: string;
}

export enum CallStatusType {
  Calling = 1,
  Answered = 2,
  DuplicatedCall = 3
}