<template>
    <div id="vueWrapper">
        <div id="window_border" class="general_outline">




            <div id="left_side_container">
                <div id="info_top_buttons_container">
                    <button @click="showPanel(Panels.COMBAT)" v-show="combatUnlock" class="info_buttons">Combat</button>
                    <button @click="showPanel(Panels.SOUL_UPGRADES)" v-show="soulUnlock" class="info_buttons">Soul</button>
                </div>
                <CombatPanel v-bind:active="leftMainPanelActive" />
                <SoulUpgradePanel v-bind:active="leftMainPanelActive" />
            </div>




            <div id="right_side_container">
                <div id="currency_section">
                    <div id="soul_counter_container">
                        {{ player.currencies.soul.toNumber() }}<br />
                        <span style="font-size: 16pt;">Soul</span>
                    </div>
                    <div id="soul_bead_counters_container">
                        0
                    </div>
                    <div id="currency_empty_space_filler">
                    
                    </div>
                </div>

                <div id="map_section">
                    <div id="map_description">

                    </div>
                    <div id="map_network">

                    </div>
                </div>
            </div>




        </div>
    </div>
</template>


<script setup lang="ts">
import Decimal from 'break_infinity.js';
import CombatPanel from './components/CombatPanel.vue'
import SoulUpgradePanel from './components/SoulUpgradePanel.vue'
import { Panels } from './enums/panels';
import { usePlayer } from './stores/player';
import { ref, computed } from 'vue';
const player = usePlayer();

const name = "app";

const leftMainPanelActive = ref(Panels.COMBAT);
const combatUnlock = ref(true);
const soulUnlock = ref(true);

function showPanel (panel:Panels) {
    leftMainPanelActive.value = panel;
}
</script>