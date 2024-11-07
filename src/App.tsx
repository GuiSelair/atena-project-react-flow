import '@xyflow/react/dist/style.css';

import { useCallback, useRef } from 'react';
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  Background,
  BackgroundVariant,
  useReactFlow,
} from '@xyflow/react';
import type {
  Connection,
  Edge,
  Node
} from '@xyflow/react';

import WithToolbarNode from './components/WithToolbar.node';
import WithResizerNode from './components/WithResizer.node';


/** Box com conteúdo */
const initialNodes = [
  { id: '1', position: { x: 0, y: 0 }, data: { label: 'Inicio do fluxo' }, type: 'input', draggable: false },
] as Node[];

/** Linha de ligação entre boxes */
const initialEdges = [] as Edge[];

const nodeTypes = {
  withToolbar: WithToolbarNode,
  withModal: WithToolbarNode,
  withResizer: WithResizerNode,
}
 
export default function App() {
  const reactFlowWrapper = useRef(null);
  /** Hook responsável por monitorar nós */
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  /** Hook responsável por monitorar ligações */
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const { fitView } = useReactFlow()
 
  /** Função utilitária para adicionar uma nova conexão (ligação entre dois nós) */
  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const createNodeAndConnectToPrevious = useCallback((type: keyof typeof nodeTypes, defaultLabel = '', defaultPosition?: { x: number; y: number }) => {
    let lastNodeId = 0;
    let newNodeId = 0;
    let label = defaultLabel

    switch (type) {
      case 'withToolbar':
        label = 'Com toolbar (Clique)';
        break;
      case 'withResizer':
        label = 'Com resizer';
        break
      default:
        break;
      }

    setNodes(prevNodes => {
      const lastNode = prevNodes.slice(-1)[0];
      lastNodeId = Number(lastNode.id)
      newNodeId = lastNodeId + 1;
      
      return [
        ...prevNodes, 
        {
          id: String(lastNodeId + 1),
          position: defaultPosition ? defaultPosition : { x: 0, y: lastNode.position.y + 100 },
          data: { label },
          type,
        }
      ]
    })

    onConnect({
      id: `${lastNodeId}->${newNodeId}`,
      source: String(lastNodeId), 
      target: String(newNodeId),
    })

    fitView({ padding: 2 })
  }, []);


  /** Funções básicas responsaveis por manipular o drag and drog dos nós */
  function onDragStart(event: any, nodeType: any) {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  function onDragOver(event: any) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  function onDrop (event: any){
    event.preventDefault();

    const reactFlowBounds = reactFlowWrapper?.current?.getBoundingClientRect?.();
    console.log({reactFlowBounds, event}, event.clientX - reactFlowBounds.left, event.clientY - reactFlowBounds.top);
    const type = event.dataTransfer.getData('application/reactflow');

    createNodeAndConnectToPrevious(type, 'Drag and Drop')
  };
 
  return (
    /** Precisa estar envolto em um elemento HTML que contenha o tamanho máximo do fluxograma. */
    <div className='container'>
      <div className="panel-container">
        <h1>Criação de fluxogramas</h1>
        <hr />
        <strong>Selecione um tipo de nó para inserir:</strong>
        <aside className='node-type-list'>
          <button onDragStart={(event) => onDragStart(event, 'default')} draggable>Nó com drag and drop (Arraste)</button>
          <button onClick={() => createNodeAndConnectToPrevious('withResizer')}>Nó com redimencionamento</button>
          <button onClick={() => createNodeAndConnectToPrevious('withToolbar')}>Nó com toolbar</button>
        </aside>
      </div>
      <div className='flow-container' ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          /** Responsável por ajustar o zoom e centralizar para exibir todos os nós. */
          fitView
          /** Opções padrão para todas as conexões. */
          defaultEdgeOptions={{ animated: true }}
          /** Informa todos os nós customizados */
          nodeTypes={nodeTypes}
          /** Função invocada quando o drop é realizado */
          onDrop={onDrop}
          /** Função invocada quando um nó é movido. */
          onDragOver={onDragOver}
        >
          {/** Todos componentes adicionar/opcionais devem ficar envoltos do provider ReactFlow */}
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        </ReactFlow>

      </div>
    </div>
  );
}