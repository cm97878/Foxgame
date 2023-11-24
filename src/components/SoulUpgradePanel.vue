<template>
    <div v-show="active === 'soulUpgrades'">
        <UpgradeButton v-for="(item) in player.upgrades.soul"
            :key="item.title + item.description" 
            :show="item.show"
            :is_bought="item.bought"
            :title="item.title"
            :description="item.description"
            :cost="item.cost"
        />
    </div>
</template>


<script setup lang="ts">
import { usePlayer } from '@/stores/player';
import UpgradeButton from './UpgradeButton.vue';

const name = "soulUpgradePanel";

const player = usePlayer();

let props = defineProps({
    active: String
})
</script>