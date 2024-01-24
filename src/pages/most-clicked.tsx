import db from "@/server/services/db";
import { GetServerSideProps } from "next";

export default function MostClicked({
  data,
}: {
  data: { id: string; text: string; clickCount: number }[];
}) {
  return (
    <div className="flex h-auto justify-center bg-orange-100 font-serif sm:h-screen">
      <div className="flex max-w-2xl flex-col items-center justify-center border-x-2 border-orange-500 bg-orange-50 p-8">
        <h1 className="pb-8 text-2xl text-orange-900 underline underline-offset-2">
          Most Clicked Ideas
        </h1>
        <ul className="text-md space-y-2">
          {data.map((item, i) => (
            <li key={item.id}>
              <span className="font-bold text-orange-900">{i + 1}. </span>
              <span className="text-orange-800">{item.text} </span>
              <span className="text-orange-700">({item.clickCount} times)</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const data = await db.getMostClicked(10);

  return {
    props: {
      data,
    },
  };
};
