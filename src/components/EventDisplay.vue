<template>
    <div class="event-box">
        <span>{{ areaEvent.eventText }}</span>
        <button v-for="choice in areaEvent.choices" @click="concludeEvent(choice.id)"> {{ choice.label }}</button>
    </div>
</template>

<script setup lang="ts">
    import type { AreaEvent }  from '@/types/areaEvent'

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
        align-items: center;
    }
</style>