<script>
	import io from "socket.io-client";
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { tweened } from 'svelte/motion';
  import Menu from "./Menu.svelte";
  import User from "./User.svelte";
	import WinnerTable from "./WinnerTable.svelte"
	let name = "";
	let loggedIn = false;
	let started = false;
	let loginError = null;
	let isAdmin = false;
	let timeToStart;
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
	socket.on('display-main-menu', () => {
		console.log('Display main menu')
		if (loggedIn)
			showWinners = false;
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
	$: seconds = Math.floor($timeToStart)
</script>

<main>
	{#if !loggedIn}
		<img src="images/mpya-css-battle-logo.png"/>
	{/if}
	<div class="middle">
		{#if loggedIn}
			<Menu 
				showWinners={showWinners} 
				isAdmin={isAdmin}
			/>
		{/if}

		{#if loggedIn && started && !isAdmin}	
			{#key seconds}
				<h1 
					in:fly="{{delay: 0, duration: 300, x: -100, y: 0, opacity: 0, easing: quintOut}}"
					out:fly="{{delay: 0, duration: 300, x: 100, y: 0, opacity: 0, easing: quintOut}}"
				>
					{seconds}
				</h1>
			{/key}
		{:else if loggedIn}
			<div class="users"> 
				{#if showWinners}
					<WinnerTable 
						winners={winners}
					/>
				{:else}
					<h2>Contestants</h2>
					<div class="userGrid">
						{#each users as user}
							<User
								name={user.name}
								points={user.points}
								pointsToAdd={users.pointsToAdd}
								isAdmin={isAdmin}
							/>
						{/each}
					</div>
				{/if}
			</div>	
		{:else}
		<div class="login">
			<label>Username</label>
			<input 
				placeholder="Your username"
				bind:value={name}>
				{#if loginError}
					<span>{loginError}</span>
				{/if}
			<button on:click={submit} disabled={name.length <= 0}>Get Started</button>
		</div>
		{/if}
	</div>
	
	
</main>

<style global>
	main {
		text-align: center;
		height: 100%;
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
	label{
		text-align: left;
		padding: 0.5em 0;
	}
	.middle{
		height: 100%;
		width: 100%;
		display: flex;
		min-height: 140px;
	}
	.users{
		background: #E34586;
		width: 100%;
		padding: 40px;
	}
	.userGrid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(330px, 1fr));
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