<template>
    <div class="info_hp_bar_outline">
        <div id="info_player_hp_bar_solid" class="hp_bar_background"></div>
        <div class="soul_orbs">
            <template v-for="orb in player.soulOrbs">
                <div v-if="!!orb" class="soul_orb full"></div>
                <div v-else class="soul_orb spent"></div>
            </template>
        </div>
        {{ displayDecimal(player.getHpCurr) + " / " + displayDecimal(player.getHpMax) }}
    </div>
</template>

<script setup lang="ts">
import { usePlayer } from '@/stores/player';
import { displayDecimal } from '@/utils/utils';
const player = usePlayer();

</script>

<style>
    #info_player_hp_bar_solid {
        width: v-bind("player.playerHpRatio")
    }
    .soul_orbs {
        position:absolute;
        display:flex;
        top:20px;
        z-index: 2;
        width:100%;
        gap: 4px;
        margin-left: 4px;
    }
    .soul_orb {  
        min-height:16px;
        min-width:16px;
        border-radius: 10px;
        border: solid rgb(0, 55, 92) 1px;
    }
    .full {
        background-image: radial-gradient(aqua,rgb(0,153,255));
    }
    .spent {
        background-color: rgb(71,71,71);
    }
</style>