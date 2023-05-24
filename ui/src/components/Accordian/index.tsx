import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
} from "@chakra-ui/react";

import React, { ReactElement } from "react";

interface IAccordianArea {
  children: ReactElement;
  title: string;
  margin?: string | number;
}
export function AccordianArea({ children, title, margin = 0 }: IAccordianArea) {
  return (
    <Accordion margin={margin} allowMultiple allowToggle>
      <AccordionItem>
        <h2>
          <AccordionButton>
            <Box as="span" flex="1" textAlign="left">
              {title}
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </h2>
        <AccordionPanel pb={4}>{children}</AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
}
