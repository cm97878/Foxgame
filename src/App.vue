<template>
    <div id="vueWrapper">
        <div id="window_border">

            <div id="left_side_container" class="app_container">
                <div id="info_top_buttons_container">
                    <button @click="showPanel(Panels.WORLD)" v-show="combatUnlock" class="info_buttons">World</button>
                    <button @click="showPanel(Panels.SOUL)" v-show="soulUnlock" class="info_buttons">Soul</button>
                </div>
                
                <div v-show="activePanel == Panels.WORLD">
                    <div class="tab_container">
                        <span :class="{ selected: activeTab === Tab.COMBAT }" @click="showTab(Tab.COMBAT)" class="tab">
                            Combat
                        </span>
                        <span :class="{ selected: activeTab === Tab.AREA_ACTIONS }" @click="showTab(Tab.AREA_ACTIONS)" class="tab">
                            Area
                        </span>
                    </div>
                    <div class="content-container">
                        <CombatPanel v-bind:active="activeTab" />
                        <AreaActionsPanel v-bind:active="activeTab" />
                    </div>
                </div>

                <div v-show="activePanel == Panels.SOUL">
                    <div class="tab_container">
                        <span :class="{ selected: activeTab === Tab.SOUL_UPGRADES }" @click="showTab(Tab.SOUL_UPGRADES)" class="tab">
                            Soul Upgrades
                        </span>
                    </div>
                    <div class="content-container">
                        <SoulUpgradePanel v-bind:active="activeTab" />
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
    </div>
</template>


<script setup lang="ts">
import Decimal from 'break_infinity.js';
import AreaActionsPanel from './components/AreaActions.vue' 
import CombatPanel from './components/CombatPanel.vue'
import SoulUpgradePanel from './components/SoulUpgradePanel.vue'
import OvermapPanel from './components/OvermapPanel.vue';
import { Panels, Tab } from './enums/panels';
import { usePlayer } from './stores/player';
import { useMapStuff } from './stores/mapStuff';
import { ref, computed } from 'vue';
const player = usePlayer();

const name = "app";

const activePanel = ref(Panels.WORLD);
const activeTab = ref(Tab.COMBAT);
const combatUnlock = ref(true);
const soulUnlock = ref(true);

function showPanel (panel:Panels) {
    activePanel.value = panel;
    switch(panel) {
        case Panels.WORLD:
            activeTab.value = Tab.COMBAT;
            break;
        case Panels.SOUL:
            activeTab.value = Tab.SOUL_UPGRADES;
            break;
    }
}

function showTab (tab:Tab) {
    activeTab.value = tab;
}
</script>