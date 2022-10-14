<script>
  import { fly } from 'svelte/transition'
  import Contestant from "./Contestant.svelte";

  export let winners;

  const placementEmojis = ['🥇', '🥈', '🥉'] 
</script>

<div class="podium">
  <h1 class="text-align-center">Winners</h1>
  <div 
    class={winners.length !== 3 ? 'flex--column' : 'winners'}
    in:fly="{{ y: 200, duration: 1500 }}"
  >
    {#each winners as {name, points, totalScore}, index}
      <div class="winner">
        <h3 class="text-align-center">
          {placementEmojis[index]}
        </h3>
        <Contestant
          name={name}
          points={totalScore}
          pointsToAdd={0}
          canChangePoints={false}
        />
      </div>
    {/each}
  </div>
</div>

<style>
  h1 {
    padding: var(--padding-small) 0;
  }

  h3 {
    font-size: 3.5em;
  }

  .winners {
    display: grid;
  }
  
  .podium{
    margin: auto;
  }

  /* 1st place */
  .winner:nth-child(1) {
    grid-column-start: 2;
  }

  /* 2nd place  */
  .winner:nth-child(2) {
    grid-column-start: 1;
    grid-row-start: 2;
  }

  /* 3rd place */
  .winner:nth-child(3) {
    grid-column-start: 3;
    grid-row-start: 2;
  }

  @media screen and (max-width: 1490px) {
    .winners {
      display: flex;
      flex-direction: column;
      padding-bottom: 30px;
    }
  }
</style>