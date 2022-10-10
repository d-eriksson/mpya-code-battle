<script>
  export let winners;
</script>

<div>
  <h2>Winners</h2>
  {#each winners as winner}
    <h3>{winner.name} - {winner.totalScore !== null ? `${winner.totalScore} points` : 'No points'}</h3>
  {/each}
</div>

<style>

</style>