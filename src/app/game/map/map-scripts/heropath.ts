/* eslint-disable @typescript-eslint/naming-convention */

import { World } from './world';

export class HeroPath
{
  from_x;
  from_y;
  to_x;
  to_y;
  min_x;
  min_y;
  max_x;
  max_y;
  graph;
  current_node_position;
  neighbours;
  search_radius;
  search_margin;
  path;
  steps;

  finish_position;
  start_position;

  private world: World;

	constructor(world, from_x, from_y, to_x, to_y){
    this.world = world;
		this.from_x = from_x;
		this.from_y = from_y;
		this.to_x = to_x;
		this.to_y = to_y;
		this.min_x = null;
		this.min_y = null;
		this.max_x = null;
		this.max_y = null;
		this.graph = new Object();
		this.current_node_position = null;
		this.neighbours = new Object();
		this.search_radius = 7;
		this.search_margin = 3;
		this.path = new Array();
		this.steps = new Array();

		this.finish_position = this.to_x + this.to_y * 200;
		this.start_position = this.from_x + this.from_y * 200;
	}

	findSteps(){
		this.findGraphBoundaries();
		this.buildGraph();
		this.findPath();
		this.convertPathToSteps();

		return this.steps;
	}

	findGraphBoundaries(){
		if(this.to_x >= this.from_x){ // going East
			this.min_x = this.from_x - this.search_margin;
			this.max_x = this.to_x + this.search_margin;
		}
		else{ // going West
			this.min_x = this.to_x - this.search_margin;
			this.max_x = this.from_x + this.search_margin;
		}

		if(this.to_y >= this.from_y){ // going South
			this.min_y = this.from_y - this.search_margin;
			this.max_y = this.to_y + this.search_margin;
		}
		else{ // going North
			this.min_y = this.to_y - this.search_margin;
			this.max_y = this.from_y + this.search_margin;
		}

		// this.min_x = this.from_x - this.search_radius;
		// this.min_y = this.from_y - this.search_radius;
		// this.max_x = this.from_x + this.search_radius;
		// this.max_y = this.from_y + this.search_radius;
	}

	buildGraph(){
		for (let y = this.min_y; y <= this.max_y; y++){
			for (let x = this.min_x; x <= this.max_x; x++){
				this.current_node_position = x + y*200;

				this.neighbours = new Object();

				if (this.world.pole[this.current_node_position*3] === 'w'
					|| this.world.pole[this.current_node_position*3] === 'g'
					//|| this.world.pole[this.current_node_position*3] === 'm'
					|| this.world.pole[this.current_node_position*3] === '8'
					)
				{
					continue;
				}

				if (this.current_node_position === this.finish_position)
				{
					Object.assign(this.graph, {finish: this.neighbours});
					continue; // skip the rest as we don't need neighbours for 'finish'
				}

				if (x !== this.max_x) // East
				{
					this.addNeighbourIfValid(1);
				}
				if (x !== this.min_x) // West
				{
					this.addNeighbourIfValid(-1);
				}
				if (y !== this.max_y) // South
				{
					this.addNeighbourIfValid(200);
				}
				if (y !== this.min_y) // North
				{
					this.addNeighbourIfValid(-200);
				}


				if (this.current_node_position === this.start_position)
				{
					Object.assign(this.graph, {start: this.neighbours});
				}
				else
				{
					Object.assign(this.graph, {[this.current_node_position]: this.neighbours});
				}
			}
		}

		//console.log(this.graph);
	}

	addNeighbourIfValid(offset)
	{
		const adjacent_node_position = this.current_node_position + offset;

		if (this.world.pole[adjacent_node_position*3] !== 'w'
			&& this.world.pole[adjacent_node_position*3] !== 'g'
			//&& this.world.pole[adjacent_node_position*3] !== 'm'
			&& this.world.pole[adjacent_node_position*3] !== '8'
			)
		{
			let key = adjacent_node_position;
			if (adjacent_node_position === this.finish_position)
			{
				key = 'finish';
			}
			const weight = this.getEdgeWeight(this.current_node_position, adjacent_node_position);
			Object.assign(this.neighbours, {[key]: weight});
		}
	}

