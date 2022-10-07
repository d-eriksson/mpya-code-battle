<script>
	import io from "socket.io-client";
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { tweened } from 'svelte/motion';
	import Api from './service/api';
	let name = "";
	let loggedIn = false;
	let started = false;
	let loginError = null;
	let isAdmin = false;
	let timeToStart;
	let gameNumber = null;
	let users = [];
	let showWinners = false;
	let winners = [];
	const socket = io();
	socket.on('start', (data) => {
		started = true;
		timeToStart = tweened(data.secondsToStart);
		startCounter(`https://cssbattle.dev/play/${data.gameId}`);
		
	})
	socket.on('user-change', (data) => {
		if(socket.id == data.socketId){
			loggedIn = true;
		}
		console.log(data)
		users = data.userData;
	})
	socket.on('admin-users', (data) => {
		loggedIn = true;
		isAdmin = true;
		users = data;
	})
	socket.on('username-error', (message) => {
		loginError = message;
	})
	socket.on('reset', (data) => {
		if(!isAdmin){
			loggedIn = false;
		}
		started = false;
		name = "";
	})
	socket.on('display-winners', (data)=>{
		console.log(data);
		winners = data;
		showWinners = true;
	})
	function submit(){
		loginError = null;
		socket.emit('login', {name, socketId: socket.id});
	}
	function startCounter(url){
		var id = setInterval(() => {
			if ($timeToStart > 0) {
				$timeToStart--;
			}
			else{
				clearInterval(id);
				if(!isAdmin){
					window.location.href = url;
				}
				

			}
		}, 1000);
	}
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
	function adminAddPoints(user){
		console.log(user)
		Api.post('/results',{
			name: user.name,
			points: user.pointsToAdd
		})
	}
	function adminReset(){
		Api.get('/reset')
	}
	function adminDisplayWinners(){
		Api.get('/displayWinners')
	}
	$: seconds = Math.floor($timeToStart)
	

</script>

<main>
	<img src="images/mpya-css-battle-logo.png"/>
	<div class="middle">
		{#if showWinners}
			<h2>Winners</h2>
			{#each winners as winner}
				<h3>{winner.name} - {winner.totalScore !== null ? `${winner.totalScore} points` : 'No points'}</h3>
			{/each}

		{:else if started && !isAdmin}	
				{#key seconds}
					<h1 
						in:fly="{{delay: 0, duration: 300, x: -100, y: 0, opacity: 0, easing: quintOut}}"
						out:fly="{{delay: 0, duration: 300, x: 100, y: 0, opacity: 0, easing: quintOut}}"
					>
						{seconds}
					</h1>
				{/key}
		{:else if loggedIn}
			{#if isAdmin}
				<input placeholder="ex 99" bind:value={gameNumber} />
				<button on:click={adminStartGame}>Start game</button>
				<button on:click={adminReset}>Reset round</button>
				<button on:click={adminDisplayWinners}>Display winners</button>
			{/if}
			<h2>Contestants</h2>
			<div class="users"> 
				{#each users as user, index}
					<div class="user">
						<h3>{user.name}</h3>
						{#if user.points > 0}
							<p>Points: {user.points}</p>
						{/if}
						{#if isAdmin}
							<input placeholder="ex 99" bind:value={users[index].pointsToAdd} type="number" />
							<button on:click={() => adminAddPoints(user)}>Submit</button>
						{/if}
					</div>
				{/each}
			</div>	
		{:else}
			<label>Username</label>
			<input 
				placeholder="Your username"
				bind:value={name}>
				{#if loginError}
					<span>{loginError}</span>
				{/if}
			<button on:click={submit} disabled={name.length <= 0}>Get Started</button>
		{/if}
	</div>
	
	
</main>

<style global>
	main {
		text-align: center;
		padding: 1em;
		margin: 0 auto;
		background: white;
		color: white;
		min-height: calc(100vh - 2em);
	}
	h1{
		position:absolute;
		left:120px;
		right:120px;
	}
	input{
		display: block;
	}
	button{
		background: #00b2aa;
		color: white;
		border:none;
		border-radius: 0;
	}
	label{
		text-align: left;
		padding: 0.5em 0;
	}
	.middle{
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%,-50%);
		width: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		background: #E34586;
		padding: 32px 0;
		min-height: 140px;
	}
	.users{
		display:flex;
		width: 100%;
		justify-content: space-around;
		margin-top:24px;
	}
	h3{
		margin:0;
	}
	p{
		margin:0;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>