export class PingResponse {

    readonly pong: boolean;

    readonly text: string;

    constructor(text: string) {
        this.pong = true;
        this.text = text;
    }
}
