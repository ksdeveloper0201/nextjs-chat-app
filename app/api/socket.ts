import { Server } from "socket.io";
import type { NextApiRequest } from "next";
import type { NextApiResponseServerIO } from "@/types/socket";

export default function handler(
    req: NextApiRequest,
    res: NextApiResponseServerIO
) {
    if (res.socket.server.io) {
        const io = new Server(res.socket.server);
        res.socket.server.io = io;

        io.on("connection", (socket) => {
            socket.on("message", (msg) => {
                io.emit("message", msg); // 全員にブロードキャスト
            });
        });
    }
}
