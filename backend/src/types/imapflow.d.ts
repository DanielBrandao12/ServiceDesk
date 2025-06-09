declare module 'imapflow' {
  export class ImapFlow {
    fetch: any;
    search: any;
    messageFlagsAdd(uid: any, arg1: string[]) {
      throw new Error('Method not implemented.');
    }

    mailboxOpen(arg0: string) {
      throw new Error('Method not implemented.');
    }
    constructor(config: any);
    connect(): Promise<void>;
    logout(): Promise<void>;
    on(event: string, callback: (...args: any[]) => void): void;
    // adicione mais conforme sua necessidade
  }
}