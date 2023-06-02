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
  deleteServerAction,
  selectDeleteRequest,
} from "../../../store/stress/server/actions";
import { getDeleteRequest } from "../../../store/stress/server/selectors";

export function DeleteDialog() {
  const cancelRef = React.useRef<any>();
  const { selectedRequest, loading } = useSelector(getDeleteRequest);
  const dispatch = useDispatch();
  const onContinue = () => {
    if (selectedRequest) {
      dispatch(deleteServerAction(selectedRequest.id));
    }
  };

  const onClose = () => {
    dispatch(selectDeleteRequest());
  };

  if (!selectedRequest) return null;
  return (
    <AlertDialog
      isOpen={!!selectedRequest}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
    >
      <AlertDialogOverlay>
        <AlertDialogContent bg="white">
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Delete Server
          </AlertDialogHeader>

          <AlertDialogBody>
            <Text>
              Are you sure? You want to delete{" "}
              <strong>{selectedRequest?.alias}.</strong>
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
