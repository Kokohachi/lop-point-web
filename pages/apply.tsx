import Header from "@/components/Header";
import { addUserPoints, getUserData, makeApplication } from "@/lib/sp-auth";
import {
  Text,
  Input,
  Select,
  Center,
  TextInput,
  Container,
  Button,
} from "@mantine/core";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Apply() {
  const [point, setPoint] = useState(0);
  const [reason, setReason] = useState("");
  const [uid, setUid] = useState("");
  const [message, setMessage] = useState("");
  const [note, setNote] = useState("");
  const [avatar_url, setAvatar_url] = useState("");
  const [username, setUsername] = useState("");
  const [user_id, setUser_id] = useState("");
  const router = useRouter();
  useEffect(() => {
    getUserData().then((data) => {
      if (data === 0) {
        router.push("/login");
        return;
      }
      setUid(data?.id || "");
      if (data?.identities) {
        setUsername(data.identities[0]?.identity_data?.custom_claims?.global_name || "");
        setUser_id(data.identities[0]?.identity_data?.full_name || "");
        setAvatar_url(data.identities[0]?.identity_data?.avatar_url || "");
      }
    });
  });
  return (
    <>
      <Header />
      <Center mt={"xl"}>
        <Text fw={"500"} fz={32}>
          ポイント申請
        </Text>
      </Center>
      <Container mt={"xl"} maw={"90%"}>
        <Input.Wrapper mt={"xl"}>
          <Select
            mb={"sm"}
            label="申請理由"
            data={["譜面評価", "制作依頼受注", "譜面布教"]}
            withAsterisk
            onChange={(option) => {
              setPoint(
                option === "譜面評価"
                  ? 300
                  : option === "制作依頼受注"
                  ? 50
                  : 10
              );
              setReason(
                option === "譜面評価"
                  ? "rating"
                  : option === "制作依頼受注"
                  ? "request"
                  : "reccomend" || ""
              );
            }}
          />
          <TextInput
            mb={"sm"}
            label="メッセージリンク"
            description="譜面評価の場合 #譜面評価チャンネルのリンク、受注の場合、受注完了後の返信メッセージのリンク、布教の場合そのメッセージのリンク"
            placeholder="https://discord.com/..."
            onChange={(e) => {
              setMessage(e.target.value);

            }}
            withAsterisk
          />
          <TextInput mb={"sm"} label="特筆事項" onChange={(e) =>{
            setNote(e.target.value);
          }}/>
        </Input.Wrapper>
        <Text mt={"xl"} fw={"500"} fz={24}>
          この申請によって<span color="#999999">{point}</span>
          ポイントが付与されます。
        </Text>
        <Button
          mt={"xl"}
          color="pink"
          variant="outline"
          fullWidth
          disabled={reason === "" || point === 0 || message === ""}
          onClick={() => {
            makeApplication(uid, point, 0, reason, message, note, avatar_url, user_id, username);
            router.push("/applyMade");
          }}
        >
          申請する
        </Button>
      </Container>
    </>
  );
}
