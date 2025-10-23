import { useRef, useCallback, useEffect } from "react";
import { io, Socket } from "socket.io-client";

interface WebsocketProps {
    onOpen: () => void;
    onMessage: (event: any) => void;
    onError?: (error: Error) => void;
    onClose?: (event: CloseEvent) => void;
}

const useWebsocket = ({ onOpen, onMessage, onError, onClose }: WebsocketProps) => {
    const socketRef = useRef<Socket | null>(null);

    const connectSocket = useCallback(() => {
        if (!socketRef.current) {
            const WEBSOCKET_URL = process.env.NEXT_PUBLIC_WEBSOCKET_URL;
            if (!WEBSOCKET_URL) {
                console.error("WebSocket URL is not defined in environment variables");
                return;
            }

            socketRef.current = io(WEBSOCKET_URL, {
                reconnectionAttempts: 5,
                timeout: 10000,
            });

            const socket = socketRef.current;

            socket.on("connect", () => {
                onOpen();
            });

            socket.on("message", (data) => {
                onMessage(data);
            });

            socket.on("connect_error", (error) => {
                console.error("Connection error:", error);
                if (onError) onError(error);
            });

            socket.on("disconnect", (reason) => {
                if (onClose) onClose(new CloseEvent("close"));
            });
        }
        return socketRef.current;
    }, [onOpen, onMessage, onError, onClose]);

    const send = useCallback((data: any) => {
        if (socketRef.current?.connected) {
            socketRef.current.emit("message", data);
        } else {
            console.warn("Cannot send message: WebSocket is not connected");
        }
    }, []);

    const closeSocket = useCallback(() => {
        if (socketRef.current) {
            socketRef.current.disconnect();
            socketRef.current = null;
        }
    }, []);

    useEffect(() => {
        return () => {
            closeSocket();
        };
    }, [closeSocket]);

    return { send, connectSocket, closeSocket };
};

export default useWebsocket;