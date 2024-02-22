import Header from "@/components/Header";
import { Text, Center, Button, Stack } from "@mantine/core";

export default function Home() {
  return (
    <>
      <Header />
      <Center mt={"xl"}>
        <Stack >
        <Text
          mt="xl"
          fz={50}
          fw={500}
          mx={"auto"}
          // animation="fade-up" using style instead of animation
          style={{ textAlign: "center", lineHeight: "1.2", letterSpacing: "0.1em", Animation: "fade-up 1s ease-in-out" }}
        >
          Lord Of Produce <br /> Point System (LoPPS) β
        </Text>
        </Stack>
      </Center>
    </>
  );
}
