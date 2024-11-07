import { memo } from 'react';
import { Handle, Position, NodeResizerProps, NodeResizer } from '@xyflow/react';

interface WithNodeResizerProps extends NodeResizerProps {
    data: {
        label: string;
    };
}

export function WithResizerNode(props: WithNodeResizerProps) {
    console.log('WithResizerNode', props);	

    return (
        <>
            <NodeResizer minWidth={100} minHeight={30} />
            <Handle type="target" position={Position.Top} />
            <div style={{ width: '100%', height: '100%', padding: '16px', background: 'white', borderRadius: '4px' }}>
                {props.data.label}
            </div>
            <Handle type="source" position={Position.Bottom} />
        </>
    );
};
 
export default memo(WithResizerNode);