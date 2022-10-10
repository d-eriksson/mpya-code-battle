<script>
	import Api from './service/api';

  export let name 
  export let points
  export let pointsToAdd
  export let isAdmin

	const adminAddPoints = ({ name, points }) => {
		console.log(name, points)
		Api.post('/results', { name, points })
	}
</script>

<div>
  <div class="userHeader">
    <h3>{name}</h3>
    {#if points > 0}
      <p>({points} pt{points > 1 ? 's' : ''})</p>
    {/if}
  </div>
  {#if isAdmin}
    <div class="userPoints">
      <input 
        placeholder="Points" 
        bind:value={pointsToAdd}
        type="number"
      />
      <button 
        on:click={() => adminAddPoints({name, points: pointsToAdd})}
        disabled={!pointsToAdd}
      >
        Add
      </button>
    </div>
  {/if}
</div>

<style>
  div {
    width: 300px;
    display: flex;
    flex-direction: column;
    margin: auto;
  }
  
  .userHeader {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .userHeader h3 {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    max-width: 250px;
  }

  .userHeader p {
    min-width: 80px;
  }

  .userPoints {
    display: flex;
    flex-direction: row;
  }

  .userPoints > button {
    width: 100%;
  }
</style>