import { describe, it, expect, beforeEach } from 'vitest';
import { Graph } from '../estructures/graph.js';

// --- Grafo no dirigido sin peso ---

describe('Graph no dirigido sin peso', () => {

    let g;

    beforeEach(() => {
        g = new Graph();
    });

    // Vertices

    describe('vertices', () => {

        it('agrega un vertice', () => {
            g.addVertex('A');
            expect(g.hasVertex('A')).toBe(true);
        });

        it('no duplica un vertice existente', () => {
            g.addVertex('A');
            g.addVertex('A');
            expect(g.order).toBe(1);
        });

        it('elimina un vertice', () => {
            g.addVertex('A');
            g.removeVertex('A');
            expect(g.hasVertex('A')).toBe(false);
        });

        it('elimina las aristas del vertice eliminado', () => {
            g.addEdge('A', 'B');
            g.removeVertex('A');
            expect(g.neighbors('B')).not.toContain('A');
        });

        it('devuelve todos los vertices', () => {
            g.addVertex('A');
            g.addVertex('B');
            g.addVertex('C');
            expect(g.vertices).toEqual(expect.arrayContaining(['A', 'B', 'C']));
            expect(g.vertices).toHaveLength(3);
        });

        it('order devuelve la cantidad de vertices', () => {
            g.addVertex('A');
            g.addVertex('B');
            expect(g.order).toBe(2);
        });

    });

    // Aristas

    describe('aristas', () => {

        it('agrega una arista y crea los vertices automaticamente', () => {
            g.addEdge('A', 'B');
            expect(g.hasVertex('A')).toBe(true);
            expect(g.hasVertex('B')).toBe(true);
        });

        it('agrega arista en ambos sentidos por ser no dirigido', () => {
            g.addEdge('A', 'B');
            expect(g.hasEdge('A', 'B')).toBe(true);
            expect(g.hasEdge('B', 'A')).toBe(true);
        });

        it('elimina una arista', () => {
            g.addEdge('A', 'B');
            g.removeEdge('A', 'B');
            expect(g.hasEdge('A', 'B')).toBe(false);
            expect(g.hasEdge('B', 'A')).toBe(false);
        });

        it('size devuelve la cantidad de aristas', () => {
            g.addEdge('A', 'B');
            g.addEdge('B', 'C');
            expect(g.size).toBe(2);
        });

        it('devuelve la lista de aristas sin duplicados', () => {
            g.addEdge('A', 'B');
            g.addEdge('B', 'C');
            expect(g.edges).toHaveLength(2);
            expect(g.edges).toContainEqual({ from: 'A', to: 'B' });
        });

        it('el peso es null en grafo sin peso', () => {
            g.addEdge('A', 'B');
            expect(g.getWeight('A', 'B')).toBeNull();
        });

    });

    // Vecinos y grado

    describe('neighbors y degree', () => {

        it('devuelve los vecinos de un vertice', () => {
            g.addEdge('A', 'B');
            g.addEdge('A', 'C');
            expect(g.neighbors('A')).toEqual(expect.arrayContaining(['B', 'C']));
        });

        it('degree devuelve la cantidad de aristas del vertice', () => {
            g.addEdge('A', 'B');
            g.addEdge('A', 'C');
            expect(g.degree('A')).toBe(2);
        });

    });

});

// --- Grafo dirigido sin peso ---

describe('Graph dirigido sin peso', () => {

    let g;

    beforeEach(() => {
        g = new Graph({ directed: true });
    });

    it('agrega arista solo en un sentido', () => {
        g.addEdge('A', 'B');
        expect(g.hasEdge('A', 'B')).toBe(true);
        expect(g.hasEdge('B', 'A')).toBe(false);
    });

    it('size cuenta cada arista una vez', () => {
        g.addEdge('A', 'B');
        g.addEdge('B', 'C');
        expect(g.size).toBe(2);
    });

    it('isDirected devuelve true', () => {
        expect(g.isDirected).toBe(true);
    });

});

// --- Grafo con peso ---

describe('Graph con peso', () => {

    let g;

    beforeEach(() => {
        g = new Graph({ weighted: true });
    });

    it('guarda el peso de la arista', () => {
        g.addEdge('A', 'B', 5);
        expect(g.getWeight('A', 'B')).toBe(5);
    });

    it('devuelve el peso en la lista de aristas', () => {
        g.addEdge('A', 'B', 5);
        expect(g.edges).toContainEqual({ from: 'A', to: 'B', weight: 5 });
    });

    it('isWeighted devuelve true', () => {
        expect(g.isWeighted).toBe(true);
    });

});

// --- BFS ---

describe('BFS', () => {

    let g;

    //  A - B - E
    //  |
    //  C - D
    beforeEach(() => {
        g = new Graph();
        g.addEdge('A', 'B');
        g.addEdge('A', 'C');
        g.addEdge('B', 'E');
        g.addEdge('C', 'D');
    });

    it('visita todos los vertices', () => {
        const { vertices } = g.bfs('A', () => { });
        expect(vertices).toEqual(expect.arrayContaining(['A', 'B', 'C', 'D', 'E']));
        expect(vertices).toHaveLength(5);
    });

    it('llama el callback por cada vertice', () => {
        const visited = [];
        g.bfs('A', v => visited.push(v));
        expect(visited).toHaveLength(5);
    });

    it('el primer vertice visitado es el start', () => {
        const visited = [];
        g.bfs('A', v => visited.push(v));
        expect(visited[0]).toBe('A');
    });

    it('devuelve las aristas del arbol BFS', () => {
        const { edges } = g.bfs('A', () => { });
        expect(edges.size).toBe(4);
    });

});

// --- DFS ---

describe('DFS', () => {

    let g;

    //  A - B - E
    //  |
    //  C - D
    beforeEach(() => {
        g = new Graph();
        g.addEdge('A', 'B');
        g.addEdge('A', 'C');
        g.addEdge('B', 'E');
        g.addEdge('C', 'D');
    });

    it('visita todos los vertices', () => {
        const { vertices } = g.dfs('A', () => { });
        expect(vertices).toEqual(expect.arrayContaining(['A', 'B', 'C', 'D', 'E']));
        expect(vertices).toHaveLength(5);
    });

    it('llama el callback por cada vertice', () => {
        const visited = [];
        g.dfs('A', v => visited.push(v));
        expect(visited).toHaveLength(5);
    });

    it('el primer vertice visitado es el start', () => {
        const visited = [];
        g.dfs('A', v => visited.push(v));
        expect(visited[0]).toBe('A');
    });

    it('devuelve las aristas del arbol DFS', () => {
        const { edges } = g.dfs('A', () => { });
        expect(edges.size).toBe(4);
    });

});

// --- Casos borde ---

describe('casos borde', () => {

    it('hasVertex devuelve false para vertice inexistente', () => {
        const g = new Graph();
        expect(g.hasVertex('X')).toBe(false);
    });

    it('hasEdge devuelve false para arista inexistente', () => {
        const g = new Graph();
        g.addVertex('A');
        expect(g.hasEdge('A', 'B')).toBe(false);
    });

    it('grafo vacio tiene order 0 y size 0', () => {
        const g = new Graph();
        expect(g.order).toBe(0);
        expect(g.size).toBe(0);
    });

    it('removeVertex en vertice inexistente no tira error', () => {
        const g = new Graph();
        expect(() => g.removeVertex('X')).not.toThrow();
    });

    it('removeEdge en arista inexistente no tira error', () => {
        const g = new Graph();
        g.addVertex('A');
        g.addVertex('B');
        expect(() => g.removeEdge('A', 'B')).not.toThrow();
    });

});