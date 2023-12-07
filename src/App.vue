<template>
    <div id="window_border">
        <CutsceneModal v-if="cutsceneActive" :text="cutsceneText" :choices="choiceRef"  @choice="(choice) => cutsceneResponse(choice)"></CutsceneModal>

        <div id="left_side_container" class="app_container">
            <div id="info_top_buttons_container">
                <div>{{ resource }}</div>
                <button @click="showPanel(Panels.WORLD)" v-show="combatUnlock" class="info_buttons">World</button>
                <button @click="showPanel(Panels.SOUL)" v-show="soulUnlock" class="info_buttons">Soul</button>
                <button @click="callCutscene('You are a fox in a forest.', [{id: 1, label:'Okay!'}, {id:2, label:'Woo!'}])"  class="info_buttons">Cutscene</button>
            </div>
            
            <div v-show="activePanel == Panels.WORLD">
                <div class="tab_container">
                    <span :class="{ selected: activeTabWorld === Tab.COMBAT, 'in-combat': combatStore.activeCombat }" @click="showTabWorld(Tab.COMBAT)" class="tab">
                        Combat
                    </span>
                    <span :class="{ selected: activeTabWorld === Tab.AREA_ACTIONS }" @click="showTabWorld(Tab.AREA_ACTIONS)" class="tab">
                        Explore
                    </span>
                </div>
                <div class="content-container">
                    <CombatPanel v-bind:active="activeTabWorld" />
                    <ExplorePanel v-bind:active="activeTabWorld" />
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
                    {{ displayDecimal(player.getSoul) }}<br />
                    <span style="font-size: 16pt;">Soul</span>
                </div>
<!--                 <div id="soul_bead_counters_container">
                    0
                </div> -->
                <button 
                @click="player.addTail()"
                v-show="(player.tails.amount > 1 && player.tails.amount < 9) || (player.tails.amount === 1 && player.getSoul.eq(player.getMaxSoul))" 
                :disabled="player.getSoul.lt(player.getMaxSoul)">{{ !player.tails.obtained ? '???' : 'Gain Tail' }}</button>
            </div>
            <div class="options-box">
                <button @click="saves.save()">Save</button>
                <button @click="saves.load()">Load</button>
                <button @click="player.addSoul(1000000000000000);">add max soul</button>
            </div>
            {{ "number of tails: " + player.tails.amount }}<br />{{ "max soul: " + player.getMaxSoul }}
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
    import { Panels, Tab } from './enums/panels';
    import { usePlayer } from './stores/player';
    import { onMounted, ref, watch } from 'vue';
    import { useSaveStore } from './stores/saveStore';
    import { useCombatStore } from './stores/combatStore';
    import { useGameTick } from './stores/gameTick';
    import type { EventChoice }  from '@/types/areaEvent'
    import { storeToRefs } from 'pinia';
    import { displayDecimal } from '@/utils/utils';
    const player = usePlayer();
    const saves = useSaveStore();
    const combatStore = useCombatStore();
    const gameTick = useGameTick();

    const name = "app";

    const activePanel = ref(Panels.WORLD);
    const activeTabWorld = ref(Tab.COMBAT);
    const activeTabSoul = ref(Tab.SOUL_UPGRADES);
    const combatUnlock = ref(true);
    const soulUnlock = ref(true);
    const cutsceneActive = ref(false);
    const cutsceneText = ref("");
    const choiceRef = ref<EventChoice[]>([]);
    const resource = ref(0);

    const { tick$ } = storeToRefs(gameTick);

    watch(tick$, () => {
        console.log('tick!');
        resource.value = resource.value + 1;
    });


    function showPanel (panel:Panels) {
        activePanel.value = panel;
    }

    function showTabWorld (tab:Tab) {
        activeTabWorld.value = tab;
    }

    function showTabSoul (tab:Tab) {
        activeTabSoul.value = tab;
    }

    function callCutscene(description: string, choices:EventChoice[]): void {
        cutsceneText.value = description;
        choiceRef.value = choices
        cutsceneActive.value = true;
    }

    function cutsceneResponse(choice: number): void {
        //for now, cause non eligble choice to be 2.
        choice === 1 ? combatStore.pushToCombatLog("You chose number 1!") : combatStore.pushToCombatLog("You chose number 2!")
        cutsceneActive.value = false;
    }

    onMounted(() =>{
        gameTick.startGameTick();
        // saves.load();
    })
</script>
<style>
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
</style>