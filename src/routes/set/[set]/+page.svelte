<script>
	import { onMount } from 'svelte';
	import Header from '../../../lib/Header.svelte';

	export let data;

	// variables

	let setDetails = null;
	let cards = [];
	let filteredCards = [];
	let types = [];

	let display = 'both';

	let filters = {
		rarity: new Set(),
		color: new Set(),
		type: new Set(),
		cmc: new Set()
	};

	//set page favicon
	function setFavicon(svgUrl) {
		// Create a new link element for the favicon
		const link = document.createElement('link');
		link.rel = 'icon';
		link.type = 'image/svg+xml';
		link.href = svgUrl;

		// Remove any existing favicon elements
		const existingFavicons = document.querySelectorAll('link[rel="icon"]');
		existingFavicons.forEach((favicon) => favicon.remove());

		// Append the new link element to the document's head
		document.head.appendChild(link);
	}

	function capitalize(str) {
		return str.length === 0 ? str : str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
	}

	// fetch data

	onMount(async () => {
		const response = await fetch(`https://api.scryfall.com/sets/${data.set}`);
		setDetails = await response.json();

		// update page favicon and title
		document.title = `${setDetails.name} (${data.set.toUpperCase()})`;
		setFavicon(setDetails.icon_svg_uri);

		// Fetch all cards in the set
		const cardResponse = await fetch(`https://api.scryfall.com/cards/search?q=set:${data.set}`);
		const cardData = await cardResponse.json();
		cards = cardData.data;

		// Sort cards by their number
		cards.sort((a, b) => parseInt(a.collector_number) - parseInt(b.collector_number));

		// Initialize filtered cards with all cards
		filteredCards = [...cards];

		// Collect unique supertypes
		const supertypesSet = new Set();
		cards.forEach((card) => {
			const typeLine = card.type_line;
			const match = typeLine.match(/^\s*(.*?)\s*—/); // Match the supertype before the dash
			if (match) {
				const words = match[1].trim().split(/\s+/); // Split the supertype into individual words
				words.forEach((word) => supertypesSet.add(word)); // Add each word to the set
			}
		});
		types = Array.from(supertypesSet).sort();
	});

	// filters

	function filterByRarity(rarity) {
		if (filters.rarity.has(rarity)) {
			filters.rarity.delete(rarity);
		} else {
			filters.rarity.add(rarity);
		}
		filters = filters;
		applyFilters();
	}

	function filterByColor(color) {
		if (filters.color.has(color)) {
			filters.color.delete(color);
		} else {
			filters.color.add(color);
		}
		filters = filters;
		applyFilters();
	}

	function filterByType(type) {
		if (filters.type.has(type)) {
			filters.type.delete(type);
		} else {
			filters.type.add(type);
		}
		filters = filters;
		applyFilters();
	}

	function filterByCMC(cmc) {
		if (filters.cmc.has(cmc)) {
			filters.cmc.delete(cmc);
		} else {
			filters.cmc.add(cmc);
		}
		filters = filters;
		applyFilters();
	}

	function applyFilters() {
		filteredCards = cards.filter(
			(card) =>
				(filters.rarity.size === 0 || filters.rarity.has(card.rarity)) &&
				(filters.color.size === 0 || // No color filter selected
					(card.colors && card.colors.length === 0 && filters.color.has('C')) || // Card is explicitly colorless
					(card.colors &&
						card.colors.length > 1 &&
						filters.color.has('M') &&
						(filters.color.size === 1 ||
							Array.from(filters.color).every(
								(color) => card.colors.includes(color) || color === 'C' || color === 'M'
							))) || // Card is multicolor, and if specific colors chosen, at least those colors
					(card.colors &&
						card.colors.some((color) => filters.color.has(color)) &&
						!filters.color.has('M'))) && // Card has at least one selected color, and we avoid selecting mono if multi is selected
				(filters.type.size === 0 ||
					Array.from(filters.type).some((type) => card.type_line.includes(type))) &&
				(filters.cmc.size === 0 ||
					filters.cmc.has(card.cmc.toString()) ||
					(card.cmc >= 7 && filters.cmc.has('7+')))
		);
	}

	function resetFilters() {
		filters = {
			rarity: new Set(),
			color: new Set(),
			type: new Set(),
			cmc: new Set()
		};
		applyFilters();
	}
</script>

