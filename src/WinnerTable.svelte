<script>
  export let winners;
</script>

<div>
  <h1>Winners</h1>
  {#each winners as winner}
    <h3>{winner.name} - {winner.totalScore !== null ? `${winner.totalScore} points` : 'No points'}</h3>
  {/each}
</div>

<style>
  div {
    height: 100%;
  }

</style>