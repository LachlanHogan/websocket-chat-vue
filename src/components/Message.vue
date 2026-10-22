<script setup lang="ts">
import type { ChannelMessage } from '@/lib/channels';

interface MessageProps {
  message: ChannelMessage
}

const props = defineProps<MessageProps>();
</script>

<template>
  <div class="flex items-center gap-x-4 justify-between">
    <p>{{ message.username }}: {{ message.messageContents }}</p>
    <p class="text-xs text-black/40">{{ new Date(message.sentAt).toLocaleDateString() }} {{ new Date(message.sentAt).toLocaleTimeString() }}</p>
  </div>
</template>