{#if setDetails}
	<img src={setDetails.icon_svg_uri} alt={setDetails.name} class="size-16 mx-auto bg-white mb-4" />
	<Header text="{setDetails.name} ({data.set.toUpperCase()})">
		<a href="/" class="inline-block btn-icon">
			<svg
				class="w-4 h-4"
				fill="none"
				stroke-width="1.5"
				stroke="currentColor"
				viewBox="0 0 24 24"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path d="M15.75 19.5 8.25 12l7.5-7.5"></path>
			</svg>
		</a>
	</Header>

	<div class="flex gap-4 flex-wrap justify-center mb-8">
		<p><span class="font-bold">{setDetails.card_count}</span> cards</p>
		<p>{capitalize(setDetails.set_type.split('_').join(' '))}</p>
		<p>{setDetails.released_at}</p>
	</div>

	<div class="flex gap-2 mb-4 items-center">
		<p class="font-bold">Rarity:</p>
		{#each ['common', 'uncommon', 'rare', 'mythic'] as rarity}
			<button
				class="btn-text"
				class:bg-indigo-300={filters.rarity.has(rarity)}
				on:click={() => filterByRarity(rarity)}
				>{capitalize(rarity)}
			</button>
		{/each}
	</div>
	<div class="flex gap-2 mb-4 items-center">
		<p class="font-bold">Color:</p>
		{#each [{ name: 'White', letter: 'W' }, { name: 'Blue', letter: 'U' }, { name: 'Black', letter: 'B' }, { name: 'Red', letter: 'R' }, { name: 'Green', letter: 'G' }, { name: 'Colorless', letter: 'C' }, { name: 'Multicolor', letter: 'M' }] as color}
			<button
				class="btn-text"
				class:bg-indigo-300={filters.color.has(color.letter)}
				on:click={() => filterByColor(color.letter)}>{color.name}</button
			>
		{/each}
	</div>
	<div class="flex gap-2 mb-4 items-center">
		<p class="font-bold">Type:</p>
		{#each types as type}
			<button
				class="btn-text"
				class:bg-indigo-300={filters.type.has(type)}
				on:click={() => filterByType(type)}
				>{type}
			</button>
		{/each}
	</div>
	<div class="flex gap-2 mb-4 items-center">
		<p class="font-bold">Mana cost:</p>
		{#each ['0', '1', '2', '3', '4', '5', '6', '7+'] as cmc}
			<button
				class="btn-text"
				class:bg-indigo-300={filters.cmc.has(cmc)}
				on:click={() => filterByCMC(cmc)}
				>{cmc}
			</button>
		{/each}
	</div>

	<button on:click={resetFilters} class="btn-text">Reset Filters</button>

	<!-- maybe todo: sort, options for image size, click to copy card name or open scryfall -->

	<div class="flex justify-between items-center gap-4 mt-8 mb-2">
		<h2 class="text-xl text-center">
			<span class="font-bold">{filteredCards.length}</span> cards
		</h2>
		<div class="flex gap-2">
			{#each ['picture', 'text', 'both'] as displayOption}
				<button class="btn-icon" on:click={() => (display = displayOption)}>
					<svg
						class="w-4 h-4"
						fill="none"
						stroke-width="1.5"
						stroke="currentColor"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d={displayOption === 'picture'
								? 'M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z'
								: displayOption === 'text'
									? 'm4 12h16m-16 4h16m-16 4h16m0-12h-16'
									: 'M6 4h12a2 2 0 010 4h-12a2 2 0 010-4zm0 6h12a2 2 0 010 4h-12a2 2 0 010-4zm0 6h12a2 2 0 010 4h-12a2 2 0 010-4z'}
						></path>
					</svg>
				</button>
			{/each}
		</div>
	</div>

	<div class="flex flex-wrap justify-center {display === 'picture' ? 'gap-1' : 'gap-4'}">
		{#each filteredCards as card}
			<div class="flex justify-between grow {display === 'text' ? 'w-full' : ''}">
				{#if display !== 'text'}
					<img
						src={card.image_uris?.normal}
						alt={card.name}
						class="w-60 rounded-md object-contain self-start"
					/>
				{/if}
				{#if display !== 'picture'}
					<div
						class={display === 'text' ? 'border border-gray-100 p-2 w-full' : 'border-y p-2 grow'}
					>
						<h3 class="text-lg font-bold">{card.name}</h3>
						<p class="text-sm">{card.mana_cost ?? ''}</p>
						<p class="text-sm">{card.type_line}</p>
						<p class="text-sm">{capitalize(card.rarity)}</p>
						<p class="mt-2">{@html card.oracle_text?.split('\n').join('<br>') ?? ''}</p>
					</div>
				{/if}
			</div>
		{/each}
	</div>
{:else}
	<div class="size-16 mb-4"></div>
	<h1 class="text-2xl text-center mb-4">{data.set.toUpperCase()}</h1>
	<p>Loading...</p>
{/if}
