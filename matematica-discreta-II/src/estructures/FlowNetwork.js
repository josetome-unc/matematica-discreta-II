import { Queue } from "./queue";

export class FlowNetwork{

    #capacity;      // Map<vertex, Map<vertex, number>>
    #flow;          // Map<vertex, Map<vertex, number>>
    #vertices;      // Set<vertex>

    constructor(){
        this.#capacity = new Map();
        this.#flow = new Map();
        this.#vertices = new Set()
    }

    // inicializa las entradas del Map para un vertice si no existen
    #initVertex(v) {
        if (!this.#capacity.has(v)) this.#capacity.set(v, new Map());
        if (!this.#flow.has(v)) this.#flow.set(v, new Map());
        this.#vertices.add(v);
    }

    // agrega arista con capacidad, inicializa flujo en 0
    // tambien agrega arista inversa v→u con capacidad 0
    addEdge(u, v, capacity) {
        this.#initVertex(u);
        this.#initVertex(v);

        this.#capacity.get(u).set(v, capacity);
        this.#flow.get(u).set(v, 0)

        // arista inversa para la red residual
        this.#capacity.get(v).set(u, 0);
        this.#flow.get(v).set(u, 0);
     }       
    
    // capacity[u][v]
    getCapacity(u, v) {
        return this.#capacity.get(u)?.get(v) ?? 0
     } 
    
    // flow[u][v]
    getFlow(u, v) { 
        return this.#flow.get(u)?.get(v) ?? 0
    }    
    
    // capacity[u][v] - flow[u][v]
    getResidual(u, v) {
        return (this.getCapacity(u, v) - this.getFlow(u, v))
    }             

    // flow[u][v] += delta
    // flow[v][u] -= delta  (arista inversa)
    updateFlow(u, v, delta) { 
        this.#flow.get(u).set(v, this.getFlow(u, v) + delta);
        this.#flow.get(v).set(u, this.getFlow(v, u) - delta);
    }       

    // todos los vertices
    get vertices() { 
        return [...this.#vertices]
    }                

    // vecinos con capacidad residual > 0
    neighbors(u) {
        const result = [];
        for(const [v, cap] of this.#capacity.get(u)){
            if(this.getResidual(u, v) > 0) result.push(v)
        }
        return result;
     }                  

    // Edmonds-Karp usa BFS para encontrar caminos aumentantes
    // devuelve el camino o null
    #bfsAugmentingPath(source, sink) { 

        const cameFrom = new Map();
        const queue = new Queue();

        cameFrom.set(source, null);
        queue.enqueue(source);

        while(!queue.isEmpty()){

            const u = queue.peek();
            queue.dequeue();

            if(u === sink) break;

            for(const v of this.neighbors(u)){

                if(!cameFrom.has(v)){
                    cameFrom.set(v, u);
                    queue.enqueue(v);
                }

            }

        }

        // Si sink no fue alcanzado, no hay camino aumentante
        if(!cameFrom.has(sink)) return null;

        // Reconstruir camino;

        const path = [];
        let current = sink;

        while(current != null){
            path.push(current);
            current = cameFrom.get(current);
        }

        return path.reverse()

    }   

    getFlowDetails(){
        const result = [];
        for(const [u, neighbors] of this.#capacity){

            for(const [v, cap] of neighbors){

                if(cap > 0){
                    result.push({
                        from: u, 
                        to: v, 
                        flow: this.getFlow(u, v),
                        capacity: this.getCapacity(u, v)
                    })
                }

            }

        }

        return result;
    }

    // algoritmo principal
    ekMaxFlow(source, sink) { 

        // Reinicio flujo
        for(const u of this.#vertices){
            for(const v of this.#flow.get(u).keys()){
                this.#flow.get(u).set(v, 0);
            }
        }


        let maxFlow = 0

        // Camino aumentante
        let path = this.#bfsAugmentingPath(source, sink);

        // mientras exista un camino aumentante
        while(path != null){

            // encontrar el residual minimo del camino — el cuello de botella
            let bottleNeck = Infinity;
            for(let i = 0; i < path.length - 1; i++){

                const u = path[i];
                const v = path[i+1];
                bottleNeck = Math.min(bottleNeck, this.getResidual(u, v));
            }

            // Actualizar flujo en cada arista del camino
            for (let i = 0; i < path.length - 1; i++){
                const u = path[i];
                const v = path[i+1];
                this.updateFlow(u, v, bottleNeck);
            }

            maxFlow += bottleNeck;

            path = this.#bfsAugmentingPath(source, sink)

        }

        return maxFlow;

    }            



    

}