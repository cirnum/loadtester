import React, { useState } from "react";
import { Box, HStack, Text } from "@chakra-ui/react";
import History from "./history";
import OutlineButton from "../../../components/Button/outline";

const Tabs = ["History", "Collection"];
export default function Sidebar() {
  const [tab, setTab] = useState(0);
  return (
    <Box
      width="20%"
      minWidth="200px"
      maxWidth="300px"
      color="grey"
      border="1px solid #EBEBEB"
    >
      <Box
        display="flex"
        flexDirection="column"
        sx={{ height: "120px" }}
        padding="12px 24px"
        justifyContent="space-around"
      >
        <Text fontWeight="500" fontSize="14px" lineHeight="20px" color="837F9D">
          All Section
        </Text>
        <HStack>
          {Tabs.map((item, index) => {
            return (
              <OutlineButton
                color={index === tab ? "#0066FF" : ""}
                background={index === tab ? "#EDF4FF" : ""}
                borderColor={index === tab ? "#0066FF" : ""}
                onClick={() => setTab(index)}
              >
                <Text fontWeight="600" fontSize="14px">
                  {item}
                </Text>
              </OutlineButton>
            );
          })}
        </HStack>
      </Box>
      <Box
        height="90vh"
        overflow="auto"
        css={{
          "&::-webkit-scrollbar": {
            width: "4px",
          },
          "&::-webkit-scrollbar-track": {
            width: "6px",
          },
          "&::-webkit-scrollbar-thumb": {
            // eslint-disable-next-line quotes
            borderRadius: "24px",
          },
        }}
      >
        <History />
      </Box>
    </Box>
  );
}
