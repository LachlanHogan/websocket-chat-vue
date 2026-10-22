export type Channel = {
  id: string;
  name: string;
};

export type ChannelMessage = {
  id: string;
  userId: string;
  channelId: string;
  username: string;
  messageContents: string;
  sentAt: string;
};
