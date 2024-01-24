import InfoModal from "@/components/info-modal";
import InputNode from "@/components/input-node";
import ResetButton from "@/components/reset-button";
import StandardNode from "@/components/standard-node";
import {
  IconBrandGithub,
  IconChartBar,
  IconInfoCircle,
} from "@tabler/icons-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import ReactFlow, {
  Connection,
  Controls,
  addEdge,
  useEdgesState,
  useNodesState,
} from "reactflow";
import "reactflow/dist/style.css";

const nodeTypes = {
  input: InputNode,
  standard: StandardNode,
};

export default function Home() {
  const [infoModalIsOpen, setInfoModalIsOpen] = useState(false);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
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
  }, [setNodes, setEdges]);

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) => addEdge(params, eds));
    },
    [setEdges],
  );

  return (
    <main>
      <div className="flex h-screen flex-col bg-orange-100 text-orange-100">
        <div className="flex items-center justify-end space-x-2 px-2">
          <ResetButton setNodes={setNodes} setEdges={setEdges} />
          <button onClick={() => setInfoModalIsOpen(true)}>
            <IconInfoCircle className="text-orange-500" />
          </button>
          <Link href={"/most-clicked"}>
            <IconChartBar className="text-orange-500" />
          </Link>
          <Link href={"https://github.com/eannam/idea-maze"} target="_blank">
            <IconBrandGithub className="text-orange-500" />
          </Link>
        </div>
        <InfoModal isOpen={infoModalIsOpen} setIsOpen={setInfoModalIsOpen} />
        <ReactFlow
          nodes={nodes}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          edges={edges}
          onEdgesChange={onEdgesChange}
          snapToGrid={true}
          snapGrid={[16, 16]}
          onConnect={onConnect}
          nodeOrigin={[0, 0]}
          zoomOnDoubleClick={false}
          zoomOnScroll={true}
        >
          <Controls showInteractive={false} />
        </ReactFlow>
      </div>
    </main>
  );
}
