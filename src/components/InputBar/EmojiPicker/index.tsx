import React, { memo } from "react";
import EmojiPicker, { Categories, PickerProps } from "emoji-picker-react";

const CustomEmojiPicker = (props: PickerProps) => {
  return (
    <EmojiPicker
      // style={{ border: "none" }}
      previewConfig={{ showPreview: false }}
      searchDisabled
      skinTonesDisabled
      lazyLoadEmojis
      width={"100%"}
      height={"100%"}
      categories={[
        {
          category: Categories.SUGGESTED,
          name: "استفاده شده",
        },
        {
          category: Categories.SMILEYS_PEOPLE,
          name: "اموجی",
        },
        // {
        //   category: Categories.ANIMALS_NATURE,
        //   name: "طبیعت و حیوانات",
        // },
        // {
        //   category: Categories.FOOD_DRINK,
        //   name: "غذا و نوشیدنی",
        // },
        // {
        //   category: Categories.ACTIVITIES,
        //   name: "فعالیت‌ها",
        // },
        // {
        //   category: Categories.TRAVEL_PLACES,
        //   name: "مکان‌ها",
        // },
        // { category: Categories.OBJECTS, name: "اشیاء" },
        // {
        //   category: Categories.SYMBOLS,
        //   name: "نمادها",
        // },
        // { category: Categories.FLAGS, name: "پرچم‌ها" },
      ]}
      {...props}
    />
  );
};

export default memo(CustomEmojiPicker);
