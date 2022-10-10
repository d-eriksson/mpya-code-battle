<script>
	import Api from './service/api';

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
</script>

<nav>
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
  <button on:click={adminReset}>Reset round</button>
  <button on:click={adminDisplayWinners}>Display winners</button>
</nav>

<style>
  nav {
    display: flex;
    flex-direction: column;
  }

  nav > div {
    display: flex;
  }
</style>