import './App.css'
import { Graph } from "./estructures/graph.js"
import { GraphView } from './drawing.jsx';
import { FlowNetwork } from "./estructures/FlowNetwork.js"

function App() {

  /*const g = new Graph({});

  g.addEdge("A", "B");
  g.addEdge("A", "D");
  g.addEdge("A", "H");
  g.addEdge("B", "C");
  g.addEdge("B", "D");
  g.addEdge("B", "E");
  g.addEdge("C", "D");
  g.addEdge("C", "G");
  g.addEdge("F", "G");
  g.addEdge("G", "H");

  const {vertices, edges} = g.dfs("G", () => {})
  console.log(vertices, edges)
  const tree = g.dfsTree("G")*/

  const fn = new FlowNetwork();

  fn.addEdge('s', 'a', 20);
  fn.addEdge('s', 'e', 10);
  fn.addEdge('s', 'g', 10);
  fn.addEdge('s', 'j', 10);
  fn.addEdge('a', 'b', 20);
  fn.addEdge('a', 'h', 10);
  fn.addEdge('b', 't', 20);
  fn.addEdge('c', 'd', 30);
  fn.addEdge('d', 'i', 10);
  fn.addEdge('e', 'f', 10);
  fn.addEdge('e', 'k', 5);
  fn.addEdge('f', 't', 10);
  fn.addEdge('g', 'k', 10);
  fn.addEdge('g', 'm', 5);
  fn.addEdge('h', 'j', 5);
  fn.addEdge('h', 'n', 8);
  fn.addEdge('i', 'f', 5);
  fn.addEdge('i', 'm', 5);
  fn.addEdge('j', 'q', 10);
  fn.addEdge('k', 't', 10);
  fn.addEdge('q', 'b', 10);
  fn.addEdge('m', 'p', 10);
  fn.addEdge('n', 'c', 10);
  fn.addEdge('p', 't', 10);

  console.log(fn.ekMaxFlow('s', 't'));

  return (
    <>
      <h1>Proyecto Matemática Discreta</h1>
      { /* -- <GraphView graph={tree} start='G' isATree={true}/>; */ }
    </>
  )
}

export default App
