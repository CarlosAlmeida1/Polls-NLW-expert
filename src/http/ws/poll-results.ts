import { FastifyInstance } from "fastify";
import { voting } from "../../utils/voteing-pub-sub";
import { z } from "zod";

export async function pollResults(app: FastifyInstance) {
  app.get(
    "/polls/:pollId/results",
    { websocket: true },
    (connection, request) => {
      connection.socket.on("message", (message: string) => {
        const getPollParams = z.object({
          pollId: z.string().uuid(),
        });

        const { pollId } = getPollParams.parse(request.params);

        voting.subscribe(pollId, (message) => {
          connection.socket.send(JSON.stringify(message));
        });
      });
    }
  );
}
