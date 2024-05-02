import { motion } from "framer-motion";
import React from "react";
import Profile from "../../../assets/images/profile.png";

interface Props {
  message: string;
  profilePath?: string;
  name: string;
}

function BubbleTyping(props: Props) {
  return (
    <motion.div
      initial={{
        scale: 0,
      }}
      animate={{
        scale: 1,
      }}
      transition={{ duration: 0.1 }}
      className={`flex w-fit max-w-[90%] items-end gap-1.5 flex-row-reverse self-end origin-bottom-left`}
    >
      <img
        className={"aspect-square rounded-full h-8 w-8"}
        src={props.profilePath || Profile}
      />
      <div className={"w-full self-end"}>
        <div className={"container"} dir={"auto"}>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
      </div>
    </motion.div>
  );
}

export default BubbleTyping;
