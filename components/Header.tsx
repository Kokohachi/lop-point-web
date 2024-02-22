import { getUserData, signIn, supabase } from "@/lib/sp-auth";
import { Avatar, Button, Group, Menu, Paper, Stack, Text } from "@mantine/core";
import { Baumans } from "next/font/google";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { IoIosLogOut } from "react-icons/io";
import { LuBadgePlus, LuHistory } from "react-icons/lu";
import { CiCoins1 } from "react-icons/ci";
import { CgDanger } from "react-icons/cg";
import { useRouter } from "next/router";

const font = Baumans({ weight: "400", subsets: ["latin"] });

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState({} as User);
  const router = useRouter();
  const retUserData = async () => {
    const data = await getUserData();
    console.log(data);
    if (data !== 0) {
      setIsLoggedIn(true);
      setUserData(data as User);
    } else {
      setIsLoggedIn(false);
    }
  };
  useEffect(() => {
    retUserData();
  }, []);
  return (
    <Paper
      w={"90%"}
      px={"lg"}
      mt={"sm"}
      style={{ margin: "auto" }}
      shadow="md"
      radius={"lg"}
      withBorder
    >
      <Group>
        <h1 className={font.className} onClick={() => {router.push("/")}}>LoPPS</h1>
        {isLoggedIn && (
          <>
            <Menu trigger="hover" openDelay={100} closeDelay={400}>
              <Menu.Target>
                <Group ml={"auto"} gap={"sm"}>
                <Avatar
                  src={
                    userData.identities
                      ? userData.identities[0]?.identity_data?.avatar_url
                      : ""
                  }
                  size={"lg"}
                  ml={"auto"}
                />
                <Stack gap={"0"}>
                  <Text fw={560} fz={"xl"} mb={"0"}>
                    {userData.identities
                      ? userData.identities[0]?.identity_data?.custom_claims
                          ?.global_name
                      : ""}
                  </Text>
                  <Text fz={"sm"} color="gray" mt={"0"}>
                    @
                    {userData.identities
                      ? userData.identities[0]?.identity_data?.full_name
                      : ""}
                  </Text>
                </Stack>
                </Group>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Label>ポイント申請</Menu.Label>
                <Menu.Item leftSection={<LuBadgePlus /> } onClick={() => {router.push("/apply")}}>申請</Menu.Item>
                <Menu.Item leftSection={<LuHistory />} onClick={() => {router.push("/history")}}>履歴</Menu.Item>
                <Menu.Label>Danger Zone</Menu.Label>
                <Menu.Item
                  leftSection={<IoIosLogOut />}
                  onClick={() => {
                    supabase.auth.signOut();
                    setIsLoggedIn(false);
                  }}
                  color="red"
                >
                  Log Out
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </>
        )}
        {!isLoggedIn && (
          <Button
            variant="outline"
            color="teal"
            ml={"auto"}
            onClick={() => {
              signIn();
            }}
          >
            Log In
          </Button>
        )}
      </Group>
    </Paper>
  );
}
