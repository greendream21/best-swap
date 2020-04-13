import { useCallback, useEffect, useState } from 'react';
import { Maybe, Nothing, FixmeType } from '../types/bepswap';

type Message = FixmeType;

interface Props {
  url: string;
  protocol: string;
  reconnect: boolean;
  onOpen: () => void;
  onError: () => void;
  onMessage: (message: Message) => void;
  messageFilter: (message: Message) => boolean;
  onClose: () => void;
}
export const useWebsocket = (props: Props) => {
  const {
    url,
    protocol,
    reconnect = false,
    onOpen = () => {},
    onError = () => {},
    onMessage = () => {},
    messageFilter = (message: Message) => message,
    onClose = () => {},
  } = props;
  const [attempts, setAttempts] = useState(1);
  const [ws, setWS] = useState<Maybe<WebSocket>>(Nothing);
  const [open, setOpen] = useState(false);

  const onOpenHandler = useCallback(() => {
    setOpen(true);
    onOpen();
  }, [onOpen]);

  const onErrorHandler = useCallback(() => {
    onError();
  }, [onError]);

  const onMessageHandler = useCallback(
    (e: MessageEvent) => {
      const message = messageFilter(e.data);
      if (message) {
        onMessage(message);
      }
    },
    [messageFilter, onMessage],
  );

  const generateInterval = (k: number) => Math.min(30, 2 ** k - 1) * 1000;

  const onCloseHandler = useCallback(
    (_: CloseEvent) => {
      onClose();
      if (reconnect) {
        const interval = generateInterval(attempts);
        const timeoutID = setTimeout(() => {
          setAttempts(a => a + 1);
        }, interval);
        return () => {
          clearTimeout(timeoutID);
        };
      }
    },
    [attempts, onClose, reconnect],
  );

  useEffect(() => {
    const ws = new WebSocket(url, protocol);

    ws.onopen = onOpenHandler;
    ws.onerror = onErrorHandler;
    ws.onmessage = onMessageHandler;
    ws.onclose = onCloseHandler;
    setWS(ws);
    return () => {
      setWS(Nothing);
      ws.close();
    };
  }, [
    onCloseHandler,
    onErrorHandler,
    onMessageHandler,
    onOpenHandler,
    protocol,
    setWS,
    url,
  ]);

  const sendMessage = useCallback(
    (message: string) => {
      if (ws && open) {
        ws.send(message);
      }
    },
    [open, ws],
  );

  return [sendMessage];
};
