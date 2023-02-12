export type TStressedRequestPayload = {
    
}

export type TRequest = {
    clients: number;
    created: number;
    headers: any;
    id: string;
    ips: string[];
    requests: number;
    time: number;
    url: string;
    userId: string;
}
export type TStressedResponsePayload = {
    status: number;
    message: string;
    data: TRequest[]
}