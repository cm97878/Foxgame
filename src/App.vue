<template>
    <div id="window_border">
        <Transition name="cutscene">
            <CutsceneModal v-if="!!eventStore.activeScene"></CutsceneModal>
        </Transition>
        

        <div id="left_side_container" class="app_container">
            <div id="info_top_buttons_container">
                <button @click="showPanel(Panels.WORLD)" v-show="combatUnlock" class="info_buttons">World</button>
                <button @click="showPanel(Panels.SOUL)" v-show="soulUnlock" class="info_buttons">Soul</button>
                <!-- <button @click="eventStore.callCutscene(eventStore.cutscenes.get('intro'))"  class="info_buttons">Cutscene</button> -->
            </div>
            
            <div v-show="activePanel == Panels.WORLD">
                <div class="tab_container">
                    <span :class="{ 'tab-selected': activeTabWorld === Tab.COMBAT, 'in-combat': combatStore.activeCombat }" @click="showTabWorld(Tab.COMBAT)" class="tab">
                        Combat
                    </span>
                    <span :class="{ 'tab-selected': activeTabWorld === Tab.AREA_ACTIONS }" @click="showTabWorld(Tab.AREA_ACTIONS)" class="tab">
                        Explore
                    </span>
                    <span :class="{ 'tab-selected': activeTabWorld === Tab.HOME }" @click="showTabWorld(Tab.HOME)" class="tab">
                        Home
                    </span>
                </div>
                <div class="content-container">
                    <CombatPanel v-bind:active="activeTabWorld" />
                    <ExplorePanel v-bind:active="activeTabWorld" />
                    <BasePanel v-bind:active="activeTabWorld" />
                </div>
            </div>

            <div v-show="activePanel == Panels.SOUL">
                <div class="tab_container">
                    <span :class="{ 'tab-selected': activeTabSoul === Tab.SOUL_UPGRADES }" @click="showTabSoul(Tab.SOUL_UPGRADES)" class="tab">
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
                    <div v-if="player.gameStage === GameStage.INTRO">
                        {{ displayDecimal(player.getFood) }}<br />
                        <span style="font-size: 16pt;">Meat</span>
                    </div>
                    <div v-else>
                        {{ displayDecimal(player.getSoul) }}<br />
                        <span style="font-size: 16pt;">Soul</span>
                    </div>
                </div>
<!--                 <div id="soul_bead_counters_container">
                    0
                </div> -->
                <button 
                @click="player.addTail()"
                v-show="(player.tails > 1 && player.tails < 9) || (player.tails === 1 && player.getSoul.eq(player.getMaxSoul))" 
                :disabled="player.getSoul.lt(player.getMaxSoul)">{{ player.furthestStage <= GameStage.PRE_TAILS ? '???' : 'Gain Tail' }}</button>
            </div>

            <div class="options-box">
                <button @click="saves.save()">Save</button>
                <button @click="saves.load()">Load</button>
                <button @click="player.addSoul(1000000000000000);">add max soul</button>
                <button @click="loadToggle">{{ toggleState === "1" ? "Using save slot" : "Not using saves" }}</button>
                <button @click="player.gameStage = GameStage.PRE_TAILS">Set gamestage intro->pre_tails</button>
                <button @click="mapStore.callRandomEncounter(Zone.FOREST)">Fight Enemy</button>
            </div>
            {{ "number of tails: " + player.tails }}<br />{{ "max soul: " + player.getMaxSoul }}<br />{{ "areas scouted: " + player.totalScouted }} <br /> {{ "kills: " + player.totalKills }}
            <OvermapPanel />
        </div>
    </div>
</template>


<script setup lang="ts">
    import ExplorePanel from './components/ExplorePanel.vue' 
    import CombatPanel from './components/CombatPanel.vue'
    import SoulUpgradePanel from './components/SoulUpgradePanel.vue'
    import OvermapPanel from './components/OvermapPanel.vue';
    import CutsceneModal from './components/CutsceneModal.vue';
    import BasePanel from './components/BasePanel.vue';
    import { Panels, Tab } from './enums/panels';
    import { usePlayer } from './stores/player';
    import { onMounted, ref } from 'vue';
    import { useSaveStore } from './stores/saveStore';
    import { useCombatStore } from './stores/combatStore';
    import { GameStage } from './enums/gameStage';
    import { useGameTick } from './stores/gameTick';
    import { displayDecimal } from '@/utils/utils';
    import { useEventStore } from './stores/eventStore'
    import { useMapStore } from './stores/mapStore';
    import { Zone } from './enums/areaEnums';

    const player = usePlayer();
    const saves = useSaveStore();
    const combatStore = useCombatStore();
    const gameTick = useGameTick();
    const eventStore = useEventStore();
    const mapStore = useMapStore();

    const name = "app";

    const activePanel = ref(Panels.WORLD);
    const activeTabWorld = ref(Tab.COMBAT);
    const activeTabSoul = ref(Tab.SOUL_UPGRADES);
    const combatUnlock = ref(true);
    const soulUnlock = ref(true);


    
    //FIXME: This is messy and for testing, remove later
    const toggleState = ref("");
    toggleState.value = localStorage.getItem('kitsune_save_bool') ?? "1"
    
    function loadToggle() {
        if(localStorage.getItem('kitsune_save_bool') === "1"){
            localStorage.setItem('kitsune_save_bool', "0");
        }
        else localStorage.setItem('kitsune_save_bool', "1");
        console.log(localStorage.getItem('kitsune_save_bool'))
        toggleState.value = localStorage.getItem('kitsune_save_bool') ?? "1";
    }



    function showPanel (panel:Panels) {
        activePanel.value = panel;
    }

    function showTabWorld (tab:Tab) {
        activeTabWorld.value = tab;
    }

    function showTabSoul (tab:Tab) {
        activeTabSoul.value = tab;
    }



    onMounted(() =>{
        gameTick.startGameTick();
        if(!saves.load()) {
            eventStore.callCutscene(eventStore.cutscenes.get("intro"));
        }
    })
</script>
<style>
    #window_border {
        width: 95vw;
        height: 95vh;
        align-items: stretch;
        margin: 6px;
        display: flex;
        background-image: linear-gradient(rgb(53, 53, 53), rgb(25, 25, 25));
        border: 4px ridge rgb(179, 11, 11);
        font-family: 'NameHere'; 
        font-size: 20px;
    }

    .app_container {
        display: flex;
        flex-direction: column;
        padding: 10px;
        min-width: 480px;
        min-height: 480px;
        width: 50%;
    }

    #left_side_container {
        border-right: 4px solid rgb(179, 11, 11);
    }

    #info_top_buttons_container {
        height: 48px;
        min-height: 48px;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
    }

    .info_buttons {
        height: 30px;
        width: 120px;
        padding-left: 10px;
        padding-right: 10px;
        margin: 0 5px;
    }

    .info_buttons:hover {
        background-color: rgb(0, 140, 255);
        color: rgb(12, 12, 12);
    }

    .in-combat {
        color:red;
    }

    .options-box {
        display: flex;
        justify-content: center;
        button {
            padding: 4px 10px;
            margin: 0 4px;
        }
    }

    .cutscene-enter-active,
    .cutscene-leave-active {
        transition: all 0.4s ease;
    }

    .cutscene-enter-from,
    .cutscene-leave-to {
        opacity: 0;
    }

    .tab-selected {
        color: gold !important;
        background:grey;
    }

    .content-container {
        margin: 10px;
    }
</style>