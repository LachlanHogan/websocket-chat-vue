<script setup lang="ts">
import { useMessagingStore } from '@/stores/messaging';
import Button from './ui/button/Button.vue';
import { ref } from 'vue';
import Input from './ui/input/Input.vue';

const messagingStore = useMessagingStore();

const creatingChannel = ref(false);
const creatingChannelName = ref("");

function createChannel() {
  messagingStore.createChannel(creatingChannelName.value);

  creatingChannelName.value = "";
  creatingChannel.value = false;
}
</script>
  
<template>
  <div class="flex flex-col min-w-80 max-w-80 h-full border border-black/60 rounded p-4">
    <div class="flex items-center justify-between mb-4">
      <p class="text-lg">Channels</p>

      <Button @click="creatingChannel = true">Create channel</Button>
    </div>

    <div v-if="creatingChannel" class="flex flex-col border rounded px-4 py-2 hover:border-black gap-y-2">
      <Input v-model="creatingChannelName" placeholder="Channel name" />

      <div class="flex gap-x-2">
        <Button @click="createChannel">Create</Button>
        <Button @click="creatingChannel = false" variant="outline">Cancel</Button>
      </div>
    </div>

    <button
      v-for="channel in messagingStore.channels" :key="channel.id"
      class="border rounded px-4 py-2 hover:border-black mb-2"
      @click="messagingStore.selectChannel(channel)"
    >
      <p>{{ channel.name }}</p>
    </button>
  </div>
</template>