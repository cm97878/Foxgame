<template>
    <div class="window-border">
        <Transition name="cutscene">
            <CutsceneModal v-if="!!eventStore.activeScene"></CutsceneModal>
        </Transition>
        

        <div id="left_side_container" class="app_container">
            <div id="info_top_buttons_container">
                <button @click="showPanel(Panels.WORLD)" class="info_buttons">World</button>
                <button @click="showPanel(Panels.SOUL)" v-show="gameFlags.flagList.get(FlagEnum.STATUE_OBTAINED)" class="info_buttons">{{ gameFlags.flagList.get(FlagEnum.STATUE_INSPECTED) ? 'Soul' : '???' }}</button>
            </div>
            
            <div v-show="activePanel == Panels.WORLD">

                <!-- General nodes, anything not labeled as Special -->
                <div v-show="!(mapStore.selectedNode.data.areaSpecialID)">
                    <div class="tab_container">
                        <span :class="{ 'tab-selected': activeTabOverworld === Tab.INFO }" @click="showTabOverworld(Tab.INFO)" class="tab">
                            Info
                        </span>
                        <span :class="{ 'tab-selected': activeTabOverworld === Tab.COMBAT, 'in-combat': combatStore.activeCombat }" @click="showTabOverworld(Tab.COMBAT)" class="tab">
                            Combat
                        </span>
                        <span :class="{ 'tab-selected': activeTabOverworld === Tab.INVENTORY }" @click="showTabOverworld(Tab.INVENTORY)" class="tab">
                            Inventory
                        </span>
                    </div>
                </div>

                <div v-show="!(mapStore.selectedNode.data.areaSpecialID)" class="content-container">
                    <InfoPanel v-bind:active="activeTabOverworld" />
                    <CombatPanel v-bind:active="activeTabOverworld" />
                    <InventoryPanel v-bind:active="activeTabOverworld" />
                </div>


                <!-- Home node -->
                <div v-show="mapStore.selectedNode.data.areaSpecialID === SpecialAreaId.HOME">
                    <div class="tab_container">
                        <span :class="{ 'tab-selected': activeTabHome === Tab.OVERVIEW }" @click="showTabHome(Tab.OVERVIEW)" class="tab">
                            Home
                        </span>
                        <span :class="{ 'tab-selected': activeTabHome === Tab.INVENTORY }" @click="showTabHome(Tab.INVENTORY)" class="tab">
                            Upgrades
                        </span>
                        <span v-if="gameFlags.flagList.get(FlagEnum.EXPLORE_UNLOCKED)" :class="{ 'tab-selected': activeTabHome === Tab.EXPLORE }" @click="showTabHome(Tab.EXPLORE)" class="tab">
                            Explore
                        </span>
                    </div>
                    <div class="content-container">
                        <BasePanel v-bind:active="activeTabHome" />
                        <InventoryPanel v-bind:active="activeTabHome" />
                        <ExplorePanel v-bind:active="activeTabHome" />
                    </div>
                </div>

                <div v-show="mapStore.selectedNode.data.areaSpecialID === SpecialAreaId.CLEARING">
                    <InfoPanel v-bind:active="activeTabOverworld" />
                </div>
            </div>

            <div v-show="activePanel == Panels.SOUL">
                <div v-show="!gameFlags.flagList.get(FlagEnum.STATUE_INSPECTED)" class="content-container">
                    <div v-html="soulPanelIntroText"></div>
                    <button @click="inspectStatue()" class="info_buttons">Meditate?</button>
                </div>
                <div v-show="gameFlags.flagList.get(FlagEnum.STATUE_INSPECTED)"  class="tab_container">
                    <span :class="{ 'tab-selected': activeTabSoul === Tab.SOUL_UPGRADES }" @click="showTabSoul(Tab.SOUL_UPGRADES)" class="tab">
                        Soul Upgrades
                    </span>
                </div>
                <div v-show="gameFlags.flagList.get(FlagEnum.STATUE_INSPECTED)" class="content-container">
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
                <button @click="saves.save()" :disabled="combatStore.activeCombat">Save</button> 
                <button @click="saves.load(true)">Load</button>
                <button @click="player.addSoul(1000000000000000);">add max soul</button>
                <button @click="loadToggle">{{ toggleState === "1" ? "Using save slot" : "Not using saves" }}</button>
                <button @click="player.gameStage = GameStage.PRE_TAILS">Set gamestage intro->pre_tails</button>
                <button @click="player.payEnergy(-100)">Fill Energy</button>

            </div>
            {{ "number of tails: " + player.tails }}<br />{{ "max soul: " + player.getMaxSoul }}<br />{{ "areas scouted: " + mapStore.totalScouted }} <br /> {{ "kills: " + mapStore.totalKills }}
            <OvermapPanel />
        </div>
    </div>
</template>


<script setup lang="ts">
    import ExplorePanel from './components/ExplorePanel.vue' 
    import InventoryPanel from './components/InventoryPanel.vue' 
    import CombatPanel from './components/CombatPanel.vue'
    import SoulUpgradePanel from './components/SoulUpgradePanel.vue'
    import OvermapPanel from './components/OvermapPanel.vue';
    import CutsceneModal from './components/CutsceneModal.vue';
    import BasePanel from './components/BasePanel.vue';
    import InfoPanel from './components/InfoPanel.vue';
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
    import { SpecialAreaId, Zone } from './enums/areaEnums';
    import { useGameFlags } from './stores/gameFlags';
    import { FlagEnum } from "@/enums/flagEnum"

    const player = usePlayer();
    const saves = useSaveStore();
    const combatStore = useCombatStore();
    const gameTick = useGameTick();
    const eventStore = useEventStore();
    const mapStore = useMapStore();
    const gameFlags = useGameFlags();

    const activePanel = ref(Panels.WORLD);
    const activeTabOverworld = ref(Tab.COMBAT);
    const activeTabHome = ref(Tab.OVERVIEW);
    const activeTabSoul = ref(Tab.SOUL_UPGRADES);
    
    //TODO: This is messy and for testing, remove later
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

    const soulPanelIntroText = "[This is a placeholder appearance cause i cba to deal with css rn. This will probs look similar to the event popup, but just in the sidebar. Picture + text + button.]<br /><br />You feel drawn now, as back in the clearing, to the strange hunk of rock you spent all that time and energy to drag back - although, mercifully, that ache in your teeth, in your skull, has subsided. And that voice from before...<br /><br />There's something about this thing that relaxes you, puts you at peace despite the confusion. You feel like this could be a place to sit, to think, to calm and collect your thoughts. Perhaps to...<br />"


    function showPanel (panel:Panels) {
        activePanel.value = panel;
    }

    function showTabOverworld (tab:Tab) {
        activeTabOverworld.value = tab;
    }

    function showTabHome (tab:Tab) {
        console.log(tab);
        activeTabHome.value = tab;
    }

    function showTabSoul (tab:Tab) {
        activeTabSoul.value = tab;
    }

    function inspectStatue() {
        eventStore.callCutscene(eventStore.cutscenes.get("statueMeditate"));
    }



    onMounted(() =>{
        gameTick.startGameTick();
        if(!saves.load()) {
            eventStore.callCutscene(eventStore.cutscenes.get("intro"));
        }
    })
</script>
<style>
    .window-border {
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

    @media (max-width: 1300px) {
        .window-border {
            width: 100%;
            height: calc(100vh - 8px);
            margin: 0;
        }   
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