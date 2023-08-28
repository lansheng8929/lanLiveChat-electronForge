/**
 * 构造的客户端类
 * @param room_id{number}
 * @param url{string}
 *
 */
declare class BClient {
  private timer;
  private ws;
  private room_id;
  private url;
  constructor(room_id: number, url?: string);
  connect(): void;
  onOpen(): void;
  onMessage(e: any): void;
  onClose(): void;
  onError(e: any): void;
}
type EventType =
  | "VIEW"
  | "INTERACT_WORD"
  | "DANMU_MSG"
  | "SEND_GIFT"
  | "Certify_Success";
/**
 * @description EventType: "VIEW" | "INTERACT_WORD" | "DANMU_MSG" | "SEND_GIFT";
 * @param eventType {EventType}
 * @param callback
 */
declare function Bon(eventType: EventType, callback: any): void;

export { BClient, Bon };
