import { Item } from "@/components/input-node";
import { currentlySelectedNodeIdAtom } from "@/utils/atoms";
import { isAncestor } from "@/utils/nodes";
import { useAtom } from "jotai";
import { Edge, Handle, MarkerType, Node, NodeProps, Position } from "reactflow";

type StandardNodeData = {
  id: string;
  text: string;
  setNodes: any;
  setEdges: any;
};

export default function StandardNode(props: NodeProps<StandardNodeData>) {
  const [currentlySelectedNodeId, setCurrentlySelectedNodeId] = useAtom(
    currentlySelectedNodeIdAtom,
  );

  const isHighlighted =
    currentlySelectedNodeId === props.id ||
    props.id.length > currentlySelectedNodeId.length ||
    isAncestor(props.id, currentlySelectedNodeId);

  const createNodes = (items: Item[]) => {
    let nodes = [];
    let currentYPosition = props.yPos - 280; // - parseInt(props.id.split("/").slice(-1)[0]) * 140;

    for (let i = 0; i < items.length; i++) {
      const id = `${props.id}/${i.toString()}`;
      nodes.push({
        id,
        type: "standard",
        data: {
          id: items[i].id,
          text: items[i].text,
          setNodes: props.data.setNodes,
          setEdges: props.data.setEdges,
        },
        draggable: false,
        position: {
          x: props.xPos + 600,
          y: currentYPosition + i * 140,
        },
      });
    }
    return nodes;
  };

  const createEdges = (nodes: Node[]) => {
    const edges = [];
    for (const node of nodes) {
      edges.push({
        id: `${props.id}->${node.id}`,
        source: props.id,
        target: node.id,
        sourceHandle: "right",
        targetHandle: "left",
        deletable: false,
        markerEnd: {
          type: MarkerType.Arrow,
          color: "#FFA500",
        },
        style: {
          stroke: "#FFA500",
          strokeWidth: 4,
        },
        animated: true,
      });
    }
    return edges;
  };

  const handleClick = async () => {
    setCurrentlySelectedNodeId(props.id);

    try {
      const res = await fetch(`/api/items?id=${props.data.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("Something went wrong");
      }

      const data = await res.json();

      const _nodes = createNodes(data.items);

      props.data.setNodes((nodes: Node[]) => {
        const updatedNodes = nodes.filter(
          (node) => node.id.length <= props.id.length,
        );
        return updatedNodes.concat(_nodes);
      });

      props.data.setEdges((edges: Edge[]) => {
        const updatedEdges = edges
          .map((edge) => {
            if (isAncestor(edge.target, props.id)) {
              return {
                ...edge,
                style: { stroke: "#ffa500", strokeWidth: 4 },
                markerEnd: {
                  type: MarkerType.ArrowClosed,
                  color: "#ffa500",
                },
                animated: false,
              };
            } else {
              return {
                ...edge,
                style: { stroke: "#fed7aa", strokeWidth: 4 },
                markerEnd: {
                  type: MarkerType.Arrow,
                  color: "#fed7aa",
                },
                animated: false,
              };
            }
          })
          .filter((edge) => edge.target.length <= props.id.length);
        return updatedEdges.concat(createEdges(_nodes));
      });
    } catch (error) {
      console.error(error);
      alert(error);
    }
  };

  return (
    <div className="max-w-96  bg-transparent p-8" onClick={handleClick}>
      <div
        className={`break-words font-serif text-xs  ${isHighlighted ? "text-orange-900" : "text-orange-300"}`}
      >
        {props.data.text}
      </div>
      <Handle
        id="left"
        type="target"
        position={Position.Left}
        style={{
          background: "none",
          border: "none",
        }}
      />
      <Handle
        id="right"
        type="source"
        position={Position.Right}
        style={{
          background: "none",
          border: "none",
        }}
      />
    </div>
  );
}
