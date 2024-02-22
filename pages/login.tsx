import Header from "@/components/Header";
import { signIn } from "@/lib/sp-auth";
import { useEffect } from "react";

export default function ApplyMade() {
  useEffect (() => {
    signIn();
  }, []);
  return (
    <>
    <Header />
    </>
  );
}