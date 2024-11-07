import { memo } from 'react';
import { Handle, Position, NodeToolbar, NodeToolbarProps, useReactFlow } from '@xyflow/react';

interface WithNodeToolbarProps extends NodeToolbarProps {
    data: {
        label: string;
        id: string;
    };
}

export function WithToolbarNode(props: WithNodeToolbarProps) {
    console.log('WithToolbarNode', props);	
    const { setNodes } = useReactFlow();

    function handleDelete() {
        setNodes((nds) => nds.filter((node) => node.id !== props.id));
    }

    function handleCopy() {
        setNodes(prevNodes => {
            const lastNode = prevNodes.slice(-1)[0];
            const lastNodeId = Number(lastNode.id)
            return [
              ...prevNodes, 
              {
                id: String(lastNodeId + 1),
                position: { x: lastNode.position.x * 2, y: lastNode.position.y },
                data: { label: 'Nó com toolbar (clique)' },
                type: 'withToolbar',
              }
            ]
          })
    }

    return (
        <>
            <NodeToolbar isVisible={props.isVisible} position={props.position}>
                <button onClick={handleDelete}>Deletar</button>
                <button onClick={handleCopy}>Copiar</button>
            </NodeToolbar>
            <Handle type="target" position={Position.Top} />
            <div style={{ padding: '16px', background: '#ccc', borderRadius: '4px' }}>
                {props.data.label}
            </div>
            <Handle type="source" position={Position.Bottom} />
        </>
    );
};
 
export default memo(WithToolbarNode);