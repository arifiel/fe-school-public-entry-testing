function Graph(outer_directed) {
	this.adjList = {};
	this.directed = outer_directed;
}

Graph.prototype.addVertex = function(vertex) {
	this.adjList[vertex] = {};
}

Graph.prototype.addEdge = function(vertex1, vertex2, weight) {
	if(!(vertex1 in this.adjList)) {
		console.log("no vertex " + vertex1);
		return;
	}
	if(!(vertex2 in this.adjList)) {
	console.log("no vertex " + vertex2);
	return;
	}
	if(weight == 0) {
		console.log("weight is 0");
		return;
	}
	this.adjList[vertex1][vertex2] = weight;
	if(this.directed) {
		this.adjList[vertex2][vertex1] = weight;
	}
}

Graph.prototype.removeVertex = function(vertex) {
	if(!(vertex in this.adjList)) {
		console.log("no vertex " + vertex);
		return;
	}
	for (var key in this.adjList) {
		delete this.adjList[key][vertex];
	}
	delete this.adjList[vertex];
}

Graph.prototype.removeEdge = function(vertex1, vertex2) {
	if(!(vertex1 in this.adjList)) {
		console.log("no vertex " + vertex1);
		return;
	}
	if(!(vertex2 in this.adjList)) {
		console.log("no vertex " + vertex2);
		return;
	}
	delete this.adjList[vertex1][vertex2];
	if(this.directed) {
		delete this.adjList[vertex2][vertex1];
	}
}

Graph.prototype.getVertexList = function() {
	return Object.keys(this.adjList);
}

// TODO: Format of edge list is undefined, so...
Graph.prototype.getEdges = function() {
	return this.adjList;
}

Graph.prototype.getNeighbours = function(vertex) {
	if(!(vertex in this.adjList)) {
		console.log("no vertex " + vertex);
		return;
	}
	return Object.keys(this.adjList[vertex]);
}

Graph.prototype.flip = function() {
	if(this.directed) {
		return;
	}
	temp = {};
	for (var vertex in this.adjList) {
		temp[vertex] = {};
	}
	for (var vertex1 in this.adjList) {
		for (var vertex2 in this.adjList[vertex1]) {
			temp[vertex2][vertex1] = this.adjList[vertex1][vertex2];
		}
	}
	Object.assign(this.adjList, temp);
}

Graph.prototype.getAdjacencyMatrix = function() {
	matrix = [];
	for(i = 0; i < Object.keys(this.adjList).length; i++) {
		matrix[i] = [];
		for(j = 0; j < Object.keys(this.adjList).length; j++) {
			vert1 = Object.keys(this.adjList)[i];
			vert2 = Object.keys(this.adjList)[j];
			weight = this.adjList[vert1][vert2];
			if(weight) {
				matrix[i][j] = weight;
			} else {
				matrix[i][j] = 0;
			}
		}
	}
	return matrix;
}

Graph.prototype.getEdgeWeight = function(vertex1, vertex2) {
	if(!(vertex1 in this.adjList)) {
		console.log("no vertex " + vertex1);
		return;
	}
	if(!(vertex2 in this.adjList)) {
		console.log("no vertex " + vertex2);
		return;
	}
	weight = this.adjList[vertex1][vertex2];
	if(weight) {
		return weight;
	} else {
		return 0;
	}
}

Graph.prototype.getSubGraph = function(vertexList) {
	sourceAdjList = this.adjList;
	var hasAllKeys = vertexList.every(function(item){
		return sourceAdjList.hasOwnProperty(item);
	});
	if(!hasAllKeys) {
		console.log("Some keys are missing");
		return undefined;
	}
	graph = new Graph(this.directed);
	vertexList.forEach(function(item) {
		graph.adjList[item] = {};
		vertexList.forEach(function(item2) {
			if(sourceAdjList[item][item2]) {
				graph.adjList[item][item2] = sourceAdjList[item][item2];
			}
		});
	});
	return graph;
}

