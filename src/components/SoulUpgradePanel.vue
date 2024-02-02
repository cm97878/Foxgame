<template>
    <div v-show="active === 'soulUpgrades'">
        <UpgradeButton v-for="(item) in upgrade.getBuyableSoulUpgrades"
            :upgrade_key="item[0]" 
            :show="item[1].show"
            :is_bought="item[1].bought"
            :upgrade_category="item[1].category"
            :title="item[1].title"
            :flavor="item[1].flavor"
            :effect_description="item[1].effectDescription"
            :cost_description="item[1].costDescription"
            :costFunc="item[1].costFunc"
            :effect="item[1].effect"
            :repeatable="item[1].repeatable"
            :level="item[1].level"
        />
    </div>
</template>

<script setup lang="ts">
import UpgradeButton from './UpgradeButton.vue';
import { useUpgradeStore } from '@/stores/upgradeStore';

const upgrade = useUpgradeStore();

let props = defineProps({
    active: String
})
</script>