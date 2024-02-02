<template>
    <div v-show="active === Tab.INFO" id="combat_tab">
        <div style="font-size: 30px;margin-bottom: 4px;">{{ mapStore.getAreaName }}</div>
        {{ mapStore.getDescription }} {{ mapStore.getDescAppend }}
    </div>
</template>



<script setup lang="ts">

import { Tab } from '@/enums/panels';
import { useMapStore } from '@/stores/mapStore';

const mapStore = useMapStore();

const props = defineProps({
    active: String
})

</script>