Graph.prototype.getShortestPath = function(vertex1, vertex2) {
	if(!(vertex1 in this.adjList)) {
		console.log("no vertex " + vertex1);
		return "no vertex " + vertex1;
	}
	if(!(vertex2 in this.adjList)) {
		console.log("no vertex " + vertex2);
		return "no vertex " + vertex2;
	}
	visitedNodes = [vertex1];
	unvisitedNodes = Object.keys(this.adjList[vertex1]);
	paths = {};
	adjList = this.adjList;
	paths[vertex1] = {path: [vertex1],
										weight: 0};
	while (unvisitedNodes.length > 0 && !visitedNodes.includes(vertex2)) {
		fromVisited = visitedNodes[0];
		toUnvisited = unvisitedNodes[0]
		// fetch min
		visitedNodes.forEach(function(visitedVertex) {
			unvisitedNodes.forEach(function(unvisitedVertex) {
				if(!(adjList[fromVisited][toUnvisited]) && adjList[visitedVertex][unvisitedVertex]) {
					fromVisited = visitedVertex;
					toUnvisited = unvisitedVertex;
				} else if(adjList[visitedVertex][unvisitedVertex]) {
					if(adjList[visitedVertex][unvisitedVertex] < adjList[fromVisited][toUnvisited]) {
						fromVisited = visitedVertex;
						toUnvisited = unvisitedVertex;
					}
				}
			});
		});
		// create path
		if(adjList[fromVisited][toUnvisited]) {
			paths[toUnvisited] = {path: paths[fromVisited].path.concat(toUnvisited),
														weight: paths[fromVisited].weight + adjList[fromVisited][toUnvisited]};
			// extend unvisited list
			Object.keys(this.adjList[toUnvisited]).forEach(function(newUnvisitedVertex) {
			 // of Vertex not present in visited list
				if(visitedNodes.indexOf(newUnvisitedVertex) < 0 && unvisitedNodes.indexOf(newUnvisitedVertex) < 0) {
					unvisitedNodes.push(newUnvisitedVertex);
				 }
			});
		}
		// add to visited
		visitedNodes.push(toUnvisited);
		// remove item from unvisitedNodes
		var index = unvisitedNodes.indexOf(toUnvisited);
		if (index > -1) {
			unvisitedNodes.splice(index, 1);
		}
	}
	
	if(paths[vertex2]) {
		return paths[vertex2];
	}
	return "no path";
}

// --------------------

const graph1 = new Graph();
graph1.addVertex(1);
graph1.addVertex("A");
graph1.addVertex("B");
graph1.addVertex("C");
graph1.addVertex("X");
graph1.addVertex("Y");
graph1.addVertex("Z");
graph1.addEdge(1, "A", 2);
graph1.addEdge("A", "B", 2);
graph1.addEdge("A", "C", 3);
graph1.addEdge("B", "C", 4);
graph1.addEdge("C", "X", 4);
graph1.addEdge("Y", "Z", 2);
graph1.addEdge("Y", "PPP", 2);
graph1.addEdge("QQQ", "PPP", 2);
graph1.removeVertex("Z");

graph1.removeEdge("C", "X");

//console.log(graph1.getVertexList());
console.log(graph1.getEdges());
//console.log(graph1.getNeighbours("A"));

graph1.flip();

console.log(graph1.getEdges());
//console.log(graph1.getAdjacencyMatrix());
//console.log(graph1.getEdgeWeight("A", "B"));
//console.log(graph1.getEdgeWeight("C", "B"));

const graphS = graph1.getSubGraph(["A", "B", "C"]);
//console.log(graphS.getEdges());

console.log(graph1.getShortestPath("C", "A"));
console.log(graph1.getShortestPath("C", 1));
console.log(graph1.getShortestPath("C", "Y"));

const graph2 = new Graph(true);
graph2.addVertex("A");
graph2.addVertex("B");
graph2.addVertex("Y");
graph2.addVertex("Z");
graph2.addEdge("A", "B", 2);
graph2.addEdge("Y", "Z", 2);

//console.log(graph2.getVertexList());
//console.log(graph2.getEdges());
//console.log(graph2.getNeighbours("A"));1
const graph3 = new Graph(true);
graph3.addVertex(1);
graph3.addVertex(2);
graph3.addVertex(3);
graph3.addVertex(4);
graph3.addVertex(5);
graph3.addVertex(6);
graph3.addEdge(1, 2, 7);
graph3.addEdge(1, 3, 9);
graph3.addEdge(1, 6, 14);
graph3.addEdge(2, 3, 10);
graph3.addEdge(2, 4, 15);
graph3.addEdge(3, 4, 11);
graph3.addEdge(3, 6, 2);
graph3.addEdge(4, 5, 6);
graph3.addEdge(4, 6, 9);
console.log(graph3.getShortestPath("1", "5"));