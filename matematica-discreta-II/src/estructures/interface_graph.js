class Graph {
    // Configuración
    #directed;
    #weighted;
    #adjacency; // Map<vertex, Map<vertex, number|null>>

    constructor({ directed = false, weighted = false } = {}) { }

    // --- Vértices ---
    addVertex(vertex) { }        // agrega el vértice si no existe — devuelve this
    removeVertex(vertex) { }     // elimina el vértice y todas sus aristas — devuelve this
    hasVertex(vertex) { }        // boolean
    get vertices() { }           // array con todos los vértices

    // --- Aristas ---
    addEdge(from, to, weight = 1) { }   // agrega arista (y los vértices si no existen) — devuelve this
    removeEdge(from, to) { }            // devuelve this
    hasEdge(from, to) { }               // boolean
    getWeight(from, to) { }             // number | null
    get edges() { }                     // array de { from, to } o { from, to, weight }

    // --- Consultas ---
    neighbors(vertex) { }        // array de vértices adyacentes
    degree(vertex) { }           // cantidad de aristas del vértice
    // en dirigido: { in, out } — en no dirigido: número

    // --- Traversals ---
    bfs(start, callback) { }     // recorre en anchura, llama callback(vertex) en cada uno
    dfs(start, callback) { }     // recorre en profundidad, llama callback(vertex) en cada uno

    // --- Info ---
    get isDirected() { }
    get isWeighted() { }
    get order() { }              // cantidad de vértices
    get size() { }               // cantidad de aristas

    toString() { }
}