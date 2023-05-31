import { type NextPage } from "next";
import { useState } from "react";
import { api } from "~/utils/api";
import { toast } from "react-hot-toast";
import PageLayout from "../components/layout";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";

dayjs.extend(relativeTime);

const Home: NextPage = () => {
  const can = api.customer.can.useQuery({
    feature: "chat",
  });

  return (
    <>
      <PageLayout>
        <main>
          <section>
            <Link href="/chat">
              <button className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700">
                Chat Now
              </button>
            </Link>
          </section>
        </main>
      </PageLayout>
    </>
  );
};

export default Home;
