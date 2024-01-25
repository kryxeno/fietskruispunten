<script>
	import { scaleLinear } from 'd3-scale';
	import { bisector } from 'd3-array';
	import TooltipPoint from './TooltipPoint.svelte';
	import TooltipLines from './TooltipLines.svelte';

	export let points = [];

	const padding = { top: 20, right: 15, bottom: 20, left: 25 };

	let width = 500;
	let height = 200;
	const desiredYTicksCount = 8;

	$: xScale = scaleLinear()
		.domain([minX, maxX])
		.range([padding.left, width - padding.right]);

	$: yScale = scaleLinear()
		.domain([Math.min.apply(null, yTicks), Math.max.apply(null, yTicks)])
		.range([height - padding.bottom, padding.top]);

	$: minX = points[0].uur;
	$: maxX = points[points.length - 1].uur;

	$: minY = Math.min.apply(
		null,
		points.map((p) => p.totaal_aantal_fietsers)
	);
	$: maxY = Math.max.apply(
		null,
		points.map((p) => p.totaal_aantal_fietsers)
	);

	$: xTicks = Array.from({ length: Math.ceil((maxX - minX) / 2) + 1 }, (_, i) => minX + i * 2);

	$: yTicks = Array.from({ length: desiredYTicksCount }, (_, i) =>
		Math.round(minY + i * ((maxY - minY) / (desiredYTicksCount - 1)))
	); // Generate desired number of ticks on the y-axis

	$: path = `M${points
		.map((p) => `${xScale(p.uur)},${yScale(p.totaal_aantal_fietsers)}`)
		.join('L')}`;
	$: area = `${path}L${xScale(maxX)},${yScale(0)}L${xScale(minX)},${yScale(0)}Z`;

	function formatMobile(tick) {
		return tick.toString().slice(-2);
	}

	// d3's bisector function
	var bisect = bisector((d) => d.uur).right;

	let m = { x: 0, y: 0 };
	let point = points[0];

	function handleMousemove(event) {
		m.x = event.offsetX;
		m.y = event.offsetY;

		// returns point to right of our current mouse position
		let i = bisect(points, xScale.invert(m.x));

		if (i < points.length) {
			point = points[i]; // update point
		}
	}

	// coords for vertical tooltip line
	let vline = {};
	$: vline.y1 = yScale(point.totaal_aantal_fietsers);
	$: vline.y2 = height - padding.bottom;
	$: vline.x1 = xScale(point.uur);
	$: vline.x2 = xScale(point.uur);

	let staticVline = {};
	$: staticVline.y1 = 0;
	$: staticVline.y2 = height - padding.bottom;
	$: staticVline.x1 = xScale(8);
	$: staticVline.x2 = xScale(8);
</script>

<div class="chart" bind:clientWidth={width} bind:clientHeight={height}>
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<svg on:mousemove={handleMousemove}>
		<defs>
			<linearGradient id="areaGradient" gradientTransform="rotate(90)">
				<stop offset={maxY > 200 ? '50%' : '10%'} stop-color="var(--color-2)" />
				<stop offset={maxY > 200 ? '85%' : '60%'} stop-color="var(--color-1)" />
				<stop offset="100%" stop-color="var(--color-0)" />
			</linearGradient>
		</defs>
		<!-- y axis -->
		<g class="axis y-axis" transform="translate(0, {padding.top});">
			{#each yTicks as tick}
				<g class="tick tick-{tick}" transform="translate(0, {yScale(tick)})">
					<line x2="100%"></line>
					<text y="-4">{tick}</text>
				</g>
			{/each}
		</g>

		<!-- x axis -->
		<g class="axis x-axis">
			{#each xTicks as tick}
				<g class="tick tick-{tick}" transform="translate({xScale(tick)},{height})">
					<text y="-2">{width > 380 ? tick : formatMobile(tick)}</text>
				</g>
			{/each}
		</g>

		<!-- data -->
		<path class="path-area" d={area}> </path>
		<path class="path-line" d={path}></path>

		<!-- Tooltip -->
		<TooltipLines {vline} value={point.totaal_aantal_fietsers} />
		<TooltipLines
			vline={staticVline}
			value={'Vertrek:' + ' ' + points[8].totaal_aantal_fietsers + ' ' + 'fietsers'}
		/>
		<TooltipPoint x={xScale(point.uur)} y={yScale(point.totaal_aantal_fietsers)} />
	</svg>
</div>

<style>
	.chart,
	svg {
		position: relative;
		width: 100%;
		height: 200px;
		overflow: visible;
	}

	.chart {
		margin: 0.5rem 0 0;
	}

	.tick {
		font-size: 0.725em;
		font-weight: 200;
	}

	.tick line {
		stroke: #aaa;
		stroke-dasharray: 2;
	}

	.tick text {
		fill: #666;
		text-anchor: start;
	}

	.tick.tick-0 line {
		stroke-dasharray: 0;
	}

	.x-axis .tick text {
		text-anchor: middle;
	}

	.path-line {
		fill: none;
		stroke: rgb(0, 100, 100);
		stroke-linejoin: round;
		stroke-linecap: round;
		stroke-width: 2;
	}

	.path-area {
		fill: url(#areaGradient);
	}
</style>
