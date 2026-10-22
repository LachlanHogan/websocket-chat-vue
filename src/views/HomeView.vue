<script setup lang="ts">
import Channels from '@/components/Channels.vue';
import Chat from '@/components/Chat.vue';
import Button from '@/components/ui/button/Button.vue';
import Input from '@/components/ui/input/Input.vue';
import { MessagingState, useMessagingStore } from '@/stores/messaging';
import { ref } from 'vue';

const messagingStore = useMessagingStore();

const username = ref("");
const passcode = ref("");

function submitUserCredentials() {
  messagingStore.connect(username.value, passcode.value);
}
</script>

<template>
  <main class="w-full h-full">
    <div v-if="messagingStore.messagingState !== MessagingState.Connected"  class="flex flex-col gap-y-4 w-full h-full p-4 items-center justify-center">
      <Input v-model="username" placeholder="Username" class="max-w-80" />
      <Input v-model="passcode" placeholder="Passcode" class="max-w-80" />

      <Button @click="submitUserCredentials">Submit</Button>

      <p v-if="messagingStore.messagingState === MessagingState.AuthenticationFailed" class="text-red-500 text-sm">Invalid credentials. Please try again</p>
    </div>

    <div v-if="messagingStore.messagingState === MessagingState.Connected" class="flex w-full h-full p-4 gap-x-4">
      <Channels />

      <Chat v-if="messagingStore.selectedChannel" :channel="messagingStore.selectedChannel" />
    </div>
  </main>
</template>
