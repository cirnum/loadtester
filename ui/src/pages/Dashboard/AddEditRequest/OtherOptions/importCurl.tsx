import { Textarea, Button, Box, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { CurlToJSONPayload } from "../../../../store/stress/dashboard/types";
import { curlToRequest } from "../../../../store/stress/dashboard/actions";
import { convertToCurl } from "../../../../utils/curlToRequest";

interface ImportCurlProps {
  setOpen: (val: boolean) => void;
}
export default function ImportCurl(props: ImportCurlProps) {
  const { setOpen } = props;
  const dispatch = useDispatch();
  const [text, setText] = useState("");
  const [errorText, setError] = useState<any>("");

  const importCurlCmd = async () => {
    try {
      const payload = convertToCurl(text);
      dispatch(curlToRequest(payload as CurlToJSONPayload));
      setOpen(false);
    } catch (e: any) {
      setError(e);
    }
  };
  return (
    <Box>
      <Textarea
        onChange={(e) => setText(e.target.value)}
        placeholder="Add your curl here"
        variant="filled"
        fontSize="14px"
        height="400px"
      />
      {errorText && (
        <Text color="Red" p={4}>
          {errorText}
        </Text>
      )}
      <Button
        colorScheme="primary"
        onClick={importCurlCmd}
        disabled={!text}
        width="full"
        my={4}
      >
        Save
      </Button>
    </Box>
  );
}
