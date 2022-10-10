<script>
	import Api from './service/api';

  export let showWinners;
  export let isAdmin;
	let gameNumber = null;

	function adminStartGame(){
		if(gameNumber){
			Api.get(`/start?gameId=${gameNumber}`)
				.then(function (response) {
					// handle success
					console.log(response);
				})
				.catch(function (error) {
					// handle error
					console.log(error);
				})
		}
  }
	function adminReset(){
		Api.get('/reset')
	}
	function adminDisplayWinners(){
		Api.get('/displayWinners')
	}
	function adminRemoveDisplayWinners(){
		Api.get('/adminRemoveDisplayWinners')
	}
</script>

<nav>
  <img src="images/mpya-css-battle-logo.png"/>
  {#if isAdmin}
    {#if showWinners}
      <button on:click={adminRemoveDisplayWinners}>Main menu</button>
    {:else}
      <div>
        <input 
          placeholder="CSSBattle ID" 
          bind:value={gameNumber} 
        />
        <button 
          on:click={adminStartGame} 
          disabled={!gameNumber}
        >
          Start game
        </button>
      </div>
      <button on:click={adminDisplayWinners}>Display winners</button>
      <button on:click={adminReset}>Reset round</button>
    {/if}
  {/if}
</nav>

<style>
  nav {
    display: flex;
    flex-direction: column;
    padding: 0 7em;
    justify-content: center;
  }

  nav > div {
    display: flex;
  }

  nav > div > button {
    margin-left: .4em;
    width: 100%;
  }
</style>