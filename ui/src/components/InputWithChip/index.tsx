import React, { useState } from "react";
import {
  Input,
  Flex,
  Wrap,
  WrapItem,
  Tag,
  TagLabel,
  TagCloseButton,
} from "@chakra-ui/react";

interface TagInputProps {
  defaultTags?: number[];
  onChangeTags: (tags: number[]) => void;
}

export default function TagInput({
  defaultTags = [],
  onChangeTags,
}: TagInputProps) {
  const [inputValue, setInputValue] = useState<number | null>(null);
  const handleTagAdd = () => {
    if (inputValue && !defaultTags.includes(inputValue)) {
      const newTags = [...defaultTags, inputValue];
      onChangeTags(newTags);
      setInputValue(null);
    }
  };
  const handleTagRemove = (tagToRemove: number) => {
    const newTags = defaultTags.filter((tag) => tag !== tagToRemove);
    onChangeTags(newTags);
  };
  return (
    <Flex flexDirection="column">
      <Input
        type="number"
        variant="filled"
        value={inputValue || ""}
        onChange={(e) => setInputValue(Number(e.target.value))}
        placeholder="Status codes e.g. 200 and hit enter."
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleTagAdd();
          }
        }}
        mb={2}
      />
      <Wrap>
        {defaultTags.map((tag) => (
          <WrapItem key={tag}>
            <Tag size="md" variant="subtle" colorScheme="blue">
              <TagLabel>{tag}</TagLabel>
              <TagCloseButton onClick={() => handleTagRemove(tag)} />
            </Tag>
          </WrapItem>
        ))}
      </Wrap>
    </Flex>
  );
}
