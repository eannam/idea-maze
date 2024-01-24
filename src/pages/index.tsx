import InputNode from "@/components/input-node";
import ResetButton from "@/components/reset-button";
import StandardNode from "@/components/standard-node";
import { IconBrandGithub, IconInfoCircle } from "@tabler/icons-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import Modal from "react-modal";
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
          <Link href={"https://github.com"}>
            <IconBrandGithub className="text-orange-500" />
          </Link>
        </div>
        <Modal
          isOpen={infoModalIsOpen}
          style={{
            content: {
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              background: "none",
              border: "none",
            },
          }}
        >
          <div className="flex h-full flex-col items-center rounded-lg border-2 border-orange-200 bg-orange-100 py-10">
            <div className="font-serif text-2xl font-semibold text-orange-900">
              Welcome to the Idea Maze
            </div>
            <div className="space-y-2 p-10 font-serif text-lg text-orange-800">
              <p>
                Enter an idea and explore similar ideas that have been entered
                by others.
              </p>
              <p>
                Ideas are compared using the similarity of their embeddings in a
                high dimensional vector space.
              </p>
              <p>
                This website was built by Éanna Morley using NextJS, ReactFlow,
                NeonDB and OpenAI embeddings.
              </p>
            </div>
            <button
              className="text-orange-500 underline-offset-2 hover:underline"
              onClick={() => setInfoModalIsOpen(false)}
            >
              Close
            </button>
          </div>
        </Modal>
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
