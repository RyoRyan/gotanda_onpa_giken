// import Image from "next/image";
import { formatDate } from "@/app/_libs/utils";

type Props = {
  date: string;
};

export default function Date({ date }: Props) {
  return <span className="">{formatDate(date)}</span>;
}
