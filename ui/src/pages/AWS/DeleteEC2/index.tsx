import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Spinner,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getCommonLoadingState,
  getWillDeleteEC2,
} from "../../../store/stress/aws/selectors";
import {
  deleteEC2Action,
  selectDeleteEC2,
} from "../../../store/stress/aws/actions";

export function DeleteDialog() {
  const cancelRef = React.useRef<any>();
  const ec2 = useSelector(getWillDeleteEC2);
  const loading = useSelector(getCommonLoadingState);

  const dispatch = useDispatch();
  const onContinue = () => {
    if (ec2) {
      const payload = { instanceIds: [ec2.instanceId] };
      dispatch(deleteEC2Action(payload));
      dispatch(selectDeleteEC2());
    }
  };

  const onClose = () => {
    dispatch(selectDeleteEC2());
  };

  if (!ec2) return null;
  return (
    <AlertDialog
      isOpen={!!ec2}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
    >
      <AlertDialogOverlay>
        <AlertDialogContent bg="white">
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Delete EC2 Instance
          </AlertDialogHeader>

          <AlertDialogBody>
            <Text>
              Are you sure? You want to delete ec2 instance :-
              <p>
                Ip:
                <strong> {ec2?.publicIp}</strong>
              </p>
              <p>
                Instance Id: <strong>{ec2.instanceId}</strong>
              </p>
            </Text>
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="red" onClick={() => onContinue?.()} ml={3}>
              {loading ? <Spinner /> : "Delete"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}
