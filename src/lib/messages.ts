import { err, ok, type Result } from "neverthrow";

export type WebSocketMessage = {
  method: string;
  params: string[];
};

export function parseJson<T>(json: string): Result<T, Error> {
  try {
    return ok(JSON.parse(json));
  } catch (error: unknown) {
    if (error instanceof Error) {
      return err(error);
    } else {
      console.error("Unexpected parsing error:", error);
      return err(new Error("Unexpected parsing error"));
    }
  }
}
