import { Box, Flex, Text } from "@chakra-ui/react";
import { RequestBodyHeadings } from "../constants";

interface IItem {
  isChecked?: boolean;
}
export default function Item({ isChecked = true }: IItem) {
  return (
    <Flex color="black">
      {isChecked && (
        <Box
          boxSize="24px"
          sx={{
            border: "1px solid #e2e8f0",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            lineHeight: "1rem",
          }}
          width="10%"
        >
          <Text
            sx={{
              fontWeight: "500",
              fontSize: "14px",
              lineHeight: "20px",
              color: "#171239",
            }}
            fontSize="sm"
            isTruncated
            fontWeight="medium"
          >
            #
          </Text>
        </Box>
      )}

      {RequestBodyHeadings.map((value) => {
        return (
          <Box
            key={value}
            boxSize="24px"
            sx={{
              border: "1px solid #e2e8f0",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            width="50%"
          >
            <Text
              sx={{
                fontWeight: "500",
                fontSize: "14px",
                lineHeight: "20px",
                color: "#171239",
              }}
              fontSize="sm"
              isTruncated
              fontWeight="medium"
            >
              {value}
            </Text>
          </Box>
        );
      })}
    </Flex>
  );
}
