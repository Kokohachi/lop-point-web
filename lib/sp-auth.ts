import { createClient } from "@supabase/supabase-js";
import { v4 } from "uuid";

type PointHistory = {
  id: string;
  addedPoints: number;
  removedPoints: number;
  reason: string;
  created_at: string;
  pointSentTo?: string;
}[];

type Application = {
  id: string;
  uid: string;
  addedPoints: number;
  removedPoints: number;
  reason: string;
  created_at: string;
  messageLink: string;
  note?: string;
  pointSentTo?: string;
  avatar_url: string;
  global_name: string;
  fullname: string;
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

const signIn = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "discord",
  });
  if (error) {
    console.log(error);
    return;
    console.log(data, "logged in");
  }
};

const getUserData = async () => {
  const { data, error } = await supabase.auth.getSession();
  const userData = data.session?.user;
  if (userData === undefined) {
    return 0;
  }
  if (userData) {
    return userData;
  }
  if (error) {
    console.log(error);
    return 0;
  }
};

const addUserPoints = async (points: number, uid: string, reason: string) => {
  // get current points and history
  const { data, error } = await supabase
    .from("points")
    .select("*")
    .eq("id", uid);
  if (error) {
    console.log(error);
    return;
  }
  // if no data, create new user
  if (data.length === 0) {
    const pointsData: PointHistory = [
      {
        id: v4(),
        addedPoints: points,
        removedPoints: 0,
        reason: reason,
        created_at: new Date().toISOString(),
      },
    ];
    const { data, error } = await supabase.from("points").insert([
      {
        id: uid,
        total_points: points,
        history: pointsData,
      },
    ]);
    if (error) {
      console.log(error);
      return;
    }
  }
  // if data, update points and history
  if (data.length > 0) {
    const currentPoints = data[0].total_points;
    const updatedPoints = currentPoints + points;
    const history = data[0].history;
    const newHistory: PointHistory = [
      {
        id: v4(),
        addedPoints: points,
        removedPoints: 0,
        reason: reason,
        created_at: new Date().toISOString(),
      },
    ];
    const { data: data2, error } = await supabase
      .from("points")
      .update({ total_points: updatedPoints, history: history.concat(newHistory) })
      .eq("id", uid);
    if (error) {
      console.log(error);
      return;
    }
  }
};

const makeApplication = async (uid: string, pointsAdded: number, pointsRemoved: number, reason: string, messageLink: string, note: string, avatar_url:string, global_name:string, fullname:string) => {
  const applicationInfo: Application = {
    id: v4(),
    uid: uid,
    addedPoints: pointsAdded,
    removedPoints: pointsRemoved,
    reason: reason,
    messageLink: messageLink,
    note: note,
    created_at: new Date().toISOString(),
    avatar_url: avatar_url,
    global_name: global_name,
    fullname: fullname,
  };
  const { data, error } = await supabase.from("pointApplication").insert([
    {
      id: v4(),
      applyInfo: applicationInfo,
      created_at: new Date().toISOString(),
    },
  ]);
  if (error) {
    console.log(error);
    return;
  }
  const webhook_url = "https://discord.com/api/webhooks/1204807368760627292/ezOLMVU8Eqp2VqT51RSPnxwhNPVbWzV3dFqtrq9gDykT5mHkiH4F7gRDRjQJ3wY5WLWm";
  const reason_str = reason === "rating"? "譜面評価" : reason === "request"? "製作依頼受注": "譜面布教"
  const webhook_data = {
    content: `新規申請通知`,
    embeds: [
      {
        title: `${global_name}@${fullname}によるポイント申請`,
        description: `付与予定のポイント: ${pointsAdded}\n 理由: ${reason_str}\n[申請リンク](${messageLink})\n承認/却下は[こちら](https://lopps.vercel.app/admin/list)で行ってください`,
        color: 0x0080c0,
        footer: {
          text: "LoPPS Point System",
        },
        thumbnail: {
          url: avatar_url,
        },
      },
    ],
  };
  const res = await fetch(webhook_url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(webhook_data),
  });
  if (res.status === 204) {
    console.log("sent");
  }
  return;
}

const getApplications = async () => {
  const { data, error } = await supabase.from("pointApplication").select("*").eq("status", "pending");
  if (error) {
    console.log(error);
    return;
  }
  return data;
}


const getUserApplications = async (uid: string) => {
  const { data, error } = await supabase.from("pointApplication").select("*")
  if (error) {
    console.log(error);
    return;
  }
  const nres = data?.filter((app: any) => app.applyInfo.uid === uid).sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  return nres;
}

const approveApplication = async (adminid: string, applicationid: string) => {
  const { data, error } = await supabase.from("pointApplication").update({status: "approved", approved_by: adminid}).eq("id", applicationid);
  if (error) {
    console.log(error);
    return;
  }
}

const rejectApplication = async (adminid: string, applicationid: string) => {
  const { data, error } = await supabase.from("pointApplication").update({status: "rejected", approved_by: adminid}).eq("id", applicationid);
  if (error) {
    console.log(error);
    return;
  }
}

export { supabase, signIn, getUserData, addUserPoints, makeApplication, getApplications, approveApplication, rejectApplication, getUserApplications};
