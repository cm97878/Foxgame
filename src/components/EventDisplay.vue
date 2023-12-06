<template>
    <div class="event-box">
        <span>{{ areaEvent.eventText }}</span>
        <button @click="concludeEvent(1)">{{ areaEvent.choice1Label }}</button>
        <button v-if="areaEvent.choice2Label" @click="concludeEvent(2)">{{ areaEvent.choice2Label }}</button>
    </div>
</template>

<script setup lang="ts">
    import type { AreaEvent }  from '@/types/areaEvent'
    const name = "EventDisplay"

    let props = defineProps<{
        areaEvent: AreaEvent
    }>()
    const emit = defineEmits(['eventFinished']);

    const concludeEvent = function(choice: number): void {
        props.areaEvent.eventCallback(choice);
        emit('eventFinished');
    }
</script>
<style>
    .event-box {
        display: flex;
        flex-direction: column;
        padding-top: 10px;
    }
</style>