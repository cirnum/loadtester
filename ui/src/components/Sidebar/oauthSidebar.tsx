import { ReactNode, ReactText } from "react";
// eslint-disable-next-line import/no-extraneous-dependencies
import { UserButton } from "@clerk/clerk-react";
import {
  IconButton,
  Box,
  CloseButton,
  Flex,
  HStack,
  Icon,
  useColorModeValue,
  Drawer,
  DrawerContent,
  Text,
  useDisclosure,
  BoxProps,
  FlexProps,
  Spacer,
  Image,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import {
  FiHome,
  FiTrendingUp,
  FiCompass,
  FiStar,
  FiSettings,
  FiMenu,
  FiBell,
} from "react-icons/fi";
import { IconType } from "react-icons";
import LogoImg from "../../assets/brand.svg";

interface LinkItemProps {
  name: string;
  icon?: IconType;
  path: string;
}
const LinkItems: Array<LinkItemProps> = [
  { name: "Home", icon: FiHome, path: "/dashboard" },
  { name: "Task", icon: FiTrendingUp, path: "/task" },
  { name: "Monitoring", icon: FiCompass, path: "/monitor" },
  { name: "Favourites", icon: FiStar, path: "/fav" },
  { name: "Settings", icon: FiSettings, path: "/setting" },
];

const Links: Array<LinkItemProps> = [
  { name: "Requests", path: "/dashboard" },
  // { name: "Performance", path: "performace" },
  { name: "Server", path: "/server" },
  // { name: "Download Client", path: "client" },
];

function NavItem({ icon, children, path, ...rest }: NavItemProps) {
  return (
    <Link to={path || "/"} style={{ textDecoration: "none" }}>
      <Flex
        align="center"
        p="2"
        mx="2"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: "primary.400",
          color: "white",
        }}
        fontWeight="600"
        fontSize="14px"
        lineHeight="20px"
        color="#171239"
        {...rest}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="12"
            _groupHover={{
              color: "white",
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Link>
  );
}

// function NavLink({ children }: { children: ReactNode }) {
//   return (
//     <Link
//       px={2}
//       py={1}
//       rounded="md"
//       _hover={{
//         textDecoration: "none",
//         bg: useColorModeValue("gray.200", "gray.700"),
//       }}
//       href="/cat"
//     >
//       {children}
//     </Link>
//   );
// }

function MobileNav({ onOpen, ...rest }: MobileProps) {
  return (
    <Flex
      position="relative"
      ml={{ base: 0 }}
      px={{ base: 3, md: 3 }}
      height="60px"
      alignItems="center"
      bg={useColorModeValue("white", "gray.900")}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue("gray.200", "gray.700")}
      justifyContent={{ base: "space-between", md: "flex-start" }}
      as="header"
      backdropFilter="saturate(180%) blur(5px)"
      w="100%"
      zIndex={999}
      shadow="s1"
      {...rest}
    >
      <Flex alignItems="center" width="260px" justifyContent="center">
        <Image width="260px" height="40px" src={LogoImg} alt="loadster" />
      </Flex>
      <IconButton
        display={{ base: "flex", md: "none" }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <Text
        display={{ base: "flex", md: "none" }}
        fontSize="1xl"
        fontFamily="monospace"
        fontWeight="bold"
      >
        Logo
      </Text>
      <Spacer />
      {Links.map(({ name, path }) => (
        <NavItem key={path} path={path}>
          {name}
        </NavItem>
      ))}
      <HStack
        as="nav"
        spacing={3}
        display={{ base: "none", md: "flex" }}
        justifyContent={{ base: "space-between", md: "flex-end" }}
      >
        <IconButton
          size="lg"
          variant="ghost"
          aria-label="open menu"
          icon={<FiBell />}
        />
        <Flex alignItems="center" zIndex="dropdown">
          <UserButton />
        </Flex>
      </HStack>
    </Flex>
  );
}

function SidebarContent({ onClose, ...rest }: SidebarProps) {
  return (
    <Box
      transition="3s ease"
      bg={useColorModeValue("white", "gray.900")}
      borderRight="1px"
      borderRightColor={useColorModeValue("gray.200", "gray.700")}
      w={{ base: "full", md: 40 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text fontSize="1xl" fontFamily="monospace" fontWeight="bold">
          Strain-Hub
        </Text>
        <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
      </Flex>
      {LinkItems.map((link) => (
        <NavItem key={link.name} icon={link.icon} path={link.path}>
          {link.name}
        </NavItem>
      ))}
    </Box>
  );
}

export default function SidebarWithHeader({
  children,
}: {
  children: ReactNode;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box minH="100vh" bg={useColorModeValue("gray.100", "gray.900")}>
      {/* <SidebarContent
        onClose={() => onClose}
        display={{ base: "none", md: "block" }}
      /> */}
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          asd
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav onOpen={onOpen} />
      <Box ml={{ base: 0 }}>{children}</Box>
    </Box>
  );
}

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

interface NavItemProps extends FlexProps {
  icon?: IconType;
  path?: string;
  children: ReactText;
}

interface MobileProps extends FlexProps {
  onOpen: () => void;
}
