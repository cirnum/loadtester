import React, { useState } from 'react'
import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react"

interface ITab {
  tabs: string[];
  tabPanel: React.ReactElement[];
  className?: string;
}
export default function Example({ tabs, tabPanel, className }: ITab) {
     
    const [tabIndex, setTabIndex] = useState(0)
    return (
      <Tabs onChange={(index) => setTabIndex(index)} className={className} mt={5}>
        <TabList>
            {tabs.map((value) => <Tab>{value}</Tab>)}
        </TabList>
        <TabPanels p='2rem'>
            {
                tabPanel.map((value) => <TabPanel>{value}</TabPanel>)
            }
        </TabPanels>
      </Tabs>
    )
  }

