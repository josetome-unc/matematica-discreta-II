class Graph {
    #directed;
    #weighted;
    #adjacency; // Map<node, Map<node, weight|null>>

    constructor({ directed = false, weighted = false } = {}) {
        this.#directed = directed;
        this.#weighted = weighted;
        this.#adjacency = new Map();
    }

    // --- Nodos ---
    addNode(node) {
        if (!this.#adjacency.has(node)) {
            this.#adjacency.set(node, new Map());
        }
        return this;
    }

    removeNode(node) {
        this.#adjacency.delete(node);
        // Eliminar todas las aristas que apuntan a este nodo
        for (const neighbors of this.#adjacency.values()) {
            neighbors.delete(node);
        }
        return this;
    }

    hasNode(node) {
        return this.#adjacency.has(node);
    }

    get vertices() {
        return [...this.#adjacency.keys()];
    }

    // --- Aristas ---
    addEdge(from, to, weight = 1) {
        this.addNode(from);
        this.addNode(to);

        const w = this.#weighted ? weight : null;
        this.#adjacency.get(from).set(to, w);

        if (!this.#directed) {
            this.#adjacency.get(to).set(from, w);
        }
        return this;
    }

    removeEdge(from, to) {
        this.#adjacency.get(from)?.delete(to);
        if (!this.#directed) {
            this.#adjacency.get(to)?.delete(from);
        }
        return this;
    }

    hasEdge(from, to) {
        return this.#adjacency.get(from)?.has(to) ?? false;
    }

    getWeight(from, to) {
        return this.#adjacency.get(from)?.get(to) ?? null;
    }

    neighbors(node) {
        return [...(this.#adjacency.get(node)?.keys() ?? [])];
    }

    get edges() {
        const result = [];
        const seen = new Set();

        for (const [from, neighbors] of this.#adjacency) {
            for (const [to, weight] of neighbors) {
                const key = this.#directed
                    ? `${from}->${to}`
                    : [from, to].sort().join('<->');

                if (!seen.has(key)) {
                    seen.add(key);
                    result.push(this.#weighted ? { from, to, weight } : { from, to });
                }
            }
        }
        return result;
    }

    // --- Traversals ---
    bfs(start, visit) {
        const visited = new Set([start]);
        const queue = [start];

        while (queue.length) {
            const node = queue.shift();
            visit(node);
            for (const neighbor of this.neighbors(node)) {
                if (!visited.has(neighbor)) {
                    visited.add(neighbor);
                    queue.push(neighbor);
                }
            }
        }
    }

    dfs(start, visit, visited = new Set()) {
        if (visited.has(start)) return;
        visited.add(start);
        visit(start);
        for (const neighbor of this.neighbors(start)) {
            this.dfs(neighbor, visit, visited);
        }
    }

    // --- Info ---
    get isDirected() { return this.#directed; }
    get isWeighted() { return this.#weighted; }

    toString() {
        const lines = [];
        for (const [node, neighbors] of this.#adjacency) {
            const arrow = this.#directed ? '->' : '--';
            const conns = [...neighbors.entries()]
                .map(([n, w]) => this.#weighted ? `${n}(${w})` : n)
                .join(', ');
            lines.push(`${node} ${arrow} [${conns}]`);
        }
        return lines.join('\n');
    }
}