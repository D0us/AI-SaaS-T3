import { useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import { useState } from "react";
import { api } from "~/utils/api";
import { toast } from "react-hot-toast";
import { LoadingSpinner } from "../components/loading";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import PageLayout from "../components/layout";

dayjs.extend(relativeTime);

const Chat: NextPage = () => {
  const [message, setMessage] = useState<string>("");
  const messages = api.messages.getAll.useQuery();
  const { mutate, error, isLoading } = api.messages.add.useMutation({
    onSuccess: () => {
      setMessage("");
      void messages.refetch();
    },
    onError: (e) => {
      toast(e.message);
    },
  });
  const user = useUser();

  const customer = api.customer.isActive.useQuery();
  console.log(customer);

  return (
    <>
      <PageLayout>
        <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#c9a7fa] to-[#8c91ea]">
          <div className="container flex w-1/2 flex-col items-center justify-center gap-12 px-4 py-16">
            {/* <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            Create <span className="text-[hsl(280,100%,70%)]">T3</span> App
          </h1> */}

            <div className="flex min-w-full flex-col justify-between space-y-2">
              <div className="flex min-h-full flex-col space-y-2 rounded-md bg-transparent">
                {messages.data?.map((message) => (
                  <div
                    key={message.id}
                    className={`flex w-full flex-col rounded-md border border-black ${
                      message.isAgent ? "bg-blue-200" : "bg-white"
                    } p-2`}
                  >
                    <span>{`${
                      message.isAgent
                        ? "Agent"
                        : message.authorId === user.user?.id
                        ? "You"
                        : "Someone"
                    } · ${dayjs(message.createdAt).fromNow()}`}</span>
                    <p>{message.content}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-row space-x-2 rounded-md bg-transparent">
                <textarea
                  className="h-16 w-full resize-none rounded-md p-2"
                  onChange={(e) => setMessage(e.target.value)}
                  value={message}
                />
                {!isLoading && (
                  <button
                    onClick={() => mutate({ content: message })}
                    className="rounded-md bg-white px-2"
                  >
                    Send
                  </button>
                )}
                {!!isLoading && (
                  <div className="w-100 flex flex-row items-center justify-center">
                    <LoadingSpinner />
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </PageLayout>
    </>
  );
};

export default Chat;
