import React from "react";
import { Avatar, Image, List } from "antd";
import ImageItem from "./Image";
import FileItem from "./File";
import VoiceItem from "./Voice";

const data = [
  {
    title: "Ant Design Title 1",
  },
  {
    title: "Ant Design Title 2",
  },
  {
    title: "Ant Design Title 3",
  },
  {
    title: "Ant Design Title 4",
  },
];
const FilesPreview = ({
  files,
  removeFile,
}: {
  files: File[];
  removeFile: (file: File) => void;
}) => {
  return (
    <List
      itemLayout="horizontal"
      dataSource={files}
      renderItem={(item, index) => {
        switch (item.type.split("/")[0]) {
          case "image":
            return <ImageItem file={item} removeFile={removeFile} />;
          case "application":
            if (item.type.split("/")[1] === "pdf")
              return <FileItem file={item} removeFile={removeFile} />;
            break;
          case "audio":
            return <VoiceItem file={item} removeFile={removeFile} />;
        }
        return (
          <List.Item>
            <List.Item.Meta
              avatar={
                <Avatar shape={"square"} src={URL.createObjectURL(item)} />
              }
              title={<a href="https://ant.design">{item.name}</a>}
              description={item.type}
            />
          </List.Item>
        );
      }}
    />
  );
};

export default FilesPreview;
