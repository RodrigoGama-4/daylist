export const enum Priority {
  NONE,
  LOW,
  MEDIUM,
  HIGH,
}

export class ExistenceTimespan {
  start?: Date;
  end?: Date;
  constructor({ start, end }: { start?: Date; end?: Date }) {}
  isTimeOut() {
    if (!this.end) return false;
    return Date.now() > this.end.getTime();
  }
}
