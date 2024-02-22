import Header from "@/components/Header";
import {
  rejectApplication,
  addUserPoints,
  approveApplication,
  getUserApplications,
  getUserData,
  getApplications,
} from "@/lib/sp-auth";
import {
  Anchor,
  Avatar,
  Button,
  Card,
  Container,
  Group,
  SimpleGrid,
  Stack,
  Text,
} from "@mantine/core";
import router from "next/router";
import { useEffect, useState } from "react";

export default function History() {
  const [applications, setApplications] = useState([] as any);
  const getUApplications = async (uid: string) => {
    const res = await getUserApplications(uid);
    // filter out the applications that are not made by the user
    console.log(uid, applications);
    const nres = res?.filter((app: any) => app.applyInfo.uid === uid);
    setApplications(res);
  };
  useEffect(() => {
    getUserData().then((data) => {
      if (data === 0) {
        router.push("/login");
        return;
      }
      getUApplications(data?.id as string);
    });
  }, []);
  return (
    <>
      <Header />
      <Container mt={"xl"} maw={"90%"}>
        <Text fw={"500"} fz={32}>
          ポイント申請一覧
        </Text>
        <Text color="gray" size="lg" mt={"sm"}>
          ここには、あなたが申請したポイントの申請履歴が表示されます。
        </Text>
        <Text color="gray" size="lg" mt={"sm"}>
          現在のポイント数：
          {applications
            .filter((app: any) => app.status === "approved")
            .reduce(
              (acc: number, app: any) => acc + app.applyInfo.addedPoints,
              0
            )}p
        </Text>
        {applications.map((app: any) => {
          return (
            <Card
              shadow="xs"
              padding="xl"
              radius="md"
              mt={"sm"}
              key={app.applyInfo.id}
            >
              <Group>
                <Stack gap={"0"} ml={"sm"}>
                  <Text fw={500} fz={20}>
                    {app.applyInfo.reason === "rating"
                      ? "譜面評価"
                      : app.applyInfo.reason === "request"
                      ? "製作依頼受注"
                      : "譜面布教"}
                  </Text>
                  <Text color="gray" size="lg" mt={"sm"}>
                    特筆事項：{app.applyInfo.note}
                  </Text>
                  <Anchor
                    href={app.applyInfo.messageLink}
                    color="blue"
                    mt={"sm"}
                  >
                    申請メッセージ
                  </Anchor>
                </Stack>
                <Stack gap={"0"} ml={"auto"}>
                  <Text
                    fw={600}
                    fz={20}
                    color={
                      app.status === "approved"
                        ? "green"
                        : app.status === "rejected"
                        ? "red"
                        : "gray"
                    }
                  >
                    {app.applyInfo.addedPoints}p
                  </Text>
                  <Text color="gray" size="lg" mt={"sm"}>
                    {app.status === "approved"
                      ? "承認済み"
                      : app.status === "rejected"
                      ? "却下済み"
                      : "未承認"}
                  </Text>
                </Stack>
              </Group>
            </Card>
          );
        })}
      </Container>
    </>
  );
}
