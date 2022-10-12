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
      <div class={showWinners ? 'hidden' : ''}>
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
      {#if showWinners}
        <button on:click={adminRemoveDisplayWinners}>Main menu</button>
      {:else}
        <button on:click={adminDisplayWinners}>Display winners</button>
      {/if}
      <button on:click={adminReset} class={showWinners ? 'hidden' : ''}>Reset round</button>
  {/if}
</nav>

<style>
  nav {
    display: flex;
    flex-direction: column;
    padding: 0 4em;
    justify-content: center;
    max-width: 340px;
  }

  nav > div {
    display: flex;
  }

  nav > div > button {
    margin-left: .4em;
    width: 100%;
  }

  .hidden {
    visibility: hidden;
  }

	@media screen and (max-width: 940px) {
    nav {
      padding: 0;
    }
	}
</style>