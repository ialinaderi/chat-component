import React from "react";
import { Avatar, Button, List, Tooltip } from "antd";
import { FileRemoval, FileRemovalOne } from "@icon-park/react";
import { formatBytes } from "../../../utils";

const ImageItem = ({
  file,
  removeFile,
}: {
  file: File;
  removeFile: (file: File) => void;
}) => {
  return (
    <List.Item>
      <List.Item.Meta
        avatar={<Avatar shape={"square"} src={URL.createObjectURL(file)} />}
        title={file.name}
        description={
          <span>
            {formatBytes(file.size)}{" "}
            <b>{file.type.split("/")[1].toUpperCase()}</b>
          </span>
        }
      />
      <button
        className={"text-red-600"}
        onClick={() => {
          removeFile(file);
        }}
      >
        <Tooltip title={"حذف"}>
          <FileRemovalOne />
        </Tooltip>
      </button>
    </List.Item>
  );
};

export default ImageItem;
