import { Textarea, Button, Box, Text } from "@chakra-ui/react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { praseCookieToRequest } from "../../../../store/stress/dashboard/actions";
import { parseCookie } from "../../../../utils/curlToRequest";

interface ImportCurlProps {
  setOpen: (val: boolean) => void;
}
export default function ImportCookies(props: ImportCurlProps) {
  const { setOpen } = props;
  const dispatch = useDispatch();
  const [text, setText] = useState("");
  const [errorText, setError] = useState<any>("");

  const importCookiesCmd = async () => {
    try {
      const payload = parseCookie(text);
      dispatch(praseCookieToRequest(payload));
      setOpen(false);
    } catch (e: any) {
      setError(e);
    }
  };
  return (
    <Box>
      <Textarea
        onChange={(e) => setText(e.target.value)}
        placeholder="paste cookies string here"
        variant="filled"
        fontSize="14px"
        height="400px"
      />
      {errorText && <Text color="Red">{errorText}</Text>}
      <Button
        width="100%"
        my={4}
        colorScheme="primary"
        disabled={!text}
        onClick={importCookiesCmd}
      >
        Save
      </Button>
    </Box>
  );
}
