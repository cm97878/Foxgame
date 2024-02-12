<template>
    <div class="info_hp_bar_outline">
        <div id="info_player_hp_bar_solid" class="hp_bar_background"></div>
        <div class="soul_orb"></div>
        <div class="soul_orb spent"></div>
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
    .soul_orb {
        background-image: radial-gradient(aqua,rgb(0,153,255));
        min-height:16px;
        min-width:16px;
        top:20px;
        position:absolute;
        z-index: 2;
        border-radius: 10px;
        border: solid rgb(0, 55, 92) 1px;
        margin-right: 90%
    }
    .spent {
        background-color: rgb(71,71,71) !important;
        margin-right: 75% !important;
    }
</style>