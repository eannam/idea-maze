import { inputAtom } from "@/utils/atoms";
import { IconLoader2 } from "@tabler/icons-react";
import { useAtom } from "jotai";
import { useState } from "react";
import { Edge, Handle, MarkerType, Node, NodeProps, Position } from "reactflow";

export type Item = {
  id: string;
  text: string;
};

export default function InputNode(
  props: NodeProps<{ setNodes: any; setEdges: any }>,
) {
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useAtom(inputAtom);

  const createNodes = (items: Item[]) => {
    let nodes = [];
    let currentYPosition = props.yPos;

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
          x: props.xPos + 700,
          y: currentYPosition + i * 100,
        },
      });
    }
    return nodes;
  };

  const createEdges = (nodes: Node[]) => {
    let edges = [];
    for (let i = 0; i < 5; i++) {
      edges.push({
        id: props.id + "->" + nodes[i].id,
        source: props.id,
        target: nodes[i].id,
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (
    e:
      | React.FormEvent<HTMLFormElement>
      | React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!input) {
        return alert("Please enter something to explore the idea maze.");
      }

      props.data.setNodes((nodes: Node[]) =>
        nodes.filter((node) => node.id === "0"),
      );
      props.data.setEdges([]);

      const res = await fetch("/api/items", {
        method: "POST",
        body: JSON.stringify({ text: input }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        if (res.status === 400) {
          const { message } = await res.json();
          return alert(message);
        } else {
          throw new Error("Something went wrong.");
        }
      }

      const data = await res.json();

      const _nodes = createNodes(data.items);

      props.data.setNodes((nodes: Node[]) => nodes.concat(_nodes));
      props.data.setEdges((edges: Edge[]) => edges.concat(createEdges(_nodes)));
    } catch (error) {
      console.error(error);
      alert(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-orange-100 p-4">
      <form className="flex flex-row space-x-2" onSubmit={handleSubmit}>
        <input
          onChange={handleChange}
          value={input}
          placeholder="Type something..."
          className="nodrag border-b-2 border-orange-300 bg-orange-100 py-2 font-serif text-lg text-orange-950 placeholder-orange-300 focus:outline-none"
        />
        <button
          className="flex min-w-24 items-center justify-center rounded-lg bg-orange-500 px-4 font-serif text-lg text-white hover:bg-orange-600"
          onClick={handleSubmit}
          disabled={loading}
        >
          {!loading ? "Explore" : <IconLoader2 className="animate-spin" />}
        </button>
      </form>
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