	getEdgeWeight(current_node_position, adjacent_node_position)
	{
		return this.getNodeWeight(current_node_position) + this.getNodeWeight(adjacent_node_position);
		//return this.getNodeWeight(adjacent_node_position);
	}

	getNodeWeight(node_position)
	{
		switch(this.world.pole[node_position*3])
		{
			case 'd':               // droga
				return 1;
			case 'p':
			case 'm':				// brama miasta
				return 3;
			case 'l':
				return 4;
			case 'n':
			case 'r':
				return 5;
			case 'b':
				return 7;
			case '6':               // pustynia
				return 7;
			case 'w':
			case 'g':
			case '8':               // mury
				// can't go
				return 100;
			default:
				return 3;
		}
	}

	findPath(){
		this.path = dijkstra(this.graph);
    this.path.path.unshift('start');
	}

	convertPathToSteps(){
		const steps = [];

		for (const [step, value] of this.path.path.entries())
		{
			let posi = this.path.path[step];
			let prev_posi = this.path.path[step-1];
			if (posi === 'start')
			{
				continue;
			}

			if (posi === 'finish')
			{
				posi = this.finish_position;
			}

			if (prev_posi === 'start')
			{
				prev_posi = this.start_position;
			}

			steps.push(posi - prev_posi);

			// possible elements:
	 		// this.steps.push(1); // right
			// this.steps.push(-1); // left
			// this.steps.push(200); // down
			// this.steps.push(-200); // up
		}

		this.steps = steps;
	}

}

const findLowestWeightNode = (weights, processed) => {
  const knownNodes = Object.keys(weights);

  const lowestWeightNode = knownNodes.reduce((lowest, node) => {
    if (lowest === null && !processed.includes(node)) {
      lowest = node;
    }
    if (weights[node] < weights[lowest] && !processed.includes(node)) {
      lowest = node;
    }
    return lowest;
  }, null);

  return lowestWeightNode;
};

const dijkstra = (graph) => {

  // track lowest cost to reach each node
  const weights = Object.assign({finish: Infinity}, graph.start);

  // track paths
  const parents = {finish: null};

  for (const [key, child] of Object.entries(graph.start)){
    const index = child.toString();
    parents[index] = 'start';
  }

  // track nodes that have already been processed
  const processed = [];
  //Next, we’ll set the initial value of the node being processed
  //using the lowestCostNode function. Then, we’ll begin a while loop,
  //which will continuously look for the cheapest node.
  let node = findLowestWeightNode(weights, processed);

  while (node) {
    //Get the weight of the current node
    const weight = weights[node];
    //Get all the neighbors of current node
    const children = graph[node];
    //Loop through each of the children, and calculate the weight to reach that child node.
    // We'll update the weight of that node in the weights object if it is lowest or the ONLY weight available

    if (
      typeof children !== 'undefined' // HERE !!!
      && children !== null
    )
    {
      for (const [key, n] of Object.entries(children)){
        const n2 = key.toString();
        const newWeight = weight + children[n2];
        if (!weights[n2] || weights[n2] > newWeight) {
            weights[n2] = newWeight;
            parents[n2] = node;
          }
      }
    }
    //push processed data into its data structure
    processed.push(node);
    // repeat until we processed all of our nodes.
    node = findLowestWeightNode(weights, processed);
  }

  const optimalPath = ['finish'];
  let parent = parents.finish;
  while (parent) {
    optimalPath.unshift(parent);
    parent = parents[parent]; // add parent to start of path array
  }

  const results = {
    distance: weights.finish,
    path: optimalPath
  };

  return results;
};
