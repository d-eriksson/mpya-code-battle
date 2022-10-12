<script>
  import { fly } from 'svelte/transition'
	import Api from './service/api';

  export let name 
  export let points
  export let pointsToAdd
  export let canChangePoints

	const adminAddPoints = ({ name, points }) => {
		console.log(name, points)
		Api.post('/results', { name, points })
	}
</script>

<div class="userCard" in:fly="{{ y: 100, duration: 1000}}">
  <h3>{name}</h3>
  <p>{points || 0} point{points !== 1 ? 's' : ''}</p>
  {#if canChangePoints}
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
  .userCard {
    width: 300px;
    display: flex;
    flex-direction: column;
    margin: 10px auto;
    align-items: flex-start;

    background: #00B2AA;
    box-shadow: 0px 0px 5px 2px rgba(0, 0, 0, 0.25);
    padding: 10px;
    border-radius: 5px;
  }

  h3 {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    width: 100%;
  }

  .userPoints {
    display: flex;
    flex-direction: row;
    width: 100%;
  }

  .userPoints > button {
    width: 100%;
  }

  button {
    background: #E34586;
    box-shadow: 0px 2px 3px rgba(81, 26, 48, 0.5);
    margin-left: 10px;
  }

  h3, p {
    margin: 0.5em 0;
  }
</style>