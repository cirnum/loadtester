/* eslint-disable no-return-assign */
import { useSelector } from "react-redux";
import JSONInput from "react-json-ide";
// eslint-disable-next-line import/no-extraneous-dependencies
import DOMPurify from "dompurify";
import { Box, Card, Flex, Td, Text, Tr } from "@chakra-ui/react";
import { ReactNode } from "react";
import { getRequestResponseData } from "../../../../store/stress/dashboard/selectors";
import Warning from "../../../../components/Error";
import CustomTable from "../../../../components/Table";

function PreviewHtml(props: { html: string }) {
  const { html } = props;
  return (
    <iframe title="Response" srcDoc={DOMPurify.sanitize(html)} height={300} />
  );
}
const parsed = (data: any) => {
  try {
    const parsedBody = JSON.parse(data);
    return parsedBody;
  } catch {
    return null;
  }
};

function RequestBody({
  body = "",
  contentType = [],
}: {
  body?: string;
  contentType?: string[];
}) {
  if (!body)
    return (
      <Warning
        title="No Body found"
        message="Not recieve anything from server."
        type="info"
      />
    );
  if (contentType.includes("application/json")) {
    const parsedBody = parsed(body);
    if (parsedBody) {
      return (
        <JSONInput
          id="a_unique_id"
          placeholder={parsedBody || {}}
          theme="light_mitsuketa_tribute"
          onKeyPressUpdate
          waitAfterKeyPress={1000}
          height="200px"
          width="100%"
          colors={{
            default: "black",
            background: "#edf2f7",
            string: "blue",
            keys: "#800000",
            error: "red",
          }}
          style={{
            body: {
              display: "flex",
              overflowX: "auto",
            },
            outerBox: {
              border: "1px solid #e2e8f0",
            },
            contentBox: {
              flex: "0 0 auto",
            },
          }}
        />
      );
    }
  }
  return (
    <Card p={2}>
      <PreviewHtml html={body} />
    </Card>
  );
}

function HeaderTable({
  headers = {},
}: {
  headers?: Record<string, string[] | string>;
}) {
  const headersKeys = [
    {
      name: "Key",
    },
    {
      name: "Value",
    },
  ];
  const keys = Object.keys(headers || {});
  if (keys.length < 1) {
    return (
      <Warning
        title="No data found."
        message="Seems header or cookies is not attached by server."
        type="info"
      />
    );
  }
  return (
    <CustomTable headers={headersKeys}>
      {keys.map((header) => {
        return (
          <Tr>
            <Td>{header}</Td>
            <Td>{headers[header]}</Td>
          </Tr>
        );
      })}
    </CustomTable>
  );
}

export function GetComp({ index }: { index: number }) {
  const response = useSelector(getRequestResponseData);
  const contentType = response?.headers["Content-Type"];
  switch (index) {
    case 0:
      return <RequestBody body={response?.body} contentType={contentType} />;
    case 1:
      return <HeaderTable headers={response?.headers} />;
    case 2:
      return <HeaderTable headers={response?.cookies} />;
    default:
      return (
        <Warning
          title="No data found"
          message="You can hit request to see some response."
          type="info"
        />
      );
  }
}

function Item({
  item,
  onClick,
  index,
  selectedIndex = 0,
}: {
  item: string;
  selectedIndex: number;
  onClick: (val: number) => void;
  index: number;
}) {
  return (
    <Box
      width={20}
      height={10}
      display="flex"
      justifyContent="center"
      alignItems="center"
      borderRadius={2}
      _hover={{
        bg: "gray.200",
      }}
      bg={selectedIndex === index ? "gray.200" : ""}
      cursor="pointer"
      onClick={() => onClick(index)}
    >
      <Text fontSize="sm">{item}</Text>
    </Box>
  );
}

export function Tablist({
  tab,
  setTab,
  children,
}: {
  tab: number;
  setTab: (val: number) => void;
  children: ReactNode;
}) {
  const List = ["Body", "Headers", "Cookies"];
  return (
    <Box display="flex" flexDirection="row">
      <Flex
        alignItems="center"
        borderRadius={2}
        width="conetent"
        bg="gray.100"
        maxWidth="min-content"
        gap={2}
      >
        {List.map((item, index) => {
          return (
            <Item
              item={item}
              onClick={setTab}
              index={index}
              key={item}
              selectedIndex={tab}
            />
          );
        })}
      </Flex>
      {children}
    </Box>
  );
}
