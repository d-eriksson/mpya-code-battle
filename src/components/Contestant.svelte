<script>
  import { fly } from 'svelte/transition'
	import Api from '../service/api';

  export let name 
  export let points
  export let pointsToAdd
  export let canChangePoints

	const adminAddPoints = ({ name, points }) => {
		console.log(name, points)
		Api.post('/results', { name, points })
	}

  const pointString = points === 1 ? "point" : "points"
</script>

<div 
  class="contestant flex--column" 
  in:fly="{{ y: 100, duration: 1000}}"
>
  <h3 class="truncate width--full">{name}</h3>
  <p>{points || 0} {pointString}</p>
  {#if canChangePoints}
    <div class="width--full flex--row">
      <input 
        placeholder="Points" 
        bind:value={pointsToAdd}
        type="number"
      />
      <button 
        class="width--full"
        on:click={() => adminAddPoints({name, points: pointsToAdd})}
        disabled={!pointsToAdd}
      >
        Add
      </button>
    </div>
  {/if}
</div>

<style>
  .contestant {
    width: 300px;
    margin: 20px auto;
    box-shadow: 0px 0px 5px 2px rgba(0, 0, 0, 0.25);

    padding: var(--padding-small);
    background: var(--mpya-turqoise);
    border-radius: var(--border-radius);
  }

  input {
    width: 75%;
  }

  button {
    width: 25%;
    background: var(--mpya-pink);
    box-shadow: 0px 2px 3px rgba(81, 26, 48, 0.5);
    margin-left: 0.5em;
  }

  h3, p {
    padding: var(--padding-small) 0;
  }

</style>