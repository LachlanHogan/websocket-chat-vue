<script setup lang="ts">
import { useMessagingStore } from '@/stores/messaging';
import Message from './Message.vue';
import type { Channel } from '@/lib/channels.ts';
import Textarea from './ui/textarea/Textarea.vue';
import Button from './ui/button/Button.vue';
import { ref } from 'vue';

interface ChatProps {
  channel: Channel
}

const props = defineProps<ChatProps>();

const messageContents = ref("");

const messagingStore = useMessagingStore();

function sendMessage() {
  messagingStore.sendMessage(props.channel.id, messageContents.value);

  messageContents.value = "";
}
</script>

<template>
  <div class="flex flex-col w-full h-full border border-black/60 rounded p-4">
    <div class="flex pb-2 border-b border-black/60">
      <p>#{{ props.channel.name }}</p>
    </div>

    <div class="flex flex-col-reverse grow">
      <Message v-for="message in messagingStore.selectedChannelMessages" :key="message.id" :message="message" />
    </div>

    <div class="flex items-center gap-x-4">
      <Textarea v-model="messageContents" />
      <Button @click="sendMessage">Send</Button>
    </div>
  </div>
</template>