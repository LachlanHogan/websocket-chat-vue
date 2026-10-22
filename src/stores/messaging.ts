import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { parseJson, type WebSocketMessage } from "@/lib/messages";
import type { Channel, ChannelMessage } from "@/lib/channels";
import { Result } from "neverthrow";

export enum MessagingState {
  NotConnected = "NOT_CONNECTED",
  AuthenticationFailed = "AUTH_FAILED",
  Connected = "CONNECTED",
}

export const useMessagingStore = defineStore("messaging", () => {
  const websocket = ref<WebSocket | undefined>(undefined);
  const messagingState = ref<MessagingState>(MessagingState.NotConnected);
  const channels = ref<Channel[]>([]);
  const selectedChannel = ref<Channel | undefined>(undefined);
  const selectedChannelMessages = ref<ChannelMessage[]>([]);

  function connect(username: string, passcode: string) {
    const ws = new WebSocket("ws://localhost:8080");

    ws.addEventListener("open", () => {
      console.log("[Client] WebSocket connection opened");

      const authenticateMessage: WebSocketMessage = {
        method: "authenticate",
        params: [username, passcode],
      };
      ws.send(JSON.stringify(authenticateMessage));
    });

    ws.addEventListener("message", (event) => {
      const messageData = event.data;

      if (typeof messageData !== "string") {
        console.error(
          "[Client] WebSocket message uses unsupported format. String expected",
        );
        return;
      }

      const messageResult = parseJson<WebSocketMessage>(messageData);
      if (messageResult.isErr()) {
        console.error(
          "[Client] WebSocket message was not parsed successfully",
          messageResult.error,
        );
        return;
      }

      const message = messageResult.value;
      console.log("[Client] WebSocket message received", message);

      switch (message.method) {
        case "authentication_failed": {
          websocket.value = undefined;
          messagingState.value = MessagingState.AuthenticationFailed;

          console.error("[Client] Authentication failed");
          break;
        }
        case "authentication_successful": {
          messagingState.value = MessagingState.Connected;

          const getAllChannelsMessage: WebSocketMessage = {
            method: "get_all_channels",
            params: [],
          };
          ws.send(JSON.stringify(getAllChannelsMessage));

          console.log("[Client] Authentication succeeded");
          break;
        }
        case "channels_list": {
          const channelsResult = Result.combine(
            message.params.map((channelJson) =>
              parseJson<Channel>(channelJson),
            ),
          );

          if (channelsResult.isErr()) {
            console.error("[Client] Channels could not be parsed");
            return;
          }

          channels.value = channelsResult.value;

          break;
        }
        case "channel_messages": {
          const channelMessagesResult = Result.combine(
            message.params.map((messageJson) =>
              parseJson<ChannelMessage>(messageJson),
            ),
          );

          if (channelMessagesResult.isErr()) {
            console.error("[Client] Channel messages could not be parsed");
            return;
          }

          selectedChannelMessages.value = channelMessagesResult.value.sort(
            (a, b) =>
              new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime(),
          );

          break;
        }
        case "new_message": {
          const newMessagesResult = Result.combine(
            message.params.map((messageJson) =>
              parseJson<ChannelMessage>(messageJson),
            ),
          );

          if (newMessagesResult.isErr()) {
            console.error("[Client] New messages could not be parsed");
            return;
          }

          const selectedChannelVal = selectedChannel.value;
          if (typeof selectedChannelVal === "undefined") {
            return;
          }

          newMessagesResult.value.forEach((message) => {
            if (message.channelId === selectedChannelVal.id) {
              selectedChannelMessages.value.push(message);
            }
          });

          selectedChannelMessages.value.sort(
            (a, b) =>
              new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime(),
          );

          break;
        }
        case "new_channel": {
          const channelsResult = Result.combine(
            message.params.map((channelJson) =>
              parseJson<Channel>(channelJson),
            ),
          );

          if (channelsResult.isErr()) {
            console.error("[Client] New channels could not be parsed");
            return;
          }

          channelsResult.value.forEach((c) => channels.value.push(c));

          break;
        }
        default: {
          console.error("[Client] Unhandled message received", message);
          break;
        }
      }
    });

    ws.addEventListener("close", (e) => {
      console.log("[Client] Connection closed:", e.code, e.reason);
      websocket.value = undefined;
    });

    ws.addEventListener("error", (e) => {
      console.error("[Client] WebSocket error:", e);
    });

    websocket.value = ws;
  }

  function selectChannel(channel: Channel) {
    selectedChannel.value = channel;

    const getChannelMessages: WebSocketMessage = {
      method: "get_channel_messages",
      params: [channel.id],
    };
    websocket.value?.send(JSON.stringify(getChannelMessages));
  }

  function sendMessage(channelId: string, message: string) {
    const sendMessage: WebSocketMessage = {
      method: "send_message",
      params: [channelId, message],
    };
    websocket.value?.send(JSON.stringify(sendMessage));
  }

  function createChannel(channelName: string) {
    const createChannelMessage: WebSocketMessage = {
      method: "create_channel",
      params: [channelName],
    };
    websocket.value?.send(JSON.stringify(createChannelMessage));
  }

  return {
    websocket,
    messagingState,
    channels,
    selectedChannel,
    selectedChannelMessages,
    connect,
    selectChannel,
    sendMessage,
    createChannel,
  };
});
