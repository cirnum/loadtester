import { useState } from "react";
import { useSelector } from "react-redux";
import { Badge, Box, Card, Text } from "@chakra-ui/react";
import { getRequestResponseData } from "../../../../store/stress/dashboard/selectors";
import Warning from "../../../../components/Error";
import { GetComp, Tablist } from "./childComponent";

export default function RequestResponse() {
  const [tab, setTab] = useState(0);
  const response = useSelector(getRequestResponseData);
  if (!response) {
    return (
      <Warning
        title="Make a request to see the response"
        message="You can hit request to see some response."
        type="info"
      />
    );
  }
  return (
    <>
      <Tablist setTab={setTab} tab={tab}>
        <Box
          display="flex"
          flexDirection="row"
          gap={2}
          ml={5}
          alignItems="center"
        >
          {response && (
            <>
              <Badge variant="outline">
                <Text
                  color={
                    response?.statusCode > 400 ? "tomato.900" : "green.400"
                  }
                >
                  Status Code: {response?.statusCode}
                </Text>
              </Badge>
              <Badge variant="outline">
                <Text color="green">
                  {response?.uncompress ? "Uncompressed" : "Compressed"}
                </Text>
              </Badge>
              <Badge variant="outline" colorScheme="green">
                <Text as="b">Time: {response?.timeTaken} ms</Text>
              </Badge>
            </>
          )}
        </Box>
      </Tablist>
      <Card p={5} bg="gray.200" height="380px">
        <GetComp index={tab} />
      </Card>
    </>
  );
}
