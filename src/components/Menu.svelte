<script>
	import Api from '../service/api';

  export let showWinners;
  export let isAdmin;
	let gameNumber = null;

	function adminStartGame(){
    console.log("starting game")
		if(gameNumber){
			Api.get(`/start?gameId=${gameNumber}`)
				.then(function (response) {
					// handle success
					console.log(response);
          console.log("successfully started game")
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

  const hide = showWinners ? 'hidden' : ''
</script>

<nav class="width--full flex--column">
  <img src="images/mpya-css-battle-logo.png"/>
  {#if isAdmin}
      <div class={`start-game flex--row ${hide}`}>
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
      <button on:click={adminReset} class={hide}>Reset round</button>
  {/if}
</nav>

<style>
  nav {
    padding: 0 4em;
    justify-content: center;
    max-width: 340px;
  }

  .start-game input {
    width: 66%;
  }

  .start-game button {
    width: 33%;
    margin-left: .4em;
  }

	@media screen and (max-width: 940px) {
    nav {
      padding: 0;
    }
	}
</style>