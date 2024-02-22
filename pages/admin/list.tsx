import Header from "@/components/Header";
import { addUserPoints, approveApplication, getApplications, getUserData, rejectApplication } from "@/lib/sp-auth";
import { Card, Center, Text, Container, Avatar, Group, Stack, Button, Anchor } from "@mantine/core";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function ApplyMade() {
  const [applications, setApplications] = useState([] as any);
  const [adminid, setAdminid] = useState("");
  const router = useRouter();
  useEffect(() => {
    getApplications().then((data) => {
      setApplications(data);
    });
    getUserData().then((data) => {
      if (data === 0) {
        window.location.href = "/login";
        return;
      }
      if (data?.identities) {
        setAdminid(data.id || "");
      }
    });
  }, []);
  return (
    <>
    <Header />
    <Center mt={"xl"}>
      <Text fw={"500"} fz={32}>
        ポイント申請一覧
      </Text>
    </Center>

    <Container mt={"xl"} maw={"90%"}>
      {applications.map((app: any) => {
        return (
          <Card shadow="xs" padding="xl" radius="md" mt={"sm"} key={app.applyInfo.id}>
            <Group>
            <Avatar src={app.applyInfo.avatar_url} size={"lg"} />
            <Stack gap={"0"} ml={"sm"}>
            <Text >{app.applyInfo.fullname}</Text>
            <Text color="gray" size="xs">@{app.applyInfo.global_name}</Text>
            <Text >{app.applyInfo.reason === "rating"? "譜面評価" : app.applyInfo.reason === "request"? "製作依頼受注": "譜面布教" }：{app.applyInfo.addedPoints}p</Text>
            <Text color="gray" size="xs" mt={"sm"}>特筆事項：{app.applyInfo.note}</Text>
            <Anchor href={app.applyInfo.messageLink} color="blue" mt={"sm"}>申請メッセージ</Anchor>
            </Stack>
            </Group>
            <Group mt={"sm"}>

            <Button  ml={"auto"} mt="lg" size="sm" w={"30%"} color="red" onClick={() => {rejectApplication(adminid, app.id); router.reload()}}>却下</Button>
            <Button  mt="lg" size="sm" w={"60%"} color="cyan" onClick={() => {addUserPoints(app.applyInfo.addedPoints, app.applyInfo.uid, app.applyInfo.reason); approveApplication(adminid, app.id); router.reload(); }}>承認</Button>
            </Group>
          </Card>
        );
      })}
    </Container>
    </>
  );
}