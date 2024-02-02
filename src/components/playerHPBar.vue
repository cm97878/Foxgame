<template>
    <div class="general_outline info_hp_bar_outline">
        <div id="info_player_hp_bar_solid" class="hp_bar_background"></div>
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
</style>