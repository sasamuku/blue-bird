"use client";

import { use, useEffect } from "react";
import Likes from "./likes";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
// import { useOptimistic } from "react";

export default function Tweets({ tweets }: { tweets: TweetWithAuthor[] }) {
  // note: useOptimistic is not working with error:
  // ref: https://github.com/vercel/next.js/issues/65673
  // const [optimisticTweets, addOptimisticTweet] = useOptimistic<
  //   TweetWithAuthor[],
  //   TweetWithAuthor
  // >(tweets, (currentOptimisticTweets, newTweet) => {
  //   const newOptimisticTweets = [...currentOptimisticTweets];
  //   const index = newOptimisticTweets.findIndex(
  //     (tweet) => tweet.id === newTweet.id
  //   );
  //   newOptimisticTweets[index] = newTweet;
  //   return newOptimisticTweets;
  // });

  const addOptimisticTweet = () => {};

  const supabase = createClientComponentClient();
  const router = useRouter();

  useEffect(() => {
    const channel = supabase.channel("realtime tweets").on
    (
      "postgres_changes", {
        event: "*",
        schema: "public",
        table: "tweets",
      }, (payload) => {
        router.refresh();
      }
    ).subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, router]);

  return tweets.map((tweet) => (
    <div key={tweet.id}>
      <p>
        {tweet.author.name} {tweet.author.username}
      </p>
      <p>{tweet.title}</p>
      <Likes tweet={tweet} addOptimisticTweet={addOptimisticTweet} />
    </div>
  ));
}
