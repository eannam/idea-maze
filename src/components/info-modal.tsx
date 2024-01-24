import Modal from "react-modal";

export default function InfoModal({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: any;
}) {
  return (
    <Modal isOpen={isOpen} className="flex h-full items-center justify-center">
      <div className=" flex max-w-2xl flex-col items-center rounded-lg border-2 border-orange-200 bg-orange-100 py-10">
        <div className="font-serif text-2xl font-semibold text-orange-900">
          Welcome to the Idea Maze
        </div>
        <div className="text-balanced space-y-2 p-10 font-serif text-lg text-orange-800">
          <p>
            Enter an idea and explore similar ideas that have been entered by
            others.
          </p>
          <p>
            Ideas are compared using the similarity of their embeddings in a
            high dimensional vector space.
          </p>
          <p>
            This website was built using NextJS, ReactFlow, NeonDB, and OpenAI
            embeddings.
          </p>
          <p>Have fun!</p>
        </div>
        <button
          className="p-2 text-orange-500 underline-offset-2 hover:underline"
          onClick={() => setIsOpen(false)}
        >
          Close
        </button>
      </div>
    </Modal>
  );
}
