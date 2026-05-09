import CytoscapeComponent from 'react-cytoscapejs';

export function GraphView({ graph, isATree, start = "A" }) {
    const elements = graph.toCytoscape();

    return (
        <CytoscapeComponent
            elements={elements}
            style={{ width: '1000px', height: '600px' }}
            layout={{
                name: isATree ? 'breadthfirst' : "cose",
                directed: graph.isDirected,       // respeta la dirección de las aristas
                roots: '#'+start,          // nodo raíz — el que pusiste como start
                padding: 30,
                spacingFactor: 1.5    // espacio entre nodos
            }}  // layout automático
            stylesheet={[
                {
                    selector: 'node',
                    style: {
                        'label': 'data(id)',
                        'background-color': '#4A90D9',
                        'color': '#fff',
                        'text-valign': 'center',
                        'text-halign': 'center',
                    }
                },
                {
                    selector: 'edge',
                    style: {
                        'label': graph.isWeighted ? 'data(weight)' : '',
                        'target-arrow-shape': graph.isDirected ? 'triangle' : 'none',
                        'curve-style': 'bezier',
                        'line-color': '#ccc',
                        'target-arrow-color': '#ccc',
                    }
                }
            ]}
        />
    );
}