import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

@WebSocketGateway(8080, {
  namespace: 'message',
  cors: { origin: '*' },
}) //WebSocketGateway Decorator의 argument - gateway-metadata.interface.d.ts에 여러 metadata 기재되어있음
export class MessageGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor() {}
  @WebSocketServer() server: Server;

  private logger: Logger = new Logger('MessageGateway');

  // @SubscribeMessage('message')
  // // handleEvent(@MessageBody() data: string): string {
  // //   return 'dada';
  // // }
  @SubscribeMessage('message')
  handleMessage(client: any, payload: any) {
    this.logger.log('data');
    this.server.emit('message', 'dada'); // 모든 클라이언트에 메시지 전달
    // return 'Hello world!';
    //return 'hello world' 해봤자 아무곳에서도 아무것도 안나옴.
    
  }
  /*웹소켓 서버와 연결된 클라이언트에서 message를 발생시키면(emit),
   서버에서 해당 이벤트를 읽어서 요청에 대한 응답을 할 수 있습니다.
  handleEvent 함수 파라미터 값에 clinet:Socket을 이용하면 해당 이벤트를 발생시킨 클라이언트를 특정할 수 있습니다. 여기선특정안됨.

  위 코드에서는 클라이언트에서 emit('message',data)를 응답한 것인데, 서버에서 반환해준 값을 클라이언트에서 응답으로 받을 수 있습니다.*/

  afterInit(server: Server) {
    this.logger.log('웹소켓 서버 초기화');
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client Disconnected: ${client.id}`);
  }

  // //궁금증:handleEvnet, handleConnection 차이점?
  // // This method handles incoming WebSocket connections
  handleConnection(client: Socket, ...args: any[]) {
    // Your logic for handling incoming connections
    console.log('New client connected:', client.id);
    // Additional code to handle the connection
  }
  // @SubscribeMessage('message')
  // handleMessage(client: any, payload: any): string {
  //   return 'Hello world!';
  // }
}
