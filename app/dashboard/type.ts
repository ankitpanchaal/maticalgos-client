export interface AccountResponse {
    status: boolean;
    error: boolean;
    data: IAccount[];
    message: string;
}

export interface IAccount {
    Clientid: string;
    AccountName: string;
    LastLogin: string;
    UCC: string;
    Chatid: string;
    BotKeys: string;
    Sessionid: string;
    Trade: string;
    Broker: string;
    Subscription: string;
}