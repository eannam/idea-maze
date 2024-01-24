import { inputAtom } from "@/utils/atoms";
import { useSetAtom } from "jotai";
import { Node, useReactFlow } from "reactflow";

export default function ResetButton({
  setNodes,
  setEdges,
}: {
  setNodes: any;
  setEdges: any;
}) {
  const setInput = useSetAtom(inputAtom);

  const { setViewport } = useReactFlow();

  const handleReset = () => {
    setInput("");
    setNodes((nodes: Node[]) => {
      return nodes.filter(({ id }) => id === "0");
    });
    setEdges([]);
    setViewport({ x: 0, y: 0, zoom: 1 });
  };

  return (
    <button
      className="text-md rounded-md bg-orange-100 px-2 py-1 font-serif text-orange-500 underline-offset-2 hover:underline"
      onClick={handleReset}
    >
      Reset
    </button>
  );
}
