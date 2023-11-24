<template>
    <div id="window_border">

        <div id="left_side_container" class="app_container">
            <div id="info_top_buttons_container">
                <button @click="showPanel(Panels.WORLD)" v-show="combatUnlock" class="info_buttons">World</button>
                <button @click="showPanel(Panels.SOUL)" v-show="soulUnlock" class="info_buttons">Soul</button>
            </div>
            
            <div v-show="activePanel == Panels.WORLD">
                <div class="tab_container">
                    <span :class="{ selected: activeTabWorld === Tab.COMBAT }" @click="showTabWorld(Tab.COMBAT)" class="tab">
                        Combat
                    </span>
                    <span :class="{ selected: activeTabWorld === Tab.AREA_ACTIONS }" @click="showTabWorld(Tab.AREA_ACTIONS)" class="tab">
                        Area
                    </span>
                </div>
                <div class="content-container">
                    <CombatPanel v-bind:active="activeTabWorld" />
                    <AreaActionsPanel v-bind:active="activeTabWorld" />
                </div>
            </div>

            <div v-show="activePanel == Panels.SOUL">
                <div class="tab_container">
                    <span :class="{ selected: activeTabSoul === Tab.SOUL_UPGRADES }" @click="showTabSoul(Tab.SOUL_UPGRADES)" class="tab">
                        Soul Upgrades
                    </span>
                </div>
                <div class="content-container">
                    <SoulUpgradePanel v-bind:active="activeTabSoul" />
                </div>
            </div>
        </div>




        <div id="right_side_container" class="app_container">
            <div id="currency_section">
                <div id="soul_counter_container">
                    {{ player.currencies.soul.toNumber() }}<br />
                    <span style="font-size: 16pt;">Soul</span>
                </div>
                <div id="soul_bead_counters_container">
                    0
                </div>
            </div>
            <OvermapPanel />
        </div>




    </div>
</template>


<script setup lang="ts">
    import AreaActionsPanel from './components/AreaActions.vue' 
    import CombatPanel from './components/CombatPanel.vue'
    import SoulUpgradePanel from './components/SoulUpgradePanel.vue'
    import OvermapPanel from './components/OvermapPanel.vue';
    import { Panels, Tab } from './enums/panels';
    import { usePlayer } from './stores/player';
    import { ref } from 'vue';
    const player = usePlayer();

    const name = "app";

    const activePanel = ref(Panels.WORLD);
    const activeTabWorld = ref(Tab.COMBAT);
    const activeTabSoul = ref(Tab.SOUL_UPGRADES);
    const combatUnlock = ref(true);
    const soulUnlock = ref(true);

    function showPanel (panel:Panels) {
        activePanel.value = panel;
    }

    function showTabWorld (tab:Tab) {
        activeTabWorld.value = tab;
    }

    function showTabSoul (tab:Tab) {
        activeTabSoul.value = tab;
    }

    
</script>