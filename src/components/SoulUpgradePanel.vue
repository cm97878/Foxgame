<template>
    <div v-show="active === 'soulUpgrades'">
        <UpgradeButton v-for="(item) in upgrade.soul.entries()"
            :key="item[0]" 
            :show="item[1].show"
            :is_bought="item[1].bought"
            :type="item[1].type"
            :title="item[1].title"
            :description="item[1].description"
            :map_key="item[0]"
            :cost="item[1].cost"
            :effect="item[1].effect"
        />
    </div>
</template>


<script setup lang="ts">
import UpgradeButton from './UpgradeButton.vue';
import { useUpgradeStore } from '@/stores/upgradeStore';
import { usePlayer } from '@/stores/player'

const name = "soulUpgradePanel";

const upgrade = useUpgradeStore();
const player = usePlayer();

let props = defineProps({
    active: String
})
</script>