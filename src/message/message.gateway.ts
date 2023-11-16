import {
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
})
//WebSocketGateway Decorator의 argument - gateway-metadata.interface.d.ts에 여러 metadata 기재되어있음
//8080포트를 사용한것은 80이 보통 할당된 경우가 많아서, 관례적으로 8080 사용
//cors 사용한 이유는 FE-BE 간 포트가 다른 경우 통신을 가능케 해주기 위해
export class MessageGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor() {}
  @WebSocketServer() server: Server;

  private logger: Logger = new Logger('MessageGateway');

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any) {
    this.logger.log('data');
    this.server.emit('message', payload); // 모든 클라이언트에 메시지 전달
    //message event에 대해, payload를 emit해준다.

    //return 'hello world' 해봤자 아무곳에서도 아무것도 안나옴.
  }
  /*웹소켓 서버와 연결된 클라이언트에서 message를 발생시키면(emit),
   서버에서 해당 이벤트를 읽어서 요청에 대한 응답을 할 수 있습니다.
  handleEvent 함수 파라미터 값에 clinet:Socket을 이용하면 해당 이벤트를 발생시킨 클라이언트를 특정할 수 있습니다. 여기선특정안됨.
  위 코드에서는 클라이언트에서 emit('message',payload)를 응답한 것인데, 서버에서 반환해준 값을 클라이언트에서 응답으로 받을 수 있습니다.*/

  afterInit(server: Server) {
    this.logger.log('웹소켓 서버 초기화');
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log('New client connected:', client.id);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client Disconnected: ${client.id}`);
  }
}
