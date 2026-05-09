import { Queue } from "./queue";
import { Stack } from "./stack";

export class Graph {

    #directed;
    #weighted;
    #adjacency; // Map<vertex, Map<vertex, number|null>>

    constructor({directed = false, weighted = false} = {}) {
        this.#directed = directed;
        this.#weighted = weighted;
        this.#adjacency = new Map()
    } 

    // --- Info ---
    get isDirected() { return this.#directed; }
    get isWeighted() { return this.#weighted; }
    get order() {return this.#adjacency.size}
    get size(){ 
        var count = 0;

        for(const neighbors of this.#adjacency.values()){
            count += neighbors.size
        }

        return this.#directed ? count : count / 2;
    }


    // -------- Vértices ----------
    // Agrega el vértice si no existe — devuelve this
    addVertex(vertex){
        
        if(!this.#adjacency.has(vertex)){
            this.#adjacency.set(vertex, new Map())
        }

        return this;
    }

    // Eliminar el vértice - devuelve this
    removeVertex(vertex){

        this.#adjacency.delete(vertex);

        // Eliminar todas las aristas que apuntan a este node
        for(const neighbors of this.#adjacency.values()){
            neighbors.delete(vertex)
        }

        return this;
    }

    // Verifica la existencia de un vértice - devuelve booleano
    hasVertex(vertex){
        return this.#adjacency.has(vertex)
    }

    // Devuelve todos los vertices del grafo - devuelve un array
    get vertices(){
        return [...this.#adjacency.keys()]
    }

    // Devuelve lista de vértices vecinos
    neighbors(vertex) {
        return [...this.#adjacency.get(vertex)?.keys() ?? []];
    }

    degree(vertex){
        return this.#adjacency.get(vertex).size;
    }

    // -------- Aristas ----------
    // Agrega arista - devuelve this
    addEdge(from, to, weight = 1){

        this.addVertex(from);
        this.addVertex(to);

        const w = this.#weighted ? weight : null;
        this.#adjacency.get(from).set(to, w)

        if(!this.#directed){
            this.#adjacency.get(to).set(from, w)
        }

        return this;
    }

    // Eliminar la arista - devuelve this
    removeEdge(from, to){

        this.#adjacency.get(from).delete(to);

        if(!this.#directed){
            this.#adjacency.get(to).delete(from);
        }

        return this

    }

    // Verifica la existencia de una arista
    hasEdge(from, to){
        return this.#adjacency.get(from)?.has(to) ?? false
    }

    // Devuelve el peso de la arista, si tiene.
    getWeight(from, to){
        return this.#adjacency.get(from)?.get(to) ?? null
    }

    // Devuelve lista de aristas
    get edges(){

        const result = [];
        const seen = new Set();

        for(const [from, neighbors] of this.#adjacency){

            for(const [to, weight] of neighbors){

                const key = this.#directed
                    ? `${from}->${to}`
                    : [from, to].sort().join('<->');


                if(!seen.has(key)){
                    seen.add(key);
                    result.push(this.#weighted ? { from, to, weight } : { from, to });
                }

            }

        }

        return result;

    }

    // Utils
    toString(){

        const lines = [];
        for(const [vertex, neighbors] of this.#adjacency){

            const arrow = this.#directed ? "->" : "--"

            const conns = [...neighbors.entries()]
                .map(([v, w]) => this.#weighted ? `${v}(${w})` : v)
                .join(", ")
            lines.push(`${vertex} ${arrow} [${conns}]`)
            
        }

        return lines.join("\n");

    }

    // Metódos de recorrida de grafos
    dfs(start, callback = (v) => console.log(v)){

        const vertices = new Stack()
        const edges = new Set();
        const visited = new Set([start])

        vertices.push(start)
        callback(start)

        while (!vertices.isEmpty()) {

            let vertex = vertices.peek();
            
            let found = false;              // Encontre algun vecino???

            for (const neighbor of this.neighbors(vertex)) {

                if (!visited.has(neighbor)) {

                    const edgeKey = this.#directed
                        ? `${vertex}->${neighbor}`
                        : [vertex, neighbor].sort().join('--');


                    visited.add(neighbor);
                    edges.add(edgeKey);
                    callback(neighbor);
                    vertices.push(neighbor);

                    found = true;
                    break;
                }


            }

            if (!found) {
                vertices.pop();              // no hay vecinos nuevos -> retrocedo
            }


        }

        return {
            vertices: [...visited],
            edges
        }

    }

    bfs(start, callback = (v) => console.log(v)) {

        const vertices = new Queue()
        const edges = new Set();
        const visited = new Set([start])

        vertices.enqueue(start)

        while (!vertices.isEmpty()) {

            let vertex = vertices.peek();
            callback(vertex);

            vertices.dequeue();

            for (const neighbor of this.neighbors(vertex)) {

                if (!visited.has(neighbor)) {

                    const edgeKey = this.#directed
                        ? `${vertex}->${neighbor}`
                        : [vertex, neighbor].sort().join('--');


                    visited.add(neighbor);
                    edges.add(edgeKey)
                    vertices.enqueue(neighbor);

                }
                

            } 
            
        }

        return {
            vertices: [...visited], 
            edges
        }

    }

    // Construir gra
    buildSpanningTree(vertices, edges) {
        const tree = new Graph({ directed: this.#directed, weighted: this.#weighted });

        for (const edge of edges) {
            // Las aristas las tengo como "A--B" o "A->B", hay que parsear

            const [from, to] = this.#directed
                ? edge.split('->')
                : edge.split('--')

            const weight = this.getWeight(from, to)

            tree.addEdge(from, to, weight)
        }

        return tree;

    }

    dfsTree(start) {
        return this.buildSpanningTree(...Object.values(this.dfs(start, () => { })));
    }

    bfsTree(start) {
        return this.buildSpanningTree(...Object.values(this.bfs(start, () => { })));
    }




    // Transforma nuestro grafo en un formato compatible para usar en Cytoscape para el dibujo del grafo
    toCytoscape(){

        const nodes = this.vertices.map(v => ({data: {id: v} }))
        const edges = this.edges.map(e => ({

            data: {
                id: `${e.from}-${e.to}`,
                source: e.from,
                target: e.to,
                ...(this.#weighted && {weight: e.weight})
            }
        }));
        return [...nodes, ...edges]
    }

} 