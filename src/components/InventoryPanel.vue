<template>
    <div v-show="active === Tab.INVENTORY">
        <!-- Inventory -->
        <span class="title">Resources:</span>
        <div class="inventory-box">
            <span v-for="(item) in player.resources.entries()" class="resource"><b>{{ item[0] }}</b> : {{ item[1].amount }} / {{ item[1].max }}</span>
        </div>
        <div class="divider"></div>
        <div v-show="mapStore.selectedNode.data.areaSpecialID === SpecialAreaId.HOME" class="home-box">
            <div class = "upgrades">
                <UpgradeButton v-for="(item) in upgradeStore.getBuyableHomeUpgrades"
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
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { Tab } from '@/enums/panels';
    import { useUpgradeStore } from '@/stores/upgradeStore';
    import UpgradeButton from './UpgradeButton.vue';
    import { useMapStore } from '@/stores/mapStore';
    import { SpecialAreaId } from '@/enums/areaEnums';
    import { usePlayer } from '@/stores/player';
    const mapStore = useMapStore();
    const player = usePlayer();

    let props = defineProps({
        active: String
    })

    const upgradeStore = useUpgradeStore();


</script>
<style>
    .upgrades {
        display: flex;
        flex-wrap: wrap;
    }

    .home-box {
        margin-top: 10px;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .title {
        font-weight: 500px;
        font-size: 32px;
    }

    .inventory-box {
        display:flex;
        flex-wrap: wrap;
        justify-content: space-between;
        margin:8px 0;
        .resource {
            font-size: 22px;
            margin: 0 8px;
        }
    }
</style>