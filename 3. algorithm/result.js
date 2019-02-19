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
