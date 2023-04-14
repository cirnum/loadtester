import { ChevronDownIcon } from "@chakra-ui/icons";
import { Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import { METHODS_OPTION } from "../../constants";
import { RestMethods } from "../../../store/stress/dashboard/types";

interface IMethod {
  method: RestMethods;
  setMethod: (data: string) => void;
}
type ItemType = (typeof METHODS_OPTION)[0];
export default function Method(props: IMethod) {
  const { method, setMethod } = props;
  return (
    <Menu>
      <MenuButton fontWeight={600} rightIcon={<ChevronDownIcon />}>
        {method}
      </MenuButton>
      <MenuList w="200px">
        {METHODS_OPTION.map((item: ItemType) => {
          return (
            <MenuItem
              key={item.value}
              onClick={() => setMethod(item.value)}
              zIndex="1000"
            >
              {item.value}
            </MenuItem>
          );
        })}
      </MenuList>
    </Menu>
  );
}
