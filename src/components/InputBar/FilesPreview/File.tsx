import React from "react";
import { Avatar, Button, List, Tooltip } from "antd";
import { FilePdf, FilePdfOne, FileRemovalOne } from "@icon-park/react";
import { formatBytes } from "../../../utils";

const FileItem = ({
  file,
  removeFile,
}: {
  file: File;
  removeFile: (file: File) => void;
}) => {
  return (
    <List.Item>
      <List.Item.Meta
        avatar={
          <Avatar
            shape={"square"}
            className={
              "flex items-center justify-center bg-gray-100 text-gray-700"
            }
          >
            <FilePdfOne size={24} />
          </Avatar>
        }
        title={<a href="https://ant.design">{file.name}</a>}
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

export default FileItem;
