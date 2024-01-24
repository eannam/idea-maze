import { inputAtom } from "@/utils/atoms";
import { useSetAtom } from "jotai";
import { useReactFlow } from "reactflow";

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
    setNodes(() => {
      return [
        {
          id: "0",
          type: "input",
          position: { x: 0, y: 0 },
          data: {
            setNodes,
            setEdges,
          },
          draggable: false,
          dragging: false,
          style: {
            border: "0px",
            width: "auto",
            padding: 0,
            boxShadow: "none",
          },
        },
      ];
    });
    setEdges([]);
    setViewport({ x: 0, y: 0, zoom: 1 });
  };

  return (
    <button
      className="rounded-md bg-orange-100 px-2 py-1 font-serif text-sm text-orange-500 hover:underline"
      onClick={handleReset}
    >
      Reset
    </button>
  );
}
