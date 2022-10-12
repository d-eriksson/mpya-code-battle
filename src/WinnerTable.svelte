<script>
  import { onMount } from 'svelte';
  import { fly } from 'svelte/transition'
  import User from "./User.svelte";

  export let winners;

  const placementIcon = ['🥇', '🥈', '🥉'] 
  let shouldStartAnimation = false

</script>

<div class="winners">
  <h1>Winners</h1>
  <div 
    class="winnerTable"
    in:fly="{{ y: 200, duration: 1500 }}"
  >
    {#each winners as winner, index}
      <div class="winner">
        <h3>
          {placementIcon[index]}
        </h3>
        <User
          name={winner.name}
          points={winner.points}
          pointsToAdd={winner.totalScore}
          canChangePoints={false}
        />
    </div>
    {/each}
  </div>
</div>

<style>
  h1 {
    padding: 20px 0;
  }

  h3 {
    font-size: 50px;
  }

  .winners {
    margin: auto;
  }
  
  .winnerTable {
    display: grid;
    grid-template-columns: repeat(3, auto);
    margin: auto;
  }

  .winner:nth-child(1) {
    grid-column-start: 2;
  }

  .winner:nth-child(2) {
    grid-column-start: 1;
    grid-row-start: 2;
  }

  .winner:nth-child(3) {
    grid-column-start: 3;
    grid-row-start: 2;
  }

  @media screen and (max-width: 1420px) {
    .winnerTable {
      display: flex;
      flex-direction: column;
    }
  }
</style>