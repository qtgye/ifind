import { useCallback, useEffect, useState } from "react";

export type I_UseWebSocket = (
  url: string,
  onmessage?: (data: any) => any
) => [
  send: (message: string) => any,
  socket: WebSocket,
];

export const useWebSocket: I_UseWebSocket = (
  path,
  onmessage = () => null,
) => {
  const [ socket, setSocket ] = useState<WebSocket|null>(null);
  const [ isSocketOpen, setIsSocketOpen ] = useState(false);

  type T_SendCallback = (data: any) => void;
  const send = useCallback<T_SendCallback>((data) => {
    if ( isSocketOpen ) {
      socket?.send(data);
    } else {
      socket?.addEventListener('open', () => {
        socket.send(data);
      });
    }
  }, [ socket as WebSocket, isSocketOpen as boolean ]);

  useEffect(() => {
    if ( socket?.OPEN ) {
      setIsSocketOpen(true);

      socket.addEventListener('close', () => {
        console.warn('Connection with Scheduled Tasks Endpoint has closed.');
      });
      
      if ( typeof onmessage === 'function' ) {
        socket.addEventListener('message', (msgEvent) => {
          console.log('ws message', msgEvent);
          onmessage(JSON.parse(msgEvent.data));
          return null;
        });
      }
    }
  }, [ socket, onmessage ]);

  useEffect(() => {
    const socketProtocol: string = (window.location.protocol === 'https:' ? 'wss:' : 'ws:')
    const port: string = window.location.port ? `:${window.location.port}` : '';
    const sanitizedPath: string = '/' + path.replace(/^\/+/, '');
    const socketURL: string = socketProtocol + '//' + window.location.hostname + port + sanitizedPath;
    setSocket(new WebSocket(socketURL));
  }, [ path ]);

  return [
    send,
    socket
  ];
};

